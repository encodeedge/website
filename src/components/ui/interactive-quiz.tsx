import React, { useState } from 'react';
import { Button } from './button';

type Question = {
  question: string;
  type?: 'mcq' | 'msq' | 'answer';
  options?: string[] | null;
  correctAnswer?: number | null;
  correctAnswers?: number[] | null;
  numericAnswer?: number | null;
  explanation?: string;
};

export const InteractiveQuiz = ({ questions }: { questions: Question[] }) => {
  return (
    <div className="space-y-8 mt-10">
      {questions.map((q, index) => (
        <QuestionItem key={index} q={q} index={index} />
      ))}
    </div>
  );
};

const QuestionItem = ({ q, index }: { q: Question; index: number }) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedMCQ, setSelectedMCQ] = useState<number | null>(null);
  const [selectedMSQ, setSelectedMSQ] = useState<number[]>([]);
  const [numericValue, setNumericValue] = useState<string>('');

  const type = q.type || 'mcq';

  const toggleMSQ = (optIndex: number) => {
    setSelectedMSQ(prev =>
      prev.includes(optIndex)
        ? prev.filter(i => i !== optIndex)
        : [...prev, optIndex]
    );
  };

  const isCorrect = () => {
    if (type === 'mcq') {
      return selectedMCQ === q.correctAnswer;
    } else if (type === 'msq') {
      const correct = q.correctAnswers || [];
      if (selectedMSQ.length !== correct.length) return false;
      return correct.every(c => selectedMSQ.includes(c));
    } else if (type === 'answer') {
      return parseFloat(numericValue).toFixed(2) === (q.numericAnswer !== null && q.numericAnswer !== undefined ? q.numericAnswer.toFixed(2) : '');
    }
    return false;
  };

  return (
    <div className="p-6 bg-card border rounded-xl shadow-sm">
      <h3 className="text-lg font-bold mb-4">
        <span className="text-muted-foreground mr-2">{index + 1}.</span> {q.question}
        <span className="ml-2 text-xs font-normal px-2 py-1 bg-muted rounded-full uppercase tracking-wider">
          {type}
        </span>
      </h3>
      
      <div className="space-y-3 mb-6">
        {type === 'mcq' && q.options?.map((opt, optIndex) => (
          <div
            key={optIndex}
            onClick={() => !showAnswer && setSelectedMCQ(optIndex)}
            className={`flex items-center p-3 border rounded-lg transition-colors cursor-pointer ${
              showAnswer 
                ? optIndex === q.correctAnswer 
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                  : selectedMCQ === optIndex 
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    : ''
                : selectedMCQ === optIndex
                  ? 'border-primary bg-accent'
                  : 'hover:bg-muted/50'
            }`}
          >
            <div className={`mr-3 w-4 h-4 rounded-full border flex items-center justify-center ${selectedMCQ === optIndex ? 'border-primary' : 'border-muted-foreground'}`}>
              {selectedMCQ === optIndex && <div className="w-2 h-2 bg-primary rounded-full" />}
            </div>
            <span className="flex-1">{opt}</span>
          </div>
        ))}

        {type === 'msq' && q.options?.map((opt, optIndex) => (
          <div
            key={optIndex}
            onClick={() => !showAnswer && toggleMSQ(optIndex)}
            className={`flex items-center p-3 border rounded-lg transition-colors cursor-pointer ${
              showAnswer 
                ? (q.correctAnswers || []).includes(optIndex)
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                  : selectedMSQ.includes(optIndex)
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    : ''
                : selectedMSQ.includes(optIndex)
                  ? 'border-primary bg-accent'
                  : 'hover:bg-muted/50'
            }`}
          >
            <div className={`mr-3 w-4 h-4 rounded border flex items-center justify-center ${selectedMSQ.includes(optIndex) ? 'border-primary bg-primary' : 'border-muted-foreground'}`}>
               {selectedMSQ.includes(optIndex) && (
                 <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                 </svg>
               )}
            </div>
            <span className="flex-1">{opt}</span>
          </div>
        ))}

        {type === 'answer' && (
          <div className="flex flex-col gap-2">
            <input
              type="number"
              step="0.01"
              value={numericValue}
              onChange={(e) => setNumericValue(e.target.value)}
              disabled={showAnswer}
              className={`p-3 border rounded-lg w-full max-w-xs ${
                showAnswer 
                  ? isCorrect() 
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                    : 'border-red-500 bg-red-50 dark:bg-red-900/20'
                  : ''
              }`}
              placeholder="Enter your answer..."
            />
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        {!showAnswer ? (
          <Button onClick={() => setShowAnswer(true)} variant="outline">
            Check Answer
          </Button>
        ) : (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
            <div className={`font-bold ${isCorrect() ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {isCorrect() ? 'Correct!' : 'Incorrect.'}
            </div>
            
            <div className="text-sm">
              <span className="font-bold">Correct Answer: </span>
              {type === 'mcq' && q.options && q.correctAnswer !== null && q.correctAnswer !== undefined && q.options[q.correctAnswer]}
              {type === 'msq' && q.options && q.correctAnswers && q.correctAnswers.map(c => q.options![c]).join(', ')}
              {type === 'answer' && q.numericAnswer !== null && q.numericAnswer !== undefined && q.numericAnswer.toFixed(2)}
            </div>
            
            {q.explanation && (
              <div className="text-muted-foreground text-sm bg-muted p-3 rounded-lg">
                <span className="font-medium text-foreground">Explanation: </span> 
                {q.explanation}
              </div>
            )}

            <Button onClick={() => {
              setShowAnswer(false);
              setSelectedMCQ(null);
              setSelectedMSQ([]);
              setNumericValue('');
            }} variant="ghost" size="sm" className="mt-2">
              Try Again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
