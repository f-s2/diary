import { onUnmounted, ref } from "vue";

type WSStatus =
 'idle' | 'connecting' | 'connected' | 'dead'

export enum HeartMessageEnum {
  Ping = "ping",
  Pong = "pong",
}

export function useUniWebSocket(url: string, options:{
    handleMessage: (data:any) => void
}) {
   const socketTask = ref<UniApp.SocketTask | null>(null)
  const status = ref<WSStatus>('idle')

  const HEARTBEAT_INTERVAL = 10000   // ping 间隔
  const HEARTBEAT_TIMEOUT  = 5000    // pong 超时

  let pingTimer: any | null = null
  let pongTimeoutTimer: any | null = null

  const clearTimers = () => {
    if (pingTimer) {
      clearInterval(pingTimer)
      pingTimer = null
    }
    if (pongTimeoutTimer) {
      clearTimeout(pongTimeoutTimer)
      pongTimeoutTimer = null
    }
  }

  const startHeartbeat = () => {
    clearTimers()

    pingTimer = setInterval(() => {
      if (!socketTask.value) return

      // 发 ping（字符串）
      socketTask.value.send({
        data: HeartMessageEnum.Ping,
        fail: () => {
          markDead()
        }
      })

      // 等 pong
      pongTimeoutTimer = setTimeout(() => {
        markDead()
      }, HEARTBEAT_TIMEOUT)

    }, HEARTBEAT_INTERVAL) as unknown as number
  }

  const markDead = () => {
    status.value = 'dead'
    clearTimers()
    close()
  }

  const connect = () => {
    // console.log('is connect:', url);
    
    if (status.value === 'connecting' || status.value === 'connected') return

    status.value = 'connecting'

    socketTask.value = uni.connectSocket({
      url,
      complete: () => {}
    })

    // 收消息（不依赖 onopen）
    socketTask.value.onMessage((res) => {
      const data = res.data

      // console.log(data);
      

      if (data === HeartMessageEnum.Pong) {
        // 收到 pong，连接存活
        if (pongTimeoutTimer) {
          clearTimeout(pongTimeoutTimer)
          pongTimeoutTimer = null
        }
        status.value = 'connected'
        return
      }
        console.log(data);

      // 业务消息在这里处理
      options.handleMessage(data)
    })

    // 发送失败/系统级错误
    uni.onSocketError(() => {
      markDead()
    })

    // 关闭（有些断链场景不会触发，但正常走这里）
    uni.onSocketClose(() => {
      markDead()
    })

    // 直接启动心跳（不等 onopen）
    startHeartbeat()
  }

  const send = (data: string) => {
    if (!socketTask.value) return
    socketTask.value.send({ data })
  }

  const close = () => {
    console.log('is close');
    
    clearTimers()
    if (socketTask.value) {
      socketTask.value?.close({})
      socketTask.value = null
    }
    status.value = 'idle'
  }

  return {
    status,
    connect,
    send,
    close
  }
}
