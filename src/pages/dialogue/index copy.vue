<script setup lang="ts">
import { onLoad, onReady, onShow } from '@dcloudio/uni-app';
import { computed, nextTick, reactive, ref, watch, type Ref } from 'vue';
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
import { isString } from '@/components/da-tree/utils';
import { HistoryApi } from '@/api/history';

const list = ref<{
    type: MessageTypeEnum
    data: any[]
    voice: any[]
}[]>([])

const InputComRef = ref<InstanceType<typeof InputCom>>()

const needAutoScroll = ref(true)

const isMessageEnd = ref(false)

const { initAudio, pushAudio, isAudioEnd } = useAudioList(isMessageEnd, {})

const isAIEnd = computed(() => isMessageEnd.value && isAudioEnd.value)

function handleSend(options: { type: MessageTypeEnum; content: any }) {
    const lastData = list.value[list.value.length - 1]

    if (!lastData?.voice.length && options.type === MessageTypeEnum.AI) {
        initAudio()
    }

    if (options.type === MessageTypeEnum.AI && options.content === WB_Enum.AI_END) {
        needAutoScroll.value && scrollToBottom()
        InputComRef.value.setAIStatus(true)
        isMessageEnd.value = true
        return
    }

    if (!lastData || lastData.type !== options.type) {

        const target = {
            type: options.type,
            data: [],
            voice: []
        }

        if (typeof options.content === 'string') {
            target.data.push(options.content)
        } else {
            target.voice.push(options.content)
            // #ifdef APP
            pushAudio(options.content)
            // #endif
        }

        list.value.push(target)
        needAutoScroll.value = true
    } else {
        if (typeof options.content === 'string') {
            lastData.data.push(options.content)

        } else {
            lastData.voice.push(options.content)
            // #ifdef APP
            pushAudio(options.content)
            // #endif
        }
    }

    if (options.type === MessageTypeEnum.User) {
        isMessageEnd.value = false
    }

    setTimeout(() => {
        needAutoScroll.value && scrollToBottom()
    }, 500);
}

const titleText = computed(() => list.value.find(v => v.type === MessageTypeEnum.User)?.data?.[0])

const scrollTop = ref<number>()
let lastScrollHeight = 0

function scrollToBottom() {
    scrollTop.value = 9999 + lastScrollHeight
    nextTick(() => {
        uni.createSelectorQuery().select('#list-content').boundingClientRect(data => {
            lastScrollHeight = (<any>data)?.height
        }).exec()
    })
}

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
    const diff = startY.value - moveY;

    needAutoScroll.value = !(diff > CANCEL_DISTANCE);
}

const controlList = ref<{
    icon: string
    onClick?: (data: typeof list.value[0]) => void
}[]>([
    {
        icon: CopyPng,
        onClick(data) {
            const text = data.data.filter(v => ![WB_Enum.AI_END, WB_Enum.AI_START].includes(v)).join(' ')
            uni.setClipboardData({
                data: text
            })
        },
    },
    {
        icon: PraisePng
    },
    {
        icon: TreadPng
    },
    // {
    //     icon: PhonicsPng
    // },
    {
        icon: SharePng
    },
])

function jumpPage(path: string) {
    uni.navigateTo({
        url: path
    })
}

function handleAdd() {
    InputComRef.value?.iniStatus()
    list.value = []
    uni.redirectTo({
        url: '/pages/dialogue/index'
    })
}

function handleStopAI() {
    initAudio()
    InputComRef.value?.handleStopAI()
}

const historyId = ref('')
const testId = ref('')

onLoad(query => {
    historyId.value = query?.id
    testId.value = query?.testId
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
            data: [v.content],
            voice: []
        }))
        
    } catch (error) {
        console.log(error);

    } finally {
        loading.value = false
    }
}

</script>

<template>
    <PageContainer :loading="loading">
        <template #header>
            <view class="f-c-b gap-12px px-14px">
                <view class="text-22px font-700">AI助手</view>
                <view class="flex-1 w-0 text-center line-clamp-1 px-20px">{{ titleText }}</view>
                <view class="f-c-c gap-16px" :class="{'invisible': testId}">
                    <image class="w-18px" src="@/static/images/add.png" mode="widthFix" @click="handleAdd" />
                    <image class="w-20px" src="@/static/images/more.png" mode="widthFix"
                        @click="jumpPage('/pages/history/index')" />
                </view>
            </view>
        </template>
        <scroll-view class="h-full" scroll-y :scrollTop="scrollTop">
            <view id="list-content" @touchstart="onTouchStart" @touchmove="onTouchMove">
                <view class="px-16px" v-if="!historyId">
                    <TopTip class="mt-24px"></TopTip>
                    <QuickEntry v-if="!testId" class="mt-15px" @quick-send="InputComRef?.handleSend"></QuickEntry>
                </view>
                <view class="p-16px space-y-16px">
                    <view class="w-full flex gap-10px" v-for="item, index in list">
                        <view class="flex-shrink-0" :class="{ 'invisible': item.type === MessageTypeEnum.User }">
                            <image class=" w-40px" src="@/static/images/top-tip-icon.png" mode="widthFix" />
                        </view>
                        <view class="p-16px text-14px rounded-b-10px min-w-50px"
                            :class="item.type === MessageTypeEnum.AI ? ' rounded-tr-10px bg-white flex-1' : 'rounded-tl-10px bg-#4F87FE color-white ml-auto'">
                            <view class="flex items-center gap-6px mb-8px"
                                v-if="index === list.length - 1 && !isAIEnd && item.type === MessageTypeEnum.AI && !historyId">
                                <image class=" w-14px" src="@/static/images/ai-loading.png" mode="widthFix" />
                                <text class="text-14px font-500 color-#005CC2 flex-1">分析中...</text>
                                <image class=" w-16px cursor-pointer" src="@/static/images/stop-ai.png" mode="widthFix"
                                    @click="handleStopAI" />
                            </view>
                            <view class=" whitespace-pre-wrap" v-for="text in item.data">{{ text === WB_Enum.AI_START ? '' : text }}</view>

                            <view class="flex gap-10px mt-20px"
                                v-if="(isAIEnd || index < list.length - 1 || historyId) && item.type === MessageTypeEnum.AI">
                                <image v-for="control in controlList" class=" w-22px cursor-pointer" :src="control.icon"
                                    mode="widthFix" @click="() => control?.onClick(item)"></image>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </scroll-view>

        <template #footer>
            <InputCom ref="InputComRef" :test-id="testId" @send-message="handleSend" v-if="!historyId"></InputCom>
        </template>
    </PageContainer>
</template>