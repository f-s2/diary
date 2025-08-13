<script setup lang="ts">
import { findOne } from '@/dict';
import { StocktakingStatusEnum, StocktakingStatusOptions } from '@/enums/work';


defineProps<{
    status?: number
    progress?: number
}>()



const tagWidth = 58

</script>

<template>
    <div class=" relative h-6 f-c-c color-white text-xs font-600 rounded-2px" :style="`width: ${tagWidth}px; background: ${findOne(status, StocktakingStatusOptions)?.color}`">
        <div class=" absolute top-0 right-0 h-full" :style="`width: ${tagWidth * (1- progress)}px;`" v-if="status === StocktakingStatusEnum.InProgress"></div>
        <span class=" relative z-10" v-else>·{{ findOne(status, StocktakingStatusOptions)?.label }}</span>
    </div>
</template>