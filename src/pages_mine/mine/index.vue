<template>
  <div class="page-body wrap-box">
    <div class=" mb-16px font-500 text-20px">我的</div>
    <div class="px-6px pt-6px h-183px rounded-4px overflow-hidden bg-cover bg-center mb-4"
      :style="`background-image: url(${Banner});`">
      <div class=" bg-linear-to-b from-#FFE4BC to-#FFE1B6 rounded-t-md h-34px px-5px pt-4px">
        <div class=" border-(0.6px solid #9C723C) rounded-t-md border-op-50 border-b-none h-full flex items-center">
          <image mode="widthFix" class=" w-22px" :src="Department" alt="" />
          <div class="ml-2px color-#9C723C text-12px font-500">{{ baseInfo.organizeName }}</div>
        </div>
      </div>
      <div class="w-20px h-10px mx-auto bg-#FFE4BC" style="clip-path: polygon(50% 100%, 0% 0%, 100% 0%);"></div>
      <div class=" mt-10px mb-24px flex items-center gap-14px ml-25px">
        <div class=" w-62px h-62px rounded-full overflow-hidden">
          <image mode="widthFix" class=" w-full h-full" :src="Avatar" alt="" />
        </div>
        <div>
          <div class=" text-white text-18px font-600">{{ baseInfo.username }}</div>
          <div></div>
        </div>
      </div>
      <div class=" px-34px color-white text-xs font-500 flex items-center justify-between">
        <span>工号：{{ baseInfo.jobNumber }}</span>
        <span>|</span>
        <span>电话：{{ baseInfo.mobile }}</span>
      </div>
    </div>

    <div class=" px-4 py-5 space-y-24px rounded-4px bg-white">
      <div class=" flex items-center justify-between" v-for="nav in navList" :key="nav.name" @click="handleJump(nav.path)">
        <div class=" flex items-center gap-3">
          <image mode="widthFix" class="w-5 h-5" :src="nav.icon" alt="" />
          <span class=" text-14px font-500">{{ nav.name }}</span>
        </div>
        <image mode="widthFix" class="w-13px" :src="Arrow" alt="" />
      </div>
    </div>

    <div class="f-c-b bg-white py-5 px-4 mt-4 rounded-4px" @click="handleLoginOut">
      <div class=" flex items-center gap-3">
        <image mode="widthFix" class=" w-5" :src="LogoutPng" alt="" />
        <span class="text-14px font-500">退出登录</span>
      </div>
      <image mode="widthFix" class="w-13px" :src="Arrow" alt="" />
    </div>

  </div>
  <TabBar :activeIndex="1" />
</template>

<script lang="ts" setup>
import { UserApi } from "@/api/UserApi";
import TabBar from "@/components/TabBar.vue";
import src from "@/static/person.png";
import { useUserStore } from "@/store/user";
import { onPullDownRefresh, onShow } from "@dcloudio/uni-app";
import { computed } from "vue";
import Banner from '@/static/mine/mine-banner.png'
import Department from '@/static/mine/department.png'
import Avatar from '@/static/mine/avatar.png'
import UpdateInfo from '@/static/mine/update-info.png'
import UpdatePassword from '@/static/mine/update-password.png'
import Arrow from '@/static/mine/arrow.png'
import LogoutPng from '@/static/mine/logout.png'

const userStore = useUserStore();
const baseInfo = computed(() => userStore.userInfo);

const navList = [
  {
    name: '修改信息',
    icon: UpdateInfo,
    path: '/pages_mine/userinfo/index'
  },
  {
    name: '修改密码',
    icon: UpdatePassword,
    path: '/pages_mine/password/index'
  },
]

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

function handleJump(path) {
  uni.navigateTo({
    url: path
  })
}


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
