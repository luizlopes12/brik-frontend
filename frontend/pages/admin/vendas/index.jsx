import React,{ useState, useContext, useMemo, useRef,useEffect } from 'react'
import style from './style.module.scss'
import HeadingText from '../../../components/HeadingText'
import { globalDivisionsDataContext } from '../../../context/globalDivisionsDataContext.jsx'
import SalesChart from '../../../components/SalesChart';

const periods = [{value: 30, label: '1 mês'},{value: 15, label: '15 dias'},{value: 0, label: 'Todo o período'}]
const Vendas = ({}) => {
  const [salesData, setSalesData] = useState([])
  const [globalDivisionsDataFetched, setGlobalDivisionsDataFetched] = useState([])
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetch('https://brik-backend.herokuapp.com/sales/list')
        .then(res => res.json())
        .then(data => setSalesData(data))
        .catch(error => console.log(error))
    }, 10000)

    fetch('https://brik-backend.herokuapp.com/divisions/list').then(res => res.json()).catch(error => console.log(error))
    .finally((data) => {
      setGlobalDivisionsDataFetched(data)
    })

    return () => clearInterval(intervalId)
  }, [])

  const { globalDivisionsData, setGlobalDivisionsData } = useContext(globalDivisionsDataContext)
  const [ divisions, setDivisions ] = useState(globalDivisionsData.length > 0 ? globalDivisionsData : globalDivisionsDataFetched)
  const [ periodOption, setPeriodOption ] = useState(periods[0])
  const [ showSaleParcels, setShowSaleParcels ] = useState({
    id: null,
    visible: false
  })

  

  const [ sales, setSales ] = useState(salesData)
  const btnShowParcelsRef = useRef()
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
  const handleShowSaleParcels = (saleId) => {
    setShowSaleParcels((prev) => {
      prev.id == saleId ? prev.visible = !prev.visible : prev.visible = !prev.visible
      return {
        id: saleId,
        visible: prev.visible
      }
    })
  }
  const dateFormat = (parcelDate) =>{
    var date = new Date(parcelDate),
        day  = (date.getDate()+1).toString(),
        dayF = (day.length == 1) ? '0'+ day : day,
        month  = (date.getMonth()+1).toString(), //+1 pois no getMonth Janeiro começa com zero.
        monthF = (month.length == 1) ? '0'+month : month,
        yearF = date.getFullYear();
      return dayF+"/"+monthF+"/"+yearF;
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
          <SalesChart sales={sales} salesFiltered={salesFiltered} periodOption={periodOption} />
    </div>
    <section className={style.salesListContainer}>
    <h2 className={style.salesTableTitle}>Histórico de vendas</h2>
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
              <span className={style.saleLotName}>{sale.lotes.name}</span>
              <span>{
                  divisions.map(division => division.lotes.find(lote => lote.id == sale.lotes.id) && division.name)
              }</span>
              <span><div className={style.statusBall} data-status={sale.status}></div>{sale.status}</span>
              <span>{sale.partnersValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
              <span>{((sale.commission/100)*(sale.salePrice/100)).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
              <span>{(sale.salePrice/100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
              <button className={style.showSaleParcels} data-visibility={showSaleParcels.id == sale.id && showSaleParcels.visible ? 'true' : 'false'}  onClick={() => handleShowSaleParcels(sale.id)} ref={btnShowParcelsRef}>
  <img src="/images/arrowDownIcon.svg"/>
</button>
            </div>


<div className={style.saleParcelsContainer} data-visibility={showSaleParcels.id == sale.id && showSaleParcels.visible ? 'true' : 'false'} >

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
              dateFormat(parcel.expireDate)
              }
              </span>
              <span>
              {
              dateFormat(parcel.createdAt)
              }
              </span>
              <span>
                {
                  parcel.status == 'expired' ? 'Em atraso' :(
                    parcel.status == 'paid' ? 'Pago' : 'Pendente'
                  )

                }
                
                </span>
              <span>
                <a className={style.parcelLink} href={parcel.billetLink}><img src='/images/goToPage.svg'/>Abrir</a>
              </span>
              <span>
                <a className={style.parcelPdf} href={parcel.billetPdf}><img src='/images/reportIcon.svg'/>Abrir</a>
              </span>
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