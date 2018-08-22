<template>
  <div class="container" :style="'height:'+winHeight+'px'">
    <!-- 顶部搜索框 -->
    <div class="topSearch">
      <div class="searchA">
        <icon class="searchIcon" type="search" size="15"/>
        <input type="text" placeholder="搜索您要查找的商品" v-model="searchConReal" @input="TextChange()">
        <icon class="deletIcon" type="clear" size="15" @click="deleteCon()" v-if="searchConReal!=null && searchConReal!=''"/>       
        <span class="searchButton" @click="searchFn()">搜索</span>
        <mptoast />
      </div>
    </div>

    <!-- 历史搜索 -->
    <div class="historySearch" v-if="historySearchShow">
      <div class="historyTitle">
        <span>历史搜索</span>
        <icon class="cleartIcon" type="clear" size="15" @click="openAlert" />
      </div>
      <div class="historyContent">
        <div class="conItem" @click="hisSearch(v)" v-for="(v,index) in historySearch" :key="index">{{v}}</div>
      </div>
    </div>

    <!-- 搜索内容 -->
    <div class="searchContent" v-if="searchContent">
       <block v-for="(v,index) in goodsListShow" :key="index">   
        <div class="goodsCeil" @click="gotoGoodsShow(v.GoodsId)">
          <img :src="v.GoodsCover" alt="failed">
          <div class="goodsInfo">
            <div class="goodsName">{{v.GoodsName}}</div>
            <div class="goodsTips">
              <div class="shopCards">卡</div>
              <div class="Deduction">{{v.MaxCouponDiscount}}%</div>
              <div class="shopReturn">返{{v.RefundBonus}}豆</div>
            </div>
            <div class="shopPrice">
              <span class="nowPrice">￥{{v.MinDiscountPrice}}</span>
              <span class="oldPrice">￥{{v.MinPrice}}</span>
              <span>已抢{{v.SoldCount}}件</span>
            </div>
          </div>
        </div>
       </block>   
    </div>
    
    <!-- 空白状态 -->
    <!-- <div class="blankState">
      <img src="/static/appImg/shopCartIcon.png" alt="failed">
      <div class="tipsInfos">
        <span>暂无商品</span>
      </div>
    </div> -->

  </div>
</template>

<script>
import mptoast from "mptoast";

export default {
  data() {
    return {
      winHeight:null,//页面高度
      searchConReal:null,//搜索框中内容
      searchCon:null,//搜索内容
      historySearch:[],//历史搜素数组
      historySearchShow:null, // 历史搜索显示
      searchContent:false,//搜索内容显示
      goodsList:null,
      lastOrder:0,//最后一条数据排序
      lastTime:'',//最后一条数据时间
      goodsListShow:[],
    };
  },
  components: {
    mptoast
  },
  computed: {

  },
  methods: {
    showToast(conetent,state,time) {
      this.$mptoast(conetent, state, time);
    },
    //获取商品列表接口
    async GetGoodsList(keyword,pageCount,lastOrder,lastTime){
    	var _self=this;
    	let d = {tagId:0,keyword:keyword,pageCount:pageCount,lastOrderindex:lastOrder,lastModifyTime:lastTime}
    	let data = await _self.$MainFn.CallApi('/mall/GetGoodsList',d,'');
    	_self.goodsList=data.Data;
    	if(_self.goodsList!=null && _self.goodsList.length>0)
    	{
    		_self.lastOrder=_self.goodsList[_self.goodsList.length-1].Orderindex;
    		_self.lastTime=_self.goodsList[_self.goodsList.length-1].ModifyTime;
    	}
    	//获取最新
    	if(lastOrder==0){
    		_self.goodsListShow=_self.goodsList;
    	}
    	else{
    		_self.goodsListShow=_self.goodsListShow.concat(_self.goodsList);
    	}
    	if(_self.goodsListShow!=null&&_self.goodsListShow.length>0){
    		this.searchContent=true;
    	}
    	else{
    		this.searchContent=false;
    	}
    },
    TextChange(){
    	if(this.searchConReal==null || this.searchConReal==''){
    		this.historySearchShow = true;
    		this.searchConReal=''
      	this.goodsListShow = [];
      	this.searchContent=false;
    	}
    },
    gotoGoodsShow(id){
      		let url='/pages/goodsShow/main?id='+id;
      		wx.navigateTo({ url});
    	},
    //点击历史搜索
    hisSearch(Content){
    	this.historySearchShow = false;
    	this.searchCon=Content;
    	this.searchConReal=Content;
    	this.GetGoodsList(Content,10,0,'');
    },
    //点击搜索
    searchFn(){
      if(this.searchConReal==null || this.searchConReal==''){
        this.showToast("请输入内容","",2000)
      }else{
    		this.historySearchShow = false;
      	this.searchCon=this.searchConReal;
      	this.GetGoodsList(this.searchCon,10,0,'');     
      	if(this.historySearch.indexOf(this.searchCon)===-1){
        	const searchData = wx.getStorageSync('searchData') || [];
        	searchData.unshift(this.searchCon);
        	wx.setStorageSync('searchData', searchData);
        	this.historySearch.unshift(this.searchCon);
          
       	}
      }
    },
    deleteCon(){
    	this.historySearchShow = true;
    	this.searchConReal=''
      this.goodsListShow = [];
      this.searchContent=false;
    },
    openAlert(){
      wx.showModal({
        title: '',
        content:'确定要清空搜索历史吗？' ,
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#999',
        confirmText: '确定',
        confirmColor: '#DF3E3F',
        success: res => {
          if (res.confirm) {
            wx.clearStorage();
            this.historySearch=[];
            this.historySearchShow = false;
            this.showToast("清空成功","success",2000)
          }else{
          }
        }
      });
    }
  },
  async onPullDownRefresh() {
  	var _self=this;
  	wx.showNavigationBarLoading();
  	if(_self.searchConReal==null || _self.searchConReal==''){
  		_self.historySearchShow = true;
    	_self.searchConReal=''
      _self.goodsListShow = [];
      _self.searchContent=false;
  	}else{
  		wx.showNavigationBarLoading();
			await _self.GetGoodsList(_self.searchCon,10,0,'');
			wx.hideNavigationBarLoading();
			wx.stopPullDownRefresh();
		}
		wx.hideNavigationBarLoading();
		wx.stopPullDownRefresh();
	},
	async onReachBottom(){
  	wx.showLoading({
      title: '玩命加载中',
    })
  	var _self=this;
    if(_self.lastTime==null){
    	_self.lastTime='';
    }
   	await _self.GetGoodsList(_self.searchCon,10,_self.lastOrder,_self.lastTime);
   	wx.hideLoading();
  	wx.stopPullDownRefresh();
	},
  onLoad() {
    var res = wx.getSystemInfoSync();
    this.winWidth = res.windowWidth;
    this.winHeight = res.windowHeight;
    this.searchContent=false;
    this.goodsListShow=[];
    try {
      var value = wx.getStorageSync('searchData')
      if (value) {
        this.historySearchShow = true;
        this.historySearch = value;
      }
    } catch (e) {
      console.log(e);
    }


  },
	onShow(){
		this.searchConReal='';
	},
  created() {
    
  }
};
</script>

<style scoped lang="less">
.topSearch {
  width: 100%;
  padding: 30rpx;
  padding-right: 0;
  box-sizing: border-box;
  background: #fff;
  z-index: 2;
  .searchA {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
  }
  .searchIcon {
    width: 30rpx;
    height: 30rpx;
    border-radius: 30rpx;
    position: absolute;
    left: 20rpx;
    top: 16rpx;
  }
  .deletIcon {
    width: 30rpx;
    height: 30rpx;
    border-radius: 30rpx;
    position: absolute;
    top: 16rpx;
    z-index: 2;
    right: 125rpx;
  }
  input {
    width: 610rpx;
    height: 58rpx;
    border-radius: 29rpx;
    background: #f0f0f0;
    border: none;
    font-size: 24rpx;
    color: #999;
    padding-left: 60rpx;
    box-sizing: border-box;
  }
  .searchButton {
    color: #333;
    font-size: 26rpx;
    margin-left: 30rpx;
    display: flex;
    align-items: center;
  }
}

.historySearch {
  margin-top: 20rpx;
  background: #fff;
  display: flex;
  flex-direction: column;
  padding: 30rpx;
  box-sizing: border-box;
  .historyTitle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #333;
    font-size: 30rpx;
    .cleartIcon {
      width: 30rpx;
      height: 30rpx;
    }
  }
  .historyContent {
    display: flex;
    flex-wrap: wrap;
    margin-top: 20rpx;
    .conItem {
      height: 60rpx;
      background: #f0f0f0;
      color: #333;
      font-size: 30rpx;
      text-align: center;
      line-height: 60rpx;
      margin: 5rpx 10rpx;
      padding: 5rpx;
      border-radius: 10rpx;
    }
  }
}

.searchContent{
  display: flex;
  flex-direction: column;
  margin-top: 20rpx;
  padding: 30rpx;
  // padding-top: 30rpx;
  box-sizing: border-box;
  background: #fff;
  overflow: scroll;
  .goodsCeil{
    height:270rpx;
    min-height: 270rpx;
    display: flex;
    margin-bottom: 20rpx;
    img{
      width: 240rpx;
      min-width: 240rpx;
      height: 240rpx;
      min-height: 240rpx;
    }
    .goodsInfo{
      display: flex;
      flex: 1;
      flex-direction: column;
      margin-left: 30rpx;
      border-bottom: 1rpx solid #ddd;
      .goodsName{
        color: #333;
        font-size: 28rpx;
      }
      .goodsTips{
        display: flex;
        align-items: center;
        .shopCards{
            border-radius: 4rpx;
            width: 44rpx;
            height: 28rpx;
            text-align: center;
            color: #fff;
            background: linear-gradient(#3dc040,#12a55e);
            font-size: 20rpx;
            margin-right: 10rpx;
        }
        .Deduction{
          color: #fa3324;
          font-size: 20rpx;
          margin-right: 10rpx;
        }
        .shopReturn{
          font-size: 22rpx;
          color: #ff0036;
        }
      }
      .shopPrice {
        span{
          font-family: PingFang SC;
          color: #999;
          font-size: 22rpx;
        }
        .nowPrice{
           color: #ff0036;
           font-size: 36rpx;
        }
        .nowPrice::first-letter{
            font-size: 22rpx;
        }
        .oldPrice{
          text-decoration: line-through;
          margin: 0 15rpx 0 10rpx ;
        }
      }
      
    }
  }
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
  }
}
</style>
