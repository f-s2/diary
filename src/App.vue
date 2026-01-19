<script setup>
import { onLaunch, onError, onShow } from '@dcloudio/uni-app'
import { useGlobalStore } from './store/global';

function initOptions() {


}


onLaunch(() => {
  try {
    const {initSetting, setSetting} = useGlobalStore()
    initSetting()

    window?.addEventListener('message', e => {
      if(e.data.type === 'URL_INFO') {
        console.log('origin:', e.origin);
        
          setSetting({baseUrl: e.origin})
      }
      
    })
    // 挂载APP启动日志提交
    uni.$dev.logReport("appOnLaunch>" + JSON.stringify(ctx));
  } catch (error) { }
})

onShow(() => {
  initOptions()
})

onError((err) => {
  try {
    // 挂载devTools全局报错拦截
    uni.$dev.errorReport(err, "at App.vue onError", "oe");
  } catch (error) { }
})

</script>

<style lang="scss">
@import '@climblee/uv-ui/index.scss';
/*每个页面公共css */

page,
uni-page-wrapper {
  color: #333;
  background-image: linear-gradient(145.46deg, rgba(222, 235, 255, 1) 0%, rgba(214, 240, 255, 1) 24.81%, rgba(227, 229, 255, 1) 53.08%, rgba(243, 248, 255, 1) 74.09%, rgba(233, 254, 255, 1) 100%);
}

.z-paging-content {
  // 解决状态栏刘海高度问题
  padding-top: var(--status-bar-height);
}

image {
  display: block;
  object-fit: cover;
  width: 100%;
  height: auto;
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
  box-sizing: border-box;

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  .uv-button--primary {
    font-size: 18px;
    border-radius: 6px;
    height: 48px;
  }

  .uv-button--disabled {
    background-color: #BBBBBB;
    border-color: #BBBBBB;
  }

  .uv-form-item__body__left__content__required {
    // position: initial !important;
    font-size: 14px;
    line-height: 22px;
  }

  // .uv-form-item__body {
  //   align-items: start;
  // }
  // .uv-form-item__body__left__content__label {
  //   padding-top: 11px;
  // }

  .uv-tabs__wrapper__nav {
    .uv-tabs__wrapper__nav__item__text {
      background-color: white;
      padding: 7px 12px;
      border-radius: 3px;
      font-size: 13px;
      span {
        font-size: 13px;
      }
    }
  }
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
  padding-bottom: 16px;
}

.uv-popup__content.bottom {
  max-height: 70vh;
  min-height: 10vh;
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
