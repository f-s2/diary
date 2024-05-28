<template>
  <div>
    <div class="search">
      <uv-search bgColor="#fff" v-model="queryParam.searchContent" placeholder="任务编码、设备组" @search="$emit('load')"
        @clear="$emit('load')" :showAction="false" />
    </div>
    <div class="filter-bottom">
      <div class="tag-box">
        <span @click="selectTag(item)" :class="['tag', { active: queryParam.finishStatus === item.code }]"
          v-for="item in tagInfo" :key="item.code">
          {{ item.name }}
        </span>
      </div>
      <div class="filter-icon" @click="handleOpen">
        <img class="icon" :src="filter" alt="" />
        筛选
      </div>
    </div>
    <u-popup ref="popupRef" v-model:show="show" mode="bottom" title="工单筛选" :round="10">
      <div class="popup">
        <div class="sub-label">工单类型 :</div>
        <div class="level-box">
          <span :class="[
        'level-tag',
        { active: temQueryParam.orderTypes?.includes(item) },
      ]" @click="selectLevel(item)" v-for="item in levelOptions" :key="item">
            {{ item }}
          </span>
        </div>
        <div class="sub-label">创建时间端 :</div>
        <div class="time-picker">
          <uni-datetime-picker v-model="temQueryParam.date" type="datetimerange" rangeSeparator="至"
            start-placeholder="开始时间" end-placeholder="结束时间">
          </uni-datetime-picker>
        </div>
        <div class="action">
          <button @click="show = false" type="primary" plain>取消</button>

          <button hover-class="none" type="primary" @click="handleOk">
            确定
          </button>
        </div>
      </div>
    </u-popup>
  </div>
</template>

<script setup>
const levelOptions = ["保养", "点检", "盘点"];
import filter from "@/static/filter.png";

import { ref, toRefs } from "vue";
const props = defineProps({ queryParam: Object });
const emit = defineEmits(["load"]);
const { queryParam } = toRefs(props);
const tagInfo = [
  {
    name: "待完成",
    code: 4,
  },
  {
    name: "已提交",
    code: 6,
  },
  {
    name: "已完成",
    code: 5,
  },
  {
    name: "全部",
    code: null,
  },
];
const selectTag = ({ code }) => {
  queryParam.value.finishStatus = code;
  emit("load");
};
const selectLevel = (code) => {
  if (!temQueryParam.value.orderTypes) {
    temQueryParam.value.orderTypes = [];
  }
  const index = temQueryParam.value.orderTypes?.findIndex(
    (item) => item === code
  );
  if (index === -1) {
    temQueryParam.value.orderTypes.push(code);
  } else {
    temQueryParam.value.orderTypes.splice(index, 1);
  }
};
const show = ref(false);
const temQueryParam = ref({});
const handleOpen = () => {
  temQueryParam.value = JSON.parse(JSON.stringify(queryParam.value));
  show.value = true;
};
const handleOk = () => {
  const { orderTypes, date } = temQueryParam.value;
  queryParam.value.orderTypes = orderTypes;
  queryParam.value.startTime = date[0];
  queryParam.value.endTime = date[1];
  queryParam.value.date = date;
  show.value = false;
  emit("load");
};
const popupRef = ref();
</script>

<style lang="scss" scoped>
.filter-bottom {
  display: flex;
  align-items: center;
  margin: 10px;

  .tag-box {
    flex: 1;
  }

  .filter-icon {
    display: flex;
    line-height: 20px;
    font-size: 14px;
    color: rgba($color: #000000, $alpha: 0.9);
  }

  .icon {
    width: 20px;
    height: 20px;
  }

  .tag {
    font-size: 14px;
    display: inline-block;
    padding: 4px 8px;
    background: rgba($color: #000000, $alpha: 0.05);
    color: rgba($color: #000000, $alpha: 0.5);
    border-radius: 4px;
    margin-right: 8px;

    &.active {
      color: #fff;
      background: $uni-color-primary;
    }
  }
}

.sub-label {
  font-size: 14px;
  color: #000;
  font-weight: bold;
  margin: 12px 0 16px;
}

.level-box {
  display: flex;
  gap: 16rpx;

  .level-tag {
    background: #f7f8fa;
    color: rgba($color: #000000, $alpha: 0.9);
    border-radius: 4px;
    padding: 18rpx 0;
    font-size: 14px;
    flex: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid transparent;

    &.active {
      color: $uni-color-primary;
      border: 1px solid $uni-color-primary;
    }
  }
}

.action {
  display: flex;
  margin: 28px 0 10px;
  gap: 8px;

  button {
    flex: 1;
  }
}
</style>
