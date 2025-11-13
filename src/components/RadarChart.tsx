import { useMemo } from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  LineElement,
  PointElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import type { DimensionResult } from '../utils/scoring';
import { dimensionMetas } from '../data/questions';

ChartJS.register(RadialLinearScale, LineElement, PointElement, Filler, Tooltip, Legend);

interface RadarChartProps {
  results: DimensionResult[];
}

export const RadarChart = ({ results }: RadarChartProps) => {
  const chartData = useMemo(() => {
    const labels = dimensionMetas.map((dimension) => dimension.label);
    const data = dimensionMetas.map((dimension) => {
      const result = results.find((item) => item.key === dimension.key);
      return result?.score ?? 0;
    });

    return {
      labels,
      datasets: [
        {
          label: '综合表现',
          data,
          backgroundColor: 'rgba(155, 93, 229, 0.2)',
          borderColor: '#9b5de5',
          borderWidth: 2,
          pointBackgroundColor: '#9b5de5',
        },
      ],
    };
  }, [results]);

  return (
    <div className="radar-card">
      <h3>能力雷达图</h3>
      <Radar
        data={chartData}
        options={{
          scales: {
            r: {
              suggestedMin: 0,
              suggestedMax: 100,
              ticks: { stepSize: 20, backdropColor: 'transparent' },
              grid: { color: 'rgba(0,0,0,0.1)' },
            },
          },
          plugins: {
            legend: { display: false },
          },
          responsive: true,
        }}
      />
    </div>
  );
};
