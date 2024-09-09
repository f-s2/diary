<template>
    <u-popup :show="show" @update:show="(bol) => $emit('update:show', bol)" mode="bottom" title="选择保养项" :cancel="true"
        :back="false" :round="10">

        <div class="content">
            <div v-if="computedList?.length" class="device-box">
                <div :class="['device-item', { active: selectIds.includes(item.id) }]" v-for="item in computedList"
                    :key="item.id" @click="trigger(item)">
                    <span>
                        {{ item.name }}({{ item.code }})-{{ item.period }}天
                    </span>

                    <uv-icon v-show="selectIds.includes(item.id)" name="checkbox-mark" color="#003A8B"
                        size="16"></uv-icon>
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
import { MaintenanceApi } from "@/api/WorkApi";

import { computed, ref, watch } from "vue";
const props = defineProps({ show: Boolean, data: Object });
const emit = defineEmits(["update:show", "ok",]);
const handleOk = () => {
    if (!selection.value?.length) {
        uni.showToast({
            title: '请选择保养项',
            icon: 'none'
        })
        return
    }
    const list = selection.value.map(item => item.period)
    if ([...new Set(list)].length > 1) {
        uni.showToast({
            title: '保养项周期需保持一致',
            icon: 'none'
        })
        return
    }

    emit("ok", selection.value);
    emit("update:show", false);


};
const personList = ref([])
const keywords = ref('')
const selection = ref([])
const selectIds = computed(() => selection.value.map(item => item.id))
const trigger = (val) => {
    const index = selectIds.value.findIndex(item => item === val.id)
    if (index !== -1) {
        selection.value.splice(index, 1)

    } else {
        selection.value.push(val)
    }
}
const computedList = computed(() => {
    return personList.value.filter(item => item.name.includes(keywords.value))
})
const load = () => {
    uni.showLoading();
    MaintenanceApi.itemList({ ...props.data })
        .then((res) => {
            personList.value = res.data;
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

.device-box {
    border-radius: 4px;
    box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.02);
    font-size: 14px;
    padding: 0 16px;

    .device-item {
        padding: 16px;
        display: flex;
        justify-content: space-between;
        padding: 16px 0;
        margin: 0 12px;


        &.active {
            color: $uv-primary ;


        }

        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }
}
</style>
