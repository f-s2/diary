<script setup>
const page=getCurrentPages()
const canBack=page.length>1
const title = page.at(-1).$page?.meta?.navigationBar?.titleText??'-'

const leftClick=()=>{
  canBack&& uni.navigateBack()
}
const rightClick=()=>{
  canBack|| uni.switchTab({
    url:'/pages_home/index'
  })
}
</script>

<template>

  <uv-navbar  @rightClick="rightClick" @leftClick="leftClick" :title="title" bgColor="#127ED0" :titleStyle="{color:'#fff',fontWeight:'bold'}"  >

    <template #left>
      <uv-icon v-show="canBack"  name="arrow-left" color="#fff"  size="20" />
    </template>
    <template #right>
      <uv-icon v-show="!canBack" name="home" color="#fff" size="20" />
    </template>
  </uv-navbar>

</template>

<style scoped lang="less">

</style>
