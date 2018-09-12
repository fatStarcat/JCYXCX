//index.js
//获取应用实例
const app = getApp()
var site = app.globalData.site;
var comm = require("../../common/utils.js");
var http = require("../../common/http.js");

Page({
  data: {
    noData: false,
    isLoadData: false,//是否正在加载数据
    noMore: false, //没有更多数据了
    pageNum: 1,//默认获取新闻第几页
    pageSize: 10,//每页多少条
    animationData: {}, //举报入口显示隐藏动画
    entryShow: true,
    
    //动态列表
    list: [

    ],
    //入口列表
    entryList: [
      {
        imgsrc: '/images/index/report-type1.png',
        text: "国土资源"
      },
      {
        imgsrc: '/images/index/report-type2.png',
        text: "食药安全"
      },
      {
        imgsrc: '/images/index/report-type3.png',
        text: "环境保护"
      },
      {
        imgsrc: '/images/index/report-type4.png',
        text: "国有财产"
      },
      {
        imgsrc: '/images/index/report-type5.png',
        text: "英烈保护"
      },
      {
        imgsrc: '/images/index/report-other.png',
        text: "其他"
      },
    ]

  },

  onLoad: function () {
    this.getKnowledges() //获取知识列表
   
  },
  onShow:function(){
    
  },
  //分享
  onShareAppMessage: function () {

  },
  // 上拉刷新
  onPullDownRefresh: function () {
    var _this = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    _this.setData({
      pageNum:1,
      pageSize:10
    })
    setTimeout(() => {
      _this.getKnowledges()
    }, 1000)
  },

  //上拉加载更多知识
  onReachBottom: function (e) {
    var _this = this;
    //加载更多收起检查入口
    this.data.entryShow = true;
    _this.entryShow()
    if (this.data.isLoadData) return;
    _this.getMoreKnowledges()

  },

  //获取知识
  getKnowledges: function () {
    var _this = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: site + '/api/Knowledge/GetKnowledges',
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      data: {
        keyword: '',
        type:'',
        p: _this.data.pageNum,
        ps: _this.data.pageSize
      },
      success: function (res) {
        if (res.data.code == 0) {
          if (res.data.data.data.length == 0) {
            _this.setData({
              noData: true
            })
          } else {
            _this.setData({
              list: res.data.data.data
            })
          }
        } else {
          _this.setData({
            noData: true
          })
        }
      },
      fail: function () {

      },
      complete: function () {
        wx.hideLoading()
        wx.stopPullDownRefresh()
      }
    })
  },
  //获取更多知识
  getMoreKnowledges: function () {
    var _this = this;
    var pageNum = _this.data.pageNum + 1;
    _this.setData({
      isLoadData: true
    })
    wx.request({
      url: site + '/api/Knowledge/GetKnowledges',
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      data: {
        keyword: '',
        type: '',
        p: pageNum,
        ps: _this.data.pageSize
      },
      success: function (res) {
        if (res.data.code == 0) {
          if (res.data.data.data.length == 0) {
            setTimeout(() => {
              _this.setData({
                noMore: true,
              })
            }, 1000)
            setTimeout(() => {
              _this.setData({
                noMore: false,
              })
            }, 2000)
          } else {
            setTimeout(() => {
              _this.setData({
                isLoadData: false,
                pageNum: pageNum,
                list: _this.data.list.concat(res.data.data.data)
              })
            }, 1000)

          }

        } else {
          setTimeout(() => {
            _this.setData({
              noMore: true,
            })
          }, 1000)
          setTimeout(() => {
            _this.setData({
              noMore: false,
            })
          }, 2000)
        }
      },
      fail: function () {

      },
      complete: function () {
        setTimeout(() => {
          _this.setData({
            isLoadData: false
          })
        }, 1000)

      }
    })
  },
  //知识详情页跳转
  knowledgeDetails: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/knowledgeDetails/knowledgeDetails?id=' + id,
      success: function (res) {
      },
      fail: function () {
      },
      complete: function () {
      }
    })
  },

  // 举报入口跳转
  reportEntry: function (e) {
    var oType = e.currentTarget.dataset.otype;
    wx.navigateTo({
      url: '/pages/reportEntry/reportEntry?type=' + oType
    })
  },
  entryShow: function () {
    var animation = wx.createAnimation({
      duration: 400,
      timingFunction: 'linear',
    })

    if (this.data.entryShow) {

      this.animation = animation

      animation.width(0).step()
      this.setData({
        animationData: animation.export(),
      })
      this.data.entryShow = false;
    } else {
      this.animation = animation

      animation.width('100%').step()
      this.setData({
        animationData: animation.export(),
      })
      this.data.entryShow = true;
    }
  },


})
