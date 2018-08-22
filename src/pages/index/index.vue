<template>
  <div class="container" style="height:100vh;">
  	<!-- 顶部搜索框 -->
    <div class="topSearch">
      	<div class="searchA">
			<icon class="searchIcon" type="search" size="15"/>
        	<input type="text" placeholder="搜索您要查找的商品"  @focus="search()">
      	</div>
    </div>
    <div class="content">
      <div class="navbar">
        <block v-for="(item,index) in goodsTagList" :key="index">
          <div :id="index" :class="{'selected':activeIndex == index}" class="navbar_item" @click="tabClick">
            <div class="navbar_title">{{item.Title}}</div>
          </div>
        </block>
      </div>
      <swiper class="content" :duration="500" :style="'height:'+contentHeight" :current="currentTab" @change="swiperChange"  @animationfinish="onAnimationfinish">
        <swiper-item v-for="(item,index) in goodsTagList" :key="index">
        	<!-- 商品列表 -->
    		<div class="goodsList">
      			<div class="cellsContents">
        			<div class="shopList" v-for="(v,index2) in goodsListShow[index]" :key='index2' @click="gotoGoodsShow(v.GoodsId)"> 
            			<div class="shopListHead">
              				<img class="headnews" :src="v.HotTagName" alt="failed" >
							<template v-if="v.IsSupportRushToBuy">
								<!-- 抢购标签-已结束-预热中-抢光了-抢购中 -->
								<template v-if="v.Status==1">
									<!-- 预热中 -->
									<img class="salesIcon" src="/static/appImg/sales-ing.png" alt="failed">
								</template>
								<template v-if="v.Status==2">
									<!-- 抢购中 -->
									<img class="salesIcon" src="/static/appImg/snatch-icon.png" alt="failed">
								</template>
								<template v-if="v.Status==3">
									<!-- 抢光了 -->
									<img class="salesIcon" src="/static/appImg/sales-nor.png" alt="failed">
								</template>
								<template v-if="v.Status==4">
									<!-- 已结束 -->
									<img class="salesIcon" src="/static/appImg/sales-end.png" alt="failed">
								</template>
							</template>
							<!-- 会员折扣标签 -->
							<template v-if="v.IsSupportRushToBuy==false&&v.IsSupportVipDiscount==true">
								<img class="memberIcon" src="/static/appImg/member-sign.png" alt="failed">
							</template>
							
              				<img :src="v.GoodsCover" alt="failed">
            			</div>
            			<div class="shopTip">
              				<div class="shopName">{{v.GoodsName}}</div>
              				<div class="shopNews">
                				<div class="shopCards">
									<template v-if="v.IsCoupon">
										<img src="/static/appImg/preferentialcard.png">
									</template>
									<template v-else>
										<img src="/static/appImg/preferentialcard-nor.png">
									</template>
								</div>
								<template v-if="v.MaxCouponDiscount!=0">
									<div class="Deduction">
										<img src="/static/appImg/voucher.png">
										<span class="DeductionNum">{{v.MaxCouponDiscount}}%</span>
									</div>
								</template>
								<template v-else>
									<div class="Deduction">
										<img src="/static/appImg/voucher-nor.png">
									</div>
								</template>
								<template v-if="v.RefundBonus!=0">
									<div class="shopReturn">返{{v.RefundBonus}}豆</div>
								</template>
                				
              				</div>
              				<div class="shopPrice">
								  <span>
										<span class="nowPrice">￥{{v.MinDiscountPrice}}</span>
                						<span class="oldPrice">￥{{v.MinPrice}}</span>
								  </span>
                				<span>已抢{{v.SoldCount}}件</span>
              				</div>
            			</div>        
        			</div>
      			</div>
    		</div>
        </swiper-item>
      </swiper>
    </div>
  </div>
</template>

<script>
import mptoast from "mptoast";
export default {
  	data () {
    	return {
      		goodsTagList:null,//商品标签列表
      		goodsList:null, //商品列表
      		goodsListShow:[],//展示商品数据
      
      		lastOrder:[],//商品列表最后一条数据排序字段
      		lastTime:[],//商品列表最后一条数据时间
      		goodsListCount:50,//获取商品列表接口条数
      	
      		currentTab: 0,
      		activeIndex: 0,
      
      		winWidth: 0,
      		winHeight: 0,
			changeFinish:false,
    	}
  	},
  	components: {
    	mptoast
  	},
  	computed: {
    	contentHeight() {
      		return this.winHeight + "px";
    	}
  	},
  	methods: {
    	tabClick(e) {
    		this.changeFinish=false;
      	this.activeIndex = e.currentTarget.id;
      	this.currentTab = this.activeIndex;
   		},
    	swiperChange(e) {
    		if(e.mp.detail.source=='touch'){
    			this.changeFinish=false;
      		this.activeIndex = e.mp.detail.current;
      		this.currentTab = this.activeIndex;
      	}
    	},
    	onAnimationfinish() {
    		var _self=this;
    		var this_currentTab=_self.currentTab;
    		if(_self.goodsListShow[this_currentTab]==null){
    			_self.getGoodsList(_self.goodsTagList[this_currentTab].AppAction.ActionValue,'',_self.goodsListCount,0,'');
    		}
    		this.changeFinish=true;
    	},
  		//获取标签列表接口
  		async getGoodsTagList(){
    		var _self=this;
    		let par={pageCode:"mall"};
    		let data = await _self.$MainFn.CallApi('/Layout/GetMenu',par,'');
    		_self.goodsTagList = data.Data;
  		},
  		//获取商品列表接口
  		async getGoodsList(tagId,keyword,pageCount,lastOrder,lastTime){
    		var _self=this;
    		var this_currentTab=_self.currentTab;
    		let d = {tagId:tagId,keyword:keyword,pageCount:pageCount,lastOrderindex:lastOrder,lastModifyTime:lastTime}
    		let data = await _self.$MainFn.CallApi('/mall/GetGoodsList',d,'');
    		_self.goodsList=data.Data;
    		if(_self.goodsList!=null && _self.goodsList.length>0)
    		{
    			_self.lastOrder[this_currentTab]=_self.goodsList[_self.goodsList.length-1].Orderindex;
    			_self.lastTime[this_currentTab]=_self.goodsList[_self.goodsList.length-1].ModifyTime;
    		}
    		//获取最新
    		if(lastOrder==0){
    			_self.goodsListShow[this_currentTab]=_self.goodsList;
    		}
    		else{
    			_self.goodsListShow[this_currentTab]=_self.goodsListShow[this_currentTab].concat(_self.goodsList);
    		}
  		},  
    	gotoGoodsShow(id){
      		let url='/pages/goodsShow/main?id='+id;
      		wx.navigateTo({ url});
    	},
  		search(){
   			wx.navigateTo({
      			url: '../../pages/search/main',
      			success: function(res){
        			// success
        			console.log(res)
      			},
      			fail: function(err) {
        			// fail
        			consoel.log(err)
      			},
      			complete: function() {
        			// complete
      			}
    		})
  		}
	},
	async onPullDownRefresh() {
  	var _self=this;
  	if(_self.changeFinish==true){
    	var this_currentTab=_self.currentTab;
  		wx.showNavigationBarLoading();
			await _self.getGoodsList(_self.goodsTagList[this_currentTab].AppAction.ActionValue,'',_self.goodsListCount,0,'');
			wx.hideNavigationBarLoading();
		}
  	wx.stopPullDownRefresh();
	},
	async onReachBottom(){
  		var _self=this;
  		
  		if(_self.changeFinish==true){
  			wx.showLoading({
      		title: '玩命加载中',
    		})
    		var this_currentTab=_self.currentTab;
    		if(_self.lastTime[this_currentTab]==null){
    			_self.lastTime[this_currentTab]='';
    		}
    		if(_self.lastOrder[this_currentTab]==null){
    			_self.lastOrder[this_currentTab]=0;
    		}
   			await _self.getGoodsList(_self.goodsTagList[this_currentTab].AppAction.ActionValue,'',_self.goodsListCount,_self.lastOrder[this_currentTab],_self.lastTime[this_currentTab]);
   			wx.hideLoading();
  			wx.stopPullDownRefresh();
  		}
	},
    onLoad() {
  		var _self=this;
  		var res = wx.getSystemInfoSync();
  		_self.winWidth = res.windowWidth;
  		_self.winHeight = res.windowHeight;
  		_self.getGoodsTagList();
  		_self.getGoodsList(0,'',_self.goodsListCount,0,'');
	},
	onShow(){
		var _self=this;
		_self.getGoodsTagList();
	}
}
</script>



<style scoped lang="less">
   	.content {
  		box-sizing: border-box;
  		height: 100%;
  		padding-top: 10rpx;
  		/* overflow: auto; */
  		-webkit-overflow-scrolling: touch;
	}
	.navbar {
  		display: -webkit-box;
  		display: -webkit-flex;
  		display: flex;
  		position: fixed;
  		z-index: 2;
  		top: 115rpx;
  		height: 80rpx;
  		width: 100%;
  		background-color: #ffffff;
  		border-bottom: 1rpx solid #ccc;
	}
	
	.navbar_item.selected{
  		border-bottom: 2rpx solid #ff0036;
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
	
	.navbar_title {
  		color: #333;
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
	
	.navbar_item .navbar_item_on {
  		color: white;
	}
	
	.swiper-item {
  		height: 100%;
  		text-align: center;
	}
	swiper-item{
  		overflow: scroll;
	}
	
	.goodsTag{
  		width: 100%;
  		height: 80rpx;
  		display: flex;
 	    flex-wrap: wrap;
  		align-items: center;
  		/* padding:  30rpx; */
  		box-sizing: border-box;
  		background: #fff;
  		z-index: 2;
  		position: fixed;
  		top:115rpx;
	}
	.goodsTag .tagItem{
  		font-size: 28rpx;
  		color: #333;
  		padding:20rpx;
	}
	.goodsTag .selected{
  		border-bottom: 2rpx solid #ff0036;
	}
	.goodsList{
  		margin-top: 190rpx;
	}
	.cellsContents{
  		display: flex;
  		flex-wrap: wrap;
  		margin-top: 10rpx;
  		background: #f0f0f0;
  		justify-content: space-between;
	}
	.cellsContents .shopList{
  		width: 370rpx;
  		display: flex;
  		flex-direction: column;
  		background: #fff;
  		margin: 5rpx 0;
	}
	.cellsContents .shopList .shopListHead{
  		position: relative;
  		display: flex;
	}
	.cellsContents .shopList .shopListHead img{
  		/* width: 370rpx; */
  		width: 100%;
  		/* height: 370rpx; */
	}
	.cellsContents .shopList .shopListHead .headnews{
  		position: absolute;
  		top: 0;
  		left: 30rpx;
  		width: 70rpx;
  		height: 70rpx;
  		border-radius: 0 0 70rpx 70rpx;
	}
	.cellsContents .shopList .shopListHead .salesIcon{
		position: absolute;
		top:6rpx;
		right: 20rpx;
		width:96rpx;
		height: 96rpx;
	}
	.cellsContents .shopList .shopListHead .memberIcon{
		position: absolute;
		top:20rpx;
		right: 0rpx;
		width:108rpx;
		height: 30rpx;
	}
	.cellsContents .shopList .shopTip{
  		display: flex;
  		flex-direction: column;
  		padding: 20rpx 30rpx;
  		font-family: PingFang SC;
	}
	.cellsContents .shopList .shopTip .shopName{
  		font-size: 28rpx;
  		color: #333;
	}
	.cellsContents .shopList .shopTip .shopNews{
  		display: flex;
		align-items: center;
		height: 28rpx;
		margin:12rpx 0;
	}
	.cellsContents .shopList .shopTip .shopNews .shopCards{
  		img{
			width:38rpx;
			height:28rpx;
		}
  		margin-right: 10rpx;
	}
	.cellsContents .shopList .shopTip .shopNews .used{
        background: linear-gradient(#A6A5A5,#868686);
	}
	.cellsContents .shopList .shopTip .shopNews .Deduction{
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
			width:60rpx;
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
	.cellsContents .shopList .shopTip .shopNews .shopReturn{
  		font-size: 22rpx;
  		color: #ff0036;
	}
	.cellsContents .shopList .shopTip .shopPrice{
		height: 28rpx;
		display: flex;
		justify-content: space-between;
	}
	.cellsContents .shopList .shopTip .shopPrice span{
  		font-family: PingFang SC;
  		color: #999;
  		font-size: 22rpx;
	}
	.cellsContents .shopList .shopTip .shopPrice .nowPrice{
  		color: #ff0036;
	}
	.cellsContents .shopList .shopTip .shopPrice .oldPrice{
  		text-decoration: line-through;
  		margin: 0 15rpx 0 10rpx ;
	}
	
	.topSearch{
  		width: 100%;
  		padding: 30rpx;
  		box-sizing: border-box;
  		background: #f0f0f0;
  		z-index: 2;
  		position: fixed;
  		top: 0; 
	}
	.topSearch .searchA{
  		width: 100%;
  		height: 100%;
 	    position: relative;
	}
	.topSearch .searchIcon{
  		width: 30rpx;
  		height: 30rpx;
  		border-radius: 30rpx;
  		position: absolute;
  		left: 20rpx;
  		top: 16rpx;
	}
	.topSearch input{
  		width: 690rpx;
  		height: 58rpx;
  		border-radius: 29rpx;
  		background: #fff;
  		border: none;
  		font-size: 24rpx;
  		color: #999;
  		padding-left:60rpx;
  		box-sizing: border-box;
	}
</style>