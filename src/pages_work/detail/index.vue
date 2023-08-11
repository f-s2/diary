<template>
  <div class="page-body">
    <div class="sub-title">
      <span>基础信息</span>
      <status-tag :needBg="true" :status="baseInfo.finishStatus" />
    </div>
    <div class="describe-box" style="margin-bottom: 12px">
      <div
        class="describe-item"
        v-for="item in describeConfig"
        :key="item.name"
      >
        <div class="describe-label">{{ item.name }}</div>
        <div class="describe-value">
          <span v-if="!item.custom">
            {{ baseInfo?.[item.code] || "--" }}
          </span>
          <span v-else-if="item.code === 'types'">
            <status-tag
              type="1"
              :types="baseInfo.typeVOList?.map((item) => item.name)"
            />
          </span>

          <span v-else-if="item.code === 'users'">
            {{ baseInfo.users?.map((item) => item.username).join(",") }}
          </span>
        </div>
      </div>
    </div>
    <template v-if="isDone && baseInfo.finishFiles?.length">
      <div class="sub-title">
        <span>现场单据照片</span>
      </div>
      <div class="img-list">
        <div
          @click="preview(index)"
          class="img-box"
          :key="index"
          v-for="(item, index) in baseInfo.finishFiles"
        >
          <img
            :src="userStore.userInfo.urlPrefix + item.filePath"
            class="pic"
          />
        </div>
      </div>
    </template>

    <div class="sub-title">
      <span>设备信息</span>
    </div>
    <div class="device-list">
      <div
        class="device-item"
        v-for="item in baseInfo.deviceVOList"
        :key="item.id"
      >
        <div class="device-item_head">
          <img class="icon" :src="icon" alt="img" />
          {{ item.name }} <span v-if="item.code"> ({{ item.code }})</span>
        </div>
        <template v-if="isDone">
          <div class="device-item_content" v-if="item.needInventory === 1">
            <div class="spare-item" v-for="device in item.outboundList">
              {{ device.name }}({{ device.code }}) *{{ device.quantity }}
            </div>
          </div>
          <div class="empty-device" v-else>无需使用备件</div>
        </template>
      </div>
    </div>
    <button
      hover-class="none"
      @click="jump"
      v-if="!isDone"
      class="confirm"
      type="primary"
    >
      处理工单
    </button>
  </div>
</template>

<script setup>
import { WorkApi } from "@/api/WorkApi";
import icon from "@/static/device.png";
import { useUserStore } from "@/store/user";
import { onLoad, onShow } from "@dcloudio/uni-app";
import { computed, ref } from "vue";
const baseInfo = ref({});
const userStore = useUserStore();
const isDone = computed(() => baseInfo.value.finishStatus === 5);

const baseId = ref("");
onLoad(({ id }) => {
  baseId.value = id;
});
onShow(() => {
  getInfo();
});

const getInfo = () => {
  uni.showLoading();
  WorkApi.detail(baseId.value)
    .then((res) => {
      baseInfo.value = res.data;
    })
    .finally(() => {
      uni.hideLoading();
    });
};
const describeConfig = computed(() => {
  return [
    { name: "工单编号", code: "code" },
    { name: "工单类型", code: "orderType" },
    { name: "维保类型", code: "types", custom: true },
    { name: "客户", code: "customerName" },
    { name: "客户联系人", code: "contactPerson" },
    { name: "联系人电话", code: "contactPhone" },
    { name: "公司地址", code: "address" },
    { name: "工单创建时间", code: "createTime" },
    { name: "工单完成时间", code: "finishTime" },
    { name: "维保人员", code: "users", custom: true },
  ];
});
const preview = (current) => {
  uni.previewImage({
    current,
    urls: baseInfo.value.finishFiles.map(
      (item) => userStore.userInfo.urlPrefix + item.filePath
    ),
    fail: (err) => {
      console.log("err", err);
    },
  });
};
const jump = () => {
  uni.navigateTo({
    url: "/pages_work/process/index?id=" + baseInfo.value.id,
  });
};
</script>

<style lang="scss" scoped>
.page-body {
  padding-bottom: 200rpx;
}
.confirm {
  position: fixed;
  bottom: 80rpx;
  left: 32rpx;
  right: 32rpx;
}
.sub-title {
  justify-content: space-between;
  display: flex;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 12px;
}
.describe-label {
  color: rgba($color: #000000, $alpha: 0.5);
}
.describe-value {
  color: rgba($color: #000000, $alpha: 0.9);
}
.device-item_head {
  font-size: 14px;
  line-height: 20px;
  margin-bottom: 10px;
  .icon {
    width: 20px;
    height: 20px;
    display: inline-block;
    vertical-align: middle;
  }
}
.device-item_content {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  .spare-item {
    color: #165dff;
    font-size: 12px;
    border-radius: 2px;
    background: rgba(22, 93, 255, 0.1);
    padding: 2px 4px;
  }
}
.device-list {
  padding: 32rpx;
  background-color: #fff;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.device-item:not(:last-child) {
  padding-bottom: 16px;
  border-bottom: 1px solid #f7f8fa;
}
.empty-device {
  display: inline-block;
  border-radius: 2px;
  background: rgba(151, 155, 155, 0.1);
  color: rgba(0, 0, 0, 0.5);
  font-size: 12px;
  padding: 2px 4px;
}
.img-list {
  padding: 16px;
  border-radius: 4px;
  background: #fff;
  display: grid;
  grid-template-columns: repeat(4, 100rpx);
  justify-content: space-around;
  grid-row-gap: 10px;
  .img-box {
    background: #fafafa;
    text-align: center;
    height: 150rpx;
  }
  .pic {
    width: 100%;
    height: 100%;
  }
}
</style>
