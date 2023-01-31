import React, { lazy } from 'react'
import '../styles/main.scss'
import Head from 'next/head'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import { useRouter } from 'next/router'
import styles from './style.module.scss'
import {UserProvider} from '../context/userContext'
import LotRegisterPopUp from '../components/LotRegisterPopUp'
import DivisionRegisterPopUp from '../components/DivisionRegisterPopUp'
import {PopUpsProvider} from '../context/popUpsContext'
import TaxesEditPopUp from '../components/taxesEditPopUp'
import DivisionEditPopUp from '../components/DivisionEditPopUp'
import { LotSelectedProvider } from '../context/selectedLotContext'
import { DivisionSelectedProvider } from '../context/selectedDivisionContext'
import { GlobalDivisionsDataProvider } from '../context/globalDivisionsDataContext'

function MyApp({ Component, pageProps }) {
  const router = useRouter()

  return (
    router.pathname.includes('/admin') ? (
      <GlobalDivisionsDataProvider>
      <UserProvider>
      <PopUpsProvider>
        <DivisionSelectedProvider>
        <LotSelectedProvider>
      <Head>
        <title>Brik Admin</title>
        <link rel='icon' href='/images/favicons/pageIcon.png'/>
      </Head>
      <main className={styles.mainContainer}>
      <LotRegisterPopUp/>
      <TaxesEditPopUp/>
      <DivisionRegisterPopUp/>
      <DivisionEditPopUp/>
      <Sidebar/>
      <section className={styles.contentContainer}>
      <Navbar/>
      <section className={styles.content}>
      <Component {...pageProps} />
      </section>
      </section>
      </main>
      </LotSelectedProvider>
      </DivisionSelectedProvider>
      </PopUpsProvider>
      </UserProvider>
      </GlobalDivisionsDataProvider>
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
