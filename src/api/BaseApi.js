
import { netConfig } from '@/config/net.config'
import request from '@/utils/request'

export class BaseApi {
    static upload(file) {

        return new Promise((resolve, reject) => {
            uni.uploadFile({
                url: netConfig.baseName + '/business/picture/upload',
                method: 'post',

                name: 'file',
                filePath: file,
                fail: reject,
                success: res => {
                    resolve(JSON.parse(res.data))
                }
            })
        })

    }
    static getDict(dictCode) {
        return request({
            url: '/userservice/system/dict/child/pageList',
            method: 'post',
            params: {},
            data: {
                dictCode
            }
        })
    }
}
