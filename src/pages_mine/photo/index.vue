<template>
  <div class="page">
    <div class="filter-date">
      <div @click="selectDate(item)" :class="['date-item', { active: activeIndex === item.code }]"
        v-for="item in dateInfo" :key="item.code">
        {{ item.name }}
      </div>
    </div>
    <div class="photo-list" v-if="picList?.length">
      <div class="photo-type" v-for="(item, index) in picList" :key="index">
        <div class="photo-title">{{ item.time }}</div>
        <div class="photo-box">
          <div class="img-box" @click="preview(file.filePath)" v-for="(file, i) in item.files" :key="i">
            <img class="pic" :src="userStore.userInfo.urlPrefix + file.filePath" alt="" />
            <div class="img-info">
              <div class="info">
                <uni-icons type="images" size="16" /> {{ file.width }}*{{
          file.length
        }}px
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <u-empty class="empty" v-else></u-empty>
    <div class="file-box" style="width: 0">
      <uni-file-picker :auto-upload="false" @select="savePhotos" :sourceType="['camera']">
        <button class="bottom-btn" type="primary" hover-class="none">
          拍照
        </button>
      </uni-file-picker>
    </div>
  </div>
</template>

<script setup>
import { BaseApi } from "@/api/BaseApi";
import { ClockInApi } from "@/api/ClockInApi";
import { WorkApi } from "@/api/WorkApi";
import { useUserStore } from "@/store/user";
import { onShow } from "@dcloudio/uni-app";
import { ref } from "vue";

onShow(() => {
  uni.showLoading()

})


const userStore = useUserStore();
const dateInfo = [
  {
    name: "日",
    code: 0,
  },
  {
    name: "月",
    code: 1,
  },
  {
    name: "年",
    code: 2,
  },
];
const activeIndex = ref(0);
const picList = ref([]);
const selectDate = ({ code }) => {
  activeIndex.value = code;
  reload();
};
const reload = () => {
  uni.showLoading();
  WorkApi.pictures({ type: activeIndex.value })
    .then((res) => {
      console.log("res", res);
      picList.value = res.data;
    })
    .finally(() => {
      uni.hideLoading();
    });
};

const savePhotos = async ({ tempFilePaths, tempFiles }) => {

  const { height, width } = tempFiles[0].image;
  uni.showLoading({ mask: true });
  BaseApi.upload(tempFilePaths[0])
    .then((res) => {
      if (res.code === 0) {
        const { name } = res.data;
        const params = {
          width,
          filePath: name,
          length: height,
        };
        ClockInApi.saveImg(params)
          .then((res) => {
            if (res.code === 0) {
              uni.showToast({
                title: "保存成功",
              });
            }
          })
          .finally(() => {
            reload();
          });
      }
    })
    .finally(() => {
      uni.hideLoading();
    });



};
const preview = (url) => {
  uni.previewImage({
    urls: [userStore.userInfo.urlPrefix + url],
    fail: (err) => {
      console.log("err", err);
    },
  });
};
reload();




</script>

<style lang="scss" scoped>
.empty {
  padding: 80rpx 0;
}



.page {
  padding: 32rpx;
  padding-bottom: 150rpx;
}

.filter-date {
  display: flex;
  border-radius: 4rpx;
  background: #ebeef3;
  padding: 8rpx;
  border-radius: 8rpx;
  font-size: 28rpx;

  .date-item {
    flex: 1;
    height: 80rpx;
    border-radius: 8rpx;
    text-align: center;
    line-height: 80rpx;
    font-weight: bold;

    &.active {
      background-color: #fff;
    }
  }
}

.photo-list {
  margin-top: 32rpx;
}

.photo-type {
  padding: 12px 16px;
  border-radius: 4px;
  background: #fff;
}

.photo-title {
  font-weight: bold;
  margin-bottom: 12px;
}

.photo-box {
  display: flex;
  flex-direction: column;
  gap: 14px;

  .img-box {
    display: flex;
    gap: 12px;
    align-items: center;
    padding-bottom: 14px;
    border-bottom: 1px solid rgba($color: #000000, $alpha: 0.05);
  }

  .img-info {
    flex: 1;
    align-self: stretch;
    font-size: 12px;
    color: rgba($color: #000000, $alpha: 0.9);
  }

  .info,
  .location {
    line-height: 16px;
    word-break: break-all;
  }

  .pic {
    height: 48px;
    width: 48px;
  }
}
</style>
