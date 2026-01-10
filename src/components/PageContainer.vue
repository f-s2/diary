<script setup lang="ts">
import { ref } from 'vue';
import { onLoad, onShow } from '@dcloudio/uni-app';

defineProps<{
    loading?: boolean
    hiddenHeader?: boolean
    title?: string
    headerColor?: string
}>()

const contentRef = ref<HTMLElement>()

const contentHeight = ref(0)


onLoad(() => {
    const { safeArea } = uni.getSystemInfoSync()
    contentHeight.value = safeArea.height
})


function handleBack() {
    uni.navigateBack()
}
</script>

<template>
    <div class=" w-full overflow-hidden h-100vh flex flex-col" ref="contentRef"
        >
        <view class="w-full" style="height: var(--status-bar-height);" :style="{backgroundColor: headerColor || 'white'}"></view>
        <slot name="header">
             <view class="relative bg-white h-60px f-c-c" v-if="title">
                <image class="absolute left-0 top-0 bottom-0 my-auto w-44px"
                    src="@/static/images/history/arrow-left.png" mode="widthFix" @click="handleBack" />
                <text class=" text-center text-20px font-500">{{ title }}</text>
            </view>
        </slot>
        <div class=" h-0 pt-5 flex-1 overflow-auto">
            <uv-loading-icon mode="circle" text="加载中..." v-if="loading"></uv-loading-icon>
            <slot></slot>
        </div>
        <slot name="footer"></slot>
    </div>
</template>