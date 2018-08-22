<template>
  <div class="container">
    <div class="content">
      <div class="navbar">
        <block v-for="(item,index) in tabs" :key="index">
          <div :id="index" :class="{'navbar_item_on':activeIndex == index}" class="navbar_item" @click="tabClick">
            <div class="navbar_title">{{item.name}}</div>
          </div>
        </block>
        <div class="navbar_slider" :class="navbarSliderClass"></div>
      </div>
      <swiper class="content" :duration="50" :style="'height:'+contentHeight" @change="swiperChange" :current="currentTab" @animationfinish="onAnimationfinish">
        <swiper-item>
          <div class="accountLogin">
            <div class="loginInput">
              <div class="subtitle">账号</div>
              <input type="text" placeholder="请输入手机号/用户名" v-model="UserName" placeholder-style="color:#ccc;">
            </div>
            <div class="lines"></div>
            <div class="loginInput">
              <div class="subtitle">密码</div>
              <input type="text" placeholder="请输入密码" password="true" v-model="PassWord" placeholder-style="color:#ccc;">
            </div>
          </div>

          <button class="loginBtn loginBtnState" @click="accountLogin">登录</button>
          <a class="forget" href="/pages/getPassword/main">忘记密码</a>

          <div class="otherLogin">
            <div class="lines"></div>
            <div class="words">其它方式登录</div>
            <div class="lines"></div>
          </div>

         <!--  <div class="weixin-btn"  open-type="getUserInfo"  @click="WechatLogin">
            <img src="/static/appImg/weixinIcon.png" alt="">
          </div> -->

          <button class="weixin-btn" open-type="getUserInfo" lang="zh_CN"  @getuserinfo="WechatLogin" v-if="canIUse"><img src="/static/appImg/weixinIcon.png" alt=""></button>

        </swiper-item>

        <swiper-item>
          <div class="accountLogin">
            <div class="loginInput">
              <div class="subtitle">手机号</div>
              <input type="text" placeholder="请输入手机号" v-model="Mobile" @input="GetPhoneVerifyCodeCountdown" placeholder-style="color:#ccc;">
            </div>
            <div class="lines"></div>
            <div class="loginInput">
              <div class="subtitle">验证码</div>
              <input type="text" placeholder="请输入验证码" v-model="VerifyCode" placeholder-style="color:#ccc;">
              <div class="imgCode" v-if="NumberCountDown==0" @click="getPicCode">获取验证码</div>
              <div class="imgCode" v-if="NumberCountDown>0">重新获取({{NumberCountDown}})</div>
              <div class="imgCode" v-if="NumberCountDown==-1">次数已到</div>
            </div>
          </div>
          

          <div class="mesTips">首次用手机号登录默认注册微猜</div>
          <button class="loginBtn loginBtnState" @click="SMSVerifyCodeLogin">登录</button>
          <div class="otherLogin">
            <div class="lines"></div>
            <div class="words">其它方式登录</div>
            <div class="lines"></div>
          </div>

          <!--  <div class="weixin-btn"  open-type="getUserInfo"  @click="WechatLogin">
            <img src="/static/appImg/weixinIcon.png" alt="">
          </div> -->

          <button class="weixin-btn" open-type="getUserInfo"  lang="zh_CN"  @getuserinfo="WechatLogin"  v-if="canIUse">
            <img src="/static/appImg/weixinIcon.png" alt="">
          </button>

        </swiper-item>
      
      </swiper>
    </div>
    <!-- 图形验证码弹框 -->
    <div class="masks" v-if="imgCodeShow">
      <div class="imgCode">
        <div class="imgCodeTitle">
          请输入图片验证码
          <icon class="delete" type="clear" size="15" @click="closeAlert" />
        </div>
        <div class="inputBox">
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

import { Login } from '@/utils/BaseFn'

let t;

export default {
  data() {
    return {
      tabs: [
        {
          name: "账号密码登录",
          type: "1",
          checked: true
        },
        {
          name: "手机验证码登录",
          type: "2",
          checked: true
        }
      ],
      activeIndex: 0,
      currentTab: 0,
      winWidth: 0,
      winHeight: 0,
      UserName: "",
      PassWord: "",
      Mobile: "",
      VerifyCode: "",
      BusType: "",
      PicCode: "",
      PicUrl: "",
      NumberCountDown: 0,
      UserInfo: null,
      imgCodeShow:false, //图形验证码弹框
      canIUse: wx.canIUse('button.open-type.getUserInfo')
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
    },
    contentHeight() {
      return this.winHeight + "px";
    }
  },
  methods: {
    empty(){
      let _self=this;
      _self.activeIndex=0;
      _self.currentTab=0;
      _self.UserName="";
      _self.PassWord="";
      _self.Mobile="";
      _self.VerifyCode="";
      _self.PicCode="";
      _self.PicUrl="";
      _self.NumberCountDown=0;
      _self.UserInfo=null;
      _self.imgCodeShow=false;
    },
    tabClick(e) {
      this.activeIndex = e.currentTarget.id;
      this.currentTab = this.activeIndex;
    },
    async accountLogin() {
      let url = "/Account/UserLogin";
      let d = { usernameOrPhone: this.UserName,client:'wechat', password: md5(this.PassWord) };
      let data = await this.$MainFn.CallApi(url, d, "");
      this.$LoginVerify.LoginSuccess(data.Data.UserUUID);
    },
    async GetPhoneVerifyCodeCountdown() {
      var _self = this;
      if (_self.Mobile.length != 11) {
        return;
      }
      let url = "/Account/GetPhoneVerifyCodeCountdown";
      let d = { verifyCodeType: "ACCOUNTVERIFYCODELOGIN", phone: _self.Mobile };
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
      let d = { verifyCodeType: "ACCOUNTVERIFYCODELOGIN", phone: this.Mobile };
      let data = await this.$MainFn.CallApi(url, d, "");
      this.PicUrl = data.Data;
    },
    closeAlert(){
      this.imgCodeShow =false;
    },
    async getSMSCode() {
      this.imgCodeShow =false;
      let url = "/Account/SendLoginVerifyCode";
      let d = { picVerifyCode: this.PicCode, phone: this.Mobile };
      let data = await this.$MainFn.CallApi(url, d, "");
      this.GetPhoneVerifyCodeCountdown();
      wx.setStorage({
        key: "BusType",
        data: data.Data
      });
    },
    async SMSVerifyCodeLogin() {
      let BusType = wx.getStorageSync("BusType") || "";
      let url = "/Account/VerifyCodeLogin";
      let d = {
        phone: this.Mobile,
        actionCode: BusType,
        verifyCode: this.VerifyCode,
        client:'wechat'
      };
      let data = await this.$MainFn.CallApi(url, d, "");
      this.$LoginVerify.LoginSuccess(data.Data.UserUUID);
    },
    async WechatLogin() {
      var _self = this;


      Login(function(Data1){
        
            let gender = "m";
                if (Data1.gender != 1) {
                  gender = "f";
                }
                let d = {
                  unionId: Data1.unionId,
                  openId: Data1.openId,
                  nickName: Data1.nickName,
                  headImageUrl: Data1.avatarUrl,
                  gender: gender,
                  client:'wechat'
                };
            _self.wechatLoginOperation(d);
               
      });      
    },
    async wechatLoginOperation(param){
       var _self = this;
       let url = "/Account/WechatLogin";
       let data = await _self.$MainFn.CallApi(url, param, "");
      this.$LoginVerify.LoginSuccess(data.Data.UserUUID);
    },
    swiperChange(e) {
      this.currentTab = e.mp.detail.current;
      this.activeIndex = this.currentTab;
    },
    onAnimationfinish() {
      // console.log("滑动完成.....");
    },
    async JumpLogin() {
      let logined = await this.$LoginVerify.CheckLoginStatus();
      if (logined) {
        wx.navigateBack({
          delta: 1 //返回的页面数，如果 delta 大于现有页面数，则返回到首页,
        });
      }
    }
  },
  onLoad() {
    var res = wx.getSystemInfoSync();
    this.winWidth = res.windowWidth;
    this.winHeight = res.windowHeight;
    this.empty();
  },

  created() {}
};
</script>

<style scoped lang="less">
.content {
  box-sizing: border-box;
  height: 100%;
  padding-top: 50rpx;
  /* overflow: auto; */
  -webkit-overflow-scrolling: touch;
  .accountLogin {
    background: #fff;
    font-size: 30rpx;
    color: #333;
    padding:0 30rpx; 
    .loginInput{
      height: 100rpx;
      padding: 30rpx 0;
      box-sizing: border-box;
      background: #fff;
      display: flex;
      align-items: center;
      .subtitle{
        width:100rpx;
        min-width: 100rpx;
        font-size: 30rpx;
        color: #333;
      }    
      input{
        border: none;
        margin-left: 60rpx;
        font-size: 30rpx;
        color: #333;
      }
      .imgCode{
        width: 180rpx;
        min-width: 180rpx;
        height: 60rpx;
        background: #e65248;
        text-align: center;
        line-height: 60rpx;
        font-size: 28rpx;
        color: #fff;
        border-radius: 5rpx;
      }
      img{
        width: 150rpx;
        height: 60rpx;
      }
    }
    .lines{
        height: 2rpx;
        background: #ccc;
      }
    .weixin-btn {
      margin-top: 20rpx;
    }
  }
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
.loginBtnState{
  background: #E65248;
}
.forget{
  font-size: 24rpx;
  color: #999;
  margin-left:30rpx;
  width: 100rpx;
  height: 30rpx; 
}
.mesTips {
  font-size: 22rpx;
  color: #e65248;
  margin: 30rpx;
}
.otherLogin {
  position: fixed;
  bottom: 249rpx;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26rpx;
  color: #ccc;
  .lines {
    width: 116rpx;
    height: 1rpx;
    background: #ccc;
  }
  .words {
    margin: 0 10rpx;
  }
}
.weixin-btn {
  position: fixed;
  bottom: 108rpx;
  left: 42%;
  width: 98rpx;
  height: 98rpx;
  margin: 0 auto;
  border-radius: 98rpx;
  padding: 0;
  background: rgba(0, 0, 0, 0);
  img {
    width: 98rpx;
    height: 98rpx;
    border-radius: 98rpx;
  }
}

.swiper-item {
  height: 100%;
  text-align: center;
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
  background-color: #fff;
  border-bottom: 1rpx solid #ccc;
  padding: 0 30rpx;
  box-sizing: border-box;
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
  color: #df3e3f;
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
  width: 40%;
  height: 2rpx;
  background-color: #df3e3f;
  -webkit-transition: -webkit-transform 0.1s;
  transition: -webkit-transform 0.1s;
  transition: transform 0.1s;
  transition: transform 0.1s, -webkit-transform 0.1s;
}

.navbar_slider_0 {
  left: 0rpx;
  transform: translateX(40rpx);
}

.navbar_slider_1 {
  left: 0rpx;
  transform: translateX(420rpx);
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
    .inputBox{
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
