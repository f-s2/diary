
import { UserApi } from '@/api/UserApi'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface UserInfo {
    username: string
    jobNumber: string
    organizeName: string
    mobile: string
    authorities: string
    userType: string
    email: string
    sex: 0|1
    weworkNumber: string
    dingtalkNumber: string
    feishuNumber: string
}

export const useUserStore = defineStore('user', () => {

    const isLoginOut = ref(false)
    const userInfo = ref<Partial<UserInfo>>({})
    const  urlPrefix=ref('')
    const setUserInfo = (data) => {
        userInfo.value = data
    }
    const unFinishCount = ref(0)

    const getUserInfo = async () => {
        try {
            const res = await UserApi.getUserInfo({})
            userInfo.value = res.data
        } catch (error) {
            console.log(error);
        } finally {
            return userInfo.value
        }
    }

    return {
        userInfo,
        setUserInfo,
        getUserInfo,
        isLoginOut,
        unFinishCount,
        urlPrefix
    }


}, {
    persist: {
        //@ts-ignore
        enabled: true
    }
})
