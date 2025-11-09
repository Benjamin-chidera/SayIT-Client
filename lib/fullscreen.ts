// fullscreen.ts
type FullscreenDoc = Document & {
  webkitFullscreenElement?: Element | null;
  msFullscreenElement?: Element | null;
  webkitExitFullscreen?: (() => void) | undefined;
  msExitFullscreen?: (() => void) | undefined;
  webkitRequestFullscreen?: (() => Promise<void> | void) | undefined;
  msRequestFullscreen?: (() => Promise<void> | void) | undefined;
};

type FullscreenElement = Element & {
  requestFullscreen?: () => Promise<void> | void;
  webkitRequestFullscreen?: () => Promise<void> | void;
  msRequestFullscreen?: () => Promise<void> | void;
};

export const toggleFullscreen = () => {
  const doc = document as FullscreenDoc;
  const docEl = document.documentElement as FullscreenElement;

  if (!doc.fullscreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
    if (docEl.requestFullscreen) docEl.requestFullscreen();
    else if (docEl.webkitRequestFullscreen) docEl.webkitRequestFullscreen();
    else if (docEl.msRequestFullscreen) docEl.msRequestFullscreen();
  } else {
    if (doc.exitFullscreen) doc.exitFullscreen();
    else if (doc.webkitExitFullscreen) doc.webkitExitFullscreen();
    else if (doc.msExitFullscreen) doc.msExitFullscreen();
  }
};
