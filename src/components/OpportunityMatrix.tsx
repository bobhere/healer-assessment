import type { DimensionKey } from '../types';
import { dimensionMetas } from '../data/questions';

interface OpportunityMatrixProps {
  rows: Array<{
    key: DimensionKey;
    score: number;
    gap: number;
    status: string;
  }>;
}

const statusConfig: Record<
  string,
  { label: string; tone: 'highlight' | 'warn' | 'alert' | 'steady' }
> = {
  领先: { label: '保持领先', tone: 'steady' },
  跟进: { label: '持续跟进', tone: 'highlight' },
  预警: { label: '重点关注', tone: 'warn' },
  亟需突破: { label: '立即突破', tone: 'alert' },
};

export const OpportunityMatrix = ({ rows }: OpportunityMatrixProps) => {
  return (
    <div className="matrix-card">
      <div className="matrix-card__header">
        <p className="summary-label">机会矩阵</p>
        <h4>六大能力 vs 标杆差距</h4>
      </div>
      <div className="matrix-rows">
        {rows.map((row) => {
          const meta = dimensionMetas.find((dimension) => dimension.key === row.key);
          const gap = Math.max(0, Math.round(row.gap));
          const status = statusConfig[row.status] ?? { label: row.status, tone: 'highlight' };
          return (
            <div key={row.key} className="matrix-row">
              <div className="matrix-row__main">
                <div>
                  <p className="matrix-row__label">{meta?.label}</p>
                  <span className={`matrix-chip matrix-chip__${status.tone}`}>{status.label}</span>
                </div>
                <div className="matrix-row__values">
                  <span className="matrix-score">
                    {row.score}
                    <small>/100</small>
                  </span>
                  <span className="matrix-gap">差 {gap} 分</span>
                </div>
              </div>
              <div className="matrix-progress">
                <div className="matrix-progress__fill" style={{ width: `${row.score}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
