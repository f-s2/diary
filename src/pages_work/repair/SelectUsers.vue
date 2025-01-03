<template>
  <u-popup :show="show" @update:show="(bol) => $emit('update:show', bol)" mode="bottom" title="选择协同人员"
           :cancel="true"
           :back="false" :round="10">
    <div class="search">
      <uv-search v-model="keywords" placeholder="用户名" :showAction="false"/>
    </div>
    <div class="content">
      <div v-if="computedList?.length" class="device-box">
        <div class="item-box" v-for="item in computedList" :key="item.id">
          <div class="item-top">
                        <span>
                            {{ item.username }}
                        </span>
            <uv-checkbox-group style="flex: none;" v-model="item.selected" @change="val=> changeChecked(val,item)">
              <uv-checkbox :name="true"></uv-checkbox>
            </uv-checkbox-group>
          </div>

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
import {UserApi} from "@/api/UserApi";

import {computed, ref, watch} from "vue";

const props = defineProps({
  show: Boolean, multiple: {
    type: Boolean,
    default: true
  }
});
const emit = defineEmits(["update:show", "ok",]);
const handleOk = () => {


  emit("ok", userList.value.filter(item => item.selected?.[0]));
  emit("update:show", false);
};
const userList = ref([])
const keywords = ref('')

const computedList = computed(() => {
  return userList.value.filter(item => item.username?.includes(keywords.value))
})
const changeChecked = (item, val) => {
  if (props.multiple) {
    const [bol] = item
    if (bol) {
      userList.value.forEach(item => {
        item.selected = [false]
      })
      val.selected = [true]
    }
  }
  console.log(item)
}
const load = () => {
  uni.showLoading();
  UserApi.getUsers({})
      .then((res) => {
        userList.value = res.data;
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
  height: 65vh;
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
