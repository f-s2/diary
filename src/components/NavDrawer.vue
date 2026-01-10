<template>
  <view class="drawer-root" v-show="visible">
    <view class="mask" :animation="maskAnim" @click="close" />
    <view class="drawer" :animation="drawerAnim">
      <view class="px-10px">
        <view class=" flex items-center mt-30px mb-16px">
            <image
                class="w-24px h-24px"
                src="@/static/images/top-tip-icon.png"
                mode="widthFix"
            />
            <image
                class="w-68px h-30px"
                src="@/static/images/ai-text.png"
                mode="widthFix"
            />
        </view>
        <view class="flex items-center gap-10px bg-white rounded-8px p-14px mb-12px" v-for="item in list" :key="item.text" @click="jumpPage(item.path)">
            <image
                class="w-14px h-15px"
                :src="item.icon"
                mode="widthFix"
            />
            <view class="flex-1 text-14px font-500">{{ item.text }}</view>
            <image class="w-23px h-23px" src="@/static/images/history/arrow-right.png" mode="widthFix" />
        </view>
      </view>
    </view>
  </view>
</template>


<script setup lang="ts">
import { ref } from 'vue'
import HistoryIcon from '@/static/images/history-icon.png'
import SettingIcon from '@/static/images/setting-icon.png'

const props = defineProps<{
  width?: number
}>()

const list:{
    text: string
    icon: string
    path: string
}[] = [
    {
        text: '历史记录',
        icon: HistoryIcon,
        path: '/pages/history/index'
    },
    {
        text: '设置',
        icon: SettingIcon,
        path: '/pages/settings/index'
    },
]

const visible = ref(false)

const drawerAnim = ref<any>(null)
const maskAnim = ref<any>(null)

const drawerWidth = props.width || 300

const drawer = uni.createAnimation({
  duration: 300,
  timingFunction: 'ease-out',
})

const mask = uni.createAnimation({
  duration: 300,
  timingFunction: 'ease-out',
})

function open() {
  visible.value = true

  drawer.translateX(-drawerWidth).step({ duration: 0 })
  mask.opacity(0).step({ duration: 0 })
  drawerAnim.value = drawer.export()
  maskAnim.value = mask.export()

  setTimeout(() => {
    drawer.translateX(0).step({ duration: 300 })
    mask.opacity(1).step({ duration: 300 })
    drawerAnim.value = drawer.export()
    maskAnim.value = mask.export()
  }, 16)
}

function close() {
  drawer.translateX(-drawerWidth).step({ duration: 300 })
  mask.opacity(0).step({ duration: 300 })
  drawerAnim.value = drawer.export()
  maskAnim.value = mask.export()

  setTimeout(() => {
    visible.value = false
  }, 300)
}

function jumpPage(path: string) {
    close()
    uni.navigateTo({
        url: path
    })
}

defineExpose({
    open
})
</script>

<style scoped>
.drawer-root {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
}

.mask {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  opacity: 0;
}

.drawer {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 300px;
  /* background: #fff; */
  background: linear-gradient(145.16deg, #DEEBFF 0%, #ECF8FF 17.21%, #FFFFFF 55.01%, #FFFFFF 76.35%, #FFFFFF 100%);
  border-radius: 0px 12px 12px 0px;
  transform: translateX(-100%);
  /* box-shadow: 2px 0 10px rgba(0,0,0,.1); */
}
</style>
