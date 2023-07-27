
import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useUserStore = defineStore('user', () => {


    const userInfo = ref({

    })
    const setUserInfo = (data) => {
        userInfo.value = data
    }
    return {
        userInfo,
        setUserInfo
    }


})
