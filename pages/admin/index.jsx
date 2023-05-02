import React,{ useState, useContext, useMemo, useRef,useEffect } from 'react'
import style from './style.module.scss'
import HeadingText from '../../components/HeadingText'
import { globalDivisionsDataContext } from '../../context/globalDivisionsDataContext.jsx'
import SalesChart from '../../components/SalesChart';
import { popUpsContext } from '../../context/popUpsContext.jsx'
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from 'xlsx';
import nextCookies from "next-cookies";


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
        divisionsData,
        token,
        refreshToken,
      },
    };
  } catch (error) {
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

const Admin = ({ salesData, globalDivisionsDataFetched, salesSummary, divisionsData }) => {
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
    <SalesChart periodOption={periodOption} type={'overview'} chartData={salesSummaryToShow} componentRef={currentChartRef}/>
    </div>
  )
}

export default Admin