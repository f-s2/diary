<script setup lang="ts">
import { onLoad, onReady, onShow } from '@dcloudio/uni-app';
import { computed, nextTick, onMounted, reactive, ref, watch, type Ref } from 'vue';
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
import useMessage, { UserReactionEnum, type ConfirmNode, type ItemType } from './useMessage';
import { isString } from '@/components/da-tree/utils';

const InputComRef = ref<InstanceType<typeof InputCom>>()

const needAutoScroll = ref(true)

const { initStatus, pushData, isMessageEnd, stopAI, list, playNext } = useMessage({
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

const titleText = computed(() => list.value.find(v => v.type === MessageTypeEnum.User)?.data?.[0])

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

onMounted(() => {

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
            const text = data.data.filter(v => isString(v) && ![WB_Enum.AI_END, WB_Enum.AI_START].some(_ => v.startsWith(_))).join(' ')
            uni.setClipboardData({
                data: text
            })
        },
    },
    {
        icon: PraisePng,
        isInactive(item) {
            return item.userReaction === UserReactionEnum.Dislike
        },
        inactiveClass: 'opacity-60',
        onClick(data) {
            if(historyId.value) return
            handleReaction(data, UserReactionEnum.Like)
        },
    },
    {
        icon: TreadPng,
        isInactive(item) {
            return item.userReaction === UserReactionEnum.Like
        },
        inactiveClass: 'opacity-60',
        onClick(data) {
            if(historyId.value) return
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
            data: [v.content],
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
    const target: ConfirmNode = {
        msgType: 'CONFIRM_REPLY',
        commandId: item.commandId,
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


</script>

<template>
    <PageContainer :loading="loading">
        <template #header>
            <view class="f-c-b gap-12px px-14px">
                <view class="text-22px font-700">AI助手</view>
                <view class="flex-1 w-0 text-center line-clamp-1 px-20px">{{ titleText }}</view>
                <view class="f-c-c gap-16px h-20px" :class="{ 'invisible': testId }">
                    <image class="w-18px" src="@/static/images/add.png" mode="widthFix" @click="handleAdd"
                        v-if="list.length" />
                    <image class="w-20px" src="@/static/images/more.png" mode="widthFix"
                        @click="jumpPage('/pages/history/index')" />
                </view>
            </view>
        </template>
        <scroll-view class="h-full" id="scroll-view" scroll-y :scroll-into-view="scrollIntoView"
            :scroll-with-animation="true">
            <view id="list-content" class="pb-12px" @touchstart="onTouchStart" @touchmove="onTouchMove">
                <view class="px-16px" v-if="!historyId">
                    <TopTip class="mt-24px"></TopTip>
                    <QuickEntry v-if="!testId" class="mt-15px" @quick-send="InputComRef?.handleSend"></QuickEntry>
                </view>
                <view class="p-16px space-y-16px">
                    <view class="w-full flex gap-10px" v-for="item, index in list">
                        <view class="flex-shrink-0 h-40px" :class="{ 'invisible': item.type === MessageTypeEnum.User }">
                            <image class=" w-40px h-40px" src="@/static/images/top-tip-icon.png" mode="widthFix" />
                        </view>
                        <view class="p-16px text-14px rounded-b-10px min-w-50px"
                            :class="item.type === MessageTypeEnum.AI ? ' rounded-tr-10px bg-white flex-1' : 'rounded-tl-10px bg-#4F87FE color-white ml-auto'">
                            <view class="flex items-center gap-6px mb-8px"
                                v-if="index === list.length - 1 && !isMessageEnd && item.type === MessageTypeEnum.AI && !historyId">
                                <view class="h-15px">
                                    <image class=" w-14px" src="@/static/images/ai-loading.png" mode="widthFix" />
                                </view>
                                <text class="text-14px font-500 color-#005CC2 flex-1">分析中...</text>
                                <view class="h-16px">
                                    <image class=" w-16px cursor-pointer" src="@/static/images/stop-ai.png"
                                        mode="widthFix" @click="handleStopAI" />
                                </view>
                            </view>
                            <view class=" whitespace-pre-wrap" v-for="text in item.data">
                                <text v-if="isString(text)">{{ text ===
                                    WB_Enum.AI_START ? '' : text }}</text>
                                <view v-if="!isString(text) && !text.isEnd">
                                    <view>是否确认执行？</view>
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
                                        :src="control.icon" mode="widthFix" @click="() => control?.onClick(item)"
                                        >
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

        <template #footer>
            <InputCom ref="InputComRef" :test-id="testId" @send-message="handleSend" v-if="!historyId"></InputCom>
        </template>
    </PageContainer>
</template>