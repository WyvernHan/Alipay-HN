const app = getApp();
const dates = ['年', '月', '日'];
Page({
  data: {
    loanMoney:'',
    loanTermValue:'',
    loanTermUnit:'',
    guaranteeType:[],
    guaranteeTypeList:[],
    files:[],
    pCode:'',
    applyCode:'',
    userImageList:[],
    dicguaranteeType:[],
    checkFormStatus:'',
    termUnit:'',
    mode:'',
    fileObjList:{listUploadFileRecord:[]},
    isdo:true
  },
  alt(){
    const that = this;
    
    that.setData({
      userImageList:that.data.userImageList
    });
  },
  //进行企业四要素和资料审核验证，成功返回申请编号
  checkAntResult() {
    const that=this;
    var userCode  = app.globalData.userCode;
    console.info(userCode);
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
        var antresult = res.data.antresult;//四要素验证状态
       
        let  applyCode = res.data.applyCode;

        that.setData({ 
            applyCode:applyCode
          });
        // if(antresult==1&&type==1){
         
        //   console.info("认证通过================="+applyCode);
        // }else{
        //   that.setData({ 
        //     applyCode:'0'
        //   });
        //   console.info("认证失败！");
        // }
         console.info('99999999999**********************');
         console.info(that.data.applyCode);
      },
      fail: function (res) {
        console.info("企业资料校验接口调用失败！");
      }
    });
  },

  onLoad(options) {
    // var guaranteeType=[];
    // var guaranteeTypeList = [];
   this.checkAntResult();
    //var aaa = options.guaranteeType.split(',');
    // console.info(aaa);
    // console.info(111);
    // for (var i = 0; i < aaa.length; i++){
    //   if(i%2 == 0){
    //     guaranteeType.push(aaa[i]);
    //   }else{
    //     guaranteeTypeList.push(aaa[i]);
    //   }
    // }
    var guaranteeType;
    if(options.guaranteeType!=undefined){
        guaranteeType=JSON.parse(options.guaranteeType);
        console.info(guaranteeType);
    }else{
        guaranteeType=app.globalData.guaranteeType;//担保方式数据字典
    }

     console.info("-----------------------------------"); 

    this.setData({
      loanMoney: options.loanMoney,
      loanTermValue:options.loanTermValue,
      loanTermUnit:options.loanTermUnit,
      guaranteeType:guaranteeType,
      // guaranteeTypeList:guaranteeTypeList,
      applyCode:options.applyCode,
      // dicguaranteeType:dicguaranteeType,
    
    })
  },
  onSubmit(e){
    const that = this;
    console.info('88888888888888888888888');
    that.checkapplyForm(e);
    if(that.data.checkFormStatus=='ok'){
      if(that.data.isdo){
        that.setData({
          isdo:false
        });
        console.info('999999999999999999999-------------');
      my.showLoading({
          content: '请求中...',
          delay: 0,
          success:function(){
              var userCode  = app.globalData.userCode;
              var  quota=e.detail.value.quota;
              var  termValue=e.detail.value.termValue;
              var  dkfs=e.detail.value.guaranteeType;
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
              
            console.info("非定向提交申请applyCode="+that.data.applyCode);
              var applyCode = that.data.applyCode;
                my.request({
                  url: app.globalData.webServerUrl+'alipayRestController.do?method=insertApply',
                  method: 'POST',
                  data: {
                  quota:quota,
                  termValue:termValue,
                  dkfs:dkfs,
                  termUnit: termUnit,
                  proInfoCode:'',
                  applyRaterange:applyRaterange,
                  userCode:userCode,//传参
                  applycode:applyCode
                  },
                  // 期望返回的数据格式，默认json，支持json，text，base64
                  dataType: 'json',
                  // 调用成功的回调函数
                  success: function (res) {
                    if(res.data.code=='000000'){         
                      console.info("融资申请提交成功！");
                      my.navigateTo({ 
                          url: '../../apply-success/apply-success',
                      });
                      /*my.alert({
                        title: '提示',
                        content: '融资申请成功！',
                        success: () => {
                          // my.switchTab({
                            // url: '../../apply-success'
                          // });
                          my.navigateTo({ 
                              url: '../../apply-success/apply-success',
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
  delFile(e){
     const that = this;
     console.info(e.target.dataset.id);
      console.info(that.data.fileObjList.listUploadFileRecord);
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
                  var newobj=that.data.fileObjList;
                  var fileObjList=newobj.listUploadFileRecord;
                  
                  for(var i in fileObjList){
                     if(fileObjList[i].id==e.target.dataset.id){
                       console.info("进了"+i);
                       console.info(fileObjList[i]);
                        fileObjList.splice(i,1);
                      }
                  }
                  console.info(fileObjList);
                  that.setData({
                    fileObjList:newobj
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
  //图片附件上传
     uploadUserFiles(){
           const that = this;
      //清除对象
        that.setData({
                userImageList:[]
              });

    var userCode  = app.globalData.userCode;
    my.chooseImage({
      sourceType: ['camera','album'],
      count: 5,
      success: (res) => {
        const path = res.apFilePaths;

        for (var idx in path) {
          that.setData({
            files: path[idx],
          });

          console.info("非定向上传附件applyCode"+that.data.applyCode);
          console.info("非定向上传附件userCode"+userCode);
           console.info(path);
          my.uploadFile({
            url: app.globalData.webServerUrl+'alipayRestController.do?method=uploadImg&objectId='+that.data.applyCode+'&annexType=auditfdx&operateCode='+userCode+'&userFileType=product',
            fileType: 'image',
            fileName: 'file',
            filePath: that.data.files,
            dataType: 'json',
            header: {
              'Content-Type': 'application/x-www-form-urlencoded',
              
            },
            formData:{},
            success: (res) => {

               console.info("非定向上传附件回传了");
               console.info(res);
		            var msgss = JSON.parse(res.data);
             that.data.userImageList.push(msgss.imgPath);

              var fileObjList=that.data.fileObjList;
               fileObjList.listUploadFileRecord.push({fileName:msgss.fileName,filePath:msgss.imgPath,id:msgss.id});
               that.setData({
                userImageList:that.data.userImageList,
                fileObjList:fileObjList
              });
            },
            fail: function(res) {
              my.alert({ title: '上传失败' });
       
            },
          });


        }

        console.info(that.data.userImageList);
           my.alert({ title: '上传成功' });
  
      },
   
      fail:()=>{
        // my.showToast({
        //   content: '上传图片出错了！', // 文字内容
        // });
      }


    });

         console.info('这个userImageList========'+that.data.userImageList);
  },
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
checkapplyForm(e){
const that = this;
   var  quota=e.detail.value.quota;
   var  termValue=e.detail.value.termValue;
   var  dkfs=e.detail.value.guaranteeType;
   var termUnit= e.detail.value.termUnit;
   var applyRaterange= e.detail.value.applyRaterange;
  
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
   else if(quota<=0){
       my.alert({
          title: '金额不能小于或等于0！',
        });
         that.setData({
        checkFormStatus:''
      });
   }
    else if(quota>=10000000){
       my.alert({
          title: '金额不能大于或等于1千亿！',
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
    else if(termValue<=0){
       my.alert({
          title: '不能小于或等于0！',
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
    else if(termValue>5&&termUnit=="年"){
       my.alert({
          title: '不能大于5年！',
        });
         that.setData({
        checkFormStatus:''
      });
   }
      else if(termValue>60&&termUnit=="月"){
       my.alert({
          title: '不能大于60个月！',
        });
         that.setData({
        checkFormStatus:''
      });
   }
   else if(termValue>1800&&termUnit=="日"){
       my.alert({
          title: '不能大于1800天！',
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
   else if(applyRaterange>100){
       my.alert({
          title: '融资利率不能大于100！',
        });
         that.setData({
        checkFormStatus:''
      });
   }
    else if(applyRaterange<=0){
       my.alert({
          title: '不能小于或等于0！',
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
  onPickerTap() {
    my.showActionSheet({
      title: '选择融资期限',
      items: dates,
      success: (res) => {
        this.setData({
          loanTermUnit: dates[res.index],
        });
      },
    });
  },
   previewImage() {
     const that = this;
     console.info('that.data.userImageList==='+that.data.userImageList);
    my.previewImage({
      current: that.data.userImageList.length-1,
      urls: that.data.userImageList,
    });
    if(that.data.userImageList.length==0){
               my.alert({ title: '请上传后查看！' });
   }
  }


});
