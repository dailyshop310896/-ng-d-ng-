/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ScreenMode, AppSettings } from './types';
import { COLOR_PRESETS } from './data/colorPresets';
import { BlackoutScreen } from './components/BlackoutScreen';
import { ScreenTorch } from './components/ScreenTorch';
import { FloatingButton } from './components/FloatingButton';
import { PowerControlCenter } from './components/PowerControlCenter';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import { requestWakeLock, releaseWakeLock } from './utils/wakeLock';
import { toggleCameraTorch } from './utils/cameraTorch';
import { playSwitchSound, triggerHaptic } from './utils/audioFeedback';

const SETTINGS_STORAGE_KEY = 'screen_switch_settings_v1';

const DEFAULT_SETTINGS: AppSettings = {
  language: 'vi',
  soundEnabled: true,
  hapticEnabled: true,
  showAODClock: true,
  wakeLockActive: false,
  shakeToToggle: false,
  floatingButtonEnabled: true,
  screenBrightness: 100,
  selectedColorHex: COLOR_PRESETS[0].hex,
  doubleTapSpeedMs: 380,
};

export default function App() {
  const [screenMode, setScreenMode] = useState<ScreenMode>('normal');
  const [cameraFlashActive, setCameraFlashActive] = useState<boolean>(false);
  const [wakeLockStatus, setWakeLockStatus] = useState<boolean>(false);
  const [remainingSleepTimer, setRemainingSleepTimer] = useState<number | null>(null);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState<boolean>(false);

  // Auto-open privacy modal if URL has ?view=privacy
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('view') === 'privacy') {
        setShowPrivacyPolicy(true);
      }
    }
  }, []);

  // Settings state with localStorage loading
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch {
      // ignore
    }
    return DEFAULT_SETTINGS;
  });

  // Save settings on update
  const handleUpdateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  // WakeLock management
  useEffect(() => {
    if (settings.wakeLockActive) {
      requestWakeLock((active) => setWakeLockStatus(active));
    } else {
      releaseWakeLock((active) => setWakeLockStatus(active));
    }
    return () => {
      releaseWakeLock();
    };
  }, [settings.wakeLockActive]);

  const handleToggleWakeLock = () => {
    const next = !settings.wakeLockActive;
    handleUpdateSettings({ wakeLockActive: next });
  };

  // Sleep Timer countdown
  useEffect(() => {
    if (remainingSleepTimer === null) return;
    if (remainingSleepTimer <= 0) {
      // Time up -> turn off screen!
      setScreenMode('blackout');
      setRemainingSleepTimer(null);
      if (settings.soundEnabled) playSwitchSound('off');
      if (settings.hapticEnabled) triggerHaptic('heavy');
      return;
    }

    const timer = setInterval(() => {
      setRemainingSleepTimer((prev) => (prev !== null && prev > 0 ? prev - 1 : null));
    }, 1000);

    return () => clearInterval(timer);
  }, [remainingSleepTimer, settings.soundEnabled, settings.hapticEnabled]);

  // Shake detection logic
  const lastShakeTimeRef = useRef<number>(0);
  useEffect(() => {
    if (!settings.shakeToToggle) return;

    const handleMotion = (event: DeviceMotionEvent) => {
      const acc = event.accelerationIncludingGravity;
      if (!acc || acc.x === null || acc.y === null || acc.z === null) return;

      const speed = Math.sqrt(acc.x * acc.x + acc.y * acc.y + acc.z * acc.z);
      const now = Date.now();

      // Shake threshold (> 22 m/s^2) and debounce 1.5s
      if (speed > 22 && now - lastShakeTimeRef.current > 1500) {
        lastShakeTimeRef.current = now;
        if (settings.soundEnabled) playSwitchSound('tap');
        if (settings.hapticEnabled) triggerHaptic('double');

        setScreenMode((current) => (current === 'blackout' ? 'normal' : 'blackout'));
      }
    };

    window.addEventListener('devicemotion', handleMotion);
    return () => window.removeEventListener('devicemotion', handleMotion);
  }, [settings.shakeToToggle, settings.soundEnabled, settings.hapticEnabled]);

  // Toggle Camera Flash
  const handleToggleCameraFlash = async () => {
    if (settings.soundEnabled) playSwitchSound(cameraFlashActive ? 'off' : 'on');
    if (settings.hapticEnabled) triggerHaptic('medium');
    const nextState = !cameraFlashActive;
    const success = await toggleCameraTorch(nextState);
    if (success || !nextState) {
      setCameraFlashActive(nextState);
    }
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-zinc-100 flex flex-col justify-between selection:bg-amber-500 selection:text-black">
      {/* 1. BLACKOUT / SCREEN OFF MODE */}
      {screenMode === 'blackout' && (
        <BlackoutScreen
          onWakeUp={() => setScreenMode('normal')}
          showAODClock={settings.showAODClock}
          soundEnabled={settings.soundEnabled}
          hapticEnabled={settings.hapticEnabled}
          doubleTapSpeedMs={settings.doubleTapSpeedMs}
          language={settings.language}
        />
      )}

      {/* 2. SCREEN TORCH MODE */}
      {screenMode === 'screen_torch' && (
        <ScreenTorch
          initialBrightness={settings.screenBrightness}
          selectedColorHex={settings.selectedColorHex}
          onBrightnessChange={(b) => handleUpdateSettings({ screenBrightness: b })}
          onColorChange={(hex) => handleUpdateSettings({ selectedColorHex: hex })}
          onClose={() => setScreenMode('normal')}
          soundEnabled={settings.soundEnabled}
          hapticEnabled={settings.hapticEnabled}
          language={settings.language}
        />
      )}

      {/* 3. NORMAL CONTROL DASHBOARD */}
      {screenMode === 'normal' && (
        <main className="w-full flex-1 flex flex-col justify-between p-4 sm:p-6 max-w-lg mx-auto">
          <PowerControlCenter
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onActivateBlackout={() => setScreenMode('blackout')}
            onActivateTorch={() => setScreenMode('screen_torch')}
            onToggleCameraFlash={handleToggleCameraFlash}
            cameraFlashActive={cameraFlashActive}
            wakeLockStatus={wakeLockStatus}
            onToggleWakeLock={handleToggleWakeLock}
            remainingSleepTimer={remainingSleepTimer}
            onSetSleepTimer={(sec) => setRemainingSleepTimer(sec)}
            onOpenPrivacyPolicy={() => setShowPrivacyPolicy(true)}
          />

          {/* Footer branding and copyright */}
          <footer className="pt-4 pb-2 text-center text-zinc-600 text-[11px] font-mono">
            <span>
              {settings.language === 'en'
                ? 'VIRTUAL POWER SWITCH • HARDWARE BUTTON PROTECTOR'
                : 'CÔNG TẮC NGUỒN ẢO • BẢO VỆ NÚT VẬT LÝ'}
            </span>
          </footer>

          {/* Floating Virtual Power Button (if enabled) */}
          {settings.floatingButtonEnabled && (
            <FloatingButton
              onPress={() => setScreenMode('blackout')}
              soundEnabled={settings.soundEnabled}
              hapticEnabled={settings.hapticEnabled}
              language={settings.language}
            />
          )}

          {/* Privacy Policy Modal */}
          {showPrivacyPolicy && (
            <PrivacyPolicyModal
              onClose={() => setShowPrivacyPolicy(false)}
              language={settings.language}
            />
          )}
        </main>
      )}
    </div>
  );
}
