const cloud = require('wx-server-sdk')
const _ = require('lodash')

cloud.init()
const db = cloud.database({
  env: 'easybluetoothdev-d4pjb'
})
const easync_equipment = db.collection('easync_equipment')

exports.main = async (event, content, cb) => {
  const { deviceIds, openId } = event
  if (deviceIds.length === 0) {
    return {
      code: 0,
      data: [],
      msg: 'success'
    }
  }
  let list = []
  for (let i = 0; i < deviceIds.length; i++) {
    const node = deviceIds[i]
    const res = await easync_equipment.where({
      deviceId: node,
      openId: openId
    }).get()
    if (res.errMsg.indexOf('ok') === -1) {
      return {
        code: 999,
        data: null,
        msg: 'faild'
      }
    }
    list = list.concat(res.data)
  }
  const result = _.uniqBy(list, 'deviceId')
  return {
    code: 0,
    data: result,
    msg: 'success'
  }
}