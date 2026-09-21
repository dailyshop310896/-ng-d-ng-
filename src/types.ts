export type ScreenMode = 'normal' | 'blackout' | 'screen_torch';

export interface LightColorPreset {
  id: string;
  name: string;
  nameEn?: string;
  hex: string;
  textColor: string;
  description: string;
  descriptionEn?: string;
}

export interface AppSettings {
  language: 'vi' | 'en';
  soundEnabled: boolean;
  hapticEnabled: boolean;
  showAODClock: boolean;
  wakeLockActive: boolean;
  shakeToToggle: boolean;
  floatingButtonEnabled: boolean;
  screenBrightness: number; // 10 to 100
  selectedColorHex: string;
  doubleTapSpeedMs: number; // e.g. 350ms
}
