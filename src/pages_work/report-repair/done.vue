<script lang="ts" setup>
import { onLoad } from "@dcloudio/uni-app";
import { ref } from 'vue'
import { WorkApi } from "@/api/WorkApi";
import { findOne, RepairStatus } from "@/dict";
import PageContainer from "@/components/PageContainer.vue";
import PeoplePng from '@/static/report-repair/people.png'
import DialogPng from '@/static/report-repair/dialog.png'
import SuccessPng from '@/static/report-repair/success.png'

const baseId = ref('')
const orderCode = ref('')
const workList = ref([])
onLoad(({ id, code }) => {
  baseId.value = id
  orderCode.value = code
  WorkApi.getUncompletedWork({ deviceId: id, overtime: 1 })
    .then(res => {
      workList.value = res.data.map(item => ({ ...item, statusInfo: findOne(item.repairStatus, RepairStatus) }))
    })
})
const jumpDetail = (item) => {
  const { id, fillStatus, repairStatus } = item
  uni.navigateTo({
    url: `/pages_work/repair/index?id=${id}&repairStatus=${repairStatus}&fillStatus=${fillStatus}&view=1`,
  });
}

function copy() {
  uni.setClipboardData({
    data: orderCode.value,
    success: (result) => {
      
     },
    fail: (error) => { }
  })
}
</script>

<template>
  <!-- <div class="page-body">
    <div class="done-info">
      <div class="sub-title">提示 :</div>
      <div class="content">
        您本次报修已提交，报修单号为：<a>{{ orderCode }}</a>;
        如需继续报修，请重新扫描设备报修二维码
      </div>
    </div>
    <div class="order-list">
      <div class="sub-title">待完成工单</div>
      <template v-if="workList.length">

        <div v-for="item in workList" :key="item.id" class="order-item" @click="jumpDetail(item)">
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

</div>

</div> -->

  <PageContainer>
    <div class=" px-4">
      <div class=" relative h-230px">
        <image mode="widthFix" class=" h-full" :src="PeoplePng" alt=""/>
        <div
          class=" absolute text-xs pl-36px pr-4 pt-5 top-30px left-87px w-256px h-157px bg-contain bg-no-repeat bg-center"
          :style="`background-image: url(${DialogPng});`">
          <div class=" f-c-c text-14px font-600">
            <image mode="widthFix" class=" w-4 mr-6px" :src="SuccessPng" alt=""/>
            <span>报修已完成！</span>
          </div>
          <div class=" mt-9px space-y-5px">
            <div>您本次报修已提交</div>
            <div class=" f-c-b">
              <div>
                报修单号：<span class=" font-500">{{ orderCode }}</span>
              </div>
              <a class=" text-primary ml-1 flex-shrink-0" @click="copy">复制</a>
            </div>
            <div>
              如需继续报修，请重新扫描设备报修二维码，感谢您的反馈！
            </div>
          </div>
        </div>
      </div>

      <div class=" my-3 font-500">待完成工单</div>
      <div class="bg-white px-10px pt-10px pb-5 rounded-1 mb-3" v-for="item in workList" :key="item.id" @click="jumpDetail(item)">
          <div class=" flex f-c-b mb-3">
            <span class=" font-500">{{ item.factoryModelName }}</span>
            <div class="px-10px text-xs font-500 relative py-6px rounded-2px overflow-hidden bg-opacity-10" :style="`color:${findOne(item.repairStatus, RepairStatus).color};`">
              <div class=" absolute w-full h-full left-0 top-0 opacity-10" :style="`background-color:${findOne(item.repairStatus, RepairStatus).color};`"></div>
              <span class="">·{{ findOne(item.repairStatus, RepairStatus).label }}</span>
            </div>
          </div>
          <div class=" f-c-b text-14px mb-2">
            <span class=" font-500">{{ item.deviceCode }}</span>
            <span>{{ item.reportTime }}</span>
          </div>
          <div class=" text-14px font-500">{{ item.deviceName }}：({{ item.code }})</div>
        </div>
    </div>
  </PageContainer>
</template>

<style scoped lang="scss">
.done-info {
  background-color: #fff;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
  border-radius: 6px;

}

.sub-title {
  font-weight: bold;
}

.content {
  word-break: break-all;
  font-size: 13px;
  line-height: 24px;

  a {
    color: $uv-primary;
    font-weight: bold;
  }
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #fff;
  padding: 12px;
  border-radius: 6px;


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
  }
}
</style>
