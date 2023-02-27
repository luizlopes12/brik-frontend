import React,{ useState } from 'react'
import style from './style.module.scss'
import HeadingText from '../../../components/HeadingText'

export async function getStaticProps() {
  let salesData = [];
  try {
    salesData = await fetch('http://localhost:8080/sales/list').then(res => res.json())
    console.log(salesData)
  } catch (error) {
    salesData = []
  }
  return {
      props: { salesData }
  }
}
const periods = [{value: 30, label: '1 mês'},{value: 15, label: '15 dias'},{value: 0, label: 'Todo o período'}]
const Vendas = ({salesData}) => {
  const [ periodOption, setPeriodOption ] = useState(periods[0])
  const handleGenerateReport = () => {
    alert('Gerar relatório')
  }
  const handleChangePeriod = (e) => {
    const option = periods.findIndex(period => period.value === Number(e.target.value))
    setPeriodOption(periods[option+1>2?0:option+1])
  }
  
  return (
    <div className={style.soldsContainer}>
    <div className={style.heading}>
          <HeadingText>Vendas</HeadingText>
          <div className={style.subHeading}>
            <span>Estatísticas e métricas</span>
            <div className={style.headerBtns}>
              <button onClick={(e)=>handleChangePeriod(e)} className={style.changePeriod} value={periodOption.value}>{periodOption.label} <img src='/images/calendarIcon.svg' /></button>
              <button onClick={handleGenerateReport} className={style.generateReport}>Gerar relatório <img src='/images/reportIcon.svg' /></button>
            </div>
          </div>
          {/* Adicionar gráfico de vendas */}
    </div>
    
    </div>
  )
}

export default Vendas