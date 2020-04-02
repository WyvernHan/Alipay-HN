import utils from '/utils/utils.js';
const regPassword = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/;
const app = getApp();

Page({
  data: {
    userWord: false,
    login:'',// 手机号
    password:'',//新密码
    newPassword:'',//确认密码
    num:'',//图形验证码
    captchaImage:'',//图形图片
    yzmCode: '', // 手机验证码input内容
    yzmId:'',//验证码ID
    disabled: false ,// 是否可以编辑手机号
    notimer:false
  },
  onItemInputPassword(e){
    this.setData({
      password: e.detail.value
    });
  },
  onItemBlurPassword(e) {
    if(e.detail.value==''){

    }else{
      if(regPassword.test(e.detail.value)){
        if(this.data.newPassword==e.detail.value){
          this.setData({
            password: e.detail.value
          });
        }else if(this.data.newPassword==''){

        }else{
          this.setData({
            password: ''
          });
          my.alert({
            content: '新密码与确认密码不一致，请重新输入！',
          });
        }
      }else{
        this.setData({
          password: ''
        });
        my.alert({
          content: '密码格式为8至20位的字母、数字组合，请重新输入！',
        });
      }
    }
  },
  onItemInputNewPassword(e){
    this.setData({
      newPassword: e.detail.value
    });
  },
  onItemBlurNewPassword(e) {
    if(e.detail.value==''){

    }else{
      if(regPassword.test(e.detail.value)){
        if(this.data.password==e.detail.value){
          this.setData({
            newPassword: e.detail.value
          });
        }else{
          this.setData({
            newPassword: ''
          });
          my.alert({
            content: '新密码与确认密码不一致，请重新输入！',
          });
        }
      }else{
        this.setData({
          newPassword: ''
        });
        my.alert({
          content: '密码格式为8至20位的字母、数字组合，请重新输入！',
        });
      }
    }
  },
  onInputYzm(e){
    this.setData({
      num:e.detail.value
    });
  },
  onReady(){
    //var that = this;
    var url = app.globalData.webServerUrl + 'alipayRestController.do?method=getYzm&userCode='+app.globalData.verifyCode;
    this.setData ({
      captchaImage: url,  // data 为接口返回的base64字符串
    });
  },
  //刷新验证码
  imageTap(){
    var url = app.globalData.webServerUrl + 'alipayRestController.do?method=getYzm&userCode='+app.globalData.verifyCode+'&a='+Math.random();
    this.setData ({
      captchaImage: url,  // data 为接口返回的base64字符串
    });
  },
  /**
   * 点击发送验证码触发的事件
   * @method onSendCode
   * @param {object} object 组件传递参数,包含手机号
   */
  onSendCode(object) {
    console.info("-----------------------进了");
    console.info(object);
    this.setData({ 
      login: object.mobile ,
      yzmId:object.yzmId
    });
    const that = this;
    
  },
  /**
   * 输入验证码触发的事件
   * @method onCodeInput
   * @param {*} e
   */
  onCodeInput(e) {
    const { value } = e.detail;
    this.setData({ yzmCode: value });
    console.info(this.data.yzmCode)
  },
  defaultTap(){
    const that=this;

    if(this.data.login==''){
      my.showToast({
        type: 'none',
        content: '请输入手机号',
        duration: 2000,
        success: () => { },
      });
    }else if(this.data.password==''){
      my.showToast({
        type: 'none',
        content: '请输入新密码',
        duration: 2000,
        success: () => { },
      });
    }else if(this.data.newPassword==''){
      my.showToast({
        type: 'none',
        content: '请输入确认密码',
        duration: 2000,
        success: () => { },
      });
    }else if(this.data.yzmCode==''){
      my.showToast({
        type: 'none',
        content: '请输入验证码',
        duration: 2000,
        success: () => { },
      });
    }else{
      my.request({
        url: app.globalData.webServerUrl+'alipayRestController.do?method=moveResetPassword',//注册信息提交
        method: 'POST',
        data: {
          login:that.data.login,
          password:that.data.password,
          yzmCode:that.data.yzmCode,
          yzmId:that.data.yzmId
        },
        // 期望返回的数据格式，默认json，支持json，text，base64
        dataType: 'json',
        // 调用成功的回调函数
        success: function (res) {
          console.info(res.data)
          if(res.data.code=='000000'){
            my.showToast({
              type: 'success',
              content: res.data.message,
              duration: 2000,
              success: () => {
                my.reLaunch({
                  url: '../login/login'
                });
              },
            });
            
          }else if(res.data.code=='999999'){
            my.showToast({
              type: 'fail',
              content: res.data.message,
              duration: 2000,
              success: () => { },
            });
          }
        },
        fail: function () {
          my.showToast({
            type: 'exception',
            content: '网络异常',
            duration: 2000,
            success: () => { },
          });
        }
      });
    }
  },
});