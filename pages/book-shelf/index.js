// pages/bookshelf/index.js
var app = getApp()
Page({
  data: {
    bookList: [],
    bookNum: 0,
    totalAmount: 0,
    checkedBookIds: [],
    test:"000"
  },

  onLoad: function () { },

  onShow: function () {
    // 获取书架数据
    this.getShelf()

  },

  getShelf: function () {
    if(!wx.getStorageSync('token')){
      return;
    }
    var that = this;
    wx.request({
      url: app.globalData.domain + '/api/shelf/list',
      header: {
        token: wx.getStorageSync('token')
      },
      data: {
      },
      success: function (res) {
        that.setData({
          bookList: res.data.shelfList,
        });
      }
    })

  },

  delBook(e){
    var that = this;
    var id = e.currentTarget.dataset.id;
    console.log(id);

    console.log(e);
    wx.request({
      url: app.globalData.domain + '/api/shelf/del',
      header: {
        token: wx.getStorageSync('token')
      },
      data: {
        id: id
      },
      success: function (res) {
        that.getShelf()
      }
    })
  },

  goShop: function (e) {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },

  borrow: function () {
    var bookList = this.data.bookList;
    var checkedBookList = this.getCheckedBookes();
    if (checkedBookList.length == 0) {
      wx.showToast({
        title: '请选择需要借阅的书本',
        icon: 'none'
      })
      return;
    }
    wx.navigateTo({
      url: '/pages/order/order-confirm/index?bookList=' + encodeURIComponent(JSON.stringify(checkedBookList)),
    })
  },

  getCheckedBookes: function () {
    var checkedBookIds = this.data.checkedBookIds;
    var checkedBookes = [];
    if (checkedBookIds.length == 0) {
      return checkedBookes;
    }
    for (var i = 0; i < checkedBookIds.length; i++) {
      checkedBookes.push(this.getBookById(checkedBookIds[i]));
    }
    return checkedBookes;
  },

  getBookById: function (bookId) {
    var bookList = this.data.bookList;
    for (var i = 0; i < bookList.length; i++) {
      if (bookId == bookList[i].id) {
        return bookList[i];
      }
    }
  },

  remove: function (e) {
    var index = e.currentTarget.dataset.index;
    var bookList = this.data.bookList;
    bookList.splice(index, 1);
    this.setData({
      bookList: bookList
    })
    wx.setStorageSync("shopCart", bookList);
  },

  getTotalAmount(ids) {
    var totalAmount = 0;
    for (var i = 0; i < ids.length; i++) {
      var book = this.getBookById(ids[i]);
      totalAmount += book.price;
    }
    return totalAmount;
  },

  checkboxChange: function (e) {
	var totalAmount = this.getTotalAmount(e.detail.value);
    this.setData({
      checkedBookIds: e.detail.value,
      bookNum: e.detail.value.length,
      totalAmount: totalAmount
    })
  }

})