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
/*每个页面公共css */
page {
  background-color: #f7f8fa;
}

.page-body {
  padding: 36rpx 32rpx 15rpx;
}

.describe-box {
  background: #fff;
  padding: 0 32rpx;
  display: flex;
  flex-direction: column;
  font-size: 32rpx;

  .describe-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 32rpx 0;
    &:not(:first-child) {
      border-top: 1rpx solid #f7f8fa;
    }
  }
  .describe-label {
    font-weight: 400;
  }
  .describe-value {
    color: rgb(0, 0, 0, 0.5);
    display: inline-flex;
  }
}
.uni-easyinput {
  .uni-easyinput__content {
    background: #f7f8fa !important;
    border-color: rgba(0, 0, 0, 0.02) !important;
  }
}
button[type="primary"] {
  background-color: $uni-color-primary;
}
button[type="primary"][plain] {
  border-color: $uni-color-primary;
  color: $uni-color-primary;
}
.uni-popup__wrapper {
  border-radius: 10px 10px 0 0;
  background-color: #fff !important;
  padding: 24px 16px 30px;
}
.popup {
  .uni-date {
    .uni-date-editor--x {
      border: none;
    }
    .uni-date-range {
      background: #f7f8fa;
      color: #000;
    }
  }
}
</style>
