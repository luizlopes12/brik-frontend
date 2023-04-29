import UserNavBar from "../components/UserNavBar"
import BannerSlider from "../components/BannerSlider"
import LotsListing from "../components/LotsListing"

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
  return {
    props: {
      bannerImagesData,
      lotsData
    },
  };
}
export default function Home({bannerImagesData, lotsData}) {
  return (
    <>
      <UserNavBar imageSrc={'/images/brandLogo.svg'} 
       treeIcon={'/images/treeIcon.svg'}
       homeIcon={'/images/homeIcon.svg'}
       userImage={'/images/labels/profile.png'}
       />
       <BannerSlider imagesData={bannerImagesData} isOnHome/>
       <LotsListing 
       lotsData={lotsData} 
       arrowIcon={'/images/homeArrowIcon.svg'} 
       homeFilterIcon={'/images/homeFilterIcon.svg'} />
    </>
  )
}
