import Taro from '@tarojs/taro'

/**
 * 添加用户
 */
export const addWxUser = (params) => {
  console.log('add')
  console.log(params)
  return new Promise((resolve, reject) => {
    Taro.cloud.callFunction({
      name: 'addUser',
      data: params
    }).then(res => {
      resolve(res.result)
    })
  })
}

/**
 * 查询用户
 */
export const getWxUser = (params) => {
  return new Promise((resolve, reject) => {
    Taro.cloud.callFunction({
      name: 'getUser',
      data: {
        openId: params
      }
    }).then(res => {
      if (res.result && res.result.data.length !== 0) {
        resolve(true)
      }
      resolve(false)
    })
  })
}