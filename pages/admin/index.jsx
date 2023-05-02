import React from 'react'
import { useRouter } from 'next/router'
import style from './style.module.scss'
import HeadingText from '../../components/HeadingText'
import SalesChart from '../../components/SalesChart'

const Admin = () => {
  return (
    <div className={style.overviewContainer}>
    <div className={style.heading}>
          <HeadingText>Overview</HeadingText>
    </div>
    <SalesChart />
    </div>
  )
}

export default Admin