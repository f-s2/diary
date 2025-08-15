<script setup lang="ts">
import { computed, ref } from 'vue';
import ClosePng from '@/static/close.png'


const props = defineProps<{
    title?: string
    open?: boolean
}>()

const emit = defineEmits<{
    'update:open': [boolean]
}>()

const visible = computed({
    get: () => props.open,
    set: bool => emit('update:open', bool)
})

</script>

<template>
    <transition name="fade">
        <div class=" fixed z-100 top-0 left-0 w-full h-full px-5 bg-black bg-opacity-50 f-c-c" v-if="visible"
            @click.self="visible = false">
            <slot name="content">
                <div class=" w-full bg-color min-h-120px relative rounded-12px px-18px pt-14px pb-5">
                    <div class=" text-center px-24px">{{ title }}</div>
                    <image mode="widthFix" class=" absolute top-11px right-18px  w-28px" :src="ClosePng" alt=""
                        @click="visible = false" />
                    <div class="mt-4">
                        <slot></slot>
                    </div>
                </div>
            </slot>
        </div>
    </transition>
</template>

<style scoped>
/* Vue transition 需要四个类 */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
    opacity: 1;
}

.bg-color {
    background: linear-gradient(172.57deg, rgba(154, 218, 255, 1) 0%, rgba(237, 247, 255, 1) 58.58%, rgba(231, 242, 252, 1) 73.89%, rgba(234, 244, 254, 1) 100%);
}
</style>