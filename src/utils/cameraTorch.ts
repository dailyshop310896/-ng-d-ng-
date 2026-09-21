/**
 * Camera Torch / Flashlight support utility
 */

let activeMediaStream: MediaStream | null = null;
let activeTrack: MediaStreamTrack | null = null;

export async function isTorchSupported(): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    return false;
  }
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.some(d => d.kind === 'videoinput');
  } catch {
    return false;
  }
}

export async function toggleCameraTorch(turnOn: boolean): Promise<boolean> {
  try {
    if (!turnOn) {
      if (activeTrack) {
        try {
          await (activeTrack as unknown as { applyConstraints: (c: unknown) => Promise<void> }).applyConstraints({
            advanced: [{ torch: false }]
          });
        } catch {
          // ignore
        }
        activeTrack.stop();
        activeTrack = null;
      }
      if (activeMediaStream) {
        activeMediaStream.getTracks().forEach(t => t.stop());
        activeMediaStream = null;
      }
      return false;
    }

    // Turn on
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'environment',
      }
    });

    const track = stream.getVideoTracks()[0];
    if (!track) {
      stream.getTracks().forEach(t => t.stop());
      return false;
    }

    const capabilities = (track as unknown as { getCapabilities?: () => { torch?: boolean } }).getCapabilities?.();
    if (capabilities && 'torch' in capabilities) {
      await (track as unknown as { applyConstraints: (c: unknown) => Promise<void> }).applyConstraints({
        advanced: [{ torch: true }]
      });
      activeMediaStream = stream;
      activeTrack = track;
      return true;
    } else {
      // Hardware torch not available on this camera track
      track.stop();
      stream.getTracks().forEach(t => t.stop());
      return false;
    }
  } catch {
    if (activeTrack) {
      activeTrack.stop();
      activeTrack = null;
    }
    if (activeMediaStream) {
      activeMediaStream.getTracks().forEach(t => t.stop());
      activeMediaStream = null;
    }
    return false;
  }
}
