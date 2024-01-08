
import { getLocation } from "@/api/UserApi";
export const getAddress = () => {
    return new Promise((resolve, reject) => {
        uni.getLocation({
            type: "gcj02",
            success: (res) => {
                console.log("res", res);
                const { latitude, longitude } = res;
                location = { latitude, longitude };
                getLocation({ location: `${latitude},${longitude}` })
                    .then((res) => {
                        resolve(res?.data?.result)
                    })
                    .catch(reject)
                    .finally(() => {
                    });
            },
            fail: (err) => {
                uni.showModal({
                    title: "提示!",
                    content: '请确保您位置定位权限已打卡!',
                    showCancel: false
                })
                reject(err)
            }
        });
    })

}