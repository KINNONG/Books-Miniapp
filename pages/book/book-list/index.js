// pages/book-list/index.js

var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookList: [],
    categoryId: 0,
    isLoad: false,
    page: 1,
    pageSize: 9,
    subjectId: "",
    bookName: "",
    categories: ["分类"],

    category: "分类",

    categoryIds: [""],

    categoryId: "",
    activeIndex: 0,
    params: {

    },
    inputVal: "",
    categoryList: [{
      id: -1,
      categoryName: '全部'
    }]
  },

  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },

  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
    this.getBookList();
  },

  clearInput: function () {
    this.setData({
      inputVal: ""
    });
    this.getBookList();
  },

  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },

  tabClick: function (e) {
    this.setData({
      activeIndex: e.currentTarget.id
    });
    this.getBookList();
  },

  bindCategoryChange: function (e) {
    var that = this;
    var value = e.detail.value;
    this.setData({
      category: that.data.categories[value],
      categoryId: that.data.categoryIds[value]
    })
    this.getBookList();
  },

  toDetail: function (e) {
    wx.navigateTo({
      url: "/pages/book-detail/index?id=" + e.currentTarget.dataset.id
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var q = options.q;
    this.setData({
      inputVal: q
    })
    this.getBookList();
  },

  getBookList: function () {
    var that = this;
    var params = {
      bookName: that.data.inputVal,
      page: that.data.page,
      limit: that.data.pageSize
    }
    that.setData({
      isLoad: true
    });
    wx.request({
      url: app.globalData.domain + '/api/book/list',
      data: params,
      success: function (res) {
        if (that.data.page == 1) {
          that.setData({
            bookList: []
          });
        }
        if (res.data.code != 0) {
          that.setData({
            isLoad: false
          });
          return;
        }
        if (res.data.bookList.length == 0) {
          that.setData({
            isLoad: true
          });
          return;
        }
        var book = that.data.bookList;
        for (var i = 0; i < res.data.bookList.length; i++) {
          book.push(res.data.bookList[i]);
        }
        that.setData({
          bookList: book,
          isLoad: false
        });
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
    var that = this;
    // 获取待借数据
    wx.getStorage({
      key: 'shopCarInfo',
      success: function (res) {
        that.setData({
          shopCarInfo: res.data,
          shopNum: res.data.shopNum
        });
      }
    })
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
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading()
    this.setData({
      page: 1
    });
    this.getBookList();
    setTimeout(function () {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1000);
  },

  loadMore: function () {
    console.log("load more")
    var that = this;
    var isLoad = this.data.isLoad;
    console.log(isLoad)
    if (!isLoad) {
      this.setData({
        page: that.data.page + 1
      });
      this.getBookList();
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.loadMore();
  }
})