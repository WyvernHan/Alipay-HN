const app = getApp();
// mock列表总数
const mockTotal = 5;

Page({
  data: {
    thumb: 'https://gw.alipayobjects.com/zos/rmsportal/VBqNBOiGYkCjqocXjdUj.png',
    footerImg: 'https://gw.alipayobjects.com/zos/rmsportal/VBqNBOiGYkCjqocXjdUj.png',
    show: true, // 是否显示加载动画
    page: 1, // 当前页数
    list: [], // 页面List数据
    totalnum:0,
  },
  onCardClick: function(ev) {
    my.showToast({
      content: ev.info,
    });
  },
  onLoad() {
    this.mySchedulde();
  },
  CpList() {
    const that=this;
    console.info("开始请求");
    let list = this.data.list;
		my.request({
			url: app.globalData.webServerUrl+'alipayRestController.do?method=querySysMessageList',//获取首页信息
			method: 'POST',
			data: {
        page: that.data.page,
        userCode: app.globalData.userCode
			},
			// 期望返回的数据格式，默认json，支持json，text，base64
			dataType: 'json',
			// 调用成功的回调函数
		  success: function (res) {
        //给全局变量赋值，做为展示使用
        // that.data.list.push(res.data.plist);
        list = [...list,...res.data.list];

        that.setData({  
          list:list,
          totalnum:res.data.totalnum
        });
        
        console.info(res.data);
        console.info(res.data.totalnum);
			},
			// 调用失败的回调函数
			fail: function (res) {
				my.alert({ content: '获取消息列表失败' });
			},
			// 调用结束的回调函数（调用成功、失败都会执行）
			complete: function (res) {
				my.hideLoading();
				/*my.alert({ content: 'complete' });*/
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
      let list = this.data.list;
      // 模拟请求拿到数据进行更新data
    } catch (e) {
      console.log('mySchedulde执行异常:', e);
    }
  },
});