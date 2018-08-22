import MainFn from './MainFn'

let UserTokenKey= 'aerfewrfdsrewrfdsrew';
const LoginVerify = {
  async CheckLoginStatus(){
       let _usertoken=this.GetUserToken();
       if(_usertoken==""){
           return false;
       }

       //let url="/Account/CheckUserToken";
       //let d = {};
      //let data=await MainFn.CallApi(url,d,'',function(){return false;});
      return true;
   },
   async CheckLogin(){
    let login=await this.CheckLoginStatus();
    if(!login){
      wx.navigateTo({ url: '/pages/login/main' });
    }
    return login;
   },
   GetUserToken(){
       return (wx.getStorageSync(UserTokenKey) || '');
   },
   LoginSuccess(_usertoken){
    wx.setStorage({
        key:UserTokenKey,
        data:_usertoken
      })
     wx.navigateBack({
       delta: 1 //返回的页面数，如果 delta 大于现有页面数，则返回到首页,
     });
   },
   ClearLogin(success){
      wx.removeStorage({
        key: UserTokenKey,
        success: res => {success();}
      });
   }
}
export default LoginVerify;