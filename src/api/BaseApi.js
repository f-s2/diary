
import { netConfig } from '@/config/net.config'
export class BaseApi {
    static upload(file) {

        return new Promise((resolve, reject) => {
            uni.uploadFile({
                url: netConfig.baseURL + '/business/picture/upload',
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
}
