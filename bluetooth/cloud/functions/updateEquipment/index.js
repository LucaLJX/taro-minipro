const cloud = require('wx-server-sdk')
const _ = require('lodash')

cloud.init()
const db = cloud.database({
  env: 'easybluetoothdev-d4pjb'
})
const easync_equipment = db.collection('easync_equipment')

exports.main = async (event, content, cb) => {
  const { deviceId, openId } = event
  const params = _.omit(event, ['_id'])
  const result = await easync_equipment.where({
    openId: openId,
    deviceId: deviceId
  }).update({
    data: params
  })
  if (result.errMsg.indexOf('ok') !== -1) {
    return {
      code: 0,
      data: true,
      msg: 'success'
    }
  }
  return {
    code: 999,
    data: false,
    msg: 'faild'
  }
}