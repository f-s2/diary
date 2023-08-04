<template>
  <div class="form-box spare">
    <div class="spare-item" v-for="item in forms" :key="item.id">
      <div class="item-head">
        <span> {{ item.name }}({{ item.code }}) </span>
        <div class="number">
          <span
            @click="handleComputed(item)"
            :class="['tag', { disabled: item.quantity <= 0 }]"
          >
            —
          </span>
          <span class="value">{{ item.quantity }}</span>
          <span class="tag" @click="item.quantity++"> ＋ </span>
        </div>
      </div>
      <uni-forms
        v-if="item.quantity > 0"
        ref="formRefs"
        :modelValue="item"
        :label-width="60"
        :rules="rules"
      >
        <uni-forms-item name="type" label="维保类型">
          <uni-data-checkbox
            v-model="item.type"
            :localdata="range"
            mode="tag"
          />
        </uni-forms-item>
        <uni-row :gutter="20">
          <uni-col :span="12">
            <uni-forms-item name="unitPrice" label="销售单价">
              <div>
                <uni-easyinput
                  :style="{ width: '50px' }"
                  suffix="元"
                  :clearable="false"
                  type="number"
                  v-model="item.unitPrice"
                  @change="(val) => changeInput(val, item)"
                ></uni-easyinput>
                <span style="margin-left: 2px">元</span>
              </div>
            </uni-forms-item>
          </uni-col>
          <uni-col :span="12">
            <uni-forms-item label="销售总价">
              <div
                class="all-price"
                style="height: 100%; display: flex; align-items: center"
              >
                {{ (item.unitPrice || 0) * (item.quantity || 0) }}元
              </div>
            </uni-forms-item>
          </uni-col>
        </uni-row>
      </uni-forms>
    </div>
  </div>
  <div class="bottom-btn">
    <button
      @click="$emit('back')"
      v-if="needBack"
      class="btn"
      type="primary"
      hover-class="none"
      plain
    >
      返回
    </button>
    <button
      class="btn"
      v-if="isAdd"
      @click="save"
      type="primary"
      hover-class="none"
    >
      保存
    </button>
  </div>
</template>

<script setup>
import { WorkApi } from "@/api/WorkApi";
import { computed, inject, ref, watch } from "vue";
const props = defineProps({
  formData: Array,
  types: Array,
  needBack: {
    type: Boolean,
    default: false,
  },
  isAdd: {
    type: Boolean,
    default: true,
  },
});
const emit = defineEmits(["ok"]);
const relId = inject("relId");
const formRefs = ref();
const forms = ref([]);
const init = () => {
  if (props.isAdd) {
    forms.value = props.formData?.map((item) => ({
      ...item,
      quantity: 0,
      unitPrice: 0,
      inventoryId: item.id,
    }));
  } else {
    forms.value = props.formData;
  }
};
watch(
  () => props.formData,
  (data) => {
    init();
  }
);
init();
const handleComputed = (item) => {
  if (item.quantity > 0) {
    item.quantity--;
  }
};
const changeInput = (value, item) => {
  item.unitPrice = parseFloat(value);
};
const range = computed(() =>
  props.types.map((item) => ({
    value: item.code,
    text: item.name,
    type: undefined,
  }))
);
const rules = {
  type: {
    rules: [
      {
        required: true,
        errorMessage: "请选择",
      },
    ],
  },
  unitPrice: {
    rules: [
      {
        required: true,
        errorMessage: "请输入",
      },
      {
        validateFunction: function (rule, value, data, callback) {
          if (/^\d+(.\d{1,12})?$/.test(value)) {
            return true;
          } else {
            callback("请输入正确格式");
          }
        },
      },
    ],
  },
};

const save = () => {
  Promise.all(
    formRefs.value.map((ref) => {
      return ref.validate();
    })
  ).then((res) => {
    uni.showLoading();
    if (props.isAdd) {
      WorkApi.temSave({
        id: relId.value,
        needInventory: 1,
        outboundList: [...forms.value.filter((item) => item.quantity)],
      })
        .then((res) => {
          if (res.code === 0) {
            emit("ok");
            uni.showToast({
              title: "保存成功",
              icon: "success",
            });
          }
        })
        .finally(() => {
          uni.hideLoading();
        });
    } else {
      WorkApi.updateSingle([...forms.value])
        .then((res) => {
          if (res.code === 0) {
            emit("ok");
          }
        })
        .finally(() => {
          uni.hideLoading();
        });
    }
  });
};
defineExpose({ init, save });
</script>

<style lang="scss" scoped>
.bottom-btn {
  display: flex;
  gap: 10px;
  .btn {
    flex: 1;
  }
}
.spare-item {
  border-bottom: 1px solid rgba($color: #000000, $alpha: 0.05);
  padding-bottom: 16px;
  &:last-of-type {
    border: none;
  }
}
.form-box {
  background-color: rgba($color: #000000, $alpha: 0.02);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 16px;
  margin-bottom: 50px;
}
.item-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .value {
    margin: 0 10px;
    font-weight: bold;
  }
  .tag {
    display: inline-block;

    font-weight: bold;
    font-size: 14px;
    line-height: 14px;
    padding: 1px;
    border: 2px solid #000;
    color: #000;
    &.disabled {
      color: rgba($color: #000000, $alpha: 0.3);
      border-color: rgba($color: #000000, $alpha: 0.3);
    }
  }
}
</style>
