import request from '@/utils/request';


const prefix = `/business/home-page`
export class HomeApi {

    static mine(data) {
        return request({
            url: prefix + '/performance/mine',
            method: 'post',
            params: {},
            data
        })
    }
    static maintenance(data) {
        return request({
            url: prefix + '/maintenance/overview',
            method: 'post',
            params: {},
            data
        })
    }
    static inspection(data) {
        return request({
            url: prefix + '/inspection/overview',
            method: 'post',
            params: {},
            data
        })
    }


}
