import React,{ useState, useContext, useMemo, useRef,useEffect } from 'react'
import style from './style.module.scss'
import HeadingText from '../../components/HeadingText'
import { globalDivisionsDataContext } from '../../context/globalDivisionsDataContext.jsx'
import SalesChart from '../../components/SalesChart';
import Link from 'next/link';
import nextCookies from 'next-cookies';

const periods = [{value: 30, label: '1 mês'},{value: 15, label: '15 dias'},{value: 0, label: '1 Ano'}]


export async function getServerSideProps(context) {
  const cookies = nextCookies(context);
    const { token, refreshToken } = cookies;

  if (!token && !refreshToken) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  try {
    const divisionsData = await fetch(`${process.env.BACKEND_URL_LOCAL}/divisions/list`).then(res => res.json())
    const salesRes = await fetch(`${process.env.BACKEND_URL_LOCAL}/sales/list`);
    const salesData = await salesRes.json();
    const summaryRes = await fetch(`${process.env.BACKEND_URL_LOCAL}/sales/resume`);
    const salesSummary = await summaryRes.json();
    const divisionsRes = await fetch(`${process.env.BACKEND_URL_LOCAL}/divisions/list`);
    const globalDivisionsDataFetched = await divisionsRes.json();
    const overViewRes = await fetch(`${process.env.BACKEND_URL_LOCAL}/sales/overview`);
    const overViewData = await overViewRes.json();



    return {
      props: {
        salesSummary,
        divisionsData,
        token,
        refreshToken,
        overViewData,
      },
    };
  } catch (error) {
    return {
      props: {
        salesSummary: [],
        divisionsData: [],
        overViewData: [],
      },
    };
  }
}

const Admin = ({ salesSummary, divisionsData, overViewData }) => {
  const currentChartRef = useRef(null)
  const { globalDivisionsData, setGlobalDivisionsData } = useContext(globalDivisionsDataContext)
  setGlobalDivisionsData(divisionsData)
  const [ periodOption, setPeriodOption ] = useState(periods[2])
  const salesSummaryToShow = useMemo(() => {
    if(periodOption.value == 0) {
      return salesSummary.monthlySummary?.slice(-12)
    }else{
      return salesSummary.dailySummary?.slice(-periodOption.value)
    }
  }, [salesSummary, periodOption])
  return (
    <div className={style.overviewContainer}>
    <div className={style.heading}>
          <HeadingText>Overview</HeadingText>
    </div>
    <ul className={style.periodInfo}>
      <li className={style.lotsPeriod}>
        <span className={style.header}>
        <img src={'/images/houseIcon.svg'} alt="Lotes" /> Lotes
        </span>
        <span className={style.info}>
        <b>{overViewData.lots.lotsQuantity}</b> <label>Cadastros no <br/>último mês</label>
        </span>
        <span className={style.showMore}>
          <hr /> <Link href='/admin/loteamentos'>Ver mais detalhes</Link>
        </span>
      </li>
      <li className={style.divisionsPeriod}>
      <span className={style.header}>
        <img src={'/images/divisionsIcon.svg'} alt="Lotes" /> Loteamentos
        </span>
        <span className={style.info}>
        <b>{overViewData.divisions.divisionsQuantity}</b> <label>Cadastros no <br/>último mês</label>
        </span>
        <span className={style.showMore}>
          <hr /> <Link href='/admin/loteamentos'>Ver mais detalhes</Link>
        </span>
</li>
<li className={style.salesPeriod}>
<span className={style.header}>
        <img src={'/images/salesIcon.svg'} alt="Lotes" /> Vendas
        </span>
        <span className={style.info}>
        <b>{overViewData.sales.salesQuantity}</b> <label>Cadastros no <br/>último mês</label>
        </span>
        <span className={style.showMore}>
          <hr /> <Link href='/admin/vendas'>Ver mais detalhes</Link>
        </span>
</li>
    </ul>
    <SalesChart periodOption={periodOption} type={'overview'} chartData={salesSummaryToShow} componentRef={currentChartRef}/>
    </div>
  )
}

export default Admin