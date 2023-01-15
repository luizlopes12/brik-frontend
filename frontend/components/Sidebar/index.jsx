import React from 'react'
import style from './style.module.scss'
import Link from 'next/link'
import { useRouter } from 'next/router'


const Sidebar = ({ activePage }) => {

  const router = useRouter()
  return (
    <section className={style.navContainer}>
      <div className={style.brandLogoWrapper}>
        <Link href='/'>
          <img src='/images/brandLogo.svg' className={style.brandLogo} />
          </Link>
      </div>
      <nav className={style.nav}>
        <ul>
          <li className={router.pathname == '/admin/overview' ? style.active : null}>
            <Link href='/admin/overview'>
            <img src='/images/overviewIcon.svg'/>
            Overview
            </Link>
          </li>
          <li className={router.pathname == '/admin/loteamentos' ? style.active : null}>
            <Link href='/admin/loteamentos'>
            <img src='/images/loteamentosIcon.svg' />
            Loteamentos
            </Link>
          </li>
          <li className={router.pathname == '/admin/vendas' ? style.active : null}>
            <Link href='/admin/vendas'>
            <img src='/images/vendasIcon.svg' />
            Vendas
            </Link>
          </li>
          <li className={router.pathname == '/admin/banners' ? style.active : null}>
              <Link href='/admin/banners'>
              <img src='/images/bannersIcon.svg' />
              Banners
              </Link>
          </li>
        </ul>
        <ul>
          <li className={router.pathname == '/admin/configs' ? style.active : null}>
            <Link href='/admin/configs'>
            <img src='/images/configIcon.svg' />
            Configurações
            </Link>
          </li>
          {/* To do: redirect to the initial page and clear user data from global state */}
          <li className={router.pathname == '/admin/logout' ? style.active : null}>
            <Link href=''><img src='/images/logoutIcon.svg' />
            Log out
            </Link>
          </li>
        </ul>
      </nav>

    </section>
  )
}

export default Sidebar