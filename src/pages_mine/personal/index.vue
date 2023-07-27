<template>
  <div class="page-body">
    <div class="describe-box" style="margin: 32rpx">
      <div class="describe-item" v-for="item in topConfig" :key="item.name">
        <div class="describe-label">{{ item.name }}</div>
        <div class="describe-value">
          <span v-if="!item.custom">
            {{ baseInfo?.[item.code] || "--" }}
          </span>
          <span v-else-if="item.code === 'roles'">
            {{ baseInfo.roles?.map((item) => item.name).join(",") }}
          </span>
        </div>
      </div>
    </div>
    <div class="describe-box" style="margin: 32rpx">
      <div class="describe-item" v-for="item in bottomConfig" :key="item.name">
        <div class="describe-label">{{ item.name }}</div>
        <div class="describe-value">
          <span v-if="!item.custom">
            {{ baseInfo?.[item.code] || "--" }}
          </span>
          <span v-else-if="item.code === 'area'">
            {{ baseInfo.areaCode }}-{{ baseInfo.tel }} -{{ baseInfo.extension }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from "@/store/user";
import { computed } from "vue";
const baseInfo = computed(() => useUserStore().userInfo);
const topConfig = [
  { name: "账号", code: "loginAccount" },
  { name: "工号", code: "jobNumber" },
  { name: "姓名", code: "username" },
  { name: "性别", code: "sexDisplay" },
  { name: "手机号码", code: "mobile" },
  { name: "邮箱地址", code: "email" },
  { name: "所属部门", code: "organizeName" },
  { name: "角色", code: "roles", custom: true },
];

const bottomConfig = [
  { name: "座机/分机", code: "area", custom: true },
  { name: "入职时间", code: "entryDate" },
  { name: "备注", code: "remarks" },
];
</script>

<style lang="scss" scoped></style>
