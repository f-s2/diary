<template>
  <u-popup
    :show="show"
    @update:show="(bol) => $emit('update:show', bol)"
    type="bottom"
    title="回复工单"
    :back="false"
    :cancel="true"
    class="popup"
  >
    <div class="form-head">
      <span>客户名称 :</span>
      {{ info.customerName }}
    </div>
    <div class="form-box reply-form">
      <uni-forms
        ref="formRef"
        :label-width="100"
        :modelValue="formData"
        :rules="rules"
        label-position="top"
      >
        <uni-forms-item label="上门时间段 :" name="date" required>
          <uni-datetime-picker
            v-model="formData.date"
            type="datetimerange"
            rangeSeparator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          />
        </uni-forms-item>
        <uni-forms-item label="是否推迟 :" name="delayed" required>
          <uni-data-checkbox
            v-model="formData.delayed"
            :localdata="[
              { value: 1, text: '是' },
              { value: 0, text: '否' },
            ]"
          ></uni-data-checkbox>
        </uni-forms-item>
        <uni-forms-item label="推迟时间 :" name="delayDay">
          <div class="form-item">
            <uni-easyinput v-model="formData.delayDay" type="number" />
            天
          </div>
        </uni-forms-item>
        <uni-forms-item label="备注 :" name="remark">
          <uni-easyinput
            type="textarea"
            autoHeight
            v-model="formData.remark"
            placeholder="备注"
          />
        </uni-forms-item>
      </uni-forms>
    </div>

    <div class="bottom-btn">
      <button class="btn" @click="handleOk" type="primary" hover-class="none">
        提交回复
      </button>
    </div>
  </u-popup>
</template>

<script setup>
import { WorkApi } from "@/api/WorkApi";
import { ref, watch } from "vue";
const props = defineProps({ show: Boolean, info: Object });
const emit = defineEmits(["update:show", "ok"]);
const formData = ref({});
const rules = {
  date: {
    rules: [
      {
        required: true,
        errorMessage: "请选择",
      },
    ],
  },
  delayed: {
    rules: [
      {
        required: true,
        errorMessage: "请选择",
      },
    ],
  },
};
const formRef = ref();
watch(
  () => props.show,
  (bol) => {
    if (bol) {
      formData.value = {};
    }
  }
);

const handleOk = () => {
  formRef.value.validate().then(() => {
    const [startTime, endTime] = formData.value.date;
    WorkApi.reply({
      ...formData.value,
      startTime,
      endTime,
      id: props.info.id,
    }).then((res) => {
      if (res.code === 0) {
        emit("ok");
        emit("update:show", false);
        uni.showToast({
          title: "保存成功",
          icon: "success",
        });
      } else {
        uni.showToast({
          title: res.message,
          icon: "none",
        });
      }
    });
  });
};
</script>

<style lang="scss" scoped>
.item-left {
}
.form-box {
  height: 60vh;
  overflow-y: auto;
  padding-bottom: 50px;
}
.form-head {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 10px;
}
</style>
