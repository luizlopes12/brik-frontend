import React,{useContext} from 'react'
import style from './style.module.scss'
import userContext from '../../context/userContext'

const Navbar = () => {
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
  const { userData } = useContext(userContext)
  return (
    <nav className={style.notificationBar}>
      <div className={style.userData}>
        <img src="/images/labels/profile.png" alt="Imagem de perfil" />
        <span>Olá, {userData.userName}</span>
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