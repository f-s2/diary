<script lang="ts" setup>
import { onLoad, onShow } from "@dcloudio/uni-app";
import { ref } from 'vue'
import { WorkApi } from "@/api/WorkApi";
import { findOne, RepairStatus } from "@/dict";
import PageContainer from "@/components/PageContainer.vue";
const readMoreRef = ref()
const baseId = ref('')
const workList = ref<ReportRepair.Item[]>([])

const loading = ref(false)
onLoad(({ id }) => {
  baseId.value = id
})

onShow(() => {
  getData()
})

function getData() {
  loading.value = true
  WorkApi.getUncompletedWork({ deviceId: baseId.value, overtime: 1 })
    .then(res => {
      workList.value = res.data.map(item => ({ ...item, statusInfo: findOne(item.repairStatus, RepairStatus) })) ?? []

    }).finally(() => {
      readMoreRef.value?.init()
      loading.value = false
    })
}

const handleOk = () => {
  uni.navigateTo({
    url: `/pages_work/report-repair/handle?id=${baseId.value}`
  })
}
const jumpDetail = (item) => {
  const { id, fillStatus, repairStatus } = item
  uni.navigateTo({
    url: `/pages_work/repair/index?id=${id}&repairStatus=${repairStatus}&fillStatus=${fillStatus}&view=1`,
  });
}
const handleView = () => {
  uni.navigateTo({
    url: `/pages_work/report-repair/device?id=${baseId.value}`
  })
}
const handleHistory = () => {
  uni.navigateTo({
    url: `/pages_work/report-repair/history?id=${baseId.value}`
  })
}

</script>

<template>
  <!-- <div class="page-body">
    <div class="order-list">
      <div class="sub-title">待完成工单</div>
      <uv-read-more textIndent="0" ref="readMoreRef" show-height="340px" :toggle="true" closeText="展开更多">
        <template v-if="workList.length">
          <div v-for="item in workList" :key="item.id" class="order-item" @click="jumpDetail(item)">
            <div class="item-head">
              <div class="item-title ellipsis">
                {{ item.factoryModelName }}
              </div>
              <div class="item-status">
                <span :style="{ color: item.statusInfo.color }">{{ item.statusInfo.label }}</span>
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
  <a @click="handleView">查看设备信息</a>
</div>
</div> -->

  <PageContainer :loading="loading">
    <div class=" px-4">
      <div class=" font-500 mb-3">待完成工单</div>
      <uv-empty v-if="!workList.length" mode="data"></uv-empty>
      <uv-read-more textIndent="0" ref="readMoreRef" show-height="320px" :toggle="true" closeText="展开更多">
        <div class="bg-white px-10px pt-10px pb-5 rounded-1 mb-3" v-for="item in workList" :key="item.id"
          @click="jumpDetail(item)">
          <div class=" flex f-c-b mb-3">
            <span class=" font-500">{{ item.factoryModelName }}</span>
            <div class="px-10px text-xs font-500 relative py-6px rounded-2px overflow-hidden bg-opacity-10"
              :style="`color:${findOne(item.repairStatus, RepairStatus).color};`">
              <div class=" absolute w-full h-full left-0 top-0 opacity-10"
                :style="`background-color:${findOne(item.repairStatus, RepairStatus).color};`"></div>
              <span class="">·{{ findOne(item.repairStatus, RepairStatus).label }}</span>
            </div>
          </div>
          <div class=" f-c-b text-14px mb-2">
            <span class=" font-500">{{ item.code }}</span>
            <span>{{ item.reportTime }}</span>
          </div>
          <div class=" text-14px font-500">{{ item.deviceName }}：({{ item.deviceCode }})</div>
        </div>
      </uv-read-more>
      <uv-button class=" mt-50px" type="primary" @click="handleOk">设备报修</uv-button>
    </div>
    <template #footer>
      <div class=" f-c-c gap-18px">
        <a class=" text-primary text-xs font-500 py-5 text-center" @click="handleView">查看设备信息</a>
        <div class="h-12px w-px bg-primary"></div>
        <a class=" text-primary text-xs font-500 py-5 text-center" @click="handleHistory">查看历史工单</a>
      </div>
    </template>
  </PageContainer>
</template>

<style scoped lang="scss">
.bottom-btn {
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
