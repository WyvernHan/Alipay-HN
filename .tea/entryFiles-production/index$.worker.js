if(!self.__appxInited) {
self.__appxInited = 1;


require('./config$');
require('./importScripts$');

var AFAppX = self.AFAppX;
self.getCurrentPages = AFAppX.getCurrentPages;
self.getApp = AFAppX.getApp;
self.Page = AFAppX.Page;
self.App = AFAppX.App;
self.my = AFAppX.bridge || AFAppX.abridge;
self.abridge = self.my;
self.Component = AFAppX.WorkerComponent || function(){};
self.$global = AFAppX.$global;
self.requirePlugin = AFAppX.requirePlugin;


if(AFAppX.registerApp) {
  AFAppX.registerApp({
    appJSON: appXAppJson,
  });
}



function success() {
require('../../app');
require('../../node_modules/mini-antui/es/list/index?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../node_modules/mini-antui/es/list/list-item/index?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../node_modules/mini-antui/es/tips/tips-dialog/index?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../node_modules/mini-antui/es/tips/tips-plain/index?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../node_modules/mini-antui/es/input-item/index?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../node_modules/mini-antui/es/picker-item/index?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../node_modules/mini-antui/es/popover/popover-item/index?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../node_modules/mini-antui/es/notice/index?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../node_modules/mini-antui/es/am-icon/index?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../node_modules/mini-antui/es/grid/index?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../node_modules/mini-antui/es/modal/index?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../node_modules/mini-antui/es/popover/index?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../components/mobileCode/index?hash=03c3641ce90417026c998f5c87b01860c848b9bb');
require('../../node_modules/mini-antui/es/message/index?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../node_modules/mini-antui/es/filter/index?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../node_modules/mini-antui/es/filter/filter-item/index?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../node_modules/mini-ali-ui/es/am-icon/index?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../node_modules/mini-ali-ui/es/title/index?hash=5a0c180d5ccf7c9d483dd4817cdab5489824013c');
require('../../node_modules/mini-ali-ui/es/collapse/index?hash=a11fdcdff8ea970c65f185a8731cafe48f67047c');
require('../../node_modules/mini-ali-ui/es/collapse/collapse-item/index?hash=5a0c180d5ccf7c9d483dd4817cdab5489824013c');
require('../../node_modules/mini-antui/es/badge/index?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../node_modules/mini-antui/es/tabs/index?hash=b998354db5b64281090d8969355b2b3db41cda49');
require('../../node_modules/mini-antui/es/tabs/tab-content/index?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../node_modules/mini-antui/es/page-result/index?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../node_modules/mini-antui/es/popup/index?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../node_modules/mini-ali-ui/es/search-bar/index?hash=5a0c180d5ccf7c9d483dd4817cdab5489824013c');
require('../../pages/index/index?hash=01dd5332f39dd1243632243bad626410b664b999');
require('../../pages/login/login?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/identity/identity?hash=c4a114c7f15a571913603457f1378642aa463cec');
require('../../pages/register/register?hash=7cc964edf86af663fce94adadf7f985becd09002');
require('../../pages/Original-password/Original-password?hash=c4a114c7f15a571913603457f1378642aa463cec');
require('../../pages/phone-password/phone-password?hash=c4a114c7f15a571913603457f1378642aa463cec');
require('../../pages/change-password/change-password?hash=3e2e5e2d473d03821badb5452a72c12422f436f6');
require('../../pages/finance/finance?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/policy/policy?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/location/location?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/index/loanServe/loanServe?hash=1abb7ccb4d34d33565ed0bf35b08928587174dcf');
require('../../pages/apply-success/apply-success?hash=25916fd7e161397f5d39fda47c31ecb2c60aa80b');
require('../../pages/apply/apply?hash=c4a114c7f15a571913603457f1378642aa463cec');
require('../../pages/web-view/web-view?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/loan-progress/loan-progress?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/product-detail/product-detail?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/filter/filter?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/mine/mine?hash=c77ca6bbe94336d98381d8d828e0cf3ecc292ce2');
require('../../pages/demand-detail/demand-detail?hash=c4a114c7f15a571913603457f1378642aa463cec');
require('../../pages/news-detail/news-detail?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/financing-list-filtered/financing-list-filtered?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/news-list/news-list?hash=1d800f769ac3605e27dea9ba505bf4f320e2fd4e');
require('../../pages/new-info/new-info?hash=c4a114c7f15a571913603457f1378642aa463cec');
require('../../pages/financing/financing-list?hash=4f7de294c963b4600fcb9d89cab3325db1794cca');
require('../../pages/change-info/change-info?hash=c4a114c7f15a571913603457f1378642aa463cec');
require('../../pages/change-phone/change-phone?hash=c4a114c7f15a571913603457f1378642aa463cec');
require('../../pages/set/set?hash=3e2e5e2d473d03821badb5452a72c12422f436f6');
require('../../pages/set-password/set-password?hash=c4a114c7f15a571913603457f1378642aa463cec');
require('../../pages/forget-other/forget-other?hash=c4a114c7f15a571913603457f1378642aa463cec');
require('../../pages/forget-phone/forget-phone?hash=c4a114c7f15a571913603457f1378642aa463cec');
require('../../pages/forget-password/forget-password?hash=3e2e5e2d473d03821badb5452a72c12422f436f6');
require('../../pages/register-success/register-success?hash=61a2c918bb65bc8414f1bb87ae1081b5833d35e7');
require('../../pages/evaluate/evaluate?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/organ-list/organ-list?hash=6c28ef62e82812bc17c59748bb05ad700983c605');
require('../../pages/organ-list/OrganDetail/OrganDetail?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/financing-need/financing-need?hash=81c953600c705555a000ac62be157c33260f578f');
require('../../pages/enterprise-info/enterprise-info?hash=c4a114c7f15a571913603457f1378642aa463cec');
require('../../pages/enterprise-update/enterprise-update?hash=c4a114c7f15a571913603457f1378642aa463cec');
require('../../pages/notice/notice?hash=6c28ef62e82812bc17c59748bb05ad700983c605');
require('../../pages/registerWord/registerWord?hash=61a2c918bb65bc8414f1bb87ae1081b5833d35e7');
require('../../pages/registerPrivacy/registerPrivacy?hash=61a2c918bb65bc8414f1bb87ae1081b5833d35e7');
}
self.bootstrapApp ? self.bootstrapApp({ success }) : success();
}