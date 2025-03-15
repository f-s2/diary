<template>
  <div class="home-body">
    <div class="title">
      首页
    </div>
    <div class="top-card">
      <div class="top-title">我的业绩</div>
      <div class="card-items">

        <div class="card-item" v-for="item in cardInfo">
          <div class="top-item">
            <img class="icon" :src="item.icon" alt="">
            <span class="name">{{ item.name }}</span>
          </div>
          <div>
            <span class="value">{{ mineInfo[item.code] }}</span><span class="unit">次</span>
          </div>
        </div>
      </div>
    </div>
    <div class="map-box">
      <div class="box-title"><img class="icon" src="../static/home/inspect.png" alt=""> 点检概览</div>
      <uv-tabs class="tabs" :list="inspectionInfo?.map(item => ({ name: item.deviceGroupName, key: item.id }))"
               :lineWidth="12" :lineHeight="4" :activeStyle="{ fontWeight: 'bold', color: '#000' }"
               :inactiveStyle="{ color: 'rgba(0, 0, 0, 0.45)', fontWeight: 'bold' }"
               @change="(({ index }) => inspectIndex = index)" lineColor="#003A8B"></uv-tabs>
      <div class="map-card">
        <div class="card-title"><img class="dot" src="../static/home/dot.png" alt=""> 今日完成情况</div>
        <div class="mid-items">
          <div class="mid-item" v-for="item in completeInfo">
            <div class="label">{{ item.name }}</div>
            <div class="value">{{
                item.transform ? item.transform(inspectionInfo[inspectIndex]?.[item.code])
                    :
                    inspectionInfo[inspectIndex]?.[item.code]
              }}
            </div>
          </div>
        </div>
        <div class="map-head">
          <div class="card-title"><img class="dot" src="../static/home/dot.png" alt=""> 月度点检曲线</div>
          <div class="legend">
            <i style="background: #0B66C6;" class="square"></i>
            <span class="label">已完成 </span>
            <i style="background: #14C9C9;" class="square"></i>
            <span class="label">总数 </span>
            <i style="background: #14C9C9;" class="line"></i>
            <span class="label">完成率 </span>
          </div>
        </div>
        <map-chart :data-source="inspectionInfo[inspectIndex]?.historyList" mode="D"/>

      </div>
    </div>
    <div class="map-box">
      <div class="box-title"><img class="icon" src="../static/home/mt.png" alt=""> 保养概览</div>
      <uv-tabs class="tabs" :list="maintenanceInfo?.map(item => ({ name: item.deviceGroupName, key: item.id }))"
               :lineWidth="12" :lineHeight="4" :activeStyle="{ fontWeight: 'bold', color: '#000' }"
               :inactiveStyle="{ color: 'rgba(0, 0, 0, 0.45)', fontWeight: 'bold' }"
               @change="(({ index }) => mtIndex = index)" lineColor="#003A8B"></uv-tabs>
      <div class="map-card">
        <div class="card-title"><img class="dot" src="../static/home/dot.png" alt=""> 今日完成情况</div>
        <div class="mid-items">
          <div class="mid-item" v-for="item in completeInfo">
            <div class="label">{{ item.name }}</div>
            <div class="value">{{
                item.transform ? item.transform(maintenanceInfo[mtIndex]?.[item.code]) :
                    maintenanceInfo[mtIndex]?.[item.code]
              }}
            </div>
          </div>
        </div>
        <div class="map-head">
          <div class="card-title"><img class="dot" src="../static/home/dot.png" alt=""> 年度保养曲线</div>
          <div class="legend">
            <i style="background: #0B66C6;" class="square"></i>
            <span class="label">已完成 </span>
            <i style="background: #14C9C9;" class="square"></i>
            <span class="label">总数 </span>
            <i style="background: #14C9C9;" class="line"></i>
            <span class="label">完成率 </span>
          </div>
        </div>
        <map-chart :data-source="maintenanceInfo[mtIndex]?.historyList" mode="M"/>

      </div>
    </div>

  </div>
  <TabBar :activeIndex="0"/>

</template>

<script setup>
import TabBar from "@/components/TabBar.vue";
import {ref} from 'vue';
import {HomeApi} from '../api/HomeApi.js';
import c_1 from '../static/home/card_1.png';
import c_2 from '../static/home/card_2.png';
import c_3 from '../static/home/card_3.png';
import MapChart from './chart';

const cardInfo = [
  {name: '执行维修', icon: c_1, code: 'repair'},
  {name: '执行点检', icon: c_2, code: 'inspection'},
  {name: '执行保养', icon: c_3, code: 'maintenance'},
]

const completeInfo = [
  {name: '任务总数', code: 'total'},
  {name: '已执行', code: 'completed',},
  {name: '完成率', code: 'completionRate', transform: (val) => (val ? parseFloat(val, 1).toFixed(1) : 0) + '%'},
  {name: '我执行', code: 'mine'},
  {name: '占比', code: 'mineRate', transform: (val) => (val ? parseFloat(val, 1).toFixed(1) : 0) + '%'},
]

const mineInfo = ref({})
const maintenanceInfo = ref([])
const inspectionInfo = ref([])
const mtIndex = ref(0)
const inspectIndex = ref(0)

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
.home-body {
  background: linear-gradient(180deg, #EBF1FA 0%, #F5F7FA 41.72%, #fff 100%);
  background: #F5F7FA;
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
  font-size: 32rpx;
  font-weight: bold;

}

.map-card {
  background-color: #fff;
  padding: 32rpx;
  border-radius: 12rpx;
  margin: 32rpx 0;

  .card-title {
    font-size: 26rpx;
    font-weight: bold;
    position: relative;
    text-indent: 24rpx;
    border-radius: 10rpx;
    background: linear-gradient(73deg, rgba(1, 64, 153, .1) 11.94%, #fff 88.06%);
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
  }

  .mid-item:not(:last-child) {
    position: relative;

    &::before {
      content: '';
      position: absolute;
      display: block;
      height: 64rpx;
      width: 1px;
      right: 0;
      top: 10rpx;
      background-color: rgba(240, 240, 240, 1);
    }


  }

  .value {
    font-weight: bold;
    font-size: 36rpx;
    margin-top: 10rpx;
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
