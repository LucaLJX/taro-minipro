const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database({
  env: 'easybluetoothdev-d4pjb'
})
const easync_fps_list = db.collection('easync_fps_list')

exports.main = async (event, content, cb) => {
  const result = await easync_fps_list.orderBy('sortNum', 'asc').get()
  return result
}