import React from 'react'
import style from './style.module.scss'

  const SearchInput = ({onChange, value}) => {
  return (
    <div className={style.searchContent}>
      <input className={style.searchInput} onChange={onChange} value={value} type='text'/>
      <button className={style.searchBtn}><img src='/images/searchIcon.svg'/></button>
    </div>
  )
}

export default SearchInput