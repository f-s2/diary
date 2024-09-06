<template>
  <div v-if="tag">
    <span :class="`tag_${item.value} tag`" v-for="item in tagInfo" v-show="item.value === status"> <img :src="item.icon"
        alt=""> {{ item.name
      }}</span>

  </div>
  <div v-else :class="['status', { bg: needBg }]">
    <span class="doing" v-if="status === 0">待完成</span>
    <span class="done" v-else-if="status === 1">已提交</span>
    <span class="done" v-else-if="status === 2">已完成</span>
  </div>

</template>

<script setup>
import icon1 from '@/static/tag_1.png';
import icon2 from '@/static/tag_2.png';
import icon3 from '@/static/tag_3.png';
import icon4 from '@/static/tag_4.png';
const tagInfo = [
  { name: '保养', icon: icon1, value: 0 },
  { name: '点检', icon: icon3, value: 1 },
  { name: '盘点', icon: icon2, value: 2 },
  { name: '维修', icon: icon4, value: 3 },
]
defineProps({
  tag: {
    type: Boolean,
    default: false
  },

  needBg: {
    type: Boolean,
    default: false,
  },
  status: Number,
});
</script>

<style lang="scss" scoped>
.tag {
  display: flex;
  align-items: center;
  font-size: 12px;
  gap: 4px;
  padding: 2px 4px;
  border-radius: 2px;

  &.tag_1 {
    color: #15B4A0;
    background-color: rgba($color: #15B4A0, $alpha: 0.1);
  }

  &.tag_0 {
    color: #1890FF;
    background-color: rgba($color: #1890FF, $alpha: 0.1);
  }

  &.tag_2 {
    color: #FA8C16;
    background-color: rgba($color: #FA8C16, $alpha: 0.1);
  }

  &.tag_3 {
    color: #0087FA;
    background-color: rgba($color: #0087FA, $alpha: 0.1);
  }
}

.status {
  font-size: 14px;
  font-weight: bold;

  &.bg {
    .done {
      background-color: rgba($color: $uv-success, $alpha: 0.1);
    }

    .doing {
      background-color: rgba($color: $uv-warning, $alpha: 0.1);
    }

    .waiting {
      background-color: rgba($color: $uv-primary, $alpha: 0.1);
    }
  }

  .done,
  .waiting,
  .doing {
    padding: 2px 8px;
    border-radius: 4px;

    &::before {
      content: "";
      display: inline-block;
      height: 6px;
      width: 6px;
      border-radius: 50%;
      margin-right: 4px;
      vertical-align: middle;
    }
  }

  .done {
    color: $uv-success;

    &::before {
      background-color: $uv-success;
    }
  }

  .doing {
    color: $uv-warning;

    &::before {
      background-color: $uv-warning;
    }
  }

  .waiting {
    color: $uv-primary;

    &::before {
      background-color: $uv-primary;
    }
  }
}
</style>
