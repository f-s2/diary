<template>
    <div class="page-body">
        <uv-form class="form input-right" ref="formRef" :rules="rules" :model="formData" label-position="left"
            labelWidth="auto">
            <uv-form-item label="开始时间" prop="startTime" :required="true">
                <span @click="$refs.datePicker.open()">{{ formData.startTime }} </span>
                <uv-datetime-picker ref="datePicker" :value="formData.startTime" mode="year-month" @confirm="confirm" />

            </uv-form-item>

        </uv-form>
        <div class="plan-item" style="margin-top: 12px;">
            <div class="plan-title">
                <img :src="icon1" alt="">
                xxxxx

            </div>
            <uv-grid :col="2">
                <uv-grid-item style="align-items: start">
                    <div class="label">设备编码</div>
                    <div class="value">{{ formData.deviceCode }}</div>
                </uv-grid-item>
                <uv-grid-item style="align-items: start">
                    <div class="label">基准</div>
                    <div class="value">{{ formData.benchmark }}</div>
                </uv-grid-item>
                <uv-grid-item style="align-items: start">
                    <div class="label">保养项</div>
                    <div class="value">{{ formData.item }}</div>
                </uv-grid-item>
                <uv-grid-item style="align-items: start">
                    <div class="label">周期(月)</div>
                    <div class="value">{{ formData.period }}</div>
                </uv-grid-item>

            </uv-grid>



        </div>
        <div class="bottom-btn">

            <button type="primary" @click="save">保存</button>

        </div>

    </div>

</template>

<script setup>
import { MaintenanceApi } from "@/api/WorkApi";
import icon1 from '@/static/device.png';
import { onLoad } from "@dcloudio/uni-app";
import dayjs from "dayjs";

import { ref } from 'vue';
const formData = ref({ itemIds: [] })

onLoad(({ info }) => {
    formData.value = JSON.parse(info)

})

const rules = {
    startTime: {
        required: true,
        mesaage: '请选择',
    }
}
const formRef = ref()

const confirm = ({ value }) => {
    formData.value.startTime = dayjs(value).format('YYYY-MM')

}


const save = () => {
    formRef.value.validate().then(() => {
        const { maintenanceId, startTime } = formData.value
        MaintenanceApi.updateItem({ startTime, maintenanceId }).then(res => {
            if (res.code === 0) {
                uni.showToast({
                    title: '请求成功'
                })
                uni.navigateTo({
                    url: `/pages_work/maintenance/handle?id=${maintenanceId}`
                })

            }
        })
    })

}
</script>
<style lang='scss' scoped>
.form {
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.02);
    background: #fff;
    padding: 0 14px;
}

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
</style>