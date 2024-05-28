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
  font-size: 32rpx;

  .describe-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 0;
    gap: 10px;

    &:not(:first-child) {
      border-top: 1px solid #f7f8fa;
    }
  }

  .describe-label {
    font-weight: 400;
    flex-shrink: 0;
  }

  .describe-value {
    color: rgb(0, 0, 0, 0.5);
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
  bottom: 32px;
}

.uv-popup__content.bottom {
  padding: 20px;
}
</style>
