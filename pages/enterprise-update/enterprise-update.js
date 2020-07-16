const app = getApp();
var imgfilepath = [];
var licenseFileslist = [];
var idCardFileslist = [];

Page({
  data: {
    userenterpriseInfo: '',
    tel: '',
    loginName:'',//企业名称
    code:'',//企业code
    license:'',//统一社会信用代码
    companyType:'',//企业类型
    corporate:'',//法人姓名
    corporateIDcard:'',//法人身份证号
    checkOrigin:'',//审核来源
    checkState:'',//资料审核结果
    licensePicPath:[],
    corporateIDcardPicPath:[],
    licenseFileslist:[],
    idCardFileslist:[],
    typeGroup:[],
    typeSubValue:""
  },
  onReady(){
    //清理上次缓存数组对象
    imgfilepath = [];
    licenseFileslist = [];
  },
  onLoad(){
    const that = this;
    my.request({
        url: app.globalData.webServerUrl+'alipayRestController.do?method=getEnterpriseInfo',//注册信息提交
        method: 'POST',
        data: {
          userCode: app.globalData.userCode
        },
        // 期望返回的数据格式，默认json，支持json，text，base64
        dataType: 'json',
        // 调用成功的回调函数
        success: function (res) {
          console.info(res.data)
          if(res.data.code=='000000'){
            var tel = res.data.enterpriseInfo.tel;
            var loginName = res.data.enterpriseInfo.loginName;
            var license = res.data.enterpriseInfo.license;
            var companyType = res.data.enterpriseInfo.companyTypeStr;
            var corporate = res.data.enterpriseInfo.corporate;
            var typeGroup=res.data.companyTypeDict;
            var corporateIDcard = res.data.enterpriseInfo.corporateIDcard;
            var checkOrigin = res.data.enterpriseInfo.checkOrigin;
            var checkState = res.data.enterpriseInfo.checkStateStr;
            that.setData({
              tel: tel,
              loginName: loginName,
              license: license,
              companyType:companyType,
              corporate: corporate,
              corporateIDcard: corporateIDcard,
              checkOrigin:checkOrigin,
              checkState:checkState,
              typeGroup:typeGroup
            });
            console.info(typeGroup)
            console.info('22222222222');
            console.info(that.data.typeGroup)
          }else if(res.data.code=='999999'){
            my.showToast({
              type: 'fail',
              content: res.data.message,
              duration: 1500,
              success: () => {
              },
            });
          }
        },
        fail: function () {
          my.showToast({
            type: 'exception',
            content: '服务器异常，请稍后重试',
            duration: 1500,
            success: () => {
            },
          });
        }
      });
  },
  onPickerTap() {
    const that=this;
    
    var temp=[];
    for(var i in that.data.typeGroup ){
       var temobj=that.data.typeGroup[i];
       temp.push(temobj.name);
    }
    my.showActionSheet({
      title: '选择企业类型',
      items: temp,
      success: (res) => {
        this.setData({
          typeSubValue: that.data.typeGroup[res.index].value,
          companyType: that.data.typeGroup[res.index].name  
        });
         console.info('33333333333333');
        console.info(that.data.typeGroup[res.index].value)
        console.info(that.data.typeGroup[res.index].name)
      },
    });
  },
  //营业执照附件上传
  uploadLicenseFiles(){
    const that = this;
    var userCode  = app.globalData.userCode;
    licenseFileslist =[];
    my.chooseImage({
      sourceType: ['camera','album'],
      count: 1,
      success: (res) => {
        const path = res.apFilePaths;
        let  filepaths =[];
        for (var idx in path) {
          filepaths = path[idx];

          my.uploadFile({
            url: app.globalData.webServerUrl+'alipayRestController.do?method=uploadImg&objectId='+userCode+'&annexType=licensePic'+'&operateCode='+userCode+'&userFileType=licensePicPath',
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
              licenseFileslist.push(msgss.imgPath);
              that.setData({
                licenseFileslist:licenseFileslist
              });
            },
            fail: function(res) {
              my.showToast({
                type: 'fail',
                content: '营业执照上传失败！',
                duration: 1500,
                success: () => {
                },
              });
            },
          });
        }
        imgfilepath.push({"fileTypeName":'licensePic',"imgurl":licenseFileslist}); 
        my.showToast({
          type: 'success',
          content: '营业执照上传成功！',
          duration: 1500,
          success: () => {
          },
        });
      },
      fail:()=>{
        // my.showToast({
        //   content: '上传图片出错了！', // 文字内容
        // });
      }
    });   
  },
  previewLicenseImage() {
    var licenselist = [];
    for(var i =0;i<imgfilepath.length;i++){
      if(imgfilepath[i].fileTypeName=='licensePic'){
        licenselist = imgfilepath[i].imgurl;
      } 
    }
    console.info('licenselist========'+licenselist);
    if(licenselist.length==0){
      my.showToast({
        type: 'none',
        content: '营业执照未上传，请上传后查看！',
        duration: 1500,
        success: () => {
        },
      });
    }else{
      my.previewImage({
        current: licenselist.length-1,
        urls: licenselist,
      });
    }
  },
  //身份证附件上传
  uploadIdCardFiles(){
    const that = this;
    var userCode  = app.globalData.userCode;
    idCardFileslist =[];
    my.chooseImage({
      sourceType: ['camera','album'],
      count: 1,
      success: (res) => {
        const path = res.apFilePaths;
        let  filepaths =[];
        for (var idx in path) {
          filepaths = path[idx];

          my.uploadFile({
            url: app.globalData.webServerUrl+'alipayRestController.do?method=uploadImg&objectId='+userCode+'&annexType=corporateIDcardPic'+'&operateCode='+userCode+'&userFileType=corporateIDcardPicPath',
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
              idCardFileslist.push(msgss.imgPath);
              that.setData({
                idCardFileslist:idCardFileslist
              });
            },
            fail: function(res) {
              my.showToast({
                type: 'fail',
                content: '法人身份证上传失败！',
                duration: 1500,
                success: () => {
                },
              });
            },
          });
        }
        imgfilepath.push({"fileTypeName":'corporateIDcardPic',"imgurl":idCardFileslist});
        my.showToast({
          type: 'success',
          content: '法人身份证上传成功！',
          duration: 1500,
          success: () => {
          },
        });
      },
      fail:()=>{
        // my.showToast({
        //   content: '上传图片出错了！', // 文字内容
        // });
      }
    }); 
  },
  previewIdCardImage() {
    var viewlist = [];
    for(var i =0;i<imgfilepath.length;i++){
      if(imgfilepath[i].fileTypeName=='corporateIDcardPic'){
        viewlist = imgfilepath[i].imgurl;
      } 
    }
    console.info('viewlist========'+viewlist);
    if(viewlist.length==0){
      my.showToast({
        type: 'none',
        content: '法人身份证未上传，请上传后查看！',
        duration: 1500,
        success: () => {
        },
      });
    }else{
      my.previewImage({
        current: viewlist.length-1,
        urls: viewlist,
      });
    }
  },
  onItemInputLoginName(e){
    this.setData({
      loginName: e.detail.value
    });
  },
  onItemInputLicense(e){
    this.setData({
      license: e.detail.value
    });
  },
  onItemInputCorporate(e){
    this.setData({
      corporate: e.detail.value
    });
  },
  onItemInputIdCard(e){
    let str=e.detail.value;
    let strGroup=str.split("x");
    if(strGroup.length>1){
      str=strGroup[0]+"X";
    }
    this.setData({
      corporateIDcard: str
    });
  },
  onSubmit(){
    const that = this;
    console.info(licenseFileslist)
    console.info(idCardFileslist)
    if(this.data.loginName==''||this.data.license==''||this.data.corporate==''||this.data.corporateIDcard==''||this.data.companyType==''){
      my.showToast({
        type: 'none',
        content: '企业信息不全，请您认真填写全部内容后提交企业信息，感谢您的配合！',
        duration: 3000,
        success: () => { 
        },
      });
    }else if(licenseFileslist.length==0){
      my.showToast({
        type: 'none',
        content: '请您上传营业执照后提交企业信息，感谢您的配合！',
        duration: 3000,
        success: () => { 
        },
      });
    }else if(idCardFileslist.length==0){
      my.showToast({
        type: 'none',
        content: '请您上传法人身份证后提交企业信息，感谢您的配合！',
        duration: 3000,
        success: () => { 
        },
      });
    }else{
      var userCode = app.globalData.userCode;
      my.request({
        url: app.globalData.webServerUrl+'alipayRestController.do?method=saveEnterpriseInfo',//注册信息提交
        method: 'POST',
        data: {
          nickName:that.data.loginName,
          license:that.data.license,
          corporate:that.data.corporate,
          idCard:that.data.corporateIDcard,
          userCode: userCode,
          typeSubValue:that.data.typeSubValue
        },
        // 期望返回的数据格式，默认json，支持json，text，base64
        dataType: 'json',
        // 调用成功的回调函数
        success: function (res) {
          console.info(res.data)
          if(res.data.code=='000000'){
            my.showToast({
              type: 'success',
              content: '企业信息修改成功',
              duration: 3000,
              success: () => {
                my.reLaunch({
                  url: '../mine/mine',
                });
              }
            });
          }else if(res.data.code=='999999'){
            my.showToast({
              type: 'fail',
              content: '企业信息修改失败',
              duration: 3000,
              success: () => {
              },
            });
          }
        },
        fail: function () {
          my.showToast({
            type: 'exception',
            content: '网络异常，请稍后重试',
            duration: 3000,
            success: () => {
            },
          });
        }
      });
    }
  }
});