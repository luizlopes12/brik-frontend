import React,{ useEffect,useState, useContext, useRef } from 'react'
import style from './style.module.scss'
import {popUpsContext} from '../../context/popUpsContext'

const LotRegisterPopUp = () => {
  const { popUps, setPopUps } = useContext(popUpsContext)
  const [lotData, setLotData] = useState({
    title: '',
    description: '',
  })
  const uploadImageFormRef = useRef()
  const imagesCarouselRef = useRef()
  const handleExitPopUp = () => {
    setPopUps(popUps.lotRegister = false) 
  }
  const handleUploadImage = (e) => {
    let image = e.target?.files[0]
    console.log(image)
    uploadImageFormRef.current.reset()
  }
  const imageSlide = (direction) => {
    if(direction === 'next'){
      imagesCarouselRef.current.scrollLeft += imagesCarouselRef.current.offsetWidth
    }
    if(direction === 'prev'){
      imagesCarouselRef.current.scrollLeft -= imagesCarouselRef.current.offsetWidth
    }
  }
  const handleLotData = (e) =>{
    setLotData(prev => ({...prev, [e.target.name]: e.target.value}))
  }
  useEffect(() =>{
    console.log(lotData)
  },[lotData])
  return (
    <div className={ popUps.lotRegister ? style.popUpBackdrop : style.popUpDisabled }>
      <div className={style.popUpWrapper}>
        <button className={style.closeBtn} onClick={handleExitPopUp} name='lotRegister'><img src="/images/closeIcon.svg" alt="Sair" /></button>
        <div className={style.lotInfoWrapper}>
          <div className={style.lotImagesWrapper}>
            <div className={style.lotImages}>
              <div className={style.lotImagesCarrousel} ref={imagesCarouselRef}>
                <img src='/images/labels/without-image.png'/>
                <img src='https://i.imgur.com/8CiJy7t.png'/>
                <ul className={style.carrouselControllers}>
                  <li className={style.controlPrev} onClick={() => imageSlide('prev')}><img src='/images/prevIcon.svg'/></li>
                  <li className={style.controlNext} onClick={() => imageSlide('next')}><img src='/images/nextIcon.svg'/></li>
                  </ul>
              </div>
            </div>
            <div className={style.uploadImages}>
            <form ref={uploadImageFormRef}>
              <a className={style.uploadImage}><img src='/images/uploadIcon.svg'/>
                <input type="file" onChange={(e) => handleUploadImage(e)}/>
                Adicionar imagens
              </a>
              </form>
            </div>
          </div>
          <div className={style.lotTexts}>
            <div className={style.lotTitle}>
              <input placeholder='Nome do lote'  type="text" value={lotData.title} onChange={handleLotData} name='title'/>
            </div>
            <div className={style.lotDivision}>
               <img src="https://i.imgur.com/YQOzMWA.png"/>
               <span>Loteamento</span>
            </div>
            <div className={style.lotDescription}>
              <textarea placeholder='Descrição do loteamento' value={lotData.description} onChange={handleLotData} name='description'/> 
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LotRegisterPopUp