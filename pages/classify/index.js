// pages/book-list/index.js

var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    swiperList: [{
      url: "https://image.meiye.art/FlqKg5bugFQD5Qzm_QhGM7ET4Mtx?imageMogr2/thumbnail/450x/interlace/1"
    }, {
      url: "https://image.meiye.art/FhHGe9NyO0uddb6D4203jevC_gzc?imageMogr2/thumbnail/450x/interlace/1"
    }, {
      url: "https://image.meiye.art/Fha6tqRTIwHtlLW3xuZBJj8ZXSX3?imageMogr2/thumbnail/450x/interlace/1"
    }],
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

  getCategory: function () {
    var that = this;
    wx.request({
      url: app.globalData.domain + '/api/category/list',
      data: {

      },
      success: function (res) {
        if (res.data.code == 0) {
          var categoryList = that.data.categoryList;
          for (var i = 0; i < res.data.categoryList.length; i++) {
            categoryList.push(res.data.categoryList[i]);
          }
          that.setData({
            categoryList: categoryList
          });

        }
      }
    })
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
    this.getCategory();
    this.getBookList();
  },

  getBookList: function () {
    var that = this;
    var params = {
      bookName: that.data.inputVal,
      page: that.data.page,
      limit: that.data.pageSize,
      categoryId: that.data.categoryList[that.data.activeIndex].id
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