App({
  checkAuth(){
    console.log(this.globalData.IsExist)
     if(this.globalData.IsExist==3)
     return false;
  },
  onLaunch(options) {
    //人脸识别认证
  //  my.startZMVerify({
 //     bizNo: 'your-biz-no',
//      success: (res) => {
 //       my.alert({ title: 'success:' + JSON.stringify(res)});
 //     },
 //     fail: (res) => {
 //       my.alert({ title: 'fail: ' + JSON.stringify(res)});
  //    },
//    });
    // 第一次打开
    // options.query == {number:1}
    //在启动程序前，我们需要进行初始化验证，将信息保存到全局变量中

//把缓存里取出的用户登录信息放到全局变量里
var that = this;
// my.getStorage({
//   key: 'sysLoginUser',
//   success: function(res) {
//       console.info('res.data.userCode====='+res.data.userCode);
//       console.info('res.data.user====='+res.data.user);
//       that.globalData.userCode = res.data.userCode;
//       that.globalData.user = res.data.user;
//   },
//   fail: function(res){
//     my.alert({content: res.errorMessage});
//   }
// });
// my.removeStorage({
//   key: 'currentCity',
//   success: function(){
//     my.alert({content: '删除成功'});
//   }
// });


    console.info('初始化验证授权');
    console.log('getSystemInfoSync', my.getAuthCode({
      scopes: 'auth_base',
      success: ({ authCode }) => {
        //console.log(authCode)
        my.request({
          url: this.globalData.webServerUrl+'alipayRestController.do?method=getAlipayUserId&code='+authCode,
           //url: 'http://www.wfios.com:9099/ycjf/alipayRestController.do?method=getAlipayUserIdFace&code='+authCode,
          method: '',
          dataType: 'json',
          data: {
            auth_code: authCode,
          },
          success: (res) => {
            that.globalData.verifyCode = res.data.data;//支付宝userId，用于验证码刷新
            console.info(that.globalData.verifyCode)
              /*this.globalData.accessToken = res.data.data.accessToken,
              this.globalData.IsExist = res.data.data.IsExist,
              this.globalData.userName = res.data.data.userName,
              this.globalData.alipayUserId = res.data.data.alipayUserId
              console.log(this.globalData.IsExist)*/
            /*my.alert({
              //title: "证件号码",
             // content: this.globalData.alipayUserId
            })*/
          },
          fail: (err) => {
            /*my.alert({
              title: "错误信息",
              content: JSON.stringify(err)
            })*/
          }
        });
      },
    }));
  },
  setIsExist(value){
    this.globalData.IsExist=value;
  },
  getIsExist(){   
    return new Promise((resovle,reject)=>{
      resovle(this.globalData.IsExist);
    });
  },
  //全局变量，用于存储用户信息和TOKEN信息：const app = getApp(), 通过app.globalData.token（获取信息方式）
  globalData:{
    accessToken:'',
    IsExist:'',//默认不存在
    UserName:'',
    alipayUserId:'',
    IsFourAuth:'',
    user:'',
    userCode:'',
    guaranteeType:[],
    userenterpriseInfo:'',
    verifyCode:'',
    blobTempContent:'',
    blobTempContentTwo:'',
    webServerUrl:'https://www.krdp2p.com:9096/hnpt/',//https网关地址
    //webServerUrl:'http://www.wfios.com:9299/hnpt/',//开发网关地址
    //webServerUrl:'http://www.wfios.com:9122/ycjf/'//开发网关地址
    //webServerUrl:'http://www.wfios.com:9083/hnpt/'//测试网关地址
    //webServerUrl:'https://hnftpfinance.com/',
    piTempObj:{},
   
  
   },
  onShow(options) {
    // 从后台被 scheme 重新打开
    // options.query == {number:1}
  },
});
 