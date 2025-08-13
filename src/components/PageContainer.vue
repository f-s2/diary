<script setup lang="ts">
import CustomHeaderNav from './CustomHeaderNav.vue';


</script>

<template>
    <div class=" w-full h-100vh flex flex-col">
        <CustomHeaderNav></CustomHeaderNav>
        <div class=" h-0 pt-5 flex-1 overflow-auto">
            <slot></slot>
        </div>
        <slot name="footer"></slot>
    </div>
</template>