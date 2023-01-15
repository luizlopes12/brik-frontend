import React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import style from './style.module.scss'

const Admin = () => {
  const router = useRouter()
  return (
    <>
    <main className={style.container}>
        Overview
    </main>
    </>
  )
}

export default Admin