import React, { useState, useEffect } from 'react';
import { apiFetch } from '../services/api';
import { useApp } from '../context/AppContext';
import { GraduationCap, Play, Pause, RotateCcw, BookOpen, CheckCircle, HelpCircle } from 'lucide-react';

export const StudyWorkspace = () => {
  const { addToast } = useApp();
  const [studyData, setStudyData] = useState({ subjects: [], assignments: [], flashcards: [] });

  // Pomodoro State
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('focus'); // 'focus' or 'break'

  // Flashcards state
  const [currentFcIdx, setCurrentFcIdx] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    apiFetch('/study')
      .then(data => setStudyData(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    let timer = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      if (mode === 'focus') {
        addToast('Great job! 25 min focus session completed. Take a 5 min break!', 'success');
        setMode('break');
        setTimeLeft(5 * 60);
      } else {
        addToast('Break complete! Ready for next focus session?', 'info');
        setMode('focus');
        setTimeLeft(25 * 60);
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, mode]);

  const toggleTimer = () => setIsRunning(!isRunning);
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const flashcards = studyData.flashcards || [];
  const currentFc = flashcards[currentFcIdx];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Study & Learning Hub</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Course progress, Pomodoro timer, assignments deadline tracker, and active recall flashcards.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Pomodoro Timer Box */}
        <div className="glass-panel" style={{ padding: '28px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)' }}>
          <span className={`badge ${mode === 'focus' ? 'badge-indigo' : 'badge-emerald'}`} style={{ marginBottom: '14px' }}>
            {mode === 'focus' ? '🔥 25 MIN FOCUS SESSION' : '☕ 5 MIN SHORT BREAK'}
          </span>

          <div style={{ fontSize: '4rem', fontWeight: '800', fontFamily: 'monospace', letterSpacing: '4px', margin: '14px 0', color: 'var(--text-primary)' }}>
            {formatTime(timeLeft)}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            <button onClick={toggleTimer} className="btn-primary" style={{ padding: '10px 24px' }}>
              {isRunning ? <><Pause size={18} /> Pause</> : <><Play size={18} /> Start Focus</>}
            </button>
            <button onClick={resetTimer} className="btn-secondary" style={{ padding: '10px 16px' }}>
              <RotateCcw size={18} />
            </button>
          </div>
        </div>

        {/* Active Recall Flashcards */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--accent-cyan)' }}>FLASHCARD REVIEW MODE</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{currentFcIdx + 1} / {flashcards.length}</span>
            </div>

            {currentFc ? (
              <div
                onClick={() => setShowAnswer(!showAnswer)}
                style={{
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '20px',
                  minHeight: '110px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center'
                }}
              >
                <div>
                  <p style={{ fontSize: '1rem', fontWeight: '600', color: showAnswer ? '#34d399' : 'var(--text-primary)' }}>
                    {showAnswer ? currentFc.answer : currentFc.question}
                  </p>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginTop: '8px' }}>
                    (Click to {showAnswer ? 'show question' : 'flip answer'})
                  </span>
                </div>
              </div>
            ) : <p style={{ color: 'var(--text-muted)' }}>No flashcards available</p>}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '14px' }}>
            <button
              onClick={() => { setShowAnswer(false); setCurrentFcIdx(prev => (prev > 0 ? prev - 1 : flashcards.length - 1)); }}
              className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.8rem' }}
            >
              Previous
            </button>
            <button
              onClick={() => { setShowAnswer(false); setCurrentFcIdx(prev => (prev < flashcards.length - 1 ? prev + 1 : 0)); }}
              className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.8rem' }}
            >
              Next Card
            </button>
          </div>
        </div>
      </div>

      {/* Subjects Overview */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Enrolled Courses & Target Hours</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {(studyData.subjects || []).map(sub => {
            const pct = Math.round((sub.completedHours / sub.targetHours) * 100);
            return (
              <div key={sub._id} style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '600' }}>{sub.name}</h4>
                  <span className="badge badge-indigo">{pct}%</span>
                </div>
                <div style={{ width: '100%', height: '8px', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #6366f1, #06b6d4)', borderRadius: '4px' }} />
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                  {sub.completedHours} hrs done of {sub.targetHours} hrs target
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
