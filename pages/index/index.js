//index.js
//获取应用实例
const app = getApp()
var leftHeight = 0;
let rightHeight = 0;
let leftData = [];
let rightData = [];

Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    cardCur: 0,
    autoplay: true,
    interval: 3000,
    duration: 500,
    // 
    leftImgHeight: 0,
    rightImgHeight: 0,
    leftData: [],
    rightData: [],
    bannerList: [],
    categoryList: [],
    bookList: [],
    isLoad: false,
    page: 1,
    pageSize: 10,
    inputVal: ''
  },

  onLoad: function () {
    var that = this;
    this.getAdvert();
    //this.getCategory();
    this.getBook();
    // this.create(this.data.bookList)
    // console.log(that.data.bookList,"dwdww");
  },

  // 轮播图切换
  cardSwiper: function (e) {
    this.setData({
      cardCur: e.detail.current
    })
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
  },

  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },

  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },

  search(e) {
    var q = this.data.inputVal;
    wx.navigateTo({
      url: '/pages/book/book-list/index?q=' + q,
    })
  },

  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    leftHeight = 0;
    rightHeight = 0;
    leftData = [];
    rightData = [];
  },

  toDetail: function (e) {
    wx.navigateTo({
      url: "/pages/book/book-detail/index?id=" + e.currentTarget.dataset.id
    })
  },

  //获取轮播图
  getAdvert: function () {
    var that = this;
    wx.request({
      url: app.globalData.domain + '/api/advert/list',
      data: {
        position: 'shop'
      },
      success: function (res) {
        that.setData({
          bannerList: res.data.advertList
        });
      }
    })
  },

  getCategory: function () {
    var that = this;
    wx.request({
      url: app.globalData.domain + '/api/category/list',
      data: {},
      success: function (res) {
        console.log(res);
        that.setData({
          categoryList: res.data.categoryList
        });
      }
    })
  },

  //最新上架
  getBook: function () {
    var that = this;
    wx.request({
      url: app.globalData.domain + '/api/book/list',
      data: {
        sidx: 'create_time',
        order: 'desc'
      },
      success: function (res) {
        that.setData({
          bookList: res.data.bookList
        });
        that.create(that.data.bookList)
      }
    })
  },

  //推荐图书
  getRecommend: function () {
    var that = this;
    wx.request({
      url: app.globalData.domain + '/api/book/recommend',
      header: {
        token: wx.getStorageSync('token')
      },
      data: {
        isRecommend: 1
      },
      success: function (res) {
        that.setData({
          recommendList: res.data.bookList
        });
      }
    })
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
      this.getBook();
    }
  },

  onPullDownRefresh: function () {
    this.setData({
      page: 1
    });
    wx.showNavigationBarLoading()
    this.getAdvert();
    //this.getCategory();
    this.getBook();
    this.getRecommend();
    setTimeout(function () {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1000);
  },

  onShareAppMessage: function () {
    var path = '/pages/index/index';
    if (app.globalData.distributor) {
      path = path + "?distributor=" + app.globalData.distributor;
    }
    return {
      title: wx.getStorageSync('storeName'),
      path: path,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  // 瀑布流计算
  create: function (data) {
    let promiseArr = [];
    for (let i in data) {
      let p = new Promise((resolve, reject) => {
        wx.getImageInfo({
          src: data[i].picUrl,
          complete: (res) => {
            let proportion = res.height / res.width;
            data[i].height = 375 * proportion;
            resolve(data[i])
          }
        })
      })
      promiseArr.push(p)
    }
    Promise.all(promiseArr).then(res => {
      this.sort(res);
      this.setData({
        leftData,
        rightData
      })
      console.log(this.data.leftData);
    })
  },
  sort: function (data) {
    data.forEach(item => {
      if (leftHeight <= rightHeight) {
        leftHeight += item.height;
        leftData.push(item)
      } else {
        rightHeight += item.height;
        rightData.push(item);
      }
    });
  }
})