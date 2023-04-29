import React,{ useState, useEffect } from 'react'
import style from './style.module.scss'
import HeadingText from '../../../components/HeadingText'
import nextCookies from "next-cookies";
import BannerSlider from '../../../components/BannerSlider';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BannersEditSlider from '../../../components/BannersEditSlider';
import { bannerPreviewContext } from "../../../context/bannerPreviewContext"
import { useContext } from "react";
import { useRouter } from 'next/router';




export async function getServerSideProps(context) {
  const banners = await fetch(`${process.env.BACKEND_URL}/banners/list`)
  .then((res) => res.json())
  .then((data) => {
    return data;
  });
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
      banners,
    },
  };
}
const Banners = ({banners}) => {
  const router = useRouter();
  const {setBannerPreview} = useContext(bannerPreviewContext);
  setBannerPreview(false)

  const handleShowHomePage = () => {
    setBannerPreview(true)
    router.push('/')
  }

  const [bannerImages, setBannerImages] = useState(banners);
  return (
    <div className={style.bannersContainer}>
    <div className={style.heading}>
          <HeadingText>Web <span>Banner</span></HeadingText>
          <div className={style.subheading}>
            <span>
            Adicione um banner na dimensão sugerida
            </span>
            <button className={style.visualizeBanners} onClick={handleShowHomePage}>Simulação na página<img src='/images/layoutIcon.svg' /></button>
          </div>
          </div>
          <BannerSlider imagesData={bannerImages}/>
          <div className={style.bannersEdit}>
            <BannersEditSlider imagesData={bannerImages}/>
          </div>  
    </div>
  )
}

export default Banners