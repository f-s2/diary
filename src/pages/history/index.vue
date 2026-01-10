<script setup lang="ts">
import { HistoryApi } from '@/api/history';
import PageContainer from '@/components/PageContainer.vue';
import { onShow } from '@dcloudio/uni-app';
import { useDateFormat } from '@vueuse/core';
import dayjs from 'dayjs';
import { reactive, ref } from 'vue';

const loading = ref(false)
const list = ref<{
    date: string
    showList?: boolean
    data: History.ItemType[]
}[]>([])

async function getData() {
    try {
        loading.value = true
        const { data } = await HistoryApi.listByMonth({})
        list.value = Object.entries(data).map(([k, v]) => ({ date: k, data: v as any }))

    } catch (error) {
        console.log(error);

    } finally {
        loading.value = false
    }
}

onShow(() => {
    getData()
})

function handleJump(id: string) {
    uni.navigateTo({
        url: `/pages/dialogue/index?id=${id}`,
    })
}
</script>
<template>
    <page-container :loading="loading" title="历史记录">
        <view>
            <uv-empty v-if="!list.length && !loading"></uv-empty>
            <view class="px-16px space-y-12px">
                <view class="px-12px py-10px bg-white rounded-8px" v-for="item in list">
                    <view class="flex items-center text-16px font-500" @click="item.showList = !item.showList">{{
                        item.date
                    }}
                        <image class="h-26px w-26px transition-all mt-2px"
                            :class="item.showList ? ' rotate-270' : 'rotate-180'"
                            src="@/static/images/history/arrow-left.png" mode="heightFix" />
                    </view>
                    <view class="py-12px space-y-14px" v-show="item.showList">
                        <view class="f-c-b gap-10px" v-for="content in item.data" @click="handleJump(content.id)">
                            <image class="w-22px" src="@/static/images/quick-icon-4.png" mode="widthFix" />
                            <view class="flex-1">
                                <view class=" line-clamp-1 text-14px font-500">{{ content.subject }}</view>
                                <view class="text-12px color-#999999">
                                    {{ dayjs(content.initiationTime).format('MM月DD日 HH:mm') }}
                                </view>
                            </view>
                            <image class="w-23px h-23px" src="@/static/images/history/arrow-right.png" mode="widthFix" />
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </page-container>
</template>