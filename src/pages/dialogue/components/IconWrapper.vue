<script setup lang="ts">
defineProps<{
    url: string
}>()
</script>

<template>
    <view class=" relative w-max">
        <view class="p-12px bg-#D5EFFF scale rounded-full">
            <view class="w-76px h-76px scale bg-white bg-opacity-15 rounded-full">
            </view>
        </view>
        <image class=" w-56px h-56px block absolute left-0 right-0 top-0 bottom-0 m-auto" :src="url" mode="widthFix" />
    </view>
</template>

<style scoped>
.scale {
    animation: scale 2s linear infinite;
}

@keyframes scale {
    0% {
        transform: scale(100%);
    }

    70% {
        transform: scale(80%);
        opacity: 0.6;
    }
    100% {
        transform: scale(100%);
    }
}
</style>