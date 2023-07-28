import request from '@/utils/request'


const prefix = `/business/execute-order`
export class WorkApi {

    static list(data) {
        return request({
            url: prefix + '/list',
            method: 'post',
            params: {},
            data
        })
    }
    static statistics(data) {
        return request({
            url: prefix + '/statistics',
            method: 'post',
            params: {},
            data
        })
    }
    static temSave(data) {
        return request({
            url: prefix + '/save-inventory',
            method: 'post',
            params: {},
            data
        })
    }
    static saveFiles(data) {
        return request({
            url: prefix + '/save-files',
            method: 'post',
            params: {},
            data
        })
    }
    static pictures(data) {
        return request({
            url: prefix + '/pictures',
            method: 'post',
            params: {},
            data
        })
    }
    static detail(id) {
        return request({
            url: prefix + '/' + id,
            method: 'get',
            params: {},
        })
    }

    static finish(data) {
        return request({
            url: prefix + '/finish',
            method: 'post',
            params: {},
            data
        })
    }
    static updateSingle(data) {
        return request({
            url: `/business/inventory-outbound/update`,
            method: 'post',
            params: {},
            data
        })
    }
}
