import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  CheckCircle2,
  X,
  Code,
  Sparkles,
  Layers,
} from 'lucide-react';
import api from '../services/api';
import Button from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal, ConfirmDialog } from '../components/common/Modal';
import { LoadingSpinner } from '../components/common/Badge';

const AdminQuestionsPage = () => {
  const [questions, setQuestions] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(0);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Form State
  const initialForm = {
    questionText: '',
    codeSnippet: '',
    codeLanguage: 'cpp',
    questionType: 'mcq',
    topicName: 'Arrays',
    subTopic: '',
    difficulty: 'medium',
    options: [
      { id: 'A', text: '', code: '' },
      { id: 'B', text: '', code: '' },
      { id: 'C', text: '', code: '' },
      { id: 'D', text: '', code: '' },
    ],
    correctAnswer: 'A',
    explanation: '',
    marks: 1,
    negativeMarks: 0.25,
    timeLimit: 60,
    tags: '',
  };
  const [formData, setFormData] = useState(initialForm);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await api.get('/questions', {
        params: {
          topic: selectedTopic,
          difficulty: selectedDifficulty,
          search,
          page,
          limit: 10,
        },
      });
      if (res.data.success) {
        setQuestions(res.data.questions);
        setTotalPages(res.data.totalPages);
        setTotalQuestions(res.data.total);
      }
    } catch (err) {
      console.error('Error fetching questions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [page, selectedTopic, selectedDifficulty]);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await api.get('/topics');
        if (res.data.success) setTopics(res.data.topics);
      } catch (err) {
        console.error('Error loading topics:', err);
      }
    };
    fetchTopics();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchQuestions();
  };

  const handleOpenCreateModal = () => {
    setEditingQuestion(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (q) => {
    setEditingQuestion(q);
    setFormData({
      questionText: q.questionText || '',
      codeSnippet: q.codeSnippet || '',
      codeLanguage: q.codeLanguage || 'cpp',
      questionType: q.questionType || 'mcq',
      topicName: q.topicName || 'Arrays',
      subTopic: q.subTopic || '',
      difficulty: q.difficulty || 'medium',
      options: q.options || [
        { id: 'A', text: '', code: '' },
        { id: 'B', text: '', code: '' },
        { id: 'C', text: '', code: '' },
        { id: 'D', text: '', code: '' },
      ],
      correctAnswer: q.correctAnswer || 'A',
      explanation: q.explanation || '',
      marks: q.marks || 1,
      negativeMarks: q.negativeMarks || 0.25,
      timeLimit: q.timeLimit || 60,
      tags: Array.isArray(q.tags) ? q.tags.join(', ') : (q.tags || ''),
    });
    setIsModalOpen(true);
  };

  const handleOptionChange = (idx, field, value) => {
    const updatedOptions = [...formData.options];
    updatedOptions[idx][field] = value;
    setFormData({ ...formData, options: updatedOptions });
  };

  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    setModalLoading(true);

    try {
      if (editingQuestion) {
        await api.put(`/questions/${editingQuestion._id}`, formData);
      } else {
        await api.post('/questions', formData);
      }
      setIsModalOpen(false);
      fetchQuestions();
    } catch (err) {
      console.error('Error saving question:', err);
      alert(err.response?.data?.message || 'Failed to save question.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteQuestion = async () => {
    if (!questionToDelete) return;
    setModalLoading(true);
    try {
      await api.delete(`/questions/${questionToDelete._id}`);
      setDeleteConfirmOpen(false);
      setQuestionToDelete(null);
      fetchQuestions();
    } catch (err) {
      console.error('Error deleting question:', err);
      alert('Failed to delete question.');
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header Bar */}
      <div className="glass-card p-6 sm:p-8 rounded-2xl border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-semibold mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Question Bank Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">DSA Question Bank</h1>
          <p className="text-xs text-slate-400 mt-1">
            Author, edit, and organize algorithmic questions across all 22 DSA syllabus topics.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={handleOpenCreateModal}
          icon={Plus}
          className="shadow-glow-cyan"
        >
          Create New Question
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-card p-4 rounded-xl space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search question text or concepts..."
              className="w-full pl-10 pr-4 py-2 bg-dark-950/80 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-brand-400 transition"
            />
          </div>

          {/* Topic Filter */}
          <select
            value={selectedTopic}
            onChange={(e) => { setSelectedTopic(e.target.value); setPage(1); }}
            className="w-full sm:w-48 px-3 py-2 bg-dark-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-brand-400"
          >
            <option value="All">All Topics</option>
            {topics.map((t) => (
              <option key={t._id} value={t.name}>{t.name}</option>
            ))}
          </select>

          {/* Difficulty Filter */}
          <select
            value={selectedDifficulty}
            onChange={(e) => { setSelectedDifficulty(e.target.value); setPage(1); }}
            className="w-full sm:w-36 px-3 py-2 bg-dark-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-brand-400"
          >
            <option value="All">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <Button type="submit" variant="secondary" size="sm">Search</Button>
        </form>
      </div>

      {/* Questions Table */}
      <div className="glass-card rounded-2xl overflow-hidden border-slate-800">
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Showing {questions.length} of {totalQuestions} questions</span>
          <span>Page {page} of {totalPages || 1}</span>
        </div>

        {loading ? (
          <LoadingSpinner size="md" className="py-12" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-dark-950/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 font-bold">Question Details</th>
                  <th className="py-3.5 px-4 font-bold">Topic</th>
                  <th className="py-3.5 px-4 font-bold">Difficulty</th>
                  <th className="py-3.5 px-4 font-bold">Marks</th>
                  <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300 font-medium">
                {questions.map((q) => (
                  <tr key={q._id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 max-w-md">
                      <div className="font-semibold text-white truncate">{q.questionText}</div>
                      {q.codeSnippet && (
                        <div className="text-[10px] text-cyan-400 font-mono mt-0.5">Includes code block ({q.codeLanguage})</div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-slate-200">{q.topicName}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={q.difficulty?.toLowerCase()} size="sm">
                        {q.difficulty?.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-emerald-400 font-bold">
                      +{q.marks} / -{q.negativeMarks}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(q)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                          title="Edit Question"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setQuestionToDelete(q);
                            setDeleteConfirmOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition"
                          title="Delete Question"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {questions.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-slate-500">
                      No questions found matching the criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-800 flex items-center justify-between">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="text-xs text-slate-400">Page {page} of {totalPages}</span>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>

      {/* Create / Edit Question Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingQuestion ? 'Edit DSA Question' : 'Create New DSA Question'}
          maxWidth="max-w-2xl"
        >
          <form onSubmit={handleSaveQuestion} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1 text-xs">
            {/* Question Text */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Question Statement *</label>
              <textarea
                required
                rows={3}
                value={formData.questionText}
                onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
                placeholder="Enter detailed question text..."
                className="w-full p-3 bg-dark-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-brand-400"
              />
            </div>

            {/* Code Snippet (Optional) */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Code Snippet (Optional)</label>
              <textarea
                rows={3}
                value={formData.codeSnippet}
                onChange={(e) => setFormData({ ...formData, codeSnippet: e.target.value })}
                placeholder="int a[] = {1, 2, 3}; ..."
                className="w-full p-3 bg-dark-950 border border-slate-800 rounded-xl font-mono text-cyan-300 placeholder-slate-600 focus:outline-none focus:border-brand-400"
              />
            </div>

            {/* Topic & Difficulty */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">DSA Topic *</label>
                <select
                  value={formData.topicName}
                  onChange={(e) => setFormData({ ...formData, topicName: e.target.value })}
                  className="w-full px-3 py-2 bg-dark-950 border border-slate-800 rounded-xl text-slate-200"
                >
                  {topics.map((t) => (
                    <option key={t._id} value={t.name}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Difficulty *</label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  className="w-full px-3 py-2 bg-dark-950 border border-slate-800 rounded-xl text-slate-200"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>

            {/* Options */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="block font-semibold text-slate-300">Answer Options *</label>
              {formData.options.map((opt, idx) => (
                <div key={opt.id} className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center font-bold text-slate-300">
                    {opt.id}
                  </span>
                  <input
                    type="text"
                    required
                    value={opt.text}
                    onChange={(e) => handleOptionChange(idx, 'text', e.target.value)}
                    placeholder={`Option ${opt.id} text...`}
                    className="flex-1 px-3 py-2 bg-dark-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-brand-400"
                  />
                  <input
                    type="radio"
                    name="correctAnswerOption"
                    checked={formData.correctAnswer === opt.id}
                    onChange={() => setFormData({ ...formData, correctAnswer: opt.id })}
                    title="Mark as correct answer"
                    className="accent-brand-400 cursor-pointer ml-1"
                  />
                </div>
              ))}
            </div>

            {/* Explanation */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Educational Explanation *</label>
              <textarea
                required
                rows={2}
                value={formData.explanation}
                onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                placeholder="Explain why the correct answer is right and discuss complexities..."
                className="w-full p-3 bg-dark-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-brand-400"
              />
            </div>

            {/* Marks & Negative Marks */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Marks (+)</label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.marks}
                  onChange={(e) => setFormData({ ...formData, marks: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-dark-950 border border-slate-800 rounded-xl text-slate-200"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Negative Marks (-)</label>
                <input
                  type="number"
                  step="0.25"
                  value={formData.negativeMarks}
                  onChange={(e) => setFormData({ ...formData, negativeMarks: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-dark-950 border border-slate-800 rounded-xl text-slate-200"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
              <Button variant="ghost" size="md" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="md" type="submit" loading={modalLoading} className="shadow-glow-cyan">
                {editingQuestion ? 'Update Question' : 'Save to Question Bank'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDeleteQuestion}
        title="Delete Question"
        message="Are you sure you want to permanently delete this question from the Question Bank?"
        confirmText="Delete Question"
        loading={modalLoading}
      />
    </div>
  );
};

export default AdminQuestionsPage;
