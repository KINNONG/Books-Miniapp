// pages/deposit/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: "",
    subTitle: "",
    buttonTxt: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getMember();
  },

  doIt: function(e) {
    var that = this;
    if (!this.data.hasDeposit) {
      wx.redirectTo({
        url: '/pages/my/deposit-pay/index',
      })
      return;
    }
    if (this.data.hasDeposit) { //退还押金
      wx.showModal({
        title: '提示',
        content: '确定要退还押金？',
        showCancel: true,
        success: function(res){
          if (res.confirm){
            that.refund();
          }
          return;
        }
      })      
    }
  },

  refund: function(){
    var that = this;
    wx.showLoading();
    wx.request({
      url: app.globalData.domain + '/api/member/delDeposit',
      header: {
        token: wx.getStorageSync('token')
      },
      method: "GET",
      data: {},
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

  getMember: function() {
    var that = this;
    wx.request({
      url: app.globalData.domain + '/api/member/info',
      data: {
        token: wx.getStorageSync('token')
      },
      success: function(res) {
        if (res.data.code == 0) {
          var deposit = res.data.member.deposit;
          if (deposit) {
            that.setData({
              hasDeposit: true,
              title: "您已缴纳押金" + deposit + "元",
              subTitle: "可借阅图书",
              buttonTxt: "退还押金"
            })
          } else {
            that.setData({
              hasDeposit: false,
              title: "您还未缴纳押金",
              subTitle: "缴纳押金后可借阅图书",
              buttonTxt: "去交押金"
            })
          }
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})