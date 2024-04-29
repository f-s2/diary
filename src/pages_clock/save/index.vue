<template>
  <div class="page">
    <div class="head card">
      {{ dayjs().format("YYYY年MM月DD日 HH:mm:ss") }}
    </div>
    <uni-forms :modelValue="formData" :rules="rules" label-position="top">

      <div class="address card">
        <uni-forms-item label="事项 :">
          <uni-easyinput type="textarea" autoHeight v-model="formData.remark" placeholder="如有事项请填写" />
        </uni-forms-item>
      </div>
      <div class="address card">

        <uni-forms-item label="拍照上传 :">
          <uni-file-picker :auto-upload="false" @select="handleSelect" @delete="handleDelete" :modelValue="fileList"
            :imageStyles="{ width: 80 }" :sourceType="['camera']"></uni-file-picker>
        </uni-forms-item>
      </div>
    </uni-forms>
    <div class="btn">
      <button hover-class="none" type="primary" @click="save">保存打卡</button>
    </div>
  </div>
</template>

<script setup>
import { BaseApi } from "@/api/BaseApi";
import { ClockInApi } from "@/api/ClockInApi";
import { useUserStore } from "@/store/user";

import dayjs from "dayjs";
import { ref } from "vue";
const formData = ref({});
const rules = [];
const userStore = useUserStore();

const fileList = ref([])
const handleSelect = ({ tempFilePaths }) => {
  uni.showLoading();
  BaseApi.upload(tempFilePaths[0]).then((res) => {
    if (res.code === 0) {
      const { name } = res.data;
      fileList.value.push({
        url: userStore.userInfo.urlPrefix + name,
        name,
        extname: "png",
        filePath: name,
      });
    }
  }).finally(() => {
    uni.hideLoading()

  })
};

const handleDelete = ({ tempFile }) => {
  const index = fileList.value.findIndex((item) => item.name === tempFile.name);
  fileList.value.splice(index, 1);
  uni.showLoading();
};
const save = () => {
  if (!fileList.value.length) {
    uni.showModal({
      title: "提示!",
      content: '请拍照上传',
      showCancel: false
    })
    return
  }
  uni.showLoading();
  ClockInApi.add({
    ...formData.value,
    pictures: fileList.value.map(item => item.name)
  })
    .then((res) => {
      if (res.code === 0) {
        uni.showToast({
          title: res.message,
          icon: "success",
        });
        uni.navigateBack();
      }
    })
    .finally(() => {
      uni.hideLoading();
    });
};
</script>

<style lang="scss" scoped>
.page {
  padding: 36rpx 32rpx;
  display: flex;
  flex-direction: column;
  height: 100vh;
  box-sizing: border-box;
}

.card {
  padding: 22rpx 32rpx;
  background-color: #fff;
  border-radius: 4px;
  margin-bottom: 20px;
}

.head {
  font-size: 32rpx;

  font-weight: 600;
}

.btn {
  flex: 1;
  display: flex;
  align-items: flex-end;
  margin-bottom: 40px;

  button {
    width: 100%;
  }
}

::v-deep .icon-del-box {
  transform: scale(0.6) rotate(45deg);
  transform-origin: 100% 0;
  right: 0;
  top: 10px;
}
</style>
