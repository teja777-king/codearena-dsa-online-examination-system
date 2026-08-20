import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Target,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Award,
  Layers,
} from 'lucide-react';
import api from '../services/api';
import Button from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';

const PracticePage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialTopic = queryParams.get('topic') || 'All';

  // Config State
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(initialTopic);
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [questionCount, setQuestionCount] = useState(10);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [loading, setLoading] = useState(false);

  // Active Session State
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [revealedQuestions, setRevealedQuestions] = useState({});
  const [summaryModalOpen, setSummaryModalOpen] = useState(false);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await api.get('/topics');
        if (res.data.success) {
          setTopics(res.data.topics);
        }
      } catch (err) {
        console.error('Error fetching topics:', err);
      }
    };
    fetchTopics();
  }, []);

  const handleStartPractice = async () => {
    setLoading(true);
    try {
      const res = await api.get('/questions/practice', {
        params: {
          topic: selectedTopic,
          difficulty: selectedDifficulty,
          limit: questionCount,
        },
      });

      if (res.data.success && res.data.questions.length > 0) {
        setQuestions(res.data.questions);
        setCurrentIndex(0);
        setSelectedAnswers({});
        setRevealedQuestions({});
        setIsSessionActive(true);
      } else {
        alert('No questions found for the selected criteria. Try selecting "All".');
      }
    } catch (err) {
      console.error('Error loading practice questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const currentQ = questions[currentIndex];
  const currentAnswer = selectedAnswers[currentQ?._id];
  const isRevealed = revealedQuestions[currentQ?._id];

  const handleSelectOption = (optId) => {
    if (isRevealed) return; // Prevent changing after answer reveal
    setSelectedAnswers({ ...selectedAnswers, [currentQ._id]: optId });
  };

  const handleRevealAnswer = () => {
    if (!currentAnswer) return;
    setRevealedQuestions({ ...revealedQuestions, [currentQ._id]: true });
  };

  // Calculate session score
  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q._id] === q.correctAnswer) {
        correct++;
      }
    });
    return {
      correct,
      total: questions.length,
      percentage: Math.round((correct / questions.length) * 100),
    };
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-8">
      {/* Session Setup Mode */}
      {!isSessionActive ? (
        <div className="glass-card p-6 sm:p-10 rounded-2xl border-slate-800 shadow-2xl">
          <div className="text-center max-w-xl mx-auto mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-cyan-400 flex items-center justify-center text-dark-950 font-bold mx-auto mb-4 shadow-glow-cyan">
              <Target className="w-7 h-7" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">DSA Practice Sandbox</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Practice at your own pace with instant answer verification and in-depth explanations.
            </p>
          </div>

          <div className="max-w-md mx-auto space-y-5">
            {/* Topic Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">DSA Topic</label>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full px-4 py-2.5 bg-dark-950/90 border border-slate-800 focus:border-brand-400 rounded-xl text-sm text-slate-100 focus:outline-none transition"
              >
                <option value="All">All Topics (Comprehensive Mix)</option>
                {topics.map((t) => (
                  <option key={t._id} value={t.name}>
                    {t.name} ({t.questionsCount || 0} Questions)
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Difficulty Level</label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-4 py-2.5 bg-dark-950/90 border border-slate-800 focus:border-brand-400 rounded-xl text-sm text-slate-100 focus:outline-none transition"
              >
                <option value="All">All Difficulties</option>
                <option value="easy">Easy (Fundamentals)</option>
                <option value="medium">Medium (Standard DSA)</option>
                <option value="hard">Hard (Advanced Optimization)</option>
              </select>
            </div>

            {/* Questions Count */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Questions Count</label>
              <div className="grid grid-cols-4 gap-2">
                {[5, 10, 15, 20].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setQuestionCount(count)}
                    className={`py-2 rounded-xl text-xs font-bold transition border ${
                      questionCount === count
                        ? 'bg-brand-500 text-dark-950 border-brand-400 shadow-glow-cyan'
                        : 'bg-dark-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {count} Qs
                  </button>
                ))}
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={handleStartPractice}
              loading={loading}
              className="w-full shadow-glow-cyan mt-6"
            >
              Start Practice Session
            </Button>
          </div>
        </div>
      ) : (
        /* Active Practice Mode */
        <div className="space-y-6">
          {/* Header Bar */}
          <div className="glass-card p-4 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge variant="primary" size="md">
                Question {currentIndex + 1} of {questions.length}
              </Badge>
              <Badge variant={currentQ?.difficulty?.toLowerCase()} size="sm">
                {currentQ?.difficulty?.toUpperCase()}
              </Badge>
              <span className="text-xs text-slate-400 hidden sm:inline">{currentQ?.topicName}</span>
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => setSummaryModalOpen(true)}
            >
              End Practice Session
            </Button>
          </div>

          {/* Question Card */}
          <div className="glass-card p-6 sm:p-8 rounded-2xl">
            <h2 className="text-base sm:text-lg font-medium text-white mb-4 leading-relaxed">
              {currentQ?.questionText}
            </h2>

            {currentQ?.codeSnippet && (
              <div className="mb-6 rounded-xl bg-dark-950/90 border border-slate-800 p-4 font-mono text-xs sm:text-sm text-cyan-300 overflow-x-auto shadow-inner">
                <pre className="whitespace-pre">{currentQ.codeSnippet}</pre>
              </div>
            )}

            {/* Options List */}
            <div className="space-y-3 mt-6">
              {(currentQ?.options || []).map((opt) => {
                const isSelected = currentAnswer === opt.id;
                const isCorrect = isRevealed && opt.id === currentQ.correctAnswer;
                const isWrong = isRevealed && isSelected && opt.id !== currentQ.correctAnswer;

                let optionStyle = 'bg-dark-850/60 border-slate-800 hover:border-slate-700 text-slate-300';
                if (isCorrect) {
                  optionStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-200 font-bold shadow-glow-green';
                } else if (isWrong) {
                  optionStyle = 'bg-rose-500/20 border-rose-500 text-rose-200 font-bold shadow-glow-red';
                } else if (isSelected) {
                  optionStyle = 'bg-brand-500/15 border-brand-500 text-white shadow-glow-cyan';
                }

                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelectOption(opt.id)}
                    className={`w-full p-4 rounded-xl text-left border transition-all duration-200 flex items-start gap-3.5 ${optionStyle}`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-dark-950 flex items-center justify-center font-bold text-xs flex-shrink-0">
                      {opt.id}
                    </div>
                    <div className="flex-1 text-sm pt-0.5">{opt.text}</div>
                    {isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />}
                    {isWrong && <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Educational Explanation Box */}
            {isRevealed && (
              <div className="mt-6 p-5 rounded-xl bg-cyan-950/20 border border-brand-500/40 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 text-brand-400 font-bold text-xs mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Educational Explanation:</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {currentQ?.explanation}
                </p>
              </div>
            )}

            {/* Actions Bar */}
            <div className="pt-6 mt-8 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div>
                {!isRevealed ? (
                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleRevealAnswer}
                    disabled={!currentAnswer}
                    className="shadow-glow-cyan"
                  >
                    Check Answer
                  </Button>
                ) : (
                  <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Answer Verified
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentIndex === 0}
                  icon={ChevronLeft}
                >
                  Previous
                </Button>
                {currentIndex < questions.length - 1 ? (
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => setCurrentIndex((prev) => prev + 1)}
                  >
                    Next <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                ) : (
                  <Button
                    variant="accent"
                    size="md"
                    onClick={() => setSummaryModalOpen(true)}
                  >
                    Finish Session
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Session Summary Modal */}
      {summaryModalOpen && (
        <Modal
          isOpen={summaryModalOpen}
          onClose={() => {
            setSummaryModalOpen(false);
            setIsSessionActive(false);
          }}
          title="Practice Session Summary"
          maxWidth="max-w-md"
        >
          {(() => {
            const score = calculateScore();
            return (
              <div className="text-center space-y-4 py-2">
                <div className="w-16 h-16 rounded-full bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400 mx-auto text-2xl font-black shadow-glow-cyan">
                  {score.percentage}%
                </div>
                <h3 className="text-lg font-bold text-white">Great Effort!</h3>
                <p className="text-xs text-slate-400">
                  You answered <span className="text-emerald-400 font-bold">{score.correct}</span> out of{' '}
                  <span className="text-white font-bold">{score.total}</span> questions correctly.
                </p>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-center gap-3">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => {
                      setSummaryModalOpen(false);
                      setIsSessionActive(false);
                    }}
                    className="w-full shadow-glow-cyan"
                  >
                    Back to Setup
                  </Button>
                </div>
              </div>
            );
          })()}
        </Modal>
      )}
    </div>
  );
};

export default PracticePage;
