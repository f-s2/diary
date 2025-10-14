<script setup lang="ts">
import CustomModal from '@/components/CustomModal.vue';
import { StocktakingTypeEnum } from '@/enums/work';
import { ref } from 'vue';
import htzImageUpload from '@/components/htz-image-upload/htz-image-upload.vue';
import { netConfig } from '@/config/net.config';
import { useUserStore } from '@/store/user';

defineProps<{
    type?: number
}>()

const emit = defineEmits<{
    confirm: [Stocktaking.ProductRelItem, number]
}>()

const userStore = useUserStore()

const visible = ref(false)

const formData = ref<Partial<Stocktaking.ProductRelItem>>({
    remark: ''
})

const rules: Record<string, FormRule[]> = {
    stocktakingQuantity: [
        {
            type: 'number',
            message: '请输入盘点数量',
            required: true,
            trigger: ['blur', 'change']
        }
    ]
}

const currentIndex = ref(-1)

async function open(params, index, stocktakingQuantity?: number) {
    formData.value = Object.assign({}, params)

    if (stocktakingQuantity !== undefined) {
        formData.value.stocktakingQuantity = stocktakingQuantity
    }

    if (!formData.value.pictureUrls) {
        formData.value.pictureUrls = []
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

const uploadSuccess = (res) => {
    const _res = JSON.parse(res.data);
    if (_res.code == 0) {
        return {
            success: true,
            url: userStore.userInfo.urlPrefix + _res.data.name,
            name: _res.data.name
        }
    } else {
        return {
            success: false,
            url: ''
        }
    }
}

defineExpose({
    open
})
</script>

<template>
    <CustomModal v-model:open="visible" title="盘点">
        <!-- <div class=" text-14px">盘点状态：{{ formData.stocktakingQuantity === 1 ? '盘点完成' : '盘亏' }}</div> -->
        <uv-form class=" my-5" labelWidth="80px" :labelStyle="{ fontSize: '14px', fontWeight: 500 }" :model="formData"
            ref="formRef" :rules="rules">
            <uv-form-item label="盘点状态:" prop="stocktakingQuantity" required class="not-bg-form-item"
                v-if="type === StocktakingTypeEnum.Equipment">
                <uv-radio-group v-model="formData.stocktakingQuantity" placement="row" class="gap-12px">
                    <uv-radio :name="1" label="盘点完成"></uv-radio>
                    <uv-radio :name="0" label="盘亏"></uv-radio>
                </uv-radio-group>
            </uv-form-item>
            <uv-form-item label="盘点数量:" prop="stocktakingQuantity" required v-else>
                <uv-input type="number" placeholder="请输入盘点数量" v-model="formData.stocktakingQuantity"></uv-input>
            </uv-form-item>
            <uv-form-item label="备注内容:" prop="remark" :customStyle="{ alignItems: 'flex-start' }">
                <uv-textarea placeholder="请输入备注内容" v-model="formData.remark"></uv-textarea>
            </uv-form-item>
            <uv-form-item label="图片:" class="not-bg-form-item" prop="pictureUrls"
                :customStyle="{ alignItems: 'flex-start', backgroundColor: 'transparent' }">
                <htz-image-upload :dataType="0" :max="9" mediaType="image" v-model="formData.pictureUrls"
                    :uploadSuccess="uploadSuccess"
                    :action="netConfig.baseName + '/business/picture/upload'"></htz-image-upload>
            </uv-form-item>
        </uv-form>

        <div class=" flex gap-12px w-full">
            <uv-button class=" !flex-1" type="primary" :customStyle="{ height: '80rpx', fontSize: '28rpx' }" plain
                @click="visible = false">取消</uv-button>
            <uv-button class="!flex-1" type="primary" :customStyle="{ height: '80rpx', fontSize: '28rpx' }"
                @click="confirm">确认</uv-button>
        </div>
    </CustomModal>
</template>

<style scoped>
.not-bg-form-item :deep(.uv-form-item__body__right) {
    background-color: transparent;
}
</style>