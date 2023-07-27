<template>
  <div class="page">
    <div class="filter-date">
      <div
        @click="activeIndex = item.code"
        :class="['date-item', { active: activeIndex === item.code }]"
        v-for="item in dateInfo"
        :key="item.code"
      >
        {{ item.name }}
      </div>
    </div>
    <div class="photo-list">
      <div class="photo-title">2023年07月23日</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const dateInfo = [
  {
    name: "日",
    code: 1,
  },
  {
    name: "月",
    code: 2,
  },
  {
    name: "年",
    code: 3,
  },
];
const activeIndex = ref(1);
</script>
<style lang="scss" scoped>
.page {
  padding: 32rpx;
}
.filter-date {
  display: flex;
  border-radius: 4rpx;
  background: #ebeef3;
  padding: 8rpx;
  border-radius: 8rpx;
  font-size: 28rpx;

  .date-item {
    flex: 1;
    height: 80rpx;
    border-radius: 8rpx;
    text-align: center;
    line-height: 80rpx;
    font-weight: bold;
    &.active {
      background-color: #fff;
    }
  }
}
.photo-list {
  margin-top: 32rpx;
  background: #fff;
}
</style>
