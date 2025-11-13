import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import type { DimensionResult } from '../utils/scoring';
import { dimensionMetas } from '../data/questions';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface ScoreBarsProps {
  results: DimensionResult[];
}

const benchmark = 82;

export const ScoreBars = ({ results }: ScoreBarsProps) => {
  const labels = dimensionMetas.map((dimension) => dimension.label);
  const data = {
    labels,
    datasets: [
      {
        label: '当前得分',
        data: dimensionMetas.map((dimension) => {
          const result = results.find((item) => item.key === dimension.key);
          return result?.score ?? 0;
        }),
        backgroundColor: 'rgba(155, 93, 229, 0.85)',
        borderRadius: 12,
        borderSkipped: false,
      },
      {
        label: '高客单标杆',
        data: Array(labels.length).fill(benchmark),
        backgroundColor: 'rgba(0, 245, 212, 0.45)',
        borderRadius: 12,
        borderSkipped: false,
      },
    ],
  };

  return (
    <div className="bar-card">
      <div className="bar-card__header">
        <div>
          <p className="summary-label">维度对比</p>
          <h4>当前表现 vs 行业标杆</h4>
        </div>
        <span>标杆值 {benchmark} 分</span>
      </div>
      <Bar
        data={data}
        options={{
          indexAxis: 'y',
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom',
            },
          },
          scales: {
            x: {
              min: 0,
              max: 100,
              grid: { color: '#f0eef7' },
            },
            y: {
              grid: { display: false },
            },
          },
        }}
      />
    </div>
  );
};
