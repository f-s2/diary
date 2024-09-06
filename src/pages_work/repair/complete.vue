<template>
    <div class="page-body">
        <u-loading v-if="loading" />

        <div class="sub-title">
            <span class="label">上传视频和图片</span>
        </div>
        <htz-image-upload :dataType="1" :max="9" mediaType="all" v-model="fileList" :uploadSuccess="uploadSuccess"
            :action="netConfig.baseName + '/business/picture/upload'"></htz-image-upload>
        <div class="bottom-btn">
            <uv-button type="primary" @click="handleSave">提交</uv-button>

        </div>
    </div>
</template>

<script setup>
import { RepairApi } from "@/api/WorkApi";
import htzImageUpload from '@/components/htz-image-upload/htz-image-upload.vue';
import { netConfig } from '@/config/net.config';
import { useUserStore } from '@/store/user';
import { onLoad } from "@dcloudio/uni-app";
import { ref } from 'vue';

const userStore = useUserStore()

const baseInfo = ref({})
onLoad((data) => {
    baseInfo.value = data

})

const fileList = ref([])

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
const loading = ref(false)

const handleSave = () => {
    uni.showModal({
        content: fileList.value?.length ? '请确定是否提交？' : '未上传图片和视频，审核可能会不予通过，确定是否继续提交？',
        showCancel: true,
        success: function (res) {
            if (res.confirm) {
                const { id } = baseInfo.value
                loading.value = true
                RepairApi.finish({ id, repairFinishFiles: fileList.value.map(item => ({ fileType: item.type, relContext: item.name })) }).then(res => {
                    if (res.code === 0) {
                        uni.showToast({
                            title: '请求成功'
                        })
                        uni.navigateBack()
                    }

                }).finally(() => {
                    loading.value = false
                })
            } else if (res.cancel) {
            }
        }
    })

}

</script>
<style lang='scss' scoped>
.page-body {
    padding-bottom: 100px;
}

.bottom-btn {
    display: flex;

    .uv-button-wrapper {
        flex: 1;
    }

    gap:40rpx
}

.sub-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    font-weight: bold;
    margin: 12px 0;
}
</style>