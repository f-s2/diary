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
  <uni-popup background-color="none" ref="privacyRef" :mask-click="false">
    <div class="privacy-wrap">
      <div class="title">用户隐私保护提示</div>
      <div class="content">
        感谢你使用本小程序，在使用前您应当阅读并同意
        <text class="link" @click="openPrivacyContract"
          >《哈工龙延设备运维小程序隐私保护指引》</text
        >
        当点击同意并继续时，即表示您已理解并同意该条款内容，该条款将对您产生法律约束力;如您不同意，将无法继续使用小程序相关功能。
      </div>
      <div class="action">
        <button hover-class="none" open-type="exit" @click="handleRefuse">
          不同意
        </button>
        <button
          hover-class="none"
          type="primary"
          open-type="agreePrivacyAuthorization"
          @click="handleAgree"
        >
          同意
        </button>
      </div>
    </div>
  </uni-popup>
</template>

<script setup>
import { useUserStore } from "@/store/user";
import { onLoad } from "@dcloudio/uni-app";
import { nextTick, ref } from "vue";
import { UserApi } from "../api/UserApi";
const emit = defineEmits(["load", "update:isInit"]);
const userStore = useUserStore();
const popup = ref();
const privacyRef = ref();
const needAuthorization = ref(true);
let openid;
const loading = ref(false);

const openPrivacyContract = () => {
  uni.openPrivacyContract();
};
const handleAgree = () => {
  privacyRef.value.close();
  handleLogin();
};
const handleRefuse = () => {
  privacyRef.value.close();
};
const getPrivacy = () => {
  return new Promise((resolve, reject) => {
    uni.getPrivacySetting({
      success: (res) => {
        needAuthorization.value = res.needAuthorization;
        nextTick(() => {
          if (res.needAuthorization) {
            reject(false);
            privacyRef.value.open();
          } else {
            resolve(true);
          }
        });
      },
    });
  });
};
const handleLogin = () => {
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
              userStore.setUserInfo(res.data);
              uni.setStorageSync("token", res.data.token);
              uni.setStorageSync("id", res.data.id);
              emit("load");
              emit("update:isInit", true);
            } else if (res.code === 1013) {
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
};
onLoad(async () => {
  await getPrivacy();
  handleLogin();
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

<style lang="scss" scoped>
.privacy-wrap {
  width: calc(90vw - 20px);

  .title {
    font-weight: bold;
    text-align: center;
    margin: 10px 0 20px;
  }
  .content {
    line-height: 30px;
    padding: 0 20px;
    margin-bottom: 20px;
  }
  .link {
    color: $uni-color-primary;
  }
  .action {
    display: flex;
    gap: 20px;
    padding: 10px;
    button {
      flex: 1;
    }
  }
}
</style>
