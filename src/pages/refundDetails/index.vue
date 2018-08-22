<template>
  <div class="container" :style="'height:'+winHeight+'px'">
    <div class="details" :style="'height:'+winHeight+'px'" v-if="refundDetails!=null">
      <!-- 支付状态 -->
      <div class="orderState">
        <div class="state">
          <span>{{StateWord}}</span>
          <span class="times">{{refundDetails.AfterSaleRemark}}</span>
        </div>
        <!--<img src="http://placehold.it/180x100" alt="">-->
      </div>

      <!-- 售后跟踪 -->
      <div class="afterSale">
        <div class="saleTitle" v-if="Type==3 || Type==4">售后跟踪</div> 
        <div class="saleTitle" v-if="Type==1 || Type==2">退款跟踪</div> 
        <ul class="afterSaleList" v-if="refundDetails.AfterSaleChangeList !=null">
          <li class="items" v-for="(item,index) in refundDetails.AfterSaleChangeList" :key="index">
            <div class="items-dates">{{item.ChangeTime}} </div> 
            <div class="items-state">{{item.Content}}</div>
          </li>
        </ul>
      </div>
      <!-- 用户地址 -->
      <div class="address" v-if="refundDetails.AfterSaleAddress !=null && (Type==3 || Type==4)">
        <div class="title">退货地址</div>
        <div class="userPosition">
          <img src="/static/appImg/address-icon.png" alt="">
          <div class="position">
            <div class="userInfo">
              <div class="userName">{{refundDetails.AfterSaleAddress.MailName}}</div>
              <div class="userPhone">{{refundDetails.AfterSaleAddress.MailPhone}}</div>
            </div>
            <div class="userAddress">{{refundDetails.AfterSaleAddress.Province}}  {{refundDetails.AfterSaleAddress.Prefecture}}  {{refundDetails.AfterSaleAddress.County}}  {{refundDetails.AfterSaleAddress.AddressDetail}}</div>
          </div>
        </div>
    </div>
      <!-- 商品信息 -->
      <div class="goodsOrderItem" v-if="goodsinfo!=null">
        <div class="orderTitle">
          <div class="orderNum">订单编号：{{goodsinfo.OrderNo}}</div>
          <div class="contactService" @click="phoneCall">
            <span>联系客服</span>
            <img src="/static/appImg/Customer.png" alt="">
          </div>
        </div>
        <div class="orderList">
          <div class="orderInfo-item">
            <div class="items">
              <img :src="goodsinfo.goodsImg" alt="" class="goodsImg">
              <div class="goodsInfos">
                <div class="goodsName">{{goodsinfo.goodsName}} </div>
                <div class="goodsParam">{{goodsinfo.goodsParam}}</div>
              </div>
              <div class="goodsPrice">
                <div class="currentPrice">￥{{goodsinfo.currentPrice}}</div>
                <div class="originalPrice">￥{{goodsinfo.originalPrice}}</div>
                <div class="goodsNum">x{{goodsinfo.goodsNum}}</div>
              </div>
            </div>
            <div class="lines"></div>
            <div class="refund" v-if="showButton!=null">
              <div class="refundBtn" v-if="showButton.canceltext!=''" @click="cancel">{{showButton.canceltext}}</div>
              <div class="refundBtn" v-if="showButton.reapplytext!=''" @click="reapply">{{showButton.reapplytext}}</div>
              <div class="refundBtn" v-if="showButton.confirmtext!=''" @click="confirm">{{showButton.confirmtext}}</div>
            </div>          
          </div>
        </div>
      </div>

      <!-- 订单编号时间 -->
      <div class="orderInfo">
        <div class="orderInfoItem">{{Word}}原因：{{refundDetails.Reason}}</div>
        <div class="orderInfoItem">申请时间：{{refundDetails.ApplyTime}} </div> 
        <div class="orderInfoItem">{{Word}}编号：{{refundDetails.AfterSaleNo}}</div> 
      </div>
    </div>
  </div>
</template>

<script>
import mptoast from "mptoast";

import { showModal } from '@/utils/BaseFn'

export default {
  data() {
    return {
      winHeight:null,
      refundDetails:null,
      afterSaleId:0,
      goodsinfo:{},
      Type:0,
      Word:'',
      StateWord:'',
      StateRemark:'',
      showButton:null  //{售后类型, 状态 ，显示 撤销申请的字，显示 重新申请的字}
    };
  },
  components: {
    mptoast
  },
  computed: {
   
  },
  methods: {
    empty(){
      this.refundDetails=null;
      this.afterSaleId=0;
      this.goodsinfo={};
      this.Type=0;
      this.Word='';
      this.StateWord='';
      this.StateRemark='';
      this.showButton=null;
    },
    confirm(){
       var _self = this;   
      showModal('提示','确定要删除吗?',function(){
         _self.AfterSaleConfirm();
      });
    },
    async AfterSaleConfirm(){
      var _self = this;  
      let url = "/Mall/AfterSaleConfirm";
      			let d = { afterSaleId: _self.afterSaleId };
            let data = await _self.$MainFn.CallApi(url, d, "");
            _self.GetRefundInfo();
    },
    cancel() {
    	wx.showModal({
        title: '',
        content:'确定要撤销申请吗？',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#999',
        confirmText: '确定',
        confirmColor: '#DF3E3F',
        success: async res => {
          if (res.confirm) {
            let _self=this;
      			let url = "/Mall/GoodsCancelAfterSale";
      			let d = { afterSaleId: _self.afterSaleId };
      			let data = await _self.$MainFn.CallApi(url, d, "");
      			wx.navigateBack({
       				delta: 1 //返回的页面数，如果 delta 大于现有页面数，则返回到首页,
     				});
          }else{
            console.log('用户点击取消')
          }
        }
      });
    },
    async reapply() {
      let _self=this;
      
      var d={};
      d.goodsName=_self.goodsinfo.goodsName;
      d.goodsParam=_self.goodsinfo.goodsParam;
      d.goodsImg=_self.goodsinfo.goodsImg;
      d.currentPrice=_self.goodsinfo.currentPrice;
      d.goodsNum=_self.goodsinfo.goodsNum;
      
            d.OrderId=_self.goodsinfo.OrderId;
            d.ModelId=_self.goodsinfo.ModelId;
            d.GoodsId=_self.goodsinfo.GoodsId;
            d.RefundType=_self.goodsinfo.RefundType>2?0:1;//类型1.退款 0.售后

            d.OrderNo=_self.goodsinfo.OrderNo;
            d.originalPrice=_self.goodsinfo.originalPrice;
            if(_self.refundDetails.AfterSaleAddress !=null){
                d.userName=_self.refundDetails.AfterSaleAddress.MailName;
                d.userPhone=_self.refundDetails.AfterSaleAddress.MailPhone;
                  d.Province=_self.refundDetails.AfterSaleAddress.Province;
                  d.Prefecture=_self.refundDetails.AfterSaleAddress.Prefecture;
                    d.County=_self.refundDetails.AfterSaleAddress.County;
                    d.AddressDetail=_self.refundDetails.AfterSaleAddress.AddressDetail;
            }

let json=JSON.stringify(d);
      wx.navigateTo({
        url: '../refundApply/main?v='+json
      })
    },
    async GetRefundInfo() {
      let _self=this;
      let url = "/Mall/GetGoodsAfterSaleInfo";
      let d = { afterSaleId: _self.afterSaleId };
      let data = await _self.$MainFn.CallApi(url, d, "");
      _self.refundDetails = data.Data;
      _self.cal();
    },
    cal(){
       let _self=this;

       //退款：1申请退款 2审核通过 3审核拒绝 4同意退款 5拒绝退款 6撤销申请 7重新申请 8退款处理中 9退款成功 10订单作废 11退款处理中（管理员） 12退款成功（管理员）13退款处理中（系统） 14退款成功（系统）
    //售后：1申请售后 2审核通过 3审核拒绝 4售后处理中 5售后拒绝 6售后已处理 7售后已解决 8撤销申请 9重新申请
       //状态文字
       let statuswords=['',
                      '等待平台审核',  //1申请退款
                      '退款审核通过',//2审核通过
                      '退款申请被拒绝',//3审核拒绝
                      '同意退款',//4同意退款
                      '退款被拒绝',//5拒绝退款
                      '撤消申请',//6撤销申请
                      '等待平台审核',//7重新申请
                      '退款处理中',//8退款处理中
                      '退款成功',//9退款成功
                      '由取消订单引起的作废',//10订单作废
                      '退款处理中',//11退款处理中（管理员
                      '退款成功',//12退款成功（管理员）
                      '退款处理中',//13退款处理中（系统）
                      '退款成功'//14退款成功（系统）
                      ]; // 退款状态
       let statusremarks=['',
                      '我们将在1-3个工作日内完成审核，请您耐心等待',  //1申请退款
                      '若商品已寄出，请将商品按照提示寄回指定地点',//2审核通过
                      '如有疑问，请电话联系客服，进行咨询',//3审核拒绝
                      '请等待平台处理',//4同意退款
                      '如有疑问，请电话联系客服，进行咨询',//5拒绝退款
                      '',//6撤销申请
                      '我们将在1-3个工作日内完成审核，请您耐心等待',//7重新申请
                      '我们将在7个工作日内完成退款，请您耐心等待',//8退款处理中
                      '',//9退款成功
                      '',//10订单作废
                      '我们将在7个工作日内完成退款，请您耐心等待',//11退款处理中（管理员
                      '',//12退款成功（管理员）
                      '我们将在7个工作日内完成退款，请您耐心等待',//13退款处理中（系统）
                      ''//14退款成功（系统）
                      ]; // 退款状态描述
       if(_self.Type>=3){
         statuswords=['',
                     '售后申请中',//1申请售后
                     '售后审核通过',//2审核通过
                     '售后申请被拒绝',//3审核拒绝
                     '售后处理中',//4售后处理中
                     '售后被拒绝',//5售后拒绝
                     '售后已处理',//6售后已处理
                     '售后已解决',//7售后已解决
                     '撤消申请',//8撤销申请
                     '重新申请'//9重新申请
                     ]; //售后状态

         statusremarks=['',
                     '我们将在1-3个工作日内完成审核，请您耐心等待',//1申请售后
                     '请将商品按照提示寄回指定地点',//2审核通过
                     '如有疑问，请电话联系客服，进行咨询',//3审核拒绝
                     '我们将尽快为您进行售后处理，请您耐心等待',//4售后处理中
                     '如有疑问，请电话联系客服，进行咨询',//5售后拒绝
                     '我们已完成售后，请您确认售后问题已解决',//6售后已处理
                     'record',//7售后已解决
                     '撤消申请',//8撤销申请
                     '重新申请'//9重新申请
                     ]; //售后状态描述
       }
       let state= this.refundDetails.Status;
       if(state<statuswords.length){
          _self.StateWord=statuswords[state];
       }
       else{
         _self.StateWord="";
       }


       //{售后类型, 状态 ，显示 撤销申请的字，显示 重新申请的字}
       let buttonlist=[];
       buttonlist.push({types:[1,2,3,4],status:1,canceltext:'撤销申请',reapplytext:'',confirmtext:''});
       buttonlist.push({types:[1,2],status:7,canceltext:'撤销申请',reapplytext:'',confirmtext:''});
       buttonlist.push({types:[3,4],status:9,canceltext:'撤销申请',reapplytext:'',confirmtext:''});
       buttonlist.push({types:[3,4],status:6,canceltext:'',reapplytext:'',confirmtext:'确认售后已解决'});
       buttonlist.push({types:[1,2,3,4],status:3,canceltext:'撤销申请',reapplytext:'重新申请',confirmtext:''});
        buttonlist.push({types:[1,2,3,4],status:5,canceltext:'撤销申请',reapplytext:'重新申请',confirmtext:''});

        _self.showButton=null;
        for(let j=0;j<buttonlist.length;j++){
          let item=buttonlist[j];
          if(item.status!=state){
            continue;
          }
          var types=item.types;
           for(let k=0;k<types.length;k++){
             if(types[k]!=_self.Type){
                continue;
             }
             _self.showButton=item;
             break;
           }
           if(_self.showButton!=null){
             break;
           }      
        }


    },

    showToast(conetent,state,time) {
      if(state==null||state=='')state='success';
      this.$mptoast(conetent, state, time);
    },
    phoneCall(){
      wx.makePhoneCall({
        phoneNumber: '057187820281',
        success: (res)=>{
          console.log(res);
        }
      });
    }
  },
  onLoad(option) {
    let v=option.v;
    if(v!=undefined && v!=""){
      // this.afterSaleId=id;

let item=JSON.parse(v);
this.afterSaleId=item.afterSaleId;
      this.goodsinfo.goodsName=item.goodsName;
      this.goodsinfo.goodsParam=item.goodsParam;
      this.goodsinfo.goodsImg=item.goodsImg;
      this.goodsinfo.currentPrice=item.currentPrice;
      this.goodsinfo.goodsNum=item.goodsNum;

            this.goodsinfo.OrderId=item.OrderId;
            this.goodsinfo.ModelId=item.ModelId;
            this.goodsinfo.GoodsId=item.GoodsId;

            this.goodsinfo.RefundType=item.RefundType; //1.退款 2退货退款 3换货 4维修
            this.goodsinfo.OrderNo=item.OrderNo;
            this.goodsinfo.originalPrice=item.originalPrice;
       this.Type=this.goodsinfo.RefundType;
       let words=['','退款','退款','售后','售后'];
       if(this.Type>4) this.Type=0;
       this.Word=words[this.Type];

       

      this.GetRefundInfo();
    }
    else{
      this.afterSaleId=0;
    }
    var res = wx.getSystemInfoSync();
    this.winWidth = res.windowWidth;
    this.winHeight = res.windowHeight;
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
    margin-right: 110rpx;
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
    overflow: scroll;
    .items{
      margin-top: 10rpx;
      display: flex;
      .items-state{
        margin-left: 20rpx;
      }
    }
  }
}
.address{
  margin-bottom: 20rpx;
  background: #FFF;
  font-size: 26rpx;
  color: #333;
  display: flex;
  flex-direction: column;
  .title{
    padding: 30rpx;
    box-sizing: border-box;
    border-bottom: 1rpx solid #ddd;
  }
  .userPosition{
    display: flex;
    align-items: center;
    padding: 30rpx;
    margin-bottom: 20rpx;
    box-sizing: border-box;
    background: #FFF;
    box-sizing: border-box;
    img{
      width: 30rpx;
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
}
.userPosition{
  display: flex;
  align-items: center;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-sizing: border-box;
  background: #FFF;
  img{
    width: 30rpx;
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
  margin-bottom: 20rpx;
  background: #ffffff;
  .orderTitle{
    padding: 28rpx 30rpx;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 26rpx;
    color: #333;
    border-bottom: 1rpx solid #ddd;
    .contactService{
      font-size: 24rpx;
      display: flex;
      align-items: center;
      img{
        width: 36rpx;
        height: 31rpx;
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
      background: #fff;
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
        flex:1;
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
  .refund{
    align-self: flex-end;
    .refundBtn{
      width: 156rpx;
      height: 60rpx;
      border: 1px solid #ff0036;
      border-radius:8rpx;
      font-size: 28rpx;
      color: #ff0036;
      text-align: center;
      line-height: 60rpx;
      margin: 20rpx 30rpx;
      float: right;
    }
  }
  .lines{
    width: 100%;
    height: 1rpx;
    background: #ddd;
  }
}

.orderInfo{
  background: #FFF;
  margin-bottom: 110rpx;
  padding: 30rpx;
  padding-bottom:0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  font-size: 24rpx;
  color: #666;
  .orderInfoItem{
    margin-bottom: 20rpx;
  }
}


</style>