<script setup>
import {onLoad} from "@dcloudio/uni-app";
import {RepairApi} from "@/api/WorkApi";
import {ref} from "vue";
const baseInfo=ref({})
onLoad(({id}) => {
  uni.showLoading({
    title: '加载中',
    mask: true
  })
  RepairApi.deviceDetail(id)
      .then(res => {
        baseInfo.value = res.data
      }).finally(()=>{
        uni.hideLoading()
  })
})
const baseConfig=[ {
  name: '设备名称',
  code: 'name'
},
  {
    name: '设备编码',
    code: 'code'
  },
  {
    name: '设备型号',
    code: 'factoryModelName'
  },{
    name: '厂商名称',
    code: 'manufacturerName'
  },{
    name: '生产日期',
    code: 'produceDate'
  },{
    name: '启用日期',
    code: 'enableDate'
  },{
    name: '售后联系人',
    code: 'contactPerson'
  },{
    name: '售后联系电话',
    code: 'contactPhone'
  },{
    name: '质保截止日期',
    code: 'maintenanceExpirationDate'
  },
]
</script>

<template>
  <div class="page-body">
    <div class="describe-box" style="margin-bottom: 12px">
      <div :class="['describe-item', { wrap: item.wrap }]" v-for="item in baseConfig" :key="item.name">
        <div class="describe-label">
          {{ item.name }}
        </div>
        <div class="describe-value">
                    <span v-if="!item.custom">
                        {{ baseInfo?.[item.code] || "--" }}
                    </span>

        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">

</style>
