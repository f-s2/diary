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
            url: prefix + '/login',
            method: 'post',
            params: {},
            data
        })
    }
    static getUserInfo(params) {
        return request({
            url: prefix + '/get-info',
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
                url: '/v1/',
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

