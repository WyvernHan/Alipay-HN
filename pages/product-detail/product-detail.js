import faceVerify from '/utils/faceVerify';
const app = getApp();
Page({
  data: {
    isSq:0,
    applyCode:''
  },
  onReady(){
    
  },
  onLoad(query) {
    const that=this;
    
    that.data=app.globalData.piTempObj;
    that.data.applyCode="";
    
    that.checkAntResult();
  },
  gotoApply(){
    console.info(this.data);
    const that=this;
    var userCode  = app.globalData.userCode;
    var utype  = app.globalData.user.utype;

   if(userCode==''){
      my.reLaunch({ 
        url: '../login/login'
      });
    }else if(utype=='1'){
      my.alert({
        content: `金融机构不能发起融资申请！`,
      });
    }


    //友商机构流程
    if(that.data.etpsCode=="1"){

         my.navigateTo({ 
            url: '../news-detail/newWebDetail/newWebDetail'
        });

        // my.navigateToMiniProgram({
        //   appId: 'xxx',
        //   path: '',
        //   success: (res) => {
        //     console.log("小程序跳转成功");
        //   },
        //   fail: (res) => {
        //      my.alert({
        //       title: '小程序跳转失败！',
        //     });
        //     console.log("小程序跳转失败");
        //   }
        // });
        return;
    }
    //正常机构流程
   console.info(this.data.applyCode);
    this.data.ms="";
     my.navigateTo({ 
               url: '../apply/apply?applyCode='+this.data.applyCode
     });

    

  },
    //进行企业四要素和资料审核验证，成功返回申请编号
  checkAntResult() {
    console.log(this) // this 当前页面实例
    var userCode  = app.globalData.userCode;
    console.info("---------------------------");
    console.info(app);
    console.info(userCode);
    if(userCode==''){
      return;
    }
    console.info("userCode================="+userCode);
    const that=this;
		my.request({
			url: app.globalData.webServerUrl+'alipayRestController.do?method=checkAntResult',//获取首页信息
			method: 'POST',
			data: {
		    userCode:userCode,//传参
        piCode:''
			},
			// 期望返回的数据格式，默认json，支持json，text，base64
			dataType: 'json',
			// 调用成功的回调函数
		  success: function (res) {
        console.info("返回了");
        console.info(res);
        var antresult = res.data.antresult;//四要素验证状态
        var type = res.data.type;//审核资料验证状态
        let  applyCode = res.data.applyCode;
        that.setData({ 
            applyCode:applyCode
        });
        /*** 
        if(antresult==1&&type==1){
          that.setData({ 
            applyCode:applyCode
          });
          console.info("认证通过================="+applyCode);
        }else{
          that.setData({ 
            applyCode:'0'
          });
          console.info("认证失败！");
        }
        */
			},
      fail: function (res) {
        console.info("企业资料校验接口调用失败！");
        console.info(res);
      }
		});
	}
});
