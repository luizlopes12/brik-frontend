import React from 'react'
import style from './style.module.scss'

const SearchInput = () => {
  return (
    <div className={style.searchContent}>
      <input className={style.searchInput} type='text'/>
      <button className={style.searchBtn}><img src='/images/searchIcon.svg'/></button>
    </div>
  )
}

export default SearchInput