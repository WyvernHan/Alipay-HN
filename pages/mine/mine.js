import faceVerify from '/utils/faceVerify';
import utils from '/utils/utils.js';
const app = getApp();

Page({
  data: {
    show: true, // 是否显示加载动画
    listEnterpriseCreditInfo:[],//授信列表
    listProductApply:[],//融资申请列表
    user:'',
    checkstatus:'',//企业资料和四要素认证0不通过1通过
    userenterpriseInfo:'',//企业账户信息
    productApply:'',//业务数据汇总
    page:1,
    totalnum:0,
    startCreated:'',
    endCreated:'',
    orgName:'',
    applyCode:''
  },
  onTabItemTap(item) {
    console.log(item.pagePath)
    if(item.pagePath=='pages/mine/mine'){
      this.onLoad();
    }
  },
  onPullDownRefresh() {
    if(this.data.user==''){
      my.reLaunch({url: '../login/login'});
    }else{
      this.setData({
        page:1,
        listProductApply: []
      });
      this.accPandectlist();
    }
  },
  onShow() {
    var userenterpriseInfo = app.globalData.userenterpriseInfo;
    var user = app.globalData.user;
    
    this.setData({
      userenterpriseInfo:userenterpriseInfo,
      user: user,
    });
    this.checkLogin(user);
  },
  onLoad() {
    var userenterpriseInfo = app.globalData.userenterpriseInfo;
    var user = app.globalData.user;
    
    this.setData({
      userenterpriseInfo:userenterpriseInfo,
      user: user,
    });
    this.checkLogin(user);
  },
  checkLogin(u){
    if(u==''){
     my.reLaunch({url: '../login/login'});
    }else{
      this.accPandectlist();
    }
  },
  titleMore() {
    my.showToast({
      content: app.globalData.userenterpriseInfo.loginName,
    });
  },
  getNoticeList(){
    //console.info(u)
    var user = this.data.user;
    if(user==''){
     my.reLaunch({url: '../login/login'});
    }else{
      my.navigateTo({
        url: '../notice/notice'
      });
    }
  },
  getEnterprise(){
    var user = this.data.user;
    if(user==''){
     my.reLaunch({url: '../login/login'});
    }else{
      my.navigateTo({
        url: '../enterprise-info/enterprise-info'
      });
    }
  },
  updatePassword(){
    var user = this.data.user;
    console.info(this.data.user)
    if(user==''){
        my.reLaunch({url: '../login/login'});
    }else{
      my.navigateTo({
        url: '../Original-password/Original-password'
      });
    }
  },
  accPandectlist(){
    const that=this;
		my.request({
			url: app.globalData.webServerUrl+'alipayRestController.do?method=accPandectlist',//获取我的信息
			method: 'POST',
			data: {
        userCode: app.globalData.userCode,//'63bee5b4784a4fde9aac5d549768e1ef'
			},
			// 期望返回的数据格式，默认json，支持json，text，base64
			dataType: 'json',
			// 调用成功的回调函数
		  success:function (res) {
        let listEnterpriseCreditInfo = res.data.listEnterpriseCreditInfo;
        let listProductApply = res.data.listProductApply;
        let checkstatus = res.data.checkstatus;
        let productApply = res.data.productApply;
        that.setData({
          listEnterpriseCreditInfo: listEnterpriseCreditInfo,
          listProductApply: listProductApply,
          checkstatus: checkstatus,
          productApply: productApply,
        });
			},
			// 调用失败的回调函数
			fail: function (res) {
				my.alert({ content: 'fail' });
			},
			// 调用结束的回调函数（调用成功、失败都会执行）
			complete: function (res) {
				my.hideLoading();
				/*my.alert({ content: 'complete' });*/
			}
		});
    my.stopPullDownRefresh({
      complete(res) {
        console.log(res, new Date())
      }
    });
  },
  applyDetail(e){
    var user = this.data.user;
    if(user==''){
        my.reLaunch({url: '../login/login'});
    }else{
      my.navigateTo({
        url: '../demand-detail/demand-detail?id='+e.target.dataset.applyid+'&userCode='+app.globalData.userCode
      });
    }
  },
  /**
   * scroll-view滑到底部触发事件
   * @method scrollMytrip
   */
  async scrollMytrip() {
    try {
      const { page, listProductApply,totalnum } = this.data;
      // 判断是否还有数据需要加载
      if (listProductApply.length < totalnum) {
        this.setData({ show: true });
        const newPage = page + 1;
        this.mySchedulde(newPage);
      }
    } catch (e) {
      this.setData({ show: false });
      console.log('scrollMytrip执行异常:', e);
    }
  },
  /**
   * 模拟请求服务端查询数据并渲染页面
   * @method mySchedulde
   * @param {int} page 分页,默认第1页
   */
  async mySchedulde(page = 1) {
    try {
      this.setData({ page: page });
      this.getMore();
      let listProductApply = this.data.listProductApply;
      // 模拟请求拿到数据进行更新data
     
    } catch (e) {
      console.log('mySchedulde执行异常:', e);
    }
  },
  getMore(){
    const that=this;
    let listProductApply = this.data.listProductApply;
    my.request({
			url: app.globalData.webServerUrl+'alipayRestController.do?method=projectApplyType',//获取融资需求管理列表
			method: 'POST',
			data: {
        page :that.data.page,
        userCode:app.globalData.userCode,//'63bee5b4784a4fde9aac5d549768e1ef',
        startCreated:that.data.startCreated,
        endCreated:that.data.endCreated,
        orgName:that.data.orgName
			},
			// 期望返回的数据格式，默认json，支持json，text，base64
			dataType: 'json',
			// 调用成功的回调函数
		  success: function (res) {
        console.info(res.data)
        //给全局变量赋值，做为展示使用
        // that.data.list.push(res.data.plist);
        listProductApply = [...listProductApply,...res.data.list];

        that.setData({  
           listProductApply:listProductApply,
           totalnum:res.data.totalnum
        });
			},
			// 调用失败的回调函数
			fail: function (res) {
				my.alert({ content: '融资需求管理列表获取失败！' });
			},
			// 调用结束的回调函数（调用成功、失败都会执行）
			complete: function (res) {
				my.hideLoading();
			}
		});
  },
  getProductApply(){
    var userCode  = app.globalData.userCode;
    if(userCode==''){
      my.reLaunch({
        url:'../login/login'
      });
    }else{
      my.navigateTo({
        url:'../financing-need/financing-need'
      });
    }
  },
  toUPassword(){
    var userCode  = app.globalData.userCode;
    if(userCode==''){
      my.reLaunch({
        url:'../login/login'
      });
    }else{
      my.navigateTo({
        url:'../Original-password/Original-password'
      });
    }
  },
  toxqsq(){
    var userCode  = app.globalData.userCode;
    if(userCode==''){
      my.reLaunch({
        url:'../login/login'
      });
    }else{
      my.navigateTo({
        url:'../financing/financing-list'
      });
    }
  },
  toxqfb(){

  const that=this;
	
  var userCode  = app.globalData.userCode;
    console.info("userCode================="+userCode);
    if(userCode==''){
      my.reLaunch({
        url:'../login/login'
      });
    }else{
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
         let  applyCode = res.data.applyCode;
         that.setData({ 
            applyCode:applyCode
          });
            faceVerify.getVerify(
				       function (fcelVerifyCall){
					console.info("进入了成功回调");
					console.info(fcelVerifyCall);
					console.info("核验成功跳转页面");
					my.navigateTo({ 
								url: '../index/loanServe/loanServe?applyCode='+that.data.applyCode
					});
				  },
				  function (fcelVerifyCall){
					 console.info("进入了失败回调");
					   my.showToast({
						type: 'fail',
						content: '即将进入人脸识别',
						duration: 1000,
						success: () => {
						  faceVerify.onFace(function (){
							  console.info("人脸识别成功跳转页面");
							  my.navigateTo({ 
								url: '../index/loanServe/loanServe?applyCode='+that.data.applyCode
							  });
						  });
						},
					  });
				  }
				);
		  
	
        },
        fail: function (res) {
          console.info("企业资料校验接口调用失败！");
        }
      });
    }	
	
	
   

    
  }
});