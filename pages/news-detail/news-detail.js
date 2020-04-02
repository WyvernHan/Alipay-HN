const app = getApp();
var WxParse= require('../../wxParse/wxParse.js');
Page({
  data: {
   
  },
  onLoad(query) {
    const that=this;
    //var a=JSON.parse(query.lt);
    var a=app.globalDatablobTempContent;
    //a.content=a.content.replace(/%/g, '%25');
    that.setData({
        content:a
    });
    var article2 = a.content;   
    // article2 = article2.replace(/ol/g, "div");
    // article2 = article2.replace(/ul/g, "div");
    // article2 = article2.replace(/li/g, "div");
    WxParse.wxParse('article', 'md', article2, that, 5);

    console.info(that.data);
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
   
    }
  
});
