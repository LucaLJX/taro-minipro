import Taro from '@tarojs/taro'
import { getWxUser, updateUser } from '../user'
import _ from 'lodash'

/**
 * 新增连接日志
 */
export const addConnectLog = (params) => {
  return new Promise((resolve, reject) => {
    Taro.cloud.callFunction({
      name: 'addConnectLog',
      data: params
    }).then(res => {
      if (res.result && res.result.code === 0) {
        // 添加成功
        resolve(res.result._id)
      }
      reject('addConnectLog err')
    })
  })
}

