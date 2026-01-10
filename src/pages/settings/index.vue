<script setup lang="ts">
import PageContainer from '@/components/PageContainer.vue';
import { useGlobalStore } from '@/store/global';
import { cloneFnJSON } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';

const {setSetting} = useGlobalStore()

const {commonSetting} = storeToRefs(useGlobalStore())

const formData = ref(cloneFnJSON(commonSetting.value))

const formRef = ref()

const rules: Record<string, FormRule> = {
    baseUrl: {
        type: 'string',
        message: '请输入域名设置',
        required: true,
        trigger: ['blur', 'change']
    },
}

async function save() {
     await formRef.value?.validate()
    setSetting(formData.value)

    uni.showToast({
        title: '操作成功'
    })
}

</script>

<template>
    <PageContainer title="设置">
        <view class="px-16px">
            <view class="px-12px py-20px bg-white rounded-8px">
                <view class="text-14px font-500">网络设置</view>
                 <uv-form labelWidth="80px" :labelStyle="{ fontSize: '14px', fontWeight: 500 }" :model="formData"
                        ref="formRef" :rules="rules">
                        <uv-form-item label="域名设置:" prop="baseUrl" required>
                            <uv-input placeholder="请输入域名设置" v-model="formData.baseUrl"></uv-input>
                        </uv-form-item>
                    </uv-form>
                    <view class="bg-#407DFC w-140px py-8px text-center mx-auto rounded-4px text-14px font-500 text-white mt-20px" @click="save">保存</view>
            </view>
        </view>
    </PageContainer>
</template>