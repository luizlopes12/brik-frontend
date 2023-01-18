import React,{useState,useEffect} from 'react'
import style from './style.module.scss'
import SearchInput from '../../../components/SearchInput'
import HeadingText from '../../../components/HeadingText'

export async function getStaticProps(){
    const divisionsData = await fetch('http://localhost:8080/divisions/list').then(res => res.json())
    return{
        props: { divisionsData }
    }
}

const Loteamentos = ({ divisionsData }) => {
    console.log(divisionsData)
  const Availabilities = [{name:'Disponível', value: 'avaible'}, {name:'Indisponível', value: 'unavaible'},{name:'Reservado', value: 'reserved'}]
  const [selectValues, setSelectValues] = useState({
    division: 'all',
    availability: 'avaible'
  })
  useEffect(() =>{
      console.log(selectValues)
  },[selectValues])
  const handleSelectItem = (e) =>{
      setSelectValues(previousState =>({...previousState, [e.target.name]: e.target.value}))
  }

  return (
    <section className={style.loteamentosContainer}>
        <div className={style.heading}>
            <HeadingText>Lotes e Loteamentos</HeadingText>
            <SearchInput/>
        </div>
        <div className={style.topActions}>
            <div className={style.lotFilters}>
              <div className={style.dropdownsContainer}>
              <select onChange={handleSelectItem} value={selectValues.division} name='division' className={style.dropdownMenu}> 
                  {divisionsData.map((item, index) =>( 
                      <>
                      <option selected value='all' >Todos</option>
                      <option key={index} value={item.id}>{item.name}</option>
                    </>
                  ))}
              </select>
              <select onChange={handleSelectItem} value={selectValues.availability} name='availability' className={style.dropdownMenu}> 
                  {Availabilities.map((item, index) =>( 
                      <option key={index} value={item.value}>{item.name}</option>
                  ))}
              </select>
              </div>

              <SearchInput/>
            </div>
            <div className={style.lotHandleActions}>
                <button className={style.btnTaxes}><img  src='/images/taxesIcon.svg'/>Editar juros</button>
                <button className={style.btnLot}><img  src='/images/plusIcon.svg'/>Cadastrar lote</button>
            </div>
        </div>
    </section>
  )
}

export default Loteamentos