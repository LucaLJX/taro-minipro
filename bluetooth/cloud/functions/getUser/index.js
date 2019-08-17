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
  return result
}