import Taro from '@tarojs/taro'

const defaultConfig = {
  mode: 'cors',
  timeout: 3000, // 超时 3000 ms
}

// code = 200, msg, data

const request = (url, data, options) => {
  const hideError = options.hideError || true

  return new Promise((resolve, reject) => {
    Taro.request({
      url: url,
      method: options.method,
      header: {
        'content-type': options.contentType || 'application/json', // default
      },
      data: data,
      ...defaultConfig,
      success: data => {
        console.log('success')
        console.log(data)
        resolve(data)
      },
      fail: e => {
        console.log('err')
        console.log(e)
        hideError && alert(e)
        reject(e)
      }
    })
  })
}

export default {
  get: (url, data, options = {}) => request(url, data, { ...options, method: 'GET' }),
  post: (url, data, options = {}) => request(url, data, { ...options, method: 'POST' }),
  postParams: (url, data, options = {}) => request(url, data, { ...options, method: 'POST' }),
}


