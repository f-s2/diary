<script setup lang="ts">
import { ref } from 'vue';
import CustomHeaderNav from './CustomHeaderNav.vue';
import Loading from './Loading.vue';
import { onLoad, onShow } from '@dcloudio/uni-app';

defineProps<{
    loading?: boolean
    hiddenHeader?: boolean
    title?: string
}>()

const contentRef = ref<HTMLElement>()

const contentHeight = ref(0)


onLoad(() => {
    const { safeArea } = uni.getSystemInfoSync()
    contentHeight.value = safeArea.height
})
</script>

<template>
    <div class=" w-full overflow-hidden flex flex-col" ref="contentRef" style="padding-top: var(--status-bar-height);"
        :style="`height: ${contentHeight}px`">
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