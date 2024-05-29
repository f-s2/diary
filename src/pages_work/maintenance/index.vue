<template>
    <div class="page-body">
        <u-loading v-show="loading" />
        <div class="sub-title">
            基础信息
            <status-tag :status="+baseInfo.taskStatus" :needBg="true" />
        </div>
        <div class="describe-box" style="margin-bottom: 12px">
            <div :class="['describe-item', { wrap: item.wrap }]" v-for="item in baseConfig" :key="item.name">
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
        <div class="sub-title">
            预览计划
            <div class="btn" @click="updatePlan" v-if="baseInfo.taskStatus == 0"> <uv-icon name="edit-pen"
                    color="#1890FF"></uv-icon> 编辑计划</div>
        </div>
        <div class="describe-box" style="margin-bottom: 12px">
            <div :class="['describe-item', { wrap: item.wrap }]" v-for="item in mainConfig" :key="item.name">
                <div class="describe-label">
                    {{ item.name }}</div>
                <div class="describe-value">
                    <span v-if="!item.custom">
                        {{ planInfo?.[item.code] || "--" }}
                    </span>
                    <span v-else-if="item.code === 'itemList'">
                        <div class="item-tags">
                            <span class="item-tag" v-for="item in baseInfo.itemList">{{ item.name }}</span>
                        </div>
                    </span>
                    <span v-else-if="item.code === 'deviceList'">
                        {{ planInfo.deviceList?.map(item => `${item.name}`)?.join('、') ?? '-' }}
                    </span>
                    <span v-else-if="item.code === 'roleList'">
                        {{ planInfo.roleList?.map(item => `${item.name}`)?.join('、') ?? '-' }}
                    </span>
                </div>
            </div>
        </div>
        <div class="bottom-btn" v-if="baseInfo.taskStatus == 0">
            <button type="primary">处理任务</button>
        </div>
    </div>
</template>

<script setup>
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

const baseConfig = [
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
        name: '设备类型',
        code: 'deviceTypeName'
    },
    {
        name: '设备',
        code: 'deviceList',
        custom: true

    },
    {
        name: '责任人角色',
        code: 'roleList',
        custom: true

    },
    {
        name: '保养基准',
        code: 'benchmarkName'
    },
    {
        name: '保养项',
        code: 'itemList',
        custom: true
    },
    {
        name: '开始时间',
        code: 'startTime'
    },
]
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
    const { itemList, id, planId } = baseInfo.value
    const { benchmarkId } = planInfo
    uni.navigateTo({
        url: `/pages_work/maintenance/plan?info=${JSON.stringify({ itemList, maintenanceId: id, id: planId, benchmarkId })}`,
    });

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
}
</style>