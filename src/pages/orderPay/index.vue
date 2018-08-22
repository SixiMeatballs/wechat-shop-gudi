<template>
  <div class="container" :style="'height:'+winHeight+'px'">
  		<mptoast />
      <div class="orderPay">
        <div class="payNum">￥0.00</div>
        <div class="time">支付剩余时间{{minute}}:{{second}}请尽快付款</div>
      </div>
      <div class="btn" @click="Confirm">确认下单</div>
  </div>
</template>

<script>
import mptoast from "mptoast";

export default {
  data() {
    return {
      winHeight:null,//页面高度
      orderId:0,//订单id
      seconds:60,//秒数
      minutes:0,//分钟数
      timeInterval:null,//定时器
    };
  },
  components: {
    mptoast
  },
  computed: {
		second() {
			console.log('second')
      return this.num(this.seconds)
    },
    minute() {
    	console.log('minute')
      return this.num(this.minutes)
    }
  },
  methods: {
    showToast(conetent,state,time) {
      this.$mptoast(conetent, state, time);
    },
    async Confirm(){
    	let par={orderId:this.orderId};
    	let url = "/Mall/ConfirmGoodsOrder";
    	let data = await this.$MainFn.CallApi(url, par, "");
    	if(data.ErrorCode==0){
    		clearInterval(this.timeInterval)
    		this.showToast('下单成功','success',2000);
    		this.openIndex();
    	}
    },
    num(n) {
      return n < 10 ? '0' + n : '' + n
    },
    openIndex() {
    	var time=setInterval(function(){
    		clearInterval(time);
      	wx.switchTab({
        	url: '../index/main'
      	})
     	},2000);
    },
		add(){
      var _this = this
      clearInterval(_this.timeInterval)
      _this.timeInterval = setInterval(function () {
        if (_this.seconds === 0 && _this.minutes !== 0) {
          _this.seconds = 59
          _this.minutes -= 1
        } else if (_this.minutes === 0 && _this.seconds === 0) {
          _this.seconds = 0
          clearInterval(_this.timeInterval)
          _this.showToast('支付超时','success',2000);
          _this.openIndex();
        } else {
        	_this.seconds -= 1
        }
      }, 1000)
    }
  },
  watch: {
    second: {
      handler (newVal) {
        this.num(newVal)
      }
    },
    minute: {
     	handler (newVal) {
        this.num(newVal)
      }
    }
  },
  onLoad(option) {
    var res = wx.getSystemInfoSync();
    this.winWidth = res.windowWidth;
    this.winHeight = res.windowHeight;  
    
    let totalSecond=option.totalSecond;
    this.orderId=option.orderId;
    this.minutes=Math.floor(totalSecond/60);
    this.seconds=totalSecond%60;
  	this.add();
  },
  created() {    
  }
};
</script>

<style scoped lang="less">
.orderPay{
  height:240rpx;
  display:flex;
  flex-direction:column;
  justify-content: center;
  align-items: center;
  margin-top: 20rpx;
  background: #fff;
  font-size: 28rpx;
  color:#333;
  .payNum{
    font-size: 48rpx;
  }
  .payNum:first-letter{
    font-size: 36rpx;
  }
}
.btn{
  width: 690;
  height: 100rpx;
  background: #F62D4A;
  font-size: 30rpx;
  color: #fff;
  text-align: center;
  line-height: 100rpx;
  margin: 30rpx;
  border-radius: 10rpx;
}

</style>
