<template>

  <div class="page-body custom-nav-page" >
    <nav-bar />
    <u-loading v-if="loading"/>
    <div class="sub-title">
      基础信息
      <status-tag :status="+baseInfo.taskStatus" :needBg="true"/>
    </div>
    <div class="describe-box" style="margin-bottom: 12px">
      <div :class="['describe-item']" v-for="item in taskConfig" :key="item.name">
        <div class="describe-label">
          {{ item.name }}
        </div>
        <div class="describe-value">
                    <span v-if="!item.custom">
                        {{ baseInfo?.[item.code] || "--" }}
                    </span>
          <span v-if="item.code === 'taskType'">
                        <status-tag :status="+baseInfo.taskType" :tag="true"/>
                    </span>

        </div>
      </div>
    </div>


    <div class="sub-title">
      保养记录

    </div>
    <div class="describe-box" style="margin-bottom: 1px;">
      <div class="info-title">
        设备信息
      </div>
      <div :class="['describe-item',]" v-for="item in deviceConfig" :key="item.name"
           style="border: none;">
        <div class="describe-label">
          {{ item.name }}
        </div>
        <div class="describe-value">
                        <span >
                            {{ baseInfo?.[item.code] || "--" }}
                        </span>
        </div>
      </div>
    </div>
    <div class="describe-box" style="margin-bottom: 12px">
      <div class="info-title">
        保养信息
      </div>
      <div :class="['describe-item']" v-for="item in baseConfig" :key="item.name"
           style="border: none;">
        <div class="describe-label">
          {{ item.name }}
        </div>
        <div class="describe-value">
                        <span v-if="!item.custom">
                            {{ baseInfo?.[item.code] || "--" }}
                        </span>
          <span @click="itemShow = true" v-else-if="item.code === 'itemList'&&baseInfo.taskStatus!==0"
                style="display: flex;align-items: center;">
                            <span style="color:#003A8B ;"> 查看记录</span>
            <uv-icon name="arrow-right" size="16"></uv-icon>
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
            <span>{{ item.name ?? item.sparePartsName }}
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

    <div class="bottom-btn" v-if="baseInfo.taskStatus === 0 && baseInfo.fillStatus !== -1 && !loading" :key="flag">
      <uv-button type="primary" @click="handleReceive" v-if="!baseInfo.maintainUser">领取任务</uv-button>
      <uv-button type="primary" @click="handleSave" v-if="baseInfo.maintainUser === userStore.userInfo.id">处理任务</uv-button>
    </div>
    <ViewItem v-model:show="itemShow" :data="baseInfo.itemList"/>
  </div>
</template>

<script lang="ts" setup>
import ViewItem from './ViewItem.vue';

import {MaintenanceApi} from "@/api/WorkApi";
import {onLoad, onShow} from "@dcloudio/uni-app";
import {ref} from "vue";
import NavBar from "@/components/NavBar.vue";
import { useUserStore } from '@/store/user';

const userStore = useUserStore()

const loading = ref(false)
const baseInfo = ref<Record<string, any>>({})
onLoad((data) => {
  const {taskStatus, taskType} = data
  baseInfo.value = {...data, taskStatus: +taskStatus, taskType: +taskType}

})
onShow(() => {
  getInfo()
})
const deviceConfig = [
  {
    name: '设备编码',
    code: 'deviceCode'
  },
  {
    name: '设备名称',
    code: 'deviceName'
  },
  {
    name: '设备型号',
    code: 'deviceModel'
  },
  {
    name: '设备类型',
    code: 'deviceTypeName'
  },
  {
    name: '所属部门',
    code: 'ownOrganizeName'
  },

]

const baseConfig = [
  {
    name: '任务编码',
    code: 'code'
  },
  {
    name: '保养时间',
    code: 'maintainTime'
  },
  {
    name: '保养人员',
    code: 'maintainUserName'
  }, {
    name: '保养工时',
    code: 'maintainHour'
  }, {
    name: '协同人员',
    custom: true,
    code: 'assistUserList',
  },
  {
    name: '保养记录',
    code: 'itemList',
    custom: true
  },

]

const taskConfig = [
  {
    name: '任务编号',
    code: 'taskCode'
  },
  {
    name: '任务类型',
    code: 'taskType',
    custom: true
  },
  {
    name: '任务创建时间',
    code: 'taskCreateTime'
  },
]


const itemShow = ref(false)
const getInfo = () => {
  loading.value = true
  const {id} = baseInfo.value
  MaintenanceApi.detail(id).then(res => {
    baseInfo.value = {...res.data, ...baseInfo.value}
  }).finally(() => {
    loading.value = false
  })

}


const handleSave = () => {
  const {id} = baseInfo.value
  uni.navigateTo({
    url: `/pages_work/maintenance/handle?id=${id}`
  })
}

const flag = ref(1)
const handleReceive = () => {
  uni.showModal({
      title: '是否确认领取任务？',
      async success({confirm}) {
        if(!confirm) return

        try {
            await MaintenanceApi.receive(baseInfo.value.id)
            uni.showToast({
              title: '领取成功'
            })
            await getInfo()
            flag.value ++
          } catch (error) {
            console.log(error);
        }
      }
    })
  
}


</script>
<style lang='scss' scoped>
.page-body {
  padding-bottom: 80px;
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
  color: #003A8B;
  font-size: 14px;
  align-items: center;
  display: flex;
  gap: 4px;
  font-weight: 500;
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

.info-title {
  font-size: 14px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.90);
  margin: 10px 0;
}

.line {
  height: 1px;
  background-color: #f7f8fa;
}

</style>
