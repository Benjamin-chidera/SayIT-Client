# SayIT

SayIT is an interactive writing helper built with Next.js + TypeScript. It combines a freehand drawing canvas (for handwriting), speech recognition, and utility tools (undo, clear, upload, fullscreen, settings). It’s optimized for desktop and mobile (touch/pointer), supports high‑DPI screens, and uses Tailwind CSS + Zustand for state.

## Key Features

- Canvas drawing with smooth, rounded strokes (mouse, touch, pen).
- Touch/pointer compatible (touch-action handling and coordinate normalization).
- High‑DPI scaling to render crisply on retina displays.
- Undo (removes last stroke) and Clear (erase canvas).
- Snapshot-based stroke storage (data URLs in Zustand) so undo/redo redraws correctly.
- Upload canvas image to backend (POST form-data). Backend URL configurable in store.
- Speech recognition integration (Web Speech API) for dictation.
- Toolbar with: Upload, Microphone (start/stop), Mode toggle (Canvas / Typing), Settings, Logout.
- Fullscreen toggle for the canvas.
- Responsive layout: toolbar adapts to portrait/landscape tablet and mobile.
- Decorative background blobs rendered in a fixed clipped container to avoid scrolling.

## Project Structure (important files)

- components/canvas/Canvas.tsx — Canvas drawing UI + handlers (mouse, touch), buttons (undo/clear), fullscreen toggle.
- store/canvas.store.ts — Zustand store: isDrawing, showButtons, strokes (data URLs), canvasRef, undo/clear/add/upload.
- components/toolbar/toolbar.tsx — Floating toolbar component and actions.
- app/page.tsx — Main page: writing mode toggle, speech recognition init/handlers.
- app/layout.tsx — App layout and decorative blob container (fixed to avoid overflow).
- styles/globals.css — global resets (ensure html/body/#\_\_next height:100%, box-sizing adjustments).

## How undo / clear works

- Each finished stroke triggers a snapshot: canvas.toDataURL("image/png") stored in the zustand `strokes` array.
- Undo: pops the last snapshot from `strokes`, clears the canvas, then draws the new top snapshot (if any) as an image.
- Clear: clears the drawing context and empties the `strokes` array.

## Mobile / Tablet fixes implemented

- Use pointer/touch-safe handlers and `touch-action: none` on the canvas to avoid page scrolling while drawing.
- Use clientX/clientY relative to canvas bounding rect to compute coordinates reliably across screen sizes and rotation.
- Canvas width/height are set using boundingClientRect \* devicePixelRatio for sharp rendering.
- Toolbar is fixed (viewport-based) and uses max-height + overflow-auto on small heights so all icons remain accessible after rotation.
- Decorative blobs moved into a fixed, overflow-hidden container inside `<body>` to prevent page overflow/scrollbars.
- Buttons that were hidden at small breakpoints moved to always-visible (or lowered breakpoint) depending on configuration.

## How to run

1. Clone
   git clone <repo>
2. Install
   npm install
3. Development
   npm run dev
4. Build
   npm run build
   npm run start

Open http://localhost:3000

## Backend upload endpoint

- The upload code posts the canvas Blob to the configured endpoint in `store/canvas.store.ts` (default in project was `http://127.0.0.1:8000/uploadCanvasImg-to-text`). Update that URL to match your backend.

## Troubleshooting & Tips

- If toolbar or canvas buttons disappear after rotating a tablet:
  - Ensure toolbar is `fixed` (viewport positioned) and uses `md:max-h-[calc(100vh-4rem)] md:overflow-auto`.
  - If a button is clipped, check parent elements for `overflow-hidden` and set the immediate wrapper to `overflow-visible` if needed.
- If you get scrolling when blobs are visible:
  - Confirm the decorative blob container is `fixed inset-0 overflow-hidden pointer-events-none`.
- If canvas looks blurry:
  - Confirm devicePixelRatio scaling is set in Canvas.tsx (width/height = cssWidth \* devicePixelRatio and context.scale).
- Speech recognition availability:
  - Web Speech API is not supported in all browsers. The app falls back and warns when unsupported.

## Contributing

- Fork, create a branch, implement features/fixes, then open a PR.
- Example:
  git checkout -b feature/your-feature
  git commit -m "Add your feature"
  git push origin feature/your-feature

<!-- ## Notes / Future ideas

- Add redo functionality.
- Store strokes as vector paths (for smaller storage and better editing).
- Persist strokes to localStorage / server for session restore.
- Add multi-language support for speech recognition and OCR. -->
