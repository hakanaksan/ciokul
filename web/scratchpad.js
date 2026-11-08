/* CioOkul Interactive Scratchpad / Question Drawing Canvas */

const scratchpadState = {
  active: false,
  tool: 'pen', // 'pen', 'highlighter', 'red', 'blue', 'eraser'
  storageKey: '',
  strokes: [], // array of { tool, color, size, alpha, isEraser, points: [{x, y}] }
  currentStroke: null,
  canvas: null,
  ctx: null,
  image: null,
  container: null
};

const SCRATCH_TOOLS = {
  pen: { name: 'Kurşun Kalem', color: '#1e293b', size: 2.5, alpha: 1, isEraser: false },
  red: { name: 'Kırmızı Kalem', color: '#dc2626', size: 2.5, alpha: 1, isEraser: false },
  blue: { name: 'Mavi Kalem', color: '#2563eb', size: 2.5, alpha: 1, isEraser: false },
  green: { name: 'Yeşil Kalem', color: '#16a34a', size: 2.5, alpha: 1, isEraser: false },
  highlighter: { name: 'Vurgulayıcı', color: '#facc15', size: 16, alpha: 0.45, isEraser: false },
  eraser: { name: 'Silgi', color: '#000000', size: 20, alpha: 1, isEraser: true },
  // Typed on the image: click where the answer goes and type with the keyboard.
  text: { name: 'Klavyeyle Yaz', color: '#1d4ed8', size: 0, alpha: 1, isEraser: false, isText: true }
};

// Typed text grows with the image, so it stays in the same place on every screen size.
function scratchTextFontPx(cssWidth) {
  return Math.max(13, cssWidth * 0.03);
}
function scratchTextFont(px) {
  return `600 ${px}px "Segoe UI", Arial, sans-serif`;
}
let scratchMeasureCtx = null;
// Box of a text item in CSS pixels of an image cssWidth x cssHeight (to click on it and edit).
function scratchTextBox(item, cssWidth, cssHeight) {
  scratchMeasureCtx = scratchMeasureCtx || document.createElement('canvas').getContext('2d');
  const px = scratchTextFontPx(cssWidth);
  scratchMeasureCtx.font = scratchTextFont(px);
  const x = item.points[0].x * cssWidth, y = item.points[0].y * cssHeight;
  return { x, y: y - px * 0.7, w: scratchMeasureCtx.measureText(item.text).width, h: px * 1.4 };
}

function scratchpadToolbarMarkup() {
  const active = scratchpadState.active;
  const current = scratchpadState.tool;
  return `
    <div class="scratch-toolbar-wrap ${active ? 'active' : ''}" id="scratchToolbarWrap">
      <div class="scratch-toggle-row">
        <button type="button" class="btn secondary scratch-toggle-btn" id="scratchToggleBtn" aria-pressed="${active}">
          ${scratchpadState.autoActive
            ? (active ? '✋ Kalemi kapat (sayfayı kaydırmak için)' : '✏️ Kalemi aç, cevabını yaz')
            : (active ? '✏️ Karalamayı Kapat' : '✏️ Karalama & İşlem Kalemi')}
        </button>
        ${active ? `
          <div class="scratch-tools" role="toolbar" aria-label="Çizim araçları">
            <button type="button" data-scratch-tool="text" class="scratch-tool-btn ${current === 'text' ? 'active' : ''}" title="Görselde yazacağın yere tıkla, klavyeyle yaz">
              ⌨️ Yaz
            </button>
            <button type="button" data-scratch-tool="pen" class="scratch-tool-btn ${current === 'pen' ? 'active' : ''}" title="Kurşun Kalem">
              <span class="tool-dot" style="background:#1e293b"></span> Kalem
            </button>
            <button type="button" data-scratch-tool="red" class="scratch-tool-btn ${current === 'red' ? 'active' : ''}" title="Kırmızı Kalem (Şık eleme)">
              <span class="tool-dot" style="background:#dc2626"></span> Kırmızı
            </button>
            <button type="button" data-scratch-tool="blue" class="scratch-tool-btn ${current === 'blue' ? 'active' : ''}" title="Mavi Kalem">
              <span class="tool-dot" style="background:#2563eb"></span> Mavi
            </button>
            <button type="button" data-scratch-tool="green" class="scratch-tool-btn ${current === 'green' ? 'active' : ''}" title="Yeşil Kalem">
              <span class="tool-dot" style="background:#16a34a"></span> Yeşil
            </button>
            <button type="button" data-scratch-tool="highlighter" class="scratch-tool-btn ${current === 'highlighter' ? 'active' : ''}" title="Fosforlu Vurgulayıcı">
              <span class="tool-dot" style="background:#facc15"></span> Vurgula
            </button>
            <button type="button" data-scratch-tool="eraser" class="scratch-tool-btn ${current === 'eraser' ? 'active' : ''}" title="Silgi">
              🧹 Silgi
            </button>
            <button type="button" id="scratchUndoBtn" class="scratch-tool-btn" title="Geri Al" ${scratchpadState.strokes.length ? '' : 'disabled'}>
              ↩ Geri
            </button>
            <button type="button" id="scratchClearBtn" class="scratch-tool-btn danger" title="Tümünü Temizle" ${scratchpadState.strokes.length ? '' : 'disabled'}>
              🗑️ Temizle
            </button>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

// Drawings saved as answers use a compact form: [{t: tool, p: [x1, y1, x2, y2, …]}] with
// coordinates relative to the image (0–1). The colours and sizes come from SCRATCH_TOOLS.
// Typed text is {t: 'text', p: [x, y], s: 'the words'}.
function scratchToCompact(strokes) {
  return strokes.filter(s => s.points?.length && (s.tool !== 'text' || s.text)).map(s => ({
    t: s.tool, p: s.points.flatMap(pt => [Math.round(pt.x * 10000) / 10000, Math.round(pt.y * 10000) / 10000]),
    ...(s.tool === 'text' ? { s: s.text } : {})
  }));
}
function scratchFromCompact(compact) {
  return (compact || []).filter(s => SCRATCH_TOOLS[s.t] && Array.isArray(s.p)).map(s => {
    const tool = SCRATCH_TOOLS[s.t], points = [];
    for (let i = 0; i + 1 < s.p.length; i += 2) points.push({ x: s.p[i], y: s.p[i + 1] });
    return { tool: s.t, color: tool.color, size: tool.size, alpha: tool.alpha, isEraser: tool.isEraser, points,
      ...(s.t === 'text' ? { text: String(s.s || '') } : {}) };
  }).filter(s => s.tool !== 'text' || (s.text && s.points.length));
}

// options.strokes: compact strokes to start with (instead of this tab's karalama);
// options.onChange(compact): called after every change, used to save a written answer.
function initScratchpad(containerSelector, storageKey, options = {}) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  scratchpadState.container = container;
  scratchpadState.storageKey = storageKey;
  scratchpadState.onChange = options.onChange || null;
  const image = container.querySelector('img.question-image');
  if (!image) return;
  scratchpadState.image = image;

  // Restore saved strokes for this question
  if (options.strokes) {
    scratchpadState.strokes = scratchFromCompact(options.strokes);
  } else {
    try {
      const raw = sessionStorage.getItem('cio_scratch_' + storageKey);
      scratchpadState.strokes = raw ? JSON.parse(raw) : [];
    } catch {
      scratchpadState.strokes = [];
    }
  }

  // Ensure canvas exists in stage
  let canvas = container.querySelector('canvas.scratch-canvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.className = 'scratch-canvas';
    container.style.position = 'relative';
    container.appendChild(canvas);
  }
  scratchpadState.canvas = canvas;
  scratchpadState.ctx = canvas.getContext('2d');

  const setupDimensions = () => {
    const rect = image.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.touchAction = 'none';
    canvas.style.pointerEvents = scratchpadState.active ? 'auto' : 'none';
    canvas.style.cursor = scratchCursor();
    scratchpadState.textEditor?.place();
    redrawScratchpad();
  };

  if (image.complete) {
    setupDimensions();
  } else {
    image.onload = setupDimensions;
  }

  window.removeEventListener('resize', scratchpadState._onResize);
  scratchpadState._onResize = setupDimensions;
  window.addEventListener('resize', setupDimensions);

  closeScratchTextEditor(false);
  // Pointer event listeners
  canvas.onpointerdown = handlePointerDown;
  canvas.onpointermove = handlePointerMove;
  canvas.onpointerup = handlePointerUp;
  canvas.onpointercancel = handlePointerUp;

  bindScratchToolbar();
}

function scratchCursor() {
  return scratchpadState.tool === 'eraser' ? 'cell' : scratchpadState.tool === 'text' ? 'text' : 'crosshair';
}

// Opens a text box on the image at the item's anchor. Enter or clicking elsewhere keeps the text,
// Escape cancels; an emptied box removes the text.
function openScratchTextEditor(item, isNew) {
  closeScratchTextEditor(true);
  const { container, canvas } = scratchpadState;
  if (!container || !canvas) return;
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'scratch-text-input';
  input.maxLength = 200;
  input.value = item.text || '';
  input.autocomplete = 'off';
  input.spellcheck = false;
  input.setAttribute('aria-label', 'Görsele yazılacak cevap');
  input.style.color = item.color;
  // Placed again whenever the image changes size (focus mode, rotating a tablet, its keyboard).
  const place = () => {
    const rect = canvas.getBoundingClientRect(), px = scratchTextFontPx(rect.width);
    const left = Math.min(item.points[0].x * rect.width, Math.max(0, rect.width - px * 5));
    Object.assign(input.style, {
      left: left + 'px', top: (item.points[0].y * rect.height - px * 0.8) + 'px', font: scratchTextFont(px),
      height: (px * 1.6) + 'px',
      width: Math.max(px * 4, Math.min(rect.width - left, (input.value.length + 2) * px * 0.62)) + 'px'
    });
  };
  place();
  container.appendChild(input);
  scratchpadState.textEditor = { input, item, isNew, before: item.text || '', place };
  item.editing = true;
  redrawScratchpad();
  input.addEventListener('input', place);
  input.addEventListener('keydown', e => {
    e.stopPropagation();
    if (e.key === 'Enter') { e.preventDefault(); closeScratchTextEditor(true); }
    else if (e.key === 'Escape') { e.preventDefault(); closeScratchTextEditor(false); }
  });
  input.addEventListener('blur', () => closeScratchTextEditor(true));
  // Focus after the click that opened the box has finished, so the box keeps the focus.
  setTimeout(() => input.focus(), 0);
}

function closeScratchTextEditor(keep) {
  const editor = scratchpadState.textEditor;
  if (!editor) return;
  scratchpadState.textEditor = null;
  const { input, item, isNew, before } = editor;
  const text = keep ? input.value.trim() : before;
  delete item.editing;
  input.remove();
  const strokes = scratchpadState.strokes, index = strokes.indexOf(item);
  if (text) {
    item.text = text;
    if (index < 0) strokes.push(item);
  } else if (index >= 0) {
    strokes.splice(index, 1);
  }
  redrawScratchpad();
  if ((isNew && text) || (!isNew && text !== before)) {
    saveScratchpad();
    updateScratchToolbarView();
  }
}

function bindScratchToolbar() {
  const toggleBtn = document.querySelector('#scratchToggleBtn');
  toggleBtn?.addEventListener('click', () => {
    scratchpadState.active = !scratchpadState.active;
    if (scratchpadState.canvas) {
      scratchpadState.canvas.style.pointerEvents = scratchpadState.active ? 'auto' : 'none';
    }
    updateScratchToolbarView();
  });

  document.querySelectorAll('[data-scratch-tool]').forEach(btn => {
    btn.onclick = () => {
      scratchpadState.tool = btn.dataset.scratchTool;
      scratchpadState.toolChosen = true;
      if (scratchpadState.tool !== 'text') closeScratchTextEditor(true);
      if (scratchpadState.canvas) scratchpadState.canvas.style.cursor = scratchCursor();
      updateScratchToolbarView();
    };
  });

  document.querySelector('#scratchUndoBtn')?.addEventListener('click', () => {
    if (!scratchpadState.strokes.length) return;
    scratchpadState.strokes.pop();
    saveScratchpad();
    redrawScratchpad();
    updateScratchToolbarView();
  });

  document.querySelector('#scratchClearBtn')?.addEventListener('click', () => {
    if (!scratchpadState.strokes.length) return;
    if (confirm('Tüm karalamalar temizlensin mi?')) {
      scratchpadState.strokes = [];
      saveScratchpad();
      redrawScratchpad();
      updateScratchToolbarView();
    }
  });
}

function updateScratchToolbarView() {
  const wrap = document.querySelector('#scratchToolbarWrap');
  if (!wrap) return;
  const parent = wrap.parentElement;
  if (!parent) return;
  const temp = document.createElement('div');
  temp.innerHTML = scratchpadToolbarMarkup();
  const newWrap = temp.firstElementChild;
  parent.replaceChild(newWrap, wrap);
  bindScratchToolbar();
}

function handlePointerDown(e) {
  if (!scratchpadState.active) return;
  e.preventDefault();
  const canvas = scratchpadState.canvas;
  canvas.setPointerCapture(e.pointerId);

  const rect = canvas.getBoundingClientRect();
  const normX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  const normY = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

  const toolConfig = SCRATCH_TOOLS[scratchpadState.tool] || SCRATCH_TOOLS.pen;
  if (toolConfig.isText) {
    // Click on a typed text to change it, anywhere else to start a new one.
    canvas.releasePointerCapture?.(e.pointerId);
    const px = e.clientX - rect.left, py = e.clientY - rect.top;
    const hit = scratchpadState.strokes.slice().reverse().find(s => {
      if (s.tool !== 'text' || s.editing) return false;
      const box = scratchTextBox(s, rect.width, rect.height);
      return px >= box.x - 4 && px <= box.x + box.w + 4 && py >= box.y && py <= box.y + box.h;
    });
    openScratchTextEditor(hit || { tool: 'text', color: toolConfig.color, size: 0, alpha: 1, isEraser: false,
      text: '', points: [{ x: normX, y: normY }] }, !hit);
    return;
  }
  scratchpadState.currentStroke = {
    tool: scratchpadState.tool,
    color: toolConfig.color,
    size: toolConfig.size,
    alpha: toolConfig.alpha,
    isEraser: toolConfig.isEraser,
    points: [{ x: normX, y: normY }]
  };
  scratchpadState.strokes.push(scratchpadState.currentStroke);
  redrawScratchpad();
}

function handlePointerMove(e) {
  if (!scratchpadState.active || !scratchpadState.currentStroke) return;
  e.preventDefault();
  const canvas = scratchpadState.canvas;
  const rect = canvas.getBoundingClientRect();
  const normX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  const normY = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

  // Points closer than about one screen pixel add nothing but make a saved answer larger.
  const last = scratchpadState.currentStroke.points.at(-1);
  if (last && Math.abs(normX - last.x) * rect.width < 1.5 && Math.abs(normY - last.y) * rect.height < 1.5) return;
  scratchpadState.currentStroke.points.push({ x: normX, y: normY });
  redrawScratchpad();
}

function handlePointerUp(e) {
  if (!scratchpadState.currentStroke) return;
  scratchpadState.currentStroke = null;
  saveScratchpad();
  updateScratchToolbarView();
}

function saveScratchpad() {
  if (scratchpadState.onChange) {
    scratchpadState.onChange(scratchToCompact(scratchpadState.strokes));
    return;
  }
  if (!scratchpadState.storageKey) return;
  try {
    if (scratchpadState.strokes.length) {
      sessionStorage.setItem('cio_scratch_' + scratchpadState.storageKey, JSON.stringify(scratchpadState.strokes));
    } else {
      sessionStorage.removeItem('cio_scratch_' + scratchpadState.storageKey);
    }
  } catch {}
}

function redrawScratchpad() {
  const canvas = scratchpadState.canvas;
  const ctx = scratchpadState.ctx;
  if (!canvas || !ctx) return;
  paintScratchStrokes(canvas, scratchpadState.strokes);
}

// Shows a saved drawing (compact strokes) over every .answer-drawing image; read-only.
// Used where a parent checks the answer and where the student sees a submitted answer.
function bindAnswerDrawings(root = document) {
  root.querySelectorAll('.answer-drawing').forEach(box => {
    const image = box.querySelector('img');
    let strokes = [];
    try { strokes = scratchFromCompact(JSON.parse(box.dataset.strokes || '[]')); } catch {}
    const canvas = document.createElement('canvas');
    canvas.className = 'answer-drawing-canvas';
    box.append(canvas);
    const paint = () => {
      const rect = image.getBoundingClientRect();
      if (!rect.width || !box.isConnected) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      paintScratchStrokes(canvas, strokes);
    };
    if (image.complete) paint(); else image.addEventListener('load', paint);
    new ResizeObserver(paint).observe(image);
  });
}

function paintScratchStrokes(canvas, strokes) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  const dpr = window.devicePixelRatio || 1;
  ctx.clearRect(0, 0, w, h);

  for (const stroke of strokes) {
    if (!stroke.points || stroke.points.length < 1) continue;
    if (stroke.tool === 'text') {
      if (stroke.editing || !stroke.text) continue;
      const px = scratchTextFontPx(w / dpr) * dpr, x = stroke.points[0].x * w, y = stroke.points[0].y * h;
      ctx.save();
      ctx.font = scratchTextFont(px);
      ctx.textBaseline = 'middle';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 4 * dpr;
      ctx.strokeStyle = 'rgba(255,255,255,0.9)';
      ctx.strokeText(stroke.text, x, y);
      ctx.fillStyle = stroke.color || SCRATCH_TOOLS.text.color;
      ctx.fillText(stroke.text, x, y);
      ctx.restore();
      continue;
    }

    ctx.save();
    if (stroke.isEraser) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = stroke.size * dpr;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = stroke.color;
      ctx.globalAlpha = stroke.alpha || 1;
      ctx.lineWidth = stroke.size * dpr;
    }
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    const first = stroke.points[0];
    ctx.moveTo(first.x * w, first.y * h);

    if (stroke.points.length === 1) {
      ctx.lineTo(first.x * w + 0.5, first.y * h + 0.5);
    } else {
      for (let i = 1; i < stroke.points.length; i++) {
        const pt = stroke.points[i];
        ctx.lineTo(pt.x * w, pt.y * h);
      }
    }
    ctx.stroke();
    ctx.restore();
  }
}
