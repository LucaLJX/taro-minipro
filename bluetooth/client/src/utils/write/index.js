import { writeBLECharacteristicValue } from '../bluetooth'

// 16进制字符串转buffer
export const format16ToBuffer = (hex) => {
  let typedArray = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function (h) {
    return parseInt(h, 16)
  }))
  const buffer = typedArray.buffer
  return buffer
}

// 读取LTC
export const readLtc = (deviceId, serviceId, characteristicId) => {
  return new Promise(async (resolve, reject) => {
    // const hex = 'AA 02 00 02'
    const hex = 'AA0A000A'
    const value = format16ToBuffer(hex)
    const result = await writeBLECharacteristicValue(deviceId, serviceId, characteristicId, value)
    console.log('readLtc')
    console.log(value)
    console.log(result)
    resolve(result)
  })
}