import React from 'react'
import Head from 'next/head'
import Sidebar from '../../components/Sidebar'
import Loteamentos from '../../components/Loteamentos'
import { useRouter } from 'next/router'
import style from './style.module.scss'

const Admin = () => {
  const router = useRouter()
  return (
    <>
    <Head>
      <title>BRIK - Admin</title>
    </Head>
    <main className={style.container}>
        Main
    </main>
    </>
  )
}

export default Admin