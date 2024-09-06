import { netConfig } from '@/config/net.config';
import axios from 'axios';
import mpAdapter from "axios-miniprogram-adapter";
axios.defaults.adapter = mpAdapter;
const { baseName, contentType, requestTimeout, successCode, invalidCode } = netConfig;


const instance = axios.create({
    baseURL: baseName,
    timeout: requestTimeout,
    headers: {
        'Content-Type': contentType,
    },
});

// request interceptor
instance.interceptors.request.use(
    (config) => {
        config.headers.token = uni.getStorageSync('token') || ''
        return config;
    },
    (error) => {
        // do something with request error
        return Promise.reject(error);
    }
);

// response interceptor
instance.interceptors.response.use(
    /**
     * If you want to get http information such as headers or status
     * Please return  response => response
     */
    (response) => {
        const res = response.data;

        // 请求出错处理
        // -1 超时、token过期或者没有获得授权
        if (successCode.includes(res.code)) {
            return res
        } else if (invalidCode.includes(res.code)) {
            uni.setStorageSync('token', '')
            uni.setStorageSync("id", '');
            uni.showToast({
                title: '请重新登录'
            })
            uni.reLaunch({
                url: '/pages/login/index'
            })
        } else {
            uni.showToast({
                icon: 'none',
                title: res.message
            })

        }
        return res;
    },
    (error) => {

        if (JSON.stringify(error).includes('Network Error')) {
            uni.showToast({
                title: 'Network Error',
                icon: 'error'
            })
        } else {
            uni.showModal({
                title: "提示!",
                content: '系统正在维护,请联系管理员',
                showCancel: false
            })
        }

        return Promise.reject(error);
    }
);

export default instance;

