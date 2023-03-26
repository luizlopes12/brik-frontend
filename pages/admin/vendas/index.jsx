import React,{ useState, useContext, useMemo, useRef,useEffect } from 'react'
import style from './style.module.scss'
import HeadingText from '../../../components/HeadingText'
import { globalDivisionsDataContext } from '../../../context/globalDivisionsDataContext.jsx'
import SalesChart from '../../../components/SalesChart';
import { popUpsContext } from '../../../context/popUpsContext.jsx'
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from 'xlsx';


const periods = [{value: 30, label: '1 mês'},{value: 15, label: '15 dias'},{value: 0, label: '1 Ano'}]
export async function getServerSideProps() {
  try {
    const divisionsData = await fetch(`${process.env.BACKEND_URL}/divisions/list`).then(res => res.json())
    const salesRes = await fetch(`${process.env.BACKEND_URL}/sales/list`);
    const salesData = await salesRes.json();
    const summaryRes = await fetch(`${process.env.BACKEND_URL}/sales/resume`);
    const salesSummary = await summaryRes.json();
    const divisionsRes = await fetch(`${process.env.BACKEND_URL}/divisions/list`);
    const globalDivisionsDataFetched = await divisionsRes.json();

    return {
      props: {
        salesData,
        globalDivisionsDataFetched,
        salesSummary,
        divisionsData
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        salesSummary: [],
        salesData: [],
        globalDivisionsDataFetched: [],
        divisionsData: []
      },
    };
  }
}

const Vendas = ({ salesData, globalDivisionsDataFetched, salesSummary, divisionsData }) => {
  const { popUps, setPopUps } = useContext(popUpsContext)
  const { globalDivisionsData, setGlobalDivisionsData } = useContext(globalDivisionsDataContext)
  setGlobalDivisionsData(divisionsData)
  const [ divisions, setDivisions ] = useState(globalDivisionsData.length > 0 ? globalDivisionsData : globalDivisionsDataFetched)
  const [ periodOption, setPeriodOption ] = useState(periods[2])
  const [ showSaleParcels, setShowSaleParcels ] = useState({
    id: null,
    visible: false
  })

  const sales = useMemo(() => salesData, [salesData])
  const btnShowParcelsRef = useRef()
  const currentChartRef = useRef()


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
    let partnersValueHelper = ((valuePaid * percentage)/sale.parcelas.filter(parcel => parcel.status == 'paid').length)
    sale.partnersValue = partnersValueHelper
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
  const salesSummaryToShow = useMemo(() => {
    if(periodOption.value == 0) {
      return salesSummary.monthlySummary?.slice(-12)
    }else{
      return salesSummary.dailySummary?.slice(-periodOption.value)
    }
  }, [salesSummary, periodOption])

  const dateFormat = (parcelDate) =>{
    var date = new Date(parcelDate),
        day  = (date.getDate()+1).toString(),
        dayF = (day.length == 1) ? '0'+ day : day,
        month  = (date.getMonth()+1).toString(), //+1 pois no getMonth Janeiro começa com zero.
        monthF = (month.length == 1) ? '0'+month : month,
        yearF = date.getFullYear();
      return dayF+"/"+monthF+"/"+yearF;
  }
  const handleRegisterSale = () => {
    console.log('Cadastrar venda')
    setPopUps((prevState) => ({ ...prevState, registerSale: true }))
  }
  console.log('sales', sales)
  const handleGenerateExcelReport = () => {
    const data = sales.map(sale => {
      return {
        "Cliente": sale.users.name, 
        "CPF/CNPJ": sale.users.CPF, 
        "Email": sale.users.email, 
        "Lote": sale.lotes.name, 
        "Preço inicial": (sale.salePrice/100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
        "Valor entrada": (sale.entryValue/100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
        "Valor pago": (sale.parcelas.reduce((acc, curr) => {
          let value;
          if (curr.status === 'paid' || curr.status === 'up_to_date') {
            value = acc + curr.value;
          } else {
            value = acc;
          }
          return value
        }, 0)/100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
        "Data da venda": dateFormat(sale.saleDate),
        
      
      }
    })
  
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Relatório de vendas');
      XLSX.utils.book_append_sheet(wb, ws, 'Relatório de rateio');

      // Generate the Excel file and save it as a Blob
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([wbout], { type: 'application/octet-stream' });
  
      // Create a link to download the file and trigger the download
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'relatorio_excel.xlsx';
      link.click();

    }
    const handleGenerateReport = () => {
      // Create a new PDF document
      const pdf = new jsPDF();
    
      // Save and download the blank PDF
      pdf.save("relatorio_pdf.pdf");
    };
    
  return (
    <div className={style.soldsContainer}>
    <div className={style.heading}>
          <HeadingText>Vendas</HeadingText>
          <div className={style.subHeading}>
            <span>Estatísticas e métricas</span>
            <div className={style.headerBtns}>
              <button onClick={(e)=>handleChangePeriod(e)} className={style.changePeriod} value={periodOption.value}>{periodOption.label} <img src='/images/calendarIcon.svg' /></button>
              <button onClick={handleGenerateReport} className={style.generateReport}>Gerar PDF <img src='/images/reportIcon.svg' /></button>
              <button onClick={handleGenerateExcelReport} className={style.generateReport}>Gerar Excel <img src='/images/fileIcon.svg' /></button>
            </div>
          </div>
          {/* Adicionar gráfico de vendas */}
          <SalesChart periodOption={periodOption} chartData={salesSummaryToShow} componentRef={currentChartRef}/>
    </div>
    <section className={style.salesListContainer}>
      <div className={style.salesTableHeading}>
        <h2 className={style.salesTableTitle}>Histórico de vendas</h2>
        <button onClick={handleRegisterSale} className={style.newSaleBtn}>Cadastrar Venda<img src='/images/saleIcon.svg' /></button>
      </div>
      <ul className={style.salesList}>
        <li>
          <div className={style.salesListHeading}>
            <span>Lote</span>
            <span>Loteamento</span>
            <span>Status</span>
            <span>Rateio(total)</span>
            <span>Comissão</span>
            <span>Preço de venda</span>
          </div>
        </li>
        {salesFiltered && salesFiltered.map(sale => (
          <li key={sale.id} className={style.saleItem}>
            <div className={style.salesListItem}>
              <span className={style.saleLotName}>{sale.lotes.name}</span>
              <span>{
                  divisions && divisions.map(division => division.lotes.find(lote => lote.id == sale.lotes.id) && division.name)
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
                <a className={style.parcelLink} href={parcel.billetLink} target='_blank'><img src='/images/goToPage.svg'/>Abrir</a>
              </span>
              <span>
                <a className={style.parcelPdf} href={parcel.billetPdf} target='_blank'><img src='/images/reportIcon.svg'/>Abrir</a>
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