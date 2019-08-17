import Taro from '@tarojs/taro'

/**
 * 获取openid
 */
export const getOpenId = () => {
  return new Promise((resolve, reject) => {
    Taro.cloud.callFunction({
      name: 'getOpenid'
    }).then(res => {
      resolve(res.result.openid)
    })
  })
}