<script setup lang="ts">
import { onReady } from '@dcloudio/uni-app';
import { computed, nextTick, reactive, ref } from 'vue';
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

const list = ref<{
    type: MessageTypeEnum
    data: any[]
    voice: any[]
}[]>([])

const needAutoScroll = ref(true)

const isEnd = ref(false)

function handleSend(options: { type: MessageTypeEnum; content: any }) {
    if (options.type === MessageTypeEnum.AI && options.content === WB_Enum.AI_END) {
        needAutoScroll.value && scrollToBottom()
        return isEnd.value = true
    }

    const lastData = list.value[list.value.length - 1]
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
        }

        list.value.push(target)
        needAutoScroll.value = true
    } else {
        lastData.data.push(options.content)
    }

    if (options.type === MessageTypeEnum.User) {
        isEnd.value = false
    }

    setTimeout(() => {
        needAutoScroll.value && scrollToBottom()
    }, 600);
}

const titleText = computed(() => list.value.find(v => v.type === MessageTypeEnum.User)?.data?.[0])

const scrollTop = ref<number>()
let lastScrollHeight = 0

function onScroll(e) {
    const { scrollTop, scrollHeight, clientHeight } = e.detail
    lastScrollHeight = scrollHeight
}

function scrollToBottom() {
    scrollTop.value = 9999 + lastScrollHeight
}

const startY = ref(0)
const CANCEL_DISTANCE = 100; // 上滑取消的距离阈值




function onTouchStart(e: TouchEvent) {
    e.preventDefault();
    const touch = e.touches[0];
    startY.value = touch.clientY;
}

function onTouchMove(e: TouchEvent) {
    e.preventDefault();

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
        icon: CopyPng
    },
    {
        icon: PraisePng
    },
    {
        icon: TreadPng
    },
    {
        icon: PhonicsPng
    },
    {
        icon: SharePng
    },
])

</script>

<template>
    <PageContainer>
        <template #header>
            <view class="f-c-b gap-12px px-14px">
                <view class="text-22px font-700">AI助手</view>
                <view class="flex-1 w-0 text-center line-clamp-1">{{ titleText }}</view>
                <view class="f-c-c gap-16px">
                    <image class="w-18px" src="@/static/images/add.png" mode="widthFix" />
                    <image class="w-20px" src="@/static/images/more.png" mode="widthFix" />
                </view>
            </view>
        </template>
        <scroll-view class="h-full" scroll-y :scrollTop="scrollTop" scroll-with-animation @scroll="onScroll">
            <view ref="listContentRef" @touchstart="onTouchStart" @touchmove="onTouchMove">
                <view class="px-16px">
                    <TopTip class="mt-24px"></TopTip>
                    <QuickEntry class="mt-15px"></QuickEntry>
                </view>
                <view class="p-16px space-y-16px">
                    <view class="w-full flex gap-10px" v-for="item, index in list">
                        <view class="flex-shrink-0" :class="{ 'invisible': item.type === MessageTypeEnum.User }">
                            <image class=" w-40px" src="@/static/images/top-tip-icon.png" mode="widthFix" />
                        </view>
                        <view class="p-16px text-14px rounded-b-10px min-w-50px"
                            :class="item.type === MessageTypeEnum.AI ? ' rounded-tr-10px bg-white flex-1' : 'rounded-tl-10px bg-#4F87FE color-white ml-auto'">
                            <view class="flex items-center gap-6px mb-8px" v-if="index === list.length - 1 && !isEnd && item.type === MessageTypeEnum.AI">
                                <image class=" w-14px" src="@/static/images/ai-loading.png" mode="widthFix" />
                                <text class="text-14px font-500 color-#005CC2">分析中...</text>
                            </view>
                            <view v-for="text in item.data">{{ text }}</view>

                            <view class="flex gap-10px mt-20px" v-if="(isEnd || index < list.length - 1) && item.type === MessageTypeEnum.AI">
                                <image v-for="control in controlList" class=" w-22px" :src="control.icon" mode="widthFix"></image>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </scroll-view>

        <template #footer>
            <InputCom @send-message="handleSend"></InputCom>
        </template>
    </PageContainer>
</template>