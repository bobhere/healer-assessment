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

const scaleOptions = (items: string[]) =>
  items.map((label, idx) => ({
    label,
    value: (idx + 1) / items.length,
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
  { label: '2000 - 5000', value: 0.25 },
  { label: '1000 - 2000', value: 0.18 },
  { label: '500 - 1000', value: 0.12 },
  { label: '200 - 500', value: 0.08 },
  { label: '<200', value: 0.05 },
];

const leadOptions = [
  { label: '多路径(短链/私信/表单/社群)', value: 1 },
  { label: '2条路径并行', value: 0.75 },
  { label: '单一路径', value: 0.45 },
  { label: '无清晰路径', value: 0.1 },
];

const revenueOptions = [
  { label: '≥200万/月', value: 1 },
  { label: '100万 - 200万', value: 0.9 },
  { label: '50万 - 100万', value: 0.75 },
  { label: '20万 - 50万', value: 0.55 },
  { label: '10万 - 20万', value: 0.4 },
  { label: '5万 - 10万', value: 0.3 },
  { label: '3万 - 5万', value: 0.22 },
  { label: '1万 - 3万', value: 0.15 },
  { label: '5000 - 1万', value: 0.1 },
  { label: '3000 - 5000', value: 0.07 },
  { label: '<3000 / 暂无收入', value: 0.04 },
];

export const questions: Question[] = [
  {
    id: 'q1',
    title: '你能描述理想客户到“年龄+职业+典型一天”吗？',
    helper: '越具体越好，方便内容和私域直击痛点',
    dimension: 'positioning',
    type: 'single',
    weight: 1,
    options: [
      { label: '有名字/头像/家庭背景，都能描述', value: 1 },
      { label: '能说清年龄、职业、生活习惯', value: 0.75 },
      { label: '只知道大概年龄段或行业', value: 0.4 },
      { label: '还没细化，只有“焦虑职场女性”这种描述', value: 0.15 },
      { label: '没有描述，欢迎帮忙一起梳理', value: 0.05 },
    ],
  },
  {
    id: 'q2',
    title: '一句话价值主张是否已经想好？',
    helper: '例如“XX人群→解决XX问题→获得XX结果”',
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
    title: '交付流程做到了哪个程度？',
    helper: '例如是否有前测、课堂、复盘的SOP和表单',
    dimension: 'product',
    type: 'single',
    weight: 0.9,
    options: [
      { label: '每个阶段都有SOP、表单和材料，助理也能执行', value: 1 },
      { label: '主要流程清楚，但部分环节靠临场发挥', value: 0.75 },
      { label: '有笔记但没形成固定节奏', value: 0.4 },
      { label: '完全靠自己临时安排', value: 0.15 },
    ],
  },
  {
    id: 'q6',
    title: '内容/短视频近4周的执行情况？',
    helper: '频率是否稳定、是否看完播/留言等数据',
    dimension: 'shortVideo',
    type: 'single',
    weight: 0.9,
    options: [
      { label: '每周≥3条并且每条都复盘数据', value: 1 },
      { label: '每周1-2条，偶尔复盘', value: 0.65 },
      { label: '偶尔更新，几乎不看数据', value: 0.25 },
      { label: '还没开始做内容', value: 0.05 },
    ],
  },
  {
    id: 'q7',
    title: '真实案例/客户见证是否够用？',
    dimension: 'content',
    type: 'scale',
    weight: 0.8,
    options: scaleOptions(['各阶段都有案例+截图', '有几个经典案例', '只有少量短评', '暂时没有，尚在收集']),
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
