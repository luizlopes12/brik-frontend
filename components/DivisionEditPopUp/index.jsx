import React, { useEffect, useContext, useState, useMemo, useRef } from 'react'
import style from './style.module.scss'
import { popUpsContext } from '../../context/popUpsContext'
import { selectedDivisionContext } from '../../context/selectedDivisionContext'
import { globalDivisionsDataContext } from '../../context/globalDivisionsDataContext'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { storage } from '../../configs/firebase'

const DivisionEditPopUp = () => {
  const { globalDivisionsData, setGlobalDivisionsData } = useContext(globalDivisionsDataContext)
  const uploadLogoForm = useRef()
  const uploadBlueprintForm = useRef()
  const { popUps, setPopUps } = useContext(popUpsContext)
  const { divisionSelected, setDivisionSelected } = useContext(selectedDivisionContext)
  console.log(divisionSelected)
  const [dataSaved, setDataSaved] = useState(false)
  const [partnerPopUp, setPartnerPopUp] = useState(false)
  const [partnerData, setPartnerData] = useState({})
  const downloadBlueprintRef = useRef()
  const partnerValues = useMemo(() => { 
    return partnerData
  }, [partnerData])
  const handleExitPopUp = () => {
    setPopUps(popUps.divisionEdit = false)
    setPartnerPopUp(false)
    setDivisionSelected({})
  }
  const divisionData = useMemo(() => {
    return divisionSelected
  }, [divisionSelected])
  useEffect(() => {
    setAlertMessage({
      logo: '',
      bluePrint: '',
      save: '',
      partner: ''
    })
    setSuccessMessage({
      logo: '',
      bluePrint: '',
      save: ''
    })
  }, [popUps])
  useEffect(() => {
    setAlertMessage({
      logo: '',
      bluePrint: '',
      save: '',
      partner: ''
    })
  }, [popUps])
  const [successMessage, setSuccessMessage] = useState({
    logo: '',
    bluePrint: '',
    save: ''
  })
  const [alertMessage, setAlertMessage] = useState({
    logo: '',
    bluePrint: '',
    save: ''
  })
  const handleDivisionData = (e) => {
    setDivisionSelected(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }
  const handleUploadLogo = async (e) => {
    let image = e.target?.files[0]
    // reiceves reader.result and this need to be uploaded and updated on backend
    if (!image) {
      setAlertMessage(prev => ({ ...prev, logo: 'Não foi possível realizar o upload, tente novamente.' }))
      setSuccessMessage(prev => ({ ...prev, logo: '' }))
      setTimeout(() => setAlertMessage(prev => ({ ...prev, logo: '' })), 5000)
    } else {
      const currentDate = new Date().getTime();
      const storageRef = ref(storage, `files/logos/${currentDate}_${image.name}`)
      const uploadTask = uploadBytesResumable(storageRef, image)
      uploadTask.on(
        "state_changed",
        (snapshot) => {
        },
        (error) => {
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setDivisionSelected(prev => ({ ...prev, logoUrl: downloadURL }))
            setAlertMessage(prev => ({ ...prev, logo: '' }))
            setSuccessMessage(prev => ({ ...prev, logo: 'Upload realizado com sucesso.' }))
            setTimeout(() => setSuccessMessage(prev => ({ ...prev, logo: '' })), 5000)
          });
        }
      );
    }
    uploadLogoForm.current.reset()
  }
  const handleUploadBlueprint = (e) => {
    let image = e.target?.files[0]
    // reiceves reader.result and this need to be uploaded and updated on backend
    if (!image) {
      setAlertMessage(prev => ({ ...prev, bluePrint: 'Não foi possível realizar o upload, tente novamente.' }))
      setSuccessMessage(prev => ({ ...prev, bluePrint: '' }))
      setTimeout(() => setAlertMessage(prev => ({ ...prev, bluePrint: '' })), 5000)
    } else {
      const currentDate = new Date().getTime();
      const storageRef = ref(storage, `files/bluePrints/${currentDate}_${image.name}`)
      const uploadTask = uploadBytesResumable(storageRef, image)
      uploadTask.on(
        "state_changed",
        (snapshot) => {
        },
        (error) => {
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setDivisionSelected(prev => ({ ...prev, bluePrint: downloadURL }))
            setAlertMessage(prev => ({ ...prev, bluePrint: '' }))
            setSuccessMessage(prev => ({ ...prev, bluePrint: 'Upload realizado com sucesso.' }))
            setTimeout(() => setSuccessMessage(prev => ({ ...prev, bluePrint: '' })), 5000)
          });
        }
      );
    }
    uploadBlueprintForm.current.reset()
  }
  const handleSaveData = async () => {
    let divisionDataToRequest = JSON.stringify({
      name: divisionData.name,
      logo: divisionData.logoUrl,
      location: divisionData.location,
      bluePrint: divisionData.bluePrint,
    })
    await fetch(`${process.env.BACKEND_URL}/divisions/edit/${divisionData.id}`, {
      method: 'PATCH',
      headers: {
        'Content-type': 'application/json',
      },
      body: divisionDataToRequest
    }).then(res => res.json())
      .then(async data => {
        await fetch(`${process.env.BACKEND_URL}/divisions/list`)
          .then(updatedResponse => updatedResponse.json())
          .then(updatedData => setGlobalDivisionsData(updatedData))
        setDivisionSelected(data.data[0])
        console.log(data.data[0])
        setDataSaved(true)
        setTimeout(() => setDataSaved(false), 5000)
      }).catch(err => {
        setAlertMessage(prev => ({ ...prev, save: 'Não foi possível salvar os dados, tente novamente.' }))
        setSuccessMessage(prev => ({ ...prev, save: '' }))
        setTimeout(() => setAlertMessage(prev => ({ ...prev, save: '' })), 5000)
      })
  }
  const handleDownloadBlueprint = () => {
      downloadBlueprintRef.download = divisionSelected.bluePrint;
      downloadBlueprintRef.href = divisionSelected.bluePrint;
      console.log(divisionData.bluePrint)
      console.log(divisionSelected.bluePrint)
  }

  const handleAddPartner = async () => {
    setPartnerPopUp(prev => !prev)
  }
  const handleAddPartnertoDivision = async () => {
    if (partnerValues.name?.length > 0 && partnerValues.CPF?.length >= 11 && partnerValues?.percentage > 0) {
      setPartnerPopUp(false)
      await fetch(`${process.env.BACKEND_URL}/divisions/${divisionData.id}/partners/add`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(partnerValues)
      })
        .then(res => res.json())
        .then(data => {
          setDivisionSelected(prev => ({ ...prev, divisionPartners: data.partnersList }))
        })
      setPartnerData({})
    } else {
      setAlertMessage(prev => ({ ...prev, partner: 'Preencha todos os campos corretamente.' }))
      setSuccessMessage(prev => ({ ...prev, partner: '' }))
      setTimeout(() => setAlertMessage(prev => ({ ...prev, partner: '' })), 5000)
    }
  }
  const handlePartnerData = (e) => {
    if(e.target.name === 'CPF'){
      e.target.value = e.target.value.replace(/\D/g, '')
			e.target.value = e.target.value.replace(/(\d{3})(\d)/, '$1.$2') 
			e.target.value = e.target.value.replace(/(\d{3})(\d)/, '$1.$2')
			e.target.value = e.target.value.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    }
    setPartnerData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }
  return (
    <div className={popUps.divisionEdit ? style.popUpBackdrop : style.popUpDisabled}>
      <div className={style.popUpWrapper}>
        <button className={style.closeBtn} onClick={handleExitPopUp} name='lotRegister'><img src="/images/closeIcon.svg" alt="Sair" /></button>
        {/* <h2 className={style.heading}>Editar loteamento</h2> */}
        <div className={style.divisionContent}>
          <form ref={uploadLogoForm}>
            <div className={style.uploadImage}>
              <input type="file" name='logoUrl' accept="image/*" onChange={(e) => handleUploadLogo(e)} />
              <img src={divisionData.logoUrl} className={style.divisionLogo} />
            </div>
          </form>
          <ul className={style.popUpsInputs}>
            <li className={style.inputField}>
              <input value={divisionData.name} name="name" onChange={(e) => handleDivisionData(e)} />
            </li>
            <li className={style.inputField}>
              <span><img src="/images/locationIcon.svg" /></span><input value={divisionData.location} name="location" onChange={(e) => handleDivisionData(e)} />
            </li>
            {alertMessage.logo.length > 0 && <p className={style.alertMessage}> {alertMessage.logo} </p>}
            {successMessage.logo.length > 0 && <p className={style.successMessage}> {successMessage.logo} </p>}
          </ul>

        </div>

        <div className={style.partnersContent}>
          <h3 className={style.subHeading}>Sócios</h3>
          <ul className={style.partnersList}>
            <li className={style.partnerHeader}>
              <div className={style.partnerProfile}>
                <p>Nome</p>
                <p className={style.partnerCPF}>CPF</p>
              </div>
              <span>%</span>
            </li>
            {divisionData.divisionPartners?.map((partner, index) => (
              <li className={style.partner} key={index}>
                <div className={style.partnerProfile}>
                  <p>{partner.name}</p>
                  <p className={style.partnerCPF}>{partner.CPF}</p>
                </div>
                <span>{partner.percentage}%</span>
              </li>
            ))}
            {partnerPopUp && ((
              <li className={style.partnerAddForm}>
                <input type="text" placeholder='Nome' name='name' value={partnerValues.name} onChange={handlePartnerData} />
                <input type="text" placeholder='CPF' name='CPF'  value={partnerValues.CPF} onChange={handlePartnerData} />
                <input type="number" placeholder='%' name='percentage' value={partnerValues.percentage}  max='100' min='0' onChange={handlePartnerData} />
              </li>
            ))}

          </ul>
          {partnerPopUp ? (
            <div className={style.confirmPartnerWrapper}>
              <span className={style.alertMessage}> {alertMessage.partner.length > 0 && alertMessage.partner} </span>
              <button className={style.addPartnerBtn} onClick={handleAddPartnertoDivision} name='addPartner'><img src='/images/confirm.svg' /> Confirmar</button>
            </div>
          ) : (
            <button className={style.addPartnerBtn} onClick={handleAddPartner} name='addPartner'><img src='/images/plusIcon-green.svg' /> Adicionar sócio</button>
          )}
        </div>
        <div className={style.bluePrint}>
        <a className={style.downloadBlueprint} href={divisionData.bluePrint} target='_blank' onClick={handleDownloadBlueprint} ><img src='/images/goToPage.svg'/>
              Ver loteamento
          </a>
          <form ref={uploadBlueprintForm}>
          <a className={style.uploadBlueprint}><img src='/images/uploadIcon.svg'/>
            <input type="file" onChange={(e) => handleUploadBlueprint(e)}/>
            Planta baixa
          </a>
          </form>
          </div>
          {alertMessage.bluePrint.length > 0 && <p className={style.alertMessage}> {alertMessage.bluePrint} </p>}
          {successMessage.bluePrint.length > 0 && <p className={style.successMessage}> {successMessage.bluePrint} </p>}
        <button className={style.saveBtn} onClick={handleSaveData}>{dataSaved ? 'Salvo!' : 'Salvar'} </button>

      </div>
    </div>
  )
}

export default DivisionEditPopUp