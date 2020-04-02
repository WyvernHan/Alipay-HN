const regPassword = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/;
const app = getApp();

Page({
  data: {
    inputFocus: true,
    bank: '',
    name: '',
    userCode:"",
    y_password:"",
    yy_password:"",
    yyy_Password:"",
    ymmMsg:"原密码",
    yymmMsg:"新密码",
    yyymmMsg:"确认新密码"
  },
  onLoad(){
    let that=this; 
    that.data.userCode=app.globalData.userCode;
  },
  onItemBlurPassword(e){
    console.info(e.detail.value);
    if(e.detail.value.length==0){
        this.setData({
        y_password: '',
        ymmMsg:'原密码不能为空！'
      });
    }
  },
  onItemBlurPassword2(e){
    if(regPassword.test(e.detail.value)){
      if(this.data.y_password==e.detail.value){
        this.setData({
          yy_password: '',
          yymmMsg:'密码与原密码相同,请重新输入！'
        });
      }
    }else{
      console.info("正则没过");
      this.setData({
        yy_password: '',
        yymmMsg:'8至20位的字母、数字组合，请重新输入！'
      });
    }
  },
  onItemBlurPassword3(e){
    if(regPassword.test(e.detail.value)){
      if(this.data.yy_password!=e.detail.value){
         this.setData({
          yyy_password: '',
          yyymmMsg:'确认密码与新密码不一致，请重新输入！'
        });
      }
    }else{
      console.info("正则没过");
      this.setData({
         yyy_password: '',
         yyymmMsg:'8至20位的字母、数字组合，请重新输入！'
      });
    }
  },
  onAutoFocus(){
    var zt=true;
    if(this.data.y_password.length==0){
      zt=false;
      my.showToast({
        type: 'fail',
        content: '请输入原密码',
        duration: 1500,
        success: () => {         
        },
      });
    }
    if(this.data.yy_password.length==0){
      zt=false;
      my.showToast({
        type: 'fail',
        content: '请输入新密码',
        duration: 1500,
        success: () => {           
        },
      });
    }
    if(this.data.yyy_password.length==0){
      zt=false;
      my.showToast({
        type: 'fail',
        content: '请输入确认密码',
        duration: 1500,
        success: () => {           
        },
      });
    }
    if(zt){
      my.request({
        url: app.globalData.webServerUrl+'alipayRestController.do?method=updatePWD',
        method: 'POST',
        data: {
            userCode:this.data.userCode,
            password:this.data.yy_password,
            oldpassword:this.data.y_password
        },
        dataType: 'json',
        success: (res) => {
          console.info(res.data)
          if(res.data.code=="000000"){
            my.showToast({
              type: 'success',
              content: '密码修改成功，稍后退回到登录页',
              duration: 3000,
              success: () => {
                my.reLaunch({url: '../login/login'});
              }
            });   
          }else{
            my.showToast({
              type: 'fail',
              content: '密码修改失败：'+res.data.message,
              duration: 1500,
              success: () => {
              },
            });
          } 
        },
        fail: function(res) {
          my.showToast({
            type: 'exception',
            content: '网络异常',
            duration: 1500,
            success: () => {
            },
          });
        },
        complete: function(res) {
          my.hideLoading();
        }
      });
    }    
  },
  yinput(e){
    this.setData({
      y_password: e.detail.value
    });
  },
  yyinput(e){
    this.setData({
      yy_password: e.detail.value
    });
  },
  yyyinput(e){
    this.setData({
      yyy_password: e.detail.value
    });
  },
});