<template>
  <u-popup
    :show="show"
    @update:show="(bol) => $emit('update:show', bol)"
    type="bottom"
    title="备件选择"
    :back="false"
    :cancel="true"
    :mask-click="false"
    @maskClick="$emit('update:show', false)"
  >
    <div class="search">
      <uni-easyinput
        prefixIcon="search"
        type="search"
        v-model="queryParam.searchContent"
        placeholder="备件名称,编码"
        @focus="load"
      />
    </div>

    <div class="content">
      <div class="describe-box" v-show="deviceInfo.outboundList?.length">
        <div class="describe-item" @click="handleView">
          <div class="describe-label" style="font-weight: bold">
            查看已选择备件
          </div>
          <div class="describe-value">
            <uni-icons color="rgba(0, 0, 0, 0.3)" type="forward" size="24" />
          </div>
        </div>
      </div>

      <div class="sub-title">{{ parentInfo.name || "备件类型" }} :</div>
      <edit-spare
        @ok="saveOk"
        :types="types"
        v-model:formData="parentInfo.inventoryVOList"
        v-if="isLast"
        :needBack="true"
        @back="handleBack"
      />
      <div class="describe-box tree" v-else-if="parentInfo.children?.length">
        <div
          @click="handleNext(item)"
          class="describe-item"
          v-for="item in parentInfo.children"
          :key="item.id"
        >
          <div class="describe-label">{{ item.name }}</div>
          <div class="describe-value">
            <uni-icons color="rgba(0, 0, 0, 0.3)" type="forward" size="24" />
          </div>
        </div>
      </div>
      <u-empty v-else></u-empty>
      <button
        @click="handleBack"
        style="background-color: #fff"
        v-show="parentInfo.name && !isLast"
        type="primary"
        hover-class="none"
        plain
        class="bottom-btn"
      >
        返回
      </button>
      <div
        v-show="!parentInfo.name"
        :class="['not', { active: deviceInfo.needInventory === 0 }]"
        @click="handleNot"
      >
        <div class="describe-box">
          <div class="describe-item">
            <div class="describe-label">无需使用备件</div>
            <div class="describe-value">
              <uni-icons
                v-if="deviceInfo.needInventory === 0"
                type="checkmarkempty"
                size="24"
                color="#1890FF"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </u-popup>
  <selected-spare
    v-model:show="selectedShow"
    :deviceInfo="deviceInfo"
    @load="getDeviceInfo"
    :types="types"
  />
  <search-spare
    v-model:show="searchShow"
    :types="types"
    @load="getDeviceInfo"
  />
</template>

<script setup>
import { SpareApi, WorkApi } from "@/api/WorkApi";
import { eachTree } from "@/utils/tree";
import { inject, ref, watch } from "vue";
import EditSpare from "./EditSpare.vue";
import SearchSpare from "./SearchSpare.vue";
import SelectedSpare from "./SelectedSpare.vue";
const props = defineProps({ show: Boolean, types: Array });
const emit = defineEmits(["getInfo"]);
const queryParam = ref({});
const relId = inject("relId");

watch(
  () => props.show,
  (bol) => {
    if (bol) {
      getTree();
      getDeviceInfo();
    }
  }
);
const isLast = ref(false);
const parentInfo = ref({});
const treeData = ref([]);
const deviceInfo = ref({});
const getDeviceInfo = () => {
  WorkApi.getDeviceInfo({ id: relId.value }).then((res) => {
    deviceInfo.value = res.data;
  });
};
const getTree = () => {
  uni.showLoading();
  queryParam.value.searchContent = "";
  isLast.value = false;
  selectedShow.value = false;
  searchShow.value = false;
  SpareApi.tree({})
    .then((res) => {
      treeData.value = JSON.parse(JSON.stringify(res.data));
      parentInfo.value = { children: res.data };
    })
    .finally(() => {
      uni.hideLoading();
    });
};

const handleNext = (item) => {
  parentInfo.value = { ...item };
  if (item.inventoryVOList?.length) {
    isLast.value = true;
  } else {
    isLast.value = false;
  }
};
const saveOk = () => {
  handleBack();
  getDeviceInfo();
};
const handleBack = () => {
  if (!parentInfo.value.parentId) {
    parentInfo.value = { children: treeData.value };
  } else {
    eachTree(treeData.value, (item) => {
      if (parentInfo.value.parentId === item.id) {
        parentInfo.value = { ...item };
      }
    });
  }

  isLast.value = false;
};
const handleNot = () => {
  uni.showModal({
    title: "选择无需使用备件将会清空所有已选备件，是否确定？",
    success: ({ confirm }) => {
      if (confirm) {
        uni.showLoading();
        WorkApi.temSave({
          id: relId.value,
          needInventory: 0,
        })
          .then(() => {})
          .finally(() => {
            getDeviceInfo();
            uni.hideLoading();
          });
      } else {
      }
    },
  });
};
const selectedShow = ref(false);
const handleView = () => {
  selectedShow.value = true;
};
const searchShow = ref(false);
const load = () => {
  searchShow.value = true;
};
</script>

<style lang="scss" scoped>
.search {
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.tree {
  margin: 12px 0;
  margin-bottom: 150rpx;
  .describe-label {
    // color: rgba($color: #000000, $alpha: 0.9);
  }
}
.describe-box {
  background-color: rgba($color: #000000, $alpha: 0.02);
  border-radius: 4px;
}
.not.active {
  color: $uni-color-primary;
  border: 1px solid $uni-color-primary;
  border-radius: 4px;
}
.sub-title {
  font-size: 14px;
  font-weight: bold;
  margin: 12px 0;
}
.content {
  height: 60vh;
  overflow-y: auto;
}
</style>
