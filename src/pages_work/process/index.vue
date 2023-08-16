<template>
  <div class="page-body" style="padding-bottom: 100px">
    <div class="title">处理工单</div>
    <div class="sub-title">基础信息</div>
    <div class="describe-box top" style="margin-bottom: 12px">
      <div class="describe-item" v-for="item in config" :key="item.name">
        <div class="describe-label">{{ item.name }}</div>
        <div class="describe-value">
          <span v-if="!item.custom">
            {{ baseInfo?.[item.code] || "--" }}
          </span>
          <span v-else-if="item.code === 'types'">
            <status-tag
              type="1"
              :types="baseInfo.typeVOList?.map((item) => item.name)"
            />
          </span>
          <span v-else-if="item.code === 'users'">
            {{ baseInfo.users?.map((item) => item.username).join(",") }}
          </span>
        </div>
      </div>
    </div>
    <div class="remark" style="margin-bottom: 10px">
      <div class="sub-title">
        <span>描述</span>
      </div>
      <uni-card :isFull="true" :border="false" :is-shadow="false">
        {{ baseInfo.remark }}
      </uni-card>
    </div>
    <uni-forms
      ref="formRef"
      :label-width="0"
      :modelValue="formData"
      :rules="rules"
    >
      <div class="sub-title">实际完成时间</div>
      <div class="timer">
        <uni-forms-item name="actualFinishTime" required>
          <uni-datetime-picker
            v-model="formData.actualFinishTime"
            type="datetime"
            placeholder="完成时间"
          />
        </uni-forms-item>
      </div>
      <div class="sub-title">设备使用选择</div>
      <div class="describe-box bottom">
        <div
          class="describe-item"
          v-for="item in baseInfo.deviceVOList"
          :key="item.id"
          @click="handleSelectPart(item)"
        >
          <div class="describe-label">
            <span style="color: red">*</span
            ><img class="icon" :src="icon" alt="" /> {{ item.name
            }}<span v-if="item.code"> ({{ item.code }})</span>
          </div>
          <div class="describe-value">
            <uni-icons color="rgba(0, 0, 0, 0.3)" type="forward" size="24" />
          </div>
        </div>
      </div>
      <div class="sub-title">现场拍照</div>
      <div class="img-box">
        <uni-forms-item required>
          <uni-file-picker
            :auto-upload="false"
            @select="handleSelect"
            @delete="handleDelete"
            :modelValue="fileList"
            :imageStyles="imageStyles"
            :sourceType="['camera']"
          ></uni-file-picker>
        </uni-forms-item>
      </div>
    </uni-forms>

    <select-device
      :deviceInfo="modalState.info"
      :types="baseInfo.typeVOList"
      v-model:show="modalState.show"
      @ok="handleOk"
    />
    <button @click="save" class="bottom-btn" type="primary" hover-class="none">
      提交工单
    </button>
  </div>
</template>

<script setup>
import { BaseApi } from "@/api/BaseApi";
import { WorkApi } from "@/api/WorkApi";
import icon from "@/static/device.png";
import { useUserStore } from "@/store/user";
import { getAddress } from "@/utils/location";
import { onLoad, onShow } from "@dcloudio/uni-app";
import { provide, reactive, ref } from "vue";
import SelectDevice from "./SelectDevice.vue";
const userStore = useUserStore();
const baseInfo = ref({});
const fileList = ref([]);
const imageStyles = {
  width: 80,
};
const relId = ref("");
provide("relId", relId);
const config = [
  { name: "工单编号", code: "code" },
  { name: "工单类型", code: "orderType" },
  { name: "维保类型", code: "types", custom: true },
  { name: "客户", code: "customerName" },
  { name: "客户联系人", code: "contactPerson" },
  { name: "联系人电话", code: "contactPhone" },
  { name: "公司地址", code: "address" },
  { name: "工单创建时间", code: "createTime" },
  { name: "维保人员", code: "users", custom: true },
];
const baseId = ref("");
onLoad(({ id }) => {
  baseId.value = id;
  getInfo();
});
const addressInfo = ref({});
onShow(() => {
  getAddress().then((res) => {
    const { address, location } = res;
    addressInfo.value = {
      latitude: location.lat,
      longitude: location.lng,
      address,
    };
  });
});

const getInfo = () => {
  uni.showLoading();
  WorkApi.detail(baseId.value)
    .then((res) => {
      baseInfo.value = res.data;
      const { finishFiles } = baseInfo.value;
      fileList.value =
        finishFiles?.map((item) => ({
          name: item.filePath,
          url: userStore.userInfo.urlPrefix + item.filePath,
          extname: "png",
          ...item,
        })) || [];
    })
    .finally(() => [uni.hideLoading()]);
};

const handleSelect = ({ tempFilePaths, tempFiles }) => {
  const { height, width } = tempFiles[0].image;
  BaseApi.upload(tempFilePaths[0]).then((res) => {
    if (res.code === 0) {
      const { name } = res.data;
      fileList.value.push({
        url: userStore.userInfo.urlPrefix + name,
        name,
        extname: "png",
        ...addressInfo.value,
        width,
        filePath: name,
        length: height,
      });
      saveImgs();
    }
  });
};

const handleDelete = ({ tempFile }) => {
  const index = fileList.value.findIndex((item) => item.name === tempFile.name);
  fileList.value.splice(index, 1);
  saveImgs();
};

const saveImgs = () => {
  uni.showLoading();
  WorkApi.saveFiles({
    id: baseInfo.value.id,
    finishFiles: fileList.value,
  })
    .then((res) => {})
    .finally(() => {
      uni.hideLoading();
    });
};
const handleSelectPart = (item) => {
  modalState.info = item;
  relId.value = item.id;
  modalState.show = true;
};
const handleOk = () => {
  modalState.show = false;
  getInfo();
};
const modalState = reactive({
  show: false,
  info: {},
});
const formData = ref({});
const formRef = ref();
const rules = {
  actualFinishTime: {
    rules: [
      {
        required: true,
        errorMessage: "请选择",
      },
    ],
  },
};
const save = async () => {
  await formRef.value.validate();
  if (!fileList.value?.length) {
    uni.showToast({
      title: "需上传图片",
      icon: "none",
    });
    return false;
  }
  uni.showModal({
    title: "确定提交工单?",
    success: ({ confirm }) => {
      confirm &&
        WorkApi.finish({ id: baseInfo.value.id, ...formData.value }).then(
          (res) => {
            console.log(res, "res");
            if (res.code === 0) {
              uni.navigateBack({});
              uni.showToast({
                title: res.message,
                icon: "success",
              });
            } else {
              uni.showToast({
                title: res.message,
                icon: "none",
              });
            }
          }
        );
    },
  });
};
</script>

<style lang="scss" scoped>
.top {
  .describe-label {
    color: rgba($color: #000000, $alpha: 0.5);
  }
  .describe-value {
    color: rgba($color: #000000, $alpha: 0.9);
  }
}
.bottom {
  margin-bottom: 12px;
  .describe-label {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    .icon {
      width: 20px;
      height: 20px;
      display: inline-block;
      margin-right: 12px;
    }
  }
}

.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 24px;
}
.sub-title {
  font-size: 16px;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  &::before {
    content: "";
    display: inline-block;
    width: 6px;
    height: 18px;
    border-radius: 2px;
    background-color: $uni-color-primary;
    vertical-align: middle;
  }
}
.img-box {
  background: #fff;
  border-radius: 4px;
  padding: 12px;
}

::v-deep .icon-del-box {
  transform: scale(0.6) rotate(45deg);
  transform-origin: 100% 0;
  right: 0;
  top: 10px;
}
</style>
