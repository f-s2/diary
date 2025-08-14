<script lang="ts" setup>
import { onLoad } from "@dcloudio/uni-app";
import { RepairApi } from "@/api/WorkApi";
import { ref } from "vue";
import { UserApi } from '@/api/UserApi'
import { Base64 } from 'js-base64'
import { getFileName } from '@/utils/file'
import { useUserStore } from "@/store/user";
import PageContainer from "@/components/PageContainer.vue";
import ModuleWrapper from "@/components/ModuleWrapper.vue";
import LabelValueWrapper from "@/components/label-value/LabelValueWrapper.vue";
import { getFileIcon } from "@/utils/file";
const baseInfo = ref({})
const userStore = useUserStore()
onLoad(({ id }) => {
  uni.showLoading({
    title: '加载中',
    mask: true
  })
  RepairApi.deviceDetail(id)
    .then(res => {
      baseInfo.value = res.data
    }).finally(() => {
      uni.hideLoading()
    })

})
const baseConfig = [
  {
    name: '设备位置',
    code: 'factoryModelName'
  },
  {
    name: '设备名称',
    code: 'name'
  },
  {
    name: '设备型号',
    code: 'model'
  },
  {
    name: '设备编码',
    code: 'code'
  },
  {
    name: '厂商名称',
    code: 'manufacturerName'
  }, {
    name: '生产日期',
    code: 'produceDate'
  }, {
    name: '启用日期',
    code: 'enableDate'
  }, {
    name: '售后人员',
    code: 'contactPerson'
  }, {
    name: '售后电话',
    code: 'contactPhone'
  }, {
    name: '质保截止',
    code: 'maintenanceExpirationDate'
  },
]
const fileData = [
  { name: 'SOP文档', code: 'sopUrl' },
  { name: '使用说明', code: 'useManualUrl' },
  { name: '维保手册', code: 'maintenanceManualUrl' },
]
const handleViewFile = (url) => {
  if(!url) return

  window.open(
    `/preview/onlinePreview?url=` + encodeURIComponent(Base64.encode(userStore.urlPrefix + url))
  )
}


</script>

<template>
  <PageContainer>
    <div class=" px-4">
      <ModuleWrapper title="设备明细" class=" mb-4">
        <LabelValueWrapper :list="baseConfig.map(v => ({ label: v.name, value: baseInfo?.[v.code] }))">
        </LabelValueWrapper>
      </ModuleWrapper>
      <ModuleWrapper title="设备文档">
        <div class=" space-y-5">
          <div class=" flex gap-2 items-center text-14px" v-for="item in fileData" :key="item.code"  @click="handleViewFile(baseInfo[item.code])">
            <div class=" w-62px h-62px flex-shrink-0">
              <img class=" w-full" :src="getFileIcon(baseInfo[item.code])" alt="">
            </div>
            <div>
              <div class=" font-500">{{ item.name }}</div>
              <div class=" mt-2 text-#999999 break-all">{{ getFileName(baseInfo[item.code]) || '-' }}</div>
            </div>
          </div>
        </div>
      </ModuleWrapper>
    </div>
  </PageContainer>
</template>

<style scoped lang="scss">
.file-name {
  font-weight: bold;
  margin-bottom: 16rpx;
}

.file-url {
  color: #007aff;
  cursor: pointer;
}
</style>
