import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Button, Switch, Picker } from '@tarojs/components'
import './index.scss'
import dayjs from 'dayjs'
import _ from 'lodash'
import {
  getFpsList,
  getModelList,
  getBitsList
} from '../../service/deviceConfig'
import {
  getBLEDeviceServices,
  getBLEDeviceCharacteristics,
  readBLECharacteristicValue,
  onBLECharacteristicValueChange,
  notifyBLECharacteristicValueChange
} from '../../utils/bluetooth/index'
import {
  getEquipment,
  updateEquipment
} from '../../service/equipment'
import Toast from '../../components/vant/toast/toast'
import {
  readLtc
} from '../../utils/write'

const serviceId = '0783B03E-8535-B5A0-7140-A304D2495CB9'

const KEY = '8535'

export default class Index extends Component {

  state = {
    device: null,
    params: null,
    serviceList: [],
    serviceId: '',
    characteristicNotifyId: '',
    characteristicWriteId: '',
    // 设备信息
    deviceId: '',
    connected: false,
    timeModalVisible: false,
    switchChecked: false,
    speed: 55,
    // 帧率
    fpsSelector: [
    ],
    fpsChecked: '',
    showFps: false,
    // 设备
    modelList: [],
    deviceSelector: [],
    deviceChecked: '',
    showDevice: false,
    // user bits
    userSelector: [],
    userChecked: '',
    showUser: false,
    // rec
    phoneValue: '',
    rtcValue: '设备未连接',
    showRtc: false,
    selector: ['美国', '中国', '巴西', '日本'],
    selectorChecked: '美国',
  }

  config = {
    navigationBarTitleText: '设置',
    usingComponents: {
      'van-button': '../../components/vant/button/index',
      'van-picker': '../../components/vant/picker/index',
      'van-popup': '../../components/vant/popup/index',
      'van-dialog': '../../components/vant/dialog/index',
      'van-switch': '../../components/vant/switch/index',
      'van-icon': '../../components/vant/icon/index',
      'van-slider': '../../components/vant/slider/index',
      'van-field': '../../components/vant/field/index',
      'van-toast': '../../components/vant/toast/index'
    },
  }

  async componentWillMount () {
    const result = await Promise.all([
      getFpsList(),
      getModelList(),
      getBitsList()
    ])
    const fpsList = result[0]
    const modelList = result[1]
    const bitsList = result[2]
    const deviceSelector = [
      {
        values: modelList,
        className: 'column1'
      },
      {
        values: modelList[0].children,
        className: 'column2',
      }
    ]
    this.setState({
      fpsSelector: fpsList,
      deviceSelector: deviceSelector,
      modelList: modelList,
      userSelector: bitsList
    })
  }

  async componentDidMount () {
    const { deviceId, connected, openId } = this.$router.params
    this.setState({
      deviceId: deviceId,
      connected: connected,
      openId: openId
    }, () => {
      if (connected && deviceId) {
        this.getserviceId(deviceId)
      }
    })
    // if (connected && deviceId) {
    //   // 获取连接的蓝牙设备所有的服务
    //   const res = await getBLEDeviceServices(deviceId)
    //   if (res.code === 0) {
    //     const services = res.data
    //     const uuidItem = _.find(services, item => item.uuid.indexOf(KEY) !== -1)
    //     this.setState({
    //       serviceId: uuidItem.uuid,
    //     })
    //     // 获取特征值的uuid
    //     const valueRes = await getBLEDeviceCharacteristics(deviceId, uuidItem.uuid)
    //     if (valueRes.code === 0) {
    //       const characteristics = valueRes.characteristics
    //       const characteristicsItem = _.find(characteristics, item => {
    //         return item.properties.notify &&
    //         item.properties.write &&
    //         item.properties.read
    //       })
    //       if (characteristicsItem) {
    //         this.setState({
    //           characteristicId: characteristicsItem.uuid
    //         })
    //       }
    //     }
    //   }
    // }
    const result = await getEquipment(deviceId, openId)
    this.setState({
      device: result[0] || null,
      params: result[0] || null
    })
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  // 获取蓝牙服务的id
  async getserviceId (deviceId) {
    // 获取连接的蓝牙设备所有的服务
    const res = await getBLEDeviceServices(deviceId)
    if (res.code === 0) {
      const services = res.data
      const uuidItem = _.find(services, item => item.uuid.indexOf(KEY) !== -1)
      this.setState({
        serviceId: uuidItem.uuid
      }, () => {
        this.getCharacteristicId()
      })
    }
  }

  async getCharacteristicId () {
    const { deviceId, serviceId } = this.state
    // 获取特征值的uuid
    const valueRes = await getBLEDeviceCharacteristics(deviceId, serviceId)
    if (valueRes.code === 0) {
      const characteristics = valueRes.data
      const notifyItem = _.find(characteristics, item => {
        return item.properties.notify &&
        !item.properties.write &&
        !item.properties.read
      })
      const writeItem = _.find(characteristics, item => {
        return !item.properties.notify &&
        item.properties.write &&
        !item.properties.read
      })
      if (writeItem && notifyItem) {
        this.setState({
          characteristicNotifyId: notifyItem.uuid,
          characteristicWriteId: writeItem.uuid
        }, () => {
          this.readDevice()
        })
      }
    }
  }

  async readDevice () {
    const { deviceId, serviceId, characteristicNotifyId, characteristicWriteId } = this.state
    const result = await notifyBLECharacteristicValueChange(deviceId, serviceId, characteristicNotifyId)
    await readLtc(deviceId, serviceId, characteristicWriteId)
    // setTimeout(async () => {
    //   await onBLECharacteristicValueChange()
    // }, 5000)
    await onBLECharacteristicValueChange()
    // setTimeout(async () => {
    //   console.log('开始监听变化了  111')
    //   await onBLECharacteristicValueChange()
    // }, 2000)
    // await readBLECharacteristicValue(deviceId, serviceId, characteristicId)
    // setTimeout(async () => {
    //   console.log('开始写变化了')
    //   await readLtc(deviceId, serviceId, characteristicId)
    // }, 5000)
    
    // setTimeout(async () => {
    //   console.log('开始监听变化了   22222')
    //   await onBLECharacteristicValueChange()
    // }, 10000)

    // await readLtc(deviceId, serviceId, characteristicId)
    
    // Taro.notifyBLECharacteristicValueChange({
    //   deviceId: deviceId,
    //   serviceId: serviceId,
    //   characteristicId: characteristicId,
    //   state: true,
    //   complete: (res) => {
    //     console.log('Taro notifyBLECharacteristicValueChange complete')
    //     setTimeout(() => {
    //       readLtc(deviceId, serviceId, characteristicId)
    //     }, 5000)
    //     console.log(res)
    //     Taro.onBLECharacteristicValueChange((res) => {
    //       console.log('Taro onBLECharacteristicValueChange')
    //       console.log(res)
    //     })
    //   }
    // })

  }

  clickTime () {
    this.setState({
      timeModalVisible: true
    })
  }

  // 修改名称 (防抖)
  changeName = _.debounce(async (e) => {
    const newName = e.detail
    const params = {
      name: newName,
      openId: this.state.openId,
      deviceId: this.state.deviceId
    }
    const res = await updateEquipment(params)
    if (!res) {
      Toast.fail('修改名称失败')
      this.setState({
        params: this.state.device
      })
    } else {
      const device = this.state.device
      device.name = newName
      this.setState({
        device: device
      })
    }
  }, 1000)

  // 帧率相关
  showFps () {
    this.setState({
      showFps: true
    })
  }

  colseFps () {
    this.setState({
      showFps: false
    })
  }

  confirmFps (e) {
    this.setState({
      fpsChecked: e.detail.value.text,
      showFps: false
    })
  }

  // 设备相关
  showDevice () {
    this.setState({
      showDevice: true
    })
  }

  colseDevice () {
    this.setState({
      showDevice: false
    })
  }

  changeDeviceColumn (e) {
    const { picker, value, index } = e.detail
    picker.setColumnValues(1, value[0].children)
  }

  confirmDevice (e) {
    if (e.detail.value[0].text === '无') {
      return this.setState({
        deviceChecked: '无',
        showDevice: false
      })
    }
    this.setState({
      deviceChecked: `${e.detail.value[0].text} ${e.detail.value[1].text}`,
      showDevice: false
    })
  }

  // user bits 相关
  showUser () {
    this.setState({
      showUser: true
    })
  }

  colseUser () {
    this.setState({
      showUser: false
    })
  }

  confirmUser (e) {
    this.setState({
      userChecked: e.detail.value.text,
      showUser: false
    })
  }

  // 拖动进度条
  drag (e) {
    this.setState({
      speed: e.detail.value
    })
  }

  // rtc
  showRtcClick () {
    const phoneValue = dayjs().format('YYYY-MM-DD HH:mm:ss')
    this.timer = setInterval(() => {
      this.getPhoneTime()
    }, 1000)
    this.setState({
      phoneValue: phoneValue,
      showRtc: true
    })
  }

  // 获取当前时间
  getPhoneTime () {
    const phoneValue = dayjs().format('YYYY-MM-DD HH:mm:ss')
    this.setState({
      phoneValue: phoneValue
    })
  }

  closeDialog () {
    this.setState({
      showRtc: false
    })
    clearInterval(this.timer)
    setTimeout(() => {
      this.setState({
        phoneValue: '',
        rtcValue: '设备未连接'
      })
    }, 100)
  }

  // 跳转到固件页面
  toFirmware () {
    const env = Taro.getEnv()
    if (env === Taro.ENV_TYPE.WEAPP) {
      Taro.navigateTo({
        url: '/pages/firmware/index',
      })
    }
  }

  render () {
    return (
      <View className='index'>
        {/* 时间 */}
        <View className='block time' onClick={() => this.clickTime()}>
          <Text>08:36:34:15</Text>
          <van-icon class='icon time-icon' size='20px' name='arrow' />
        </View>
        <van-dialog
          class='time-modal'
          use-slot
          closeOnClickOverlay={true}
          // show-confirm-button={false}
          show-cancel-button={false}
          confirmButtonText='同步 RTC'
          show={this.state.timeModalVisible}
          onClose={() => this.setState({
            timeModalVisible: false
          })}
        >
          <View className='time-content'>
            <van-button class='time-button'>从零开始</van-button>
            {/* <van-button class='time-button color-lite-blue'>同步 RTC</van-button> */}
          </View>
        </van-dialog>
        {/* 信号输出 */}
        <View className='speed'>
          <View className='speed-wrapper'>
            <Text className='speed-label'>信号输出</Text>
            <View class='speed-bar'>
              <van-slider
                bar-height={'3px'}
                value={this.state.speed}
                use-button-slot
                onDrag={(e) => this.drag(e)}
              >
                <view class='speed-word' slot="button">
                  { this.state.speed }%
                </view>
              </van-slider>
            </View>
          </View>
        </View>
        {/* 名称 */}
        <View>
          <van-field
            value={this.state.params.name}
            label='名称'
            input-align='right'
            placeholder='名称'
            onChange={(e) => this.changeName(e)}
            // onChange={(name) => {
            //   console.log('change name ')
            //   console.log(name)
            // }}
          />
        </View>
        {/* 帧率  vant */}
        <View onClick={() => this.showFps()}>
          <van-field
            value={this.state.fpsChecked}
            label='帧率'
            input-align='right'
            is-link={true}
            placeholder='请选择'
            readonly
            onClickIcon={() => this.showFps()}
          />
        </View>
        <van-popup
          show={this.state.showFps}
          position={'bottom'}
          onClose={() => this.colseFps()}
        >
          <van-picker
            onCancel={() => this.colseFps()}
            onConfirm={(e) => this.confirmFps(e)}
            show-toolbar
            title='帧率'
            columns={this.state.fpsSelector}
          />
        </van-popup>
        {/* 设备型号 */}
        <View onClick={() => this.showDevice()}>
          <van-field
            value={this.state.deviceChecked}
            label='设备型号'
            input-align='right'
            is-link={true}
            placeholder='请选择'
            readonly
          />
        </View>
        <van-popup
          show={this.state.showDevice}
          position={'bottom'}
          onClose={() => this.colseDevice()}
        >
          <van-picker
            onChange={(e) => this.changeDeviceColumn(e)}
            onCancel={() => this.colseDevice()}
            onConfirm={(e) => this.confirmDevice(e)}
            show-toolbar
            title='设备型号'
            columns={this.state.deviceSelector}
          />
        </van-popup>
        {/* RTC */}
        <View onClick={() => this.showRtcClick()}>
          <van-field
            value={this.state.rtcValue}
            label='RTC'
            input-align='right'
            is-link={true}
            placeholder='请同步'
            readonly
          />
        </View>
        {/* USER BITS */}
        <View onClick={() => this.showUser()}>
          <van-field
            value={this.state.userChecked}
            label='USER BITS'
            input-align='right'
            is-link={true}
            placeholder='请选择'
            readonly
          />
        </View>
        <van-popup
          show={this.state.showUser}
          position={'bottom'}
          onClose={() => this.colseUser()}
        >
          <van-picker
            onCancel={() => this.colseUser()}
            onConfirm={(e) => this.confirmUser(e)}
            show-toolbar
            title='USER BITS'
            columns={this.state.userSelector}
          />
        </van-popup>
        {/* 单反模式 */}
        <View className='switch-wrapper'>
          <van-field
            value=''
            label='单反模式'
            input-align='right'
            readonly
          />
          <van-switch class='switch' size='16px' checked={this.switchChecked} onChange={(e) => this.setState({
              switchChecked: e.detail
            })} />
        </View>
        {/* 电量 */}
        <View style={{
          marginTop: '30rpx'
        }}>
          <van-field
            value='72% 3.1V'
            label='电量'
            input-align='right'
            readonly
          />
        </View>
        {/* 固件 */}
        <View onClick={() => this.toFirmware()}>
          <van-field
            value={'V1.02'}
            label='固件'
            input-align='right'
            is-link={true}
            placeholder='请选择'
            readonly
          />
        </View>
        {/* 删除按钮 */}
        <van-button class='del-button' type='danger'>删除设备</van-button>

        {/* 轻提示 */}
        <van-toast id='van-toast' />

        {/* rtc弹窗 */}
        <van-dialog
          class='dialog'
          use-slot
          title=''
          confirm-button-text='同步手机时间'
          show={this.state.showRtc}
          show-cancel-button
          onClose={() => this.closeDialog()}
          onConfirm={() => this.closeDialog()}
          onCancel={() => this.closeDialog()}
        >
          <View className='dialog-content'>
            <View className='content'>
              <Text className='content-label phone-text'>手机：</Text>
              <Text className='content-value phone-text'>{ this.state.phoneValue }</Text>
            </View>
            <View className='content'>
              <Text className='content-label rtc-text'>RTC：</Text>
              <Text className='content-value rtc-text'>{ this.state.rtcValue || '未读取' }</Text>
            </View>
          </View>
        </van-dialog>
      </View>
    )
  }
}
