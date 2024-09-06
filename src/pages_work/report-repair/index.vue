<template>
    <div class="repair-body">
        <uv-navbar title="设备报修" bg-color="linear-gradient(103deg, #0051B2 -6%, #127ED0 105%)" :titleStyle="{
            color: '#fff',
            fontWeight: 'bold'
        }" leftIconColor="#fff">
        </uv-navbar>

        <div class="main-info">

            <div class="info-item">
                <span class="label">设备名称</span>
            </div>

        </div>
        <htz-image-upload mediaType="all" :max="3" v-model="fileList" :uploadSuccess="uploadSuccess"
            :action="netConfig.baseName + '/business/picture/upload'"></htz-image-upload>

    </div>
</template>

<script setup>
import htzImageUpload from '@/components/htz-image-upload/htz-image-upload.vue';
import { netConfig } from '@/config/net.config';
import { ref } from 'vue';
uni.hideTabBar()

const fileList = ref([])

const uploadSuccess = (res) => {
    const _res = JSON.parse(res.data);
    console.log(_res, 'res',);
    if (_res.code == 0) {
        return {
            success: true,
            url: 'http://opentest.shlongtian.com:31342/profile/' + _res.data.name
        }
    } else {
        return {
            success: false,
            url: ''
        }
    }
}



</script>
<style lang='scss' scoped>
.repair-body {
    display: flex;
    flex-direction: column;
    gap: 20rpx;
    margin-top: $header-height;
    padding: 20rpx;
}

.main-info {
    background-color: #fff;
    border-radius: 10px;
    padding: 40rpx;
}
</style>