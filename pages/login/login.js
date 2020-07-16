var app = getApp();

Page({
  data: {
    login:'',
    password:'',
    captchaImage:'',
    num:''
  },
  onLoad(options) {
    /*my.setStorage({
      key: 'IsExist',
      data: {
        value: '1',
      },
      success: function() {
        my.alert({content: '写入成功'});
      }
    });*/
  },
  onInputLogin(e){
    this.setData({
      login:e.detail.value
    });
  },
  onInputPassword(e){
    this.setData({
      password:e.detail.value
    });
  },
  onInputYzm(e){
    this.setData({
      num:e.detail.value
    });
  },
  onSubmit() {
    const that = this;
    if(this.data.login==''){
      my.showToast({
        type: 'none',
        content: '请输入用户名',
        duration: 1500,
        success: () => {
        },
      });
    }else if(this.data.password==''){
      my.showToast({
        type: 'none',
        content: '请输入密码',
        duration: 1500,
        success: () => {
        },
      });
    }else if(this.data.num==''){
      my.showToast({
        type: 'none',
        content: '请输入图形验证码',
        duration: 1500,
        success: () => {
        },
      });
    }else{
      
      my.request({
        url: app.globalData.webServerUrl+'alipayRestController.do?method=alipayLogin',//获取首页信息
        method: 'POST',
        data: {
          login:this.data.login,//传参
          password:this.data.password,
          verifyCheckCode:this.data.num,
          userId:app.globalData.verifyCode
        },
        // 期望返回的数据格式，默认json，支持json，text，base64
        dataType: 'json',
        // 调用成功的回调函数
        success: function (res) {
          console.info(res);
          if(res.data.code=='000000') {
            app.globalData.IsExist=1;//用户变为登录状态
            app.globalData.user=res.data.sessionLogin;//用户
            app.globalData.userCode = res.data.sessionLogin.code;//用户编码
            app.globalData.userenterpriseInfo = res.data.userenterpriseInfo;//企业账户
            
            //把user加入缓存
            my.setStorage({
              key: 'sysLoginUser',
              data: {
                user: res.data.sessionLogin,
                userCode: res.data.sessionLogin.code
              },
              success: function() {
              }
            });
            //测试,正式
            // my.reLaunch({
            //   url: '../index/index'
            // });
            //开发
            my.switchTab({
              url: '../index/index'
            })
          }else if(res.data.code=='999999'){
            my.showToast({
              type: 'fail',
              content: res.data.message,
              duration: 3000,
              success: () => {
                /*my.reLaunch({
                  url: '../login/login',
                });*/
              },
            });
          }
        },
        fail: function (res) {
          my.showToast({
            type: 'exception',
            content: '网络异常',
            duration: 3000,
            success: () => {
              
            },
          });
        }
      });
    }
  },
  registerClick() {

    

    my.navigateTo({
      url: '../register/register'
    });
  },
  onReady(){
    //var that = this;
    var url = app.globalData.webServerUrl + 'alipayRestController.do?method=getYzm&userCode='+app.globalData.verifyCode;
    this.setData ({
      captchaImage: url,  // data 为接口返回的base64字符串
    });
    /*my.request({
      url: app.globalData.webServerUrl+'alipayRestController.do?method=getYzm&userCode='+app.globalData.userCode,
      method: 'GET',
      dataType: 'base64',
      success: (res) => { 
        console.info(res) 
        if (res.status == 200) {
          that.setData ({
            captchaImage: res.data,  // data 为接口返回的base64字符串
          });
        }else{
          my.showToast({
            type: 'fail',
            content: '验证码获取失败',
            duration: 3000,
            success: () => {
            },
          });
        }
      },
      fail: () => {
        my.showToast({
          type: 'exception',
          content: '网络异常',
          duration: 3000,
          success: () => {
          },
        });
      }
    });*/
  },
  //刷新验证码
  imageTap(){
    var url = app.globalData.webServerUrl + 'alipayRestController.do?method=getYzm&userCode='+app.globalData.verifyCode+'&a='+Math.random();
    this.setData ({
      captchaImage: url,  // data 为接口返回的base64字符串
    });
  },
});
