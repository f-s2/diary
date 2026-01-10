<script setup lang="ts">
// #ifdef APP
// @ts-ignore
import { FySpeechRecog, FyPermission } from '@/uni_modules/fy-speech-recog';
// #endif

import { getCurrentInstance, onMounted, onUnmounted, ref, watch } from 'vue';
import VoicePng from '@/static/images/voice.png';
import KeyboardPng from '@/static/images/keyboard.png';
import VoicingGif from '@/static/images/voicing.gif';
import dayjs, { Dayjs } from 'dayjs';
import { MessageTypeEnum, SpeechRecogConfig, WB_Enum } from '../config';
import useRecord from './useRecord';
import { onShow } from '@dcloudio/uni-app';

import { netConfig } from '@/config/net.config';
import { isString } from '@/components/da-tree/utils';
import { useUniWebSocket } from './useSocket';
import { storeToRefs } from 'pinia';
import { useGlobalStore } from '@/store/global';

// #ifdef H5
const FySpeechRecog = null;
const FyPermission = null;
// #endif


const props = defineProps<{
    testId?: string
}>()

const emit = defineEmits<{
    sendMessage: [{ type: MessageTypeEnum; content: any, timestamp: number }]
}>()

// 是否语音输入
const isVoice = ref(false);
/** 是否处于手动停止状态，用于防止在停止后依然接收到服务器后续信息 */
const isStoped = ref(false)

const inputValue = ref('')

const currentMessageType = ref<MessageTypeEnum>(MessageTypeEnum.User)

const startVoiceTime = ref<Dayjs>()

const voiceTimeText = ref('00:00')
let voiceInterval: any | null = null;


const recordDomRef = ref<HTMLElement>()

const { isCancel, isRecording, isRouse, isAIMessageEnd, initRecord, resetRecord } = useRecord(recordDomRef, {
    onStart() {
        isStoped.value = false
        startRecord()
    },
    onReset() {
        stopRecord()
    },
})

/** 修改当前输入模式 语音/键盘 */
function changeVoice() {

    isVoice.value = !isVoice.value;
    if (isVoice.value) {
        initRecord()
    }
}

/** 开始录音的入口，用于处理部分数据初始化操作 */
function startRecord() {
    handleStart()
    startVoiceTime.value = dayjs();
    voiceTimeText.value = '00:00';
    voiceInterval = setInterval(() => {
        if (startVoiceTime.value) {
            const diff = dayjs().diff(startVoiceTime.value, 'second');
            const minutes = Math.floor(diff / 60).toString().padStart(2, '0');
            const seconds = (diff % 60).toString().padStart(2, '0');
            voiceTimeText.value = `${minutes}:${seconds}`;
        }
    }, 1000);
}

/** 结束录音的入口 */
function stopRecord() {
    isRouse.value = false;
    handleStop()
    if (voiceInterval) {
        clearInterval(voiceInterval);
        voiceInterval = null;
    }
    if (!isCancel.value) {
        console.log('发送语音');
        sockets.send(WB_Enum.AUDIO_END)
        currentMessageType.value = MessageTypeEnum.User
    } else {
        sockets.send(WB_Enum.AUDIO_CANCEL)
    }
}

/** 发送文本数据 */
function handleSend(text?: string) {
    if (text) {
        inputValue.value = text
    }

    if (inputValue.value && isAIMessageEnd.value) {
        isStoped.value = false

        sockets.send(inputValue.value)

        emit('sendMessage', {
            type: MessageTypeEnum.User,
            content: inputValue.value,
            timestamp: Date.now()
        })

        inputValue.value = ''

        currentMessageType.value = MessageTypeEnum.AI
        isAIMessageEnd.value = false

        // 目的是为了解决后端响应时间过长，导致前端无法展示 ai 对话框的问题
        emit('sendMessage', {
            type: MessageTypeEnum.AI,
            content: WB_Enum.AI_START,
            timestamp: Date.now() + 1
        })
    }
}

/**
 * 仅发送数据，不做其它任何处理
 * @param data 
 */
function sendData(data: string) {
    sockets.send(data)
}

let recogHandle = null;

onMounted(() => {

    // #ifdef APP
    const permis = new FyPermission();
    permis.requestPermission({
        success: function () {
            recogHandle = new FySpeechRecog(SpeechRecogConfig);
            console.log('成功注册');

            handleStartWU()
        }
    })
    // #endif
})


// 开始唤醒功能
function handleStartWU() {
    recogHandle && recogHandle.startWakeUp({
        WP_WORDS_FILE: plus.io.convertLocalFileSystemURL("/static/WakeUp.bin")
    }, {
        success: function (res) {
            console.log('开始唤醒');
            if (!isAIMessageEnd.value) {
                return
            }

            isStoped.value = false
            isVoice.value = true
            isRecording.value = true;
            isRouse.value = true;
            startRecord()
        }
    });
}
// 停止语音唤醒
function handleStopWU() {
    recogHandle && recogHandle.stopWakeUp();
}

// 开启语音识别功能
function handleStart() {
    recogHandle && recogHandle.startRecognizer({ AUDIO_MILLS: 0, ACCEPT_AUDIO_DATA: true, VAD_ENDPOINT_TIMEOUT: 1000, DECODER: 2 }, {
        listener: function (res) {
            try {
                const recogRes = JSON.parse(res);
                console.log(recogRes);
                if (recogRes.resultWold && [6, 11061, 7].includes(recogRes.status)) { // 临时识别、最终识别、长语音识别
                    console.log(recogRes.resultWold);
                }

                if (recogRes.status === 2) {
                    resetRecord()
                }
            } catch (err) {
                console.log(err);
            }
        },
        audioCallback: (audioData, offset, length) => {
            console.log('收到音频数据，长度:', length);
            // console.log(audioData);

            sockets.send(audioData)

            // 处理音频数据，audioData是PCM格式，16bits 16000采样率
            // 可以保存到文件或进行其他处理
        }
    })
}
/** 停止语音识别功能 */
function handleStop() {
    recogHandle && recogHandle.stopRecognizer();
}
/** 手动停止 AI 正在进行的流程 */
function handleStopAI(notSend = false) {
    console.log('手动停止 ai');
    if (!notSend) {
        sockets.send(WB_Enum.PAUSE_RESPONSE)
    } else {
        currentMessageType.value = MessageTypeEnum.User
    }
}

const { deviceId } = uni.getSystemInfoSync()

const {commonSetting} = storeToRefs(useGlobalStore())


const sockets = useUniWebSocket(`${commonSetting.value.baseUrl}${import.meta.env.VITE_APP_PREFIX}/ws/message?initiator=${deviceId}&testDialogueId=${props?.testId ?? ''}`,
    {
        handleMessage: handleMessage
    }
)

onShow(() => {
    sockets.connect()
})

// const sockets = uni.connectSocket({
//     url: `${import.meta.env.VITE_APP_BASE_URL}${import.meta.env.VITE_APP_PREFIX}/ws/message?initiator=${deviceId}&testDialogueId=${props?.testId ?? ''}`,
//     success() {
//         console.log('WebSocket成功执行');
//     },
//     fail(err) {
//         console.log('WebSocket连接失败:', err);
//     }
// });

// onUnmounted(() => {
//     uni.closeSocket()
// })

/** 处理接收到的服务器数据，可能也包含小部分自定义数据 */
function handleMessage(data: any) {

    const event = { data }

    // console.log(`收到服务器内容：` + event.data);
    emit('sendMessage', {
        type: currentMessageType.value,
        content: event.data,
        timestamp: Date.now()
    })

    if (currentMessageType.value === MessageTypeEnum.AI && isString(event.data) && event.data.startsWith(WB_Enum.AI_END)) {
        currentMessageType.value = MessageTypeEnum.User
        return
    }

    // 当前为 user ，说明是语音转文字的响应
    if (currentMessageType.value === MessageTypeEnum.User) {
        currentMessageType.value = MessageTypeEnum.AI
        // 目的是为了解决后端响应时间过长，导致前端无法展示 ai 对话框的问题
        emit('sendMessage', {
            type: MessageTypeEnum.AI,
            content: WB_Enum.AI_START,
            timestamp: Date.now() + 1
        })
    }
}

function setAIStatus(isEnd: boolean) {
    isAIMessageEnd.value = isEnd
}

/** 初始化所有状态，用户点击新增对话时调用 */
function iniStatus() {
    isVoice.value = false
    isRecording.value = false;
    isRouse.value = false;
    inputValue.value = ''

    sockets.send(WB_Enum.NEW_CONVERSATION)
}

onUnmounted(() => {
    sockets.close()
})


defineExpose({
    handleStopAI,
    handleSend,
    iniStatus,
    sendData,
    setAIStatus
})
</script>

<template>
    <view>
        <view class="p-16px bg-white bg-opacity-80 f-c-c gap-10px">
            <!-- #ifdef APP -->
            <image class="w-36px" :src="!isVoice ? VoicePng : KeyboardPng" mode="widthFix" @click="changeVoice" />
            <!-- #endif -->
            <view class="flex-1 w-0 p-1px rounded-20px overflow-hidden h-38px"
                style="background: linear-gradient(126.88deg, #009AFF 0%, #EB5CFF 34.73%, #00FFE3 68.48%, #1100FF 100%);">
                <view class="bg-white w-full h-full rounded-20px">
                    <input v-model="inputValue" class="w-full h-full px-12px outline-none text-14px" type="text"
                        confirm-type="search" @keydown.enter="handleSend()" placeholder="请输入执行指令" v-if="!isVoice" />
                    <view class="f-c-c h-full text-14px font-500">按住 说话</view>
                </view>
            </view>
            <image class="w-36px cursor-pointer" src="@/static/images/send.png" mode="widthFix" @click="handleSend()" />
        </view>
        <view class="fixed z-20 top-0 left-0 w-full h-full bg-#000000 bg-opacity-45"
            :class="{ 'opacity-0 pointer-events-none': !isRecording }" v-if="isVoice">
            <view class=" absolute left-0 right-0 bottom-120px">
                <view class="relative mb-10px px-16px py-10px bg-#4F87FE rounded-12px mx-auto w-240px min-h-94px f-c-c">
                    <!-- <view class="text-16px font-600 color-white">{{  }}</view> -->
                    <image class="w-90px" :src="VoicingGif" mode="widthFix" />
                    <view class=" absolute left-1/2 translate-x--1/2 -bottom-8px w-20px h-20px bg-#4F87FE"
                        style="clip-path: polygon(50% 100%, 0 50%, 100% 50%);"></view>
                </view>
                <view class="text-center mt-7px mb-20px color-white">{{ voiceTimeText }}</view>
                <view class="text-center color-white mb-12px" v-show="!isRouse">{{ isCancel ? '松开取消发送' : '上滑取消发送' }}
                </view>
            </view>
            <view class="absolute left-0 right-0 bottom-0 w-full select-none"
                :class="{ '!w-68vw h-30px bottom-30px mx-auto pointer-events-auto': !isRecording }" ref="recordDomRef">
                <image class="w-full" src="@/static/images/microphone-bg.png" mode="widthFix" />
                <view class=" absolute left-1/2 top-24px -translate-x-1/2 z-10 f-c-c flex-col">
                    <image class="w-20px" src="@/static/images/microphone.png" mode="widthFix" />
                    <text class="mt-6px text-14px color-#4F87FE" v-show="!isRouse">松开发送</text>
                </view>
            </view>
        </view>
    </view>
</template>