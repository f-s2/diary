<template>
  <div class="login-box">

    <div class="login-form">

      <div class="title">
        用户登录 / USER LOGIN
      </div>
      <uv-form class="form" ref="formRef" :rules="rules" :model="formData" label-position="top" labelWidth="auto">
        <uv-form-item label="用户账号" prop="loginAccount">
          <uv-input prefixIcon="account" v-model="formData.loginAccount" placeholder="请输入用户账号" />
        </uv-form-item>
        <uv-form-item label="登录密码" prop="password">
          <uv-input type="password" prefixIcon="lock" v-model="formData.password" placeholder="请输入登录密码" />
        </uv-form-item>
        <button type="primary" @click="save">登录</button>
      </uv-form>
    </div>
  </div>
</template>

<script setup>
import { UserApi } from '@/api/UserApi';
import { useUserStore } from "@/store/user";
import { onShow } from '@dcloudio/uni-app';
import { ref } from 'vue';

const userStore = useUserStore();

onShow(() => {
  uni.hideTabBar()
})

const formData = ref({ loginAccount: undefined, password: undefined })

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
          url: '/pages_work/index/index'
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
        url: '/pages_work/index/index'
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
  background-color: #fff;
  height: 100vh;

  .title {
    color: #000;
    font-size: 24px;
    font-weight: bold;
    padding: 20% 0;
    text-align: center;
  }
}

.form {
  margin: auto;
  padding: 24px;


}
</style>
