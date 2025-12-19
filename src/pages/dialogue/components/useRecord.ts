import { nextTick, onUnmounted, ref, type Ref } from "vue";

export default function useRecord(
  target: Ref<HTMLElement | undefined>,
  options: {
    onStart?: () => void;
    onReset?: () => void;
    onStop?: () => void;
  }
) {

  /** 由于标记当前AI返回的数据是否全部接收完毕 */
const isAIMessageEnd = ref(true)

  // 是否正在录音
  const isRecording = ref(false);
  const isCancel = ref(false);

  const isRouse = ref(false);

  const startY = ref(0);
  const CANCEL_DISTANCE = 60; // 上滑取消的距离阈值

  function onTouchStart(e: TouchEvent) {
    if(!isAIMessageEnd.value) return
    e.preventDefault();
    const touch = e.touches[0];
    startY.value = touch.clientY;

    isRecording.value = true;
    isCancel.value = false;

    options.onStart?.();
  }

  function onTouchMove(e: TouchEvent) {
    e.preventDefault();

    if (!isRecording.value || isRouse.value) return;

    const touch = e.touches[0];
    const moveY = touch.clientY;

    // 上滑距离
    const diff = startY.value - moveY;

    isCancel.value = diff > CANCEL_DISTANCE;
  }

  function onTouchEnd(e) {
    e.preventDefault();

    if (!isRecording.value || isRouse.value) return;

    reset();
  }

  function onTouchCancel() {
    reset();
  }

  function reset() {
    options.onReset?.();
    isRecording.value = false;
    isCancel.value = false;
  }

  function initRecord() {
    nextTick(() => {
      target.value?.addEventListener("touchstart", onTouchStart, {
        passive: false,
      });
      target.value?.addEventListener("touchmove", onTouchMove, {
        passive: false,
      });
      target.value?.addEventListener("touchend", onTouchEnd, {
        passive: false,
      });
      target.value?.addEventListener("touchcancel", onTouchCancel);
    });
  }



  return {
    isRecording,
    isCancel,
    isRouse,
    isAIMessageEnd,
    initRecord,
    resetRecord: reset,
  };
}
