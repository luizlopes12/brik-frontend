import React, { useEffect, useState }  from 'react'
import style from './style.module.scss'
import UserNavBar from '../../components/UserNavBar'
import LotsViewedList from '../../components/LotsCarousel'
import ImagesSliderPopUp from '../../components/ImagesSliderPopUp'
import LotPageInfo from '../../components/LotPageInfo'
import LotLocation from '../../components/LotLocation'


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

  let data2 = await fetch(`${process.env.BACKEND_URL}/divisions/list`)
  let divisionData  = await data2.json()
  divisionData = divisionData.map((division) => division.lotes.find((lote) => lote.id === data[0].id) ? division : null).filter((division) => division !== null)[0]
  

  return { props: { lotData: data[0], divisionData, defaultImage } };
}

const LoteDetailsPage = ({lotData, defaultImage, divisionData}) => {
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

  const viewedLotsFiltered = viewedLots.filter((lot) => lot.id !== lotId); 

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
      <LotPageInfo 
      calendarIcon={'/images/calendarIconGreen.svg'}  
      clockIcon={'/images/clockIconGreen.svg'}  
      lotData={lotData}  
      divisionData={divisionData} 
      mapIcon={'/images/locationIcon.svg'} 
      metricsIcon={'/images/metricsIcon.svg'}
      />
      <LotLocation  address={lotData.location} />
      <LotsViewedList
       arrowIcon={'/images/homeArrowIcon.svg'} 
       lotsData={viewedLotsFiltered}
       title={'Imóveis populares'}
       type={'lotDetails'}
       defaultImage={'/images/labels/defaultImage.png'}
       />
    </section>
  );
};



export default LoteDetailsPage;
