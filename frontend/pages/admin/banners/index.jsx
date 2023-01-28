import React from 'react'
import style from './style.module.scss'
import HeadingText from '../../../components/HeadingText'

const Banners = () => {
  return (
    <div className={style.bannersContainer}>
    <div className={style.heading}>
          <HeadingText>Banners</HeadingText>
    </div>
    </div>
  )
}

export default Banners