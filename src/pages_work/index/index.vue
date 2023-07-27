<template>
  <div class="page-body">
    <div class="head" style="margin-top: -10px">
      <filter-head :queryParam="queryParam" @search="reload" />
    </div>
  </div>

  <TabBar :activeIndex="0" />
  <auth-button @load="reload" />
</template>

<script setup>
import { ref } from "vue";
import AuthButton from "../../components/AuthButton";
import TabBar from "../../components/TabBar.vue";
import FilterHead from "./FilterHead";

const queryParam = ref({
  keyword: "",
});

const reload = () => {
  console.log("reload");
};
</script>

<style lang="scss" scoped>
::v-deep .uni-easyinput__content {
  background-color: #fff !important;
  border-radius: 16px;
}
</style>
