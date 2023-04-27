import React, { useContext, useState, useEffect } from 'react';
import style from './style.module.scss';
import Cookie from 'js-cookie';
import nextCookies from 'next-cookies';

const Navbar = () => {
  const [name, setName] = useState('');

  useEffect(() => {
    const nameOnCookie = Cookie.get('name');
    const decodedName = decodeURIComponent(nameOnCookie)?.split(' ')[0] || '';
    setName(decodedName);
  }, [Cookie.get('name')]);

  Date.prototype.toShortFormat = function () {
    const monthNames = [
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro',
    ];
    const day = this.getDate();
    const monthIndex = this.getMonth();
    const monthName = monthNames[monthIndex];
    return `${day} de ${monthName}`;
  };

  const actualDate = new Date().toShortFormat();

  return (
    <nav className={style.notificationBar}>
      <div className={style.userData}>
        <img src="/images/labels/profile.png" alt="Imagem de perfil" />
        <span>Olá, {name}</span>
      </div>
      <div className={style.date}>
        <span>{actualDate}</span>
      </div>
      <div className={style.notifications}>
        <img src="/images/notificationIcon.svg" alt="Icone de notificações" />
      </div>
    </nav>
  );
};

export default Navbar;
