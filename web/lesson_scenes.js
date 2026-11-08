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
// Label width is estimated from the text; capitals and emoji are wider in the bold label font.
const lsCharWidth = c => /[️‍]/.test(c) ? 0 : c.codePointAt(0) > 0x2400 ? 24 : c !== c.toLocaleLowerCase('tr') ? 14.5 : 10.8;
const lsLabelWidth = text => [...text].reduce((w, c) => w + lsCharWidth(c), 0) + 28;
const lsLabel = (x, y, text, step, cls = '') =>
  `<g ${lsStep(step, 'ls-pop ' + cls)}><rect x="${x - lsLabelWidth(text) / 2}" y="${y - 22}" width="${lsLabelWidth(text)}" height="34" rx="17" class="ls-label-bg"/><text x="${x}" y="${y}" text-anchor="middle" class="ls-label">${text}</text></g>`;
// A coloured label, used for the jobs of the nutrients (energy, building, regulating).
const lsPill = (x, y, text, color, step, cls = '') =>
  `<g ${lsStep(step, 'ls-pop ' + cls)}><rect x="${x - lsLabelWidth(text) / 2}" y="${y - 22}" width="${lsLabelWidth(text)}" height="34" rx="17" fill="${color}"/><text x="${x}" y="${y}" text-anchor="middle" class="ls-pill">${text}</text></g>`;
const lsEmoji = (x, y, emoji, size = 48, attrs = '') =>
  `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" font-size="${size}" ${attrs}>${emoji}</text>`;
// A row of food cards centred on the stage; an item is [emoji or draw(x, y), name].
const lsFoodRow = (items, y, step) => items.map(([icon, name], i) => {
  const gap = Math.min(140, 740 / items.length), x = 400 + (i - (items.length - 1) / 2) * gap, w = Math.min(124, gap - 12);
  return `<g ${lsStep(step, 'ls-rise ls-d' + Math.min(i, 5))}><rect x="${x - w / 2}" y="${y - w / 2}" width="${w}" height="${w}" rx="20" class="ls-card"/>${typeof icon === 'function' ? icon(x, y - 12) : lsEmoji(x, y - 12, icon, Math.round(w * 0.4))}<text x="${x}" y="${y + w / 2 - 14}" text-anchor="middle" class="ls-small">${name}</text></g>`;
}).join('');
// Summary cards appear one per sentence (1..n); the closing label comes with the last sentence.
// A "|" in a card's text starts a second line.
function lsSummary(cards, closing) {
  return lsSvg(`${cards.map(([icon, text], i) => {
    const x = 40 + (i % 2) * 370, y = 60 + Math.floor(i / 2) * 150, lines = text.split('|');
    return `<g ${lsStep(i + 1, 'ls-rise')}><rect x="${x}" y="${y}" width="350" height="128" rx="22" class="ls-card"/><text x="${x + 40}" y="${y + 80}" class="ls-emoji">${icon}</text><text y="${y + 72 - (lines.length - 1) * 13}" class="ls-cap">${lines.map((line, j) => `<tspan x="${x + 110}" dy="${j ? 26 : 0}">${line}</tspan>`).join('')}</text></g>`;
  }).join('')}
    ${lsLabel(400, 410, closing, cards.length + 1)}`);
}

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
function lsKid(x, y, s = 1, shirt = '#4c8be6', hair = '#5a3b22') {
  return `<g transform="translate(${x} ${y}) scale(${s})"><circle cx="0" cy="-58" r="18" fill="#f2c7a5"/><path d="M-19 -60 Q-18 -82 0 -80 Q18 -82 19 -60 Q6 -72 -19 -60 Z" fill="${hair}"/><circle cx="-6" cy="-57" r="2.2" fill="#1b2a35"/><circle cx="6" cy="-57" r="2.2" fill="#1b2a35"/><path d="M-6 -49 Q0 -44 6 -49" stroke="#1b2a35" stroke-width="2" fill="none" stroke-linecap="round"/><rect x="-20" y="-40" width="40" height="52" rx="12" fill="${shirt}"/><line x1="-18" y1="-30" x2="-30" y2="0" stroke="${shirt}" stroke-width="10" stroke-linecap="round"/><line x1="18" y1="-30" x2="30" y2="0" stroke="${shirt}" stroke-width="10" stroke-linecap="round"/><rect x="-18" y="10" width="14" height="36" rx="6" fill="#3d4f63"/><rect x="4" y="10" width="14" height="36" rx="6" fill="#3d4f63"/></g>`;
}
// A lunch tray with foods; centre x, top y.
function lsTray(x, y, foods, attrs = '') {
  const gap = 260 / foods.length;
  return `<g ${attrs}><rect x="${x - 150}" y="${y}" width="300" height="130" rx="22" fill="#fff" stroke="#c9d6cd" stroke-width="4"/>${foods.map((f, i) => lsEmoji(x - 130 + gap * (i + 0.5), y + 65, f, 44)).join('')}</g>`;
}
const lsBottle = color => (x, y) => `<g transform="translate(${x} ${y})"><rect x="-6" y="-38" width="12" height="10" rx="2" fill="#3d4f63"/><path d="M-6 -28 V-22 Q-18 -14 -18 0 V22 Q-18 30 -10 30 H10 Q18 30 18 22 V0 Q18 -14 6 -22 V-28 Z" fill="${color}" stroke="#6b6b4a" stroke-width="2"/></g>`;
const lsCross = (x, y, w) => `<line x1="${x - w / 2}" y1="${y + 14}" x2="${x + w / 2}" y2="${y - 14}" stroke="#e25d3f" stroke-width="6" stroke-linecap="round"/>`;

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

  'summary': () => lsSummary([['🦴', 'Taşlaşmış kalıntı ya da iz'], ['⏳', 'Milyonlarca yılda oluşur'], ['🌊', 'Tortuyla hemen örtülmeli'], ['🪨', 'Katmanlarda bulunur']], 'Hazırsan mini teste geçelim!'),

  /* Besinler ve İçerikleri */
  'food-energy': () => lsSvg(`
    ${lsKid(150, 300, 1.3)}
    <g ${lsStep(0, 'ls-pop')}>${lsEmoji(300, 230, '🍽️', 60)}${lsCross(300, 230, 70)}<text x="300" y="290" text-anchor="middle" class="ls-small">kahvaltı yok</text></g>
    <rect x="430" y="110" width="200" height="100" rx="16" fill="#fff" stroke="#3d4f63" stroke-width="8"/><rect x="634" y="140" width="16" height="40" rx="4" fill="#3d4f63"/>
    <rect ${lsStep(1)} data-hide="2" x="442" y="122" width="40" height="76" rx="8" fill="#e25d3f"/>
    <rect ${lsStep(2)} x="442" y="122" width="176" height="76" rx="8" fill="#2eaa83"/>
    <g data-hide="2" class="ls-in on">${lsLabel(530, 260, 'Enerji azaldı', 1)}</g>
    <g ${lsStep(2, 'ls-drop')}>${lsEmoji(370, 130, '🍞', 40)}${lsEmoji(395, 190, '🥚', 36)}${lsEmoji(690, 120, '🍎', 40)}</g>
    ${lsLabel(530, 260, 'Besinler enerji verir', 2)}
    ${[['📏 Büyümek', 110], ['🏃 Hareket', 300], ['🔥 Isınmak', 490], ['🛡️ Korunmak', 690]].map(([t, x], i) => lsLabel(x, 410, t, 3, 'ls-d' + i)).join('')}`),

  'living-food': () => lsSvg(`
    <g data-hide="2" class="ls-in on">${lsLabel(400, 60, 'Bütün canlılar beslenir', 0)}
      ${[['🧒', 130], ['🐄', 310], ['🐦', 490], ['🌱', 670]].map(([e, x]) => lsEmoji(x, 180, e, 76)).join('')}
      <g ${lsStep(1, 'ls-pop')}><text x="310" y="300" text-anchor="middle" font-size="36">🌿 ➜ 🐄</text><text x="310" y="340" text-anchor="middle" class="ls-small">bitki yer</text></g>
      <g ${lsStep(1, 'ls-pop ls-d1')}><text x="490" y="300" text-anchor="middle" font-size="36">🐛 ➜ 🐦</text><text x="490" y="340" text-anchor="middle" class="ls-small">hayvan yer</text></g>
      <g ${lsStep(1, 'ls-pop ls-d2')}><text x="670" y="300" text-anchor="middle" font-size="36">☀️ ➜ 🌱</text><text x="670" y="340" text-anchor="middle" class="ls-small">besinini üretir</text></g></g>
    <g ${lsStep(2, 'ls-rise')}><rect x="50" y="70" width="330" height="320" rx="24" class="ls-card"/><text x="215" y="125" text-anchor="middle" class="ls-label">🌾 Bitkisel</text></g>
    <g ${lsStep(2, 'ls-rise ls-d1')}><rect x="420" y="70" width="330" height="320" rx="24" class="ls-card"/><text x="585" y="125" text-anchor="middle" class="ls-label">🐄 Hayvansal</text></g>
    <g ${lsStep(3)}>${[['🍞', 'ekmek', 110], ['🍎', 'elma', 215], ['🥕', 'havuç', 320], ['🥛', 'süt', 480], ['🥚', 'yumurta', 585], ['🐟', 'balık', 690]].map(([e, n, x]) => `${lsEmoji(x, 230, e, 60)}<text x="${x}" y="300" text-anchor="middle" class="ls-small">${n}</text>`).join('')}</g>`),

  'nutrient-groups': () => {
    const groups = [['🍞', 'Karbonhidratlar', '#f2994a'], ['🧈', 'Yağlar', '#f2994a'], ['🥚', 'Proteinler', '#e25d3f'], ['🍊', 'Vitaminler', '#2eaa83'], ['💧', 'Su', '#2eaa83'], ['🦷', 'Mineraller', '#2eaa83']];
    return lsSvg(`${lsLabel(400, 55, 'BESİN İÇERİKLERİ', 0)}
      ${groups.map(([e, name, color], i) => { const x = 60 + (i % 3) * 240, y = 95 + Math.floor(i / 3) * 125;
        return `<g ${lsStep(1, 'ls-rise ls-d' + i)}><rect x="${x}" y="${y}" width="200" height="108" rx="20" class="ls-card"/>${lsEmoji(x + 100, y + 38, e, 40)}<text x="${x + 100}" y="${y + 88}" text-anchor="middle" class="ls-cap">${name}</text></g><rect ${lsStep(3)} x="${x + 20}" y="${y + 100}" width="160" height="8" rx="4" fill="${color}"/>`; }).join('')}
      <g data-hide="3" class="ls-in on">${lsLabel(400, 385, 'Her birinin bir görevi var', 2)}</g>
      ${lsPill(160, 385, 'Enerji verir', '#e8832f', 3)}${lsPill(400, 385, 'Yapıcı ve onarıcı', '#d9472b', 3, 'ls-d1')}${lsPill(640, 385, 'Düzenleyici', '#1f9a73', 3, 'ls-d2')}`);
  },

  'carbs': () => lsSvg(`${lsLabel(400, 50, 'KARBONHİDRATLAR', 0)}${lsPill(400, 100, '⚡ Enerji verir', '#e8832f', 0)}
    <g ${lsStep(1, 'ls-pop')}>${lsEmoji(260, 170, '🏃', 52)}${lsEmoji(400, 170, '⚽', 46)}${lsEmoji(540, 170, '💭', 50)}</g>
    ${lsFoodRow([['🍞', 'Ekmek'], ['🍝', 'Makarna'], ['🍚', 'Pirinç'], ['🥔', 'Patates'], ['🍯', 'Bal']], 290, 2)}
    ${lsLabel(400, 415, '🧠 Beynimizin enerji kaynağı', 3)}`),

  'fats': () => lsSvg(`${lsLabel(400, 50, 'YAĞLAR', 0)}${lsPill(400, 100, '⚡ Enerji verir', '#e8832f', 0)}
    ${lsLabel(150, 170, '📦 Enerji deposu', 1)}${lsLabel(400, 170, '❄️ Soğuktan korur', 2)}${lsLabel(650, 170, '🛡️ Organları korur', 2, 'ls-d1')}
    ${lsFoodRow([['🧈', 'Tereyağı'], [lsBottle('#9bab3a'), 'Zeytinyağı'], [lsBottle('#f4d03f'), 'Ayçiçek yağı'], ['🥜', 'Kuruyemiş']], 295, 3)}
    ${lsPill(400, 415, '⚠️ Fazla tüketmemeliyiz', '#d9472b', 3, 'ls-d4')}`),

  'proteins': () => lsSvg(`${lsLabel(400, 50, 'PROTEİNLER', 0)}${lsPill(400, 100, '🧱 Yapıcı ve onarıcı', '#d9472b', 0)}
    ${lsLabel(150, 170, '📏 Büyüme', 1)}${lsLabel(390, 170, '💇 Saç ve tırnak', 1, 'ls-d1')}${lsLabel(640, 170, '🩹 İyileşme', 2)}
    ${lsFoodRow([['🥩', 'Et'], ['🍗', 'Tavuk'], ['🐟', 'Balık'], ['🥚', 'Yumurta'], ['🧀', 'Peynir'], ['🥛', 'Süt']], 295, 3)}
    ${lsLabel(400, 415, 'Nohut, mercimek, kuru fasulye de', 3, 'ls-d5')}`),

  'vitamins': () => lsSvg(`${lsLabel(400, 50, 'VİTAMİNLER', 0)}${lsPill(400, 100, '⚙️ Düzenleyici', '#1f9a73', 0)}
    <g ${lsStep(1, 'ls-pop')}>${lsKid(200, 330, 1.2, '#2eaa83')}${lsEmoji(200, 205, '🛡️', 54)}${lsEmoji(85, 200, '🦠', 40)}${lsEmoji(320, 260, '🦠', 34)}${lsEmoji(90, 320, '🦠', 30)}
      <text x="200" y="420" text-anchor="middle" class="ls-cap">Hastalıklara karşı korur</text></g>
    <g ${lsStep(2, 'ls-rise')}><rect x="430" y="150" width="320" height="200" rx="26" class="ls-card"/>
      ${[['🍎', 480, 205], ['🍊', 560, 205], ['🍌', 640, 205], ['🍇', 710, 205], ['🥕', 480, 290], ['🥦', 560, 290], ['🍅', 640, 290], ['🍋', 710, 290]].map(([e, x, y]) => lsEmoji(x, y, e, 46)).join('')}</g>
    ${lsLabel(590, 400, '🌈 Her gün farklı renkler', 3)}`),

  'water-minerals': () => lsSvg(`${lsLabel(400, 50, 'SU VE MİNERALLER', 0)}${lsPill(400, 100, '⚙️ Düzenleyici', '#1f9a73', 0)}
    <g ${lsStep(1, 'ls-pop')}>${lsEmoji(200, 235, '💧', 110)}<text x="200" y="345" text-anchor="middle" class="ls-cap">Vücudumuzun büyük</text><text x="200" y="372" text-anchor="middle" class="ls-cap">bölümü sudur</text></g>
    ${lsPill(580, 170, 'Kalsiyum', '#5b7fa6', 2)}${lsPill(580, 220, 'Demir', '#5b7fa6', 2, 'ls-d1')}${lsPill(580, 270, 'Potasyum', '#5b7fa6', 2, 'ls-d2')}
    <g ${lsStep(3, 'ls-rise')}>${lsEmoji(490, 350, '🦴', 44)}${lsEmoji(560, 350, '🦷', 44)}${lsEmoji(630, 350, '💪', 44)}<text x="560" y="410" text-anchor="middle" class="ls-small">kemik, diş, kas ve organlar</text></g>`),

  'water-in-food': () => lsSvg(`${lsLabel(400, 50, '🔍 Su nerede?', 0)}
    <g ${lsStep(1, 'ls-rise')}>${lsEmoji(150, 150, '🍊', 64)}<g class="ls-rain"><circle cx="140" cy="205" r="6" fill="#4fb3e8"/><circle cx="160" cy="215" r="5" fill="#4fb3e8"/><circle cx="150" cy="200" r="4" fill="#4fb3e8"/></g>
      <path d="M120 240 H180 L174 300 H126 Z" fill="#d6efff" stroke="#7fb6d6" stroke-width="4"/><rect x="128" y="270" width="45" height="26" fill="#ffb74d" opacity=".8"/><text x="150" y="340" text-anchor="middle" class="ls-small">sıkınca su çıkar</text></g>
    <g ${lsStep(2, 'ls-rise')}>${lsEmoji(355, 165, '🍇', 60)}<text x="410" y="175" text-anchor="middle" font-size="32">➜</text>
      <circle cx="452" cy="158" r="8" fill="#6b3b2a"/><circle cx="466" cy="170" r="8" fill="#5e3324"/><circle cx="450" cy="178" r="8" fill="#6b3b2a"/>${lsEmoji(410, 250, '💨', 34)}<text x="405" y="340" text-anchor="middle" class="ls-small">kuruyunca küçülür</text></g>
    <g ${lsStep(3, 'ls-rise')}>${lsEmoji(650, 160, '🥗', 64)}<ellipse cx="650" cy="230" rx="78" ry="16" fill="#fff" stroke="#c9d6cd" stroke-width="4"/><ellipse cx="650" cy="232" rx="44" ry="7" fill="#4fb3e8"/><text x="650" y="340" text-anchor="middle" class="ls-small">dibinde su birikir</text></g>
    <g ${lsStep(4, 'ls-pop')}>${lsEmoji(200, 398, '🍞', 40)}${lsEmoji(260, 398, '🍚', 40)}${lsEmoji(320, 398, '💧', 30)}</g>${lsLabel(540, 408, 'Kuru besinlerde bile su var', 4)}`),

  'minerals-everywhere': () => lsSvg(`${lsLabel(400, 50, 'Mineraller her besinde', 0)}
    <rect x="0" y="330" width="800" height="120" fill="#9c7b4f"/>
    <path d="M180 330 V220" stroke="#4f9a4a" stroke-width="8"/><path d="M180 270 Q140 240 130 250 Q150 280 180 280 Z M180 250 Q220 215 232 228 Q214 262 180 262 Z" fill="#6fbf73"/>
    <g ${lsStep(1)}><path d="M180 330 L162 370 M180 330 L182 382 M180 330 L203 368" stroke="#e8d7b0" stroke-width="4" stroke-linecap="round"/>
      ${[[120, 350], [240, 358], [150, 385], [215, 390], [100, 372], [262, 378]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="7" fill="${['#f2c94c', '#bdc3c7', '#e67e22'][i % 3]}"/>`).join('')}
      <path d="M150 330 V300 M150 300 l-8 10 M150 300 l8 10" stroke="#fff" stroke-width="4" fill="none"/>${lsLabel(190, 125, 'Kökler mineralleri alır', 1)}</g>
    <g ${lsStep(2, 'ls-pop')}><text x="300" y="270" text-anchor="middle" font-size="40">➜</text>${lsEmoji(420, 270, '🐄', 84)}<text x="530" y="270" text-anchor="middle" font-size="40">➜</text>${lsKid(640, 290, 1)}</g>
    ${lsLabel(400, 425, 'Su ve mineraller bütün besinlerde', 3)}`),

  'nutrient-summary': () => lsSummary([['⚡', 'Karbonhidrat ve yağ|enerji verir'], ['🧱', 'Proteinler yapıcı|ve onarıcıdır'], ['🛡️', 'Vitamin, su, mineral|düzenleyicidir'], ['💧', 'Su ve mineraller|her besinde var']], 'Hazırsan mini teste geçelim!'),

  /* Dengeli ve Sağlıklı Beslenme */
  'two-lunches': () => lsSvg(`${lsLabel(400, 50, 'Öğle yemeği', 0)}
    ${lsTray(200, 100, ['🍟', '🍔', '🥤'], lsStep(1, 'ls-rise'))}${lsTray(600, 100, ['🍲', '🍗', '🍚', '🥗', '🥛'], lsStep(2, 'ls-rise'))}
    ${lsKid(200, 375, 1, '#e25d3f')}${lsKid(600, 375, 1, '#2eaa83', '#8a4b2a')}
    <text x="200" y="440" text-anchor="middle" class="ls-label">Can</text><text x="600" y="440" text-anchor="middle" class="ls-label">Ece</text>
    <g ${lsStep(3, 'ls-pop')}><text x="400" y="330" text-anchor="middle" class="ls-big">?</text></g>`),

  'balanced-plate': () => lsSvg(`${lsLabel(400, 50, 'Dengeli beslenme', 0)}
    <g ${lsStep(1, 'ls-pop')}><circle cx="230" cy="255" r="135" fill="#fff" stroke="#c9d6cd" stroke-width="6"/><path d="M230 120 V390 M95 255 H365" stroke="#e3ebe5" stroke-width="4"/>
      ${lsEmoji(180, 205, '🍞', 52)}${lsEmoji(282, 205, '🥦', 52)}${lsEmoji(180, 305, '🍗', 52)}${lsEmoji(282, 305, '🍎', 52)}${lsEmoji(390, 360, '🥛', 46)}</g>
    <g ${lsStep(2, 'ls-pop')}><text x="590" y="165" text-anchor="middle" font-size="34">🍞 = 🍬 = 🧈</text>${lsCross(590, 155, 190)}<text x="590" y="205" text-anchor="middle" class="ls-small">eşit miktarda değil</text></g>
    <g ${lsStep(3, 'ls-pop')}><text x="590" y="270" text-anchor="middle" font-size="34">🍝 🍝 🍝</text>${lsCross(590, 260, 150)}<text x="590" y="310" text-anchor="middle" class="ls-small">tek çeşit yetmez</text></g>
    <g ${lsStep(4, 'ls-pop')}><text x="590" y="370" text-anchor="middle" font-size="34">🧒 🏃 ⚽</text><text x="590" y="412" text-anchor="middle" class="ls-small">yaşa ve harekete göre</text></g>`),

  'food-pyramid': () => {
    // Apex (300, 70), base from x 60 to 540 at y 420; four layers from the bottom up.
    const half = y => (y - 70) / 350 * 240, ys = [420, 332.5, 245, 157.5, 70];
    const layer = (i, color) => `<path ${lsStep(i + 1, 'ls-rise')} d="M${300 - half(ys[i])} ${ys[i]} H${300 + half(ys[i])} L${300 + half(ys[i + 1])} ${ys[i + 1]} H${300 - half(ys[i + 1])} Z" fill="${color}" stroke="#fff" stroke-width="4"/>`;
    const foods = [['🍞🍝🍚', 380, 38], ['🥦🍎🥕', 292, 34], ['🍗🥚🥛🧀', 205, 28], ['🍰', 125, 30]];
    return lsSvg(`<path d="M300 70 L540 420 H60 Z" fill="none" stroke="#9fb6c6" stroke-width="4" stroke-dasharray="12 10"/>
      ${['#f2c94c', '#7ccf6b', '#8ec5ff', '#d7a6e0'].map((c, i) => layer(i, c)).join('')}
      ${foods.map(([e, y, size], i) => `<text ${lsStep(i + 1, 'ls-pop ls-d1')} x="300" y="${y}" text-anchor="middle" dominant-baseline="central" font-size="${size}">${e}</text>`).join('')}
      ${lsLabel(660, 50, 'Besin piramidi', 0)}
      ${lsLabel(660, 385, '⬇ En çok: tahıllar', 1)}${lsLabel(660, 297, 'Sebze ve meyve', 2)}${lsLabel(660, 210, 'Et ve süt ürünleri', 3)}${lsLabel(660, 125, '⬆ En az: yağ, şeker', 4)}`);
  },

  'lunch-answer': () => lsSvg(`${lsLabel(400, 50, 'Hangisi dengeli?', 0)}
    ${lsTray(200, 90, ['🍟', '🍔', '🥤'])}${lsTray(600, 90, ['🍲', '🍗', '🍚', '🥗', '🥛'])}
    <g ${lsStep(1, 'ls-pop')}><circle cx="735" cy="95" r="30" fill="#2eaa83"/><path d="M720 95 l10 11 l20 -22" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round"/></g>${lsLabel(600, 265, 'Ece dengeli beslendi', 1)}
    ${lsPill(200, 265, '⚠️ Yağ ve şeker çok', '#d9472b', 2)}
    <g ${lsStep(3, 'ls-rise')}><rect x="90" y="310" width="290" height="110" rx="20" class="ls-card"/><text x="235" y="365" text-anchor="middle" font-size="40">🍟 ➜ 🥔</text><text x="235" y="405" text-anchor="middle" class="ls-small">kızartma yerine haşlama, fırın</text></g>
    <g ${lsStep(3, 'ls-rise ls-d1')}><rect x="420" y="310" width="290" height="110" rx="20" class="ls-card"/><text x="565" y="365" text-anchor="middle" font-size="40">🥤 ➜ 💧 🥛</text><text x="565" y="405" text-anchor="middle" class="ls-small">gazlı içecek yerine su, ayran</text></g>`),

  'obesity': () => lsSvg(`
    <g ${lsStep(0, 'ls-rise')}><rect x="90" y="60" width="260" height="120" rx="22" class="ls-card"/><text x="220" y="115" text-anchor="middle" font-size="40">🍔 🍩 🍟</text><text x="220" y="160" text-anchor="middle" class="ls-small">ihtiyaçtan fazla yemek</text></g>
    <text ${lsStep(0, 'ls-pop ls-d1')} x="400" y="135" text-anchor="middle" font-size="44" font-weight="900" fill="#3d4f63">+</text>
    <g ${lsStep(0, 'ls-rise ls-d2')}><rect x="450" y="60" width="260" height="120" rx="22" class="ls-card"/><text x="580" y="115" text-anchor="middle" font-size="40">🛋️ 📺</text><text x="580" y="160" text-anchor="middle" class="ls-small">az hareket</text></g>
    ${lsPill(400, 225, 'OBEZİTE: vücutta aşırı yağ birikmesi', '#d9472b', 1)}
    ${lsLabel(400, 275, '🏥 Başka hastalıklara yol açabilir', 2)}
    ${lsPill(150, 340, '🥗 Dengeli beslen', '#1f9a73', 3)}${lsPill(400, 340, '🍽️ Öğün atlama', '#1f9a73', 3, 'ls-d1')}${lsPill(650, 340, '⚽ Spor yap', '#1f9a73', 3, 'ls-d2')}
    <g ${lsStep(4, 'ls-pop')}><text x="230" y="410" text-anchor="middle" font-size="34">🍬 🥤 🍟</text></g>${lsLabel(520, 410, 'Az tüketilmeli', 4)}`),

  'food-waste': () => lsSvg(`${lsLabel(200, 50, 'Besin israfı', 0)}
    <g ${lsStep(0, 'ls-drop')}>${lsEmoji(160, 150, '🍞', 44)}${lsEmoji(215, 120, '🍎', 40)}${lsEmoji(250, 175, '🍌', 40)}</g>
    <rect x="125" y="230" width="150" height="170" rx="14" fill="#8fa3b3"/><rect x="110" y="212" width="180" height="22" rx="8" fill="#6e8496"/><path d="M165 260 V375 M200 260 V375 M235 260 V375" stroke="#6e8496" stroke-width="6" stroke-linecap="round"/>
    <g ${lsStep(1, 'ls-pop')}><circle cx="200" cy="310" r="70" fill="none" stroke="#e25d3f" stroke-width="10"/><line x1="152" y1="262" x2="248" y2="358" stroke="#e25d3f" stroke-width="10"/></g>
    ${lsLabel(560, 130, '🛒 İhtiyacın kadar al', 1)}${lsLabel(560, 190, '🍽️ Yiyebileceğin kadar koy', 1, 'ls-d1')}
    ${lsLabel(560, 270, '🍞 Bayat ekmeği değerlendir', 2)}${lsLabel(560, 350, '❄️ Artanı dolapta sakla', 3)}`),

  'fresh-natural': () => lsSvg(`${lsLabel(400, 50, 'Taze ve doğal', 0)}
    <g ${lsStep(1, 'ls-rise')}><rect x="50" y="90" width="330" height="180" rx="24" class="ls-card"/><text x="215" y="132" text-anchor="middle" class="ls-label">🌱 Doğal besinler</text>
      ${['🍅', '🥕', '🍎', '🥬'].map((e, i) => lsEmoji(110 + i * 70, 205, e, 46)).join('')}</g>
    <g ${lsStep(2, 'ls-rise')}><rect x="420" y="90" width="330" height="180" rx="24" class="ls-card"/><text x="585" y="132" text-anchor="middle" class="ls-label">📅 Mevsiminde tüket</text>
      ${['🌸', '☀️', '🍂', '❄️'].map((e, i) => lsEmoji(480 + i * 70, 180, e, 34)).join('')}
      <g ${lsStep(3, 'ls-pop')}><text x="510" y="240" text-anchor="middle" class="ls-small">🍓 yaz başında</text><text x="670" y="240" text-anchor="middle" class="ls-small">🍊 kışın</text></g></g>
    <g ${lsStep(4, 'ls-pop')}>${lsEmoji(170, 360, '🏭', 56)}<text x="245" y="370" text-anchor="middle" font-size="34">➜</text>${lsEmoji(320, 360, '📦', 52)}</g>${lsLabel(580, 368, 'Doğallığını kaybeder', 4)}`),

  'packaged-food': () => lsSvg(`
    <g ${lsStep(0, 'ls-rise')}><path d="M110 140 L150 100 H270 L310 140 Z" fill="#f0d79a"/><rect x="110" y="140" width="200" height="270" rx="10" fill="#fff7e0" stroke="#c9a24a" stroke-width="4"/>
      <text x="210" y="185" text-anchor="middle" class="ls-label">KRAKER</text>${lsEmoji(210, 235, '🍘', 44)}
      <text x="128" y="290" class="ls-small" style="font-size:13px">İçindekiler: un, yağ, tuz,</text><text x="128" y="308" class="ls-small" style="font-size:13px">renklendirici, koruyucu</text>
      <text x="210" y="360" text-anchor="middle" class="ls-cap">SKT 12.12.2026</text></g>
    <g ${lsStep(3, 'ls-pop')}><circle cx="282" cy="390" r="24" fill="#fff" stroke="#c0392b" stroke-width="4"/><text x="282" y="396" text-anchor="middle" font-size="14" font-weight="900" fill="#c0392b">TSE</text></g>
    ${lsLabel(210, 70, '🛒 Paketli besin', 0)}
    <rect ${lsStep(1)} x="122" y="334" width="176" height="38" rx="10" fill="none" stroke="#e25d3f" stroke-width="5" stroke-dasharray="10 6"/>
    ${lsLabel(575, 130, '📅 Son kullanma tarihi', 1)}${lsLabel(575, 200, '📦 Ambalaj sağlam olmalı', 2)}${lsLabel(575, 270, '✅ Onay işareti', 3)}
    <rect ${lsStep(4)} x="120" y="276" width="190" height="40" rx="8" fill="none" stroke="#e8832f" stroke-width="4" stroke-dasharray="8 6"/>
    ${lsLabel(575, 345, 'Katkı: renk, tat, saklama', 4)}${lsPill(575, 405, '🌿 Doğal olanı seç', '#1f9a73', 4, 'ls-d2')}`),

  'storage-clean': () => lsSvg(`${lsLabel(400, 50, 'Doğru saklama', 0)}
    <rect x="100" y="90" width="200" height="330" rx="20" fill="#eef6fb" stroke="#9fb6c6" stroke-width="5"/><line x1="100" y1="175" x2="300" y2="175" stroke="#9fb6c6" stroke-width="5"/>
    <rect x="270" y="110" width="10" height="44" rx="4" fill="#9fb6c6"/><rect x="270" y="195" width="10" height="60" rx="4" fill="#9fb6c6"/>
    <path d="M115 280 H285 M115 350 H285" stroke="#c9d9e4" stroke-width="4"/>
    <g ${lsStep(1, 'ls-pop')}>${lsEmoji(150, 245, '🥛', 44)}${lsEmoji(220, 245, '🧀', 40)}${lsEmoji(185, 318, '🥩', 42)}</g>
    <g ${lsStep(2, 'ls-pop')}>${lsEmoji(150, 132, '❄️', 40)}${lsEmoji(215, 132, '🐟', 36)}</g>
    ${lsLabel(570, 150, '❄️ Taze ve temiz dondur', 2)}${lsLabel(570, 205, 'Çözüleni tekrar dondurma', 2, 'ls-d1')}
    <g ${lsStep(3, 'ls-rise')}>${lsEmoji(480, 300, '🍎', 46)}${lsEmoji(545, 300, '💧', 40)}${lsEmoji(610, 300, '🧼', 44)}${lsEmoji(675, 300, '👐', 44)}</g>${lsLabel(570, 380, 'Yıka, sonra ye!', 3)}`),

  'balanced-summary': () => lsSummary([['🍽️', 'Her gruptan|ihtiyacın kadar'], ['🔺', 'Tahıl en çok,|yağ ve şeker en az'], ['⚖️', 'Obeziteye ve|israfa dikkat'], ['🌿', 'Taze, doğal,|mevsiminde seç']], 'Hazırsan mini teste geçelim!'),
};

function lessonSceneSvg(visual) {
  return (LESSON_SCENES[visual] || LESSON_SCENES.summary)();
}
