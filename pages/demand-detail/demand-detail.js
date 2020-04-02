const app = getApp();
Page({
  data: {
    id: '',
    userCode: '',
    applyInfo:{},
    readioGroup:[{value:'spring', label:'Spring', checked:true}, {value:'summer', label:'Summer'}],
    xvalue:0,
    xclass:[" fa fa-star "," fa fa-star "," fa fa-star "," fa fa-star "," fa fa-star "],
    files:[]
  },
  onLoad(options) {
    this.setData({
      id: options.id,
      userCode: options.userCode,
     
    })
    this.getApplyInfo();
  },
  getApplyInfo(){
          const that=this;
          console.info("demand-detail------------------");
         
          my.request({
            url: app.globalData.webServerUrl+'alipayRestController.do?method=detailsView',
            method: 'POST',
            data: {
                Id:that.data.id,
                userCode:that.data.userCode
            },
            // 期望返回的数据格式，默认json，支持json，text，base64
            dataType: 'json',
            // 调用成功的回调函数
            success: function (res) {
               console.info(res);
               console.info(that.data);
              //给全局变量赋值，做为展示使用
            // that.data.list.push(res.data.plist);
              var newG=[];
              var v=res.data.result.evaluationeveLevel==""?0:res.data.result.evaluationeveLevel;
              if(v>0){
                   for(var i=0;i<v;i++){
                     newG.push("fa fa-star light");
                   }
                   for(var i=newG.length;i<5;i++){
                    newG.push(" fa fa-star ");
                   }
              }
             
             if(newG.length>0){
                 that.setData({  
                  xclass:newG,
                  xvalue:v,
                  applyInfo:res.data
                });
             }else{
                that.setData({  
                    applyInfo:res.data
                });
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
  tjpj(){

  },
  delFile(e){
     const that = this;
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
                  var temapplyInfo=that.data.applyInfo;
                  var temFileList=that.data.applyInfo.listUploadFileRecord;
                  for(var i=0;i<temFileList.length;i++){
                      var temObj=temFileList[i];
                      for(var ii in temObj.listUploadFileRecord){
                         if(temObj.listUploadFileRecord[ii].id==e.target.dataset.id){
                            temObj.listUploadFileRecord.splice(ii,1);
                         }
                      }
                  }
                  temapplyInfo.listUploadFileRecord=temFileList;

                  that.setData({
                    applyInfo:temapplyInfo
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
    
     my.getSavedFileInfo({
      apFilePath:app.globalData.webServerUrl+'upload/InfoPolicyAnnex/20200224/9c3dbf24249e4591b9e267bc8934fa38.docx',
          success:(res)=>{
              console.info(res);
          }
      });
      my.saveFile({
      apFilePath: e.target.dataset.hr,
      success: (res) => {
       console.info(res);
      },
    });
   
    },
    bindFormSubmit(e) {
      const that=this;
      console.info(that.data.xvalue);
      console.info(e.detail.value.textarea);
      if(that.data.xvalue==0){
           my.alert({ title: '评价级别不能为空' });
           return;
      }
      if(e.detail.value.textarea.length==0){
           my.alert({ title: '评价内容不能为空' });
           return;
      }
      my.request({
            url: app.globalData.webServerUrl+'alipayRestController.do?method=evalC',
            method: 'POST',
            data: {
                eId:that.data.id,
                evalC:e.detail.value.textarea,
                evaluationeveLevel:that.data.xvalue
            },
            // 期望返回的数据格式，默认json，支持json，text，base64
            dataType: 'json',
            // 调用成功的回调函数
            success: function (res) {
               my.alert({ title: '操作成功' });
               
                my.navigateBack({
                  delta: 1
                })
              /**
                my.reLaunch({
                  url: '../demand-detail/demand-detail?id='+that.data.id+'&userCode='+that.data.userCode
                })
              */
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
    xset(e){
      
      const that=this;
      console.info(e.target.dataset.xvalue);
      var v=e.target.dataset.xvalue;
      var newG=[];
      for(var i=0;i<v;i++){
        newG.push("fa fa-star light");
      }
      for(var i=newG.length;i<5;i++){
        newG.push(" fa fa-star ");
      }

       that.setData({  
         xclass:newG,
         xvalue:v
       });
    },
    //图片附件上传
  uploadUserFiles(e){
    const that = this;
      //清除对象
    that.setData({
        files:[]
    });
    let files2 = this.data.files;
    var userCode  = that.data.userCode;
    var temFileType=e.target.dataset.filetype;
    console.info("type:"+e.target.dataset.filetype);
    console.info(e);
    my.chooseImage({
      sourceType: ['camera','album'],
      count: 5,
      success: (res) => {
        const path = res.apFilePaths;
        for (var idx in path) {
          my.uploadFile({
            url: app.globalData.webServerUrl+'alipayRestController.do?method=uploadImg&objectId='+that.data.applyInfo.result.paCode+'&annexType='+e.target.dataset.filetype+'&operateCode='+userCode+'&userFileType=product',
            fileType: 'image',
            fileName: 'file',
            filePath: path[idx],
            dataType: 'json',
            header: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            formData:{},
            success: (res) => {
              console.info(res.data);
		            var msgss = JSON.parse(res.data);
                 var temapplyInfo=that.data.applyInfo;
                 var temFileList=that.data.applyInfo.listUploadFileRecord;
                  for(var i=0;i<temFileList.length;i++){
                      var temObj=temFileList[i];
                      if(temObj.value==temFileType){
                        temObj.listUploadFileRecord.push({fileName:msgss.fileName,filePath:msgss.imgPath,id:msgss.id});
                      }
                  }
                  temapplyInfo.listUploadFileRecord=temFileList;

                  that.setData({
                    applyInfo:temapplyInfo
                  });
                  console.info(that.data.applyInfo);

            },
            fail: function(res) {
              my.alert({ title: '上传失败' });
            },
          });
        }

        console.info(that.data.userImageList);
           my.alert({ title: '上传成功' });
          
          /**
           my.reLaunch({
                  url: '../demand-detail/demand-detail?id='+that.data.id+'&userCode='+that.data.userCode
           }) */
      },
   
      fail:()=>{
        // my.showToast({
        //   content: '上传图片出错了！', // 文字内容
        // });
      }


    });
  },
  bcSum(){
    const that=this;
    console.info(that.data.applyInfo.paCode);

    my.request({
            url: app.globalData.webServerUrl+'alipayRestController.do?method=accept',
            method: 'POST',
            data: {
                pId:that.data.id,
                userCode:that.data.userCode
            },
            // 期望返回的数据格式，默认json，支持json，text，base64
            dataType: 'json',
            // 调用成功的回调函数
            success: function (res) {
               my.alert({ title: '操作成功' });
               
               my.navigateBack({
                delta: 1
              });
              /**
                my.reLaunch({
                  url: '../demand-detail/demand-detail?id='+that.data.id+'&userCode='+that.data.userCode
                })
              */
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
});