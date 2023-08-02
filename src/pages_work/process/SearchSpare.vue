<template>
  <u-popup
    :show="show"
    @update:show="(bol) => $emit('update:show', bol)"
    type="bottom"
    :head="false"
    :mask-click="false"
    :animation="false"
  >
    <div class="search">
      <uni-easyinput
        prefixIcon="search"
        type="search"
        v-model="queryParam.searchContent"
        placeholder="备件名称,编码"
        @confirm="load"
        @clear="load"
      />
      <span @click="$emit('update:show', false)">取消</span>
    </div>
    <div class="content">
      <edit-spare
        v-if="searchSpareList.length"
        @ok="handleOk"
        :types="types"
        v-model:formData="searchSpareList"
      />
      <u-empty v-else></u-empty>
    </div>
  </u-popup>
</template>

<script setup>
import { WorkApi } from "@/api/WorkApi";
import { ref, watch } from "vue";
import EditSpare from "./EditSpare.vue";
const props = defineProps({ show: Boolean, deviceInfo: Object, types: Array });
const emit = defineEmits(["update:show", "load"]);
const queryParam = ref({});
const searchShow = ref(false);
const searchSpareList = ref([]);
const handleOk = () => {
  emit("load");
  emit("update:show", false);
};
const load = () => {
  searchSpareList.value = [];
  searchShow.value = true;
  if (
    queryParam.value.searchContent === "" ||
    queryParam.value.searchContent === undefined
  ) {
    searchSpareList.value = [];
    return false;
  }
  uni.showLoading();
  WorkApi.searchSpare({ ...queryParam.value })
    .then((res) => {
      searchSpareList.value = res.data;
    })
    .finally(() => {
      uni.hideLoading();
    });
};
watch(
  () => props.show,
  (bol) => {
    if (bol) {
      queryParam.value.searchContent = "";
      searchSpareList.value = [];
    }
  }
);
</script>

<style lang="scss" scoped>
.search {
  display: flex;
  gap: 10px;
  align-items: center;
  font-size: 14px;
  color: rgba($color: #000000, $alpha: 0.9);
  margin-bottom: 12px;
}

.content {
  height: 65vh;
  overflow-y: auto;
}
</style>
