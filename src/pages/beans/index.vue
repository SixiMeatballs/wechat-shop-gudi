<template>
  <div class="container" :style="'height:'+winHeight+'px'">
      <div class="accountMainInfo">
        <div class="accountTips">猜豆余额(个)</div>
        <div class="accountNum" v-if="UserInfo!=null">{{BounsMoneystr}}</div>
      </div>

    <block v-for="(item,index) in historyList" :key="index">
       <template v-if="index==0 || historyList[index].GroupName!=historyList[index-1].GroupName">
            <div class="searchTips">
        <div class="currentDatE">{{item.GroupName}}</div>
        <div  class="searchButton" >
          <div @click="ViewMonthDetail(item.GroupValue)"> 查看月账单</div>
          <div class="weui-cell__ft weui-cell__ft_in-access"></div>
        </div>
      </div>
       </template>
       
       <div class="listItem">
          <img :src="item.TagIcon" alt="failed">
          <div class="titleInfo">
            <span>{{item.TagName}}</span>
            <span class="userDate">{{item.DataTime}}</span>
          </div>
          <div class="userNum" v-if="item.ChangeCount>0">+{{item.ChangeCount}}猜豆</div>
          <div class="userNum" v-else>{{item.ChangeCount}}猜豆</div>
        </div>
    </block>

      <!-- 列表
      
         -->
     
  </div>
</template>

<script>
import mptoast from "mptoast";

import { toThousands } from '@/utils/index'

export default {
  data() {
    return {
      winHeight:null,//页面高度
      historyList:[],
      lastTime:'',
       Logined: false,
      UserInfo: null,
      BounsMoneystr:''
    };
  },
  components: {
    mptoast
  },
  computed: {
  },
  methods:{
    async GetUserInfo() {
      let _self = this;
      await this.$LoginVerify.CheckLogin();
      _self.Logined = await this.$LoginVerify.CheckLoginStatus();
      if (_self.Logined) {
        let data = await this.$MainFn.CallApi(
          "/Account/GetAccountSummary",
          "",
          ""
        );
        _self.UserInfo = data.Data;
        _self.BounsMoneystr= toThousands(_self.UserInfo.BounsMoney);
      }
    },
    async GetMoneyDeatils(){
      var myDate = new Date();
      var year=myDate.getFullYear(); //获取完整的年份(4位,1970-????)
      var month=myDate.getMonth()+1; //获取当前月份(0-11,0代表1月)
      var endtime=year+(month<10?"0":"")+month;
      let url="/Account/GetMoneyDeatils";
        let d ={lastTime:this.lastTime,moneytype:'bonus',pageCount:50,starttime:'201801',timetype:'month',endtime:endtime};
      let data = await this.$MainFn.CallApi(url,d,'');
      if(this.lastTime==''){
        this.historyList=data.Data;
      }
      else{
this.historyList=this.historyList.concat(data.Data);
      }
      
    },
  async ViewMonthDetail(month){
      let url='/pages/monthbeans/main?groupvalue='+month;
      wx.navigateTo({url});
    },
  },
  async onPullDownRefresh() {
    wx.showNavigationBarLoading();
  this.lastTime='';
  this.GetMoneyDeatils();
  wx.hideNavigationBarLoading();
  wx.stopPullDownRefresh();
},
async onReachBottom(){
  wx.showLoading({
      title: '玩命加载中',
    })
   this.lastTime='';
   if(this.historyList.length>0){
     this.lastTime=this.historyList[this.historyList.length-1].DataTime;
   }
   this.GetMoneyDeatils();
   wx.hideLoading();
  wx.stopPullDownRefresh();
},
  onLoad() {
    var res = wx.getSystemInfoSync();
    this.winWidth = res.windowWidth;
    this.winHeight = res.windowHeight;
    this.GetMoneyDeatils();
    this.GetUserInfo();

  },
};
</script>

<style scoped lang="less">
.container{
  background: #fff;
}
.accountMainInfo{
  height: 300rpx;
  min-height: 300rpx;
  padding: 80rpx 40rpx 50rpx;
  background: linear-gradient(#df4a40,#e03443);
  display: flex;
  flex-direction: column;
  color: #fff;
  font-size: 24rpx;
  .accountNum{
    font-size: 72rpx;
    margin-top: 20rpx;
  }
}

.searchTips{
  height: 65rpx;
  min-height: 65rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30rpx;
  color: #333;
  font-size: 28rpx;
  background: #f0f0f0;
  .searchButton{
    display: flex;
    align-items: center;
    color: #999;
  }
}

.historyList{
  display: flex;
  flex-direction: column;
  padding-left: 30rpx;
  background: #fff;
  
}
.listItem{
  margin-left: 30rpx;
  height: 120rpx;
  min-height: 120rpx;
  border-bottom: 1rpx solid #eee;
  padding: 28rpx 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #333;
  font-size: 30rpx;
  img{
    width: 64rpx;
    height: 64rpx;
    border-radius: 64rpx;
  }
  .titleInfo{
    flex: 1;
    display: flex;
    flex-direction: column;
    margin-left:30rpx;
    .userDate{
      font-size: 24rpx;
      color: #999;
    }
  }
  .userNum{
    margin-right: 28rpx;
  }
  
}
</style>
