import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Button } from '@tarojs/components'
import './index.scss'
import Login from '../../components/login/index'

const BlueToothItemVo = {
  deviceId: '',
  name: '',
  RSSI: '',
  advertisData: {},
  advertisServiceUUIDs: [],
  localName: '',
  serviceData: {}
}

export default class Index extends Component {

  state = {
    deviceList: [1, 3,4 ],
    imgUrl: require('../../assets/image/device.png'),
    visible: false,
    blueToothIcon: require('../../assets/image/steam.png'),
    // 蓝牙是否开启
    blueToothOpen: false,
    blueToothList: [],
    searchBlueLoading: false
  }

  config = {
    navigationBarTitleText: 'EASYNC II',
    usingComponents: {
      'van-button': '../../components/vant/button/index',
      'van-picker': '../../components/vant/picker/index',
      'van-popup': '../../components/vant/popup/index',
      'van-dialog': '../../components/vant/dialog/index',
      'van-switch': '../../components/vant/switch/index',
      'van-icon': '../../components/vant/icon/index',
      'van-slider': '../../components/vant/slider/index',
      'van-loading': '../../components/vant/loading/index'
    },
  }

  // 蓝牙模块必须在初始化的时候就进行启用，因为此小程序是基于蓝牙使用的
  componentWillMount () {
    Taro.openBluetoothAdapter()
    .then(res => {
      this.setState({
        blueToothOpen: true
      })
    })
    .catch(err => {
      Taro.showModal({
        title: '蓝牙未开启',
        content: '请打开您的蓝牙设置，然后重启小程序'
      })
    })
  }

  componentDidMount () {
    console.log()
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  // 开始搜索蓝牙设备
  bluetoothDevicesDiscovery () {
    this.setState({
      blueToothList: [],
      searchBlueLoading: true
    })
    // 开始搜索蓝牙
    Taro.startBluetoothDevicesDiscovery()
    .then(res => {
      setTimeout(() => {
        this.getBluetoothDevices()
      }, 2000)
    })
    .catch(err => {
      Taro.showModal({
        title: '操作失败',
        content: '搜索蓝牙设备失败，请检查是否开启蓝牙'
      })
      this.setState({
        searchBlueLoading: false
      })
    })
  }

  // 获取搜索到的蓝牙设备
  getBluetoothDevices () {
    Taro.getBluetoothDevices()
    .then(res => {
      this.setState({
        searchBlueLoading: false,
        blueToothList: res.devices
      })
      this.stopBluetoothDevicesDiscovery()
    })
    .catch(err => {
      Taro.showModal({
        title: '操作失败',
        content: '搜索蓝牙设备失败'
      })
    })
  }

  // 停止蓝牙设备搜索
  stopBluetoothDevicesDiscovery () {
    Taro.stopBluetoothDevicesDiscovery()
  }

  toPage () {
    const env = Taro.getEnv()
    if (env === Taro.ENV_TYPE.WEAPP) {
      Taro.navigateTo({
        url: '/pages/setting/index',
      })
    }
  }

  showDialog () {
    this.setState({
      visible: true
    })
  }

  closeDialog () {
    this.setState({
      visible: false
    })
  }

  clickCancel () {
    console.log('clickCancel')
  }

  render () {
    return (
      <View className='index'>
        <View className='add'>
          <Text className='add-button' onClick={() => console.log('批量设置')}>批量设置</Text>
          <Text className='add-button' onClick={() => console.log('一键同步')}>一键同步</Text>
          <Text className='add-button' onClick={() => this.showDialog()}>+ 添加设备</Text>
        </View>
        {
          this.state.deviceList.map((item, i) => {
            return (
              <View key={'item' + i} className='device' onClick={() => this.toPage()}>
                {/* 图片 */}
                <View className='device-left'>
                  <Image
                    style='width: 100%; height: 100%;'
                    src={this.state.imgUrl}
                  />
                </View>
                <View className='device-middle'>
                  <Text className='name'>A机</Text>
                  <Text className='time'>08:25:26:03</Text>
                </View>
                <View className='device-right'>
                  <View className='icon'></View>
                  <Text className='type'>25P</Text>
                </View>
              </View>
            )
          })
        }
        <Text className='unlink-label'>未连接</Text>
        {
          this.state.deviceList.map((item, i) => {
            return (
              <View key={'item' + i} className='device unlink'>
                <View className='unlink-model'></View>
                {/* 图片 */}
                <View className='device-left'>
                  <Image
                    style='width: 100%; height: 100%;'
                    src={this.state.imgUrl}
                  />
                </View>
                <View className='device-middle'>
                  <Text className='name'>A机</Text>
                  <Text className='time'>--:--:--:--</Text>
                </View>
                <View className='device-right'>
                  <View className='icon'></View>
                  <Text className='type'>--</Text>
                </View>
              </View>
            )
          })
        }
        {/* 弹窗 */}
        <van-dialog
          class='dialog'
          use-slot
          title=''
          show={this.state.visible}
          show-confirm-button={false}
          onClose={() => this.closeDialog()}
        >
          <View className='dialog-title'>
            <Text className='title-label'>蓝牙</Text>
            <Text className='title-status'>
            {
              this.state.blueToothOpen ? '已开启' : '未开启'
            }
            </Text>
          </View>
          <View className='dialog-content'>
            {
              this.state.searchBlueLoading &&
              <van-loading class='dialog-loading' type='spinner' color='#5c9adf' />
            }
            {
              !this.state.searchBlueLoading && this.state.blueToothList.length === 0 &&
              <Text className='dialog-nodata'>暂无蓝牙设备</Text>
            }
            {
              !this.state.searchBlueLoading && this.state.blueToothList.length !== 0 && this.state.blueToothList.map((item, index) => {
                return <View className='blue-content' key={index}>
                  <View className='blue-icon'>
                    <Image
                      style='width: 100%; height: 100%;'
                      src={this.state.blueToothIcon}
                    />
                  </View>
                  <View className='blue-text'>
                    <Text>{item.name}:{item.deviceId}</Text>
                  </View>
                </View>
              })
            }
          </View>
          <View className='dialog-button'>
            <Button className='button-left' onClick={() => this.bluetoothDevicesDiscovery()}>重新扫描</Button>
            <Button className='button-right' onClick={() => this.closeDialog()}>已完成</Button>
          </View>
        </van-dialog>
      </View>
    )
  }
}
