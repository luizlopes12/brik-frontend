import '../styles/main.scss'
import Head from 'next/head'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import { useRouter } from 'next/router'
import styles from './style.module.scss'
import userContext from '../context/userContext'
import { useState } from 'react'

function MyApp({ Component, pageProps }) {
  const router = useRouter()
  const [userData, setUserData] = useState({
    userName: 'Luiz',
    userEmail: 'Luiz@luiz.com',
    userPhone: '13996440101'
  })
  return (
    router.pathname.includes('/admin') ? (
      <userContext.Provider value={{userData, setUserData}}>
      <Head>
        <title>Brik Admin</title>
        <link rel='icon' href='/images/favicons/pageIcon.png'/>
      </Head>
      <main className={styles.mainContainer}>
      <Sidebar/>
      <section className={styles.contentContainer}>
      <Navbar/>
      <section className={styles.content}>
      <Component {...pageProps} />
      </section>
      </section>
      </main>
      </userContext.Provider>
    )
    :
    (
      <>
      <Head>
        <title>Brik Empreendimentos</title>
        <link rel='icon' href='/images/favicons/pageIcon.png'/>
      </Head>
      <Component {...pageProps} />
      </>
    )
  )
}

export default MyApp
