<template>
    <u-popup :show="show" @update:show="(bol) => $emit('update:show', bol)" mode="bottom" title="查看记录" :cancel="true"
        :back="false" :round="10">

        <div class="content">
            <div v-if="itemList?.length" class="items-box">
                <div class="item-box" v-for="(item, index) in itemList">
                    <div class="top">
                        <span class="index">{{ index + 1 }}</span>
                        <span class="name">{{ item.name }}</span>
                        <div>

                        </div>
                        <span v-if="item.checked" class="checked" style="color: #52C41A;">
                            <uv-icon name="checkmark-circle" color="#52C41A" size="16"></uv-icon>
                            符合
                        </span>
                        <span v-else class="checked" style="color: red;">
                            <uv-icon name="close-circle" color="red" size="16"></uv-icon>
                            符合
                        </span>

                    </div>
                    <div class="item-content">
                        {{ item.content ?? '-' }}
                    </div>
                    <div class="remark">
                        {{ item.remark ?? '-' }}
                    </div>

                </div>

            </div>
            <u-empty v-else></u-empty>
        </div>

    </u-popup>
</template>

<script setup>

import { ref, watch } from "vue";
const props = defineProps({ show: Boolean, data: Array });
const emit = defineEmits(["update:show", "ok",]);

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
    height: 70vh;
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
        background-color: #1890FF;
        border-radius: 2px;
        color: #fff;
        padding: 2px 6px;
    }

    .item-content {
        color: rgba(0, 0, 0, 0.50);
        font-size: 12px;
        padding: 8px 0;
    }

}

.checked {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px
}
</style>
