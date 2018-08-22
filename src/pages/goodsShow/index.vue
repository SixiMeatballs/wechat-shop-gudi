<template>
  <div class="container" v-if="goodsInfo!=null">
      <!-- 商品图片 -->
      <div class="goodsImg" >
        <!-- 轮播图 -->
        <div class="goodsStateA">
          <img :src="goodsInfo.HotTagName" alt="">
        </div>
        <template v-if="goodsInfo.IsSupportRushToBuy">
          <!-- 抢购标签-已结束-预热中-抢光了-抢购中 -->
          <template v-if="goodsInfo.Status==1">
            <!-- 预热中 -->
            <img class="salesIcon" src="/static/appImg/sales-ing.png" alt="failed">
          </template>
          <template v-if="goodsInfo.Status==2">
            <!-- 抢购中 -->
            <img class="salesIcon" src="/static/appImg/snatch-icon.png" alt="failed">
          </template>
          <template v-if="goodsInfo.Status==3">
            <!-- 抢光了 -->
            <img class="salesIcon" src="/static/appImg/sales-nor.png" alt="failed">
          </template>
          <template v-if="goodsInfo.Status==4">
            <!-- 已结束 -->
            <img class="salesIcon" src="/static/appImg/sales-end.png" alt="failed">
          </template>
        </template>
        <!-- 会员折扣标签 -->
        <template v-if="goodsInfo.IsSupportRushToBuy==false&&goodsInfo.IsSupportVipDiscount==true">
          <img class="memberIcon" src="/static/appImg/member-sign.png" alt="failed">
        </template>

        <swiper indicator-dots="true" autoplay="true" indicator-active-color="red">
          <div v-for="(item, index) in goodsInfo.ImgsUrl" :key="index">
            <swiper-item>
              <image :src="item" class="slide-image" />
            </swiper-item>
          </div>
        </swiper>
      </div>  
      <mptoast />
      <!-- 抢购状态栏  -->
      <block v-if="goodsInfo.IsSupportRushToBuy">
      <div class="rushToBuy rushToBuyState">
        <div class="rushPrice">
          <div class="originalPrice">￥{{goodsInfo.GoodsOriginalPrice}}</div>
          <div class="currentPrice">￥{{goodsInfo.GoodsDiscountPrice}}</div>
        </div>
        <div class="rushState"  v-if="goodsInfo.Status==1">
          <div class="stateTips">距活动开始</div>
          <div class="countDown">
            <div class="times">
              <span class="nums">{{CountDown.dd}}</span>天
            </div>
            <div class="times">
              <span class="nums">{{CountDown.hh}}</span>时
            </div>
            <div class="times">
              <span class="nums">{{CountDown.mm}}</span>分
            </div>
            <div class="times">
              <span class="nums">{{CountDown.ss}}</span>秒
            </div>
          </div>
        </div>
        <div class="rushState"  v-if="goodsInfo.Status==2">
          <div class="stateTips">距结束仅剩</div>
          <div class="countDown">
            <div class="times">
              <span class="nums">{{CountDown.dd}}</span>天
            </div>
            <div class="times">
              <span class="nums">{{CountDown.hh}}</span>时
            </div>
            <div class="times">
              <span class="nums">{{CountDown.mm}}</span>分
            </div>
            <div class="times">
              <span class="nums">{{CountDown.ss}}</span>秒
            </div>
          </div>
        </div>
        <div class="rushState"  v-if="goodsInfo.Status==3 || goodsInfo.Status==4">
          <div class="stateTips">抢购已结束</div>
        </div>
      </div>
      </block>
      <!-- 商品详情 -->
      <div class="goodsInfo">
        <div class="goodsName">
          <span class="PromotionGoods" v-if="goodsInfo.IsPromotion">促</span>
          {{goodsInfo.GoodsName}}
        </div>
        <div class="goodsPrice" v-if="!goodsInfo.IsSupportRushToBuy">
          <div class="currentPrice">￥{{goodsInfo.GoodsDiscountPrice}}</div>
          <div class="jiage">价格</div>
          <div class="originalPrice">￥{{goodsInfo.GoodsOriginalPrice}}</div>
        </div>
        <div class="shopNews">
          <div class="shopCards">
            <template v-if="goodsInfo.IsCoupon">
              <img src="/static/appImg/preferentialcard.png">
            </template>
            <template v-else>
              <img src="/static/appImg/preferentialcard-nor.png">
            </template>
          </div>
          <template v-if="goodsInfo.CouponDiscount!=0">
            <div class="Deduction">
              <img src="/static/appImg/voucher.png">
              <span class="DeductionNum">{{goodsInfo.CouponDiscount}}</span>
            </div>
          </template>
          <template v-else>
            <div class="Deduction">
              <img src="/static/appImg/voucher-nor.png">
            </div>
          </template>
          <template v-if="goodsInfo.RefundBonusRegion!=0">
            <div class="shopReturn">返{{goodsInfo.RefundBonusRegion}}豆</div>
          </template>  
        </div>

        

        <div class="goodsOtherInfo">
          <div class="post">快递：{{goodsInfo.ExpressFee}}</div>
          <div class="num">已抢{{goodsInfo.SoldCount}}件</div>
          <div class="city">{{goodsInfo.Area}}</div>
        </div>
      </div>

      <!-- 商品属性 -->
      <div class="goodsParameter" @click="showGoodsParameterInfo(2)">
        <div class="weui-cell__bd">请选择产品参数</div>
        <div class="weui-cell__ft weui-cell__ft_in-access">
             <block v-if="SelectSpec==null || SelectSpec.length==0">
                </block>
                <block v-else>
                  <div class="selected">
                      <block v-for="(item,index) in SelectSpec" :key="index">
                            &nbsp;{{item.Value}}
                      </block>
                  </div>
                </block> 
        </div>
      </div>    
      <!-- 商品属性详情 -->
      <div class="masks" v-if="showParameterInfo" @click="closeAlert()">
        <div class="goodsParameterInfo" @click.stop="hide1($event)">
          <div class="productInfo">
            <img class="productInfoimg" :src="ImgUrl" alt="failed" v-if="ImgUrl!=''">
            <img class="productInfoimg" :src="goodsInfo.GoodsCover" alt="failed" v-if="ImgUrl==''">
            <!-- 会员折扣标签 -->
            <template v-if="goodsInfo.IsSupportVipDiscount==true">
              <img class="memberIcons" src="/static/appImg/member-sign.png" alt="failed">
            </template>
            <div class="productAttributes" v-if="SelectedModel==null">
              <icon class="delete" type="clear" size="15" @click="closeAlert" />
              <div class="productPrice">￥{{goodsInfo.MinDiscountPrice}}</div>
              <div class="productTotalCount">库存{{goodsInfo.TotalCount}}件</div>
              <block v-if="SelectSpec==null || SelectSpec.length==0">
                  <div class="notSelect">请选择 商品规格</div> 
              </block>
              <block v-else>
                <div class="selected">已选：
                  <block v-for="(item,index) in SelectSpec" :key="index">
                      &nbsp;{{item.Value}}
                  </block>
                </div>
              </block>
              <div class="shopNews">
                <div class="shopCards">
                  <template v-if="goodsInfo.IsCoupon">
                    <img src="/static/appImg/preferentialcard.png">
                  </template>
                  <template v-else>
                    <img src="/static/appImg/preferentialcard-nor.png">
                  </template>
                </div>
                <template v-if="goodsInfo.CouponDiscount!=0">
                  <div class="Deduction">
                    <img src="/static/appImg/voucher.png">
                    <span class="DeductionNum">{{goodsInfo.CouponDiscount}}</span>
                  </div>
                </template>
                <template v-else>
                  <div class="Deduction">
                    <img src="/static/appImg/voucher-nor.png">
                  </div>
                </template>
                <template v-if="goodsInfo.RefundBonusRegion!=0">
                  <div class="shopReturn">返{{goodsInfo.RefundBonusRegion}}豆</div>
                </template>  
              </div>

            </div>
             <div class="productAttributes" v-else>
                <icon class="delete" type="clear" size="15" @click="closeAlert" />
                <div class="productPrice">￥{{SelectedModel.Model_DiscountPrice}}</div>
                <div class="productTotalCount">库存{{SelectedModel.Model_TotalCount}}件</div>
                <block v-if="SelectSpec==null || SelectSpec.length==0">
                    <div class="notSelect">请选择 商品规格</div> 
                </block>
                <block v-else>
                  <div class="selected">已选：
                      <block v-for="(item,index) in SelectSpec" :key="index">
                            &nbsp;{{item.Value}}
                      </block>
                  </div>
                </block>                
                <div class="shopNews">
                  <div class="shopCards">
                    <template v-if="goodsInfo.IsCoupon">
                      <img src="/static/appImg/preferentialcard.png">
                    </template>
                    <template v-else>
                      <img src="/static/appImg/preferentialcard-nor.png">
                    </template>
                  </div>
                  <template v-if="goodsInfo.CouponDiscount!=0">
                    <div class="Deduction">
                      <img src="/static/appImg/voucher.png">
                      <span class="DeductionNum">{{goodsInfo.CouponDiscount}}</span>
                    </div>
                  </template>
                  <template v-else>
                    <div class="Deduction">
                      <img src="/static/appImg/voucher-nor.png">
                    </div>
                  </template>
                  <template v-if="goodsInfo.RefundBonusRegion!=0">
                    <div class="shopReturn">返{{goodsInfo.RefundBonusRegion}}豆</div>
                  </template>  
                </div>
            </div>
          </div>

          <!-- 商品参数 noStock-->
          <div class="productParam" v-for="(item, index) in Sumlist" :key="index">
              <div class="paramTitle">{{item.SpecName}}</div>
              <div class="paramList">
                <block  v-for="(item1, index1) in item.SpecList" :key="index1">
                  <div class="paramItem " @click="selectSum(item,item1)" :class="{ 'select':item.SelectedId==item1.Id}" v-if="item1.type==1">
                  {{item1.Value}}</div>
                   <div class="paramItem noStock" :class="{ 'select':item.SelectedId==item1.Id}" v-else>
                  {{item1.Value}}</div>
                </block>
                
              </div>
          </div>  

          <!-- 购买数量按钮 -->
          <div class="buyNumButton">
            <span>购买数量</span>
            <div class="button">
              <div class="jian" @click="ModifyBuyCount(0)" v-if="BuyCount>1">-</div>
                <div class="jian jianState"  v-if="BuyCount<=1">-</div>
              <div class="numShow">{{BuyCount}}</div> 

              <div class="jia" @click="ModifyBuyCount(1)" v-if="SelectedModel!=null && BuyCount<SelectedModel.Model_TotalCount">+</div>
              <div class="jia" @click="ModifyBuyCount(1)" v-else-if="SelectedModel==null && BuyCount<goodsInfo.TotalCount">+</div>
              <div class="jia jianState" v-else>+</div>
            </div>  
          </div>

          <!-- 其他按钮 -->
          <block v-if="AddType==0">
             <div class="buttonState" @click="AddGoodsCart()" v-if="SelectedModel!=null">加入购物车</div>
             <div class="buttonState buttonStateBlank" v-else>加入购物车</div>
          </block>
          <block v-if="AddType==1">
             <block v-if="!goodsInfo.IsSupportRushToBuy">
             <div class="buttonState" @click="BuyNow()" v-if="SelectedModel!=null">立即购买</div>
             <div class="buttonState buttonStateBlank" v-else>立即购买</div>
             </block>
             <block v-else>
             <div class="buttonState" @click="BuyNow()" v-if="SelectedModel!=null && goodsInfo.Status==2">立即抢购</div>
             <div class="buttonState buttonStateBlank" v-else>立即抢购</div>
             </block>
          </block>
          <block v-if="AddType==2">
             <div class="buttonState" @click="closeConfirmAlert()">确定</div>
          </block>
        </div>  
      </div>
        
      <!-- 商品简介 -->
      <div class="goodsDetails">
        <div class="detailsTitle">产品详情</div>
        <div class="details" v-html="goodsInfo.GoodsContent" :style="'width:'+winWidth+'px'">
        </div>
      </div>

      <!-- 底部按钮 -->
      <div class="footer">
        <div class="carButton" @click="AddGoodsCart()">加入购物车</div>
        		

             <block v-if="!goodsInfo.IsSupportRushToBuy">
                <div class="buyButton" @click="BuyNow()">立即购买</div>
             </block>
             <block v-else>
               <div class="buyButton" @click="BuyNow()" v-if="goodsInfo.Status==2">立即抢购</div>
             <div class="buyButton" v-else>立即抢购（灰）</div>
             </block>
      </div>
      
  </div>
</template>

<script>
import mptoast from "mptoast";

import { pay } from '@/utils/Payment'

import { ShowCountDown } from '@/utils/BaseFn'

let t;

export default {
  data() {
    return {
      showParameterInfo:false,
      goodsId:0,
      goodsInfo:null,
      Sumlist:null,     ///选中后的型号列表
      PreSumlist:null,  ///点确定前的上一个选中状态，如果没有点确认，要返回到这个状态
      BuyCount:1,
      ImgUrl:'',
      SelectedModel:null,
      SelectSpec:[],
      AddType:0,    //0: 加入购物车   1：立即购买
      settleGoodsModel:[],//结算商品型号类型
      winWidth:null,
      CountDownNumber:0,
      CountDown:{}
    };
  },
  components: {
    mptoast
  },
  methods: {
  	pay(){
  		var d22={GoodsOrderId:2160};
      pay(d22,"ORDER1",function(data){
        console.log("支付成功");
        console.log(data);
      },function(data){
        console.log("支付失败");
        console.log(data);
      });      
    },
    hide1(e){
    },
  	//立即购买跳转到订单确认
  	BuyNow(){
  		this.settleGoodsModel=[];
  		if(this.SelectedModel!=null&&this.goodsInfo!=null && this.BuyCount>0){
  			this.settleGoodsModel.push({GoodsId:this.goodsInfo.GoodsId,GoodsCover:this.goodsInfo.GoodsCover,IsCoupon:this.goodsInfo.IsCoupon,IsSupportVipDiscount:this.goodsInfo.IsSupportVipDiscount,ModelId:this.SelectedModel.Model_Id,ModelName:this.SelectedModel.Model_Name,ModelDescription:this.SelectedModel.Model_Description,ModelDiscountPrice:this.SelectedModel.Model_DiscountPrice,MaxCouponCount:0,MaxCouponMoney:0,GoldCount:0,VipPrice:0,BuyCount:this.BuyCount});
  			let i=0;
  			let modelIdStr='';
  			while(i<this.BuyCount){
  				modelIdStr=modelIdStr+this.SelectedModel.Model_Id+',';
  				i++
  			}
  			
  			let settleData={modelIdStr:modelIdStr,settleGoodsModel:this.settleGoodsModel,IsGoodsCart:false};
  			let buyGoodsInfojson=JSON.stringify(settleData);
        let url='/pages/orderConfirmation/main?buyGoodsInfo='+buyGoodsInfojson;
        this.closeConfirmAlert();
  			wx.navigateTo({url});
  		}
  		else{
  			this.showGoodsParameterInfo(1);
  		}
  	},
   showToast(conetent,state,time) {
      this.$mptoast(conetent, state, time);
    },
      async AddGoodsCart(){
        if(this.SelectedModel==null){
          this.showGoodsParameterInfo(0);
          return;
        }
      let url="/MALL/AddGoodsCart";
        let d ={GoodsId:this.goodsId,ModelId:this.SelectedModel.Model_Id,BuyCount:this.BuyCount};
      let data = await this.$MainFn.CallApi(url,d,'',undefined,"POST");
      this.showToast("添加购物车成功", "success", 2000);
      this.closeConfirmAlert();
      
    },
    async ModifyBuyCount(isadd){
       if(isadd==0){
         if(this.BuyCount>1){
           this.BuyCount--;
         }
         return;
       }

       if(this.SelectedModel!=null){
         if(this.BuyCount<this.SelectedModel.Model_TotalCount){
           this.BuyCount++;
         }
       }
       else{
          if(this.BuyCount<this.goodsInfo.TotalCount){
           this.BuyCount++;
         }
       }
    },

    async GetGoodsDeatils(){
      let _self=this; 
      _self.goodsInfo=null;
      _self.Sumlist=null;
      _self.BuyCount=1;
      _self.ImgUrl='';
      _self.SelectedModel=null;
      _self.SelectSpec=[]; 
      _self.CountDownNumber=0;
      _self.CountDown={};
      clearInterval(t);

      let url="/mall/GetGoodsDetails";
        let d ={goodsId:_self.goodsId};
      let data = await _self.$MainFn.CallApi(url,d,'');
      _self.goodsInfo=data.Data;
      
      let Data1=data.Data.Sumlist;
      let res=[];
      for(let j=0;j<Data1.length;j++){
        var item=Data1[j];
        var item1={};
        item1.SelectedId=0;
        item1.SelectedValue='';
        item1.SelectedImg='';
        item1.SpecId=item.SpecId;
        item1.SpecName=item.SpecName;
        var s=[];
        for(let i=0;i<item.SpecList.length;i++){
          var item2=item.SpecList[i];
          item2.type=1;
          s.push(item2);
        }

        item1.SpecList=s;
        res.push(item1);
      }
      _self.Sumlist=res;
      _self.changespectype();
_self.showCountDown();
    },
    showCountDown(){
        let _self=this;
        if(_self.goodsInfo==null) return;
        if(!_self.goodsInfo.IsSupportRushToBuy) return;

        if(_self.goodsInfo.Status!=1 && _self.goodsInfo.Status!=2) return;
        if(_self.goodsInfo.Status==1){
           _self.CountDownNumber=_self.goodsInfo.StartBuyCountDownSecond;
        }
        else if(_self.goodsInfo.Status==2){
           _self.CountDownNumber=_self.goodsInfo.EndBuyCountDownSecond;
        }

        if(_self.CountDownNumber<=0){
          clearInterval(t);
          return;
        }

        t = setInterval(function() {
        _self.CountDownNumber--;
        _self.CountDown=ShowCountDown(_self.CountDownNumber);
        if (_self.CountDownNumber <= 0) {
          clearInterval(t);
          _self.GetGoodsDeatils();
        }
      }, 1000);
    },
    selectSum(sum,spec){
      let _self=this;
      for(let j=0;j<_self.Sumlist.length;j++){
        var item=_self.Sumlist[j];
        if(item.SpecId==sum.SpecId){
        if(item.SelectedId==spec.Id){
          _self.Sumlist[j].SelectedId=0;
          _self.Sumlist[j].SelectedValue='';
          _self.Sumlist[j].SelectedImg='';
       }
       else{
         _self.Sumlist[j].SelectedId=spec.Id;
         _self.Sumlist[j].SelectedValue=spec.Value;
          _self.Sumlist[j].SelectedImg=spec.ImgUrl;
       }
        }
      }
      this.calSelectedModel();
      this.changespectype();
    },
    changespectype(){
      let _self=this;
      for(let j=0;j<_self.Sumlist.length;j++){
        let item=_self.Sumlist[j];
        var specvalues=this.getspecvalue(item.SpecId);
        for(let i=0;i<item.SpecList.length;i++){
          let item1=item.SpecList[i];
          item1.type=this.arrayContain(specvalues,item1.Value);
        }
      }
    },
    arrayContain(arr,value){
      for(let j=0;j<arr.length;j++){        
        if(arr[j]==value){
          return 1;
        }
      }
      return 0;
    },
    getspecvalue(specId){
       //获取一种规格可选的项目
      let _self=this;
      let ModelList=_self.goodsInfo.ModelList;
      let res=ModelList;
      let specvalue=[];
      if(ModelList==null || ModelList.length==0){
        return specvalue;
      }
      for(let j=0;j<_self.SelectSpec.length;j++){                
        let item=_self.SelectSpec[j];
        if(item.Id==specId){
          continue;
        }
        res=[];
        for(let i=0;i<ModelList.length;i++){
           if(_self.isenabledModel(item,ModelList[i])){
             res.push(ModelList[i]);
           }
        }
        ModelList=res;
      }

      
      if(res.length==0){
        return specvalue;
      }

      for(let j=0;j<res.length;j++){
        for(let i=0;i<res[j].Model_SpecList.length;i++){
          let item=res[j].Model_SpecList[i];
          if(item.Id==specId){
            if(this.arrayContain(specvalue,item.Value)==0){
              specvalue.push(item.Value);
            }
            
          }
        }
      }
      return specvalue;

    },
    isenabledModel(spec,Model){
      //判断此model 是否包含此选中的记录
      for(let i=0;i<Model.Model_SpecList.length;i++){
        let item=Model.Model_SpecList[i];
        if(item.Id==spec.Id && item.Value==spec.Value){
          return true;
        }
      }
      return false;
    },
    calSelectedModel(){
      let _self=this;
      _self.ImgUrl='';
      let specs=[];
      for(let j=0;j<_self.Sumlist.length;j++){
        var item=_self.Sumlist[j];
        if(item.SelectedId>0){
           var d={};
           d.Id=item.SpecId;
           d.SId=item.SelectedId;
           d.Value=item.SelectedValue;
           specs.push(d);
           if(_self.ImgUrl=='' && item.SelectedImg!=''){
             _self.ImgUrl=item.SelectedImg;
           }
        }
      }
      //升序
      _self.SelectSpec=specs.sort(function(a,b){
            return a.Id-b.Id;
          });
      _self.SelectedModel=null;
      if(specs.length!=_self.Sumlist.length){
        return;
      }

      for(let j=0;j<_self.goodsInfo.ModelList.length;j++){
        var item=_self.goodsInfo.ModelList[j];
        var SpecList=item.Model_SpecList.sort(function(a,b){
            return a.Id-b.Id;
          });

        if(item.Model_TotalCount<=0){
          continue;
        }
        if(_self.arrayEqual(specs,SpecList)){
           _self.SelectedModel=item;
           return;
        }
      }

    },
    arrayEqual(item1,item2){
      if(item1.length!=item2.length){
          return false;
        }
        for(let i=0;i<item1.length;i++){
          var a=item1[i];
          var b=item2[i];
          if(a.Id!=b.Id){
            return false;
          }
          if(a.Value!=b.Value){
            return false;
          }
        }
        return true;
    },
    showGoodsParameterInfo(_type){
      let _self=this;
      //如果是打开弹窗，记录原来的选中状态
      if(!_self.showParameterInfo){           
           _self.PreSumlist=JSON.parse(JSON.stringify(_self.Sumlist));
      }
      else{
        _self.PreSumlist=null;
      }
      _self.showParameterInfo = !_self.showParameterInfo;
      _self.AddType=_type;
    },
    closeAlert(){
      let _self=this;
      if(this.PreSumlist!=null){
         _self.Sumlist=JSON.parse(JSON.stringify(_self.PreSumlist));
        _self.calSelectedModel();
      _self.changespectype();
      }
      _self.showParameterInfo =false;
    },
    closeConfirmAlert(){
      this.showParameterInfo =false;
    }
  },
    onLoad(option) {
      var res = wx.getSystemInfoSync();
    this.winWidth = res.windowWidth;
    this.winHeight = res.windowHeight;
    this.goodsId=option.id;
    this.GetGoodsDeatils();
    this.ImgUrl="";
  },
  onShow(){
  	this.closeConfirmAlert();
  },
  created() {}
};
</script>

<style scoped lang="less">
.goodsImg {
  width: 100%;
  height: 600rpx;
  position: relative;
  .goodsStateA {
    position: absolute;
    top: 0;
    left: 30rpx;
    width: 70rpx;
    height: 70rpx;
    z-index: 2;
    img {
      width: 70rpx;
      height: 70rpx;
    }
  }
  .salesIcon {
    position: absolute;
    top: 30rpx;
    right: 30rpx;
    width: 96rpx;
    height: 96rpx;
    z-index: 2;
  }
  .memberIcon{
    position: absolute;
    top: 30rpx;
    right: 0rpx;
    width:108rpx;
		height: 30rpx;
  }
}
.goodsImg swiper image {
  width: 100%;
  height: 600rpx;
}
.goodsImg swiper {
  height: 600rpx;
}
.rushToBuy{
  // height: 120rpx;
  background:#fe7b1a;
  display: flex;
  justify-content: space-between;
  padding:20rpx 30rpx;
  box-sizing: border-box;
  .rushPrice{
    color: #fff;
    display: flex;
    flex-direction: column;
    .originalPrice{
      font-size: 24rpx;
      text-decoration: line-through;
      margin-bottom: 10epx;
    }
    .currentPrice{
      font-size: 48rpx;
      font-weight: bold;
    }
    .currentPrice:first-letter{
      font-size: 30rpx;
    }
  }
  .rushState{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 24rpx;
    color:#fff;
    .stateTips{
      font-size: 30rpx;
    }
    .countDown{
      display: flex;
      margin-top: 15rpx;
      .times{
        color:#333;
        .nums{
          width:34rpx;
          height: 34rpx;
          border-radius: 6rpx;
          background:#000;
          margin: 0 5rpx;
          color:#fff;
        }
      }
    }
  }
}
.rushToBuyState{
  background:#ff0036;
}
.goodsInfo {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 290rpx;
  background: #fff;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-sizing: border-box;
  .goodsName {
    color: #333;
    font-size: 28rpx;
    .PromotionGoods {
      width: 30rpx;
      height: 30rpx;
      padding: 2rpx;
      border-radius: 8rpx;
      background: #ff0036;
      color: #fff;
      font-size: 24rpx;
    }
  }
  .goodsPrice {
    display: flex;
    align-items: center;
    margin: 30rpx 0 20rpx;
    color: #999;
    font-size: 24rpx;
    .currentPrice {
      color: #ff0036;
      font-size: 36rpx;
    }
    .currentPrice:first-letter {
      font-size: 22rpx;
    }
    .originalPrice {
      text-decoration: line-through;
    }
    .jiage {
      margin: 0 5rpx 0 20rpx;
    }
  } 
}
.shopNews{
    display: flex;
  align-items: center;
  height: 28rpx;
  margin:12rpx 0;
}
.shopNews .shopCards{
  img{
    width:38rpx;
    height:28rpx;
  }
  display: flex;
    margin-right: 10rpx;
}
.shopNews .Deduction{
  display: flex;
  align-items: center;
  color: #fa3324;
  font-size: 20rpx;
  margin-right: 10rpx;
  img{
    width:38rpx;
    height: 28rpx;
    z-index: 2;
  }
  .DeductionNum{
    height: 28rpx;
    border: 1rpx solid #f31e46;
    border-left:none;
    margin-left:-5rpx;
    border-radius: 8rpx;
    padding:3rpx 6rpx;
    box-sizing: border-box;
    display:flex;
    align-items: center;
  }
    
}
.shopNews .shopReturn{
    font-size: 22rpx;
    color: #ff0036;
}
  
.goodsDiscount {
  display: flex;
  align-items: center;
  font-size: 20rpx;
  color: #666;
  .discountCard {
    width: 38rpx;
    height: 30rpx;
    .discountCardImg{
      width:38rpx;
			height:28rpx;
    }
  }
  .Deduction{
		display: flex;
		align-items: center;
		color: #fa3324;
  		font-size: 20rpx;
  		margin-right: 10rpx;
		img{
			width:38rpx;
			height: 28rpx;
			z-index: 2;
		}
		.DeductionNum{
			
			height: 24rpx;
			border: 1rpx solid #f31e46;
			border-left:none;
			text-align: center;
			margin-left:-5rpx;
			border-radius: 4rpx;
		}
  		
  }
    .discountCoupon {
    // width: 160rpx;
    height: 30rpx;
    text-align: center;
    color: #fa3324;
    border: 1rpx solid #f31e46;
    border-left: none;
    border-radius: 4rpx;
    margin-left: 15rpx;
    margin-right: 15rpx;
    padding-left: 50rpx;
    box-sizing: border-box;
    position: relative;
    .couponIcon {
      width: 44rpx;
      height: 32rpx;
      background: linear-gradient(#fc402d, #f8621f);
      color: #fff;
      text-align: center;
      position: absolute;
      top: -1rpx;
      left: 0;
    }
  }

}


.goodsOtherInfo {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  font-size: 24rpx;
  color: #666;
  margin-top: 40rpx;
}

.goodsParameter {
  height: 92rpx;
  display: flex;
  padding: 30rpx;
  background: #fff;
  box-sizing: border-box;
  font-size: 30rpx;
  color: #333;
}

.masks{
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

  .goodsParameterInfo{
    width: 100%;
    // height: 979rpx;
    // overflow: scroll;
    padding: 30rpx;
    box-sizing: border-box;
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
    .productInfo{
      display: flex;
      position: relative;
      .productInfoimg{
        width: 200rpx;
        height: 200rpx;
        margin-right: 30rpx;
      }
      .memberIcons{
        position: absolute;
        top:0;
        left:90rpx;
        width:108rpx;
        height: 30rpx;
      }
      .productAttributes{
        flex: 1;
        display: flex;
        flex-direction: column;
        position: relative;
        color: #333;
        font-size: 28rpx;
        .delete{
          width: 30rpx;
          height: 30rpx;
          border-radius: 30rpx;
          position: absolute;
          top: 0rpx;
          right: 0rpx;
        }
        .productPrice{
          color: #ff0036;
          font-size: 30rpx;
        }
        .productTotalCount{
          margin: 10rpx 0;
        }
        .selected{
          margin-bottom: 10rpx;
        }
      }
    }
    .productParam{
      display: flex;
      flex-direction: column;
      border-bottom: 1rpx solid #eee;
      padding:20rpx 0;
      .paramTitle{
        font-size: 30rpx;
        color: #333;
      }
      .paramList{
        margin-top:30rpx; 
        display: flex;
        flex-wrap: wrap;
        .paramItem{
          height: 58rpx;
          text-align: center;line-height: 58rpx;
          padding: 0 27rpx;
          margin-right:30rpx; 
          margin-bottom: 30rpx;
          box-sizing: border-box;
          font-size: 24rpx;
          color: #333;
          border-radius: 6rpx;
          background: #f5f5f5;
        }
        
        .select{
          background: #fff;
          border: 1px solid #e60012;
          color: #ff0036;
        }
        .noStock{
          color: #999;
        }
      }
    }
    .buyNumButton{
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1rpx solid #eee;
      padding: 20rpx 0;
      font-size: 30rpx;
      color: #333;
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
          width: 166rpx;
          height: 60rpx;
          text-align: center;
        }
      }
    }
    .buttonState{
      width: 100%;
      height: 100rpx;
      background: #df3e3f;
      text-align: center;
      line-height: 100rpx;
      color: #fff;
      font-size: 36rpx;
    }
    .buttonStateBlank{
      background: #999;
    }
  }
}


.goodsDetails {
  display: flex;
  flex-direction: column;
  margin-top: 20rpx;
  background: #fff;
  margin-bottom: 100rpx;
  .detailsTitle {
    color: #333;
    font-size: 30rpx;
    padding: 30rpx;
    box-sizing: border-box;
  }
  .details{
    overflow: hidden;
  }
  .details img {
    width: 100%;
    height: 1200rpx;
  }
  rich-text {
    width: 100%;
    img{
      width:100%;
      height: 100%;
    }
  }

}

.footer{
  display: flex;
  width: 100%;
  height: 100rpx;
  background: #fff;
  z-index: 2;
  position: fixed;
  bottom: 0;
  color: #fff;
  font-size: 36rpx;
  text-align: center;
  line-height: 100rpx;
  .carButton{
    width: 50%;
    color: #ff0036;
    border-top: 1rpx solid #ddd;
  }
  .buyButton{
    width: 50%;
    background: #ff0036;
  }
}
</style>
