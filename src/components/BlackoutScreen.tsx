import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Moon, Sparkles, X, Sun, Clock } from 'lucide-react';
import { playSwitchSound, triggerHaptic } from '../utils/audioFeedback';

interface BlackoutScreenProps {
  onWakeUp: () => void;
  showAODClock: boolean;
  soundEnabled: boolean;
  hapticEnabled: boolean;
  doubleTapSpeedMs?: number;
  language?: 'vi' | 'en';
}

export const BlackoutScreen: React.FC<BlackoutScreenProps> = ({
  onWakeUp,
  showAODClock,
  soundEnabled,
  hapticEnabled,
  doubleTapSpeedMs = 380,
  language = 'vi',
}) => {
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [wakeFeedback, setWakeFeedback] = useState<{ x: number; y: number } | null>(null);
  const [tapCount, setTapCount] = useState(0);
  const [hintVisible, setHintVisible] = useState(true);

  const lastTapTimeRef = useRef<number>(0);
  const hintTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isEn = language === 'en';

  // Update clock every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString(isEn ? 'en-US' : 'vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      );
      setDateStr(
        now.toLocaleDateString(isEn ? 'en-US' : 'vi-VN', {
          weekday: 'long',
          day: 'numeric',
          month: isEn ? 'short' : 'numeric',
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [isEn]);

  // Check battery if available
  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'getBattery' in navigator) {
      (navigator as unknown as { getBattery: () => Promise<{ level: number; addEventListener: (t: string, cb: () => void) => void }> })
        .getBattery()
        .then((battery) => {
          setBatteryLevel(Math.round(battery.level * 100));
          battery.addEventListener('levelchange', () => {
            setBatteryLevel(Math.round(battery.level * 100));
          });
        })
        .catch(() => {});
    }
  }, []);

  // Request fullscreen to simulate true hardware power off
  useEffect(() => {
    const el = document.documentElement;
    if (el.requestFullscreen && !document.fullscreenElement) {
      el.requestFullscreen().catch(() => {
        // Fullscreen could be prevented if not triggered in user gesture context
      });
    }

    // Auto fade hint after 4 seconds
    hintTimeoutRef.current = setTimeout(() => {
      setHintVisible(false);
    }, 4500);

    return () => {
      if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current);
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    };
  }, []);

  const handleWake = useCallback(() => {
    if (soundEnabled) playSwitchSound('double_tap');
    if (hapticEnabled) triggerHaptic('double');
    onWakeUp();
  }, [soundEnabled, hapticEnabled, onWakeUp]);

  // Keyboard support (Space, Enter, Esc to wake)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter' || e.key === 'Escape') {
        e.preventDefault();
        handleWake();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleWake]);

  const handleScreenTouchOrClick = (e: React.MouseEvent | React.TouchEvent) => {
    const now = Date.now();
    const timeDiff = now - lastTapTimeRef.current;

    // Get click coordinates
    let clientX = window.innerWidth / 2;
    let clientY = window.innerHeight / 2;
    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    if (timeDiff < doubleTapSpeedMs && timeDiff > 40) {
      // Successful double tap!
      setTapCount(2);
      setWakeFeedback({ x: clientX, y: clientY });
      handleWake();
      lastTapTimeRef.current = 0;
    } else {
      // First tap
      lastTapTimeRef.current = now;
      setTapCount(1);
      setWakeFeedback({ x: clientX, y: clientY });
      if (hapticEnabled) triggerHaptic('light');
      if (soundEnabled) playSwitchSound('tap');

      // Show hint again when tapped once
      setHintVisible(true);
      if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current);
      hintTimeoutRef.current = setTimeout(() => {
        setHintVisible(false);
        setTapCount(0);
      }, 3000);
    }
  };

  return (
    <div
      id="blackout-screen-overlay"
      tabIndex={0}
      onClick={handleScreenTouchOrClick}
      onTouchStart={handleScreenTouchOrClick}
      className="fixed inset-0 z-50 bg-black text-white select-none flex flex-col justify-between items-center cursor-pointer overflow-hidden outline-none"
      style={{ touchAction: 'manipulation' }}
    >
      {/* Ripple / tap indicator effect */}
      <AnimatePresence>
        {wakeFeedback && (
          <motion.div
            key={`${wakeFeedback.x}-${wakeFeedback.y}-${Date.now()}`}
            initial={{ scale: 0.2, opacity: 0.6 }}
            animate={{ scale: 2.2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="absolute pointer-events-none rounded-full border border-white/40 bg-white/10"
            style={{
              width: 120,
              height: 120,
              left: wakeFeedback.x - 60,
              top: wakeFeedback.y - 60,
            }}
          />
        )}
      </AnimatePresence>

      {/* Top row: Status indicators (Subtle) */}
      <div className="w-full flex justify-between items-center px-6 pt-6 text-xs text-zinc-600 font-mono">
        <div className="flex items-center gap-1.5 opacity-60">
          <Moon className="w-3.5 h-3.5" />
          <span>{isEn ? 'SCREEN OFF (OLED BLACK)' : 'MÀN HÌNH TẮT (OLED ĐEN)'}</span>
        </div>
        {batteryLevel !== null && (
          <div className="opacity-60">
            {isEn ? 'BATTERY' : 'PIN'}: {batteryLevel}%
          </div>
        )}
      </div>

      {/* Center: Minimalist Always-on-Display (AOD) or complete void */}
      {showAODClock ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 0.85, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center justify-center pointer-events-none my-auto"
        >
          <div className="text-6xl sm:text-7xl font-light tracking-tighter text-zinc-400 font-mono">
            {timeStr}
          </div>
          <div className="text-sm font-light text-zinc-500 mt-2 capitalize tracking-wide">
            {dateStr}
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-zinc-600 bg-zinc-900/60 px-3 py-1 rounded-full border border-zinc-800/80">
            <Sparkles className="w-3 h-3 text-amber-500/70" />
            <span>{isEn ? '100% OLED screen power savings' : 'Tiết kiệm 100% điện năng màn hình'}</span>
          </div>
        </motion.div>
      ) : (
        <div className="my-auto pointer-events-none" />
      )}

      {/* Bottom Wake Guidance */}
      <div className="w-full max-w-sm px-6 pb-8 flex flex-col items-center gap-3">
        <AnimatePresence>
          {hintVisible && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-2 bg-zinc-900/90 border border-zinc-800 text-zinc-300 text-xs px-4 py-2 rounded-full shadow-lg backdrop-blur-sm">
                <Sun className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>
                  {tapCount === 1
                    ? isEn
                      ? 'Tap once more to turn on screen'
                      : 'Chạm thêm 1 lần nữa để mở màn hình'
                    : isEn
                    ? 'Double tap to wake screen'
                    : 'Chạm 2 lần liên tiếp (Double Tap) để mở đèn'}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Emergency wake up button for one-touch safety */}
        <button
          id="btn-quick-wake-screen"
          onClick={(e) => {
            e.stopPropagation();
            handleWake();
          }}
          className="w-full py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-700 text-zinc-400 hover:text-white text-xs border border-zinc-800/80 flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Sun className="w-4 h-4 text-amber-400" />
          <span>{isEn ? 'Tap here to Turn Screen On Now' : 'Bấm vào đây để Bật Lại Màn Hình Ngay'}</span>
        </button>
      </div>
    </div>
  );
};
