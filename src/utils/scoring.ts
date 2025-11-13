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
      summary: '定位叙事扎实，客户旅程和价值主张都能一语中的，可直接支撑高客单销售。',
      detail:
        '理想客户画像清晰、价值承诺聚焦，且差异化故事已固化为可复制的讲述方式，具备打造标杆案例的能力。',
      actions: [
        '挑选2-3个高价值细分人群，结合案例包装「行业标杆故事」强化信任。',
        '将一句话承诺延展为视觉化Slogan和短视频口播句式，保持多场景一致性。',
      ],
      signals: ['可拆分子定位以提升转化效率', '关注定位随市场变化迭代，保持新鲜度'],
    },
    mid: {
      summary: '核心受众画像已成型，但洞察深度与差异化表达略显模糊，影响内容穿透力。',
      detail:
        '你知道自己想服务谁，但缺少具象痛点与方法论语言，导致故事打动人心的力度有限，高客单沟通说服力偏弱。',
      actions: [
        '访谈3位理想客户，挖掘更具画面感的痛点语句并更新画像卡片。',
        '梳理与竞品/同业的差异点，形成「只属于你」的方法标签，写进开场自我介绍。',
      ],
      signals: ['需补充客户旅程节点和关键痛点场景', '建议形成一句话定位与视觉锚点'],
    },
    low: {
      summary: '定位尚未拉开差距，理想客户、价值承诺、可交付成果都需要重新定义。',
      detail:
        '目前描述偏泛，潜在客户难以判断你是否解决他们的问题，高客单销售缺乏价值锚点，也难以构建信任飞轮。',
      actions: [
        '用客户旅程（认识-信任-购买-复购）写下每个阶段的疑问与期待，倒推定位结构。',
        '练习「一句话价值主张」：服务对象 + 核心问题 + 方法路径 + 关键成果。',
      ],
      signals: ['先完成定位画布再大规模投放', '在公开传播前先做小范围验证，确保叙事打中需求'],
    },
  },
  product: {
    high: {
      summary: '产品结构成熟、交付链路顺滑，足以承接高客单成交。',
      detail:
        '主打产品定价、权益和交付体验形成统一逻辑，配套案例与工具包充足，复购与转介绍路径清晰。',
      actions: [
        '基于最佳客户旅程设计升级权益（如定制仪式、复盘工作坊），持续抬升客单价。',
        '把交付SOP转化为可视化「疗愈路径」或工具包，让销售环节讲解更具说服力。',
      ],
      signals: ['关注交付容量与人力负荷，防止体验波动', '可建立交付满意度指标，驱动持续优化'],
    },
    mid: {
      summary: '产品基础扎实但亮点不够突出，案例资产和交付体验仍有打磨空间。',
      detail:
        '已有主打产品与流程，但差异化卖点、体验设计与佐证素材仍不足，难以在销售环节支撑高溢价。',
      actions: [
        '补齐阶段性交付节点的关键话术、表单与反馈模板，减少体验波动。',
        '系统收集案例与见证，制作「成果册」供销售与短视频引用。',
      ],
      signals: ['加强交付可视化，让客户看到过程与成果', '案例素材需定期更新保持说服力'],
    },
    low: {
      summary: '产品仍分散、方法论缺乏可视化表达，难以支撑高溢价沟通。',
      detail:
        '缺少标准化交付路径与方法模型，客户难以理解价值，销售也缺少可传递的证据链，客单价难以突破。',
      actions: [
        '梳理主打产品的起承转合：前测-疗愈-陪跑-复盘，明确每一步的交付物。',
        '提炼专属模型（例如三阶段、四象限等），形成统一的视觉稿与讲解文案。',
      ],
      signals: ['先完善产品说明书与交付手册，再扩展销售渠道', '可邀请典型客户共创案例，提升信任'],
    },
  },
  content: {
    high: {
      summary: '内容主线鲜明，故事库与教育逻辑支撑了稳定创作节奏。',
      detail:
        '品牌故事、案例与知识点被结构化管理，可跨平台复用，形成统一声量与记忆点。',
      actions: [
        '把高互动内容拆解为固定栏目（案例拆解、疗愈瞬间、幕后花絮）形成矩阵。',
        '建立内容资产库：Slogan、金句、案例截图统一编号，方便跨平台使用。',
      ],
      signals: ['可尝试与其他IP共创扩展影响力', '记得定期复盘内容表现，防止主题疲劳'],
    },
    mid: {
      summary: '已有基础内容支柱，但故事深度与节奏规划仍不稳定。',
      detail:
        '内容主题有方向但缺少脚本模板与素材管理，导致发布节奏受灵感影响，难以维持专业调性。',
      actions: [
        '为三大内容支柱写下各自的「必讲故事」清单，确保输出前后一致。',
        '设置月度主题，先规划脚本与素材，再进入拍摄，提高连贯性。',
      ],
      signals: ['建议搭建素材池与脚本模板，减少临时创作', '可设置内容排期表明确每周交付量'],
    },
    low: {
      summary: '叙事零散，缺少连续性故事与专业观点，难以建立记忆点。',
      detail:
        '目前多为即兴分享，缺少「品牌故事 + 教育内容 + 客户成果」的统筹，难以沉淀资产或承接销售。',
      actions: [
        '补齐品牌原点故事（我为何成为疗愈师），并将其拆成多个短故事穿插说明。',
        '设计教育型系列（如疗愈误区、三步自检），让观众知道你能解决什么问题。',
      ],
      signals: ['从品牌故事、教育系列、客户案例三条线同步推进', '优先搭建脚本模板，保证每条内容有CTA'],
    },
  },
  shortVideo: {
    high: {
      summary: '短视频运营成熟，账号设定与数据迭代都有章可循。',
      detail:
        '账号定位、视觉体系和数据复盘形成闭环，脚本结构统一，能稳定产出匹配高客单形象的作品。',
      actions: [
        '在现有脚本模板上叠加更多「仪式感镜头」与对比素材，提升高端感。',
        '建立每周数据复盘会议，拆解爆款的首句/镜头/强刺激点，沉淀成手册。',
      ],
      signals: ['可拓展多账号或联动直播扩大触达', '注意素材版权与账号安全，建立备份机制'],
    },
    mid: {
      summary: '更新节奏可控，但脚本方法与数据复盘尚未形成闭环。',
      detail:
        '虽然能持续产出，但缺少统一的钩子句式、镜头结构与数据记录，效果依赖个人直觉，难以复制。',
      actions: [
        '统一开头3秒的钩子句式，如「如果你正在...」提高留存率。',
        '建立简单的A/B测试表，每周在选题、封面、CTA上做一次小实验。',
      ],
      signals: ['建议建立视频履历表记录题材与数据', '可引入剪辑/脚本协作，降低个人压力'],
    },
    low: {
      summary: '短视频资产薄弱，账号定位、选题、节奏均需从零搭建。',
      detail:
        '账号视觉、简介、脚本尚未统一，发布频率不稳定，内容目的不清晰，难以形成有效获客。',
      actions: [
        '优先确定账号角色与视觉基调（老师型/伙伴型），一次性做好头像与简介。',
        '制定至少30天内容排期，明确每条视频的目的（教育/信任/成交）。',
      ],
      signals: ['先完成账号体检统一视觉与CTA', '使用模板化脚本启动，快速验证选题'],
    },
  },
  sales: {
    high: {
      summary: '销售闭环顺畅，从引流到成交都有标准动作与物料支持。',
      detail:
        '线索承接、私域培育、面谈脚本与成交物料高度协同，并能通过复购/转介绍形成滚雪球增长。',
      actions: [
        '引入自动化工具（表单机器人、CRM）记录线索行为，做分层跟进。',
        '在交付阶段植入「发现式回访」，自然引向升级产品或转介绍。',
      ],
      signals: ['可强化客户成功指标，构建NPS闭环', '适合搭建多角色销售团队复制打法'],
    },
    mid: {
      summary: '已具备基础引流与私域承接，但话术、物料与跟进节奏仍不稳。',
      detail:
        '线索来源有了，但标准化脚本、成交物料与节奏管理不足，成交效率受个人经验影响较大。',
      actions: [
        '梳理三份核心脚本：加好友欢迎语、需求访谈提纲、报价/异议回复。',
        '制作标准成交包（案例册、流程图、报价单），让价值呈现更专业。',
      ],
      signals: ['需建立线索标签与提醒系统，避免遗漏', '建议定义「72小时跟进节奏」等硬指标'],
    },
    low: {
      summary: '销售链路断点较多，留资、私域运营、成交话术都需要统一规划。',
      detail:
        '从内容到成交缺乏清晰路径，大量线索在加私域前流失，也没有可复用的诊断脚本与异议处理方式。',
      actions: [
        '先搭建至少一条稳定留资路径（短链表单/企业微信），确保线索不流失。',
        '设计「三触点」跟进节奏：初识-诊断-方案，提前写好脚本和问卷。',
      ],
      signals: ['优先补齐留资页、欢迎话术、成交清单三件套', '短期聚焦单一渠道打透，提高成功率'],
    },
  },
  operations: {
    high: {
      summary: '运营资源与节奏完善，可把更多精力放在精细化和组织学习上。',
      detail:
        '团队分工明确、预算可控、数据看板与复盘机制完善，能支撑规模化增长和知识沉淀。',
      actions: [
        '将关键指标（获客成本、客单、完播率）接入统一仪表盘，设定预警值。',
        '固化复盘节奏：每月业务会检视目标完成度、团队能力与下一步实验。',
      ],
      signals: ['可投入资源搭建内部知识库与培训体系', '建议引入外部顾问或标杆案例，持续迭代'],
    },
    mid: {
      summary: '已有基础人力与预算，但目标拆解、数据追踪和复盘机制较弱。',
      detail:
        '具备初步团队与预算，却缺少量化目标与数据记录，难以及时发现问题或验证策略成效。',
      actions: [
        '将季度目标拆成月/周指标，并让负责人在任务墙上可视化进度。',
        '引入最小数据看板（Excel也可），记录流量、线索、成交与复购。',
      ],
      signals: ['建议设定固定复盘议程：数据-问题-决策', '结合预算建立试验池，跟踪投入产出'],
    },
    low: {
      summary: '运营基建不足，团队协同、预算、数据意识都需打底。',
      detail:
        '缺少明确的责任人、流程和预算，执行多依赖个人临时决策，难以复盘，更无法支撑持续增长。',
      actions: [
        '明确各角色职责（内容/运营/销售），即使是兼职也要写下产出标准。',
        '设定最低运营预算与学习计划，每周固定复盘一次关键问题与收获。',
      ],
      signals: ['先搭建基础数据表与周例会制度', '建议预留学习/外部资源预算，加速能力补齐'],
    },
  },
};

const getScoreLevel = (value: number) => {
  if (value >= 75) return 'high';
  if (value >= 50) return 'mid';
  return 'low';
};

const normalizeValue = (question: Question, answer: AnswerValue): number => {
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
      const normalized = normalizeValue(question, value);
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
