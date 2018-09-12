// pages/report/report.js
const app = getApp()
var site = app.globalData.site;
var comm = require("../../common/utils.js");
var http = require("../../common/http.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
      pageNum:1,// 请求的页数默认为1
      noData: false,
      isLoadData: false,//是否正在加载数据
      noMore: false, //没有更多数据了
      reportList:[
      ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this
    _this.getReportList();
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
    var _this = this
    _this.setData({
      pageNum:1
    })
    _this.getReportList();
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
    var _this = this ;
    wx.showLoading({
      title: '加载中..',
      mask: true
    })
    _this.setData({
      pageNum: 1
    })
   setTimeout(()=>{
     _this.getReportList()
   },1000)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.isLoadData) return;
    this.getMoreReport()
  },
  getReportList:function(){
      var _this = this;
      wx.showLoading({
        title: '加载中..',
        mask:true
      })
      http.req('/api/WxClue/GetClues','GET',{
        keyword:'',
        p: _this.data.pageNum
      } , function (res) {
        if (res.code == 0) {
          if(res.data.data.length>0){
            for (let i in res.data.data) {
              res.data.data[i].CJSJ = res.data.data[i].CJSJ.split('T')[0]     
              if (!res.data.data[i].SFDD){
                res.data.data[i].SFDD = '不详'
              }
            }
            _this.setData({
              reportList: res.data.data,
              pageNum:1
            })
          }else{
            _this.setData({
              noData:true
            })
          }
        wx.hideLoading()
        }
        wx.stopPullDownRefresh()
      },function (e) {
        wx.stopPullDownRefresh()
        wx.showToast({
          title: '数据获取失败！',
          image: '/images/index/error.png',
          duration: 2000
        })
      }); 
  },
  //获更多举报信息
  getMoreReport:function(){
      var _this = this;
      var pageNum = _this.data.pageNum+1;
      _this.setData({
        isLoadData: true
      })
      http.req('/api/WxClue/GetClues', 'GET', {
        keyword: '',
        pageNum: pageNum
      }, function (res) {
        console.log(res)
        if (res.code == 0) {
          if (res.data.data.length > 0) {
            for (let i in res.data.data) {
              res.data.data[i].CJSJ = res.data.data[i].CJSJ.split('T')[0]
              if (!res.data.data[i].SFDD) {
                res.data.data[i].SFDD = '不详'
              }
            }
            setTimeout(() => {
              _this.setData({
                isLoadData: false,
                pageNum: pageNum,
                reportList: _this.data.reportList.concat(res.data.data)
              })
            }, 1000)
        
          } else {
            setTimeout(() => {
              _this.setData({
                noMore: true
              })
            }, 1000)
            setTimeout(() => {
              _this.setData({
                noMore: false
              })
            }, 2000)
          }
        }
        setTimeout(() => {
          _this.setData({
            isLoadData: false
          })
        }, 1000)
      }, function (e) {
        setTimeout(() => {
          _this.setData({
            isLoadData: false
          })
        }, 1000)
        setTimeout(() => {
          _this.setData({
            noMore: true
          })
        }, 1000)
        setTimeout(() => {
          _this.setData({
            noMore: false
          })
        }, 2000)
        
      }); 
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage:function () {
  
  }
})