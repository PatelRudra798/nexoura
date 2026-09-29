import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  X,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Award,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Sparkles,
  BookOpen
} from 'lucide-react';

export function TestModal({ assessmentId, isOpen, onClose, onAssessmentCompleted }) {
  const [loading, setLoading] = useState(true);
  const [assessment, setAssessment] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { [questionId]: optionString }
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen || !assessmentId) return;

    let isMounted = true;
    setLoading(true);
    setError('');
    setResult(null);
    setSelectedAnswers({});
    setCurrentIdx(0);

    apiService.getAssessmentDetail(assessmentId).then((res) => {
      if (!isMounted) return;
      setLoading(false);
      if (res.success) {
        setAssessment(res.data);
      } else {
        setError(res.error || 'Failed to load assessment details.');
      }
    });

    return () => {
      isMounted = false;
    };
  }, [isOpen, assessmentId]);

  if (!isOpen) return null;

  const handleSelectOption = (questionId, option) => {
    if (result) return; // View mode only after submission
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const handleSubmit = async () => {
    if (!assessment) return;

    const unansweredCount = assessment.questions.filter((q) => !selectedAnswers[q.id]).length;
    if (unansweredCount > 0) {
      const confirmSubmit = window.confirm(
        `You have ${unansweredCount} unanswered question(s). Are you sure you want to submit?`
      );
      if (!confirmSubmit) return;
    }

    setSubmitting(true);
    setError('');

    const payload = assessment.questions.map((q) => ({
      question_id: q.id,
      selected_answer: selectedAnswers[q.id] || '',
    }));

    const res = await apiService.submitAssessment(assessment.id, payload);
    setSubmitting(false);

    if (res.success) {
      setResult(res.data);
      if (onAssessmentCompleted) {
        onAssessmentCompleted(res.data);
      }
    } else {
      setError(res.error || 'Failed to submit assessment.');
    }
  };

  const questions = assessment?.questions || [];
  const currentQ = questions[currentIdx];
  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-panel rounded-3xl border border-white/10 shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-zinc-900/60">
          <div>
            <div className="flex items-center gap-2.5">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <h2 className="text-base font-bold text-white tracking-tight font-heading">
                {assessment?.title || 'Diagnostic Assessment'}
              </h2>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              NEXOURA Learning Intelligence Engine • Topic-Mapped Evaluation
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading && (
            <div className="py-16 text-center space-y-3">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-medium text-zinc-300">Loading verified curriculum questions...</p>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Test Taking View */}
          {!loading && !result && currentQ && (
            <div className="space-y-6">
              {/* Progress and Question Meta */}
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white font-heading">
                  Question {currentIdx + 1} of {questions.length}
                </span>
                <span className="text-zinc-400 font-mono">
                  {answeredCount} of {questions.length} Answered
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-violet-600 h-full transition-all duration-300"
                  style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
                />
              </div>

              {/* Question Card */}
              <div className="space-y-4">
                <p className="text-sm font-semibold text-white leading-relaxed">
                  {currentQ.question_text}
                </p>

                {/* Options */}
                <div className="space-y-2.5 pt-2">
                  {currentQ.options.map((option, oIdx) => {
                    const isSelected = selectedAnswers[currentQ.id] === option;
                    return (
                      <button
                        key={oIdx}
                        type="button"
                        onClick={() => handleSelectOption(currentQ.id, option)}
                        className={`w-full text-left p-3.5 rounded-2xl border text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'border-indigo-500/80 bg-indigo-500/15 text-white font-semibold shadow-glow-indigo'
                            : 'border-white/10 hover:border-zinc-600 bg-zinc-900/60 hover:bg-zinc-800/60 text-zinc-300'
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <span
                            className={`w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-bold font-mono ${
                              isSelected
                                ? 'bg-indigo-500 text-white'
                                : 'bg-zinc-800 text-zinc-400'
                            }`}
                          >
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span>{option}</span>
                        </span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Question Jump Pills */}
              <div className="pt-3 border-t border-white/5 flex flex-wrap gap-1.5">
                {questions.map((q, idx) => {
                  const isCurrent = idx === currentIdx;
                  const isAnswered = Boolean(selectedAnswers[q.id]);
                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => setCurrentIdx(idx)}
                      className={`w-7 h-7 rounded-lg text-xs font-semibold font-mono transition-all cursor-pointer ${
                        isCurrent
                          ? 'ring-2 ring-indigo-400 bg-indigo-500 text-white'
                          : isAnswered
                          ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                          : 'bg-zinc-800/60 text-zinc-500 hover:bg-zinc-700/60 hover:text-white'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Test Results View */}
          {result && (
            <div className="space-y-6">
              {/* Score Header Card */}
              <div className={`p-6 rounded-2xl border text-center space-y-3 ${
                result.passed
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-white'
                  : 'bg-amber-500/10 border-amber-500/30 text-white'
              }`}>
                <div className="inline-flex p-3 rounded-2xl bg-zinc-900 border border-white/10 mb-1">
                  {result.passed ? (
                    <Award className="w-8 h-8 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-8 h-8 text-amber-400" />
                  )}
                </div>
                <h3 className="text-xl font-bold tracking-tight font-heading">
                  {result.passed ? 'Benchmark Passed!' : 'Needs Targeted Review'}
                </h3>
                <p className="text-xs text-zinc-300">
                  You scored <span className="font-bold text-white font-mono">{result.score}</span> out of{' '}
                  <span className="font-bold text-white font-mono">{result.max_score}</span> points (
                  <span className="font-bold text-emerald-400 font-mono">{result.percentage}%</span>).
                </p>
                <div className="pt-1 flex justify-center gap-2">
                  <Badge variant={result.passed ? 'success' : 'warning'}>
                    {result.passed ? 'OPTIMAL PROFICIENCY' : 'WEAK AREAS DETECTED'}
                  </Badge>
                </div>
                <p className="text-[11px] text-zinc-500 pt-2 italic">
                  Topic mastery and personalized recommendations have been recalculated automatically.
                </p>
              </div>

              {/* Question-by-Question Review */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-heading">
                  Detailed Question Analysis & Explanations
                </h4>
                {result.results.map((r, idx) => (
                  <div
                    key={r.question_id}
                    className={`p-4 rounded-2xl border text-xs space-y-2.5 ${
                      r.is_correct
                        ? 'border-emerald-500/20 bg-emerald-500/5'
                        : 'border-rose-500/20 bg-rose-500/5'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-semibold text-white">
                        {idx + 1}. {r.question_text}
                      </span>
                      <span className="shrink-0 flex items-center gap-1 font-bold">
                        {r.is_correct ? (
                          <span className="text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Correct
                          </span>
                        ) : (
                          <span className="text-rose-400 flex items-center gap-1">
                            <XCircle className="w-4 h-4 text-rose-400" /> Incorrect
                          </span>
                        )}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-zinc-400 pl-3 border-l-2 border-zinc-700">
                      <div>
                        Your Answer:{' '}
                        <span className={`font-semibold font-mono ${r.is_correct ? 'text-emerald-400' : 'text-rose-400 line-through'}`}>
                          {r.selected_answer || 'None selected'}
                        </span>
                      </div>
                      {!r.is_correct && (
                        <div>
                          Correct Answer:{' '}
                          <span className="font-semibold text-emerald-400 font-mono">{r.correct_answer}</span>
                        </div>
                      )}
                      {r.explanation && (
                        <div className="text-[11px] text-zinc-400 pt-1">
                          <span className="font-semibold text-zinc-200">Concept Explanation:</span> {r.explanation}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between bg-zinc-900/60">
          {!result ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
                disabled={currentIdx === 0}
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Previous
              </Button>

              {currentIdx < questions.length - 1 ? (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setCurrentIdx((prev) => Math.min(questions.length - 1, prev + 1))}
                >
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button
                  variant="accent"
                  size="sm"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-md border-emerald-400/30"
                >
                  {submitting ? 'Submitting & Grading...' : 'Submit Assessment'}
                </Button>
              )}
            </>
          ) : (
            <div className="w-full flex justify-end">
              <Button variant="primary" size="sm" onClick={onClose}>
                Return to Workspace
              </Button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
