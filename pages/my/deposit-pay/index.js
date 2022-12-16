// pages/deposit-pay/index.js
const app = getApp();
var WxPay = require('../../../utils/pay.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lendPlan: {
      deposit: 100
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  pay: function(){
    var that = this;
    wx.showLoading();
    wx.request({
      url: app.globalData.domain + '/api/member/addDeposit',
      header: {
        token: wx.getStorageSync('token')
      },
      method: "GET",
      data: {deposit: that.data.lendPlan.deposit},
      success: (res) => {
        if (res.data.code == 0) {
          wx.navigateBack()
        }
      },
      complete: (res) => {
        wx.hideLoading();
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