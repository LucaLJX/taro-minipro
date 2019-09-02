import Taro from '@tarojs/taro'
import { getWxUser, updateUser } from '../user'
import { addConnectLog } from '../log'
import _ from 'lodash'
import dayjs from 'dayjs'

/**
 * 新增用户设备
 * deviceId, openId
 */
export const addEquipment = (params) => {
  return new Promise((resolve, reject) => {
    Taro.cloud.callFunction({
      name: 'addEquipment',
      data: params
    }).then(res => {
      if (res.result.code === 0) {
        // 添加成功
        resolve(res.result.data)
      }
      reject('addEquipment err')
    })
  })
}

/**
 * 获取deviceId对应的设备
 */
export const getEquipment = (deviceId, openId) => {
  return new Promise((resolve, reject) => {
    Taro.cloud.callFunction({
      name: 'getEquipment',
      data: {
        deviceId: deviceId,
        openId: openId
      }
    }).then(res => {
      if (res.result.code === 0) {
        // 添加成功
        resolve(res.result.data)
      }
      reject('getEquipment err')
    })
  })
}

/**
 * 更新用户连接的设备
 */
export const updateEquipment = (params) => {
  return new Promise((resolve, reject) => {
    Taro.cloud.callFunction({
      name: 'updateEquipment',
      data: params
    }).then(res => {
      if (res.result.code === 0) {
        // 添加成功
        resolve(res.result.data)
      }
      reject('updateEquipment err')
    })
  })
}

/**
 * 获取deviceId对应的设备
 */
export const getEquipmentsByIds = (deviceIds, openId) => {
  return new Promise((resolve, reject) => {
    Taro.cloud.callFunction({
      name: 'getEquipmentsByIds',
      data: {
        deviceIds: deviceIds,
        openId: openId
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
      connectTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      connectType: 'connect',
      oldValue: '',
      newValue: ''
    }
    addConnectLog(connectParams)
    resolve({
      code: 0,
      data: 'success'
    })
  })
}

/**
 * 获取用户已连接的设备
 */

export const getConnectedDevices =  async (openId) => {
  return new Promise(async (resolve, reject) => {
    const user = await getWxUser(openId)
    if (user && user.connectDevices) {
      const deviceIds = user.connectDevices
      const deviceList = await getDeviceByIds(deviceIds)
      resolve(deviceList)
    }
    resolve([])
  })
}


