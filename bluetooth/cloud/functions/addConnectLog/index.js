const cloud = require('wx-server-sdk')
const _ = require('lodash')
const dayjs = require('dayjs')

const DeviceVo = {
  deviceId: '',
  openId: '',
  connectTime: null
}

cloud.init()
const db = cloud.database({
  env: 'easybluetoothdev-d4pjb'
})
const easync_device_log = db.collection('easync_device_log')

exports.main = async (event, content, cb) => {
  const params = _.assign(DeviceVo, event)
  const res = (await easync_device_log.add({
    data: params
  }))
  if (res.errMsg.indexOf('ok') !== -1) {
    return {
      code: 0,
      _id: res._id
    }
  }
  return {
    code: 999,
    _id: null
  }
}