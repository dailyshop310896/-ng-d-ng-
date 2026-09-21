import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Layers,
  Sparkles,
  Smartphone,
  ShieldAlert,
  CheckCircle2,
  ExternalLink,
  Power,
  Tv,
} from 'lucide-react';

interface OverlayGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchPip: () => void;
  language?: 'vi' | 'en';
}

export const OverlayGuideModal: React.FC<OverlayGuideModalProps> = ({
  isOpen,
  onClose,
  onLaunchPip,
  language = 'vi',
}) => {
  const isEn = language === 'en';

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {isEn ? 'Always-on-Top Floating Button' : 'Nút Nguồn Nổi Đè Lên Mọi Ứng Dụng'}
                </h3>
                <p className="text-[11px] text-zinc-400">
                  {isEn ? 'Display over other apps & home screen' : 'Hiển thị đè lên YouTube, Game, Màn hình chính'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Action Button: Launch PiP Right Now */}
          <div className="mt-5 p-4 rounded-2xl bg-gradient-to-br from-amber-500/20 via-amber-500/10 to-transparent border border-amber-500/40 flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-black flex items-center justify-center flex-shrink-0 shadow-lg">
                <Power className="w-6 h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>{isEn ? 'Launch Floating Window Now' : 'Bật Cửa Sổ Nổi Ngay Bây Giờ'}</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-400/30 text-amber-200 font-mono">
                    PiP Overlay
                  </span>
                </h4>
                <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                  {isEn
                    ? 'Pop out an always-on-top floating button that stays on your screen over any game, YouTube, or social app!'
                    : 'Kích hoạt cửa sổ nổi ghim trên cùng (Always-on-Top), nút nguồn sẽ bay ra ngoài màn hình và đè lên mọi ứng dụng khác!'}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                onLaunchPip();
                onClose();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-[0.98] cursor-pointer"
            >
              <Tv className="w-4 h-4" />
              <span>{isEn ? 'Start Floating Overlay' : 'Kích Hoạt Cửa Sổ Nổi Luôn Trên Cùng'}</span>
            </button>
          </div>

          {/* Detailed Guide for Native Android SYSTEM_ALERT_WINDOW */}
          <div className="mt-5 space-y-4">
            <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider font-mono">
              {isEn ? '2 Options for System-Wide Overlay' : '2 Cách Hiển Thị Đè Lên Toàn Bộ Thiết Bị'}
            </h4>

            {/* Method 1: Web Picture-in-Picture */}
            <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Tv className="w-4 h-4" />
              </div>
              <div className="text-xs text-zinc-300 space-y-1">
                <p className="font-semibold text-white">
                  {isEn ? 'Method 1: Browser Picture-in-Picture (No Root/Install)' : 'Cách 1: Cửa sổ nổi Picture-in-Picture (Dùng được ngay)'}
                </p>
                <p className="text-zinc-400 leading-relaxed text-[11px]">
                  {isEn
                    ? 'Uses the browser Always-on-Top feature. When opened, it floats over all applications and home screen.'
                    : 'Sử dụng công nghệ Picture-in-Picture luôn trên cùng của trình duyệt Chrome/Android. Khi bật, nút nguồn tự động ghim nổi trên màn hình chính và đè lên mọi app khác.'}
                </p>
              </div>
            </div>

            {/* Method 2: Android Native Permission */}
            <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Smartphone className="w-4 h-4" />
              </div>
              <div className="text-xs text-zinc-300 space-y-1">
                <p className="font-semibold text-white">
                  {isEn
                    ? 'Method 2: Android Native APK (Display Over Other Apps)'
                    : 'Cách 2: Ứng dụng Android APK (Quyền Vẽ Trên Ứng Dụng Khác)'}
                </p>
                <p className="text-zinc-400 leading-relaxed text-[11px]">
                  {isEn
                    ? 'For native APKs, Android requires the "SYSTEM_ALERT_WINDOW" permission: Go to Settings > Apps > Special App Access > Display Over Other Apps > Enable.'
                    : 'Đối với ứng dụng Android cài qua file APK, hệ điều hành Android yêu cầu cấp quyền hệ thống: Vào Cài đặt điện thoại > Ứng dụng > Quyền truy cập đặc biệt > Hiển thị trên ứng dụng khác (Appear on top) > Bật cho ứng dụng.'}
                </p>
              </div>
            </div>
          </div>

          {/* Footer Close */}
          <div className="mt-6 pt-3 border-t border-zinc-800 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-colors cursor-pointer"
            >
              {isEn ? 'Got It' : 'Đã Hiểu'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
