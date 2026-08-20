import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Edit2,
  Trash2,
  Globe,
  Archive,
  Layers,
  Sparkles,
} from 'lucide-react';
import api from '../services/api';
import Button from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal, ConfirmDialog } from '../components/common/Modal';
import { LoadingSpinner } from '../components/common/Badge';

const AdminExamsPage = () => {
  const [exams, setExams] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [examToDelete, setExamToDelete] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const initialForm = {
    title: '',
    description: '',
    subject: 'Data Structures and Algorithms',
    duration: 30,
    passingMarks: 12,
    passingPercentage: 40,
    randomizeQuestions: true,
    randomizeOptions: true,
    negativeMarking: true,
    negativeMarkValue: 0.25,
    difficultyLevel: 'Comprehensive',
    status: 'live',
    selectedQuestionIds: [],
    autoPickCount: 30,
  };
  const [formData, setFormData] = useState(initialForm);

  const fetchExams = async () => {
    setLoading(true);
    try {
      const [examsRes, questionsRes] = await Promise.all([
        api.get('/exams'),
        api.get('/questions?limit=100'),
      ]);
      if (examsRes.data.success) setExams(examsRes.data.exams);
      if (questionsRes.data.success) setQuestions(questionsRes.data.questions);
    } catch (err) {
      console.error('Error fetching exams:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingExam(null);
    // Default select 30 questions
    const defaultQIds = questions.slice(0, 30).map((q) => q._id);
    setFormData({
      ...initialForm,
      selectedQuestionIds: defaultQIds,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (exam) => {
    setEditingExam(exam);
    setFormData({
      title: exam.title,
      description: exam.description || '',
      subject: exam.subject || 'Data Structures and Algorithms',
      duration: exam.duration,
      passingMarks: exam.passingMarks,
      passingPercentage: exam.passingPercentage || 40,
      randomizeQuestions: exam.randomizeQuestions,
      randomizeOptions: exam.randomizeOptions,
      negativeMarking: exam.negativeMarking,
      negativeMarkValue: exam.negativeMarkValue || 0.25,
      difficultyLevel: exam.difficultyLevel || 'Comprehensive',
      status: exam.status,
      selectedQuestionIds: exam.questions || [],
      autoPickCount: (exam.questions || []).length,
    });
    setIsModalOpen(true);
  };

  const handleToggleQuestion = (qId) => {
    let list = [...formData.selectedQuestionIds];
    if (list.includes(qId)) {
      list = list.filter((id) => id !== qId);
    } else {
      list.push(qId);
    }
    setFormData({ ...formData, selectedQuestionIds: list });
  };

  const handleAutoPick = (count) => {
    const picked = questions.slice(0, count).map((q) => q._id);
    setFormData({ ...formData, selectedQuestionIds: picked });
  };

  const handleSaveExam = async (e) => {
    e.preventDefault();
    if (formData.selectedQuestionIds.length === 0) {
      return alert('Please select at least one question for this examination.');
    }

    setModalLoading(true);
    const payload = {
      ...formData,
      questions: formData.selectedQuestionIds,
      totalMarks: formData.selectedQuestionIds.length,
    };

    try {
      if (editingExam) {
        await api.put(`/exams/${editingExam._id}`, payload);
      } else {
        await api.post('/exams', payload);
      }
      setIsModalOpen(false);
      fetchExams();
    } catch (err) {
      console.error('Error saving exam:', err);
      alert(err.response?.data?.message || 'Failed to save examination.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteExam = async () => {
    if (!examToDelete) return;
    setModalLoading(true);
    try {
      await api.delete(`/exams/${examToDelete._id}`);
      setDeleteConfirmOpen(false);
      setExamToDelete(null);
      fetchExams();
    } catch (err) {
      console.error('Error deleting exam:', err);
      alert('Failed to delete examination.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleToggleStatus = async (exam) => {
    const newStatus = exam.status === 'live' ? 'draft' : 'live';
    try {
      await api.put(`/exams/${exam._id}`, { status: newStatus });
      fetchExams();
    } catch (err) {
      console.error('Failed to toggle exam status:', err);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-2xl border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-2">
            <FileText className="w-3.5 h-3.5" />
            <span>Examination Operations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Manage Examinations</h1>
          <p className="text-xs text-slate-400 mt-1">
            Create, schedule, configure anti-cheating, and publish timed DSA assessments.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={handleOpenCreateModal}
          icon={Plus}
          className="shadow-glow-cyan"
        >
          Create Examination
        </Button>
      </div>

      {/* Exams Grid */}
      {loading ? (
        <LoadingSpinner size="lg" className="min-h-[50vh]" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam) => (
            <div
              key={exam._id}
              className="glass-card p-6 rounded-2xl border-slate-800 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <Badge variant={exam.status === 'live' ? 'live' : 'draft'} size="sm">
                    {exam.status?.toUpperCase()}
                  </Badge>
                  <span className="text-xs text-slate-400 font-mono">
                    {exam.duration} mins • {exam.questionCount || (exam.questions || []).length} Qs
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-2 leading-snug">{exam.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  {exam.description || 'Comprehensive Data Structures & Algorithms assessment.'}
                </p>

                <div className="space-y-2 pb-5 border-b border-slate-800 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Passing Score:</span>
                    <span className="font-semibold text-white">{exam.passingMarks} Marks</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Negative Marking:</span>
                    <span className="font-semibold text-rose-400">
                      {exam.negativeMarking ? `-${exam.negativeMarkValue || 0.25}` : 'Disabled'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Randomization:</span>
                    <span className="font-semibold text-emerald-400">
                      {exam.randomizeQuestions ? 'Fisher-Yates Active' : 'Off'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-4 flex items-center justify-between gap-2">
                <Button
                  variant={exam.status === 'live' ? 'secondary' : 'primary'}
                  size="sm"
                  onClick={() => handleToggleStatus(exam)}
                >
                  {exam.status === 'live' ? 'Unpublish' : 'Publish Live'}
                </Button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEditModal(exam)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                    title="Edit Exam"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setExamToDelete(exam);
                      setDeleteConfirmOpen(true);
                    }}
                    className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition"
                    title="Delete Exam"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Exam Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingExam ? 'Edit Examination' : 'Create Examination Paper'}
          maxWidth="max-w-2xl"
        >
          <form onSubmit={handleSaveExam} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Exam Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. DSA Mid-Term Assessment"
                className="w-full px-3 py-2 bg-dark-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-brand-400"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Description</label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Assessment overview..."
                className="w-full p-3 bg-dark-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-brand-400"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Duration (Minutes)</label>
                <input
                  type="number"
                  min="5"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-dark-950 border border-slate-800 rounded-xl text-slate-200"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Passing Marks</label>
                <input
                  type="number"
                  value={formData.passingMarks}
                  onChange={(e) => setFormData({ ...formData, passingMarks: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-dark-950 border border-slate-800 rounded-xl text-slate-200"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 bg-dark-950 border border-slate-800 rounded-xl text-slate-200"
                >
                  <option value="live">Live (Active)</option>
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>
            </div>

            {/* Question Picker */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-slate-200">
                  Select Questions ({formData.selectedQuestionIds.length} Selected)
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleAutoPick(30)}
                    className="text-[11px] text-brand-400 hover:underline"
                  >
                    Auto-Pick 30
                  </button>
                  <span className="text-slate-600">|</span>
                  <button
                    type="button"
                    onClick={() => handleAutoPick(50)}
                    className="text-[11px] text-brand-400 hover:underline"
                  >
                    Auto-Pick 50
                  </button>
                </div>
              </div>

              <div className="max-h-48 overflow-y-auto bg-dark-950 p-2 rounded-xl border border-slate-800 space-y-1.5">
                {questions.map((q) => {
                  const isChecked = formData.selectedQuestionIds.includes(q._id);
                  return (
                    <label
                      key={q._id}
                      className={`flex items-center gap-2.5 p-2 rounded-lg cursor-pointer transition ${
                        isChecked ? 'bg-brand-500/10 text-white' : 'text-slate-400 hover:bg-slate-900'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleQuestion(q._id)}
                        className="accent-brand-400 rounded"
                      />
                      <span className="flex-1 truncate">{q.questionText}</span>
                      <Badge variant={q.difficulty} size="sm">{q.topicName}</Badge>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
              <Button variant="ghost" size="md" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="md" type="submit" loading={modalLoading} className="shadow-glow-cyan">
                {editingExam ? 'Update Examination' : 'Create & Publish Exam'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Exam Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDeleteExam}
        title="Delete Examination"
        message="Are you sure you want to permanently delete this exam and all associated student attempts?"
        confirmText="Delete Exam"
        loading={modalLoading}
      />
    </div>
  );
};

export default AdminExamsPage;
