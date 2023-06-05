import React, { useContext, useState, useEffect, useMemo } from 'react';
import style from './style.module.scss';
import Cookie from 'js-cookie';

const Navbar = () => {
  const [name, setName] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationNumber = useMemo(() => {
    return notifications.length;
  }, [notifications]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.BACKEND_URL}/notifications/list`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookie.get('token'),
            'x-access-token-refresh': Cookie.get('refreshToken'),
          },
        });
  
        if (response.ok) {
          const data = await response.json();
          // Check if the notifications already exist in the array
          const existingNotificationIds = notifications.map((notification) => notification.id);
          const newNotifications = data.filter((notification) => !existingNotificationIds.includes(notification.id));
          setNotifications((prevNotifications) => [...prevNotifications, ...newNotifications]);
        } else {
          setNotifications([]);
        }
      } catch (err) {
        console.log(err);
      }
    };
  
    const intervalId = setInterval(fetchData, 5000);
  
    return () => {
      clearInterval(intervalId);
    };
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
                {notification.actionLink?.length > 0 && <a href={notification.actionLink} target='_blank' onClick={() => handleVisualizeNotification(notification.id)}>Mais detalhes</a>}
              </div>
            ))}
          </div>
        )}
    </nav>
  );
};

export default Navbar;
