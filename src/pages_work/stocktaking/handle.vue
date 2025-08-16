<script setup lang="ts">
import { StocktakingApi } from '@/api/WorkApi';
import CustomHeaderNav from '@/components/CustomHeaderNav.vue';
import CustomModal from '@/components/CustomModal.vue';
import LabelValueWrapper from '@/components/label-value/LabelValueWrapper.vue';
import ModuleWrapper from '@/components/ModuleWrapper.vue';
import PageContainer from '@/components/PageContainer.vue';
import ArrowPng from '@/static/stocktaking/arrow.png'
import SitePng from '@/static/stocktaking/site.png'
import { onLoad } from '@dcloudio/uni-app';
import { h, ref } from 'vue';
import UpdateTaskModal from './components/UpdateTaskModal.vue';
import { isUrl, joinUrlWithQuery, parseUrlQuery } from '@/utils';
import { StocktakingTypeEnum } from '@/enums/work';

const queryData = ref()

onLoad((query) => {
    queryData.value = query
    init(query)
})

const UpdateTaskModalRef = ref()

const list = ref<Stocktaking.ProductRelItem[]>([])
const loading = ref(false)

const detail = ref<Stocktaking.Detail>()

async function init(data) {
    try {
        loading.value = true
        const res = await StocktakingApi.unfinishedManifestList(data)

        list.value = res.data.productRelList
        detail.value = res.data
    } catch (error) {
        console.log(error);
    } finally {
        loading.value = false
    }
}

function updateInfo(data, index) {
    Object.assign(list.value[index], data)

    if (detail.value.type === StocktakingTypeEnum.Equipment) {
        save()
    }
}

const loadingSave = ref(false)
async function save() {
    try {
        loadingSave.value = true
        await StocktakingApi.save({ ...queryData.value, productRelList: list.value })
        uni.showToast({
            title: '操作成功'
        })

        init(queryData.value)
    } catch (error) {
        console.log(error);

    } finally {
        loadingSave.value = false
    }
}

function getList(item) {
    return [
        {
            label: '规格类型',
            value: item.productModel
        },
        {
            label: '物料类别',
            value: item.productTypeName
        },
        ...(
            detail.value?.type === StocktakingTypeEnum.SpareParts ? [
                {
                    label: '差异数量',
                    value: item.differenceQuantity,
                    customRender(value) {
                        return h('span', { style: { color: '#FF0000' } }, value || '-')
                    }
                },
                {
                    label: '盘点数量',
                    value: item.stocktakingQuantity
                },
            ] : [
                {
                    label: '盘点状态',
                    customRender(value) {
                        return h('span', { style: { color: '#FF9D00' } }, '未盘点')
                    }
                },
                {
                    label: '设备位置',
                    value: detail.value?.areaName
                },
            ]
        ),
        {
            label: '备注内容',
            value: item.remark
        },
    ]
}

function handleScan() {
    uni.scanCode({
        scanType: ['qrCode'],
        success: (res) => {
            if (res.result) {
                const url = res.result;
                let id = undefined

                if (isUrl(url)) {
                    id = parseUrlQuery(url).id
                }

                if (id && list.value.some(v => v.productId === id)) {
                    const item = list.value.find(v => v.productId === id)
                    UpdateTaskModalRef.value.open(item, list.value.indexOf(item), 1)
                    
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

</script>

<template>
    <PageContainer :loading="loading">
        <div class="px-4 space-y-3">
            <ModuleWrapper title="盘点执行">
                <template #header-right>
                    <navigator :url="joinUrlWithQuery('/pages_work/stocktaking/done', queryData)" open-type="navigate"
                        hover-class="navigator-hover">
                        <div class="f-c-c gap-7px bg-primary color-white text-xs font-500 px-2 py-6px rounded-2px">已盘清单
                            <image mode="heightFix" class=" h-2" :src="ArrowPng" alt="" />
                        </div>
                    </navigator>
                </template>
                <div class=" flex">
                    <div class="flex-shrink-0 w-6 mr-6px">
                        <image mode="widthFix" class=" w-full" :src="SitePng" alt="" /></img>
                    </div>
                    <span>
                        {{ detail?.areaName }}
                    </span>
                </div>
            </ModuleWrapper>

            <ModuleWrapper v-for="item, index in list">
                <div class=" font-500 pb-4 mb-4 border-b-(1px dashed #ccc)">
                    <div>{{ item.productName }}</div>
                    <div class="mt-10px" v-if="detail.type === StocktakingTypeEnum.SpareParts">结存数量：{{
                        item.balanceQuantity }}</div>
                </div>

                <LabelValueWrapper :list="getList(item)"></LabelValueWrapper>

                <uv-button class="mt-5" type="primary" :customStyle="{ height: '80rpx', fontSize: '28rpx' }" plain
                    @click="UpdateTaskModalRef.open(item, index)"
                    v-if="detail?.type === StocktakingTypeEnum.SpareParts">修改</uv-button>
                <div class="mt-5 f-c-b gap-3" v-else>
                    <uv-button class=" !flex-1" type="primary" :customStyle="{ height: '80rpx', fontSize: '28rpx' }"
                        plain @click="UpdateTaskModalRef.open(item, index, 0)">盘亏</uv-button>
                    <uv-button class=" !flex-1" type="primary" :customStyle="{ height: '80rpx', fontSize: '28rpx' }"
                        @click="UpdateTaskModalRef.open(item, index, 1)">确认</uv-button>
                </div>
            </ModuleWrapper>
            <uv-empty mode="data" v-if="!list.length"></uv-empty>
        </div>
        <template #footer>
            <div class="mx-auto w-[calc(100%-32px)] py-3" v-if="list.length">
                <uv-button type="primary" @click="save" :loading="loadingSave"
                    v-if="detail.type === StocktakingTypeEnum.SpareParts">保存</uv-button>
                <!-- #ifdef APP -->
                <uv-button type="primary" :loading="loadingSave" @click="handleScan" v-else>扫码</uv-button>
                <!-- #endif -->
            </div>
        </template>
        <UpdateTaskModal ref="UpdateTaskModalRef" @confirm="updateInfo" :type="detail.type">
        </UpdateTaskModal>
    </PageContainer>
</template>