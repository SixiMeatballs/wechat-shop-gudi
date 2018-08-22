<template>
  <div class="container" :style="'height:'+winHeight+'px'">
    <block v-for="(item,index) in historyList" :key="index">       
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

export default {
  data() {
    return {
      winHeight:null,//页面高度
      historyList:[],
      lastTime:'',
      GroupValue:''
    };
  },
  components: {
    mptoast
  },
  computed: {
  },
  methods:{
    async GetMoneyDeatils(){
      let url="/Account/GetMoneyDeatils";
        let d ={lastTime:this.lastTime,moneytype:'bonus',pageCount:50,starttime:this.GroupValue,timetype:'month',endtime:this.GroupValue};
      let data = await this.$MainFn.CallApi(url,d,'');
      if(this.lastTime==''){
        this.historyList=data.Data;
      }
      else{
this.historyList=this.historyList.concat(data.Data);
      }
      
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
  onLoad(option) {
    this.GroupValue=option.groupvalue;
    console.log(this.GroupValue);
    wx.setNavigationBarTitle({
  title: this.GroupValue+'猜豆明细'
})
    var res = wx.getSystemInfoSync();
    this.winWidth = res.windowWidth;
    this.winHeight = res.windowHeight;

    this.GetMoneyDeatils();

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
