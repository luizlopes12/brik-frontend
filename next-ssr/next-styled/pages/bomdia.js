import Head from 'next/head'
import styles from '../styles/uepa.module.scss'

export default function Home() {
  return (
      <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.bg}>
        AAAAAAAAAAAA <button>BBBBBB</button>
      </div>
      </>
  )
}
