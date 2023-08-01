<template>
  <u-popup
    :show="show"
    @update:show="(bol) => $emit('update:show', bol)"
    type="bottom"
    title="已选择备件"
    :mask-click="false"
    @back="save"
  >
    <div class="count">总计 : {{ counts }}</div>
    <div class="form-box">
      <edit-spare
        ref="formRefs"
        :isAdd="false"
        @ok="handleOk"
        :types="types"
        v-model:formData="formData"
      />
    </div>
  </u-popup>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import EditSpare from "./EditSpare.vue";
const props = defineProps({ show: Boolean, deviceInfo: Object, types: Array });
const emit = defineEmits(["update:show", "load"]);
const formData = ref([]);

const counts = computed(() =>
  formData.value.reduce((pre, next) => {
    return pre + +next.quantity;
  }, 0)
);
const formRefs = ref();
watch(
  () => props.show,
  (bol) => {
    if (bol) {
      formData.value = [...props.deviceInfo.outboundList];
    }
  }
);
const save = () => {
  emit("update:show", true);
  formRefs.value.save();
};
const handleOk = () => {
  emit("update:show", false);
  emit("load");
};
</script>

<style lang="scss" scoped>
.count {
  font-size: 14px;
  margin-bottom: 12px;
  color: $uni-color-primary;
}
.form-box {
  height: 60vh;
  overflow-y: auto;
}
</style>
