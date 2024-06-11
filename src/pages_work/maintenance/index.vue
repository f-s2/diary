<template>
    <div class="page-body">
        <u-loading v-if="loading" />
        <div class="sub-title">
            基础信息
            <status-tag :status="+baseInfo.taskStatus" :needBg="true" />
        </div>
        <div class="describe-box" style="margin-bottom: 12px">
            <div :class="['describe-item', { wrap: item.wrap }]" v-for="item in taskConfig" :key="item.name">
                <div class="describe-label">
                    {{ item.name }}</div>
                <div class="describe-value">
                    <span v-if="!item.custom">
                        {{ baseInfo?.[item.code] || "--" }}
                    </span>
                    <span v-if="item.code === 'taskType'">
                        <status-tag :status="+baseInfo.taskType" :tag="true" />
                    </span>

                </div>
            </div>
        </div>
        <template v-if="+baseInfo.taskStatus === 0">

            <div class="sub-title">
                预览计划
                <div class="btn" @click="updatePlan" v-if="baseInfo.taskStatus == 0 && baseInfo.fillStatus === 0">
                    <uv-icon name="edit-pen" color="#1890FF"></uv-icon> 编辑计划
                </div>
            </div>
            <div class="describe-box" style="margin-bottom: 12px">
                <div :class="['describe-item', { wrap: item.wrap }]" v-for="item in mainConfig" :key="item.name">
                    <div class="describe-label">
                        {{ item.name }}</div>
                    <div class="describe-value">
                        <span v-if="!item.custom">
                            {{ planInfo?.[item.code] || "--" }}
                        </span>

                        <span v-else-if="item.code === 'roleList'">
                            {{ planInfo.roleList?.map(item => `${item.name}`)?.join('、') ?? '-' }}
                        </span>
                    </div>
                </div>
            </div>
            <div class="plan-list">
                <div class="plan-item" v-for="item in planInfo.detailList">
                    <div class="plan-title">
                        <img :src="icon1" alt="">
                        ({{ item.deviceName }}) {{ item.deviceCode }}
                    </div>
                    <uv-grid :col="2">
                        <uv-grid-item style="align-items: start">
                            <div class="label">设备编码</div>
                            <div class="value">{{ item.deviceCode }}</div>
                        </uv-grid-item>
                        <uv-grid-item style="align-items: start">
                            <div class="label">基准</div>
                            <div class="value">{{ item.benchmark }}</div>
                        </uv-grid-item>
                        <uv-grid-item style="align-items: start">
                            <div class="label">保养项</div>
                            <div class="value">{{ item.item }}</div>
                        </uv-grid-item>
                        <uv-grid-item style="align-items: start">
                            <div class="label">周期(月)</div>
                            <div class="value">{{ item.period }}</div>
                        </uv-grid-item>

                    </uv-grid>


                    <div class="line" style="margin: 12px 0;" />
                    <uv-grid :col="3" style="margin: 0 -8px;">
                        <uv-grid-item v-for="val in item.timeTable" :key="val.time" style="align-items: start">
                            <div :class="['month-item', { active: val.checked }]"><span>{{ val.time }}</span> <img
                                    :src="icon2" alt="">
                            </div>
                        </uv-grid-item>
                    </uv-grid>

                </div>


            </div>
        </template>
        <template v-else>

            <div class="sub-title">
                保养记录

            </div>
            <div class="describe-box" style="margin-bottom: 1px;">
                <div class="info-title">
                    设备信息
                </div>
                <div :class="['describe-item', { wrap: item.wrap }]" v-for="item in deviceConfig" :key="item.name"
                    style="border: none;">
                    <div class="describe-label">
                        {{ item.name }}</div>
                    <div class="describe-value">
                        <span v-if="!item.custom">
                            {{ baseInfo?.[item.code] || "--" }}
                        </span>
                    </div>
                </div>
            </div>
            <div class="describe-box" style="margin-bottom: 12px">
                <div class="info-title">
                    保养信息
                </div>
                <div :class="['describe-item', { wrap: item.wrap }]" v-for="item in baseConfig" :key="item.name"
                    style="border: none;">
                    <div class="describe-label">
                        {{ item.name }}</div>
                    <div class="describe-value">
                        <span v-if="!item.custom">
                            {{ baseInfo?.[item.code] || "--" }}
                        </span>
                        <span @click="itemShow = true" v-else-if="item.code === 'itemList'"
                            style="display: flex;align-items: center;">
                            <span style="color:#1890FF ;"> 查看记录</span> <uv-icon name="arrow-right" size="16"></uv-icon>
                        </span>
                    </div>
                </div>

            </div>
            <div class="sub-title">
                备件领用
            </div>
            <div class="spare-list">
                <div class="spare-item" v-for="(item, index) in baseInfo.sparePartsList">
                    <div class="item-top">
                        <span>
                            {{ item.name ?? item.sparePartsName }}
                        </span>

                    </div>
                    <div class="item-value">
                        <uv-row>
                            <uv-col span="4">
                                <div class="name">货位</div>
                                <div class="value">{{ item.allocation ?? '-' }}</div>
                            </uv-col>
                            <uv-col span="4">
                                <div class="name">数量</div>
                                <div class="value">{{ item.quantity }}</div>
                            </uv-col>
                            <uv-col span="4">
                                <div class="name">使用数量</div>
                                <div class="value">{{ item.usedQuantity }}</div>
                            </uv-col>
                        </uv-row>
                    </div>
                </div>

            </div>
        </template>

        <div class="bottom-btn" v-if="baseInfo.taskStatus == 0">
            <button type="primary" @click="handleSave">处理任务</button>
        </div>
        <ViewItem v-model:show="itemShow" :data="baseInfo.itemList" />
    </div>
</template>

<script setup>
import icon1 from '@/static/device.png';
import icon2 from '@/static/tag_1.png';
import ViewItem from './ViewItem.vue';

import { MaintenanceApi } from "@/api/WorkApi";
import { onLoad, onShow } from "@dcloudio/uni-app";
import { ref } from "vue";

const loading = ref(false)
const baseInfo = ref({})
const planInfo = ref({})
onLoad((data) => {
    baseInfo.value = data

})
onShow(() => {
    getInfo()
})
const deviceConfig = [
    {
        name: '设备编码',
        code: 'deviceCode'
    },
    {
        name: '设备名称',
        code: 'deviceName'
    },
    {
        name: '设备型号',
        code: 'deviceModel'
    },
    {
        name: '设备类型',
        code: 'deviceTypeName'
    },
    {
        name: '设备组',
        code: 'deviceGroupName'
    },

]

const baseConfig = [
    {
        name: '任务编码',
        code: 'code'
    },
    {
        name: '保养时间',
        code: 'maintainTime'
    },
    {
        name: '保养人员',
        code: 'maintainUserName'
    },
    {
        name: '保养记录',
        code: 'itemList',
        custom: true
    },
]

const taskConfig = [
    {
        name: '任务编号',
        code: 'taskCode'
    },
    {
        name: '任务类型',
        code: 'taskType',
        custom: true
    },
    {
        name: '任务创建时间',
        code: 'taskCreateTime'
    },
]

const mainConfig = [
    {
        name: '计划编码',
        code: 'code'
    },

    {
        name: '责任人角色',
        code: 'roleList',
        custom: true
    },

]

const itemShow = ref(false)
const getInfo = () => {
    loading.value = true
    const { id, planId } = baseInfo.value
    MaintenanceApi.detail(id).then(res => {
        baseInfo.value = { ...res.data, ...baseInfo.value }
    }).finally(() => {
        loading.value = false
    })
    MaintenanceApi.planDetail(planId).then(res => {
        planInfo.value = res.data
    })

}

const updatePlan = () => {
    const { detail, id } = baseInfo.value
    uni.reLaunch({
        url: `/pages_work/maintenance/plan?info=${JSON.stringify({ ...detail, maintenanceId: id })}`,
    });

}
const handleSave = () => {
    const { fillStatus, id } = baseInfo.value
    if (fillStatus === 0) {
        MaintenanceApi.updateItem({ maintenanceId: id }).then(res => {
            if (res.code === 0) {
                uni.reLaunch({
                    url: `/pages_work/maintenance/handle?id=${id}`
                })
            }
        })

    } else {
        uni.navigateTo({
            url: `/pages_work/maintenance/handle?id=${id}`
        })

    }
}

</script>
<style lang='scss' scoped>
.page-body {
    padding-bottom: 80px;
}

.sub-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    font-weight: bold;
    margin: 12px 0;
}

.btn {
    color: #1890FF;
    font-size: 14px;
    align-items: center;
    display: flex;
    gap: 4px;
    font-weight: 500;
}

.spare-list {
    display: flex;
    flex-direction: column;
    gap: 8px;

    >div {
        border-radius: 4px;
        background: #FFF;
        display: flex;
        padding: 12px 16px;
        flex-direction: column;
        gap: 16px;

    }

    .name {
        color: rgba(0, 0, 0, 0.50);
        margin-bottom: 6px;
    }
}

.info-title {
    font-size: 14px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.90);
    margin: 10px 0;
}

.line {
    height: 1px;
    background-color: #f7f8fa;
}

.plan-list {
    display: flex;
    flex-direction: column;
    gap: 10px;

    .plan-item {
        background-color: #fff;
        border-radius: 4px;
        padding: 16px;
        font-size: 12px
    }

    .plan-title {
        display: flex;
        align-items: center;
        font-weight: bold;
        font-size: 14px;
        gap: 4px;

        img {
            width: 20px;
            height: 20px
        }
    }


    .label {
        color: rgba(0, 0, 0, 0.5);
        line-height: 20px;
        margin: 10px 0
    }

    .value {
        color: rgba(0, 0, 0, 0.9);
    }

    .month-item {
        padding: 4px 8px;
        border-radius: 4px;
        flex: 1;
        align-self: stretch;
        display: flex;
        justify-content: space-between;
        background-color: rgba(247, 248, 250, 1);
        align-items: center;
        margin: 8px;

        img {
            width: 12px;
            height: 12px;
            display: none;
        }

        &.active {
            color: #1890FF;
            background-color: rgba(24, 144, 255, 0.15);

            img {
                display: inline-block;
            }
        }
    }
}
</style>