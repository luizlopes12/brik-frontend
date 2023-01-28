import React,{ useEffect, useContext } from 'react'
import style from './style.module.scss'
import {popUpsContext} from '../../context/popUpsContext'

const LotRegisterPopUp = () => {
  const { popUps, setPopUps } = useContext(popUpsContext)

  return (
    <div className={ popUps.lotRegister ? style.popUpBackdrop : style.popUpDisabled }>
      <div className={style.popUpWrapper}>
        <button className={style.closeBtn} onClick={(e) => setPopUps(popUps.lotRegister = false)} name='lotRegister'><img src="/images/closeIcon.svg" alt="Sair" /></button>
      <p>Cadastrar Lote</p>
      </div>
    </div>
  )
}

export default LotRegisterPopUp