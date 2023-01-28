import React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import style from './style.module.scss'
import HeadingText from '../../components/HeadingText'

const Admin = () => {
  const router = useRouter()
  return (
    <div className={style.overviewContainer}>
    <div className={style.heading}>
          <HeadingText>Overview</HeadingText>
    </div>
    </div>
  )
}

export default Admin