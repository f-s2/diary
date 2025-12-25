import { computed, ref, watch } from "vue";
import { MessageTypeEnum, WB_Enum } from "./config";

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

interface ItemType {
  type: MessageTypeEnum;
  data: (string | ArrayBuffer)[];
}

interface ConfirmNode {
  msgType: "CONFIRM_REPLY";
  commandId: string;
  replyContent: 0 | 1;
}

export default function useMessage(_options: {
  pushAfter?: () => void;
  AIStart?: () => void;
  AIEnd?: () => void;
}) {
  const isMessageEnd = ref(false);
  const isAudioEnd = ref(true);
  const isConfirmEnd = ref(true);
  const list = ref<ItemType[]>([]);
  const isAIEnd = computed(() => isMessageEnd.value && isAudioEnd.value && isConfirmEnd.value);

  watch(isAIEnd, (nv) => {
    if (nv) {
      console.error(
        "AI已经全部完成",
        currentIndex.value,
        lastAIMessage.value.length
      );

      _options?.AIEnd();
    }
  });

  const lastAIMessage = computed(() => {
    const target = list.value.slice(-1)?.[0];
    if (target?.type === MessageTypeEnum.AI) {
      return target.data;
    } else {
      return [];
    }
  });

  const lastShowAIMessage = ref<string[]>([]);

  const currentIndex = ref(0);

  const isPlaying = ref(false);

  const isStoped = ref(false);

  const currentAudio = uni.createInnerAudioContext();

  currentAudio.onEnded(() => {
    isPlaying.value = false;
    console.log("播放完毕 audio");

    if (
      currentIndex.value >= lastAIMessage.value.length - 1 &&
      isMessageEnd.value
    ) {
      console.error(
        "audio AI已经全部完成",
        currentIndex.value,
        lastAIMessage.value.length
      );
      isAudioEnd.value = true;
    } else {
      currentIndex.value++;
      playNext();
    }
  });

  const playNext = async () => {
    console.log("play next", lastAIMessage.value[currentIndex.value]);

    if (isPlaying.value || !lastAIMessage.value[currentIndex.value]) return;

    isPlaying.value = true;
    const target = lastAIMessage.value[currentIndex.value];

    if (typeof target === "string") {
      //   console.log("当前文本是", target);
      lastShowAIMessage.value.push(target);
      _options?.pushAfter();
      if (
        !isMessageEnd.value ||
        currentIndex.value < lastAIMessage.value.length - 1
      ) {
        currentIndex.value++;
        isPlaying.value = false;
        playNext();
      } else {
        isAudioEnd.value = true;
      }
      return;
    }

    // console.log("当前播放的是", target);

    // #ifdef APP

    if (isAudioEnd.value) return;

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

    // console.log('push data', options);

    if (
      options.type === MessageTypeEnum.AI &&
      options.content === WB_Enum.AI_END
    ) {
      isMessageEnd.value = true;
      return;
    }

    // #ifdef H5
    if (typeof options.content !== "string") {
      return;
    }
    // #endif

    if (!lastData || lastData.type !== options.type) {
      const target = {
        type: options.type,
        data: [],
      };

      target.data.push(options.content);

      list.value.push(target);
      // needAutoScroll.value = true
    } else {
      lastData.data.push(options.content);
    }

    if (
      options.type === MessageTypeEnum.AI &&
      options.content === WB_Enum.AI_START
    ) {
      currentIndex.value = 0;
      lastShowAIMessage.value = [];
      isPlaying.value = false;
      isStoped.value = false;
      _options.AIStart();
    }

    if (options.type === MessageTypeEnum.User) {
      isMessageEnd.value = false;
    }

    playNext();
  };

  const stopAI = () => {
    isStoped.value = true;
    isAudioEnd.value = true;
    currentAudio.stop();
  };

  const initStatus = () => {
    isMessageEnd.value = false;
    isAudioEnd.value = true;
    isConfirmEnd.value = true
    list.value = [];
    currentIndex.value = 0;
    lastShowAIMessage.value = [];
  };

  return {
    isAIEnd,
    isMessageEnd,
    pushData,
    list,
    lastShowAIMessage,
    initStatus,
    stopAI,
  };
}
