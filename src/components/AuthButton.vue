<template>
  <u-loading v-if="loading" />
  <uni-popup ref="popup" :mask-click="false">
    <button
      hover-class="none"
      style="width: 80vw"
      open-type="getPhoneNumber"
      type="primary"
      @getphonenumber="getPhoneNumber"
    >
      授权登录
    </button>
  </uni-popup>
</template>

<script setup>
import { useUserStore } from "@/store/user";
import { onLoad } from "@dcloudio/uni-app";
import { ref } from "vue";
import { UserApi } from "../api/UserApi";
const emit = defineEmits(["load", "update:isInit"]);
const userStore = useUserStore();
const popup = ref();
let openid;
const loading = ref(false);
onLoad(() => {
  const token = uni.getStorageSync("token");
  if (token) {
    UserApi.getUserInfo({ id: uni.getStorageSync("id") }).then((res) => {
      userStore.setUserInfo(res.data);
      emit("load");
      emit("update:isInit", true);
    });
  } else {
    loading.value = true;
    emit("update:isInit", false);

    uni.login({
      success: ({ code }) => {
        UserApi.login({ code })
          .then((res) => {
            if (res.code === 0) {
              openid = res.data.openid;
              getApp().globalData.openid = res.data.openid;
              popup.value.open();
            }
          })
          .finally(() => {
            loading.value = false;
          });
      },
    });
  }
});

const getPhoneNumber = ({ detail }) => {
  if (!detail?.code) {
    uni.showModal({
      title: "提示!",
      content: "获取工单需授权登录！",
      showCancel: false,
    });
    popup.value.close();
  } else {
    UserApi.getPhone({ code: detail.code, openid })
      .then((res) => {
        if (res.code === 0) {
          userStore.setUserInfo(res.data);
          userStore.isLoginOut = false;
          uni.setStorageSync("token", res.data.token);
          uni.setStorageSync("id", res.data.id);
          emit("load");
          emit("update:isInit", true);
        }
      })
      .finally(() => {
        popup.value.close();
      });
  }
};
</script>

<style lang="scss" scoped></style>
