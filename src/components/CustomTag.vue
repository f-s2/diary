<script setup lang="ts">
import { computed, ref } from 'vue';

interface TypeOption {
    text?: string
    color?: string
    bgColor?: string
}

const props = defineProps<{
    option?: TypeOption
    status?: number
}>()

const statusOptions:(TypeOption & { value: number})[] = [
    {
        text: '待完成',
        color: '#FF9D00',
        value: 0
    },
    {
        text: '已提交',
        color: '#004098',
        value: 1
    },
    {
        text: '已完成',
        color: '#6CD76B',
        value: 2
    },
]

const tagOption = computed(() => props.status !== undefined  ? statusOptions.find(v => v.value === props.status)  : props.option)

const textColor = computed(() => tagOption.value.color || '#333333')



</script>

<template>
    <div class="relative f-c-c px-10px py-6px rounded-2px overflow-hidden flex-shrink-0" :style="{ color: textColor }">
        <div class=" absolute w-full h-full top-0 left-0" :class="{' opacity-10': !tagOption.bgColor}" :style="{backgroundColor: tagOption.bgColor ||  textColor}"></div>
        <span class=" relative z-2 text-12px text-center">·{{ tagOption.text }}</span>
    </div>
</template>