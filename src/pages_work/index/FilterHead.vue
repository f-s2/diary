<template>
  <div>
    <div class="search">
      <uv-search bgColor="#fff" v-model="queryParam.searchContent" placeholder="任务编码、设备组" @search="$emit('load')"
        @clear="$emit('load')" :showAction="false" />
    </div>
    <div class="filter-bottom">
      <div class="tag-box">
        <span @click="selectTag(item)" :class="['tag', { active: queryParam.status === item.code }]"
          v-for="item in tagInfo" :key="item.code">
          {{ item.name }}
        </span>
      </div>
      <div class="filter-icon" @click="handleOpen">
        <img class="icon" :src="filter" alt="" />
        筛选
      </div>
    </div>
    <u-popup ref="popupRef" v-model:show="show" mode="bottom" title="任务筛选" :round="10">
      <div class="popup">
        <div class="sub-label">任务类型 :</div>
        <div class="level-box">
          <span :class="[
        'level-tag',
        { active: temQueryParam.types?.includes(index) },
      ]" @click="selectLevel(index)" v-for="(item, index) in levelOptions" :key="item">
            {{ item }}
          </span>
        </div>
        <div class="sub-label">创建时间端 :</div>
        <div class="time-picker">
          <span @click="openTime('createTimeStart')">{{ temQueryParam.createTimeStart ?? '开始时间' }} </span>
          至
          <span @click="openTime('createTimeEnd')">{{ temQueryParam.createTimeEnd ?? '结束时间' }}</span>

          <uv-datetime-picker ref="datePicker" :value="temQueryParam.date" mode="datetime" @confirm="confirm">
          </uv-datetime-picker>

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
import dayjs from "dayjs";

import { ref, toRefs } from "vue";
const props = defineProps({ queryParam: Object });
const emit = defineEmits(["load"]);
const { queryParam } = toRefs(props);
const tagInfo = [
  {
    name: "待完成",
    code: 0,
  },
  {
    name: "已提交",
    code: 1,
  },
  {
    name: "已完成",
    code: 2,
  },
  {
    name: "全部",
    code: null,
  },
];
const selectTag = ({ code }) => {
  queryParam.value.status = code;
  emit("load");
};
const selectLevel = (code) => {
  if (!temQueryParam.value.types) {
    temQueryParam.value.types = [];
  }
  const index = temQueryParam.value.types?.findIndex(
    (item) => item === code
  );
  if (index === -1) {
    temQueryParam.value.types.push(code);
  } else {
    temQueryParam.value.types.splice(index, 1);
  }
};
const show = ref(false);
const confirm = ({ value }) => {
  temQueryParam.value[timeMode] = dayjs(value).format('YYYY-MM-DD HH:mm:ss')
  const { createTimeEnd, createTimeStart } = temQueryParam.value

  if (createTimeEnd && createTimeStart) {
    const minus = dayjs(createTimeEnd).valueOf() - dayjs(createTimeStart).valueOf()
    console.log(minus, dayjs(createTimeEnd).valueOf());
    if (minus < 0) {
      temQueryParam.value[timeMode] = undefined
      uni.showToast({
        title: '结束时间需大于开始时间',
        icon: 'none'
      })
    }
  }

}
const temQueryParam = ref({});
const handleOpen = () => {
  temQueryParam.value = JSON.parse(JSON.stringify(queryParam.value));
  show.value = true;
};
const handleOk = () => {
  const { types, createTimeStart, createTimeEnd } = temQueryParam.value;
  queryParam.value.types = types;
  queryParam.value.createTimeStart = createTimeStart;
  queryParam.value.createTimeEnd = createTimeEnd;
  show.value = false;

  emit("load");
};
const popupRef = ref();

const datePicker = ref()
let timeMode = ''
const openTime = (mode) => {
  timeMode = mode
  temQueryParam.value.date = dayjs(temQueryParam.value?.[mode]).valueOf()
  datePicker.value.open()
}
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
      background: $uv-primary;
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
      color: $uv-primary;
      border: 1px solid $uv-primary;
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

.time-picker {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: center;

  span {
    flex: 1;
    text-align: center;
    background-color: #f7f8fa;
    padding: 10px 0;
    border-radius: 4px;
    font-size: 14px;
  }
}
</style>
