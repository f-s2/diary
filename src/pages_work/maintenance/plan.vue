<template>
    <div class="page-body">
        <uv-form class="form input-right" ref="formRef" :rules="rules" :model="formData" label-position="left"
            labelWidth="auto">
            <uv-form-item label="保养项" prop="itemIds" :required="true">
                <div style="display: flex;" @click="handleSelect">
                    <div class="item-tags">
                        <span class="item-tag" v-for="item in formData.itemList">{{ item.name }}</span>
                    </div>
                    <uv-icon name="arrow-right"></uv-icon>
                </div>

            </uv-form-item>

        </uv-form>
        <div class="bottom-btn">

            <button type="primary" @click="save">保存</button>

        </div>
        <SelectItems v-model:show="show" :data="formData" @ok="selectOk" />

    </div>

</template>

<script setup>
import { MaintenanceApi } from "@/api/WorkApi";

import { onLoad } from "@dcloudio/uni-app";
import SelectItems from './SelectItems.vue';

import { ref } from 'vue';
const formData = ref({ itemIds: [] })
onLoad(({ info }) => {
    formData.value = JSON.parse(info)

})

const rules = {
    itemIds: {
        required: true,
        mesaage: '请选择',
        type: 'array'
    }
}
const formRef = ref()

const show = ref(false)
const handleSelect = () => {
    console.log('open');
    show.value = true
}

const selectOk = (val) => {
    formData.value.itemList = [...val]
    formData.value.itemIds = val.map(item => item.id)
}
const save = () => {
    console.log(formData.value);
    formRef.value.validate().then(() => {
        const { itemList, maintenanceId, id } = formData.value
        MaintenanceApi.updateItem({ id, maintenanceId, itemIds: itemList.map(item => item.id) }).then(res => {
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
</style>