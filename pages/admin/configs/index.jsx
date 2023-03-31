import React from 'react'
import style from './style.module.scss'
import HeadingText from '../../../components/HeadingText'
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
      refreshToken,
    },
  };
}


const Configs = () => {
  return (
    <div className={style.configsContainer}>
    <div className={style.heading}>
          <HeadingText>Configurações</HeadingText>
    </div>
    </div>
  )
}

export default Configs