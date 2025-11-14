import type { Question, DimensionKey } from '../types';
import type { AnswerValue } from '../store/useAssessmentStore';

interface InsightDetail {
  summary: string;
  detail: string;
  actions: string[];
  signals: string[];
}

export interface DimensionResult {
  key: DimensionKey;
  score: number;
  summary: string;
  detail: string;
  actions: string[];
  signals: string[];
}

export interface ScoreSummary {
  dimensionResults: DimensionResult[];
  average: number;
  answeredCount: number;
  totalCount: number;
  completion: number;
}

type AnswerMap = Record<string, AnswerValue>;

const insightTemplates: Record<
  DimensionKey,
  { high: InsightDetail; mid: InsightDetail; low: InsightDetail }
> = {
  positioning: {
    high: {
      summary: '客户画像、典型一天与一句话承诺都极其明确，足以在15秒内讲清你的价值。',
      detail:
        '你已经描绘出具体的年龄、职业、生活场景，并能用一句话表达问题-方法-结果，让潜在客户瞬间判断「就是我需要的人」。',
      actions: [
        '把画像与承诺制作成一页式定位卡，供销售、内容和短视频统一引用。',
        '针对不同细分人群写出开场口播和案例标题，形成一套「角色化素材包」。',
      ],
      signals: ['已具备拆分子画像并行投放的能力', '可进一步沉淀视觉与语气手册保持一致性'],
    },
    mid: {
      summary: '知道服务谁，但缺少“典型一天”的细节和精准承诺，内容与销售说服力有限。',
      detail:
        '画像停留在年龄段或模糊行业，价值主张仍是概念化描述，短视频很难直接命中痛点，高客单沟通不得力。',
      actions: [
        '访谈3位理想客户，记录他们从早到晚的情绪、工具、通勤等细节，写进画像卡。',
        '用“我帮助____在____时间解决____并获得____”模板打磨一句话承诺，贴在工作区提醒自己。',
      ],
      signals: ['需要补充差异化标签与方法论命名', '建议在提案/导语中加入更具画面感的痛点语句'],
    },
    low: {
      summary: '尚未锁定具体人群与价值承诺，潜在客户难以理解你提供什么结果。',
      detail:
        '目前只有“焦虑女性”“想疗愈的人”这类泛描述，也没有一句标准口径，导致内容、销售、交付都在凭感觉推进。',
      actions: [
        '列出你最擅长的客户案例，拆解他们共同的身份、触发点和核心难题。',
        '按照「对象-问题-方法-结果」框架写出3版一句话承诺，邀请顾问或伙伴投票。',
      ],
      signals: ['建议先完成定位画布再扩量投放', '在官方物料发布前需做小范围验证，确保叙事击中痛点'],
    },
  },
  product: {
    high: {
      summary: '客单区间、权益组合与交付SOP全部稳定，任何助理都能照流程完成体验。',
      detail:
        '主打产品定价与价值锚点明确，前测-交付-复盘的材料齐备，案例与工具包随时可展示，能自然支撑高客单成交。',
      actions: [
        '将交付节奏做成可视化「服务进度条」，让客户全程知道下一步。',
        '针对≥3万客单设计增值权益（加速营/1V1仪式感），拉开与竞品差距。',
      ],
      signals: ['可尝试分层产品线承接不同预算', '适合录制交付实况/学员复盘，沉淀成案例短片'],
    },
    mid: {
      summary: '产品雏形可售，但SOP、材料与案例深度不足，难以完全托举高客单价位。',
      detail:
        '流程大致清楚，却缺少标准表单、脚本或阶段性产出物；报价时能量有限，客户对交付想象不够。',
      actions: [
        '梳理核心节点（前测/课堂/复盘），分别补齐提纲、表单与交付样稿。',
        '从现有客户中精选3个结果明确的案例，制作前后对比或打分截图。',
      ],
      signals: ['需要进一步规范交付节奏以便复制', '建议同步建立问题库，方便不同人协作交付'],
    },
    low: {
      summary: '产品尚未标准化，价格区间与体验描述模糊，客户难以做出购买决策。',
      detail:
        '没有固定客单/权益组合，也缺少“前测-过程-复盘”这些基准动作，一旦成交会高度依赖个人临场发挥。',
      actions: [
        '先确定一个清晰的主打高客单方案，写出阶段、时长、交付物和成功判定。',
        '用白板画出客户旅程，把每一步需要的材料、话术、工具列出来再补全。',
      ],
      signals: ['短期不宜同时售卖多款产品，先把旗舰款打磨清楚', '可邀请过往客户协助梳理他们最在意的交付细节'],
    },
  },
  content: {
    high: {
      summary: '案例、截图、长评等证据链丰富，能够随时支撑内容和销售叙事。',
      detail:
        '每个阶段都有真实案例或量化背书，素材已分类管理，短视频脚本、直播讲解都能快速引用。',
      actions: [
        '挑选代表性案例制作「成果年鉴」，包含客户画像、问题、进程与量化结果。',
        '把常用见证整理成话术/字幕模版，自动嵌入短视频与PDF报告。',
      ],
      signals: ['适合开设案例专题日/直播，持续放大利他心智', '可授权顾问团队直接引用素材，形成统一口径'],
    },
    mid: {
      summary: '已有少量故事或截屏，但没有覆盖不同阶段，专业度表现不够饱满。',
      detail:
        '只有几段经典反馈或简短评价，缺少从“前-中-后”的完整链路，导致内容乏力，难以支撑高客单报价。',
      actions: [
        '为每位客户设计标准访谈提纲，收集「起点-过程-结果」三段式故事。',
        '把截图、语音、分数等素材放进云端素材库，并按照标签（痛点/突破/复盘）分类。',
      ],
      signals: ['需持续追踪交付结果，补齐阶段性的证据', '建议在短视频/图文中固定展示“前后对比”模块'],
    },
    low: {
      summary: '缺少可用案例或客户证明，外界难以感知疗愈价值。',
      detail:
        '目前几乎没有截图、长评或结构化的故事，提案和内容只能依赖自我描述，信任建设受阻。',
      actions: [
        '梳理过去帮助过的人，邀请他们补写长评或录音描述变化，并给予福利回馈。',
        '设计「疗愈前-疗愈中-疗愈后」的成果表格，即使是内部复盘也先填起来形成素材。',
      ],
      signals: ['先完成最基本的案例采集再大规模投放广告', '可考虑与同行共创案例或借用活动形式快速积累证据'],
    },
  },
  shortVideo: {
    high: {
      summary: '短视频发布频率稳定且每条都有复盘，数据驱动选题升级。',
      detail:
        '每周≥3条作品并跟踪完播/留言，脚本、镜头、CTA都形成模板，能持续放大利基高客单心智。',
      actions: [
        '为高表现题材制作延展系列，保持“问题-方案-证据”三段式结构。',
        '建立每周例会复盘仪表盘，标记首秒钩子与行动号召的表现。',
      ],
      signals: ['具备复制新账号或多渠道分发的条件', '可叠加直播/付费广告进一步扩大声量'],
    },
    mid: {
      summary: '能保持更新但频率与复盘不稳定，内容公式感不足。',
      detail:
        '每周1-2条或断更，偶尔才看数据，脚本与镜头也还没沉淀成模板，导致结果波动大。',
      actions: [
        '统一开头钩子与结尾CTA，先写出3个模版脚本交替使用。',
        '至少记录近4周的完播率、收藏、私信数，找出爆款共性。',
      ],
      signals: ['建议设立“排期墙”防止断更', '可尝试批量拍摄+集中剪辑，降低执行成本'],
    },
    low: {
      summary: '短视频尚未启动或只有零星作品，流量入口几乎为零。',
      detail:
        '账号定位、视觉、更新节奏都未确认，缺乏闭环导致潜在客户难以感知你。',
      actions: [
        '先落地账号设定：角色、愿景、擅长议题与视觉风格，写入账号手册。',
        '用30天排期表列出题材→钩子→CTA，按周复盘补齐素材。',
      ],
      signals: ['宜从“连载”形式切入，降低拍摄压力', '短期聚焦单一平台把节奏跑顺，再考虑矩阵'],
    },
  },
  sales: {
    high: {
      summary: '留资路径多元且转化率高，线索在每个节点都有标准动作。',
      detail:
        '短链/表单/社群多路径并行，私域分层与成交脚本匹配，平均转化≥40%，能稳定产出高客单。',
      actions: [
        '给不同来源的线索配置差异化培育脚本，提升跟进效率。',
        '把高转化对话整理成Learning Card，培训团队统一话术。',
      ],
      signals: ['适合接入自动化CRM追踪行为', '可设计转介绍激励，扩大复购飞轮'],
    },
    mid: {
      summary: '已有固定引流通道，但线索承接和转化效率仍依赖个人经验。',
      detail:
        '多半通过单一路径进私域，转化率在10%-39%，说明脚本、物料和节奏需要更精细的拆分。',
      actions: [
        '明确每位客户的「三触点」动作：欢迎→诊断→方案，并配套脚本。',
        '建立转化看板，至少每周记录线索量、面谈数、成交数，发现漏斗瓶颈。',
      ],
      signals: ['需补齐结构化案例包与报价模板', '建议引入提醒机制，避免线索遗忘超72小时'],
    },
    low: {
      summary: '留资路径和转化流程都不清晰，线索大量流失在入口或私域。',
      detail:
        '目前还没有稳定渠道或脚本，进私域后的跟进随缘，转化率低于10%甚至无法统计。',
      actions: [
        '先确定一条最稳的留资链路（如短链→表单→顾问），用表格记录每条线索的进度。',
        '为诊断/报价环节写出提纲，至少包含提问、方案演示和行动邀请三个段落。',
      ],
      signals: ['应先搭建基础流程并做小批量验证', '暂不建议大量投流，避免资源浪费'],
    },
  },
  operations: {
    high: {
      summary: '收入规模可观且能点出核心堵点，说明团队具备复盘与资源配置能力。',
      detail:
        '月营收已站上20万以上，同时能清楚识别下一步要拆的堵点，预算、人力、节奏都在掌控中。',
      actions: [
        '把营收分成主产品/增购/转介绍三条曲线，便于看出增长来源。',
        '针对识别到的堵点排出60天攻坚计划，明确负责人与量化里程碑。',
      ],
      signals: ['适合引入更多KPI看板，支持跨团队协作', '可预留创新预算，尝试高客单实验'],
    },
    mid: {
      summary: '营收在5-20万区间，已能维持运转但缺少系统节奏与数据看板。',
      detail:
        '收入尚可，却少有标准化复盘或过程数据，遇到瓶颈时只能靠感觉判断问题。',
      actions: [
        '将月营收拆分为客单×成交数×渠道占比，找出第一优先级。',
        '设立例行的周复盘文档，记录「目标-执行-数据-学习-下一步」。',
      ],
      signals: ['需要给团队明确角色分工与交付标准', '建议同步建立预算表，掌控现金流与投放费用'],
    },
    low: {
      summary: '营收低于5万或尚未启动，且主要堵点尚不明确，需要先打牢运营底座。',
      detail:
        '当前收入还在探索期，对最核心阻碍描述模糊，说明数据、节奏、资源都需从零搭建。',
      actions: [
        '先完成「收入快照」：记录最近3个月客单、成交数、渠道来源与支出。',
        '列出前三大堵点，并为每个堵点规划一条最低可行的实验路径。',
      ],
      signals: ['建议专注单一目标：要么提价要么提量，避免分散资源', '需要建立最基本的任务墙与例会机制，确保执行落地'],
    },
  },
};

const getScoreLevel = (value: number) => {
  if (value >= 75) return 'high';
  if (value >= 50) return 'mid';
  return 'low';
};

export const normalizeAnswerValue = (
  question: Question,
  answer: AnswerValue,
): number => {
  if (typeof answer === 'number') {
    return Math.min(Math.max(answer, 0), 1);
  }
  if (Array.isArray(answer) && question.type === 'multi') {
    if (!question.options?.length) return 0;
    const values = (answer as string[])
      .map((selected) => {
        const option = question.options?.find(
          (opt) => (opt.code ?? opt.label) === selected,
        );
        return option?.value;
      })
      .filter((value): value is number => typeof value === 'number');
    if (!values.length) return 0;
    const avg = values.reduce((sum, item) => sum + item, 0) / values.length;
    return Math.min(Math.max(avg, 0), 1);
  }
  return 0;
};

export const calculateScores = (
  questions: Question[],
  answers: AnswerMap,
): ScoreSummary => {
  const totals: Record<DimensionKey, { weight: number; earned: number }> = {
    positioning: { weight: 0, earned: 0 },
    product: { weight: 0, earned: 0 },
    content: { weight: 0, earned: 0 },
    shortVideo: { weight: 0, earned: 0 },
    sales: { weight: 0, earned: 0 },
    operations: { weight: 0, earned: 0 },
  };

  let answeredCount = 0;
  const scoredQuestions = questions.filter((q) => q.weight > 0);

  for (const question of scoredQuestions) {
    const value = answers[question.id];
    totals[question.dimension].weight += question.weight;
    if (value !== undefined && value !== null && value !== '') {
      const normalized = normalizeAnswerValue(question, value);
      totals[question.dimension].earned += normalized * question.weight;
      answeredCount += 1;
    }
  }

  const dimensionResults: DimensionResult[] = (Object.keys(
    totals,
  ) as DimensionKey[]).map((key) => {
    const { weight, earned } = totals[key];
    const score = weight ? Math.round((earned / weight) * 100) : 0;
    const level = getScoreLevel(score);
    const template = insightTemplates[key][level];
    return {
      key,
      score,
      summary: template.summary,
      detail: template.detail,
      actions: template.actions,
      signals: template.signals,
    };
  });

  const average =
    dimensionResults.reduce((sum, item) => sum + item.score, 0) /
    dimensionResults.length;

  return {
    dimensionResults,
    average: Math.round(average),
    answeredCount,
    totalCount: scoredQuestions.length,
    completion: scoredQuestions.length
      ? Math.round((answeredCount / scoredQuestions.length) * 100)
      : 0,
  };
};
