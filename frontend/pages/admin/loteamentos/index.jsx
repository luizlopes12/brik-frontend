import React, { useState, useEffect } from 'react'
import style from './style.module.scss'
import SearchInput from '../../../components/SearchInput'
import HeadingText from '../../../components/HeadingText'

export async function getStaticProps() {
    const divisionsData = await fetch('http://localhost:8080/divisions/list').then(res => res.json())
    return {
        props: { divisionsData }
    }
}

const Loteamentos = ({ divisionsData }) => {
    const Availabilities = [{ name: 'Disponível', value: 'avaible' }, { name: 'Indisponível', value: 'unavaible' }, { name: 'Reservado', value: 'reserved' }]
    const [selectValues, setSelectValues] = useState({
        division: 'all',
        availability: 'avaible'
    })
    const [lotsData, setLotsData] = useState(divisionsData.map((division) => division.lotes).flat())
    console.log(lotsData)
    const handleSelectItem = (e) => {
        setSelectValues(previousState => ({ ...previousState, [e.target.name]: e.target.value }))
    }

    return (
        <section className={style.loteamentosContainer}>
            <div className={style.heading}>
                <HeadingText>Lotes e Loteamentos</HeadingText>
                <SearchInput />
            </div>
            <div className={style.topActions}>
                <div className={style.lotFilters}>
                    <div className={style.dropdownsContainer}>
                        <select onChange={handleSelectItem} value={selectValues.division} name='division' className={style.dropdownMenu}>
                            <option value='all'>Todos</option>
                            {divisionsData.map((item, index) => (
                                <>
                                    <option key={index} value={item.id}>{item.name}</option>
                                </>
                            ))}
                        </select>
                        <select onChange={handleSelectItem} value={selectValues.availability} name='availability' className={style.dropdownMenu}>
                            {Availabilities.map((item, index) => (
                                <option key={index} value={item.value}>{item.name}</option>
                            ))}
                        </select>
                    </div>

                    <SearchInput />
                </div>
                <div className={style.lotHandleActions}>
                    <button className={style.btnTaxes} onClick={() => alert('Editar juros')}><img src='/images/taxesIcon.svg' />Editar juros</button>
                    <button className={style.btnLot} onClick={() => alert('Cadastrar lote')}><img src='/images/plusIcon.svg' />Cadastrar lote</button>
                </div>
            </div>
            <div className={style.listsContainer}>
                <ul className={style.lotsList}>
                    {lotsData.map((lot) => (
                        <li className={style.lotsListItem}>
                            <div className={style.lotImage}>
                                <img src={lot.loteImages[0]?.imageUrl} alt="Imagem do lote" />
                            </div>
                            <div className={style.lotInfos}>
                                <div className={style.lotSpecs}>
                                    <span className={style.lotName}>{lot.name}</span>
                                    <span className={style.divName}>{divisionsData.find(division => division.id == lot.idLoteamento).name.substring(0, 20) + '...'}</span>
                                    <div className={style.location}>
                                        <span>
                                        <img src="/images/locationIcon.svg" />
                                            {lot.location.substring(0, 20) + '...'}
                                        </span>
                                        <span>
                                        <img src="/images/metricsIcon.svg" />

                                            {lot.metrics}
                                            <sup>2</sup>
                                        </span>
                                    </div>
                                </div>
                                <div className={style.lotPrice}>
                                    <p>R$ {lot.finalPrice}</p>
                                    <p>R$ {lot.basePrice}</p>
                                </div>
                                <button className={style.lotOptionsBtn} onClick={() => alert('Options')}>...</button>
                            </div>
                        </li>
                    ))}
                </ul>
                <ul className={style.divisionssList}>
                    
                </ul>
            </div>
        </section>
    )
}

export default Loteamentos