import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler
);

const WeatherChart = () => {
  const hours = ['Now', '23:00', '01:00', '03:00', '05:00'];
  const temperatures = [33, 32, 31, 30, 29];

  const data = {
    labels: hours,
    datasets: [
      {
        fill: true,
        label: 'Temperature',
        data: temperatures,
        borderColor: 'rgba(255, 255, 255, 0.8)',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: 'white',
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        display: false,
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)',
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="bg-white/5 rounded-xl p-4">
      <Line data={data} options={options} />
    </div>
  );
};

export default WeatherChart;