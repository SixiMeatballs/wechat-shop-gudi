import MainFn from './MainFn'
import { GetUserInfo,showModal } from './BaseFn'

export async function pay(_payinfo,BusinessCode,success,fail){
  GetUserInfo(function(data){
    basepay(_payinfo,BusinessCode,data.openId,success,fail);
  });
}


export async function basepay(_payinfo,BusinessCode,openid,success,fail){
    _payinfo.OpendId=openid;
    let url="/Payment/StartPayment";
    let d ={BusinessCode:BusinessCode,PayTypeCode:'00002',Source:'wechat',BusinessParameter:_payinfo};
    let data = await MainFn.CallApi(url,d,'');   
    let payData=data.Data;
    wx.requestPayment({
      'timeStamp': payData.timestamp,
      'nonceStr': payData.noncestr,
      'package': payData.package,
      'signType': "MD5",
      'paySign': payData.sign,
      'success': function (succ) {
        success&&success(succ);
      },
      'fail': function (err) {
        fail&&fail(err);
      },
      'complete': function (comp) { 

      }
    }) 
}

export default {
  pay
}
