// pages/newDetails/newDetails.js
const app = getApp()
var site = app.globalData.site;
var comm = require("../../common/utils.js");
var http = require("../../common/http.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    newId:'',
    newDetails:{
    
    }
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   if(options.id){
     this.setData({
       newId: options.id
     })
     this.getNewDetails()
   }
  //  var _title = this.data.newDetails.title
  //  if (this.data.newDetails.title.length >10){
  //    _title = _title.slice(0, 10)+'...'
  //  }
  //  wx.setNavigationBarTitle({
  //    title: _title,
  //    success:function(res){

  //    },
  //    fail:function(){

  //    },
  //    complete:function(){
  //    }

  //  })
  //  console.log(this.data.newDetails.title.length)
  },

  getNewDetails:function(){
    var _this = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: site + '/api/News/Get',
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      data: {
        id: _this.data.newId
      },
      success:function(res){
        if(res.data.code == 0){
          res.data.data[0].content = res.data.data[0].NR.split('</br>')
         res.data.data[0].FBSJ = res.data.data[0].FBSJ.split('T')[0]
          _this.setData({
            newDetails:res.data.data[0]
          })
        }else{
          wx.showToast({
            title: '获取数据失败',
            image: '/images/index/error.png',
            duration: 2000,
            success: function () {
              setTimeout(() => {
                wx.navigateBack(1)
              }, 2000)
            },
          })
        }
     
      },
      fail:function(err){
        wx.showToast({
          title: '获取数据失败',
          image: '/images/index/error.png',
          duration: 2000,
          success: function () {
            setTimeout(() => {
              wx.navigateBack(1)
            }, 2000)
          },
        })
      },
      complete:function(){
        wx.hideLoading()
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})