import { netConfig } from '@/config/net.config';
import axios from 'axios';
import mpAdapter from "axios-miniprogram-adapter";
axios.defaults.adapter = mpAdapter;
const { baseName, contentType, requestTimeout, successCode, invalidCode } = netConfig;

const NotCheckLoginPages = ['pages_work/report-repair/index', 'pages_work/report-repair/handle', 'pages_work/report-repair/done', 'pages_work/report-repair/device', 'pages_work/report-repair/history']

const {VITE_APP_BASE_URL} = import.meta.env

let BaseUrl = ''

// #ifdef APP
BaseUrl = VITE_APP_BASE_URL + baseName
// #endif

// #ifdef H5
BaseUrl = baseName
// #endif

const instance = axios.create({
    baseURL: BaseUrl,
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

        const pageRoute = getCurrentPages().slice(-1)[0].route        
                
        // 请求出错处理
        // -1 超时、token过期或者没有获得授权
        if (successCode.includes(res.code)) {
            return res
        } 
        
        if (invalidCode.includes(res.code)) {
            if(NotCheckLoginPages.includes(pageRoute)) {
                return Promise.reject(res)
            }

            uni.setStorageSync('token', '')
            uni.setStorageSync("id", '');
            uni.showToast({
                title: '请重新登录'
            })
            const pages = getCurrentPages()
            const from = pages[pages.length - 1].$page.fullPath
            uni.reLaunch({
                url: '/pages/login/index?from=' + from
            })
        } else {
            
            uni.showToast({
                icon: 'none',
                title: res.message
            })

        }
        return Promise.reject(res);
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

