import { Chart } from 'react-google-charts';
import React, { useMemo } from 'react';

const SalesChart = ({ sales, salesFiltered, periodOption }) => {

  const saleDataToGraphic = useMemo(() => {
      const countsByMonthYear = salesFiltered.reduce((counts, item) => {
        const monthYear = item.saleDate.substr(0, 7);
        counts[monthYear] = (counts[monthYear] || 0) + 1;
        return counts;
      }, {});
      console.log(countsByMonthYear)
    
      const counts = Object.values(countsByMonthYear);
      let countsWithPeriod;
      if (periodOption.value === 0) {
        countsWithPeriod = Object.entries(countsByMonthYear).map(([monthYear, count], index) => [`${monthYear.substr(5, 2)}/${monthYear.substr(0, 4)}`, count, 1]);
        
      } else if (periodOption.value === 30) {
        countsWithPeriod = counts.map((count, index) => [index + 1, count, 1]);
      } else if (periodOption.value === 15) {
        countsWithPeriod = [
          ...counts.map((count, index) => [index + 1, count, 1]),
          [counts.length + 1, 0, 0],
          [counts.length + 2, 0, 0],
        ];
      } else {
        countsWithPeriod = [];
      }
    
      return countsWithPeriod.reverse();
    }, [sales, salesFiltered, periodOption]);
    

  const xAxisTitle = periodOption.value === 0 ? 'Mês/Ano' : `Dia/Mês (0 a ${periodOption.value})`;

  return (
    <Chart
      width={'100%'}
      height={'300px'}
      chartType="LineChart"
      loader={<div>Loading...</div>}
      data={[
        [xAxisTitle, 'Vendas', { role: 'style' }],
        ...saleDataToGraphic,
      ]}
      options={{
        hAxis: {
          title: xAxisTitle,
          scaleType: 'date',
          format: periodOption.value === 0 ? 'MM/yyyy' : 'DD/MM',
        },
        vAxis: {
          title: 'Vendas',
        },
        legend: { position: 'none' },
        colors: ['#8BC600'],
      }}
    />
  );
}

  
  export default SalesChart;
  
