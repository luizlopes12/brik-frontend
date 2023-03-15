import React from 'react'
import style from './style.module.scss'

const HeadingText = ({children}) => {
  return (
    <h1 className={style.headingText}>{children}</h1>
  )
}

export default HeadingText