<template>
  <div class="page-body">
    <div class="head" style="margin-top: -10px">
      <filter-head @load="reload" :queryParam="queryParam" />
    </div>
    <div class="content" v-if="workList.length">
      <uni-card
        @click="jump(item)"
        padding="10px 4px"
        v-for="item in workList"
        :key="item.id"
        :isFull="true"
        :border="false"
        :is-shadow="false"
      >
        <div class="work-item">
          <div class="item-head">
            <div class="item-title ellipsis">
              {{ item.customerName }}
            </div>
            <div class="item-status">
              <status-tag :status="item.finishStatus" />
            </div>
          </div>
          <div class="item-mid">
            <status-tag
              style="margin-right: 8rpx"
              type="1"
              :types="item.typeVOList.map((item) => item.name)"
            />
            <status-tag type="2" :levels="item.orderType" />
          </div>
          <div class="item-bottom">
            <img class="icon" :src="icon1" alt="" /><span>
              {{ item.code }}
            </span>
            <img style="margin-left: 8px" class="icon" :src="icon2" alt="" />
            <span>{{ item.createTime }} </span>
          </div>
        </div>
      </uni-card>
    </div>
    <u-empty class="empty" v-else> </u-empty>
  </div>

  <TabBar :activeIndex="0" />
  <auth-button @load="reload" />
</template>

<script setup>
import { WorkApi } from "@/api/WorkApi";
import icon1 from "@/static/code.png";
import icon2 from "@/static/time.png";
import { useUserStore } from "@/store/user";
import { onShow } from "@dcloudio/uni-app";
import { ref } from "vue";
import AuthButton from "../../components/AuthButton";
import TabBar from "../../components/TabBar.vue";
import FilterHead from "./FilterHead";
const userStore = useUserStore();
onShow(() => {
  WorkApi.getCount().then((res) => {
    userStore.unFinishCount = res.data;
  });
});
const queryParam = ref({
  searchContent: "",
  finishStatus: null,
  date: [],
});
const workList = ref([]);
const reload = () => {
  uni.showLoading();
  WorkApi.list({ ...queryParam.value })
    .then((res) => {
      workList.value = res.data;
    })
    .finally(() => {
      uni.hideLoading();
    });
};
const jump = (item) => {
  uni.navigateTo({
    url: `/pages_work/detail/index?id=${item.id}`,
  });
};
</script>

<style lang="scss" scoped>
::v-deep .uni-easyinput__content {
  background-color: #fff !important;
}
.page-body {
  padding-bottom: 150rpx;
}
.empty {
  padding: 100px 0;
  display: block;
}
.content {
  display: flex;
  flex-direction: column;
  gap: 12px;
  // height: calc(100vh - 360rpx);
  // overflow-y: auto;
}
.work-item {
  .item-head {
    display: flex;

    justify-content: space-between;
  }
  .item-title {
    font-size: 16px;
    font-weight: bold;
    color: #000;
    flex: 1;
    margin-right: 20px;
  }
  .item-mid {
    margin: 8px 0;
  }
}
.item-bottom {
  color: rgba($color: #000000, $alpha: 0.3);
  display: flex;
  line-height: 20px;
  font-size: 12px;
  align-items: center;
  gap: 4rpx;
  .icon {
    height: 14px;
    width: 14px;
    display: inline-block;
  }
}
</style>
