<template>
  <div class="page-body wrap-box">
    <div class="head">
      <div class="head-top">
        <text class="name">{{ baseInfo.username }}</text>
        <span class="private" @click="jump('/pages_mine/personal/index')">
          <span> 个人资料 </span>
          <uni-icons color="rgba(0, 0, 0, 0.9)" type="forward" size="24" />
        </span>
      </div>
      <div class="describe">
        {{ baseInfo.organizeName || "-" }} ·
        {{ baseInfo.roles?.map((item) => item.name).join("·") }}
      </div>
    </div>
    <div class="card-box">
      <div class="mid-card">
        <div class="count-item" @click="jump('/pages_mine/photo/index')">
          <div class="value">32</div>
          <div class="label">我的相册</div>
        </div>
        <div class="count-item">
          <div class="value">108</div>
          <div class="label">完成工单</div>
        </div>
        <div class="count-item">
          <div class="value">23</div>
          <div class="label">服务客户</div>
        </div>
      </div>
    </div>
    <div class="describe-box" style="margin-top: 32rpx">
      <div class="describe-item">
        <div class="describe-label" style="color: red">退出登录</div>
        <div class="describe-value">
          <uni-icons color="rgba(0, 0, 0, 0.9)" type="forward" size="24" />
        </div>
      </div>
    </div>
  </div>
  <TabBar :activeIndex="2" />
</template>

<script setup>
import { useUserStore } from "@/store/user";
import { computed } from "vue";
import TabBar from "../../components/TabBar.vue";

const baseInfo = computed(() => useUserStore().userInfo);

const jump = (url) => {
  uni.navigateTo({
    url,
  });
};
</script>
<style lang="scss" scoped>
.wrap-box {
}
.head {
  margin-bottom: 48rpx;
  padding: 24rpx;
  .describe {
    font-size: 24rpx;
    color: rgba(0, 0, 0, 0.5);
  }
}
.head-top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20rpx;
  .name {
    font-size: 48rpx;
    font-weight: bold;
  }
  .private {
    font-size: 30rpx;
    display: inline-flex;
    align-items: center;
  }
}
.card-box {
  margin: 0 -32rpx;
  padding: 0 32rpx;
  border-bottom: 1rpx solid rgba(0, 0, 0, 0.1);
}
.mid-card {
  display: flex;
  background: linear-gradient(180deg, #1890ff 0%, #8dc8ff 100%);
  margin: 0 24rpx;
  padding: 28rpx 0;
  border-radius: 16rpx 16rpx 0 0;
  .count-item {
    flex: 1;
    text-align: center;
  }
  color: #fff;
  .value {
    font-size: 44rpx;
    font-weight: bold;
  }
  .label {
    font-size: 24rpx;
  }
}
</style>
