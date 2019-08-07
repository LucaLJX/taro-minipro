import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Button } from '@tarojs/components'
import './index.scss'

import Login from '../../components/login/index'

export default class Index extends Component {

  state = {
    deviceList: [1, 3,4 ],
    imgUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1564904594165&di=8ad26945435b747fcfad261394c39c63&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201204%2F09%2F20120409153735_imRnV.thumb.700_0.jpeg',
    visible: false,
    blueToothIcon: require('../../assets/image/steam.png')
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
      'van-slider': '../../components/vant/slider/index'
    },
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  toPage () {
    console.log(Taro.getEnv())
    console.log(Taro.ENV_TYPE)
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
              <View key={'item' + i} className='device unlink' onClick={() => this.toPage()}>
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
            <Text className='title-status'>已开启</Text>
          </View>
          <View className='dialog-content'>
            {
              this.deviceList.map((item, index) => {
                return <View className='blue-content' key={index}>
                  <View className='blue-icon'>
                    <Image
                      style='width: 100%; height: 100%;'
                      src={this.state.blueToothIcon}
                    />
                  </View>
                  <View className='blue-text'>
                    <Text>已开启</Text>
                  </View>
                </View>
              })
            }
          </View>
          <View className='dialog-button'>
            <Button className='button-left'>重新扫描</Button>
            <Button className='button-right' onClick={() => this.closeDialog()}>已完成</Button>
          </View>
        </van-dialog>
      </View>
    )
  }
}
