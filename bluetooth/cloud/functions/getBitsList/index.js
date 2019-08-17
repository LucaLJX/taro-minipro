const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database({
  env: 'easybluetoothdev-d4pjb'
})
const easync_bits_list = db.collection('easync_bits_list')

exports.main = async (event, content, cb) => {
  const result = await easync_bits_list.orderBy('sortNum', 'asc').get()
  return result
}