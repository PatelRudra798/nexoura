import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  X,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  BookOpen,
  HelpCircle,
  FileQuestion,
  Layers,
  ArrowRight,
  Copy
} from 'lucide-react';

export function CreateAssessmentModal({ isOpen, onClose, onCreated, subjects = [] }) {
  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [description, setDescription] = useState('');
  const [timeLimit, setTimeLimit] = useState(15);
  const [passingPercentage, setPassingPercentage] = useState(60);

  // Dynamic questions array
  const [questions, setQuestions] = useState([
    {
      id: 1,
      topic_id: '',
      question_text: '',
      options: ['', '', '', ''],
      correct_option_index: 0,
      explanation: '',
      points: 1
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Auto-select first subject and its first topic if available
  useEffect(() => {
    if (subjects.length > 0 && !subjectId) {
      setSubjectId(subjects[0].id);
    }
  }, [subjects, subjectId]);

  const selectedSubject = subjects.find((s) => s.id === parseInt(subjectId, 10)) || subjects[0];
  const availableTopics = selectedSubject?.topics || [];

  // If topic_id for a question isn't set, default it to first available topic
  useEffect(() => {
    if (availableTopics.length > 0) {
      setQuestions((prev) =>
        prev.map((q) => (q.topic_id ? q : { ...q, topic_id: availableTopics[0].id }))
      );
    }
  }, [subjectId, availableTopics]);

  if (!isOpen) return null;

  // Question Management
  const handleAddQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        id: Date.now(),
        topic_id: availableTopics[0]?.id || '',
        question_text: '',
        options: ['', '', '', ''],
        correct_option_index: 0,
        explanation: '',
        points: 1
      }
    ]);
  };

  const handleRemoveQuestion = (index) => {
    if (questions.length <= 1) {
      alert('An assessment must have at least one question.');
      return;
    }
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleQuestionFieldChange = (index, field, value) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
    setErrorMsg('');
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    setQuestions((prev) => {
      const copy = [...prev];
      const newOpts = [...copy[qIndex].options];
      newOpts[optIndex] = value;
      copy[qIndex] = { ...copy[qIndex], options: newOpts };
      return copy;
    });
    setErrorMsg('');
  };

  const handleSetCorrectOption = (qIndex, optIndex) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[qIndex] = { ...copy[qIndex], correct_option_index: optIndex };
      return copy;
    });
  };

  // Pre-fill a sample multi-question test for quick testing
  const handleLoadSampleTemplate = () => {
    if (!selectedSubject) return;
    const firstTopic = availableTopics[0]?.id || 1;
    const secondTopic = availableTopics[1]?.id || firstTopic;

    setTitle(`${selectedSubject.name}: Mid-Term Diagnostic Sprint`);
    setDescription(`Comprehensive diagnostic covering key concepts in ${selectedSubject.name}.`);
    setTimeLimit(20);
    setPassingPercentage(60);

    setQuestions([
      {
        id: 1,
        topic_id: firstTopic,
        question_text: `In ${selectedSubject.name}, which of the following best defines asymptotic upper bound complexity?`,
        options: [
          'Big-O notation O(n) representing worst-case growth rate',
          'Omega notation Ω(n) representing best-case bound',
          'Theta notation Θ(n) representing average tightly bound cases',
          'Little-o notation representing non-tight strictly faster algorithms'
        ],
        correct_option_index: 0,
        explanation: 'Big-O notation describes an asymptotic upper bound on runtime growth.',
        points: 1
      },
      {
        id: 2,
        topic_id: secondTopic,
        question_text: `Which core invariant must be preserved across structural rebalancing operations?`,
        options: [
          'Search tree key ordering invariant (Left < Node < Right)',
          'Strict sequential array contiguous memory allocation',
          'Constant execution time guarantees regardless of input size',
          'Random access hash table bucket uniform distribution'
        ],
        correct_option_index: 0,
        explanation: 'The binary search tree invariant guarantees logarithmic search efficiency.',
        points: 1
      }
    ]);
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!title.trim()) {
      setErrorMsg('Please enter an assessment title.');
      return;
    }

    if (!subjectId) {
      setErrorMsg('Please select a curriculum subject.');
      return;
    }

    // Validate each question
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question_text.trim()) {
        setErrorMsg(`Question #${i + 1} has empty question text.`);
        return;
      }

      for (let o = 0; o < 4; o++) {
        if (!q.options[o] || !q.options[o].trim()) {
          setErrorMsg(`Question #${i + 1} is missing Option ${String.fromCharCode(65 + o)}.`);
          return;
        }
      }

      const correctOptionText = q.options[q.correct_option_index]?.trim();
      if (!correctOptionText) {
        setErrorMsg(`Question #${i + 1} does not have a valid correct answer selected.`);
        return;
      }
    }

    setLoading(true);

    const payload = {
      subject_id: parseInt(subjectId, 10),
      title: title.trim(),
      description: description.trim() || `Diagnostic test for ${selectedSubject?.name || 'Curriculum'}`,
      time_limit_minutes: parseInt(timeLimit, 10),
      passing_percentage: parseFloat(passingPercentage),
      questions: questions.map((q) => ({
        topic_id: parseInt(q.topic_id || availableTopics[0]?.id || 1, 10),
        question_text: q.question_text.trim(),
        options: q.options.map((opt) => opt.trim()),
        correct_answer: q.options[q.correct_option_index].trim(),
        explanation: q.explanation.trim() || null,
        points: parseInt(q.points, 10) || 1
      }))
    };

    const res = await apiService.createTeacherAssessment(payload);
    setLoading(false);

    if (res.success) {
      setSuccessMsg(`Test "${title}" published successfully with ${questions.length} question(s)!`);
      setTimeout(() => {
        onCreated();
        onClose();
      }, 1200);
    } else {
      setErrorMsg(res.error || 'Failed to publish assessment.');
    }
  };

  const totalPoints = questions.reduce((sum, q) => sum + (parseInt(q.points, 10) || 1), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="glass-panel rounded-3xl border border-white/10 shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden relative">
        
        {/* Subtle Ambient Glow */}
        <div className="absolute -top-16 right-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-zinc-900/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center font-bold shadow-md border border-emerald-400/30">
              <FileQuestion className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight font-heading">
                  Custom Assessment Creator
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  TEACHER STUDIO
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Author customized questions, map syllabus topics, and deploy live benchmarks to students
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLoadSampleTemplate}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-zinc-300 hover:text-white border border-white/10 transition-all cursor-pointer"
              title="Auto-fill sample questions"
            >
              <Copy className="w-3.5 h-3.5 text-indigo-400" />
              <span>Load Template</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status Messages */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5 animate-in fade-in shrink-0">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span className="font-medium">{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mx-6 mt-4 p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5 animate-in fade-in shrink-0">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span className="font-medium">{successMsg}</span>
          </div>
        )}

        {/* Modal Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* SECTION 1: Assessment Metadata */}
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 font-mono block">
              Step 1 • Assessment Configuration
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Assessment Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Graph Algorithms & Shortest Path Diagnostic Sprint"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-zinc-900/80 border border-white/10 text-white placeholder-zinc-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Curriculum Subject <span className="text-rose-400">*</span>
                </label>
                <select
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-zinc-900/80 border border-white/10 text-white focus:border-emerald-500 outline-none font-medium"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id} className="bg-zinc-900 text-white">
                      {s.code}: {s.name} ({s.department})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Time Limit (Minutes)
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                  <input
                    type="number"
                    min="5"
                    max="120"
                    value={timeLimit}
                    onChange={(e) => setTimeLimit(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl bg-zinc-900/80 border border-white/10 text-white focus:border-emerald-500 outline-none font-mono"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Assessment Instructions & Overview (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Mandatory diagnostic for CS301. Focuses on Dijkstra, BFS, and Bellman-Ford algorithms."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-zinc-900/80 border border-white/10 text-white placeholder-zinc-500 focus:border-emerald-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: Dynamic Question Builder */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 font-mono block">
                  Step 2 • Custom Questions ({questions.length} Total)
                </span>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Build custom MCQs with 4 options and designate the verified correct answer.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-3 py-1 rounded-full bg-white/5 text-zinc-300 border border-white/10">
                  {questions.length} Questions • {totalPoints} Pts
                </span>
                <button
                  type="button"
                  onClick={handleAddQuestion}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-glow-indigo transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Question
                </button>
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-5">
              {questions.map((q, qIndex) => (
                <div
                  key={q.id || qIndex}
                  className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4 relative group"
                >
                  {/* Question Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/5">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center font-bold text-xs font-mono">
                        {qIndex + 1}
                      </span>
                      <span className="text-xs font-bold text-white font-heading">
                        Question #{qIndex + 1}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Topic Mapping Dropdown */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] text-zinc-400">Topic:</span>
                        <select
                          value={q.topic_id}
                          onChange={(e) => handleQuestionFieldChange(qIndex, 'topic_id', e.target.value)}
                          className="px-2.5 py-1 text-xs rounded-lg bg-zinc-900 border border-white/10 text-indigo-300 focus:border-indigo-500 outline-none max-w-xs truncate"
                        >
                          {availableTopics.map((t) => (
                            <option key={t.id} value={t.id} className="bg-zinc-900 text-white">
                              {t.code}: {t.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Points selection */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] text-zinc-400">Pts:</span>
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={q.points}
                          onChange={(e) => handleQuestionFieldChange(qIndex, 'points', e.target.value)}
                          className="w-12 px-2 py-1 text-xs rounded-lg bg-zinc-900 border border-white/10 text-white text-center font-mono focus:border-indigo-500 outline-none"
                        />
                      </div>

                      {/* Delete button */}
                      {questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveQuestion(qIndex)}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                          title="Delete this question"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Question Text */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      Question Prompt <span className="text-rose-400">*</span>
                    </label>
                    <textarea
                      rows={2}
                      required
                      placeholder="e.g., Which algorithm is optimal for finding all-pairs shortest paths in a dense graph?"
                      value={q.question_text}
                      onChange={(e) => handleQuestionFieldChange(qIndex, 'question_text', e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-zinc-900/80 border border-white/10 text-white placeholder-zinc-500 focus:border-indigo-500 outline-none transition-all leading-relaxed"
                    />
                  </div>

                  {/* 4 Options Grid */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-zinc-300">
                        Answer Choices (Select radio button for the correct answer)
                      </span>
                      <span className="text-[10px] text-emerald-400 font-mono">
                        Correct: Option {String.fromCharCode(65 + q.correct_option_index)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {['A', 'B', 'C', 'D'].map((letter, optIndex) => {
                        const isCorrect = q.correct_option_index === optIndex;
                        return (
                          <div
                            key={letter}
                            onClick={() => handleSetCorrectOption(qIndex, optIndex)}
                            className={`p-2.5 rounded-xl border transition-all flex items-center gap-2.5 cursor-pointer ${
                              isCorrect
                                ? 'bg-emerald-500/10 border-emerald-500/50 shadow-sm'
                                : 'bg-zinc-900/60 border-white/10 hover:border-zinc-700'
                            }`}
                          >
                            <input
                              type="radio"
                              name={`correct_${q.id}`}
                              checked={isCorrect}
                              onChange={() => handleSetCorrectOption(qIndex, optIndex)}
                              className="accent-emerald-500 cursor-pointer h-4 w-4"
                            />
                            <span
                              className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold font-mono shrink-0 ${
                                isCorrect
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-zinc-800 text-zinc-400'
                              }`}
                            >
                              {letter}
                            </span>
                            <input
                              type="text"
                              required
                              placeholder={`Option ${letter} text...`}
                              value={q.options[optIndex]}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                              className="flex-1 bg-transparent text-xs text-white placeholder-zinc-600 outline-none border-b border-transparent focus:border-emerald-500/60 py-0.5"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Concept Explanation (Optional) */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1">
                      Concept Explanation / Solution Hint (Shown after grading)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Floyd-Warshall uses dynamic programming to solve all-pairs shortest paths in O(V^3) time."
                      value={q.explanation}
                      onChange={(e) => handleQuestionFieldChange(qIndex, 'explanation', e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-zinc-900/60 border border-white/5 text-zinc-300 placeholder-zinc-600 focus:border-indigo-500 outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Add Question Button */}
            <div className="pt-2 flex justify-center">
              <button
                type="button"
                onClick={handleAddQuestion}
                className="px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold border border-white/10 hover:border-indigo-500/40 transition-all flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4 text-indigo-400" />
                <span>Add Another Question (#{questions.length + 1})</span>
              </button>
            </div>
          </div>
        </form>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 bg-zinc-900/80 shrink-0">
          <div className="text-xs text-zinc-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>
              Configured: <strong className="text-white">{questions.length}</strong> questions mapped to{' '}
              <strong className="text-indigo-400">{selectedSubject?.name || 'Curriculum'}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <Button variant="outline" size="sm" type="button" onClick={onClose}>
              Cancel
            </Button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white flex items-center gap-1.5 shadow-md border border-emerald-400/30 transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Publishing Test...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Publish Assessment</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
