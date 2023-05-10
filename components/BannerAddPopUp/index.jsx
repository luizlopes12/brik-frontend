import React, {useContext, useState} from 'react'
import style from './style.module.scss'
import { popUpsContext } from '../../context/popUpsContext'

const BannerAddPopUp = () => {
  const {popUps} = useContext(popUpsContext)

  return (
    <div className={popUps.bannerAdd ? style.popUpBackdrop : style.popUpDisabled}>

    </div>
  )
}

export default BannerAddPopUp