<script setup>
import { UserApi } from '@/api/UserApi'
import { onLaunch } from '@dcloudio/uni-app'
import { useUserStore } from '@/store/user'
const userStore = useUserStore()
onLaunch(() => {
  UserApi.getPrefix().then(res => {
    userStore.urlPrefix = res.data
  })
})
</script>

<style lang="scss">
@import '@climblee/uv-ui/index.scss';
/*每个页面公共css */

page,
uni-page-wrapper {
  background-image: linear-gradient(to bottom, #9ADAFF, #ECFFF9 120px, #F1F9FF 200px);
  color: #333;
}

.uni-toast {
  .uni-toast__icon {
    margin: 20px auto;
  }
}


.page-body {
  padding: 36rpx 32rpx 60rpx;
}

.custom-nav-page {
  padding-top: 44px;
}


.describe-box {
  background: #fff;
  padding: 0 32rpx;
  display: flex;
  flex-direction: column;
  font-size: 14px;
  border-radius: 4px;

  .describe-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 0;
    gap: 10px;

    &:not(:first-child) {
      border-top: 1px solid #f7f8fa;
    }

    &.wrap {
      flex-direction: column;
      align-items: flex-start;

      .describe-value {
        width: 100%;
      }
    }
  }

  .describe-label {
    font-weight: 400;
    flex-shrink: 0;
    color: rgba(0, 0, 0, 0.50);
  }

  .describe-value {
    color: rgb(0, 0, 0, 0.9);
    display: inline-flex;
    flex-wrap: wrap;
    word-break: break-all;
  }
}


button[type="primary"] {
  background-color: $uv-primary ;
}

button[type="primary"][plain] {
  border-color: $uv-primary;
  color: $uv-primary;
}

#app {
  .uv-button--primary {
    font-size: 18px;
    border-radius: 6px;
    height: 48px;
  }

  .uv-button--disabled {
    background-color: #BBBBBB;
    border-color: #BBBBBB;
  }

  // .uv-form-item__body {
  //   align-items: start;
  // }
  // .uv-form-item__body__left__content__label {
  //   padding-top: 11px;
  // }
}

.uv-button--plain {
  background: #fff;
}





.ellipsis {
  overflow: hidden; // 溢出隐藏
  white-space: nowrap; // 强制一行
  text-overflow: ellipsis;
}



.bottom-btn {
  position: fixed;
  left: 16px;
  right: 16px;
  bottom: 0;
  padding-bottom: 32px;
}

.uv-popup__content.bottom {
  max-height: 70vh;
  min-height: 50vh;
  display: flex !important;
  padding: 20px;
  flex-direction: column;

  .content {
    flex: 1;
    overflow-y: auto;
    height: initial;
  }
}


.item-tags {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 2px;

  .item-tag {
    border-radius: 2px;
    background: rgba(151, 155, 155, 0.10);
    display: flex;
    padding: 2px 4px;
    color: rgba(0, 0, 0, 0.50);
  }

}

.uv-form-item__body__left__content__required {
  // position: initial !important;
}


.form-required {
  // left: -9px;
  color: #f56c6c;
  line-height: 20px;
  font-size: 20px;
  position: relative;
  display: inline-block;

}


.uv-form-item__body__right {
  background-color: white;
}

.input-right {
  .uv-input__content__field-wrapper__field {
    text-align: right !important;
  }

  .uv-form-item__body__right__content__slot {
    flex-direction: row-reverse !important;
  }

  .uv-form-item__body__right__message {
    text-align: right;
  }
}
</style>
