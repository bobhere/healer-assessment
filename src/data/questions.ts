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

const frequencyOptions = [
  { label: '每个作品都记录', value: 1 },
  { label: '每周复盘一次', value: 0.75 },
  { label: '偶尔记录', value: 0.4 },
  { label: '基本不记录', value: 0.1 },
];

const conversionOptions = [
  { label: '≥60%', value: 1 },
  { label: '40% - 59%', value: 0.8 },
  { label: '25% - 39%', value: 0.6 },
  { label: '10% - 24%', value: 0.35 },
  { label: '<10%', value: 0.15 },
];

const priceOptions = [
  { label: '≥3万/单', value: 1 },
  { label: '1万 - 3万', value: 0.8 },
  { label: '5000 - 1万', value: 0.55 },
  { label: '2000 - 5000', value: 0.3 },
  { label: '<2000', value: 0.15 },
];

const caseOptions = [
  { label: '10个以上', value: 1 },
  { label: '4 - 9个', value: 0.75 },
  { label: '1 - 3个', value: 0.45 },
  { label: '暂无', value: 0.1 },
];

const videoFrequency = [
  { label: '每天1条以上', value: 1 },
  { label: '每周3-5条', value: 0.8 },
  { label: '每周1-2条', value: 0.55 },
  { label: '偶发更新', value: 0.2 },
  { label: '尚未开始', value: 0.05 },
];

const leadOptions = [
  { label: '多路径(短链/私信/表单/社群)', value: 1 },
  { label: '2条路径并行', value: 0.75 },
  { label: '单一路径', value: 0.45 },
  { label: '无清晰路径', value: 0.1 },
];

const budgetOptions = [
  { label: '≥3万/月', value: 1 },
  { label: '1万-3万', value: 0.75 },
  { label: '5000-1万', value: 0.5 },
  { label: '1000-5000', value: 0.3 },
  { label: '<1000', value: 0.1 },
];

const dataToolOptions = [
  { label: '专业BI（如DataStudio、Looker）', value: 1 },
  { label: '在线表格/飞书多维表', value: 0.75 },
  { label: '手工Excel', value: 0.45 },
  { label: '未追踪', value: 0.1 },
];

const teamOptions = [
  { code: 'team_content', label: '内容/脚本', value: 0.8 },
  { code: 'team_account', label: '账号运营', value: 0.8 },
  { code: 'team_customer', label: '私域/客服', value: 0.6 },
  { code: 'team_sales', label: '销售/成交', value: 0.8 },
  { code: 'team_ads', label: '投放/数据', value: 0.7 },
  { code: 'team_solo', label: '暂无团队（单人）', value: 0.2 },
];

const supportOptions = [
  { code: 'support_strategy', label: '策略定位', value: 0.8 },
  { code: 'support_content', label: '内容/脚本', value: 0.8 },
  { code: 'support_video', label: '短视频运营', value: 0.8 },
  { code: 'support_sales', label: '销售成交', value: 0.8 },
  { code: 'support_ops', label: '运营/团队', value: 0.8 },
  { code: 'support_other', label: '其他', value: 0.5 },
];

export const questions: Question[] = [
  {
    id: 'q1',
    title: '理想客户画像是否具体到人设细节？',
    helper: '例如年龄、职业、心理状态、核心诉求等',
    dimension: 'positioning',
    type: 'scale',
    weight: 1,
    scaleMax: 5,
    options: scaleOptions(),
  },
  {
    id: 'q2',
    title: '是否能够用一句话表达疗愈方案的核心转变？',
    dimension: 'positioning',
    type: 'boolean',
    weight: 0.9,
    options: yesNo,
  },
  {
    id: 'q3',
    title: '过去12个月高客单复购或转介绍案例的稳定性？',
    dimension: 'positioning',
    type: 'scale',
    weight: 1,
    scaleMax: 5,
    options: scaleOptions(),
  },
  {
    id: 'q4',
    title: '主打产品当前客单价档位？',
    dimension: 'product',
    type: 'single',
    weight: 1,
    options: priceOptions,
  },
  {
    id: 'q5',
    title: '产品交付流程是否具备标准化SOP？',
    dimension: 'product',
    type: 'scale',
    weight: 0.9,
    options: scaleOptions(),
  },
  {
    id: 'q6',
    title: '是否拥有可视化的疗愈模型/工具包？',
    dimension: 'product',
    type: 'boolean',
    weight: 0.8,
    options: yesNo,
  },
  {
    id: 'q7',
    title: '真实案例与客户见证素材储备量',
    dimension: 'product',
    type: 'single',
    weight: 0.8,
    options: caseOptions,
  },
  {
    id: 'q8',
    title: '品牌故事主线是否已沉淀？',
    dimension: 'content',
    type: 'scale',
    weight: 0.9,
    options: scaleOptions(),
  },
  {
    id: 'q9',
    title: '是否明确3-4个长期内容支柱？',
    dimension: 'content',
    type: 'boolean',
    weight: 0.8,
    options: yesNo,
  },
  {
    id: 'q10',
    title: '近30天短视频输出频率',
    dimension: 'shortVideo',
    type: 'single',
    weight: 1,
    options: videoFrequency,
  },
  {
    id: 'q11',
    title: '账号视觉与简介是否匹配高客单定位？',
    dimension: 'shortVideo',
    type: 'scale',
    weight: 0.8,
    options: scaleOptions(),
  },
  {
    id: 'q12',
    title: '短视频脚本是否有统一模板？',
    dimension: 'shortVideo',
    type: 'scale',
    weight: 0.8,
    options: scaleOptions(),
  },
  {
    id: 'q13',
    title: '是否进行受众调研来确定选题？',
    dimension: 'shortVideo',
    type: 'boolean',
    weight: 0.7,
    options: yesNo,
  },
  {
    id: 'q14',
    title: '完播/互动等核心指标的监控频率',
    dimension: 'shortVideo',
    type: 'single',
    weight: 0.8,
    options: frequencyOptions,
  },
  {
    id: 'q15',
    title: '是否有测试-复盘-迭代机制？',
    dimension: 'shortVideo',
    type: 'scale',
    weight: 0.9,
    options: scaleOptions(),
  },
  {
    id: 'q16',
    title: '引导留资与承接路径的清晰度',
    dimension: 'sales',
    type: 'single',
    weight: 1,
    options: leadOptions,
  },
  {
    id: 'q17',
    title: '线索到私域的平均转化率',
    dimension: 'sales',
    type: 'single',
    weight: 0.9,
    options: conversionOptions,
  },
  {
    id: 'q18',
    title: '目前已搭建的私域阵地（多选）',
    helper: '可多选：个人号/社群/企微/SaaS等',
    dimension: 'sales',
    type: 'multi',
    weight: 0.8,
    options: [
      { code: 'priv_personal', label: '微信个人号', value: 0.8 },
      { code: 'priv_groups', label: '微信群/社群', value: 0.7 },
      { code: 'priv_enterprise', label: '企微矩阵', value: 1 },
      { code: 'priv_miniapp', label: '表单/小程序', value: 0.7 },
      { code: 'priv_none', label: '尚未搭建', value: 0.1 },
    ],
  },
  {
    id: 'q19',
    title: '是否有标准化私聊/面谈话术？',
    dimension: 'sales',
    type: 'scale',
    weight: 0.8,
    options: scaleOptions(),
  },
  {
    id: 'q20',
    title: '电话或面谈的成交率',
    dimension: 'sales',
    type: 'single',
    weight: 0.9,
    options: conversionOptions,
  },
  {
    id: 'q21',
    title: '是否配置成交辅助物料（案例册/报价单/合约）？',
    dimension: 'sales',
    type: 'boolean',
    weight: 0.7,
    options: yesNo,
  },
  {
    id: 'q22',
    title: '交付后的满意度追踪与复购机制',
    dimension: 'product',
    type: 'scale',
    weight: 0.8,
    options: scaleOptions(),
  },
  {
    id: 'q23',
    title: '是否设置客户里程碑与阶段反馈？',
    dimension: 'product',
    type: 'boolean',
    weight: 0.7,
    options: yesNo,
  },
  {
    id: 'q24',
    title: '团队配置（可多选）',
    dimension: 'operations',
    type: 'multi',
    weight: 0.8,
    options: teamOptions,
  },
  {
    id: 'q25',
    title: '每月用于内容与投流的预算',
    dimension: 'operations',
    type: 'single',
    weight: 0.8,
    options: budgetOptions,
  },
  {
    id: 'q26',
    title: '使用哪些数据看板追踪业务表现？',
    dimension: 'operations',
    type: 'single',
    weight: 0.7,
    options: dataToolOptions,
  },
  {
    id: 'q27',
    title: '复盘/对齐会议的节奏',
    dimension: 'operations',
    type: 'single',
    weight: 0.7,
    options: [
      { label: '每周一次', value: 1 },
      { label: '双周一次', value: 0.75 },
      { label: '每月一次', value: 0.5 },
      { label: '临时或无', value: 0.15 },
    ],
  },
  {
    id: 'q28',
    title: '下季度营收与客单目标是否量化？',
    dimension: 'operations',
    type: 'scale',
    weight: 0.7,
    options: scaleOptions(),
  },
  {
    id: 'q29',
    title: '当前自评的最大瓶颈是？',
    dimension: 'operations',
    type: 'text',
    weight: 0,
    placeholder: '简述最迫切需要突破的环节',
  },
  {
    id: 'q30',
    title: '希望获得的外部支持类型（可多选）',
    dimension: 'operations',
    type: 'multi',
    weight: 0,
    options: supportOptions,
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
