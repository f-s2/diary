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
    <div class=" relative h-6 f-c-c color-white text-xs font-600 rounded-2px flex-shrink-0"
        :style="`width: ${tagWidth}px; background: ${findOne(status, StocktakingStatusOptions)?.color}`">
        <template v-if="status === StocktakingStatusEnum.InProgress">
            <div class=" absolute f-c-c top-0 right-0 h-full bg-#BBBBBB"
                :style="`width: ${tagWidth * (1 - progress)}px;`"></div>
            <span class=" relative z-10">{{ +(progress * 100).toFixed(2)  + '%' }}</span>
        </template>
        <span class=" relative z-10" v-else>·{{ findOne(status, StocktakingStatusOptions)?.label }}</span>
    </div>
</template>