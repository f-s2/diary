<template>
  <uni-popup
    ref="popup"
    :safe-area="false"
    @maskClick="$emit('maskClick')"
    v-bind="$attrs"
    @change="handelChange"
  >
    <div class="pup-head" v-if="head">
      <div class="left">
        <uni-icons
          v-if="back"
          @click="handleBack"
          type="back"
          size="16"
        ></uni-icons>
      </div>
      <span class="title ele">{{ title }}</span>
      <div class="right" @click="$emit('update:show', false)">
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
  head: {
    type: Boolean,
    default: true,
  },
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
const handelChange = ({ show }) => {
  emit("update:show", show);
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
