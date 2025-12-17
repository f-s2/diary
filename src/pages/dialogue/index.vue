<script setup lang="ts">
import { onReady } from '@dcloudio/uni-app';
import { FySpeechRecog, FyPermission } from '@/uni_modules/fy-speech-recog';
import { ref } from 'vue';

let recogHandle = null;

const flag = ref(1)

    onReady(() => {
         const permis = new FyPermission();
        permis.requestPermission({
            success: function () {
                recogHandle = new FySpeechRecog({
                    APP_ID: "121366898",
                    APP_KEY: "Nek66Zg7ycC37rdfcUD0Ppiz",
                    SECRET: "Atv0KnnVPFNSVGvuU4rtTaAaVPkh6ltX",
                });
            }
        })
    })

    function handleStartWU() {
            recogHandle && recogHandle.startWakeUp({
                    WP_WORDS_FILE: plus.io.convertLocalFileSystemURL("/static/WakeUp.bin")
                }, {
                success: function(res) {
                    flag.value ++;
                    console.log(res)
                }
            });
        }
        // 停止语音唤醒
        function handleStopWU() {
            recogHandle && recogHandle.stopWakeUp();
        }
        // 开启语音识别
        function handleStart() {
            recogHandle && recogHandle.startRecognizer({ AUDIO_MILLS: 0, ACCEPT_AUDIO_DATA: true }, {
                listener: function(res) {
                    try {
                        const recogRes = JSON.parse(res);
                        console.log(recogRes);
                        if (recogRes.resultWold && [6, 11061, 7].includes(recogRes.status)) { // 临时识别、最终识别、长语音识别
                            console.log(recogRes.resultWold);
                        }
                    } catch(err) {
                        console.log(err);
                    }
                },
                audioCallback: (audioData, offset, length) => {
                    console.log('收到音频数据，长度:', length);
                    // 处理音频数据，audioData是PCM格式，16bits 16000采样率
                    // 可以保存到文件或进行其他处理
                }
            })
        }
        // 停止语音识别
        function handleStop() {
            recogHandle && recogHandle.stopRecognizer();
        }

</script>

<template>
   <view class="content pt-200px">
        <view class="">
            {{ flag }}
            <button @click="handleStartWU">语音唤醒开始</button>
            <button @click="handleStopWU">语音唤醒结束</button>
            <view style="width: 750rpx;height: 2px;background-color: #000000;margin-top: 30px;"></view>
            <button @click="handleStart">语音识别开始</button>
            <button @click="handleStop">语音识别结束</button>
        </view>
    </view>
</template>