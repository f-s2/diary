<template>
  <PageContainer :loading="loading">
    <div class=" px-4 space-y-3 pb-4">
      <ModuleWrapper title="基础信息">
        <LabelValueWrapper :list="[
          {
            label: '任务编号',
            value: baseInfo.code
          },
          {
            label: '任务类型',
            value: baseInfo.type,
            customRender(value) {
              return h('span', { style: { color: '#FF9D00' } }, '维修')
            },
          },
          {
            label: '创建时间',
            value: baseInfo.reportTime
          }
        ]"></LabelValueWrapper>
      </ModuleWrapper>
      <ModuleWrapper title="设备信息">
        <LabelValueWrapper :list="deviceConfig.map(v => ({ label: v.name, value: baseInfo[v.code] }))">
        </LabelValueWrapper>
      </ModuleWrapper>
      <ModuleWrapper title="报修信息">
        <LabelValueWrapper
          :list="reportConfig.map(v => ({ label: v.name, value: baseInfo[v.code], notRender: v.code === 'repairFiles' }))">
          <LabelValueItem label="图片视频">
            <htz-image-upload :add="false" :remove="false" :dataType="1" mediaType="all"
              :modelValue="baseInfo.repairFiles"></htz-image-upload>
          </LabelValueItem>
        </LabelValueWrapper>
      </ModuleWrapper>
      <template v-if="baseInfo.auditStatus !== null">
        <module-wrapper title="维修信息">
          <label-value-wrapper
            :list="repairConfig.map(v => ({ label: v.name, value: baseInfo[v.code], notRender: ['solved', 'assistUserList'].includes(v.code) }))">
            <label-value-item label="故障是否解决">
              {{ baseInfo.solved === 1 ? '是' : '否' }}
            </label-value-item>
            <label-value-item label="协同人员">
              {{baseInfo.assistUserList?.map(item => item.username)?.join('、') ?? '-'}}
            </label-value-item>
          </label-value-wrapper>
        </module-wrapper>
        <module-wrapper title="备件领用">
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
        </module-wrapper>
      </template>
    </div>
    <template #footer>
      <div class="bottom-btn px-4 pt-4" v-if="!isView">
        <uv-button v-if="baseInfo.fillStatus === 0 && (baseInfo.repairStatus === 1 || baseInfo.repairStatus === 5)" type="primary"
          @click="handleConfirm">
          确认故障
        </uv-button>
        <template v-if="baseInfo.fillStatus === 1">
          <uv-button v-if="!baseInfo.repairUser" type="primary" @click="handleReceive">
            领取任务
          </uv-button>
          <template v-if="userStore.userInfo.id === baseInfo.repairUser">
            <uv-button v-if="(baseInfo.repairStatus === 2 || baseInfo.repairStatus === 5)" type="primary"
              @click="handleComplete">完成维修
            </uv-button>
            <uv-button v-if="baseInfo.auditStatus === null && baseInfo.repairStatus !== 4" type="primary"
              @click="handleFill">记录填写
            </uv-button>
          </template>
        </template>

      </div>
    </template>
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
  </PageContainer>
</template>

<script lang="ts" setup>
import { RepairApi } from "@/api/WorkApi";
import htzImageUpload from '@/components/htz-image-upload/htz-image-upload.vue';
import { useUserStore } from '@/store/user';
import { onLoad, onShow } from "@dcloudio/uni-app";
import { h, ref } from "vue";
import NavBar from "@/components/NavBar.vue";
import ModuleWrapper from "@/components/ModuleWrapper.vue";
import LabelValueWrapper from "@/components/label-value/LabelValueWrapper.vue";
import LabelValueItem from "@/components/label-value/LabelValueItem.vue";
import PageContainer from "@/components/PageContainer.vue";

const userStore = useUserStore()
const loading = ref(false)
const baseInfo = ref<Record<string, any>>({})
const isView = ref(false)
onLoad((data) => {
  const { view } = data
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
    name: '设备位置',
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
  const { id } = baseInfo.value
  RepairApi.detail(id).then(res => {
    const { repairFiles } = res.data
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
const modalValue = ref<Record<string, any>>({ repairStatus: 4 })
const handleConfirm = () => {
  modal.value.open()
}
const confirm = () => {
  const { id } = baseInfo.value
  loading.value = true

  RepairApi.preHandle({ id, ...modalValue.value }).then(res => {
    //@ts-ignore
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

const handleReceive = () => {
  uni.showModal({
      title: '是否确认领取任务？',
      async success({confirm}) {
        if(!confirm) return

        try {
            await RepairApi.receive(baseInfo.value.id)
            uni.showToast({
              title: '领取成功'
            })
            getInfo()
          } catch (error) {
            console.log(error);
        }
      }
    })
  
}



</script>
<style lang='scss' scoped>
.page-body {
  padding-bottom: 100px;
}

.bottom-btn {
  position: initial;
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

  >div {
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
