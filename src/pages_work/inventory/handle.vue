<template>
    <div class="page-body">
        <div class="title">
            盘点执行
            <div class="done-btn" @click="jump">
                <uv-icon name="order" color="#1890FF"></uv-icon>
                已确认盘点
            </div>
        </div>
        <z-paging :auto-show-system-loading="true" :use-page-scroll="true" ref="paging" v-model="spareList"
            @query="queryList" default-page-size="5">
            <template #empty>
                <div class="empty">
                    <img :src="icon" alt="">
                    <b>恭喜完成全部盘点!</b>
                    <button @click="handleBack" class="btn" type="primary">返回任务列表</button>
                </div>

            </template>
            <div class="spare-item" v-for="item in spareList" :key="item.id">
                <div class="top">
                    <span class="name">{{ item.sparePartsName }} ({{ item.sparePartsCode }})</span>
                    <span class="count"><b>{{ item.quantity }}</b><span class="unit">{{ item.sparePartsUnit }}</span>
                    </span>
                </div>
                <div class="item-tags">

                    <span class="item-tag">
                        {{ item.sparePartsTypeName }}
                    </span>
                    <span class="item-tag">
                        {{ item.sparePartsBrand }}
                    </span>
                    <span class="item-tag">
                        {{ item.sparePartsModel }}
                    </span>

                </div>
                <div class="bottom describe">

                    <uv-row justify="space-between">
                        <uv-col span="3">
                            <div class="label">所在货位</div>
                            <div class="value">{{ item.goodsAllocationName }}</div>
                        </uv-col>
                        <uv-col span="3">
                            <div class="label">库区</div>
                            <div class="value">{{ item.warehouseAreaName }}</div>
                        </uv-col>
                        <uv-col span="3">
                            <div class="label">货区</div>
                            <div class="value">{{ item.goodsAreaName }}</div>
                        </uv-col>
                        <uv-col span="3">
                            <div class="label">货架</div>
                            <div class="value">{{ item.shelvesName }}</div>
                        </uv-col>

                    </uv-row>
                </div>
                <div class="action">
                    <button @click="handleUpdate(item)" type="primary" plain
                        style="background: rgba(24, 144, 255, 0.10);width: 30%;">修改</button>
                    <button @click="handleSave(item)" type="primary" style="flex: 1;">确认</button>
                </div>

            </div>
        </z-paging>


        <updateSpare v-model:show="show" :data="info" @ok="reload" />

    </div>
</template>

<script setup>
import icon from '@/static/task.png';

import { InventoryApi } from '@/api/WorkApi';
import { onLoad, onPageScroll, onReachBottom } from '@dcloudio/uni-app';
import { ref } from 'vue';
import useZPaging from "z-paging/components/z-paging/js/hooks/useZPaging.js";
import updateSpare from './updateSpare.vue';
onPageScroll, onReachBottom

const countId = ref()

onLoad(({ id }) => {
    countId.value = id
})
const jump = () => {
    uni.navigateTo({
        url: `/pages_work/inventory/done?id=${countId.value}`
    })
}
const paging = ref()
useZPaging(paging)

const spareList = ref([])
const queryList = (currentPage, pageSize) => {
    InventoryApi.detailPage({
        pageSize,
        currentPage,
        countId: countId.value,
        completed: 0
    }).then(res => {
        if (res.code === 0) {
            paging.value.complete(res.data?.records)
        }
    })
}
const reload = () => {
    paging.value.reload()
}
const show = ref(false)
const info = ref({})
const handleUpdate = (item) => {
    info.value = { ...item }
    show.value = true
}
const handleSave = ({ id, quantity }) => {
    uni.showModal({
        title: '是否确认盘点?',
        success: ({ confirm }) => {
            confirm & InventoryApi.confirm({ status: 1, id, quantity }).then(res => {
                if (res.code === 0) {
                    uni.showToast({
                        title: '请求成功'
                    })
                    reload()

                } else {
                    uni.showToast({
                        title: res.message,
                        icon: 'none'
                    })
                }
            })
        }

    })

}
const handleBack = () => {
    uni.reLaunch({
        url: '/pages_work/index/index'
    })
}
</script>
<style lang='scss' scoped>
.title {
    font-size: 24px;
    font-weight: bold;
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;

    .done-btn {
        color: #1890FF;
        font-size: 14px;
        font-weight: 400;
        display: flex;
        align-items: center;

    }
}

.spare-item {
    border-radius: 4px;
    background: #FFF;
    display: flex;
    padding: 12px 16px;
    flex-direction: column;
    margin-bottom: 10px;

    .mid {
        .tag {
            font-size: 12px;
        }
    }

    .top {
        display: flex;
        justify-content: space-between;
    }

    .count {
        display: flex;
        font-size: 12px;
        align-self: baseline;

        b {
            color: #1890FF;
            font-size: 18px;
        }

        .unit {
            align-self: flex-end
        }
    }

    .name {
        font-size: 16px;
        color: #000;
        font-weight: bold;

    }

}

.item-tags {
    margin: 12px 0;
    font-size: 12px;
    font-weight: bold;
    gap: 4px;
}

.describe {
    font-size: 12px;
    text-align: center;
    border-top: 1px solid rgba(0, 0, 0, 0.05);
    padding-top: 12px;

    .label {
        color: rgba(0, 0, 0, 0.50);
        margin-bottom: 8px;
    }

    .value {
        color: rgba(0, 0, 0, 0.90);
    }
}

.action {
    display: flex;
    width: 100%;
    gap: 10px;
    margin: 12px 0
}

.empty {
    flex: 1;
    text-align: center;
    display: flex;
    flex-direction: column;

    b {
        margin: 20px 0;
    }

    .btn {
        padding: 0 40px;
    }
}
</style>