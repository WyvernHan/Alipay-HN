const app = getApp();
var imgfilepath = [];

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
    licensePic:'',//营业执照照片
    corporateIDcardPic:'',//法人身份证照片
    checkOrigin:'',//审核来源
    checkState:'',//资料审核结果
  },
  onLoad(){
    const that = this;
    my.request({
        url: app.globalData.webServerUrl+'alipayRestController.do?method=getEnterpriseInfo',//获取企业信息
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
            var corporateIDcard = res.data.enterpriseInfo.corporateIDcard;
            var licensePic = res.data.enterpriseInfo.licensePic;
            var corporateIDcardPic = res.data.enterpriseInfo.corporateIDcardPic;
            var checkOrigin = res.data.enterpriseInfo.checkOrigin;
            var checkState = res.data.enterpriseInfo.checkStateStr;
            that.setData({
              tel: tel,
              loginName: loginName,
              license: license,
              companyType:companyType,
              corporate: corporate,
              corporateIDcard: corporateIDcard,
              licensePic:licensePic,
              corporateIDcardPic:corporateIDcardPic,
              checkOrigin:checkOrigin,
              checkState:checkState
            });
          }else if(res.data.code=='999999'){
            my.showToast({
              type: 'fail',
              content: res.data.message,
              duration: 3000,
              success: () => {
              }
            });
          }
        },
        fail: function () {
          my.showToast({
            type: 'exception',
            content: '服务器网络异常，请您稍后操作...',
            duration: 3000,
            success: () => {
            },
          });
        }
      });
  },
  //营业执照查看附件
  previewLicenseImage() {
    var licensePic = this.data.licensePic;
    console.info('licensePic========'+licensePic);
    if(licensePic==''){
      my.showToast({
        type: 'none',
        content: '您还未上传营业执照，请修改后查看！',
        duration: 3000,
        success: () => { 
        },
      });
    }else{
      my.previewImage({
        current: 1,
        urls: [licensePic],
      });
    }
  },
  saveLicenseImage(){
    var licensePic = this.data.licensePic;
    console.info('licensePic========'+licensePic);
    if(licensePic==''){
      my.showToast({
        type: 'none',
        content: '您还未上传营业执照，请修改上传后保存！',
        duration: 3000,
        success: () => { 
        },
      });
    }else{
      console.info('licensePic========'+licensePic);
      my.saveImage({
        url: licensePic,
        showActionSheet: true,
        success: () => {
          my.showToast({
            type: 'success',
            content: '营业执照保存成功，请到“相册 -> Alipay”中查看您所保存的图片！',
            duration: 3000,
            success: () => {
            }
          });
        },
      });
    }
  },
  //法人身份证查看附件
  previewIdCardImage() {
    var corporateIDcardPic = this.data.corporateIDcardPic;
    console.info('corporateIDcardPic========'+corporateIDcardPic);
    if(corporateIDcardPic==''){
      my.showToast({
        type: 'none',
        content: '您还未上传法人身份证，请修改后查看！',
        duration: 3000,
        success: () => { 
        },
      });
    }else{
      my.previewImage({
        current: 1,
        urls: [corporateIDcardPic],
      });
    }
  },
  saveIdCardImage(){
    var corporateIDcardPic = this.data.corporateIDcardPic;
    if(corporateIDcardPic==''){
      my.showToast({
        type: 'none',
        content: '您还未上传法人身份证，请修改上传后保存！',
        duration: 3000,
        success: () => { 
        },
      });
    }else{
      my.saveImage({
        url: corporateIDcardPic,
        showActionSheet: true,
        success: () => {
          my.showToast({
            type: 'success',
            content: '法人身份证保存成功，请到“相册 -> Alipay”中查看您所保存的图片！',
            duration: 3000,
            success: () => {
            }
          });
        },
      });
    }
  },
  onSubmit(){
    my.navigateTo({
      url: '../enterprise-update/enterprise-update'
    });
  }
});