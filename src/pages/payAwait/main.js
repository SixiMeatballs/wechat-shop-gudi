import Vue from 'vue'
import App from './index'

const app = new Vue(App)
app.$mount()

export default {
    config: {
      navigationBarTitleText: '等待完成支付',
      enablePullDownRefresh: true
    }
  }