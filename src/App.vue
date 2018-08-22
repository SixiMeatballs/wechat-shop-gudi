<script>
export default {
  created () {
    // 调用API从本地缓存中获取数据
    // const logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    console.log('app created and cache logs by setStorageSync');
    console.log('欢迎使用微猜商城。。。');
    // console.warn('我是盼盼。^_^');
    ///console.log("%c我是鄢芳明。", " text-shadow: 0 1px 0 #ccc,0 2px 0 #c9c9c9,0 3px 0 #bbb,0 4px 0 #b9b9b9,0 5px 0 #aaa,0 6px 1px rgba(0,0,0,.1),0 0 5px rgba(0,0,0,.1),0 1px 3px rgba(0,0,0,.3),0 3px 5px rgba(0,0,0,.2),0 5px 10px rgba(0,0,0,.25),0 10px 10px rgba(0,0,0,.2),0 20px 20px rgba(0,0,0,.15);font-size:5em");
    // console.log('%c wei cai shop', 'background-image:-webkit-gradient( linear, left top, right top, color-stop(0, #f22), color-stop(0.15, #f2f), color-stop(0.3, #22f), color-stop(0.45, #2ff), color-stop(0.6, #2f2),color-stop(0.75, #2f2), color-stop(0.9, #ff2), color-stop(1, #f22) );color:transparent;-webkit-background-clip: text;font-size:5em;');
    // console.log('%cMy name is 盼盼.', 'color: #fff; background: #f40; font-size: 24px;');
  }

}
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  /* align-items: center;
  justify-content: space-between;
  padding: 200rpx 0; */
  box-sizing: border-box;
  background: #f0f0f0;
  font-family:PingFang-SC-Regular;
}
/* this rule will be remove */
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}
</style>
