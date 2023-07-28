<template>
  <div class="page">
    <div class="filter-date">
      <div
        @click="selectDate(item)"
        :class="['date-item', { active: activeIndex === item.code }]"
        v-for="item in dateInfo"
        :key="item.code"
      >
        {{ item.name }}
      </div>
    </div>
    <div class="photo-list" v-if="picList?.length">
      <div class="photo-type" v-for="(item, index) in picList" :key="index">
        <div class="photo-title">{{ item.time }}</div>
        <div class="photo-box">
          <div class="img-box" v-for="(url, i) in item.fileNames" :key="i">
            <img class="pic" :src="url" alt="" />
          </div>
        </div>
      </div>
    </div>
    <u-empty class="empty" v-else></u-empty>
  </div>
</template>

<script setup>
import { WorkApi } from "@/api/WorkApi";
import { ref } from "vue";

const dateInfo = [
  {
    name: "日",
    code: 0,
  },
  {
    name: "月",
    code: 1,
  },
  {
    name: "年",
    code: 2,
  },
];
const activeIndex = ref(0);
const picList = ref([]);
const selectDate = ({ code }) => {
  activeIndex.value = code;
  reload();
};
const reload = () => {
  uni.showLoading();
  WorkApi.pictures({ type: activeIndex.value })
    .then((res) => {
      console.log("res", res);
      picList.value = res.data;
    })
    .finally(() => {
      uni.hideLoading();
    });
};
reload();
</script>
<style lang="scss" scoped>
.empty {
  padding: 80rpx 0;
  display: block;
}
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
.photo-box {
  padding: 16px;
  border-radius: 4px;
  background: #fff;
  display: grid;
  grid-template-columns: repeat(4, 100rpx);
  justify-content: space-around;
  grid-row-gap: 10px;
  .img-box {
    background: #fafafa;
    text-align: center;
    height: 150rpx;
  }
  .pic {
    width: 100%;
    height: 100%;
  }
}
</style>
