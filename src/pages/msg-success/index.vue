<template>
  <div class="page">
    <div class="weui-msg">
        <div class="weui-msg__icon-area">
            <icon type="success" size="93"></icon>
        </div>
        <div class="weui-msg__text-area">
            <div class="weui-msg__title">支付成功</div>
            <div class="weui-msg__title">支付金额：{{payMoney}}</div>
        </div>
        <div class="weui-msg__opr-area">
            <div class="weui-btn-area">
                <button class="weui-btn" type="primary" @click="openIndex">返回首页</button>
                <button class="weui-btn" type="default" @click="showDetails">查看详情</button>
            </div>
        </div>
        <!-- <div class="weui-msg__extra-area">
            <div class="weui-footer">
                <div class="weui-footer__links">
                    <navigator url="" class="weui-footer__link">底部链接文本</navigator>
                </div>
                <div class="weui-footer__text">Copyright © 2008-2018 weui.io</div>
            </div>
        </div> -->
    </div>
</div>
</template>

<script>
export default {
    data(){
        return{
        	payMoney:0,
        	orderId:0
        }
    },
    methods:{
      openIndex: function () {
        wx.switchTab({
          url: '../index/main'
        })
      },
      showDetails: function () {
    		var _self=this;
        wx.redirectTo({
          url: '../orderDetails/main?orderId='+_self.orderId
        })
      },
    },
  onLoad(option) {
    this.payMoney=option.payMoney;
    this.orderId=option.orderId;
  }
}
</script>

<style>

</style>
