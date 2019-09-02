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
      data: null,
      msg: '未找到用户'
    }
  }
  const newData = {
    connectedCollapse: event.connectedCollapse,
    unconnectedCollapse: event.unconnectedCollapse
  }
  const res = await wx_user.where({
    openId: event.openId
  }).update({
    data: newData
  })
  if (res.errMsg.indexOf('ok') !== -1) {
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