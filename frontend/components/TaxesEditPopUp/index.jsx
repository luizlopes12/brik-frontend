import React,{ useEffect, useContext } from 'react'
import style from './style.module.scss'
import popUpsContext from '../../context/popUpsContext'

const TaxesEditPopUp = () => {
  const { popUps, setPopUps } = useContext(popUpsContext)
  useEffect(() =>{
    console.log(popUps)
  },[popUps])
  return (
    <div className={ popUps.taxesEdit ? style.popUpBackdrop : style.popUpDisabled }>
      <div className={style.popUpWrapper}>
        <button className={style.closeBtn} onClick={(e) => setPopUps(popUps.lotRegister = false)} name='lotRegister'><img src="/images/closeIcon.svg" alt="Sair" /></button>
        <p>Editar Juros</p>
      </div>
    </div>
  )
}

export default TaxesEditPopUp