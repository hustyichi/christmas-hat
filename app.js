//app.js
const util = require('./utils/util.js');

App({
  onLaunch: function () {
    util.getUserInfoAndDownloadAvatar( (userInfo, avatarFilePath) => {
      this.globalData.avatarDir = avatarFilePath
      this.globalData.userInfo = userInfo

      if (this.userInfoReadyCallback) {
        this.userInfoReadyCallback(userInfo, avatarFilePath);
      }
    })
  },
  globalData: {
    userInfo: null,
    avatarDir: '',
  }
})