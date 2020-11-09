import React, { useEffect } from 'react'
import request from '../../utils/request'

const Test = () => {

  const testRequest = async () => {
    const result = await request.postParams('http://www.baidu.com', { name: 111 })
  }

  useEffect(() => {
    console.log(123)
    testRequest()
  }, [])

  return 123
}

export default Test