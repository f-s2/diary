<template>
    <div class="work-item">
        <template v-if="data.type !== 3">

            <div class="item-head">
                <div class="item-title ellipsis">
                    {{ data.description }}
                </div>
                <div class="item-status">
                    <status-tag :status="data.status" />
                </div>
            </div>
            <div class="item-bottom">
                <span>
                    {{ data.code }}
                </span>
                <span>{{ data.createTime }} </span>
            </div>
        </template>
        <template v-else>
            <div class="item-head">
                <div class="item-title ellipsis">
                    {{ data.factoryModelName ?? '-' }}
                </div>
                <div class="item-status">
                    <status-tag :status="data.status" />
                </div>
            </div>
            <div class="item-bottom">
                <span>
                    {{ data.code }}
                </span>
                <span>{{ data?.deviceName }}({{ data.deviceCode }})</span>
                <span>{{ data.reportTime }} </span>
            </div>
        </template>

    </div>
</template>

<script setup>
defineProps({ data: Object })
</script>
<style lang='scss' scoped>
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
    justify-content: space-between;

    .icon {
        height: 14px;
        width: 14px;
        display: inline-block;
    }
}
</style>