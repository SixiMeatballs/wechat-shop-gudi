<template>
  <div class="container">
  	 <mptoast />
    <div class="content" v-if="Logined">
      <div class="navbar">
        <block v-for="(item,index) in tabs" :key="index">
          <div :id="index" :class="{'navbar_item_on':activeIndex == index}" class="navbar_item" @click="tabClick">
            <div class="navbar_title">{{item.name}}</div>
          </div>
        </block>
        <div class="navbar_slider" :class="navbarSliderClass"></div>
      </div>
      <swiper class="content" :duration="50" :style="'height:'+contentHeight" :current="currentTab" @change="swiperChange"  @animationfinish="onAnimationfinish">
        <swiper-item v-for="(itemTop,indexTop) in tabs" :key='indexTop'>
          <div class="goodsOrderItem" v-for="(item,index) in orderListShow[itemTop.type]" :key='index'>
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
              <div class="items" @click="ToOrderDetails(item.OrderId)">
                <img :src="v.Cover" alt="" class="goodsImg">
                <div class="goodsInfos">
                  <div class="goodsName">{{v.ModelName}}</div>
                  <div class="goodsParam">{{v.ModelDetails}}</div>
                </div>
                <div class="goodsPrice">
                  <div class="currentPrice">￥{{v.DiscountPrice}}</div>
                  <div class="originalPrice">￥{{v.Price}}</div>
                  <div class="goodsNum">x{{v.Count}}</div>
                  <div class="goods-state" v-if="(v.AfterSaleType==1 || v.AfterSaleType==2) && (v.AfterSaleStatus==1 || v.AfterSaleStatus==7 || v.AfterSaleStatus==2 || v.AfterSaleStatus==4 || v.AfterSaleStatus==8 || v.AfterSaleStatus==10 || v.AfterSaleStatus==11 || v.AfterSaleStatus==13)">退款中</div>
                	<div class="goods-state" v-if="(v.AfterSaleType==1 || v.AfterSaleType==2) && (v.AfterSaleStatus==9 || v.AfterSaleStatus==12 || v.AfterSaleStatus==14)">退款成功</div>
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
              <button class="sureBtns" open-type="getUserInfo" v-if="item.OrderState== 1"  lang="zh_CN" @getuserinfo="payNow(item.OrderId)">去支付</button>
              <div class="cancelBtn" v-if="item.OrderState== 5 || item.OrderState== 6 || item.OrderState== 14 || item.OrderState== 12" @click="ShowErrorReson(item.Remark)">查看原因</div>
              <div class="cancelBtn" @click="openAlert(item.OrderId,index,'确认删除订单？',1)" v-if="item.OrderState== 2 || item.OrderState== 11 || item.OrderState== 13 || item.OrderState== 12 || item.OrderState== 10">删除订单</div>  
              <div class="cancelBtn" v-if="item.OrderState== 8 || item.OrderState== 9 || item.OrderState== 10" @click="ShowLogistics(item.OrderId)">查看物流</div> 
            </div>
          </div>
        </swiper-item>
      </swiper>
    </div>
    
    <div class="toLogin" v-if="!Logined">
      <img src="/static/appImg/blank-icon.png" alt="">
      <span>您还没有登录，请登录后查看订单</span>
      <a class="login-btn" href="/pages/login/main">登录</a>
    </div>

  </div>
</template>

<script>
import mptoast from "mptoast";

import { pay } from '@/utils/Payment'
import { GetUserInfo,showModal } from '@/utils/BaseFn'

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
      activeIndex: 0,
      currentTab: 0,
      winWidth: 0,
      winHeight: 0,
      
      orderList:null,
      orderListShow:[],
      lastTime:[],
      Logined:false
    };
  },
  components: {
    mptoast
  },
  computed: {
    navbarSliderClass() {
      if (this.activeIndex == 0) {
        return "navbar_slider_0";
      }
      if (this.activeIndex == 1) {
        return "navbar_slider_1";
      }
      if (this.activeIndex == 2) {
        return "navbar_slider_2";
      }
      if (this.activeIndex == 3) {
        return "navbar_slider_3";
      }
      if (this.activeIndex == 4) {
        return "navbar_slider_4";
      }
    },
    contentHeight() {
      return this.winHeight + "px";
    }
  },
  methods: {
  	async  payNow(orderId){
  		if(orderId>0){
      	let _self=this;
  			GetUserInfo(function(res){
        	_self.payNow1(orderId);
      	});
      
  		}
  	},
  	async payNow1(orderId){
			let GoodsOrderReadyPayurl = "/Mall/GoodsOrderReadyPay";
			let GoodsOrderReadyPaypar={goodsOrderId:orderId,source:''};
      let GoodsOrderReadyPaydata = await this.$MainFn.CallApi(GoodsOrderReadyPayurl, GoodsOrderReadyPaypar, '');
      if(GoodsOrderReadyPaydata.Data.PayMoney>0){
      	let navigateurl='/pages/payAwait/main?orderId='+orderId+'&payMoney='+GoodsOrderReadyPaydata.Data.PayMoney;
  			wx.navigateTo({url:navigateurl});
  		}else{//跳转0元购页面
				let navigateurl='/pages/orderPay/main?orderId='+orderId+'&totalSecond='+GoodsOrderReadyPaydata.Data.CountdownSecond;
				wx.navigateTo({url:navigateurl});
  		}
  	},
  	//查看物流
  	async ShowLogistics(orderId){
  		let url = '/Mall/GetOrderDeliver';
      let d = {orderId:orderId}
      let data = await this.$MainFn.CallApi(url,d,'');
      let express = data.Data;
    		
    	if(express!=null){
    		if(express.DeliverCount==1){//只有一个包裹直接跳详情
    			let deliverJson=JSON.stringify(express.DeliverList[0]);
    			wx.navigateTo({
        		url: '../expressInfo/main?deliver='+deliverJson
      		})
    		}else{
    			wx.navigateTo({
        		url: '../expressList/main?orderId='+orderId
      		})
				}
    	}
  	},
  	
  	ShowErrorReson(content){
  		wx.showModal({
        title: '原因详情',
        content:content,
        showCancel: false,
        confirmText: '确定',
        confirmColor: '#333',
      });
  	},
  	//跳转订单详情
  	ToOrderDetails(orderId){
  		let navigateurl='/pages/orderDetails/main?orderId='+orderId;
			wx.navigateTo({url:navigateurl});
  	},
    showToast(conetent,state,time) {
      this.$mptoast(conetent, state, time);
    },
    tabClick(e) {
      this.activeIndex = e.currentTarget.id;
      this.currentTab = this.activeIndex;
    },
    swiperChange(e) {
      this.currentTab = e.mp.detail.current;
      this.activeIndex = this.currentTab;
    },
    onAnimationfinish() {
    	var _self=this;
    	var this_table=_self.currentTab;
    	if(_self.orderListShow[this_table]==null){
    		_self.GetMyGoodsOrder('',50,this_table);
    	}
      console.log(this.currentTab + "滑动完成.....");
    },
    //获取我的订单列表
    async GetMyGoodsOrder(lastTime,pageCount,orderState){
      var _self=this;
      _self.Logined=true;
    	var this_table=_self.currentTab;
    	let par={lastTime:lastTime,pageCount:pageCount,orderState:orderState};      
        let obj={};
        obj.url="/MALL/GetOrderList";
        obj.body=par;
        obj.fnunlogin=function(){_self.Logined=false;};
        let data=await _self.$MainFn.Post(obj);

    	_self.orderList=data.Data;
    	if(_self.orderList!=null&&_self.orderList.length>0){
    		_self.lastTime[this_table]=_self.orderList[_self.orderList.length-1].Time;
    	}
    	//获取最新
    	if(lastTime==''){
    		_self.orderListShow[this_table]=_self.orderList;
    	}
    	else{
    		_self.orderListShow[this_table]=_self.orderListShow[this_table].concat(_self.orderList);
    	}
    },
    
    //删除订单
    async DeleteMyGoodsOrder(orderId){
    	var _self=this;
    	var this_table=_self.currentTab;
  		let par={orderId:orderId};
  		let data=await _self.$MainFn.CallApi('/mall/DeleteOrder',par,'');
  		let tempList=[];
  		_self.orderListShow.forEach(function(item){
  			let index=_self.orderListShow.indexOf(item);
  			item=item.filter(function(v){
  				return v.OrderId!=orderId;
  			});
  			tempList[index]=item;
  		});
  		_self.orderListShow=tempList;
  		this.showToast("删除成功","success",2000);
    },
    //取消订单
    async CancelMyGoodsOrder(orderId){
    	var _self=this;
    	var this_table=_self.currentTab;
    	let par={orderId:orderId,type:0};
  		await _self.$MainFn.CallApi('/mall/CancelOrder',par,'');
  		
  		_self.orderListShow.forEach(function(item){
  			item.forEach(function(v){
  				if(v.OrderId==orderId){
  					v.OrderState=13;//状态设置为已取消
  				}
  			});
  		});
    },
    openAlert(orderId,index,content,type){
      wx.showModal({
        title: '',
        content:content,
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#999',
        confirmText: '确定',
        confirmColor: '#DF3E3F',
        success: res => {
          if (res.confirm) {
            console.log('用户点击确定');
            if(type==1){
            	this.DeleteMyGoodsOrder(orderId);
            }
            else if(type==2){
            	this.CancelMyGoodsOrder(orderId);
            }
          }else{
            console.log('用户点击取消')
          }
        }
      });
    }
  },
  async onPullDownRefresh() {
  	var _self=this;
    var this_currentTab=_self.currentTab;
  	wx.showNavigationBarLoading();
		await _self.GetMyGoodsOrder('',50,this_currentTab);
		wx.hideNavigationBarLoading();
		wx.stopPullDownRefresh();
	},
	async onReachBottom(){
  	wx.showLoading({
      title: '玩命加载中',
    })
  	var _self=this;
    var this_currentTab=_self.currentTab;
    if(_self.lastTime[this_currentTab]==null){
    	_self.lastTime[this_currentTab]='';
    }
   	await _self.GetMyGoodsOrder(_self.lastTime[this_currentTab],50,this_currentTab);
   	wx.hideLoading();
  	wx.stopPullDownRefresh();
	},
  onLoad() {
  	var _self=this;
    var res = wx.getSystemInfoSync();
    _self.winWidth = res.windowWidth;
    _self.winHeight = res.windowHeight;
    _self.GetMyGoodsOrder('',50,0);
  },
	onShow(){
		let pages = getCurrentPages();
    let currPage = pages[pages.length - 1];
    let orderId = currPage.data.orderId;
    let type=currPage.data.type;
    var _self=this;
    if(type==1){//删除
    	let tempList=[];
  		_self.orderListShow.forEach(function(item){
  			let index=_self.orderListShow.indexOf(item);
  			item=item.filter(function(v){
  				return v.OrderId!=orderId;
  			});
  			tempList[index]=item;
  		});
  		_self.orderListShow=tempList;
    }else if(type==2){//取消订单
    	_self.orderListShow.forEach(function(item){
  			item.forEach(function(v){
  				if(v.OrderId==orderId){
  					v.OrderState=13;//状态设置为已取消
  				}
  			});
  		});
    }else{
    	_self.GetMyGoodsOrder('',50,_self.currentTab);
    }
	},
  created() {
  }
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
.toLogin{
  width:100%;
  height:100%;
  position: absolute;
  top:0;
  right: 0;
  bottom:0;
  left:0;
  margin:auto;
  background: #f0f0f0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 30rpx;
  color:#333;
  img{
    width:238rpx;
    height: 136rpx;
    margin-bottom: 60rpx; 
  }
  .login-btn{
    width: 240rpx;
    height: 80rpx;
    background:#e65248;
    border-radius:10rpx;
    color: #fff;
    text-align: center;
    line-height: 80rpx;
    margin-top:60rpx;
  }
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
  color: white;
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
      // align-items: center;
      font-size: 26rpx;
      color: #333;
      .goodsImg{
        width: 160rpx;
        height: 160rpx;
        margin-top: 10rpx;
      }
      .goodsInfos{
        flex: 1;
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
        .goods-state{
          font-size: 24rpx;
          color:#ff0036;
        }
      }
    }
  }
  .orderNum{
    align-self: flex-end;
    padding: 25rpx 30rpx 25rpx 0;
    box-sizing: border-box;
    display: flex;
    align-items: center;
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
      margin-right: 30rpx;
    }
    .sureBtn{
      width: 140rpx;
      height: 60rpx;
      border: 1px solid #ff0036;
      border-radius:8rpx;
      color: #ff0036;
      text-align: center;
      line-height: 60rpx;
      /*margin-left: 30rpx;*/
      margin-right: 30rpx;
    }
    .sureBtns{
       width: 140rpx;
       height: 60rpx;
       border: 1px solid #ff0036;
       border-radius:8rpx;
      font-size: 26rpx;
       color: #ff0036;
      text-align: center;
       line-height: 60rpx;
       /*margin-left: 30rpx;*/
      margin-right: 30rpx;
       background:#fff;
    }
  }
}

</style>
