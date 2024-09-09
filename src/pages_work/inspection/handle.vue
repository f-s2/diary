<template>
    <div class="page-body">
        <div class="title">
            填写点检记录
        </div>
        <div class="sub-title">
            点检记录
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
                点检信息
            </div>
            <div :class="['describe-item', { wrap: item.wrap }]" v-for="item in baseConfig" :key="item.name"
                style="border: none;">
                <div class="describe-label">
                    {{ item.name }}</div>
                <div class="describe-value">
                    <span v-if="!item.custom">
                        {{ baseInfo?.[item.code] || "--" }}
                    </span>
                </div>
            </div>
            <div class="describe-item" style="border: none;">
                <div class="describe-label"> <span style="color: red;">*</span>点检记录</div>
                <div class="describe-value" @click="handleFill">

                    <div class="done-btn" v-if="baseInfo.itemList?.every(item => Number.isInteger(item.checked))">
                        <uv-icon name="checkmark-circle" color="#52C41A" size="16"></uv-icon>
                        已填写
                    </div>
                    <div class="fill-btn" v-else>
                        <uv-icon name="edit-pen" color="#003A8B" size="16"></uv-icon>
                        填写记录
                    </div>


                </div>
            </div>
        </div>

        <div class="bottom-btn">
            <uv-button type="primary" @click="handleSave">提交</uv-button>
        </div>
        <FillItem v-model:show="modalState.show" :data="baseInfo.itemList" @ok="(list) => baseInfo.itemList = list" />
    </div>
</template>

<script setup>
import { InspectionkApi } from "@/api/WorkApi";

import { onLoad, onShow } from "@dcloudio/uni-app";
import { reactive, ref } from "vue";
import FillItem from './FillItem.vue';
const baseInfo = ref({})
onLoad(({ id }) => {
    baseInfo.value.id = id
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
        name: '点检时间',
        code: 'inspectTime'
    },
    {
        name: '点检人员',
        code: 'inspectUserName'
    },
]

const modalState = reactive({
    show: false,
    spareShow: false
})

const handleFill = () => {
    modalState.show = true

}

const getInfo = () => {
    InspectionkApi.detail(baseInfo.value.id).then(res => {
        baseInfo.value = res.data
    })

}

const handleSave = () => {
    const { itemList, sparePartsList } = baseInfo.value
    if (itemList.some(item => !Number.isInteger(item.checked))) {
        uni.showToast({
            title: '请填写记录完整!',
            icon: 'none'
        })
        return
    }

    uni.showModal({
        title: '是否提交任务?',
        success: ({ confirm }) => {
            confirm & InspectionkApi.handle({
                ...baseInfo.value
            }).then(res => {
                if (res.code === 0) {
                    uni.showToast({
                        title: '请求成功'
                    })
                    uni.reLaunch({
                        url: '/pages_work/index/index'
                    })
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

</script>
<style lang='scss' scoped>
.page-body {
    padding-bottom: 80px;
}

.title {
    font-size: 24px;
    font-weight: bold;
}

.sub {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}

.sub-title {
    font-size: 16px;
    font-weight: bold;
    display: flex;
    align-items: center;
    margin: 10px 0;

    &::before {
        width: 6px;
        height: 18px;
        content: '';
        display: inline-block;
        background-color: #003A8B;
        margin-right: 8px;
        border-radius: 2px;
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

.done-btn {
    display: flex;
    color: #52C41A;
    gap: 2px;
}

.fill-btn {
    display: flex;
    color: #003A8B;
    gap: 2px;
}



.item-top {
    display: flex;
    justify-content: space-between;
}
</style>