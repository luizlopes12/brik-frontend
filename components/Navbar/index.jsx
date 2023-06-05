import React, { useContext, useState, useEffect, useMemo } from 'react';
import style from './style.module.scss';
import Cookie from 'js-cookie';
import nextCookies from 'next-cookies';
import io from 'socket.io-client';

const Navbar = () => {
  const [name, setName] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationNumber = useMemo(() => {
    return notifications.length;
  }, [notifications]);

  useEffect(() => {
    const socket = io(process.env.BACKEND_SOCKET_URL);
    socket.on("notification", (data) => { 
      console.log(data);
      setNotifications(prev => [data, ...prev]);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    fetch(`${process.env.BACKEND_URL}/notifications/list`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': Cookie.get('token'),
        'x-access-token-refresh': Cookie.get('refreshToken'),
      },
    })
      .then(res =>{
       if(res.ok) {
        return res.json()
       } else {
        return []
        }
      })
      .then(data => {
        console.log(data);
        setNotifications(data);
      })
      .catch(err => console.log(err));
  }, []);

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
  const handleToggleNotifications = () => {
    setShowNotifications(prev => !prev);
    console.log('Notificações');
  };

  const handleVisualizeNotification = (id) => {
    fetch(`${process.env.BACKEND_URL}/notifications/${id}/visualize`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setNotifications(prev => prev.map(notification => {
          if(notification.id === id) {
            notification.opened = true;
          }
          return notification;
        }));
      })
      .catch(err => console.log(err));
  };




  return (
    <nav className={style.notificationBar}>
      <div className={style.userData}>
        <img src="/images/labels/profile.png" alt="Imagem de perfil" />
        <span>Olá, {name}</span>
      </div>
      <div className={style.date}>
        <span>{actualDate}</span>
      </div>
      <div className={style.notifications} onClick={handleToggleNotifications}>
        <img src="/images/notificationIcon.svg" alt="Icone de notificações" />
        {
          (notificationNumber > 0 && notificationNumber < 100) ? (
            <span className={style.notificationNumber}>{notificationNumber}</span>
          ): (
              notificationNumber > 99 && (
                <span className={style.notificationNumber}>99+</span>
              )
          )
        }
      </div>
      {showNotifications &&(
          <div className={style.notificationsList}>
            {notifications.map((notification, index) => (
              <div key={index} className={style.notification}>
                <h5>{notification.title} { notification.opened && <span>visualizado</span> }</h5>
                <p>{notification.description}</p>
                {notification.actionLink?.length > 0 && <a href={notification.actionLink} onClick={() => handleVisualizeNotification(notification.id)}>Mais detalhes</a>}
              </div>
            ))}
          </div>
        )}
    </nav>
  );
};

export default Navbar;
