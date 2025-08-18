<script setup lang="ts">
import CustomHeaderNav from './CustomHeaderNav.vue';
import Loading from './Loading.vue';

defineProps<{
    loading?: boolean
    hiddenHeader?: boolean
    title?: string
}>()

</script>

<template>
    <div class=" w-full h-100vh flex flex-col" style="padding-top: var(--status-bar-height);">
        <slot name="header">
            <CustomHeaderNav v-if="!hiddenHeader" :title="title"></CustomHeaderNav>
        </slot>
        <Loading v-if="loading"></Loading>
        <template v-else>
            <div class=" h-0 pt-5 flex-1 overflow-auto">
                <slot></slot>
            </div>
            <slot name="footer"></slot>
        </template>
    </div>
</template>