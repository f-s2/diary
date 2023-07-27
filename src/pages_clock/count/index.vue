<template>
  <div class="page-body wrap-box">
    <div class="calender">
      <uni-calendar
        :date="queryParam.date"
        :insert="true"
        :lunar="true"
        :showMonth="false"
      />
    </div>
    <uni-card
      class="card-item"
      v-for="item in 5"
      :isFull="true"
      :border="false"
      :is-shadow="false"
    >
      <div class="count">
        <span class="label">第{{ item }}次打卡</span>
        <span class="date">09:27:23</span>
      </div>
      <div class="address">
        <uni-icons type="location" />
        上海市普陀区金沙江路天地软件园1号楼
      </div>

      <div class="remark">
        <uni-icons type="compose" />
        事项XXXXXX
      </div>
    </uni-card>
  </div>
  <TabBar :activeIndex="1" />
</template>

<script setup>
import dayjs from "dayjs";
import { ref } from "vue";
import TabBar from "../../components/TabBar.vue";

const queryParam = ref({ date: dayjs().add(1, "day") });
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
.main {
  padding: 40rpx 32rpx;
  background: #fff;
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
  }
}
</style>
