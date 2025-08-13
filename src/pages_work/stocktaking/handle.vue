<script setup lang="ts">
import { StocktakingApi } from '@/api/WorkApi';
import CustomHeaderNav from '@/components/CustomHeaderNav.vue';
import LabelValueWrapper from '@/components/label-value/LabelValueWrapper.vue';
import ModuleWrapper from '@/components/ModuleWrapper.vue';
import ArrowPng from '@/static/stocktaking/arrow.png'
import SitePng from '@/static/stocktaking/site.png'
import { onLoad } from '@dcloudio/uni-app';
import { ref } from 'vue';

onLoad((query) => {
    init(query)
})

const list = ref<Stocktaking.ProductRelItem[]>([])
const site = ref('')

async function init(data) {
    try {
        const res = await StocktakingApi.unfinishedManifestList(data)

        list.value = res.data.productRelList
        site.value = res.data.areaName
    } catch (error) {
        console.log(error);
    }
}

</script>

<template>
    <div>
        <CustomHeaderNav></CustomHeaderNav>
        <div class="px-4 space-y-3">
            <ModuleWrapper title="盘点执行">
                <template #header-right>
                    <div class=" f-c-c gap-7px bg-primary color-white text-xs font-500 px-2 py-6px rounded-2px">已盘清单
                        <img class=" h-2" :src="ArrowPng" alt=""> </div>
                </template>
                <div class=" flex">
                    <img class=" w-6 mr-6px" :src="SitePng" alt="">
                    <span>
                        {{ site }}
                    </span>
                </div>
            </ModuleWrapper>

            <ModuleWrapper v-for="item in list">
                <div class=" font-500 pb-4 mb-4 border-b-(1px dashed #ccc)">
                    <div class=" mb-10px">{{ item.productName }}</div>
                    <div>结存数量：{{ item.balanceQuantity }}</div>
                </div>

                <LabelValueWrapper :list="[
                    {
                        label: '规格类型',
                        value: item.productModel
                    },
                    {
                        label: '物料类别',
                        value: item.productTypeName
                    },
                    {
                        label: '差异数量',
                        value: item.differenceQuantity
                    },
                    {
                        label: '盘点数量',
                        value: item.stocktakingQuantity
                    },
                    {
                        label: '备注内容',
                        value: item.remark
                    },
                ]"></LabelValueWrapper>
            </ModuleWrapper>
        </div>
    </div>
</template>