<template>
  <div class="container" >
  	 <mptoast />
    <div class="confirmation" :style="'height:'+winHeight+'px'">
      <!-- 用户地址 -->
      <template v-if="addressChoice!=null">
        <a href="/pages/address/main?itemClickCheck=true">
          <div class="userPosition">
            <img class="positionIcon" src="/static/appImg/address-icon.png" alt="">
            <div class="position">
              <div class="userInfo">
                <div class="userName">{{addressChoice.MailName}}</div>
                <div class="userPhone">{{addressChoice.MailPhone}}</div>
              </div>
              <div class="userAddress">{{addressChoice.FullAddress}}</div>
            </div>
            <div class="weui-cell__ft weui-cell__ft_in-access"></div>
          </div>
        </a>
      </template>
      <template v-else>
        <a href="/pages/address/main?itemClickCheck=true">
          <div class="userPosition">
            <div class="blankState">
              <img src="/static/appImg/blank-address.png" alt="">
              <div class="mes">你还没有收货地址，去添加</div>
            </div>
          </div>
        </a>
      </template>
      <!-- 商品信息 -->
      <div class="goodsOrderItem">
        <div class="orderList" >
          <div class="orderInfo-item" v-for="(item, index) in orderGoodsInfo.settleGoodsModel" :key="index">
            <div class="items">
              <img :src="item.GoodsCover" alt="" class="goodsImg">
              <div class="goodsInfos">
                <div class="goodsName">{{item.ModelName}}</div>
                <div class="goodsParam">{{item.ModelDescription}}</div>
                <div class="cardsStates" v-if="item.IsCoupon==false">该商品不支持优惠卡</div>
                <div class="goodsPrice">
                  <div class="currentPrice">￥{{item.ModelDiscountPrice}}</div>
                  <div class="goodsNum">x{{item.BuyCount}}</div>
                </div>
              </div>
            </div>
            <div class="couponTips">使用{{item.MaxCouponCount}}抵扣券抵扣{{item.MaxCouponMoney}}</div>
          </div>
        </div>
      </div>

      <!-- 费用 -->
      <div class="costList">
        <div class="costItem">
          <span>运费</span>
          <span class="Postage">
            <span>+</span>
            <span class="nums">￥{{orderGoodsInfo.Postage}}</span>
          </span>
        </div>
        <div class="lines"></div>
        <div class="allCost">
          <span>共{{orderGoodsInfo.totalGoodsCount}}件商品<span v-if="orderGoodsInfo.Weight>0">,总重{{orderGoodsInfo.Weight}}kg</span>   小计：</span>  
          <span class="total">￥{{orderGoodsInfo.totalOriginalPrice}}</span>
        </div>
      </div>

      <!-- 卡券列表 -->
      <div class="discountList">
        <div class="useCoupon">
          <div class="couponName">可使用{{orderGoodsInfo.TotalGoldCount}}抵扣券  抵{{orderGoodsInfo.TotalGoldMoney}}元</div>
          <switch :checked="GoldIsSelected" @click="switchChange"/>
        </div>
        <div class="cardShow">
          <div class="cardTitle">会员折扣：{{vipDistinct}}折</div>
          <div class="cardAmount">
            - <span>￥{{orderGoodsInfo.totalVipCheap}}</span>  
          </div>
        </div>
        <div class="discountCard">
          <div class="cardTips">可用优惠卡</div>
          <div class="cardName" @click="showCardsList">
            <div>省{{selectedCoupon.totalCheap}}：组合优惠</div>
            <div class="weui-cell__ft weui-cell__ft_in-access"></div>
          </div>
        </div> 
        <div class="cardShow" v-for="(item, index) in selectedCoupon.selectedList" :key="index">
          <div class="cardTitle">--{{item.CouponName}}</div>
          <div class="cardNum">x{{item.Count}}</div>
          <div class="cardAmount">
            - <span>￥{{item.CheapMoney}}</span>  
          </div>
        </div>

      </div>
      <!-- 优惠卡列表 -->
      <div class="mask" v-if="showCardLists">
        <div class="cardLists">
          <div class="listTitle">
            <div class="subtitle">优惠详情</div>
            <icon type="clear" size="20" @click="closeAlert"/>
          </div>
          <div class="amountList">
          <div class="list-item">
            <div class="cardName">不使用优惠卡</div>
            <icon type="success" @click="radioChange(0)" v-if="NotUseCouponIsSelected"/>
            <icon type="circle" @click="radioChange(0)" v-if="!NotUseCouponIsSelected"/>
          </div>
          <div class="list-item" v-for="(item, index) in CouponListSort" :key="index">
            <div class="cardName">{{item.DenominationName}}</div>

              <icon type="success" @click="radioChange(item.CouponId)" v-if="item.IsSelected"/>
              <icon type="circle" @click="radioChange(item.CouponId)" v-if="!item.IsSelected"/>
          </div>
          </div>
          <div class="sure-btn" @click="closeAlert">确定</div>
        </div>
      </div>
      <!-- 结算按钮 -->
      <div class="payBox">
        <div class="productNum">
          <div class="payNums">
            共<span>{{orderGoodsInfo.totalGoodsCount}}</span>件，
          </div>
          <div class="payAmount">
            合计：<span>￥{{orderGoodsInfo.TotalPrice}}</span>
          </div>
        </div>
       	<button class="payBtn" open-type="getUserInfo" lang="zh_CN"  @getuserinfo="payNow()">立即支付</button>
        
        
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
      winHeight: null,
      AccountInfo:null,//用户信息
      addressChoice:null,//地址选择
      orderGoodsInfo:{settleGoodsModel:[],Postage:0,Weight:0,totalGoodsCount:0,totalOriginalPrice:0,TotalGoldCount:0,TotalGoldMoney:0,TotalPrice:0,totalVipCheap:0,couponList:[]}, //购买订单商品信息
      GoldIsSelected:true,//使用抵扣券是否选中
      currCouponPrice:0,//当前可用优惠卡价格
      
      showCardLists:false,
      NotUseCouponIsSelected:false,//不使用优惠卡是否选中
      IsGoodsCart:false,//是否购物车来的
    };
  },
  components: {
    mptoast
  },
  computed: {
  	//优惠卡排序数据
  	CouponListSort(){
  		if(this.orderGoodsInfo!=null){
  			return this.orderGoodsInfo.couponList.sort(function(obj1, obj2){
  				let obj1sortId=0;
  				if(obj1.IsSelected==true){
  					obj1sortId= 100000000-obj1.FullValue;
  				}else if(obj1.CanClick==true){
  					obj1sortId= 200000000-obj1.FullValue;
  				}else{
  					obj1sortId= 300000000-obj1.FullValue;
  				}
  				let obj2sortId=0;
  				if(obj2.IsSelected==true){
  					obj2sortId= 100000000-obj2.FullValue;
  				}else if(obj2.CanClick==true){
  					obj2sortId= 200000000-obj2.FullValue;
  				}else{
  					obj2sortId= 300000000-obj2.FullValue;
  				}
  				return obj1sortId-obj2sortId;
  			});
  		}
  	},
    vipDistinct(){
    	if(this.AccountInfo==null){
    		return 10;
    	}
    	return this.AccountInfo.VipDiscount*1.0/100;
    },
    //已选优惠卡数据
    selectedCoupon(){
    	if(this.orderGoodsInfo!=null){
    		var totalCheap=0;
    		var selectedList=[];
    		var couponIdStr='';
    		this.orderGoodsInfo.couponList.forEach(function(item){
    			if(item.IsSelected==true){
    				couponIdStr=couponIdStr+item.CouponId+',';
    				let selectedInfo=selectedList.filter(function(v){
    					return v.CouponTypeId==item.CouponTypeId;
    				});
    				let cheap=item.MinusValue;
    				if(selectedInfo.length>0){
    					selectedInfo[0].Count++;
    					selectedInfo[0].CheapMoney+=cheap;
    				}
    				else{
    					selectedList.push({CouponTypeId:item.CouponTypeId,Count:1,CouponName:item.DenominationName,CheapMoney:cheap,CouponId:item.CouponId});
    				}
    				totalCheap=totalCheap+cheap;
    			}
    		});
    		if(couponIdStr!=''&&couponIdStr!=null){
    			couponIdStr=couponIdStr.substring(0, couponIdStr.lastIndexOf(','));
    		}
    		selectedList.forEach(function(item){
    			item.CheapMoney=item.CheapMoney.toFixed(2);
    		});
    		let result={totalCheap:totalCheap.toFixed(2),selectedList:selectedList,couponIdStr:couponIdStr};
    		return result;
    	}
    },
  },
  methods: {
  	//收货地址初始化
  	async addressLoad(addressId){
  		let url = "/Account/GetMailAddressList";
      let data = await this.$MainFn.CallApi(url, "", "");
      let addressList = data.Data;
      if (addressList == null || addressList.length <= 0) {
        return;
      }
      let addressTemp=addressList.filter(function(item){
      	if(addressId>0){//选择地址
      		return item.AddressId == addressId;
      	}else{//默认地址
      		return item.DefaultAddress == 1;
      	}
      });
      if(addressTemp.length<=0){
      	addressTemp.push(addressList[0]);
      }
      this.addressChoice=addressTemp[0];
  	},
  	//商品信息初始化
  	async goodsListLoad(goodsListJson){
  		if(goodsListJson!=null){
  			let orderGoodsInfoTemp=JSON.parse(goodsListJson);
  			
  			//获取可用抵扣券
  			let modelIdStr=orderGoodsInfoTemp.modelIdStr;//型号id拼接，获取可用抵扣券用
  			this.IsGoodsCart=orderGoodsInfoTemp.IsGoodsCart;
  			if(modelIdStr!=''&&modelIdStr!=null){
    			modelIdStr=modelIdStr.substring(0, modelIdStr.lastIndexOf(','));
    		}
  			let GetOrderGoldurl="/mall/GetOrderGold";
    		let GetOrderGoldpar={modelIdStr:modelIdStr};
    		let GetOrderGolddata = await this.$MainFn.CallApi(GetOrderGoldurl,GetOrderGoldpar,'');
    		let OrderGold=GetOrderGolddata.Data;
  			orderGoodsInfoTemp.TotalGoldCount=OrderGold.GoldCount;//设置总共可用抵扣券数量
  			orderGoodsInfoTemp.TotalGoldMoney=OrderGold.GoldMoney;//设置总共可用抵扣券金额
  			
  			//获取邮费信息
    		let GetOrderPostageurl = "/mall/GetOrderPostage";
    		let GetOrderPostagepar = { goodsList: orderGoodsInfoTemp.settleGoodsModel, addressId: this.addressChoice.AddressId, province: "" };
    		let GetOrderPostagedata = await this.$MainFn.CallApi(GetOrderPostageurl, GetOrderPostagepar, "");
    		let OrderPostage = GetOrderPostagedata.Data;
    		orderGoodsInfoTemp.Postage=OrderPostage.Postage;//设置邮费信息
    		orderGoodsInfoTemp.Weight=OrderPostage.Weight;//设置商品总重量
    		
  			let totalOriginalPrice=0;
  			let totalGoodsCount=0;
  			orderGoodsInfoTemp.settleGoodsModel.forEach(function(item){
  				totalOriginalPrice=totalOriginalPrice+item.ModelDiscountPrice*item.BuyCount;
  				totalGoodsCount++;
  				
  				let modelGoldTemp=OrderGold.List.filter(function(v){
  					return v.ModelId==item.ModelId;
  				},item);
  				if(modelGoldTemp.length<=0){
  					item.MaxCouponCount=0;//设置型号可用抵扣券数量
  					item.GoldCount=0;
  					item.MaxCouponMoney=0;//设置型号可用抵扣券金额
  				}else{
  					item.MaxCouponCount=modelGoldTemp[0].ModelGoldCount;//设置型号可用抵扣券数量
  					item.GoldCount=modelGoldTemp[0].ModelGoldCount;//设置型号可用抵扣券数量
  					item.MaxCouponMoney=modelGoldTemp[0].ModelGoldMoney;//设置型号可用抵扣券金额
  				}
  			});
  			orderGoodsInfoTemp.totalOriginalPrice=totalOriginalPrice.toFixed(2);//设置原价总价
  			orderGoodsInfoTemp.totalGoodsCount=totalGoodsCount;//设置种商品数量
  			
  			//获取优惠卡信息
    		let GetCouponurl = "/Account/GetAccountMoneySummary";
    		let GetCoupondata = await this.$MainFn.CallApi(GetCouponurl, "", "");
    		let couponListTemp=[];
    		GetCoupondata.Data.MyValidCouponList.forEach(function(item){
     			let sor=item;
      		sor.IsSelected=false;
      		sor.CanClick=false;
      		couponListTemp.push(sor);
    		});
    		orderGoodsInfoTemp.couponList=couponListTemp;
  			this.orderGoodsInfo=orderGoodsInfoTemp;
  			console.log(this.orderGoodsInfo)
    	}
  	},
  	//计算属性初始化(会员折扣价，可用优惠卡，支付总价)
  	calculateDataLoad(){
  		var _self=this;
  		let goldIsSelected=_self.GoldIsSelected;
  		let orderGoodsInfoTemp=_self.orderGoodsInfo;
  		var totalVipCheap=0;
  		orderGoodsInfoTemp.settleGoodsModel.forEach(function(item){
  			let priceTemp=item.ModelDiscountPrice*item.BuyCount;
  			if(goldIsSelected==true){
  				priceTemp=priceTemp-item.MaxCouponMoney;
  			}
  			item.VipPrice=(priceTemp*_self.AccountInfo.VipDiscount/1000).toFixed(3);
  			item.VipPrice= item.VipPrice.substring(0, item.VipPrice.length - 1);
  			if(item.IsSupportVipDiscount==false){
  				item.VipPrice=priceTemp.toFixed(2);
  			}
  			let vipCheap=priceTemp-item.VipPrice;
  			totalVipCheap=totalVipCheap+vipCheap;
  		});
  		orderGoodsInfoTemp.totalVipCheap=totalVipCheap.toFixed(2);//设置会员折扣总共优惠价格
  		
  		let totalGoldMoney=0;
  		if(goldIsSelected==true){
  			totalGoldMoney=orderGoodsInfoTemp.TotalGoldMoney;
  		}
  		let currCouponPrice=orderGoodsInfoTemp.totalOriginalPrice-orderGoodsInfoTemp.totalVipCheap-totalGoldMoney;//当前可用优惠卡价格
  		let couponListTemp=orderGoodsInfoTemp.couponList.sort(function(obj1, obj2){
  			return obj1.FullValue-obj2.FullValue;
  		});
    	couponListTemp.forEach(function(item){
    		item.IsSelected=false;
    		item.CanClick=false;
    		if(item.FullValue<=currCouponPrice){
    			item.IsSelected=true;
    			item.CanClick=true;
    			currCouponPrice=currCouponPrice-item.FullValue;
    		}
    	});
    	_self.currCouponPrice=currCouponPrice;
    	orderGoodsInfoTemp.couponList=couponListTemp;
    	orderGoodsInfoTemp.TotalPrice=0;
    	_self.orderGoodsInfo=orderGoodsInfoTemp;
    	_self.orderGoodsInfo.TotalPrice=(_self.orderGoodsInfo.totalOriginalPrice-_self.orderGoodsInfo.totalVipCheap-totalGoldMoney-_self.selectedCoupon.totalCheap+orderGoodsInfoTemp.Postage).toFixed(2)
  	},
    //立即支付
    async payNow(){
      let _self=this;
  		GetUserInfo(function(res){
        _self.payNow1(_self.orderGoodsInfo.settleGoodsModel,_self.selectedCoupon.couponIdStr,_self.IsGoodsCart,_self.addressChoice);
      });
  	},
  	async payNow1(goodsList,couponIdStr,IsGoodsCart,addressInfo){
  		if(addressInfo=='' || addressInfo==null){
  			this.showToast('请填写收货地址',"success", 2000);
  			return;
  		}
  		if(this.GoldIsSelected==false){
  			goodsList.forEach(function(item){
  					item.GoldCount=0;
  			});
      }
  		var goodsStr=JSON.stringify(goodsList);
  		var addressStr=JSON.stringify(addressInfo);
  		let url = "/Mall/BuildGoodsOrder";
  		let par={GoodsArr:goodsStr,CouponIdList:couponIdStr,IsGoodsCart:IsGoodsCart,AddressInfo:addressStr,AddressId:0};
      let data = await this.$MainFn.CallApi(url, par, "",null,'POST');
      let orderId = data.Data;
      if(orderId.OrderId>0){
      	let GoodsOrderReadyPayurl = "/Mall/GoodsOrderReadyPay";
  			let GoodsOrderReadyPaypar={goodsOrderId:orderId.OrderId,source:''};
      	let GoodsOrderReadyPaydata = await this.$MainFn.CallApi(GoodsOrderReadyPayurl, GoodsOrderReadyPaypar, '');
      	if(GoodsOrderReadyPaydata.Data.PayMoney>0){
      		let navigateurl='/pages/payAwait/main?orderId='+orderId.OrderId+'&payMoney='+GoodsOrderReadyPaydata.Data.PayMoney;
  				wx.redirectTo({url:navigateurl});
  			}else{//跳转0元购页面
					let navigateurl='/pages/orderPay/main?orderId='+orderId.OrderId+'&totalSecond='+GoodsOrderReadyPaydata.Data.CountdownSecond;
					wx.redirectTo({url:navigateurl});
				}
      }
  	},
    showToast(conetent, state, time) {
      this.$mptoast(conetent, state, time);
    },
    //优惠卡选择
  	radioChange(couponId) {
  		let totalGoldMoney=0;
  		if(this.GoldIsSelected==true){
  			totalGoldMoney=this.orderGoodsInfo.TotalGoldMoney;
  		}
  		if(couponId==0){
    		if(this.NotUseCouponIsSelected==true){
    			this.NotUseCouponIsSelected=false;
    			this.calculateDataLoad();
    		}
    		else{
    			this.NotUseCouponIsSelected=true;
    			this.currCouponPrice=this.orderGoodsInfo.totalOriginalPrice-this.orderGoodsInfo.totalVipCheap-totalGoldMoney;//当前可用优惠卡价格
    			this.orderGoodsInfo.couponList.forEach(function(item){
    				item.IsSelected=false;
    			});
    			this.couponCanClick();
    			this.orderGoodsInfo.TotalPrice=(this.orderGoodsInfo.totalOriginalPrice-this.orderGoodsInfo.totalVipCheap-totalGoldMoney-this.selectedCoupon.totalCheap+this.orderGoodsInfo.Postage).toFixed(2)
    		}
    	}
  		else{
  			let couponItem=this.orderGoodsInfo.couponList.filter(function(item){
    			return item.CouponId==couponId;
    		},couponId);
    		if(couponItem.length>0){
    			if(couponItem[0].IsSelected==true){
    				couponItem[0].IsSelected=false;
    				this.currCouponPrice=this.currCouponPrice+couponItem[0].FullValue;
    				this.couponCanClick();
    			}else{
    				if(couponItem[0].FullValue<=this.currCouponPrice){
    					couponItem[0].IsSelected=true;
    					this.NotUseCouponIsSelected=false;
    					this.currCouponPrice=this.currCouponPrice-couponItem[0].FullValue;
    					this.couponCanClick();
    				}
    			}
    			this.orderGoodsInfo.TotalPrice=(this.orderGoodsInfo.totalOriginalPrice-this.orderGoodsInfo.totalVipCheap-totalGoldMoney-this.selectedCoupon.totalCheap+this.orderGoodsInfo.Postage).toFixed(2)
    		}
  		}
  	},
  	//设置优惠卡是否可以点击
  	couponCanClick(){
  		this.orderGoodsInfo.couponList.forEach(function(item){
    		item.CanClick=false;
    		if(item.FullValue<=this.currCouponPrice || item.IsSelected==true){
    			item.CanClick=true;
    		}
    	},this);
  	},
    //抵扣券开关
    switchChange(e) {
      if(this.GoldIsSelected==true){
      	this.GoldIsSelected=false;
      }else{
      	this.GoldIsSelected=true;
      }
      this.calculateDataLoad();
    },
    //获取用户信息
    async GetAccountInfo(){
    	let url = "/Account/GetAccountSummary";
    	let data = await this.$MainFn.CallApi(url, "", "");
    	this.AccountInfo=data.Data;
    },
    // 显示优惠卡列表
    showCardsList(){
      this.showCardLists = true;
    },
    closeAlert(){
      this.showCardLists = false;
    },
  },
  async onLoad(option) {
    var res = wx.getSystemInfoSync();
    this.winWidth = res.windowWidth;
    this.winHeight = res.windowHeight;
    await this.GetAccountInfo();
    this.addressLoad(0);
    await this.goodsListLoad(option.buyGoodsInfo);
    this.calculateDataLoad();
  },
	onShow() {
    let pages = getCurrentPages();
    let currPage = pages[pages.length - 1];
    let addressIdTemp = currPage.data.mailId;
    if(addressIdTemp>0){
    	this.addressLoad(addressIdTemp);
    }
	},
  created() {}
};
</script>

<style scoped lang="less">
.container {
  overflow: scroll;
}
.confirmation {
  width: 100%;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
}
.userPosition {
  display: flex;
  align-items: center;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-sizing: border-box;
  background: #fff;
  .positionIcon {
    width: 36rpx;
    height: 36rpx;
    margin-right: 24rpx;
  }
  .position {
    flex: 1;
    display: flex;
    flex-direction: column;
    font-size: 28rpx;
    color: #333;
    padding-right: 30rpx;
    .userInfo {
      display: flex;
      justify-content: space-between;
    }
    .userAddress {
      margin-top: 30rpx;
      color: #999;
    }
  }
  .blankState {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 24rpx;
    color: #333;
    img {
      width: 68rpx;
      height: 60rpx;
      margin-bottom: 20rpx;
    }
  }
}
.goodsOrderItem {
  display: flex;
  flex-direction: column;
  margin-top: 20rpx;
  background: #ffffff;
  .orderTitle {
    padding: 28rpx 30rpx;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 26rpx;
    color: #333;
    .contactService {
      font-size: 24rpx;
      display: flex;
      align-items: center;
      img {
        width: 36rpx;
        height: 31rpx;
        margin-left: 15rpx;
      }
    }
  }
  .orderList {
    display: flex;
    flex-direction: column;
    .items {
      height: 180rpx;
      min-height: 180rpx;
      background: #f0f0f0;
      padding: 30rpx 30rpx;
      display: flex;
      align-items: center;
      font-size: 26rpx;
      color: #333;
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
        .goodsParam {
          color: #999;
        }
      }
      .cardsStates {
        color: #ff0036;
      }
      .goodsPrice {
        display: flex;
        justify-content: space-between;
        height: 100%;
        padding-top: 20rpx;
        .originalPrice {
          color: #999;
          text-decoration: line-through;
        }
        .goodsNum {
          align-self: flex-end;
          font-size: 24rpx;
          color: #999;
        }
      }
    }
  }
  .couponTips {
    height: 60rpx;
    min-height: 60rpx;
    background: #fff9f9;
    font-size: 24rpx;
    color: #666;
    padding-left: 30rpx;
    line-height: 60rpx;
    border-bottom: 1rpx solid #ddd;
  }
  .refund {
    align-self: flex-end;
    .refundBtn {
      width: 156rpx;
      height: 60rpx;
      border: 1px solid #ff0036;
      border-radius: 8rpx;
      font-size: 28rpx;
      color: #ff0036;
      text-align: center;
      line-height: 60rpx;
      margin: 20rpx 30rpx;
      float: right;
    }
  }
  .lines {
    width: 100%;
    height: 1rpx;
    background: #ddd;
  }
}
.costList {
  display: flex;
  flex-direction: column;
  background: #fff;
  margin: 20rpx 0;
  font-size: 28rpx;
  color: #333;
  .costItem {
    padding: 30rpx;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    border-bottom: 1rpx solid #eee;
    .Postage {
      color: #ff0036;
      font-size: 30rpx;
      .nums:first-letter {
        font-size: 20rpx;
      }
    }
    .lines {
      width: 100%;
      height: 1rpx;
      background: #eee;
    }
  }
  .allCost {
    padding: 30rpx;
    box-sizing: border-box;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    font-size: 28rpx;
    .total {
      font-size: 30rpx;
      color: #ff0036;
    }
    .total:first-letter {
      font-size: 20rpx;
    }
  }
}
.discountList {
  background: #fff;
  font-size: 28rpx;
  color: #333;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  margin-bottom: 100rpx;
  .useCoupon {
    padding: 30rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1rpx solid #eee;
    border-bottom: 1rpx solid #eee;
  }
  .discountCard {
    padding: 30rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1rpx solid #eee;
    .cardName {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .cardShow {
    padding: 30rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1rpx solid #eee;
    .cardTitle {
      font-size: 30rpx;
    }
    .cardAmount {
      font-size: 30rpx;
      color: #ff0036;
      span:first-letter {
        font-size: 20rpx;
      }
    }
  }
}
.mask {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  background: rgba(0, 0, 0, 0.4);
  z-index: 3;
  .cardLists {
    width: 100%;
    height: 700rpx;
    position: relative;
    // padding: 30rpx;
    // box-sizing: border-box;
    background: #fff;
    display: flex;
    flex-direction: column;
    position: fixed;
    bottom: 0;
    z-index: 3;
    transition: height 2s;
    -moz-transition: height 2s;
    -webkit-transition: height 2s;
    -o-transition: height 2s;
    font-size: 30rpx;
    color: #000;
    .listTitle{
      height: 100rpx;
      min-height: 100rpx;
      display: flex;
      justify-content: space-between;
      padding: 30rpx;
      box-sizing: border-box;
      border-bottom: 1rpx solid #eee;
    }
    .amountList{
    	overflow: scroll;
    	margin-bottom: 100rpx;
    }
    .list-item{
      display: flex;
      justify-content: space-between;
      padding: 30rpx 0;
      padding-right: 30rpx;
      margin-left:30rpx; 
      box-sizing: border-box;
      border-bottom: 1rpx solid #eee;
    }
    .sure-btn{
    	width: 100%;
      height: 100rpx;
      position: absolute;
      bottom: 0;
      background: #ff0036;
      text-align: center;
      line-height: 100rpx;
      color: #fff;
    }
  }
}
.payBox {
  width: 100%;
  height: 100rpx;
  position: fixed;
  bottom: 0;
  display: flex;
  font-size: 30rpx;
  color: #333;
  background: #fff;
  .productNum {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    padding: 30rpx;
    box-sizing: border-box;
    span {
      color: #ff0036;
    }
    .payAmount span::first-letter {
      font-size: 20rpx;
    }
  }
  .payBtn {
    width: 200rpx;
    height: 100rpx;
    background: #ff0036;
    color: #fff;
    font-size: 36rpx;
    text-align: center;
    line-height: 100rpx;
  }
}
</style>
