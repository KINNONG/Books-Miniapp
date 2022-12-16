var WxPay = require('../../../utils/pay.js')
var sliderWidth = 57.6; // 需要设置slider的宽度，用于计算中间位置
var app = getApp()
Page({
  data: {
    tabs: ["全部", "借阅中", "已归还"],
    activeIndex: 0,
    statuses: ''
  },

  tabClick: function (e) {
    this.setData({
      activeIndex: e.currentTarget.id,
      sliderOffset: e.currentTarget.offsetLeft,
      statuses: this.getStatus(e.currentTarget.id)
    });
    this.getOrderList();
  },

  getStatus: function (activeIndex) {
    if (activeIndex == 0) {
      return '';
    } else if (activeIndex == 1) {
      return '1';
    } else if (activeIndex == 2) {
      return '2';
    } else if (activeIndex == 3) {
      return '3';
    } else if (activeIndex == 4) {
      return '4';
    }
  },

  orderDetail: function (e) {
    var orderId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/pages/order-details/index?id=" + orderId
    })
  },

  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    var that = this;

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },

  getOrderList: function () {
    var that = this;
    wx.request({
      url: app.globalData.domain + '/api/order/list',
      data: {
        token: wx.getStorageSync('token'),
        storeId: app.globalData.storeId,
        statuses: that.data.statuses,
        orderType: 1
      },
      success: (res) => {
        wx.hideLoading();
        if (res.data.code == 0) {
          that.setData({
            orderList: res.data.orderList
          });
          console.log(that.data.orderList);
        }
      }
    })
  },

  cancel: function (e) {
    var that = this;
    var totalAmount = e.currentTarget.dataset.totalamount;
    var orderNum = e.currentTarget.dataset.ordernum;
    var id = e.currentTarget.dataset.id;
    wx.request({
      url: app.globalData.domain + '/api/order/cancel',
      header:{
        token: wx.getStorageSync('token')
      },
      data: {id: id},
      success: (res) => {
        that.getOrderList();
      }
    })
  },

  confirm: function(e){
    var that = this;
    var orderNum = e.currentTarget.dataset.ordernum;
    var id = e.currentTarget.dataset.id;
    wx.request({
      url: app.globalData.domain + '/api/order/confirm',
      header: {
        token: wx.getStorageSync('token')
      },
      data: { orderId: id },
      success: (res) => {
        that.getOrderList();
      }
    })
  },

  evaluate: function (e) {
    var orderId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/order/order-evaluate/index?orderId=' + orderId,
    })
  },

  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成

  },

  onShow: function () {
    this.getOrderList();
  },
  onHide: function () {
    // 生命周期函数--监听页面隐藏

  },
  onUnload: function () {
    // 生命周期函数--监听页面卸载

  },
  onPullDownRefresh: function () {
    // 页面相关事件处理函数--监听用户下拉动作

  },
  onReachBottom: function () {
    // 页面上拉触底事件的处理函数

  },
  logistics: function(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/shop/logistics/index?id=' + id,
    })
  }
})