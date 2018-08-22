<template>
  <div class="container" :style="'height:'+winHeight+'px'">
     <div class="content">
      <div class="navbar">
        <block v-for="(item,index) in tabs" :key="index">
          <div  class="navbar_item" @click="changeActiveIndex(index)">
            <div class="navbar_title">{{item.name}}
               <block v-if="activeIndex == index">(中)</block>
            </div>
          </div>
        </block>
        <div class="navbar_slider" :class="navbarSliderClass"></div>
      </div>
     </div>

     <div class="content"  @touchstart="touchStart($event)" @touchend="touchEnd($event)">
        <div class="goodsOrderItem" v-for="(item,index) in orderListShow" :key='index'>
            <div class="orderTitle">
              <div class="orderNum">订单编号：{{item.OrderSN}}</div>
              <div class="orderState" v-if="item.OrderState== 1">待支付</div>
              <div class="orderState" v-if="item.OrderState== 2">支付超时</div>
              <div class="orderState" v-if="item.OrderState== 3">已支付</div>
              <div class="orderState" v-if="item.OrderState== 4">待发货</div>
              <div class="orderState" v-if="item.OrderState== 5">订单被取消</div>
              <div class="orderState" v-if="item.OrderState== 6">退款中</div>
              <div class="orderState" v-if="item.OrderState== 7">发货中</div>
              <div class="orderState" v-if="item.OrderState== 8">部分发货</div>
              <div class="orderState" v-if="item.OrderState== 9">全部发货</div>
              <div class="orderState" v-if="item.OrderState== 10">交易成功</div>
              <div class="orderState" v-if="item.OrderState== 11">退款成功</div>
              <div class="orderState" v-if="item.OrderState== 12">交易关闭</div>
              <div class="orderState" v-if="item.OrderState== 13">交易取消</div>
              <div class="orderState" v-if="item.OrderState== 14">订单异常,退款中</div>
            </div>
            <div class="orderList" v-for="(v,index2) in item.OrderGoodsList" :key='index2'>
              <div class="items">
                <img :src="v.Cover" alt="" class="goodsImg">
                <div class="goodsInfos">
                  <div class="goodsName">{{v.ModelName}}</div>
                  <div class="goodsParam">{{v.ModelDetails}}</div>
                </div>
                <div class="goodsPrice">
                  <div class="currentPrice">￥{{v.DiscountPrice}}</div>
                  <div class="originalPrice">￥{{v.Price}}</div>
                  <div class="goodsNum">x{{v.Count}}</div>
                </div>
              </div>
            </div>
            <div class="orderNum">
              <div class="nums">共{{item.GoodsCount}}件商品  实付款：</div>
              <div class="orderAmount">￥{{item.TotalPrice}}</div>
            </div>
            <div class="lines"></div>
            <div class="orderButton">
              <div class="cancelBtn" @click="openAlert(item.OrderId,index,'确认取消订单？',2)"  v-if="item.OrderState== 1">取消订单</div>
              <div class="sureBtn" v-if="item.OrderState== 1">去支付</div> 
              <div class="cancelBtn" v-if="item.OrderState== 5 || item.OrderState== 6 || item.OrderState== 14 || item.OrderState== 12">查看原因</div> 
              <div class="cancelBtn" v-if="item.OrderState== 8 || item.OrderState== 9 || item.OrderState== 10">查看物流</div> 
              <div class="cancelBtn" @click="openAlert(item.OrderId,index,'确认删除订单？',1)" v-if="item.OrderState== 2 || item.OrderState== 11 || item.OrderState== 13 || item.OrderState== 12 || item.OrderState== 10">删除订单</div> 
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
      tabs: [
        {
          name: "全部",
          type: "0",
          checked: true
        },
        {
          name: "待支付",
          type: "1",
          checked: true
        },
        {
          name: "待发货",
          type: "2",
          checked: true
        },
        {
          name: "待收货",
          type: "3",
          checked: true
        },
        {
          name: "已完成",
          type: "4",
          checked: true
        }
      ],
      winHeight:null,//页面高度
      lastTime:'',
      orderListShow:null,
      activeIndex:0,
      startX:0,
      endX:0,
    };
  },
  components: {
    mptoast
  },
  computed: {
  },
  methods:{
    //获取我的订单列表
    async GetMyGoodsOrder(){
    	var _self=this;
    	let d={lastTime:_self.lastTime,pageCount:10,orderState:_self.tabs[_self.activeIndex].type};
    	let data = await _self.$MainFn.CallApi('/mall/GetOrderList',d,'');
       console.log(data.Data);
      if(_self.lastTime==''){
        _self.orderListShow=data.Data;
      }
      else{
          _self.orderListShow=_self.orderListShow.concat(data.Data);
      }
    },
    async changeActiveIndex(index){
      var _self=this;
      _self.activeIndex=index;
      _self.lastTime='';
      _self.orderListShow=null;
      _self.GetMyGoodsOrder();
    },
    async touchleft(){
       var _self=this;
       if(_self.activeIndex<=0){
         return;
       }
       let index=_self.activeIndex-1;
       _self.changeActiveIndex(index);
    },
      async touchright(){
       var _self=this;
       var tabslength=_self.tabs.length-1;
       if(_self.activeIndex>=tabslength){
         return;
       }
       let index=_self.activeIndex+1;
       _self.changeActiveIndex(index);
    },
        // 滑动开始
  touchStart(e){
   // 获取移动距离，可以通过打印出e，然后分析e的值得出
    this.startX = e.mp.changedTouches[0].clientX;
  },
  // 滑动结束
  touchEnd(e){
    // 获取移动距离
    this.endX = e.mp.changedTouches[0].clientX + 120; 
     console.log(this.endX)
    if(this.startX-this.endX > 10){
       this.touchright();
}
    else if(this.startX-this.endX < -10){
      
this.touchleft();
    }
  },
  },
  async onPullDownRefresh() {
    wx.showNavigationBarLoading();
  this.lastTime='';
  this.GetMyGoodsOrder();
  wx.hideNavigationBarLoading();
  wx.stopPullDownRefresh();
},
async onReachBottom(){
  wx.showLoading({
      title: '玩命加载中',
    })
   this.lastTime='';
   if(this.orderListShow.length>0){
     this.lastTime=this.orderListShow[this.orderListShow.length-1].ModifyTime;
   }
   this.GetMyGoodsOrder();
   wx.hideLoading();
  wx.stopPullDownRefresh();
},
  onLoad() {
    var res = wx.getSystemInfoSync();
    this.winWidth = res.windowWidth;
    this.winHeight = res.windowHeight;
    this.GetMyGoodsOrder();
  },
};
</script>


<style scoped lang="less">
.content {
  box-sizing: border-box;
  height: 100%;
  padding-top: 50rpx;
  /* overflow: auto; */
  -webkit-overflow-scrolling: touch;
}

.swiper-item {
  height: 100%;
  text-align: center;
}
swiper-item{
  overflow: scroll;
}

.navbar {
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  position: fixed;
  z-index: 500;
  top: 0;
  height: 50px;
  width: 100%;
  background-color: #ffffff;
  border-bottom: 1rpx solid #ccc;
}

.navbar_item {
  position: relative;
  display: block;
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  flex: 1;
  padding: 13px 0;
  text-align: center;
  font-size: 0;
}

.navbar_item .navbar_item_on {
  color:red;
}


.navbar_title {
  color: #333;
  font-weight: 500;
  display: inline-block;
  font-size: 15px;
  max-width: 8em;
  width: auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-wrap: normal;
}

.navbar_slider {
  position: absolute;
  content: " ";
  left: 0;
  bottom: 0;
  width: 100rpx;
  height: 2rpx;
  background-color: #ff0036;
  -webkit-transition: -webkit-transform 0.1s;
  transition: -webkit-transform 0.1s;
  transition: transform 0.1s;
  transition: transform 0.1s, -webkit-transform 0.1s;
}

.navbar_slider_0 {
  left: 29rpx;
  transform: translateX(0);
}
.navbar_slider_1 {
  left: 29rpx;
  transform: translateX(150rpx);
}
.navbar_slider_2 {
  left: 29rpx;
  transform: translateX(300rpx);
}
.navbar_slider_3 {
  left: 29rpx;
  transform: translateX(450rpx);
}
.navbar_slider_4 {
  left: 29rpx;
  transform: translateX(600rpx);
}

.goodsOrderItem{
  display: flex;
  flex-direction: column;
  margin-top: 20rpx;
  background: #ffffff;
  .orderTitle{
    padding: 28rpx 30rpx;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 26rpx;
    color: #333;
    .orderState{
      color: #ff0036;
    }
  }
  .orderList{
    display: flex;
    flex-direction: column;
    .items{
      height: 180rpx;
      min-height: 180rpx;
      background: #f0f0f0;
      padding: 0 30rpx;
      margin-bottom: 6rpx;
      display: flex;
      align-items: center;
      font-size: 26rpx;
      color: #333;
      .goodsImg{
        width: 160rpx;
        height: 160rpx;
      }
      .goodsInfos{
        display: flex;
        flex-direction: column;
        padding: 20rpx ;
        box-sizing: border-box;
        .goodsParam{
          color: #999;
        }
      }
      .goodsPrice{
        display: flex;
        flex-direction: column;
        height: 100%;
        padding-top: 20rpx;
        .originalPrice{
          color: #999;
          text-decoration: line-through;
        }
        .goodsNum{
          align-self: flex-end;
          font-size: 24rpx;
          color: #999;
        }
      }
    }
  }
  .orderNum{
    align-self: flex-end;
    padding: 25rpx 30rpx 25rpx 0;
    box-sizing: border-box;
    display: flex;
    font-size: 26rpx;
    color: #333;
    .orderAmount{
      font-size: 30rpx;
    }
    .orderAmount:first-letter{
      font-size: 20rpx;
    }
  }
  .lines{
    width: 100%;
    height: 1rpx;
    background: #eee;
  }
  .orderButton{
    padding: 10rpx 0;
    box-sizing: border-box; 
    align-self: flex-end;
    display: flex;
    font-size: 26rpx;
    color: #333;
    .cancelBtn{
      width: 140rpx;
      height: 60rpx;
      border: 1px solid #999;
      border-radius:8rpx;
      text-align: center;
      line-height: 60rpx;
    }
    .sureBtn{
      width: 140rpx;
      height: 60rpx;
      border: 1px solid #ff0036;
      border-radius:8rpx;
      color: #ff0036;
      text-align: center;
      line-height: 60rpx;
      margin-left: 30rpx;
      margin-right: 30rpx;
    }
  }
}

</style>
