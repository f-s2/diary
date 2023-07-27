import { netConfig } from '@/config/net.config';
import axios from 'axios';
import mpAdapter from "axios-miniprogram-adapter";
axios.defaults.adapter = mpAdapter;
const { baseURL, contentType, requestTimeout, successCode } = netConfig;

let tokenLose = true;

const instance = axios.create({
    baseURL,
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
        // console.log(getApp().globalData, 'response');
        // uni.navigateTo({
        //     url: "/pages/login/index"
        // })

        // 请求出错处理
        // -1 超时、token过期或者没有获得授权
        if (res.status === -1 && tokenLose) {
            tokenLose = false;
            uni.showToast({
                title: '服务器异常',
                duration: 2000
            });

            return Promise.reject(res);
        }
        if (successCode.indexOf(res.status) !== -1) {
            return Promise.reject(res);
        }
        return res;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default instance;

