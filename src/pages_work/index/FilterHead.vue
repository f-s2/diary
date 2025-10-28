<template>
  <div>
    <!-- <uv-tabs class="tabs" :list="tabsList" :lineWidth="12" :lineHeight="4"
      :activeStyle="{ fontWeight: 'bold', color: '#000' }" :inactiveStyle="{ color: '#000' }"
      v-model:current="currentTab" @change="changeTab" lineColor="#003A8B"></uv-tabs> -->
    <CustomHeaderNav :title="title"></CustomHeaderNav>
    <div class="search">
      <uv-search bgColor="#fff" height="42px" shape="square" :inputStyle="{fontSize: '12px'}" placeholderColor="#9CA5B0" v-model="queryParam.searchContent" :placeholder="placeholder"
        @search="$emit('load')" @clear="$emit('load')" :showAction="false" />
    </div>
    <div class=" f-c-c">
      <div class="f-c-c border-1px border-solid border-primary rounded-4px">
        <div class="py-6px px-23px text-12px rounded-4px relative" :class="activeTab === item.value ? ' bg-primary color-white' : 'color-#999'" 
        v-for="item in tabsArr" :key="item.value" @click="changeTab(item.value)">{{ item.name }} 
        <span v-if="statistics?.[item.key]" class=" absolute top-1px right-13px scale-85 min-w-15px min-h-15px f-c-c bg-#FF0000 text-9px font-500 color-white rounded-full border-(1px solid white)">{{ statistics?.[item.key] > 99 ? '99+' : statistics?.[item.key] }}</span></div>
      </div>
    </div>
    <div class="filter-bottom flex gap-8px" v-if="!hiddenFilter">
      <!-- <div class="tag-box">
        <span @click="selectTag(item)" :class="['tag', { active: queryParam.status === item.code }]"
          v-for="item in tagInfo" :key="item.code">
          {{ item.name }}
        </span>
      </div> -->
      <div class="flex-1 w-0">
        <!-- <uv-tabs :list="tagInfo?.map(item => ({ name: item.name, key: item.code }))"
               @change="selectTag" ></uv-tabs> -->

        <CustomTabs :list="tagInfo?.map(item => ({ name: item.name, key: item.code }))"
               @change="selectTag"></CustomTabs>
      </div>
      <div class="filter-icon" @click="handleOpen">
        <image mode="widthFix" class="icon" :src="filter" alt="" />
        筛选
        <image mode="widthFix" class="w-6px ml-3px" :src="angle" alt="" />
      </div>
    </div>
    <u-popup ref="popupRef" v-model:show="show" closeable mode="bottom" title="任务筛选" :round="10">
      <div class="popup">

        <div class="sub-label">创建时间端 :</div>
        <div class="time-picker" :class="{'color-#999': !temQueryParam.date}">
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

<script lang="ts" setup>
import CustomHeaderNav from "@/components/CustomHeaderNav.vue";
import { findOne } from "@/dict";
import filter from "@/static/filter.png";
import angle from "@/static/angle.png";
import dayjs from "dayjs";
import BackPng from '@/static/back.png'

import { computed, ref, toRefs, watch } from "vue";
import CustomTabs from "@/components/CustomTabs.vue";
import { TaskApi } from "@/api/TaskApi";
import { onShow } from "@dcloudio/uni-app";

const props = defineProps({ queryParam: Object, hiddenFilter: Boolean });
const emit = defineEmits(["load"]);
const { queryParam } = toRefs(props);

const activeTab = ref(0)

const tabsArr = [
  {
    name: '全部任务',
    value: 0,
    key: 'waitingReceived'
  },
  {
    name: '我的任务',
    value: 1,
    key: 'waitingCompleted'
  },
]

const tagOptions = new Map<() => boolean, {name: string, code: any}[]>([
  [() => [0,1,3].includes(+props.queryParam.types[0]) && queryParam.value.classification === 0, [
    {
      name: '待领取',
      code: 4
    },
    {
      name: '已超时',
      code: 5
    },
    {
      name: '待完成',
      code: 0
    },
    {
      name: '已完成',
      code: 2
    },
  ]],
  [() => [0,1,3].includes(+props.queryParam.types[0]) && queryParam.value.classification === 1, [
    {
      name: '待完成',
      code: 0
    },
    {
      name: '已超时',
      code: 5
    },
    {
      name: '待审核',
      code: 6
    },
    {
      name: '已完成',
      code: 2
    },
  ]],
  [() => [2].includes(+props.queryParam.types[0]), [
    {
      name: '待完成',
      code: 0
    },
    {
      name: '已完成',
      code: 2
    },
  ]],
])

const tagInfo = computed(() => {
  let target  = [];
  tagOptions.forEach((val, key) => {
    if(key()) {      
      target = val
    }
  })
  return target
})
const tabsList = [
  { name: '维修任务', key: 3, placeholder: '任务编码、所属部门、设备名称、设备编码' },
  { name: '保养任务', key: 0, placeholder: '任务编码、所属部门、设备位置、位置编码' },
  { name: '点检任务', key: 1, placeholder: '任务编码、所属部门、设备位置、位置编码' },
  { name: '盘点任务', key: 2, placeholder: '任务编码、任务名称' },
]

const title = computed(() => tabsList?.find(v => v.key === +props.queryParam.types[0])?.name)
const placeholder = computed(() => tabsList?.find(v => v.key === +props.queryParam.types[0])?.placeholder)


const changeTab = data => {
  activeTab.value = data
  queryParam.value.classification = data
  emit('load')
}

const selectTag = (data) => {  
  queryParam.value.status = data.key;
  emit("load");
};

onShow(() => {
  changeTab(0)
})

const statistics = ref()

async function getCount() {
  try {
    const {data} = await TaskApi.statistics(props.queryParam)
    statistics.value = data
  } catch (error) {
    console.log(error);
    
  }
}

getCount()

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
const temQueryParam = ref<Record<string, any>>({});
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

.search {
  margin: 24rpx 16px;
}

.filter-bottom {
  display: flex;
  align-items: center;
  margin: 12px 16px;
  margin-bottom: 0;

  .tag-box {
    flex: 1;
    display: flex;
    gap: 6px;
  }

  .filter-icon {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    padding: 7px 10px;
    background-color: white;
    border-radius: 4px;
    line-height: 20px;
    font-size: 13px;
    color: #999999
  }

  .icon {
    width: 12px;
    height: 12px;
    margin-right: 2px;
  }

  .tag {
    font-size: 28rpx;
    display: inline-block;
    padding: 8px 12px;
    background: #fff;
    color: #999999;
    border-radius: 4px;
    border: 1px solid transparent;

    &.active {
      color: $uv-primary;
      border: 1px solid $uv-primary;
    }
  }
}

.sub-label {
  font-size: 16px;
  color: #333333;
  // font-weight: bold;
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
    flex: 1;
    height: 42px;
  }



}

.time-picker {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: center;

  span {
    flex: 1;
    // text-align: center;
    background-color: #f7f8fa;
    padding: 10px;
    border-radius: 4px;
    font-size: 14px;
  }
}
</style>
