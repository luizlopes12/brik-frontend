import React, { useEffect, useState } from "react";
import { Chart } from "chart.js";
import { Line } from "react-chartjs-2";
import {
  LinearScale,
  CategoryScale,
  PointElement,
  LineElement,
} from "chart.js";

Chart.register(LinearScale, CategoryScale, PointElement, LineElement);

const SalesChart = ({ periodOption, chartData, type, componentRef }) => {
  const data = {
    labels: chartData.map(
      (item) => `${periodOption.value == 0 ? item.month : item.day}`
    ),
    datasets: [
      {
        label: "Vendas",
        data: chartData.map((item) => item.salesQuantity),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const sales = chartData[context.dataIndex].sumOfSales;
            return `Sum of Sales: ${sales}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Quantidade",
        },
      },
      x: {
        title: {
          display: true,
          text: "Histórico de Vendas",
        },
      },
    },
    maintainAspectRatio: false, // Add this line
  };

  return (
    <div
      style={{ width: "100%", height: type == "overview" ? 250 : 200 }}
      ref={componentRef}
    >
      <Line data={data} options={options} />
    </div>
  );
};

export default SalesChart;
