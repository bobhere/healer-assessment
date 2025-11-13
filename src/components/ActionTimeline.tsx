import { dimensionMetas } from '../data/questions';

interface ActionTimelineProps {
  priorities: Array<{
    key: string;
    score: number;
    summary: string;
    detail: string;
    actions: string[];
  }>;
}

export const ActionTimeline = ({ priorities }: ActionTimelineProps) => {
  const phases = ['立即执行', '7-14 天', '30 天升级'];
  const colors = ['#7a5af8', '#00cfc1', '#ff8a5b'];

  return (
    <div className="timeline-card">
      <div className="timeline-card__header">
        <p className="summary-label">行动推演</p>
        <h4>Top3 维度阶段化推进</h4>
      </div>
      <div className="timeline-card__flow">
        {priorities.map((item, index) => {
          const meta = dimensionMetas.find((dimension) => dimension.key === item.key);
          const phase = phases[index] ?? `阶段 ${index + 1}`;
          const color = colors[index] ?? '#9b5de5';
          return (
            <div key={item.key} className="timeline-flow__item">
              <header>
                <span className="timeline-flow__phase" style={{ backgroundColor: color }}>
                  {phase}
                </span>
                <div>
                  <p className="timeline-flow__dimension">{meta?.label}</p>
                  <small>{item.summary}</small>
                </div>
                <strong>{item.score}/100</strong>
              </header>
              <ul>
                {item.actions.slice(0, 3).map((action) => (
                  <li key={action}>{action}</li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};
