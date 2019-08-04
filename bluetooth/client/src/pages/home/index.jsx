import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Button } from '@tarojs/components'
import './index.scss'
import { AtNoticebar } from 'taro-ui'

import Login from '../../components/login/index'

export default class Index extends Component {

  state = {
    deviceList: [1, 3,4 ],
    imgUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1564904594165&di=8ad26945435b747fcfad261394c39c63&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201204%2F09%2F20120409153735_imRnV.thumb.700_0.jpeg'
  }

  config = {
    navigationBarTitleText: 'EASYNC II'
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

  render () {
    return (
      <View className='index'>
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
        {/* 按钮 */}
        <Button className='button' size='mini'>+ 添加新EASYNC II</Button>
      </View>
    )
  }
}
