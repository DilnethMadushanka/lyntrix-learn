import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Award, CheckCircle2, FileText, Send, User, X } from 'lucide-react';
import { sound } from '../../utils/soundEffects';

export const AssignmentGradingModal = ({ isOpen, onClose, submission }) => {
  const { showToast } = useApp();

  const [marks, setMarks] = useState(submission?.score || 85);
  const [feedback, setFeedback] = useState('Excellent work on integration step 4! Review circular motion acceleration formula.');

  if (!isOpen) return null;

  const handleSaveGrade = (e) => {
    e.preventDefault();
    sound.playChimeApproved();
    showToast(`Grade updated: ${marks}/100 and feedback sent to student!`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[140] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95 my-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-600" />
            <h3 className="font-black text-slate-900 text-base">Grade Student Assignment</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center font-bold">✕</button>
        </div>

        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1 text-xs">
          <div className="flex items-center justify-between font-bold text-slate-900">
            <span>{submission?.studentName || 'Nimesh Fernando'}</span>
            <span className="font-mono text-blue-700">{submission?.studentIndex || 'LYN-26-8821'}</span>
          </div>
          <div className="text-slate-500">Submission: {submission?.quizTitle || 'Integration Paper 08 Essay Upload'}</div>
        </div>

        <form onSubmit={handleSaveGrade} className="space-y-4">
          <div>
            <label htmlFor="grading-marks-input" className="block text-xs font-bold text-slate-700 mb-1">Enter Marks (out of 100):</label>
            <input
              id="grading-marks-input"
              name="studentMarks"
              type="number"
              min="0"
              max="100"
              value={marks}
              onChange={(e) => setMarks(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-bold focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="grading-feedback-input" className="block text-xs font-bold text-slate-700 mb-1">Instructor Feedback & Comments:</label>
            <textarea
              id="grading-feedback-input"
              name="instructorFeedback"
              rows={4}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
              placeholder="Provide constructive feedback..."
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-500/20 transition flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Save Marks & Notify Student</span>
          </button>
        </form>
      </div>
    </div>
  );
};
