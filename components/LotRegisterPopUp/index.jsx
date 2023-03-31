import React, { useEffect, useState, useContext, useRef, useMemo } from 'react'
import style from './style.module.scss'
import { popUpsContext } from '../../context/popUpsContext'
import SearchInput from '../SearchInput'
import { globalDivisionsDataContext } from '../../context/globalDivisionsDataContext'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { storage } from '../../configs/firebase'
import DivisionSelector from '../DivisionSelector'
import { toast } from 'react-toastify'


const LotRegisterPopUp = () => {
  const { popUps, setPopUps } = useContext(popUpsContext)
  const { globalDivisionsData, setGlobalDivisionsData } = useContext(globalDivisionsDataContext)
  const [showDivisionOptions, setShowDivisionOptions] = useState(false)
  const [showPartnersOptions , setShowPartnersOptions] = useState(false)
  const [editPartnerFromLot, setEditPartnerFromLot] = useState(false)
  const [ showNewPartnerInputs, setShowNewPartnerInputs ] = useState(false)
  const [ partnerSearchInput, setPartnerSearchInput ] = useState('')
  const partnersListRef = useRef()
  const [lotDataSaved , setLotDataSaved] = useState(false)
  const [taxes , setTaxes] = useState({ taxPercentage: 0, taxPercentage24: 0 })
  const [newPartner, setNewPartner] = useState({
    name: '',
    CPF: '',
    percentage: 0,
  })
  const [lotImages, setLotImages] = useState([
    '/images/labels/without-image.png',
  ])
  const [lotData, setLotData] = useState({
    name: '',
    description: '',
    location: '',
    metrics: '',
    price: '',
    basePrice: '',
    hiddenPrice: false,
    maxPortionsQuantity: 0,
    taxPercentage: '',
    taxPercentage24: '',
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
    setShowPartnersOptions(false)
    setPopUps(popUps.lotRegister = false)
    setEditPartnerFromLot(null)
    setShowDivisionOptions(false)
    setLotData({
      name: '',
      description: '',
      location: '',
      metrics: '',
      price: '',
      basePrice: '',
      hiddenPrice: false,
      maxPortionsQuantity: 0,
      taxPercentage: '',
      taxPercentage24: '',
      partners: [
      ],
    })
    setLotImages([
      '/images/labels/without-image.png',
    ])
    setLotDivision({
    name: 'Selecione um Loteamento',
    logoUrl: 'https://i.imgur.com/YQOzMWA.png',
    id: 0,
    partners: [],
  })
  setSelectValues({
    availability: 'avaible',
  })
  }
  const handleUploadImage = (e) => {
    let image = e.target?.files[0]
    // reiceves reader.result and this need to be uploaded and updated on backend
    if (!image) {
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
  const handleShowDivisionOptions = () => {
    setShowDivisionOptions(!showDivisionOptions)
  }
  const handleSearchDivision = (e) => {
    setDivisionSearch(e.target.value)
  }
  const handleAddParcel = () => {
    setLotData(prev => ({ ...prev, maxPortionsQuantity: prev.maxPortionsQuantity + 1 }))
  }
  const handleRemoveParcel = () => {
    setLotData(prev => ({ ...prev, maxPortionsQuantity: prev.maxPortionsQuantity > 0 && prev.maxPortionsQuantity - 1 }))
  }
  const handleSelectFilters = (e) => {
    setSelectValues(previousState => ({ ...previousState, [e.target.name]: e.target.value }))
  }
  const Availabilities = [{ name: 'Disponível', value: 'avaible' }, { name: 'Indisponível', value: 'unavaible' }, { name: 'Reservado', value: 'reserved' }]

  const handleDeletePartnerFromLot = (partnerToDelete) => {
    setLotData(prev => ({...prev, partners: prev.partners.filter(partner => partner !== partnerToDelete)}))
    setTimeout(() => {
      setEditPartnerFromLot(null);
    }, 0);
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
    if(e.target.name === 'CPF'){
      e.target.value = e.target.value.replace(/\D/g, '')
			e.target.value = e.target.value.replace(/(\d{3})(\d)/, '$1.$2') 
			e.target.value = e.target.value.replace(/(\d{3})(\d)/, '$1.$2')
			e.target.value = e.target.value.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    }
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

  const handleSaveLotData = async () => {
    console.log('AA')
    if (lotData.price > 0) {
      console.log('VVVV')
    
      try{
        let lotDataToAdd = JSON.stringify({
        name: lotData.name,
        location: lotData.location,
        metrics: lotData.metrics,
        basePrice: lotData.basePrice,
        finalPrice: lotData.price,
        description: lotData.description,
        isAvaible: selectValues.availability,
        idLoteamento: lotDivision.id,
        maxPortionsQuantity: lotData.maxPortionsQuantity,
        hiddenPrice: lotData.hiddenPrice,
        taxPercentage : lotData.taxPercentage,
        taxPercentage24 : lotData.taxPercentage24,
        })
        await fetch(`${process.env.BACKEND_URL}/lots/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: lotDataToAdd
        }).then(res => res.json())
        .then(async data => {
          console.log(data)
          if(lotImages[0] === '/images/labels/without-image.png'){
            lotImages[0] = 'https://firebasestorage.googleapis.com/v0/b/brik-files.appspot.com/o/files%2Flotes%2Fwithout-image.png?alt=media&token=9f495f37-2003-4a9a-b733-71e5b603a2e4'
          }
          lotImages.forEach( async image => {
            let newImage = JSON.stringify({url: image})
            await fetch(`${process.env.BACKEND_URL}/lots/${data.newLot?.id}/images/add`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: newImage
            })
            .then(res => res.json())
            .then(data => console.log(data))
            .catch(imageErr => console.log(imageErr))
          })
          lotData.partners.forEach( async partner => {
          partner.idLote = data.newLot.id
          let newPartner = JSON.stringify(partner)
          await fetch(`${process.env.BACKEND_URL}/lots/${partner.idLote}/partners/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: newPartner
        })
        .then(res => res.json())
        .then(data => console.log(data))
          .catch(partnerErr => console.log(partnerErr))
        })
      })
      .catch(lotErr => console.log(lotErr))
        .finally(async () => {
          
          setLotDataSaved(true)
          toast.success('Lote cadastrado com sucesso!');
            setTimeout(() => {
              setLotDataSaved(false)
            }, 3000)
            setShowDivisionOptions(false)
            setLotData({
              name: '',
              description: '',
              location: '',
              metrics: '',
              price: '',
              basePrice: '',
              hiddenPrice: false,
              maxPortionsQuantity: 0,
              taxPercentage: parseFloat(taxes.defaultTax),
              taxPercentage24: parseFloat(taxes.after24Months),
              partners: [
              ],
            })
            setSelectValues({
                availability: 'avaible',
            })
            setLotDivision({
            name: 'Selecione um Loteamento',
            logoUrl: 'https://i.imgur.com/YQOzMWA.png',
            id: 0,
            partners: [],
          })
          setLotImages([
            '/images/labels/without-image.png',
          ])
          await fetch(`${process.env.BACKEND_URL}/divisions/list`)
          .then(updatedResponse => updatedResponse.json())
          .then(updatedData => setGlobalDivisionsData(updatedData), console.log('Lote cadastrado com sucesso!'))
          .catch(err => console.log(err))
        })
        
    }catch(error){
      alert('Ocorreu um erro ao cadastrar o lote, tente novamente!')
      console.log(error)
    }
  }
    }
    const formatPrice = (num) => {
      if (!num) return '';
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };
    const getTaxes = async () =>{
      await fetch(`${process.env.BACKEND_URL}/taxes/list`).then(res => res.json())
      .then(data => {
        setTaxes(data[0])
        setLotData((prev) => ({ ...prev, taxPercentage: parseFloat(data[0].defaultTax), taxPercentage24: parseFloat(data[0].after24Months)
        }))
      })
  
    }
    useEffect(() => {
      getTaxes()
    },[popUps.lotRegister])

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
                    <li key={0} className={style.controlPrev} onClick={() => imageSlide('prev')}><img src='/images/prevIcon.svg' /></li>
                    <li key={1} className={style.controlNext} onClick={() => imageSlide('next')}><img src='/images/nextIcon.svg' /></li>
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
              <input placeholder='Nome do lote' type="text" value={lotData.name} onChange={handleLotData} name='name' />
            </div>
            <DivisionSelector
              lotDivision={lotDivision}
              handleShowDivisionOptions={handleShowDivisionOptions}
              showDivisionOptions={showDivisionOptions}
              divisionSearch={divisionSearch}
              handleSearchDivision={handleSearchDivision}
              globalDivisionsDataFiltered={globalDivisionsDataFiltered}
              handleSelectDivisionToLot={handleSelectDivisionToLot}
            />

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
                    <input type="text" placeholder="0" min="0" name="price" value={formatPrice(lotData.price)} onChange={(event) => {
                      handleLotData({
                        target: {
                          name: event.target.name,
                          value: parseFloat(event.target.value.replace(/\./g, ''))
                        }
                      });
                    }} />
                  </div>
                )}
              </div>
              <div className={style.basePrice}>
                <h3>Preço base</h3>
                {!lotData.hiddenPrice && (
                  <div className={style.basePriceInput}>
                    <span>R$</span>
                    <input type="text" placeholder="0" min="0" name="basePrice" value={formatPrice(lotData.basePrice)} onChange={(event) => {
                      handleLotData({
                        target: {
                          name: event.target.name,
                          value: parseFloat(event.target.value.replace(/\./g, ''))
                        }
                      });
                    }} />
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
                  <input type='number' placeholder='0' min='0' name='price' value={lotData.maxPortionsQuantity} onChange={handleLotData} />
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
              <div className={style.taxes}>
                <h3>Juros(após 24 meses)</h3>
                <div className={style.basePriceInput}>
                  <input type='number' placeholder='0' max='100' min='0' name='taxPercentage24' value={lotData.taxPercentage24} onChange={handleLotData} />
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
                  <button className={style.deletePartner} onClick={(e) => handleDeletePartnerFromLot(editPartnerFromLot)}>
                    <img src="/images/deleteIcon.svg" alt="delete" />
                  </button>
                )}

              </div>
              <div className={style.partners}>
                <ul ref={partnersListRef} className={style.partnersList}>
                  <li  className={style.partnersListHeader}>
                    <span>Nome</span>
                    <span>CPF</span>
                    <span>%</span>
                  </li>
                  <div className={style.partnersListItemWrapper}>

                  {lotData.partners.map((partner, index) => (
                    <li key={index} className={partner == editPartnerFromLot && !showNewPartnerInputs ? style.partnersListItemEdit : style.partnersListItem} onClick={() => handlePartnerActions(partner)}>
                      <input 
                      value={partner.name} 
                      disabled={() => partner == editPartnerFromLot} 
                      type='text' 
                      className={style.partnerName} 
                      onChange={(e) => handlePartnerData(e, partner)}
                      onFocus={() =>handlePartnerActions(partner)}
                      name='name'
                      />
                      <input 
                      value={partner.CPF} 
                      disabled={() => partner == editPartnerFromLot} 
                      type='text' className={style.partnerCPF} 
                      onChange={(e) => handlePartnerData(e, partner)}
                      onFocus={() =>handlePartnerActions(partner)}
                      name='CPF'
                      />
                      <div>
                        <input 
                        value={partner.percentage} 
                        disabled={() => partner == editPartnerFromLot} 
                        min='0' max='100' type='number' 
                        className={style.partnerPercentage} 
                        onChange={(e) => handlePartnerData(e, partner)}
                        onFocus={() =>handlePartnerActions(partner)}
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
                          <li key={index} className={style.lotDivisionPartnersItem} onClick={() => handleAddPartner(partner)} >
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
            <div className={style.saveLotData}>

              <button onClick={() => handleSaveLotData()} className={style.saveLotDataButton}> 
                { lotDataSaved ? 'Salvo!' : 'Salvar' }
              </button>
            </div>

          </div>
        </div>
      </div>

    </div>
  )
}

export default LotRegisterPopUp