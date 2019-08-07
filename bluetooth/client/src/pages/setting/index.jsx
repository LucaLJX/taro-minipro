import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Button, Switch, Picker } from '@tarojs/components'
import './index.scss'
import Login from '../../components/login/index'

const deviceData = {
  '无': [
    '无'
  ],
  'ARRI': [
    'ALEXA LF',
    'ALEXA MINI',
    'ALEXA SXT',
    'AMIRA'
  ],
  'RED': [
    'Dragon-X',
    'GEMINI 5K',
    'HELIUM 8K'
  ],
  'SONY': [
    'F55',
    'FS7',
    'F65',
    'EX280',
    'A7'
  ],
  'BMD': [
    'BMPCC',
    'BMCC',
    'URSA MINI PRO'
  ],
  'SOUND DEVICES': [
    '6 SERIES',
    '7 SERIES',
    'SCORPIO'
  ],
  'ZOOM': [
    'F8',
    'F4'
  ],
  'ROLAND': [
    'R88',
    'R4 PRO'
  ]
}

export default class Index extends Component {

  state = {
    timeModalVisible: false,
    switchChecked: false,
    speed: 55,
    // 帧率
    fpsSelector: [
      '23.98',
      '24',
      '25',
      '29.97nd',
      '29.97df'
    ],
    fpsChecked: '',
    showFps: false,
    // 设备
    deviceSelector: [
      {
        values: Object.keys(deviceData),
        className: 'column1'
      },
      {
        values: deviceData['无'],
        className: 'column2',
      }
    ],
    deviceChecked: '',
    showDevice: false,
    // user bits
    userSelector: [
      '无',
      'DD-MM-YY',
      'YY-MM-DD',
      'DD-MM-YYY',
      'MM-DD-YYY'
    ],
    userChecked: '',
    showUser: false,
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
      'van-slider': '../../components/vant/slider/index'
    },
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  clickTime () {
    console.log('time show')
    this.setState({
      timeModalVisible: true
    })
  }

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
      fpsChecked: e.detail.value,
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
    picker.setColumnValues(1, deviceData[value[0]])
  }

  confirmDevice (e) {
    if (e.detail.value[0] === '无') {
      return this.setState({
        deviceChecked: '无',
        showDevice: false
      })
    }
    this.setState({
      deviceChecked: `${e.detail.value[0]} ${e.detail.value[1]}`,
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
      userChecked: e.detail.value,
      showUser: false
    })
  }

  // 拖动进度条
  drag (e) {
    this.setState({
      speed: e.detail.value
    })
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
          {/* <AtIcon className='icon time-icon' value='chevron-right' size='20'></AtIcon> */}
        </View>
        <van-dialog
          class='time-modal'
          use-slot
          closeOnClickOverlay={true}
          show-confirm-button={false}
          show-cancel-button={false}
          show={this.state.timeModalVisible}
          confirm-button-open-type="getUserInfo"
          onClose={() => this.setState({
            timeModalVisible: false
          })}
        >
          <van-button class='time-button'>从零开始</van-button>
          <van-button class='time-button color-lite-blue'>同步 RTC</van-button>
        </van-dialog>
        {/* 名称 */}
        <View className='block normal'>
          <Text className='block-label'>名称</Text>
          <Text className='block-value'>A机</Text>
        </View>
        {/* 帧率  vant */}
        <View className='block normal'>
          <Text className='block-label'>帧率</Text>
          <van-icon class='icon normal-icon' size='20px' name='arrow' />
          <Text className='block-value' onClick={() => this.showFps()}>{ this.state.fpsChecked }</Text>
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
        </View>
        {/* 设备型号 */}
        <View className='block normal'>
          <Text className='block-label'>设备型号</Text>
          <van-icon class='icon normal-icon' size='20px' name='arrow' />
          <Text className='block-value' onClick={() => this.showDevice()}>{ this.state.deviceChecked }</Text>
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
        </View>
        {/* RTC */}
        <View className='block normal'>
          <Text className='block-label'>RTC</Text>
          <van-icon class='icon normal-icon' size='20px' name='arrow' />
          <View className='block-picker'>
            <Picker mode='selector' range={this.state.selector} onChange={this.onChange}>
              <View className='picker'>
                08:36:43 2018-05-16
              </View>
            </Picker>
          </View>
        </View>
        {/* USER BITS */}
        <View className='block normal'>
          <Text className='block-label'>USER BITS</Text>
          <van-icon class='icon normal-icon' size='20px' name='arrow' />
          <Text className='block-value' onClick={() => this.showUser()}>{ this.state.userChecked }</Text>
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
        </View>
        {/* 单反模式 */}
        <View className='block normal'>
          <Text className='block-label'>单反模式</Text>
          <van-switch class='block-switch' checked={this.switchChecked} onChange={(e) => this.setState({
            switchChecked: e.detail
          })} />
        </View>
        {/* 信号输出 */}
        <View className='block speed'>
          <Text className='block-label'>信号输出</Text>
          <View className='speed-wrapper'>
            <van-slider
              bar-height={'4px'}
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
        {/* 电量 */}
        <View className='block normal'>
          <Text className='block-label'>电量</Text>
          <Text className='block-value'>72% 3.1V</Text>
        </View>
        {/* 固件 */}
        <View className='block normal'>
          <Text className='block-label'>固件</Text>
          <van-icon class='icon normal-icon' size='20px' name='arrow' />
          <Text className='block-value' onClick={() => this.toFirmware()}>V1.02</Text>
        </View>
        {/* 删除按钮 */}
        <Button className='del-button' type='warn'>删除设备</Button>
        
      </View>
    )
  }
}
