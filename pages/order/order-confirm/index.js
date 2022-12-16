// pages/confirm-order/index.js
const app = getApp();
var WxPay = require('../../../utils/pay.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    distribution: [{
        name: '0',
        value: '自取',
        checked: 'true'
      },
      {
        name: '1',
        value: '邮寄'
      }
    ],
    distributionIndex: 0,
    totalAmount: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var bookList = decodeURIComponent(options.bookList);
    bookList = JSON.parse(bookList);
    console.log(bookList)
    var totalAmount = 0;
    for (var i = 0; i < bookList.length; i++) {
      totalAmount += bookList[i].price;
    }

    this.setData({
      bookList: bookList,
      totalAmount: totalAmount
    })
  },

  getDeposit: function() {
    var that = this;
    wx.request({
      url: app.globalData.domain + '/app/deposit/get',
      data: {
        storeId: app.globalData.storeId
      },
      success: function(res) {
        that.setData({
          freight: res.data.deposit.freight
        });
      }
    })
  },

  distributionChange: function(e) {
    var totalAmount = this.data.totalAmount;
    var freight = 0;
    if (e.detail.value == 1){
      totalAmount = (parseFloat(totalAmount) + freight).toFixed(2);
    }else{
      totalAmount = (parseFloat(totalAmount) - freight).toFixed(2);
    }
    this.setData({
      distributionIndex: e.detail.value,
      totalAmount: totalAmount
    })
  },

  selectAddress: function(e) {
    wx.navigateTo({
      url: '/pages/address/address-list/index?fromType=order',
    })
    return;
    var that = this;
    wx.chooseAddress({
      success: function(res) {
        console.log(res)

        if (res.errMsg == 'chooseAddress:ok') {
          var orderShipment = {
            contacts: res.userName,
            mobile: res.telNumber,
            provinceName: res.provinceName,
            cityName: res.cityName,
            districtName: res.countyName,
            address: res.detailInfo
          }
          that.setData({
            orderShipment: orderShipment
          })
        }

      }
    })
  },

  confirmOrder: function(e) {
    console.log(e);
    var remark = e.detail.value.remark;
    var that = this;
    var loginToken = wx.getStorageSync('token') // 用户登录 token
    var orderStatus = 1;
    if (this.data.distributionIndex == 1) { //快递
      if (!this.data.orderShipment) {
        wx.showToast({
          title: '请选择收货地址',
        })
        return;
      }
      orderStatus = 0;
    }

    var orderBookList = [];
    var bookList = this.data.bookList;
    for (var i = 0; i < bookList.length; i++) {
      var orderBook = {
        bookId: bookList[i].bookId,
        bookName: bookList[i].bookName,
        picUrl: bookList[i].picUrl,
        author: bookList[i].author,
        price: bookList[i].price,
        num: 1
      };
      orderBookList.push(orderBook)
    }
    
    var order = {
      orderBookList: orderBookList,
      storeId: app.globalData.storeId,
      orderStatus: orderStatus,
      formId: e.detail.formId,
      orderShipment: that.data.orderShipment,
      distributionType: that.data.distribution[that.data.distributionIndex].name,
      totalAmount: 0,
      orderType: 1,
      remark: remark
    };
    wx.showLoading({})

    wx.request({
      url: app.globalData.domain + '/api/order/create',
      method: 'POST',
      header: {
        token: loginToken
      },
      data: order,
      success: (res) => {
        console.log(res.data.msg);
        if (res.data.code != 0) {
          wx.showModal({
            title: '提示',
            content: res.data.msg+"，是否前往交押金",
            showCancel: true,
            success: function(e) {
              if(e.confirm){
                console.log("用户点击了确定");
                wx.navigateTo({
                  url: '/pages/my/deposit/index',
                })
              }else if(e.cancel){
                console.log("用户点击取消");
              }
            }
          })
          return;
        }
        //成功跳转我的订单
        wx.navigateTo({
          url: '/pages/order/order-list/index',
        })

        return;
        if (this.data.distributionIndex == 1) {
          WxPay.wxpay(app, res.data.totalAmount, res.data.orderNum, '商品购买', function(code) {
            // 下单成功，跳转到订单管理界面
            if (code == 0) {
              wx.navigateTo({
                url: "/pages/shop/order/order-list/index"
              });
            }
          });
        } else {
          wx.navigateTo({
            url: "/pages/shop/order/order-list/index"
          });
        }

      },
      complete: function(res) {
        wx.hideLoading();
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