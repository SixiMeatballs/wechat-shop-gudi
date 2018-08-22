<template>
  <div class="container" :style="'height:'+winHeight+'px'">
    <div class="details" :style="'height:'+winHeight+'px'" v-if="orderDetails!=null && stateInfo!=null">
      <!-- 支付状态 -->
      <div class="orderState">
        <div class="state">
          <span>{{stateInfo.Title}}</span>
          <span class="times">{{stateInfo.MiniTitle}}</span>
        </div>
        	<img :src="stateInfo.TitleImg" alt="" v-if="stateInfo.TitleImg!=''">
      </div>
      
      <!-- 用户地址 -->
      <div class="userPosition" v-if="orderDetails.Address!=null">
        <img src="/static/appImg/address-icon.png" alt="">
        <div class="position">
          <div class="userInfo">
            <div class="userName">{{orderDetails.Address.MailName}}</div>
            <div class="userPhone">{{orderDetails.Address.MailPhone}}</div>
          </div>
          <div class="userAddress">{{orderDetails.Address.FullAddress}}</div>
        </div>
      </div>

      <!-- 商品信息 -->
      <div class="goodsOrderItem">
        <div class="orderTitle">
          <div class="orderNum">订单编号：{{orderDetails.OrderSN}}</div>
          <div class="contactService" @click="phoneCall()">
            <span>联系客服</span>
            <img src="/static/appImg/Customer.png" alt="">
          </div>
        </div>
        <div class="orderList">
          <div class="orderInfo-item" v-for="(item,index) in stateGoodsList" :key='index'>
            <div class="items" @click="ToGoodsDetails(item.GoodsId)">
              <img :src="item.Cover" alt="" class="goodsImg">
              <div class="goodsInfos">
                <div class="goodsName">{{item.ModelName}}</div>
                <div class="goodsParam">{{item.ModelDetails}}</div>
              </div>
              <div class="goodsPrice">
                <div class="currentPrice">￥{{item.DiscountPrice}}</div>
                <div class="originalPrice">￥{{item.Price}}</div>
                <div class="goodsNum">x{{item.Count}}</div>
              </div>
            </div>
            <div class="couponTips">使用{{item.UseGoldCount}}抵扣券抵扣{{item.UseGoldMoney}}</div>
            <div class="refund">
              <div class="refundBtn" v-if="item.GoodsSHBtnCont!=''" @click="GoodsSHBtnClick(item,orderDetails.Address)">{{item.GoodsSHBtnCont}}</div>
              <div class="refundBtn" v-if="item.GoodsTKBtnCont!=''" @click="GoodsTKBtnClick(item,orderDetails.Address)">{{item.GoodsTKBtnCont}}</div>
            </div>
          </div>
          <div class="lines"></div>
        </div>
      </div>

      <!-- 费用 -->
      <div class="costList">
        <div class="costItem">
          <span>运费</span>
          <span>+￥{{orderDetails.ShippingFee}}</span>
        </div>
        <div class="costItem" v-if="totalGoldInfo!=null">
          <span>{{totalGoldInfo.totalGoldCount}}抵扣券</span>
          <span>-￥{{totalGoldInfo.totalGoldMoney}}</span>
        </div>
        <div class="costItem" v-if="VipDeratePrice>0">
          <span>会员折扣：</span>
          <span>-￥{{VipDeratePrice}}</span>
        </div>
        <div class="costItem" v-if="orderDetails.CouponList!=null" v-for="(item,index) in orderDetails.CouponList" :key='index'>
          <span>优惠卡：{{item.DenominationName}} x{{item.Number}}</span>
          <span>-￥{{item.MinusValue*item.Number}}</span>
        </div>
        <div class="allCost">
          <span>实付款(含运费)</span>
          <span class="total">￥{{orderDetails.TotalPrice}}</span>
        </div>
      </div>

      <!-- 订单编号时间 -->
      <div class="orderInfo">
        <div class="orderNum">
          <span>订单编号：{{orderNum}}</span>
          <div class="copy" @click="copyFn()">复制</div>
        </div>
        <div class="creationTime" v-if="stateInfo.Remark1!=''">{{stateInfo.Remark1}}</div>
        <div class="paymentTime" v-if="stateInfo.Remark2!=''">{{stateInfo.Remark2}}</div> 
        <div class="paymentTime" v-if="stateInfo.Remark3!=''">{{stateInfo.Remark3}}</div> 
      </div>

      <div class="orderButton" v-if="stateInfo.OrderLeftBtnCont!='' || stateInfo.OrderRightBtnCont!=''">
        <div class="cancelBtn" v-if="stateInfo.OrderLeftBtnCont!=''" @click="OrderLeftBtnClick()">{{stateInfo.OrderLeftBtnCont}}</div>
        <div v-if="stateInfo.OrderRightBtnCont!=''">
        	<button class="sureBtn" open-type="getUserInfo" lang="zh_CN" @getuserinfo="payNow()" v-if="orderDetails.OrderState==1">{{stateInfo.OrderRightBtnCont}}</button>
       		<div class="cancelBtn" @click="OrderRightBtnClick()" v-else >{{stateInfo.OrderRightBtnCont}}</div>
        </div>
      </div>
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
      orderNum:"1023355588566556665",
      winHeight:null,
      orderDetails:null,//订单详情
      orderId:0,//订单id
      
      stateInfo:null,//根据状态不同显示不同数据
      totalGoldInfo:null,//使用抵扣券情况
      VipDeratePrice:0,//会员折扣优惠
      stateGoodsList:[],//根据商品不同售后状态显示不同数据信息
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
    ToGoodsDetails(goodsId){
    	let url='/pages/goodsShow/main?id='+goodsId;
      wx.navigateTo({ url});
    },
    phoneCall(){
      wx.makePhoneCall({
        phoneNumber: '057187820281',
        success: (res)=>{
          console.log(res);
        }
      });
    },
    //复制订单号
    copyFn(){
      wx.setClipboardData({
        data: this.orderNum,
        success: res => {
          console.log(res);
          this.showToast(res,'success',2000);
        }
      });
    },
    OrderLeftBtnClick(){
    	var _self=this;
    	if(_self.orderDetails.orderState==1){
    		_self.openAlert("确认要取消该订单？",2);
    	}else if(_self.orderDetails.orderState==10){
    		_self.openAlert("确认要删除该订单？",1);
    	}else if(_self.orderDetails.orderState==12){
    		wx.showModal({
        	title: '原因详情',
        	content:_self.orderDetails.Remark,
        	showCancel: false,
        	confirmText: '确定',
        	confirmColor: '#333',
      	});
    	}
    },
    async OrderRightBtnClick(){
    	var _self=this;
    	if(_self.orderDetails.orderState==2 || _self.orderDetails.orderState==11 || _self.orderDetails.orderState==12 || _self.orderDetails.orderState==13){
    		_self.openAlert("确认要删除该订单？",1);
    	}else if(_self.orderDetails.orderState==8 || _self.orderDetails.orderState==9 || _self.orderDetails.orderState==10){
    		let url = '/Mall/GetOrderDeliver';
      	let d = {orderId:_self.orderId}
      	let data = await _self.$MainFn.CallApi(url,d,'');
      	let express = data.Data;
    		
    		if(express!=null){
    			if(express.DeliverCount==1){//只有一个包裹直接跳详情
    				let deliverJson=JSON.stringify(express.DeliverList[0]);
    				wx.navigateTo({
        			url: '../expressInfo/main?deliver='+deliverJson
      			})
    			}else{
    				wx.navigateTo({
        			url: '../expressList/main?orderId='+this.orderId
      			})
					}
    		}
    	}else if(_self.orderDetails.orderState==5 || _self.orderDetails.orderState==6 || _self.orderDetails.orderState==14){
    		wx.showModal({
        	title: '原因详情',
        	content:_self.orderDetails.Remark,
        	showCancel: false,
        	confirmText: '确定',
        	confirmColor: '#333',
      	});
    	}
    },
    GoodsTKBtnClick(goods,address){
    	var d={};
      d.goodsName=goods.ModelName;
      d.goodsParam=goods.ModelDetails;
      d.goodsImg=goods.Cover;
      d.currentPrice=goods.DiscountPrice;
      d.goodsNum=goods.Count;
      d.userName=address.MailName;

      d.userPhone=address.MailPhone;
      d.Province=address.Province;
      d.Prefecture=address.Prefecture;
      d.County=address.County;
      d.AddressDetail=address.AddressDetail;
      d.OrderId=this.orderId;
      d.ModelId=goods.ModelId;
      d.GoodsId=goods.GoodsId;

      d.OrderNo=this.orderDetails.OrderSN;
      d.originalPrice=goods.Price;
      d.afterSaleId=goods.AfterSaleId;
    	if(goods.GoodsTKBtnCont=='申请退款'){
    		d.RefundType=1;//类型1.退款 0.售后
      	let json=JSON.stringify(d);
    		wx.navigateTo({
        	url: '../refundApply/main?v='+json
      	})
    }else{
    		d.RefundType=1;//类型1.退款 0.售后
      	let json=JSON.stringify(d);
      	wx.navigateTo({
        	url: '../refundDetails/main?v='+json
      	})
    	}
    },
    GoodsSHBtnClick(goods,address){
    	var d={};
      d.goodsName=goods.ModelName;
      d.goodsParam=goods.ModelDetails;
      d.goodsImg=goods.Cover;
      d.currentPrice=goods.DiscountPrice;
      d.goodsNum=goods.Count;
      d.userName=address.MailName;

      d.userPhone=address.MailPhone;
      d.Province=address.Province;
      d.Prefecture=address.Prefecture;
      d.County=address.County;
      d.AddressDetail=address.AddressDetail;
      d.OrderId=this.orderId;
      d.ModelId=goods.ModelId;
      d.GoodsId=goods.GoodsId;

      d.OrderNo=this.orderDetails.OrderSN;
      d.originalPrice=goods.Price;
      d.afterSaleId=goods.AfterSaleId;
    	if(goods.GoodsSHBtnCont=='申请售后'){
    		d.RefundType=0;//类型1.退款 0.售后
      	let json=JSON.stringify(d);
    		wx.navigateTo({
        	url: '../refundApply/main?v='+json
      	})
    	}else{
    		d.RefundType=goods.AfterSaleType;//3换货 4维修
      	let json=JSON.stringify(d);
    		wx.navigateTo({
        	url: '../refundDetails/main?v='+json
      	})
    	}
    },
    openAlert(content,type){
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
            if(type==1){
            	this.DeleteOrder();
            }
            else if(type==2){
            	this.CancelOrder();
            }
          }else{
            console.log('用户点击取消')
          }
        }
      });
    },
    //退款：1申请退款 2审核通过 3审核拒绝 4同意退款 5拒绝退款 6撤销申请 7重新申请 8退款处理中 9退款成功 10订单作废 11退款处理中（管理员） 12退款成功（管理员）13退款处理中（系统） 14退款成功（系统）
    //售后：1申请售后 2审核拒绝 3售后处理中 4售后处理中 5售后拒绝 6售后已处理 7售后已解决 8撤销申请 9重新申请
    GetGoodsBtnState(AfterSaleType,AfterSaleStatus){
    	let temp={};
    	if(AfterSaleType==0){//无售后
    		temp.GoodsTKBtnCont='申请退款';
    		temp.GoodsSHBtnCont='申请售后';
    	}else if(AfterSaleType==1 || AfterSaleType==2){//退款or退货
    		if(AfterSaleStatus==1 || AfterSaleStatus==7){
    			temp.GoodsTKBtnCont='退款申请中';
    			temp.GoodsSHBtnCont='';
    		}else if(AfterSaleStatus==2){
    			temp.GoodsTKBtnCont='退款审核通过';
    			temp.GoodsSHBtnCont='';
    		}else if(AfterSaleStatus==3){
    			temp.GoodsTKBtnCont='退款申请被拒绝';
    			temp.GoodsSHBtnCont='';
    		}else if(AfterSaleStatus==4){
    			temp.GoodsTKBtnCont='同意退款';
    			temp.GoodsSHBtnCont='';
    		}else if(AfterSaleStatus==5){
    			temp.GoodsTKBtnCont='退款被拒绝';
    			temp.GoodsSHBtnCont='';
    		}else if(AfterSaleStatus==6){
    			temp.GoodsTKBtnCont='申请退款';
    			temp.GoodsSHBtnCont='';
    		}else if(AfterSaleStatus==8 || AfterSaleStatus==10 || AfterSaleStatus==11 ||AfterSaleStatus==13){
    			temp.GoodsTKBtnCont='退款处理中';
    			temp.GoodsSHBtnCont='';
    		}else if(AfterSaleStatus==9 || AfterSaleStatus==12 || AfterSaleStatus==14){
    			temp.GoodsTKBtnCont='退款成功';
    			temp.GoodsSHBtnCont='';
    		}else{
    			temp.GoodsTKBtnCont='';
    			temp.GoodsSHBtnCont='';
    		}
    	}else if(AfterSaleType==3 || AfterSaleType==4){//换货or维修
    		if(AfterSaleStatus==1 || AfterSaleStatus==9){
    			temp.GoodsTKBtnCont='';
    			temp.GoodsSHBtnCont='售后申请中';
    		}else if(AfterSaleStatus==2){
    			temp.GoodsTKBtnCont='';
    			temp.GoodsSHBtnCont='售后审核通过';
    		}else if(AfterSaleStatus==3){
    			temp.GoodsTKBtnCont='';
    			temp.GoodsSHBtnCont='售后申请被拒绝';
    		}else if(AfterSaleStatus==4){
    			temp.GoodsTKBtnCont='';
    			temp.GoodsSHBtnCont='售后处理中';
    		}else if(AfterSaleStatus==5){
    			temp.GoodsTKBtnCont='';
    			temp.GoodsSHBtnCont='售后被拒绝';
    		}else if(AfterSaleStatus==6){
    			temp.GoodsTKBtnCont='';
    			temp.GoodsSHBtnCont='售后已处理';
    		}else if(AfterSaleStatus==7 || AfterSaleStatus==8){
    			temp.GoodsTKBtnCont='申请退款';
    			temp.GoodsSHBtnCont='申请售后';
    		}else{
    			temp.GoodsTKBtnCont='';
    			temp.GoodsSHBtnCont='';
    		}
    	}else{
    		temp.GoodsTKBtnCont='';
    		temp.GoodsSHBtnCont='';
    	}
    	return temp;
    },
    //数据初始化
    DataLoad(){
    	var orderdetailsTemp=this.orderDetails;
    	if(orderdetailsTemp!=null){
    		//判断商品按钮内容
    		let goodsListTemp=[];
    		orderdetailsTemp.OrderGoodsList.forEach(function(item){
    			let temp=item;
    			if(orderdetailsTemp.OrderState==1 || orderdetailsTemp.OrderState==2 || orderdetailsTemp.OrderState==11 || orderdetailsTemp.OrderState==12 || orderdetailsTemp.OrderState==13
    			|| orderdetailsTemp.OrderState==5 || orderdetailsTemp.OrderState==6  || orderdetailsTemp.OrderState==14){//不显示按钮
    				temp.GoodsTKBtnCont='';
    				temp.GoodsSHBtnCont='';
    			}else if(orderdetailsTemp.OrderState==3 || orderdetailsTemp.OrderState==4 || orderdetailsTemp.OrderState==7){//已支付or待发货只能退款
    				let t=this.GetGoodsBtnState(item.AfterSaleType,item.AfterSaleStatus);
    				temp.GoodsTKBtnCont=t.GoodsTKBtnCont;
    				temp.GoodsSHBtnCont='';
    			}else if(orderdetailsTemp.OrderState==8 || orderdetailsTemp.OrderState==9 || orderdetailsTemp.OrderState==10){
    				let t=this.GetGoodsBtnState(item.AfterSaleType,item.AfterSaleStatus);
    				temp.GoodsTKBtnCont=t.GoodsTKBtnCont;
    				temp.GoodsSHBtnCont=t.GoodsSHBtnCont;
    			}else{
    				temp.GoodsTKBtnCont='';
    				temp.GoodsSHBtnCont='';
    			}
    			goodsListTemp.push(temp);
    		},this);
    		this.stateGoodsList=goodsListTemp;
    		let totalGoldCount=0;
    		let totalGoldMoney=0;
    		let VipDeratePrice=0;
    		orderdetailsTemp.OrderGoodsList.forEach(function(item){
    			totalGoldCount=totalGoldCount+item.UseGoldCount;
    			totalGoldMoney=totalGoldMoney+item.UseGoldMoney;
    			VipDeratePrice=VipDeratePrice+item.VipDeratePrice;
    		});
    		if(totalGoldCount>0&&totalGoldMoney>0){
    			this.totalGoldInfo={totalGoldCount:totalGoldCount,totalGoldMoney:totalGoldMoney};
    		}
    		this.VipDeratePrice=VipDeratePrice;
    	
    		let info={};
    		//orderdetailsTemp.OrderState：1未支付 2支付超时 3已支付 4待发货 5取消订单（系统） 6订单退款处理中 7订单发货处理中 8部分发货 9全部发货 10交易成功 11退款成功 12交易关闭 13交易取消（用户）14订单错误（系统） 
    		if(orderdetailsTemp.OrderState==1){//未支付
    			info.Title='待支付';
    			info.MiniTitle='剩'+Math.floor(orderdetailsTemp.CountdownSecond/3600)+'小时'+Math.floor(orderdetailsTemp.CountdownSecond/60)+'分钟';
    			info.TitleImg='/static/appImg/payment.png';
    			info.OrderLeftBtnCont='取消订单';
    			info.OrderRightBtnCont='去支付';
    			info.Remark1="下单时间："+orderdetailsTemp.CreateTime;
    			info.Remark2="";
    			info.Remark3="";
    		}else if(orderdetailsTemp.OrderState==2){//支付超时
    			info.Title='支付超时';
    			info.MiniTitle='';
    			info.TitleImg='/static/appImg/tradingClose.png';
    			info.OrderLeftBtnCont='';
    			info.OrderRightBtnCont='删除订单';
    			info.Remark1="下单时间："+orderdetailsTemp.CreateTime;
    			info.Remark2="";
    			info.Remark3="";
    		}else if(orderdetailsTemp.OrderState==3){//已支付
    			info.Title='已支付';
    			info.MiniTitle='';
    			info.TitleImg='';
    			info.OrderLeftBtnCont='';
    			info.OrderRightBtnCont='';
    			info.Remark1="创建时间："+orderdetailsTemp.CreateTime;
    			info.Remark2="支付时间："+orderdetailsTemp.PayTime;
    			info.Remark3="";
    		}else if(orderdetailsTemp.OrderState==4){//待发货
    			info.Title='待发货';
    			info.MiniTitle='';
    			info.TitleImg='/static/appImg/waitDelivert';
    			info.OrderLeftBtnCont='';
    			info.OrderRightBtnCont='';
    			info.Remark1="创建时间："+orderdetailsTemp.CreateTime;
    			info.Remark2="支付时间："+orderdetailsTemp.PayTime;
    			info.Remark3="";
    		}else if(orderdetailsTemp.OrderState==5){//订单被取消
    			info.Title='订单被取消';
    			info.MiniTitle='';
    			info.TitleImg='/static/appImg/tradingClose.png';
    			info.OrderLeftBtnCont='';
    			info.OrderRightBtnCont='查看原因';
    			info.Remark1="下单时间："+orderdetailsTemp.CreateTime;
    			info.Remark2="";
    			info.Remark3="";
    		}else if(orderdetailsTemp.OrderState==6){//退款中
    			info.Title='退款中';
    			info.MiniTitle='';
    			info.TitleImg='';
    			info.OrderLeftBtnCont='';
    			info.OrderRightBtnCont='查看原因';
    			info.Remark1="创建时间："+orderdetailsTemp.CreateTime;
    			info.Remark2="支付时间："+orderdetailsTemp.PayTime;
    			info.Remark3="";
    		}else if(orderdetailsTemp.OrderState==7){//发货中
    			info.Title='发货中';
    			info.MiniTitle='';
    			info.TitleImg='';
    			info.OrderLeftBtnCont='';
    			info.OrderRightBtnCont='';
    			info.Remark1="创建时间："+orderdetailsTemp.CreateTime;
    			info.Remark2="支付时间："+orderdetailsTemp.PayTime;
    			info.Remark3="";
    		}else if(orderdetailsTemp.OrderState==8){//部分发货
    			info.Title='部分发货';
    			info.MiniTitle='';
    			info.TitleImg='/static/appImg/delivery.png';
    			info.OrderLeftBtnCont='';
    			info.OrderRightBtnCont='查看物流';
    			info.Remark1="创建时间："+orderdetailsTemp.CreateTime;
    			info.Remark2="支付时间："+orderdetailsTemp.PayTime;
    			info.Remark3="发货时间："+orderdetailsTemp.DeliverTime;
 	   		}else if(orderdetailsTemp.OrderState==9){//全部发货
    			info.Title='全部发货';
    			info.MiniTitle='';
    			info.TitleImg='/static/appImg/delivery.png';
    			info.OrderLeftBtnCont='';
    			info.OrderRightBtnCont='查看物流';
    			info.Remark1="创建时间："+orderdetailsTemp.CreateTime;
    			info.Remark2="支付时间："+orderdetailsTemp.PayTime;
    			info.Remark3="发货时间："+orderdetailsTemp.DeliverTime;
    		}else if(orderdetailsTemp.OrderState==10){//交易成功
    			info.Title='交易成功';
    			info.MiniTitle='';
    			info.TitleImg='/static/appImg/tradingSuccess.png';
    			info.OrderLeftBtnCont='删除订单';
    			info.OrderRightBtnCont='查看物流';
    			info.Remark1="创建时间："+orderdetailsTemp.CreateTime;
    			info.Remark2="支付时间："+orderdetailsTemp.PayTime;
    			info.Remark3="发货时间："+orderdetailsTemp.DeliverTime;
    		}else if(orderdetailsTemp.OrderState==11){//退款成功
    			info.Title='退款成功';
    			info.MiniTitle=orderdetailsTemp.PayTime;
    			info.TitleImg='/static/appImg/tradingSuccess.png';
    			info.OrderLeftBtnCont='';
    			info.OrderRightBtnCont='删除订单';
    			info.Remark1="创建时间："+orderdetailsTemp.CreateTime;
    			info.Remark2="支付时间："+orderdetailsTemp.PayTime;
    			info.Remark3="";
    		}else if(orderdetailsTemp.OrderState==12){//交易关闭
    			info.Title='交易关闭';
    			info.MiniTitle='';
    			info.TitleImg='/static/appImg/tradingClose.png';
    			info.OrderLeftBtnCont='查看原因';
    			info.OrderRightBtnCont='删除订单';
    			info.Remark1="下单时间："+orderdetailsTemp.CreateTime;
    			info.Remark2="";
    			info.Remark3="";
    		}else if(orderdetailsTemp.OrderState==13){//交易关闭
    			info.Title='交易关闭';
    			info.MiniTitle='';
    			info.TitleImg='/static/appImg/tradingClose.png';
    			info.OrderLeftBtnCont='';
    			info.OrderRightBtnCont='删除订单';
    			info.Remark1="下单时间："+orderdetailsTemp.CreateTime;
    			info.Remark2="";
    			info.Remark3="";
    		}else if(orderdetailsTemp.OrderState==14){//异常订单
    			info.Title='订单异常，退款中';
    			info.MiniTitle='';
    			info.TitleImg='';
    			info.OrderLeftBtnCont='';
    			info.OrderRightBtnCont='查看原因';
    			info.Remark1="下单时间："+orderdetailsTemp.CreateTime;
    			info.Remark2="";
    			info.Remark3="";
    		}else{//错误状态
    			info=null;
    		}
    		this.stateInfo=info;
  	  }
    },
    //获取订单详情数据
    async GetOrderDetails(){
    	let par={orderId:this.orderId};
    	let data = await this.$MainFn.CallApi('/mall/GetOrderDetails',par,'');
    	this.orderDetails=data.Data;
    },
    //取消订单
    async CancelOrder(){
    	let par={orderId:this.orderId,type:0};
  		await this.$MainFn.CallApi('/mall/CancelOrder',par,'');
  		this.orderDetails.OrderState=13;
  		
  		this.DataLoad();
  		
  		let pages = getCurrentPages();//当前页面
    	let prevPage = pages[pages.length-2];//上一页面
    	prevPage.setData({//直接给上移页面赋值
  				orderId: this.orderId,
  				type:2//类型 1删除 2取消订单
			});
  		
    },
    //删除订单
    async DeleteOrder(){
  		let par={orderId:this.orderId};
  		await this.$MainFn.CallApi('/mall/DeleteOrder',par,'');
  		
  		let pages = getCurrentPages();//当前页面
    	let prevPage = pages[pages.length-2];//上一页面
    	prevPage.setData({//直接给上移页面赋值
  				orderId: this.orderId,
  				type:1//类型 1删除2取消订单
			});
  		wx.navigateBack({ delta:1});//返回上一页面
    },
		//立即支付
		async payNow(){
    	let orderId=this.orderId;
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
  			wx.redirectTo({url:navigateurl});
  		}else{//跳转0元购页面
				let navigateurl='/pages/orderPay/main?orderId='+orderId+'&totalSecond='+GoodsOrderReadyPaydata.Data.CountdownSecond;
				wx.redirectTo({url:navigateurl});
  		}
  	},
  	
  },
  async onLoad(option) {
    var res = wx.getSystemInfoSync();
    this.winWidth = res.windowWidth;
    this.winHeight = res.windowHeight;
    
    this.orderId=option.orderId;
    await this.GetOrderDetails();
    
    this.DataLoad();
  },
	async onShow(){
		if(this.orderId>0){
			await this.GetOrderDetails();
    
    	this.DataLoad();
   	}
	},
  created() {
    
  }
};
</script>

<style scoped lang="less">
.details{
  width: 100%;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
}
.orderState{
  height: 200rpx;
  background: linear-gradient(#fb2b57,#ff0036);
  padding: 30rpx;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .state{
    display: flex;
    flex-direction: column;
    color: #FFF;
    font-size: 34rpx;
    margin-bottom: 25rpx;
    .times{
      font-size: 28rpx;
    }
  }
  img{
    width: 180rpx;
    height: 100rpx;
    // margin-right: 110rpx;
  }
}
.afterSale{
  height: 269rpx;
  background: #fff;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-sizing: border-box;
  font-size: 28rpx;
  color: #333;
  display: flex;
  flex-direction: column;
  .afterSaleList{
    list-style: none;
    .items{
      margin-top: 10rpx;
      display: flex;
      .items-state{
        margin-left: 20rpx;
      }
    }
  }
}
.userPosition{
  display: flex;
  align-items: center;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-sizing: border-box;
  background: #FFF;
  img{
    width: 36rpx;
    height: 36rpx;
    margin-right: 24rpx;
  }
  .position{
    display: flex;
    flex-direction: column;
    font-size: 28rpx;
    color: #333;
    .userInfo{
      display: flex;
      justify-content: space-between;
    }
    .userAddress{
      margin-top: 30rpx;
      color: #999;
    }
  }
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
    .contactService{
      font-size: 24rpx;
      display: flex;
      align-items: center;
      img{
        width: 36rpx;
        height: 36rpx;
        margin-left: 15rpx;
      }
    }
  }
  .orderList{
    display: flex;
    flex-direction: column;
    .items{
      height: 180rpx;
      min-height: 180rpx;
      background: #f0f0f0;
      padding: 30rpx 30rpx;
      display: flex;
      align-items: center;
      font-size: 26rpx;
      color: #333;
      .goodsImg{
        width: 160rpx;
        height: 160rpx;
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
      }
    }
  }
  .couponTips{
    height: 60rpx;
    background: #fff9f9;
    font-size: 24rpx;
    color: #666;
    padding-left: 30rpx;
    line-height: 60rpx;
    border-bottom: 1rpx solid #ddd;
  }
  .refund{
    align-self: flex-end;
    .refundBtn{
      height: 60rpx;
      border: 1px solid #ff0036;
      border-radius:8rpx;
      font-size: 28rpx;
      color: #ff0036;
      text-align: center;
      line-height: 60rpx;
      margin: 20rpx 30rpx;
      padding: 0rpx 10rpx;
      box-sizing: border-box;
      float: right;
    }
  }
  .lines{
    width: 100%;
    height: 1rpx;
    background: #ddd;
  }
}
.costList{
  display: flex;
  flex-direction: column;
  background: #fff;
  padding: 30rpx;
  margin: 20rpx 0;
  box-sizing: border-box;
  font-size: 24rpx;
  color: #333;
  .costItem{
    display: flex;
    justify-content: space-between;
  }
  .allCost{
    display: flex;
    justify-content: space-between;
    font-size: 30rpx;
    .total{
      color: #ff0036;
    }
    .total::first-letter{
      font-size: 20rpx;
    }
  }
}

.orderInfo{
  background: #FFF;
  margin-bottom: 110rpx;
  padding: 30rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  font-size: 24rpx;
  color: #666;
  .orderNum{
    display: flex;
    justify-content: space-between;
    align-items: center;
    .copy{
      width: 72rpx;
      height: 40rpx;
      border: 1rpx solid #999;
      border-radius: 4rpx;
      text-align: center;
      line-height: 40rpx;
    }
  }
  .creationTime{
    margin: 19rpx 0;
  }
}
.orderButton{
  width: 100%;
  height: 100rpx;
  padding: 10rpx 0;
  // padding-right:30rpx; 
  box-sizing: border-box;
  background: #F8F8F8; 
  position: fixed;
  bottom: 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 26rpx;
  color: #333;
  .cancelBtn{
    width: 140rpx;
    height: 60rpx;
    margin-right: 30rpx;
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
    font-size: 26rpx;
    color: #ff0036;
    text-align: center;
    line-height: 60rpx;
    // margin-left: 30rpx;
    margin-right: 30rpx;
    background:#fff;
    padding: 0;
  }
}

</style>
