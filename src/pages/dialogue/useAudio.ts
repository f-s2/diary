import { computed, ref, type Ref } from "vue";

export function writeMp3(buffer: ArrayBuffer): Promise<string> {
  return new Promise((resolve, reject) => {
    // #ifdef APP
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
    // #endif
  });
}

export default function useAudioList(
  isMessageEnd: Ref<boolean>,
  options: { onEnd?: () => void }
) {
  const audioList = ref<ArrayBuffer[]>([]);
  const isAudioEnd = ref(true);

  const isPlaying = ref(false);

  const currentIndex = ref(0);

  const currentAudio = uni.createInnerAudioContext();

  currentAudio.onEnded(() => {
      isPlaying.value = false;

    if (currentIndex.value >= (audioList.value.length - 1) && isMessageEnd.value) {
      isAudioEnd.value = true;
      options?.onEnd();
    } else {
      currentIndex.value++;
      playNext();
    }
  });

  const pushAudio = (data) => {
    isAudioEnd.value = false;

    audioList.value.push(data);    
    playNext();
  };

  const playNext = async () => {
    if (isPlaying.value || !audioList.value[currentIndex.value]) return;

    const current = audioList.value[currentIndex.value];

    if (!current) {

      isPlaying.value = false;
    } else {

      // #ifdef APP
      isPlaying.value = true;
      const path = await writeMp3(current);
      currentAudio.src = path;
      currentAudio.play();
      // #endif
    }
  };

  const initAudio = () => {
    audioList.value = [];
    isPlaying.value = false;
    isAudioEnd.value = true;
    currentIndex.value = 0;
  };

  return {
    isAudioEnd,
    initAudio,
    pushAudio,
  };
}
