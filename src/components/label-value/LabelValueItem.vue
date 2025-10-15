<script setup lang="ts">
import { isEmpty } from '@/utils';
import { computed } from 'vue';

const props = defineProps<{
    label?: string
    value?: any
}>()

</script>

<template>
    <div class=" flex text-14px">
        <div class=" text-#666666 flex-shrink-0">{{ label }}：</div>
        <slot>
            <div class=" font-500" >{{ isEmpty(value) ? '-' : value }}</div>
        </slot>
    </div>
</template>