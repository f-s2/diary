<script>
export default {
  globalData: {
    token: "",
    pending: false,
  },
  onLaunch: function () {
    console.log("App launch");
  },
  onShow: function () {
    console.log("App Show");
  },
  onHide: function () {
    console.log("App Hide");
  },
};
</script>

<style lang="scss">
@import '@climblee/uv-ui/index.scss';
@import '@climblee/uv-ui/theme.scss';
/*每个页面公共css */

page {
  background-color: #f7f8fa;
}

.page-body {
  padding: 36rpx 32rpx 60rpx;
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
  background-color: $uv-primary;
}

button[type="primary"][plain] {
  border-color: $uv-primary;
  color: $uv-primary;
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
  background-color: #f7f8fa;
}

.uv-popup__content.bottom {
  padding: 20px;
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
  position: initial !important;
}


.form-required {
  // left: -9px;
  color: #f56c6c;
  line-height: 20px;
  font-size: 20px;
  position: relative;
  display: inline-block;

}

.uv-form-item__body__right__content__slot {
  flex-direction: row-reverse !important;
}

.input-right {
  .uv-input__content__field-wrapper__field {
    text-align: right !important;
  }

  .uv-form-item__body__right__message {
    text-align: right;
  }
}
</style>
