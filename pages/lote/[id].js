import React, { useEffect, useState }  from 'react'
import { useRouter } from 'next/router'
import style from './style.module.scss'
import UserNavBar from '../../components/UserNavBar'

const LoteDetailsPage = ({}) => {
  const router = useRouter();
  const lotId = router.query.id;
  const [lotData, setLotData] = useState(null);

  useEffect(() => {

    const fetchLotData = async () => {
      const data = await fetch(`${process.env.BACKEND_URL}/lots/${lotId}`)
        .then((res) => res.json())
        .then((data) => {
          const content = data[0];
          if(content){
            if(!content.lotImages){
              content.lotImages = [{imageUrl: 'https://i.imgur.com/Nmdccpi.png'},              {imageUrl: 'https://i.imgur.com/Nmdccpi.png'},              {imageUrl: 'https://i.imgur.com/Nmdccpi.png'},              {imageUrl: 'https://i.imgur.com/Nmdccpi.png'},              ];
            }
          }
          return content;
        });
          
      setLotData(data);
      updateLotViews(data);
    };

    const updateLotViews = async (lotDataToUpdate) => {
      await fetch(`${process.env.BACKEND_URL}/lots/edit/${lotId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({userViews: lotDataToUpdate.userViews += 1}),
      })
    };
      
    fetchLotData();
  }, []);


    if (!lotData){
        return (
            <div className={style.loading}>
                <div className={style.loadingAnimation}>
                    
        
                </div>
                <div className={style.imageWrapper}>
                        <img src="/images/brandLogo.svg" alt="loading" />
                    </div>
            </div>
            );
    }


  return(
    <>
          <UserNavBar imageSrc={'/images/brandLogo.svg'} 
       treeIcon={'/images/treeIcon.svg'}
       homeIcon={'/images/homeIcon.svg'}
       userImage={'/images/labels/profile.png'}
       />
           <div className={style.lotDetails}>
        <div className={style.lotImages}>
            <div className={style.lotImagesWrapper}>
                {
                lotData.lotImages?.slice(0,4).map((image) => (
                    <>
                    <img src={image.imageUrl} alt="Imagem do lote" />
                    </>
                ))}

            </div>
            <button className={style.viewMoreImagesButton}>
                <img src="/images/gridIcon.svg" alt="Ver mais imagens" />
                Mostrar todas as fotos
            </button>
        </div>
    </div>
    </>

  );
};

export default LoteDetailsPage
