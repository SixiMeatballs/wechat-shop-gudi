<template>
  <div class="container" :style="'height:'+winHeight+'px'">
  	 <mptoast />
      <div class="goodsOrderItem">  
        <!-- 商品信息 -->        
        <div class="items">
          <img :src="goodsinfo.goodsImg" alt="" class="goodsImg">
          <div class="goodsInfos">
            <div class="goodsName">{{goodsinfo.goodsName}}</div>
            <div class="goodsParam">{{goodsinfo.goodsParam}}</div>
            <div class="goodsPrice">
              <div class="currentPrice">￥{{goodsinfo.currentPrice}}</div>
              <div class="goodsNum">x{{goodsinfo.goodsNum}}</div>
            </div>
          </div>
        </div>
        <!-- 退款原因 -->
        <div class="refundItem" @click="openAlert">
          <div class="tips">{{Word}}原因</div>
          <div class="weui-cell__ft weui-cell__ft_in-access">{{Reason}}</div>
        </div>
        <!-- 退款原因弹窗 -->
        <div class="mask" v-if="refundShow">
          <div class="cardLists">
            <div class="listTitle">{{Word}}原因</div>
            <div class="amountList">
              <div class="list-item" v-for="(item,index) in ReasonList" :key="index" v-if="item.type==goodsinfo.RefundType">
                <div class="cardName">{{item.key}}</div>
                <icon type="success" @click="selectReason(item.key,item.value,item.type,0)" v-if="item.key==Reason"/>
                <icon type="circle" @click="selectReason(item.key,item.value,item.type,1)" v-if="item.key!=Reason"/>
              </div>
            </div>
            <div class="sure-btn" @click="closeAlert">关闭</div>
          </div>
        </div>
        <!-- 用户地址 -->
        <div class="userAddress" v-if="goodsinfo.RefundType==0">
          <div class="userInfo">
            <span class="userName">{{goodsinfo.userName}}</span>
            <span class="userPhone">{{goodsinfo.userPhone}}</span>
          </div>  
          <div class="address">{{goodsinfo.Province}}  {{goodsinfo.Prefecture}}  {{goodsinfo.County}}  {{goodsinfo.AddressDetail}}</div>
        </div>
        <block v-if="goodsinfo.RefundType==1 && refundInfo!=null">
        <!-- 退款金额 -->
        <div class="refundItem">
          <div class="tips">退款金额: <span class="currentPrice">￥{{refundInfo.RefundMoney}}</span></div>
        </div>
        <!-- 退回抵扣券-->
        <div class="refundItem">
          <div class="tips">退回抵扣券（张）：{{refundInfo.RefundGold}}</div>
        </div>
        </block>
        <!-- 退款说明 -->
        <div class="refundItem">
          <div class="tips">{{Word}}说明： <input type="text" class="descri" placeholder="选填" v-model="Description" placeholder-style="color:#ccc;"></div>
        </div>
        <!-- <div v-for="(item ,index) in base64files" :key="index">
            <div>{{item.path}}  ----------------   {{item.base64}}</div>
        </div> -->
        <!-- 上传凭证 -->
        <div class="upload">
          <div class="weui-uploader">
            <div class="weui-uploader__hd">
              <div class="weui-uploader__title">上传凭证</div>
              <!-- <div class="weui-uploader__info">{{files.length}}/{{files.length}}</div> -->
            </div>
            <div class="weui-uploader__bd">
              <div class="weui-uploader__files" id="uploaderFiles">
                <div v-for="(item ,index) in files" :key="index">
                  <div class="weui-uploader__file">
                    <image class="weui-uploader__img" :src="item" mode="aspectFill" @click="predivImage" :id="item" />
                    <div class="delete-icon" @click="deleteImg" :id="item"></div>
                  </div>
                </div>
              </div>
              <div class="weui-uploader__input-box">
                <div class="weui-uploader__input" @click="chooseImage"></div>
              </div>
            </div>
          </div>
        </div>        
      </div>
      <div class="btn" @click="CommitRefund">提交</div>
  </div>
</template>

<script>
import mptoast from "mptoast";

export default {
  data() {
    return {
      winHeight:null,//页面高度
      files: [],
      base64files: [],
      refundShow : false,
      Type:0,  //类型1.退款 2退货退款 3换货 4维修
      Word:'',
      Description:'',
      Reason:'',
      ReasonList:[{key:'换货',value:3,type:0},{key:'维修',value:4,type:0},{key:'不喜欢/不想要',value:1,type:1},{key:'空包裹',value:1,type:1},{key:'快递/物流一直未到',value:1,type:1},{key:'快递/物流无跟踪记录',value:1,type:1},{key:'货物破损已签收',value:1,type:1}],
      goodsinfo:{},//goodsName,goodsParam,goodsImg,currentPrice,goodsNum,userName,userPhone,Province,Prefecture,County,AddressDetail,OrderId,GoodsId,ModelId,RefundType,OrderNo,originalPrice
      refundInfo:{}
    };
  },
  components: {
    mptoast
  },
  computed: {

  },
  methods: {
    empty(){
      let _self=this;
      _self.goodsinfo={};
      _self.Type=0;
      _self.Word='';
      _self.Description='';
      _self.Reason='';
      _self.refundInfo={};
    },
    selectReason(key,value,type,selected){
      //退款只改变原因，  售后 除了改变原因，还要 改变售后类型
      if(selected==1){
        this.Reason=key;
        if(type==0){        
          this.Type=value;
        }  
      	this.closeAlert();
      }
//    else{
//      this.Reason='';
//      if(type==0){        
//        this.Type=0;
//      }
//    }
      
    },
    async CommitRefund(){
      let _self=this;
      if(_self.goodsinfo.RefundType==0 && _self.Type==0){
        _self.showToast("请选择售后原因",2000)
        return;
      }
      let url = "/Mall/GoodsApplyAfterSale";
      let param={};
      // {"Reason":"我要退货","Description":"退货","OrderId":364,"GoodsId":2,"GoodsModelId":18,"ImgArr":["","","",""]}
      param.Reason=_self.Reason;
      param.Description=_self.Description;
      param.OrderId=_self.goodsinfo.OrderId;
      param.GoodsId=_self.goodsinfo.GoodsId;
      param.GoodsModelId=_self.goodsinfo.ModelId;

      let ImgArr=[];
      for(let j=0;j<_self.base64files.length;j++){
        ImgArr.push(_self.base64files[j].base64);
      }
      param.ImgArr=ImgArr;

      let d1 = { type: _self.Type,content:JSON.stringify(param)};
      let data = await _self.$MainFn.CallApi(url, d1, "",undefined,"post");

			wx.navigateBack({
       delta: 1 //返回的页面数，如果 delta 大于现有页面数，则返回到首页,
     	});
//           var d={};
//    d.goodsName=_self.goodsinfo.goodsName;
//    d.goodsParam=_self.goodsinfo.goodsParam;
//    d.goodsImg=_self.goodsinfo.goodsImg;
//    d.currentPrice=_self.goodsinfo.currentPrice;
//    d.goodsNum=_self.goodsinfo.goodsNum;
//
//          d.OrderId=_self.goodsinfo.OrderId;
//          d.ModelId=_self.goodsinfo.ModelId;
//          d.GoodsId=_self.goodsinfo.GoodsId;
//          d.RefundType=_self.Type;//1.退款 2退货退款 3换货 4维修
//
//          d.OrderNo=_self.goodsinfo.OrderNo;
//          d.originalPrice=_self.goodsinfo.originalPrice;
//          d.afterSaleId=data.Data;
//
//			let json=JSON.stringify(d);
//    wx.redirectTo({
//      url: '../refundDetails/main?v='+json
//    })
    },
    async GetRefundInfo() {
      let _self=this;
      let url = "/Mall/GetRefundInfo";
      let d = { orderId: _self.goodsinfo.OrderId,ModelId:_self.goodsinfo.ModelId };
      let data = await _self.$MainFn.CallApi(url, d, "");
      this.refundInfo = data.Data;
    },
    showToast(conetent,state,time) {
      this.$mptoast(conetent, state, time);
    },
    chooseImage(e) {
      let _this = this;
      wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function(res) {
          console.log('成功上传：' + res.tempFilePaths);
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          _this.files = _this.files.concat(res.tempFilePaths);
          _this.addbase64img(res.tempFilePaths);
        },
        fail: function() {
          console.log('fail');
        },
        complete: function() {
          console.log('commplete');
        }
      });
    },
    addbase64img(paths){
       let _self=this;
       for(let j=0;j<paths.length;j++){
         let path=paths[j];
         wx.request({
              url:path,
              method:'GET',
              responseType: 'arraybuffer',
              success:function(res){
                let base64 = wx.arrayBufferToBase64(res.data);
                // console.log(base64);
                //$this.data.userImageBase64 = 'data:image/jpg;base64,' + base64;;
                let d={};
                d.path=path;
                d.base64=base64;
                _self.base64files.push(d);
              },
              fail:function(res){
                // console.log("fail");
                // console.log(res);
              },
              complete:function(res){
                // console.log("complete");
                // console.log(res);
              }
        });
       }
    },
    predivImage(e) {
      console.log(e);
      wx.previewImage({
        current: e.currentTarget.id, // 当前显示图片的http链接
        urls: this.files // 需要预览的图片http链接列表
      });
    },
    deleteImg(e) {
      Array.prototype.indexOf = function(val) {
        for (let i = 0; i < this.length; i++) {
          if (this[i] == val) return i;
        }
        return -1;
      };
      Array.prototype.remove = function(val) {
        let index = this.indexOf(val);
        if (index > -1) {
          this.splice(index, 1);
        }
      };

      Array.prototype.indexOfbase64 = function(val) {
        for (let i = 0; i < this.length; i++) {
          if (this[i].path == val) return i;
        }
        return -1;
      };
      Array.prototype.removebase64 = function(val) {
        let index = this.indexOfbase64(val);
        if (index > -1) {
          this.splice(index, 1);
        }
      };
      console.log(e.currentTarget);
      this.files.remove(e.currentTarget.id);
      this.base64files.removebase64(e.currentTarget.id);
    },
    openAlert(){
      this.refundShow = true;
    },
    closeAlert(){
      this.refundShow = false;
    },

  },
  onLoad(option) {
    let v=option.v;
    if(v!=undefined && v!=""){
      let item=JSON.parse(v);
      this.goodsinfo.goodsName=item.goodsName;
      this.goodsinfo.goodsParam=item.goodsParam;
      this.goodsinfo.goodsImg=item.goodsImg;
      this.goodsinfo.currentPrice=item.currentPrice;
      this.goodsinfo.goodsNum=item.goodsNum;
      this.goodsinfo.userName=item.userName;

       this.goodsinfo.userPhone=item.userPhone;
        this.goodsinfo.Province=item.Province;
         this.goodsinfo.Prefecture=item.Prefecture;
          this.goodsinfo.County=item.County;
           this.goodsinfo.AddressDetail=item.AddressDetail;
            this.goodsinfo.OrderId=item.OrderId;
            this.goodsinfo.ModelId=item.ModelId;
            this.goodsinfo.GoodsId=item.GoodsId;
            this.goodsinfo.RefundType=item.RefundType;
            this.goodsinfo.OrderNo=item.OrderNo;
            this.goodsinfo.originalPrice=item.originalPrice;

            

            if(this.goodsinfo.RefundType==1){
              this.Type=1;
              this.Word='退款';
              this.Reason='不喜欢/不想要';
              this.GetRefundInfo();
            }
            else{
              this.Word='售后';
              this.Reason='';
            }
    }
    else{
      this.empty();
    }

    var res = wx.getSystemInfoSync();
    this.winWidth = res.windowWidth;
    this.winHeight = res.windowHeight; 

  },
  onShow(){
  	this.closeAlert();
  	this.files=[];
  	this.base64files=[];
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
  margin-top: 20rpx;
  margin-bottom: 120rpx;
  font-size: 30rpx;
  color: #333;
  .currentPrice{
    font-size: 30rpx;
    color: #ff0036;
  }
  .currentPrice:first-letter{
    font-size: 20rpx;
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
        font-size: 28rpx;
        color: #333;
      }
    }
  }
  .refundItem{
    height: 92rpx;
    min-height: 92rpx;
    margin-bottom: 20rpx;
    padding: 30rpx;
    box-sizing: border-box;
    background: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .tips{
      display: flex;
      .descri{
        border: none;
        padding-left: 10rpx; 
      }
    }
  }
  .upload{
    background: #fff;
    padding: 30rpx;
    box-sizing: border-box;
  }
  .userAddress{
    height: 178rpx;
    min-height: 178rpx;
    padding: 30rpx;
    box-sizing: border-box;
    background: #fff;
    display: flex;
    flex-direction: column;
    color: #333;
    font-size: 28rpx;
    margin-bottom: 20rpx;
    .userInfo{
      margin-bottom: 30rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .address{
      color:#999;
    }
  }
}
.btn{
  width: 100%;
  height: 100rpx;
  background: #ff0036;
  font-size: 30rpx;
  color: #fff;
  text-align: center;
  line-height: 100rpx;
  position: fixed;
  bottom: 0;
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
  z-index: 500;
  .cardLists {
    width: 100%;
    height: 700rpx;
    position: relative;
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
      justify-content: center;
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
.weui-uploader__file {
  position: relative;
}
.weui-uploader__bd {
  overflow: visible;
}
.delete-icon {
  position: absolute;
  width: 40rpx;
  height: 40rpx;
  background: #f43530;
  right: 0;
  top: -20rpx;
  border-radius: 40rpx;
  z-index: 5;
}
.delete-icon::before {
  content: '';
  width: 26rpx;
  height: 4rpx;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
}
</style>
