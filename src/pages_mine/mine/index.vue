<template>
  <div class="page-body wrap-box">
    <div class="head">
      <div class="head-top">
        <text class="name">{{ baseInfo.username }}</text>

      </div>
      <div class="describe">
        {{ baseInfo.organizeName || "-" }}
      </div>
      <div class="mobile">
        <uv-icon name="phone"></uv-icon>{{ baseInfo.mobile }}
      </div>
    </div>

    <div class="describe-box" style="margin-top: 32rpx">
      <div class="describe-item" @click="handleLoginOut">
        <div class="describe-label" style="color: red">退出登录</div>
        <div class="describe-value">
          <uv-icon name="arrow-right" color="rgba(0, 0, 0, 0.9)" size="24"></uv-icon>
        </div>
      </div>

    </div>
    <div class="bg" style="text-align: center">
      <img style="width: 260px; height: 130px; margin-top: 80px" class="img" :src="src" alt="" />
    </div>
  </div>
  <TabBar :activeIndex="2" />
</template>

<script setup>
import { UserApi } from "@/api/UserApi";
import TabBar from "@/components/TabBar.vue";
import src from "@/static/person.png";
import { useUserStore } from "@/store/user";
import { onPullDownRefresh, onShow } from "@dcloudio/uni-app";
import { computed } from "vue";
const userStore = useUserStore();
const baseInfo = computed(() => userStore.userInfo);

const init = () => {
  UserApi.getUserInfo({}).then(res => {
    userStore.setUserInfo(res.data);
  }).finally(() => {
    uni.stopPullDownRefresh();
  })
};
onShow(() => {
  init();
});
onPullDownRefresh(() => {
  init();
});


const handleLoginOut = () => {
  uni.showModal({
    title: "确认注销登陆嘛?",
    success: ({ confirm }) => {
      confirm &&
        UserApi.loginOut().then((res) => {
          const { authorities, userType } = userStore.userInfo
          userStore.setUserInfo({ authorities, userType });
          uni.setStorageSync('token', '')
          const pages = getCurrentPages()
          const from = '/' + pages[pages.length - 1].route
          uni.reLaunch({
            url: `/pages/login/index?from=${from}`
          })
        });
    },
  });
};


</script>
<style lang="scss" scoped>
.wrap-box {
  padding-bottom: 150rpx;
}

.head {
  margin-bottom: 48rpx;
  padding: 24px;
  background: #fff;
  background-image: url('../../static/my.png');
  background-size: 100% 100%;

  .describe {
    font-size: 24rpx;
    color: rgba(0, 0, 0, 0.5);
    font-weight: bold;
    margin-bottom: 16px;
  }

  .mobile {
    font-size: 12px;
    display: inline-flex;
    align-items: center;
    color: rgba(0, 0, 0, 0.3);
    gap: 6px;
    height: 20px;
    border-top: 1px solid #ebe9e9;
    width: 50%;
    position: relative;
    padding: 12px 0;

    &::before {
      content: '';
      position: absolute;
      display: inline-block;
      height: 2px;
      top: -1px;
      background-color: #1890FF;
      width: 20px;

    }


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
</style>
