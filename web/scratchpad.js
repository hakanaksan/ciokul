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
  highlighter: { name: 'Vurgulayıcı', color: '#facc15', size: 16, alpha: 0.45, isEraser: false },
  eraser: { name: 'Silgi', color: '#000000', size: 20, alpha: 1, isEraser: true }
};

function scratchpadToolbarMarkup() {
  const active = scratchpadState.active;
  const current = scratchpadState.tool;
  return `
    <div class="scratch-toolbar-wrap ${active ? 'active' : ''}" id="scratchToolbarWrap">
      <div class="scratch-toggle-row">
        <button type="button" class="btn secondary scratch-toggle-btn" id="scratchToggleBtn" aria-pressed="${active}">
          ${active ? '✏️ Karalamayı Kapat' : '✏️ Karalama & İşlem Kalemi'}
        </button>
        ${active ? `
          <div class="scratch-tools" role="toolbar" aria-label="Çizim araçları">
            <button type="button" data-scratch-tool="pen" class="scratch-tool-btn ${current === 'pen' ? 'active' : ''}" title="Kurşun Kalem">
              <span class="tool-dot" style="background:#1e293b"></span> Kalem
            </button>
            <button type="button" data-scratch-tool="red" class="scratch-tool-btn ${current === 'red' ? 'active' : ''}" title="Kırmızı Kalem (Şık eleme)">
              <span class="tool-dot" style="background:#dc2626"></span> Kırmızı
            </button>
            <button type="button" data-scratch-tool="blue" class="scratch-tool-btn ${current === 'blue' ? 'active' : ''}" title="Mavi Kalem">
              <span class="tool-dot" style="background:#2563eb"></span> Mavi
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

function initScratchpad(containerSelector, storageKey) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  scratchpadState.container = container;
  scratchpadState.storageKey = storageKey;
  const image = container.querySelector('img.question-image');
  if (!image) return;
  scratchpadState.image = image;

  // Restore saved strokes for this question
  try {
    const raw = sessionStorage.getItem('cio_scratch_' + storageKey);
    scratchpadState.strokes = raw ? JSON.parse(raw) : [];
  } catch {
    scratchpadState.strokes = [];
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
    canvas.style.cursor = scratchpadState.tool === 'eraser' ? 'cell' : 'crosshair';
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

  // Pointer event listeners
  canvas.onpointerdown = handlePointerDown;
  canvas.onpointermove = handlePointerMove;
  canvas.onpointerup = handlePointerUp;
  canvas.onpointercancel = handlePointerUp;

  bindScratchToolbar();
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
      if (scratchpadState.canvas) {
        scratchpadState.canvas.style.cursor = scratchpadState.tool === 'eraser' ? 'cell' : 'crosshair';
      }
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

  const w = canvas.width;
  const h = canvas.height;
  const dpr = window.devicePixelRatio || 1;
  ctx.clearRect(0, 0, w, h);

  for (const stroke of scratchpadState.strokes) {
    if (!stroke.points || stroke.points.length < 1) continue;

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
