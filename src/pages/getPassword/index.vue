<template>
  <div class="container" :style="'height:'+winHeight+'px'">
    <!-- 忘记密码输入框 -->
    <div class="enterBox" v-if="enterBox">
      <div class="inputBox">
        <input type="text" v-model="Mobile" placeholder="请输入手机号码找回"  @input="GetPhoneVerifyCodeCountdown">
      </div>
      <button class="loginBtn" @click="GetPhoneVerifyCodeCountdown" :style="'background:'+buttonStates">下一步<mptoast/></button>
    </div>

   <!-- 找回密码输入框 -->
   <div class="get" v-if="!enterBox" >
      <div class="getPassword">
      <div class="mesCode">
        <input type="text" placeholder="请输入手机短信验证码" v-model="VerifyCode">
        <button class="getCode" v-if="NumberCountDown==0" @click="getPicCode">获取验证码</button>
        <button class="getCode" v-if="NumberCountDown>0">重新({{NumberCountDown}})</button>
        <button class="getCode" v-if="NumberCountDown==-1">次数已到</button>
      </div>
      <div class="lines"></div>
      <div class="newPassword">
        <input type="text" placeholder="请设置登录密码"  password="true" v-model="NewPwd">
        <img src="/static/appImg/eye-close.png" alt="">
      </div>
    </div>
    <div class="tips">密码由6~20位英文字母、数字或符号组成（不能是纯数字、英文;不能是连号数字、英文）。</div>
    <button class="loginBtn" @click="ResetPassWord()">确定<mptoast/></button>
   </div>

    <!-- 图形验证码弹框 -->
    <div class="masks" v-if="imgCodeShow">
      <div class="imgCode">
        <div class="imgCodeTitle">
          请输入图片验证码
          <icon class="delete" type="clear" size="15" @click="closeAlert" />
        </div>
        <div class="inputBoxs">
          <input type="text" placeholder="请输入"  v-model="PicCode" placeholder-style="color:#ccc;">
          <img :src="PicUrl" alt="failed">
        </div>
        <div class="loginBtns" @click="getSMSCode">确定</div>
      </div>
    </div>
  </div>
  
</template>

<script>
import mptoast from "mptoast";

import md5 from "js-md5";

let t;

export default {
  data() {
    return {
      winHeight: null,
      Mobile: "",
      buttonStates:null,//按钮状态
      enterBox:true,
      VerifyCode: "",
      BusType: "",
      PicCode: "",
      NewPwd:"",
      PicUrl: "",
      NumberCountDown: 0,
      imgCodeShow:false, //图形验证码弹框
    };
  },
  components: {
    mptoast
  },
  computed: {},
  methods: {
    showToast(con) {
      if(con==null){
        con = "请输入密码"
      }
      this.$mptoast(con, 'success', 2000);
    },
    closeAlert(){
      this.imgCodeShow =false;
    },
     async GetPhoneVerifyCodeCountdown() {
      var _self = this;
      _self.buttonStates="";
      if (_self.Mobile.length != 11) {
        return;
      }
      _self.changeSate();
      _self.enterBox=false;
      let url = "/Account/GetPhoneVerifyCodeCountdown";
      let d = { verifyCodeType: "ACCOUNTFORGETPASSWORD", phone: _self.Mobile };
      let data = await this.$MainFn.CallApi(url, d, "");
      _self.NumberCountDown = data.Data;
      if (_self.NumberCountDown <= 0) {
        clearInterval(t);
        return;
      }
      t = setInterval(function() {
        _self.NumberCountDown--;
        if (_self.NumberCountDown <= 0) {
          clearInterval(t);
        }
      }, 1000);
    },
    async getPicCode() {
      this.imgCodeShow = true;
      let url = "/Account/GetPicVerifyCode";
      let d = { verifyCodeType: "ACCOUNTFORGETPASSWORD", phone: this.Mobile };
      let data = await this.$MainFn.CallApi(url, d, "");
      this.PicUrl = data.Data;
    },
    async getSMSCode() {
      this.imgCodeShow =false;
      let url = "/Account/SendForgetPassWordVerifyCode";
      let d = { picVerifyCode: this.PicCode, phone: this.Mobile };
      let data = await this.$MainFn.CallApi(url, d, "");
      this.GetPhoneVerifyCodeCountdown();
      wx.setStorage({
        key: "BusType",
        data: data.Data
      });
    },
    async ResetPassWord() {
      let BusType = wx.getStorageSync("BusType") || "";
      let url = "/Account/ResetPassWord";
      let d = {
        Phone: this.Mobile,
        Actioncode: BusType,
        Verifycode: this.VerifyCode,
        newpassword:md5(this.NewPwd)
      };
      let data = await this.$MainFn.CallApi(url, d, "");
      wx.navigateBack({
       delta: 1 //返回的页面数，如果 delta 大于现有页面数，则返回到首页,
     });
    },
    nexts(){
      this.enterBox = !this.enterBox;
    },
    changeSate(){
      this.buttonStates = '#DF3E3F';
    }
  },
  onLoad(option) {
    var res = wx.getSystemInfoSync();
    this.winWidth = res.windowWidth;
    this.winHeight = res.windowHeight;
    this.enterBox=true;
  },
  onShow() {},

  created() {}
};
</script>

<style scoped lang="less">
input{
  border: none;
  font-size: 30rpx;
  color: #333;
}
.inputBox{
  height: 100rpx;
  background: #fff;
  margin-top: 20rpx;
  padding: 30rpx;
  box-sizing: border-box;
}
.getPassword{
  display: flex;
  flex-direction: column;
  background: #fff;
  margin-top: 20rpx;
  padding: 30rpx;
  box-sizing: border-box;
  .mesCode{
    display: flex;
    align-items: center;
  }
  input{
    flex: 1;
  }
  .getCode{
      width: 180rpx;
      height: 60rpx;
      border-radius: 5rpx;
      background: #E65248;
      color: #fff;
      font-size: 28rpx;
      text-align: center;
      line-height: 60rpx;
    }
    .lines{
      height: 1rpx;
      background: #ccc;
      margin: 20rpx 0;
    }
    .newPassword{
      display: flex;
      align-items: center;
      img{
        width: 40rpx;
        height: 40rpx;
      }
    }
}
.tips{
  padding:20rpx 30rpx 0; 
  font-size: 24rpx;
  color: #999;
}
.loginBtn {
  width: 690rpx;
  height: 88rpx;
  border-radius: 10rpx;
  background: #999;
  text-align: center;
  line-height: 88rpx;
  margin: 30rpx;
  color: #fff;
  font-size: 30rpx;
}

.masks{
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 503;
  .imgCode{
    width:570rpx;
    height: 400rpx; 
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    background: #fff;
    border-radius: 10rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 30rpx;
    box-sizing: border-box;
    .imgCodeTitle{
      height: 90rpx;
      text-align: center;
      line-height: 90rpx;
      position: relative;
      .delete{
        width: 26rpx;
        height: 26rpx;
        position: absolute;
        top: 0;
        right: 0;
      }
    }
    .inputBoxs{
      width: 500rpx;
      height: 100rpx;
      border: 1rpx solid #ddd;
      border-radius: 10rpx;
      display: flex;
      align-items: center;
      input{
        width: 300rpx;
        height: 100%;
        border: none;
        padding-left:20rpx;
        box-sizing: border-box; 
      }
      img{
        width: 200rpx;
        height: 100%;
      }
    }
    .loginBtns{
      width: 500rpx;
      height: 88rpx;
      border-radius: 10rpx;
      background: #e65248;
      color: #fff;
      font-size: 32rpx;
      text-align: center;
      line-height: 88rpx;
    }
  }
}


</style>
