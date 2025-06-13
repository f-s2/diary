<template>
    <u-popup :show="show" @update:show="(bol) => $emit('update:show', bol)" mode="bottom" title="选择备件" :cancel="true"
        :back="false" :round="10">
        <div class="search">
            <uv-search v-model="keywords" placeholder="备件名称编码" :showAction="false" />
        </div>
        <div class="content">
            <div v-if="computedList?.length" class="device-box">
                <div class="item-box" v-for="item in computedList" :key="item.id">
                    <div class="item-top">
                        <span>
                            {{ item.name }}({{ item.code }})
                        </span>
                        <uv-checkbox-group style="flex: none;" v-model="item.checked">
                            <uv-checkbox :name="true"></uv-checkbox>
                        </uv-checkbox-group>
                    </div>
                    <div class="item-bottom">
                        <span class="label">货位</span>
                        <span class="value">{{ item.allocation }}</span>
                        <span class="label">数量</span>
                        <span class="value">{{ item.quantity }}</span>
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
import { InventoryApi } from "@/api/WorkApi";

import { computed, ref, watch } from "vue";
const props = defineProps({ show: Boolean, data: Array ,query:Object});
const emit = defineEmits(["update:show", "ok",]);
const handleOk = () => {


    emit("ok", spareList.value.filter(item => item.checked?.[0]));
    emit("update:show", false);
};
const spareList = ref([])
const keywords = ref('')

const computedList = computed(() => {
    return spareList.value.filter(item => item.name?.includes(keywords.value) || item.code?.includes(keywords.value))
})
const load = () => {
    uni.showLoading();
    InventoryApi.list({...props.query})
        .then((res) => {
            spareList.value = res.data;
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
    height: calc(70vh - 44px);
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

    .item-bottom {

        .label {
            color: rgba(0, 0, 0, 0.50);
            margin-right: 6px;
        }

        .value {
            margin-right: 12px;
        }
    }

    padding: 12px 0;

    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}
</style>
