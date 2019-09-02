const cloud = require('wx-server-sdk')
const _ = require('lodash')

cloud.init()
const db = cloud.database({
  env: 'easybluetoothdev-d4pjb'
})
const easync_model_list = db.collection('easync_model_list')

exports.main = async (event, content, cb) => {
  const result = (await easync_model_list.orderBy('sortNum', 'asc').get()).data
  if (result.length === 0) {
    return {
      code: 0,
      data: [],
      msg: 'success'
    }
  }
  _.map(result, (item) => {
    if (item.children && item.children.length !== 0) {
      item.children = _.sortBy(item.children, childItem => childItem.sortNum)
    }
  })
  return {
    code: 0,
    data: result,
    msg: 'success'
  }
}