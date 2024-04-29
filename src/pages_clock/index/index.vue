<template>
  <div class="page-body wrap-box">
    <u-loading v-if="false"> </u-loading>
    <div class="head">
      {{ dayjs().format("YYYY年MM月DD日") }}

      <uni-icons @click="jump" type="calendar" size="30" />
    </div>
    <div class="main">
      <div class="swiper-date">
        <div class="date-item" v-for="(item, index) in dataList" :key="index">
          <div class="count">{{ index + 1 }}次打卡</div>
          <div class="label">
            {{ dayjs(item.createTime).format("YYYY年MM月DD日 HH:mm:ss") }}
          </div>
        </div>
      </div>
      <div class="time">
        <uni-dateformat :date="currentTime" format="hh:mm:ss"> </uni-dateformat>
      </div>
      <div class="clock" @click="handleClock">打卡</div>

    </div>
  </div>
  <TabBar :activeIndex="1" />
</template>

<script setup>
import { ClockInApi } from "@/api/ClockInApi";
import TabBar from "@/components/TabBar.vue";
import { onShow, onUnload } from "@dcloudio/uni-app";
import dayjs from "dayjs";
import { ref } from "vue";
const currentTime = ref(new Date().getTime());
let timer = setInterval(() => {
  currentTime.value = new Date().getTime();
}, 1000);

onShow(() => {
  getDateList();

});
onUnload(() => {
  clearInterval(timer);
});
const dataList = ref([]);
function getDateList() {
  ClockInApi.list({ date: dayjs().format("YYYY-MM-DD") }).then((res) => {
    dataList.value = res.data;
  });
}

const handleClock = () => {
  uni.navigateTo({
    url: `/pages_clock/save/index`,
  });
};




const jump = () => {
  uni.navigateTo({ url: `/pages_clock/count/index` });
};
</script>

<style lang="scss" scoped>
.wrap-box {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  position: relative;
  padding-bottom: 150rpx;
}

.head {
  font-size: 32rpx;
  padding: 22rpx 32rpx;
  background-color: #fff;
  border-radius: 4px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.main {
  padding: 40rpx 32rpx;
  background: #fff;
}

.swiper-date {
  overflow-x: auto;
  display: flex;
  flex-wrap: nowrap;
  gap: 16px;
}

.date-item {
  border-radius: 2px;
  background: #f7f8fa;
  width: 300rpx;
  flex-shrink: 0;
  font-size: 12px;
  padding: 24rpx;
  box-sizing: border-box;

  .count {
    color: rgba(0, 0, 0, 0.5);
    margin-bottom: 48rpx;
  }

  .label {
    color: rgba(0, 0, 0, 0.9);
  }
}

.time {
  text-align: center;
  font-size: 32px;
  font-weight: bold;
  margin: 32px 0 24px;
}

.clock {
  width: 300rpx;
  height: 300rpx;
  border-radius: 50%;
  background-color: $uni-color-primary;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #fff;
  font-weight: bold;
  box-shadow: 0 0 8px $uni-color-primary;
}

.address {
  display: flex;
  font-size: 14px;
  margin-top: 40px;
  color: rgba(0, 0, 0, 1);
  gap: 8px;
  line-height: 30px;

  .value {
    flex: 1;
  }


  .label {
    color: rgba(0, 0, 0, 0.5);
  }

  .icon {
    font-weight: bold;
  }
}
</style>
