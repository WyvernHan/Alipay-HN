const app = getApp();

// mock列表总数
const mockTotal = 5;
Page({
  data: {
    show: true, // 是否显示加载动画
    page: 1, // 当前页数
    list: [], // 页面List数据
    inputValue:"",
    totalnum:0
  },
  onPullDownRefresh() {
    this.setData({
      page:1,
      list:[]
      });
    this.CpList();
    
  },
  onLoad() {
    this.CpList();
    //this.mySchedulde();
  },
  CpList() {
    const that=this;
    console.info("开始请求");
  
    let list = this.data.list;
        var inputstr = that.data.inputValue.trim();
		my.request({
			url: app.globalData.webServerUrl+'alipayRestController.do?method=searchOrganList',//获取首页信息
			method: 'POST',
			data: {
        parammap:{
          page :that.data.page,
          orgName:inputstr
          }
			},
			// 期望返回的数据格式，默认json，支持json，text，base64
			dataType: 'json',
			// 调用成功的回调函数
		  success: function (res) {
         console.info("页码"+that.data.page);
         console.info(res.data.totalnum);
        //给全局变量赋值，做为展示使用
       // that.data.list.push(res.data.plist);
        list = [...list,...res.data.resultList];
        that.setData({
           list:list,
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
      const { page, list,totalnum } = this.data;
      // 判断是否还有数据需要加载
      if (list.length < totalnum) {
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
      this.CpList();
      // 模拟请求拿到数据进行更新data
     
    } catch (e) {
      console.log('mySchedulde执行异常:', e);
    }
  },
  handleSearch(e){
     this.setData({
      inputValue: e.detail.value,
      list:[],
      totalnum:0,
      page:1
    });

    this.CpList();
  }
  ,
  gotoDetail(e){
     my.navigateTo({ 
      url: 'OrganDetail/OrganDetail?lt='+JSON.stringify(e.target.dataset.hi)+'&hi2='+e.target.dataset.hi2
    });
  },
   handleCallBack(data) {
    my.alert({
      content: data
    });
  },
  toggleFilter() {
    this.setData({
      filterShow: !this.data.filterShow,
    });
  }
});
