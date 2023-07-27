<template>
  <uni-popup ref="popup" :safe-area="false" v-bind="$attrs">
    <div class="pup-head">
      <div class="left">
        <uni-icons
          v-if="back"
          @click="handleBack"
          type="back"
          size="16"
        ></uni-icons>
      </div>
      <span class="title">{{ title }}</span>
      <div class="right">
        <slot name="right" v-if="cancel"> 取消 </slot>
      </div>
    </div>
    <slot />
  </uni-popup>
</template>

<script setup>
import { ref, watch } from "vue";
const props = defineProps({
  show: Boolean,
  title: String,
  back: {
    type: Boolean,
    default: true,
  },
  cancel: {
    type: Boolean,
    default: false,
  },
});
const popup = ref();
const emit = defineEmits(["update:show", "back"]);
const handleBack = () => {
  emit("update:show", false);
  emit("back");
};
watch(
  () => props.show,
  (bol) => {
    if (bol) {
      popup.value.open();
    } else {
      popup.value.close();
    }
  },
  {
    immediate: false,
  }
);
</script>

<style lang="scss" scoped>
.pup-head {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  margin-bottom: 20px;
  .title {
    font-size: 16px;
    font-weight: bold;
    color: #000;
  }
  .left {
    position: absolute;
    left: 0;
  }
  .right {
    position: absolute;
    right: 0;
    font-size: 14px;
    color: #000;
  }
}
</style>
