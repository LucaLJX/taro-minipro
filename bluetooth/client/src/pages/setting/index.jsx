import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Button, Switch, Picker } from '@tarojs/components'
import './index.scss'
import {
  AtIcon,
  AtModal,
  AtModalHeader,
  AtModalContent,
  AtModalAction,
  AtSwitch
} from 'taro-ui'

import Login from '../../components/login/index'

export default class Index extends Component {

  state = {
    timeModalVisible: false,
    switchChecked: false,
    speed: 55,
    selector: ['美国', '中国', '巴西', '日本'],
    selectorChecked: '美国',
  }

  config = {
    navigationBarTitleText: '设置'
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  clickTime () {
    this.setState({
      timeModalVisible: true
    })
  }

  getSpeedWidth () {
    const width = this.state.speed / 100 * 660
    return width + 'rpx'
  }

  getWordPosition () {
    // 文字所在的位置 - 文字的宽度
    const wordWidth = 80
    const position = this.state.speed / 100 * 660
    return (position - 80 / 2) + 'rpx'
  }

  render () {
    return (
      <View className='index'>
        {/* 时间 */}
        <View className='block time' onClick={() => this.clickTime()}>
          <Text>08:36:34:15</Text>
          <AtIcon className='icon time-icon' value='chevron-right' size='20'></AtIcon>
        </View>
        <AtModal className='time-modal' isOpened={this.state.timeModalVisible}>
          <AtModalContent>
            <Button className='time-button'>从零开始</Button>
            <Button className='time-button color-lite-blue'>同步 RTC</Button>
          </AtModalContent>
        </AtModal>
        {/* 名称 */}
        <View className='block normal'>
          <Text className='block-label'>名称</Text>
          <Text className='block-value'>A机</Text>
        </View>
        {/* 帧率 */}
        <View className='block normal'>
          <Text className='block-label'>帧率</Text>
          <AtIcon className='icon normal-icon' value='chevron-right' size='20'></AtIcon>
          <View className='block-picker'>
            <Picker mode='selector' range={this.state.selector} onChange={this.onChange}>
              <View className='picker'>
                25P
              </View>
            </Picker>
          </View>
        </View>
        {/* 设备型号 */}
        <View className='block normal'>
          <Text className='block-label'>设备型号</Text>
          <AtIcon className='icon normal-icon' value='chevron-right' size='20'></AtIcon>
          <View className='block-picker'>
            <Picker mode='selector' range={this.state.selector} onChange={this.onChange}>
              <View className='picker'>
                ARRI MINI
              </View>
            </Picker>
          </View>
        </View>
        {/* RTC */}
        <View className='block normal'>
          <Text className='block-label'>RTC</Text>
          <AtIcon className='icon normal-icon' value='chevron-right' size='20'></AtIcon>
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
          <AtIcon className='icon normal-icon' value='chevron-right' size='20'></AtIcon>
          <View className='block-picker'>
            <Picker mode='selector' range={this.state.selector} onChange={this.onChange}>
              <View className='picker'>
              16.05.18.00
              </View>
            </Picker>
          </View>
        </View>
        {/* 单反模式 */}
        <View className='block normal'>
          <AtSwitch className='block-switch' title='单反模式' checked={this.state.value} onChange={this.handleChange} />
        </View>
        {/* 信号输出 */}
        <View className='block speed'>
          <Text className='block-label'>信号输出</Text>
          <View className='speed-wrapper'>
            <View className='speed-line' style={{
              width: this.getSpeedWidth()
            }}></View>
            <View className='speed-word' style={{
              left: this.getWordPosition()
            }}>{ this.state.speed }%</View>
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
          <AtIcon className='icon normal-icon' value='chevron-right' size='20'></AtIcon>
          <View className='block-picker'>
            <Picker mode='selector' range={this.state.selector} onChange={this.onChange}>
              <View className='picker'>
                V1.02
              </View>
            </Picker>
          </View>
        </View>
        {/* 删除按钮 */}
        <Button className='del-button' type='warn'>删除设备</Button>
      </View>
    )
  }
}
