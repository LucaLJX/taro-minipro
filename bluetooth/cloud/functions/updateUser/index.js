const cloud = require('wx-server-sdk')
const _ = require('lodash')

cloud.init()
const db = cloud.database({
  env: 'easybluetoothdev-d4pjb'
})
const wx_user = db.collection('wx_user')

exports.main = async (event, content, cb) => {
  const params = _.omit(event, ['_id'])
  const result = await wx_user.where({
    openId: event.openId
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