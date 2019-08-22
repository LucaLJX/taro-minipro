const cloud = require('wx-server-sdk')
const _ = require('lodash')

const DeviceVo = {
  deviceId: '',
  RSSI: null,
  advertisData: '',
  advertisDataFormat: '',
  advertisServiceUUIDs: [],
  localName: '',
  name: '',
  serviceData: {},
  // 配置
  fpsId: '',
  fpsText: '',
  bitsId: '',
  bitsText: '',
  modelParentId: '',
  modelText: ''
}

cloud.init()
const db = cloud.database({
  env: 'easybluetoothdev-d4pjb'
})
const easync_device = db.collection('easync_device')

exports.main = async (event, content, cb) => {
  const params = _.assign(DeviceVo, event)
  const result = (await easync_device.add({
    data: params
  }))
  if (result.errMsg.indexOf('ok') !== -1) {
    return {
      code: 0,
      data: result._id
    }
  }
  return {
    code: 999,
    data: null
  }
}