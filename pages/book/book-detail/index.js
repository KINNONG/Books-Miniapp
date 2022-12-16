//index.js
//获取应用实例
var app = getApp();
Page({
  data: {
    book: {},
    evaluationList: [],
    bookNum: 0
  },

  goBookshelf: function(e) {
    wx.switchTab({
      url: '/pages/book-shelf/index',
    })
  },

  onLoad: function(e) {
   
    var that = this;

    this.getShelf();
    wx.request({
      url: app.globalData.domain + '/api/book/detail',
      data: {
        id: e.id
      },
      success: function(res) {
        var selectSizeTemp = "";
        that.data.book = res.data.book;
        that.setData({
          book: res.data.book,
        });
        console.log(that.data.book.describe);
      }
    })

    this.getEvaluation(e.id);

  },

  getEvaluation: function(bookId) {
    var that = this;
    wx.request({
      url: app.globalData.domain + '/api/evaluation/list',
      data: {
        bookId: bookId
      },
      success: function(res) {
        that.setData({
          evaluationList: res.data.evaluations
        });
        console.log(that.data.evaluationList);
      }
    })
  },

  getShelf:function(e){
    var that = this;
    wx.request({
      url: app.globalData.domain + '/api/shelf/list',
      header: {
        token: wx.getStorageSync('token')
      },
      data: {
      },
      success: function (res) {
        // console.log(res.data.shelfList.length);
        that.setData({
          bookNum: res.data.shelfList.length,
        });
      }
    })
  },

  addBookshelf: function(e) {
    var book = this.data.book;
    var that = this;
    var data = {
      bookId: book.id,
      bookName: book.bookName,
      picUrl: book.picUrl,
      price: book.price,
      author: book.author,
      num: 1
    }

    wx.request({
      url: app.globalData.domain + '/api/shelf/save',
      header: {
        token: wx.getStorageSync('token')
      },
      method: 'POST',
      data: data,
      success: function (res) {
        if (res.data.code != 0) {
          // 错误 
          wx.showModal({
            title: '错误',
            content: res.data.msg,
            showCancel: false
          })
          return;
        }else{
          that.getShelf();
          wx.showToast({
            title: '加入书架成功',
          })
        }
      }
    })
  },

  tobuy: function(e) {
    if (!wx.getStorageSync('token')) {
      wx.navigateTo({
        url: '/pages/login/index',
      })
      return;
    }

    if (this.data.book.stock < 1) {
      wx.showToast({
        title: '库存不足',
      })
      return;
    }

    var bookList = [{
      bookId: this.data.book.id,
      bookName: this.data.book.bookName,
      picUrl: this.data.book.picUrl,
      price: this.data.book.price,
      num: 1,
      author: this.data.book.author
    }];
    console.log(bookList);
    var params = encodeURIComponent(JSON.stringify(bookList));
    wx.setStorage({
      key: 'payBook',
      data: JSON.stringify(bookList),
    })
    wx.navigateTo({
      url: '/pages/order/order-confirm/index?bookList=' + params,
    })
  },

  telphone: function(e) {
    wx.makePhoneCall({
      phoneNumber: wx.getStorageSync('phone')
    })
  },

  onShareAppMessage: function() {
    var path = '/pages/bms/book-detail/index?id=' + this.data.book.id;
    if (app.globalData.distributor) {
      path = path + "&distributor=" + app.globalData.distributor;
    }
    return {
      title: this.data.book.bookName,
      path: path,
      success: function(res) {
        // 转发成功
      },
      fail: function(res) {
        // 转发失败
      }
    }
  },

  onReady: function(e) {
    // 使用 wx.createAudioContext 获取 audio 上下文 context
    //this.audioCtx = wx.createInnerAudioContext('bookAudio');    
  },
 
  onHide: function(){
    
  }
})