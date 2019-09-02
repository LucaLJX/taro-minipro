import Taro, { Component } from '@tarojs/taro'
import _ from 'lodash'

// ArrayBuffer转16进度字符串示例
const ab2hex = (buffer) => {
  var hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    function(bit) {
      return ('00' + bit.toString(16)).slice(-2)
    }
  )
  return hexArr.join('');
}

// 初始化蓝牙模块
export const openBluetoothAdapter = () => {
  return new Promise((resolve, reject) => {
    Taro.openBluetoothAdapter()
    .then(res => {
      resolve({
        code: 0,
        data: res
      })
    })
    .catch(err => {
      resolve({
        code: 999,
        data: null
      })
    })
  })
}

// 获取蓝牙适配器状态
export const getBluetoothAdapterState = () => {
  return new Promise((resolve, reject) => {
    Taro.getBluetoothAdapterState()
    .then(res => {
      resolve({
        code: 0,
        data: res
      })
    })
    .catch(err => {
      resolve({
        code: 999,
        data: null
      })
    })
  })
}

// 开始搜索蓝牙设备
export const startBluetoothDevicesDiscovery = () => {
  return new Promise((resolve, reject) => {
    Taro.startBluetoothDevicesDiscovery()
    .then(res => {
      resolve({
        code: 0,
        data: res
      })
    })
    .catch(err => {
      resolve({
        code: 999,
        data: null
      })
    })
  })
}

// 获取搜索的蓝牙设备列表
export const getBluetoothDevices = (deviceId) => {
  return new Promise((resolve, reject) => {
    Taro.getBluetoothDevices()
    .then(res => {
      const devices = res.devices
      const result = _.map(devices, item => {
        item.advertisDataFormat = ab2hex(item.advertisData)
        return item
      })
      resolve({
        code: 0,
        data: result
      })
    })
    .catch(err => {
      resolve({
        code: 999,
        data: null
      })
    })
  })
}

// 连接低功耗蓝牙设备
export const createBLEConnection = (deviceId) => {
  return new Promise((resolve, reject) => {
    Taro.createBLEConnection({
      deviceId: deviceId,
      timeout: 8000
    })
    .then(res => {
      if (res.errCode === 0 && res.errMsg.indexOf('ok') !== -1) {
        resolve({
          code: 0,
          data: res
        })
      }
      resolve({
        code: 999,
        data: null
      })
    })
    .catch(err => {
      resolve({
        code: 999,
        data: null
      })
    })
  })
}

// 断开低功耗蓝牙设备
export const closeBLEConnection = (deviceId) => {
  return new Promise((resolve, reject) => {
    Taro.closeBLEConnection({
      deviceId: deviceId
    })
    .then(res => {
      if (res.errCode === 0 && res.errMsg.indexOf('ok') !== -1) {
        resolve({
          code: 0,
          data: res
        })
      }
      resolve({
        code: 999,
        data: null
      })
    })
    .catch(err => {
      resolve({
        code: 999,
        data: null
      })
    })
  })
}

// 获取蓝牙设备的所有服务（uuid）
export const getBLEDeviceServices = (deviceId) => {
  return new Promise(async (resolve, reject) => {
    Taro.getBLEDeviceServices({
      deviceId: deviceId
    }).then(res => {
      console.log('getBLEDeviceServices api')
      console.log(res)
      if (res.errCode === 0 && res.services) {
        resolve({
          code: 0,
          data: res.services
        })
      }
      resolve({
        code: 999,
        data: null
      })
    }).catch(err => {
      resolve({
        code: 999,
        data: null
      })
    })
  })
}

// 获取蓝牙设备的所有特征值
export const getBLEDeviceCharacteristics = (deviceId, serviceId) => {
  return new Promise(async (resolve, reject) => {
    Taro.getBLEDeviceCharacteristics({
      deviceId: deviceId,
      serviceId: serviceId
    }).then(res => {
      if (res.errCode === 0) {
        resolve({
          code: 0,
          data: res.characteristics
        })
      }
      resolve({
        code: 999,
        data: null
      })
    }).catch(err => {
      resolve({
        code: 999,
        data: null
      })
    })
  })
}

// 读取低功耗蓝牙设备的特征值的二进制数据值
// 注意：必须设备的特征值支持 read 才可以成功调用。
export const readBLECharacteristicValue = (deviceId, serviceId, characteristicId) => {
  return new Promise(async (resolve, reject) => {
    Taro.readBLECharacteristicValue({
      deviceId: deviceId,
      serviceId: serviceId,
      characteristicId: characteristicId
    }).then(res => {
      console.log('readBLECharacteristicValue')
      console.log(res)
      if (res.errCode === 0) {
        resolve({
          code: 0,
          data: res.characteristics
        })
      }
      resolve({
        code: 999,
        data: null
      })
    }).catch(err => {
      resolve({
        code: 999,
        data: null
      })
    })
  })
}

// 监听低功耗蓝牙设备的特征值变化事件
// 必须先启用 notifyBLECharacteristicValueChange 接口才能接收到设备推送的 notification。
export const onBLECharacteristicValueChange = () => {
  console.log('onBLECharacteristicValueChange begin')
  return new Promise(async (resolve, reject) => {
    Taro.onBLECharacteristicValueChange(res => {
      console.log('onBLECharacteristicValueChange res')
      console.log(res)
      const value = res.value
      const formatVal = ab2hex(value)
      console.log('format value')
      console.log(formatVal)
    })
  })
}

// 启用低功耗蓝牙设备特征值变化时的 notify 功能，订阅特征值。注意：必须设备的特征值支持 notify 或者 indicate 才可以成功调用。
// 另外，必须先启用 notifyBLECharacteristicValueChange 才能监听到设备 characteristicValueChange 事件
export const notifyBLECharacteristicValueChange = (deviceId, serviceId, characteristicId) => {
  return new Promise(async (resolve, reject) => {
    Taro.notifyBLECharacteristicValueChange({
      deviceId: deviceId,
      serviceId: serviceId,
      characteristicId: characteristicId,
      state: true
    }).then(res => {
      console.log('notifyBLECharacteristicValueChange')
      console.log(res)
      if (res.errCode === 0) {
        resolve({
          code: 0,
          data: res.characteristics
        })
      }
      resolve({
        code: 999,
        data: null
      })
    }).catch(err => {
      resolve({
        code: 999,
        data: null
      })
    })
  })
}

// 启用低功耗蓝牙设备特征值变化时的 notify 功能，订阅特征值。注意：必须设备的特征值支持 notify 或者 indicate 才可以成功调用。
// 另外，必须先启用 notifyBLECharacteristicValueChange 才能监听到设备 characteristicValueChange 事件
export const writeBLECharacteristicValue = (deviceId, serviceId, characteristicId, value) => {
  console.log('writeBLECharacteristicValue value')
  console.log(value)
  return new Promise(async (resolve, reject) => {
    Taro.writeBLECharacteristicValue({
      deviceId: deviceId,
      serviceId: serviceId,
      characteristicId: characteristicId,
      value: value
    }).then(res => {
      console.log('writeBLECharacteristicValue')
      console.log(res)
      if (res.errCode === 0) {
        resolve({
          code: 0,
          data: res.characteristics
        })
      }
      resolve({
        code: 999,
        data: null
      })
    }).catch(err => {
      resolve({
        code: 999,
        data: null
      })
    })
  })
}
