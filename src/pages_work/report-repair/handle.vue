<template>
  <!-- <div class="page-body">
    <div class="sub-title">
      设备信息
    </div>
    <div class="describe-box" style="margin-bottom: 12px">
      <div :class="['describe-item', { wrap: item.wrap }]" v-for="item in baseConfig" :key="item.name">
        <div class="describe-label">
          {{ item.name }}
        </div>
        <div class="describe-value">
                    <span v-if="!item.custom">
                        {{ formData?.[item.code] || "--" }}
                    </span>
          <span v-if="item.code === 'type'">
                        <status-tag :status="3" :tag="true"/>
                    </span>

        </div>
      </div>
    </div>
    <uv-form labelPosition="left" :model="formData" :rules="rules" ref="formRef" labelWidth="auto">

      <div class="form-card">

        <uv-form-item label="故障内容 :" prop="malfunctionDescription" labelPosition="top" borderBottom>

          <uv-textarea border="none" v-model="formData.malfunctionDescription"
                       placeholder="请输入内容"></uv-textarea>
        </uv-form-item>

        <uv-form-item label="图片视频 :"  required labelPosition="top" prop="repairFiles">
          <div>

            <htz-image-upload :dataType="1" :max="9" mediaType="all"
                              :action="netConfig.baseName + '/business/picture/upload'" v-model="formData.repairFiles"
                              :uploadSuccess="uploadSuccess"></htz-image-upload>
          </div>
        </uv-form-item>
      </div>
    </uv-form>
    <div class="bottom-btn">
      <uv-button type="primary" @click="handleSave"> 报修</uv-button>
    </div>

  </div> -->

  <PageContainer>
    <div class=" px-4">
      <ModuleWrapper class=" mb-4" title="设备信息">
        <uv-form labelPosition="left" :model="formData" :rules="rules" ref="formRef" labelWidth="auto">

          <uv-form-item prop="factoryModelId" @click="modalState.positionShow = true" label="设备位置 :">
            <uv-input v-model="formData.factoryModelName" disabled disabledColor="#ffffff" placeholder="请选择设备位置">
              <template #suffix>
                <uv-icon name="arrow-down-fill" color="#BEC7CE"></uv-icon>
              </template>
            </uv-input>


          </uv-form-item>

          <uv-form-item prop="name" @click="modalState.show = true" label="设备名称 :">
            <uv-input v-model="formData.name" disabled disabledColor="#ffffff" placeholder="请选择设备">
              <template #suffix>
                <uv-icon name="arrow-down-fill" color="#BEC7CE"></uv-icon>
              </template>
            </uv-input>

          </uv-form-item>

          <uv-form-item label="设备型号：" prop="malfunctionDescription" labelPosition="left">
            {{ formData.model || '-' }}
          </uv-form-item>
          <uv-form-item label="设备编码：" prop="malfunctionDescription" labelPosition="left">
            {{ formData.code || '-' }}
          </uv-form-item>
        </uv-form>
      </ModuleWrapper>
      <ModuleWrapper title="报修内容">
        <uv-form labelPosition="left" :model="formData" :rules="rules" ref="formRef" labelWidth="auto">

          <uv-form-item label="报修人员：" prop="reportPerson" labelPosition="left">
            <uv-input placeholder="请输入报修人员名称" v-model="formData.reportPerson"></uv-input>

          </uv-form-item>
          <uv-form-item label="联系电话：" prop="phoneNumber" labelPosition="left">
            <uv-input placeholder="请输入保修人员联系电话" type="number" v-model="formData.phoneNumber"></uv-input>

          </uv-form-item>
           <uv-form-item label="紧急程度：" prop="urgency">
          <uv-radio-group v-model="formData.urgency" shape="solved" activeColor="#0C6EC6" style="flex: none;">
            <uv-radio :name="item.value" :label="item.label" style="margin-right: 10px;" v-for="item in RepairUrgencyLevelOptions"></uv-radio>
          </uv-radio-group>
        </uv-form-item>
          <uv-form-item label="故障描述：" :customStyle="{ alignItems: 'start' }" prop="malfunctionDescription"
            labelPosition="left">
            <uv-textarea v-model="formData.malfunctionDescription" placeholder="请输入故障描述"></uv-textarea>
          </uv-form-item>
          <uv-form-item label="图片视频：" :customStyle="{ alignItems: 'start' }" required labelPosition="left" prop="repairFiles">
            <div>

              <htz-image-upload :dataType="1" :max="9" mediaType="all"
                :action="netConfig.baseName + '/business/picture/upload'" v-model="formData.repairFiles"
                :uploadSuccess="uploadSuccess"></htz-image-upload>
            </div>
          </uv-form-item>
        </uv-form>
      </ModuleWrapper>
      <uv-button type="primary" class="mt-5" @click="handleSave">报修</uv-button>
    </div>
    <select-device v-model:show="modalState.show" :data="formData" @ok="handleDeviceConfirm" />
    <select-position v-model:show="modalState.positionShow" @ok="handleDevicePositionConfirm" />

  </PageContainer>
</template>

<script lang="ts" setup>
import { RepairApi } from "@/api/WorkApi";
import htzImageUpload from '@/components/htz-image-upload/htz-image-upload.vue';
import { netConfig } from '@/config/net.config';
import { onLoad } from '@dcloudio/uni-app';
import { reactive, ref } from 'vue';
import { useUserStore } from '@/store/user'
import PageContainer from "@/components/PageContainer.vue";
import ModuleWrapper from "@/components/ModuleWrapper.vue";
import SelectDevice from '@/pages_work/report-repair/components/SelectDevice.vue'
import SelectPosition from '@/pages_work/report-repair/components/SelectPosition.vue'
import { RepairUrgencyLevelOptions } from "@/enums/work";

uni.hideTabBar()

interface FormStatus {
  deviceId: string,
  code: string,
  name: string,
  factoryModelName: string,
  malfunctionDescription: string,
  repairFiles: any[]
  reportPerson: string
  phoneNumber: string
  factoryModelId: string
  model: string
  id: string
  urgency: string
}

const userStore = useUserStore()
const formData = ref<Partial<FormStatus>>({
  name: ''
})
const baseId = ref('')
onLoad(({ id }) => {
  baseId.value = id
  getInfo()


})


const getInfo = () => {
  RepairApi.deviceDetail(baseId.value).then(res => {
    const { code, name, factoryModelName, id: deviceId } = res.data
    formData.value = {...res.data, deviceId, code, name, factoryModelName, malfunctionDescription: '', repairFiles: [] }
  })
}
const rules: Record<string, FormRule[]> = {
  repairFiles: [
    { required: true, message: '请上传图片或视频' },
  ],
}


const baseConfig = [
  {
    name: '设备名称',
    code: 'name'
  },
  {
    name: '设备编码',
    code: 'code'
  },

  {
    name: '位置',
    code: 'factoryModelName'
  },

]


const uploadSuccess = (res) => {
  const _res = JSON.parse(res.data);
  if (_res.code == 0) {
    return {
      success: true,
      url: userStore.urlPrefix + _res.data.name,
      name: _res.data.name
    }
  } else {
    return {
      success: false,
      url: ''
    }
  }
}

const recorder = ref()


const formRef = ref()
const handleSave = async () => {
  await formRef.value.validate()
  uni.showModal({
    content: '请确定是否提交报修?',
    success: function (res) {
      if (res.confirm) {
        const { repairFiles } = formData.value
        uni.showLoading({
          title: '报修中，请勿离开。。。',
          mask: true
        })
        RepairApi.add({
          ...formData.value, id: undefined, repairFiles: repairFiles.map(item => ({ fileType: item.type, relContext: item.name })),
        }).then(res => {
          //@ts-ignore
          if (res.code === 0) {
            uni.showToast({
              title: '报修成功'
            })
            uni.redirectTo({
              url: `/pages_work/report-repair/done?id=${baseId.value}&code=${res.data}`
            })

          }
        }).finally(() => {
          uni.hideLoading()
        })

      }
    }
  })


}



const modalState = reactive({
  show: false,
  positionShow: false
})
const deviceColumns = ref([])
const handleDeviceConfirm = (item) => {
  const { name, code, id, model } = item
  formData.value = { ...formData.value, model, id, name, code }
}
const handleDevicePositionConfirm = (item) => {
  const { key: factoryModelId, label: factoryModelName } = item
  formData.value = {
    ...formData.value,
    factoryModelName,
    factoryModelId,
    model: undefined,
    id: undefined,
    name: undefined,
    code: undefined
  }

}



</script>
<style lang='scss' scoped>
.page-body {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  padding-bottom: 100px;
}

.sub-title {
  font-size: 16px;
  font-weight: bold;
  text-indent: 10px;
}

.form-card {
  background-color: #fff;
  padding: 20rpx;
  border-radius: 10rpx;
}
</style>
