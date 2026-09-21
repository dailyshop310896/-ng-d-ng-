import React from 'react';
import { motion } from 'motion/react';
import { Shield, X, CheckCircle, Lock } from 'lucide-react';

interface PrivacyPolicyModalProps {
  onClose: () => void;
  language?: 'vi' | 'en';
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ onClose, language = 'vi' }) => {
  const isEn = language === 'en';

  return (
    <div
      id="privacy-policy-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm select-text"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-zinc-900 border border-zinc-700 text-white rounded-3xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {isEn ? 'Privacy Policy' : 'Chính Sách Quyền Riêng Tư'}
              </h3>
              <p className="text-[11px] text-zinc-400">
                {isEn ? 'Compliant with Google Play Store standards' : 'Bắt buộc theo tiêu chuẩn Google Play Store'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-zinc-300 leading-relaxed font-sans">
          <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 flex items-center gap-2 text-emerald-400 font-medium">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>
              {isEn
                ? 'The application does NOT collect any personal or sensitive user data.'
                : 'Ứng dụng KHÔNG thu thập bất kỳ dữ liệu cá nhân hay thông tin riêng tư nào của người dùng.'}
            </span>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-1">
              {isEn ? '1. Introduction' : '1. Giới thiệu'}
            </h4>
            <p className="text-zinc-400">
              {isEn ? (
                <>
                  The application <strong>"Virtual Power Switch" (Screen Switch / Screen Off)</strong> is designed to help users turn off screen pixels and simulate the physical power button to protect hardware buttons from mechanical wear.
                </>
              ) : (
                <>
                  Ứng dụng <strong>"Công Tắc Màn Hình" (Screen Switch / Virtual Power Button)</strong> được thiết kế nhằm mục đích hỗ trợ người dùng bật/tắt đèn màn hình, mô phỏng nút nguồn vật lý để chống chai liệt phím cứng trên thiết bị di động.
                </>
              )}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-1">
              {isEn ? '2. Device Permissions' : '2. Quyền truy cập thiết bị (Permissions)'}
            </h4>
            <ul className="list-disc list-inside space-y-1.5 text-zinc-400 pl-1">
              <li>
                <strong className="text-zinc-200">
                  {isEn ? 'Camera Permission (Torch):' : 'Quyền Camera (Đèn Flash):'}
                </strong>{' '}
                {isEn
                  ? 'Only used to activate the hardware rear LED flash when the user explicitly taps "Turn On Flash". The app NEVER captures photos, records video, or accesses media.'
                  : 'Chỉ được dùng để kích hoạt tính năng đèn pin LED sau của thiết bị khi người dùng chủ động bấm nút "Bật Flash". Ứng dụng tuyệt đối KHÔNG chụp ảnh, quay video hoặc lưu trữ hình ảnh.'}
              </li>
              <li>
                <strong className="text-zinc-200">
                  {isEn ? 'Vibration Permission (Haptic):' : 'Quyền Rung (Vibration):'}
                </strong>{' '}
                {isEn
                  ? 'Used to provide tactile feedback when tapping the virtual buttons.'
                  : 'Dùng để cung cấp phản hồi xúc giác (haptic) khi người dùng chạm vào nút nguồn ảo.'}
              </li>
              <li>
                <strong className="text-zinc-200">
                  {isEn ? 'Wake Lock Permission:' : 'Quyền Giữ màn hình sáng (Wake Lock):'}
                </strong>{' '}
                {isEn
                  ? 'Used to keep the screen active upon user request when reading or studying.'
                  : 'Dùng để ngăn màn hình tự tắt theo yêu cầu chủ động của người dùng khi đọc sách hoặc xem tài liệu.'}
              </li>
              <li>
                <strong className="text-zinc-200">
                  {isEn ? 'Device Motion Sensor:' : 'Cảm biến chuyển động (Device Motion):'}
                </strong>{' '}
                {isEn
                  ? 'Used to support the optional shake-to-toggle gesture. Sensor data is processed entirely on the device and is never transmitted.'
                  : 'Dùng để hỗ trợ thao tác lắc máy bật/tắt màn hình rảnh tay. Dữ liệu cảm biến được xử lý ngay tại máy và không gửi ra ngoài.'}
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-1">
              {isEn ? '3. Data Storage' : '3. Lưu trữ dữ liệu'}
            </h4>
            <p className="text-zinc-400">
              {isEn
                ? 'All preferences (screen brightness, tone, sound, and language) are stored strictly locally in your browser storage (localStorage) and are never uploaded to any remote server.'
                : 'Mọi cài đặt (độ sáng, màu đèn, âm thanh) chỉ được lưu cục bộ trong bộ nhớ máy của bạn (Local Storage) và không bao giờ được gửi lên bất kỳ máy chủ bên ngoài nào.'}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-1">
              {isEn ? '4. Contact' : '4. Liên hệ'}
            </h4>
            <p className="text-zinc-400">
              {isEn
                ? 'If you have any questions regarding this privacy policy, please contact the developer via Google Play developer support email (dailyshop310896@gmail.com).'
                : 'Nếu bạn có bất kỳ câu hỏi nào về chính sách quyền riêng tư của ứng dụng, vui lòng liên hệ nhà phát triển qua email hỗ trợ của tài khoản Google Play (dailyshop310896@gmail.com).'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950/60 flex items-center justify-between">
          <span className="text-[11px] text-zinc-500 font-mono">
            {isEn ? 'Version: 1.0.0 • Updated: 2026' : 'Phiên bản: 1.0.0 • Cập nhật: 2026'}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs transition cursor-pointer"
          >
            {isEn ? 'Close' : 'Đóng'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
