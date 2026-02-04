<script setup lang="ts">
import { computed, getCurrentInstance, onMounted, onUnmounted, ref, watch, watchEffect } from "vue";
import VoicePng from "@/static/images/voice.png";
import KeyboardPng from "@/static/images/keyboard.png";
import VoicingGif from "@/static/images/voicing.gif";
import dayjs, { Dayjs } from "dayjs";
import { MessageTypeEnum, SpeechRecogConfig, WB_Enum } from "../config";
import useRecord from "./useRecord";
import { onHide, onShow } from "@dcloudio/uni-app";

import { netConfig } from "@/config/net.config";
import { isString } from "@/components/da-tree/utils";
import { useUniWebSocket } from "./useSocket";
import { storeToRefs } from "pinia";
import { useGlobalStore } from "@/store/global";
import IconWrapper from "./IconWrapper.vue";
import VoiceIcon from '@/static/images/dialogue/voice-icon.png'
import VoiceActive from '@/static/images/dialogue/voice-active.png'
import StopIcon from '@/static/images/dialogue/stop-icon.png'
import ConfirmIcon from '@/static/images/dialogue/confirm-icon.png'
import useBaiduVoice from "./useBaiduVoice";
import AiIcon from './AiIcon.vue';
import type { ResponseData } from "../useMessage";

const props = defineProps<{
    testId?: string;
    isRecordMode?: boolean
    recording?: boolean
}>();

const emit = defineEmits<{
    sendMessage: [{ type: MessageTypeEnum; content: ResponseData; timestamp: number }];
    stopAi: []
    'update:recording': [boolean]
    resetVoice: []
}>();

// 是否语音输入
const isVoice = ref(false);
/** 是否处于手动停止状态，用于防止在停止后依然接收到服务器后续信息 */
const isStoped = ref(false);

const inputValue = ref("");

const currentMessageType = ref<MessageTypeEnum>(MessageTypeEnum.User);

const isRecording = ref(false);
const isAIMessageEnd = ref(true);

watchEffect(() => {
    emit('update:recording', isRecording.value)
})

/** 修改当前输入模式 语音/键盘 */
function changeVoice() {
    isVoice.value = !isVoice.value;
}

//jumpCheck 主要是为了兼容 hello 语音与之前的 icon 展示逻辑
/** 开始录音的入口，用于处理部分数据初始化操作 */
function startRecord(jumpCheck=false) {
    if ((isRecording.value && !jumpCheck) || !isAIMessageEnd.value) return;

    isVoice.value = true
    isStoped.value = false;
    isRecording.value = true;
    inputValue.value = ''
    handleStart();
}
/** 语音转换超时的定时器 */
let transformVoiceTimer: any = null;

/** 结束录音的入口 */
function stopRecord() {
    // isRouse.value = false;
    // isRecording.value = false;

    if (isShowTextMode.value) return

    handleStop();
    // if (!isCancel.value) {
    console.log("发送语音");
    sockets.send(WB_Enum.AUDIO_END);
    currentMessageType.value = MessageTypeEnum.User;
    console.log('切换状态');
    transformVoiceTimer = setTimeout(() => {
        isRecording.value = false
        uni.showToast({
            title: '语音识别超时',
            icon: 'error'
        })
    }, 10000);
    // } else {
    //     sockets.send(WB_Enum.AUDIO_CANCEL)
    // }
}

/** 发送文本数据 */
function handleSend(text?: string) {
    if (isRecording.value) return;

    const allowList = ['未能识别到有效语音内容', '语音识别异常']
    if(allowList.includes(inputValue.value)) {
        inputValue.value = ''
        return
    }

    if (text) {
        inputValue.value = text;
    }

    if (inputValue.value && isAIMessageEnd.value) {
        isStoped.value = false;

        sockets.send(inputValue.value);

        emit("sendMessage", {
            type: MessageTypeEnum.User,
            content: {
                content: inputValue.value
            },
            timestamp: Date.now(),
        });

        inputValue.value = "";

        currentMessageType.value = MessageTypeEnum.AI;
        isAIMessageEnd.value = false;

        // 目的是为了解决后端响应时间过长，导致前端无法展示 ai 对话框的问题
        emit("sendMessage", {
            type: MessageTypeEnum.AI,
            content: {
                msgType: WB_Enum.AI_START
            },
            timestamp: Date.now() + 1,
        });
    }
}

/**
 * 仅发送数据，不做其它任何处理
 * @param data
 */
function sendData(data: string) {
    sockets.send(data);
}

const { initBaiduVoice, handleStart, handleStartWU, handleStop, handleStopWU } = useBaiduVoice({
    sendData: (data) => sockets.send(data),
    startWU() {
        if (!isAIMessageEnd.value || isRecording.value) {
            return;
        }

        isStoped.value = false;
        isVoice.value = true;
        isRecording.value = true
    },
    voiceOver() {
        stopRecord();
    },
    helloEnd() {
        startRecord(true);
    },
})


onMounted(() => {
    // #ifdef APP
        initBaiduVoice()
    // #endif
});

/** 手动停止 AI 正在进行的流程 */
function handleStopAI(notSend = false) {
    console.log("手动停止 ai");
    if (!notSend) {
        sockets.send(WB_Enum.PAUSE_RESPONSE);
    } else {
        currentMessageType.value = MessageTypeEnum.User;
    }

    console.log('is record', isRecording.value, currentMessageType.value);
    
}

const { deviceId } = uni.getSystemInfoSync();

const { commonSetting } = storeToRefs(useGlobalStore());

const sockets = useUniWebSocket(
    `${commonSetting.value.baseUrl}${import.meta.env.VITE_APP_PREFIX}/ws/message?initiator=${deviceId}&testDialogueId=${props?.testId ?? ""}`,
    {
        handleMessage: handleMessage,
    },
);

onShow(() => {    
    sockets.connect();
});

const showCountdown = ref(false);

const CountdownTime = 10;

const CountdownDuration = ref(CountdownTime);

let timer: any = null;
const lastAIEndInfo = ref()

let timer2: any = null;

const isShowConfirm = ref(false)

watch(showCountdown, (newVal) => {
    if (newVal) {
        CountdownDuration.value = CountdownTime;
        timer2 = setInterval(() => {
            CountdownDuration.value -= 1;
            if (CountdownDuration.value <= 0) {
                clearInterval(timer2)
            }
        }, 1000);
    } else {
        clearInterval(timer2)
    }
})

onUnmounted(() => {
    clearInterval(timer2)
})


function handleAIEnd() {
    clearTimeout(timer)
    emit("sendMessage", lastAIEndInfo.value);
    currentMessageType.value = MessageTypeEnum.User;
    showCountdown.value = false
    lastAIEndInfo.value = undefined
    isShowConfirm.value = false
    emit('resetVoice')
}

const isAiEnd = (data: any) => {
    if(data instanceof ArrayBuffer) {
        return false
    }

    const target = JSON.parse(data) as ResponseData

    return target?.msgType === WB_Enum.AI_END
}

/** 是否正在展示语音转换后的文本 */
const isShowTextMode = computed(() => isRecording.value && !!inputValue.value)

/** 处理接收到的服务器数据，可能也包含小部分自定义数据 */
function handleMessage(data: any) {
    const event = { data };

    // console.log(`收到服务器内容：` + event.data);

    // 当前为 user ，说明是语音转文字的响应
    if (currentMessageType.value === MessageTypeEnum.User) {

        inputValue.value = event.data;
        setTimeout(() => {
            clearTimeout(transformVoiceTimer)
            isRecording.value = false
            handleSend()
        }, 2000);
    } else {

        if (
            currentMessageType.value === MessageTypeEnum.AI && isAiEnd(event.data)
        ) {
            lastAIEndInfo.value = {
                type: currentMessageType.value,
                content: event.data,
                timestamp: Date.now(),
            }

            if (props.isRecordMode) {
                isShowConfirm.value = true
                emit('sendMessage', {
                    type: MessageTypeEnum.AI,
                    content: {
                        msgType: 'NODE_END'
                    },
                    timestamp: Date.now(),
                })
                timer = setTimeout(() => {
                    handleAIEnd()
                }, CountdownTime * 1000)
                showCountdown.value = true
            } else {
                handleAIEnd()
            }
        } else {
            emit("sendMessage", {
                type: currentMessageType.value,
                content: event.data,
                timestamp: Date.now(),
            });
        }
    }
}

function setAIStatus(isEnd: boolean) {
    isAIMessageEnd.value = isEnd;
}

/** 初始化所有状态，用户点击新增对话时调用 */
function iniStatus() {
    isVoice.value = false;
    isRecording.value = false;
    // isRouse.value = false;
    inputValue.value = "";

    sockets.send(WB_Enum.NEW_CONVERSATION);
}
 
onHide(() => {    
    sockets.close();
})

// onUnmounted(() => {
//     sockets.close();
// });

defineExpose({
    handleStopAI,
    handleSend,
    iniStatus,
    sendData,
    setAIStatus,
});
</script>

<template>
    <view>
        <view v-if="!isRecordMode">
            <view class="p-16px bg-white bg-opacity-80 f-c-c gap-10px">
                <!-- #ifdef APP -->
                <image class="w-36px" :src="!isVoice ? VoicePng : KeyboardPng" mode="widthFix" @click="changeVoice" />
                <!-- #endif -->
                <view class="flex-1 w-0 p-1px rounded-20px overflow-hidden h-38px" style="
          background: linear-gradient(
            126.88deg,
            #009aff 0%,
            #eb5cff 34.73%,
            #00ffe3 68.48%,
            #1100ff 100%
          );
        ">
                    <view class="w-full h-full rounded-20px" :class="isRecording ? 'gradient-bg' : 'bg-white'">
                        <input v-model="inputValue" class="w-full h-full px-12px outline-none text-14px" type="text"
                            confirm-type="search" @keydown.enter="handleSend()" placeholder="请输入执行指令" v-if="!isVoice" />
                        <view class="f-c-c h-full text-14px font-500" @click="startRecord">点击 说话</view>
                    </view>
                </view>
                <image class="w-36px cursor-pointer" src="@/static/images/send.png" mode="widthFix"
                    @click="handleSend()" />
            </view>
            <view class="fixed left-0 right-0 bottom-54px" v-if="isRecording">
                <view v-if="inputValue"
                    class="w-90% rounded-24px text-16px font-500 color-white text-center p-12px mx-auto gradient-bg-2">
                    {{ inputValue
                    }}</view>
                <!-- <image class=" mx-auto block" src="@/static/images/dialogue/loading-ai.gif"
                    mode="widthFix" /> -->
                <AiIcon class="w-120px h-120px"></AiIcon>
            </view>
        </view>
        <view class=" f-c-c pb-20px" v-else>
            <template v-if="currentMessageType === MessageTypeEnum.AI">
                <view>
                    <view class=" color-primary text-center mb-18px" v-if="showCountdown">{{ CountdownDuration }}s后返回
                    </view>
                    <icon-wrapper :url="ConfirmIcon" v-if="isShowConfirm" @click="handleAIEnd"></icon-wrapper>
                    <icon-wrapper :url="StopIcon" v-else @click="$emit('stopAi')"></icon-wrapper>
                </view>
            </template>
            <template v-else>
                <icon-wrapper :url="VoiceIcon" v-if="!isRecording" @click="startRecord"></icon-wrapper>
                <view class=" relative w-full f-c-c" v-else>
                    <image class="w-94px"
                        src="@/static/images/dialogue/user-speek.gif" mode="widthFix" />
                    <icon-wrapper class="" :url="VoiceActive" @click="stopRecord"></icon-wrapper>
                    <image class="w-94px rotate-180"
                        src="@/static/images/dialogue/user-speek.gif" mode="widthFix" />
                </view>
            </template>
            <view class="fixed left-0 right-0 bottom-140px" v-if="isShowTextMode">
                <view
                    class="w-90% rounded-24px text-16px font-500 color-white text-center p-12px mx-auto gradient-bg-2">
                    {{
                        inputValue
                    }}</view>
            </view>
        </view>
    </view>
</template>

<style scoped>
.gradient-bg {
    background: linear-gradient(226.92deg,
            #deebff 0%,
            #d6f0ff 23.41%,
            #e3e5ff 55.25%,
            #f3f8ff 75.21%,
            #e9feff 100%);
    animation: gradientMove 6s linear infinite;
}

.gradient-bg-2 {
    background: linear-gradient(238.38deg,
            rgba(152, 170, 252, 1) 0%,
            rgba(108, 181, 255, 1) 46.69%,
            rgba(60, 125, 254, 1) 100%);
}

@keyframes gradientMove {
    0% {
        background-position: 0% 50%;
    }

    100% {
        background-position: 100% 50%;
    }
}
</style>
