<script setup lang="ts">
    import QuickIcon1 from '@/static/images/quick-icon-1.png'
    import QuickIcon2 from '@/static/images/quick-icon-2.png'
    import QuickIcon3 from '@/static/images/quick-icon-3.png'
    import QuickIcon4 from '@/static/images/quick-icon-4.png'
    import QuickIcon5 from '@/static/images/quick-icon-5.png'

    const emit = defineEmits<{
        quickSend: [string],
    }>()


    const list:{
        text: string
        icon: string
        onClick?: Function
    }[] = [
        {
            text: '启动1号线设备，开始生产',
            icon: QuickIcon1
        },
        {
            text: '启动3号线生产线设备自检',
            icon: QuickIcon2
        },
        {
            text: '产险缺料，增加原料',
            icon: QuickIcon3
        },
        {
            text: '查看3号产线封包设备运行状态',
            icon: QuickIcon4
        },
        {
            text: '查看2号设备运行状态',
            icon: QuickIcon4
        },
        {
            text: '历史记录',
            icon: QuickIcon5,
            onClick() {
                uni.navigateTo({
                    url: '/pages/history/index'
                })
            }
        },
    ]

</script>
<template>
    <view class="p-14px rounded-14px border-(1px solid #fff)"
        style="background: linear-gradient(180deg, #DEEBFF 0%, #E2F5FF 5.12%, #FFFFFF 15.79%, #FFFFFF 100%);">
        <view class="flex items-center">
            <image class="w-38px" src="@/static/images/quick-icon.png" mode="widthFix" />
            <text class="text-16px font-600">您可以尝试这样问我</text>
        </view>
        <view class="py-32px space-y-23px">
            <view class="f-c-c gap-10px" v-for="item in list" :key="item.text" @click="item.onClick ? item.onClick() : $emit('quickSend', item.text)">
                <image class="w-22px" :src="item.icon" mode="widthFix" />
                <text class="text-14px font-500 flex-1">{{ item.text }}</text>
                <image class="w-22px" src="@/static/images/arrow-right.png" mode="widthFix" />
            </view>
        </view>
    </view>
</template>