<template>
  <u-loading v-if="loading" />
  <uni-popup ref="popup" :mask-click="false">
    <button
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

const emit = defineEmits(["load"]);
const userStore = useUserStore();
const popup = ref();
let openid;
const loading = ref(false);
onLoad(() => {
  if (userStore.userInfo.username) {
    emit("load");
  } else {
    loading.value = true;
    uni.login({
      success: ({ code }) => {
        UserApi.login({ code })
          .then((res) => {
            if (res.code === 0) {
              userStore.setUserInfo(res.data);
              uni.setStorageSync("token", res.data.token);
              emit("load");
            } else if (res.code === 1013) {
              openid = res.data.openid;
              getApp().globalData.openid = res.data.openid;
              popup.value.open();
            } else {
              uni.showToast({ title: "登录失败" });
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
  UserApi.getPhone({ code: detail.code, openid }).then((res) => {
    userStore.setUserInfo(res.data);
    uni.setStorageSync("token", res.data.token);
    emit("load");
  });
};
</script>

<style lang="scss" scoped></style>
