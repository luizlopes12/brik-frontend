import React,{ useEffect, useContext } from 'react'
import style from './style.module.scss'
import popUpsContext from '../../context/popUpsContext'

const LotRegisterPopUp = () => {
  const { popUps } = useContext(popUpsContext)
  useEffect(() =>{
    console.log(popUps)
  },[popUps])
  return (
    <div className={ popUps.lotRegister ? style.popUpBackdrop : style.popUpDisabled }>
      <div className={style.popUpWrapper}>
        
      </div>
    </div>
  )
}

export default LotRegisterPopUp