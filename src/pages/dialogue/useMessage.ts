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
            "java.io.FileOutputStream",
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
        (err) => reject(err),
      );
    });
  });
}
// #endif

export enum UserReactionEnum {
  None,
  Like,
  Dislike,
}

export interface ItemType {
  type: MessageTypeEnum;
  data: ConfirmNode[];
  userReaction?: UserReactionEnum;
  id?: string;
  /** 用于判断节点状态是否结束 */
  isNodeEnd?: boolean
}

export interface ConfirmNode extends ResponseData {
  replyContent?: 0 | 1;
  isEnd?: boolean;
}

export interface ResponseData {
  msgType?:
    | "CONFIRM_REPLY"
    | "CONFIRM_TIMEOUT"
    | "CONFIRM"
    | WB_Enum.AI_END
    | WB_Enum.AI_START | "NODE" | "NODE_END";
  content?: string;
  styleType?: number;
  commandName?: string
}

export function transformerData(data: string | ArrayBuffer | object): undefined | ConfirmNode {
  try {
    if(data instanceof ArrayBuffer) {
      return undefined
    }

    if(typeof data === 'object') {
      return data as ConfirmNode
    }

    const target = JSON.parse(data);
    return target;
  } catch (error) {
    return undefined;
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

  const currentAIMessage = computed(() =>
    list.value[list.value.length - 1]?.type === MessageTypeEnum.AI &&
    !isMessageEnd.value
      ? list.value[list.value.length - 1]
      : undefined,
  );

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
      isPlaying.value = false;
      if (audioList.value[currentIndex.value]) {
        currentIndex.value++;
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
    
    const targetContent = transformerData(options.content);
    // 主要用于处理 10s 延时相关显示逻辑
    if(targetContent?.msgType === 'NODE_END') {
      return lastData.isNodeEnd = true
    }
    
    if (lastData?.type !== options.type) isStoped.value = false;

    if (
      options.type === MessageTypeEnum.AI &&
      targetContent?.msgType === WB_Enum.AI_END
    ) {
      lastData.id = targetContent?.content;
      isMessageEnd.value = true;
      lastData.isNodeEnd = true
      return;
    }
  
    if (!targetContent) {
      audioList.value.push(options.content);
      isAudioEnd.value = false;
    } else {
      if (targetContent.msgType === "CONFIRM_TIMEOUT") {
        lastData.data.forEach((v: any) => {
          if (v?.content === targetContent.content) {
            v.isEnd = true;
          }
        });
        playNext();
      } else {
        if (!lastData || lastData.type !== options.type) {
          const target = {
            type: options.type,
            data: [targetContent],
          };
          list.value.push(target);
        } else {
          lastData.data.push(targetContent);
        }
        _options.pushAfter();
      }
    }

    // 新消息开始时，需要手动停止且清空未播放完毕的音频
    if (
      options.type === MessageTypeEnum.AI &&
      targetContent?.msgType === WB_Enum.AI_START
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
    if (lastData.type === MessageTypeEnum.AI) {
      lastData.data.forEach((v) => {
        if (v?.msgType === 'CONFIRM') {
          v.isEnd = true;
        }
      });

      lastData.isNodeEnd = true
    }
  };

  const initStatus = () => {
    isMessageEnd.value = true;
    isAudioEnd.value = true;
    list.value = [];
    currentIndex.value = 0;
    audioList.value = [];

//     list.value = [
//     {
//         type: MessageTypeEnum.AI,
//         data: [
//             {
//                 msgType: 'NODE',
//                 commandName: '测试指令1',
//                 content: '节点开始'
//             },
//             {
//                 msgType: 'NODE',
//                 commandName: '测试指令1',
//                 content: '节点开始'
//             },
//             {
//                 msgType: 'NODE',
//                 commandName: '测试指令2',
//                 content: '节点开始2'
//             },
//             {
//                 msgType: 'NODE',
//                 commandName: '测试指令1',
//                 content: '节点开始3'
//             },
//             {
//                 commandName: '测试指令1',
//                 content: '节点结束'
//             },
//             {
//                 msgType: 'NODE',
//                 commandName: '测试指令1',
//                 content: '节点开始3'
//             },
//             {
//                 commandName: '测试指令1',
//                 content: '节点结束'
//             },
//             {
//                 msgType: 'NODE',
//                 commandName: '测试指令1',
//                 content: '节点开始3'
//             },
//             {
//                 commandName: '测试指令1',
//                 content: '节点结束'
//             },
//         ]
//     }
// ]

  };

  return {
    isMessageEnd,
    isAudioEnd,
    currentAIMessage,
    pushData,
    list,
    initStatus,
    stopAI,
    playNext,
  };
}
