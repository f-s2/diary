<template>
  <div class="login-box">
    <button
      style="width: 80vw"
      open-type="getPhoneNumber"
      type="primary"
      @getphonenumber="getPhoneNumber"
    >
      授权登录
    </button>
  </div>
</template>

<script setup>
const getPhoneNumber = (res) => {
  console.log("res", res);
};
</script>

<style lang="scss" scoped>
.login-box {
  height: 100vh;
  display: flex;
  align-items: center;
}
</style>
