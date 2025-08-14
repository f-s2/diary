<template>
  <u-popup :show="show" @update:show="(bol) => $emit('update:show', bol)" mode="bottom" title="选择设备" :cancel="true"
           :back="false" :round="10">
    <div class="search">
      <uv-search v-model="keywords" placeholder="名称或编码" :showAction="false" />
    </div>
    <div class="content">
      <div v-if="computedList?.length" class="device-box">
        <div class="item-box" v-for="item in computedList" :key="item.id"  @click="handleOk(item)">
          <div class="item-top">
                        <span>
                            {{ item.name }}({{item.code}})
                        </span>
          </div>
        </div>

      </div>
      <u-empty v-else></u-empty>
    </div>

  </u-popup>
</template>

<script lang="ts" setup>

import { computed, ref, watch } from "vue";
import { RepairApi } from '@/api/WorkApi'
const props = defineProps({ show: Boolean,data:Object });
const emit = defineEmits(["update:show", "ok",]);
const handleOk = (item) => {


  emit("ok", item);
  emit("update:show", false);
};
const deviceList = ref([])
const keywords = ref('')

const computedList = computed(() => {
  return deviceList.value.filter(item => item.name?.includes(keywords.value)||item.code?.includes(keywords.value))
})
const load = () => {
  uni.showLoading();
  const {factoryModelId}=props.data
  
  RepairApi.deviceByPosition({factoryModelId}).then((res) => {
      deviceList.value = res.data;
    })
    .finally(() => {
      uni.hideLoading();
    });
};
watch(
  () => props.show,
  (bol) => {
    if (bol) {
      load()
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
  height: calc(70vh - 44px);
  overflow-y: auto;
}

.item-box {
  display: flex;
  flex-direction: column;
  gap: 10px;

  .item-top {
    color: #000000;
    display: flex;
    justify-content: space-between;
  }


  padding: 12px 0;

  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}
</style>