<template>
  <div class="container" :style="'height:'+winHeight+'px'">
    <mptoast />
    <block v-if="!Logined">
          <!-- 未登录状态 -->
    <div class="toLogin">
      <img src="/static/appImg/blank-icon.png" alt="">
      <span>您还没有登录，请登录后查看购物车</span>
      <a class="login-btn" href="/pages/login/main">登录</a>
    </div>
    </block>
    <block v-else>
    <!-- 未登录状态/空状态 -->
    <template v-if="goodsCartList===null || goodsCartList.length==0"> 
      <div class="blankState">
        <img src="/static/appImg/shopCartIcon.png" alt="failed">
        <div class="tipsInfos">
          <span>购物车还是空的，您可以再去逛逛</span>
          
          <div class="toIndex" @click="openIndex">再去逛逛</div> 
        </div>
      </div>
    </template>
    <template v-else>
      <div class="cart-cart">
        <div class="cartList" :style="'width:'+winWidth+'px; overflow:hidden;'" v-for="(item,index) in goodsCartList" :key="index">
          <div class="cart-item" @click="recover(index)" @touchstart="touchStart($event)" @touchend="touchEnd($event,index)" >
            <img class="checkBox" src="/static/appImg/circular-sel.png" alt="" @click="ChangeSelectedStatus(item)" checked="checked" v-if="item.Selected">
            <img class="checkBox" src="/static/appImg/circular-nor.png" alt="" @click="ChangeSelectedStatus(item)" v-if="!item.Selected">
            <div class="goodsInfos"  :data-type="item.type">
              <img :src="item.GoodsCover" alt="failed">
              <div class="goodsParameter">
                <div class="goodsName">{{item.ModelName}}</div>
                <div class="goodsSelected">{{item.ModelDescription}}</div>
                <div class="goodsPrice-num">
                  <div class="price">￥{{item.SingleMoney}}</div>
                  <div class="button">
                    <div class="jian" @click="ModifyGoodsCart(item,0)" v-if="item.BuyCount>1">-</div>
                    <div class="jian jianState"  v-if="item.BuyCount<=1">-</div>
                    <div class="numShow">{{item.BuyCount}}</div>  
                    <div class="jia jianState" v-if="item.BuyCount>=item.ModelCount">+</div>
                    <div class="jia" @click="ModifyGoodsCart(item,1)"  v-if="item.BuyCount<item.ModelCount">+</div>
                  </div>  
                </div>
              </div>         
            </div> 
          </div>
          <div class="del-btn" @click="DeleteGoodsCart(item)" :style="'right:'+delBtn+'rpx'" :data-type="item.type"> 删除</div>      
        </div>
      </div>
    </template>
    <div class="footerButton">
      <div class="sumBtn">
        <div class="selectAll">
          <img src="/static/appImg/circular-sel.png" alt="" @click="ChangeAllSelectedStatus()" checked="checked" v-if="AllSelected">
          <img src="/static/appImg/circular-nor.png" alt="" @click="ChangeAllSelectedStatus()"  v-if="!AllSelected">
          <span>全选</span>
        </div>
        <div class="Amount">
          <span>合计：</span>
          <span class="all-prices">￥{{SelectedMoney}}</span>
        </div>
      </div>
      <a class="btns" @click="settleClick" v-if="SecectedNumber>0">结算（{{SecectedNumber}}）</a>
      <a class="btns btnSates" href="/pages/goodsOrder/main" v-if="SecectedNumber<=0">结算</a>
    </div>
    </block>
  </div>
</template>

<script>
import mptoast from "mptoast";

import { showModal } from '@/utils/BaseFn'

export default {
  data() {
    return {
      winWidth:0,
      winHeight: 0,
      goodsCartList:null,
      SecectedNumber:0,
      SelectedMoney:0,
      AllSelected:false,
      startX:0,
      endX:0,
      settleGoodsModel:[],//结算商品型号类型
      Logined:false
    };
  },
  components: {
    mptoast
  },
  methods: {
    showToast() {
      this.$mptoast("我是提示信息", "success", 2000);
    },
    //结算
    settleClick(){
    	let modelList=this.goodsCartList.filter(function(item){
    		return item.Selected==true;
    	});
    	this.settleGoodsModel=[];
    	let settleGoodsModel=this.settleGoodsModel;
    	let modelIdStr='';
    	modelList.forEach(function(item){
    		settleGoodsModel.push({GoodsId:item.GoodsId,GoodsCover:item.GoodsCover,IsCoupon:item.IsCoupon,IsSupportVipDiscount:item.IsSupportVipDiscount,ModelId:item.ModelId,ModelName:item.ModelName,ModelDescription:item.ModelDescription,ModelDiscountPrice:item.DiscountPrice,MaxCouponCount:0,GoldCount:0,MaxCouponMoney:0,VipPrice:0,BuyCount:item.BuyCount});
    		let i=0;
    		while(i<item.BuyCount){
    			modelIdStr=modelIdStr+item.ModelId+",";
    			i++;
    		}
    	},settleGoodsModel,modelIdStr);
    	let settleData={modelIdStr:modelIdStr,settleGoodsModel:settleGoodsModel,IsGoodsCart:true};
  		let buyGoodsInfojson=JSON.stringify(settleData);
  		let url='/pages/orderConfirmation/main?buyGoodsInfo='+buyGoodsInfojson;
  		wx.navigateTo({url});
    },
     async GetGoodsCartList(){   
       let _self=this;  
       _self.Logined=true;
       //Post(obj){
        // obj:
        // url: api地址，以 / 开始
        // body: 参数，默认为 {}
        // usertoken: 登录凭证，默认为缓存中的
        // method:  api的访问方法，默认为 get
        // fnfail: api返回错误码的时候的操作方法，默认为 弹出错误消息
        // fnunlogin: api返回未登录时的操作方法

        let obj={};
        obj.url="/MALL/GetGoodsCartList";
        obj.fnunlogin=function(){_self.Logined=false;};
        let data=await _self.$MainFn.Post(obj);

      let Data1=data.Data;
      
      let res=[]; 
      for(let j = 0; j < Data1.length; j++) {
        var item=Data1[j];
        item.SingleMoney=_self.CalMoney(item.BuyCount,item.DiscountPrice);
        item.Selected=false;
        item.type=0;
        res.push(item);
      }   
      this.goodsCartList=res;
      this.CalTotalMoney();
    },
    CalMoney(number,price){
      let m=number*price;
      return parseFloat(m.toFixed(2));
    },
    CalTotalMoney(){
      this.SelectedMoney=0;
      this.SecectedNumber=0;
      this.AllSelected=false;

      for(let j = 0; j < this.goodsCartList.length; j++) {
         var item=this.goodsCartList[j];
        if(item.Selected){
          this.SecectedNumber++;
          this.SelectedMoney+=this.CalMoney(item.BuyCount,item.DiscountPrice);
        }
      }
      this.SelectedMoney=this.SelectedMoney.toFixed(2);
      if(this.SecectedNumber==this.goodsCartList.length && this.SecectedNumber>0){
        this.AllSelected=true;
      } 
    },
    ChangeSelectedStatus(item){
      item.Selected=!item.Selected;
      this.CalTotalMoney();
    },
    ChangeAllSelectedStatus(){
      this.AllSelected=!this.AllSelected;
      for(let j = 0; j < this.goodsCartList.length; j++) {
        this.goodsCartList[j].Selected=this.AllSelected;
      }
      this.CalTotalMoney();
    },
    async DeleteGoodsCart(item){    
      var _self = this;   
      showModal('提示','确定要删除吗?',function(){
         _self.DeleteGoodsCartConfirm(item);
      });
    },
    async DeleteGoodsCartConfirm(item){    

      var _self = this;   
      let url="/MALL/DeleteGoodsCart";
         let d = {cartIdStr:item.CartId};
         await _self.$MainFn.CallApi(url,d,'',undefined,'DELETE');
          let Data1=_self.goodsCartList;
      
         let res=[]; 
         for(let j = 0; j < Data1.length; j++) {
            if(item.CartId!=Data1[j].CartId){
              res.push(Data1[j]);
            }
          }   
        _self.goodsCartList=res;
        _self.CalTotalMoney();
    },
    async ModifyGoodsCart(item,isadd){
       let cartId=item.CartId;
       let BuyCount=item.BuyCount;
       if(isadd==1){
          BuyCount++;
       }
       else{
         BuyCount--;
       }
       if(BuyCount>item.ModelCount){
         return;
       }
       if(BuyCount<1){
         return;
       }
       let d1=[];
       let d2={CartId:cartId,BuyCount:BuyCount};
       d1.push(d2);

       let cartList=JSON.stringify(d1);

       let url="/MALL/UpdateGoodsCart";
        let d = {cartList:JSON.stringify(d1)};
      let data = await this.$MainFn.CallApi(url,d,'',undefined,'put');
      item.BuyCount=BuyCount;
      item.SingleMoney=this.CalMoney(item.BuyCount,item.DiscountPrice);
      this.CalTotalMoney();
    },

    // 滑动开始
    touchStart(e){
     // 获取移动距离，可以通过打印出e，然后分析e的值得出
      this.startX = e.mp.changedTouches[0].clientX;
    },
    // 滑动结束
    touchEnd(e,index){
      // 获取移动距离
      this.endX = e.mp.changedTouches[0].clientX + 120; 
      // console.log(this.endX)
      if(this.startX-this.endX > 10){
        for(let i=0;i<this.goodsCartList.length;i++){
          this.goodsCartList[i].type = 0;
        }
        this.goodsCartList[index].type = 1;
      }
      else if(this.startX-this.endX < -10){
        for(let i=0;i<this.goodsCartList.length;i++){
           this.goodsCartList[i].type = 0
        }
      }
    },
    // 点击回复原状
    recover(index){
      this.delBtn = null;
      this.goodsCartList[index].type = 0;
    },
    openIndex: function () {
      wx.switchTab({
        url: '../index/main'
      })
    },
  },
  onLoad() {
    var res = wx.getSystemInfoSync();
    this.winWidth = res.windowWidth;
    this.winHeight = res.windowHeight;

  },
      onShow() {
    this.GetGoodsCartList();
  },

  created() {
    
  }
};
</script>

<style scoped lang="less">
div[data-type="0"]{
  transform: translate3d(0,0,0);
}
div[data-type="1"]{
  transform: translate3d(-120rpx,0,0);
}


.blankState{
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  width: 100%;
  height: 419rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  img {
    width: 126rpx;
    height: 126rpx;
    margin-bottom: 20rpx;
  }
  .tipsInfos{
    display: flex;
    align-items: center;
    font-size: 22rpx;
    color: #333;
    .toIndex{
      width: 100rpx;
      height: 40rpx;
      border: 1rpx solid #ff0036;
      border-radius: 10rpx;
      color: #ff0036;
      margin-left: 10rpx;
      text-align: center;
      line-height: 40rpx;
    }
  }
}
.cart-cart{
  margin-bottom: 100rpx;
}
.cartList{
  position: relative;
  .cart-item{
    // height: 245rpx;
    min-height: 295rpx;
    display: flex;
    align-items: center;
    background: #fff;
    padding: 30rpx 30rpx 0;
    box-sizing: border-box;
    .checkBox{
      width: 44rpx;
      height: 44rpx;
      border-radius: 44rpx;
      margin-right: 40rpx;
    }
    .goodsInfos{
      display: flex;
      align-items: center;
      flex: 1;
      img{
        width: 146rpx;
        height: 146rpx;
        margin-right: 50rpx; 
      }
      .goodsParameter{
        flex: 1;
        display: flex;
        flex-direction: column;
        font-size: 28rpx;
        color: #333;
        padding-bottom: 30rpx;
        box-sizing:border-box; 
        border-bottom: 1rpx solid #eee;
        .goodsSelected{
          font-size: 24rpx;
          color: #999;
          margin: 10rpx 0;
        }
        .goodsPrice-num{
          display: flex;
          align-items: center;
          justify-content: space-between;
          .price{
            color: #ff0036;
            font-size: 30rpx;
          }
          .price:first-letter{
            font-size: 20rpx;
          }
          .button{
            display: flex;
            border-radius: 6rpx;
            border:1rpx solid #ddd;
            font-size: 35rpx;
            .jian{
              width: 60rpx;
              height: 60rpx;
              border-right: 1rpx solid #ddd;
              color: #ccc;
              text-align: center;
            }
            .jianState{
              background: #f0f0f0;
            }
            .jia{
              width: 60rpx;
              height: 60rpx;
              border-left: 1rpx solid #ddd;
              color: #999;
              text-align: center;
            }
            .numShow{
              width: 106rpx;
              height: 60rpx;
              text-align: center;
            }
          }
        }
      }
    }
  }
  .del-btn{
    width: 120rpx;
    height: 100%;
    background: #ff0036;
    font-size: 30rpx;
    color: #fff;
    position: absolute;
    top: 0;
    right: -120rpx;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
  
.cart-item:first-child{
  margin-top: 2rpx;
}

.footerButton{
  width: 100%;
  height: 100rpx;
  position: fixed;
  bottom: 0;
  background: #fff;
  display: flex;
  font-size: 30rpx;
  color: #333;
  border-bottom: 1rpx solid #b6b6b6;
  .sumBtn{
    width: 550rpx;
    padding: 28rpx 30rpx;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .selectAll{
      display: flex;
      img{
        width: 44rpx;
        height: 44rpx;
        margin-right: 20rpx;
      }
    }
    .all-prices{
      font-size: 30rpx;
      margin-left: 5rpx;
      color: #ff0036;
    }
    .all-prices:first-letter{
      font-size: 20rpx;
    }   
  }
  .btns{
      width: 200rpx;
      height: 100rpx;
      background: #ff0036;
      color: #fff;
      font-size: 36rpx;
      text-align: center;
      line-height: 100rpx;
    }
  .btnSates{
    background: #999;
  }  
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

</style>
