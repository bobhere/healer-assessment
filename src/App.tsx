import { useEffect, useState } from 'react';
import './App.css';
import { QuestionSection } from './components/QuestionSection';
import { ProgressBar } from './components/ProgressBar';
import { ResultPanel } from './components/ResultPanel';
import { dimensionMetas, questions, questionsByDimension } from './data/questions';
import { useAssessmentStore } from './store/useAssessmentStore';
import { calculateScores } from './utils/scoring';

function App() {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const answers = useAssessmentStore((state) => state.answers);
  const summary = calculateScores(questions, answers);

  useEffect(() => {
    if (localStorage.getItem('healer-passcode') === 'granted') {
      setAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    const updateViewportClass = () => {
      if (window.innerWidth <= 900) {
        document.body.classList.add('mobile-adapt');
      } else {
        document.body.classList.remove('mobile-adapt');
        document.body.classList.remove('force-desktop');
      }
    };
    updateViewportClass();
    window.addEventListener('resize', updateViewportClass);
    return () => window.removeEventListener('resize', updateViewportClass);
  }, []);

  const handleUnlock = (event: React.FormEvent) => {
    event.preventDefault();
    if (passcode.trim() === '888888') {
      setAuthenticated(true);
      localStorage.setItem('healer-passcode', 'granted');
      setError('');
    } else {
      setError('密码错误，请重试');
    }
  };

  return (
    <div className="page">
      {!authenticated && (
        <div className="auth-overlay">
          <form className="auth-card" onSubmit={handleUnlock}>
            <h2>访问验证</h2>
            <p>请输入测评专用访问密码以继续</p>
            <input
              type="password"
              value={passcode}
              onChange={(event) => setPasscode(event.target.value)}
              placeholder="输入访问密码"
            />
            {error && <span className="auth-error">{error}</span>}
            <button type="submit">进入系统</button>
          </form>
        </div>
      )}
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
