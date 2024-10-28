<template>
    <div class="page-body">
        <div class="sub-title">
            设备信息
        </div>
        <div class="describe-box" style="margin-bottom: 12px">
            <div :class="['describe-item', { wrap: item.wrap }]" v-for="item in baseConfig" :key="item.name">
                <div class="describe-label">
                    {{ item.name }}</div>
                <div class="describe-value">
                    <span v-if="!item.custom">
                        {{ formData?.[item.code] || "--" }}
                    </span>
                    <span v-if="item.code === 'type'">
                        <status-tag :status="3" :tag="true" />
                    </span>

                </div>
            </div>
        </div>
        <uv-form labelPosition="left" :model="formData" :rules="rules" ref="formRef" labelWidth="auto">

            <div class="form-card">

                <uv-form-item label="故障描述 :" prop="malfunctionDescription" labelPosition="top" borderBottom>

                    <uv-textarea border="none" v-model="formData.malfunctionDescription"
                        placeholder="请输入内容"></uv-textarea>


                </uv-form-item>
                <!-- <uv-form-item label="" prop="malfunctionDescription" labelPosition="top" borderBottom>
                    <recorder ref='recorder' @success='handlerSuccess' @error='handlerError' />
                    {{ isRun }}
                    <button @touchstart="handlerOnCahnger" @touchend="handlerOnCahnger">按住录音</button>
                    <audio-wave />
                </uv-form-item> -->
                <uv-form-item label="图片视频 :" labelPosition="top">
                    <div>

                        <htz-image-upload :dataType="1" :max="9" mediaType="all"
                            :action="netConfig.baseName + '/business/picture/upload'" v-model="formData.repairFiles"
                            :uploadSuccess="uploadSuccess"></htz-image-upload>
                    </div>
                </uv-form-item>
            </div>
        </uv-form>
        <div class="bottom-btn">
            <uv-button type="primary" @click="handleSave"> 报修 </uv-button>
        </div>

    </div>
</template>

<script setup>
import { RepairApi } from "@/api/WorkApi";
import htzImageUpload from '@/components/htz-image-upload/htz-image-upload.vue';
import { netConfig } from '@/config/net.config';
import { useUserStore } from '@/store/user';
import { onLoad } from '@dcloudio/uni-app';
import { ref } from 'vue';


const userStore = useUserStore()
uni.hideTabBar()

const formData = ref({})
const baseId = ref('')
onLoad(({ id }) => {
    baseId.value = id
    getInfo()
})


const getInfo = () => {
    RepairApi.deviceDetail(baseId.value).then(res => {
        const { code, name, factoryModelName, id: deviceId } = res.data
        formData.value = { deviceId, code, name, factoryModelName, malfunctionDescription: '', repairFiles: [] }
    })
}
const rules = {}


const baseConfig = [
    {
        name: '设备名称',
        code: 'name'
    },
    {
        name: '设备编码',
        code: 'code'
    },

    {
        name: '位置',
        code: 'factoryModelName'
    },

]


const uploadSuccess = (res) => {
    const _res = JSON.parse(res.data);
    if (_res.code == 0) {
        return {
            success: true,
            url: userStore.userInfo.urlPrefix + _res.data.name,
            name: _res.data.name
        }
    } else {
        return {
            success: false,
            url: ''
        }
    }
}

const recorder = ref()


const formRef = ref()
const handleSave = async () => {
    await formRef.value.validate()
    uni.showModal({
        content: '请确定是否提交报修?',
        success: function (res) {
            if (res.confirm) {
                const { repairFiles } = formData.value
                RepairApi.add({
                    ...formData.value, repairFiles: repairFiles.map(item => ({ fileType: item.type, relContext: item.name })),
                }).then(res => {
                    if (res.code === 0) {
                        uni.showToast({
                            title: '请求成功'
                        })
                        // uni.switchTab({
                        //     url: '/pages_work/index/index'
                        // })
                    }
                })

            }
        }
    })


}

const isRun = ref(false)
const handlerOnCahnger = () => {
    if (isRun.value) {
        recorder.value.stop()
    } else {
        recorder.value.start()
    }
    isRun.value = !isRun.value
}
const localUrl = ref('')
const innerAudioContext = uni.createInnerAudioContext();

const handlerSuccess = async (res) => {
    localUrl.value = res.localUrl
    innerAudioContext.src = res.localUrl
    innerAudioContext.play()
}

const handlerError = (code) => {
    switch (code) {
        case '101':
            uni.showModal({
                content: '当前浏览器版本较低，请更换浏览器使用，推荐在微信中打开。'
            })
            break;
        case '201':
            uni.showModal({
                content: '麦克风权限被拒绝，请刷新页面后授权麦克风权限。'
            })
            break
        default:
            uni.showModal({
                content: '未知错误，请刷新页面重试'
            })
            break
    }
}


</script>
<style lang='scss' scoped>
.page-body {
    display: flex;
    flex-direction: column;
    gap: 20rpx;
    padding-bottom: 100px;
}

.sub-title {
    font-size: 16px;
    font-weight: bold;
    text-indent: 10px;
}

.form-card {
    background-color: #fff;
    padding: 20rpx;
    border-radius: 10rpx;
}
</style>
