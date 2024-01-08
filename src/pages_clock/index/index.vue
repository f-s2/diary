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
      <div class="address">
        <div class="label">当前位置:</div>
        <div class="value">{{ address || "--" }}</div>
        <uni-icons @click="reloadLocation" class="icon" type="reload" color="#1890ff" size="18" />
      </div>
    </div>
  </div>
  <TabBar :activeIndex="1" />
</template>

<script setup>
import { ClockInApi } from "@/api/ClockInApi";
import { getAddress } from "@/utils/location";
import { onShow, onUnload } from "@dcloudio/uni-app";
import dayjs from "dayjs";
import { ref } from "vue";
import TabBar from "../../components/TabBar.vue";
const currentTime = ref(new Date().getTime());
const address = ref("");
let location;
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
reloadLocation();
function getDateList() {
  ClockInApi.list({ date: dayjs().format("YYYY-MM-DD") }).then((res) => {
    dataList.value = res.data;
  });
}

const handleClock = (res) => {
  uni.getLocation({
    type: "gcj02",
    success: (res) => {
      const { latitude, longitude } = res;
      location = { latitude, longitude };
    },
  });
  uni.chooseLocation({
    success: (res) => {
      const distance = getDistance(
        res.latitude,
        res.longitude,
        location.latitude,
        location.longitude
      );

      if (distance < 0.5) {
        uni.navigateTo({
          url: `/pages_clock/save/index?address=${JSON.stringify(res)}`,
        });
      } else {
        uni.showModal({
          title: "提示!",
          content: `当前打卡地点超出范围限制,距离你所在位置${distance}km`,
          showCancel: false,
        });
      }
    },
    fail: (err) => {
      console.log("err", err);
    },
  });
};

function reloadLocation() {
  uni.showLoading();
  getAddress().then(res => {
    address.value = res.address
  }).finally(() => {
    uni.hideLoading();
  })

}

function getDistance(lat1, lng1, lat2, lng2) {
  lat1 = lat1 || 0;
  lng1 = lng1 || 0;
  lat2 = lat2 || 0;
  lng2 = lng2 || 0;
  var rad1 = (lat1 * Math.PI) / 180.0;
  var rad2 = (lat2 * Math.PI) / 180.0;
  var a = rad1 - rad2;
  var b = (lng1 * Math.PI) / 180.0 - (lng2 * Math.PI) / 180.0;
  var r = 6378137;
  var distance =
    r *
    2 *
    Math.asin(
      Math.sqrt(
        Math.pow(Math.sin(a / 2), 2) +
        Math.cos(rad1) * Math.cos(rad2) * Math.pow(Math.sin(b / 2), 2)
      )
    );
  return (distance / 1000).toFixed(2);
}
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

  .label {
    color: rgba(0, 0, 0, 0.5);
  }

  .icon {
    font-weight: bold;
  }
}
</style>
