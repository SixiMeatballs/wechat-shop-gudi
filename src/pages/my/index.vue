<template>
  <div class="container" :style="'height:'+winHeight+'px'">
    <div class="myCenter">
      <!-- 用户信息 -->
      <template v-if="Logined && UserInfo!=null">
      <div class="personalInfo">
        <template v-if="UserInfo.AccountIconUrl==null">
          <img class="userImg" src="/static/appImg/userIcon.png" alt="failes">
        </template>
        <template v-else>
          <img class="userImg" :src="UserInfo.AccountIconUrl" alt="failes">
        </template>
        <span class="login">{{UserInfo.AccountName}}</span>
      </div>
      <!-- 猜豆/抵扣券 -->
      <div class="userAccount">
        <navigator url="../../pages/beans/main">
          <div class="userAmount">
            <span class="amountNum">{{BounsMoneystr}}</span>
            <span class="amountTitle">猜豆余额 （个）</span>
          </div>
        </navigator>
        <div class="line"></div>
        <navigator url="../../pages/discountCoupon/main">
          <div class="userAmount">
            <span class="amountNum">{{GoldMoneystr}}</span>
            <span class="amountTitle">抵扣券 （张）</span>
          </div>
        </navigator>  
      </div>
      </template>
      <template v-else>
        <div class="personalInfo">
          <img class="userImg" src="/static/appImg/userIcon.png" alt="failes">
          <navigator class="login" url="../../pages/login/main">登录 / 注册</navigator>
        </div>
      <!-- 猜豆/抵扣券 -->
      <div class="userAccount">
          <div class="userAmount">
            <span class="amountNum">0</span>
            <span class="amountTitle">猜豆余额 （个）</span>
          </div>
        <div class="line"></div>
          <div class="userAmount">
            <span class="amountNum">0</span>
            <span class="amountTitle">抵扣券 （张）</span>
          </div>
      </div>
      </template>


      <!-- 卡包 -->
      <div class="cardPackage" v-if="!' '">
        <div class="cardList">
          <div class="weui-flex">
            <block v-for="(item,index) in cardList" :key="index">
                <navigator url="" class="weui-grid" hover-class="weui-grid_active" style="border:none;">
                  <div class="placeholder">
                    <image class="weui-grid__icon" :src="item.src" />
                    <div class="weui-grid__label">{{item.name}}</div>
                  </div>
                </navigator>
            </block>
          </div>
          <div class="weui-cells weui-cells_in-small-appmsg">
            <navigator url="" class="weui-cell weui-cell_access">
              <div class="weui-cell__hd">
                <image src="http://placehold.it/20x20" style="width: 48rpx;height: 48rpx;margin-right: 30rpx;border-radius:50%;" />
              </div>
              <div class="weui-cell__bd weui-cell_primary">
                <div>卡包</div>
              </div>
              <div class="weui-cell__ft weui-cell__ft_in-access"></div>
            </navigator>
          </div>
        </div>
      </div>

      <!-- 地址管理 -->
      <block v-for="(item,index) in Menu" :key="index">
        <template v-if="item.MenuType=='split'">
          <div class="line"></div>
        </template>
        <template v-if="item.MenuType=='tree'">
          <div  class="menuList">
          <a class="menuItem" :url="item.AppAction.ActionValue">
            <img class="itemIcon" :src="item.IconUrl">
            <div class="itemCon">{{item.Title}}</div>
            <div class="weui-cell__ft weui-cell__ft_in-access"></div>
          </a> 
          </div>
        </template>
      </block>
            
        <!-- <a href="/pages/expressList/main">快递列表</a>
        <a href="/pages/expressInfo/main">快递信息</a>
        <a href="/pages/refundDetails/main">退款详情页</a>

        <button class="weui-btn" type="default" @click="refundDetails">退款详情</button> -->

      <button class="exitButton" @click="ClearLogin">退出账号</button>  
    </div>
  </div>
</template>

<script>
import mptoast from "mptoast";
import { toThousands } from '@/utils/index'

export default {
  data() {
    return {
      cardList: [
        { src: "http://placehold.it/50x50", name: "优惠卡" },
        { src: "http://placehold.it/50x50", name: "话费充值" },
        { src: "http://placehold.it/50x50", name: "爱奇艺会员" },
        { src: "http://placehold.it/50x50", name: "更多" }
      ],
      winHeight: null,
      Logined: false,
      UserInfo: null,
      Menu: null,
      BounsMoneystr:'',
      GoldMoneystr:''
    };
  },
  components: {
    mptoast
  },
  computed: {},
  methods: {
    showToast() {
      this.$mptoast("我是提示信息", "success", 2000);
    },
    openSuccess() {
      wx.navigateTo({
        url: '../msg-success/main'
      })
    },
    openFail: function () {
      wx.navigateTo({
        url: '../msg-fail/main'
      })
    },
    openDetails: function () {
      wx.navigateTo({
        url: '../orderDetails/main'
      })
    },
    payawait: function () {
      wx.navigateTo({
        url: '../payAwait/main'
      })
    },
    refundApply: function () {
      var d={};
      d.goodsName="小米8";
      d.goodsParam="红色 128G";
      d.goodsImg="http://p1509fp8v.bkt.clouddn.com/20180808141703927_e2394fa5164f4262a5dcc09dd674a8bb.jpg";
      d.currentPrice="2900";
      d.goodsNum="4";
      d.userName="牛牛";

       d.userPhone="13989489632";
        d.Province="江西省";
         d.Prefecture="杭州市";
          d.County="衢州区";
           d.AddressDetail="为不中以有工历以";
            d.OrderId=2371;
            d.ModelId=40;
            d.GoodsId=19;
            d.RefundType=1;//类型1.退款 0.售后

            d.OrderNo="sdferwfsd1110110";
            d.originalPrice="45678";

let json=JSON.stringify(d);
      wx.navigateTo({
        url: '../refundApply/main?v='+json
      })
    },
    orderPay: function () {
      wx.navigateTo({
        url: '../orderPay/main'
      })
    },
    refundDetails: function () {

       var d={};
      d.goodsName="小米8";
      d.goodsParam="红色 128G";
      d.goodsImg="http://p1509fp8v.bkt.clouddn.com/20180808141703927_e2394fa5164f4262a5dcc09dd674a8bb.jpg";
      d.currentPrice="2900";
      d.goodsNum="4";

            d.OrderId=2371;
            d.ModelId=40;
            d.GoodsId=19;
            d.RefundType=1;//1.退款 2退货退款 3换货 4维修

            d.OrderNo="sdferwfsd1110110";
            d.originalPrice="45678";
            d.afterSaleId=1000000594;

let json=JSON.stringify(d);
      wx.navigateTo({
        url: '../refundDetails/main?v='+json
      })
    },
    async GetUserInfo() {
      let _self = this;
      _self.Logined = await this.$LoginVerify.CheckLoginStatus();
      console.log("是否登录：" + _self.Logined);
      if (_self.Logined) {
        let data = await this.$MainFn.CallApi(
          "/Account/GetAccountSummary",
          "",
          ""
        );
        _self.UserInfo = data.Data;
        _self.BounsMoneystr= toThousands(_self.UserInfo.BounsMoney);
        _self.GoldMoneystr= toThousands(_self.UserInfo.GoldMoney);
      }
    },
    async GetMenu() {
      let url = "/Layout/GetMenu";
      let d = { PageCode: "mypage" };
      let data = await this.$MainFn.CallApi(url, d, "");
      this.Menu = data.Data;
    },
    async getGoodsTagList() {
      let _self = this;
      let data = await this.$MainFn.CallApi("/Mall/GetGoodsTag", "", "");
      _self.goodsTagList = data.Data;
      _self.currentGoodsTagId = data.Data[0].TagId;
    },

    async ClearLogin() {
      let _self = this;
      this.$LoginVerify.ClearLogin(function() {
        _self.GetUserInfo().then(function() {});
      });
    }
  },
  onLoad() {
    var res = wx.getSystemInfoSync();
    console.log(res);
    this.winWidth = res.windowWidth;
    this.winHeight = res.windowHeight;
    this.GetMenu();
  },
  onShow() {
    this.GetUserInfo();
  },

  created() {
    this.GetUserInfo();
  }
};
</script>

<style scoped lang="less">
.myCenter{
  width:100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
}
.line {
  width: 100%;
  height: 20rpx;
}

.personalInfo {
  height: 230rpx;
  min-height:230rpx;
  background: linear-gradient(#df4a40, #e03443);
  padding: 60rpx 30rpx 50rpx;
  display: flex;
  align-items: center;
  .userImg {
    width: 120rpx;
    height: 120rpx;
    border-radius: 120rpx;
  }
  .login {
    font-size: 30rpx;
    color: #fff;
    margin-left: 30rpx;
  }
}

.userAccount {
  height: 140rpx;
  min-height:140rpx;
  margin-bottom: 20rpx;
  display: flex;
  justify-content: space-around;
  background: #fff;
  .userAmount {
    height: 140rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-size: 24rpx;
    color: #999;
    .amountNum {
      text-align: center;
      font-size: 30rpx;
      color: #e65248;
    }
  }
  .line {
    width: 1rpx;
    height: 70rpx;
    background: #ddd;
    margin: 36rpx 0 34rpx;
  }
}

.cardPackage {
  background: #fff;
  margin-bottom:20rpx;
  .cardList {
    .weui-cell {
      border-top: 1rpx solid #ddd;
      margin-left: 30rpx;
    }
  }
}

.menuList{
  display: flex;
  flex-direction: column;
  padding-left:30rpx;
  background:#fff;
  height: 92rpx;
  min-height: 92rpx;
  .menuItem{
    height: 92rpx;
    min-height: 92rpx;
    padding-right: 30rpx;
    display: flex;
    align-items: center;
    color:#333;
    font-size: 30rpx;
    border-bottom: 2rpx solid #eee;
    .itemIcon{
      width: 48rpx;
      height: 48rpx;
      border-radius: 50%;
      margin-right: 30rpx;
    }
    .itemCon{
      flex:1;
    }
  }
}

.exitButton {
  width: 690rpx;
  height: 88rpx;
  min-height:88rpx;
  text-align: center;
  line-height: 88rpx;
  margin-top: 30rpx;
  margin: 30rpx 30rpx;
  background: #fff;
}
</style>
