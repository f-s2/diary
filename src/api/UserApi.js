import { netConfig } from '@/config/net.config'
import request from '@/utils/request'


const prefix = `/userservice/system/user`

/**
 * @description 授权登录
 * @param {*} data 
 */

export class UserApi {
    static login(data) {
        return request({
            url: prefix + '/login-for-wechat',
            method: 'post',
            params: {},
            data
        })
    }
    static getUserInfo(params) {
        return request({
            url: prefix + '/queryMenusByUserId',
            method: 'get',
            params,
        })
    }
    static loginOut(data) {
        return request({
            url: prefix + '/logout-for-wechat',
            method: 'get',
            params: {},
            data
        })
    }
    static getPhone(data) {
        return request({
            url: prefix + '/get-phone',
            method: 'post',
            params: {},
            data
        })
    }


}


export function getLocation(data) {
    return new Promise((resolve, reject) => {
        return uni.request(
            {
                url: 'https://apis.map.qq.com/ws/geocoder/v1/',
                method: 'GET',

                data: {
                    key: netConfig.mapKey,
                    ...data
                },
                success: resolve,
                fail: reject
            }
        )
    })

}

