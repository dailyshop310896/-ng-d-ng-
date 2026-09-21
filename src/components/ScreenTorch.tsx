import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Power, Sun, Palette, Zap, X, Maximize2, Minimize2, AlertTriangle, Flashlight } from 'lucide-react';
import { COLOR_PRESETS } from '../data/colorPresets';
import { playSwitchSound, triggerHaptic } from '../utils/audioFeedback';
import { toggleCameraTorch } from '../utils/cameraTorch';

interface ScreenTorchProps {
  initialBrightness: number;
  selectedColorHex: string;
  onBrightnessChange: (val: number) => void;
  onColorChange: (hex: string) => void;
  onClose: () => void;
  soundEnabled: boolean;
  hapticEnabled: boolean;
  language?: 'vi' | 'en';
}

export const ScreenTorch: React.FC<ScreenTorchProps> = ({
  initialBrightness,
  selectedColorHex,
  onBrightnessChange,
  onColorChange,
  onClose,
  soundEnabled,
  hapticEnabled,
  language = 'vi',
}) => {
  const [controlsVisible, setControlsVisible] = useState(true);
  const [isStrobeActive, setIsStrobeActive] = useState(false);
  const [strobeState, setStrobeState] = useState(true);
  const [cameraFlashActive, setCameraFlashActive] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const isEn = language === 'en';

  // Strobe effect logic
  useEffect(() => {
    if (!isStrobeActive) return;
    const interval = setInterval(() => {
      setStrobeState((prev) => !prev);
    }, 200);
    return () => clearInterval(interval);
  }, [isStrobeActive]);

  // Handle camera flash sync
  const handleToggleCameraFlash = async () => {
    if (soundEnabled) playSwitchSound(cameraFlashActive ? 'off' : 'on');
    if (hapticEnabled) triggerHaptic('medium');
    const nextState = !cameraFlashActive;
    const success = await toggleCameraTorch(nextState);
    if (success || !nextState) {
      setCameraFlashActive(nextState);
    }
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const currentColor = COLOR_PRESETS.find((c) => c.hex === selectedColorHex) || COLOR_PRESETS[0];

  return (
    <div
      id="screen-torch-view"
      onClick={() => setControlsVisible((prev) => !prev)}
      className="fixed inset-0 z-50 flex flex-col justify-between transition-colors duration-200 select-none overflow-hidden cursor-pointer"
      style={{
        backgroundColor: isStrobeActive && !strobeState ? '#000000' : selectedColorHex,
        opacity: initialBrightness / 100,
      }}
    >
      {/* Top Floating Bar */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full p-4 flex justify-between items-center transition-opacity duration-300 ${
          controlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-xs border border-white/10">
          <Sun className="w-4 h-4 text-amber-300" />
          <span className="font-medium">
            {isEn ? 'Screen Light' : 'Đèn Màn Hình'}: {initialBrightness}%
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-toggle-camera-torch"
            onClick={handleToggleCameraFlash}
            title={isEn ? 'Toggle Rear Flash LED' : 'Bật/Tắt Đèn Flash Camera (nếu có)'}
            className={`p-2.5 rounded-full border backdrop-blur-md transition-colors cursor-pointer ${
              cameraFlashActive
                ? 'bg-amber-500 text-black border-amber-400 font-bold'
                : 'bg-black/60 text-white border-white/20 hover:bg-black/80'
            }`}
          >
            <Flashlight className="w-4 h-4" />
          </button>

          <button
            id="btn-toggle-fullscreen"
            onClick={handleToggleFullscreen}
            title={isEn ? 'Fullscreen' : 'Toàn màn hình'}
            className="p-2.5 rounded-full bg-black/60 text-white border border-white/20 backdrop-blur-md hover:bg-black/80 transition-colors cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            id="btn-exit-screen-torch"
            onClick={() => {
              if (soundEnabled) playSwitchSound('off');
              if (hapticEnabled) triggerHaptic('medium');
              if (cameraFlashActive) toggleCameraTorch(false);
              onClose();
            }}
            title={isEn ? 'Exit' : 'Thoát'}
            className="p-2.5 rounded-full bg-red-600/90 text-white border border-red-500/50 backdrop-blur-md hover:bg-red-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Center hint when controls are hidden */}
      {!controlsVisible && (
        <div className="mx-auto text-center pointer-events-none opacity-40 text-black font-semibold text-xs tracking-wider uppercase">
          {isEn
            ? 'Tap anywhere on screen to show controls'
            : 'Chạm vào bất kỳ vị trí nào để hiển thị bảng điều khiển'}
        </div>
      )}

      {/* Bottom Floating Controls Panel */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-md mx-auto p-4 transition-opacity duration-300 ${
          controlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="bg-black/75 backdrop-blur-lg border border-white/15 text-white rounded-2xl p-4 shadow-2xl flex flex-col gap-3.5">
          {/* Brightness slider */}
          <div>
            <div className="flex justify-between items-center text-xs text-zinc-300 mb-1.5 font-medium">
              <span className="flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                {isEn ? 'Screen brightness' : 'Độ sáng màn hình'}
              </span>
              <span>{initialBrightness}%</span>
            </div>
            <input
              id="slider-torch-brightness"
              type="range"
              min="15"
              max="100"
              value={initialBrightness}
              onChange={(e) => onBrightnessChange(Number(e.target.value))}
              className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
          </div>

          {/* Color Presets */}
          <div>
            <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
              <span className="flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5" />
                {isEn ? 'Light color' : 'Màu ánh sáng'} ({currentColor.name})
              </span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {COLOR_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  id={`btn-color-${preset.id}`}
                  onClick={() => {
                    if (soundEnabled) playSwitchSound('tap');
                    onColorChange(preset.hex);
                  }}
                  title={preset.name}
                  className={`w-9 h-9 rounded-full flex-shrink-0 border-2 transition-transform cursor-pointer ${
                    selectedColorHex === preset.hex
                      ? 'scale-110 border-white ring-2 ring-white/50 shadow-md'
                      : 'border-white/20 hover:scale-105'
                  }`}
                  style={{ backgroundColor: preset.hex }}
                />
              ))}
            </div>
          </div>

          {/* Action buttons row */}
          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/10">
            <button
              id="btn-toggle-strobe"
              onClick={() => {
                if (soundEnabled) playSwitchSound('tap');
                setIsStrobeActive(!isStrobeActive);
              }}
              className={`py-2 px-3 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                isStrobeActive
                  ? 'bg-red-500 text-white border-red-400 animate-pulse'
                  : 'bg-zinc-800/90 text-zinc-300 border-zinc-700 hover:bg-zinc-700'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{isEn ? 'Strobe SOS' : 'Chớp SOS'}</span>
            </button>

            <button
              id="btn-turn-off-screen-from-torch"
              onClick={() => {
                if (soundEnabled) playSwitchSound('off');
                if (hapticEnabled) triggerHaptic('medium');
                if (cameraFlashActive) toggleCameraTorch(false);
                onClose();
              }}
              className="py-2 px-3 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Power className="w-3.5 h-3.5 text-red-400" />
              <span>{isEn ? 'Turn Off Light' : 'Tắt Đèn'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
