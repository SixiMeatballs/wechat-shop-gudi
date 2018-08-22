import Vue from 'vue'
import App from './App'
import '../static/css/weui.css'
import mpvueToastRegistry from 'mptoast/registry'
mpvueToastRegistry(Vue)
import MainFn from '@/utils/MainFn';
Vue.prototype.$MainFn=MainFn;

import LoginVerify from '@/utils/LoginVerify';
Vue.prototype.$LoginVerify=LoginVerify;

import MpvueRouterPatch from 'mpvue-router-patch'
Vue.use(MpvueRouterPatch)

Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue(App)
app.$mount()

export default {
  // 这个字段走 app.json
  config: {
    // 页面前带有 ^ 符号的，会被编译成首页，其他页面可以选填，我们会自动把 webpack entry 里面的入口页面加进去
    pages: [ 
      '^pages/index/main',
      'pages/goodsShow/main',
      'pages/login/main',
      'pages/discountCoupon/main',
      'pages/beans/main',
      'pages/search/main',
      'pages/address/main',
      'pages/addAddress/main',
      'pages/orderDetails/main',
      'pages/orderConfirmation/main',
      'pages/getPassword/main',
      'pages/msg-fail/main',
      'pages/msg-success/main',
      'pages/payAwait/main',
      'pages/refundApply/main',
      'pages/orderPay/main',
      'pages/expressList/main',
      'pages/expressInfo/main',
      'pages/refundDetails/main',
      
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    },
    tabBar: {
      color: '#999999',
      selectedColor: '#E65248',
      backgroundColor: '#ffffff',
      borderStyle: 'white',
      list: [
        {
          pagePath: 'pages/index/main',
          text: '首页',
          iconPath: 'static/img/home.png',
          selectedIconPath: 'static/img/home-sel.png'
        },
        {
          pagePath: 'pages/shopCart/main',
          text: '购物车',
          iconPath: 'static/img/shopCart.png',
          selectedIconPath: 'static/img/shopCart-sel.png'
        },
        {
          pagePath: 'pages/order/main',
          text: '订单',
          iconPath: 'static/img/order.png',
          selectedIconPath: 'static/img/order-sel.png'
        },
        {
          pagePath: 'pages/my/main',
          text: '我的',
          iconPath: 'static/img/my.png',
          selectedIconPath: 'static/img/my-sel.png'
        }
      ]
    },
    component: 'true',

  }
}
