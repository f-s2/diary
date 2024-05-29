import request from '@/utils/request'


const prefix = `/business`
export class WorkApi {

    static list(data) {
        return request({
            url: prefix + '/task/pageList',
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

    static getCount() {
        return request({
            url: prefix + '/task/count-unfinished',
            method: 'get',
            params: {},
        })
    }
}
const sparePrefix = `/business/inventory-type`
export class MaintenanceApi {
    static detail(id) {
        return request({
            url: prefix + '/maintenance/' + id,
            method: 'get',
            params: {},
        })
    }
    static planDetail(id) {
        return request({
            url: prefix + '/maintenance-plan/' + id,
            method: 'get',
            params: {},
        })
    }
    static itemList(data) {
        return request({
            url: prefix + '/maintenance-benchmark/item/list',
            method: 'post',
            params: {},
            data
        })
    }
    static updateItem(data) {
        return request({
            url: prefix + '/maintenance-plan/item/update',
            method: 'post',
            params: {},
            data
        })
    }

}
export class SpareApi {
    static tree(data) {
        return request({
            url: sparePrefix + '/list-all',
            method: 'post',
            params: {},
            data
        })
    }
}
