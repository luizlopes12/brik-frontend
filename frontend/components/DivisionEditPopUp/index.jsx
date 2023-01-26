import React,{ useEffect, useContext, useState, useMemo,useRef } from 'react'
import style from './style.module.scss'
import {popUpsContext} from '../../context/popUpsContext'
import {selectedDivisionContext} from '../../context/selectedDivisionContext'

const DivisionEditPopUp = () => {
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
  console.log(divisionData)
  const [ newDivisionData, setNewDivisionData ] = useState(divisionData)
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
      let image = new FormData()
      image.append('image', e.target.files[0])
      doUpload('https://api.imgur.com/3/image',{
        method: 'POST',
        body: image,
        headers: {
          'Authorization': `Client-ID ${process.env.IMGUR_CLIENT_ID}`
        }
      }).then(res => {
        uploadForm.reset()
        setDivisionSelected(prev => ({...prev, logoUrl: res.link}))
      })
      .catch(err => {
        console.log(err)
        setAlertMessage(prev => ({...prev, logo: 'Não foi possível realizar o upload, tente novamente.'}))
      })
  }
  const handleUploadBlueprint = (e) =>{
    let image = new FormData()
    image.append('image', e.target.files[0])
    doUpload('https://api.imgur.com/3/image',{
      method: 'POST',
      body: image,
      headers: {
        'Authorization': `Client-ID ${process.env.IMGUR_CLIENT_ID}`
      }
    }).then(res => {
      setDivisionSelected(prev => ({...prev, blueprint: res.link}))
      uploadLogoForm.reset()
    })
    .catch(err => {
      console.log(err)
      setAlertMessage(prev => ({...prev, blueprint: 'Não foi possível realizar o upload, tente novamente.'}))
    })
  }
  const handleSaveData = async() => {
    let divisionDataToRequest = JSON.stringify({
      name: divisionData.name,
      logo: divisionData.logo,
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
    .then(data => {
      console.log(data)
      setDivisionSelected(data.data)
      setDataSaved(true)
      setTimeout(() => setDataSaved(false),5000)
    }).catch(err => {
      console.log(err)
      setAlertMessage(prev => ({...prev, save: 'Não foi possível salvar os dados, tente novamente.'}))
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

  console.log(newDivisionData.name)
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
            <p className={style.alertMessage}> {alertMessage.logo} </p>
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
          <p className={style.alertMessage}> {alertMessage.blueprint} </p>
          <button className={style.saveBtn} onClick={handleSaveData}>{ dataSaved ? 'Salvo!' :  'Salvar' } </button>
          <p className={style.alertMessage}> {alertMessage.save} </p>
        </div>
      </div>
    </div>
  )
}

export default DivisionEditPopUp