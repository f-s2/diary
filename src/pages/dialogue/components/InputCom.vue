<script setup lang="ts">
// #ifdef APP
// @ts-ignore
import { FySpeechRecog, FyPermission } from '@/uni_modules/fy-speech-recog';
// #endif

import { getCurrentInstance, onMounted, ref } from 'vue';
import VoicePng from '@/static/images/voice.png';
import KeyboardPng from '@/static/images/keyboard.png';
import VoicingGif from '@/static/images/voicing.gif';
import dayjs, { Dayjs } from 'dayjs';
import { MessageTypeEnum, SpeechRecogConfig, WB_Enum } from '../config';
import useRecord from './useRecord';
import { onShow } from '@dcloudio/uni-app';

import { netConfig } from '@/config/net.config';

// #ifdef H5
const FySpeechRecog = null;
const FyPermission = null;
// #endif


const emit = defineEmits<{
    sendMessage: [{ type: MessageTypeEnum; content: any,timestamp: number }]
}>()

// 是否语音输入
const isVoice = ref(false);

const inputValue = ref('')

const currentMessageType = ref<MessageTypeEnum>(MessageTypeEnum.User)

const startVoiceTime = ref<Dayjs>()

const voiceTimeText = ref('00:00')
let voiceInterval: any | null = null;


const recordDomRef = ref<HTMLElement>()

const { isCancel, isRecording, isRouse, isAIMessageEnd, initRecord, resetRecord } = useRecord(recordDomRef, {
    onStart() {
        startRecord()
    },
    onReset() {
        stopRecord()
    },
})

function changeVoice() {

    isVoice.value = !isVoice.value;
    if (isVoice.value) {
        initRecord()
    }
}

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

function stopRecord() {
    isRouse.value = false;
    handleStop()
    if (voiceInterval) {
        clearInterval(voiceInterval);
        voiceInterval = null;
    }
    if (!isCancel.value) {
        console.log('发送语音');
        sockets.send({
            data: WB_Enum.AUDIO_END,
        })
    } else {
        sockets.send({
            data: WB_Enum.AUDIO_CANCEL,
        })
    }
}

function handleSend() {
    if (inputValue.value && isAIMessageEnd.value) {
        sockets.send({
            data: inputValue.value
        })

        emit('sendMessage', {
            type: MessageTypeEnum.User,
            content: inputValue.value,
            timestamp: Date.now()
        })

        inputValue.value = ''

        currentMessageType.value = MessageTypeEnum.AI
        isAIMessageEnd.value = false
    }
}

let recogHandle = null;

onMounted(() => {

    const permis = new FyPermission();
    permis.requestPermission({
        success: function () {
            recogHandle = new FySpeechRecog(SpeechRecogConfig);
            console.log('成功注册');

            handleStartWU()
        }
    })
})


// 开始唤醒
function handleStartWU() {
    recogHandle && recogHandle.startWakeUp({
        WP_WORDS_FILE: plus.io.convertLocalFileSystemURL("/static/WakeUp.bin")
    }, {
        success: function (res) {
            console.log('开始唤醒');
            if(!isAIMessageEnd.value) {
                return
            }

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

// 开启语音识别
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

            sockets.send({
                data: audioData
            })

            // 处理音频数据，audioData是PCM格式，16bits 16000采样率
            // 可以保存到文件或进行其他处理
        }
    })
}
// 停止语音识别
function handleStop() {
    recogHandle && recogHandle.stopRecognizer();
}

const sockets = uni.connectSocket({
    url: `${import.meta.env.VITE_APP_BASE_URL}${netConfig.baseName}/ws/message`,
    success() {
        console.log('WebSocket连接成功');
    },
    fail(err) {
        console.log('WebSocket连接失败:', err);
    }
});

sockets.onOpen = function (event) {
    console.log('WebSocket已连接');
};

uni.onSocketMessage(function (event) {
    console.log('收到服务器内容：' + event.data);
    emit('sendMessage', {
        type: currentMessageType.value,
        content: event.data,
        timestamp: Date.now()
    })

    if(currentMessageType.value === MessageTypeEnum.AI && event.data === WB_Enum.AI_END) {
        currentMessageType.value = MessageTypeEnum.User
        return isAIMessageEnd.value = true
    }

    if(currentMessageType.value === MessageTypeEnum.User) {
        currentMessageType.value = MessageTypeEnum.AI
    }
});

</script>

<template>
    <view>
        <view class="p-16px bg-white bg-opacity-80 f-c-c gap-10px">
            <image class="w-36px" :src="!isVoice ? VoicePng : KeyboardPng" mode="widthFix" @click="changeVoice" />
            <view class="flex-1 w-0 p-1px rounded-20px overflow-hidden h-38px"
                style="background: linear-gradient(126.88deg, #009AFF 0%, #EB5CFF 34.73%, #00FFE3 68.48%, #1100FF 100%);">
                <view class="bg-white w-full h-full rounded-20px">
                    <input v-model="inputValue" class="w-full h-full px-12px outline-none text-14px" type="text"
                        placeholder="请输入执行指令" v-if="!isVoice" />
                    <view class="f-c-c h-full text-14px font-500">按住 说话</view>
                </view>
            </view>
            <image class="w-36px" src="@/static/images/send.png" mode="widthFix" @click="handleSend" />
        </view>
        <view class="fixed z-20 top-0 left-0 w-full h-full bg-#000000 bg-opacity-45"
            :class="{ 'opacity-0 pointer-events-none': !isRecording }" v-if="isVoice">
            <view class=" absolute left-0 right-0 bottom-120px">
                <view class="relative mb-10px px-16px py-10px bg-#4F87FE rounded-12px mx-auto w-240px min-h-94px f-c-c">
                    <!-- <view class="text-16px font-600 color-white">{{  }}</view> -->
                     <image
                        class="w-90px"
                        :src="VoicingGif"
                        mode="widthFix"
                     />
                    <view class=" absolute left-1/2 translate-x--1/2 -bottom-8px w-20px h-20px bg-#4F87FE"
                        style="clip-path: polygon(50% 100%, 0 50%, 100% 50%);"></view>
                </view>
                <view class="text-center mt-7px mb-20px color-white">{{ voiceTimeText }}</view>
                <view class="text-center color-white mb-12px" v-if="!isRouse">{{ isCancel ? '松开取消发送' : '上滑取消发送' }}</view>
            </view>
            <view class="absolute left-0 right-0 bottom-0 w-full select-none"
                :class="{ '!w-68vw h-30px bottom-30px mx-auto pointer-events-auto': !isRecording }" ref="recordDomRef">
                <image class="w-full" src="@/static/images/microphone-bg.png" mode="widthFix" />
                <view class=" absolute left-1/2 top-24px -translate-x-1/2 z-10 f-c-c flex-col">
                    <image class="w-20px" src="@/static/images/microphone.png" mode="widthFix" />
                    <text class="mt-6px text-14px color-#4F87FE">松开发送</text>
                </view>
            </view>
        </view>
    </view>
</template>