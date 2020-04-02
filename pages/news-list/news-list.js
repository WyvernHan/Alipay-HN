const app = getApp();
var WxParse= require('../../wxParse/wxParse.js');
Page({
  data: {
    background: ['blue', 'red', 'yellow'],
    indicatorDots: true,
    autoplay: false,
    vertical: false,
    interval: 1000,
    circular: false,
    tabs: [
      {
        title: '新闻资讯',
      },
      {
        title: '融资政策',
      },
      {
        title: '关于我们',
      }
    ],
    rzzc_page: 1, // 当前页数
    rzzc_list: [], // 页面List数据
    xwzx_page: 1, // 当前页数
    xwzx_list: [], // 页面List数据
    xwzx_totlnum:0,
    gywm_list: {}, // 页面List数据
    inputValue:"",
    totalnum:0,
    activeTab: 0,
  },
  onPullDownRefresh() {
    this.setData({
      rzzc_page: 1,
      xwzx_page: 1,
      rzzc_list: [], 
      xwzx_list: [], 
      gywm_list: {}, 
    });
    this.CpList();
    this.xwzxList();
    this.gywm_List();
  },
  onLoad() {
    this.xwzxList();
    this.CpList();
    this.gywm_List();
  },
  CpList() {
    const that=this;
    let list = this.data.rzzc_list;
		my.request({
			url: app.globalData.webServerUrl+'alipayRestController.do?method=policyList',//获取首页信息
			method: 'POST',
			data: {
        parammap:{
          page :that.data.rzzc_page,
          loanTerm:"",
          loanTermUnit:"",
          loanMoney:"",
          guaranteeType:"",
          rateSmall:"",
          rateBig:"",
          proNameOrOrgan:that.data.inputValue 
           }
			},
			// 期望返回的数据格式，默认json，支持json，text，base64
			dataType: 'json',
			// 调用成功的回调函数
		  success: function (res) {
        console.info(res);
        //给全局变量赋值，做为展示使用
       
      
        list = [...list,...res.data.policyList];
        that.setData({  
           rzzc_list:list,
           totalnum:res.data.totalnum
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

  /**
   * scroll-view滑到底部触发事件
   * @method scrollMytrip
   */
  async scrollMytrip() {
    try {
      const { rzzc_page, rzzc_list,totalnum } = this.data;
      // 判断是否还有数据需要加载
      if (rzzc_list.length < totalnum) {
        this.setData({ show: true });
        const newPage = rzzc_page + 1;
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
  async mySchedulde(rzzc_page = 1) {
    try {
      this.setData({ rzzc_page: rzzc_page });
      this.CpList();
      let list = this.data.rzzc_list;
      // 模拟请求拿到数据进行更新data
     
    } catch (e) {
      console.log('mySchedulde执行异常:', e);
    }
  },
  
  xwzxList() {
    const that=this;
    console.info("开始请求");
    let list = this.data.xwzx_list;
		my.request({
			url: app.globalData.webServerUrl+'alipayRestController.do?method=newsList',//获取首页信息
			method: 'POST',
			data: {
        parammap:{
          page :that.data.xwzx_page,
          loanTerm:"",
          loanTermUnit:"",
          loanMoney:"",
          guaranteeType:"",
          rateSmall:"",
          rateBig:""
           }
			},
			// 期望返回的数据格式，默认json，支持json，text，base64
			dataType: 'json',
			// 调用成功的回调函数
		  success: function (res) {
        console.info(res);
        console.info("xwzx请求页码："+that.data.xwzx_page);
        //给全局变量赋值，做为展示使用
        list = [...list,...res.data.newslist];
        that.setData({  
           xwzx_list:list,
           xwzx_totlnum:res.data.totalnum
        });
        console.info(list);
  
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

  /**
   * scroll-view滑到底部触发事件
   * @method scrollMytrip
   */
  async xwzx_scrollMytrip() {
    try {
      const { xwzx_page, xwzx_list,xwzx_totlnum } = this.data;
      // 判断是否还有数据需要加载
      console.info(xwzx_page);
      if (xwzx_list.length < xwzx_totlnum) {
        this.setData({ show: true });
        const newPage = xwzx_page + 1;
        this.xwzx_mySchedulde(newPage);
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
  async xwzx_mySchedulde(xwzx_page = 1) {
    try {
      console.info("滚动页码"+xwzx_page);
      this.setData({ xwzx_page: xwzx_page });
      this.xwzxList();

      // 模拟请求拿到数据进行更新data
     
    } catch (e) {
      console.log('mySchedulde执行异常:', e);
    }
  },

   gywm_List() {
    const that=this;
    console.info("开始请求");
    let list = this.data.xwzx_list;
		my.request({
			url: app.globalData.webServerUrl+'alipayRestController.do?method=aboutus',//获取首页信息
			method: 'POST',
			data: {
        parammap:{
          page :that.data.xwzx_page,
          loanTerm:"",
          loanTermUnit:"",
          loanMoney:"",
          guaranteeType:"",
          rateSmall:"",
          rateBig:""
        }
			}, 
			// 期望返回的数据格式，默认json，支持json，text，base64
			dataType: 'json',
			// 调用成功的回调函数
		  success: function (res) {
        console.info("gywm------------------");
        console.info(res);
        //给全局变量赋值，做为展示使用
        //that.data.list.push(res.data.plist);
        var article2 = res.data.InfoPolicyNew.content;     
        WxParse.wxParse('gywm', 'html', article2, that, 5);
        that.setData({  
           gywm_list:res.data.InfoPolicyNew,
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

  changeIndicatorDots(e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots,
    });
  },
  changeVertical() {
    this.setData({
      vertical: !this.data.vertical,
    });
  },
  changeCircular(e) {
    this.setData({
      circular: !this.data.circular,
    });
  },
  changeAutoplay(e) {
    this.setData({
      autoplay: !this.data.autoplay,
    });
  },
  intervalChange(e) {
    this.setData({
      interval: e.detail.value,
    });
  },
  handleTabClick({ index }) {
    this.setData({
      activeTab: index,
    });
  },
  handleTabChange({ index }) {
    this.setData({
      activeTab: index,
    });
  },
  handlePlusClick() {
    my.alert({
      content: 'plus clicked',
    });
  },
  rzzc_click(e){
     var cont=e.target.dataset.rz;
     //cont.content=cont.content.replace(/%/g, '%25');
     app.globalDatablobTempContent=cont;
     my.navigateTo({ 
      url: '../news-detail/news-detail'
    });

  }
});