import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import ExamHeader from '../components/exam/ExamHeader';
import QuestionCard from '../components/exam/QuestionCard';
import QuestionNavigator from '../components/exam/QuestionNavigator';
import AntiCheatingOverlay from '../components/exam/AntiCheatingOverlay';
import { Modal } from '../components/common/Modal';
import Button from '../components/common/Button';
import { LoadingSpinner } from '../components/common/Badge';

const ExamTakingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [exam, setExam] = useState(null);
  const [attemptId, setAttemptId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { [qId]: { selectedAnswer, isMarkedForReview, status, timeSpent } }
  const [remainingSeconds, setRemainingSeconds] = useState(1800);
  const [tabSwitches, setTabSwitches] = useState(0);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [timeWarning, setTimeWarning] = useState('');

  const antiCheatingLogsRef = useRef({
    tabSwitchCount: 0,
    fullscreenExitCount: 0,
    copyAttemptCount: 0,
    events: [],
  });

  // Start or resume examination
  useEffect(() => {
    const initExam = async () => {
      try {
        const res = await api.post(`/exams/${id}/start`);
        if (res.data.success) {
          setExam(res.data.exam);
          setAttemptId(res.data.attemptId);
          setQuestions(res.data.questions || []);
          setRemainingSeconds(res.data.remainingSeconds || 1800);

          // Populate existing answers if resuming
          const initialAnswers = {};
          (res.data.savedAnswers || []).forEach((ans) => {
            const qId = (ans.question?._id || ans.question).toString();
            initialAnswers[qId] = {
              selectedAnswer: ans.selectedAnswer,
              isMarkedForReview: ans.status === 'marked_for_review' || ans.status === 'answered_and_marked',
              status: ans.status || 'not_visited',
              timeSpentSeconds: ans.timeSpentSeconds || 0,
            };
          });

          // If first question not visited, set it as visited
          const firstQ = res.data.questions[0];
          if (firstQ && (!initialAnswers[firstQ._id] || initialAnswers[firstQ._id].status === 'not_visited')) {
            initialAnswers[firstQ._id] = {
              selectedAnswer: null,
              isMarkedForReview: false,
              status: 'visited',
              timeSpentSeconds: 0,
            };
          }

          setAnswers(initialAnswers);

          if (res.data.antiCheatingLogs) {
            antiCheatingLogsRef.current = res.data.antiCheatingLogs;
            setTabSwitches(res.data.antiCheatingLogs.tabSwitchCount || 0);
          }
        }
      } catch (err) {
        console.error('Failed to start exam:', err);
        alert(err.response?.data?.message || 'Unable to start examination.');
        navigate('/exams');
      } finally {
        setLoading(false);
      }
    };

    initExam();
  }, [id, navigate]);

  // Persistent Countdown Timer
  useEffect(() => {
    if (loading || remainingSeconds <= 0) return;

    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinalSubmit(true); // Auto submit on 0
          return 0;
        }

        // Time threshold notifications
        if (prev === 600) setTimeWarning('⚠️ 10 Minutes Remaining in Examination!');
        else if (prev === 300) setTimeWarning('⚠️ 5 Minutes Remaining! Review your answers.');
        else if (prev === 60) setTimeWarning('🚨 Final 1 Minute! Submitting soon.');

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, remainingSeconds]);

  // Periodic Auto-Save Progress
  useEffect(() => {
    if (!attemptId || loading) return;

    const saveInterval = setInterval(async () => {
      const answersPayload = Object.keys(answers).map((qId) => ({
        questionId: qId,
        selectedAnswer: answers[qId].selectedAnswer,
        status: answers[qId].isMarkedForReview
          ? (answers[qId].selectedAnswer ? 'answered_and_marked' : 'marked_for_review')
          : (answers[qId].selectedAnswer ? 'answered' : answers[qId].status),
        timeSpentSeconds: answers[qId].timeSpentSeconds || 0,
      }));

      try {
        await api.post(`/attempts/${attemptId}/progress`, {
          answers: answersPayload,
          antiCheatingLogs: antiCheatingLogsRef.current,
        });
      } catch (err) {
        console.warn('Auto-save sync ping:', err.message);
      }
    }, 20000); // every 20s

    return () => clearInterval(saveInterval);
  }, [attemptId, answers, loading]);

  // Anti-Cheating Event Handler
  const handleCheatingEvent = async (eventType, details) => {
    if (eventType === 'tab_switch') {
      antiCheatingLogsRef.current.tabSwitchCount++;
      setTabSwitches((prev) => prev + 1);
    } else if (eventType === 'fullscreen_exit') {
      antiCheatingLogsRef.current.fullscreenExitCount++;
    } else if (eventType === 'copy_attempt') {
      antiCheatingLogsRef.current.copyAttemptCount++;
    }

    antiCheatingLogsRef.current.events.push({
      eventType,
      details,
      timestamp: new Date(),
    });

    if (attemptId) {
      try {
        await api.post(`/attempts/${attemptId}/cheating-event`, { eventType, details });
      } catch (err) {
        console.error('Failed to log cheating event:', err);
      }
    }
  };

  // Option Selection
  const currentQ = questions[currentIndex];
  const currentAnswerState = answers[currentQ?._id] || {};

  const handleSelectOption = (optionId) => {
    setAnswers({
      ...answers,
      [currentQ._id]: {
        ...currentAnswerState,
        selectedAnswer: optionId,
        status: 'answered',
      },
    });
  };

  const handleClearAnswer = () => {
    setAnswers({
      ...answers,
      [currentQ._id]: {
        ...currentAnswerState,
        selectedAnswer: null,
        status: 'visited',
      },
    });
  };

  const handleToggleMarkForReview = () => {
    setAnswers({
      ...answers,
      [currentQ._id]: {
        ...currentAnswerState,
        isMarkedForReview: !currentAnswerState.isMarkedForReview,
      },
    });
  };

  const navigateToQuestion = (index) => {
    if (index >= 0 && index < questions.length) {
      const nextQ = questions[index];
      // Mark as visited if not answered
      if (!answers[nextQ._id] || answers[nextQ._id].status === 'not_visited') {
        setAnswers((prev) => ({
          ...prev,
          [nextQ._id]: {
            selectedAnswer: null,
            isMarkedForReview: false,
            status: 'visited',
            timeSpentSeconds: 0,
          },
        }));
      }
      setCurrentIndex(index);
    }
  };

  // Final Submit Handler
  const handleFinalSubmit = async (isAuto = false) => {
    setSubmitting(true);
    try {
      const formattedAnswers = questions.map((q) => {
        const state = answers[q._id] || {};
        return {
          questionId: q._id,
          selectedAnswer: state.selectedAnswer || null,
          status: state.selectedAnswer ? 'answered' : (state.status || 'not_visited'),
          timeSpentSeconds: state.timeSpentSeconds || 0,
        };
      });

      const res = await api.post(`/exams/${id}/submit`, {
        attemptId,
        answers: formattedAnswers,
        antiCheatingLogs: antiCheatingLogsRef.current,
      });

      if (res.data.success) {
        navigate(`/exam/result/${attemptId}`);
      }
    } catch (err) {
      console.error('Error submitting exam:', err);
      alert(err.response?.data?.message || 'Error submitting examination.');
      setSubmitting(false);
    }
  };

  // Compute live palette statistics
  let answeredCount = 0;
  let markedCount = 0;
  questions.forEach((q) => {
    const a = answers[q._id];
    if (a?.selectedAnswer) answeredCount++;
    if (a?.isMarkedForReview) markedCount++;
  });

  if (loading) {
    return <LoadingSpinner size="lg" className="min-h-[80vh]" />;
  }

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col justify-between select-none">
      {/* Anti-Cheating Listeners & Warning Overlay */}
      <AntiCheatingOverlay
        attemptId={attemptId}
        onEventDetected={handleCheatingEvent}
        isActive={!loading && remainingSeconds > 0}
      />

      {/* Top Fixed Exam Header */}
      <ExamHeader
        examTitle={exam?.title || 'DSA Examination'}
        remainingSeconds={remainingSeconds}
        totalQuestions={questions.length}
        answeredCount={answeredCount}
        markedCount={markedCount}
        tabSwitches={tabSwitches}
        onSubmitClick={() => setSubmitModalOpen(true)}
      />

      {/* Time Notification Banner */}
      {timeWarning && (
        <div className="bg-amber-500/20 border-b border-amber-500/40 py-2 px-4 text-center text-xs font-bold text-amber-300 animate-pulse">
          {timeWarning}
        </div>
      )}

      {/* Main Examination Workspace */}
      <div className="max-w-7xl mx-auto w-full p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Question Card */}
        <div className="lg:col-span-2">
          <QuestionCard
            question={currentQ}
            currentIndex={currentIndex}
            totalQuestions={questions.length}
            selectedAnswer={currentAnswerState.selectedAnswer}
            isMarkedForReview={currentAnswerState.isMarkedForReview}
            onSelectOption={handleSelectOption}
            onClearAnswer={handleClearAnswer}
            onToggleMarkForReview={handleToggleMarkForReview}
            onPrevious={() => navigateToQuestion(currentIndex - 1)}
            onNext={() => {
              if (currentIndex === questions.length - 1) {
                setSubmitModalOpen(true);
              } else {
                navigateToQuestion(currentIndex + 1);
              }
            }}
            isFirst={currentIndex === 0}
            isLast={currentIndex === questions.length - 1}
          />
        </div>

        {/* Right 1 Col: Question Navigator Palette */}
        <div className="lg:col-span-1">
          <QuestionNavigator
            questions={questions}
            answers={answers}
            currentIndex={currentIndex}
            onSelectQuestion={navigateToQuestion}
          />
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {submitModalOpen && (
        <Modal
          isOpen={submitModalOpen}
          onClose={() => setSubmitModalOpen(false)}
          title="Submit Examination Confirmation"
          maxWidth="max-w-md"
        >
          <div className="space-y-4 text-xs sm:text-sm text-slate-300">
            <p>
              Are you sure you want to finalize and submit your examination? Once submitted, your answers will be evaluated on the server immediately.
            </p>

            <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-dark-950/80 border border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 block">Total Questions:</span>
                <span className="text-base font-bold text-white">{questions.length}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Answered:</span>
                <span className="text-base font-bold text-emerald-400">{answeredCount}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Marked for Review:</span>
                <span className="text-base font-bold text-amber-400">{markedCount}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Unanswered:</span>
                <span className="text-base font-bold text-rose-400">
                  {questions.length - answeredCount}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
              <Button
                variant="ghost"
                size="md"
                onClick={() => setSubmitModalOpen(false)}
                disabled={submitting}
              >
                Continue Exam
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => handleFinalSubmit(false)}
                loading={submitting}
                className="shadow-glow-cyan"
              >
                Yes, Submit Exam Now
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ExamTakingPage;
