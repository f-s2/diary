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
import { joinUrlWithQuery } from '@/utils';

const queryData = ref()

onLoad((query) => {
    queryData.value = query
    init(query)
})

const UpdateTaskModalRef = ref()

const list = ref<Stocktaking.ProductRelItem[]>([])
const site = ref('')
const loading = ref(false)

async function init(data) {
    try {
        loading.value = true
        const res = await StocktakingApi.unfinishedManifestList(data)

        list.value = res.data.productRelList
        site.value = res.data.areaName
    } catch (error) {
        console.log(error);
    } finally {
        loading.value = false
    }
}

function updateInfo(data, index) {
    Object.assign(list.value[index], data)
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

</script>

<template>
    <PageContainer :loading="loading">
        <div class="px-4 space-y-3">
            <ModuleWrapper title="盘点执行">
                <template #header-right>
                    <navigator :url="joinUrlWithQuery('/pages_work/stocktaking/done', queryData)" open-type="navigate" hover-class="navigator-hover">
                        <div class=" f-c-c gap-7px bg-primary color-white text-xs font-500 px-2 py-6px rounded-2px">已盘清单
                            <img class=" h-2" :src="ArrowPng" alt="">
                        </div>
                    </navigator>
                </template>
                <div class=" flex">
                    <img class=" w-6 mr-6px" :src="SitePng" alt="">
                    <span>
                        {{ site }}
                    </span>
                </div>
            </ModuleWrapper>

            <ModuleWrapper v-for="item, index in list">
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
                        value: item.differenceQuantity,
                        customRender(value) {
                            return h('span', {style:{color: '#FF0000'}}, value || '-')
                        }
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

                <uv-button class="mt-5" type="primary" :customStyle="{ height: '80rpx', fontSize: '28rpx' }" plain
                    @click="UpdateTaskModalRef.open(item, index)">修改</uv-button>
            </ModuleWrapper>
        </div>
        <template #footer>
            <div class="mx-auto w-[calc(100%-32px)] py-3" v-if="list.length">
                <uv-button type="primary" @click="save" :loading="loadingSave">保存</uv-button>
            </div>
        </template>
        <UpdateTaskModal ref="UpdateTaskModalRef" @confirm="updateInfo">
        </UpdateTaskModal>
    </PageContainer>
</template>