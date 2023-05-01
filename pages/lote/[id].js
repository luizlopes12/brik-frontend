import React, { useEffect }  from 'react'
import style from './style.module.scss'
import UserNavBar from '../../components/UserNavBar'
import LotsViewedList from '../../components/LotsCarousel'


export async function getStaticPaths() {
  const res = await fetch(`${process.env.BACKEND_URL}/lots/list`);
  const data = await res.json();
  const paths = data.map(lot => ({ params: { id: lot.id.toString() } }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const res = await fetch(`${process.env.BACKEND_URL}/lots/${params.id}`);
  const data = await res.json();
  return { props: { lotData: data[0] } };
}



const LoteDetailsPage = ({lotData}) => {
  const lotId = lotData?.id;
  const [viewedLots, setViewedLots] = React.useState([]);

  console.log(lotData);

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
    <>
      <UserNavBar 
        imageSrc={'/images/brandLogo.svg'} 
        treeIcon={'/images/treeIcon.svg'}
        homeIcon={'/images/homeIcon.svg'}
        userImage={'/images/labels/profile.png'}
      />
      <div className={style.lotDetails}>
        <div className={style.lotImages}>
          <div className={style.lotImagesWrapper}>
            {lotData.loteImages?.slice(0,4).map((image, index) => (
              <img key={index} src={image.imageUrl} alt={`Imagem ${index + 1}`} />
            ))}
          </div>
          <button className={style.viewMoreImagesButton}>
            <img src="/images/gridIcon.svg" alt="Ver mais imagens" />
            Mostrar todas as fotos
          </button>
        </div>
      </div>
      <LotsViewedList
       arrowIcon={'/images/homeArrowIcon.svg'} 
       lotsData={viewedLots}
       title={'Imóveis populares'}
       type={'lotDetails'}
       />
    </>
  );
};



export default LoteDetailsPage;
