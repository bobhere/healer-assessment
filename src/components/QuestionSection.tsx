import type { Question } from '../types';
import { QuestionCard } from './QuestionCard';
import { useAssessmentStore } from '../store/useAssessmentStore';

interface QuestionSectionProps {
  title: string;
  description: string;
  questions: Question[];
}

export const QuestionSection = ({ title, description, questions }: QuestionSectionProps) => {
  const answers = useAssessmentStore((state) => state.answers);

  if (!questions.length) return null;

  return (
    <section className="question-section">
      <header className="question-section__header">
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </header>
      <div className="question-section__body">
        {questions.map((question) => (
          <QuestionCard key={question.id} question={question} answer={answers[question.id]} />
        ))}
      </div>
    </section>
  );
};
