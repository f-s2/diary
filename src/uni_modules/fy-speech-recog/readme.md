# fy-speech-recog
### 开发文档
[UTS 语法](https://uniapp.dcloud.net.cn/tutorial/syntax-uts.html)
[UTS API插件](https://uniapp.dcloud.net.cn/plugin/uts-plugin.html)
[UTS 组件插件](https://uniapp.dcloud.net.cn/plugin/uts-component.html)
[Hello UTS](https://gitcode.net/dcloud/hello-uts)

# 注意: uniapp x不支持 【试用插件】，试用插件建议用uniapp项目。uniapp x项目仅支持源码版，原因试用、普通授权版会对源码加密导致插件追踪不到对应方法， 并且uts似乎不支持装饰器，后续兼容后会更新

# 插件对外暴露FyPermission和FySpeechRecog两个类

#  1.FyPermission使用说明
### FyPermission授权的事件说明
|  方法 | 参数  | 返回 | 说明 |
| ------------ | ------------ | ------------ | ------------ |
|  check | void  | Boolean | 判断权限是否已经被用户授予 |
|  requestPermission | RequestPermissionOptions  |  void | 请求系统权限 |

### RequestPermissionOptions 说明
|  参数名 | 必填  | 返回 | 说明 |
| ------------ | ------------ | ------------ | ------------ |
|  success | 否  | (res: string) => void | 获取权限成功 |
|  fail | 否  |  (res: string) => void | 获取权限失败；获取失败后再次调起授权会提示打开权限设置页面 |


### uniapp例子
```
import { FyPermission } from '@/uni_modules/fy-speech-recog';
const permis = new FyPermission();
permis.requestPermission({
	success: function (res) {
		console.log(res);
	},
	fail: function(res){
		console.log(res);
	}
})
```
### uniapp x例子
```
import { FyPermission } from '@/uni_modules/fy-speech-recog';
const permis = new FyPermission();
permis.requestPermission({
	success: function (res: string) {
		console.log(res);
	},
	fail: function(res: string){
		console.log(res);
	}
})
```


#  2.FySpeechRecog使用说明

### 构造函数OBJECT 参数说明
|  参数名 | 类型  | 必填 | 说明 |
| ------------ | ------------ | ------------ |  ------------ |
|  APP_ID | string  | 是 | 百度开放平台创建应用后分配的鉴权信息 |
|  APP_KEY | string  | 是 | 百度开放平台创建应用后分配的鉴权信息 |
|  SECRET | string  | 是 | 百度开放平台创建应用后分配的鉴权信息 |

### FySpeechRecog的事件说明
|  方法 | 参数  | 返回 | 说明 |
| ------------ | ------------ | ------------ | ------------ |
|  getWPStatus | void  | boolean | 获取唤醒状态 |
|  getRZStatus | void  |  boolean | 获取语音识别状态 |
|  startWakeUp | options: WakeUpOptions, callbackOptions: WakeUpCallbackOptions  |  void | 点击“开始识别”按钮，发送开始事件开始唤醒 |
|  stopWakeUp | void  |  void | 停止唤醒 |
|  startRecognizer | options: RecogOptions, callbackOptions: RecogCallbackOptions  |  void | 开启语音识别 |
|  startOffRecognizer | options: RecogOptions, callbackOptions: RecogCallbackOptions  |  void | 开启离线语音识别 |
|  stopRecognizer | void  |  void | 停止语音识别 |
|  asrStop | void  |  void | ASR_STOP |
|  asrCancel | void  |  void | ASR_CANCEL |

### WakeUpOptions参数说明
|  参数名 | 必填  | 类型 | 说明 |
| ------------ | ------------ | ------------ | ------------ |
|  WP_WORDS_FILE | 是  | string | 唤醒词bin文件，前往[百度语音唤醒配置](https://ai.baidu.com/tech/speech/wake)；uniapp项目将下载WakeUp.bin文件后可以放在static文件夹中，uniapp x项目将下载WakeUp.bin文件后可以放在uni_modules/fy-speech-recog/utssdk/app-android/assets文件夹中。具体使用看下方案例 |
|  IN_FILE | 否  | string | 文件路径资源路径或回调方法名 |
|  ACCEPT_AUDIO_DATA | 否  | boolean | 默认关闭。开启后，会有音频回调（CALLBACK_EVENT_WAKEUP_AUDIO），很占资源 |
|  WP_ENGINE_LICENSE_FILE_PATH | 否  | string | 不填写，在联网时会获取自动获取离线正式授权。有特殊原因可用在官网下载临时授权文件，配置此参数，支持android asset目录（如assets:///mylicense.dat) |
|  SAMPLE_RATE | 否  | Int | 16000（默认值，且唤醒仅支持16k采样） |


### WakeUpCallbackOptions参数说明
|  参数名 | 必填  | 类型 | 说明 |
| ------------ | ------------ | ------------ | ------------ |
|  success | 否  | (res: string) => void  | 唤醒成功 |
|  fail | 否  | (res: string) => void  | 唤醒失败 |
|  stop | 否  | () => void  | 唤醒结束 |


### RecogOptions参数说明
|  参数名 | 必填  | 类型 | 说明 |
| ------------ | ------------ | ------------ | ------------ |
|  AUDIO_MILLS | 是  | Int | 录音开始的时间点。用于唤醒+识别连续说。SDK有15s的录音缓存。如设置为(System.currentTimeMillis() - 1500),表示回溯1.5s的音频。 |
|  PID | 否  | Int | 场景: 在线；默认1537，即中文输入法模型，不带在线语义 |
|  LM_ID | 否  | Int | 场景: 在线；自训练平台上线后的模型Id，必须和自训练平台的PID连用。 |
|  DECODER | 否  | Int | 默认0，0=在线，2=离在线融合(在线优先)；离在线的并行策略 |
|  VAD | 否  | string | 默认VAD_DNN；可设置VAD_DNN或VAD_TOUCH；语音活动检测， 根据静音时长自动断句。注意不开启长语音的情况下，SDK只能录制60s音频。长语音请设置BDS_ASR_ENABLE_LONG_SPEECH参数；VAD_TOUCH=关闭语音活动检测。注意关闭后不要开启长语音。适合用户自行控制音频结束，但时长不能超过60s |
|  BDS_ASR_ENABLE_LONG_SPEECH | 否  | boolean | 是否开启长语音。 即无静音超时断句，开启后需手动调用ASR_STOP停止录音。 请勿和VAD=touch联用！优先级大于VAD_ENDPOINT_TIMEOUT 设置 |
|  VAD_ENDPOINT_TIMEOUT | 否  | Int | 静音超时断句及长语音 |
|  IN_FILE | 否  | string | 文件路径资源路径或回调方法名 |
|  OUT_FILE | 否  | string | 文件路径,保存识别过程产生的录音文件, 该参数需要开启ACCEPT_AUDIO_DATA后生效 |
|  NLU | 否  | string | 本地语义解析设置。必须设置ASR_OFFLINE_ENGINE_GRAMMER_FILE_PATH参数生效，无论网络状况，都可以有本地语义结果。并且本地语义结果会覆盖在线语义结果。本参数不控制在线语义输出，需要在线语义输出见PID参数 |
|  ASR_OFFLINE_ENGINE_GRAMMER_FILE_PATH | 否  | string | 用于支持本地语义解析的bsg文件，离线和在线都可使用。NLU开启生效，其它说明见NLU参数。注意bsg文件同时也用于ASR_KWS_LOAD_ENGINE离线命令词功能。 |
|  SLOT_DATA | 否  | string | 与ASR_OFFLINE_ENGINE_GRAMMER_FILE_PATH参数一起使用后生效 |
|  DISABLE_PUNCTUATION | 否  | boolean | 在选择1537开头的pid（输入法模式）的时候，是否禁用标点符号 |
|  ACCEPT_AUDIO_DATA | 否  | boolean | 是否需要语音音频数据回调，开启后有CALLBACK_EVENT_ASR_AUDIO事件 |
|  ACCEPT_AUDIO_VOLUME | 否  | boolean | 是否需要语音音量数据回调，开启后有CALLBACK_EVENT_ASR_VOLUME事件回调 |
|  SOUND_START | 否  | Int | 说话开始的提示音 |
|  SOUND_END | 否  | Int | 说话结束的提示音 |
|  SOUND_SUCCESS | 否  | Int | 识别成功的提示音 |
|  SOUND_ERROR | 否  | Int | 识别出错的提示音 |
|  SOUND_CANCEL | 否  | Int | 识别取消的提示音 |
|  SAMPLE_RATE | 否  | Int | 采样率 ，固定及默认值16000 |
|  ASR_OFFLINE_ENGINE_LICENSE_FILE_PATH | 否  | string | 临时授权文件路径 |


### RecogCallbackOptions参数说明
|  参数名 | 必填  | 类型 | 说明 |
| ------------ | ------------ | ------------ | ------------ |
|  listener | 否  | (res: string) => void  | 监听语音识别 |
|  audioCallback | 否  | (audioData: ByteArray, offset: Int, length: Int) => void  | 语音音频数据回调, 需要将ACCEPT_AUDIO_DATA设置为true才生效 |


### uniapp综合案例
```
<template>
	<view class="content">
		<view class="">
			<button @click="handleStartWU">语音唤醒开始</button>
			<button @click="handleStopWU">语音唤醒结束</button>
			<view style="width: 750rpx;height: 2px;background-color: #000000;margin-top: 30px;"></view>
			<button @click="handleStart">语音识别开始</button>
			<button @click="handleStop">语音识别结束</button>
		</view>
	</view>
</template>

<script>
import { FySpeechRecog, FyPermission } from '@/uni_modules/fy-speech-recog';
let recogHandle = null;
export default {
	data() {
		return {
			title: 'Hello'
		}
	},
	onReady() {
		const permis = new FyPermission();
		permis.requestPermission({
			success: function () {
				recogHandle = new FySpeechRecog({
					APP_ID: "百度开放平台拿到的APP_ID",
					APP_KEY: "百度开放平台拿到的APP_KEY",
					SECRET: "百度开放平台拿到的SECRET",
				});
			}
		})
	},
	methods: {
		// 开启语音唤醒
		handleStartWU() {
			recogHandle && recogHandle.startWakeUp({
					WP_WORDS_FILE: plus.io.convertLocalFileSystemURL("/static/WakeUp.bin")
				}, {
				success: function(res) {
					console.log(res)
				}
			});
		},
		// 停止语音唤醒
		handleStopWU() {
			recogHandle && recogHandle.stopWakeUp();
		},
		// 开启语音识别
		handleStart() {
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
		},
		// 停止语音识别
		handleStop() {
			recogHandle && recogHandle.stopRecognizer();
		}
	}
}
</script>
```
### uniapp x综合案例
```
<template>
	<view class="content">
		<button @click="handleStartWU">语音唤醒开始</button>
		<button @click="handleStopWU">语音唤醒结束</button>
		<view style="width: 750rpx;height: 2px;background-color: #000000;margin-top: 30px;"></view>
		<button @click="handleStart">语音识别开始</button>
		<button @click="handleStop">语音识别结束</button>
	</view>
</template>

<script>
	import { FySpeechRecog, FyPermission } from '@/uni_modules/fy-speech-recog';
	let recogHandle : FySpeechRecog | null = null;
	export default {
		data() {
			return {
				title: 'Hello'
			}
		},
		onReady() {
			const permis = new FyPermission();
			permis.requestPermission({
				success: function () {
					recogHandle = new FySpeechRecog({
						APP_ID: "百度开放平台拿到的APP_ID",
						APP_KEY: "百度开放平台拿到的APP_KEY",
						SECRET: "百度开放平台拿到的SECRET",
					});
				}
			})
		},
		methods: {
			// 开启语音唤醒
			handleStartWU() {
				recogHandle!.startWakeUp({
					WP_WORDS_FILE: 'assets:///WakeUp.bin', // uniapp x项目固定格式，uniapp x项目将下载WakeUp.bin文件后可以放在uni_modules/fy-speech-recog/utssdk/app-android/assets文件夹中
				}, {
					success: function (res: string) {
						console.log(res)
					}
				});
			},
			// 停止语音唤醒
			handleStopWU() {
				recogHandle!.stopWakeUp();
			},
			// 开启语音识别
			handleStart() {
				recogHandle!.startRecognizer({ AUDIO_MILLS: 0, ACCEPT_AUDIO_DATA: true }, {
					listener: function (res : string) {
						try {
							const recogRes = JSON.parse(res) as UTSJSONObject;
							console.log(recogRes);
							const status = recogRes.status as number;
							const allowStatus = [6, 11061, 7];
							const resultWold = recogRes.resultWold as string;
							if (resultWold.length > 0 && allowStatus.includes(status)) { // 临时识别、最终识别、长语音识别
								console.log(recogRes.resultWold);
							}
						} catch (err) {
							console.log(err);
						}
					},
					audioCallback: (audioData: ByteArray, offset: Int, length: Int) => {
						console.log('收到音频数据，长度:', length);
						// 处理音频数据，audioData是PCM格式，16bits 16000采样率
						// 可以保存到文件或进行其他处理
					}
				})
			},
			// 停止语音识别
			handleStop() {
				recogHandle!.stopRecognizer();
			}
		}
	}
</script>
```

# 重点注意事项
1. 导入插件后记得一定一定要重新打包自定义基座，并配置在百度AI开放平台填写的android包名；
2. 语音唤醒可以使用个人百度AI开放平台账号，但是语音识别个人账号免费额度是不行的，可以使用企业账号或者自行开通个人账号API权限。
3. 语音唤醒、语音识别和手机系统提供的智能助手功能不一样，需要开启录音等权限，需要先使用permis.requestPermission开启权限后才能使用语音唤醒和语音识别，流程一定不能出错。
4. WakeUpOptions、RecogOptions文档提供的参数不一定很全很正确，可以自行前往[百度官方文档查看](https://cloud.baidu.com/doc/SPEECH/s/3ltwvtg6u)。必填项都是正确和常用的。
5. 语音唤醒参数 WP_WORDS_FILE 放入WakeUp.bin文件后一定要重新制作自定义基座，可参考uniapp、uniapp x项目案例WakeUp.bin该如何放置。
6. 如报11002错误请检查制作的自定义基座的appid是否和百度应用创建的Android包名是否一致！！！
7. 如报11004 通常是没正确找到WakeUp.bin文件，请按照文档找到uniapp、uniapp x项目案例WakeUp.bin该如何放置。
8. 如有其它错误代码，请自行前往[百度官方文档对照](https://cloud.baidu.com/doc/SPEECH/s/3ltwvtg6u)

# 语音智能助手
1. 需要配合[fy-tts](https://ext.dcloud.net.cn/plugin?id=19370)语音播报、[fy-segment-words](https://ext.dcloud.net.cn/plugin?id=19374)文本分词可做简单的语音助手。
2. 如需语音控制app打开关闭可配合[fy-getinstall](https://ext.dcloud.net.cn/plugin?id=19368)即可打开其他应用程序，如微信、qq等；
3. 如需智能回答还可接入[uni-ai](https://doc.dcloud.net.cn/uniCloud/uni-ai.html)。注：收费功能

# 路线图
1. 目前没有规划ios sdk集成，但是后续会找时间继续集成进来。
