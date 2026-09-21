import { LightColorPreset } from '../types';

export const COLOR_PRESETS: LightColorPreset[] = [
  {
    id: 'pure_white',
    name: 'Trắng Sáng',
    nameEn: 'Pure White',
    hex: '#FFFFFF',
    textColor: '#18181b',
    description: 'Độ sáng tối đa, thích hợp soi đường & chụp ảnh',
    descriptionEn: 'Max brightness, ideal for finding way & lighting'
  },
  {
    id: 'warm_light',
    name: 'Vàng Ấm',
    nameEn: 'Warm Amber',
    hex: '#FFE4A0',
    textColor: '#27272a',
    description: 'Ánh sáng êm dịu, chống mỏi mắt khi đọc sách đêm',
    descriptionEn: 'Gentle warm glow, prevents eye strain at night'
  },
  {
    id: 'amber_candle',
    name: 'Ánh Nến Cam',
    nameEn: 'Candle Light',
    hex: '#FFA040',
    textColor: '#18181b',
    description: 'Tạo cảm giác thư thái, dễ ngủ',
    descriptionEn: 'Relaxing ambient light, aids falling asleep'
  },
  {
    id: 'night_red',
    name: 'Đỏ Nhìn Đêm',
    nameEn: 'Night Vision Red',
    hex: '#FF2A2A',
    textColor: '#FFFFFF',
    description: 'Bảo toàn thị lực ban đêm, không làm co đồng tử',
    descriptionEn: 'Preserves night vision without pupil contraction'
  },
  {
    id: 'soft_blue',
    name: 'Xanh Lam Nhạt',
    nameEn: 'Soft Cyan',
    hex: '#93C5FD',
    textColor: '#0f172a',
    description: 'Thanh mát, dịu mắt khi cần ánh sáng nhẹ',
    descriptionEn: 'Cool and serene for gentle illumination'
  },
  {
    id: 'emerald_green',
    name: 'Xanh Lá Dịu',
    nameEn: 'Emerald Green',
    hex: '#86EFAC',
    textColor: '#064e3b',
    description: 'Giảm căng thẳng thị giác, thư giãn mắt',
    descriptionEn: 'Relieves visual fatigue and relaxes eyes'
  }
];
