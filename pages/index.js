import UserNavBar from "../components/UserNavBar"
import BannerSlider from "../components/BannerSlider"

export async function getServerSideProps() {
  const bannerImagesData = await fetch(`${process.env.BACKEND_URL}/banners/list`)
  .then((res) => res.json())
  .then((data) => {
    return data;
  });
  return {
    props: {
      bannerImagesData,
    },
  };
}
export default function Home({bannerImagesData}) {
  return (
    <>
       <UserNavBar imageSrc={'/images/brandLogo.svg'} 
       treeIcon={'/images/treeIcon.svg'}
       homeIcon={'/images/homeIcon.svg'}
       userImage={'/images/labels/profile.png'}
       />
       <BannerSlider imagesData={bannerImagesData} isOnHome/>
    </>
  )
}
