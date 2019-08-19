const cloud = require('wx-server-sdk')
const _ = require('lodash')

cloud.init()
const db = cloud.database({
  env: 'easybluetoothdev-d4pjb'
})

const wx_user = db.collection('wx_user')

exports.main = async (event, content, cb) => {
  const result = (await wx_user.where({
    openId: event.openId
  }).get()).data
  if (result.length === 0) {
    return {
      code: 999,
      msg: '未找到用户'
    }
  }
  const newData = {
    connectedCollapse: event.connectedCollapse,
    unconnectedCollapse: event.unconnectedCollapse
  }
  await wx_user.where({
    openId: event.openId
  }).update({
    data: newData
  })
  return {
    code: 0,
    msg: 'success'
  }
}