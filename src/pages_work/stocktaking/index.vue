<script setup lang="ts">
import { StocktakingApi } from '@/api/WorkApi';
import CustomHeaderNav from '@/components/CustomHeaderNav.vue';
import LabelValueWrapper, { type LabelValueItem } from '@/components/label-value/LabelValueWrapper.vue';
import ModuleWrapper from '@/components/ModuleWrapper.vue';
import { onLoad, onShow } from '@dcloudio/uni-app';
import { computed, ref } from 'vue';
import CustomTag from './components/CustomTag.vue';
import { StocktakingStatusEnum, StocktakingTypeEnum } from '@/enums/work';
import PageContainer from '@/components/PageContainer.vue';

const currentId = ref('')

onLoad((option) => {
    currentId.value = option.id
    init(option.id)
})

onShow(() => {
    init(currentId.value)
})

const detail = ref<Stocktaking.Detail>()

const baseInfo = computed<LabelValueItem[]>(() => [
    {
        label: '任务编号',
        value: detail.value?.code
    },
    {
        label: '任务类型',
        value: detail.value?.type === 0 ? '设备盘点' : '备件盘点'
    },
    {
        label: '盘点开始',
        value: detail.value?.startTime
    },
    {
        label: '盘点结束',
        value: detail.value?.endTime
    },
    {
        label: '盘点进度',
        value: +detail.value?.completionProgress.toFixed(4) * 100 + '%'
    },
])

const loading = ref(false)
async function init(id) {
    try {
        loading.value = true
        const { data } = await StocktakingApi.detail(id)

        detail.value = data
    } catch (error) {
        console.log(error);

    } finally {
        loading.value = false
    }
}

function getStatus(progress: number) {
    if (!progress) {
        return StocktakingStatusEnum.NotStarted
    } else if (progress < 1) {
        return StocktakingStatusEnum.InProgress
    } else {
        return StocktakingStatusEnum.Completed
    }
}

function jump(areaId) {
    uni.navigateTo({
        url: `/pages_work/stocktaking/handle?areaId=${areaId}&id=${detail.value.id}`,
    })
}

function handleScan() {
    uni.scanCode({
        scanType: ['qrCode'],
        success: (res) => {
            if (res.result) {
                const data = JSON.parse(res.result);
                if(data.id && detail.value?.areaInfoList.some(v => v.areaId === data.id)) {
                    jump(data.id);
                } else {
                    uni.showToast({
                        title: '该二维码与当前任务无关，请确认后再扫码。',
                        icon: 'none',
                        duration: 3000
                    })
                }
            }
        }
    })
}

async function finish() {
    try {
        await StocktakingApi.finish(detail.value)
        uni.showToast({
            title: '操作成功'
        })

        init(currentId.value)
    } catch (error) {
        console.log(error);

    }
}
</script>

<template>
    <PageContainer :loading="loading">
        <div class=" px-4 space-y-3 flex-1 overflow-auto">
            <ModuleWrapper title="基础信息">
                <template #header-right>
                    <CustomTag :status="detail?.status" :progress="detail?.completionProgress"></CustomTag>
                </template>
                <LabelValueWrapper :list="baseInfo"></LabelValueWrapper>
            </ModuleWrapper>
            <ModuleWrapper title="盘点区域">
                <div class=" space-y-5 text-14px">
                    <div class=" flex f-c-b gap-5" v-for="item, index in detail?.areaInfoList" :key="item.areaId"
                        @click="jump(item.areaId)">
                        <div class=" flex">
                            <div>{{ index + 1 }}、</div>{{ item.areaName }}
                        </div>
                        <CustomTag class=" flex-shrink-0" :status="getStatus(item.completionProgress)"
                            :progress="item.completionProgress">
                        </CustomTag>
                    </div>
                </div>
            </ModuleWrapper>
        </div>
        <template #footer>
            <div class="mx-auto w-[calc(100%-32px)] py-3" v-if="detail?.status !== StocktakingStatusEnum.Completed">
                <template v-if="detail?.type === StocktakingTypeEnum.SpareParts">
                    <uv-button type="primary" v-if="detail?.areaInfoList.every(v => v.completionProgress === 1)"
                        @click="finish">完成</uv-button>
                    <!-- #ifdef APP -->
                    <uv-button type="primary" @click="handleScan" v-else>扫码</uv-button>
                    <!-- #endif -->
                </template>
                <uv-button type="primary" v-else
                    :disabled="!detail?.areaInfoList.every(v => v.completionProgress === 1)"
                    @click="finish">完成</uv-button>
            </div>
        </template>
    </PageContainer>
</template>