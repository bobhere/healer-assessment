import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import type { DimensionResult } from '../utils/scoring';
import { dimensionMetas } from '../data/questions';

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

interface QuadrantChartProps {
  results: DimensionResult[];
  benchmark: number;
}

export const QuadrantChart = ({ results, benchmark }: QuadrantChartProps) => {
  const dataset = results.map((result) => {
    const meta = dimensionMetas.find((item) => item.key === result.key);
    const gap = benchmark - result.score;
    return {
      x: Math.max(gap, 0),
      y: result.score,
      label: meta?.label ?? result.key,
    };
  });

  return (
    <div className="viz-card">
      <div className="viz-card__header">
        <p className="summary-label">差距象限</p>
        <span>X: 与标杆差距 · Y: 当前得分</span>
      </div>
      <Scatter
        data={{
          datasets: [
            {
              label: '维度',
              data: dataset,
              backgroundColor: 'rgba(155,93,229,0.6)',
              pointRadius: 6,
              pointHoverRadius: 8,
            },
          ],
        }}
        options={{
          scales: {
            x: {
              title: { display: true, text: '差距分' },
              grid: { color: '#f0eef7' },
            },
            y: {
              suggestedMin: 0,
              suggestedMax: 100,
              title: { display: true, text: '当前得分' },
              grid: { color: '#f0eef7' },
            },
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const point = context.raw as { x: number; y: number; label: string };
                  return `${point.label}: 得分 ${point.y} / 差距 ${point.x}`;
                },
              },
            },
          },
        }}
      />
    </div>
  );
};
