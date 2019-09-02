const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database({
  env: 'easybluetoothdev-d4pjb'
})
const easync_fps_list = db.collection('easync_fps_list')

exports.main = async (event, content, cb) => {
  const result = await easync_fps_list.orderBy('sortNum', 'asc').get()
  if (result.errMsg.indexOf('ok') !== -1) {
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