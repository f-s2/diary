<script setup lang="ts">
import BackPng from '@/static/back.png'
import { computed } from 'vue';

defineProps<{
    title?: string
}>()

const pages = getCurrentPages()

//@ts-ignore
const _title = computed(() => pages.slice(-1)[0]?.$page.meta.navigationBar.titleText)

function handleBack() {
    if (pages.length > 1) {
        uni.navigateBack()
    }
}

</script>

<template>
    <div class=" relative h-44px">
        <div class=" absolute top-0 left-0 w-full h-full f-c-c text-20px font-500">{{ title || _title }}</div>
        <div class=" relative z-10">
            <img class=" w-44px" :src="BackPng" alt="" @click="handleBack"
                :class="{ 'opacity-0': pages.length <= 1 }">
        </div>
    </div>
</template>