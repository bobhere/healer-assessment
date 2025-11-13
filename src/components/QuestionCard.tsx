import clsx from 'clsx';
import type { Question, OptionItem } from '../types';
import { useAssessmentStore } from '../store/useAssessmentStore';
import type { AnswerValue } from '../store/useAssessmentStore';

interface QuestionCardProps {
  question: Question;
  answer: AnswerValue;
}

const getOptionKey = (option: OptionItem) => option.code ?? option.label;

export const QuestionCard = ({ question, answer }: QuestionCardProps) => {
  const setAnswer = useAssessmentStore((state) => state.setAnswer);

  const handleSingleSelect = (value: number) => {
    setAnswer(question.id, value);
  };

  const handleMultiToggle = (option: OptionItem) => {
    const optionKey = getOptionKey(option);
    const current = Array.isArray(answer) ? (answer as string[]) : [];
    const exists = current.includes(optionKey);
    const next = exists ? current.filter((item) => item !== optionKey) : [...current, optionKey];
    setAnswer(question.id, next);
  };

  const renderOptions = () => {
    if (!question.options) return null;

    if (question.type === 'multi') {
      return (
        <div className="option-grid">
          {question.options.map((option) => {
            const optionKey = getOptionKey(option);
            const active = Array.isArray(answer) && (answer as string[]).includes(optionKey);
            return (
              <button
                key={optionKey}
                type="button"
                className={clsx('option-chip', active && 'option-chip__active')}
                onClick={() => handleMultiToggle(option)}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      );
    }

    return (
      <div className="option-grid">
        {question.options.map((option) => (
          <button
            key={option.label}
            type="button"
            className={clsx('option-pill', answer === option.value && 'option-pill__active')}
            onClick={() => handleSingleSelect(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    );
  };

  const renderInput = () => {
    if (question.type === 'text') {
      return (
        <textarea
          className="question-textarea"
          placeholder={question.placeholder}
          value={typeof answer === 'string' ? answer : ''}
          onChange={(event) => setAnswer(question.id, event.target.value)}
        />
      );
    }

    return renderOptions();
  };

  return (
    <div className="question-card">
      <div className="question-card__header">
        <div>
          <p className="question-title">{question.title}</p>
          {question.helper && <p className="question-helper">{question.helper}</p>}
        </div>
        <span className="question-weight">{question.weight > 0 ? '计分' : '信息'}</span>
      </div>
      {renderInput()}
    </div>
  );
};
