<script lang="ts">

export interface LabelValueItem { label: string, value?: any, customRender?: (value?: any) => VNode | string }

</script>

<script setup lang="ts">
import type { VNode } from 'vue';

defineProps<{
    list?: LabelValueItem[]
}>()

</script>

<template>
    <div class=" space-y-4">
        <div class=" flex text-14px" v-for="item in list">
            <div class=" text-#666666 flex-shrink-0">{{ item.label }}：</div>
            <div class=" font-500" v-if="!item.customRender">{{ item.value || '-' }}</div>
            <component :is="item.customRender(item.value)" v-else></component>
        </div>
    </div>
</template>