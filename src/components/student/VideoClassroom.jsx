import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  ShieldAlert, 
  FileText, 
  Download, 
  CheckCircle2, 
  Clock, 
  BookOpen,
  Sparkles
} from 'lucide-react';

export const VideoClassroom = () => {
  const { 
    activeLesson, 
    setActiveLesson, 
    currentStudent, 
    quizzes, 
    setActiveQuiz,
    showToast 
  } = useApp();

  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [activeTab, setActiveTab] = useState('chapters');
  const [userNotes, setUserNotes] = useState('');

  const [clientIp] = useState('175.157.192.4');

  if (!activeLesson) return null;

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (time) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const changeSpeed = (speed) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const handleSaveNotes = () => {
    showToast("Notes saved to your student cloud locker!", "success");
  };

  const handleStartQuiz = () => {
    const quiz = quizzes.find(q => q.id === activeLesson.quizId) || quizzes[0];
    setActiveQuiz(quiz);
  };

  return (
    <div className="fixed inset-0 z-[120] bg-slate-950/95 backdrop-blur-2xl overflow-y-auto flex flex-col">
      {/* Top Bar - Solid Dark Cinema Bar */}
      <div className="border-b border-slate-800 bg-slate-900 px-4 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-xl">
        <div className="flex items-center gap-3.5">
          <button
            onClick={() => setActiveLesson(null)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition border border-slate-700 flex items-center gap-1.5 active:scale-95"
          >
            <span>← Back to Classroom</span>
          </button>
          <div>
            <h2 className="font-bold text-white text-sm line-clamp-1">{activeLesson.title}</h2>
            <div className="text-[11px] text-cyan-400 font-bold">{activeLesson.unit} • {activeLesson.duration}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-emerald-950/80 border border-emerald-800/80 px-3 py-1 rounded-full text-emerald-400 text-xs font-bold">
            <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
            <span>Anti-Piracy Watermark Protected</span>
          </div>
          <button
            onClick={() => setActiveLesson(null)}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center font-bold hover:bg-slate-700 transition"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Main Content: Video Player on Left, Clean Sidebar on Right */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Video Area */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative rounded-3xl overflow-hidden bg-black border border-slate-800 shadow-2xl aspect-video group">
            <video
              ref={videoRef}
              src={activeLesson.videoUrl}
              autoPlay
              playsInline
              onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime || 0)}
              onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
              className="w-full h-full object-contain"
            />

            {/* DYNAMIC FLOATING WATERMARK (Prevents Screen Recording) */}
            <div className="absolute animate-watermark bg-black/75 backdrop-blur-md border border-white/30 px-3 py-1.5 rounded-xl text-white font-mono text-[11px] pointer-events-none select-none shadow-2xl z-10">
              <div className="flex items-center gap-1.5 font-bold">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                <span>{currentStudent.name}</span>
              </div>
              <div className="text-[9px] text-cyan-300 font-medium">
                {currentStudent.indexNumber} • IP: {clientIp}
              </div>
            </div>

            <div className="absolute top-3 right-3 bg-black/60 px-2.5 py-0.5 rounded text-[10px] font-mono text-slate-300 pointer-events-none">
              Lyntrix Protected Stream
            </div>

            {/* Custom Video Controls Bar */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 flex flex-col gap-2 opacity-95 group-hover:opacity-100 transition">
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={(e) => handleSeek(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />

              <div className="flex items-center justify-between text-xs text-white">
                <div className="flex items-center gap-3">
                  <button onClick={togglePlay} className="p-1 hover:text-blue-400 transition">
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
                  </button>

                  <button 
                    onClick={() => {
                      if (videoRef.current) {
                        videoRef.current.muted = !isMuted;
                        setIsMuted(!isMuted);
                      }
                    }} 
                    className="p-1 hover:text-blue-400 transition"
                  >
                    {isMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5" />}
                  </button>

                  <span className="font-mono text-slate-300 text-[11px]">
                    {Math.floor(currentTime / 60)}:{(Math.floor(currentTime % 60)).toString().padStart(2, '0')} / {activeLesson.duration}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-slate-900/80 px-2 py-0.5 rounded-lg border border-slate-700 text-[11px] font-mono">
                    {[1, 1.25, 1.5, 2].map((spd) => (
                      <button
                        key={spd}
                        onClick={() => changeSpeed(spd)}
                        className={`px-1.5 py-0.5 rounded ${playbackSpeed === spd ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
                      >
                        {spd}x
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      if (videoRef.current?.requestFullscreen) videoRef.current.requestFullscreen();
                    }}
                    className="p-1 hover:text-blue-400 transition"
                  >
                    <Maximize className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Lesson Details & Actions */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-black text-slate-900">{activeLesson.title}</h1>
                <p className="text-xs text-slate-500 mt-1">{activeLesson.description}</p>
              </div>

              {activeLesson.hasQuiz && (
                <button
                  onClick={handleStartQuiz}
                  className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 flex items-center gap-2 transition shrink-0"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Start MCQ Quiz Challenge</span>
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100 text-xs text-slate-700">
              <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                <FileText className="w-4 h-4 text-blue-600" />
                <span className="font-semibold">{activeLesson.notesPdf}</span>
                <button
                  onClick={() => showToast("PDF Lecture Note downloaded!", "success")}
                  className="text-blue-600 hover:underline font-bold ml-2 flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Chapters & Notes Sidebar */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col overflow-hidden h-fit max-h-[600px]">
          <div className="flex items-center border-b border-slate-100 bg-slate-50 p-2 gap-1">
            <button
              onClick={() => setActiveTab('chapters')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'chapters' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Chapters ({activeLesson.chapters?.length || 3})
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'notes' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              My Notes
            </button>
          </div>

          <div className="p-4 flex-1 overflow-y-auto space-y-3">
            {activeTab === 'chapters' && (
              <div className="space-y-2">
                {activeLesson.chapters?.map((ch, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSeek(ch.time)}
                    className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200 transition flex items-center justify-between text-xs group"
                  >
                    <span className="text-slate-700 group-hover:text-blue-700 font-bold">{ch.title}</span>
                    <span className="text-[10px] font-mono text-blue-700 font-bold bg-blue-100 px-2 py-0.5 rounded">
                      {Math.floor(ch.time / 60)}:00
                    </span>
                  </button>
                ))}
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="space-y-3">
                <textarea
                  rows={8}
                  placeholder="Write your study notes and formulas here..."
                  value={userNotes}
                  onChange={(e) => setUserNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={handleSaveNotes}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
                >
                  Save Note
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sticky Floating Bottom Lesson Navigation Bar */}
      <div className="sticky bottom-0 z-40 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 p-3 px-6 shadow-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => showToast("Navigated to Previous Lesson", "info")}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition border border-slate-700 flex items-center gap-2"
          >
            <span>← Previous Lesson</span>
          </button>

          <span className="text-xs text-slate-400 font-medium hidden sm:inline">
            Lesson 34 of 48 • <strong className="text-white">Integral Calculus</strong>
          </span>

          <button
            onClick={() => showToast("Navigated to Next Lesson", "info")}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-md shadow-blue-500/20 flex items-center gap-2"
          >
            <span>Next Lesson →</span>
          </button>
        </div>
      </div>
    </div>
  );
};
