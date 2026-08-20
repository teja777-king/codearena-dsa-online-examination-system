import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Trophy,
  History,
} from 'lucide-react';
import api from '../services/api';
import Button from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';

const ExamsListPage = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExam, setSelectedExam] = useState(null);
  const [instructionsModalOpen, setInstructionsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await api.get('/exams');
        if (res.data.success) {
          setExams(res.data.exams);
        }
      } catch (err) {
        console.error('Error fetching exams:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  const handleOpenInstructions = (exam) => {
    setSelectedExam(exam);
    setInstructionsModalOpen(true);
  };

  const handleStartExam = () => {
    if (selectedExam) {
      navigate(`/exam/${selectedExam._id}/take`);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" className="min-h-[70vh]" />;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-2xl border-slate-800 bg-gradient-to-r from-dark-900 via-dark-850 to-cyan-950/30">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-semibold mb-3 shadow-glow-cyan">
            <FileText className="w-3.5 h-3.5" />
            <span>Formal Assessments</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            DSA Timed Examinations
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
            Timed university examinations with server-side evaluation, negative marking, randomized question sets, and real-time anti-cheating audit protocols.
          </p>
        </div>
      </div>

      {/* Examinations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams.map((exam) => {
          const attemptsCount = exam.userAttemptsCount || 0;
          const maxAttempts = exam.maxAttempts || 3;
          const canTake = attemptsCount < maxAttempts;

          return (
            <div
              key={exam._id}
              className="glass-card-hover p-6 rounded-2xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <Badge variant={exam.status === 'live' ? 'live' : 'scheduled'} size="sm">
                    {exam.status?.toUpperCase()}
                  </Badge>
                  <Badge variant={exam.difficultyLevel?.toLowerCase() || 'medium'} size="sm">
                    {exam.difficultyLevel || 'Comprehensive'}
                  </Badge>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 leading-snug">{exam.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  {exam.description || 'Comprehensive evaluation of Data Structures and Algorithms.'}
                </p>

                {/* Meta details list */}
                <div className="space-y-2.5 pb-6 border-b border-slate-800/80 text-xs text-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-brand-400" /> Duration:
                    </span>
                    <span className="font-semibold text-white">{exam.duration} Minutes</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-blue-400" /> Total Questions:
                    </span>
                    <span className="font-semibold text-white">{exam.questionCount || 30} Qs</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Passing Criteria:
                    </span>
                    <span className="font-semibold text-white">{exam.passingMarks} Marks (40%)</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-400" /> Negative Marking:
                    </span>
                    <span className="font-semibold text-rose-400">
                      {exam.negativeMarking ? `-${exam.negativeMarkValue || 0.25}` : 'None'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <History className="w-3.5 h-3.5 text-purple-400" /> Your Attempts:
                    </span>
                    <span className="font-semibold text-brand-300">{attemptsCount} / {maxAttempts}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-5 flex items-center justify-between gap-3">
                {canTake ? (
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => handleOpenInstructions(exam)}
                    className="w-full shadow-glow-cyan"
                  >
                    Start Examination <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                ) : (
                  <div className="w-full text-center">
                    <span className="text-xs text-amber-400 font-semibold block mb-2">
                      Max Attempts Reached
                    </span>
                    {exam.latestAttempt && (
                      <Link to={`/exam/result/${exam.latestAttempt._id}`}>
                        <Button variant="secondary" size="sm" className="w-full">
                          View Latest Result
                        </Button>
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pre-Exam Instructions Modal */}
      {instructionsModalOpen && selectedExam && (
        <Modal
          isOpen={instructionsModalOpen}
          onClose={() => setInstructionsModalOpen(false)}
          title={`Examination Readiness: ${selectedExam.title}`}
          maxWidth="max-w-lg"
        >
          <div className="space-y-4 text-xs sm:text-sm text-slate-300">
            <div className="p-4 rounded-xl bg-dark-950/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between font-bold text-white text-sm pb-2 border-b border-slate-800">
                <span>Duration: {selectedExam.duration} Minutes</span>
                <span className="text-brand-400">{selectedExam.questionCount} Questions</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Please review the guidelines below before launching the secure exam interface.
              </p>
            </div>

            <div className="space-y-2.5">
              <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider">Exam Rules:</h4>
              <div className="flex items-start gap-2.5 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Each correct answer awards <strong>+1 Mark</strong>. Incorrect answers deduct <strong>-{selectedExam.negativeMarkValue || 0.25} Marks</strong>.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs">
                <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span>Anti-cheating protocols are active. Tab switches, window minimize, and exiting fullscreen are recorded in the audit log.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs">
                <Clock className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
                <span>The timer will persist across page refreshes and auto-submit when countdown hits zero.</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
              <Button
                variant="ghost"
                size="md"
                onClick={() => setInstructionsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handleStartExam}
                className="shadow-glow-cyan"
              >
                I Am Ready — Begin Exam
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ExamsListPage;
