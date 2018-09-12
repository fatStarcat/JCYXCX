//app.js
App({
  onLaunch: function () {
    var _this = this;
    wx.setStorageSync('entryShow', true);
    // 登录
    _this.login()
  },
  login:function(){
    var _this = this;
    wx.login({
      success:function(loginres){
     
        wx.request({
          url: _this.globalData.site + '/api/Auth/LoginWxApp',
          method: 'GET',
          data: {
            code: loginres.code,
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
           if(res.data.code == 0){
             wx.setStorageSync('token', res.data.data);
           }else{
             wx.showModal({
               title: '登录失败',
               content: '部分功能受限，请重启小程序',
               showCancel: false,
               success: function (res) {
                 if (res.confirm) {
                   console.log('用户点击确定')
                 }
               }
             })
           }
          },
          fail: function (err) {
       
            wx.showModal({
              title: '登录失败',
              content: '部分功能受限，请重启小程序',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                }
              }
            })
          },
          complete: function (msg) {
            
          }

        })
      }
    })
  

  },

  globalData: {
    site:"https://changri.natappvip.cc",
  }
})