<script setup lang="ts">
import { UserApi } from '@/api/UserApi';
import CustomHeaderNav from '@/components/CustomHeaderNav.vue';
import { useUserStore, type UserInfo } from '@/store/user';
import { ref } from 'vue';

const userStore = useUserStore()

const formData = ref<Partial<UserInfo>>({
    jobNumber: ''
})

const formRef = ref()

const rules: Record<string, FormRule> = {
    jobNumber: {
        type: 'string',
        message: '请输入用户工号',
        required: true,
        trigger: ['blur', 'change']
    },
    username: {
        type: 'string',
        message: '请输入用户姓名',
        required: true,
        trigger: ['blur', 'change']
    },
    mobile: {
        type: 'string',
        message: '请输入手机号码',
        required: true,
        trigger: ['blur', 'change']
    }
}

const sexList = [
    {
        label: '男',
        name: 1
    },
    {
        label: '女',
        name: 2
    },
]

const loading = ref(false)

async function init() {
    try {
        loading.value = true
        const data = await userStore.getUserInfo(true)

        formData.value = data
    } catch (error) {
        console.log(error);

    } finally {
        loading.value = false
    }
}
init()

async function save() {
    try {
        await formRef.value?.validate()

        await UserApi.update(formData.value)

        uni.showToast({
            title: '操作成功',
        })
        init()
    } catch (error) {
        console.log(error);

    }
}
</script>

<template>
    <div class="page-wrapper">
        <CustomHeaderNav></CustomHeaderNav>
        <div class="px-4 mt-22px">
            <div class=" text-16px font-500 mb-3">基础信息</div>
            <uv-loading-icon v-if="loading"></uv-loading-icon>

            <template v-else>
                <div class=" rounded-4px bg-white px-10px">
                    <uv-form labelWidth="80px" :labelStyle="{ fontSize: '14px', fontWeight: 500 }" :model="formData"
                        ref="formRef" :rules="rules">
                        <uv-form-item label="用户工号:" prop="jobNumber" required>
                            <uv-input placeholder="请输入用户工号" v-model="formData.jobNumber"></uv-input>
                        </uv-form-item>
                        <uv-form-item label="用户姓名:" prop="username" required>
                            <uv-input placeholder="请输入用户姓名" v-model="formData.username"></uv-input>
                        </uv-form-item>
                        <uv-form-item label="用户性别:" prop="sex" required>
                            <uv-radio-group v-model="formData.sex">
                                <uv-radio shape="square" :customStyle="{ margin: '8px' }"
                                    v-for="(item, index) in sexList" :key="index" :label="item.label" :name="item.name">
                                </uv-radio>
                            </uv-radio-group> </uv-form-item>
                        <uv-form-item label="手机号码:" prop="mobile" required>
                            <uv-input placeholder="请输入手机号码" v-model="formData.mobile"></uv-input>
                        </uv-form-item>
                        <uv-form-item label="邮箱地址:" prop="email" required>
                            <uv-input placeholder="请输入邮箱地址" v-model="formData.email"></uv-input>
                        </uv-form-item>
                        <uv-form-item label="企微号码:" prop="weworkNumber">
                            <uv-input placeholder="请输入企微号码" v-model="formData.weworkNumber"></uv-input>
                        </uv-form-item>
                        <uv-form-item label="钉钉号码:" prop="dingtalkNumber">
                            <uv-input placeholder="请输入钉钉号码" v-model="formData.dingtalkNumber"></uv-input>
                        </uv-form-item>
                        <uv-form-item label="飞书号码:" prop="feishuNumber">
                            <uv-input placeholder="请输入飞书号码" v-model="formData.feishuNumber"></uv-input>
                        </uv-form-item>
                    </uv-form>
                </div>
                <uv-button class="mt-30px" type="primary" @click="save">保存</uv-button>
            </template>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.page-wrapper {}
</style>