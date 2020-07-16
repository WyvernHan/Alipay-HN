// API-DEMO page/component/input-item/input-item.js
const app = getApp();
const banks = ['抵押', '贷款', '信用', '其他'];
const dates = ['年', '月', '日'];
var imgfilepath = [];
var jiekouimglist = [];
Page({
  data: {
    cardNo: '1234****',
    inputFocus: true,
    bank: '',
    name: '',
    checkFormStatus:'',
    termUnit:'',
    loanTermUnit:'',
    userImageList:[],
    fname:'',
    flist:[],
    imgurllist:[],
    applyCode:'',
    fileObjList:[],
  },
  onReady(){
     //清理上次缓存数组对象
      imgfilepath = [];
      jiekouimglist = [];
  },
  onAutoFocus() {
    this.setData({
      inputFocus: true,
    });
  },
  onExtraTap() {
    my.alert({
      content: 'extra tapped',
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
   onLoad(query) {
    const that=this;
    that.setData({ 
            ...app.globalData.piTempObj
    });
    //this.data=app.globalData.piTempObj;
    console.info("友商测试--------------------");
    console.info(this.data);

    that.setData({ 
           isdo:true,
           applyCode:query.applyCode
    });
    // this.data.isdo=true;
    // this.data.applyCode = query.applyCode;
    var fileObjList=[];
    for(var i in this.data.auditsName){
        var temObj={name:this.data.auditsName[i],ftype:this.data.audits[i],listUploadFileRecord:[]};
        fileObjList.push(temObj);
    }
    that.setData({ 
           fileObjList:fileObjList
    });
    //this.data.fileObjList=fileObjList;
    console.info("this.data.applyCode==="+this.data.applyCode);
  },
  onPickerTap() {
    my.showActionSheet({
      title: '选择融资期限',
      items: dates,
      success: (res) => {
        this.setData({
          termUnit: dates[res.index],
        });
      },
    });
  },
  onSubmit(e){
    const that = this;
    //正常机构流程
    that.checkapplyForm(e);
    if(that.data.checkFormStatus=='ok'){

      if(that.data.isdo){
      that.setData({
        isdo:false
      });
        my.showLoading({
          content: '请求中...',
          delay: 0,
          success:function(){
             
              console.info('that.data.applyCode=='+that.data.applyCode);
              console.info('that.data.code=='+that.data.code);
              var userCode  = app.globalData.userCode;
              var quota=e.detail.value.quota;
              var termValue=e.detail.value.termValue;
              var termUnit= e.detail.value.termUnit;
              var applyRaterange= e.detail.value.applyRaterange;
              if(termUnit=='年'){
                termUnit = '1';
              }
              if(termUnit=='月'){
                termUnit = '2';
              }
              if(termUnit=='日'){
                termUnit = '3';
              }
              var checkstate = that.data.checkFormStatus;
              if(checkstate=='ok'){
                console.info("表单校验通过！！！！");
                console.info('picode==='+that.data.code+'/applyCode=='+that.data.applyCode);
                console.info("定向附件集合imgfilepath===="+imgfilepath) 
                console.info(that.data) ;
                my.request({
                  url: app.globalData.webServerUrl+'alipayRestController.do?method=checkApplyFile',
                  method: 'POST',
                  data: {
                  piCode:that.data.code,
                  applyCode:that.data.applyCode
                  },
                  // 期望返回的数据格式，默认json，支持json，text，base64
                  dataType: 'json',
                  // 调用成功的回调函数
                  success: function (res) {
                    if(res.data.code=='000000'){         
                      console.info("接口返回资料完整");
                      //附件校验成功调用申请提交接口
                      my.request({
                        url: app.globalData.webServerUrl+'alipayRestController.do?method=insertApply',
                        method: 'POST',
                        data: {
                        quota:quota,
                        termValue:termValue,
                        dkfs:'',
                        termUnit: termUnit,
                        proInfoCode:that.data.code,
                        applyRaterange:applyRaterange,
                        userCode:userCode,//传参
                        applycode:that.data.applyCode
                        },
                        // 期望返回的数据格式，默认json，支持json，text，base64
                        dataType: 'json',
                        // 调用成功的回调函数
                        success: function (res) {
                          if(res.data.code=='000000'){         
                            console.info("融资申请提交成功！");
                            my.navigateTo({ 
                              url: '../apply-success/apply-success',
                            });
                            /*my.alert({
                              title: '提示',
                              content: '融资申请成功！',
                              success: () => {
                                my.navigateTo({ 
                                  url: '../apply-success/apply-success',
                                });
                              }
                            });*/
                          }else{
                            my.hideLoading();
                            that.setData({
                              isdo:true
                            });
                          }
                        },
                        fail: function (res) {
                          console.info("融资申请接口调用失败！");
                           my.hideLoading();
                           that.setData({
                              isdo:true
                            });
                        }
                      });    
                    }else{
                      console.info('上传附件校验=='+res.data.message);
                      my.alert({
                        title: "附件不全,请上传",
                      });
                      my.hideLoading();
                      that.setData({
                        isdo:true
                      });
                    }
                  },
                  fail: function (res) {
                    console.info("融资申请附件上传校验接口调用失败！");
                     my.hideLoading();
                     that.setData({
                        isdo:true
                      });
                  }
                });
              }else{
                console.info("表单校验不通过");
                my.hideLoading();
                that.setData({
                  isdo:true
                });
              }
           }
        });
      }
    }
  },

  checkapplyForm(e){
    const that = this;
    var quota=e.detail.value.quota;
    var termValue=e.detail.value.termValue;
    var dkfs=e.detail.value.guaranteeType;
    var termUnit= e.detail.value.termUnit;
    var applyRaterange= e.detail.value.applyRaterange;
    
    var qxMin=that.data.termValueMin;
    var qxMax=that.data.termValueMax;
    var qxdw=that.data.termUnitName;
    var minConvartDayNum=0;
    var maxConvartDayNum=0;

    var subMinConvartDayNum=0;
    if(qxdw=="年"){
      minConvartDayNum=parseFloat(qxMin)*360;
      maxConvartDayNum=parseFloat(qxMax)*360;
    }
    if(qxdw=="月"){
      minConvartDayNum=parseFloat(qxMin)*30;
      maxConvartDayNum=parseFloat(qxMax)*30;
    }
    if(qxdw=="日"){
      minConvartDayNum=parseFloat(qxMin);
      maxConvartDayNum=parseFloat(qxMax);
    }

    if(termUnit=="年"&&termUnit!=""){
      subMinConvartDayNum=parseFloat(termValue)*360;
    }else if(termUnit=="月"&&termUnit!=""){
      subMinConvartDayNum=parseFloat(termValue)*30;
    }else if(termUnit=="日"&&termUnit!=""){
      subMinConvartDayNum=parseFloat(termValue);
    }

    if(quota==""){
      my.alert({
        title: '融资金额不能为空！',
      });
      that.setData({
        checkFormStatus:''
      });
    }
    else if(isNaN(quota)){
      my.alert({
        title: '请输入合法数字！',
      });
      that.setData({
        checkFormStatus:''
      });
    }
    else if(quota<that.data.quotaMin){
      my.alert({
        title: '金额不能小于产品规定金额最小值',
      });
      that.setData({
        checkFormStatus:''
      });
    }
    else if(quota>that.data.quotaMax){
      my.alert({
        title: '金额不能大于产品规定金额最大值！',
      });
        that.setData({
        checkFormStatus:''
      });
    }
    else if(termValue==""){
      my.alert({
        title: '融资期限不能为空！',
      });
      that.setData({
        checkFormStatus:''
      });
    }
    else if(isNaN(termValue)){
      my.alert({
        title: '请输入合法数字！',
      });
      that.setData({
        checkFormStatus:''
      });
    }
    else if(termUnit==""){
      my.alert({
        title: '融资期限单位不能为空！',
      });
      that.setData({
        checkFormStatus:''
      });
    }
    else if(subMinConvartDayNum>maxConvartDayNum){
      my.alert({
        title: '融资期限不能大于产品规定期限最大值',
      });
      that.setData({
        checkFormStatus:''
      });
    }
    else if(subMinConvartDayNum<minConvartDayNum){
      my.alert({
        title: '融资期限不能小于产品规定期限最小值',
      });
      that.setData({
        checkFormStatus:''
      });
    }
    else if(dkfs==""){
      my.alert({
        title: '请选择担保方式！',
      });
      that.setData({
        checkFormStatus:''
      });
    } 
    else if(applyRaterange==""){
      my.alert({
        title: '融资利率不能为空！',
      });
      that.setData({
        checkFormStatus:''
      });
    }
    else if(isNaN(applyRaterange)){
      my.alert({
        title: '请输入合法数字！',
      });
      that.setData({
        checkFormStatus:''
      });
    }
    else if(applyRaterange>that.data.raterangeMax){
      console.info("输入"+applyRaterange);
      console.info("比较"+that.data.raterangeMax);
      my.alert({
        title: '融资利率不能大于产品规定利率最大值！',
      });
      that.setData({
        checkFormStatus:''
      });
    }
    else if(applyRaterange<that.data.raterangeMin){
      console.info("输入"+applyRaterange);
      console.info("比较"+that.data.raterangeMin);
      my.alert({
        title: '融资利率不能小于产品规定利率最小值！',
      });
      that.setData({
        checkFormStatus:''
      });
    }
    else{
      that.setData({
        checkFormStatus:'ok'
      });
    }
  },
  //图片附件上传
  uploadUserFiles(e){
    const that = this;
    var fname = e.target.dataset.fname;
    console.info("e.target.dataset.fname===="+fname);
    that.data.fname =fname;

    var userCode  = app.globalData.userCode;
    jiekouimglist =[];
    my.chooseImage({
      sourceType: ['camera','album'],
      count: 5,
      success: (res) => {
        const path = res.apFilePaths;
        let  filepaths =[];
        for (var idx in path) {
          filepaths = path[idx];
          my.uploadFile({
            url: app.globalData.webServerUrl+'alipayRestController.do?method=uploadImg&objectId='+that.data.applyCode+'&annexType='+fname+'&operateCode='+userCode+'&userFileType=product',
            fileType: 'image',
            fileName: 'file',
            filePath: filepaths,
            dataType: 'json',
            header: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            formData:{},
            success: (res) => {
                var msgss = JSON.parse(res.data);
              console.info(msgss);
              jiekouimglist.push(msgss.imgPath);
              var fileObjList =that.data.fileObjList;
              for(var i in fileObjList){
                  if(fileObjList[i].ftype==fname){
                      fileObjList[i].listUploadFileRecord.push({fileName:msgss.fileName,filePath:msgss.imgPath,id:msgss.id});
                  }
              }
              that.setData({
                    fileObjList:fileObjList
              });
            },
            fail: function(res) {
              my.alert({ title: '上传失败' });
        
            },
          });
        }    
        imgfilepath.push({"fileTypeName":that.data.fname,"imgurl":jiekouimglist}); 
        my.alert({ title: '上传成功' });
      },
      fail:()=>{
        // my.showToast({
        //   content: '上传图片出错了！', // 文字内容
        // });
      }
    }); 
  },
  delFile(e){
     const that = this;
     console.info(e.target.dataset.id);
      my.request({
            url: app.globalData.webServerUrl+'alipayRestController.do?method=uploadImgDel',
            method: 'POST',
            data: {
                fileId:e.target.dataset.id
            },
            // 期望返回的数据格式，默认json，支持json，text，base64
            dataType: 'json',
            // 调用成功的回调函数
            success: function (res) {
               if(res.data.code=='000000'){  
                  my.alert({ title: '删除成功' });
                  
                  var fileObjList =that.data.fileObjList;
                  for(var i in fileObjList){
                     var temObj=fileObjList[i];
                       for(var ii in temObj.listUploadFileRecord){
                         if(temObj.listUploadFileRecord[ii].id==e.target.dataset.id){
                            temObj.listUploadFileRecord.splice(ii,1);
                         }
                      }
                  }
                  that.setData({
                        fileObjList:fileObjList
                  });

               }else{
                   my.alert({ title: '删除失败' });
               }
               
               
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
  },
  dowFile(e){
      my.saveImage({
        url: e.target.dataset.hr,
        showActionSheet: true,
        success: () => {
          my.alert({
            title: '保存成功',
          });
        },
      });
  },
  previewImage(e) {
    var fname = e.target.dataset.fname;
    console.info('fname---======'+fname);
    var viewlist = [];
    for(var i =0;i<imgfilepath.length;i++){
      if(imgfilepath[i].fileTypeName==fname){
        viewlist = imgfilepath[i].imgurl;
      } 
    }
    console.info('viewlist========'+viewlist);
    if(viewlist.length==0){
      my.alert({ title: '请上传后查看！' });
    }
    my.previewImage({
      current: viewlist.length-1,
      urls: viewlist,
    });
  }
});