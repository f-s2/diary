<script setup lang="ts">
import CustomModal from '@/components/CustomModal.vue';
import { StocktakingTypeEnum } from '@/enums/work';
import { ref } from 'vue';

defineProps<{
    type?: number
}>()

const emit = defineEmits<{
    confirm: [Stocktaking.ProductRelItem, number]
}>()

const visible = ref(false)

const formData = ref<Partial<Stocktaking.ProductRelItem>>({
    remark: ''
})

const rules: Record<string, FormRule> = {
    stocktakingQuantity: {
        type: 'string',
        message: '请输入盘点数量',
        required: true,
        trigger: ['blur', 'change']
    }
}

const currentIndex = ref(-1)

async function open(params, index, stocktakingQuantity?: number) {
    formData.value = Object.assign({}, params)
    
    if(stocktakingQuantity !== undefined) {
        formData.value.stocktakingQuantity = stocktakingQuantity
    }

    currentIndex.value = index
    visible.value = true
}

const formRef = ref()

async function confirm() {
    try {
        await formRef.value.validate()
        emit('confirm', formData.value as any, currentIndex.value)

        visible.value = false
    } catch (error) {
        console.log(error);
        
    }
}

defineExpose({
    open
})
</script>

<template>
    <CustomModal v-model:open="visible" title="盘点">
        <uv-form class=" my-5" labelWidth="80px" :labelStyle="{ fontSize: '14px', fontWeight: 500 }" :model="formData" ref="formRef"
            :rules="rules">
            <uv-form-item label="盘点数量:" prop="stocktakingQuantity" required v-if="type !== StocktakingTypeEnum.Equipment">
                <uv-input type="number" placeholder="请输入盘点数量" v-model="formData.stocktakingQuantity"></uv-input>
            </uv-form-item>
            <uv-form-item label="备注内容:" prop="remark">
                <uv-textarea  placeholder="请输入备注内容" v-model="formData.remark"></uv-textarea>
            </uv-form-item>
        </uv-form>

        <div class=" flex gap-12px w-full">
            <uv-button class=" !flex-1" type="primary" :customStyle="{ height: '80rpx', fontSize: '28rpx' }" plain
                @click="visible=false">取消</uv-button>
            <uv-button class="!flex-1" type="primary" :customStyle="{ height: '80rpx', fontSize: '28rpx' }"
                @click="confirm">确认</uv-button>
        </div>
    </CustomModal>
</template>