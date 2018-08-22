import LoginVerify from './LoginVerify'

let ApiRootUrl = 'http://123.206.174.209:81';
//    let ApiRootUrl = 'https://api.guditech.com';
const MainFn = {
    CallApi(url,body,usertoken,fnfail,method){
        wx.showLoading({
            title:'加载中...'
        })
        if(usertoken==undefined || usertoken==""){
            usertoken=LoginVerify.GetUserToken();
        }
        if(method==undefined || method==""){
            method="get";
        }
        return new Promise((resolve, rejects) =>{
            wx.request({
                url: ApiRootUrl + url+"?usertoken=" + usertoken,
                method: method,
                data: body,
                header: {
                    'Content-Type': 'application/json',
                    'Content-Type':'application/x-www-form-urlencoded',
                    'deviceNo':'weixin',
                    'application':'weixin',
                    'channelCode':'Wechat',
                    'appVersion':'1.0.0'
                },
                success: (res)=>{
                    wx.hideLoading();
                    if(res.statusCode!=200){
                        wx.showToast({
                          title: "网络出错，稍后再试",
                          icon: "none"
                        });
                        return false;
                      }
                      if(res.data.ErrorCode!=0){
                      	 if(res.data.ErrorCode==2003){
                      	  	wx.navigateTo({ url: '/pages/login/main' });
                      	  }
                          else if(fnfail==undefined){
                            setTimeout(function(){
                                wx.showToast({
                                    title: res.data.Message,
                                    icon: "none"
                                  });
                              },1500)
                            
                              
                          }
                          else{
                            fnfail(res.data);
                          }
                          return false;
                      }
                      resolve(res.data);
                },
                fail: (error)=>{
                    // wx.hideLoading();
                    setTimeout(() => {
                        wx.hideLoading();
                     }, 100);    
                    if (typeof reject == 'function') {
                        reject(error);
                      } else {
                        console.log(error);
                      }
                },
                complete: function() {
                    setTimeout(() => {
                        wx.hideLoading();
                     }, 100);
                    // wx.hideLoading();
                    console.log('request end');
                }
            });
        })
        
    },
    GetApiBaseUrl:function(){
        return ApiRootUrl;
    },
    Post(obj){
        // obj:
        // url: api地址，以 / 开始
        // body: 参数，默认为 {}
        // usertoken: 登录凭证，默认为缓存中的
        // method:  api的访问方法，默认为 get
        // fnfail: api返回错误码的时候的操作方法，默认为 弹出错误消息
        // fnunlogin: api返回未登录时的操作方法
        let url=obj.url;
        if(url==undefined || url==""){
            this.showToast("网络出错，稍后再试");
            return false;
        }
        let body=obj.body;
        if(body==undefined){
            body={};
        }
        let usertoken=obj.usertoken;
        if(usertoken==undefined || usertoken==""){
            usertoken=LoginVerify.GetUserToken();
        }
        let method=obj.method;
        if(method==undefined || method==""){
            method="get";
        }

        let fnunlogin=obj.fnunlogin;

        wx.showLoading({
            title:'加载中...'
        })
        return new Promise((resolve, rejects) =>{
            wx.request({
                url: ApiRootUrl + url+"?usertoken=" + usertoken,
                method: method,
                data: body,
                header: {
                    'Content-Type': 'application/json',
                    'Content-Type':'application/x-www-form-urlencoded',
                    'deviceNo':'weixin',
                    'application':'weixin',
                    'channelCode':'Wechat',
                    'appVersion':'1.0.0'
                },
                success: (res)=>{
                    setTimeout(() => {
                        wx.hideLoading();
                     }, 100);
                    if(res.statusCode!=200){
                        this.showToast("网络出错，稍后再试");
                        return false;
                      }
                      if(res.data.ErrorCode!=0){
                      	 if(res.data.ErrorCode==2003){
                               if(fnunlogin==undefined){
                                    this.showToast(res.data.Message);
                               }
                               else{
                                   if(typeof fnunlogin=="function"){
                                      console.log("unlogin");
                                      fnunlogin();
                                   }
                                   else{
                                    console.log("547845");
                                     wx.navigateTo({ url: '/pages/login/main' });
                                   }
                               }                      	  	
                      	  }
                          else if(fnfail==undefined){
                            this.showToast(res.data.Message);
                              
                          }
                          else{
                            fnfail(res.data);
                          }
                          return false;
                      }
                      resolve(res.data);
                },
                fail: (error)=>{
                    wx.hideLoading();

                    if (typeof reject == 'function') {
                        reject(error);
                      } else {
                        console.log(error);
                      }
                },
                complete: function() {
                    wx.hideLoading();
                }
            });
        })
    },
    showToast(title){
        wx.showToast({
            title: title,
            icon: "none"
          });

          setTimeout(function(){
            wx.hideLoading()
          },2000)
    }
    
}
export default MainFn;