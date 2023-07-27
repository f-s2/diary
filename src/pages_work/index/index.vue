<template>
  <div class="page-body"></div>

  <TabBar :activeIndex="0" />
  <auth-button @load="reload" />
</template>

<script setup>
import AuthButton from "../../components/AuthButton";
import TabBar from "../../components/TabBar.vue";

const reload = () => {
  console.log("reload");
};
</script>

<style lang="scss" scoped></style>
