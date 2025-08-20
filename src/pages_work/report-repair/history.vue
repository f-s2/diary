<script lang="ts" setup>
import { onLoad } from "@dcloudio/uni-app";
import { ref } from 'vue'
import { WorkApi } from "@/api/WorkApi";
import { findOne, RepairStatus } from "@/dict";
import PageContainer from "@/components/PageContainer.vue";
import { useUserStore } from "@/store/user";
import CustomHeaderNav from "@/components/CustomHeaderNav.vue";
const readMoreRef = ref()
const baseId = ref('')
const workList = ref<ReportRepair.Item[]>([])

const loading = ref(false)
onLoad(({ id }) => {
    baseId.value = id
    loading.value = true
    WorkApi.getUncompletedWork({ deviceId: id, overtime: 1 })
        .then(res => {
            workList.value = res.data.map(item => ({ ...item, statusInfo: findOne(item.repairStatus, RepairStatus) })) ?? []

        }).finally(() => {
            readMoreRef.value?.init()
            loading.value = false
        })
})

const jumpDetail = (item) => {
    const { id, fillStatus, repairStatus } = item
    uni.navigateTo({
        url: `/pages_work/repair/index?id=${id}&repairStatus=${repairStatus}&fillStatus=${fillStatus}&view=1`,
    });
}

const paging = ref(null)
const userStore = useUserStore();

const getCount = () => {
    WorkApi.getCount({}).then((res) => {
        userStore.unFinishCount = res.data.uncompleted;
    });
};

const queryList = (pageNo, pageSiz) => {
    getCount()
    WorkApi.list({ types: [3], status: 2, currentPage: pageNo, pageSize: pageSiz })
        .then((res) => {
            paging.value.complete(res.data?.records)
        })
        .finally(() => {
            uni.stopPullDownRefresh()
        });
}
</script>

<template>

    <z-paging ref="paging" v-model="workList" @query="queryList" :auto-show-system-loading="true">
        <template #top>
            <CustomHeaderNav></CustomHeaderNav>
        </template>
        <div class=" px-4">
            <div class=" font-500 mb-3">历史工单</div>
            <div v-if="workList.length">
                <div class="bg-white px-10px pt-10px pb-5 rounded-1 mb-3" v-for="item in workList" :key="item.id"
                    @click="jumpDetail(item)">
                    <div class=" flex f-c-b mb-3">
                        <span class=" font-500">{{ item.factoryModelName }}</span>
                    </div>
                    <div class=" f-c-b text-14px mb-2">
                        <span class=" font-500">{{ item.code }}</span>
                        <span>{{ item.reportTime }}</span>
                    </div>
                    <div class=" text-14px font-500">{{ item.deviceName }}：({{ item.deviceCode }})</div>
                </div>


            </div>
            <uv-empty v-else mode="data"></uv-empty>
        </div>
    </z-paging>
</template>