<template>
  <div class="home-body">
    <div class=" bg-center bg-cover h-106px rounded-t-12px flex items-center justify-around"
      :style="`background-image: url(${BannerBg})`">
      <div class=" text-center text-white" v-for="item in cardInfo">
        <div class=" font-600 text-28px">{{ mineInfo[item.code] }}</div>
        <div class=" text-14px">{{ item.name }}</div>
      </div>
    </div>
    <div class=" flex items-center justify-between">
      <div v-for="nav in navList" :key="nav.name" @click="handleJump(nav)">
        <div class="h-73px">
          <img class=" h-full" :src="nav.icon" alt="">
        </div>
        <div class=" text-#333333 text-center mt-8px text-12px font-500">{{ nav.name }}</div>
      </div>
    </div>
    <div class="map-box">
      <div class="module-title"> 点检概览</div>
      <!-- <uv-tabs class="tabs" :list="inspectionInfo?.map(item => ({ name: item.ownOrganizeName, key: item.id }))"
               :lineWidth="12" :lineHeight="4" :activeStyle="{ fontWeight: 'bold', color: '#000' }"
               :inactiveStyle="{ color: 'rgba(0, 0, 0, 0.45)', fontWeight: 'bold' }"
               @change="(({ index }) => inspectIndex = index)" lineColor="#003A8B"></uv-tabs> -->
      <div class="map-card module-wrapper">
        <div class="card-title"> 今日完成情况</div>
        <div class="mid-items">
          <div class="mid-item" v-for="item in completeInfo">
            <div class="value">{{
              (item.transform ? item.transform(inspectionInfo[inspectIndex]?.[item.code])
                :
                inspectionInfo[inspectIndex]?.[item.code]) ?? 0
            }}
            </div>
            <div class="label">{{ item.name }}</div>
          </div>
        </div>
        <div class="map-head">
          <div class="card-title"> 月度点检曲线</div>
          <div class="legend">
            <i style="background: #0B66C6;" class="square"></i>
            <span class="label">已完成 </span>
            <i style="background: #14C9C9;" class="square"></i>
            <span class="label">总数 </span>
            <i style="background: #14C9C9;" class="line"></i>
            <span class="label">完成率 </span>
          </div>
        </div>
        <map-chart :data-source="inspectionInfo[inspectIndex]?.historyList" mode="D" />

      </div>
    </div>
    <div class="map-box">
      <div class="box-title module-title"> 保养概览</div>
      <!-- <uv-tabs class="tabs" :list="maintenanceInfo?.map(item => ({ name: item.ownOrganizeName, key: item.id }))"
               :lineWidth="12" :lineHeight="4" :activeStyle="{ fontWeight: 'bold', color: '#000' }"
               :inactiveStyle="{ color: 'rgba(0, 0, 0, 0.45)', fontWeight: 'bold' }"
               @change="(({ index }) => mtIndex = index)" lineColor="#003A8B"></uv-tabs> -->
      <div class="map-card module-wrapper">
        <div class="card-title">今日完成情况</div>
        <div class="mid-items">
          <div class="mid-item" v-for="item in completeInfo">
            <div class="value">{{
              (item.transform ? item.transform(maintenanceInfo[mtIndex]?.[item.code]) :
                maintenanceInfo[mtIndex]?.[item.code]) ?? 0
            }}
            </div>
            <div class="label">{{ item.name }}</div>
          </div>
        </div>
        <div class="map-head">
          <div class="card-title"> 年度保养曲线</div>
          <div class="legend">
            <i style="background: #0B66C6;" class="square"></i>
            <span class="label">已完成 </span>
            <i style="background: #14C9C9;" class="square"></i>
            <span class="label">总数 </span>
            <i style="background: #14C9C9;" class="line"></i>
            <span class="label">完成率 </span>
          </div>
        </div>
        <map-chart :data-source="maintenanceInfo[mtIndex]?.historyList" mode="M" />

      </div>
    </div>

  </div>
  <TabBar :activeIndex="0" />

</template>

<script lang="ts" setup>
import TabBar from "@/components/TabBar.vue";
import { ref } from 'vue';
import { HomeApi } from '../api/HomeApi.js';
import c_1 from '../static/home/card_1.png';
import c_2 from '../static/home/card_2.png';
import c_3 from '../static/home/card_3.png';
import MapChart from './chart.vue';
import BannerBg from '@/static/home/banner-bg.png'
import Nav1 from '@/static/home/nav-1.png'
import Nav2 from '@/static/home/nav-2.png'
import Nav3 from '@/static/home/nav-3.png'
import Nav4 from '@/static/home/nav-4.png'

const cardInfo = [
  { name: '执行维修', icon: c_1, code: 'repair' },
  { name: '执行点检', icon: c_2, code: 'inspection' },
  { name: '执行保养', icon: c_3, code: 'maintenance' },
]

const completeInfo = [
  { name: '任务总数', code: 'total' },
  { name: '已执行', code: 'completed', },
  { name: '完成率', code: 'completionRate', transform: (val) => (val ? parseFloat(val).toFixed(1) : 0) + '%' },
  { name: '我执行', code: 'mine' },
  { name: '占比', code: 'mineRate', transform: (val) => (val ? parseFloat(val).toFixed(1) : 0) + '%' },
]

const navList = [
  {
    name: '保养任务',
    path: '',
    icon: Nav1
  },
  {
    name: '点检任务',
    path: '',
    icon: Nav2
  },
  {
    name: '维修任务',
    path: '',
    icon: Nav3
  },
  {
    name: '盘点任务',
    path: '',
    icon: Nav4
  },
]

const mineInfo = ref({})
const maintenanceInfo = ref([])
const inspectionInfo = ref([])
const mtIndex = ref(0)
const inspectIndex = ref(0)

function handleJump(item: typeof navList[number]) {
  console.log(item);
  
}

const init = () => {
  HomeApi.mine({}).then(res => {
    mineInfo.value = res.data
  })
  HomeApi.maintenance({}).then(res => {
    maintenanceInfo.value = res.data
  })
  HomeApi.inspection({}).then(res => {
    inspectionInfo.value = res.data
  })
}


init()
</script>
<style lang='scss' scoped>
.module-title {
  color: #333333;
  font-size: 14px;
  font-weight: 500;
  position: relative;
  padding-left: 8px;

  &::before {
    content: '';
    width: 3px;
    height: 11px;
    background-color: #004098;
    border-radius: 2px;
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
  }
}

.module-wrapper {
  background-image: linear-gradient(to bottom, #E9F6FF, #FFFFFF 160px);
  box-shadow: 0px -2px 0px 0px #fff;
}

.home-body {
  padding: 32rpx;
  display: flex;
  flex-direction: column;
  gap: 48rpx;
  padding-bottom: 100rpx;

}

.title {

  font-size: 40rpx;
  font-weight: 600;
  line-height: 56rpx;
}

.top-card {
  background-image: url(../static/home/card.png);
  background-size: 100% 100%;
  border-radius: 16rpx;
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.15);
  padding: 32rpx;
  color: #fff;

  .top-title {
    font-weight: bold;
    font-size: 32rpx;
    border-bottom: 1px solid rgba(255, 255, 255, .3);
    padding-bottom: 32rpx;
    margin-bottom: 32rpx;
  }
}

.card-items {
  display: flex;
  justify-content: space-between;

  .top-item {
    display: flex;
    align-items: center;
    gap: 8rpx;
    margin-bottom: 20rpx;
  }

  .icon {
    width: 36rpx;
    height: 36rpx;
  }

  .name {
    font-size: 26rpx;
  }

  .value {
    font-weight: 600;
    font-size: 40rpx;
    margin-right: 8rpx;
  }

  .unit {
    font-size: 24rpx;
  }
}

.box-title {
  display: flex;
  align-items: center;
  gap: 16rpx;
  // font-size: 32rpx;
  // font-weight: bold;

}

.map-card {
  padding: 32rpx;
  border-radius: 12rpx;
  margin: 32rpx 0;

  .card-title {
    font-size: 24rpx;
    font-weight: bold;
    position: relative;
    // text-indent: 24rpx;
    border-radius: 10rpx;
    // background: linear-gradient(73deg, rgba(1, 64, 153, .1) 11.94%, #fff 88.06%);
    display: inline-flex;

    .dot {
      position: absolute;
      left: 0;
      bottom: -2rpx;
    }
  }
}

.mid-items {
  display: flex;
  justify-content: space-between;
  font-size: 24rpx;
  margin: 48rpx 0;

  .mid-item {
    flex: 1;
    text-align: center;

    .value {
      font-weight: bold;
      color: #333333;
      font-size: 40rpx;
      margin-bottom: 16rpx;
    }
    .label {
      color: #6A777F;
      font-size: 24rpx;
    }
  }

  .mid-item:not(:last-child) {
    position: relative;

    // &::before {
    //   content: '';
    //   position: absolute;
    //   display: block;
    //   height: 64rpx;
    //   width: 1px;
    //   right: 0;
    //   top: 10rpx;
    //   background-color: rgba(240, 240, 240, 1);
    // }


  }


}

.map-head {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .legend {
    font-size: 24rpx;
    display: flex;
    align-items: center;

    .label {
      color: #999999;
      &:not(:last-of-type) {
        margin-right: 20rpx;
      }
    }

    .square {
      width: 16rpx;
      height: 16rpx;
      margin-right: 4rpx;
    }

    .line {
      width: 16rpx;
      height: 4rpx;
      margin-right: 4rpx;
    }
  }
}
</style>
