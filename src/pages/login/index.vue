<template>
  <div class="login-box">
    <div class="login-form">

      <div class="title">
        密码登录
      </div>
      <uv-form class="form" ref="formRef" :rules="rules" :model="formData" label-position="top" labelWidth="auto">
        <uv-form-item prop="loginAccount" :borderBottom="true">
          <uv-input style="margin: 0 40rpx;" border="none" v-model="formData.loginAccount" placeholder="请输入用户账号" />
        </uv-form-item>
        <uv-form-item prop="password" key="password">
          <uv-input style="margin:0   40rpx;" clearable border="none" :password="hidePassword"
            v-model="formData.password" placeholder="请输入密码">
            <template #suffix>
              <uv-icon @click="hidePassword = !hidePassword" :name="hidePassword ? 'eye' : 'eye-off-outline'"></uv-icon>
            </template>

          </uv-input>
        </uv-form-item>
      </uv-form>
      <uv-button class="btn" type="primary" @click="save">登录</uv-button>

    </div>
  </div>
</template>

<script setup>
import { UserApi } from '@/api/UserApi';
import { useUserStore } from "@/store/user";
import { onLoad, onShow } from '@dcloudio/uni-app';
import { ref } from 'vue';

const userStore = useUserStore();
let redirectPath
onLoad(({ from }) => {
  redirectPath = (from && (!from.startsWith('/pages/login/index'))) ? from : '/pages_work/index/index'
})
onShow(() => {
  uni.hideTabBar()
})

const formData = ref({ loginAccount: undefined, password: undefined })
const hidePassword = ref(true)
const rules = {
  loginAccount: {
    required: true,
    message: '请输入用户名'
  },
  password: {
    required: true,
    message: '请输入密码'
  },
}
const formRef = ref()

const save = () => {
  formRef.value.validate().then(() => {
    UserApi.login(formData.value).then(res => {
      if (res.code === 0) {
        uni.showToast({
          title: '请求成功'
        })
        const { token, id } = res.data
        uni.setStorageSync('token', token)
        uni.setStorageSync('id', id)
        userStore.userInfo = res.data
        uni.reLaunch({
          url: redirectPath
        })
      }
    })
  })
}

const init = () => {
  const token = uni.getStorageSync('token')
  token && UserApi.getUserInfo().then(res => {
    if (res.code === 0) {
      userStore.userInfo = res.data
      uni.reLaunch({
        url: redirectPath
      })
    }


  })
}
init()
</script>

<style lang="scss" scoped>
.login-form {
  display: block;
  width: 100%;
  background-color: #F6F7F9;
  height: 100vh;

  .title {
    color: #000;
    font-size: 48rpx;
    font-weight: bold;
    padding: 20% 0;
    text-align: center;
  }

  .btn {
    margin: 20rpx 100rpx;
  }
}

.form {
  margin: auto;

}

.uv-form-item {
  background-color: #fff;
}

.uv-form {
  border-radius: 10px;
  overflow: hidden;
}
</style>
