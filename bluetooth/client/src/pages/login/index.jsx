import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'
import { getOpenId } from '../../service/wx/index'
import {
  addWxUser,
  getWxUser
} from '../../service/user/index'

const userInfo = {
  cloudID: '',
  encryptedData: '',
  errMsg: '',
  iv: '',
  rawData: '',
  signature: '',
  userInfo: {
    avatarUrl: '',
    city: '',
    country: '',
    gender: 1,
    language: '',
    nickName: '',
    province: '',
    openId: ''
  }
}

export default class Login extends Component {

  config = {
    navigationBarTitleText: 'EASYNC II',
    usingComponents: {
      'van-button': '../../components/vant/button/index'
    },
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  async getUserInfo (e) {
    const userInfo = e.detail.userInfo
    const openId = await getOpenId()
    const logined = await getWxUser(openId)
    if (!logined) {
      const params = {
        openId: openId,
        detail: userInfo
      }
      await addWxUser(params)
    }
    this.toPage()
  }

  // 获取手机信息
  getPhoneNum (e) {
    const env = Taro.getEnv()
    // 获取基本信息
    const {
      cloudID,
      iv,
      encryptedData
    } = e.detail
    // 获取wx.login的sessionCode
    let session_code
    if (env === Taro.ENV_TYPE.WEAPP) {
      Taro.login().then(res => {
        session_code = res.code
        Taro.cloud
          .callFunction({
            name: 'getUserInfo',
            data: {
              encryptedData: encryptedData,
              iv: iv,
              sessionCode: session_code  
            }
          })
          .then(res => {
            // return this.toPage()
            this.saveUserInfo(res.result.data)
          })
      }).catch(err => {
      })
    }
  }

  saveUserInfo (userInfo) {
    Taro.cloud
      .callFunction({
        name: 'addUser',
        data: userInfo
      })
      .then(res => {
        console.log('adduser res')
        console.log(res)
      })
      .catch(err => {
        console.log('adduser err')
        console.log(err)
      })
    return false
    Taro.cloud
      .callFunction({
        name: 'getUser',
        data: {
          openId: userInfo.openId
        }
      })
      .then(res => {
        console.log('getUser')
        console.log(res)
      })
  }

  toPage (e) {
    const env = Taro.getEnv()
    if (env === Taro.ENV_TYPE.WEAPP) {
      Taro.redirectTo({
        url: '/pages/index/index',
      })
    }
  }

  render () {
    return (
      <View className='index'>
        <View className='userAvatar'>
          <open-data type='userAvatarUrl'></open-data>
        </View>
        <View className='userNickName'>
          <open-data type='userNickName'></open-data>
        </View>
        <View className='tips'>
          <Text>将使用微信登陆EASYNC II</Text>
        </View>
        {/* 确认登陆 */}
        {/* <van-button
          class='login-button' 
          open-type='getUserInfo'
          type='default'
          onClick={() => this.toPage()}
          // onGetUserinfo={(e) => this.getUserInfo(e)}
        >
          确认登陆
        </van-button> */}
        <Button
          class='wx-login-button' 
          open-type='getUserInfo'
          type='default'
          // onClick={() => this.toPage()}
          onGetUserInfo={(e) => this.getUserInfo(e)}
        >
          确认登陆
        </Button>
        <Text className='cancel-button'>取消</Text>
      </View>
    )
  }
}
