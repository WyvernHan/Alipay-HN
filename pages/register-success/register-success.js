Page({
 data: {
    title: "注册成功",
    messageButton: {
      mainButton: {
        buttonText: "立即登录"
      }
    }
  },
  goBack() {
    my.reLaunch({
      url: '../login/login'
    });
  }
});
