// pages/reportDetails/reportDetails.js
const app = getApp()
var site = app.globalData.site;
var comm = require("../../common/utils.js");
var http = require("../../common/http.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
      reportDetails:{
        // reportType:'国土资源',
        // location:'高新区某地某地某街道66号',
        // userName:'',
        // contactInfo:"",
        // reportContent: '随便写点什么吧',
        // imgs: ['/images/index/trends1.png', '/images/index/trends1.png', '/images/index/trends1.png', '/images/index/trends1.png', '/images/index/trends1.png'],
        // videos:[],
      },
      dataId:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this
    if (options.id){
      var id = options.id;
      wx.showLoading({
        title: '加载中..',
      })
      http.req('/api/WxClue/GetClue', 'GET', {
        id:id
      }, function (res) {
        console.log(res.data[0]);
        wx.hideLoading();
        if(res.code == 0){
          // res.data[0].SP = JSON.parse(res.data[0].SP);
          // res.data[0].TP = JSON.parse(res.data[0].TP);
          // _this.setData({
          //   reportDetails: res.data[0]
          // })
          var tp = res.data[0].TP.replace(/\"/g, "").replace("[", "").replace("]", "").split(",");
          var sp = res.data[0].SP.replace(/\"/g, "").replace("[", "").replace("]", "").split(",");

          res.data[0].TP = [];
          res.data[0].SP = [];
          console.log(tp);
          console.log(sp);
          if (tp.length > 0 && tp[0] != ""){
            var tp2 = [];
            for(let i = 0;i<tp.length;i++){
              // http.req('/api/WxClue/DownLoadFile', 'GET',{
              //   id:tp[i]
              // },function(msg){
              //   console.log(msg);
              // },function(e){
              // })
              tp2.push("https://changri.natappvip.cc/api/WxClue/DownLoadFile/" + tp[i]);
            }
            res.data[0].TP = tp2;
          } 
          if (sp.length > 0 && sp[0] != "") {
            var sp2 = [];
            for (let i = 0; i < sp.length; i++) {
              // http.req('/api/WxClue/DownLoadFile', 'GET',{
              //   id:tp[i]
              // },function(msg){
              //   console.log(msg);
              // },function(e){
              // })
              sp2.push("https://changri.natappvip.cc/api/WxClue/DownLoadFile/" + sp[i]);
            }
            res.data[0].SP = sp2;
          };
          _this.setData({
            reportDetails: res.data[0]
          });
        }
      }, function (e) {
        wx.hideLoading()
        wx.showToast({
          title: '数据获取失败！',
          image: '/images/index/error.png',
          duration: 2000,
          success:function(){

          },
          fail:function(){

          },
          complete:function(){
            wx.navigateBack({
              delta: 1
            })
          }
        })
      }); 
    }
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
  
  },
  previewImg: function (e) {
    var index = e.currentTarget.dataset.index;
    var imgs = this.data.reportDetails.TP;
    wx.previewImage({
      //当前显示图片
      current: imgs[index],
      //所有图片
      urls: [imgs[index]],
      success:function(res){
        // console.log(res)
      },
      fail:function(err){
        console.log(err)
      },
      complete:function(msg){
        // console.log(msg)
      }
    })
  },

})