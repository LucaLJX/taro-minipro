import Taro from '@tarojs/taro'

const defaultConfig = {
  mode: 'cors',
  timeout: 3000, // 超时 3000 ms
}


export const get = (url, params, options) => Taro.request({
  url: url,
  method: 'GET',
  header: {
    'content-type': 'application/json', // default
  },
})
