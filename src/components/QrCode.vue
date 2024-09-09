html结构
<template>
    <uv-button @click="openQrcode">扫码</uv-button>
    <uv-button @click="stopScan">停止</uv-button>
    <div class="reader-box" v-if="isScaning">
        <div class="reader" id="reader"></div>
    </div>
</template>

<script setup>
import { Html5Qrcode } from 'html5-qrcode';
import { ref } from "vue";
const html5Qrcode = ref()
const isScaning = ref(false)
const openQrcode = () => {
    isScaning.value = true;
    Html5Qrcode.getCameras().then((devices) => {
        if (devices && devices.length) {
            html5Qrcode.value = new Html5Qrcode('reader');
            html5Qrcode.value.start(
                {
                    facingMode: 'environment'
                },
                {
                    focusMode: 'continuous', //设置连续聚焦模式
                    fps: 5,       //设置扫码识别速度
                    qrbox: 280   //设置二维码扫描框大小
                },
                (decodeText, decodeResult) => {
                    console.log(decodeResult, decodeText);
                    if (decodeText) {	//这里decodeText就是通过扫描二维码得到的内容
                        uni.showModal({
                            title: decodeText,
                            showCancel: false
                        })
                        stopScan(); //关闭扫码功能
                    }
                },
                (err) => {
                    // console.log(err);  //错误信息
                }
            );
        }
    });
}

const stopScan = () => {
    console.log('停止扫码')
    isScaning.value = false;
    if (html5Qrcode.value) {
        html5Qrcode.value.stop();
    }
}

</script>
<style lang='scss' scoped>
css样式 .reader-box {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.5);
}

.reader {
    width: 100%;
    // width: 540rpx;
    // height: 540rpx;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
</style>