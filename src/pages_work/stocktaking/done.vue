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
import { ref, h } from 'vue';
import UpdateTaskModal from './components/UpdateTaskModal.vue';
import { joinUrlWithQuery } from '@/utils';
import { StocktakingTypeEnum } from '@/enums/work';

const queryData = ref()

onLoad((query) => {
    queryData.value = query
    init(query)
})

const UpdateTaskModalRef = ref()

const list = ref<Stocktaking.ProductRelItem[]>([])
const detail = ref<Stocktaking.Detail>()
const loading = ref(false)

async function init(data) {
    try {
        loading.value = true
        const res = await StocktakingApi.finishedManifestList(data)

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
    save()
}

const loadingSave = ref(false)
async function save() {
    try {
        loadingSave.value = true
        await StocktakingApi.update({ ...queryData.value, productRelList: list.value })
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
                        return h('span', { style: { color: '#3BB656' } }, '已盘点')
                    }
                },
                {
                    label: '设备位置',
                    value: item.areaName
                },
            ]
        ),
        {
            label: '备注内容',
            value: item.remark
        },
    ]
}

</script>

<template>
    <PageContainer :loading="loading">
        <div class="px-4 space-y-3 pb-4">
            <div class=" font-500">已盘清单</div>
            <ModuleWrapper v-for="item, index in list">
                <div class=" font-500 pb-4 mb-4 border-b-(1px dashed #ccc)">
                    <div>{{ item.productName }}</div>
                    <div class="mt-10px" v-if="detail.type === StocktakingTypeEnum.SpareParts">结存数量：{{ item.balanceQuantity }}</div>
                </div>

                <LabelValueWrapper :list="getList(item)"></LabelValueWrapper>
                <uv-button class="mt-5" type="primary" :customStyle="{ height: '80rpx', fontSize: '28rpx' }" plain
                    @click="UpdateTaskModalRef.open(item, index)" v-if="detail.type === StocktakingTypeEnum.SpareParts">更新</uv-button>
            </ModuleWrapper>
            <uv-empty mode="data" v-if="!list.length"></uv-empty>
        </div>
        <UpdateTaskModal ref="UpdateTaskModalRef" @confirm="updateInfo">
        </UpdateTaskModal>
    </PageContainer>
</template>