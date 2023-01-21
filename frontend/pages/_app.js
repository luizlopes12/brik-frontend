import '../styles/main.scss'
import Head from 'next/head'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import { useRouter } from 'next/router'
import styles from './style.module.scss'
import userContext from '../context/userContext'
import { useState } from 'react'
import LotRegisterPopUp from '../components/LotRegisterPopUp'
import DivisionRegisterPopUp from '../components/DivisionRegisterPopUp'
import popUpsContext from '../context/popUpsContext'
import TaxesEditPopUp from '../components/taxesEditPopUp'

function MyApp({ Component, pageProps }) {
  const router = useRouter()
  const [userData, setUserData] = useState({
    userName: 'Luiz',
    userEmail: 'Luiz@luiz.com',
    userPhone: '13996440101'
  })
  const [popUps, setPopUps] = useState({
    lotRegister: false,
    taxesEdit: false,
    divisionRegister: false
  }) 
  return (
    router.pathname.includes('/admin') ? (
      <userContext.Provider value={{userData, setUserData}}>
      <popUpsContext.Provider value={{popUps, setPopUps}}>
      <Head>
        <title>Brik Admin</title>
        <link rel='icon' href='/images/favicons/pageIcon.png'/>
      </Head>
      <main className={styles.mainContainer}>
      <LotRegisterPopUp/>
      <TaxesEditPopUp/>
      <DivisionRegisterPopUp/>
      <Sidebar/>
      <section className={styles.contentContainer}>
      <Navbar/>
      <section className={styles.content}>
      <Component {...pageProps} />
      </section>
      </section>
      </main>
      </popUpsContext.Provider>
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
