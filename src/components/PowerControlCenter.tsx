import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Power,
  Sun,
  Moon,
  Smartphone,
  Shield,
  Eye,
  Volume2,
  VolumeX,
  Vibrate,
  Clock,
  Zap,
  Timer,
  Info,
  Flashlight,
  Layers,
  Sparkles,
  CheckCircle2,
  Globe,
} from 'lucide-react';
import { AppSettings, ScreenMode } from '../types';
import { COLOR_PRESETS } from '../data/colorPresets';
import { playSwitchSound, triggerHaptic } from '../utils/audioFeedback';
import { isWakeLockSupported } from '../utils/wakeLock';
import { AdBanner } from './AdBanner';
import { translations, Language } from '../locales/translations';

interface PowerControlCenterProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onActivateBlackout: () => void;
  onActivateTorch: () => void;
  onToggleCameraFlash: () => void;
  cameraFlashActive: boolean;
  wakeLockStatus: boolean;
  onToggleWakeLock: () => void;
  remainingSleepTimer: number | null;
  onSetSleepTimer: (seconds: number | null) => void;
  onOpenPrivacyPolicy?: () => void;
}

export const PowerControlCenter: React.FC<PowerControlCenterProps> = ({
  settings,
  onUpdateSettings,
  onActivateBlackout,
  onActivateTorch,
  onToggleCameraFlash,
  cameraFlashActive,
  wakeLockStatus,
  onToggleWakeLock,
  remainingSleepTimer,
  onSetSleepTimer,
  onOpenPrivacyPolicy,
}) => {
  const [activeTab, setActiveTab] = useState<'power' | 'light' | 'settings'>('power');
  const [wakeLockCapable, setWakeLockCapable] = useState(true);

  const lang: Language = settings.language || 'vi';
  const t = translations[lang];
  const isEn = lang === 'en';

  useEffect(() => {
    setWakeLockCapable(isWakeLockSupported());
  }, []);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-5">
      {/* Header Banner */}
      <div className="text-center pt-2">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/90 border border-zinc-800 text-xs text-zinc-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{t.badgeReady}</span>
          </div>

          {/* Quick Header Language Switcher */}
          <div className="inline-flex items-center bg-zinc-900/90 border border-zinc-800 rounded-full p-0.5 text-xs">
            <button
              id="btn-lang-toggle-vi"
              onClick={() => onUpdateSettings({ language: 'vi' })}
              className={`px-2 py-0.5 rounded-full transition-colors cursor-pointer font-medium ${
                lang === 'vi' ? 'bg-amber-500 text-black font-bold shadow-sm' : 'text-zinc-400 hover:text-white'
              }`}
              title="Chuyển sang Tiếng Việt"
            >
              🇻🇳 VI
            </button>
            <button
              id="btn-lang-toggle-en"
              onClick={() => onUpdateSettings({ language: 'en' })}
              className={`px-2 py-0.5 rounded-full transition-colors cursor-pointer font-medium ${
                lang === 'en' ? 'bg-amber-500 text-black font-bold shadow-sm' : 'text-zinc-400 hover:text-white'
              }`}
              title="Switch to English"
            >
              🇬🇧 EN
            </button>
          </div>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
          <span>{t.appTitle}</span>
        </h1>
        <p className="text-xs text-zinc-400 mt-1.5 max-w-sm mx-auto leading-relaxed">
          {t.appSubtitle}
        </p>
      </div>

      {/* Primary Big Mechanical Power Switch */}
      <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 rounded-3xl border border-zinc-800/90 shadow-2xl flex flex-col items-center relative overflow-hidden">
        {/* Subtle decorative radial glow */}
        <div className="absolute -top-12 -left-12 w-44 h-44 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-44 h-44 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Status text */}
        <div className="text-[11px] font-mono tracking-wider uppercase text-zinc-500 mb-6 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          {t.screenStatusOn}
        </div>

        {/* Big tactile button */}
        <div className="relative my-2">
          {/* Outer ring */}
          <div className="w-48 h-48 sm:w-52 sm:h-52 rounded-full p-2 bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-950 shadow-[0_15px_35px_rgba(0,0,0,0.8)] flex items-center justify-center">
            {/* Bezel */}
            <div className="w-full h-full rounded-full p-2 bg-gradient-to-b from-zinc-950 to-zinc-800 border border-zinc-700/50 flex items-center justify-center">
              <motion.button
                id="btn-main-power-off"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => {
                  if (settings.soundEnabled) playSwitchSound('off');
                  if (settings.hapticEnabled) triggerHaptic('heavy');
                  onActivateBlackout();
                }}
                className="w-full h-full rounded-full bg-gradient-to-b from-zinc-800 via-zinc-900 to-black border-2 border-zinc-700/80 shadow-[inset_0_4px_8px_rgba(255,255,255,0.1),_0_10px_20px_rgba(0,0,0,0.9)] flex flex-col items-center justify-center gap-2 group cursor-pointer active:border-red-500 transition-colors"
              >
                {/* Power Icon */}
                <div className="p-3.5 rounded-full bg-red-950/40 border border-red-900/60 group-hover:border-red-500/80 group-hover:bg-red-950/70 transition-all duration-300">
                  <Power className="w-9 h-9 text-red-500 group-hover:text-red-400 drop-shadow-[0_0_12px_rgba(239,68,68,0.7)] transition-transform group-hover:scale-110" />
                </div>
                <span className="text-xs font-bold tracking-wider text-zinc-300 uppercase group-hover:text-white transition-colors">
                  {t.turnOffScreen}
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">
                  {t.oledSubtitle}
                </span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Quick hint beneath power button */}
        <p className="text-[11px] text-zinc-400 mt-5 text-center flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5 text-zinc-500" />
          <span>{t.doubleTapHint}</span>
        </p>
      </div>

      {/* Google AdMob Medium Rectangle Unit (300x250 / 1/4 Screen) */}
      <AdBanner className="my-2" language={settings.language} />

      {/* Dual Quick Action Cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* Screen Torch Button */}
        <motion.button
          id="btn-quick-screen-torch"
          whileTap={{ scale: 0.96 }}
          onClick={() => {
            if (settings.soundEnabled) playSwitchSound('on');
            if (settings.hapticEnabled) triggerHaptic('medium');
            onActivateTorch();
          }}
          className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-amber-500/50 flex flex-col justify-between text-left transition-all cursor-pointer shadow-lg group"
        >
          <div className="flex items-center justify-between w-full mb-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20 transition-colors">
              <Sun className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono text-zinc-500 bg-zinc-800/60 px-2 py-0.5 rounded">
              {settings.screenBrightness}%
            </span>
          </div>
          <div>
            <div className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors">
              {t.quickScreenTorch}
            </div>
            <div className="text-[11px] text-zinc-400 mt-0.5">
              {isEn ? 'Bright 100% white illumination' : 'Bật sáng 100% soi đường'}
            </div>
          </div>
        </motion.button>

        {/* Keep Screen On (Wake Lock) Toggle */}
        <motion.button
          id="btn-toggle-wakelock"
          whileTap={{ scale: 0.96 }}
          onClick={() => {
            if (settings.soundEnabled) playSwitchSound(wakeLockStatus ? 'off' : 'on');
            if (settings.hapticEnabled) triggerHaptic('medium');
            onToggleWakeLock();
          }}
          className={`p-4 rounded-2xl border flex flex-col justify-between text-left transition-all cursor-pointer shadow-lg ${
            wakeLockStatus
              ? 'bg-emerald-950/30 border-emerald-500/60 text-emerald-300'
              : 'bg-zinc-900/90 border-zinc-800 hover:border-zinc-700 text-zinc-300'
          }`}
        >
          <div className="flex items-center justify-between w-full mb-3">
            <div
              className={`p-2 rounded-xl transition-colors ${
                wakeLockStatus
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              <Zap className="w-5 h-5" />
            </div>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                wakeLockStatus
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-zinc-800/60 text-zinc-500'
              }`}
            >
              {wakeLockStatus ? (isEn ? 'ACTIVE' : 'ĐANG BẬT') : (isEn ? 'OFF' : 'ĐANG TẮT')}
            </span>
          </div>
          <div>
            <div className="text-sm font-semibold text-white">
              {t.quickWakeLock}
            </div>
            <div className="text-[11px] text-zinc-400 mt-0.5">
              {wakeLockCapable
                ? isEn
                  ? 'Keep screen awake'
                  : 'Giữ màn hình luôn sáng'
                : isEn
                ? 'Browser not supported'
                : 'Chưa hỗ trợ trình duyệt'}
            </div>
          </div>
        </motion.button>
      </div>

      {/* Tabs / Sub-Controls Container */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 shadow-xl flex flex-col gap-4">
        {/* Navigation pills */}
        <div className="grid grid-cols-3 gap-1 bg-zinc-950/60 p-1 rounded-xl border border-zinc-800/80 text-xs font-medium">
          <button
            id="tab-power-features"
            onClick={() => setActiveTab('power')}
            className={`py-2 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'power'
                ? 'bg-zinc-800 text-white shadow-sm font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {t.tabPower}
          </button>
          <button
            id="tab-light-palette"
            onClick={() => setActiveTab('light')}
            className={`py-2 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'light'
                ? 'bg-zinc-800 text-white shadow-sm font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {t.tabLight}
          </button>
          <button
            id="tab-app-settings"
            onClick={() => setActiveTab('settings')}
            className={`py-2 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-zinc-800 text-white shadow-sm font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {t.tabSettings}
          </button>
        </div>

        {/* TAB 1: POWER FEATURES (Timer, Floating Button, Camera Flash) */}
        {activeTab === 'power' && (
          <div className="flex flex-col gap-3">
            {/* Sleep Timer */}
            <div className="p-3 bg-zinc-950/50 rounded-xl border border-zinc-800/60 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                  <Timer className="w-4 h-4 text-amber-400" />
                  {t.sleepTimerTitle}
                </span>
                {remainingSleepTimer !== null && (
                  <span className="text-xs font-mono bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                    {isEn ? `Remaining ${formatTimer(remainingSleepTimer)}` : `Còn ${formatTimer(remainingSleepTimer)}`}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-5 gap-1.5 pt-1">
                {[1, 5, 15, 30].map((mins) => (
                  <button
                    key={mins}
                    id={`btn-timer-${mins}m`}
                    onClick={() => {
                      if (settings.soundEnabled) playSwitchSound('tap');
                      onSetSleepTimer(mins * 60);
                    }}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer text-center ${
                      remainingSleepTimer !== null && Math.ceil(remainingSleepTimer / 60) === mins
                        ? 'bg-amber-500 text-black border-amber-400 font-bold'
                        : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:bg-zinc-800'
                    }`}
                  >
                    {mins}{isEn ? 'm' : 'p'}
                  </button>
                ))}
                <button
                  id="btn-timer-cancel"
                  onClick={() => {
                    if (settings.soundEnabled) playSwitchSound('tap');
                    onSetSleepTimer(null);
                  }}
                  className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer text-center ${
                    remainingSleepTimer === null
                      ? 'bg-zinc-800 text-zinc-400 border-zinc-700'
                      : 'bg-red-950/50 text-red-300 border-red-800/60 hover:bg-red-900/60'
                  }`}
                >
                  {isEn ? 'Cancel' : 'Hủy'}
                </button>
              </div>
            </div>

            {/* Floating Assistive Button Toggle */}
            <div className="flex items-center justify-between p-3 bg-zinc-950/50 rounded-xl border border-zinc-800/60">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-sky-400" />
                  {t.floatingButtonTitle}
                </span>
                <span className="text-[11px] text-zinc-400 mt-0.5">
                  {t.floatingButtonDesc}
                </span>
              </div>
              <button
                id="btn-toggle-floating-button"
                onClick={() => {
                  if (settings.soundEnabled) playSwitchSound('tap');
                  onUpdateSettings({ floatingButtonEnabled: !settings.floatingButtonEnabled });
                }}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  settings.floatingButtonEnabled ? 'bg-amber-500' : 'bg-zinc-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                    settings.floatingButtonEnabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Shake to Toggle Option */}
            <div className="flex items-center justify-between p-3 bg-zinc-950/50 rounded-xl border border-zinc-800/60">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                  <Vibrate className="w-4 h-4 text-emerald-400" />
                  {t.shakeTitle}
                </span>
                <span className="text-[11px] text-zinc-400 mt-0.5">
                  {t.shakeDesc}
                </span>
              </div>
              <button
                id="btn-toggle-shake"
                onClick={() => {
                  if (settings.soundEnabled) playSwitchSound('tap');
                  onUpdateSettings({ shakeToToggle: !settings.shakeToToggle });
                }}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  settings.shakeToToggle ? 'bg-emerald-500' : 'bg-zinc-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                    settings.shakeToToggle ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Hardware Camera Flashlight Button */}
            <div className="flex items-center justify-between p-3 bg-zinc-950/50 rounded-xl border border-zinc-800/60">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                  <Flashlight className="w-4 h-4 text-amber-400" />
                  {t.quickFlashLed}
                </span>
                <span className="text-[11px] text-zinc-400 mt-0.5">
                  {t.quickFlashLedDesc}
                </span>
              </div>
              <button
                id="btn-toggle-camera-flash-panel"
                onClick={onToggleCameraFlash}
                className={`py-1.5 px-3 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                  cameraFlashActive
                    ? 'bg-amber-500 text-black border-amber-400'
                    : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700'
                }`}
              >
                {cameraFlashActive ? (isEn ? 'Active' : 'Đang Bật') : (isEn ? 'Turn On' : 'Bật Flash')}
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: LIGHT PALETTE (Brightness & Color tone for screen light) */}
        {activeTab === 'light' && (
          <div className="flex flex-col gap-3.5">
            {/* Brightness */}
            <div>
              <div className="flex justify-between items-center text-xs text-zinc-300 mb-2">
                <span className="font-medium flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-amber-400" /> {t.lightBrightnessLabel}
                </span>
                <span className="font-mono text-amber-400">{settings.screenBrightness}%</span>
              </div>
              <input
                id="slider-app-brightness"
                type="range"
                min="10"
                max="100"
                value={settings.screenBrightness}
                onChange={(e) => onUpdateSettings({ screenBrightness: Number(e.target.value) })}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>

            {/* Color Presets */}
            <div>
              <span className="text-xs font-medium text-zinc-300 block mb-2">
                {t.colorPresetsLabel}:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {COLOR_PRESETS.map((preset) => {
                  const isSelected = settings.selectedColorHex === preset.hex;
                  const name = isEn ? (preset.nameEn || preset.name) : preset.name;
                  const desc = isEn ? (preset.descriptionEn || preset.description) : preset.description;
                  return (
                    <button
                      key={preset.id}
                      id={`preset-card-${preset.id}`}
                      onClick={() => {
                        if (settings.soundEnabled) playSwitchSound('tap');
                        onUpdateSettings({ selectedColorHex: preset.hex });
                      }}
                      className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-zinc-800 border-amber-400/80 shadow-md ring-1 ring-amber-400/50'
                          : 'bg-zinc-950/60 border-zinc-800/80 hover:bg-zinc-800/60'
                      }`}
                    >
                      <span
                        className="w-6 h-6 rounded-full border border-white/20 flex-shrink-0 shadow-sm"
                        style={{ backgroundColor: preset.hex }}
                      />
                      <div className="overflow-hidden">
                        <div className="text-xs font-semibold text-zinc-200 truncate">
                          {name}
                        </div>
                        <div className="text-[10px] text-zinc-400 truncate">
                          {desc}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              id="btn-launch-torch-now"
              onClick={() => {
                if (settings.soundEnabled) playSwitchSound('on');
                if (settings.hapticEnabled) triggerHaptic('medium');
                onActivateTorch();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg mt-1"
            >
              <Sun className="w-4 h-4" />
              <span>{t.openFullscreenTorch}</span>
            </button>
          </div>
        )}

        {/* TAB 3: APP SETTINGS */}
        {activeTab === 'settings' && (
          <div className="flex flex-col gap-3">
            {/* Language Selection Setting */}
            <div className="flex items-center justify-between p-3 bg-zinc-950/50 rounded-xl border border-zinc-800/60">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-sky-400" />
                  {t.languageSettingTitle}
                </span>
                <span className="text-[11px] text-zinc-400 mt-0.5">
                  {t.languageSettingDesc}
                </span>
              </div>
              <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800 text-xs">
                <button
                  id="btn-lang-setting-vi"
                  onClick={() => onUpdateSettings({ language: 'vi' })}
                  className={`px-2.5 py-1 rounded transition-colors cursor-pointer font-medium ${
                    lang === 'vi'
                      ? 'bg-amber-500 text-black font-bold shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  🇻🇳 Tiếng Việt
                </button>
                <button
                  id="btn-lang-setting-en"
                  onClick={() => onUpdateSettings({ language: 'en' })}
                  className={`px-2.5 py-1 rounded transition-colors cursor-pointer font-medium ${
                    lang === 'en'
                      ? 'bg-amber-500 text-black font-bold shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  🇬🇧 English
                </button>
              </div>
            </div>

            {/* Always-on-Display Clock toggle */}
            <div className="flex items-center justify-between p-3 bg-zinc-950/50 rounded-xl border border-zinc-800/60">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-purple-400" />
                  {t.aodClockTitle}
                </span>
                <span className="text-[11px] text-zinc-400 mt-0.5">
                  {t.aodClockDesc}
                </span>
              </div>
              <button
                id="btn-toggle-aod"
                onClick={() => {
                  if (settings.soundEnabled) playSwitchSound('tap');
                  onUpdateSettings({ showAODClock: !settings.showAODClock });
                }}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  settings.showAODClock ? 'bg-purple-500' : 'bg-zinc-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                    settings.showAODClock ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Sound Feedback */}
            <div className="flex items-center justify-between p-3 bg-zinc-950/50 rounded-xl border border-zinc-800/60">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                  {settings.soundEnabled ? (
                    <Volume2 className="w-4 h-4 text-amber-400" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-zinc-500" />
                  )}
                  {t.soundFxTitle}
                </span>
                <span className="text-[11px] text-zinc-400 mt-0.5">
                  {t.soundFxDesc}
                </span>
              </div>
              <button
                id="btn-toggle-sound"
                onClick={() => {
                  const next = !settings.soundEnabled;
                  if (next) playSwitchSound('on');
                  onUpdateSettings({ soundEnabled: next });
                }}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  settings.soundEnabled ? 'bg-amber-500' : 'bg-zinc-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                    settings.soundEnabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Haptic Vibration */}
            <div className="flex items-center justify-between p-3 bg-zinc-950/50 rounded-xl border border-zinc-800/60">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                  <Vibrate className="w-4 h-4 text-emerald-400" />
                  {t.hapticTitle}
                </span>
                <span className="text-[11px] text-zinc-400 mt-0.5">
                  {t.hapticDesc}
                </span>
              </div>
              <button
                id="btn-toggle-haptic"
                onClick={() => {
                  const next = !settings.hapticEnabled;
                  if (next) triggerHaptic('medium');
                  onUpdateSettings({ hapticEnabled: next });
                }}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  settings.hapticEnabled ? 'bg-emerald-500' : 'bg-zinc-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                    settings.hapticEnabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Helpful Info Guide */}
      <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-3.5 text-zinc-400 text-xs flex flex-col gap-2">
        <div className="font-semibold text-zinc-300 flex items-center gap-1.5">
          <Info className="w-4 h-4 text-amber-400" />
          <span>{t.tipsTitle}</span>
        </div>
        <ul className="list-disc list-inside space-y-1 text-[11px] text-zinc-400 pl-1 leading-relaxed">
          <li>
            {t.tip1}
          </li>
          <li>
            {t.tip2}
          </li>
          <li>
            {t.tip3}
          </li>
          <li>
            {t.tip4}
          </li>
        </ul>
      </div>

      {/* Privacy Policy Link */}
      {onOpenPrivacyPolicy && (
        <div className="flex items-center justify-center text-xs text-zinc-500 pt-1 pb-2">
          <button
            onClick={onOpenPrivacyPolicy}
            className="hover:text-zinc-300 underline cursor-pointer transition"
          >
            {t.privacyPolicy}
          </button>
        </div>
      )}
    </div>
  );
};
