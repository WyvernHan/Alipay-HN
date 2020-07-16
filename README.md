<h1 style="text-align:center;font-size:4em">支付宝小程序框架-介绍</h1>

# 1 文件结构 #

小程序分为app和page两层。app描述整体程序，page描述各个页面。

## 1.1 app文件组成 ##
> 必须放在项目的根目录

+ app.js：应用逻辑
+ app.json：应用配置
+ app.acss：应用样式

### 1.1.1 app.json ###
用于全局配置，决定页面文件的路径、窗口表现、设置网络超时时间、设置多 tab 等。

以下是一个包含了部分配置选项的简单配置app.json

	{
	  "pages": [
	    "pages/index/index",
	    "pages/logs/index"
	  ],
	  "window": {
	    "defaultTitle": "Demo"
	  }
	}

上面配置指定小程序包含两个页面，以及应用窗口的默认标题是 Demo。

|文件|类型|必填|描述|
|::|::|:|:|
| pages | String Array | 是	 | 设置页面路径 |
| window | Object | 否 | 设置默认页面的窗口表现 |
| tabBar | Object | 否 | 设置底部 tab 的表现 |
- （1）pages

pages属性是一个数组，每一项都是字符串，用来指定小程序的页面。每一项代表对应页面的路径信息，数组的第一项代表小程序的首页。小程序中新增/减少页面，都需要对 pages数组进行修改。

页面路径不需要写 js 后缀，框架会自动去加载同名的.json、.js、.axml、.acss文件。

例如，开发目录为：

	pages/
	pages/index/index.axml
	pages/index/index.js
	pages/index/index.acss
	pages/logs/logs.axml
	pages/logs/logs.js
	app.js
	app.json
	app.acss

app.json就要写成下面的样子：

	  "pages":[
	    "pages/index/index",
	    "pages/logs/logs"
	  ]
	}

- (2)window

window属性用于设置小程序通用的的状态栏、导航条、标题、窗口背景色。

子属性包括 titleBarColor defaultTitle pullRefresh allowsBounceVertical。

|文件|类型|必填|描述|
|::|::|:|:|
| titleBarColor | HexColor | 否	 | 导航栏背景色 |
| defaultTitle | String | 否 | 页面标题 |
| pullRefresh | Boolean | 否 | 是否允许下拉刷新。默认 false |
| allowsBounceVertical | String(YES/NO) | 否 | 页面是否支持纵向拽拉超出实际内容。默认 YES |
| optionMenu | Object | 否 | 基础库 1.3.0+ 支持，设置导航栏格外图标，目前支持设置属性 icon，值为图标地址，大小建议 30*30 |

下面是一个例子。

	{
	  "window":{
	    "defaultTitle": "支付宝接口功能演示"
	  }
	}
- （3）tabBar

如果你的小程序是一个多 tab 应用（客户端窗口的底部栏可以切换页面），那么可以通过tabBar配置项指定 tab 栏的表现，以及 tab 切换时显示的对应页面。

注意，通过页面跳转（my.navigateTo）或者页面重定向（my.redirectTo）所到达的页面，即使它是定义在 tabBar 配置中的页面，也不会显示底部的 tab 栏。另外，tabBar 的第一个页面必须是首页。

tabBar 配置

|文件|类型|必填|描述|
|::|::|:|:|
| textColor | HexColor | 否	| 文字颜色 |
| selectedColor | HexColor | 否 | 选中文字颜色 |
| backgroundColor | HexColor | 否 | 背景色 |
| items | Array | 是 | 每个 tab 配置 |

每个 item 配置


|文件|类型|必填|描述|
|::|::|:|:|
| pagePath | HexColor | 是 | 设置页面路径 |
| name | HexColor | 是 | 名称 |
| icon | HexColor | 否 | 平常图标路径 |
| activeIcon | Array | 否 | 高亮图标路径 |

icon 推荐大小为 60*60px 大小，系统会对任意传入的图片非等比拉伸/缩放。

例如：

	{
	  "tabBar": {
	    "textColor": "#dddddd",
	    "selectedColor": "#49a9ee",
	    "backgroundColor": "#ffffff",
	    "items": [
	      {
	        "pagePath": "pages/index/index",
	        "name": "首页"
	      },
	      {
	        "pagePath": "pages/logs/logs",
	        "name": "日志"
	      }
	    ]
	  }
	}

### 1.1.2 app.js ###
	App({
  		onLaunch(options) {
	    	// 小程序初始化
			// 第一次打开
	    	// options.query == {number:1}
  		},
	  	onShow(options) {
	    	// 小程序显示
			// 从后台被 scheme 重新打开
	    	// options.query == {number:1}
	  	},
	  	onHide() {
	    	// 小程序隐藏
	  	},
	  	onError(msg) {
			// 小程序错误
			// 输出日志
	    	console.log(msg)
	  	},
	  	globalData: {
	    	foo: true,
	  	}
	});

参数说明：

|属性|类型|描述|触发时机|
|:|:|:|:|
| onLaunch | Function | 监听小程序初始化	 | 当小程序初始化完成时触发，全局只触发一次） |
| onShow | Function | 监听小程序显示	 | 当小程序启动，或从后台进入前台显示时触发 |
| onHide | Function | 监听小程序隐藏 | 当小程序从前台进入后台时触发 |
| onError | Function | 监听小程序错误 | 当小程序发生 js 错误时触发 |

### 1.1.3 App() ###

App() 接受一个 object 作为参数，用来配置小程序的生命周期。

前台、后台定义： 用户点击左上角关闭，或者按了设备 Home 键离开支付宝时，小程序并不会直接销毁，而是进入了后台，当再次进入支付宝或再次打开小程序时，又会从后台进入前台。

只有当小程序进入后台一定时间，或占用系统资源过高，才会被真正销毁。

- onLaunch/onShow 方法的参数：

|属性|类型|描述|
|::|::|:|
| query | Object | 当前小程序的 query	 |
| path | String | 当前小程序的页面地址 |

> 注意该参数从启动参数的 query 字段解析而来。

例如 url 如下:

    alipays://platformapi/startapp?appId=1999&query=number%3D1

其中的query参数解析如下:

    number%3D1 === encodeURIComponent('number=1')

- getApp()

我们提供了全局的getApp()函数，可以获取到小程序实例，一般用在各个子页面之中获取顶层应用。

    var app = getApp()
    console.log(app.globalData) // 获取 globalData

> 注意：

- App()必须在 app.js 里调用，且不能调用多次。
- 不要在定义于 App() 内定义的函数中调用 getApp()，使用 this 就可以拿到 app 实例。
- 不要在 onLaunch 里调用[getCurrentPages()](https://myapp.alipay.com/developer/framework/page#getCurrentPages()，这个时候 page 还没有生成。
- 通过 getApp() 获取实例之后，不要私自调用生命周期函数。

全局的数据可以在 App() 中设置，各个子页面通过全局函数 getApp() 可以获取全局的应用实例。
    
	// app.js
	App({
  		globalData: 1
	})

	// a.js

	// localValue 只在 a.js 有效
	var localValue = 'a'

	// 生成 app 实例
	var app = getApp()

	// 拿到全局数据，并改变它
	app.globalData++

	// b.js

	// localValue 只在 b.js 有效
	var localValue = 'b'

	// 如果 a.js 先运行，globalData 会返回 2
	console.log(getApp().globalData)

上面代码中，a.js和b.js都声明了变量localValue，它们不会互相影响，因为各个脚本声明的变量和函数只在该文件中有效。

## 1.2 page文件组成 ##

+ js：页面逻辑
+ axml：页面结构
+ acss：页面样式表
+ json：页面配置

> 注意：为了方便开发者，我们规定这四个文件必须具有相同的路径与文件名。

### 1.2.1 介绍 ###
Page代表应用的一个页面，负责页面展示和交互。每个页面对应一个子目录，一般有多少个页面，就有多少个子目录。它也是一个构造函数，用来生成页面实例。

页面初始化时，需要提供数据将作为页面的第一次渲染。
	
	<view>{{title}}</view>
	<view>{{array[0].user}}</view>
xxxx.js

	Page({
	  data: {
	    title: 'Alipay',
	    array: [{user: 'li'}, {user: 'zhao'}]
	  }
	})
定义交互行为时，需要在页面脚本里面指定响应函数。

	<view onTap="handleTap">click me</view>
上面模板定义用户点击时，调用handleTap方法。

	Page({
	  handleTap() {
	    console.log('yo! view tap!')
	  }
	})
页面重新渲染，需要在页面脚本里面调用this.setData方法。

	<view>{{text}}</view>
	<button onTap="changeText"> Change normal data </button>
上面代码指定用户触摸按钮时，调用changeText方法。

	Page({
	  data: {
	    text: 'init data',
	  },
	  changeText() {
	    this.setData({
	      text: 'changed data'
	    })
	  },
	})
上面代码中，changeText方法里面调用this.setData方法，会导致页面的重新渲染。
### 1.2.2 Page() ###
Page() 接受一个 object 作为参数，该参数用来指定页面的初始数据、生命周期函数、事件处理函数等。

	//index.js
	Page({
	  data: {
	    title: "Alipay"
	  },
	  onLoad(query) {
	    // 页面加载
	  },
	  onReady() {
	    // 页面加载完成
	  },
	  onShow() {
	    // 页面显示
	  },
	  onHide() {
	    // 页面隐藏
	  },
	  onUnload() {
	    // 页面被关闭
	  },
	  onTitleClick() {
	    // 标题被点击
	  },
	  onPullDownRefresh() {
	    // 页面被下拉
	  },
	  onReachBottom() {
	    // 页面被拉到底部
	  },
	  onShareAppMessage() {
	   // 返回自定义分享信息
	  },
	  viewTap() {
	    // 事件处理
	    this.setData({
	      text: 'Set data for updat.'
	    })
	  },
	  go() {
	    // 带参数的跳转，从 page/index 的 onLoad 函数的 query 中读取 xx
	    my.navigateTo('/page/index?xx=1')
	  },
	  customData: {
	    hi: 'alipay'
	  }
	})
Page()方法的参数对象说明：

|属性|类型|描述|
|::|::|:|
| data | Object or Function| 初始数据或返回初始化数据的函数 |
| onTitleClick | Function | 点击标题触发 |
| onOptionMenuClick	| Function | 基础库 1.3.0+ 支持，点击格外导航栏图标触发 |
| onPageScroll | Function({scrollTop}) | 页面滚动时触发 |
| onLoad | Function(query: Object) | 页面加载时触发 |
| onReady | Function | 页面初次渲染完成时触发 |
| onShow | Function	| 页面显示时触发 |
| onHide | Function	| 页面隐藏时触发 |
| onUnload | Function | 页面卸载时触发 |
| onPullDownRefresh | Function | 页面下拉时触发 |
| onReachBottom | Function | 上拉触底时触发 |
| onShareAppMessage | Function | 点击右上角分享时触发 |
其他	Any	开发者可以添加任意的函数或属性到 object 参数中，在页面的函数中可以用 this 来访问

- （1）生命周期方法的说明
 - onLoad: 页面加载。一个页面只会调用一次，query 参数为 my.navigateTo和 my.redirectTo 中传递的 query 对象。
 - onShow: 页面显示。每次打开页面都会调用一次。
 - onReady: 页面初次渲染完成。一个页面只会调用一次，代表页面已经准备妥当，可以和视图层进行交互。对界面的设置，如my.setNavigationBarTitle请在onReady之后设置，详见生命周期。
 - onHide: 页面隐藏。当navigateTo或底部tab切换时调用。
 - onUnload: 页面卸载。当redirectTo或navigateBack的时候调用。
- （2）事件处理函数的说明
 - onPullDownRefresh: 下拉刷新。监听用户下拉刷新事件，需要在app.json的window选项中开启pullRefresh，当处理完数据刷新后，my.stopPullDownRefresh可以停止当前页面的下拉刷新。
 - onShareAppMessage: 用户分享，详见分享。

### 1.2.3 Page.prototype.setData() ###
setData函数用于将数据从逻辑层发送到视图层，同时改变对应的this.data的值。

> 注意：
> 
1. 直接修改this.data无效，无法改变页面的状态，还会造成数据不一致。
2. 请尽量避免一次设置过多的数据。
setData接受一个对象作为参数。对象的键名key可以非常灵活，以数据路径的形式给出，如 array[2].message、a.b.c.d，并且不需要在this.data中预先定义。

示例代码axml：

	<view>{{text}}</view>
	<button onTap="changeTitle"> Change normal data </button>
	<view>{{array[0].text}}</view>
	<button onTap="changeArray"> Change Array data </button>
	<view>{{object.text}}</view>
	<button onTap="changePlanetColor"> Change Object data </button>
	<view>{{newField.text}}</view>
	<button onTap="addNewKey"> Add new data </button>

示例代码js：

	Page({
	  data: {
	    text: 'test',
	    array: [{text: 'a'}],
	    object: {
	      text: 'blue'
	    }
	  },
	  changeTitle() {
	    // 错误！不要直接去修改 data 里的数据
	    // this.data.text = 'changed data'  
	    // 正确
	    this.setData({
	      text: 'ha'
	    })
	  },
	  changeArray() {
	    // 可以直接使用数据路径来修改数据
	    this.setData({
	      'array[0].text':'b'
	    })
	  },
	  changePlanetColor(){
	    this.setData({
	      'object.text': 'red'
	    });
	  },
	  addNewKey() {
	    this.setData({
	      'newField.text': 'c'
	    })
	  }
	})

### 1.2.4 getCurrentPages() ###
getCurrentPages()函数用于获取当前页面栈的实例，以数组形式按栈的顺序给出，第一个元素为首页，最后一个元素为当前页面。下面代码可以用于检测当前页面栈是否具有5层页面深度。

	if(getCurrentPages().length === 5) {
	  my.redirectTo('/xx');
	} else {
	  my.navigateTo('/xx');
	}
> 注意：不要尝试修改页面栈，会导致路由以及页面状态错误。

框架以栈的形式维护了当前的所有页面。 当发生路由切换的时候，页面栈的表现如下：

| 路由方式 | 页面栈表现 |
| : | : |
| 初始化	| 新页面入栈 |
| 打开新页面	| 新页面入栈 |
| 页面重定向	| 当前页面出栈，新页面入栈 |
| 页面返回 | 当前页面出栈 |
| Tab 切换 | 页面全部出栈，只留下新的 Tab 页面 |

### 1.2.5 page.json ###
每一个页面也可以使用[page名].json文件来对本页面的窗口表现进行配置。

页面的配置比app.json全局配置简单得多，只能设置window相关的配置项，所以无需写window这个键。
> 注意：页面配置会覆盖app.json的window属性中的配置项。

### 1.2.6 page 样式 ###
每个页面中的根元素为 page，需要设置高度或者背景色时，可以利用这个元素。

	page {
	  background-color: #fff;
	}

# 2 视图层·axml #
视图文件的后缀名是axml，定义了页面的标签结构。

## 2.1 数据绑定 ##
	<view> {{message}} </view>
page.js

	Page({
	  data: {
	    message: 'Hello alipay!'
	  }
	})
## 2.2 列表渲染 ##
	<view a:for="{{items}}"> {{item}} </view>
page.js

	Page({
	  data: {
	    items: [1, 2, 3, 4, 5, 6, 7]
	  }
	})
## 2.3 条件渲染 ##
	<view a:if="{{view == 'WEBVIEW'}}"> WEBVIEW </view>
	<view a:elif="{{view == 'APP'}}"> APP </view>
	<view a:else="{{view == 'alipay'}}"> alipay </view>
page.js

	Page({
	  data: {
	    view: 'alipay'
	  }
	})
## 2.4 模板 ##
	template name="staffName">
	  <view>
	    FirstName: {{firstName}}, LastName: {{lastName}}
	  </view>
	</template>
	<template is="staffName" data="{{...staffA}}"></template>
	<template is="staffName" data="{{...staffB}}"></template>
	<template is="staffName" data="{{...staffC}}"></template>
page.js

	Page({
	  data: {
	    staffA: {firstName: 'san', lastName: 'zhang'},
	    staffB: {firstName: 'si', lastName: 'li'},
	    staffC: {firstName: 'wu', lastName: 'wang'},
	  },
	})
## 2.5 事件 ##
# 3 逻辑结构 #

小程序的核心是一个响应式的数据绑定系统，逻辑上分为“视图层“和”逻辑层“。这两层始终保持同步，只要在逻辑层修改数据，视图层就会相应的更新。

> 注意：由于框架并非运行在浏览器中，所以 JavaScript 在 web 中的一些能力都无法使用，如 document、window等对象。
逻辑层 js 可以用 es2015/es6 模块化语法组织代码，也支持从 node_modules 目录载入第三方模块。

例如：

    import util from './util'; // 载入相对路径；

    import absolute from '/absolute'; // 载入项目跟路径文件；

    import lodash from 'lodash'; // 载入第三方 npm 模块；
