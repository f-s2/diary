<template>

  <z-paging ref="paging" v-model="workList" @query="queryList" :auto-show-system-loading="true">
    <!-- z-paging默认铺满全屏，此时页面所有view都应放在z-paging标签内，否则会被盖住 -->
    <!-- 需要固定在页面顶部的view请通过slot="top"插入，包括自定义的导航栏 -->
    <template #top>
      <div class="head">
        <filter-head @load="reload" :queryParam="queryParam" />
      </div>
    </template>
    <div @click="jump(item)" v-for="(item, index) in workList" :key="item.id" :isFull="true" :border="false"
      :is-shadow="false">
      <div class="work-item">
        <div class="item-head">
          <div class="item-title ellipsis">
            {{ item.description }}
          </div>
          <div class="item-status">
            <status-tag :status="item.status" />
          </div>
        </div>
        <div class="item-bottom">
          <status-tag :status="item.type" :tag="true" />
          <img class="icon" :src="icon1" alt="" /><span>
            {{ item.code }}
          </span>
          <img style="margin-left: 8px" class="icon" :src="icon2" alt="" />
          <span>{{ item.createTime }} </span>
        </div>
      </div>
    </div>
    <template #bottom>
      <div class="bottom" style="height: 80px;">
        <TabBar :activeIndex="0" />
      </div>


    </template>
  </z-paging>


</template>

<script setup>
import { WorkApi } from "@/api/WorkApi";
import icon1 from "@/static/code.png";
import icon2 from "@/static/time.png";
import { useUserStore } from "@/store/user";
import { onShow } from "@dcloudio/uni-app";
import { ref } from "vue";
import TabBar from "../../components/TabBar.vue";
import FilterHead from "./FilterHead";
const userStore = useUserStore();

const getCount = () => {
  WorkApi.getCount().then((res) => {
    userStore.unFinishCount = res.data.uncompleted;
  });
};
onShow(() => {
  reload()
})
const queryParam = ref({
  searchContent: "",
  finishStatus: null
});
const workList = ref([]);

const queryList = (pageNo, pageSiz) => {
  getCount()
  WorkApi.list({ ...queryParam.value, currentPage: pageNo, pageSize: pageSiz })
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
  const { type, status, realId, createTime, code, planId } = item
  let page
  if (type === 0) {
    page = 'maintenance'

  } else if (type === 1) {
    page = 'inspection'
  } else {
    page = 'inventory'

  }
  uni.navigateTo({
    url: `/pages_work/${page}/index?id=${realId}&taskStatus=${status}&taskCreateTime=${createTime}&taskType=${type}&taskCode=${code}&planId=${planId}`,
  });

};
</script>

<style lang="scss" scoped>
.page-body {
  padding-bottom: 150rpx;
}

.head {
  padding: 10px;
}

.empty {
  padding: 100px 0;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 12px;

}

.work-item {
  margin: 16px 12px;
  background-color: #fff;
  padding: 12px 16px;
  border-radius: 6px;

  .item-head {
    display: flex;

    justify-content: space-between;

  }

  .item-title {
    font-size: 16px;
    font-weight: bold;
    color: #000;
    flex: 1;
    margin-right: 20px;
  }


}

.item-bottom {
  color: rgba($color: #000000, $alpha: 0.3);
  display: flex;
  line-height: 20px;
  font-size: 12px;
  align-items: center;
  gap: 4rpx;
  margin-top: 10px;

  .icon {
    height: 14px;
    width: 14px;
    display: inline-block;
  }
}
</style>
