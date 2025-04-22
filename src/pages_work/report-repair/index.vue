<script setup>
import {onLoad} from "@dcloudio/uni-app";
import {ref} from 'vue'
import {WorkApi} from "@/api/WorkApi";
import {findOne, RepairStatus} from "@/dict";
const readMoreRef=ref()
const baseId = ref('')
const workList = ref([])
onLoad(({id}) => {
  baseId.value = id
  WorkApi.getUncompletedWork({deviceId: id, overtime: 1})
    .then(res => {
      workList.value = res.data.map(item => ({...item, statusInfo: findOne(item.repairStatus, RepairStatus)}))??[]

    }).finally(()=>{
    readMoreRef.value?.init()
  })
})
const handleOk = () => {
  uni.navigateTo({
    url: `/pages_work/report-repair/handle?id=${baseId.value}`
  })
}
const jumpDetail = (item) => {
  const {id, fillStatus, repairStatus} = item
  uni.navigateTo({
    url: `/pages_work/repair/index?id=${id}&repairStatus=${repairStatus}&fillStatus=${fillStatus}&view=1`,
  });
}
const handleView=()=>{
  uni.navigateTo({
    url: `/pages_work/report-repair/device?id=${baseId.value}`
  })
}

</script>

<template>
  <div class="page-body">
    <div class="order-list">
      <div class="sub-title">待完成工单</div>
              <uv-read-more textIndent="0" ref="readMoreRef" show-height="340px" :toggle="true" closeText="展开更多" >
      <template v-if="workList.length">
        <div v-for="item in workList"  :key="item.id" class="order-item" @click="jumpDetail(item)">
          <div class="item-head">
            <div class="item-title ellipsis">
              {{ item.factoryModelName }}
            </div>
            <div class="item-status">
              <span :style="{color:item.statusInfo.color}">{{ item.statusInfo.label }}</span>
            </div>
          </div>
          <div class="item-bottom">
                <span>
                    {{ item.code }}
                </span>
            <span>{{ item.deviceName }}({{ item.deviceCode }})</span>
            <span>{{ item.reportTime }} </span>
          </div>
        </div>
      </template>
                <uv-empty v-else mode="data"></uv-empty>

              </uv-read-more>


      <uv-button style="margin-top: 20px" type="primary" @click="handleOk">开始报修</uv-button>

    </div>
    <div class="bottom-btn ">
      <a   @click="handleView" >查看设备信息</a>
    </div>
  </div>
</template>

<style scoped lang="scss">
.bottom-btn{
  text-align: center;
  font-size: 32rpx;
  color: $uv-primary;
  //background: #f7f8fa;
  //padding-top: 32rpx;
}
.page-body {
  padding-bottom: 100px;
}
.order-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #fff;
  padding: 12px;


  .sub-title {
    font-weight: bold;
  }

  .item-head {
    display: flex;

    justify-content: space-between;

  }

  .item-title {
    font-size: 16px;
    font-weight: bold;
    color: #000;
    flex: 1;
    margin-right: 20px;
  }

  .item-bottom {
    color: rgba($color: #000000, $alpha: 0.3);
    display: flex;
    line-height: 20px;
    font-size: 18rpx;
    gap: 4rpx;
    margin-top: 10px;
    justify-content: space-between;

  }

  .item-status {
    font-weight: bold;
  }

  .order-item {
    padding: 12px;
    border-radius: 6px;
    background-color: #f7f8fa;
    margin-bottom: 10px;
  }
}


</style>
