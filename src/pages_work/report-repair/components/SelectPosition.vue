<template>
  <u-popup :show="show" @update:show="(bol) => $emit('update:show', bol)" mode="bottom" title="选择位置" :cancel="true"
           :back="false" :round="10">
    <div class="search">
      <uv-search v-model="keywords" placeholder="名称或编码" :showAction="false" />
    </div>
    <div class="content" >
     <data-tree :filter-value="keywords"  v-if="positionTree?.length"  @change="handleChange" :onlyRadioLeaf="false" themeColor="#003A8B" :showRadioIcon="false"   :data="positionTree" labelField="name"  valueField="id" />
      <u-empty v-else></u-empty>

      </div>
    <div class="bottom">
      <uv-button type="primary" @click="handleOk" hover-class="none">确认</uv-button>
    </div>
  </u-popup>
</template>

<script lang="ts" setup>
import  DataTree from '@/components/da-tree/index.vue'
import { computed, ref, watch } from "vue";
import { RepairApi } from '@/api/WorkApi'
const props = defineProps({ show: Boolean,data:Object });
const emit = defineEmits(["update:show", "ok",]);
const handleOk = () => {
  if(!checkedItem.value){
    uni.showToast({
      title:'请选择位置',
      icon:'none'
    })
    return
  }
  emit("ok",checkedItem.value );
  emit("update:show", false);
};
const positionTree = ref([])
const keywords = ref('')

const computedList = computed(() => {
  return positionTree.value.filter(item => item.name?.includes(keywords.value)||item.code?.includes(keywords.value))
})
const checkedItem=ref('')
const handleChange=(val,item)=>{

  checkedItem.value=item.checkedStatus? item:undefined
}
const load = () => {
  uni.showLoading();
  RepairApi.devicePositionTree({}).then((res) => {
    positionTree.value = res.data;
  })
    .finally(() => {
      uni.hideLoading();
    });
};
load()
watch(
  () => props.show,
  (bol) => {
    if (bol) {
      // load()
    }
  }
);
</script>

<style lang="scss" scoped>
.search {
  display: flex;
  gap: 10px;
  align-items: center;
  font-size: 14px;
  color: rgba($color: #000000, $alpha: 0.9);
  margin-bottom: 12px;
}

.content {
  height: calc(70vh - 44px);
  overflow-y: auto;
}

.item-box {
  display: flex;
  flex-direction: column;
  gap: 10px;

  .item-top {
    color: #000000;
    display: flex;
    justify-content: space-between;
  }


  padding: 12px 0;

  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}
</style>