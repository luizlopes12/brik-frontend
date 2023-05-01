import React, { useEffect, useState }  from 'react'
import style from './style.module.scss'
import UserNavBar from '../../components/UserNavBar'
import LotsViewedList from '../../components/LotsCarousel'
import ImagesSliderPopUp from '../../components/ImagesSliderPopUp'
import LotPageInfo from '../../components/LotPageInfo'



export async function getStaticPaths() {
  const res = await fetch(`${process.env.BACKEND_URL}/lots/list`);
  const data = await res.json();
  const paths = data.map(lot => ({ params: { id: lot.id.toString() } }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const res = await fetch(`${process.env.BACKEND_URL}/lots/${params.id}`);
  const data = await res.json();
  const defaultImage = '/images/labels/defaultImage.png';
  if(data[0].loteImages.length < 4) {
    for(let i = data[0].loteImages.length; i < 4; i++) {
      data[0].loteImages.push({ imageUrl: defaultImage });
    }
  }
  return { props: { lotData: data[0] } };
}




const LoteDetailsPage = ({lotData}) => {
  const lotId = lotData?.id;
  const [viewedLots, setViewedLots] = useState([]);
  const [viewMoreImages, setViewMoreImages] = useState(false);

  const handleShowMoreImages = () => {
    setViewMoreImages(!viewMoreImages);
  }

  useEffect(() => {
    const getViewedLots = async () => {
      const lotsData = await fetch(`${process.env.BACKEND_URL}/lots/list`)
      .then((res) => res.json())
      .then((data) => {
        return data;
      });
      setViewedLots(lotsData.filter((lot) => lot.userViews > 0))
    }
    const updateLotViews = async () => {
      await fetch(`${process.env.BACKEND_URL}/lots/edit/${lotId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userViews: lotData.userViews + 1 }),
      });
    }

    if (lotId) {
      updateLotViews();
    }
    getViewedLots();
  }, [lotData]);

  if (!lotData) {
    return (
      <div className={style.loading}>
        <div className={style.loadingAnimation}></div>
        <div className={style.imageWrapper}>
          <img src="/images/brandLogo.svg" alt="loading" />
        </div>
      </div>
    );
  }

  return(
    <section className={style.detailsContainer}>
      <UserNavBar 
        imageSrc={'/images/brandLogo.svg'}
        treeIcon={'/images/treeIcon.svg'}
        homeIcon={'/images/homeIcon.svg'}
        userImage={'/images/labels/profile.png'}
        navLocation={'details'}
      />
      <div className={style.lotDetails}>
        <div className={style.lotImages} onClick={handleShowMoreImages}>
          <div className={style.lotImagesWrapper}>
            {lotData.loteImages?.slice(0,4).map((image, index) => (
              <img key={index} src={image.imageUrl || defaultImage} alt={`Imagem ${index + 1}`} />
            ))}
          </div>
          <button className={style.viewMoreImagesButton} onClick={handleShowMoreImages}>
            <img src="/images/gridIcon.svg" alt="Ver mais imagens" />
            Mostrar todas as fotos
          </button>
        </div>
      </div>
      {viewMoreImages && (
        <>
        <button className={style.closeButton} onClick={handleShowMoreImages}> <img src='/images/closeIcon.svg'/></button>
        <ImagesSliderPopUp images={lotData.loteImages} closeFunction={handleShowMoreImages} arrowIcon={'/images/arrowDownIcon.svg'}/>
        </>
      )}
      <LotPageInfo lotData={lotData} />
      <LotsViewedList
       arrowIcon={'/images/homeArrowIcon.svg'} 
       lotsData={viewedLots}
       title={'Imóveis populares'}
       type={'lotDetails'}
       defaultImage={'/images/labels/defaultImage.png'}
       />
    </section>
  );
};



export default LoteDetailsPage;
