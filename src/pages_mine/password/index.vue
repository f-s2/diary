<script setup lang="ts">
import { PasswordApi, UserApi } from '@/api/UserApi';
import CustomHeaderNav from '@/components/CustomHeaderNav.vue';
import PageContainer from '@/components/PageContainer.vue';
import { useUserStore, type UserInfo } from '@/store/user';
import { getPasswordDesc } from '@/utils/password';
import { reactive, ref } from 'vue';

interface FormState {
    oldPassword: string
    newPassword: string
    confirmPassword: string

}

const userStore = useUserStore()

const formData = ref<Partial<FormState>>({
})

const passwordStatus = reactive<Record<keyof FormState, boolean>>({
    oldPassword: true,
    newPassword: true,
    confirmPassword: true
})

const formRef = ref()

const rules: Record<string, FormRule> = {
    oldPassword: {
        type: 'string',
        message: '请输入旧密码',
        required: true,
        trigger: ['blur', 'change']
    },
    newPassword: {
        type: 'string',
        message: '请输入新密码',
        required: true,
        trigger: ['blur', 'change']
    },
    confirmPassword: {
        type: 'string',
        message: '请确认密码',
        required: true,
        trigger: ['blur', 'change']
    }
}

const loading = ref(false)

const tips = ref()


async function init() {
    try {
        formData.value = {
            oldPassword: ''
        }

        const user = await userStore.getUserInfo()
        // const { data } = await PasswordApi.queryByUser(user.id)

        tips.value = getPasswordDesc(user.policyPO)

    } catch (error) {
        console.log(error);
    }
}
init()

async function save() {
    try {
        await formRef.value?.validate()

        if (formData.value.newPassword !== formData.value.confirmPassword) {
            return uni.showToast({
                icon: 'error',
                title: '两次输入不一致'
            })
        }

        await UserApi.updatePassword(formData.value)

        uni.showToast({
            title: '修改成功'
        })

        userStore.logout()

    } catch (error) {
        console.log(error);

    }
}
</script>

<template>
    <PageContainer>
        <div class="px-4">
            <div class=" text-16px font-500 mb-3">修改密码</div>
            <uv-loading-icon v-if="loading"></uv-loading-icon>

            <template v-else>
                <div class=" rounded-4px bg-white px-10px">
                    <div v-if="tips" class="flex items-center  mb-8px">
                        <span class=" text-xs font-600 mr-8px">Tips: </span>
                        <component :is="tips" class="text-gray text-12px" />
                    </div>
                    <uv-form labelWidth="80px" :labelStyle="{ fontSize: '14px', fontWeight: 500 }" :model="formData"
                        ref="formRef" :rules="rules">
                        <uv-form-item label="旧密码:" prop="oldPassword" required>
                            <uv-input placeholder="请输入旧密码" v-model="formData.oldPassword"
                                :password="passwordStatus.oldPassword">
                                <template #suffix>
                                    <uv-icon @click="passwordStatus.oldPassword = !passwordStatus.oldPassword"
                                        :name="!passwordStatus.oldPassword ? 'eye' : 'eye-off-outline'"></uv-icon>
                                </template>
                            </uv-input>
                        </uv-form-item>
                        <uv-form-item label="新密码:" prop="newPassword" required>
                            <uv-input placeholder="请输入新密码" v-model="formData.newPassword"
                                :password="passwordStatus.newPassword">
                                <template #suffix>
                                    <uv-icon @click="passwordStatus.newPassword = !passwordStatus.newPassword"
                                        :name="!passwordStatus.newPassword ? 'eye' : 'eye-off-outline'"></uv-icon>
                                </template>

                            </uv-input>
                        </uv-form-item>
                        <uv-form-item label="确认密码:" prop="confirmPassword" required>
                            <uv-input placeholder="请确认密码" v-model="formData.confirmPassword"
                                :password="passwordStatus.confirmPassword">
                                <template #suffix>
                                    <uv-icon @click="passwordStatus.confirmPassword = !passwordStatus.confirmPassword"
                                        :name="!passwordStatus.confirmPassword ? 'eye' : 'eye-off-outline'"></uv-icon>
                                </template>
                            </uv-input>
                        </uv-form-item>
                    </uv-form>
                </div>
                <uv-button class="mt-30px" type="primary" @click="save">保存</uv-button>
            </template>
        </div>
    </PageContainer>
</template>