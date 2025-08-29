<template>
  <div class="w-full overflow-hidden h-100vh">
    <div class="login-header">
      <image mode="widthFix" src="@/static/login-bg.png" class="mx-auto w-full " alt="" />
    </div>
    <div class="login-form">
      <div class="title font-bold">
        您好，欢迎使用
        <!-- 龙延智能生产管理系统 -->
      </div>
      <uv-form class="form" ref="formRef" :rules="rules" :model="formData" label-position="left" labelWidth="auto">
        <uv-form-item prop="loginAccount">
          <uv-input prefixIcon="account" border="none" prefixIconStyle="font-size: 48rpx;color:rgba(167, 174, 197, 1)"
            font-size="32rpx" v-model="formData.loginAccount" placeholder="请输入用户账号" />
        </uv-form-item>
        <uv-form-item prop="password" key="password">
          <uv-input prefixIcon="lock" prefixIconStyle="font-size: 48rpx;color:rgba(167, 174, 197, 1)"
            border="none" font-size="32rpx" :password="hidePassword" v-model="formData.password" placeholder="请输入密码">
            <template #suffix>
              <image @click="hidePassword = !hidePassword" class=" w-22px"
                :src="!hidePassword ? EyePng : EyeOffPng" mode="widthFix" />
            </template>
          </uv-input>
        </uv-form-item>
      </uv-form>

      <!-- 记住密码选项 -->
      <!-- <div class="remember-password">
        	<uv-checkbox-group v-model="checkboxValue">
           <uv-checkbox :name="true" shape="circle" size="18">
             <text class="remember-text">记住密码</text>
          </uv-checkbox>
          </uv-checkbox-group>

      </div> -->

      <uv-button class="btn" type="primary" @click="save">登录</uv-button>
    </div>
  </div>
</template>

<script setup>
import { UserApi } from "@/api/UserApi";
import { useUserStore } from "@/store/user";
import { onLoad, onShow } from "@dcloudio/uni-app";
import { ref, watchEffect } from "vue";
import { useStorage } from "@vueuse/core";
import PageContainer from "@/components/PageContainer.vue";
import EyePng from '@/static/mine/eye.png'
import EyeOffPng from '@/static/mine/eye-off.png'

const userStore = useUserStore();
let redirectPath = '/pages_home/index'
onLoad(({ from }) => {
  // redirectPath = from && !from.startsWith("/pages/login/index") ? from : "/pages_home/index";
});
onShow(() => {
  uni.hideTabBar();
});

// 使用 useStorage 持久化存储登录信息
const savedLoginInfo = useStorage('loginInfo', { loginAccount: '', password: '', rememberPassword: false });



const formData = ref({
  loginAccount: savedLoginInfo.value.rememberPassword ? savedLoginInfo.value.loginAccount : undefined,
  password: savedLoginInfo.value.rememberPassword ? savedLoginInfo.value.password : undefined
});
const hidePassword = ref(true);
const rememberPassword = ref(savedLoginInfo.value.rememberPassword);
const checkboxValue = ref(savedLoginInfo.value.rememberPassword ? [true] : [])
watchEffect(() => {
  rememberPassword.value = !!checkboxValue.value[0]
})
const rules = {
  loginAccount: {
    required: true,
    message: "请输入用户名",
  },
  password: {
    required: true,
    message: "请输入密码",
  },
};
const formRef = ref();

const save = () => {
  formRef.value.validate().then(() => {
    UserApi.login(formData.value).then((res) => {
      if (res.code === 0) {
        uni.showToast({
          title: "请求成功",
        });

        // 根据记住密码选项保存或清除登录信息
        if (rememberPassword.value) {
          savedLoginInfo.value = {
            loginAccount: formData.value.loginAccount,
            password: formData.value.password,
            rememberPassword: true
          };
        } else {
          savedLoginInfo.value = {
            loginAccount: '',
            password: '',
            rememberPassword: false
          };
        }

        const { token, id } = res.data;
        uni.setStorageSync("token", token);
        uni.setStorageSync("id", id);
        userStore.userInfo = res.data;
        uni.reLaunch({
          url: redirectPath,
        });
      }
    });
  });
};

const init = () => {
  const token = uni.getStorageSync("token");
  token &&
    UserApi.getUserInfo().then((res) => {
      if (res.code === 0) {
        userStore.userInfo = res.data;
        uni.reLaunch({
          url: redirectPath,
        });
      }
    });
};
init();
</script>

<style lang="scss" scoped>
.login-header {
  background: linear-gradient(to bottom, rgba(241, 249, 255, 1), #fff);
}

.login-form {
  display: block;
  width: 100%;
  height: 100%;
  padding: 48rpx;
  box-sizing: border-box;
  border-radius: 20rpx;
  background: #fff;

  .title {
    color: #000;
    font-size: 40rpx;
  }

  .btn {
    margin: auto;
  }
}

.form {
  margin: 48rpx auto;

  .uv-input {
    border-radius: 4px;
    background: rgba(244, 247, 255, 1);

    padding: 24rpx !important
  }

}

.remember-password {
  margin-bottom: 32rpx;
  display: flex;
  align-items: center;

  .remember-text {
    font-size: 28rpx;
    color: #666;
    margin-left: 16rpx;
  }
}
</style>
