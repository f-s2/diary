<script setup lang="ts">
import { ref } from 'vue';


const loadedCount = ref(0)

function handleImageLoaded() {
    loadedCount.value++
}

const comKey = ref(1)

function showAnime() {
    comKey.value++
}

defineExpose({
    showAnime
})
</script>

<template>
    <view class=" relative mx-auto admission-ani" :key="comKey">
        <image class="absolute-center w-180% h-140%" src="@/static/images/dialogue/ai-bg.gif" mode="widthFix" @load="handleImageLoaded" />
        <view class="absolute-center w-40% -ml-3%">
            <image src="@/static/images/dialogue/ai-avatar.png" mode="widthFix" @load="handleImageLoaded" />
            <view class=" absolute left-22% bottom-39% bg-#19EAFF wink-ani w-10% h-7% rounded-6px" v-show="loadedCount>=2"></view>
            <view class=" absolute right-22% bottom-39% bg-#19EAFF wink-ani w-10% h-7% rounded-6px" v-show="loadedCount>=2"></view>
        </view>
    </view>
</template>

<style scoped>
.absolute-center {
    --at-apply: 'absolute top-1/2 left-1/2 -translate-1/2 '
}

.wink-ani {
    animation: wink 1.5s ease infinite;
}

@keyframes wink {
    0% {
        transform: scaleY(1);
    }

    20% {
        transform: scaleY(0.3);
    }

    40% {
        transform: scaleY(1);
    }

    60% {
        transform: scaleY(0.3);
    }

    80% {
        transform: scaleY(1);
    }

    100% {
        transform: scaleY(1);
    }

}

.admission-ani {
    animation: admission 1s ease;
}

@keyframes admission {
    0% {
        transform: scale(0.4);
        opacity: 0.5;
    }

    100% {
        transform: scale(1);
        opacity: 1;
    }
}
</style>