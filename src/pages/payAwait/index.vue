<template>
  <div class="container" :style="'height:'+winHeight+'px'">
    <div class="tips">支付确认中，请稍后...</div>
    <div class="btn completeBtn" >我已完成支付</div>
    <div class="btn returnBtn" @click="openIndex">返回商城首页</div>
  </div>
</template>

<script>
import mptoast from "mptoast";

import { pay } from '@/utils/Payment'

export default {
  data() {
    return {
      winHeight:null,//页面高度
      OrderId:0,//订单编号
    };
  },
  components: {
    mptoast
  },
  computed: {

  },
  methods: {
  	//支付
  	payNow(orderId,payMoney){
  		var d22={GoodsOrderId:orderId};
      pay(d22,"ORDER1",function(d){
        //支付成功;
        let url2='/pages/msg-success/main?payMoney='+payMoney+'&orderId='+orderId;
  			wx.redirectTo({url:url2});
      },function(d){
      	console.log(orderId)
      	if(d.errMsg=='requestPayment:fail cancel'){
      		//支付取消
      		let url='/pages/orderDetails/main?orderId='+orderId;
  				wx.redirectTo({url});
      	}else{
        	//支付失败;
        	let url2='/pages/msg-fail/main';
  				wx.redirectTo({url:url2});
  			}
      });    
  	},
    showToast(conetent,state,time) {
      this.$mptoast(conetent, state, time);
    },
    openIndex: function () {
      wx.switchTab({
        url: '../index/main'
      })
    },
  },
  onLoad(option) {
    var res = wx.getSystemInfoSync();
    this.winWidth = res.windowWidth;
    this.winHeight = res.windowHeight;
    
    this.OrderId=option.orderId;
    this.payMoney=option.payMoney;
    this.payNow(this.OrderId,this.payMoney);
  },

  created() {
    
  }
};
</script>

<style scoped lang="less">
.tips{
  height: 250rpx;
  text-align: center;
  line-height: 250rpx;
  font-size: 36rpx;
  color: #333;
}
.btn{
  width: 690rpx;
  height: 88rpx;
  border-radius: 10rpx;
  font-size: 30rpx;
  color: #fff;
  text-align: center;
  line-height: 88rpx;
  margin-left: 30rpx;
}
.completeBtn{
  background: #df3e3f;    
  margin-bottom: 30rpx;
}
.returnBtn{
  border: 1rpx solid #df3e3f;
  color: #df3e3f;
}

</style>
