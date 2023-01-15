import '../styles/main.scss'
import Head from 'next/head'
import Sidebar from '../components/Sidebar'
import { useRouter } from 'next/router'
import styles from './style.module.scss'

function MyApp({ Component, pageProps }) {
  const router = useRouter()
  return (
    router.pathname.includes('/admin') ? (
      <>
      <Head>
        <title>Brik Admin</title>
        <link rel='icon' href='/images/favicons/pageIcon.png'/>
      </Head>
      <main className={styles.mainContainer}>
      <Sidebar/>
      <Component {...pageProps} />
      </main>
      </>
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
