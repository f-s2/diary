import { resetAxiosBaseUrl } from "@/utils/request";
import { defineStore } from "pinia";
import { reactive, ref, watch } from "vue";


export const useGlobalStore = defineStore('global', () => {
    const CommonSettingKey = 'CommonSettings'
    const commonSetting = reactive<{
        baseUrl?: string
    }>({
        
    })

    watch(commonSetting, nv => {
        if(nv.baseUrl) {
            resetAxiosBaseUrl(commonSetting.baseUrl)
        }
    })

    const checkBaseUrl = () => {
        const target = uni.getStorageSync(CommonSettingKey)
        console.log(target);
        
    }

    const setSetting = (obj: typeof commonSetting) => {
        Object.assign(commonSetting, obj)
        uni.setStorageSync(CommonSettingKey, commonSetting)
    }


    const initSetting = () => {
        const target = uni.getStorageSync(CommonSettingKey)
        if(!target) {
            commonSetting.baseUrl = import.meta.env.VITE_APP_BASE_URL
        } else {
            setSetting(target)
        }
    }


    return {
        commonSetting,
        setSetting,
        checkBaseUrl,
        initSetting
    }
})