Page({
 data: {
    
  },
    /*****************************点击注册协议*****************************/
  onUserPrivacy() {//点击 关闭 的回调, showClose 为 false 时无需设置。
    my.navigateBack({
      delta: 0
    })
  },
  /***********************************提交注册信息**********************************/
  goBack() {
    my.navigateBack();
  }
});