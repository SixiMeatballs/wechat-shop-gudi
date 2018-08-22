<template>
  <div class="container" :style="'height:'+winHeight+'px'">
    <div class="addContent">
      <div class="inputItem">
        <span class="subtitle">姓名</span>
        <input type="text" placeholder="最少两个字" v-model="MailName" placeholder-style="color:#999;">
      </div>
      <div class="inputItem">
        <span class="subtitle">手机</span>
        <input type="number" placeholder="请输入手机号" v-model="MailPhone" placeholder-style="color:#999;">
      </div>
      <div class="inputItem">
        <span class="subtitle">地区</span>
        <picker class="selects" mode="region"  @change="bindRegionChange" :value="region">
          <view class="picker">
             <block v-if="region[0]==''">
                省份  城市  地区
             </block>
             <block v-else>
                {{region[0]}} {{region[1]}} {{region[2]}}
             </block>
            
          </view>
        </picker>
      </div>
      <div class="inputItem">
        <span class="subtitle">地址</span>
        <input type="text" placeholder="5~60个字，且不能全部为数字" v-model="AddressDetail" placeholder-style="color:#999;">
      </div>
      <div class="inputItem">
        <span class="subtitle">邮编</span>
        <input type="text" placeholder="6位邮政编码(选填)" v-model="PostCode" placeholder-style="color:#999;">
      </div>
    </div>
    <button class="save state" @click="saveAddress">保存</button>
  </div>
</template>

<script>
import mptoast from "mptoast";

export default {
  data() {
    return {
      winHeight:null,
      MailName:'',
      MailPhone:'',
      AddressDetail:'',
      PostCode:'',
      AddressId:0,
      DefaultAddress:0,
      region: ['', '', ''],
    customItem: ''
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
    async saveAddress(){       
       let url="/Account/ModifyMailAddress";
       let method='put';
       if(this.AddressId==undefined || this.AddressId==0){
         url="/Account/AddMailAddress";
         method='post';
       }
        let d = {
addressId:this.AddressId,
Province:this.region[0],
Prefecture:this.region[1],
County:this.region[2],
AddressDetail:this.AddressDetail,
MailName:this.MailName,
MailPhone:this.MailPhone,
PostCode:this.PostCode,
DefaultAddress:this.DefaultAddress
};
      let data = await this.$MainFn.CallApi(url,d,'',undefined,method);
      wx.navigateBack({
        delta: 1 //返回的页面数，如果 delta 大于现有页面数，则返回到首页,
      });
    },
     bindRegionChange: function (e) {
       this.region=e.mp.detail.value;
  }
  },
  onLoad(option) {
    let v=option.v;
    if(v!=undefined && v!=""){
      let item=JSON.parse(v);
      this.MailName=item.MailName;
      this.MailPhone=item.MailPhone;
      this.AddressDetail=item.AddressDetail;
      this.PostCode=item.PostCode;
      this.AddressId=item.AddressId;
      this.DefaultAddress=item.DefaultAddress;
      this.region=[item.Province,item.Prefecture,item.County];
    }
    else{
      this.MailName="";
      this.MailPhone="";
      this.AddressDetail="";
      this.PostCode="";
      this.AddressId=0;
      this.DefaultAddress=0;
      this.region=['', '', ''];
    }
    
    var res = wx.getSystemInfoSync();
    this.winWidth = res.windowWidth;
    this.winHeight = res.windowHeight;

  },

  created() {
    
  }
};
</script>

<style scoped lang="less">
.addContent{

  display: flex;
  flex-direction: column;
  background: #fff;
  margin-top:20rpx;
  .subtitle{
    margin-right: 30rpx;
  }
  .selects{
    margin-left: 40rpx;
    width: 80%;
  }
  .inputItem{
    height:94rpx;
    min-height:94rpx;
    padding:0 30rpx;
    box-sizing:border-box;
    color: #333;
    font-size:30rpx;
    display:flex;
    align-items:center;
    border-bottom:1rpx solid #EEE;
    input{
      flex:1;
      border: none;
      padding-left: 40rpx;
      box-sizing:border-box;
      font-size:30rpx;
      color:#333;
    }
  }
}
.save{
  width:690rpx;
  height:88rpx;
  border-radius: 10rpx;
  background:#999;
  text-align: center;
  line-height: 88rpx;
  margin:30rpx;
  color:#fff;
  font-size:30rpx;
}
.state{
  background:#df3e3f;
}
</style>
