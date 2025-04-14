<template>
  <uv-popup class="popup" ref="popup" :safe-area="false" @maskClick="$emit('maskClick')" v-bind="$attrs" @change="handelChange">
    <div class="pup-head" v-if="head">
      <div class="left" @click="handleBack">
        <uv-icon v-if="back" name="arrow-left" size="16"></uv-icon>
      </div>
      <span class="title ele">{{ title }}</span>
      <div class="right" @click="$emit('update:show', false)">
        <slot name="right" v-if="cancel"> 取消 </slot>
      </div>
    </div>
    <slot />
  </uv-popup>
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
<style lang="scss">
.uv-popup__content.bottom{
  max-height: 70vh;
  min-height: 50vh;
  display: flex !important;
  flex-direction: column;
  .content{
    flex: 1;
    overflow-y: auto;
  }
}
</style>
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
    height: 30px;
    width: 30px;
    display: flex;
    align-items: center;
  }

  .right {
    position: absolute;
    right: 0;
    font-size: 14px;
    color: #000;
  }
}
.content{
  flex: 1;
}
</style>

