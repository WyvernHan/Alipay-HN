Page({
  data: {
    title: "申请成功",
    subTitle: "",
    messageButton: {
      mainButton: {
        buttonText: "返回我的"
      }
    }
  },
  goBack() {
    //my.navigateBack();
      my.switchTab({
                  url: '../mine/mine'
                });
  }
});