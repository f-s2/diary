
import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useUserStore = defineStore('user', () => {

    const isLogout = ref(false)
    const userInfo = ref({
    })
    const setUserInfo = (data) => {
        userInfo.value = data
    }
    return {
        userInfo,
        setUserInfo,
        isLogout
    }


})
