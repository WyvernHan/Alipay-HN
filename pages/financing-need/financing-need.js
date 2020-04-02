import utils from '/utils/utils.js';
const app = getApp();
// mock列表总数
const mockTotal = 5;

Page({
  data: {
    show: true, // 是否显示加载动画
    page: 1, // 当前页数
    listProductApply:[], // 页面List数据
    totalnum:0,
    startCreated:'',
    endCreated:'',
    orgName:'',
    showTop:false
  },
  onTopBtnTap() {
    this.setData({
      showTop: true,
    });
  },
  onPopupClose() {
    this.setData({
      showTop: false,
    });
  },
  onPullDownRefresh() {
    this.setData({
      page:1,
      listProductApply: []
    });
    this.CpList();
  },
  onShow() {
      this.setData({
      listProductApply:[],
      totalnum:0
    });
    this.CpList();
  },
  onLoad() {
    this.CpList();
  },
  CpList() {
    const that=this;
    console.info("开始请求");
    let listProductApply = this.data.listProductApply;
		my.request({
			url: app.globalData.webServerUrl+'alipayRestController.do?method=projectApplyType',//获取首页信息
			method: 'POST',
			data: {
        page :that.data.page,
        userCode:app.globalData.userCode,
        startCreated:that.data.startCreated,
        endCreated:that.data.endCreated,
        orgName:that.data.orgName 
			},
			// 期望返回的数据格式，默认json，支持json，text，base64
			dataType: 'json',
			// 调用成功的回调函数
		  success: function (res) {
        //给全局变量赋值，做为展示使用
        //that.data.list.push(res.data.plist);
        listProductApply = [...listProductApply,...res.data.list];
        console.info("循环执行");
        that.setData({  
          listProductApply:listProductApply,
          totalnum:res.data.totalnum
        });
        console.info(res.data);
        console.info(res.data.totalnum);
			},
			// 调用失败的回调函数
			fail: function () {
				my.alert({ content: 'fail' });
			},
			// 调用结束的回调函数（调用成功、失败都会执行）
			complete: function () {
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
  
  datePickerStart() {
    my.datePicker({
      currentDate: utils.formatTime(new Date()),
      startDate: '1900-01-01',
      endDate: '2999-12-31',
      success: (res) => {
        this.setData({
          startCreated:res.date
        });
      },
    });
  },
  datePickerEnd() {
    my.datePicker({
      currentDate: utils.formatTime(new Date()),
      startDate: '1900-01-01',
      endDate: '2999-12-31',
      success: (res) => {
        this.setData({
          endCreated:res.date
        });
      },
    });
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
      this.CpList();
      let listProductApply = this.data.listProductApply;
      // 模拟请求拿到数据进行更新data
     
    } catch (e) {
      console.log('mySchedulde执行异常:', e);
    }
  },
  onSearch(value){
    console.info('========================:'+ value);
    this.setData({
      orgName: value,
      listProductApply:[],
      totalnum:0
    });
    this.CpList();
  },
  handleSearch(e){
    this.setData({
      orgName: e.detail.value,
      listProductApply:[],
      totalnum:0
    });
    this.CpList();
  },
  handleInput(value) {
    this.setData({
      orgName: value,
    });
  },
  handleClear() {
    this.setData({
      orgName: '',
      startCreated:'',
      endCreated:'',
    });
  },
  handleCancel() {
    this.setData({
      orgName: '',
      startCreated:'',
      endCreated:'',
    });
  },
  applyDetail(e){
     my.navigateTo({ 
      url: '../demand-detail/demand-detail?id='+e.target.dataset.applyid+'&userCode='+app.globalData.userCode
    });
  },
  onSubmit(){
    this.setData({
      showTop: false,
      page:1,
      listProductApply: []
    });
    this.CpList();
  },
  clearAll(){
    this.setData({
      //showTop: false,
      startCreated:'',
      endCreated:'',
      orgName:'',
    });
  }
});