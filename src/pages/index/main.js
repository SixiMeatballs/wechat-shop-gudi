import Vue from 'vue'
import App from './index'

const app = new Vue(App)
app.$mount()

export default {
    config: {
      navigationBarTitleText: '微猜商城',
      enablePullDownRefresh: true,
      backgroundTextStyle:"dark",
      onReachBottomDistance: 50
    }
  }