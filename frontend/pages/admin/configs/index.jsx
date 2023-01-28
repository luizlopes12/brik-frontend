import React from 'react'
import style from './style.module.scss'
import HeadingText from '../../../components/HeadingText'


const Configs = () => {
  return (
    <div className={style.configsContainer}>
    <div className={style.heading}>
          <HeadingText>Configurações</HeadingText>
    </div>
    </div>
  )
}

export default Configs