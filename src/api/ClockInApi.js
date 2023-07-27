import request from '@/utils/request'


const prefix = `/business/clock-in`

/**
 * @description 授权登录
 * @param {*} data 
 */

export class ClockInApi {

    static add(data) {
        return request({
            url: prefix + '/add',
            method: 'post',
            params: {},
            data
        })
    }
    static list(data) {
        return request({
            url: prefix + '/list',
            method: 'post',
            params: {},
            data
        })
    }
}