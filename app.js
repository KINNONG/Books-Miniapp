//app.js
App({
  onLaunch: function () {
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      }
    })
  },

  //授权登录
  login: function (userInfo, callback) {
    console.log(userInfo);
    var that = this;
    wx.login({
      success: function (res) {
        var code = res.code; // 微信登录接口返回的 code 参数，下面注册接口需要用到
        console.log("我是code", code);
        // 下面开始调用登录接口
        wx.request({
          url: that.globalData.domain + '/api/wechat/login',
          //设置请求的 参数
          data: {
            code: code,
            avatarUrl: userInfo.avatarUrl,
            nickname: userInfo.nickName,
            gender: userInfo.gender
          },
          success: (res) => {
            console.log(res);
            wx.showLoading({
              title: '加载中',
            })
            if (res.data.code == 0) {
              var token = res.data.token;
              console.log("我是token", token);
              that.globalData.userInfo = res.data.userInfo;
              wx.setStorage({
                key: 'token',
                data: token,
              })
              callback(0);
              wx.hideLoading();
            } else {
              // 登录错误 
              wx.hideLoading();
              wx.showModal({
                title: '提示',
                content: '无法登录，请重试',
                showCancel: false
              })
            }

          }
        })
      }
    })
  },

  globalData: {
    userInfo: null,
    // domain: "http://www.wfuhui.com"
    domain: "http://127.0.0.1:8080"
  }
})