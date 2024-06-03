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

    static getCount(data) {
        return request({
            url: prefix + '/task/count-unfinished',
            method: 'post',
            params: {},
            data
        })
    }
}
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
    static handle(data) {
        return request({
            url: prefix + '/maintenance/handle',
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
export class InspectionkApi {
    static detail(id) {
        return request({
            url: prefix + '/inspection/' + id,
            method: 'get',
            params: {},
        })
    }
    static planDetail(id) {
        return request({
            url: prefix + '/inspection-plan/' + id,
            method: 'get',
            params: {},
        })
    }
    static itemList(data) {
        return request({
            url: prefix + '/inspection-benchmark/item/list',
            method: 'post',
            params: {},
            data
        })
    }
    static handle(data) {
        return request({
            url: prefix + '/inspection/handle',
            method: 'post',
            params: {},
            data
        })
    }
    static updateItem(data) {
        return request({
            url: prefix + '/inspection-plan/item/update',
            method: 'post',
            params: {},
            data
        })
    }
}
export class SpareApi {
    static list(data) {
        return request({
            url: prefix + '/spare-parts/list',
            method: 'post',
            params: {},
            data
        })
    }
}
export class InventoryApi {
    static detailPage(data) {
        return request({
            url: prefix + '/inventory/count/detail/pageList',
            method: 'post',
            params: {},
            data
        })
    }
    static confirm(data) {
        return request({
            url: prefix + '/inventory/confirm',
            method: 'post',
            params: {},
            data
        })
    }

}
