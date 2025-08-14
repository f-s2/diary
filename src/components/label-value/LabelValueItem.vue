<script setup lang="ts">
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
            <div class=" font-500" >{{ value || '-' }}</div>
        </slot>
    </div>
</template>