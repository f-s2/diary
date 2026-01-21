<script setup lang="ts">
    defineProps<{
        url: string
    }>()
</script>

<template>
    <image
        class="w-22px h-22px rotate"
        :src="url"
        mode="widthFix"
    />
</template>

<style scoped>

.rotate {
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

</style>