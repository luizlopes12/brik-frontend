import React,{ useEffect, useContext } from 'react'
import style from './style.module.scss'
import popUpsContext from '../../context/popUpsContext'

const DivisionEditPopUp = () => {
  const { popUps, setPopUps } = useContext(popUpsContext)
  useEffect(() =>{
    console.log(popUps)
  },[popUps])
  return (
    <div className={ popUps.divisionEdit ? style.popUpBackdrop : style.popUpDisabled }>
      <div className={style.popUpWrapper}>
        <button className={style.closeBtn} onClick={() => setPopUps(popUps.divisionEdit = false)} name='lotRegister'><img src="/images/closeIcon.svg" alt="Sair" /></button>
      <p>Editar Loteamento</p>
      </div>
    </div>
  )
}

export default DivisionEditPopUp