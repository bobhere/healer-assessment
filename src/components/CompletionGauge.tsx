import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface CompletionGaugeProps {
  completion: number;
  average: number;
  highest: number;
}

export const CompletionGauge = ({ completion, average, highest }: CompletionGaugeProps) => {
  const data = {
    labels: ['完成度', '未完成'],
    datasets: [
      {
        data: [completion, Math.max(0, 100 - completion)],
        backgroundColor: ['#00f5d4', '#ede9fb'],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="gauge-card">
      <div className="gauge-header">
        <p className="summary-label">答卷进度</p>
        <span>平均得分 {average} · 最高维度 {highest} 分</span>
      </div>
      <div className="gauge-body">
        <div className="gauge-chart">
          <Doughnut
            data={data}
            options={{
              cutout: '70%',
              plugins: { legend: { display: false }, tooltip: { enabled: false } },
            }}
          />
          <div className="gauge-center">
            <strong>{completion}%</strong>
            <span>完成度</span>
          </div>
        </div>
        <ul className="gauge-meta">
          <li>
            <p>答题量</p>
            <strong>{completion >= 100 ? '已完成' : '进行中'}</strong>
          </li>
          <li>
            <p>数据可信度</p>
            <strong>{completion >= 80 ? '高' : completion >= 60 ? '中' : '待补充'}</strong>
          </li>
          <li>
            <p>下一次复盘</p>
            <strong>7 天内</strong>
          </li>
        </ul>
      </div>
    </div>
  );
};
