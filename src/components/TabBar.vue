<template>
  <div class="tabs-box">
    <div :class="['tab-item', { active: activeIndex === index }]" v-for="(item, index) in tabInfo" :key="item.name"
      @click="jump(item)">

      <uv-icon :size="24" :name="activeIndex === index ? item.icon + '-fill' : item.icon"></uv-icon>
      <div class="label">{{ item.name }}</div>
      <uv-badge class="dot" v-if="item.custom" :value="+userStore.unFinishCount || ''" type="error" :max="99" />

    </div>
  </div>
</template>

<script setup>
import { useUserStore } from "@/store/user";
import { onShow } from "@dcloudio/uni-app";
const userStore = useUserStore();
defineProps({ activeIndex: Number });
const tabInfo = [
  {
    name: "首页",
    icon: 'home',
    path: "/pages_home/index",
  },
  // {
  //   name: "任务",
  //   icon: 'file-text',
  //   path: "/pages_work/index/index",
  //   custom: true,
  // },
  {
    name: "我的",
    icon: 'account',
    path: "/pages_mine/mine/index",
  },
];

const jump = ({ path }) => {
  uni.switchTab({ url: path });
};
onShow(() => {
  uni.hideTabBar()
})
</script>

<style lang="scss" scoped>
.dot {
  position: absolute;
  left: 50%;
  top: 0;
}

.tabs-box {
  display: flex;
  justify-content: space-between;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 20rpx 0;
  background-color: #fff;
}

.tab-item {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 24rpx;
  position: relative;

  &.active {
    color: $uv-primary;

    :deep(.uvicon) {
      color: $uv-primary !important;
    }
  }

  .icon {
    width: 40rpx;
    height: 40rpx;
  }
}
</style>
