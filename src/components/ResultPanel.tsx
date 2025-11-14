import { useMemo } from 'react';
import type { ScoreSummary } from '../utils/scoring';
import type { Question } from '../types';
import { useAssessmentStore } from '../store/useAssessmentStore';
import type { AnswerValue } from '../store/useAssessmentStore';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { normalizeAnswerValue } from '../utils/scoring';
import { dimensionMetas } from '../data/questions';

interface ResultPanelProps {
  summary: ScoreSummary;
  answers: Record<string, AnswerValue>;
  questions: Question[];
}

interface DerivedAnswer {
  id: string;
  label: string;
  normalized: number;
  question: Question;
}

type Tone = 'strong' | 'good' | 'warn' | 'risk' | 'idle';

type ScoreboardBuildResult = {
  badge: string;
  tone: Tone;
  summary: string;
  focus: string;
};

type DetailBuildResult = {
  summary: string;
  actions: string[];
  tone: Tone;
};

const isAnswerMissing = (record?: DerivedAnswer) => !record || record.label === '未填写';

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

const scoreboardConfig = [
  { id: 'q3', title: '营收阶段', caption: '现金流体量' },
  { id: 'q4', title: '客单结构', caption: '主打产品' },
  { id: 'q6', title: '内容节奏', caption: '短视频执行' },
  { id: 'q8', title: '留资路径', caption: '线索承接' },
  { id: 'q9', title: '成交效率', caption: '私域转化' },
];

const detailConfig = [
  { id: 'q1', title: '理想客户画像', section: '定位画像' },
  { id: 'q2', title: '一句话价值主张', section: '定位画像' },
  { id: 'q5', title: '交付流程', section: '产品交付' },
  { id: 'q7', title: '案例与见证', section: '内容资产' },
  { id: 'q10', title: '当前最大堵点', section: '运营诊断' },
];

const scoreboardBuilders: Record<string, (record?: DerivedAnswer) => ScoreboardBuildResult> = {
  q3: (record) => {
    if (isAnswerMissing(record)) {
      return {
        badge: '待补充',
        tone: 'idle',
        summary: '暂无营收数据，建议补齐以便判断阶段。',
        focus: '补充最近的月营收区间，便于拆解增长目标。',
      };
    }
    const value = record?.normalized ?? 0;
    if (value >= 0.75) {
      return {
        badge: '规模拓展',
        tone: 'strong',
        summary: '现金流已具备规模，可以拆分渠道与客单贡献。',
        focus: '建立月滚动预测，区分主渠道/转介绍/复购的营收贡献。',
      };
    }
    if (value >= 0.55) {
      return {
        badge: '提速阶段',
        tone: 'good',
        summary: '收入稳定向上，核心是提效与复制。',
        focus: '设定周营收目标，追踪各渠道的线索量与成交率。',
      };
    }
    if (value >= 0.3) {
      return {
        badge: '进阶期',
        tone: 'warn',
        summary: '仍在培育期，需要聚焦单一高势能渠道。',
        focus: '挑选最好跑的渠道集中投放，并建立案例素材池。',
      };
    }
    return {
      badge: '验证期',
      tone: 'risk',
      summary: '现金流还在试跑，先证明产品价值。',
      focus: '用4周时间跑通“引流-诊断-成交”闭环并记录投入产出。',
    };
  },
  q4: (record) => {
    if (isAnswerMissing(record)) {
      return {
        badge: '待补充',
        tone: 'idle',
        summary: '尚未填写客单区间，无法评估溢价空间。',
        focus: '补充主打产品客单，以便规划提价与权益策略。',
      };
    }
    const value = record?.normalized ?? 0;
    if (value >= 0.85) {
      return {
        badge: '高客单',
        tone: 'strong',
        summary: '当前客单已站上高位，需要聚焦体验与案例。',
        focus: '把交付仪式感、客户旅程与成果册融入销售展示。',
      };
    }
    if (value >= 0.55) {
      return {
        badge: '成长型',
        tone: 'good',
        summary: '客单具备提升潜力，可通过组合权益提价。',
        focus: '设计旗舰方案+加速权益，形成两档报价支撑。',
      };
    }
    if (value >= 0.3) {
      return {
        badge: '冲刺期',
        tone: 'warn',
        summary: '客单仍在培育期，需要明确核心成果与方法论。',
        focus: '先固化客户成果与前后对比，再计划提价节奏。',
      };
    }
    return {
      badge: '入门期',
      tone: 'risk',
      summary: '目前报价偏低，难以支撑深度交付。',
      focus: '聚焦一款高价值方案，明确交付路径后再提升客单。',
    };
  },
  q6: (record) => {
    if (isAnswerMissing(record)) {
      return {
        badge: '待补充',
        tone: 'idle',
        summary: '还未记录内容执行频率。',
        focus: '补充近4周内容频率与复盘情况。',
      };
    }
    const value = record?.normalized ?? 0;
    if (value >= 0.9) {
      return {
        badge: '高频复盘',
        tone: 'strong',
        summary: '内容/短视频有节奏且有数据复盘。',
        focus: '引入A/B钩子与系列化选题，沉淀爆款手册。',
      };
    }
    if (value >= 0.5) {
      return {
        badge: '可持续',
        tone: 'good',
        summary: '目前保持更新，但复盘未标准化。',
        focus: '搭建内容排期+数据表，形成周复盘仪式。',
      };
    }
    if (value >= 0.2) {
      return {
        badge: '偶发输出',
        tone: 'warn',
        summary: '更新与复盘都不稳定，依赖临场灵感。',
        focus: '准备3套标准脚本和镜头模板，集中录制。',
      };
    }
    return {
      badge: '尚未启动',
      tone: 'risk',
      summary: '短视频仍未起步，需要先搭建角色与故事线。',
      focus: '完成30天内容排期，先跑通“教育-信任-成交”三类主题。',
    };
  },
  q8: (record) => {
    if (isAnswerMissing(record)) {
      return {
        badge: '待补充',
        tone: 'idle',
        summary: '暂无留资信息，线索路径不清晰。',
        focus: '补充短链/表单/客服等承接动作，便于诊断。',
      };
    }
    const value = record?.normalized ?? 0;
    if (value >= 0.9) {
      return {
        badge: '多通路',
        tone: 'strong',
        summary: '线索承接已形成多路径矩阵。',
        focus: '为不同来源配置分层脚本，叠加自动标签。',
      };
    }
    if (value >= 0.6) {
      return {
        badge: '双路径',
        tone: 'good',
        summary: '已有2条稳定路径，需要统一动作与物料。',
        focus: '同步短链-表单-客服的欢迎语、标签与提醒节奏。',
      };
    }
    if (value >= 0.3) {
      return {
        badge: '单路径',
        tone: 'warn',
        summary: '主要靠单一入口，存在流失风险。',
        focus: '优先补齐表单或社群承接，减少内容端流失。',
      };
    }
    return {
      badge: '待搭建',
      tone: 'risk',
      summary: '尚无清晰留资动作，线索难以沉淀。',
      focus: '搭建「短链-表单-顾问」最小链路并记录每位线索。',
    };
  },
  q9: (record) => {
    if (isAnswerMissing(record)) {
      return {
        badge: '待补充',
        tone: 'idle',
        summary: '未填写转化率，无法评估销售效率。',
        focus: '统计近30天进私域与成交人数，估算真实转化率。',
      };
    }
    const value = record?.normalized ?? 0;
    if (value >= 0.8) {
      return {
        badge: '高转化',
        tone: 'strong',
        summary: '私域成交效率优秀，可复制打法。',
        focus: '沉淀诊断脚本与报价包，培训团队复制流程。',
      };
    }
    if (value >= 0.6) {
      return {
        badge: '可进阶',
        tone: 'good',
        summary: '转化率尚可，优化话术与节奏可再提。',
        focus: '梳理三触点（欢迎-诊断-方案），设置跟进提醒。',
      };
    }
    if (value >= 0.35) {
      return {
        badge: '需紧盯',
        tone: 'warn',
        summary: '成交效率偏低，需补齐物料与复盘。',
        focus: '记录每次面谈结果与异议，建立成交复盘表。',
      };
    }
    return {
      badge: '流失严重',
      tone: 'risk',
      summary: '转化率不足25%，线索大幅流失。',
      focus: '回溯欢迎语、诊断提纲与报价展示，逐段迭代。',
    };
  },
};

const detailBuilders: Record<string, (record?: DerivedAnswer) => DetailBuildResult> = {
  q1: (record) => {
    if (isAnswerMissing(record)) {
      return {
        tone: 'risk',
        summary: '尚未描述理想客户，导致内容与销售无法对准人群。',
        actions: ['写出客户的年龄、职业、典型一天，至少覆盖工作/家庭/情绪三个场景。', '把客户常用口头语与痛点写进短视频脚本和诊断问题中。'],
      };
    }
    const value = record?.normalized ?? 0;
    const label = record?.label ?? '';
    if (value >= 0.75) {
      return {
        tone: 'strong',
        summary: `画像已具体到「${label}」，可直接作为脚本与案例开场。`,
        actions: ['制作一页式画像卡，包含典型一天、触发点与目标，供团队统一使用。', '针对两个子人群延展独立案例标题，方便在短视频/直播里切换。'],
      };
    }
    if (value >= 0.4) {
      return {
        tone: 'warn',
        summary: `当前描述为「${label}」，仍缺少生活细节与场景化语言。`,
        actions: ['访谈3位典型客户，记录他们在早/午/晚最焦虑的瞬间，补充到画像中。', '把客户口头语写成问题句，放在短视频首句或诊断问卷里。'],
      };
    }
    return {
      tone: 'risk',
      summary: `画像目前只有「${label}」这类模糊描述，难以支撑高客单沟通。`,
      actions: ['用「身份+典型一天+核心目标」格式重写画像，至少写出3个细节。', '在下一次内容脚本前先写出“他的一天”文字描述，再提炼成镜头脚本。'],
    };
  },
  q2: (record) => {
    const normalized = record?.normalized ?? 0;
    const hasAnswer = !isAnswerMissing(record);
    if (normalized === 1) {
      return {
        tone: 'good',
        summary: '一句话价值主张已经成型，需要在所有触点保持一致。',
        actions: ['把一句话承诺写进短视频口播、加粉欢迎语与方案PPT首页。', '结合案例提炼“问题-方法-结果”三段式故事，加深记忆点。'],
      };
    }
    return {
      tone: hasAnswer ? 'warn' : 'risk',
      summary: '尚未固定一句话价值主张，潜在客户无法快速理解价值。',
      actions: ['用“我帮助____在____天解决____并获得____”模板起草3个版本。', '邀请顾问/典型客户评估哪一个最有画面感，再固化为正式话术。'],
    };
  },
  q5: (record) => {
    if (isAnswerMissing(record)) {
      return {
        tone: 'risk',
        summary: '交付流程未填写，难以判断客户体验。',
        actions: ['梳理前测-课堂-复盘的关键动作，至少写出产出物与负责人。', '建立共享文件夹，存放表单、脚本与反馈模板。'],
      };
    }
    const value = record?.normalized ?? 0;
    const label = record?.label ?? '';
    if (value >= 0.75) {
      return {
        tone: 'strong',
        summary: '交付SOP已成型，可视化呈现即可支撑销售。',
        actions: ['把SOP绘制成客户旅程图，在成交/入组环节直接展示。', '制定交付质量清单（满意度/材料提交/复盘时间），定期复查。'],
      };
    }
    if (value >= 0.4) {
      return {
        tone: 'warn',
        summary: `当前交付方式是「${label}」，部分环节仍靠临场发挥。`,
        actions: ['为每个阶段补齐提纲、表单与脚本，减少体验波动。', '设置简易质检表，由助理或伙伴记录每次交付是否达标。'],
      };
    }
    return {
      tone: 'risk',
      summary: '交付完全靠本人实时发挥，难以复制也难以提价。',
      actions: ['写下最理想的交付节奏（前测-交付-复盘）并列出产出物。', '优先固化前测与复盘模板，两周内先完成文档化。'],
    };
  },
  q7: (record) => {
    if (isAnswerMissing(record)) {
      return {
        tone: 'risk',
        summary: '尚无案例/见证素材，无法形成信任背书。',
        actions: ['统计历届客户，邀请3位补写长评或语音反馈。', '设计“疗愈前-疗愈后”成果表，即使内部复盘也要填写。'],
      };
    }
    const value = record?.normalized ?? 0;
    const label = record?.label ?? '';
    if (value >= 0.75) {
      return {
        tone: 'strong',
        summary: '案例与见证覆盖各阶段，可直接制作成果年鉴。',
        actions: ['整理金句/打分截图，制作案例百科，方便销售引用。', '在短视频与图文中固定“前后对比”模块，提高说服力。'],
      };
    }
    if (value >= 0.5) {
      return {
        tone: 'good',
        summary: `当前素材量为「${label}」，仍需补齐全过程证据。`,
        actions: ['为每位客户安排结营访谈，收集问题-过程-成果三段式故事。', '把截图、音频、量化指标放入统一素材库并打标签。'],
      };
    }
    return {
      tone: 'warn',
      summary: '案例只有零星短评，缺少结构化故事。',
      actions: ['优先记录1-2个典型客户的详细过程，形成讲述脚本。', '结合数据或第三方评价，补充量化背书。'],
    };
  },
  q10: (record) => {
    const text = isAnswerMissing(record) ? '' : record?.label?.trim();
    if (!text) {
      return {
        tone: 'idle',
        summary: '尚未记录业务堵点，建议在访谈中补充。',
        actions: ['明确当前最卡的环节（流量/脚本/成交/交付等）。', '把堵点拆成可以在4周内验证的实验，并指定负责人。'],
      };
    }
    return {
      tone: 'warn',
      summary: `你提到当前最想解决的是「${text}」。`,
      actions: ['将该堵点拆成3个可执行任务：诊断、实验、复盘。', '设定时间表（如14天）和成效判定标准，避免长期搁置。'],
    };
  },
};

export const ResultPanel = ({ summary, questions, answers }: ResultPanelProps) => {
  const notes = useAssessmentStore((state) => state.notes);
  const setNotes = useAssessmentStore((state) => state.setNotes);
  const reset = useAssessmentStore((state) => state.reset);
  const questionCount = questions.length;

  const exportRows = useMemo(
    () =>
      questions.map((question) => ({
        id: question.id,
        title: question.title,
        answer: resolveAnswerLabel(question, answers[question.id]),
      })),
    [answers, questions],
  );

  const derivedAnswers = useMemo<DerivedAnswer[]>(
    () =>
      questions.map((question) => {
        const label = resolveAnswerLabel(question, answers[question.id]);
        const normalized =
          question.type === 'text'
            ? 0
            : normalizeAnswerValue(question, answers[question.id] ?? '');
        return {
          id: question.id,
          label: label && label.trim().length > 0 ? label : '未填写',
          normalized,
          question,
        };
      }),
    [answers, questions],
  );

  const derivedMap = useMemo(() => {
    const map: Record<string, DerivedAnswer> = {};
    derivedAnswers.forEach((item) => {
      map[item.id] = item;
    });
    return map;
  }, [derivedAnswers]);

  const dimensionSorted = useMemo(() => {
    if (!summary.dimensionResults.length) return [];
    return [...summary.dimensionResults].sort((a, b) => a.score - b.score);
  }, [summary.dimensionResults]);

  const highestDimension = dimensionSorted[dimensionSorted.length - 1];
  const highestLabel = highestDimension
    ? `${dimensionMetas.find((meta) => meta.key === highestDimension.key)?.label ?? ''} · ${
        highestDimension.score
      }`
    : '待补充';

  const quickStats = [
    { label: '完成度', value: `${summary.completion}%`, caption: '问卷进度' },
    { label: '答题数', value: `${summary.answeredCount}/${summary.totalCount}`, caption: '已填 / 总题' },
    { label: '平均分', value: summary.dimensionResults.length ? `${summary.average}` : '--', caption: '六维均值' },
    { label: '最高维度', value: highestLabel, caption: '当前长板' },
  ];

  const scoreboardCards = scoreboardConfig.map((config) => {
    const record = derivedMap[config.id];
    const builder = scoreboardBuilders[config.id];
    const built = builder(record);
    return {
      ...config,
      value: record?.label ?? '未填写',
      ...built,
    };
  });

  const detailCards = detailConfig.map((config) => {
    const record = derivedMap[config.id];
    const builder = detailBuilders[config.id];
    const built = builder(record);
    return {
      ...config,
      answer: record?.label ?? '未填写',
      ...built,
    };
  });

  const actionQueue = [...scoreboardCards.map((card) => card.focus), ...detailCards.flatMap((card) => card.actions)]
    .filter((item) => item && item.length > 0)
    .slice(0, 7);

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
          <h1>{questionCount}问测评｜明确定位 · 短视频 · 成交突破口</h1>
          <p>
            基于十道核心问题，洞察疗愈师在定位、产品、内容、获客、成交与运营上的真实情况，帮助快速锁定高客单突破口。
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

      <div className="result-quick-stats">
        {quickStats.map((stat) => (
          <div key={stat.caption} className="quick-stat-card">
            <p>{stat.caption}</p>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </div>

      <div className="panel-block">
        <div className="panel-header">
          <span className="panel-tag">01</span>
          <div>
            <h3>业务体检仪表板</h3>
            <p>根据营收、客单、内容节奏、留资与成交五大指标，迅速判断所处阶段与下一步发力点。</p>
          </div>
        </div>
        <div className="scoreboard-grid">
          {scoreboardCards.map((card) => (
            <div key={card.id} className="scoreboard-card">
              <div className="scoreboard-card__head">
                <div>
                  <p>{card.caption}</p>
                  <h4>{card.title}</h4>
                </div>
                <span className={`scoreboard-badge scoreboard-badge__${card.tone}`}>{card.badge}</span>
              </div>
              <p className="scoreboard-card__value">{card.value}</p>
              <p className="scoreboard-card__summary">{card.summary}</p>
              <p className="scoreboard-card__focus">{card.focus}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="panel-block">
        <div className="panel-header">
          <span className="panel-tag">02</span>
          <div>
            <h3>策略洞察与操作建议</h3>
            <p>逐题还原访谈内容，并输出可立即执行的微动作，确保与客户沟通高度接地气。</p>
          </div>
        </div>
        <div className="insight-grid">
          {detailCards.map((card) => (
            <div key={card.id} className={`insight-card insight-card__${card.tone}`}>
              <div className="insight-card__head">
                <span>{card.section}</span>
                <h4>{card.title}</h4>
              </div>
              <p className="insight-card__answer">当前回答：{card.answer}</p>
              <p className="insight-card__summary">{card.summary}</p>
              <ul>
                {card.actions.map((action) => (
                  <li key={action}>{action}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="panel-block">
        <div className="panel-header">
          <span className="panel-tag">03</span>
          <div>
            <h3>优先行动清单</h3>
            <p>综合仪表板与洞察建议，列出下一步最需要落地的动作，方便教练在复盘时直接勾选。</p>
          </div>
        </div>
        <ol className="action-list">
          {actionQueue.length ? (
            actionQueue.map((item, index) => (
              <li key={`${item}-${index}`}>
                <span className="action-list__index">{index + 1}</span>
                <p>{item}</p>
              </li>
            ))
          ) : (
            <li className="action-list__empty">暂无可执行动作，请先补全问卷信息。</li>
          )}
        </ol>
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
