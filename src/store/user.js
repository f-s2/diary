
import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useUserStore = defineStore('user', () => {

    const isLoginOut = ref(false)
    const userInfo = ref({
    })
    const setUserInfo = (data) => {
        userInfo.value = data
    }
    const unFinishCount = ref(0)
    return {
        userInfo,
        setUserInfo,
        isLoginOut,
        unFinishCount
    }


})
