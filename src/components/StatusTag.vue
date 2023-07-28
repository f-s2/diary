<template>
  <div v-if="type == 0" :class="['status', { bg: needBg }]">
    <span class="doing" v-if="status === 4">待完成</span>
    <span class="done" v-else-if="status === 5">已完成</span>
  </div>
  <div class="types" v-else-if="type == 1">
    <span class="tag" v-for="(item, index) in types" :key="index">
      {{ item }}
    </span>
  </div>
  <div class="levels" v-else-if="type == 2">
    <span class="text" v-for="(item, index) in levels?.split('+')" :key="index">
      {{ item }}
    </span>
  </div>
</template>

<script setup>
defineProps({
  type: {
    type: [Number, String],
    default: 0,
  },
  needBg: {
    type: Boolean,
    default: false,
  },
  status: Number,
  types: Array,
  levels: String,
});
</script>

<style lang="scss" scoped>
.status {
  font-size: 14px;
  font-weight: bold;
  &.bg {
    .done {
      background-color: rgba($color: $uni-color-success, $alpha: 0.1);
    }
    .doing {
      background-color: rgba($color: $uni-color-warning, $alpha: 0.1);
    }
  }
  .done,
  .doing {
    padding: 2px 8px;
    border-radius: 4px;
    &::before {
      content: "";
      display: inline-block;
      height: 6px;
      width: 6px;
      border-radius: 50%;
      margin-right: 4px;
      vertical-align: middle;
    }
  }
  .done {
    color: $uni-color-success;
    &::before {
      background-color: $uni-color-success;
    }
  }
  .doing {
    color: $uni-color-warning;
    &::before {
      background-color: $uni-color-warning;
    }
  }
}
.types {
  display: inline-flex;
  gap: 8rpx;
  flex-wrap: wrap;
  .tag {
    padding: 2px 4px;
    line-height: 16px;
    gap: 8px;
    font-size: 12px;
    background: rgba($color: #000000, $alpha: 0.05);
    color: rgba($color: #000000, $alpha: 0.5);
    border-radius: 2px;
  }
}
.levels {
  border-radius: 2px;
  background: rgba(22, 93, 255, 0.1);
  color: $uni-color-primary;
  font-size: 12px;
  display: inline-flex;
  gap: 8rpx;
  line-height: 20px;
  padding: 0 8rpx;
  border-radius: 2px;
  .text {
    &:not(:last-child)::after {
      content: "";
      height: 8px;
      display: inline-block;
      width: 1px;
      background-color: $uni-color-primary;
      vertical-align: baseline;
      margin-left: 8rpx;
    }
  }
}
</style>
