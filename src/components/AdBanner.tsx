import React, { useEffect, useRef } from 'react';

/**
 * CẤU HÌNH MÃ QUẢNG CÁO GOOGLE ADMOB CỦA BẠN
 */
export const ADMOB_CONFIG = {
  appId: 'ca-app-pub-9156306107563720~3024647339',
  adUnitId: 'ca-app-pub-9156306107563720/8835466501',
  clientId: 'ca-pub-9156306107563720',
  slotId: '8835466501',
};

export const getActiveAdConfig = (): {
  clientId: string;
  slotId: string;
  appId: string;
  adUnitId: string;
} => {
  let clientId = (import.meta.env.VITE_ADMOB_CLIENT_ID || ADMOB_CONFIG.clientId).trim();
  let slotId = (import.meta.env.VITE_ADMOB_SLOT_ID || ADMOB_CONFIG.slotId).trim();
  const appId = (import.meta.env.VITE_ADMOB_APP_ID || ADMOB_CONFIG.appId).trim();
  const adUnitId = (import.meta.env.VITE_ADMOB_AD_UNIT_ID || ADMOB_CONFIG.adUnitId).trim();

  if (typeof window !== 'undefined') {
    try {
      const storedClient =
        localStorage.getItem('admob_client_id') ||
        localStorage.getItem('admob_banner_client_id');
      const storedSlot =
        localStorage.getItem('admob_slot_id') ||
        localStorage.getItem('admob_banner_slot_id');

      if (storedClient && storedClient.startsWith('ca-pub-')) clientId = storedClient.trim();
      if (storedSlot && /^\d+$/.test(storedSlot)) slotId = storedSlot.trim();
    } catch {
      // ignore
    }
  }

  return { clientId, slotId, appId, adUnitId };
};

interface AdBannerProps {
  className?: string;
  language?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({ className = '', language = 'vi' }) => {
  const adRef = useRef<HTMLModElement | null>(null);
  const isPushedRef = useRef(false);
  const config = getActiveAdConfig();
  const isEn = language === 'en';
  const labelText = isEn ? 'Advertisement' : 'Quảng cáo';

  useEffect(() => {
    if (!config.clientId) return;

    isPushedRef.current = false;
    const scriptId = 'google-ads-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(
        config.clientId
      )}`;
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.onerror = () => {};
      document.head.appendChild(script);
    }

    const timer = setTimeout(() => {
      if (isPushedRef.current || !adRef.current) return;
      const adEl = adRef.current;
      if (adEl.getAttribute('data-adsbygoogle-status') || adEl.children.length > 0) {
        isPushedRef.current = true;
        return;
      }
      try {
        if (typeof window !== 'undefined') {
          const w = window as unknown as { adsbygoogle?: Array<Record<string, unknown>> };
          w.adsbygoogle = w.adsbygoogle || [];
          w.adsbygoogle.push({});
          isPushedRef.current = true;
        }
      } catch (e) {
        console.warn('Ad push notice:', e);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [config.clientId, config.slotId]);

  return (
    <div
      id="admob-banner-container"
      className={`w-full flex flex-col items-center justify-center select-none ${className}`}
    >
      {/* Nhãn "Quảng cáo" ở đầu banner mở rộng theo chiều rộng thiết bị */}
      <div className="w-full flex items-center justify-start px-1 pb-1 text-left">
        <span className="text-[11px] font-medium tracking-wide uppercase text-zinc-500 font-mono">
          {labelText}
        </span>
      </div>

      {/* Khối Banner mở rộng tối đa theo chiều rộng thiết bị (w-full), chiều cao chiếm ~1/4 màn hình */}
      <div className="w-full min-h-[200px] h-[220px] sm:h-[250px] bg-zinc-950 border border-zinc-850 rounded-2xl overflow-hidden shadow-lg flex items-center justify-center relative">
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', height: '100%', minHeight: '200px' }}
          data-ad-client={config.clientId}
          data-ad-slot={config.slotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
};
