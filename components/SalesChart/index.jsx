import React, { useEffect, useState } from 'react';
import { Chart } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { LinearScale, CategoryScale, PointElement, LineElement } from 'chart.js';

Chart.register(LinearScale, CategoryScale, PointElement, LineElement);

const SalesChart = ({ sales = [], periodOption }) => {
  const [chartData, setChartData] = useState({});

  const prepareChartData = () => {
    const currentDate = new Date();
    let allTimeData = [];
    let currentPeriodData = [];
    let previousPeriodData = [];

    sales.forEach((item) => {
      const saleDate = new Date(item.saleDate);

      allTimeData.push({ x: saleDate, y: item.salePrice });

      if (periodOption !== 0) {
        const currentPeriodStart = new Date(currentDate);
        currentPeriodStart.setDate(currentDate.getDate() - periodOption);
        const previousPeriodStart = new Date(currentDate);
        previousPeriodStart.setDate(currentDate.getDate() - periodOption * 2);

        if (saleDate >= currentPeriodStart) {
          currentPeriodData.push({ x: saleDate, y: item.salePrice });
        } else if (saleDate >= previousPeriodStart) {
          previousPeriodData.push({ x: saleDate, y: item.salePrice });
        }
      }
    });

    let selectedDataset;

    if (periodOption === 0) {
      selectedDataset = [
        {
          label: 'All Time',
          data: allTimeData,
          borderColor: 'blue',
          fill: false,
        },
      ];
    } else if (periodOption === 1) {
      selectedDataset = [
        {
          label: 'Current Period',
          data: currentPeriodData,
          borderColor: 'green',
          fill: false,
        },
      ];
    } else {
      selectedDataset = [
        {
          label: 'Previous Period',
          data: previousPeriodData,
          borderColor: 'red',
          fill: false,
        },
      ];
    }

    setChartData({ datasets: selectedDataset });
  };

  useEffect(() => {
    prepareChartData();
  }, [sales, periodOption]);

  return (
    <div>
      {chartData && Object.keys(chartData).length > 0 && (
        <Line
          key={JSON.stringify(chartData.datasets)}
          data={chartData}
            options={{
              scales: {
                x: [{
                  title: {text:'Dias'},
                  type: "time",
                  adapters: {
                    date: {
                      locale: 'pt',
                    },
                  },
                  time: {
                    unit: "day",
                    unitStepSize: 1000,
                    displayFormats: {
                        millisecond: 'MMM DD',
                        second: 'MMM DD',
                        minute: 'MMM DD',
                        hour: 'MMM DD',
                        day: 'MMM DD',
                        week: 'MMM DD',
                        month: 'MMM DD',
                        quarter: 'MMM DD',
                        year: 'MMM DD',
                    },
                  }
                }],
                y: {
                  beginAtZero: true,
                },
              },
              plugins: {
                legend: {
                  display: periodOption === 0,
                },
              },
            }}
          />
        )}
      </div>
    );
  };

  export default SalesChart;
