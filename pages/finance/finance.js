const app = getApp();
// mock列表总数
const mockTotal = 600;
var storyItem;
//贷款期限
const loanUnit = ['年', '月', '日'];
Page({
    data: {
        scrollTop: 0,
        toViewId: 0,
        show: false, // 是否显示加载动画
        pagination: {
            currPage: 0, //当前页
            totalPage: 0, //总页数
            afterLiFlag: false,
        },
        page: 1, // 当前页数
        pageparam: {//传参
            loanTerm:'',//贷款期限
            loanTermUnit:'',//贷款期限单位
            loanMoney:'',//贷款额度
            guaranteeType:'',//担保方式
            rateSmall:'', //利率范围最小
            rateBig:'',//利率范围最大
            proNameOrOrgan:'' //机构或产品名称
        },
        list: [] // 页面List数据
     
    },
    onLoad() {
        this.mySchedulde();
    },

    onNextPage() {
        const toViewId = 5 + this.data.toViewId;
        console.log('onSuspendTitleClick = ' + toViewId);
        this.setData({ toViewId:toViewId })
    },

    onScrollToTop() {
        const scrollTop = 0;
        console.log('onScrollToTop = ' + this.data.scrollTop);
        this.setData({ scrollTop:scrollTop })
    },

    getHttpDate(page = 1) {
        let nowDate = new Date();
        let paramTime = nowDate.getTime() - 1000 * 60 * 60 * 24 * page;
        let paramDate = new Date(paramTime);
        let mm = paramDate.getMonth() + 1; // getMonth() is zero-based
        let dd = paramDate.getDate();
        if (page == 1) {
            return [paramDate.getFullYear(),
            (mm > 9 ? '' : '0') + mm,
            (dd > 9 ? '' : '0') + dd
            ].join('');
        }
        return [paramDate.getFullYear(),
        (mm > 9 ? '' : '0') + mm,
        (dd > 9 ? '' : '0') + dd
        ].join('');
    },
    /**
     * scroll-view滑到底部触发事件
     * @method scrollMytrip
     */
    async scrollMytrip() {
        try {
            const { page, list, } = this.data;
            // 判断是否还有数据需要加载
            if (list.length < mockTotal) {
                this.setData({ show: true });
                const newPage = page + 1;
                this.mySchedulde(newPage);
            }
        } catch (e) {
            this.setData({ show: false });
            console.log('scrollMytrip执行异常:', e);
        }
    },
    onPickerTap() {//选择贷款期限方法
        my.showActionSheet({
        title: '选择贷款期限',
        items: loanUnit,
        success: (res) => {
            this.setData({
            datedis: dates[res.index],
            });
        },
        });
    },
    onStroryClick(id) {
        const detailUrl = `https://news-at.zhihu.com/api/4/news/${id}`;
        console.log('detailUrl = ' + detailUrl);
        const params = encodeURIComponent(detailUrl);
        my.navigateTo({
            url: '../detail/detail?params=${params}'
        });
    },
    /**
     * 模拟请求服务端查询数据并渲染页面
     * @method mySchedulde
     * @param {int} page 分页,默认第1页
     */
    async mySchedulde(page = 1) {
        try {
            const that = this;
            let list = that.data.list;
            let pageparam1=that.data.pageparam;
            // https://news-at.zhihu.com/api/4/news/before/20190907

            let pdate = that.getHttpDate(page);
            console.log('pDate = ' + pdate);

            my.request({
                url: app.globalData.webServerUrl+`alipayRestController.do?method=getLoan`,
                method: 'POST',
                data: {
                    from: '支付宝',
                    production: 'AlipayJSAPI',
                    testlist: [
                    { color: 'blue', text: '支付宝'},
                    { color: 'red', text: '小程序' },
                    { color: 'yellow', text: 'Swiper'}
                    ],
                    pageparam: pageparam1
                },
                dataType: 'json',
                success: (res) => {
                    console.log('res = ' + JSON.stringify(res));
                    let zhihuList = res.data.stories;
                    list = [...list,...zhihuList];
                    let pageTitle = { type: 1, title: `日期：${pdate}`, remarksa: `我是第${page}页`, remarksb: '' };
                    list.push(pageTitle);
                    console.log('list = ' + JSON.stringify(list));
                    this.setData({
                        list:list,
                        page:page,
                        show: false
                    });
                    if (page === 1) {
                        console.log('loading next page');
                        this.scrollMytrip();
                    }
                },
                fail: function(res) {
                    my.alert({ content: 'fail' });
                },
                complete: function(res) {
                    my.hideLoading();
                }
            });
        } catch (e) {
            console.log('mySchedulde执行异常:', e);
        }
    }
});
