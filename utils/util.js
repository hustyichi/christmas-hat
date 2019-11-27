const rawSaveTempFileToAlbum = tempFilePath => {
  wx.saveImageToPhotosAlbum({
    filePath: tempFilePath,
    success: function () {
      wx.showToast({
        title: '保存至相册成功',
      })
    },
    fail: function () {
      wx.showToast({
        title: '保存至相册失败',
        icon: 'none',
      })
    }
  });
}

const showSettingsModal = () => {
  wx.showModal({
    title: '授权',
    content: '授权失败，打开用户授权设置',
    success(res) {
      if (res.confirm) {
        wx.openSetting()
      }
    }
  })
}

const saveTempFileToAlbum = tempFilePath => {
  wx.getSetting({
    success: res => {
      if (res.authSetting['scope.writePhotosAlbum']) {
        rawSaveTempFileToAlbum(tempFilePath);
      } else {
        wx.authorize({
          scope: "scope.writePhotosAlbum",
          success: res => {
            rawSaveTempFileToAlbum(tempFilePath)
          },
          fail: res => {
            showSettingsModal()
          }
        })
      }
    }
  })
}

const saveCanvasToAlbum = canvasId => {
  wx.canvasToTempFilePath({
    canvasId: canvasId,
    success: res => {
      saveTempFileToAlbum(res.tempFilePath);
    }
  })
}

const getBetterAvatar = avatarUrl => {
  if (avatarUrl.endsWith('/132')) {
    return avatarUrl.substring(0, avatarUrl.length - 3) + "0"
  }
  return avatarUrl;
}

const rawGetUserInfoAndDownloadAvatar = cb => {
  wx.getUserInfo({
    success: infoRes => {
      wx.downloadFile({
        url: getBetterAvatar(infoRes.userInfo.avatarUrl),
        success: downloadRes => {
          cb(infoRes.userInfo, downloadRes.tempFilePath);
        }
      });
    }
  })
}

const getUserInfoAndDownloadAvatar = cb => {
  wx.getSetting({
    success: settingRes => {
      if (settingRes.authSetting['scope.userInfo']) {
        // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
        rawGetUserInfoAndDownloadAvatar(cb)
      }
    }
  })
}

module.exports = {
  saveCanvasToAlbum: saveCanvasToAlbum,
  getUserInfoAndDownloadAvatar: getUserInfoAndDownloadAvatar,
  rawGetUserInfoAndDownloadAvatar: rawGetUserInfoAndDownloadAvatar,
  getBetterAvatar: getBetterAvatar,
}