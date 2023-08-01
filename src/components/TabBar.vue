<template>
  <div class="tabs-box">
    <div
      :class="['tab-item', { active: activeIndex === index }]"
      v-for="(item, index) in tabInfo"
      :key="item.name"
      @click="jump(item)"
    >
      <uni-badge
        v-if="item.custom"
        :text="userStore.unFinishCount"
        type="error"
        :max-num="99"
        absolute="rightTop"
      >
        <img class="icon" :src="item.icon" alt="" />
      </uni-badge>
      <img v-else class="icon" :src="item.icon" alt="" />

      <div class="label">{{ item.name }}</div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from "@/store/user";
import icon1 from "../static/tab/clock.png";
import icon2 from "../static/tab/mine.png";
import icon3 from "../static/tab/work.png";
const userStore = useUserStore();
defineProps({ activeIndex: Number });
const tabInfo = [
  {
    name: "工单",
    icon: icon3,
    path: "/pages_work/index/index",
    custom: true,
  },
  {
    name: "打卡",
    icon: icon1,
    path: "/pages_clock/index/index",
  },
  {
    name: "我的",
    icon: icon2,
    path: "/pages_mine/mine/index",
  },
];

const jump = ({ path }) => {
  uni.switchTab({ url: path });
};
</script>

<style lang="scss" scoped>
.dot {
  color: red;
}
.tabs-box {
  display: flex;
  justify-content: space-between;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 20rpx 0 40rpx;
  background-color: #fff;
}
.tab-item {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 22rpx;
  &.active {
    color: $uni-color-primary;
  }
  .icon {
    width: 40rpx;
    height: 40rpx;
  }
}
</style>
