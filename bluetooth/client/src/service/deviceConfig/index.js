import Taro from '@tarojs/taro'

/**
 * 获取fps数据
 */
export const getFpsList = () => {
  return new Promise((resolve, reject) => {
    Taro.cloud.callFunction({
      name: 'getFpsList'
    }).then(res => {
      if (res.result && res.result.code === 0) {
        resolve(res.result.data)
      }
      reject('getFpsList err')
    })
  })
}

/**
 * 获取设备型号数据
 */
export const getModelList = (params) => {
  return new Promise((resolve, reject) => {
    Taro.cloud.callFunction({
      name: 'getModelList'
    }).then(res => {
      if (res.result && res.result.code === 0) {
        resolve(res.result.data)
      }
      reject('getModelList err')
    })
  })
}

/**
 * 获取设备型号数据
 */
export const getBitsList = (params) => {
  return new Promise((resolve, reject) => {
    Taro.cloud.callFunction({
      name: 'getBitsList'
    }).then(res => {
      if (res.result && res.result.code === 0) {
        resolve(res.result.data)
      }
      reject('getBitsList err')
    })
  })
}