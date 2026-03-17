import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Square, Minus, Plus, Bell } from 'lucide-react';

interface RestTimerProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function RestTimer({ isVisible, onClose }: RestTimerProps) {
  const [initialTime, setInitialTime] = useState(60); // 60 seconds default
  const [timeLeft, setTimeLeft] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      clearInterval(interval!);
      setIsActive(false);
      setIsFinished(true);
      
      // Try to play sound/vibrate if browser allows
      if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200, 100, 500]);
      }
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  // Reset timer state when it becomes visible again
  useEffect(() => {
    if (isVisible) {
      setTimeLeft(initialTime);
      setIsActive(true);
      setIsFinished(false);
    }
  }, [isVisible, initialTime]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(initialTime);
    setIsFinished(false);
  };

  const handleClose = () => {
    resetTimer();
    onClose();
  };

  const adjustTime = (amount: number) => {
    const newInitial = Math.max(10, initialTime + amount);
    setInitialTime(newInitial);
    if (!isActive) {
      setTimeLeft(newInitial);
    }
  };

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  const percentage = (timeLeft / initialTime) * 100;

  if (!isVisible && !isActive && !isFinished) return null;

  return (
    <AnimatePresence>
      {(isVisible || isActive || isFinished) && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          style={{
            position: 'fixed',
            bottom: '5rem', // Above bottom nav
            left: '1rem',
            right: '1rem',
            background: 'var(--bg-secondary)',
            border: '1px solid',
            borderColor: isFinished ? 'var(--success)' : 'var(--accent-primary)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-lg), 0 0 20px rgba(0,0,0,0.5)',
            padding: '1rem',
            zIndex: 100,
            overflow: 'hidden'
          }}
        >
          {/* Progress bar background */}
          <div style={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0,
            height: '4px',
            background: 'var(--bg-tertiary)'
          }}>
            <motion.div 
              style={{
                height: '100%',
                background: isFinished ? 'var(--success)' : 'var(--accent-primary)',
                width: `${percentage}%`
              }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1, ease: 'linear' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ 
                fontVariantNumeric: 'tabular-nums', 
                fontSize: '2rem', 
                fontWeight: 800,
                color: isFinished ? 'var(--success)' : 'var(--text-primary)',
                lineHeight: 1
              }}>
                {formatTime(timeLeft)}
              </div>

              {isFinished && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--success)', fontWeight: 600, fontSize: '0.875rem' }}>
                  <Bell size={16} /> ¡A trabajar!
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              {!isActive && !isFinished && (
                <>
                  <button className="btn-icon" onClick={() => adjustTime(-15)}><Minus size={18} /></button>
                  <button className="btn-icon" onClick={() => adjustTime(15)}><Plus size={18} /></button>
                </>
              )}
              
              <button 
                onClick={isFinished ? handleClose : toggleTimer} 
                className="btn-icon"
                style={{ 
                  background: isFinished ? 'var(--success)' : (isActive ? 'var(--bg-tertiary)' : 'var(--accent-primary)'), 
                  color: isActive ? 'var(--text-primary)' : 'white',
                  width: '40px', height: '40px'
                }}
              >
                {isFinished ? <Square size={18} /> : (isActive ? <Pause size={18} /> : <Play size={18} fill="currentColor" />)}
              </button>
              
              <button 
                onClick={handleClose} 
                className="btn-icon"
                style={{ color: 'var(--text-tertiary)' }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>Cerrar</div>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
