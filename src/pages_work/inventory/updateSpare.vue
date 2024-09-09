<template>
    <u-popup :show="show" @update:show="(bol) => $emit('update:show', bol)" mode="bottom" title="修改数量" :cancel="true"
        :back="false" :round="10">

        <div class="content input-right">
            <uv-form labelPosition="left" :model="formData" :rules="rules" ref="formRef">
                <uv-form-item label="数量" prop="quantity" borderBottom>
                    <uv-input v-model="formData.quantity" border="none" type="number" placeholder="点击填写"></uv-input>
                    <template #right>
                        <span class="unit">{{ formData.sparePartsUnit }}</span>
                    </template>
                </uv-form-item>
            </uv-form>


        </div>

        <div class="bottom">
            <uv-button type="primary" @click="handleOk" hover-class="none">确定</uv-button>
        </div>

    </u-popup>
</template>

<script setup>
import { InventoryApi } from "@/api/WorkApi";

import { ref, watch } from "vue";
const props = defineProps({ show: Boolean, data: Object });
const emit = defineEmits(["update:show", "ok",]);
const formData = ref({})
const load = () => {
    formData.value = props.data
};
const rules = {
    quantity: [{
        pattern: /^\d+$/,
        message: '输入格式错误'
    }
        , {
        message: '请输入',
        required: true
    }
    ]
}
const formRef = ref()
const handleOk = () => {
    formRef.value.validate().then(() => {
        const { id, quantity } = formData.value
        InventoryApi.confirm({ status: 2, id, quantity }).then(res => {
            if (res.code === 0) {
                uni.showToast({
                    title: '请求成功'
                })
                emit('update:show', false)
                emit('ok')
            } else {
                uni.showToast({
                    title: res.message,
                    icon: 'none'
                })
            }
        })
    }).catch(() => {

    })
}
watch(
    () => props.show,
    (bol) => {
        if (bol) {
            load()
        }
    }
);
</script>

<style lang="scss" scoped>
.content {
    margin: 20px 30px;

}
</style>
