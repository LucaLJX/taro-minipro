import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Button, Switch, Picker } from '@tarojs/components'
import './index.scss'
import dayjs from 'dayjs'
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
    // rec
    phoneValue: 'phoneValue',
    rtcValue: '',
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
      'van-field': '../../components/vant/field/index'
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

  // rtc
  showRtcClick () {
    const phoneValue = dayjs().format('YYYY-MM-DD HH:mm:ss')
    this.setState({
      phoneValue: phoneValue,
      showRtc: true
    })
  }

  closeDialog () {
    this.setState({
      phoneValue: '',
      rtcValue: '',
      showRtc: false
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
        </View>
        <van-dialog
          class='time-modal'
          use-slot
          closeOnClickOverlay={true}
          show-confirm-button={false}
          show-cancel-button={true}
          show={this.state.timeModalVisible}
          onClose={() => this.setState({
            timeModalVisible: false
          })}
        >
          <View className='time-content'>
            <van-button class='time-button'>从零开始</van-button>
            <van-button class='time-button color-lite-blue'>同步 RTC</van-button>
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
            value={'A机'}
            label='名称'
            input-align='right'
            placeholder=''
            readonly
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
          <van-switch class='switch' checked={this.switchChecked} onChange={(e) => this.setState({
              switchChecked: e.detail
            })} />
        </View>
        {/* 电量 */}
        <View>
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
