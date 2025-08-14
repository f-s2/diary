<script lang="ts">

export type LabelValueItem = {
    label: string,
    value?: any,
    customRender?: (value?: any) => VNode | string
    notRender?: boolean
} & Record<string, any>

</script>

<script setup lang="ts">
import { computed, type VNode } from 'vue';
import LabelValueItem from './LabelValueItem.vue';

const props = defineProps<{
    list?: LabelValueItem[]
    fieldNames?: {
        label?: string
        value?: string
    }
}>()

const _fieldNames = computed(() => Object.assign({ label: 'label', value: 'value' }, props.fieldNames))

const currentList = computed(() => props.list.filter(v => !v.notRender).map(v => ({...v, label: v[_fieldNames.value.label], value: v[_fieldNames.value.value] })))

</script>

<template>
    <div class=" space-y-4">
        <!-- <div class=" flex text-14px" v-for="item in list">
            <div class=" text-#666666 flex-shrink-0">{{ item[_fieldNames.label] }}：</div>
            <div class=" font-500" v-if="!item.customRender">{{ item[_fieldNames.value] || '-' }}</div>
            <component :is="item.customRender(item[_fieldNames.value])" v-else></component>
        </div> -->
        <LabelValueItem :label="item.label" :value="item.value" v-for="item in currentList">
            <component v-if="item.customRender" :is="item.customRender(item.value)"></component>
        </LabelValueItem>
        <slot></slot>
    </div>
</template>