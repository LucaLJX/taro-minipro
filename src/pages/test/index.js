import React, { useEffect } from 'react'

const Test = () => {

  useEffect(() => {
    console.log(123)
  }, [])

  return 123
}

export default Test