<template>
  <div class="page-body custom-nav-page">
    <nav-bar />
    <u-loading v-if="loading"/>
    <div class="sub-title">
      基础信息
      <status-tag :needBg="true" :status="+baseInfo.taskStatus"/>
    </div>
    <div class="describe-box" style="margin-bottom: 12px">
      <div v-for="item in taskConfig" :key="item.name" :class="['describe-item']">
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
      点检记录

    </div>
    <div class="describe-box" style="margin-bottom: 1px;">
      <div class="info-title">
        设备信息
      </div>
      <div v-for="item in deviceConfig" :key="item.name" :class="['describe-item']"
           style="border: none;">
        <div class="describe-label">
          {{ item.name }}
        </div>
        <div class="describe-value">
                        <span>
                            {{ baseInfo?.[item.code] || "--" }}
                        </span>
        </div>
      </div>
    </div>
    <div class="describe-box" style="margin-bottom: 12px">
      <div class="info-title">
        点检信息
      </div>
      <div v-for="item in baseConfig" :key="item.name" :class="['describe-item']"
           style="border: none;">
        <div class="describe-label">
          {{ item.name }}
        </div>
        <div class="describe-value">
                        <span v-if="!item.custom">
                            {{ baseInfo?.[item.code] || "--" }}
                        </span>
          <span v-else-if="item.code === 'itemList'&&baseInfo.taskStatus!==0" style="display: flex;align-items: center;"
                @click="itemShow = true">
                            <span style="color:#003A8B ;"> 查看记录</span>
            <uv-icon name="arrow-right"
                     size="16"/>
          </span>
          <span v-else-if="item.code === 'assistUserList'">
                            {{ baseInfo.assistUserList?.map(item => item.username)?.join('、') ?? '-' }}
                        </span>

        </div>
      </div>

    </div>


    <div v-if="baseInfo.taskStatus === 0 && baseInfo.fillStatus !== -1 && !loading" class="bottom-btn">
      <uv-button type="primary" @click="handleReceive" v-if="!baseInfo.inspectUser">领取任务</uv-button>
      <uv-button type="primary" @click="handleSave" v-if="baseInfo.inspectUser === userStore.userInfo.id">处理任务</uv-button>
    </div>
    <ViewItem v-model:show="itemShow" :data="baseInfo.itemList"/>
  </div>
</template>

<script lang="ts" setup>
import ViewItem from './ViewItem.vue';

import {InspectionkApi} from "@/api/WorkApi";
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
    name: '点检时间',
    code: 'inspectTime'
  },
  {
    name: '点检人员',
    code: 'inspectUserName'
  }, {
    name: '点检工时',
    code: 'inspectHour'
  }, {
    name: '协同人员',
    custom: true,
    code: 'assistUserList',
  },
  {
    name: '点检记录',
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
  const {id, planId} = baseInfo.value
  InspectionkApi.detail(id).then(res => {
    baseInfo.value = {...baseInfo.value, ...res.data}
  }).finally(() => {
    loading.value = false
  })


}


const handleSave = () => {
  const {id} = baseInfo.value

  uni.navigateTo({
    url: `/pages_work/inspection/handle?id=${id}`
  })

}

const handleReceive = () => {
  uni.showModal({
      title: '是否确认领取任务？',
      async success({confirm}) {
        if(!confirm) return

        try {
            await InspectionkApi.receive(baseInfo.value.id)
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
