//index.js
const util = require('../../utils/util.js');

const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    avatarDir: '',
    width: 100,
    height: 100,
    x: 100 / 2 + 10,
    y: 100 / 2 + 10,
    scale: 1,
    rotate: 0,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    errorMsg: '',
  },

  onLoad: function () {

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        avatarDir: app.globalData.avatarDir,
        hasUserInfo: true,
      })
      updateCanvas()
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = (userInfo, avatarDir) => {
        this.setData({
          userInfo: userInfo,
          avatarDir: avatarDir,
          hasUserInfo: true
        })
        this.updateCanvas()
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      util.rawGetUserInfoAndDownloadAvatar((userInfo, avatarDir) => {
        app.globalData.avatarDir = avatarDir;
        app.globalData.userInfo = userInfo;

        this.setData({
          userInfo: userInfo,
          avatarDir: avatarDir,
          hasUserInfo: true,
        })
        this.updateCanvas()
      })
    }
  },

  getUserInfo: function(e) {
    if (e.detail.userInfo) {
      wx.downloadFile({
        url: util.getBetterAvatar(e.detail.userInfo.avatarUrl),
        success: downRes => {
          app.globalData.avatarDir = downRes.tempFilePath;
          app.globalData.userInfo = e.detail.userInfo;

          this.setData({
            userInfo: e.detail.userInfo,
            avatarDir: downRes.tempFilePath,
            hasUserInfo: true,
            errorMsg: '',
          })
          this.updateCanvas()
        }
      });
    }
    else {
      this.setData({
        errorMsg: '授权失败，无法为您提供服务'
      })
    }
  },

  updateCanvas: function () {
    var context = wx.createCanvasContext('avatarCanvas')

    var hatSrc = "../../images/hat.png";

    context.drawImage(this.data.avatarDir, 0, 0, 300, 300);

    context.translate(this.data.x, this.data.y);
    context.scale(this.data.scale, this.data.scale);
    context.rotate(this.data.rotate);
    context.drawImage(hatSrc, -this.data.width / 2, -this.data.height / 2, this.data.width, this.data.height);
    context.draw()
  },

  saveImage: function () {
    util.saveCanvasToAlbum('avatarCanvas');
  },

  startMoveHat(e) {
    this.setData({
      x: e.touches[0].x,
      y: e.touches[0].y,
    })
    this.updateCanvas();
  },

  moveHat(e) {
    this.setData({
      x: e.touches[0].x,
      y: e.touches[0].y,
    })
    this.updateCanvas();
  },

  rotateHat(e) {
    var newRotate = e.detail.value / 180 * Math.PI;
    this.setData({
      rotate: newRotate,
    })
    this.updateCanvas();
  },

  scaleHat(e) {
    var newScale = e.detail.value / 100;
    this.setData({
      scale: newScale,
    })
    this.updateCanvas();
  },

})
