import React,{useContext} from 'react'
import style from './style.module.scss'
import {userContext} from '../../context/userContext'
import Cookie from "js-cookie";
import nextCookies from "next-cookies";

export async function getServerSideProps(context) {
  const cookies = nextCookies(context);
  const { token, refreshToken } = cookies;
  if (!token && !refreshToken) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  return {
    props: {
      token,
      refreshToken
    },
  };
}
const Navbar = () => {
  const nameOnCookie = Cookie.get('name');
  const name = decodeURIComponent(nameOnCookie)?.split(' ')[0] || '';
  Date.prototype.toShortFormat = function () {
    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril",
      "Maio", "Junho", "Julho", "Agosto",
      "Setembro", "Outubro", "Novembro", "Dezembro"];
    const day = this.getDate();
    const monthIndex = this.getMonth();
    const monthName = monthNames[monthIndex];
    return `${day} de ${monthName}`;
  }
  const actualDate = new Date().toShortFormat()
  return (
    <nav className={style.notificationBar}>
      <div className={style.userData}>
        <img src="/images/labels/profile.png" alt="Imagem de perfil" />
        <span>Olá, { name ? name : ''}</span>
      </div>
      <div className={style.date}>
        <span>{actualDate}</span>
      </div>
      <div className={style.notifications}>
        <img src="/images/notificationIcon.svg" alt="Icone de notificações" />
      </div>
    </nav>
  )
}

export default Navbar