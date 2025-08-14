<script lang="ts">

export type LabelValueItem = { 
    label: string, 
    value?: any, 
    customRender?: (value?: any) => VNode | string
} & Record<string, any>

</script>

<script setup lang="ts">
import { computed, type VNode } from 'vue';

const props = defineProps<{
    list?: LabelValueItem[]
    fieldNames?: {
        label?: string
        value?: string
    }
}>()

const _fieldNames = computed(() => Object.assign({label: 'label', value: 'value'}, props.fieldNames))

</script>

<template>
    <div class=" space-y-4">
        <div class=" flex text-14px" v-for="item in list">
            <div class=" text-#666666 flex-shrink-0">{{ item[_fieldNames.label] }}：</div>
            <div class=" font-500" v-if="!item.customRender">{{ item[_fieldNames.value] || '-' }}</div>
            <component :is="item.customRender(item[_fieldNames.value])" v-else></component>
        </div>
    </div>
</template>