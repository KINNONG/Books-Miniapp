const app = getApp()

Page({
  data: {
    useTime: 0,
    surplusTime: 0,
    isSignIn: false,
    deposit: 0,
    statuses: '',
    orderBookNum: 0
  },

  onLoad: function (option) {

  },

  logout() {
    wx.removeStorage({
      key: 'token',
    })
    this.setData({
      member: null
    })
    wx.showLoading({
      title: '退出中',
    })
    wx.redirectTo({
      url: '/pages/my/index/index',
    })
    wx.hideLoading()
  },

  tabNav: function (e) {
    var url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: url,
    })
  },

  onShow() {
    var token = wx.getStorageSync('token')
    if (!token) {
      return;
    }

    this.getMember();
    this.getOrderList();
  },

  //获取用户押金信息
  getMember: function () {
    var that = this;
    wx.request({
      url: app.globalData.domain + '/api/member/info',
      data: {
        token: wx.getStorageSync('token')
      },
      success: function (res) {
        if (res.data.code == 0) {
          console.log(res.data)
          if (res.data.member.deposit) {
            that.setData({
              member: res.data.member,
              deposit: res.data.member.deposit
            })
          }else{
            that.setData({
              member: res.data.member,
              deposit:0
            })
          }
        }
      }
    })
  },

  //获取借阅信息
  getOrderList: function () {
    var that = this;
    wx.request({
      url: app.globalData.domain + '/api/order/list',
      data: {
        token: wx.getStorageSync('token'),
        storeId: app.globalData.storeId,
        status: that.data.statuses,
        orderType: 1
      },
      success: (res) => {
        wx.hideLoading();
        if (res.data.code == 0) {
          var orderBookNum = 0;
          for (var i = 0; i < res.data.orderList.length; i++) {
            for (var j = 0; j < res.data.orderList[i].orderBookList.length; j++) {
              orderBookNum++;
            }
          }
          that.setData({
            orderList: res.data.orderList,
            orderBookNum: orderBookNum
          });
        }
      }
    })
  },

  toPage:function(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },

  login: function () {
    wx.navigateTo({
      url: '/pages/login/index',
    })
  }

})