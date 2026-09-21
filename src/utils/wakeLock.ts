/**
 * Wake Lock API utility to prevent screen from sleeping/turning off automatically
 */

let wakeLockSentinel: WakeLockSentinel | null = null;
let isRequested = false;

export const isWakeLockSupported = (): boolean => {
  return typeof navigator !== 'undefined' && 'wakeLock' in navigator;
};

export async function requestWakeLock(onStatusChange?: (active: boolean) => void): Promise<boolean> {
  if (!isWakeLockSupported()) {
    return false;
  }

  try {
    isRequested = true;
    if (wakeLockSentinel && !wakeLockSentinel.released) {
      onStatusChange?.(true);
      return true;
    }

    wakeLockSentinel = await navigator.wakeLock.request('screen');
    
    wakeLockSentinel.addEventListener('release', () => {
      wakeLockSentinel = null;
      onStatusChange?.(false);
      // Auto-reacquire when returning to visible tab if user still wanted it
      if (isRequested && document.visibilityState === 'visible') {
        requestWakeLock(onStatusChange);
      }
    });

    onStatusChange?.(true);
    return true;
  } catch {
    wakeLockSentinel = null;
    onStatusChange?.(false);
    return false;
  }
}

export async function releaseWakeLock(onStatusChange?: (active: boolean) => void): Promise<void> {
  isRequested = false;
  if (wakeLockSentinel) {
    try {
      await wakeLockSentinel.release();
    } catch {
      // Ignore release error
    } finally {
      wakeLockSentinel = null;
    }
  }
  onStatusChange?.(false);
}
