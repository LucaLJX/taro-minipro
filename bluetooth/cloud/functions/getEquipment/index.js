const cloud = require('wx-server-sdk')
const _ = require('lodash')

cloud.init()
const db = cloud.database({
  env: 'easybluetoothdev-d4pjb'
})
const easync_equipment = db.collection('easync_equipment')

exports.main = async (event, content, cb) => {
  const { deviceId, openId } = event
  if (!deviceId || !openId) {
    return {
      code: 0,
      data: [],
      msg: 'success'
    }
  }
  const res = await easync_equipment.where({
    deviceId: deviceId,
    openId: openId
  }).get()
  if (res.errMsg.indexOf('ok') === -1) {
    return {
      code: 999,
      data: null,
      msg: 'faild'
    }
  }
  return {
    code: 0,
    data: res.data,
    msg: 'success'
  }
}