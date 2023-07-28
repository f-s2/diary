<template>
  <div class="page-body">{{ baseInfo.customerName }}</div>
</template>

<script setup>
import { WorkApi } from "@/api/WorkApi";
import { onLoad } from "@dcloudio/uni-app";
import { ref } from "vue";
const baseInfo = ref({});

onLoad(({ id }) => {
  getInfo(id);
});
const getInfo = (id) => {
  uni.showLoading();
  WorkApi.detail(id)
    .then((res) => {
      baseInfo.value = res.data;
    })
    .finally(() => [uni.hideLoading()]);
};
</script>

<style lang="scss" scoped></style>
