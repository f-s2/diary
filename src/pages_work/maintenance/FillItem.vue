<template>
  <u-popup :show="show" @update:show="(bol) => $emit('update:show', bol)" mode="bottom" title="填写记录" :cancel="true"
           :back="false" :round="10">

    <div class="content">
      <div v-if="itemList?.length" class="items-box">
        <div class="item-box" v-for="(item, index) in itemList">
          <div class="top">
            <span class="index">{{ index + 1 }}</span>
            <span class="name">{{ item.name }}</span>
            <span style="color: red;margin-right: 4px;">*</span>
            <uv-radio-group v-model="item.checked" shape="square" style="flex: none;">
              <uv-radio :name="1" label=" 正常" style="margin-right: 10px;"></uv-radio>
              <uv-radio :name="0" label=" 异常"></uv-radio>
            </uv-radio-group>
          </div>
          <div class="item-content">
            {{ item.content }}
          </div>
          <uv-textarea style="background-color: transparent;" v-model="item.exceptionHandle" autoHeight border="none"
                       placeholder="点击填写异常处理内容"></uv-textarea>
        </div>

      </div>
      <u-empty v-else></u-empty>
    </div>
    <div class="bottom">
      <uv-button type="primary" @click="handleOk" hover-class="none">确认</uv-button>
    </div>
  </u-popup>
</template>

<script setup>

import {ref, watch} from "vue";

const props = defineProps({show: Boolean, data: Array});
const emit = defineEmits(["update:show", "ok",]);
const handleOk = () => {
  if (itemList.value.some(item => !Number.isInteger(item.checked))) {
    uni.showToast({
      title: '请填写记录完整!',
      icon: 'none'
    })
    return
  }
  if (itemList.value.some(item => item.checked === 0 && !item.exceptionHandle)) {
    uni.showToast({
      title: '维保结果是异常时，请输入异常处理内容!',
      icon: 'none'
    })
    return
  }


  emit("ok", itemList.value);
  emit("update:show", false);


};
const itemList = ref([])

const load = () => {
  itemList.value = JSON.parse(JSON.stringify(props.data))
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
.content {
  height: calc(70vh - 44px);
  overflow-y: auto;
}

.items-box {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.item-box {
  border-radius: 4px;
  background: #F7F8FA;
  display: flex;
  padding: 12px;
  flex-direction: column;

  gap: 8px;

  .top {
    display: flex;
    gap: 4px;
    align-items: center;

    .name {
      flex: 1;
      font-weight: bold;
    }
  }


  .index {
    font-size: 12px;
    background-color: #003A8B;
    border-radius: 2px;
    color: #fff;
    padding: 2px 6px;
  }

  .item-content {
    color: rgba(0, 0, 0, 0.50);
    font-size: 12px;
    padding: 8px 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  }

}
</style>
