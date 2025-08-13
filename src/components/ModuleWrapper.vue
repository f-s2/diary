<script setup lang="ts">
defineProps<{
    title?: string
}>()
</script>

<template>
    <div class=" text-14px">
        <div class=" f-c-b mb-3" v-if="title">
            <span class=" font-500">{{ title }}</span>
            <slot name="header-right"></slot>
        </div>
        <div class=" bg-white rounded-6px px-10px py-5">
            <slot></slot>
        </div>
    </div>
</template>