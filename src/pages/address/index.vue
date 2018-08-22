<template>
  <div class="container" :style="'height:'+winHeight+'px'">
    <template v-if="addressList!=null && addressList.length>0">
      <div class="address">
        <div class="addressCompoent" v-for="(item,index) in addressList" :key="index">
          <div @click="itemClick(item.AddressId)">
          <div class="userInfo">
            <span class="userName">{{item.MailName}}</span>
            <span class="userPhone">{{item.MailPhone}}</span>
          </div>  
          <div class="userAddress">{{item.FullAddress}}</div>
          </div>
          <div class="editButton">
            <div class="defaultAddress">
              <icon type="success" size="20" class="cricle"  @click="ModifyDefaultAddress(item.AddressId,item.DefaultAddress)" v-if="item.DefaultAddress==1"/>
              <icon type="circle" size="20" class="cricle" @click="ModifyDefaultAddress(item.AddressId,item.DefaultAddress)" v-if="item.DefaultAddress!=1"/>
                默认地址
            </div>
            <div class="noName">
              <div @click="ModifyAddress(item)"><img src="/static/appImg/modify.png" alt="failed" >编辑</div> 
              <div class="deleteIcon" @click="DeleteMailAddress(item.AddressId)"><img src="/static/appImg/icon-delete.png" alt="failed" >删除</div>
            </div>
          </div>
        </div>
      </div>
    </template>  
    <template v-else>
      <div class="blank">
        <img src="/static/appImg/address.png" alt="failed">
        <span>没有收货地址</span>
      </div>
    </template>
    
    <div class="saveBtn state" @click="AddAddress">添加</div>
  </div>
  
</template>

<script>
import mptoast from "mptoast";

export default {
  data() {
    return {
      winHeight:null,
      addressList:null,
      itemClickCheck:false,
      addressCheckbox:false,
    };
  },
  components: {
    mptoast
  },
  computed: {

  },
  methods: {
    showToast() {
      this.$mptoast("我是提示信息", "success", 2000);
    },
    itemClick(AddressId){
    	if(this.itemClickCheck){
    		let pages = getCurrentPages();//当前页面
    		let prevPage = pages[pages.length-2];//上一页面
    		prevPage.setData({//直接给上移页面赋值
  				mailId: AddressId
				});
      	wx.navigateBack({ delta:1});
     	}
    },
     async getAddressList(){       
       let url="/Account/GetMailAddressList";
        let d = {};
      let data = await this.$MainFn.CallApi(url,d,'');
      this.addressList=data.Data;      
    },
    async AddAddress(){       
       let url="/pages/addAddress/main";
       wx.navigateTo({ url});   
    },
    async ModifyAddress(item){       
       let json=JSON.stringify(item);
       let url="/pages/addAddress/main?v="+json;
       wx.navigateTo({ url});   
    },
    async ModifyDefaultAddress(id,isDefaultAddress){       
       let url="/Account/ModifyDefaultAddress";
        let d = {AddressId:id,isDefaultAddress:isDefaultAddress==0?true:false};
      let data = await this.$MainFn.CallApi(url,d,'',undefined,'put');
      this.getAddressList();     
    },
    async DeleteMailAddress(id){ 
      var _self = this;   
      wx.showModal({
      title: '提示',
      content: '确定要删除此地址吗?',
      success: function(res) {
        if (res.confirm) {
          let url="/Account/DeleteMailAddress";
            let d = {AddressId:id};
          _self.$MainFn.CallApi(url,d,'',undefined,'DELETE').then(function(data){
              _self.getAddressList(); 
          });
          
        } else if (res.cancel) {
          
        }
      }
    })
      
           
    },
  },
  onLoad(option) {
    var res = wx.getSystemInfoSync();
    this.winWidth = res.windowWidth;
    this.winHeight = res.windowHeight;
    this.getAddressList();
    this.itemClickCheck=option.itemClickCheck;
  },
    onShow() {
    this.getAddressList();
  },

  created() {
    
  }
};
</script>

<style scoped lang="less">
.address{
  margin-bottom: 100rpx;
}
.addressCompoent{
  // height: 277rpx;
  // min-height: 277rpx;
  background: #fff;
  display: flex;
  flex-direction: column;
  color: #333;
  font-size: 28rpx;
  margin-bottom: 20rpx;
  .userInfo{
    margin: 30rpx ;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 32rpx;
  }
  .userAddress{
    padding: 0 30rpx 30rpx;
    border-bottom: 1rpx solid #ddd;
  }
  .editButton{
    height: 80rpx;
    max-height: 80rpx;
    padding: 0 30rpx;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .defaultAddress{
      display: flex;
      align-items: center;
      .cricle{
        margin-right: 20rpx;
      }
       img{
        width: 30rpx;
        height: 30rpx;
        margin-right: 20rpx;
      }
    }
    .noName{
      display: flex;
      justify-content: space-between;
      align-items: center;
      .deleteIcon{
        margin-left: 30rpx;
      }
      img{
        width: 30rpx;
        height: 30rpx;
        margin-right: 20rpx;
      }
      div{
        display: flex;
        align-items: center;
      }
    }
  }
}
.addressCompoent:first-child{
  margin-top: 1rpx;
}
.saveBtn{
  width: 100%;
  height: 100rpx;
  position: fixed;
  bottom: 0;
  background: #df3e3f;
  font-size: 36rpx;
  color: #fff;
  text-align: center;
  line-height: 100rpx;
}
.blank{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 32rpx;
  color: #333;
  img{
    width: 130rpx;
    height: 130rpx;
    margin-bottom: 30rpx;
  }
}
</style>
