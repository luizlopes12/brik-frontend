import UserNavBar from "../components/UserNavBar"
import BannerSlider from "../components/BannerSlider"
import LotsListing from "../components/LotsListing"
import LotsViewedList from "../components/LotsViewedList"
import ContactForm from "../components/ContactForm"
import Footer from "../components/Footer"
import { bannerPreviewContext } from "../context/bannerPreviewContext"
import { useContext, useEffect } from "react";

export async function getServerSideProps() {
  const bannerImagesData = await fetch(`${process.env.BACKEND_URL}/banners/list`)
  .then((res) => res.json())
  .then((data) => {
    return data;
  });
  const lotsData = await fetch(`${process.env.BACKEND_URL}/lots/list`)
  .then((res) => res.json())
  .then((data) => {
    return data;
  });

  const viewedLots = lotsData.filter((lot) => lot.userViews > 0);
  return {
    props: {
      bannerImagesData,
      lotsData,
      viewedLots,
    },
  };
}
export default function Home({bannerImagesData, lotsData, viewedLots}) {
  const {bannerPreview} = useContext(bannerPreviewContext);
  
  return (
    <>
      <UserNavBar 
       imageSrc={'/images/brandLogo.svg'} 
       treeIcon={'/images/treeIcon.svg'}
       homeIcon={'/images/homeIcon.svg'}
       userImage={'/images/labels/profile.png'}
       bannerPreview={bannerPreview}
       />
       <BannerSlider 
       imagesData={bannerImagesData} 
       isOnHome
       />
       <LotsListing 
       lotsData={lotsData} 
       arrowIcon={'/images/homeArrowIcon.svg'} 
       homeFilterIcon={'/images/homeFilterIcon.svg'} 
       />
       <LotsViewedList
       arrowIcon={'/images/homeArrowIcon.svg'} 
       lotsData={viewedLots}
       />
       <ContactForm 
       arrowIcon={'/images/arrowDownIcon.svg'} 
       />
       <Footer
       brandLogo={'/images/brandLogoWhite.png'} 
       instagramIcon={'/images/instagramIcon.svg'}
       linkedinIcon={'/images/linkedinIcon.svg'}
       facebookIcon={'/images/facebookIcon.svg'}
       twitterIcon={'/images/twitterIcon.svg'}
       />
    </>
  )
}
