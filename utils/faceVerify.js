
const app = getApp();
/**
 * 唤起认证流程
 * 参数: certifyId、url 需要通过支付宝 openapi 开放平台网关接口获取
 * 详细说明可查看文档下方的参数说明
 **/

function getVerify(cg,sb){
        my.request({
			url: app.globalData.webServerUrl+'alipayRestController.do?method=checkPlease',
			method: 'POST',
			data: {
                userCode:app.globalData.userCode
			},
			dataType: 'json',
		    success: function (res) {
                console.info("获取认证状态返回");        
                console.info(res);
                if(res.data.code=='000000') {
                     console.info("核验成功");
                     my.call('cg', {
                            name: 'faceVerify',
                            param: 'faceVerify',
                     }, cg);
                }else{
                     //onFace();
                     console.info("核验失败");
                     my.call('sb', {
                            name: 'faceVerify',
                            param: 'faceVerify',
                     }, sb);
                }
			},
			
			fail: function (res) {
				my.alert({ content: 'fail' });
			},
			
			complete: function (res) {
				my.hideLoading();
			}
		});
  }

var cid ='';
var curl='';
function startAPVerify(options, callback) {
    my.call('startBizService', {
        name: 'open-certify',
        param: JSON.stringify(options),
    }, callback);
}
function onFace(goback) {
        console.info("准备开启人脸识别");
        my.request({
        url: app.globalData.webServerUrl+'alipayRestController.do?method=getAlipayUserIdFace',//注册信息提交
        method: 'POST',
        data: {
          userCode:app.globalData.userCode
        },
        // 期望返回的数据格式，默认json，支持json，text，base64
        dataType: 'json',
        // 调用成功的回调函数
        success: function (res) {
          console.info("getAlipayUserIdFace---");
          console.info(res.data);
               cid = res.data.certifyId;
               curl = res.data.certifyUrl;
               console.info("cid！=============="+cid);
               console.info("curl=========="+curl);
               var curlrep = curl.replace('timYestamp=','timestamp=');
               console.info('转换后的字符串======'+curlrep);
               console.info('cid======'+cid);
               console.info("人脸开启");
               startAPVerify({ 
                        certifyId: cid, url: curlrep}, 
                        function (verifyResult) {
                        // 认证结果回调触发, 以下处理逻辑为示例代码，开发者可根据自身业务特性来自行处理
                        //my.alert({ content: verifyResult.resultStatus });
                        if (verifyResult.resultStatus === '9000') {
                            // 验证成功，接入方在此处处理后续的业务逻辑
                            
                            //验证成功更新人脸验证接口   
                            my.request({
                            url: app.globalData.webServerUrl+'alipayRestController.do?method=saveFace',
                            method: 'POST',
                            data: {
                            userCode:app.globalData.userCode
                            },
                            // 期望返回的数据格式，默认json，支持json，text，base64
                            dataType: 'json',
                            // 调用成功的回调函数
                            success: function (res) {
                        
                            console.info(res.data)
                            if(res.data.code=='000000'){
                                console.info("人脸返回结果为成功");
                                  my.call('cg', {
                                            name: 'faceVerify',
                                            param: 'faceVerify',
                                    }, goback);
                              
                            }

                            },
                            fail: function () {
                            utils.showAlertModal('服务器异常', '请稍后认证！');
                            }
                        });
                            return;
                        }
                        // 用户主动取消认证
                        else if (verifyResult.resultStatus === '6001') {
                            // 可做下 toast 弱提示
                        //  my.alert({ content: '用户主动退出' });
                            return;
                        }else{
                        checkfacenums++;
                        //my.alert({ content: '状态码：'+verifyResult.resultStatus });
                                if(checkfacenums==3){
                                    checkfacenums = 0;
                                //      my.navigateTo({
                                //      url: '../enterprise-info/enterprise-info'
                                // });
                                    my.alert({ content: 'loginuser：'+ss });
                                }
                        }
                        const errorCode = verifyResult.result && verifyResult.result.errorCode;

                        });
        },
        fail: function () {
          utils.showAlertModal('人脸识别异常', '请重新识别');
        }
      });
  }

  
module.exports = {
  getVerify:getVerify,
  onFace:onFace
};