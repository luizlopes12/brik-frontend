import React, { lazy, useState } from 'react'
import '../styles/main.scss'
import Head from 'next/head'
import { io } from "socket.io-client";
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import { useRouter } from 'next/router'
import styles from './style.module.scss'
import {UserProvider} from '../context/userContext'
import LotRegisterPopUp from '../components/LotRegisterPopUp'
import LotEditPopUp from '../components/LotEditPopUp'
import RegisterSalePopUp from '../components/RegisterSalePopUp'
import DivisionRegisterPopUp from '../components/DivisionRegisterPopUp'
import {PopUpsProvider} from '../context/popUpsContext'
import TaxesEditPopUp from '../components/TaxesEditPopUp' 
import DivisionEditPopUp from '../components/DivisionEditPopUp'
import { LotSelectedProvider } from '../context/selectedLotContext'
import { DivisionSelectedProvider } from '../context/selectedDivisionContext'
import { GlobalDivisionsDataProvider } from '../context/globalDivisionsDataContext'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import UserNavBar from '../components/UserNavBar'

function MyApp({ Component, pageProps }) {
  const router = useRouter()
  // var socket = io('${process.env.BACKEND_URL}')
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
      <ToastContainer />
      <RegisterSalePopUp/>
      <LotEditPopUp/>
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
        <meta name="description" content="BRIK é uma empresa que te ajuda a encontrar e comprar o seu lote da melhor maneira possível."/>
        <meta property="og:title" content="BRIK - O lote dos seus sonhos!"/>
        <meta name="og:description" content="BRIK é uma empresa que te ajuda a encontrar e comprar o seu lote da melhor maneira possível."/>
        <meta property="og:url" content="https://brikempreendimentos.com/"/>
        <meta property="og:type" content="website"/>
      </Head>

      <Component {...pageProps} />
      </>
    )
  )
}

export default MyApp
