const cloud = require('wx-server-sdk')
const _ = require('lodash')

const EquipmentVo = {
  deviceId: '',
  openId: '',
  name: '',
  // 配置
  modelParentId: '',
  modelText: ''
}

cloud.init()
const db = cloud.database({
  env: 'easybluetoothdev-d4pjb'
})
const easync_equipment = db.collection('easync_equipment')

exports.main = async (event, content, cb) => {
  const params = _.assign(EquipmentVo, event)
  const result = (await easync_equipment.add({
    data: params
  }))
  if (result.errMsg.indexOf('ok') !== -1) {
    return {
      code: 0,
      data: result._id,
      msg: 'success'
    }
  }
  return {
    code: 999,
    data: null,
    msg: 'faild'
  }
}