<template>
  <div class="page-body wrap-box">
    <div class="calender">
      <uni-calendar :insert="true" :lunar="true" :showMonth="false" @change="handleChangeDate" />
    </div>
    <div v-if="dataList.length" class="wrap-card">
      <uni-card class="card-item" :key="item.id" v-for="(item, index) in dataList" :isFull="true" :border="false"
        :is-shadow="false">
        <div class="count">
          <span class="label">第{{ index + 1 }}次打卡</span>
          <span class="date">{{
        dayjs(item.createTime).format("HH:mm:ss")
      }}</span>
        </div>
        <div class="remark">
          <uni-icons type="compose" />
          事项
          {{ item.remark }}
        </div>
        <div class="address">
          <uni-icons type="location" />
          图片

        </div>
        <div class="img-list">
          <div @click="preview(item.pictures, index)" class="img-box" :key="index"
            v-for="(val, index) in item.pictures">
            <img :src="userStore.userInfo.urlPrefix + val" class="pic" />
          </div>
        </div>
      </uni-card>
    </div>
    <u-empty title="当前暂无打卡记录" v-else />
  </div>
</template>

<script setup>
import { ClockInApi } from "@/api/ClockInApi";
import { useUserStore } from "@/store/user";
import dayjs from "dayjs";
import { ref } from "vue";
const userStore = useUserStore()


const dataList = ref([]);
getDateList();
function getDateList(date = dayjs().format("YYYY-MM-DD")) {
  uni.showLoading();
  ClockInApi.list({ date })
    .then((res) => {
      dataList.value = res.data;
    })
    .finally(() => {
      uni.hideLoading();
    });
}
const handleChangeDate = ({ fulldate }) => {
  getDateList(fulldate);
};
const preview = (picList, current) => {
  console.log(picList, current);
  uni.previewImage({
    current,
    urls: picList.map(item => userStore.userInfo.urlPrefix + item),
    fail: (err) => {
      console.log("err", err);
    },
  });
};
</script>
<style lang="scss" scoped>
.wrap-box {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.calender {
  ::v-deep .uni-calendar__header {
    justify-content: flex-start;
    font-weight: bold;
  }
}

.wrap-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.card-item {
  .count {
    font-size: 14px;

    .label {
      color: rgba(0, 0, 0, 0.5);
    }

    .date {
      color: rgba(0, 0, 0, 0.9);
      margin-left: 10rpx;
    }
  }

  .address,
  .remark {
    color: rgba(0, 0, 0, 0.9);
    margin-top: 12px;
    font-size: 12px;
    word-break: break-all;
  }
}

.img-list {
  margin-top: 10px;

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
