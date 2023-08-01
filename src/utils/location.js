
import { getLocation } from "@/api/UserApi";
export const getAddress = () => {
    uni.showLoading();
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
                        uni.hideLoading();
                    });
            },
        });
    })

}