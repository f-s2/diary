
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
    id: string
    policyPO: PasswordStrategy.BasicInfo
    urlPrefix: string
}

export const useUserStore = defineStore('user', () => {

    const isLoginOut = ref(false)
    const userInfo = ref<Partial<UserInfo>>({})
    const  urlPrefix=ref('')
    const setUserInfo = (data) => {
        userInfo.value = data
    }
    const unFinishCount = ref(0)

    const getUserInfo = async (refresh=false) => {
        try {
            if(!refresh && userInfo.value.id) {
                return userInfo.value
            }
            
            const res = await UserApi.getUserInfo({})
            userInfo.value = res.data
        } catch (error) {
            console.log(error);
        } finally {
            return userInfo.value
        }
    }

    const logout = async (needApi=true) => {
        try {
            if(needApi) {
                await UserApi.loginOut()
            }

            const { authorities, userType } = userInfo.value
            setUserInfo({ authorities, userType });

            uni.setStorageSync('token', '')
            const pages = getCurrentPages()
            const from = '/' + pages[pages.length - 1].route
            uni.reLaunch({
                url: `/pages/login/index?from=${from}`
            })
        } catch (error) {
            console.log(error);
            
        }
    }

    return {
        userInfo,
        setUserInfo,
        getUserInfo,
        isLoginOut,
        unFinishCount,
        urlPrefix,
        logout
    }


}, {
    persist: {
        //@ts-ignore
        enabled: true
    }
})
