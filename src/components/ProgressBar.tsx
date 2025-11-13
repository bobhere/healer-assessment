interface ProgressBarProps {
  value: number;
  label?: string;
}

export const ProgressBar = ({ value, label }: ProgressBarProps) => {
  const safeValue = Math.min(Math.max(value, 0), 100);
  return (
    <div className="progress-wrapper">
      <div className="progress-header">
        <span>{label ?? '完成度'}</span>
        <span>{safeValue}%</span>
      </div>
      <div className="progress-track">
        <div className="progress-indicator" style={{ width: `${safeValue}%` }} />
      </div>
    </div>
  );
};
