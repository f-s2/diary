<script setup>
import {onLoad} from "@dcloudio/uni-app";
import {ref} from 'vue'
import {WorkApi} from "@/api/WorkApi";
import {findOne, RepairStatus} from "@/dict";

const baseId = ref('')
const orderCode = ref('')
const workList = ref([])
onLoad(({id, code}) => {
  baseId.value = id
  orderCode.value = code
  WorkApi.getUncompletedWork({deviceId: id, overtime: 1})
    .then(res => {
      workList.value = res.data.map(item => ({...item, statusInfo: findOne(item.repairStatus, RepairStatus)}))
    })
})
const jumpDetail = (item) => {
  const {id, fillStatus, repairStatus} = item
  uni.navigateTo({
    url: `/pages_work/repair/index?id=${id}&repairStatus=${repairStatus}&fillStatus=${fillStatus}&view=1`,
  });
}

</script>

<template>
  <div class="page-body">
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

  </div>
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
