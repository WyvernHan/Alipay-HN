Page({
 data: {
    title: "注册成功",
    messageButton: {
      mainButton: {
        buttonText: "立即登录"
      }
    }
  },
    /*****************************点击注册协议*****************************/
  onUserWord() {//点击 关闭 的回调, showClose 为 false 时无需设置。
    my.navigateBack({
      delta: 0
    })
  },
  /***********************************提交注册信息**********************************/
  goBack() {
    my.navigateBack();
  }
});
