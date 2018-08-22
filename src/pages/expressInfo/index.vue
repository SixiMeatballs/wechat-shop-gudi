<template>
  <div class="container" :style="'height:'+winHeight+'px'">
      <div class="goodsOrderItem" v-if="express!=null">  
        <!-- 物流状态 -->        
        <div class="items">
          <img :src="express.GoodsFirst.Cover" alt="" class="goodsImg">
          <div class="goodsInfos">
          	<div class="currentPrice" v-if="express.DeliverState==0">待揽件</div>
            <div class="currentPrice" v-else-if="express.DeliverState==1">已揽件</div>
            <div class="currentPrice" v-else-if="express.DeliverState==3">已签收</div>
            <div class="currentPrice" v-else>运输中</div>
            <div class="goodsName">{{express.DeliverCompanyName}}：{{express.DeliverNo}}</div>
            <div class="goodsParam">官方电话：{{express.DeliverCompanyPhone}}</div>
          </div>
        </div>  
        <!-- 物流信息-->
        <div class="expressInfos">
          <div class="address-item">
            <div class="dates"></div>
            <div class="state">
              <img src="/static/appImg/address-icon.png" alt="failed">
            </div>
            <div class="description">[收货地址]{{express.Address}}</div>
          </div>
          <div class="address-item" v-for="(v,index) in express.Details" :key="index">
            <div class="dates">
              <div class="time">{{v.Time}}</div>
              <div class="date">{{v.Date}}</div>  
            </div>
            <div class="state">
              <div class="circle" :class="{cricleState:index==0}"></div>
              <div class="line"></div>
            </div>
            <div class="description">{{v.Description}}</div>
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
      winHeight:null,//页面高度\
      express:null,
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
    async getExpress(){
      let url = '/Mall/GetOrderDeliver';
      let d = {orderId:207}
      let data = await this.$MainFn.CallApi(url,d,'031E2E15-01F7-48AD-AB30-F72698CB19B8');
      let expressList = data.Data.DeliverList[0].Details;
      console.log(expressList);
      console.log(data);
    } 
  },
  onLoad(option) {
    var res = wx.getSystemInfoSync();
    this.winWidth = res.windowWidth;
    this.winHeight = res.windowHeight; 
    let expressJosn=option.deliver; 
    this.express=JSON.parse(expressJosn);
  },
};
</script>

<style scoped lang="less">
.goodsOrderItem {
  overflow: scroll;
  display: flex;
  flex-direction: column;
  margin-top: 20rpx;
  margin-bottom: 120rpx;
  font-size: 30rpx;
  color: #333;
  .currentPrice{
    font-size: 30rpx;
    color: #ff0036;
  }
  .items {
    height: 180rpx;
    min-height: 180rpx;
    background: #ffffff;
    padding: 30rpx 30rpx;
    margin-bottom: 20rpx;
    display: flex;
    align-items: center;
    font-size: 26rpx;
    color: #999;
    .goodsImg {
      width: 160rpx;
      height: 160rpx;
    }
    .goodsInfos {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 20rpx;
      box-sizing: border-box;
    }
  }
  .expressInfos{
    background: #ffffff;
    padding: 30rpx;
    box-sizing: border-box;
    color:#333;
    font-size: 24rpx;
    .address-item{
      display: flex;
      height: 120rpx;
      .dates{
        width:150rpx;
        height: 120rpx;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items:center;
      }
      .state{
        width: 32rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin:0 20rpx;
        img{
          width:36rpx;
          height:36rpx;
        }
        .circle{
          width: 16rpx;
          height: 16rpx;
          border-radius: 50%;
          background:#ddd;
        }
        .cricleState{
          width: 32rpx;
          height: 32rpx;
          background:#ff0036;
        }
        .line{
          flex:1;
          width:2rpx;
          height:88rpx;
          background:#ddd;
        }
      }
      .description{
        flex:1;
      }
    }
    
  }
}

</style>
