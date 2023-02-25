import React from 'react'
import style from './style.module.scss'
import HeadingText from '../../../components/HeadingText'
import Utils from 'chartjs';

export async function getStaticProps() {
  let salesData = [];
  try {
    salesData = await fetch('http://localhost:8080/sales/list').then(res => res.json())
  } catch (error) {
    salesData = []
  }
  return {
      props: { salesData }
  }
}
const Vendas = () => {
  const labels = Utils.months({count: 7});
  const data = {
    labels: labels,
    datasets: [{
      label: 'My First Dataset',
      data: [65, 59, 80, 81, 56, 55, 40],
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };
  const config = {
    type: 'line',
    data: data,
  };

  return (
    <div className={style.soldsContainer}>
    <div className={style.heading}>
          <HeadingText>Vendas</HeadingText>

    </div>
    
    </div>
  )
}

export default Vendas