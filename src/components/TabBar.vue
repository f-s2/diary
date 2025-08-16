<template>
  <div class="tabs-box relative">
    <div :class="['tab-item', { active: activeIndex === index }]" v-for="(item, index) in tabInfo" :key="item.name"
      @click="jump(item)">

      <uv-icon :size="24" :name="activeIndex === index ? item.icon + '-fill' : item.icon"></uv-icon>
      <div class="label text-10px">{{ item.name }}</div>
      <!-- <uv-badge class="dot" v-if="item.custom" :value="+userStore.unFinishCount || ''" type="error" :max="99" /> -->
    </div>
    <!-- #ifdef APP -->
    <div class=" absolute left-50% translate-x--50% text-center -top-32px" @click="handleScan">
      <image class=" h-64px" :src="ScanPng" mode="heightFix" />
      <span class="color-#282B32 text-10px">扫一扫</span>
    </div>
    <!-- #endif -->

    <CustomModal v-model:open="modalOptions.visible" title="选择操作">
      <div class=" space-y-10px">
        <div class=" px-4 py-3 f-c-b bg-white rounded-1" v-for="item in navList">
          <div class=" f-c-c">
            <image class=" w-54px" :src="item.icon" mode="widthFix" />
            <span class=" font-500 ml-11px text-15px">{{ item.name }}</span>
          </div>

          <div class=" pl-10px text-11px py-6px f-c-c border-(1px solid primary) text-primary rounded-1px" @click="handleJump(item)">
            <span>{{ item.btnText }}</span>
            <image
              class="w-5 ml-1"
              :src="ArrowPng"
              mode="widthFix"
            />
          </div>
        </div>
      </div>
    </CustomModal>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from "@/store/user";
import { onShow } from "@dcloudio/uni-app";
import ScanPng from '@/static/scan.png';
import CustomModal from "./CustomModal.vue";
import { reactive, ref } from "vue";
import Nav1 from '@/static/home/nav-1.png'
import Nav2 from '@/static/home/nav-2.png'
import Nav3 from '@/static/home/nav-3.png'
import Nav4 from '@/static/home/nav-4.png'
import ArrowPng from '@/static/arrow.png'
import { isUrl, joinUrlWithQuery, parseUrlQuery } from "@/utils";

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

const modalOptions = reactive({
  visible: false,
  id: ''
})

const navList = [
  {
    name: '保养任务',
    path: '/pages_work/index/list?type=0',
    icon: Nav1,
    btnText: '前去保养'
  },
  {
    name: '点检任务',
    path: '/pages_work/index/list?type=1',
    icon: Nav2,
    btnText: '前去点检'

  },
  {
    name: '维修任务',
    path: '/pages_work/index/list?type=3',
    icon: Nav3,
    btnText: '前去维修'

  },
  // {
  //   name: '盘点任务',
  //   path: '/pages_work/index/index?type=2',
  //   icon: Nav4
  // },
]

function handleJump(item) {
  
  if (item.path) {
    uni.navigateTo({
      url: item.path
    });
  }

  modalOptions.visible = false
  modalOptions.id = ''
}

function handleScan() {
  uni.scanCode({
    scanType: ['qrCode'],
    success: (res) => {
      if (res.result) {
        const url = res.result;
        let id = undefined
        
        if(isUrl(url)) {
          id = parseUrlQuery(url).id          
        }

        if (id) {
          modalOptions.visible = true
          modalOptions.id = id
        } else {
          uni.showToast({
            title: '请扫描正确的二维码',
            icon: 'none',
          });
        }
      }
    },
    fail: () => {
      uni.showToast({
        title: '扫码失败，请重试',
        icon: 'none',
        duration: 2000
      });
    },
  });
}
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
