import React, { useState, useEffect, useMemo, useContext } from 'react'
import style from './style.module.scss'
import SearchInput from '../../../components/SearchInput'
import HeadingText from '../../../components/HeadingText'
import formatCurrency from '../../../helpers/formatCurrency'
import popUpsContext from '../../../context/popUpsContext'

export async function getStaticProps() {
    const divisionsData = await fetch('http://localhost:8080/divisions/list').then(res => res.json())
    return {
        props: { divisionsData }
    }
}
const Availabilities = [{ name: 'Disponível', value: 'avaible' }, { name: 'Indisponível', value: 'unavaible' }, { name: 'Reservado', value: 'reserved' }]

const Loteamentos = ({ divisionsData }) => {
    /* Contexts */
    const { popUps, setPopUps } = useContext(popUpsContext)
    /* States */
    const [selectValues, setSelectValues] = useState({
        division: 'all',
        availability: 'avaible',
    })
    const [lotsSearch, setLotsSearch] = useState('')
    const [divisionSearch, setDivisionSearch] = useState('')

    /* Memos */
    const divisions = useMemo(() =>{
        return divisionsData.flat()
    },[ divisionsData ])
    const lotsData = useMemo(() =>{
        return divisions.map((division) => division.lotes).flat()
    },[ divisions ])
    
    /* Handles */
    const handleSelectFilters = (e) => {
        setSelectValues(previousState => ({ ...previousState, [e.target.name]: e.target.value }))
    }
    const handlePopUps = (e) =>{
        setPopUps({...popUps, [e.target.name]: !popUps[e.target.name]})
    }       
    /* Side effects */

    // useEffect(() =>{
    //     console.log(popUps)
    // },[popUps])

    return (
        <section className={style.loteamentosContainer}>
            <div className={style.heading}>
                <HeadingText>Lotes e Loteamentos</HeadingText>
                <SearchInput value={divisionSearch} onChange={(e)=>setDivisionSearch(e.target.value)}/>
            </div>
            <div className={style.topActions}>
                <div className={style.lotFilters}>
                    <div className={style.dropdownsContainer}>
                        <select onChange={handleSelectFilters} value={selectValues.division} name='division' className={style.dropdownMenu}>
                            <option value='all'>Todos</option>
                            {divisionsData.map((item, index) => (
                                <>
                                    <option key={index} value={item.id}>{item.name}</option>
                                </>
                            ))}
                        </select>
                        <select onChange={handleSelectFilters} value={selectValues.availability} name='availability' className={style.dropdownMenu}>
                            {Availabilities.map((item, index) => (
                                <option key={index} value={item.value}>{item.name}</option>
                            ))}
                        </select>
                    </div>

                    <SearchInput value={lotsSearch} onChange={(e)=>setLotsSearch(e.target.value)} />
                </div>
                <div className={style.lotHandleActions}>
                    <button className={style.btnTaxes} onClick={() => alert('Editar juros')}><img src='/images/taxesIcon.svg' />Editar juros</button>
                    <button className={style.btnLot} onClick={handlePopUps} name='lotRegister'><img src='/images/plusIcon.svg' />Cadastrar lote</button>
                </div>
            </div>
            <div className={style.listsContainer}>
                <ul className={style.lotsList}>
                    {
                    lotsData
                    .filter(lotByDivision => lotByDivision.idLoteamento == (selectValues.division != 'all' ? selectValues.division : lotByDivision.idLoteamento))
                    .filter(lotByAvaibility => lotByAvaibility.isAvaible == selectValues.availability)
                    .filter(lotByName => lotByName.name.includes(lotsSearch))
                    .map((lot) => (
                        <li className={style.lotsListItem}>
                            <div className={style.lotImage}>
                                <img src={lot.loteImages[0]?.imageUrl} alt="Imagem do lote" />
                            </div>
                            <div className={style.lotInfos}>
                                <div className={style.lotSpecs}>
                                    <span className={style.lotName}>{lot.name}</span>
                                    <span className={style.divName}>{
                                    divisions.find(division => division.id == lot.idLoteamento).name.length > 20 ?
                                    divisions.find(division => division.id == lot.idLoteamento).name.substring(0, 20) + '...':
                                    divisions.find(division => division.id == lot.idLoteamento).name
                                    }</span>
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
                                    <p>{formatCurrency(lot.finalPrice)}</p>
                                    <p>{formatCurrency(lot.basePrice)}</p>
                                </div>
                                <button className={style.lotOptionsBtn} onClick={() => alert('Options')}>...</button>
                                <div className={style.lotViews} onClick={() => alert('Options')}>
                                    <span>{lot.userViews}</span>
                                    <img src="/images/viewIcon.svg" alt="Visualizações"/>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
                <div className={style.divisionsListContainer}>
                <h2>Loteamentos</h2>
                <ul className={style.divisionsList}>
                        {divisions.filter(divisionByName => divisionByName.name.includes(divisionSearch)).map((division, key) =>(
                            <li key={key}>
                                <img src={division.logoUrl} alt="logotipo" />
                                <div className={style.divInfo}>
                                    <p>{division.name.length > 25 ? division.name.substring(0, 25) + '...': division.name}</p>
                                    <span>{division.location.length > 25 ? division.location.substring(0, 25) + '...': division.location}</span>
                                </div>
                            </li>
                        ))}
                </ul>
                <button className={style.addDivisionBtn} onClick={() => alert('Cadastrar Loteamento')}><img src='/images/plusIcon-green.svg' /> Cadastrar Loteamento</button>
                </div>
            </div>
        </section>
    )
}

export default Loteamentos