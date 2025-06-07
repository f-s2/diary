<script setup>
import {onLoad} from "@dcloudio/uni-app";
import {RepairApi} from "@/api/WorkApi";
import {ref} from "vue";
import { UserApi } from '@/api/UserApi'
import { Base64 } from 'js-base64'
import { getFileName } from '../../utils/file'
import {useUserStore} from "@/store/user";
const baseInfo=ref({})
const userStore = useUserStore()
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
    code: 'model'
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
const fileData = [
  { name: 'SOP文档', code: 'sopUrl' },
  { name: '使用说明', code: 'useManualUrl' },
  { name: '维保手册', code: 'maintenanceManualUrl' },
]
const handleViewFile = (url) => {
  window.open(
    `/preview/onlinePreview?url=` + encodeURIComponent(Base64.encode(userStore.urlPrefix + url))
  )
}
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
    <uv-list   >
      <uv-list-item direction="column"  border  v-for="item in fileData" :key="item.name">
        <template #header >
        <span class="file-name"> {{item.name}}</span>
        </template>
        <template #footer >
          <span @click="handleViewFile(baseInfo[item.code])"  v-if="baseInfo[item.code]" class="file-url">{{getFileName(baseInfo[item.code]) }} </span>
          <span v-else>-</span>
        </template>
      </uv-list-item>
    </uv-list>
  </div>
</template>

<style scoped lang="scss">
.file-name{
  font-weight: bold;
  margin-bottom: 16rpx;
}
.file-url{
  color: #007aff;
  cursor: pointer;
}

</style>
