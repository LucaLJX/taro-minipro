const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database({
  env: 'easybluetoothdev-d4pjb'
})
const wx_user = db.collection('wx_user')

exports.main = async (event, content, cb) => {
  const result = await wx_user.where({
    openId: event.openId
  }).get()
  if (result.errMsg.indexOf('ok') !== -1) {
    if (result.data.length === 0) {
      return {
        code: 0,
        data: null,
        msg: 'no user data'
      }
    }
    return {
      code: 0,
      data: result.data,
      msg: 'success'
    }
  }
  return {
    code: 999,
    data: null,
    msg: 'faild'
  }
}