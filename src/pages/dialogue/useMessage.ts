import { computed, ref, watch, watchEffect } from "vue";
import { MessageTypeEnum, WB_Enum } from "./config";
import { isString } from "@/components/da-tree/utils";

// #ifdef APP
function writeMp3(buffer: ArrayBuffer): Promise<string> {
  return new Promise((resolve, reject) => {
    plus.io.requestFileSystem(plus.io.PRIVATE_DOC, (fs) => {
      fs.root.getFile(
        `audio_${Date.now()}.mp3`,
        { create: true },
        (entry) => {
          var fullPath = entry.fullPath;
          const Base64 = plus.android.importClass("android.util.Base64") as any;
          const FileOutputStream = plus.android.importClass(
            "java.io.FileOutputStream"
          ) as any;
          try {
            const _base64Str = uni.arrayBufferToBase64(buffer);

            const index = _base64Str.indexOf(",");
            const base64Str = _base64Str.slice(index + 1, _base64Str.length);

            const out = new FileOutputStream(fullPath);
            const bytes = Base64.decode(base64Str, Base64.DEFAULT);
            out.write(bytes);
            out.close();
            resolve(entry.toLocalURL());
          } catch (e) {
            console.log(e.message);
          }
        },
        (err) => reject(err)
      );
    });
  });
}
// #endif

export enum UserReactionEnum {
  None,
  Like,
  Dislike
}

export interface ItemType {
  type: MessageTypeEnum;
  data: (string | ConfirmNode)[];
  userReaction?: UserReactionEnum,
  id?: string
}

export interface ConfirmNode {
  msgType: "CONFIRM_REPLY" | "CONFIRM_TIMEOUT" | "CONFIRM";
  commandId: string;
  replyContent: 0 | 1;
  isEnd?: boolean;
}

export function transformerData(data: string): string | ConfirmNode {
  try {
    const target = JSON.parse(data);
    if (typeof target !== "number") {
      return target;
    } else {
      return data;
    }
  } catch (error) {
    return data;
  }
}

export default function useMessage(_options: {
  pushAfter?: () => void;
  AIStart?: () => void;
  AIEnd?: () => void;
}) {
  const isMessageEnd = ref(true);
  const isAudioEnd = ref(true);

  const list = ref<ItemType[]>([]);

  const currentAIMessage = computed(() => (list.value[list.value.length - 1]?.type === MessageTypeEnum.AI && !isMessageEnd.value)? list.value[list.value.length - 1] : undefined);

  const audioList = ref<ArrayBuffer[]>([]);

  watch(isMessageEnd, (nv) => {
    if (nv) {
      _options?.AIEnd();
    }
  });

  const currentIndex = ref(0);

  const isPlaying = ref(false);

  const isStoped = ref(false);

  const currentAudio = uni.createInnerAudioContext();

  currentAudio.onEnded(() => {
    isPlaying.value = false;
    console.log("播放完毕 audio");

    if (
      currentIndex.value >= audioList.value.length - 1 &&
      isMessageEnd.value
    ) {
      isAudioEnd.value = true;
    } else {
      currentIndex.value++;
      playNext();
    }
  });

  const playNext = async (sync = false) => {

    if (sync) {
      currentAudio.stop();
      isPlaying.value = false
      if(audioList.value[currentIndex.value]) {
        currentIndex.value ++
      }
      playNext();
      return;
    }

    if (
      isPlaying.value ||
      !audioList.value[currentIndex.value] ||
      isAudioEnd.value
    )
      return;

    // #ifdef APP

    const target = audioList.value[currentIndex.value];

    // console.log("当前播放的是", target);

    const current = target as ArrayBuffer;
    isAudioEnd.value = false;
    isPlaying.value = true;

    const path = await writeMp3(current);
    currentAudio.src = path;
    currentAudio.play();
    // #endif
  };

  const pushData = (options: { type: MessageTypeEnum; content: any }) => {
    const lastData = list.value[list.value.length - 1];    

    if (lastData?.type !== options.type) isStoped.value = false;

    if (
      options.type === MessageTypeEnum.AI &&
      isString(options.content) && options.content.startsWith(WB_Enum.AI_END)
    ) {
      lastData.id = options.content.split(':')[1]
      isMessageEnd.value = true;
      return;
    }

    if (typeof options.content !== "string") {
      audioList.value.push(options.content);
      isAudioEnd.value = false
    } else {
      const tagrgetContent = transformerData(options.content);

      if (typeof tagrgetContent === "string" || ['CONFIRM'].includes(tagrgetContent.msgType)) {
        if (!lastData || lastData.type !== options.type) {
          const target = {
            type: options.type,
            data: [tagrgetContent],
          };
          list.value.push(target);
        } else {
          lastData.data.push(tagrgetContent);
        }
        _options.pushAfter()
      } else {
        if(tagrgetContent.msgType === 'CONFIRM_TIMEOUT') {
          lastData.data.forEach((v:any) => {
            if(v?.commandId === tagrgetContent.commandId) {
              v.isEnd = true
            }
          })
          playNext()
        }
      }
    }

    // 新消息开始时，需要手动停止且清空未播放完毕的音频
    if (
      options.type === MessageTypeEnum.AI &&
      options.content === WB_Enum.AI_START
    ) {
      currentIndex.value = 0;
      isPlaying.value = false;
      isStoped.value = false;

      currentAudio.stop();
      audioList.value = [];
      _options.AIStart();
    }

    if (options.type === MessageTypeEnum.User) {
      isMessageEnd.value = false;
    }

    // 需要等到状态都设置完成后，再开始播放
    playNext();

  };

  const stopAI = () => {
    isStoped.value = true;
    isAudioEnd.value = true;
    currentAudio.stop();
    audioList.value = [];

    const lastData = list.value[list.value.length - 1];
    // 手动停止 AI 之后需要手动结束所有确认节点
    if(lastData.type === MessageTypeEnum.AI) {
      lastData.data.forEach((v:any) => {
        if(v?.commandId) {
          v.isEnd = true
        }
      })
    }
    
  };

  const initStatus = () => {
    isMessageEnd.value = true;
    isAudioEnd.value = true;
    list.value = [];
    currentIndex.value = 0;
    audioList.value = [];
  };

  return {
    isMessageEnd,
    isAudioEnd,
    currentAIMessage,
    pushData,
    list,
    initStatus,
    stopAI,
    playNext
  };
}
