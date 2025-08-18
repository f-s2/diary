<template>
  <PageContainer title="填写点检记录">
    <div class="pb-4 px-4">
      <div class="sub-title">
        点检记录
      </div>
      <uv-form labelPosition="left" :model="formData" :rules="rules" ref="formRef" labelWidth="auto">
        <div class="describe-box" style="margin-bottom: 1px;">
          <div class="info-title">
            设备信息
          </div>
          <div :class="['describe-item', { wrap: item.wrap }]" v-for="item in deviceConfig" :key="item.name"
            style="border: none;">
            <div class="describe-label">
              {{ item.name }}
            </div>
            <div class="describe-value">
              <span v-if="!item.custom">
                {{ formData?.[item.code] || "--" }}
              </span>
            </div>
          </div>
        </div>
        <div class="sub-title">
          点检信息
        </div>

        <div class="form-card input-right">
          <uv-form-item label="任务编号" borderBottom>

            {{ formData.code }}

          </uv-form-item>

          <uv-form-item @click="multiple = false; disabledIds = []; modalState.userShow = true" label="点检人员"
            prop="inspectUser" borderBottom>
            <span v-if="formData.inspectUserName"> {{ formData.inspectUserName }}</span>
            <span v-else style="color:#c0c4cc">请选择</span>
          </uv-form-item>
          <uv-form-item class="input-right"
            @click="multiple = true; disabledIds = [formData.inspectUser]; modalState.userShow = true" label="协助人员"
            borderBottom>
            <span v-if="formData.assistUserList?.length">
              {{formData.assistUserList?.map(item => item.username)?.join('、')}}
            </span>
            <span v-else style="color:#c0c4cc">请选择</span>
          </uv-form-item>
          <uv-form-item label="完成时间" prop="inspectTime" borderBottom @click="showTime" required>
            <uv-input v-model="formData.inspectTime" disabled disabledColor="#ffffff" placeholder="完成时间" border="none">
            </uv-input>
            <template v-slot:right>
              <uv-icon name="calendar" size="20"></uv-icon>
            </template>
          </uv-form-item>
          <uv-datetime-picker ref="datePicker" :value="datetime" mode="date" @confirm="selectTime" />
          <uv-form-item label="点检工时" required prop="inspectHour" borderBottom>
            <uv-input type="number" inputAlign="right" v-model="formData.inspectHour" placeholder="点检工时" border="none">
            </uv-input>
          </uv-form-item>
          <uv-form-item label="点检记录" @click="handleFill" required>
            <div class="done-btn" v-if="formData.itemList?.every(item => Number.isInteger(item.checked))">
              <uv-icon name="checkmark-circle" color="#52C41A" size="16"></uv-icon>
              已填写
            </div>
            <div class="fill-btn" v-else>
              <uv-icon name="edit-pen" color="#003A8B" size="16"></uv-icon>
              填写记录
            </div>

          </uv-form-item>
        </div>


      </uv-form>
      <div class="mt-4">
        <uv-button type="primary" @click="handleSave">提交</uv-button>
      </div>
      <select-users :disabledIds="disabledIds" :multiple="multiple" v-model:show="modalState.userShow"
        @ok="handleUserOk" />

      <FillItem v-model:show="modalState.show" :data="formData.itemList" @ok="(list) => formData.itemList = list" />
    </div>
  </PageContainer>
</template>

<script setup>
import { InspectionkApi } from "@/api/WorkApi";
import SelectUsers from "@/pages_work/repair/SelectUsers.vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
import { computed, reactive, ref } from "vue";
import FillItem from './FillItem.vue';
import { useUserStore } from "@/store/user";
import dayjs from "dayjs";
import PageContainer from "@/components/PageContainer.vue";

const userStore = useUserStore()
const formData = ref({})
const disabledIds = ref([])
onLoad(({ id }) => {
  formData.value.id = id
})
onShow(() => {
  getInfo()
})

const formRef = ref()
const rules = computed(() => {
  return {
    inspectHour: {
      required: true,
      message: '请输入'
    },
    inspectTime: {
      required: true,
      message: '请选择'
    },
  }
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

const modalState = reactive({
  show: false,
  spareShow: false,
  userShow: false
})
const datePicker = ref()
const datetime = ref('')

const showTime = () => {
  datetime.value = dayjs(formData.value?.inspectTime ? formData.value.inspectTime : undefined).valueOf()
  datePicker.value.open()
}
const selectTime = ({ value }) => {
  formData.value.inspectTime = dayjs(value).format('YYYY-MM-DD')
}


const handleFill = () => {
  modalState.show = true

}
const multiple = ref(false)
const handleUserOk = (data) => {
  if (multiple.value) {
    formData.value.assistUserList = data
    formData.value.assistUserIds = data.map(item => item.id)
  } else {
    formData.value.inspectUserName = data[0]?.username
    formData.value.inspectUser = data[0]?.id
  }

}


const getInfo = () => {
  InspectionkApi.detail(formData.value.id).then(res => {
    formData.value = { ...res.data, inspectUserName: userStore.userInfo.username, inspectUser: userStore.userInfo.id }
  })

}

const handleSave = async () => {

  try {
    await formRef.value.validate()

    const { itemList } = formData.value
    if (itemList.some(item => !Number.isInteger(item.checked))) {
      uni.showToast({
        title: '请填写记录完整!',
        icon: 'none'
      })
      return
    }

    uni.showModal({
      title: '是否提交任务?',
      success: ({ confirm }) => {
        confirm && InspectionkApi.handle({
          ...formData.value,
        }).then(res => {
          if (res.code === 0) {
            uni.showToast({
              title: '请求成功'
            })
            uni.reLaunch({
              url: '/pages_work/index/index?type=1'
            })
          } else {
            uni.showToast({
              title: res.message,
              icon: 'none'
            })
          }
        })
      }
    })
  } catch (error) {
    console.log(error);
  }


}

</script>
<style lang='scss' scoped>
.page-body {
  padding-bottom: 80px;
}

.title {
  font-size: 24px;
  font-weight: bold;
}

.sub {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.form-card {
  background-color: #fff;
  padding: 20rpx;
  border-radius: 10rpx;
}

.sub-title {
  font-size: 16px;
  font-weight: bold;
  display: flex;
  align-items: center;
  margin: 10px 0;

  &::before {
    width: 6px;
    height: 18px;
    content: '';
    display: inline-block;
    background-color: #003A8B;
    margin-right: 8px;
    border-radius: 2px;
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

.done-btn {
  display: flex;
  color: #52C41A;
  gap: 2px;
}

.fill-btn {
  display: flex;
  color: #003A8B;
  gap: 2px;
}

.select-btn {
  border-radius: 4px;
  border: 1px solid #003A8B;
  background: rgba(24, 144, 255, 0.10);
  display: flex;
  padding: 4px 8px;
  align-items: center;
  color: #003A8B;
  gap: 4px;
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

.item-top {
  display: flex;
  justify-content: space-between;
}
</style>
