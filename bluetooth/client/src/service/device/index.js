import Taro from '@tarojs/taro'
import { getWxUser, updateUser } from '../user'
import { addConnectLog } from '../log'
import _ from 'lodash'
import dayjs from 'dayjs'

/**
 * 新增设备
 */
export const addDevice = (params) => {
  return new Promise((resolve, reject) => {
    Taro.cloud.callFunction({
      name: 'addDevice',
      data: params
    }).then(res => {
      if (res.result.code === 0) {
        // 添加成功
        resolve(res.result.data)
      }
      reject('addDevice err')
    })
  })
}

/**
 * 获取deviceId对应的设备
 */
export const getDeviceByIds = (deviceIds) => {
  return new Promise((resolve, reject) => {
    Taro.cloud.callFunction({
      name: 'getDeviceByIds',
      data: {
        deviceIds: deviceIds
      }
    }).then(res => {
      if (res.result.code === 0) {
        // 添加成功
        resolve(res.result.data)
      }
      reject('getDeviceByIds err')
    })
  })
}

/**
 * 连接设备
 */
export const connectDevice =  async (params) => {
  return new Promise(async (resolve, reject) => {
    const { device, openId } = params
    const { deviceId } = device
    const result = await Promise.all([
      getDeviceByIds([deviceId]),
      getWxUser(openId)
    ])
    const deviceList = result[0]
    let user = result[1]
    // 判断设备表
    if (deviceList.length === 0) {
      addDevice(device)
    }
    // 判断用户有没有关联
    if (user && user.connectDevices) {
      const item = _.find(user.connectDevices, item => item === deviceId)
      if (!item) {
        user.connectDevices.push(deviceId)
      }
      updateUser(user)
    }
    // 添加连接日志
    const connectParams = {
      deviceId: deviceId,
      openId: openId,
      connectTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
    }
    addConnectLog(connectParams)
    resolve({
      code: 0,
      data: 'success'
    })
  })
}
