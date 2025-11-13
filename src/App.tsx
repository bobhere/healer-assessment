import './App.css';
import { QuestionSection } from './components/QuestionSection';
import { ProgressBar } from './components/ProgressBar';
import { ResultPanel } from './components/ResultPanel';
import { dimensionMetas, questions, questionsByDimension } from './data/questions';
import { useAssessmentStore } from './store/useAssessmentStore';
import { calculateScores } from './utils/scoring';

function App() {
  const answers = useAssessmentStore((state) => state.answers);
  const summary = calculateScores(questions, answers);

  return (
    <div className="page">
      <header className="hero">
        <div>
          <p className="hero-eyebrow">疗愈师高客单增长诊断</p>
          <h1>30问测评 · 明确定位、短视频与成交突破口</h1>
          <p className="hero-subtitle">
            在电话沟通过程中逐题记录答案，系统会实时生成雷达图与行动建议，帮助疗愈师看清优势与短板。
          </p>
        </div>
        <ul className="hero-highlights">
          <li>六大能力维度实时评分</li>
          <li>自动生成CSV / JSON档案</li>
          <li>本地保存数据与教练备注</li>
        </ul>
      </header>

      <ProgressBar value={summary.completion} label="问卷完成度" />

      <main className="content">
        {dimensionMetas.map((dimension) => (
          <QuestionSection
            key={dimension.key}
            title={dimension.label}
            description={dimension.description}
            questions={questionsByDimension[dimension.key]}
          />
        ))}

        <ResultPanel summary={summary} questions={questions} answers={answers} />
      </main>
    </div>
  );
}

export default App;
