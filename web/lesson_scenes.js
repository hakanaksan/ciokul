/* Animated SVG scenes for the video lessons. Elements with data-step="n" appear when the
   narration reaches sentence n (0-based); data-hide="n" disappears from sentence n on.
   Both can be combined on one element. */

const LS_DEFS = `<defs>
  <linearGradient id="lsSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bfe6ff"/><stop offset="1" stop-color="#eaf7ff"/></linearGradient>
  <linearGradient id="lsDesertSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd98a"/><stop offset="1" stop-color="#fff3d6"/></linearGradient>
  <linearGradient id="lsSea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4fb3e8"/><stop offset="1" stop-color="#1c6fa8"/></linearGradient>
  <linearGradient id="lsSand" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f1cf8b"/><stop offset="1" stop-color="#d9a956"/></linearGradient>
  <pattern id="lsStone" width="14" height="14" patternUnits="userSpaceOnUse"><rect width="14" height="14" fill="#a99a86"/><circle cx="4" cy="5" r="1.4" fill="#8e8070"/><circle cx="11" cy="10" r="1" fill="#bcae99"/></pattern>
</defs>`;

function lsSvg(body, sky = 'url(#lsSky)') {
  return `<svg viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">${LS_DEFS}<rect width="800" height="450" fill="${sky}"/>${body}</svg>`;
}
const lsStep = (n, cls = '') => `data-step="${n}" class="ls-in ${cls}"`;
// Label width is estimated from the text; capitals are wider in the bold label font.
const lsLabelWidth = text => [...text].reduce((w, c) => w + (c !== c.toLocaleLowerCase('tr') ? 14.5 : 10.8), 0) + 28;
const lsLabel = (x, y, text, step, cls = '') =>
  `<g ${lsStep(step, 'ls-pop ' + cls)}><rect x="${x - lsLabelWidth(text) / 2}" y="${y - 22}" width="${lsLabelWidth(text)}" height="34" rx="17" class="ls-label-bg"/><text x="${x}" y="${y}" text-anchor="middle" class="ls-label">${text}</text></g>`;

function lsFish(x, y, s = 1, color = '#ff9f43', cls = '') {
  return `<g class="${cls}" transform="translate(${x} ${y}) scale(${s})"><path d="M-40 0 C-20 -26 26 -26 40 0 C26 26 -20 26 -40 0 Z" fill="${color}"/><path d="M40 0 L66 -20 L60 0 L66 20 Z" fill="${color}"/><circle cx="-22" cy="-6" r="5" fill="#fff"/><circle cx="-23" cy="-6" r="2.6" fill="#1b2a35"/><path d="M-4 -14 Q6 0 -4 14" stroke="#e5862a" stroke-width="3" fill="none"/></g>`;
}
function lsSkeleton(x, y, s = 1, color = '#f4ead7', cls = '') {
  const ribs = [-24, -12, 0, 12, 24].map(dx => `<path d="M${dx} -14 Q${dx + 4} 0 ${dx} 14" stroke="${color}" stroke-width="4" fill="none" stroke-linecap="round"/>`).join('');
  return `<g class="${cls}" transform="translate(${x} ${y}) scale(${s})"><circle cx="-44" cy="0" r="12" fill="none" stroke="${color}" stroke-width="5"/><line x1="-32" y1="0" x2="40" y2="0" stroke="${color}" stroke-width="5" stroke-linecap="round"/>${ribs}<path d="M40 0 L62 -16 M40 0 L62 16" stroke="${color}" stroke-width="5" stroke-linecap="round"/></g>`;
}
function lsBone(x, y, s = 1, color = '#f4ead7') {
  return `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-34" y="-7" width="68" height="14" rx="7" fill="${color}"/><circle cx="-36" cy="-9" r="10" fill="${color}"/><circle cx="-36" cy="9" r="10" fill="${color}"/><circle cx="36" cy="-9" r="10" fill="${color}"/><circle cx="36" cy="9" r="10" fill="${color}"/></g>`;
}
function lsTooth(x, y, s = 1) {
  return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-22 18 L0 -34 L22 18 Q0 8 -22 18 Z" fill="#f7f1e3" stroke="#bfae8f" stroke-width="3"/></g>`;
}
function lsShell(x, y, s = 1) {
  return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 26 C-34 26 -36 -14 -18 -24 C0 -34 26 -22 26 0 C26 16 12 24 0 24" fill="#e9c99a" stroke="#a37b45" stroke-width="3"/><path d="M0 26 L-14 -20 M0 26 L0 -28 M0 26 L14 -22 M0 26 L24 -6" stroke="#a37b45" stroke-width="2.5"/></g>`;
}
function lsLeafPrint(x, y, s = 1) {
  return `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-56" y="-44" width="112" height="88" rx="18" fill="url(#lsStone)"/><path d="M-30 30 C-34 -6 6 -34 32 -32 C34 -6 8 30 -30 30 Z" fill="#8c7d6b" stroke="#6f6252" stroke-width="2"/><path d="M-30 30 L30 -30 M-10 10 L-16 -10 M4 -4 L0 -22 M-4 4 L14 6 M10 -10 L26 -8" stroke="#6f6252" stroke-width="2"/></g>`;
}
function lsPerson(x, y, s = 1, shirt = '#2eaa83', tool = 'brush') {
  const item = tool === 'brush'
    ? `<g class="ls-brush"><line x1="24" y1="-6" x2="46" y2="20" stroke="#8a5a2b" stroke-width="5" stroke-linecap="round"/><rect x="40" y="16" width="14" height="10" rx="2" fill="#f2c94c" transform="rotate(40 47 21)"/></g>`
    : `<g><path d="M30 6 Q48 -8 62 8 L58 34 Q46 42 34 34 Z" fill="#c8733d" stroke="#8d4c22" stroke-width="3"/><path d="M36 14 H56" stroke="#8d4c22" stroke-width="2"/></g>`;
  return `<g transform="translate(${x} ${y}) scale(${s})"><circle cx="0" cy="-58" r="18" fill="#f2c7a5"/><path d="M-20 -64 Q0 -92 20 -64 Z" fill="#e8b84a"/><rect x="-26" y="-68" width="52" height="8" rx="4" fill="#d9a43a"/><rect x="-20" y="-40" width="40" height="52" rx="12" fill="${shirt}"/><line x1="18" y1="-30" x2="30" y2="0" stroke="${shirt}" stroke-width="10" stroke-linecap="round"/><rect x="-18" y="10" width="14" height="36" rx="6" fill="#3d4f63"/><rect x="4" y="10" width="14" height="36" rx="6" fill="#3d4f63"/>${item}</g>`;
}
function lsDino(x, y, s = 1, color = '#6fbf73') {
  return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-90 10 C-70 -30 -20 -40 20 -30 C40 -70 70 -92 92 -82 C104 -76 100 -60 88 -58 C72 -56 62 -40 60 -20 C80 0 96 20 120 30 C80 30 60 24 40 18 L36 50 L20 50 L18 22 L-20 22 L-24 50 L-40 50 L-42 18 C-60 16 -80 18 -90 10 Z" fill="${color}"/><circle cx="86" cy="-72" r="4" fill="#1b2a35"/></g>`;
}
function lsSeabed(extra = '') {
  return `<rect x="0" y="0" width="800" height="320" fill="url(#lsSea)"/><path d="M0 300 Q200 280 400 300 T800 296 V450 H0 Z" fill="url(#lsSand)"/>${extra}
    <g class="ls-bubbles"><circle cx="120" cy="250" r="6"/><circle cx="640" cy="220" r="5"/><circle cx="420" cy="260" r="4"/></g>`;
}

const LESSON_SCENES = {
  'desert-fish': () => lsSvg(`
    <circle cx="680" cy="80" r="44" fill="#ffcf4d" class="ls-sun"/>
    <path d="M0 330 Q140 280 300 320 T600 300 T800 320 V450 H0 Z" fill="url(#lsSand)"/>
    <path d="M330 300 L470 140 L520 190 L600 110 L760 310 Z" fill="#c9915a"/><path d="M380 300 L470 160 L560 300 Z" fill="#b57d47"/>
    <g ${lsStep(1)}><rect x="470" y="200" width="150" height="80" rx="14" fill="url(#lsStone)"/>${lsSkeleton(545, 240, 0.9, '#6f6252')}</g>
    <g ${lsStep(2, 'ls-pop')}><text x="250" y="210" class="ls-big">?</text></g>
    <g ${lsStep(3, 'ls-pop')}><circle cx="150" cy="180" r="48" fill="none" stroke="#3d4f63" stroke-width="12"/><line x1="185" y1="215" x2="235" y2="265" stroke="#3d4f63" stroke-width="16" stroke-linecap="round"/></g>
    ${lsLabel(560, 400, 'Sahra Çölü', 0)}`, 'url(#lsDesertSky)'),

  'fossil-examples': () => lsSvg(`
    ${lsLabel(400, 70, 'FOSİL = taşlaşmış kalıntı ya da iz', 0)}
    <g ${lsStep(1, 'ls-rise')}><rect x="60" y="120" width="200" height="190" rx="22" class="ls-card"/>${lsBone(160, 200, 1.2)}<text x="160" y="285" class="ls-cap" text-anchor="middle">Kemik</text></g>
    <g ${lsStep(1, 'ls-rise ls-d1')}><rect x="300" y="120" width="200" height="190" rx="22" class="ls-card"/>${lsTooth(400, 200, 1.3)}<text x="400" y="285" class="ls-cap" text-anchor="middle">Diş</text></g>
    <g ${lsStep(1, 'ls-rise ls-d2')}><rect x="540" y="120" width="200" height="190" rx="22" class="ls-card"/>${lsShell(640, 200, 1.4)}<text x="640" y="285" class="ls-cap" text-anchor="middle">Kabuk</text></g>
    <g ${lsStep(2, 'ls-pop')}>${lsLeafPrint(400, 380, 0.9)}<text x="480" y="390" class="ls-cap">Yaprak izi</text></g>
    ${lsLabel(150, 400, 'Taş gibi sert!', 3)}`),

  'form-death': () => lsSvg(lsSeabed(`
    <g data-hide="1" class="ls-in on">${lsFish(380, 140, 1.1, '#ff9f43', 'ls-swim')}</g>
    <g ${lsStep(1, 'ls-sink')} data-hide="2">${lsFish(400, 278, 1, '#d98c4a')}</g>
    <g ${lsStep(2)}>${lsSkeleton(400, 282, 1)}</g>`) + lsLabel(400, 60, 'Milyonlarca yıl önce bir deniz', 1) + lsLabel(400, 410, 'Sert kısımlar kalır', 2)),

  'form-bury': () => lsSvg(lsSeabed(`
    ${lsSkeleton(400, 282, 1)}
    <g ${lsStep(0)}><path d="M0 120 Q120 140 220 200" stroke="#8a6a3e" stroke-width="22" fill="none" opacity=".55" class="ls-flow"/>
      <g class="ls-rain">${[180, 260, 340, 420, 500, 580].map((x, i) => `<circle cx="${x}" cy="${150 + (i % 3) * 30}" r="5" fill="#8a6a3e"/>`).join('')}</g></g>
    <path ${lsStep(1, 'ls-cover')} d="M0 286 Q200 268 400 280 T800 276 V320 H0 Z" fill="#9c7b4f"/>`) +
    lsLabel(240, 70, 'Akarsu çamur ve kum taşır', 0) + lsLabel(400, 380, 'TORTU', 1) +
    `<g ${lsStep(2, 'ls-pop')}><circle cx="650" cy="380" r="34" fill="#fff" stroke="#e25d3f" stroke-width="6"/><text x="650" y="392" text-anchor="middle" class="ls-cap">hava</text><line x1="626" y1="404" x2="674" y2="356" stroke="#e25d3f" stroke-width="6"/></g>`),

  'form-layers': () => {
    const layers = ['#b08a5a', '#c49a62', '#a57b4e', '#caa575'].map((c, i) =>
      `<rect ${lsStep(0, 'ls-drop ls-d' + i)} x="0" y="${300 - (i + 1) * 34}" width="800" height="34" fill="${c}"/>`).join('');
    return lsSvg(`<rect x="0" y="0" width="800" height="160" fill="url(#lsSea)"/><rect x="0" y="300" width="800" height="150" fill="#8a6a3e"/>
      ${layers}
      <g data-hide="2" class="ls-in on">${lsSkeleton(400, 330, 0.9)}</g>
      <g ${lsStep(2)}><rect x="320" y="305" width="160" height="56" rx="10" fill="url(#lsStone)"/>${lsSkeleton(400, 333, 0.9, '#5d5145')}</g>
      <g ${lsStep(1, 'ls-pop')}>${[200, 400, 600].map(x => `<path d="M${x} 40 V110 M${x - 18} 92 L${x} 112 L${x + 18} 92" stroke="#fff" stroke-width="8" fill="none" stroke-linecap="round"/>`).join('')}</g>
      ${lsLabel(400, 420, 'FOSİL', 2)}${lsLabel(640, 420, 'Milyonlarca yıl', 3)}`);
  },

  'form-uplift': () => lsSvg(`
    <g class="ls-fold">${['#b08a5a', '#c49a62', '#a57b4e', '#caa575'].map((c, i) => `<path d="M0 ${360 - i * 30} Q400 ${200 - i * 30} 800 ${360 - i * 30} V${390 - i * 30} Q400 ${230 - i * 30} 0 ${390 - i * 30} Z" fill="${c}"/>`).join('')}</g>
    <rect x="0" y="390" width="800" height="60" fill="#8a6a3e"/>
    ${lsLabel(150, 60, 'Artık kara!', 1)}
    <g ${lsStep(2)}><g class="ls-rain">${[260, 300, 340, 380].map(x => `<line x1="${x}" y1="70" x2="${x - 10}" y2="100" stroke="#4fb3e8" stroke-width="5" stroke-linecap="round"/>`).join('')}</g><ellipse cx="320" cy="60" rx="80" ry="30" fill="#e8eef3"/>
      <g class="ls-wind">${[110, 140, 170].map(y => `<path d="M560 ${y} q40 -14 80 0" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round"/>`).join('')}</g></g>
    <g ${lsStep(3, 'ls-pop')}><rect x="420" y="182" width="120" height="50" rx="10" fill="url(#lsStone)"/>${lsSkeleton(480, 207, 0.7, '#5d5145')}${lsPerson(610, 168, 0.9)}</g>
    ${lsLabel(400, 430, 'Kayalar kıvrılır ve yükselir', 0)}`),

  'desert-answer': () => lsSvg(`
    <rect x="0" y="0" width="400" height="450" fill="url(#lsSea)"/><path d="M0 380 Q200 360 400 380 V450 H0 Z" fill="url(#lsSand)"/>
    ${lsFish(150, 200, 0.9, '#ff9f43', 'ls-swim')}${lsFish(270, 290, 0.7, '#ffd166', 'ls-swim ls-d1')}
    <rect x="400" y="0" width="400" height="450" fill="url(#lsDesertSky)"/><path d="M400 360 Q600 300 800 350 V450 H400 Z" fill="url(#lsSand)"/>
    <rect x="530" y="260" width="140" height="70" rx="12" fill="url(#lsStone)"/>${lsSkeleton(600, 295, 0.8, '#5d5145')}
    <line x1="400" y1="0" x2="400" y2="450" stroke="#fff" stroke-width="6"/>
    ${lsLabel(200, 60, 'Milyonlarca yıl önce: DENİZ', 1)}${lsLabel(600, 60, 'Bugün: ÇÖL', 0)}
    ${lsLabel(400, 420, 'Fosiller geçmişi anlatır', 2)}`),

  'conditions': () => lsSvg(`
    <g ${lsStep(1, 'ls-rise')}><rect x="40" y="70" width="340" height="250" rx="24" fill="url(#lsSea)"/><path d="M40 250 H380 V296 Q380 320 356 320 H64 Q40 320 40 296 Z" fill="#9c7b4f"/>${lsSkeleton(210, 268, 0.8)}<path d="M40 250 H380" stroke="#7d5f3a" stroke-width="4"/>
      <circle cx="340" cy="110" r="26" fill="#2eaa83"/><path d="M328 110 l9 9 l16 -18" stroke="#fff" stroke-width="6" fill="none"/><text x="210" y="350" text-anchor="middle" class="ls-cap">Tortuyla örtüldü</text></g>
    <g ${lsStep(2, 'ls-rise')}><rect x="420" y="70" width="340" height="250" rx="24" fill="#cdeaff"/><circle cx="700" cy="110" r="26" fill="#ffcf4d"/><path d="M420 250 H760 V296 Q760 320 736 320 H444 Q420 320 420 296 Z" fill="#9bd27d"/>${lsBone(580, 240, 0.9, '#d8c7a6')}
      <g class="ls-wind">${[150, 180].map(y => `<path d="M450 ${y} q40 -14 80 0" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round"/>`).join('')}</g>
      <circle cx="470" cy="110" r="26" fill="#e25d3f"/><path d="M460 100 l20 20 M480 100 l-20 20" stroke="#fff" stroke-width="6"/><text x="590" y="350" text-anchor="middle" class="ls-cap">Açıkta kaldı, bozulur</text></g>
    ${lsLabel(210, 410, 'Deniz ve göl dipleri', 3)}
    <g ${lsStep(4, 'ls-pop')}>${lsBone(470, 405, 0.5)}${lsTooth(540, 405, 0.6)}${lsShell(600, 405, 0.6)}<text x="636" y="414" class="ls-cap">sert kısımlar</text></g>`),

  'layers-time': () => {
    const rows = [['#caa575', 'leaf'], ['#a57b4e', 'bone'], ['#c49a62', 'fish'], ['#b08a5a', 'shell']];
    const fossil = (kind, y) => kind === 'leaf' ? `<path d="M110 ${y + 18} C106 ${y - 2} 132 ${y - 16} 150 ${y - 14} C152 ${y + 2} 134 ${y + 18} 110 ${y + 18} Z" fill="#6f6252"/>`
      : kind === 'bone' ? lsBone(140, y, 0.55, '#5d5145') : kind === 'fish' ? lsSkeleton(140, y, 0.55, '#5d5145') : lsShell(140, y, 0.65);
    return lsSvg(`${rows.map(([c, kind], i) => `<g><rect x="60" y="${80 + i * 80}" width="300" height="80" fill="${c}" stroke="#7a5c37" stroke-width="2"/>${fossil(kind, 120 + i * 80)}${i === 2 ? `<g ${lsStep(4, 'ls-pop')}>${lsShell(250, 280, 0.6)}<rect x="66" y="246" width="288" height="68" rx="10" fill="none" stroke="#e25d3f" stroke-width="5" stroke-dasharray="10 8"/></g>` : ''}</g>`).join('')}
      <g ${lsStep(3, 'ls-pop')}><path d="M400 380 V100" stroke="#3d4f63" stroke-width="8" stroke-linecap="round"/><path d="M386 116 L400 96 L414 116" fill="#3d4f63"/><text x="420" y="110" class="ls-cap">daha yeni</text><text x="420" y="380" class="ls-cap">daha eski</text></g>
      <g ${lsStep(1, 'ls-rise')}>${lsDino(620, 260, 0.9)}</g>
      <g ${lsStep(2, 'ls-pop')}><text x="540" y="380" class="ls-cap">Canlılar zamanla değişti</text></g>`);
  },

  'scientists': () => lsSvg(`
    <path d="M0 330 Q200 300 420 330 V450 H0 Z" fill="url(#lsSand)"/>
    <rect x="90" y="330" width="170" height="60" rx="12" fill="url(#lsStone)"/>${lsSkeleton(175, 360, 0.7, '#5d5145')}
    ${lsPerson(300, 330, 1.1)}
    ${lsLabel(210, 70, 'PALEONTOLOJİ', 0)}${lsLabel(210, 120, 'Paleontolog', 1)}
    <g ${lsStep(3, 'ls-rise')}><rect x="470" y="60" width="300" height="330" rx="24" class="ls-card"/>${lsPerson(580, 300, 0.95, '#4c8be6', 'pot')}
      <text x="620" y="110" text-anchor="middle" class="ls-cap">Arkeolog</text><text x="620" y="360" text-anchor="middle" class="ls-cap">çanak, çömlek, alet</text>
      <text x="440" y="240" text-anchor="middle" class="ls-big ls-neq">≠</text></g>`),

  'summary': () => {
    const cards = [['🦴', 'Taşlaşmış kalıntı ya da iz'], ['⏳', 'Milyonlarca yılda oluşur'], ['🌊', 'Tortuyla hemen örtülmeli'], ['🪨', 'Katmanlarda bulunur']];
    return lsSvg(`${cards.map(([icon, text], i) => `<g ${lsStep(i + 1, 'ls-rise')}><rect x="${40 + (i % 2) * 370}" y="${60 + Math.floor(i / 2) * 150}" width="350" height="128" rx="22" class="ls-card"/><text x="${80 + (i % 2) * 370}" y="${140 + Math.floor(i / 2) * 150}" class="ls-emoji">${icon}</text><text x="${150 + (i % 2) * 370}" y="${132 + Math.floor(i / 2) * 150}" class="ls-cap">${text}</text></g>`).join('')}
      ${lsLabel(400, 410, 'Hazırsan mini teste geçelim!', 5)}`);
  },
};

function lessonSceneSvg(visual) {
  return (LESSON_SCENES[visual] || LESSON_SCENES.summary)();
}
