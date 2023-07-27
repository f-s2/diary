<template>
  <div class="empty">
    <image class="icon" :src="src" alt="" />
    <slot> {{ title }} </slot>
  </div>
</template>

<script setup>
import src from "@/static/empty.png";
defineProps({
  title: {
    type: String,
    default: "暂无数据",
  },
});
</script>
<style lang="scss" scoped>
.empty {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: rgba($color: #000000, $alpha: 0.3);
  font-size: 13px;
  .icon {
    width: 280rpx;
    height: 280rpx;
    display: inline-block;
  }
}
</style>
