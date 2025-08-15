<template>

  <z-paging ref="paging" v-model="workList" @query="queryList" :auto-show-system-loading="true">
    <!-- z-paging默认铺满全屏，此时页面所有view都应放在z-paging标签内，否则会被盖住 -->
    <!-- 需要固定在页面顶部的view请通过slot="top"插入，包括自定义的导航栏 -->
    <template #top>
      <div class="head">
        <filter-head @load="reload" :queryParam="queryParam" :hiddenFilter="true" />
      </div>
    </template>
    <div @click="jump(item)" v-for="(item, index) in workList" :key="item.id" :isFull="true" :border="false"
         :is-shadow="false">
      <ItemCard :data="item"/>
    </div>
    <!-- <template #bottom>
      <div class="bottom" style="height: 80px;">
        <TabBar/>
      </div>

    </template> -->
  </z-paging>


</template>

<script lang="ts" setup>
import {WorkApi} from "@/api/WorkApi";
import {useUserStore} from "@/store/user";
import {onLoad, onShow} from "@dcloudio/uni-app";
import {ref} from "vue";
import TabBar from "../../components/TabBar.vue";
import FilterHead from "./FilterHead.vue";
import ItemCard from './ItemCard.vue';
import { TaskApi } from "@/api/TaskApi";

const userStore = useUserStore();

onLoad((query) => {
  if(query.type) {
    queryParam.value.types = [query.type]
    queryParam.value.deviceId = query.id
  }
})

onShow(() => {  
  reload()
})
const queryParam = ref({
  searchContent: "",
  status: 0,
  types: [3],
  deviceId: '',
});
const workList = ref([]);

const queryList = (pageNo, pageSiz) => {
  TaskApi.scanList({...queryParam.value, currentPage: pageNo, pageSize: pageSiz})
      .then((res) => {
        paging.value.complete(res.data?.records)
      })
      .finally(() => {
        uni.stopPullDownRefresh()
      });
}
const paging = ref(null)
const reload = () => {
  paging.value?.reload()

};
const jump = (item) => {
  const {type, status, realId, createTime, code} = item
  let page
  if (type === 0) {
    page = 'maintenance'

  } else if (type === 1) {
    page = 'inspection'
  } else if (type === 2) {
    page = 'stocktaking'
  } else {
    page = 'repair'
    const {id, fillStatus, repairStatus} = item
    uni.navigateTo({
      url: `/pages_work/${page}/index?id=${id}&repairStatus=${repairStatus}&fillStatus=${fillStatus}`,
    });
    return
  }
  uni.navigateTo({
    url: `/pages_work/${page}/index?id=${realId}&taskStatus=${status}&taskCreateTime=${createTime}&taskType=${type}&taskCode=${code}`,
  });

};
</script>

<style lang="scss" scoped>
.page-body {
  padding-bottom: 150rpx;
}


.empty {
  padding: 100px 0;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 12px;

}
</style>
