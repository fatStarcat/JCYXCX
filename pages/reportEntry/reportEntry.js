// pages/reportEntry/reportEntry.js
const app = getApp()
var site = app.globalData.site;
var comm = require("../../common/utils.js");
var http = require("../../common/http.js");
// 引入腾讯地图
var QQMapWX = require('../../qqmap-wx-jssdk.min.js');
var qqmapsdk;
qqmapsdk = new QQMapWX({
  key: 'ZNIBZ-ZTKAJ-FRFFJ-FLOMH-7KYWZ-5KF3Z' // 必填
});
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSend: false,
    reportTypeList: ['国土资源', '食药安全', '环境保护', '国有财产', '英烈保护', '其他'],
    reportType: '', //举报门类
    location: '',//事发地点
    userName: '',//举报人姓名
    contactInfo: '',//联系方式
    reportContent: '',//举报内容
    imgs: [], //上传的照片
    videos: [], //上传的视频
    addImgs: [], //添加举报图片参数
    addVideos: [], //添加举报视频参数
    photoNum: 9,//默认能选择的相片数量
    imgStatus: false,
    videoStatus: false,
    videoCount:0, //视频上传计数
    imgCount:0,    //图片上传计数
    jwd:'',//经纬度
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var value = wx.getStorageSync('token');
    if (options.type) {
      this.setData({
        reportType: this.data.reportTypeList[options.type]
      })
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
  //填写举报门类
  reportTypeInput: function (e) {
    this.setData({
      reportType: e.detail.value
    })
  },
  //填写事发地点
  locationInput: function (e) {
    this.setData({
      location: e.detail.value
    })
  },
  //填写举报人姓名
  nameInput: function (e) {
    this.setData({
      userName: e.detail.value
    })
  },
  //填写联系方式
  contactInput: function (e) {
    this.setData({
      contactInfo: e.detail.value
    })
  },
  //填写举报内容
  reportContentInput: function (e) {
    this.setData({
      reportContent: e.detail.value
    })
  },
  //picker选择框
  bindPickerChange: function (e) {
    var _this = this;
    this.setData({
      reportType: _this.data.reportTypeList[e.detail.value]
    })
  },
  //获取地理位置
  getLocation: function () {
    var _this = this;
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              _this.getLocationTyep()
            },
            fail(res) {
              wx.openSetting()
            }
          })
        } else {
          _this.getLocationTyep()
        }
      }
    })

  },
  //选择获取地理位置的方式
  getLocationTyep:function(){
    var _this = this;
    wx.showActionSheet({
      itemList: ['获取位置', '打开地图获取'],
      success: function (res) {
        if (res.tapIndex == 0) {
          _this.inputLocation()
        } else if (res.tapIndex == 1) {
          _this.getMapLocation()
        }
      },
      fail: function (res) {
        if (res.errMsg != 'showActionSheet:fail cancel'){
          wx.showToast({
            title: '选择失败',
            mask: true,
            image: '/images/index/error.png',
            duration: 1000,
          })
        }
      
      }
    })
  },

  //直接获取地理位置
  inputLocation: function () {
    var _this = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (msg) {
            if (msg.status == 0) {
              _this.setData({
                location: msg.result.address
              })
            } else {
              wx.showToast({
                title: '获取位置失败',
                image: '/images/index/error.png',
                mask:true,
                duration: 1000
              })
            }
          }
        })
      }
    })
  },
  // 从地图上获取位置
  getMapLocation:function(){
    var _this = this;
    wx.chooseLocation({
      success:function(res){
        _this.setData({
          location: res.address
        })
      },
      fail:function(err){
        if (err.errMsg != "chooseLocation:fail cancel"){
          wx.showToast({
            title: '获取位置失败',
            image: '/images/index/error.png',
            mask: true,
            duration: 1000
          })
        }
      }
    })
  },

  //相机事件
  cameraEvent: function () {
    var _this = this;
    var imgs = _this.data.imgs;
    var videos = _this.data.videos;
    wx.showActionSheet({
      itemList: ['图片', '视频'],
      success: function (res) {
        if (res.tapIndex == 0) {
          if (imgs.length >= 9) {
            wx.showToast({
              title: '最多只能9张',
              //  icon: 'success',
              image: '/images/index/warning.png',
              duration: 2000
            })
            return false;
          } else {
            wx.chooseImage({
              count: _this.data.photoNum, // 默认9
              sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
              sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
              success: function (res) {
                var tempFilePaths = res.tempFilePaths
                for (var i = 0; i < tempFilePaths.length; i++) {
                  if (imgs.length >= 9) {
                    _this.setData({
                      imgs: imgs
                    });
                    return false;
                  } else {
                    imgs.push(tempFilePaths[i]);
                  }
                }
                _this.setData({
                  imgs: imgs,
                  photoNum: _this.data.photoNum - tempFilePaths.length,
                });
              },
              fail: function () {

              },
              complete: function () {

              }
            })
          }
        } else if (res.tapIndex == 1) {
          //视频选择
          if (videos.length >= 3) {
            wx.showToast({
              title: '最多3个视频',
              image: '/images/index/warning.png',
            
              duration: 2000
            })
            return false;
          } else {
            wx.chooseVideo({
              compressed: true,
              success: function (res) {
                console.log(res.size)
                var tempFilePath = res.tempFilePath
                videos.push(tempFilePath)
                _this.setData({
                  videos: videos,
                })
              },
              fail: function (res) {
                console.log(res)

              },
              complete: function (res) {

              }
            })
          }
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  //删除照片
  deleteImg: function (e) {
    var index = e.currentTarget.dataset.index;
    var imgs = this.data.imgs;
    imgs.splice(index, 1);
    this.setData({
      imgs: imgs,
      photoNum: this.data.photoNum + 1,
    });
    console.log(this.data.imgs);
  },

  //删除视频
  deleteVideo: function (e) {
    var index = e.currentTarget.dataset.index;
    var videos = this.data.videos;
    videos.splice(index, 1);
    this.setData({
      videos: videos,
    });
  },


  //图片预览功能
  previewImg: function (e) {
    var index = e.currentTarget.dataset.index;
    var imgs = this.data.imgs;
    wx.previewImage({
      //当前显示图片
      current: imgs[index],
      //所有图片
      urls: [imgs[index]]
    })
  },


  //提交举报信息
  sendEvent: function () {
    var _this = this;
    var imgLen = _this.data.imgs.length;
    var videoLen = _this.data.videos.length;
    if (this.data.reportType.trim() == ''){
      wx.showToast({
        title: '请填写举报门类',
        image: '/images/index/warning.png',
        duration: 1500
      })
    } else if (this.data.reportContent.trim() ==''){
      wx.showToast({
        title: '请填写举报内容',
        image: '/images/index/warning.png',
        duration: 1500
      })
    }else {
    
      if (this.data.location != ''){
        // 解析地址 获取经纬度
        qqmapsdk.geocoder({
          address: _this.data.location,
          success: function (res) {
            if(res.status == 0 ){
              _this.setData({
                jwd: res.result.location.lng + ',' + res.result.location.lat
              })
            }else{
              _this.setData({
                jwd:''
              })
            }
          },
          fail: function (res) {
            _this.setData({
              jwd:''
            })
          },
          complete: function (res) {
            _this.setData({
              isSend: true
            });
            if (_this.data.imgs.length > 0 || _this.data.videos.length > 0) {
              _this.uploadFile()

            } else {
              wx.showLoading({
                title: '正在提交',
                mask:true,
              })
              _this.sendRequest()
            }
          }   
        });
      }else{
        _this.setData({
          isSend: true
        });
        if (_this.data.imgs.length > 0 || _this.data.videos.length > 0) {
          _this.uploadFile()

        } else {
          _this.sendRequest()
        }
      }
     
    }
  },
    //文件上传(递归)
  uploadFile: function () {
    var _this = this;
    var _addImgs = _this.data.addImgs;
    var _addVideos = _this.data.addVideos
    var _imgcount = _this.data.imgCount;
    var _videocount = _this.data.videoCount;
    var file ='';
    console.log(_imgcount,_videocount)
    if (_imgcount<_this.data.imgs.length){
      var loadTitle = '上传第' + (_imgcount + 1) + '张图片';
    
      file = _this.data.imgs[_imgcount]
    } else if (_imgcount == _this.data.imgs.length  || _this.data.imgs.length == 0 ){
      if (_this.data.videos.length!=0 && _videocount < _this.data.videos.length){
      console.log(1)
      var loadTitle = '上传第' + (_videocount + 1) + '个视频';
      file = _this.data.videos[_videocount]
      }
   }
   if(_imgcount<_this.data.imgs.length || _videocount<_this.data.videos.length){
     console.log(loadTitle,file)
     wx.showLoading({
       title: loadTitle,
       mask: true
     })
     var uploadTask = wx.uploadFile({
       url: site + '/api/WxClue/UploadFile',
       filePath: file,
       name: 'file',
       method: 'POST',
       header: {
         'content-type': "application/json",
         'token': wx.getStorageSync('token')
       },
       success: function (res) {
         console.log(res)
        res.data = JSON.parse(res.data)
          if(res.data.code ==0){
            wx.hideToast();
            if (_imgcount < _this.data.imgs.length) {
              _addImgs.push(res.data.data[0]);
              _this.setData({
                addImgs: _addImgs,
                imgCount: Number(_imgcount + 1)
              })
            } else if ((_imgcount == _this.data.imgs.length  || _this.data.imgs.length == 0)) {
              if (_this.data.videos.length != 0 && _videocount < _this.data.videos.length) {
                _addVideos.push(res.data.data[0]);
                _this.setData({
                  addVideos: _addVideos,
                  videoCount: Number(_videocount + 1)
                })
              }
            }
            _this.uploadFile()
          }
       },
       fail: function () {
         wx.showToast({
           title: '上传失败',
           image: '/images/index/error.png',
           duration: 1000,
           mask: true
         });
         if (_imgcount < _this.data.imgs.length) {
           _this.setData({
             imgCount: Number(_imgcount + 1)
           })
         } else if ((_imgcount == _this.data.imgs.length  || _this.data.imgs.length == 0)) {
           if (_this.data.videos.length != 0 && _videocount < _this.data.videos.length){
             _this.setData({
               videoCount: Number(_videocount + 1)
             })
           }
         
         }
         setTimeout(() => {
           wx.hideToast();
           _this.uploadFile()
         }, 1000)
       },
       complete: function () {
         if ((_this.data.addImgs.length == _this.data.imgs.length) && (_this.data.addVideos.length == _this.data.videos.length)){
           wx.hideLoading()
           _this.sendRequest()
         }
       }
     })
     uploadTask.onProgressUpdate((res) => {
       console.log('上传进度', res.progress)
       console.log('已经上传的数据长度', res.totalBytesSent)
       console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
     })
   }
   

  },

  // 提交表单
   sendRequest:function(){
     console.log(this.data.jwd)
     var _this = this;
     
    http.req('/api/WxClue/Add', 'POST', {
      XSLB: _this.data.reportType.trim(), //举报门类
      JBNR: _this.data.reportContent.trim(), //举报内容
      Tp: _this.data.addImgs,   //图片
      Sp: _this.data.addVideos, //视频
      SFDD: _this.data.location, //事发地点
      JBRXM: _this.data.userName, //举报人姓名
      JBRLXFS: _this.data.contactInfo, //举报人联系方式
      JWD: _this.data.jwd,//事发地点经纬度
    }, function (res) {
      if (res.code == 0) {
        _this.setData({
          reportContent: '',
          imgs: [],
          videos: [],
          location: '',
          userName: '',
          contactInfo: '',
          jwd:'',
        });
        wx.hideLoading();
        wx.showToast({
          title: '您已成功提交！',
          icon: "success",
          duration: 2500,
          complete: function (ee) {
            console.log(ee)

          }
        });
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 2500);
      }
      _this.setData({
        isSend: false
      })
    }, function (e) {
      console.log(e)
      wx.hideLoading()
      _this.setData({
        isSend: false
      })
      wx.showToast({
        title: '提交失败！',
        image: '/images/index/error.png',
        duration: 2000
      })
      
    });
  },
   // 跳转举报说明页面
   toReortNote: function () {
     wx.navigateTo({
       url: '/pages/reportNote/reportNote'
     })
   }
})