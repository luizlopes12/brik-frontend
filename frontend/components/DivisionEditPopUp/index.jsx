import React,{ useEffect, useContext, useState, useMemo,useRef } from 'react'
import style from './style.module.scss'
import {popUpsContext} from '../../context/popUpsContext'
import {selectedDivisionContext} from '../../context/selectedDivisionContext'
import {globalDivisionsDataContext} from '../../context/globalDivisionsDataContext'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { storage } from '../../configs/firebase'

const DivisionEditPopUp = () => {
  const {  globalDivisionsData , setGlobalDivisionsData } = useContext(globalDivisionsDataContext)
  const uploadLogoForm = useRef()
  const uploadBlueprintForm = useRef()
  const { popUps, setPopUps } = useContext(popUpsContext)
  const { divisionSelected,  setDivisionSelected } = useContext(selectedDivisionContext)
  const [ dataSaved, setDataSaved ] = useState(false)
  const divisionData = useMemo(()=>{
    return divisionSelected
  },[divisionSelected])
  useEffect(() =>{
    setAlertMessage({
      logo: '',
      blueprint: '',
      save: ''
    })
  },[popUps])
  const [successMessage, setSuccessMessage] = useState({
    logo: '',
    blueprint: '',
    save: ''
  })
  const [alertMessage, setAlertMessage] = useState({
    logo: '',
    blueprint: '',
    save: ''
  })
  const handleDivisionData = (e) =>{
    setDivisionSelected(prev => ({...prev, [e.target.name]: e.target.value}))
  }
  const doUpload = (url, options) => {
    const promiseCallback = (resolve, reject) =>{
      fetch(url,options)
      .then(response => response.json())
      .then(resolve)
      .catch(reject)
    }
    return new Promise(promiseCallback)
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
            alert(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              setDivisionSelected(prev => ({...prev, logoUrl: downloadURL}))
              setAlertMessage(prev => ({...prev, logo: ''}))
              setSuccessMessage(prev => ({...prev, logo: 'Upload realizado com sucesso.'}))
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
      setAlertMessage(prev => ({...prev, blueprint: 'Não foi possível realizar o upload, tente novamente.'}))
      setSuccessMessage(prev => ({...prev, blueprint: ''}))
    }else{
      const currentDate = new Date().getTime();
      const storageRef = ref(storage, `files/blueprints/${currentDate}_${image.name}`)
      const uploadTask = uploadBytesResumable(storageRef, image)
      uploadTask.on(
        "state_changed",
        (snapshot) => {
        },
        (error) => {
          alert(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setDivisionSelected(prev => ({...prev, blueprint: downloadURL}))
            setAlertMessage(prev => ({...prev, blueprint: ''}))
            setSuccessMessage(prev => ({...prev, blueprint: 'Upload realizado com sucesso.'}))
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
      blueprint: divisionData.blueprint
    })
    await fetch(`http://localhost:8080/divisions/edit/${divisionData.id}`,{
      method: 'PATCH',
      headers: {
        'Content-type': 'application/json',
      },
      body: divisionDataToRequest
    }).then(res => res.json())
    .then(async data => {
      await fetch('http://localhost:8080/divisions/list')
      .then(updatedResponse => updatedResponse.json())
      .then(updatedData => setGlobalDivisionsData(updatedData))
      setDivisionSelected(data.data)
      setDataSaved(true)
      setTimeout(() => setDataSaved(false),5000)
    }).catch(err => {
      console.log(err)
      setAlertMessage(prev => ({...prev, save: 'Não foi possível salvar os dados, tente novamente.'}))
      setSuccessMessage(prev => ({...prev, save: ''}))
    })


  }
  const handleDownloadBlueprint = () => {
    var element = document.createElement("a");
    var file = new Blob(
      [
        divisionData.blueprint
      ],
      { type: "image/*" }
    );
    element.href = URL.createObjectURL(file);
    element.download = `${divisionData.name}.png`;
    element.click();
  }

  return (
    <div className={ popUps.divisionEdit ? style.popUpBackdrop : style.popUpDisabled }>
      <div className={style.popUpWrapper}>
        <button className={style.closeBtn} onClick={() => setPopUps(popUps.divisionEdit = false)} name='lotRegister'><img src="/images/closeIcon.svg" alt="Sair" /></button>
        <h2 className={style.heading}>Editar loteamento</h2>
        <div className={style.divisionContent}>
          <form ref={uploadLogoForm}>
          <div className={style.uploadImage}>
            <input type="file" name='logoUrl' accept="image/*" onChange={(e) => handleUploadLogo(e)}/>
            <img src={divisionData.logoUrl} className={style.divisionLogo} alt="Logo" />
            {alertMessage.logo.length > 0 && <p className={style.alertMessage}> {alertMessage.logo} </p>}
            {successMessage.logo.length > 0 && <p className={style.successMessage}> {successMessage.logo} </p>}
          </div>
          </form>
          <ul className={style.popUpsInputs}>
              <li className={style.inputField}>
                <span>Nome:</span><input value={divisionData.name} name="name" onChange={(e) => handleDivisionData(e)}/>
              </li>
              <li className={style.inputField}>
              <span>Endereço:</span><input value={divisionData.location} name="location" onChange={(e) => handleDivisionData(e)}/>
              </li>
          </ul>
          <div className={style.blueprint}>
          <a className={style.downloadBlueprint} onClick={handleDownloadBlueprint}><img src='/images/download.svg'/>
              Planta baixa
          </a>
          <form ref={uploadBlueprintForm}>
          <a className={style.uploadBlueprint}><img src='/images/download.svg'/>
            <input type="file"  accept="image/*" onChange={(e) => handleUploadBlueprint(e)}/>
            Planta baixa
          </a>
          </form>
          </div>
          {alertMessage.blueprint.length > 0 && <p className={style.alertMessage}> {alertMessage.blueprint} </p>}
          {successMessage.blueprint.length > 0 && <p className={style.successMessage}> {successMessage.blueprint} </p>}
          <button className={style.saveBtn} onClick={handleSaveData}>{ dataSaved ? 'Salvo!' :  'Salvar' } </button>
          <p className={style.alertMessage}> {alertMessage.save} </p>
        </div>
      </div>
    </div>
  )
}

export default DivisionEditPopUp