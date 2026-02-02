<script setup lang="ts">
import { onLoad, onReady, onShow } from '@dcloudio/uni-app';
import { computed, nextTick, onMounted, reactive, ref, watch, watchEffect, type Ref } from 'vue';
import PageContainer from '@/components/PageContainer.vue';
import TopTip from './components/TopTip.vue';
import QuickEntry from './components/QuickEntry.vue';
import InputCom from './components/InputCom.vue';
import { MessageTypeEnum, WB_Enum } from './config';
import CopyPng from '@/static/images/control/copy.png'
import PhonicsPng from '@/static/images/control/phonics.png'
import PraisePng from '@/static/images/control/praise.png'
import SharePng from '@/static/images/control/share.png'
import TreadPng from '@/static/images/control/tread.png'
import useAudioList from './useAudio';
import { HistoryApi } from '@/api/history';
import useMessage, { UserReactionEnum, type ConfirmNode, type ItemType, type ResponseData } from './useMessage';
import { isString } from '@/components/da-tree/utils';
import NavDrawer from '@/components/NavDrawer.vue';
import LoadingIcon from '@/components/LoadingIcon.vue';
import LoadingPng from '@/static/images/dialogue/loading-icon.png'
import LoadingPng2 from '@/static/images/dialogue/loading-icon2.webp'
import StopIcon from '@/static/images/dialogue/stop-icon.png'
import ConfirmIcon from '@/static/images/dialogue/confirm-icon.png'
import AiIcon from './components/AiIcon.vue';
import useBaiduVoice from './components/useBaiduVoice';
import { cloneFnJSON } from '@vueuse/core';

let disableTouch = true

// #ifdef APP
disableTouch = false
// #endif


const MessageClass = ['color-#666666 text-12px font-500', 'color-#333 text-12px font-500', 'color-#222222 text-14px font-500 mt-6px']
const MessageClass2 = ['color-#666666 text-14px font-500', 'color-#333 text-14px font-500', 'color-#222222 text-16px font-500 mt-14px']

const InputComRef = ref()
const NavDrawerRef = ref<InstanceType<typeof NavDrawer>>()
const AiIconRef = ref<InstanceType<typeof AiIcon>>()

const inputRefs = []

InputComRef.value = new Proxy({}, {
    get(_, key) {
        return (...args) => {
            inputRefs.forEach(ins => {
                ins?.[key]?.(...args)
            })
        }
    }
})

const registerInput = (ins) => {
    if (ins && !inputRefs.includes(ins)) {
        inputRefs.push(ins)
    }
}


const needAutoScroll = ref(true)

const { initStatus, pushData, currentAIMessage, isMessageEnd, isAudioEnd, stopAI, list, playNext } = useMessage({
    pushAfter() {
        needAutoScroll.value && scrollToBottom()
    },
    AIStart() {
        needAutoScroll.value = true
        needAutoScroll.value && scrollToBottom()
    },
    AIEnd() {
        needAutoScroll.value && scrollToBottom()
        InputComRef.value.setAIStatus(true)
    },

})
function handleSend(options: { type: MessageTypeEnum; content: any }) {
    pushData(options)
}

const titleText = computed(() => list.value.find(v => v.type === MessageTypeEnum.User)?.data?.[0]?.content)

let timer = null

const scrollIntoView = ref('')

function scrollToBottom() {
    // console.log('触发滚动');

    if (timer) return

    scrollIntoView.value = ''

    timer = setTimeout(() => {
        scrollIntoView.value = 'chat-bottom-2'
        nextTick(() => {
            timer = null
        })
    }, 300);
}

let timer2 = null

const scrollIntoView2 = ref('')

function scrollToBottom2() {
    console.log('触发滚动');

    if (timer2) return

    scrollIntoView2.value = ''

    timer2 = setTimeout(() => {
        scrollIntoView2.value = 'chat-bottom-3'
        nextTick(() => {
            timer2 = null
        })
    }, 300);
}

watch(currentAIMessage, () => {
    scrollToBottom2()
}, {
    deep: true
})

const startY = ref(0)
const CANCEL_DISTANCE = 100; // 上滑取消的距离阈值

function onTouchStart(e: TouchEvent) {
    const touch = e.touches[0];
    startY.value = touch.clientY;
}

function onTouchMove(e: TouchEvent) {
    const touch = e.touches[0];
    const moveY = touch.clientY;

    // 上滑距离
    const diff = moveY - startY.value;

    if (diff > CANCEL_DISTANCE) {
        needAutoScroll.value = false
    }
}

const controlList = computed<{
    icon: string
    inactiveClass?: string
    isInactive?: (item: ItemType) => boolean
    onClick?: (data: typeof list.value[0]) => void
}[]>(() => [
    {
        icon: CopyPng,
        onClick(data) {
            const text = data.data.filter(v => ![WB_Enum.AI_END, WB_Enum.AI_START].some(_ => v.msgType === _)).map(v => v.content).join(' ')
            uni.setClipboardData({
                data: text
            })
        },
    },
    {
        icon: PraisePng,
        isInactive(item) {
            return item.userReaction !== UserReactionEnum.Like
        },
        inactiveClass: 'opacity-60',
        onClick(data) {
            if (historyId.value) return
            handleReaction(data, UserReactionEnum.Like)
        },
    },
    {
        icon: TreadPng,
        isInactive(item) {
            return item.userReaction !== UserReactionEnum.Dislike
        },
        inactiveClass: 'opacity-60',
        onClick(data) {
            if (historyId.value) return
            handleReaction(data, UserReactionEnum.Dislike)
        },
    },
    // {
    //     icon: PhonicsPng
    // },
    // {
    //     icon: SharePng
    // },
])

function jumpPage(path: string) {
    uni.navigateTo({
        url: path
    })
}

function handleAdd() {
    InputComRef.value?.iniStatus()
    list.value = []

    if (historyId.value) {
        uni.redirectTo({
            url: '/pages/dialogue/index'
        })
    }
}

function handleStopAI() {
    InputComRef.value?.handleStopAI(isMessageEnd.value)
    stopAI()
}

const historyId = ref('')
const testId = ref('')

onLoad(query => {
    historyId.value = query?.id
    testId.value = query?.testId
    initStatus()
})

onShow(() => {
    getData()
})

const loading = ref(false)

async function getData() {
    try {
        if (!historyId.value) return
        loading.value = true

        const { data } = await HistoryApi.detail(historyId.value)

        const _data = data as History.MessageItem[]

        list.value = _data.map(v => ({
            type: v.role as any,
            data: v.content?.split('\\n').map(v => ({ content: v })),
            id: v.id,
            userReaction: v.likeStatus
        }))

    } catch (error) {
        console.log(error);

    } finally {
        loading.value = false
    }
}

function handleConfirm(item: ConfirmNode, data: 0 | 1) {
    item.isEnd = true
    const target = {
        msgType: 'CONFIRM_REPLY',
        commandId: item.content,
        replyContent: data
    }
    InputComRef.value?.sendData(JSON.stringify(target))
    playNext(true)
}
function handleReaction(item: ItemType, reaction: ItemType['userReaction']) {
    try {
        if (item.userReaction === reaction) {
            item.userReaction = UserReactionEnum.None
        } else if (item.userReaction === UserReactionEnum.None || !item.userReaction) {
            item.userReaction = reaction
        }

        HistoryApi.reaction({
            id: item.id,
            likeStatus: item.userReaction
        })
    } catch (error) {
        console.log(error);

    }

}

const isRecording = ref(false)

const current = ref(0)

function changeCurrent(index: number) {
    current.value = index
    if (index === 1) {
        AiIconRef.value?.showAnime()
    }
}

function resetVoice() {
    if (current.value === 1) {
        isAudioEnd.value = true
    }
}

function transformerMessage(_data: ConfirmNode[]) {
    const messageList: (ConfirmNode & { nodeList?: { text: string, isNode: boolean }[] })[] = []

    _data.forEach(v => {
        if (!v.commandName) {
            messageList.push(v)
        } else {
            const targetItem = messageList.find(_ => _.commandName === v.commandName)

            const targetNode = {
                text: v.content,
                isNode: v.msgType === 'NODE'
            }

            if (targetItem) {
                targetItem.nodeList.push(targetNode)
            } else {
                messageList.push({
                    ...v,
                    nodeList: [targetNode]
                })
            }
        }
    })

    return messageList
}

const isNodeLast = (index: number, arr: { isNode: boolean }[]) => {
    const textIndex = arr.findIndex(v => !v.isNode)

    return ~textIndex ? index === textIndex - 1 : index === arr.length - 1
}

onShow(() => {
    useBaiduVoice().initHello()
})
</script>

<template>
    <PageContainer :loading="loading" header-color="transparent">
        <template #header v-if="current === 0">
            <view class="f-c-b gap-12px px-14px">
                <view class="text-22px font-700">AI助手</view>
                <view class="flex-1 w-0 text-center line-clamp-1 px-20px">{{ titleText }}</view>
                <view class="f-c-c gap-16px h-20px" :class="{ 'invisible': testId }">
                    <image class="w-18px" src="@/static/images/add.png" mode="widthFix" @click="handleAdd"
                        v-if="list.length" />
                    <image class="w-20px" src="@/static/images/more.png" mode="widthFix"
                        @click="NavDrawerRef?.open()" />
                </view>
            </view>
        </template>
        <swiper class="w-100% h-100%" :disable-touch="disableTouch || !isMessageEnd || isRecording" :current="current"
            @change="e => changeCurrent(e.detail.current)">
            <swiper-item>
                <scroll-view class="h-full" id="scroll-view" scroll-y :scroll-into-view="scrollIntoView"
                    :scroll-with-animation="true">
                    <view id="list-content" class="pb-12px" @touchstart="onTouchStart" @touchmove="onTouchMove">
                        <view class="px-16px" v-if="!historyId">
                            <TopTip class="mt-24px"></TopTip>
                            <QuickEntry v-if="!testId" class="mt-15px" @quick-send="InputComRef?.handleSend">
                            </QuickEntry>
                        </view>
                        <view class="p-16px space-y-16px">
                            <view class="w-full flex gap-10px" v-for="item, index in list">
                                <view class="flex-shrink-0 h-40px"
                                    :class="{ 'invisible': item.type === MessageTypeEnum.User }">
                                    <image class=" w-40px h-40px" src="@/static/images/top-tip-icon.png"
                                        mode="widthFix" />
                                </view>
                                <view class="px-16px py-12px text-14px min-w-50px overflow-hidden" :class="item.type === MessageTypeEnum.AI ?
                                    ' gradient-border flex-1' :
                                    'rounded-l-15px rounded-tr-0px rounded-br-20px message-user color-white ml-auto'">
                                    <view class="flex items-center gap-6px mb-8px"
                                        v-if="index === list.length - 1 && !isMessageEnd && item.type === MessageTypeEnum.AI && !historyId">
                                        <LoadingIcon :url="LoadingPng"></LoadingIcon>
                                        <text
                                            class="text-14px font-500 color-#005CC2 flex-1 gradient-text">分析中...</text>
                                        <view class="h-16px">
                                            <image class=" w-16px cursor-pointer" src="@/static/images/stop-ai.png"
                                                mode="widthFix" @click="handleStopAI" />
                                        </view>
                                    </view>
                                    <view class=" whitespace-pre-wrap" :class="MessageClass[text.styleType]"
                                        v-for="text in transformerMessage(item.data)">
                                        <text v-if="!text.msgType && !text.commandName">{{ text.msgType ===
                                            WB_Enum.AI_START ? '' : text.content }}</text>
                                        <view v-if="text.commandName">
                                            <view class="text-12px font-500 text-#333 mb-3px">{{ text.commandName }}
                                            </view>
                                            <view v-for="node, nodeIndex in text.nodeList" class="flex pl-2px">
                                                <view class="mr-8px w-2px h-auto relative bg-#318DFF" :class="{
                                                    'rounded-t-2px': nodeIndex === 0,
                                                    'rounded-b-2px': isNodeLast(nodeIndex, text.nodeList),
                                                }" v-if="node.isNode">
                                                    <!-- #ifdef APP -->
                                                    <view
                                                        class=" absolute h-full left-1/2 top-0px pt-5px translate-x--1/2">
                                                        <LoadingIcon class="w-6px h-6px" :url="LoadingPng"
                                                            v-if="nodeIndex === text.nodeList.length - 1 && !isMessageEnd"></LoadingIcon>
                                                        <image class="w-6px h-6px" v-else
                                                            src="@/static/images/dialogue/success.png"
                                                            mode="widthFix" />
                                                    </view>
                                                    <!-- #endif -->
                                                    <!-- #ifdef H5 -->
                                                    <view class=" absolute h-full left-1/2 top--3px translate-x--1/2">
                                                        <LoadingIcon class="w-6px h-6px" :url="LoadingPng"
                                                            v-if="nodeIndex === text.nodeList.length - 1 && !isMessageEnd"></LoadingIcon>
                                                        <image class="w-6px h-6px" v-else
                                                            src="@/static/images/dialogue/success.png"
                                                            mode="widthFix" />
                                                    </view>
                                                    <!-- #endif -->
                                                </view>
                                                <view class="pb-4px"
                                                    :class="node.isNode ? ' text-12px font-500 color-#333' : 'text-14px font-500 color-#222 ml--3px'">
                                                    {{ node.text }}</view>
                                            </view>
                                        </view>
                                        <view v-if="!text.isEnd && text.msgType === 'CONFIRM' && !isMessageEnd">
                                            <view class="color-#222 mt-6px">是否确认执行？</view>
                                            <view class="f-c-c gap-24px my-8px">
                                                <uv-button size="mini" @click="handleConfirm(text, 0)">取消</uv-button>
                                                <uv-button color="var(--primary-color)" size="mini"
                                                    @click="handleConfirm(text, 1)">确认</uv-button>
                                            </view>
                                        </view>

                                    </view>

                                    <view class="flex gap-10px mt-20px"
                                        v-if="(isMessageEnd || index < list.length - 1 || historyId) && item.type === MessageTypeEnum.AI">
                                        <view v-for="control in controlList">
                                            <image class=" w-22px cursor-pointer"
                                                :class="{ [control.inactiveClass]: control.isInactive?.(item) }"
                                                :src="control.icon" mode="widthFix"
                                                @click="() => control?.onClick(item)">
                                            </image>
                                        </view>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </view>
                    <view id="chat-bottom-1" style="height:1px;"></view>
                    <view id="chat-bottom-2" style="height:1px;"></view>
                </scroll-view>
            </swiper-item>
            <swiper-item>
                <view class="h-full flex flex-col">
                    <AiIcon ref="AiIconRef" class="flex-shrink-0 w-280px h-280px mx-auto block"></AiIcon>
                    <image v-if="!isAudioEnd" class="w-136px h-136px flex-shrink-0 -mb-50px -mt-70px mx-auto block"
                        src="@/static/images/dialogue/ai-speek.gif" mode="widthFix" />
                    <view class="gradient-text flex-shrink-0 text-center" v-if="!currentAIMessage">请用“晓言、晓言”唤醒我</view>
                    <scroll-view class="h-25vh" id="scroll-view2" scroll-y :scroll-into-view="scrollIntoView2"
                        :scroll-with-animation="true">
                        <!-- <view v-for="i in 1000">{{i}}</view> -->
                        <view class="px-40px py-12px text-14px min-w-50px overflow-auto" v-if="currentAIMessage">
                            <view class="flex items-center gap-6px mb-8px">
                                <LoadingIcon :url="LoadingPng2"></LoadingIcon>
                                <text class="text-14px font-500 color-#005CC2 flex-1 gradient-text">分析中...</text>
                            </view>
                            <view class=" whitespace-pre-wrap" :class="MessageClass2[text.styleType]"
                                v-for="text in transformerMessage(currentAIMessage.data)">
                                <text v-if="!text.msgType && !text.commandName">{{ text.msgType ===
                                    WB_Enum.AI_START ? '' : text.content }}</text>
                                <view v-if="text.commandName">
                                    <view class="text-12px font-500 text-#333 mb-3px">{{ text.commandName }}</view>
                                    <view v-for="node, nodeIndex in text.nodeList" class="flex pl-2px">
                                        <view class="mr-8px w-2px h-auto relative bg-#318DFF" :class="{
                                            'rounded-t-2px': nodeIndex === 0,
                                            'rounded-b-2px': isNodeLast(nodeIndex, text.nodeList),
                                        }" v-if="node.isNode">
                                            <!-- #ifdef APP -->
                                            <view class=" absolute h-full left-1/2 top-0px pt-5px translate-x--1/2">
                                                <LoadingIcon class="w-6px h-6px" :url="LoadingPng"
                                                    v-if="nodeIndex === text.nodeList.length - 1 && !isMessageEnd"></LoadingIcon>
                                                <image class="w-6px h-6px" v-else
                                                    src="@/static/images/dialogue/success.png" mode="widthFix" />
                                            </view>
                                            <!-- #endif -->
                                            <!-- #ifdef H5 -->
                                            <view class=" absolute h-full left-1/2 top--3px translate-x--1/2">
                                                <LoadingIcon class="w-6px h-6px" :url="LoadingPng"
                                                    v-if="nodeIndex === text.nodeList.length - 1 && !isMessageEnd"></LoadingIcon>
                                                <image class="w-6px h-6px" v-else
                                                    src="@/static/images/dialogue/success.png" mode="widthFix" />
                                            </view>
                                            <!-- #endif -->
                                        </view>
                                        <view class="pb-4px"
                                            :class="node.isNode ? ' text-12px font-500 color-#333' : 'text-14px font-500 color-#222 ml--3px'">
                                            {{ node.text }}</view>
                                    </view>
                                </view>
                                <view v-if="!text.isEnd && text.msgType === 'CONFIRM' && !isMessageEnd">
                                    <view class="color-#222 mt-6px">是否确认执行？</view>
                                    <view class="f-c-c gap-40px my-8px">
                                        <image class="w-40px h-40px" :src="StopIcon" mode="widthFix"
                                            @click="handleConfirm(text, 0)" />
                                        <image class="w-40px h-40px" :src="ConfirmIcon" mode="widthFix"
                                            @click="handleConfirm(text, 1)" />
                                    </view>
                                </view>

                            </view>
                        </view>
                        <view id="chat-bottom-3" style="height:1px;"></view>
                    </scroll-view>
                </view>
            </swiper-item>
        </swiper>
        <template #footer>
            <InputCom :ref="registerInput" v-model:recording="isRecording" :is-record-mode="current === 1"
                :test-id="testId" @stop-ai="handleStopAI" @send-message="handleSend" @reset-voice="resetVoice"
                v-if="!historyId">
            </InputCom>
        </template>
        <NavDrawer ref="NavDrawerRef"></NavDrawer>
    </PageContainer>
</template>

<style scoped>
.message-user {
    background: linear-gradient(238.38deg, rgba(152, 170, 252, 1) 0%, rgba(108, 181, 255, 1) 46.69%, rgba(60, 125, 254, 1) 100%);
}

.message-ai {}

.gradient-border {
    position: relative;
    /* width: 300px;
        height: 150px; */

    border-radius: 0px 15px 15px 15px;
    background: linear-gradient(154.42deg, #F0FDFF 0%, #EAF7FF 33.23%, #F0F1FF 56.1%, #F2F7FF 82.49%, #E9FEFF 100%);
}

.gradient-border::before {
    content: "";
    position: absolute;
    inset: 0;
    padding: 1px;

    border-radius: 0px 15px 15px 15px;
    background: linear-gradient(133.62deg,
            #009AFF 0%,
            #EB5CFF 34.73%,
            #00FFE3 68.48%,
            #1100FF 100%);

    -webkit-mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;

    pointer-events: none;
}


.gradient-text {
    background: linear-gradient(109.72deg,
            #009AFF 0%,
            #EB5CFF 39.94%,
            #00FFE3 68.48%,
            #1100FF 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
}
</style>