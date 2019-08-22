import Taro from '@tarojs/taro'

/**
 * 添加用户
 */
export const addWxUser = (params) => {
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
        resolve(res.result.data[0])
      }
      reject('getUser err')
    })
  })
}

/**
 * 更新用户
 */
export const updateUser = (params) => {
  return new Promise((resolve, reject) => {
    Taro.cloud.callFunction({
      name: 'updateUser',
      data: params
    }).then(res => {
      if (res.result && res.result.errMsg.indexOf('ok') !== -1) {
        resolve(true)
      }
      reject('updateUser err')
    })
  })
}

/**
 * 更新用户折叠框状态
 */
export const updateUserCollapse = (params) => {
  return new Promise((resolve, reject) => {
    Taro.cloud.callFunction({
      name: 'updateCollapse',
      data: {
        openId: params.openId,
        connectedCollapse: params.connectedCollapse,
        unconnectedCollapse: params.unconnectedCollapse
      }
    }).then(res => {
      if (res.result.code === 0) {
        resolve(true)
      }
      resolve(null)
    })
  })
}