import Taro from '@tarojs/taro'

/**
 * 获取fps数据
 */
export const getFpsList = () => {
  return new Promise((resolve, reject) => {
    Taro.cloud.callFunction({
      name: 'getFpsList'
    }).then(res => {
      resolve(res.result)
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
      resolve(res.result)
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
      resolve(res.result)
    })
  })
}