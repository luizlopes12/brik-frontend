import React,{ useRef } from 'react'
import style from './style.module.scss'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Cookie from 'js-cookie'
/* SVG icons on code to can edit color with css */

const OverviewIconSvg = () => (
  <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M10 3.5H3V10.5H10V3.5Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  <path d="M21 3.5H14V10.5H21V3.5Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  <path d="M21 14.5H14V21.5H21V14.5Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  <path d="M10 14.5H3V21.5H10V14.5Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
)
const LoteamentosIconSvg = () => (
<svg width="24" height="29" viewBox="0 0 24 29" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6 9.83334L2 11.8333L12 16.8333L22 11.8333L18 9.83334" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M2 21.8333L12 26.8333L22 21.8333" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M2 16.8333L12 21.8333L22 16.8333" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M16 7.5736C16 10.4827 12 12.9762 12 12.9762C12 12.9762 8 10.4827 8 7.5736C8 6.58162 8.42143 5.63028 9.17157 4.92884C9.92172 4.22741 10.9391 3.83334 12 3.83334C13.0609 3.83334 14.0783 4.22741 14.8284 4.92884C15.5786 5.63028 16 6.58162 16 7.5736Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M12 8.82036C12.7364 8.82036 13.3333 8.26217 13.3333 7.5736C13.3333 6.88504 12.7364 6.32685 12 6.32685C11.2636 6.32685 10.6667 6.88504 10.6667 7.5736C10.6667 8.26217 11.2636 8.82036 12 8.82036Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
)
const VendasIconSvg = () => (
<svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clipPath="url(#clip0_181_293)">
<path d="M12 1.16667V23.1667" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M17 5.16667H9.5C8.57174 5.16667 7.6815 5.53542 7.02513 6.1918C6.36875 6.84818 6 7.73841 6 8.66667C6 9.59493 6.36875 10.4852 7.02513 11.1415C7.6815 11.7979 8.57174 12.1667 9.5 12.1667H14.5C15.4283 12.1667 16.3185 12.5354 16.9749 13.1918C17.6313 13.8482 18 14.7384 18 15.6667C18 16.5949 17.6313 17.4852 16.9749 18.1415C16.3185 18.7979 15.4283 19.1667 14.5 19.1667H6" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
</g>
<defs>
<clipPath id="clip0_181_293">
<rect width="24" height="24" fill="white" transform="translate(0 0.166672)"/>
</clipPath>
</defs>
</svg>
)
const BannersIconSvg = () => (
<svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5 17.5H4C3.46957 17.5 2.96086 17.2893 2.58579 16.9142C2.21071 16.5391 2 16.0304 2 15.5V5.5C2 4.96957 2.21071 4.46086 2.58579 4.08579C2.96086 3.71071 3.46957 3.5 4 3.5H20C20.5304 3.5 21.0391 3.71071 21.4142 4.08579C21.7893 4.46086 22 4.96957 22 5.5V15.5C22 16.0304 21.7893 16.5391 21.4142 16.9142C21.0391 17.2893 20.5304 17.5 20 17.5H19" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M12 15.5L17 21.5H7L12 15.5Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
)
const ConfigIconSvg = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g clipPath="url(#clip0_181_233)">
  <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="#060E28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15V15Z" stroke="#060E28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </g>
  <defs>
  <clipPath id="clip0_181_233">
  <rect width="24" height="24" fill="white"/>
  </clipPath>
  </defs>
  </svg>
)
const LogoutIconSvg = () => (
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="#060E28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M16 17L21 12L16 7" stroke="#060E28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M21 12H9" stroke="#060E28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
)

const Sidebar = () => {
  const router = useRouter()
  const navContainerRef = useRef()
  const handleShowMenu = () => {
    navContainerRef.current.classList.toggle(style.active)
  }
  const handleUserLogout = () => {
    Cookie.remove("token");
    Cookie.remove("refreshToken");
    router.push('/')
  }
  return (
    <section className={style.navContainer} ref={navContainerRef}>
      <div className={style.hamburguerMenu} onClick={handleShowMenu}>
        <div className={style.line1}></div>
        <div className={style.line2}></div>
        <div className={style.line3}></div>
      </div>
      <div className={style.brandLogoWrapper}>
        <Link href='/'>
          <img src='/images/brandLogo.svg' className={style.brandLogo} />
          </Link>
      </div>
      <nav className={style.nav}>
        <ul>
          <li className={router.pathname == '/admin' ? style.active : null}>
            <Link href='/admin'>
            <OverviewIconSvg/>
            <span className={style.navText}>
            Overview
            </span>
            </Link>
          </li>
          <li className={router.pathname == '/admin/loteamentos' ? style.active : null}>
            <Link href='/admin/loteamentos'>
            <LoteamentosIconSvg/>
            <span className={style.navText}>
            Loteamentos
            </span>
            </Link>
          </li>
          <li className={router.pathname == '/admin/vendas' ? style.active : null}>
            <Link href='/admin/vendas'>
            <VendasIconSvg/>
            <span className={style.navText}>
            Vendas
            </span>
            </Link>
          </li>
          <li className={router.pathname == '/admin/banners' ? style.active : null}>
              <Link href='/admin/banners'>
              <BannersIconSvg/>
              <span className={style.navText}>
              Banners
              </span>
              </Link>
          </li>
        </ul>
        <ul>
          <li className={router.pathname == '/admin/configs' ? style.active : null}>
            <Link href='/admin/configs'>
            <ConfigIconSvg/>
            <span className={style.navText}>
              Configurações
            </span>
            </Link>
          </li>
          {/* To do: redirect to the initial page and clear user data from global state */}
          <li className={router.pathname == '/admin/logout' ? style.active : null}>
            <Link href='' onClick={handleUserLogout}>
            <LogoutIconSvg/>
            Log out
            </Link>
          </li>
        </ul>
      </nav>

    </section>
  )
}

export default Sidebar