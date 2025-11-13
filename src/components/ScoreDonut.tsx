import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { dimensionMetas } from '../data/questions';
import type { DimensionResult } from '../utils/scoring';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ScoreDonutProps {
  results: DimensionResult[];
}

export const ScoreDonut = ({ results }: ScoreDonutProps) => {
  const total = results.reduce((sum, item) => sum + Math.max(item.score, 0), 0) || 1;
  const data = {
    labels: dimensionMetas.map((meta) => meta.label),
    datasets: [
      {
        data: dimensionMetas.map((meta) => {
          const score = results.find((item) => item.key === meta.key)?.score ?? 0;
          return Math.max(score, 0);
        }),
        backgroundColor: [
          '#9b5de5',
          '#f15bb5',
          '#fee440',
          '#00bbf9',
          '#00f5d4',
          '#ff9f1c',
        ],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="viz-card">
      <div className="viz-card__header">
        <p className="summary-label">能力占比</p>
        <span>总分 {total}</span>
      </div>
      <div className="donut-wrapper">
        <Doughnut
          data={data}
          options={{
            cutout: '65%',
            plugins: {
              legend: { display: false },
            },
          }}
        />
        <div className="donut-center">
          <strong>能力构成</strong>
          <span>六维均衡度</span>
        </div>
      </div>
      <ul className="donut-legend">
        {dimensionMetas.map((meta) => {
          const score = results.find((item) => item.key === meta.key)?.score ?? 0;
          return (
            <li key={meta.key}>
              <span className="dot" style={{ backgroundColor: meta.color }} />
              {meta.label}
              <strong>{score}</strong>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
