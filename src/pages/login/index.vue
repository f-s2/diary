<template>
  <div class="login-box">

    <div class="login-form">

      <div class="title">
        用户登录 / USER LOGIN
      </div>
      <uni-forms class="form" ref="formRef" :rules="rules" :modelValue="formData" label-position="top">
        <uni-forms-item label="用户账号" name="loginAccount">
          <uni-easyinput prefixIcon="person" v-model="formData.loginAccount" placeholder="请输入用户账号" />
        </uni-forms-item>
        <uni-forms-item label="登录密码" name="password">
          <uni-easyinput type="password" prefixIcon="locked" v-model="formData.password" placeholder="请输入登录密码" />
        </uni-forms-item>
        <button type="primary" @click="save">登录</button>
      </uni-forms>
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

const formData = ref({})


const rules = {
  loginAccount: {
    rules: [{
      required: true,
      errorMessage: '请输入用户名'
    }]
  },
  password: {
    rules: [{
      required: true,
      errorMessage: '请输入密码'
    }]
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
  text-align: center;
  height: 100vh;

  .title {
    color: #000;
    font-size: 24px;
    font-weight: bold;
    padding: 20% 0;
  }
}

.form {
  margin: auto;
  padding: 24px;

  ::v-deep .uni-forms-item__label {
    color: #000;
  }
}
</style>
