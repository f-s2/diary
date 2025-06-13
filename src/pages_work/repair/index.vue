<template>
  <div class="page-body custom-nav-page">
    <nav-bar />
    <u-loading v-if="loading"/>
    <div class="sub-title">
      基础信息
      <status-tag :status="+baseInfo.status" :needBg="true"/>
    </div>
    <div class="describe-box" style="margin-bottom: 12px">
      <div :class="['describe-item', { wrap: item.wrap }]" v-for="item in taskConfig" :key="item.name">
        <div class="describe-label">
          {{ item.name }}
        </div>
        <div class="describe-value">
                    <span v-if="!item.custom">
                        {{ baseInfo?.[item.code] || "--" }}
                    </span>
          <span v-if="item.code === 'type'">
                        <status-tag :status="3" :tag="true"/>
                    </span>

        </div>
      </div>
    </div>


    <div class="sub-title">
      设备信息
    </div>
    <div class="describe-box">

      <div :class="['describe-item', { wrap: item.wrap }]" v-for="item in deviceConfig" :key="item.name"
           style="border: none;">
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
    <div class="sub-title">
      报修信息
    </div>
    <div class="describe-box">

      <div :class="['describe-item', { wrap: item.wrap }]" v-for="item in reportConfig" :key="item.name"
           style="border: none;">
        <div class="describe-label">
          {{ item.name }}
        </div>
        <div class="describe-value">
                    <span v-if="!item.custom">
                        {{ baseInfo?.[item.code] || "--" }}
                    </span>
          <div v-else-if="item.code === 'repairFiles'">
            <htz-image-upload :add="false" :remove="false" :dataType="1" mediaType="all"
                              :modelValue="baseInfo.repairFiles"></htz-image-upload>

          </div>
        </div>
      </div>
    </div>
    <template v-if="baseInfo.auditStatus !== null">
      <div class="sub-title">
        维修信息
      </div>
      <div class="describe-box">

        <div :class="['describe-item', { wrap: item.wrap }]" v-for="item in repairConfig" :key="item.name"
             style="border: none;">
          <div class="describe-label">
            {{ item.name }}
          </div>
          <div class="describe-value">
                        <span v-if="!item.custom">
                            {{ baseInfo?.[item.code] || "--" }}
                        </span>
            <span v-else-if="item.code === 'solved'">
                            {{ baseInfo.solved === 1 ? '是' : '否' }}
                        </span>
            <span v-else-if="item.code === 'assistUserList'">
                            {{ baseInfo.assistUserList?.map(item => item.username)?.join('、') ?? '-' }}
                        </span>

          </div>
        </div>
      </div>
      <div class="sub-title">
        备件领用
      </div>
      <div class="spare-list">
        <div class="spare-item" v-for="(item, index) in baseInfo.sparePartsList">
          <div class="item-top">
                        <span>
                            名称： {{ item.name ?? item.sparePartsName }}
                        </span>

          </div>
          <div class="item-value">
            <uv-row>
              <uv-col span="4">
                <div class="name">货位</div>
                <div class="value">{{ item.allocation ?? '-' }}</div>
              </uv-col>
              <uv-col span="4">
                <div class="name">数量</div>
                <div class="value">{{ item.quantity }}</div>
              </uv-col>
              <uv-col span="4">
                <div class="name">使用数量</div>
                <div class="value">{{ item.usedQuantity }}</div>
              </uv-col>
            </uv-row>
          </div>
        </div>

      </div>
    </template>


    <div class="bottom-btn" v-if="!isView">
      <uv-button v-if="baseInfo.fillStatus === 0&&(baseInfo.repairStatus === 1 || baseInfo.repairStatus === 5)" type="primary" @click="handleConfirm">确认故障</uv-button>
      <uv-button v-if="baseInfo.fillStatus === 1 && (baseInfo.repairStatus === 2||baseInfo.repairStatus === 5)" type="primary"
                 @click="handleComplete">完成维修
      </uv-button>
      <uv-button v-if="baseInfo.fillStatus === 1 && baseInfo.auditStatus === null" type="primary"
                 @click="handleFill">记录填写
      </uv-button>

    </div>
    <uv-modal ref="modal" title="请确认是否为故障" @confirm="confirm" :showCancelButton="true">
      <uv-radio-group v-model="modalValue.repairStatus" placement="column" activeColor="#0C6EC6" shape="square">
        <div class="modal-item">
          不是故障，取消维修
          <uv-radio :name="4"></uv-radio>
        </div>
        <div class="modal-item">
          是故障，需要维修
          <uv-radio :name="2"></uv-radio>
        </div>
        <uv-textarea v-if="modalValue.repairStatus === 4" v-model="modalValue.cancelReason"
                     placeholder="请输入取消原因"></uv-textarea>
      </uv-radio-group>

    </uv-modal>
  </div>
</template>

<script setup>
import {RepairApi} from "@/api/WorkApi";
import htzImageUpload from '@/components/htz-image-upload/htz-image-upload.vue';
import {useUserStore} from '@/store/user';
import {onLoad, onShow} from "@dcloudio/uni-app";
import {ref} from "vue";
import NavBar from "@/components/NavBar.vue";

const userStore = useUserStore()
const loading = ref(false)
const baseInfo = ref({})
const isView = ref(false)
onLoad((data) => {
  const {view}=data
  isView.value = !!view
  baseInfo.value = data

})
onShow(() => {
  getInfo()
})
const deviceConfig = [
  {
    name: '设备名称',
    code: 'deviceName'
  },
  {
    name: '设备编码',
    code: 'deviceCode'
  },

  {
    name: '位置',
    code: 'factoryModelName'
  },

]


const taskConfig = [
  {
    name: '任务编号',
    code: 'code'
  },
  {
    name: '任务类型',
    code: 'type',
    custom: true
  },
  {
    name: '任务创建时间',
    code: 'reportTime'
  },
]
const reportConfig = [
  {
    name: '报障人',
    code: 'reportPersonName'
  },
  {
    name: '报障时间',
    code: 'reportTime',
  },
  {
    name: '故障内容',
    code: 'malfunctionDescription',
  },
  {
    name: '图片视频',
    code: 'repairFiles',
    wrap: true,
    custom: true
  },
]
const repairConfig = [
  {
    name: '维修人',
    code: 'repairUserName'
  },
  {
    name: '协同人员',
    custom: true,

    code: 'assistUserList',
  },
  {
    name: '完成时间',
    code: 'finishTime'
  },
  {
    name: '故障来源',
    code: 'malfunctionSource',
  },
  {
    name: '故障是否解决',
    custom: true,
    code: 'solved',
  },
  {
    name: '维修时长(小时)',
    code: 'repairDuration',
  },
  {
    name: '巡检维保时长(小时)',
    code: 'maintenanceDuration',
  },

  {
    name: '维修内容',
    code: 'repairDescription',
  },
]


const getInfo = () => {
  loading.value = true
  const {id} = baseInfo.value
  RepairApi.detail(id).then(res => {
    const {repairFiles} = res.data
    baseInfo.value = {
      ...res.data, repairFiles: repairFiles.map(item => {

        return {
          url: userStore.urlPrefix + item.relContext,
          type: item.fileType === 0 ? 0 : 1
        }
      }),
    }
  }).finally(() => {
    loading.value = false
  })


}

const modal = ref()
const modalValue = ref({repairStatus:4})
const handleConfirm = () => {
  modal.value.open()
}
const confirm = () => {
  const {id} = baseInfo.value
  loading.value = true

  RepairApi.preHandle({id, ...modalValue.value}).then(res => {
    if (res.code === 0) {
      uni.showToast({
        title: '请求成功'
      })
      if (modalValue.value.repairStatus === 2) {
        getInfo()
      } else {
        uni.navigateBack()

      }

    }

  }).finally(() => {
    loading.value = false
  })
}
const handleFill = () => {
  uni.navigateTo({
    url: `/pages_work/repair/fill?id=${baseInfo.value.id}`
  })
}
const handleComplete = () => {
  uni.navigateTo({
    url: `/pages_work/repair/complete?id=${baseInfo.value.id}`
  })
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

.sub-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
  margin: 12px 0;
  position: relative;
  padding-left: 20rpx;

  &::after {
    width: 12rpx;
    height: 36rpx;
    content: '';
    left: 0;
    display: inline-block;
    background-color: #003A8B;
    border-radius: 4rpx;
    position: absolute;
  }
}

.btn {
  color: #003A8B;
  font-size: 14px;
  align-items: center;
  display: flex;
  gap: 4px;
  font-weight: 500;
}


.modal-item {
  display: flex;
  justify-content: space-between;
  margin: 20rpx 10rpx;
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
}
</style>
