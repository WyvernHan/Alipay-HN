import utils from '/utils/utils.js';
const regPassword = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/;
const app = getApp();
var cid ='';
var curl='';
function startAPVerify(options, callback) {
    my.call('startBizService', {
        name: 'open-certify',
        param: JSON.stringify(options),
    }, callback);
}
Page({
  data: {
    userWord: false,
    nickName:'',
    license:'',
    corporate:'',
    idCard:'',
    login:'',// 手机号
    password:'',
    newPassword:'',
    num:'',//图形验证码
    captchaImage:'',//图形图片
    yzmCode: '', // 手机验证码input内容
    yzmId:'',//验证码ID
    disabled: false // 是否可以编辑手机号
  },
  /***************************验证企业名称是否存在*****************************/
  onItemInputNickName(e){
    this.setData({
      nickName: e.detail.value
    });
  },
  onItemBlurNickName(e) {
    my.request({
			url: app.globalData.webServerUrl+'alipayRestController.do?method=nickNameRegist',
			method: 'POST',
			data: {
        nickName:e.detail.value,//传参
        code:''
			},
			// 期望返回的数据格式，默认json，支持json，text，base64
			dataType: 'json',
			// 调用成功的回调函数
		  success: function (res) {
        console.info(res.data)
        if(res.data.code=='999999'){
          my.alert({
            content: res.data.message+'，请重新输入',
          });
        }
      },
      fail: function (res) {
        utils.showAlertModal('服务器异常', '请重新登录');
      }
    });
  },
  /***************************验证统一社会信用代码是否存在*****************************/
  onItemInputLicense(e){
    this.setData({
      license: e.detail.value
    });
  },
  onItemBlurLicense(e) {
    my.request({
			url: app.globalData.webServerUrl+'alipayRestController.do?method=licenseRegist',
			method: 'POST',
			data: {
        license:e.detail.value,//传参
        code:''
			},
			// 期望返回的数据格式，默认json，支持json，text，base64
			dataType: 'json',
			// 调用成功的回调函数
		  success: function (res) {
        console.info(res.data)
        if(res.data.code=='999999'){
          my.alert({
            content: res.data.message+'，请重新输入',
          });
        }
      },
      fail: function (res) {
        utils.showAlertModal('服务器异常', '请重新登录');
      }
    });
  },
  onItemInputCorporate(e){
    this.setData({
      corporate: e.detail.value
    });
  },
  onItemInputIdCard(e){
    this.setData({
      idCard: e.detail.value
    });
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
            content: '密码与确认密码不一致，请重新输入！',
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
            content: '密码与确认密码不一致，请重新输入！',
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
    this.setData({ login: object.mobile });
    const that = this;
    my.request({
			url: app.globalData.webServerUrl+'alipayRestController.do?method=yzmRegist',
			method: 'POST',
			data: {
        phone:object.mobile
			},
			// 期望返回的数据格式，默认json，支持json，text，base64
			dataType: 'json',
			// 调用成功的回调函数
		  success: function (res) {
        if(res.data.code=='999999'){
          my.showToast({
            type: 'success',
            title: '温馨提示',
            content: '手机号:' + object.mobile+ ' -> 验证码发送失败',
            duration: 2000,
            success: () => {
            }
          });
        }else if(res.data.code=='000000'){
          my.showToast({
            type: 'none',
            content: '验证码发送成功',
            duration: 1500,
            success: () => {
            }
          });
          that.setData({
            yzmId: res.data.yzmId
          })
        }
      },
      fail: function () {
        my.showToast({
          type: 'exception',
          content: '网络异常',
          duration: 3000,
          success: () => {
          },
        });
      }
    });
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
    if(this.data.nickName==''||this.data.license==''||this.data.corporate==''||this.data.idCard==''
    ||this.data.login==''||this.data.password==''||this.data.newPassword==''||this.data.yzmCode==''){
      my.alert({
        content: '注册信息不全，请您认真填写全部内容后提交注册信息，感谢您的配合！'
      });
    }else{
      my.request({
        url: app.globalData.webServerUrl+'alipayRestController.do?method=userRegist',//注册信息提交
        method: 'POST',
        data: {
          nickName:that.data.nickName,
          license:that.data.license,
          corporate:that.data.corporate,
          idCard:that.data.idCard,
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
                  //人脸识别
                  that.onFace(res.data.userCode); 
                  
            my.navigateTo({
              url: '../register-success/register-success'
            });
          }else if(res.data.code=='999999'){
            my.alert({
              content: res.data.message
            });
          }
        },
        fail: function () {
          utils.showAlertModal('服务器异常', '请重新登录');
        }
      });
    }
  },
  registerWord(){
    my.navigateTo({
      url:'../registerWord/registerWord'
    });
  },
  registerPrivacy(){
    my.navigateTo({
      url:'../registerPrivacy/registerPrivacy'
    });
  },
/**
 * 唤起认证流程
 * 参数: certifyId、url 需要通过支付宝 openapi 开放平台网关接口获取
 * 详细说明可查看文档下方的参数说明
 **/
  onFace(e) {
   console.info('e.usercode====='+e);
        my.request({
        url: app.globalData.webServerUrl+'alipayRestController.do?method=getAlipayUserIdFace',//注册信息提交
        method: 'POST',
        data: {
          userCode:e
        },
        // 期望返回的数据格式，默认json，支持json，text，base64
        dataType: 'json',
        // 调用成功的回调函数
        success: function (res) {
       
          console.info(res.data);
               cid = res.data.certifyId;
               curl = res.data.certifyUrl;
                 console.info("cid！=============="+cid);
                   console.info("curl=========="+curl);
     
      
           var curlrep = curl.replace('timYestamp=','timestamp=');
           console.info('转换后的字符串======'+curlrep);
             console.info('cid======'+cid);
   startAPVerify({ 
    certifyId: cid, url: curlrep}, function (verifyResult) {
    // 认证结果回调触发, 以下处理逻辑为示例代码，开发者可根据自身业务特性来自行处理
    //my.alert({ content: verifyResult.resultStatus });
    if (verifyResult.resultStatus === '9000') {
        // 验证成功，接入方在此处处理后续的业务逻辑
        
        //验证成功更新人脸验证接口   
           my.request({
        url: app.globalData.webServerUrl+'alipayRestController.do?method=saveFace',//注册信息提交
        method: 'POST',
        data: {
          userCode:e
        },
        // 期望返回的数据格式，默认json，支持json，text，base64
        dataType: 'json',
        // 调用成功的回调函数
        success: function (res) {
       
          console.info(res.data)
          if(res.data.code=='000000'){
        
            my.navigateTo({
              url: '../register-success/register-success'
            });
          }

        },
        fail: function () {
          utils.showAlertModal('服务器异常', '请稍后认证！');
        }
      });


        return;
    }


    // 用户主动取消认证
    if (verifyResult.resultStatus === '6001') {
        // 可做下 toast 弱提示
      //  my.alert({ content: '用户主动退出' });
        return;
    }

        
    const errorCode = verifyResult.result && verifyResult.result.errorCode;
       my.alert({ content: '失败！！' });
   
    });

        },
        fail: function () {
          utils.showAlertModal('服务器异常', '请重新登录');
        }
      });

  }

});