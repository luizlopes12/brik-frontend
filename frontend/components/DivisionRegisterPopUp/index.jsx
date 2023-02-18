import React,{ useEffect, useContext, useState, useMemo,useRef } from 'react'
import style from './style.module.scss'
import {popUpsContext} from '../../context/popUpsContext'
import {selectedDivisionContext} from '../../context/selectedDivisionContext'
import {globalDivisionsDataContext} from '../../context/globalDivisionsDataContext'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { storage } from '../../configs/firebase'

const DivisionRegisterPopUp = () => {
  const { setGlobalDivisionsData } = useContext(globalDivisionsDataContext)
  const uploadLogoForm = useRef()
  const uploadBlueprintForm = useRef()
  const { popUps, setPopUps } = useContext(popUpsContext)
  const [ dataSaved, setDataSaved ] = useState(false)
  const [bluePrintRef, setBlueprintRef] = useState('')
  const downloadBlueprintRef = useRef()

  const [divisionData, setDivisionData] = useState({
    logoUrl: 'https://i.imgur.com/zo56zlQ.png',
    name: '',
    location: '',
    divisionPartners: [],
    bluePrint: '',
  })
  const handleExitPopUp = () => {
    setPopUps(popUps.divisionRegister = false)
    setDivisionData({})
    setDivisionData({
      logoUrl: 'https://i.imgur.com/zo56zlQ.png',
      name: '',
      location: '',
      divisionPartners: [],
    })
  }
  useEffect(() =>{
    setAlertMessage({
      logo: '',
      bluePrint: '',
      save: ''
    })
    setSuccessMessage({
      logo: '',
      bluePrint: '',
      save: ''
    })
  },[popUps])
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
  const handleDivisionData = (e) =>{
    setDivisionData(prev => ({...prev, [e.target.name]: e.target.value}))
  }

  const handleUploadLogo = async (e) =>{
      let image = e.target?.files[0]
      // reiceves reader.result and this need to be uploaded and updated on backend
      if(!image){
        setAlertMessage(prev => ({...prev, logo: 'Não foi possível realizar o upload, tente novamente.'}))
        setSuccessMessage(prev => ({...prev, logo: ''}))
      }else{
        const currentDate = new Date().getTime();
        const storageRef = ref(storage, `files/logos/${currentDate}_${image.name}`)
        const uploadTask = uploadBytesResumable(storageRef, image)
        uploadTask.on(
          "state_changed",
          (snapshot) => {
          },
          (error) => {
          setAlertMessage(prev => ({...prev, logo: 'Não foi possível realizar o upload, tente novamente.'}))
          setSuccessMessage(prev => ({...prev, logo: ''}))
          setTimeout(() => setAlertMessage(prev => ({ ...prev, logo: '' })), 5000)
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              setDivisionData(prev => ({...prev, logoUrl: downloadURL}))
              setAlertMessage(prev => ({...prev, logo: ''}))
              setSuccessMessage(prev => ({...prev, logo: 'Upload realizado com sucesso.'}))
              setTimeout(() => setSuccessMessage(prev => ({ ...prev, logo: '' })), 5000)
            });
          }
        );
      }
      uploadLogoForm.current.reset()
    }
  const handleUploadBlueprint = (e) =>{
    let image = e.target?.files[0]
    // reiceves reader.result and this need to be uploaded and updated on backend
    if(!image){
      setAlertMessage(prev => ({...prev, bluePrint: 'Não foi possível realizar o upload, tente novamente.'}))
      setSuccessMessage(prev => ({...prev, bluePrint: ''}))
    }else{
      const currentDate = new Date().getTime();
      setBlueprintRef(`files/bluePrints/${currentDate}_${image.name}`)
      const storageRef = ref(storage, `files/bluePrints/${currentDate}_${image.name}`)
      const uploadTask = uploadBytesResumable(storageRef, image)
      uploadTask.on(
        "state_changed",
        (snapshot) => {
        },
        (error) => {
          setAlertMessage(prev => ({...prev, bluePrint: 'Não foi possível realizar o upload, tente novamente.'}))
          setSuccessMessage(prev => ({...prev, bluePrint: ''}))
          setTimeout(() => setAlertMessage(prev => ({ ...prev, bluePrint: '' })), 5000)
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setDivisionData(prev => ({...prev, bluePrint: downloadURL}))
            setAlertMessage(prev => ({...prev, bluePrint: ''}))
            setSuccessMessage(prev => ({...prev, bluePrint: 'Upload realizado com sucesso.'}))
            setTimeout(() => setSuccessMessage(prev => ({ ...prev, bluePrint: '' })), 5000)
          });
        }
      );
    }
    uploadBlueprintForm.current.reset()
  }
  const handleSaveData = async() => {
    let divisionDataToRequest = JSON.stringify({
      name: divisionData.name,
      logo: divisionData.logoUrl,
      location: divisionData.location,
      bluePrint: divisionData.bluePrint
    })
    await fetch(`http://localhost:8080/divisions/add`,{
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: divisionDataToRequest
    }).then(res => res.json())
    .then(async data => {
      await fetch('http://localhost:8080/divisions/list')
      .then(updatedResponse => updatedResponse.json())
      .then(updatedData => setGlobalDivisionsData(updatedData))
      setDivisionData(data.data)
      setDataSaved(true)
      setTimeout(() => setDataSaved(false),5000)
    }).catch(err => {
      setAlertMessage(prev => ({...prev, save: 'Não foi possível salvar os dados, tente novamente.'}))
      setSuccessMessage(prev => ({...prev, save: ''}))
    })


  }
  const handleDownloadBlueprint = () => {
    downloadBlueprintRef.download = divisionData.bluePrint;
    downloadBlueprintRef.href = divisionData.bluePrint;
  };
  
  return (
    <div className={ popUps.divisionRegister ? style.popUpBackdrop : style.popUpDisabled }>
      <div className={style.popUpWrapper}>
        <button className={style.closeBtn} onClick={handleExitPopUp} name='lotRegister'><img src="/images/closeIcon.svg" alt="Sair" /></button>
        {/* <h2 className={style.heading}>Cadastrar loteamento</h2> */}
        <div className={style.divisionContent}>
          <form ref={uploadLogoForm}>
            <div className={style.uploadImage}>
              <input type="file" name='logoUrl' accept="image/*" onChange={(e) => handleUploadLogo(e)} />
              <img src={divisionData.logoUrl} className={style.divisionLogo} />
            </div>
          </form>
          <ul className={style.popUpsInputs}>
            <li className={style.inputField}>
              <input value={divisionData.name} name="name" placeholder='Nome do Loteamento' onChange={(e) => handleDivisionData(e)} />
            </li>
            <li className={style.inputField}>
              <span><img src="/images/locationIcon.svg" /></span><input value={divisionData.location} placeholder='Endereço do Loteamento' name="location" onChange={(e) => handleDivisionData(e)} />
            </li>
          </ul>

        </div>
        <div className={style.bluePrint}>
          <a className={style.downloadBlueprint} href={divisionData.bluePrint} download target='noreferrer' onClick={handleDownloadBlueprint} ><img src='/images/goToPage.svg'/>
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
        <div className={style.saveBtnWrapper}>
        <button className={style.saveBtn} onClick={handleSaveData}>{dataSaved ? 'Salvo!' : 'Salvar'} </button>
        </div>

      </div>
    </div>
  )
}

export default DivisionRegisterPopUp