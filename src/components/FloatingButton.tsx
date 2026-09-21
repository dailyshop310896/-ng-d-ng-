import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Power, Layers, Sparkles } from 'lucide-react';
import { playSwitchSound, triggerHaptic } from '../utils/audioFeedback';
import { openPipOverlay, isPipSupported } from '../utils/pipOverlay';

interface FloatingButtonProps {
  onPress: () => void;
  soundEnabled: boolean;
  hapticEnabled: boolean;
  language?: 'vi' | 'en';
  onOpenOverlayGuide?: () => void;
}

export const FloatingButton: React.FC<FloatingButtonProps> = ({
  onPress,
  soundEnabled,
  hapticEnabled,
  language = 'vi',
  onOpenOverlayGuide,
}) => {
  const isEn = language === 'en';
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: typeof window !== 'undefined' ? window.innerWidth - 75 : 280,
    y: typeof window !== 'undefined' ? window.innerHeight - 180 : 400,
  });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; posX: number; posY: number }>({
    x: 0,
    y: 0,
    posX: 0,
    posY: 0,
  });
  const hasMovedRef = useRef(false);

  useEffect(() => {
    const handleResize = () => {
      setPosition((prev) => ({
        x: Math.min(prev.x, window.innerWidth - 65),
        y: Math.min(prev.y, window.innerHeight - 65),
      }));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    hasMovedRef.current = false;
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      posX: position.x,
      posY: position.y,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;

    if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
      hasMovedRef.current = true;
    }

    const nextX = Math.max(10, Math.min(window.innerWidth - 65, dragStartRef.current.posX + deltaX));
    const nextY = Math.max(10, Math.min(window.innerHeight - 65, dragStartRef.current.posY + deltaY));
    setPosition({ x: nextX, y: nextY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    // If it was a clean click without significant drag, trigger power action
    if (!hasMovedRef.current) {
      if (soundEnabled) playSwitchSound('off');
      if (hapticEnabled) triggerHaptic('medium');
      onPress();
    }
  };

  const handlePopoutPip = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onOpenOverlayGuide) {
      onOpenOverlayGuide();
    } else {
      openPipOverlay({
        onPowerPress: onPress,
        language,
        soundEnabled,
      });
    }
  };

  return (
    <div
      id="floating-virtual-power-button"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      title={isEn ? 'Tap to turn off screen • Drag to reposition' : 'Chạm để tắt màn hình • Kéo để đổi vị trí'}
      className="fixed z-40 touch-none select-none cursor-grab active:cursor-grabbing group"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <motion.div
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className="w-14 h-14 rounded-full bg-zinc-900/95 border border-zinc-700/80 shadow-2xl flex items-center justify-center backdrop-blur-md relative hover:border-amber-400/60 transition-colors"
      >
        {/* Glow indicator */}
        <div className="absolute inset-0 rounded-full bg-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Hardware button icon */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-b from-zinc-800 to-zinc-950 border border-zinc-700/90 flex items-center justify-center shadow-inner">
          <Power className="w-5 h-5 text-red-500 group-hover:text-red-400 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)] transition-colors" />
        </div>

        {/* Mini popout badge (PiP overlay to float outside app) */}
        <button
          onClick={handlePopoutPip}
          title={isEn ? 'Float over other apps' : 'Đè lên các ứng dụng khác (PiP)'}
          className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-500 hover:bg-amber-400 text-black flex items-center justify-center shadow-md cursor-pointer transition-transform hover:scale-110"
        >
          <Layers className="w-2.5 h-2.5" />
        </button>

        {/* Tooltip pill */}
        <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/90 text-zinc-300 text-[10px] px-2 py-0.5 rounded pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity border border-zinc-800">
          {isEn ? 'Turn off screen' : 'Tắt màn hình'}
        </span>
      </motion.div>
    </div>
  );
};
