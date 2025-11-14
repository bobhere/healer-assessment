import { useMemo } from 'react';
import type { ScoreSummary } from '../utils/scoring';
import type { Question } from '../types';
import { useAssessmentStore } from '../store/useAssessmentStore';
import type { AnswerValue } from '../store/useAssessmentStore';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { RadarChart } from './RadarChart';
import { dimensionMetas } from '../data/questions';
import { CompletionGauge } from './CompletionGauge';
import { ScoreBars } from './ScoreBars';
import { OpportunityMatrix } from './OpportunityMatrix';
import { ActionTimeline } from './ActionTimeline';
import { ScoreDonut } from './ScoreDonut';
import { QuadrantChart } from './QuadrantChart';

interface ResultPanelProps {
  summary: ScoreSummary;
  answers: Record<string, AnswerValue>;
  questions: Question[];
}

const resolveAnswerLabel = (question: Question, answer: AnswerValue) => {
  if (question.type === 'text') {
    return typeof answer === 'string' ? answer : '';
  }
  if (!question.options) return `${answer ?? ''}`;
  if (Array.isArray(answer)) {
    return (answer as string[])
      .map((selected) => {
        const option = question.options?.find((opt) => (opt.code ?? opt.label) === selected);
        return option?.label ?? selected;
      })
      .join(' / ');
  }
  const option = question.options.find((opt) => opt.value === answer);
  return option ? option.label : `${answer ?? ''}`;
};

const downloadFile = (content: string, filename: string, mime: string) => {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const ResultPanel = ({ summary, questions, answers }: ResultPanelProps) => {
  const notes = useAssessmentStore((state) => state.notes);
  const setNotes = useAssessmentStore((state) => state.setNotes);
  const reset = useAssessmentStore((state) => state.reset);

  const exportRows = useMemo(
    () =>
      questions.map((question) => ({
        id: question.id,
        title: question.title,
        answer: resolveAnswerLabel(question, answers[question.id]),
      })),
    [answers, questions],
  );

  const sortedResults = useMemo(
    () => [...summary.dimensionResults].sort((a, b) => a.score - b.score),
    [summary.dimensionResults],
  );
  const topPriorities = sortedResults.slice(0, 3);
  const strongDimensions = summary.dimensionResults.filter((item) => item.score >= 75);
  const balancedDimensions = summary.dimensionResults.filter(
    (item) => item.score >= 55 && item.score < 75,
  );
  const riskDimensions = summary.dimensionResults.filter((item) => item.score < 55);

  const benchmarkScore = 82;
  const avgGapFromBenchmark =
    summary.dimensionResults.reduce((sum, item) => sum + (benchmarkScore - item.score), 0) /
    summary.dimensionResults.length;

  const formatDimensionList = (items: typeof summary.dimensionResults) =>
    items
      .map((item) => {
        const meta = dimensionMetas.find((dimension) => dimension.key === item.key);
        return `${meta?.label ?? item.key}（${item.score}）`;
      })
      .join('、');

  const heatmapRows = summary.dimensionResults.map((item) => {
    const meta = dimensionMetas.find((dimension) => dimension.key === item.key);
    const gap = benchmarkScore - item.score;
    const status =
      item.score >= 80 ? '领先' : item.score >= 65 ? '跟进' : item.score >= 50 ? '预警' : '亟需突破';
    return {
      ...item,
      label: meta?.label ?? item.key,
      gap,
      status,
    };
  });

  const handleExportCSV = () => {
    const lines = ['题号,问题,答案'];
    exportRows.forEach((row) => {
      const raw = row.answer ?? '';
      const safeAnswer = raw.replace(/"/g, '""');
      lines.push(`${row.id},"${row.title}","${safeAnswer}"`);
    });
    downloadFile(lines.join('\n'), 'healer-assessment.csv', 'text/csv;charset=utf-8;');
  };

  const handleExportJSON = () => {
    const payload = {
      generatedAt: new Date().toISOString(),
      summary,
      notes,
      responses: exportRows,
    };
    downloadFile(JSON.stringify(payload, null, 2), 'healer-assessment.json', 'application/json');
  };

  const captureResultSection = async () => {
    const target = document.querySelector('.result-section') as HTMLElement | null;
    if (!target) return null;
    return html2canvas(target, { scale: 2, backgroundColor: '#ffffff' });
  };

  const withDesktopLayout = async (action: () => Promise<void>) => {
    const body = document.body;
    const needsForce =
      body.classList.contains('mobile-adapt') && !body.classList.contains('force-desktop');
    if (needsForce) body.classList.add('force-desktop', 'export-grid');
    try {
      await action();
    } finally {
      if (needsForce) body.classList.remove('force-desktop', 'export-grid');
    }
  };

  const handleExportPDF = async () => {
    await withDesktopLayout(async () => {
      const canvas = await captureResultSection();
      if (!canvas) return;
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'pt', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const usableWidth = pageWidth - margin * 2;
      const imgHeight = (canvas.height * usableWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = margin;

      pdf.addImage(imgData, 'PNG', margin, position, usableWidth, imgHeight);
      heightLeft -= pageHeight - margin;

      while (heightLeft > 0) {
        pdf.addPage();
        position = heightLeft - imgHeight + margin;
        pdf.addImage(imgData, 'PNG', margin, position, usableWidth, imgHeight);
        heightLeft -= pageHeight - margin;
      }

      pdf.save('healer-assessment-report.pdf');
    });
  };

  const handleExportImage = async () => {
    await withDesktopLayout(async () => {
      const canvas = await captureResultSection();
      if (!canvas) return;
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'healer-assessment-report.png';
      link.click();
    });
  };

  return (
    <section className="result-section">
      <div className="report-hero">
        <div>
          <p className="report-eyebrow">疗愈师高客单增长诊断</p>
          <h1>30问测评｜明确定位 · 短视频 · 成交突破口</h1>
          <p>
            基于六大能力体系，对疗愈师在定位、产品、内容、短视频、销售闭环与运营资源方面进行全方位评估，并输出商业化可执行的行动方案。
          </p>
        </div>
        <div className="report-meta">
          <div>
            <span>测评日期</span>
            <strong>{new Date().toLocaleDateString()}</strong>
          </div>
          <div>
            <span>顾问</span>
            <strong>虚竹教练团队</strong>
          </div>
        </div>
      </div>

      <header className="result-section__header">
        <div>
          <h2>测评结果与建议</h2>
          <p>回答完成度 {summary.completion}% · 平均得分 {summary.average}</p>
        </div>
        <div className="result-actions">
          <button type="button" onClick={handleExportCSV}>
            导出 CSV
          </button>
          <button type="button" onClick={handleExportJSON}>
            导出 JSON
          </button>
          <button type="button" onClick={handleExportPDF}>
            导出 PDF
          </button>
          <button type="button" onClick={handleExportImage}>
            导出 PNG 长图
          </button>
          <button type="button" className="ghost" onClick={reset}>
            清空答卷
          </button>
        </div>
      </header>

      <div className="insight-grid">
        <div className="insight-hero">
          <div className="insight-hero__head">
            <div>
              <p className="summary-label">综合诊断</p>
              <h3>
                平均 {summary.average} 分｜离散度{' '}
                {sortedResults[sortedResults.length - 1]?.score - sortedResults[0]?.score || 0} 分
              </h3>
              <p className="summary-text">
                {strongDimensions.length > 0
                  ? `优势：${formatDimensionList(strongDimensions)}。`
                  : '暂未形成显著优势。'}
                {balancedDimensions.length > 0 && ` 发展：${formatDimensionList(balancedDimensions)}。`}
                {riskDimensions.length > 0
                  ? ` 风险：${formatDimensionList(riskDimensions)}，需优先干预。`
                  : ' 暂无明显风险板块。'}
              </p>
            </div>
            <div className="insight-hero__stat">
              <span>完成度</span>
              <strong>{summary.completion}%</strong>
            </div>
          </div>
          <div className="kpi-grid">
            <div className="kpi-card">
              <p>问卷完成度</p>
              <strong>{summary.completion}%</strong>
              <span>答题 {summary.answeredCount}/{summary.totalCount}</span>
            </div>
            <div className="kpi-card">
              <p>维度离散度</p>
              <strong>
                {sortedResults[sortedResults.length - 1]?.score ?? 0} / {sortedResults[0]?.score ?? 0}
              </strong>
              <span>最高 / 最低</span>
            </div>
            <div className="kpi-card">
              <p>平均与标杆差距</p>
              <strong>{Math.max(0, Math.round(avgGapFromBenchmark))} 分</strong>
              <span>对比 82 分目标</span>
            </div>
          </div>
          <div className="summary-highlights">
            <div>
              <p>最高维度</p>
              <strong>
                {dimensionMetas.find((m) => m.key === sortedResults[sortedResults.length - 1]?.key)
                  ?.label ?? '-'}
              </strong>
            </div>
            <div>
              <p>最低维度</p>
              <strong>{dimensionMetas.find((m) => m.key === sortedResults[0]?.key)?.label ?? '-'}</strong>
            </div>
            <div>
              <p>优先行动</p>
              <strong>
                {topPriorities
                  .map((item) => dimensionMetas.find((m) => m.key === item.key)?.label)
                  .filter(Boolean)
                  .join(' · ')}
              </strong>
            </div>
          </div>
        </div>
        <div className="insight-side">
          <div className="callout-card">
            <p className="summary-label">立即关注</p>
            <h4>Top 3 行动维度</h4>
            <ol>
              {topPriorities.map((item) => {
                const meta = dimensionMetas.find((dimension) => dimension.key === item.key);
                return (
                  <li key={item.key}>
                    <span>{meta?.label}</span>
                    <strong>{item.score}</strong>
                    <small>{item.summary}</small>
                  </li>
                );
              })}
            </ol>
          </div>
          <div className="callout-card">
            <p className="summary-label">风险提示</p>
            <h4>待补强板块</h4>
            {riskDimensions.length ? (
              <ul>
                {riskDimensions.map((item) => {
                  const meta = dimensionMetas.find((dimension) => dimension.key === item.key);
                  return (
                    <li key={item.key}>
                      <span>{meta?.label}</span>
                      <small>得分 {item.score} · 差距 {Math.max(0, benchmarkScore - item.score)} 分</small>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="callout-card__empty">暂无明显风险维度</p>
            )}
          </div>
        </div>
      </div>

      <div className="panel-block">
        <div className="panel-header">
          <span className="panel-tag">01</span>
          <div>
            <h3>数据视图</h3>
            <p>多维可视化对比，快速定位突破口</p>
          </div>
        </div>
        <div className="viz-grid">
          <div className="viz-card viz-card--duo">
            <div>
              <div className="viz-card__header">
                <h4>完成度 / 平均分</h4>
                <span>当前问卷状态</span>
              </div>
              <CompletionGauge
                completion={summary.completion}
                average={summary.average}
                highest={sortedResults[sortedResults.length - 1]?.score ?? 0}
              />
            </div>
            <div>
              <div className="viz-card__header">
                <h4>能力构成占比</h4>
                <span>六维权重</span>
              </div>
              <ScoreDonut results={summary.dimensionResults} />
            </div>
          </div>
          <div className="viz-card">
            <div className="viz-card__header">
              <h4>维度得分 vs 标杆</h4>
              <span>Benchmark: {benchmarkScore} 分</span>
            </div>
            <ScoreBars results={summary.dimensionResults} />
          </div>
          <div className="viz-card">
            <div className="viz-card__header">
              <h4>差距象限</h4>
              <span>X: 差距 / Y: 得分</span>
            </div>
            <QuadrantChart results={summary.dimensionResults} benchmark={benchmarkScore} />
          </div>
          <div className="viz-card">
            <div className="viz-card__header">
              <h4>能力雷达图</h4>
              <span>高维诊断轮廓</span>
            </div>
            <RadarChart results={summary.dimensionResults} />
          </div>
        </div>
      </div>

      <div className="panel-block">
        <div className="panel-header">
          <span className="panel-tag">02</span>
          <div>
            <h3>风险 · 机会 · 行动</h3>
            <p>矩阵定位 + 行动推演，确保资源投入聚焦</p>
          </div>
        </div>
        <div className="matrix-grid">
          <div className="heatmap-card">
            <div className="heatmap-card__header">
              <p className="summary-label">风险矩阵</p>
              <h4>维度热度与补强优先级</h4>
            </div>
            <div className="heatmap-grid">
              {heatmapRows.map((row) => (
                <div key={row.key} className="heatmap-row">
                  <div className="heatmap-meta">
                    <span className="heatmap-label">{row.label}</span>
                    <span className={`heatmap-status heatmap-status--${row.status}`}>
                      {row.status}
                    </span>
                  </div>
                  <div className="heatmap-bar">
                    <span style={{ width: `${row.score}%` }} />
                  </div>
                  <div className="heatmap-values">
                    <small>{row.score} 分</small>
                    <small>差 {Math.max(0, row.gap)} 分</small>
                  </div>
                </div>
              ))}
            </div>
            <ul className="heatmap-insights">
              <li>平均与标杆差距 {Math.max(0, Math.round(avgGapFromBenchmark))} 分</li>
              <li>风险维度 {riskDimensions.length} 个 · 需重点跟进</li>
              <li>领先维度 {strongDimensions.length} 个 · 可提炼案例对外传播</li>
            </ul>
          </div>
          <OpportunityMatrix rows={heatmapRows} />
        </div>
        <ActionTimeline priorities={topPriorities} />
      </div>

      <div className="panel-block">
        <div className="panel-header">
          <span className="panel-tag">03</span>
          <div>
            <h3>首要行动 & 维度洞察</h3>
            <p>Top3 优先级与所有维度洞察统一布局</p>
          </div>
        </div>
        <div className="priority-dimension-grid">
          {summary.dimensionResults.map((result) => {
            const meta = dimensionMetas.find((item) => item.key === result.key);
            const isTop = topPriorities.some((item) => item.key === result.key);
            return (
              <div key={result.key} className="dimension-card">
                <div className="dimension-card__header">
                  <div className="dimension-card__title">
                    <p>{meta?.label}</p>
                    {isTop && <span className="dimension-chip">优先</span>}
                  </div>
                  <strong>{result.score}</strong>
                </div>
                <div className="dimension-card__content">
                  <p className="dimension-card__desc">{meta?.description}</p>
                  <p className="dimension-card__insight">{result.summary}</p>
                  <p className="dimension-card__detail text-clamp">{result.detail}</p>
                  <div className="dimension-card__actions">
                    {result.actions.map((action) => (
                      <p key={action}>• {action}</p>
                    ))}
                  </div>
                  <div className="dimension-card__signals">
                    <p>风险信号</p>
                    <ul>
                      {result.signals.map((signal) => (
                        <li key={signal}>{signal}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="report-footer">
        <div>
          <p>报告说明</p>
          <small>
            本测评为内部专用，根据访谈与答题实时生成，结论仅供疗愈师业务调优参考。未经书面许可，不得向第三方披露。
          </small>
        </div>
        <div className="report-footer__meta">
          <span>版权所有 © {new Date().getFullYear()} XUZHU · Healer Growth Lab</span>
        </div>
      </div>

      <div className="notes-panel">
        <div className="notes-header">
          <h3>通话记录 / 教练备注</h3>
          <span>仅保存在本地浏览器</span>
        </div>
        <textarea
          value={notes}
          placeholder="记录通话亮点、异议、下一步行动等..."
          onChange={(event) => setNotes(event.target.value)}
        />
      </div>
    </section>
  );
};
