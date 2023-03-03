import React,{ useState, useContext, useMemo, useRef } from 'react'
import style from './style.module.scss'
import HeadingText from '../../../components/HeadingText'
import { globalDivisionsDataContext } from '../../../context/globalDivisionsDataContext.jsx'
import formatCurrency from '../../../helpers/formatCurrency'

export async function getStaticProps() {
  let salesData = [];
  let globalDivisionsDataFetched = [];
  try {
    salesData = await fetch('http://localhost:8080/sales/list').then(res => res.json())
    globalDivisionsDataFetched = await fetch('http://localhost:8080/divisions/list').then(res => res.json())
  } catch (error) {
    salesData = []
  }
  return {
      props: { salesData, globalDivisionsDataFetched }
  }
}
const periods = [{value: 30, label: '1 mês'},{value: 15, label: '15 dias'},{value: 0, label: 'Todo o período'}]
const Vendas = ({salesData, globalDivisionsDataFetched}) => {
  const { globalDivisionsData, setGlobalDivisionsData } = useContext(globalDivisionsDataContext)
  const [ divisions, setDivisions ] = useState(globalDivisionsData.length > 0 ? globalDivisionsData : globalDivisionsDataFetched)
  const [ periodOption, setPeriodOption ] = useState(periods[0])
  const [ sales, setSales ] = useState(salesData)
  const showSaleParcelsRef = useRef()
  const saleParcelsContainerRef = useRef()
  const handleGenerateReport = () => {
    alert('Gerar relatório')
  }
  const salesFiltered = useMemo(() => {
    if(periodOption.value === 0) return sales;
    const today = new Date();
    let daysAgo = periodOption.value;
    const dateRange = new Date();
    dateRange.setDate(today.getDate() - daysAgo);
    const filteredSales = sales.filter(sale => new Date(sale.saleDate) >= dateRange);
    return filteredSales;
  }, [periodOption, sales]);

  const handleChangePeriod = (e) => {
    const option = periods.findIndex(period => period.value === Number(e.target.value))
    setPeriodOption(periods[option+1>2?0:option+1])
  }
  sales.map(sale => {
      let valuePaid = sale.parcelas.reduce((parcelPrev, parcelNext) => {
        let prev = parcelPrev.value ? parcelPrev.value : 0
        let next = parcelNext.value ? parcelNext.value : 0
        return prev + next
      })
      let percentage = sale.lotes.lotePartners.reduce((partnerPrev, partnerNext ) => {
        let percentage = 0
        let prev = partnerPrev.percentage ? partnerPrev.percentage : 0
        let next = partnerNext.percentage ? partnerNext.percentage : 0
        percentage = (prev + next) / 100
        return percentage
    }, 0)
    sale.partnersValue = (valuePaid * percentage)
  })
  const handleShowSaleParcels = (e) => {
    showSaleParcelsRef.current.classList.toggle(style.active)
    const saleId = saleParcelsContainerRef.current.getAttribute('data-key')
    if (e.target.value === saleId) {
      saleParcelsContainerRef.current.classList.add(style.active)
    } else {
      saleParcelsContainerRef.current.classList.remove(style.active)
    }
  }
  console.log(sales[0].parcelas[0])
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
    <section className={style.salesListContainer}>
      <ul className={style.salesList}>
        <li>
          <div className={style.salesListHeading}>
            <span>Lote</span>
            <span>Loteamento</span>
            <span>Status</span>
            <span>Rateio</span>
            <span>Comissão</span>
            <span>Preço de venda</span>
          </div>
        </li>
        {salesFiltered.map(sale => (
          <li key={sale.id} className={style.saleItem}>
            <div className={style.salesListItem}>
              <span>{sale.lotes.name}</span>
              <span>{
                  divisions.map(division => division.lotes.find(lote => lote.id == sale.lotes.id) && division.name)
              }</span>
              <span><div className={style.statusBall} data-status={sale.status}></div>{sale.status}</span>
              <span>{sale.partnersValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
              <span>{((sale.commission/100)*(sale.salePrice/100)).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
              <span>{(sale.salePrice/100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
              <button className={style.showSaleParcels} ref={showSaleParcelsRef} onClick={handleShowSaleParcels} data-id={sale.id}>
  <img src="/images/arrowDownIcon.svg"/>
</button>
            </div>


<div className={style.saleParcelsHidden} data-key={sale.id} ref={saleParcelsContainerRef}>

  <ul className={style.saleParcelsList}>
  <li className={style.parcelsListHeading}>
            <span>Vencimento</span>
            <span>Data de criação</span>
            <span>Status</span>
            <span>Link</span>
            <span>PDF</span>
            <span>Valor</span>
          </li>
           {
            sale.parcelas.map(parcel => (
              <li key={parcel.id} className={style.saleParcelItem}>
              <span>
              {
              (new Date(parcel.expireDate).getDay() + 1).toString().padStart(2,'0')+ '/' +
              (new Date(parcel.expireDate).getMonth() + 1 ).toString().padStart(2,'0') + '/' +
              (new Date(parcel.expireDate).getFullYear()).toString() 
              }
              </span>
              <span>
              {
              (new Date(parcel.createdAt).getDay() + 1).toString().padStart(2,'0')+ '/' +
              (new Date(parcel.createdAt).getMonth() + 1 ).toString().padStart(2,'0') + '/' +
              (new Date(parcel.createdAt).getFullYear()).toString() 
              }
              </span>
              <span>{parcel.status}</span>
              <span></span>
              <span></span>
              <span>{(parcel.value/100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>


              </li>
            ))
           }   

    
  </ul>
</div>
          </li>
        ))}
      </ul>
    </section>
    </div>
  )
}

export default Vendas