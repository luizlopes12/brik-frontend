import React from 'react'
import style from './style.module.scss'
import HeadingText from '../../../components/HeadingText'
import nextCookies from "next-cookies";

export async function getServerSideProps(context) {
  const cookies = nextCookies(context);
  const { token, refreshToken } = cookies?cookies:{};
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
const Banners = () => {
  return (
    <div className={style.bannersContainer}>
    <div className={style.heading}>
          <HeadingText>Banners</HeadingText>
    </div>
    </div>
  )
}

export default Banners