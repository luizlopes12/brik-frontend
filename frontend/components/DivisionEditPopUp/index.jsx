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
  const [dataSaved, setDataSaved] = useState(false)
  const [partnerPopUp, setPartnerPopUp] = useState(false)
  const [partnerData, setPartnerData] = useState({})
  const handleExitPopUp = () => {
    setPopUps(popUps.divisionEdit = false)
    setDivisionSelected({})
  }
  const divisionData = useMemo(() => {
    return divisionSelected
  }, [divisionSelected])

  useEffect(() => {
    setAlertMessage({
      logo: '',
      blueprint: '',
      save: '',
      partner: ''
    })
    setSuccessMessage({
      logo: '',
      blueprint: '',
      save: ''
    })
  }, [popUps])
  useEffect(() => {
    setAlertMessage({
      logo: '',
      blueprint: '',
      save: '',
      partner: ''
    })
  }, [popUps])
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
  const handleDivisionData = (e) => {
    setDivisionSelected(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }
  const handleUploadLogo = async (e) => {
    let image = e.target?.files[0]
    // reiceves reader.result and this need to be uploaded and updated on backend
    if (!image) {
      setAlertMessage(prev => ({ ...prev, logo: 'Não foi possível realizar o upload, tente novamente.' }))
      setSuccessMessage(prev => ({ ...prev, logo: '' }))
      setTimeout(() => setAlertMessage(prev => ({ ...prev, blueprint: '' })), 5000)
    } else {
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
      setAlertMessage(prev => ({ ...prev, blueprint: 'Não foi possível realizar o upload, tente novamente.' }))
      setSuccessMessage(prev => ({ ...prev, blueprint: '' }))
      setTimeout(() => setAlertMessage(prev => ({ ...prev, blueprint: '' })), 5000)
    } else {
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
            console.log(downloadURL)
            setDivisionSelected(prev => ({ ...prev, blueprint: downloadURL }))
            setAlertMessage(prev => ({ ...prev, blueprint: '' }))
            setSuccessMessage(prev => ({ ...prev, blueprint: 'Upload realizado com sucesso.' }))
            setTimeout(() => setSuccessMessage(prev => ({ ...prev, blueprint: '' })), 5000)
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
      blueprint: divisionData.blueprint,
    })
    await fetch(`http://localhost:8080/divisions/edit/${divisionData.id}`, {
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
        setDivisionSelected(data.data[0])
        setDataSaved(true)
        setTimeout(() => setDataSaved(false), 5000)
      }).catch(err => {
        console.log(err)
        setAlertMessage(prev => ({ ...prev, save: 'Não foi possível salvar os dados, tente novamente.' }))
        setSuccessMessage(prev => ({ ...prev, save: '' }))
        setTimeout(() => setAlertMessage(prev => ({ ...prev, save: '' })), 5000)
      })
  }
  const handleDownloadBlueprint = () => {
    console.log(divisionSelected.blueprint)
    var element = document.createElement("a");
    var file = new Blob(
      [
        divisionSelected.blueprint
      ],
      { type: "image/png" }
    );
    element.href = URL.createObjectURL(file);
    console.log(file.type)
    element.download = `${divisionSelected.name}`;
    element.click();
  }

  const handleAddPartner = async () => {
    setPartnerPopUp(prev => !prev)
  }
  const handleAddPartnertoDivision = async () => {
    if (partnerData.name?.length > 0 && partnerData.CPF?.length >= 11 && partnerData?.percentage > 0) {
      setPartnerPopUp(false)
      await fetch(`http://localhost:8080/divisions/${divisionData.id}/partners/add`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(partnerData)
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
    setPartnerData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }
  return (
    <div className={popUps.divisionEdit ? style.popUpBackdrop : style.popUpDisabled}>
      <div className={style.popUpWrapper}>
        <button className={style.closeBtn} onClick={handleExitPopUp} name='lotRegister'><img src="/images/closeIcon.svg" alt="Sair" /></button>
        <h2 className={style.heading}>Editar loteamento</h2>
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
          {/* <div className={style.blueprint}>
          <a className={style.downloadBlueprint} onClick={handleDownloadBlueprint}><img src='/images/download.svg'/>
              Planta baixa
          </a>
          <form ref={uploadBlueprintForm}>
          <a className={style.uploadBlueprint}><img src='/images/download.svg'/>
            <input type="file"  accept="image/*" onChange={(e) => handleUploadBlueprint(e)}/>
            Planta baixa
          </a>
          </form>
          </div> */}
          {/* {alertMessage.blueprint.length > 0 && <p className={style.alertMessage}> {alertMessage.blueprint} </p>}
          {successMessage.blueprint.length > 0 && <p className={style.successMessage}> {successMessage.blueprint} </p>} */}
        </div>
        <div className={style.partnersContent}>
          <h3 className={style.subHeading}>Sócios</h3>
          <ul className={style.partnersList}>
            <li className={style.partnerHeader}>
              <div className={style.partnerProfile}>
                {/* <img src='https://i.imgur.com/cwVOOqb.jpg'/> */}
                <p>Nome</p>
                <p className={style.partnerCPF}>CPF</p>
              </div>
              <span>%</span>
            </li>
            {divisionData.divisionPartners?.map((partner, index) => (
              <li className={style.partner} key={index}>
                <div className={style.partnerProfile}>
                  {/* <img src={partner.profileImage}/> */}
                  <p>{partner.name}</p>
                  <p className={style.partnerCPF}>{partner.CPF}</p>
                </div>
                <span>{partner.percentage}%</span>
              </li>
            ))}
            {partnerPopUp && ((
              <li className={style.partnerAddForm}>
                <input type="text" placeholder='Nome' name='name' onChange={handlePartnerData} />
                <input type="text" placeholder='CPF' name='CPF'pattern="(\d{3}\.?\d{3}\.?\d{3}-?\d{2})|(\d{2}\.?\d{3}\.?\d{3}/?\d{4}-?\d{2})"  onChange={handlePartnerData} />
                <input type="number" placeholder='%' name='percentage' max='100' min='0' onChange={handlePartnerData} />
              </li>
            ))}

          </ul>
          {partnerPopUp ? (
            <>
              {alertMessage.partner.length > 0 && <span className={style.alertMessage}> {alertMessage.partner} </span>}
              <button className={style.addPartnerBtn} onClick={handleAddPartnertoDivision} name='addPartner'><img src='/images/confirm.svg' /> Confirmar</button>
            </>
          ) : (
            <button className={style.addPartnerBtn} onClick={handleAddPartner} name='addPartner'><img src='/images/plusIcon-green.svg' /> Adicionar sócio</button>
          )}
        </div>
        <button className={style.saveBtn} onClick={handleSaveData}>{dataSaved ? 'Salvo!' : 'Salvar'} </button>

      </div>
    </div>
  )
}

export default DivisionEditPopUp