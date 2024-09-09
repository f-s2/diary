<template>
    <div class="page-body">
        <div class="title">
            填写保养记录
        </div>
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
                </div>
            </div>
            <div class="describe-item" style="border: none;">
                <div class="describe-label"> <span style="color: red;">*</span>保养记录</div>
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
        <div class="sub">
            <div class="sub-title">
                备件领用
            </div>
            <span class="select-btn" @click="handleSelectSpare">+ 选择备件</span>
        </div>
        <div class="spare-list">
            <div class="spare-item" v-for="(item, index) in baseInfo.sparePartsList">
                <div class="item-top">
                    <span>
                        {{ item.name }}({{ item.code }})
                    </span>
                    <uv-icon @click="baseInfo.sparePartsList.splice(index, 1)" color="#999" name="close"></uv-icon>

                </div>
                <div class="item-value">
                    <uv-row>
                        <uv-col span="4">
                            <div class="name">货位</div>
                            <div class="value">{{ item.allocation }}</div>
                        </uv-col>
                        <uv-col span="4">
                            <div class="name">数量</div>
                            <div class="value">{{ item.quantity }}</div>
                        </uv-col>
                        <uv-col span="4">
                            <div class="name">使用数量</div>
                            <uv-input type="number" placeholder="点击填写" border="none" v-model="item.usedQuantity"
                                @blur="val => handleChange(val, item)"></uv-input>
                        </uv-col>
                    </uv-row>
                </div>
            </div>

        </div>
        <div class="bottom-btn">
            <uv-button type="primary" @click="handleSave">提交</uv-button>
        </div>
        <FillItem v-model:show="modalState.show" :data="baseInfo.itemList" @ok="(list) => baseInfo.itemList = list" />
        <selectSpare v-model:show="modalState.spareShow" :data="baseInfo.sparePartsList" @ok="handleAddOk" />
    </div>
</template>

<script setup>
import { MaintenanceApi } from "@/api/WorkApi";

import { onLoad, onShow } from "@dcloudio/uni-app";
import { reactive, ref } from "vue";
import FillItem from './FillItem.vue';
import SelectSpare from './SelectSpare.vue';
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
        name: '保养时间',
        code: 'maintainTime'
    },
    {
        name: '保养人员',
        code: 'maintainUserName'
    },
]

const modalState = reactive({
    show: false,
    spareShow: false
})

const handleFill = () => {
    modalState.show = true

}
const handleSelectSpare = () => {
    modalState.spareShow = true

}
const handleAddOk = (list) => {
    if (baseInfo.value.sparePartsList) {
        list.forEach(element => {
            const val = baseInfo.value.sparePartsList.find(item => item.id === element.id)
            if (!val) {
                baseInfo.value.sparePartsList.unshift(element)
            }
        });

    } else {
        baseInfo.value.sparePartsList = list
    }
}
const getInfo = () => {
    MaintenanceApi.detail(baseInfo.value.id).then(res => {
        baseInfo.value = res.data
    })

}
const handleChange = (val, item) => {
    if (val > item.quantity) {
        item.usedQuantity = item.quantity
    } else if (val < 1) {
        item.usedQuantity = 1
    } else {
        item.usedQuantity = +val
    }
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
    if (sparePartsList?.length) {
        if (sparePartsList.some(item => !Number.isInteger(item.usedQuantity))) {
            uni.showToast({
                title: '请填写备件使用数量!',
                icon: 'none'
            })
            return
        }
    }
    uni.showModal({
        title: '是否提交任务?',
        success: ({ confirm }) => {
            confirm & MaintenanceApi.handle({
                ...baseInfo.value, sparePartsList: sparePartsList.map(item => ({ sparePartsId: item.id, usedQuantity: item.usedQuantity }))
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

.select-btn {
    border-radius: 4px;
    border: 1px solid #003A8B;
    background: rgba(24, 144, 255, 0.10);
    display: flex;
    padding: 4px 8px;
    align-items: center;
    color: #003A8B;
    gap: 4px;
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

.item-top {
    display: flex;
    justify-content: space-between;
}
</style>