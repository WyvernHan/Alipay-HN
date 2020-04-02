import faceVerify from '/utils/faceVerify';
const dates = ['年', '月', '日'];
const app = getApp();
Page({
  data: {
    //弹出对话框
    modalOpenedIndex: false,
    //banner图片信息后台查询
    banner:[],
    //担保方式信息后台查询
    guaranteeType:[],
    //担保方式单位
    loanTermUnit:[],
    //贷款期限,后台获取
    loanTerm:[],
    //贷款产品信息，后台获取
    productList:[],
    //注册企业数
    companynums:'',
    //融资需求项
    xqnums:'',
    //需求解决项
    complateNums:'',
    //守信总金额
    sxSumMoney:'',
    //融资申请动态
    fiancingDTList:[],
    //授信动态
    fiancingsxdt:[],
    organlist:[],
    quota:'',
    termValue:'',
    termUnit:'',
    bannerList:[],
    indicatorDots: true,//指示点
    autoplay: true,//自动切换
    vertical: false,//纵向滑动
    interval: 2000,//自动切换时间间隔(ms)
    circular: true,//无限滑动
    duration: 1500,//滑动动画时长(ms)
    guaranteeType: [],
    inputFocus: true,
    bank: '',
    showRectangle: true,
    img_title: "风采",
    imgarr: ['../../image/card.png', '../../image/logo.png', '../../image/logo.png'],
    list3: [
      {
        icon: '../../image/card.png',
        text: '担保方式：信用',
        desc: '贷款期限≤6个月',
      },
      {
        icon: '../../image/card.png',
        text: '担保方式：信用',
        desc: '贷款期限≤6个月',
      },
      {
        icon: '../../image/card.png',
        text: '担保方式：信用',
        desc: '贷款期限≤6个月',
      },
    ],
    applyCode:''
  },
  onTabItemTap(item) {
    console.log(item.pagePath)
    if(item.pagePath=='pages/index/index'){
      console.info('测试首页是否刷新');
      this.onLoad();
    }
  },
  //MONEYinput 输入框赋值
  moneyValue: function (e) {
    console.info(e.detail.value);
    this.setData({
      quota: e.detail.value
    });
  },
  //MONEYinput 输入框赋值
  termValue: function (e) {
    console.info(e.detail.value);
    this.setData({
      termValue: e.detail.value
    });
  },
  /*onCloseTap() {
    this.setData({
      showRectangle: false,
    });
  },
  onRectangleTap() {
    my.alert({
      content: '您已成功添加到首页！',
    });
  },*/
  onSubmit(e) {
    const that=this;
    var userCode = app.globalData.userCode;
    var utype = app.globalData.user.utype;

    if(userCode==''){
      my.reLaunch({ 
        url: '../login/login'
      });
    }else if(utype=='1'){
      my.alert({
        content: `金融机构不能发起融资申请！`,
      });
    }else{
      var guaranteeType =JSON.stringify(that.data.guaranteeType);
      //认证核验
      faceVerify.getVerify(
        function (fcelVerifyCall){
          console.info("进入了成功回调");
          console.info(fcelVerifyCall);
          console.info("核验成功跳转页面");
          console.info(that.data.guaranteeType);
            my.navigateTo({ 
              url: 'loanServe/loanServe?loanMoney='+e.detail.value.quota+'&loanTermValue='+e.detail.value.termValue+'&loanTermUnit='+e.detail.value.termUnit+'&guaranteeType='+guaranteeType+'&applyCode='+that.data.applyCode,
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
                    url: 'loanServe/loanServe?loanMoney='+e.detail.value.quota+'&loanTermValue='+e.detail.value.termValue+'&loanTermUnit='+e.detail.value.termUnit+'&guaranteeType='+guaranteeType+'&applyCode='+that.data.applyCode,
                  });
              });
            },
          });
        }
      );
    }
  },
  onPullDownRefresh() {
    this.allList();
  },
  onLoad() {
    my.showTabBar({
      animation: true
    });
    // 页面加载
    const that = this;
    //获取首页数据
     that.allList();
    
    app.getIsExist().then(
      result => { }
    );
    if(app.globalData.user==''){

    }else{
      faceVerify.getVerify(
        function (fcelVerifyCall){
          console.info("进入了成功回调");
        },
        function (fcelVerifyCall){
          console.info("进入了失败回调");
          /* 带图弹窗 */
          that.setData({
            modalOpenedIndex: true,
          });
        }
      );
    }
    /*my.getStorage({//取缓存
      key: 'IsExist',
      success: function(res) {
        my.alert({content: '获取成功：' + res.data.value});
      },
      fail: function(res){
        my.alert({content: res.errorMessage});
      }
    });*/
  },
  onModalClickIndex() {
    this.setData({
      modalOpenedIndex: false,
    });
  },
  onModalCloseIndex() {
    this.setData({
      modalOpenedIndex: false,
    });
  },
  goToPerfect(){
    var user = app.globalData.user;
    if(user==''){
      my.reLaunch({url: '../login/login'});
    }else{
      my.navigateTo({
        url: '../enterprise-info/enterprise-info'
      });
    }
  },
  //获取首页数据方法
  allList() {
    const that=this;
		my.request({
			url: app.globalData.webServerUrl+'alipayRestController.do?method=getIndex',//获取首页信息
			method: 'POST',
			data: {
		   code:123,//传参
			},
			// 期望返回的数据格式，默认json，支持json，text，base64
			dataType: 'json',
			// 调用成功的回调函数
		  success: function (res) {
        let bannerList = res.data.data.bannerList;//banner图
        let productList = res.data.data.productList;//产品推荐列表
        let companynums = res.data.data.companynums;//注册企业
        let xqnums = res.data.data.xqnums;//融资需求项
        let complateNums = res.data.data.complateNums;//需求解决项
        let sxSumMoney = res.data.data.sxSumMoney;//授信总金额
        let fiancingDTList = res.data.data.fiancingDTList;//融资申请动态
        let fiancingsxdt = res.data.data.fiancingsxdt;//授信动态
        let guaranteeType = res.data.data.guaranteeType;//担保方式
        let organlist = res.data.data.organlist;//热门推荐
        app.globalData.guaranteeType = guaranteeType//担保方式数据字典存储到全局变量里

        //控制台查看返回信息
        /*console.info(productList);
        console.info(companynums);
        console.info(xqnums);
        console.info(complateNums);
        console.info(sxSumMoney);
        console.info(fiancingDTList);
        console.info(fiancingsxdt);
        console.info(1111);
        console.info(res.data.data.guaranteeType);//授信动态gsxdt;*/
        //给全局变量赋值，做为展示使用
        that.setData({
          loanProduct:productList,
          banner:[],
          //担保方式信息后台查询
          guaranteeType:guaranteeType,
          //贷款期限,后台获取
          loanTerm:[],
          //贷款产品信息，后台获取
          productList:productList,
          //融资动态信息
          fiancingDTList:fiancingDTList,
          //注册企业数
          companynums:companynums,
          //融资需求项
          xqnums:xqnums,
          //需求解决项
          complateNums:complateNums,
          //守信总金额
          sxSumMoney: sxSumMoney,
          //融资申请动态
          fiancingDTList:fiancingDTList,
          //授信动态
          fiancingsxdt:fiancingsxdt,
          //热门推荐
          organlist:organlist,
          //banner图
          bannerList:bannerList
        });
			},
			// 调用失败的回调函数
			fail: function (res) {
				my.alert({ content: '首页获取失败' });
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
  /*imgYu(event){//图片点击事件
    var index = event.currentTarget.dataset.index;//获取data-index
    var imgList = event.currentTarget.dataset.list;//获取data-list
    //图片预览
    my.previewImage({
      current: index, // 当前显示图片的下标
      urls: imgList // 需要预览的图片http链接列表
    })
  },*/
  onItemClick(ev) {
    my.alert({
      content: ev.detail.index,
    });
  },
  //智能匹配查询
  queryLoanInfo(event){
    //查询条件 
    //loanMoney:贷款金额、loanTerm：贷款期限、loanTermUnit:贷款期限单位
    //guaranteeType:担保方式

    console.info(this.data.quota);
    console.info(event)
    let guaranteeType=this.data.guaranteeType;
    let loanMoney = this.data.quota;
    let loanTerm = this.data.termValue;
    my.navigateTo({ 
      url: 'loanServe/loanServe?loanMoney='+loanMoney+'&loanTerm='+loanTerm+'&guaranteeType='+guaranteeType,
    });
    
  },
  //产品详细查询
  queryLoanDetail(productId){
    //跳转页面
    my.navigateTo({ 
      url: 'prductDetail/prductDetail?productId'+productId,
    });
    
  },
  //onchangce获取选择多选框信息并赋值
  getGuaranteeType(e){
    console.info("111222");
    console.info(e);
    console.info(e.detail);
    console.info(e.detail.value);
    console.info(e.target.dataset.itemKey)
    if(e.detail.value==true){//如果选中
        var key=e.target.dataset.itemKey;
        var setkey='guaranteeType['+key+'].checked';
        //赋值给checked属性 
        this.setData({
          [setkey]:true
        })
    }else{
        var key=e.target.dataset.itemKey;
        var setkey='guaranteeType['+key+'].checked';
        //赋值给checked属性 
        this.setData({
          [setkey]:''
        })
    }
    //console.info(this.data.items);
   // console.info(this.getArrayValueBykey('items','name','1','value'))
  },
  getArrayValueBykey(arrayName,keyName,keyValue,valueName){//根据数组名、指定KEY 和VALUE值 获取另外一个KEY的VALUE值
    const that = this;
    if(arrayName ==''||keyName ==''||valueName == ''){
        return 'arrayName is null';
    }
    //console.info(arrayName) ;
     //console.info(that.data[arrayName]);
     //console.info(that.data[arrayName].dataType)
     for( let i in that.data[arrayName]){
        let a = that.data[arrayName][i];
        console.info(a);
        console.info(a[keyName]);
        if(a[keyName] == keyValue){
            return a[valueName];
        }
     }
    
     // if(this.arrayName.)
  },
  onReady() {
    // 页面加载完成
  },
  onShow() {
    // 页面显示
  },
  onHide() {
    // 页面隐藏
  },
  onUnload() {
    // 页面被关闭
  },
  onTitleClick() {
    // 标题被点击
    const app = getApp();
    console.log(app.checkAuth());
    
  },
  onReachBottom() {
    // 页面被拉到底部
  },
  /*onShareAppMessage() {
    // 返回自定义分享信息
    return {
      title: 'My App',
      desc: 'My App description',
      path: 'pages/index/index',
    };
  },*/
  intervalChange(e) {
    this.setData({
      interval: e.detail.value,
    });
  },
  durationChange(e) {
    this.setData({
      duration: e.detail.value,
    });
  },
  onAutoFocus() {
    this.setData({
      inputFocus: true,
    });
  },
  onItemInput(e) {
    this.setData({
      [e.target.dataset.field]: e.detail.value,
    });
  },
  onItemFocus() {
    this.setData({
      inputFocus: false,
    });
  },
  onItemBlur() {},
  onItemConfirm() {},
  onClear(e) {
    this.setData({
      [e.target.dataset.field]: '',
    });
  },
  onPickerTap() {
    my.showActionSheet({
      title: '选择贷款期限',
      items: dates,
      success: (res) => {
        this.setData({
          termUnit: dates[res.index],
        });
      },
    });
  },
  //金融机构详情
  organDetail(e){
    my.navigateTo({ 
      url: '../organ-list/OrganDetail/OrganDetail?lt='+JSON.stringify(e.target.dataset.hi)
    });
  },
  //融资申请详情
  productDetail(e){
    console.info("---------------------首页产品");
    console.info(e.target.dataset.hi);
    if(app.globalData.user==''){
      my.reLaunch({url: '../login/login'});
    }else{
      //认证核验
      var teObj=e.target.dataset.hi;
      teObj.isSq=1;
      app.globalData.piTempObj=teObj;
      faceVerify.getVerify(
        function (fcelVerifyCall){
          console.info("进入了成功回调");
          console.info(fcelVerifyCall);
          console.info("核验成功跳转页面");
        
          my.navigateTo({ 
            url: '../product-detail/product-detail'
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
                    url: '../product-detail/product-detail'
                  });
                });
              },
            });
        }
      );
    }
  },
  
});