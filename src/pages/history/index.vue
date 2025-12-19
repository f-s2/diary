<script setup lang="ts">
import PageContainer from '@/components/PageContainer.vue';
import { ref } from 'vue';

    
    const list = ref([])

    function getData() {

    }

    function handleBack() {
        uni.navigateBack()
    }
</script>
<template>
   <page-container>
        <template #header>
            <view class="relative bg-white h-60px f-c-c">
                <image
                    class="absolute left-0 top-0 bottom-0 my-auto w-44px"
                    src="@/static/images/history/arrow-left.png"
                    mode="widthFix"
                    @click="handleBack"
                />
                <text class=" text-center text-20px font-500">历史记录</text>
            </view>
        </template>
        <view class="px-16px py-12px">
            1212
        </view>
   </page-container>
</template>