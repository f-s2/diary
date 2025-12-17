<script setup lang="ts">
import { ref } from 'vue';
import VoicePng from '@/static/images/voice.png';
import KeyboardPng from '@/static/images/keyboard.png';
import dayjs, { Dayjs } from 'dayjs';

// 是否语音输入
const isVoice = ref(false);

const inputValue = ref('')

const startVoiceTime = ref<Dayjs>()

const voiceTimeText = ref('00:00')
let voiceInterval: any | null = null;

function startRecord() {
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

function stopRecord() {
    if (voiceInterval) {
        clearInterval(voiceInterval);
        voiceInterval = null;
    }
    if (!isCancel.value) {
        console.log('发送语音');

    }
}
// 是否正在录音
const isRecording = ref(false);
const isCancel = ref(false);

const startY = ref(0);
const CANCEL_DISTANCE = 60; // 上滑取消的距离阈值

function onTouchStart(e: TouchEvent) {
    const touch = e.touches[0]
    startY.value = touch.clientY

    isRecording.value = true
    isCancel.value = false

    startRecord()
}

function onTouchMove(e: TouchEvent) {
    if (!isRecording.value) return

    const touch = e.touches[0]
    const moveY = touch.clientY

    // 上滑距离
    const diff = startY.value - moveY

    isCancel.value = diff > CANCEL_DISTANCE
}

function onTouchEnd() {
    if (!isRecording.value) return

    stopRecord()

    reset()
}

function onTouchCancel() {
    stopRecord()
    reset()
}

function reset() {
    isRecording.value = false
    isCancel.value = false
}


</script>
<template>
    <view>
        <view class="p-16px bg-white bg-opacity-80 f-c-c gap-10px">
            <image class="w-36px" :src="isVoice ? VoicePng : KeyboardPng" mode="widthFix" @click="isVoice = !isVoice" />
            <view class="flex-1 w-0 p-1px rounded-20px overflow-hidden h-38px"
                style="background: linear-gradient(126.88deg, #009AFF 0%, #EB5CFF 34.73%, #00FFE3 68.48%, #1100FF 100%);">
                <view class="bg-white w-full h-full rounded-20px">
                    <input v-model="inputValue" class="w-full h-full px-12px outline-none text-14px" type="text"
                        placeholder="请输入执行指令" v-if="!isVoice" />
                    <view class="f-c-c h-full text-14px font-500" @touchstart="isRecording = true">按住 说话</view>
                </view>
            </view>
            <image class="w-36px" src="@/static/images/send.png" mode="widthFix" />
        </view>
        <view class="fixed z-20 top-0 left-0 w-full h-full bg-#000000 bg-opacity-45"
            :class="{ 'opacity-0 pointer-events-none': !isRecording }" v-if="isVoice">
            <view class=" absolute left-0 right-0 bottom-120px">
                <view class="relative mb-10px px-16px py-10px bg-#4F87FE rounded-12px mx-auto w-240px min-h-94px">
                    <view class="text-16px font-600 color-white">{{ inputValue }}</view>
                    <view class=" absolute left-1/2 translate-x--1/2 -bottom-8px w-20px h-20px bg-#4F87FE"
                        style="clip-path: polygon(50% 100%, 0 50%, 100% 50%);"></view>
                </view>
                <view class="text-center mt-7px mb-20px color-white">{{ voiceTimeText }}</view>
                <view class="text-center color-white mb-12px">{{ isCancel ? '松开取消发送' : '上滑取消发送' }}</view>
            </view>
            <view class="absolute left-0 right-0 bottom-0 w-full select-none"
                :class="{ '!w-68vw h-30px bottom-30px mx-auto pointer-events-auto': !isRecording }"
                @touchstart.prevent="onTouchStart" @touchmove.prevent="onTouchMove" @touchend.prevent="onTouchEnd"
                @touchcancel="onTouchCancel">
                <image class="w-full" src="@/static/images/microphone-bg.png" mode="widthFix" />
                <view class=" absolute left-1/2 top-24px -translate-x-1/2 z-10 f-c-c flex-col">
                    <image class="w-20px" src="@/static/images/microphone.png" mode="widthFix" />
                    <text class="mt-6px text-14px color-#4F87FE">松开发送</text>
                </view>
            </view>
        </view>
    </view>
</template>