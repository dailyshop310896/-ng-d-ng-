/**
 * Hệ thống Cửa sổ nổi Đè lên các ứng dụng khác (Picture-in-Picture Always-on-Top)
 * Cho phép nút nguồn ảo hiển thị ngoài màn hình thiết bị, đè lên các ứng dụng khác (YouTube, Facebook, Game...)
 */

export interface PipOverlayOptions {
  onPowerPress: () => void;
  language?: 'vi' | 'en';
  soundEnabled?: boolean;
}

let activePipWindow: any = null;
let activeVideoEl: HTMLVideoElement | null = null;
let activeCanvasEl: HTMLCanvasElement | null = null;
let animFrameId: number | null = null;

export const isPipSupported = (): boolean => {
  if (typeof window === 'undefined') return false;
  return Boolean(
    'documentPictureInPicture' in window ||
      (document.createElement('video') as any).requestPictureInPicture
  );
};

/**
 * Mở cửa sổ nổi đè lên màn hình và mọi ứng dụng khác
 */
export const openPipOverlay = async (
  options: PipOverlayOptions
): Promise<{ success: boolean; type: 'document' | 'video' | 'none'; error?: string }> => {
  const isEn = options.language === 'en';

  // 1. ƯU TIÊN: Document Picture-in-Picture API (Chrome 116+ / Edge / Android)
  if (typeof window !== 'undefined' && 'documentPictureInPicture' in window) {
    try {
      // Đóng cửa sổ cũ nếu đang mở
      if (activePipWindow) {
        try {
          activePipWindow.close();
        } catch {
          // ignore
        }
      }

      const pipWindow = await (window as any).documentPictureInPicture.requestWindow({
        width: 160,
        height: 160,
        disallowReturnToOpener: false,
      });

      activePipWindow = pipWindow;

      // Thiết lập phong cách cho cửa sổ nổi
      const doc = pipWindow.document;
      doc.title = isEn ? 'Virtual Power Switch' : 'Nút Nguồn Ảo';

      const style = doc.createElement('style');
      style.textContent = `
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        body {
          background: #09090b;
          color: #f4f4f5;
          width: 100vw;
          height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          user-select: none;
          overflow: hidden;
          padding: 8px;
        }
        .btn-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
        }
        .power-circle {
          width: 84px;
          height: 84px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, #27272a, #09090b);
          border: 2px solid #3f3f46;
          box-shadow: 0 4px 20px rgba(0,0,0,0.8), inset 0 2px 4px rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          transition: all 0.15s ease;
        }
        .power-circle:active {
          transform: scale(0.92);
          border-color: #ef4444;
          box-shadow: 0 0 25px rgba(239, 68, 68, 0.6);
        }
        .power-inner {
          width: 62px;
          height: 62px;
          border-radius: 50%;
          background: #18181b;
          border: 1px solid #27272a;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .power-icon {
          width: 32px;
          height: 32px;
          fill: none;
          stroke: #ef4444;
          stroke-width: 2.5;
          stroke-linecap: round;
          stroke-linejoin: round;
          filter: drop-shadow(0 0 6px rgba(239, 68, 68, 0.7));
        }
        .label {
          font-size: 11px;
          font-weight: 600;
          color: #a1a1aa;
          letter-spacing: 0.5px;
          text-align: center;
        }
        .pulse {
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          border: 1.5px solid rgba(239, 68, 68, 0.4);
          animation: pulseAnim 2s infinite ease-out;
          pointer-events: none;
        }
        @keyframes pulseAnim {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(1.18); opacity: 0; }
        }
      `;
      doc.head.appendChild(style);

      const wrapper = doc.createElement('div');
      wrapper.className = 'btn-wrapper';

      const circle = doc.createElement('div');
      circle.className = 'power-circle';

      const pulse = doc.createElement('div');
      pulse.className = 'pulse';
      circle.appendChild(pulse);

      const inner = doc.createElement('div');
      inner.className = 'power-inner';

      // SVG Icon Power
      inner.innerHTML = `
        <svg class="power-icon" viewBox="0 0 24 24">
          <path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path>
          <line x1="12" y1="2" x2="12" y2="12"></line>
        </svg>
      `;
      circle.appendChild(inner);

      const label = doc.createElement('div');
      label.className = 'label';
      label.textContent = isEn ? 'Tap to Turn Off' : 'Bấm Tắt Màn Hình';

      wrapper.appendChild(circle);
      wrapper.appendChild(label);
      doc.body.appendChild(wrapper);

      // Xử lý sự kiện bấm nút nguồn từ bên ngoài
      wrapper.onclick = () => {
        circle.style.borderColor = '#ef4444';
        circle.style.boxShadow = '0 0 25px rgba(239,68,68,0.8)';
        label.textContent = isEn ? 'Turning off...' : 'Đang tắt...';

        options.onPowerPress();

        setTimeout(() => {
          if (label) {
            label.textContent = isEn ? 'Tap to Turn Off' : 'Bấm Tắt Màn Hình';
            circle.style.borderColor = '#3f3f46';
            circle.style.boxShadow = '';
          }
        }, 800);
      };

      pipWindow.addEventListener('pagehide', () => {
        activePipWindow = null;
      });

      return { success: true, type: 'document' };
    } catch (err: any) {
      console.warn('Document PiP error, trying video PiP fallback:', err);
    }
  }

  // 2. PHƯƠNG ÁN 2: Canvas Video Picture-in-Picture (Hỗ trợ hầu hết trình duyệt Android)
  try {
    if (activeVideoEl && document.pictureInPictureElement) {
      await document.exitPictureInPicture();
    }

    // Tạo canvas vẽ nút nguồn hoạt họa
    const canvas = document.createElement('canvas');
    canvas.width = 240;
    canvas.height = 240;
    activeCanvasEl = canvas;
    const ctx = canvas.getContext('2d');

    let pulseStep = 0;

    const renderCanvas = () => {
      if (!ctx) return;
      pulseStep += 0.05;
      const pulseSize = 85 + Math.sin(pulseStep) * 6;

      // Background
      ctx.fillStyle = '#09090b';
      ctx.fillRect(0, 0, 240, 240);

      // Outer glow pulse
      ctx.beginPath();
      ctx.arc(120, 110, pulseSize, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Power Button Circle
      ctx.beginPath();
      ctx.arc(120, 110, 75, 0, Math.PI * 2);
      ctx.fillStyle = '#18181b';
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#ef4444';
      ctx.shadowColor = 'rgba(239, 68, 68, 0.8)';
      ctx.shadowBlur = 15;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Draw Power Icon (arc + line)
      ctx.beginPath();
      ctx.arc(120, 115, 32, -Math.PI * 0.75, Math.PI * 1.75);
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(120, 70);
      ctx.lineTo(120, 110);
      ctx.stroke();

      // Text label
      ctx.font = 'bold 15px sans-serif';
      ctx.fillStyle = '#e4e4e7';
      ctx.textAlign = 'center';
      ctx.fillText(isEn ? 'POWER OFF' : 'TẮT MÀN HÌNH', 120, 215);

      animFrameId = requestAnimationFrame(renderCanvas);
    };

    renderCanvas();

    // Capture stream to video element
    const stream = (canvas as any).captureStream ? (canvas as any).captureStream(30) : null;
    if (!stream) {
      throw new Error('Canvas captureStream not supported');
    }

    let video = activeVideoEl;
    if (!video) {
      video = document.createElement('video');
      video.muted = true;
      video.playsInline = true;
      video.style.position = 'fixed';
      video.style.width = '1px';
      video.style.height = '1px';
      video.style.opacity = '0.01';
      video.style.pointerEvents = 'none';
      video.style.left = '-9999px';
      document.body.appendChild(video);
      activeVideoEl = video;
    }

    video.srcObject = stream;
    await video.play();

    // Thiết lập Media Session để người dùng bấm nút trên PiP
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: isEn ? 'Virtual Power Switch' : 'Công Tắc Màn Hình',
        artist: isEn ? 'Tap play/pause to turn off' : 'Chạm để tắt màn hình',
      });

      const handleTrigger = () => {
        options.onPowerPress();
      };

      navigator.mediaSession.setActionHandler('play', handleTrigger);
      navigator.mediaSession.setActionHandler('pause', handleTrigger);
      try {
        navigator.mediaSession.setActionHandler('nexttrack', handleTrigger);
        navigator.mediaSession.setActionHandler('previoustrack', handleTrigger);
      } catch {
        // ignore
      }
    }

    await (video as any).requestPictureInPicture();

    video.addEventListener(
      'leavepictureinpicture',
      () => {
        if (animFrameId) cancelAnimationFrame(animFrameId);
      },
      { once: true }
    );

    return { success: true, type: 'video' };
  } catch (err: any) {
    console.warn('PiP error:', err);
    return {
      success: false,
      type: 'none',
      error: err?.message || 'Không thể mở cửa sổ nổi trên trình duyệt này',
    };
  }
};

/**
 * Đóng cửa sổ nổi
 */
export const closePipOverlay = () => {
  if (activePipWindow) {
    try {
      activePipWindow.close();
    } catch {
      // ignore
    }
    activePipWindow = null;
  }

  if (document.pictureInPictureElement) {
    try {
      document.exitPictureInPicture();
    } catch {
      // ignore
    }
  }

  if (animFrameId) {
    cancelAnimationFrame(animFrameId);
    animFrameId = null;
  }
};
