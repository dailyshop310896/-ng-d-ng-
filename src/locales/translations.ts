export type Language = 'vi' | 'en';

export interface Translations {
  // App header
  badgeReady: string;
  appTitle: string;
  appSubtitle: string;

  // Main power switch
  screenStatusOn: string;
  turnOffScreen: string;
  oledSubtitle: string;
  doubleTapHint: string;

  // Tabs
  tabPower: string;
  tabLight: string;
  tabSettings: string;

  // Quick Action Cards
  quickScreenTorch: string;
  quickScreenTorchDesc: string;
  quickFlashLed: string;
  quickFlashLedDesc: string;
  flashOn: string;
  flashOff: string;
  quickWakeLock: string;
  quickWakeLockDesc: string;
  wakeLockActive: string;
  wakeLockInactive: string;
  quickSleepTimer: string;
  quickSleepTimerDesc: string;
  sleepTimerRunning: string;
  sleepTimerOff: string;

  // Sleep Timer modal
  sleepTimerTitle: string;
  sleepTimerSubtitle: string;
  timerMinutes: string;
  timerSeconds: string;
  cancelTimer: string;
  startTimer: string;

  // Light tab
  lightBrightnessLabel: string;
  lightBrightnessDesc: string;
  colorPresetsLabel: string;
  openFullscreenTorch: string;

  // Settings tab
  languageSettingTitle: string;
  languageSettingDesc: string;
  floatingButtonTitle: string;
  floatingButtonDesc: string;
  shakeTitle: string;
  shakeDesc: string;
  aodClockTitle: string;
  aodClockDesc: string;
  soundFxTitle: string;
  soundFxDesc: string;
  hapticTitle: string;
  hapticDesc: string;

  // Tips section
  tipsTitle: string;
  tip1: string;
  tip2: string;
  tip3: string;
  tip4: string;

  // Footer & Links
  privacyPolicy: string;
  footerTagline: string;

  // Blackout screen
  doubleTapToWake: string;
  batteryText: string;

  // Screen Torch
  exitTorch: string;
  strobeSos: string;
  rearFlashBtn: string;
}

export const translations: Record<Language, Translations> = {
  vi: {
    badgeReady: 'SẴN SÀNG THAY THẾ NÚT NGUỒN CƠ',
    appTitle: 'Công Tắc Màn Hình',
    appSubtitle:
      'Tắt mở đèn màn hình bằng 1 chạm, chống liệt nút nguồn vật lý, phát nhạc dưới nền khi tắt màn hình để tiết kiệm pin.',

    screenStatusOn: 'Màn hình đang sáng • Chạm để tắt',
    turnOffScreen: 'Tắt Màn Hình',
    oledSubtitle: '(OLED Đen Tuyền)',
    doubleTapHint: 'Sau khi tắt: Chạm 2 lần (Double tap) để mở lại',

    tabPower: 'Nguồn',
    tabLight: 'Đèn Sáng',
    tabSettings: 'Cài Đặt',

    quickScreenTorch: 'Đèn Màn Hình',
    quickScreenTorchDesc: 'Chiếu sáng dịu mắt',
    quickFlashLed: 'Đèn Flash Sau',
    quickFlashLedDesc: 'Bật đèn camera',
    flashOn: 'Đang Bật',
    flashOff: 'Đang Tắt',
    quickWakeLock: 'Giữ Luôn Sáng',
    quickWakeLockDesc: 'Ngăn màn hình tự khóa',
    wakeLockActive: 'Đang Giữ Sáng',
    wakeLockInactive: 'Chế độ thường',
    quickSleepTimer: 'Hẹn Giờ Tắt',
    quickSleepTimerDesc: 'Tự tắt sau đếm ngược',
    sleepTimerRunning: 'Đang đếm ngược',
    sleepTimerOff: 'Tắt hẹn giờ',

    sleepTimerTitle: 'Hẹn Giờ Tắt Màn Hình',
    sleepTimerSubtitle: 'Màn hình sẽ tự động chuyển sang chế độ đen khi hết giờ',
    timerMinutes: 'phút',
    timerSeconds: 'giây',
    cancelTimer: 'Hủy hẹn giờ',
    startTimer: 'Bắt đầu',

    lightBrightnessLabel: 'Độ Sáng Màn Hình',
    lightBrightnessDesc: 'Điều chỉnh cường độ phát sáng tối ưu cho ban đêm hoặc phòng tối',
    colorPresetsLabel: 'Màu Đèn Chiếu Sáng',
    openFullscreenTorch: 'Mở Đèn Toàn Màn Hình',

    languageSettingTitle: 'Ngôn Ngữ / Language',
    languageSettingDesc: 'Chọn tiếng Việt hoặc tiếng Anh cho giao diện',
    floatingButtonTitle: 'Nút Nguồn Nổi (Assistive Touch)',
    floatingButtonDesc: 'Phím ảo tiện lợi di chuyển khắp màn hình',
    shakeTitle: 'Lắc Máy Bật/Tắt',
    shakeDesc: 'Lắc nhẹ điện thoại để bật/tắt rảnh tay',
    aodClockTitle: 'Đồng Hồ AOD (Màn hình tắt)',
    aodClockDesc: 'Hiển thị giờ & pin tối giản trên nền đen',
    soundFxTitle: 'Âm Thanh Bật/Tắt (Click Sound)',
    soundFxDesc: 'Hiệu ứng âm thanh cơ học chân thực',
    hapticTitle: 'Rung Phản Hồi (Haptic)',
    hapticDesc: 'Rung nhẹ cảm giác bấm chân thật',

    tipsTitle: 'Mẹo sử dụng thay thế nút nguồn vật lý:',
    tip1: 'Bảo vệ nút cơ: Bấm nút nguồn trên màn hình hoặc nút nổi thay vì nhấn nút cứng của máy.',
    tip2: 'Khi tắt màn hình: Toàn bộ điểm ảnh tắt hoàn toàn (OLED 0% điện năng).',
    tip3: 'Phát nhạc nền: Phát nhạc dưới nền khi tắt màn hình để tiết kiệm pin tối đa.',
    tip4: 'Mở lại: Chỉ cần gõ nhẹ 2 lần lên màn hình (Double Tap to Wake).',

    privacyPolicy: 'Chính sách quyền riêng tư',
    footerTagline: 'CÔNG TẮC NGUỒN ẢO • BẢO VỆ NÚT VẬT LÝ',

    doubleTapToWake: 'Chạm 2 lần để mở màn hình',
    batteryText: 'Pin',

    exitTorch: 'Thoát',
    strobeSos: 'Chớp Nháy SOS',
    rearFlashBtn: 'Flash Sau',
  },

  en: {
    badgeReady: 'READY TO REPLACE PHYSICAL POWER BUTTON',
    appTitle: 'Screen Power Switch',
    appSubtitle:
      'One-tap screen power switch, protects physical buttons from wear, plays background music with screen turned off to save battery.',

    screenStatusOn: 'Screen is ON • Tap to turn off',
    turnOffScreen: 'Turn Off Screen',
    oledSubtitle: '(Pure Black OLED)',
    doubleTapHint: 'When turned off: Double tap screen to wake',

    tabPower: 'Power',
    tabLight: 'Screen Light',
    tabSettings: 'Settings',

    quickScreenTorch: 'Screen Light',
    quickScreenTorchDesc: 'Gentle ambient glow',
    quickFlashLed: 'Rear Flash LED',
    quickFlashLedDesc: 'Toggle camera flash',
    flashOn: 'ON',
    flashOff: 'OFF',
    quickWakeLock: 'Keep Awake',
    quickWakeLockDesc: 'Prevent screen timeout',
    wakeLockActive: 'Active Awake',
    wakeLockInactive: 'Standard mode',
    quickSleepTimer: 'Sleep Timer',
    quickSleepTimerDesc: 'Auto power-off countdown',
    sleepTimerRunning: 'Counting down',
    sleepTimerOff: 'Timer off',

    sleepTimerTitle: 'Screen Sleep Timer',
    sleepTimerSubtitle: 'Screen will automatically blackout when countdown ends',
    timerMinutes: 'min',
    timerSeconds: 'sec',
    cancelTimer: 'Cancel timer',
    startTimer: 'Start',

    lightBrightnessLabel: 'Screen Light Brightness',
    lightBrightnessDesc: 'Adjust light intensity for night reading or dark rooms',
    colorPresetsLabel: 'Light Color Palette',
    openFullscreenTorch: 'Open Fullscreen Light',

    languageSettingTitle: 'Language / Ngôn Ngữ',
    languageSettingDesc: 'Switch between English and Vietnamese',
    floatingButtonTitle: 'Floating Button (Assistive Touch)',
    floatingButtonDesc: 'Convenient virtual power button anywhere on screen',
    shakeTitle: 'Shake to Toggle',
    shakeDesc: 'Gently shake device to toggle screen hands-free',
    aodClockTitle: 'AOD Clock (When Off)',
    aodClockDesc: 'Minimalist clock & battery on deep black background',
    soundFxTitle: 'Switch Sound FX (Click Sound)',
    soundFxDesc: 'Realistic mechanical switch audio feedback',
    hapticTitle: 'Haptic Feedback',
    hapticDesc: 'Gentle vibration response on touch',

    tipsTitle: 'Tips for replacing physical power button:',
    tip1: 'Protect hardware keys: Tap the screen switch or assistive button instead of wearing out physical buttons.',
    tip2: 'When turned off: All pixels turn completely off (0% OLED power consumption).',
    tip3: 'Background music: Play audio in background with screen turned off to save battery.',
    tip4: 'Wake up: Simply double-tap anywhere on the screen (Double Tap to Wake).',

    privacyPolicy: 'Privacy Policy',
    footerTagline: 'VIRTUAL POWER SWITCH • HARDWARE BUTTON PROTECTOR',

    doubleTapToWake: 'Double tap screen to wake',
    batteryText: 'Battery',

    exitTorch: 'Exit',
    strobeSos: 'Strobe SOS',
    rearFlashBtn: 'Rear Flash',
  },
};
