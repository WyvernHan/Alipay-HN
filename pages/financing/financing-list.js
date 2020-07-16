
import faceVerify from '/utils/faceVerify';
const app = getApp();
// mock列表总数
const mockTotal = 5;
Page({
  data: {
    show: true, // 是否显示加载动画
    list: [], // 页面List数据

    inputValue:"",//输入框值
    rateSmall:"",//输入框值
    rateBig:"",//输入框值
    guaranteeType:"",
    loanMoney:"",
    loanTerm:"",
    page: 1, // 当前页数

    totalnum:0,
    filterShow:false,
    dkqx_items: [
    ],
    dked_items:[
    ],
    dbfs_items:[
    ], 
    selectChild:[]
  },
  onPullDownRefresh() {
     this.setData({
      page:1,
      list: []
    });
    this.CpList();
  },
  onLoad() {
    this.getFilter();
    
    this.CpList();
  },

  getFilter(){
      const that=this;
      my.request({
			url: app.globalData.webServerUrl+'alipayRestController.do?method=getMoreFiancingQueryDic',
			method: 'POST',
			data: {
			},
			dataType: 'json',
		  success: function (res) {
        that.setData({  
           dkqx_items: res.data.parammap.loanTerm,
           dked_items: res.data.parammap.loanMoney,
           dbfs_items:res.data.parammap.guaranteeType, 
        });
        that.selectDisplay();
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
  }
  ,
  CpList() {
    const that=this;
    let list = this.data.list;
    console.info("页码"+that.data.page);
    var inputstr = that.data.inputValue.trim();
		my.request({
			url: app.globalData.webServerUrl+'alipayRestController.do?method=getMoreFiancing',//获取首页信息
			method: 'POST',
			data: {
        parammap:{
              // page :that.data.page,
              rateSmall:that.data.rateSmall,//输入框值
              rateBig:that.data.rateBig,//输入框值
              guaranteeType:that.data.guaranteeType,
              loanMoney:that.data.loanMoney,
              loanTerm:that.data.loanTerm,
              page: 1, // 当前页数
              proNameOrOrgan:inputstr 
           }
			},
			// 期望返回的数据格式，默认json，支持json，text，base64
			dataType: 'json',
			// 调用成功的回调函数
		  success: function (res) {
        //给全局变量赋值，做为展示使用

       list = [...list,...res.data.plist];

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
      let list = this.data.list;
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
  },
  gotoDetailQuery(e){
     var teObj=e.target.dataset.hi;
     teObj.isSq=0;
     app.globalData.piTempObj=teObj;
     my.navigateTo({ 
      url: '../product-detail/product-detail'
    });
  },
  gotoDetail(e){
    if(app.globalData.user==''){
      my.reLaunch({url: '../login/login'});
    }else{
       var teObj=e.target.dataset.hi;
       teObj.isSq=1;
       app.globalData.piTempObj=teObj;
      //认证核验
      faceVerify.getVerify(
        function (fcelVerifyCall){
          console.info("进入了成功回调");
          console.info(fcelVerifyCall);
          console.info("核验成功跳转页面");
        
          my.navigateTo({ 
            url: '../product-detail/product-detail'
            //url: '../product-detail/product-detail?hi2='+e.target.dataset.hi2
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
                          //url: '../product-detail/product-detail?'+'&hi2='+e.target.dataset.hi2
                    });
                });
              },
            });
        }
      );
    }
  },
   handleCallBack(data) {
    my.alert({
      content: data
    });
  },
  handleCallBackOne(data){
    var dkqx_items=this.data.dkqx_items;
    for(var ii in dkqx_items){
        var i=dkqx_items[ii];
        if(i.id==data.target.dataset.id){
            i.selected=true;
        }else{
            i.selected=false;
        }
    }
    this.setData({
        dkqx_items:dkqx_items,
        loanTerm:data.target.dataset.id
    });
    this.setData({
      page:1,
      list: []
    });
    this.selectDisplay();
    this.CpList();
  },
  handleCallBackTwo(data){
      var dkqx_items=this.data.dked_items;

    for(var ii in dkqx_items){
        var i=dkqx_items[ii];
        if(i.id==data.target.dataset.id){
            i.selected=true;
        }else{
            i.selected=false;
        }
    }

    this.setData({
        dked_items:dkqx_items,
        loanMoney:data.target.dataset.id,
        
    });
    this.setData({
      page:1,
      list: []
    });
    this.selectDisplay();
    this.CpList();
  },
  handleCallBackThree(data){
     var dkqx_items=this.data.dbfs_items;

    for(var ii in dkqx_items){
        var i=dkqx_items[ii];
        if(i.id==data.target.dataset.id){
            i.selected=true;
        }else{
            i.selected=false;
        }
    }

    this.setData({
        dbfs_items:dkqx_items,
        guaranteeType:data.target.dataset.id
    });
    this.setData({
      page:1,
      list: []
    });
    this.selectDisplay();
    this.CpList();
  },
  delSelect(e){
    const that=this;
    var type=e.target.dataset.t;
    var selectChild=that.data.selectChild;
    for(var i in selectChild){
        var to=selectChild[i];
        if(to.type==type){
            selectChild.splice(i,1);
        }
    }
    if(type==1){
      for(var i in that.data.dkqx_items){
          that.data.dkqx_items[i].selected=false;
      }
      that.setData({
        dkqx_items:that.data.dkqx_items,
        selectChild:selectChild,
        page:1,
        list: [],
        loanTerm:""
      });
       
    }else if(type==2){
      for(var i in that.data.dked_items){
          that.data.dked_items[i].selected=false;
      }
      that.setData({
        dked_items:that.data.dked_items,
        selectChild:selectChild,
        page:1,
        list: [],
        loanMoney:""
      });
    }else if(type==3){
      for(var i in that.data.dbfs_items){
          that.data.dbfs_items[i].selected=false;
      }
      that.setData({
        dbfs_items:that.data.dbfs_items,
        selectChild:selectChild,
        page:1,
        list: [],
        guaranteeType:""
      });
    }else if(type==4){
       that.setData({
        selectChild:selectChild,
        page:1,
        list: [],
        rateSmall:"",//输入框值
        rateBig:"",//输入框值
      });
    }
    that.CpList();
  },
  selectDisplay(){
    const that=this;
    var temChild=that.data.selectChild;
    temChild=[];
    for(var i in that.data.dkqx_items){
        var teobj=that.data.dkqx_items[i];
        if(teobj.selected){
          temChild.push({type:1,title:"融资期限："+teobj.value});
        }
    }
    for(var i in that.data.dked_items){
       var teobj=that.data.dked_items[i];
        if(teobj.selected){
            temChild.push({type:2,title:"融资额度："+teobj.value});
        }
    }
    for(var i in that.data.dbfs_items){
       var teobj=that.data.dbfs_items[i];
        if(teobj.selected){
          temChild.push({type:3,title:"担保方式："+teobj.value});
        }
    }
 
    var title="利率范围:"
    var min="0";
    var max="N";
    if(isNaN(that.data.rateSmall)==false&&that.data.rateSmall.trim().length>0){
       min=that.data.rateSmall;
    }
    if(isNaN(that.data.rateBig)==false&&that.data.rateBig.trim().length>0){
       max=that.data.rateBig;
    }
    if(min=="0"&&max=="N"){
      
    }else{
        temChild.push({type:4,title:"利率范围："+min+"--"+max});
    }
    
    
    that.setData({
      selectChild:temChild
    });
  },
  mininput(e){
    const that=this;
    if(isNaN(e.detail.value)){
        this.setData({
          rateSmall: "",
       });
       my.showToast({
              type: 'fail',
              content: '请输入合法数字',
              duration: 3000,
              success: () => {
               
              },
       });
    }else{
      if(that.data.rateBig.trim().length>0&&e.detail.value.trim().length>0){
          if(parseFloat(that.data.rateBig.trim())<parseFloat(e.detail.value.trim())){
               my.showToast({
                  type: 'fail',
                  content: '最大值不能小于最小值',
                  duration: 3000,
                  success: () => {
                  
                  },
               });
             this.setData({
              rateSmall: e.detail.value,
            });
            return;
          }
       }
      this.setData({
        rateSmall: e.detail.value,
        list:[],
        totalnum:0,
        page:1
      });
      this.CpList();
      
    }
    this.selectDisplay();
   
  },
  maxinput(e){
    const that=this;
    if(isNaN(e.detail.value)){
        this.setData({
          rateBig: "",
       });
       my.showToast({
              type: 'fail',
              content: '请输入合法数字',
              duration: 3000,
              success: () => {
               
              },
      });
    }else{
       if(e.detail.value.trim().length>0&&that.data.rateSmall.trim().length>0){
         console.info("min:"+e.detail.value.trim()+"max"+that.data.rateSmall.trim());
          if(parseFloat(e.detail.value.trim())<parseFloat(that.data.rateSmall.trim())){
               my.showToast({
                  type: 'fail',
                  content: '最大值不能小于最小值',
                  duration: 3000,
                  success: () => {
                  
                  },
               });
              this.setData({
                  rateBig: e.detail.value
              });
            return;
          }
       }
       this.setData({
        rateBig: e.detail.value,
        list:[],
        totalnum:0,
        page:1
      });
      this.selectDisplay();
      this.CpList();
    }
  },
  toggleFilter() {
    this.setData({
      filterShow: !this.data.filterShow,
    });
  },
  onPopupClose() {
    this.setData({
      filterShow: false,
    });
  },
});
