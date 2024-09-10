<template>
    <div class="container">
        <span style="--d: 7"></span>
        <span style="--d: 6"></span>
        <span style="--d: 5"></span>
        <span style="--d: 4"></span>
        <span style="--d: 3"></span>
        <span style="--d: 2"></span>
        <span style="--d: 1"></span>
        <span style="--d: 0"></span>
        <span style="--d: 1"></span>
        <span style="--d: 2"></span>
        <span style="--d: 3"></span>
        <span style="--d: 4"></span>
        <span style="--d: 5"></span>
        <span style="--d: 6"></span>
        <span style="--d: 7"></span>
    </div>

</template>
<style lang="scss" scoped>
$height: 68rpx;

.container {
    display: flex;
    align-items: center;
    position: relative;
    height: $height;
}

.container span {
    background: $uv-primary;
    width: 8rpx;
    height: 20%;
    border-radius: calc($height * 0.2 * 0.5);
    margin-right: 8rpx;
    animation: loading 2.5s infinite linear;
    animation-delay: calc(0.2s * var(--d));
}

.container span:last-child {
    margin-right: 0px;
}

@keyframes loading {
    0% {
        height: 20%;
        border-radius: calc($height * 0.2 * 0.5);
    }

    50% {
        height: 100%;
        border-radius: calc($height * 1 * 0.5);
    }

    100% {
        height: 20%;
        border-radius: calc($height * 0.2 * 0.5);
    }
}
</style>
