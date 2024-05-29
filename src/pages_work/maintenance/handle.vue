<template>
    <div>
        处理任务
    </div>
</template>

<script setup>
import { onLoad } from "@dcloudio/uni-app";
onLoad(({ id }) => {
    console.log(id, 'handle');
})

</script>
<style lang='scss' scoped></style>