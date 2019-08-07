import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Button, Switch, Picker } from '@tarojs/components'
import './index.scss'
import Login from '../../components/login/index'

export default class Index extends Component {

  state = {
    imgUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1564904594165&di=8ad26945435b747fcfad261394c39c63&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201204%2F09%2F20120409153735_imRnV.thumb.700_0.jpeg',
    title: 'EASYNC II',
    newUpdate: false,
    upDateVersion: 'V 1.9',
    visible: false,
    dialogImg: require('../../assets/image/warning.png')
  }

  config = {
    navigationBarTitleText: '固件',
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

  componentDidMount () {
    setTimeout(() => {
      this.setState({
        newUpdate: true
      })
    }, 3000)
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  getColor () {
    return {
      color: !this.state.newUpdate ? '#b3b3b3' : '#ff2528',
      textDecoration: !this.state.newUpdate ? 'none' : 'underline'
    }
  }

  updateClick () {
    if (!this.state.newUpdate) {
      return false
    }
    this.setState({
      visible: true
    })
  }

  closeDialog () {
    this.setState({
      visible: false
    })
  }

  render () {
    return (
      <View className='index'>
        <View className='head-img'>
          <Image
            style='width: 100%; height: 100%;'
            src={this.state.imgUrl}
          />
        </View>
        <Text className='head-title'>{ this.state.title }</Text>
        <View className='content'>
          <View className='line'>
            <Text className='line-label'>固件版本</Text>
            <Text className='line-value'>V 1.2</Text>
          </View>
          <View className='line'>
            <Text className='line-label'>固件日期</Text>
            <Text className='line-value'>2019.01.15</Text>
          </View>
          <View className='line'>
            <Text className='line-label'>新版本</Text>
            <Text className='line-value' style={this.getColor()} onClick={() => this.updateClick()}>{
              this.state.newUpdate ? `${this.state.upDateVersion} 可升级！` : '无新固件'
            }</Text>
          </View>
        </View>
        <van-dialog
          class='dialog'
          use-slot
          title=''
          confirm-button-text={'确认升级'}
          show={this.state.visible}
          show-cancel-button
          onClose={() => this.closeDialog()}
        >
          <View className='dialog-title'>
            <Image
              className='title-img'
              src={this.state.dialogImg}
            />
            <Text className='title-word'>固件升级</Text>
          </View>
          <View className='dialog-content'>
            <Text className='content-word'>设备将重启后自动完成升级</Text>
          </View>
        </van-dialog>
      </View>
    )
  }
}
