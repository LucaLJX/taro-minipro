const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database({
  env: 'easybluetoothdev-d4pjb'
})
const wx_user = db.collection('wx_user')

exports.main = async (event, content, cb) => {
  const params = event
  const result = await wx_user.add({
    data: params
  })
  if (result.errMsg.indexOf('ok') !== -1) {
    return {
      code: 0,
      _id: result._id,
      msg: 'success'
    }
  }
  return {
    code: 999,
    _id: null,
    msg: 'faild'
  }
}