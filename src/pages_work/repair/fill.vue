<template>
  <div class="page-body">
    <u-loading v-if="loading"/>
    <div class="sub-title">
      报修信息
    </div>
    <uv-form labelPosition="left" :model="formData" :rules="rules" ref="formRef" labelWidth="auto">

      <div class="form-card">

        <uv-form-item class="input-right" label="报障人" borderBottom>

          {{ formData.reportPersonName }}

        </uv-form-item>
        <uv-form-item class="input-right" label="保障时间" borderBottom>

          {{ formData.reportTime }}

        </uv-form-item>
        <uv-form-item class="input-right" required label="故障来源" prop="malfunctionSource" borderBottom>
          <uv-input v-model="formData.malfunctionSource" placeholder="请输入故障来源" border="none">
          </uv-input>
        </uv-form-item>
        <uv-form-item class="input-right" required label="故障类型" prop="malfunctionType" borderBottom
                      @click="showSelect">
          <uv-input v-model="formData.malfunctionTypeName" disabled disabledColor="#ffffff" placeholder="请选择故障类型"
                    border="none">
          </uv-input>
          <template v-slot:right>
            <uv-icon name="arrow-right"></uv-icon>
          </template>
        </uv-form-item>
        <uv-form-item label="故障描述" borderBottom labelPosition="top">
          <uv-textarea border="none" v-model="formData.malfunctionDescription"
                       placeholder="请输入故障描述"></uv-textarea>
        </uv-form-item>
        <uv-form-item label="图片视频" labelPosition="top">
          <div>
            <htz-image-upload :dataType="1" :max="9" mediaType="all"
                              :action="netConfig.baseName + '/business/picture/upload'" v-model="formData.repairFiles"
                              :uploadSuccess="uploadSuccess"></htz-image-upload>
          </div>
        </uv-form-item>
      </div>
      <div class="sub-title" style="margin-top: 20px;">
        维修信息
      </div>
      <div class="form-card">

        <uv-form-item class="input-right" label="维修人" borderBottom>

          {{ formData.reportPersonName }}

        </uv-form-item>
        <uv-form-item class="input-right" @click="modalState.userShow = true" label="协助人员" borderBottom>
                    <span v-if="formData.assistUserList?.length">
                        {{ formData.assistUserList?.map(item => item.username)?.join('、') }}
                    </span>
          <span v-else style="color:#c0c4cc">请选择</span>


        </uv-form-item>
        <uv-form-item class="input-right" required label="完成时间" prop="userInfo.sex" borderBottom @click="showTime">
          <uv-input v-model="formData.finishTime" disabled disabledColor="#ffffff" placeholder="完成时间"
                    border="none">
          </uv-input>
          <template v-slot:right>
            <uv-icon name="calendar" size="20"></uv-icon>
          </template>
        </uv-form-item>
        <uv-datetime-picker ref="datePicker" :value="datetime" mode="datetime" @confirm="selectTime">
        </uv-datetime-picker>
        <uv-form-item required label="维修时长(小时)" prop="repairDuration" borderBottom>
          <uv-input type="number" inputAlign="right" v-model="formData.repairDuration" placeholder="维修时长"
                    border="none">

          </uv-input>
        </uv-form-item>
        <uv-form-item required label="巡检维保时长(小时)" prop="solution" borderBottom>
          <uv-input type="number" inputAlign="right" v-model="formData.solution" placeholder="巡检维保时长"
                    border="none">

          </uv-input>
        </uv-form-item>
        <uv-form-item required class="input-right" label="故障是否解决" prop="solved" borderBottom>
          <uv-radio-group v-model="formData.solved" shape="solved" activeColor="#0C6EC6" style="flex: none;">
            <uv-radio :name="1" label="是" style="margin-right: 10px;"></uv-radio>
            <uv-radio :name="0" label="否"></uv-radio>
          </uv-radio-group>
        </uv-form-item>
        <uv-form-item label="故障原因" required borderBottom labelPosition="top" prop="malfunctionReason">
          <uv-textarea border="none" v-model="formData.malfunctionReason" placeholder="请输入内容"></uv-textarea>
        </uv-form-item>
        <uv-form-item label="维修情况描述" required labelPosition="top" prop="repairDescription">
          <uv-textarea border="none" v-model="formData.repairDescription" placeholder="请输入内容"></uv-textarea>
        </uv-form-item>
        <uv-form-item label="图片视频" labelPosition="top">
          <div>
            <htz-image-upload :dataType="1" :max="9" mediaType="all"
                              :action="netConfig.baseName + '/business/picture/upload'"
                              v-model="formData.repairFinishFiles"
                              :uploadSuccess="uploadSuccess"></htz-image-upload>
          </div>
        </uv-form-item>
      </div>
    </uv-form>
    <div class="sub">
      <div class="sub-title">
        备件领用
      </div>
      <span class="select-btn" @click="handleSelectSpare">+ 选择备件</span>
    </div>
    <div class="spare-list">
      <div class="spare-item" v-for="(item, index) in formData.sparePartsList">
        <div class="item-top">
                    <span>
                        {{ item.name }}({{ item.code }})
                    </span>
          <uv-icon @click="formData.sparePartsList.splice(index, 1)" color="#999" name="close"></uv-icon>

        </div>
        <div class="item-value">
          <uv-row>
            <uv-col span="4">
              <div class="name">货位</div>
              <div class="value">{{ item.allocation }}</div>
            </uv-col>
            <uv-col span="4">
              <div class="name">数量</div>
              <div class="value">{{ item.quantity }}</div>
            </uv-col>
            <uv-col span="4">
              <div class="name">使用数量</div>
              <uv-input type="number" placeholder="点击填写" border="none" v-model="item.usedQuantity"
                        @blur="val => handleChange(val, item)"></uv-input>
            </uv-col>
          </uv-row>
        </div>
      </div>

    </div>


    <uv-action-sheet ref="actionSheet" :actions="actionList" @select="handleSelect">
    </uv-action-sheet>
    <div class="bottom-btn">
      <uv-button type="primary" @click="handleSave(0)">保存</uv-button>
      <uv-button type="primary" @click="handleSave(1)">提交</uv-button>
    </div>
    <select-spare v-model:show="modalState.spareShow" :data="baseInfo.assistUserList" @ok="handleAddOk"/>
    <select-users v-model:show="modalState.userShow" @ok="handleUserOk"/>

  </div>
</template>

<script setup>

import {BaseApi} from '@/api/BaseApi';
import {RepairApi} from "@/api/WorkApi";
import htzImageUpload from '@/components/htz-image-upload/htz-image-upload.vue';
import {netConfig} from '@/config/net.config';
import {useUserStore} from '@/store/user';
import {onLoad} from "@dcloudio/uni-app";
import dayjs from 'dayjs';
import SelectSpare from '../maintenance/SelectSpare.vue';
import SelectUsers from './SelectUsers.vue'

import {reactive, ref} from "vue";

const userStore = useUserStore()
const loading = ref(false)
const baseInfo = ref({})
onLoad((data) => {
  baseInfo.value = data
  getInfo()
})

const rules = {
  repairStatus: {
    required: true,
    message: '请选择'
  }
  ,
  repairType: {
    required: true,
    message: '请选择'
  }
  ,
  reportPerson: {
    required: true,
    message: '请输入'
  }
  ,
  malfunctionSource: {
    required: true,
    message: '请输入'
  }
  ,
  malfunctionType: {
    required: true,
    message: '请选择'
  }
  ,
  finishTime: {
    required: true,
    message: '请输入'
  }
  ,
  malfunctionReason: {
    required: true,
    message: '请输入'
  }
  ,
  solution: {
    required: true,
    message: '请输入'
  }
  ,
  repairDescription: {
    required: true,
    message: '请输入'
  }


}
const actionList = ref([])
const getOptions = () => {
  BaseApi.getDict('malfunction_type').then(res => {
    actionList.value = res.data.map(item => ({name: item.dictValue, value: item.dictKey}))
  })
}
getOptions()
const formData = ref({malfunctionSource: undefined})

const uploadSuccess = (res) => {
  const _res = JSON.parse(res.data);
  if (_res.code == 0) {
    return {
      success: true,
      url: userStore.userInfo.urlPrefix + _res.data.name,
      name: _res.data.name
    }
  } else {
    return {
      success: false,
      url: ''
    }
  }
}
const getInfo = () => {
  loading.value = true
  const {id} = baseInfo.value
  RepairApi.detail(id).then(res => {
    const {repairFiles, repairFinishFiles, sparePartsList} = res.data
    formData.value = {
      ...res.data,
      repairFiles: repairFiles.map(item => {

        return {
          url: userStore.userInfo.urlPrefix + item.relContext,
          type: item.fileType === 0 ? 0 : 1,
          name: item.relContext
        }
      }),
      repairFinishFiles: repairFinishFiles.map(item => {

        return {
          url: userStore.userInfo.urlPrefix + item.relContext,
          type: item.fileType === 0 ? 0 : 1,
          name: item.relContext
        }
      }),
      sparePartsList: sparePartsList.map(item => ({
        ...item,
        name: item.sparePartsName,
        code: item.sparePartsCode,
        id: item.sparePartsId
      }))
    }
  }).finally(() => {
    loading.value = false
  })


}
const actionSheet = ref()

const showSelect = () => {
  actionSheet.value.open()
}

const handleSelect = ({name, value}) => {
  formData.value.malfunctionType = value
  formData.value.malfunctionTypeName = name
}
const formRef = ref()
const handleSave = async (commit) => {
  const {repairFiles, sparePartsList} = formData.value

  if (commit) {
    await formRef.value.validate()
    if (sparePartsList?.length) {
      if (sparePartsList.some(item => !Number.isInteger(item.usedQuantity))) {
        uni.showToast({
          title: '请填写备件使用数量!',
          icon: 'none'
        })
        return
      }
    }
  }


  RepairApi.handle({
    ...formData.value,
    repairFiles: repairFiles.map(item => ({fileType: item.type, relContext: item.name})),
    repairFinishFiles: repairFiles.map(item => ({fileType: item.type, relContext: item.name})),
    sparePartsList: sparePartsList.map(item => ({sparePartsId: item.id, usedQuantity: item.usedQuantity})),
    commit
  }).then(res => {
    if (res.code === 0) {
      uni.showToast({
        title: '请求成功'
      })

      commit && uni.navigateBack()


    }
  })

}
const datePicker = ref()
const datetime = ref('')
const showTime = () => {
  datetime.value = dayjs(formData.value?.finishTime ? formData.value.finishTime : undefined).valueOf()
  datePicker.value.open()
}
const selectTime = ({value}) => {
  formData.value.finishTime = dayjs(value).format('YYYY-MM-DD HH:mm:ss')

}


const modalState = reactive({
  show: false,
  userShow: false
})

const handleSelectSpare = () => {
  modalState.spareShow = true

}
const handleChange = (val, item) => {
  if (val > item.quantity) {
    item.usedQuantity = item.quantity
  } else if (val < 1) {
    item.usedQuantity = 1
  } else {
    item.usedQuantity = +val
  }
}
const handleAddOk = (list) => {
  if (formData.value.sparePartsList) {
    list.forEach(element => {
      const val = formData.value.sparePartsList.find(item => item.id === element.id)
      if (!val) {
        formData.value.sparePartsList.unshift(element)
      }
    });

  } else {
    formData.value.sparePartsList = list
  }
}

const handleUserOk = (data) => {
  formData.value.assistUserList = data
  formData.value.assistUserIds = data.map(item => item.id)
}


</script>
<style lang='scss' scoped>
.page-body {
  padding-bottom: 100px;
}

.bottom-btn {
  display: flex;

  .uv-button-wrapper {
    flex: 1;
  }

  gap: 40rpx
}

.sub {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sub-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
  margin: 12px 0;


}

.btn {
  color: $uni-primary;
  font-size: 14px;
  align-items: center;
  display: flex;
  gap: 4px;
  font-weight: 500;
}

.form-card {
  background-color: #fff;
  padding: 20rpx;
  border-radius: 10rpx;
}

.select-btn {
  border-radius: 4px;
  border: 1px solid $uni-primary;
  background: rgba(24, 144, 255, 0.10);
  display: flex;
  padding: 4px 8px;
  align-items: center;
  color: $uni-primary;
  gap: 4px;
}

.spare-list {
  display: flex;
  flex-direction: column;
  gap: 8px;

  > div {
    border-radius: 4px;
    background: #FFF;
    display: flex;
    padding: 12px 16px;
    flex-direction: column;
    gap: 16px;

  }

  .name {
    color: rgba(0, 0, 0, 0.50);
    margin-bottom: 6px;
  }

  .item-top {
    display: flex;
    justify-content: space-between;
  }
}
</style>
