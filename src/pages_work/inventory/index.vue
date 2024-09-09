<template>
    <div class="page-body">
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


        <div class="bottom-btn">
            <uv-button v-if="baseInfo.taskStatus == 0" type="primary" @click="handleSave">处理任务</uv-button>
            <uv-button v-else type="primary" @click="handleView">盘点详情</uv-button>
        </div>
    </div>
</template>

<script setup>

import { onLoad } from "@dcloudio/uni-app";
import { ref } from "vue";

const baseInfo = ref({})
onLoad((data) => {
    baseInfo.value = data

})



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






const handleSave = () => {
    const { id, } = baseInfo.value
    uni.navigateTo({
        url: `/pages_work/inventory/handle?id=${id}`
    })

}
const handleView = () => {
    const { id, } = baseInfo.value
    uni.navigateTo({
        url: `/pages_work/inventory/done?id=${id}`
    })
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
</style>