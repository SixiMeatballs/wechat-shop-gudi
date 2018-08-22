import MainFn from './MainFn'

let _userinfokey= 'aerfdsrewfd234fdsfsdrfdsrewrfdsrew';

export async function showModal(title,content,confirm,cancel){
  wx.showModal({
    title: title,
    content:content,
    success:function(res) {
      if (res.confirm) {
        if(confirm!=undefined){
          confirm();
        }
        
      } else if (res.cancel) {
        if(cancel!=undefined){
          cancel();
        }
      }
    }
  })
}

export function ShowCountDown(leftTime) {
  if (leftTime <= 0) {
      return { dd: 0, hh: 0, mm: 0, ss: 0, lt: 0 };
  }
  var dd = parseInt(leftTime / 60 / 60 / 24, 10);//计算剩余的天数
  var hh = parseInt(leftTime / 60 / 60 % 24, 10);//计算剩余的小时数
  var mm = parseInt(leftTime / 60 % 60, 10);//计算剩余的分钟数
  var ss = parseInt(leftTime % 60, 10);//计算剩余的秒数
  dd = checkTime(dd);
  hh = checkTime(hh);
  mm = checkTime(mm);
  ss = checkTime(ss);//小于10的话加0

  return { dd: dd, hh: hh, mm: mm, ss: ss, lt: leftTime };
}

function checkTime(i) {
  if (i < 10) {
      i = "0" + i;
  }
  return i;
}


export function Login(success,fail){
  wx.login({
    success: res1 => {
      wx.getUserInfo({
        success: res => {
          let d = {
            code: res1.code,
            encryptedData: res.encryptedData,
            iv: res.iv,
            rawData: res.rawData,
            signature: res.signature
          };
          LoginWeChatDecrypt(d,success);
        },
        fail:res2=>{
          if(fail!=undefined){
            fail(res2);
          }
        }
      });     
    },
    fail:res3=>{
      if(fail!=undefined){
        fail(res3);
      }
    }
  });
}

export function GetUserInfo(success,fail){
  let _user= (wx.getStorageSync(_userinfokey));
  if(_user!=undefined && _user!=null && _user!=""){
    if(success!=undefined){
      success(_user);
    }
  }
  else{
    Login(function(){
      let _user1= (wx.getStorageSync(_userinfokey));
      if(_user1!=undefined && _user1!=null && _user1!=""){
        if(success!=undefined){
          success(_user1);
        }
      }
    },function(res){
      if(fail!=undefined){
        fail();
      }
    });
  }
}

export async function LoginWeChatDecrypt(param,success){
  let url = "/WeChat/WeChatDecrypt";
  let data=await MainFn.CallApi(url, param, "");
  wx.setStorage({
    key:_userinfokey,
    data:data.Data,
    success:function(){
      if(success!=undefined){
        success(data.Data);     
     }
    }
  })
}




export default {
  showModal,
  Login,
  GetUserInfo,
  ShowCountDown
}
