import React,{ useEffect, useContext, useState } from 'react'
import style from './style.module.scss'
import {popUpsContext} from '../../context/popUpsContext'
import {selectedDivisionContext} from '../../context/selectedDivisionContext'

const DivisionEditPopUp = () => {
  const { popUps, setPopUps } = useContext(popUpsContext)
  const { divisionSelected,  setDivisionSelected } = useContext(selectedDivisionContext)
  useEffect(() =>{
    console.log(popUps)
  },[popUps])
  const [ newDivisionData, setNewDivisionData ] = useState(divisionSelected)
  const handleDivisionData = (e) =>{
    setNewDivisionData(prev => ({...prev, [e.target.name]: e.target.value}))
  }
  console.log(newDivisionData)
  return (
    <div className={ popUps.divisionEdit ? style.popUpBackdrop : style.popUpDisabled }>
      <div className={style.popUpWrapper}>
        <button className={style.closeBtn} onClick={() => setPopUps(popUps.divisionEdit = false)} name='lotRegister'><img src="/images/closeIcon.svg" alt="Sair" /></button>
        <h2 className={style.heading}>Editar loteamento</h2>
        <div className={style.divisionContent}>
          <img src={divisionSelected.logoUrl} alt="Logo" />
          <ul className={style.popUpsInputs}>
              <li className={style.inputField}>
                <span>Nome:</span><input value={newDivisionData.name} name="name" onChange={handleDivisionData}/>
              </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default DivisionEditPopUp