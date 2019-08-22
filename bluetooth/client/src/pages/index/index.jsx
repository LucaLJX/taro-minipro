import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Button, ScrollView } from '@tarojs/components'
import './index.scss'
import Notify from '../../components/vant/notify/notify'
import Dialog from '../../components/vant/dialog/dialog'
import Toast from '../../components/vant/toast/toast';
import { getOpenId } from '../../service/wx/index'
import {
  getWxUser,
  updateUserCollapse
} from '../../service/user/index'
import _ from 'lodash'
import {
  openBluetoothAdapter,
  getBluetoothAdapterState,
  startBluetoothDevicesDiscovery,
  createBLEConnection,
  getBluetoothDevices,
  closeBLEConnection
} from '../../utils/bluetooth'
import {
  addDevice,
  connectDevice
} from '../../service/device'


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
    onLineList: [],
    connectedList: [],
    unConnectedList: [],
    connectingUrl: require('../../assets/image/connecting.png'),
    connectedUrl: require('../../assets/image/connected.png'),
    imgUrl: require('../../assets/image/device.png'),
    visible: false,
    blueToothIcon: require('../../assets/image/device.png'),
    // openid
    openId: '',
    // 蓝牙是否开启
    blueToothOpen: false,
    blueToothList: [],
    // 正在搜索蓝牙设备
    searchBlueLoading: false,
    eleBlack: require('../../assets/image/ele-black.png'),
    eleRed: require('../../assets/image/ele-red.png'),
    eleLoadingImg: require('../../assets/image/ele-loading.png'),
    eleNum: 40,
    eleLoading: true,
    // 折叠框
    activeNames: []
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
      'van-loading': '../../components/vant/loading/index',
      'van-notify': '../../components/vant/notify/index',
      'van-collapse': '../../components/vant/collapse/index',
      'van-collapse-item': '../../components/vant/collapse-item/index',
      'van-toast': '../../components/vant/toast/index'
    },
  }

  // 蓝牙模块必须在初始化的时候就进行启用，因为此小程序是基于蓝牙使用的
  async componentWillMount () {
    const openId = await getOpenId()
    console.log(openId)
    this.setState({
      openId: openId
    })
    const userInfo = await getWxUser(openId)
    if (!userInfo) {
      return this.toLogin()
    }
    const { connectedCollapse, unconnectedCollapse } = userInfo
    const activeNames = []
    if (connectedCollapse) {
      activeNames.push('connected')
    }
    if (unconnectedCollapse) {
      activeNames.push('unconnected')
    }
    this.setState({
      activeNames: activeNames
    })
    // 初始化蓝牙模块
    const blueToothOpen = await openBluetoothAdapter()
    if (blueToothOpen.code === 0) {
      // 获取蓝牙适配器是否可用
      const blueStatus = await getBluetoothAdapterState()
      if (blueStatus.code === 0 && blueStatus.data.available) {
        this.setState({
          blueToothOpen: true
        })
      }
    }
  }

  async componentDidMount () {
    if (!this.state.blueToothOpen) {
      Notify({
        text: '手机蓝牙未开启，请开启蓝牙...',
        duration: 999999,
        selector: '#custom-selector',
        backgroundColor: '#ff5151'
      })
    }
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  toLogin () {
    const env = Taro.getEnv()
    if (env === Taro.ENV_TYPE.WEAPP) {
      Taro.redirectTo({
        url: '/pages/login/index',
      })
    }
  }

  // 开始搜索蓝牙设备
  async bluetoothDevicesDiscovery () {
    this.setState({
      blueToothList: [],
      searchBlueLoading: true
    })
    // 开始搜索蓝牙
    // const res = await startBluetoothDevicesDiscovery()
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
  async getBluetoothDevices () {
    const result = await getBluetoothDevices()
    if (result.code !== 0) {
      return Taro.showModal({
        title: '操作失败',
        content: '搜索蓝牙设备失败'
      })
    }
    const devices = _.uniqBy(result.data, 'deviceId')
    let list = []
    for (let i = 0; i < devices.length; i++) {
      const node = devices[i]
      if (node.name.indexOf('EASYNC') === -1) {
        const connectItem = _.find(this.state.connectedList, connectItem => connectItem.deviceId === node.deviceId)
        list.push({
          device: node,
          connected: connectItem ? true : false,
          connecting: false,
          timer: null
        })
      }
    }
    this.setState({
      searchBlueLoading: false,
      blueToothList: list
    })
  }

  // 停止蓝牙设备搜索
  stopBluetoothDevicesDiscovery () {
    Taro.stopBluetoothDevicesDiscovery()
  }

  // 点击搜索到的蓝牙设备
  clickBluetoothItem (blueItem) {
    if (blueItem.connected) {
      this.unconnectedBluetooth(blueItem)
    } else {
      this.connectBluetooth(blueItem)
    }
  }

  // 断开蓝牙连接
  async unconnectedBluetooth (blueItem) {
    let items = this.state.blueToothList
    const index = _.findIndex(items, item => item.device.deviceId === blueItem.device.deviceId)
    const result = await closeBLEConnection(blueItem.device.deviceId)
    items[index].connected = false
    items[index].connecting = false
    this.setState({
      blueToothList: items
    })
    let connectedList = this.state.connectedList
    const newList = _.remove(connectedList, item => item.deviceId === blueItem.device.deviceId)
    this.setState({
      connectedList: connectedList
    })
  }

  // 连接蓝牙设备
  async connectBluetooth (blueItem) {
    let items = this.state.blueToothList
    const index = _.findIndex(items, item => item.device.deviceId === blueItem.device.deviceId)
    items[index].connecting = true
    this.setState({
      blueToothList: items
    })
    const result = await createBLEConnection(blueItem.device.deviceId)
    if (result.code === 0) {
      const params = {
        device: blueItem.device,
        openId: this.state.openId
      }
      items[index].connecting = false
      items[index].connected = true
      this.setState({
        blueToothList: items
      })
      let connectedList = this.state.connectedList
      const connectedItem = _.find(connectedList, connectItem => connectItem.deviceId === blueItem.device.deviceId)
      if (!connectedItem) {
        connectedList.push(blueItem.device)
        this.setState({
          connectedList: connectedList
        })
        // 关闭手风琴
        const activeNames = this.state.activeNames
        if (activeNames.indexOf('connected') !== -1) {
          _.remove(activeNames, item => item === 'connected')
          this.setState({
            activeNames: activeNames
          })
          setTimeout(() => {
            activeNames.push('connected')
            this.setState({
              activeNames: activeNames
            })
          }, 100)
        }
      }
      // 连接成功后更新数据库相关内容
      const addResult = await connectDevice(params)
      // 连接成功 end
    } else {
      items[index].connecting = false
      items[index].connected = false
      this.setState({
        blueToothList: items
      })
      // 连接失败 end
    }
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
    setTimeout(() => {
      if (this.state.blueToothOpen) {
        this.bluetoothDevicesDiscovery()
      }
    }, 1000)
  }

  closeDialog () {
    this.setState({
      visible: false
    })
  }

  clickCancel () {
    console.log('clickCancel')
  }

  changeEle () {
    this.setState({
      eleNum: Math.random() * 100,
      eleLoading: !this.state.eleLoading
    })
  }

  // 展开、关闭折叠框
  async changeCollapse (e) {
    const activeNames = e.detail
    this.setState({
      activeNames: activeNames
    })
    const connected = activeNames.indexOf('connected')
    const unconnected = activeNames.indexOf('unconnected')
    const params = {
      openId: this.state.openId,
      connectedCollapse: connected === -1 ? false : true,
      unconnectedCollapse: unconnected === -1 ? false : true
    }
    await updateUserCollapse(params)
  }

  render () {
    return (
      <View className='index' style={{
        paddingTop: this.state.blueToothOpen ? '80rpx' : '80rpx'
      }}>
        {
          !this.state.blueToothOpen &&
            <van-notify
            id='custom-selector'
          />
        }
        <View className='top-content' style={{
          height: this.state.blueToothOpen ? '78rpx' : '78rpx',
          top: this.state.blueToothOpen ? '0' : '0'
        }}>
          <View className='add'>
            <Text className='add-button' onClick={() => this.showDialog()}>  + 添加设备</Text>
            {
              this.state.connectedList.length !== 0 ||
              this.state.onLineList.length !== 0 &&
              <Text className='add-button' onClick={() => this.changeEle()}>一键同步</Text>
            }
            {
              this.state.onLineList.length !== 0 &&
              <Text className='add-button' onClick={() => console.log('批量设置')}>批量设置  </Text>
            }
          </View>
        </View>
        {/* 列表为空的时候展示页面 */}
        {
          (this.state.onLineList.length === 0 &&
            this.state.connectedList.length === 0) &&
          <View className='empty-wrapper'>
            <Text className='empty-word'>无设备连接，请连接EASYNC II...</Text>
          </View>
        }
        {/* 列表不为空的时候展示折叠框 */}
        {
          (this.state.onLineList.length !== 0 || this.state.connectedList.length !== 0) &&
          <van-collapse value={this.state.activeNames}
          onChange={(e) => this.changeCollapse(e)}>
            <van-collapse-item title='已连接' name='connected'>
              {/* 已连接列表 - begin */}
              {
                this.state.connectedList.map((item, i) => {
                  return (
                    <View key={'item' + i} className='device' onClick={() => this.toPage()}>
                      {/* 图片 */}
                      <View className='device-left'>
                        <View className='left-img'>
                          <Image
                            style='width: 100%; height: 100%;'
                            src={this.state.imgUrl}
                          />
                        </View>
                        <View className='left-shadow'>
                        </View>
                      </View>
                      <View className='device-middle'>
                        <Text className='name'>{ item.name }</Text>
                        <Text className='time'>08:25:26:03</Text>
                      </View>
                      {/* 电量展示 */}
                      {
                        this.state.eleLoading &&
                        <View className='device-right'>
                          <View className='icon'>
                            <Image src={this.state.eleLoadingImg} style='width: 60rpx; height: 60rpx; position: absolute; top: 0; left: 0;z-index: 110;' />
                          </View>
                          <Text className='type'>25P</Text>
                        </View>
                      }
                      {
                        (!this.state.eleLoading && this.state.eleNum < 50) &&
                        <View className='device-right'>
                          <View className='icon'>
                            <Image src={this.state.eleRed} style='width: 60rpx; height: 60rpx; position: absolute; top: 0; left: 0;z-index: 110;' />
                            <View className='device-ele ele-red' style={{
                              width: (this.state.eleNum / 100) * 38 + 'rpx'
                            }}></View>
                          </View>
                          <Text className='type'>25P</Text>
                        </View>
                      }
                      { (!this.state.eleLoading &&
                        this.state.eleNum >= 50) &&
                        <View className='device-right'>
                          <View className='icon'>
                            <Image src={this.state.eleBlack} style='width: 60rpx; height: 60rpx; position: absolute; top: 0; left: 0;z-index: 110;' />
                            <View className='device-ele ele-black'  style={{
                              width: (this.state.eleNum / 100) * 38 + 'rpx'
                            }}></View>
                          </View>
                          <Text className='type'>25P</Text>
                        </View>
                      }
                    </View>
                  )
                })
              }
              {/* 已连接列表 - end */}
            </van-collapse-item>
            <van-collapse-item title='未连接' name='unconnected'>
              {/* 未连接列表 - begin */}
              {
                this.state.unConnectedList.map((item, i) => {
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
                      {/* 电量展示 */}
                      {
                        this.state.eleLoading &&
                        <View className='device-right'>
                          <View className='icon'>
                            <Image src={this.state.eleLoadingImg} style='width: 60rpx; height: 60rpx; position: absolute; top: 0; left: 0;z-index: 110;' />
                          </View>
                          <Text className='type'>25P</Text>
                        </View>
                      }
                      {
                        (!this.state.eleLoading && this.state.eleNum < 50) &&
                        <View className='device-right'>
                          <View className='icon'>
                            <Image src={this.state.eleRed} style='width: 60rpx; height: 60rpx; position: absolute; top: 0; left: 0;z-index: 110;' />
                            <View className='device-ele ele-red' style={{
                              width: (this.state.eleNum / 100) * 38 + 'rpx'
                            }}></View>
                          </View>
                          <Text className='type'>25P</Text>
                        </View>
                      }
                      {
                        (!this.state.eleLoading && this.state.eleNum >= 50) &&
                        <View className='device-right'>
                          <View className='icon'>
                            <Image src={this.state.eleBlack} style='width: 60rpx; height: 60rpx; position: absolute; top: 0; left: 0;z-index: 110;' />
                            <View className='device-ele ele-black'  style={{
                              width: (this.state.eleNum / 100) * 38 + 'rpx'
                            }}></View>
                          </View>
                          <Text className='type'>25P</Text>
                        </View>
                      }
                    </View>
                  )
                })
              }
              {/* 未连接列表 - end */}
            </van-collapse-item>
          </van-collapse>
        }

        {/* 轻提示 */}
        <van-toast id='van-toast' />
        
        {/* 弹窗 */}
        <van-dialog
          class='dialog'
          use-slot
          title=''
          show={this.state.visible}
          show-confirm-button={false}
          onTouchmove={(e) => e.stopPropagation()}
          onClose={() => this.closeDialog()}
        >
          <View className='dialog-title' onTouchmove={(e) => e.stopPropagation()}>
            <Text className='title-label'>蓝牙</Text>
            <View className='title-status'>
              <Text className={
                !this.state.blueToothOpen ? 'color-red' : ''
              }>
              {
                this.state.blueToothOpen ? '已开启' : '未开启'
              }
              </Text>
              {
                !this.state.blueToothOpen &&
                <van-icon class={
                  !this.state.blueToothOpen ? 'color-red' : ''
                } name='info-o' size='14px' />
              }
            </View>
          </View>
          <View
            className='dialog-content'
          >
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
                return <View
                  className='blue-content'
                  onClick={() => this.clickBluetoothItem(item)}
                  key={item.device.deviceId + index}>
                  <View className='blue-icon'>
                    <Image
                      style='width: 100%; height: 50%;'
                      src={this.state.blueToothIcon}
                    />
                  </View>
                  <View className='blue-text'>
                    <Text style={{
                    lineHeight: item.connected || item.connecting ? '40rpx' : '80rpx',
                    display: 'block'
                  }}>{item.device.name}:{item.device.deviceId}</Text>
                  {
                    item.connecting &&
                    <View className='right-icon'>
                      <Image
                        style='width: 100%; height: 50%;'
                        src={this.state.connectingUrl}
                      />
                    </View>
                  }
                  {
                    item.connecting &&
                    <Text style={{
                      lineHeight: '40rpx',
                      display: 'block'
                    }}>正在连接...</Text>
                  }
                  {
                    item.connected &&
                    <View className='right-icon'>
                      <Image
                        style='width: 100%; height: 50%;'
                        src={this.state.connectedUrl}
                      />
                    </View>
                  }
                  {
                    item.connected &&
                    <Text style={{
                      lineHeight: '40rpx',
                      display: 'block',
                      color: '#5c9adf'
                    }}>已连接</Text>
                  }
                  </View>
                </View>
              })
            }
          </View>
          <View className='dialog-button' onTouchmove={(e) => e.stopPropagation()}>
            <van-button
              loading={this.state.searchBlueLoading}
              loading-text='搜索中...'
              disabled={!this.state.blueToothOpen || this.state.searchBlueLoading}
              class='button-left'
              onClick={() => this.bluetoothDevicesDiscovery()}
            >重新扫描</van-button>
            <van-button class='button-right' onClick={() => this.closeDialog()}>已完成</van-button>
          </View>
        </van-dialog>
      </View>
    )
  }
}
