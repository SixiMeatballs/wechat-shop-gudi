<template>
  <div class="container" :style="'height:'+winHeight+'px'">
      <div class="goodsOrderItem" v-if="express!=null">  
        <div class="subtitle">共{{express.DeliverCount}}个包裹</div>
        <!-- 物流信息 -->  
        <div class="goods" v-for="(item,index) in express.DeliverList" :key='index' @click="ToDetails(item)">
          <div class="expressNum">{{item.DeliverCompanyName}}：{{item.DeliverNo}}</div>      
          <div class="items" v-if="item.GoodsFirst!=null">
            <img :src="item.GoodsFirst.Cover" alt="" class="goodsImg">
            <div class="goodsNum">共{{item.GoodsCount}}件商品</div>
            <div class="goodsInfos">
              <div class="goodsName">{{item.GoodsFirst.ModelName}}</div>
              <div class="goodsParam">{{item.GoodsFirst.ModelDetails}}</div>
          		<div class="goodsPrice" v-if="item.DeliverState==0">待揽件</div>
              <div class="goodsPrice" v-else-if="item.DeliverState==1">已揽件</div>
              <div class="goodsPrice" v-else-if="item.DeliverState==3">已签收</div>
              <div class="goodsPrice" v-else>正在邮寄</div>
            </div>
          </div>
        </div>
      </div>  
  </div>
</template>

<script>
import mptoast from "mptoast";

export default {
  data() {
    return {
      winHeight:null,//页面高度
      orderId:0,//订单id
      express:null,//物流包裹信息
    };
  },
  components: {
    mptoast
  },
  computed: {

  },
  methods: {
    showToast(conetent,state,time) {
      this.$mptoast(conetent, state, time);
    },
    ToDetails(deliver){
    	let deliverJson=JSON.stringify(deliver);
    	wx.navigateTo({
        url: '../expressInfo/main?deliver='+deliverJson
      })
    },
    async getExpress(){
      let url = '/Mall/GetOrderDeliver';
      let d = {orderId:this.orderId}
      let data = await this.$MainFn.CallApi(url,d,'');
      this.express = data.Data;
    } 
  },
  async onLoad(option) {
    var res = wx.getSystemInfoSync();
    this.winWidth = res.windowWidth;
    this.winHeight = res.windowHeight;  
    
    this.orderId=option.orderId;
    await this.getExpress();
  },
  created() {    
  }
};
</script>

<style scoped lang="less">
.goodsOrderItem {
  overflow: scroll;
  display: flex;
  flex-direction: column;
  font-size: 30rpx;
  color: #333;
  .goods{
    display: flex;
    flex-direction:column;
    background: #ffffff;
    padding: 30rpx 30rpx;
    margin-bottom: 20rpx;
    .expressNum{
      font-size: 24rpx;
      color:#999;
      margin-bottom:20rpx;
    }
  }
  .subtitle{
    height:60rpx;
    line-height: 60rpx;
    padding-left:30rpx;
    box-sizing: border-box;
  }  
  .items {
    height: 160rpx;
    min-height: 160rpx;
    display: flex;
    align-items: center;
    font-size: 26rpx;
    color: #333;
    position: relative;
    .goodsImg {
      width: 160rpx;
      height: 160rpx;
    }
    .goodsNum{
      width:160rpx;
      background:#000;
      font-size:24rpx;
      color:#fff;
      text-align:center;
      position: absolute;
      bottom:0;
      left:0;
    }
    .goodsInfos {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 20rpx;
      box-sizing: border-box;
      .goodsParam {
        color: #999;
      }
    }
    .goodsPrice {
      color: #ff0036;
      font-size: 30rpx;
      height: 100%;
      padding-top: 20rpx;
    }
  }
}  
</style>
