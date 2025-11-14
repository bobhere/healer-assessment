import type { DimensionMeta, DimensionKey, Question } from '../types';

export const dimensionMetas: DimensionMeta[] = [
  {
    key: 'positioning',
    label: '定位与愿景',
    description: '人群画像、价值主张与差异化叙事的清晰度',
    color: '#9b5de5',
  },
  {
    key: 'product',
    label: '产品与交付',
    description: '产品结构、客单承载力与交付体验',
    color: '#f15bb5',
  },
  {
    key: 'content',
    label: '内容与故事',
    description: '品牌故事、内容支柱与表达力',
    color: '#fee440',
  },
  {
    key: 'shortVideo',
    label: '短视频运营',
    description: '账号定位、选题节奏与数据复盘',
    color: '#00bbf9',
  },
  {
    key: 'sales',
    label: '销售闭环',
    description: '引流、私域承接与成交系统',
    color: '#00f5d4',
  },
  {
    key: 'operations',
    label: '运营与资源',
    description: '团队配置、预算、数据与学习机制',
    color: '#ff9f1c',
  },
];

const scaleOptions = (max = 5) =>
  Array.from({ length: max }, (_, idx) => ({
    label: `${idx + 1}`,
    value: (idx + 1) / max,
  }));

const yesNo = [
  { label: '是', value: 1 },
  { label: '否', value: 0 },
];

const conversionOptions = [
  { label: '≥60%', value: 1 },
  { label: '40% - 59%', value: 0.8 },
  { label: '25% - 39%', value: 0.6 },
  { label: '10% - 24%', value: 0.35 },
  { label: '<10%', value: 0.15 },
];

const priceOptions = [
  { label: '≥5万/单', value: 1 },
  { label: '3万 - 5万', value: 0.85 },
  { label: '1万 - 3万', value: 0.65 },
  { label: '5000 - 1万', value: 0.4 },
  { label: '<5000', value: 0.2 },
];

const leadOptions = [
  { label: '多路径(短链/私信/表单/社群)', value: 1 },
  { label: '2条路径并行', value: 0.75 },
  { label: '单一路径', value: 0.45 },
  { label: '无清晰路径', value: 0.1 },
];

const revenueOptions = [
  { label: '≥200万/月', value: 1 },
  { label: '100万 - 200万', value: 0.85 },
  { label: '50万 - 100万', value: 0.65 },
  { label: '20万 - 50万', value: 0.45 },
  { label: '<20万', value: 0.2 },
];

export const questions: Question[] = [
  {
    id: 'q1',
    title: '你的理想客户画像是否细到年龄/职业/典型一天？',
    helper: '越具体越好，方便内容和私域直击痛点',
    dimension: 'positioning',
    type: 'scale',
    weight: 1,
    options: scaleOptions(),
  },
  {
    id: 'q2',
    title: '现在能一句话说清客户买单后的核心变化吗？',
    helper: '例如：XX人群 → 解决XX问题 → 获得XX转变',
    dimension: 'positioning',
    type: 'boolean',
    weight: 0.9,
    options: yesNo,
  },
  {
    id: 'q3',
    title: '你现在的月度营收大概在哪个区间？',
    dimension: 'operations',
    type: 'single',
    weight: 1,
    options: revenueOptions,
  },
  {
    id: 'q4',
    title: '主打产品的客单价大概在多少？',
    dimension: 'product',
    type: 'single',
    weight: 1,
    options: priceOptions,
  },
  {
    id: 'q5',
    title: '交付流程是否有固定节奏＋表单工具？',
    helper: '比如前测-疗程-复盘的SOP、材料、反馈机制',
    dimension: 'product',
    type: 'scale',
    weight: 0.9,
    options: scaleOptions(),
  },
  {
    id: 'q6',
    title: '过去4周短视频/内容是否保持每周≥3条并做复盘？',
    helper: '包含完播/私信等数据复盘',
    dimension: 'shortVideo',
    type: 'scale',
    weight: 0.9,
    options: scaleOptions(),
  },
  {
    id: 'q7',
    title: '真实案例/客户见证是否够用（不同场景都有）？',
    dimension: 'content',
    type: 'scale',
    weight: 0.8,
    options: scaleOptions(),
  },
  {
    id: 'q8',
    title: '引导留资/分层承接路径是否清晰？',
    helper: '短链-表单-客服-社群是否有明确动作',
    dimension: 'sales',
    type: 'single',
    weight: 1,
    options: leadOptions,
  },
  {
    id: 'q9',
    title: '从进私域到成交的平均转化率是多少？',
    dimension: 'sales',
    type: 'single',
    weight: 0.9,
    options: conversionOptions,
  },
  {
    id: 'q10',
    title: '你觉得当前最想解决的业务堵点是什么？',
    dimension: 'operations',
    type: 'text',
    weight: 0,
    placeholder: '例如缺流量、没脚本、成交卡住等',
  },
];

export const questionsByDimension = questions.reduce<Record<DimensionKey, Question[]>>(
  (acc, question) => {
    acc[question.dimension] = acc[question.dimension] || [];
    acc[question.dimension].push(question);
    return acc;
  },
  {
    positioning: [],
    product: [],
    content: [],
    shortVideo: [],
    sales: [],
    operations: [],
  },
);
