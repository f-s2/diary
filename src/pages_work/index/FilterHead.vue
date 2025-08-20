<template>
  <div>
    <!-- <uv-tabs class="tabs" :list="tabsList" :lineWidth="12" :lineHeight="4"
      :activeStyle="{ fontWeight: 'bold', color: '#000' }" :inactiveStyle="{ color: '#000' }"
      v-model:current="currentTab" @change="changeTab" lineColor="#003A8B"></uv-tabs> -->
    <CustomHeaderNav :title="title"></CustomHeaderNav>
    <div class="search">
      <uv-search bgColor="#fff" v-model="queryParam.searchContent" :placeholder="placeholder"
        @search="$emit('load')" @clear="$emit('load')" :showAction="false" />
    </div>
    <div class="filter-bottom" v-if="!hiddenFilter">
      <div class="tag-box">
        <span @click="selectTag(item)" :class="['tag', { active: queryParam.status === item.code }]"
          v-for="item in tagInfo" :key="item.code">
          {{ item.name }}
        </span>
      </div>
      <div class="filter-icon" @click="handleOpen">
        <image mode="widthFix" class="icon" :src="filter" alt="" />
        筛选
      </div>
    </div>
    <u-popup ref="popupRef" v-model:show="show" mode="bottom" title="任务筛选" :round="10">
      <div class="popup">

        <div class="sub-label">创建时间端 :</div>
        <div class="time-picker">
          <span @click="openTime('createTimeStart')">{{ temQueryParam.createTimeStart ?? '开始时间' }} </span>
          至
          <span @click="openTime('createTimeEnd')">{{ temQueryParam.createTimeEnd ?? '结束时间' }}</span>

          <uv-datetime-picker ref="datePicker" :value="temQueryParam.date" mode="datetime" @confirm="confirm">
          </uv-datetime-picker>

        </div>
        <div class="action">
          <uv-button @click="reset" type="primary" plain>重置</uv-button>

          <uv-button hover-class="none" type="primary" @click="handleOk">
            确定
          </uv-button>
        </div>
      </div>
    </u-popup>
  </div>
</template>

<script setup>
import CustomHeaderNav from "@/components/CustomHeaderNav.vue";
import { findOne } from "@/dict";
import filter from "@/static/filter.png";
import dayjs from "dayjs";

import { computed, ref, toRefs } from "vue";
const props = defineProps({ queryParam: Object, hiddenFilter: Boolean });
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
const tabsList = [
  { name: '维修任务', key: 3, placeholder: '任务编码、所属部门、设备名称、设备编码' },
  { name: '保养任务', key: 0, placeholder: '任务编码、所属部门、设备位置、位置编码' },
  { name: '点检任务', key: 1, placeholder: '任务编码、所属部门、设备位置、位置编码' },
  { name: '盘点任务', key: 2, placeholder: '任务编码、任务名称' },
]

const title = computed(() => tabsList?.find(v => v.key === +props.queryParam.types[0]).name)
const placeholder = computed(() => tabsList?.find(v => v.key === +props.queryParam.types[0]).placeholder)

const currentTab = ref(0)

const changeTab = ({ index, key }) => {
  currentTab.value = index
  queryParam.value.types = [key];
  emit("load");

}
const selectTag = ({ code }) => {
  queryParam.value.status = code;
  emit("load");
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
  const { createTimeStart, createTimeEnd } = temQueryParam.value;
  queryParam.value.createTimeStart = createTimeStart;
  queryParam.value.createTimeEnd = createTimeEnd;
  show.value = false;
  emit("load");
};
const reset = () => {
  temQueryParam.value.createTimeStart = undefined
  temQueryParam.value.createTimeEnd = undefined
}
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
.tabs {
  background: #FFFFFF;

  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
}

.search {
  margin: 20rpx 40rpx;
}

.filter-bottom {
  display: flex;
  align-items: center;
  margin: 10px;
  margin-bottom: 0;

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
    font-size: 20rpx;
    display: inline-block;
    padding: 14rpx;
    background: #fff;
    color: #5F6877;
    border-radius: 16rpx;
    margin-right: 20rpx;
    border: 1px solid transparent;

    &.active {
      color: $uv-primary;
      border: 1px solid $uv-primary;
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

  .uv-button-wrapper {
    flex: 1
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
