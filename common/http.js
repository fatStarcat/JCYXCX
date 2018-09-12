const app = getApp();
var site = app.globalData.site; 

function req(url, method, data, success,fail) {
  wx.request({
    url: site + url,
    data: data,
    method: method,
    header: {
      'content-type': 'application/json',
      'token': wx.getStorageSync('token')
    },
    success: function (res) {
      return typeof success == "function" && success(res.data)
    },
    fail: function (e) {
      return typeof fail == "function" && fail(e)
    },
    complete:function(res){
       if (res.statusCode ==403){
         wx.showToast({
           title: '登录超时，请重启小程序！',
           icon: 'none',
           duration: 3000,
           complete:function(){
             app.login();
           }
         });
       }
       else if (res.statusCode == 303){
         wx.navigateTo({
           url: '../index/index'
         })
       }
    }
  })
}

module.exports = {
  req: req
}  