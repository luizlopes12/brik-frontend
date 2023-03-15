import React from 'react'
import { useRouter } from 'next/router'
import style from './style.module.scss'
import HeadingText from '../../components/HeadingText'

const Admin = () => {
  return (
    <div className={style.overviewContainer}>
    <div className={style.heading}>
          <HeadingText>Overview</HeadingText>
    </div>
    </div>
  )
}

export default Admin