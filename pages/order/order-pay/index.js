// pages/order/order-pay/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    this.setData({
      id: id
    })
    this.getOrder(id)
  },

  getOrder: function (id) {
    var that = this;
    wx.request({
      url: app.globalData.domain + '/api/order/detail',
      data: {
        id: id
      },
      header: {
        token: wx.getStorageSync('token')
      },
      success: function (res) {
        that.setData({
          order: res.data.order
        });
      }
    })
  },

  payOrder: function () {
    var that = this;
    wx.request({
      url: app.globalData.domain + '/api/order/pay',
      header: {
        token: wx.getStorageSync('token')
      },
      data: {
        id: that.data.id
      },
      success: function (res) {
        if(res.data.code == 0){
          wx.showModal({
            title: '提示',
            content: '支付成功',
            showCancel: false,
            success: function(res){
              wx.navigateBack({

              })
            }
          })
          
        }
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