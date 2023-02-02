import React,{ useEffect,useState, useContext, useRef, useMemo } from 'react'
import style from './style.module.scss'
import {popUpsContext} from '../../context/popUpsContext'
import SearchInput from '../SearchInput'
import { globalDivisionsDataContext } from '../../context/globalDivisionsDataContext'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { storage } from '../../configs/firebase'


const LotRegisterPopUp = () => {
  const { popUps, setPopUps } = useContext(popUpsContext)
  const { globalDivisionsData, setGlobalDivisionsDataContext } = useContext(globalDivisionsDataContext)
  const [ showDivisionOptions, setShowDivisionOptions ] = useState(false)
  const [ lotImages, setLotImages ] = useState([
    '/images/labels/without-image.png',
  ])
  const [lotData, setLotData] = useState({
    title: '',
    description: '',
  })
  const [ divisionSearch, setDivisionSearch ] = useState('')
  const [lotDivision, setLotDivision] = useState({
    name: 'Selecione um Loteamento',
    logoUrl: 'https://i.imgur.com/YQOzMWA.png',
    id: 0,
  })

  const uploadImageFormRef = useRef()
  const imagesCarouselRef = useRef()
  const globalDivisionsDataFiltered = useMemo(() => {
    return globalDivisionsData.filter(division => divisionSearch.length > 0 ? division.name.toLowerCase().includes(divisionSearch.toLowerCase()): division)
  },[divisionSearch, globalDivisionsData])
  const handleExitPopUp = () => {
    setPopUps(popUps.lotRegister = false) 
    setShowDivisionOptions(false)
    setLotImages([
      '/images/labels/without-image.png',
    ])
  }
  const handleUploadImage = (e) => {
    let image = e.target?.files[0]
    console.log(image)
    // reiceves reader.result and this need to be uploaded and updated on backend
    if(!image){
      console.log('aaa')
    }else{
      const currentDate = new Date().getTime();
      const storageRef = ref(storage, `files/lotes/${currentDate}_${image.name}`)
      const uploadTask = uploadBytesResumable(storageRef, image)
      uploadTask.on(
        "state_changed",
        (snapshot) => {
        },
        (error) => {
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setLotImages(prev => {
              console.log(prev.length)
              imagesCarouselRef.current.scrollLeft += imagesCarouselRef.current.offsetWidth
              return [...prev, downloadURL]
            })
            setLotImages(prev => prev.filter(element => element !== '/images/labels/without-image.png'))
          });
        }
      );
    }
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
  const handleSelectDivisionToLot = (selectedDivision) => {
    setLotDivision({
      name: selectedDivision.name,
      logoUrl: selectedDivision.logoUrl,
      id: selectedDivision.id,
    })
    console.log(selectedDivision)
    setShowDivisionOptions(false)
  }
  useEffect(() =>{
    console.log(lotData)
  },[lotData])
  const handleShowDivisionOptions = () => {
    setShowDivisionOptions(!showDivisionOptions)
    console.log(globalDivisionsData)
  }
  const handleSearchDivision = (e) => {
    setDivisionSearch(e.target.value)
  }
  return (
    <div className={ popUps.lotRegister ? style.popUpBackdrop : style.popUpDisabled }>
      <div className={style.popUpWrapper}>
        <button className={style.closeBtn} onClick={handleExitPopUp} name='lotRegister'><img src="/images/closeIcon.svg" alt="Sair" /></button>
        <div className={style.lotInfoWrapper}>
          <div className={style.lotImagesWrapper}>
            <div className={style.lotImages}>
              <div className={style.lotImagesCarrousel} ref={imagesCarouselRef}>
                {lotImages.map((image, index) => (
                  <img src={image}/>
                ))}
                {lotImages.length > 1 && (
                    <ul className={style.carrouselControllers}>
                    <li className={style.controlPrev} onClick={() => imageSlide('prev')}><img src='/images/prevIcon.svg'/></li>
                    <li className={style.controlNext} onClick={() => imageSlide('next')}><img src='/images/nextIcon.svg'/></li>
                    </ul>
                )}

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
              <div className={style.divisionSelected}  onClick={handleShowDivisionOptions}>
              <img src={lotDivision.logoUrl}/>
                  <span>{lotDivision.name}</span>
              </div>
                  { showDivisionOptions && (
                  <ul className={style.divisionOptionsSelector}>
                    <SearchInput placeholder='Pesquisar' className={style.divisionSearchInput} value={divisionSearch} onChange={handleSearchDivision} />
                    { globalDivisionsDataFiltered.map((division) => (
                    <li className={style.divisionOption} onClick={() => handleSelectDivisionToLot(division)}> 
                    <img src={division.logoUrl}/>
                    <span>{division.name.length > 18? division.name.substring(18,'...') :division.name}</span>
                    </li>
                    )) }

                  </ul>
                  )}
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