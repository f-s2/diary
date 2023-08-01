<template>
  <div class="page">
    <div class="head card">2023年07月23日 09:27:23</div>
    <uni-forms :modelValue="formData" :rules="rules" label-position="top">
      <div class="address card">
        <uni-forms-item label="当前位置 :">
          <text>{{ formData.address }}</text>
        </uni-forms-item>
      </div>
      <div class="address card">
        <uni-forms-item label="事项 :" name="name">
          <uni-easyinput
            type="textarea"
            autoHeight
            v-model="formData.remark"
            placeholder="如有事项请填写"
          />
        </uni-forms-item>
      </div>
    </uni-forms>
    <div class="btn">
      <button hover-class="none" type="primary" @click="save">保存打卡</button>
    </div>
  </div>
</template>

<script setup>
import { ClockInApi } from "@/api/ClockInApi";
import { onLoad } from "@dcloudio/uni-app";
import { ref } from "vue";
const formData = ref({});
const rules = [];
onLoad((data) => {
  if (data.address) {
    const info = JSON.parse(data.address);
    formData.value.address = info.name;
    formData.value.latitude = info.latitude;
    formData.value.longitude = info.longitude;
  }
});
const save = () => {
  uni.showLoading();
  ClockInApi.add({
    ...formData.value,
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
  margin-top: 20px;
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
</style>
