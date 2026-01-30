// #ifdef APP
// @ts-ignore
import { FySpeechRecog, FyPermission } from "@/uni_modules/fy-speech-recog";
// #endif

import { SpeechRecogConfig } from "../config";
import { ref } from "vue";
import { DialogueApi } from "@/api/dialogue";
import { writeMp3 } from "../useAudio";

// #ifdef H5
const FySpeechRecog = null;
const FyPermission = null;
// #endif

let recogHandle = ref();

const hellowAudio = ref()

export default function useBaiduVoice(options?: {
    startWU: () => void
    sendData: (data:any) => void
    voiceOver: () => void
    helloEnd: () => void
}) {

  const currentAudio = uni.createInnerAudioContext();

  currentAudio.onEnded(() => {
    options.helloEnd()
  })

  function initHello() {
     DialogueApi.synthesisAudio('你好, 我在').then(async (res) => {
      hellowAudio.value = await writeMp3(res as any);
    })
  }

  async function playHello() {    
     currentAudio.src = hellowAudio.value;
     currentAudio.play();
  }

  function init() {    
    // initAudio()
    const permis = new FyPermission();
    permis.requestPermission({
      success: function () {
        recogHandle.value = new FySpeechRecog(SpeechRecogConfig);
        console.log("成功注册");

        handleStartWU();
      },
    });
  }

  // 开始唤醒功能
  function handleStartWU() {
      recogHandle.value?.startWakeUp(
        {
          WP_WORDS_FILE:
            plus.io.convertLocalFileSystemURL("/static/WakeUp.bin"),
        },
        {
          success: async function (res) {
            console.log("开始唤醒");
            
            options.startWU()
            playHello()
          },
          fail(err) {
            console.log("唤醒失败", err);
          },
        },
      );
  }
  // 停止语音唤醒
  function handleStopWU() {
    recogHandle.value?.stopWakeUp();
  }


let timer:any = null

function checkRecording() {
  timer && clearTimeout(timer);

  timer = setTimeout(() => {
    handleStop()
    options.voiceOver();
  }, 5000);
}

  // 开启语音识别功能
function handleStart() {
        recogHandle.value?.startRecognizer(
            {
                AUDIO_MILLS: 0,
                ACCEPT_AUDIO_DATA: true,
                VAD_ENDPOINT_TIMEOUT: 1000,
                DECODER: 2,
            },
            {
                listener: function (res) {
                    try {
                        const recogRes = JSON.parse(res);
                        console.log(recogRes);
                        if (
                            recogRes.resultWold &&
                            [6, 11061, 7].includes(recogRes.status)
                        ) {
                            // 临时识别、最终识别、长语音识别
                            console.log(recogRes.resultWold);
                        }

                        if (recogRes.status === 2) {
                            clearTimeout(timer)                            
                            options.voiceOver();
                        }
                    } catch (err) {
                        console.log(err);
                    }
                },
                audioCallback: (audioData, offset, length) => {
                    console.log("收到音频数据，长度:", length);
                    // console.log(audioData);

                    options.sendData(audioData);
                    checkRecording()
                    // 处理音频数据，audioData是PCM格式，16bits 16000采样率
                    // 可以保存到文件或进行其他处理
                },
            },
        );
}
/** 停止语音识别功能 */
function handleStop() {
    recogHandle.value?.stopRecognizer();
}

  return {
    initBaiduVoice: init,
    handleStartWU,
    handleStopWU,
    handleStart,
    handleStop,
    initHello
  }
}
