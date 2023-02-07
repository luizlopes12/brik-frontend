import React, { useEffect, useState, useContext, useRef, useMemo } from 'react'
import style from './style.module.scss'
import { popUpsContext } from '../../context/popUpsContext'
import SearchInput from '../SearchInput'
import { globalDivisionsDataContext } from '../../context/globalDivisionsDataContext'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { storage } from '../../configs/firebase'
import formatCurrency from '../../helpers/formatCurrency'


const LotRegisterPopUp = () => {
  const { popUps, setPopUps } = useContext(popUpsContext)
  const { globalDivisionsData, setGlobalDivisionsDataContext } = useContext(globalDivisionsDataContext)
  const [showDivisionOptions, setShowDivisionOptions] = useState(false)
  const [showPartnersOptions , setShowPartnersOptions] = useState(false)
  const [editPartnerFromLot, setEditPartnerFromLot] = useState(false)
  const [ showNewPartnerInputs, setShowNewPartnerInputs ] = useState(false)
  const [ partnerSearchInput, setPartnerSearchInput ] = useState('')
  const partnersListRef = useRef()
  const [newPartner, setNewPartner] = useState({
    name: '',
    CPF: '',
    percentage: 0,
  })
  const [lotImages, setLotImages] = useState([
    '/images/labels/without-image.png',
  ])
  const [lotData, setLotData] = useState({
    title: '',
    description: '',
    location: '',
    metrics: 0,
    price: '',
    basePrice: '',
    hiddenPrice: false,
    parcelQuantity: 0,
    taxPercentage: 0,
    partners: [
    ],
  })
  const [divisionSearch, setDivisionSearch] = useState('')
  const [lotDivision, setLotDivision] = useState({
    name: 'Selecione um Loteamento',
    logoUrl: 'https://i.imgur.com/YQOzMWA.png',
    id: 0,
    partners: [],
  })
  const [selectValues, setSelectValues] = useState({
    availability: 'avaible',
  })

  const uploadImageFormRef = useRef()
  const imagesCarouselRef = useRef()
  const globalDivisionsDataFiltered = useMemo(() => {
    return globalDivisionsData.filter(division => divisionSearch.length > 0 ? division.name.toLowerCase().includes(divisionSearch.toLowerCase()) : division)
  }, [divisionSearch, globalDivisionsData])
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
    if (!image) {
      console.log('aaa')
    } else {
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
    if (direction === 'next') {
      imagesCarouselRef.current.scrollLeft += imagesCarouselRef.current.offsetWidth
    }
    if (direction === 'prev') {
      imagesCarouselRef.current.scrollLeft -= imagesCarouselRef.current.offsetWidth
    }
  }
  const handleLotData = (e) => {
    if (e.target.name === 'hiddenPrice') {
      setLotData(prev => ({ ...prev, hiddenPrice: !prev.hiddenPrice }))
    }
    else {
      setLotData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }
  }

  const handleSelectDivisionToLot = (selectedDivision) => {

    setLotDivision({
      name: selectedDivision.name,
      logoUrl: selectedDivision.logoUrl,
      id: selectedDivision.id,
      partners: selectedDivision.divisionPartners,
    })
    setLotData(prev => ({ ...prev, partners: [] }))
    setShowDivisionOptions(false)
  }
  useEffect(() => {
    console.log(lotData)
  }, [lotData])
  const handleShowDivisionOptions = () => {
    setShowDivisionOptions(!showDivisionOptions)
    console.log(globalDivisionsData)
  }
  const handleSearchDivision = (e) => {
    setDivisionSearch(e.target.value)
  }
  const handleAddParcel = () => {
    setLotData(prev => ({ ...prev, parcelQuantity: prev.parcelQuantity + 1 }))
  }
  const handleRemoveParcel = () => {
    setLotData(prev => ({ ...prev, parcelQuantity: prev.parcelQuantity > 0 && prev.parcelQuantity - 1 }))
  }
  const handleSelectFilters = (e) => {
    setSelectValues(previousState => ({ ...previousState, [e.target.name]: e.target.value }))
  }
  const Availabilities = [{ name: 'Disponível', value: 'avaible' }, { name: 'Indisponível', value: 'unavaible' }, { name: 'Reservado', value: 'reserved' }]

  const handleDeletePartnerFromLot = (partnerToDelete) => {
    setLotData(prev => ({...prev, partners: prev.partners.filter(partner => partner !== partnerToDelete)}))
    setEditPartnerFromLot(null)
  }
  const handlePartnerActions = (partnerSelectedData) => {
    setEditPartnerFromLot(partnerSelectedData)
  }
  
  const handlePartnerData = (e, selected) => {
    setLotData(prev => {
      let updatedPartners = [...prev.partners];
      let index = updatedPartners.indexOf(selected);
      if (index !== -1) {
        updatedPartners[index] = { ...selected, [e.target.name]: e.target.value };
      }
      return { ...prev, partners: updatedPartners };
    });
  }
  
  const handleAddPartner = (partnerData) => {
    if (!lotData.partners.includes(partnerData)) {
    setLotData(prev => ({ ...prev, partners: [...prev.partners, partnerData] }))
    }
  }
  const handleCreateNewPartner = () => {
    setShowNewPartnerInputs(prev => {
      if (prev & newPartner.name.length > 0 && newPartner.CPF.length > 0 && newPartner.percentage.length > 0) {
        setLotData(prev => ({ ...prev, partners: [...prev.partners, newPartner] }))
        setNewPartner({ name: '', CPF: '', percentage: '' })
      }
      return !prev
    }
      )
    
  }
  const handleShowPartnersOptions = () => {
    setShowPartnersOptions(prev => !prev)
  }
  const handleNewPartnerData = (e) => {
    setNewPartner(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }
  const handlePartnerSearch = (e) => {
    setPartnerSearchInput(e.target.value)
  }
  const lotDivisionFiltered = useMemo (() => {
    return (
      lotDivision.partners?.filter(partner => 
        partner.name.toLowerCase().includes(partnerSearchInput.toLowerCase())
      ).filter(partnerToNotDisplay => lotData.partners.every(partner => partnerToNotDisplay !== partner))
    )
  }, [lotDivision, showDivisionOptions, partnerSearchInput,lotData.partners])

  useEffect(() => {
    console.log(lotData.partners)
  }, [lotData])
  return (
    <div className={popUps.lotRegister ? style.popUpBackdrop : style.popUpDisabled}>
      <div className={style.popUpWrapper}>
        <button className={style.closeBtn} onClick={handleExitPopUp} name='lotRegister'><img src="/images/closeIcon.svg" alt="Sair" /></button>
        <div className={style.lotInfoWrapper}>
          <div className={style.lotImagesWrapper}>
            <div className={style.lotImages}>
              <div className={style.lotImagesCarrousel} ref={imagesCarouselRef}>
                {lotImages.map((image, index) => (
                  <img src={image} />
                ))}
                {lotImages.length > 1 && (
                  <ul className={style.carrouselControllers}>
                    <li className={style.controlPrev} onClick={() => imageSlide('prev')}><img src='/images/prevIcon.svg' /></li>
                    <li className={style.controlNext} onClick={() => imageSlide('next')}><img src='/images/nextIcon.svg' /></li>
                  </ul>
                )}

              </div>
            </div>
            <div className={style.uploadImages}>
              <form ref={uploadImageFormRef}>
                <a className={style.uploadImage}><img src='/images/uploadIcon.svg' />
                  <input type="file" onChange={(e) => handleUploadImage(e)} />
                  Adicionar imagens
                </a>
              </form>
            </div>
          </div>
          <div className={style.lotTexts}>
            <div className={style.lotTitle}>
              <input placeholder='Nome do lote' type="text" value={lotData.title} onChange={handleLotData} name='title' />
            </div>
            <div className={style.lotDivision}>
              <div className={style.divisionSelected} onClick={handleShowDivisionOptions}>
                <img src={lotDivision.logoUrl} />
                <span>{lotDivision.name}</span>
              </div>
              {showDivisionOptions && (
                <ul className={style.divisionOptionsSelector}>
                  <SearchInput placeholder='Pesquisar' className={style.divisionSearchInput} value={divisionSearch} onChange={handleSearchDivision} />
                  {globalDivisionsDataFiltered.map((division) => (
                    <li className={style.divisionOption} onClick={() => handleSelectDivisionToLot(division)}>
                      <img src={division.logoUrl} />
                      <span>{division.name.length > 18 ? division.name.substring(18, '...') : division.name}</span>
                    </li>
                  ))}

                </ul>
              )}
            </div>

            <div className={style.lotDescription}>
              <textarea placeholder='Descrição do lote' value={lotData.description} onChange={handleLotData} name='description' />
            </div>
          </div>
        </div>
        <div className={style.lotDataWrapper}>
          <div className={style.lotDataInputs}>
            <div className={style.locationArea}>
              <h3>Endereço</h3>
              <div className={style.locationInputs}>
                <input type='text' placeholder='Av. Exemplo, Vila Romão, Registro - SP' name='location' value={lotData.location} onChange={handleLotData} />
              </div>
            </div>
            <div className={style.metricsArea}>
              <h3>Área</h3>
              <div className={style.metricsInputs}>
                <input type='number' placeholder='0' name='metrics' value={lotData.metrics} onChange={handleLotData} />
                <span>m<sup>2</sup></span>
              </div>
            </div>
            <div className={style.priceArea}>
              <div className={style.salePrice}>
                <h3>Preço de Venda</h3>
                {!lotData.hiddenPrice && (
                  <div className={style.priceInputs}>
                    <span>R$</span>
                    <input type='number' placeholder='0' min='0' name='price' value={lotData.price} onChange={handleLotData} />
                  </div>
                )}
              </div>
              <div className={style.basePrice}>
                <h3>Preço base</h3>
                {!lotData.hiddenPrice && (
                  <div className={style.basePriceInput}>
                    <span>R$</span>
                    <input type='number' placeholder='0' min='0' name='basePrice' value={lotData.basePrice} onChange={handleLotData} />
                  </div>
                )}
              </div>
              <div className={style.hiddenPrice}>
                <input type='checkbox' value={lotData.hiddenPrice} name='hiddenPrice' onChange={handleLotData} />
                <span>Preço sob consulta</span>
              </div>

            </div>
            <div className={style.parcelArea}>
              <div className={style.parcelQuantity}>
                <h3>Quantidade máxima de parcelas</h3>
                <div className={style.parcelQuantityInput}>
                  <button onClick={handleRemoveParcel}>-</button>
                  <input type='number' placeholder='0' min='0' name='price' value={lotData.parcelQuantity} onChange={handleLotData} />
                  <button onClick={handleAddParcel}>+</button>
                </div>
              </div>
              <div className={style.taxes}>
                <h3>Juros</h3>
                <div className={style.basePriceInput}>
                  <input type='number' placeholder='0' max='100' min='0' name='taxPercentage' value={lotData.taxPercentage} onChange={handleLotData} />
                  <span>%</span>
                </div>
              </div>
            </div>
            <div className={style.lotStatus}>
              <div>
                <h3>Status do lote</h3>
                <p className={style.statusInfo}>Esse lote está disponível para venda? </p>
              </div>
              <div className={style.lotStatusSelect}>
                <select onChange={handleSelectFilters} value={selectValues.availability} name='availability' className={style.dropdownMenu}>
                  {Availabilities.map((item, index) => (
                    <option key={index} value={item.value}>{item.name}</option>
                  ))}
                </select>
              </div>

            </div>
          </div>
          <div className={style.lotDataActions}>
            <div className={style.partnersArea}>
              <div className={style.lotDataActionsHeader}>
                <h3>Sócios</h3>
                {editPartnerFromLot != null && (
                  <div className={style.deletePartner} onClick={() => handleDeletePartnerFromLot(editPartnerFromLot)}>
                    <img src="/images/deleteIcon.svg" alt="delete" />
                  </div>
                )}

              </div>
              <div className={style.partners}>
                <ul ref={partnersListRef} className={style.partnersList}>
                  <li className={style.partnersListHeader}>
                    <span>Nome</span>
                    <span>CPF</span>
                    <span>%</span>
                  </li>
                  <div className={style.partnersListItemWrapper}>

                  {lotData.partners.map((partner, index) => (
                    <li className={partner == editPartnerFromLot && !showNewPartnerInputs ? style.partnersListItemEdit : style.partnersListItem} onClick={() => handlePartnerActions(partner)}>
                      <input 
                      value={partner.name} 
                      disabled={() => partner == editPartnerFromLot} 
                      type='text' 
                      className={style.partnerName} 
                      onChange={(e) => handlePartnerData(e, partner)}
                      name='name'
                      />
                      <input 
                      value={partner.CPF} 
                      disabled={() => partner == editPartnerFromLot} 
                      type='text' className={style.partnerCPF} 
                      onChange={(e) => handlePartnerData(e, partner)}
                      name='CPF'
                      />
                      <div>
                        <input 
                        value={partner.percentage} 
                        disabled={() => partner == editPartnerFromLot} 
                        min='0' max='100' type='number' 
                        className={style.partnerPercentage} 
                        onChange={(e) => handlePartnerData(e, partner)}
                        name='percentage'
                        />
                        <span>%</span>
                      </div>
                    </li>
                  ))}
                  { showNewPartnerInputs && (
                  <li className={ style.partnersListItemEdit}>
                  <input 
                  value={newPartner.name} 
                  type='text' 
                  className={style.partnerName} 
                  onChange={(e) => handleNewPartnerData(e)}
                  name='name'
                  />
                  <input 
                  value={newPartner.CPF}
                  type='text' className={style.partnerCPF} 
                  onChange={(e) => handleNewPartnerData(e)}
                  name='CPF'
                  />
                  <div>
                    <input 
                    value={newPartner.percentage} 
                    min='0' max='100' type='number' 
                    className={style.partnerPercentage} 
                    onChange={(e) => handleNewPartnerData(e)}
                    name='percentage'
                    />
                    <span>%</span>
                  </div>
                </li>
                  ) }
                  </div>

                </ul>
                
              </div>
              <div className={style.addPartner}>
                  {showNewPartnerInputs ? (
                  <button onClick={handleCreateNewPartner} className={style.addNewPartnerToLot}>
                    <img src="/images/confirmIcon.svg"/>
                    <span>Confirmar</span>
                  </button>
                  ):
                  (
                  <button onClick={handleCreateNewPartner} className={style.addNewPartnerToLot}>
                    <img src="/images/addIcon.svg"/>
                  </button>
                  )
                  }
                  <button onClick={() => handleShowPartnersOptions()} className={style.addPartnerToLot}>
                  
                  { showPartnersOptions ? (<><img src="/images/closeIcon.svg"/>Fechar</>): (<><img src="/images/partnersIcon.svg"/>Adicionar sócio</>)}
                  </button>
              </div>
              {showPartnersOptions && (
                <div className={style.partnersOptionsSelector}>
                  <div className={style.partnersOptionsSelectorHeader}>
                  <input type='text' onChange={handlePartnerSearch} value={partnerSearchInput} />
                  <img src='/images/searchIcon.svg'/>
                  </div>
                  <ul className={style.partnersOptionsSelectorList}>
                    {
                      lotDivisionFiltered?.length > 0 ? (
                        lotDivisionFiltered.map((partner, index) => (
                          <li className={style.lotDivisionPartnersItem} onClick={() => handleAddPartner(partner)} >
                              <span>{partner.name}</span>
                              <span>{partner.CPF}</span>
                              <span>{partner.percentage}%</span>
                          </li>
                        ))
                      ) : (
                        <li>Nenhum sócio encontrado.</li>
                      )
                    }
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default LotRegisterPopUp