// pages/book-list/index.js

var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookList: [],
    categoryId: -1,
    userId: ''
  },

  toDetailsTap: function (e) {
    wx.navigateTo({
      url: "/pages/book-detail/index?id=" + e.currentTarget.dataset.id
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.categoryId) {
      this.setData({
        categoryId: options.categoryId
      })
    }
    var userId = options.userId;
    if(userId){
      this.setData({
        userId: userId
      })
    }
    this.getBookList();
  },

  getBookList: function () {
    var that = this;
    wx.request({
      url: app.globalData.domain + '/api/book/list',
      data: {
        userId: that.data.userId
      },
      success: function (res) {
        that.setData({
          bookList: res.data.bookList
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