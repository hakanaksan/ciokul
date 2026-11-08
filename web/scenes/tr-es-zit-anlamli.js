/* Scenes for the video lesson "Eş Anlamlı ve Zıt Anlamlı Kelimeler". Loaded when the lesson opens (see loadLessonScenes in lessons.js). */
{
  const T = (x, y, text, size = 24, extra = '', anchor = 'middle') => `<text x="${x}" y="${y}" text-anchor="${anchor}" class="ls-cap" style="font-size:${size}px" ${extra}>${text}</text>`;
  // Parts in [brackets] are coloured. With ghost the other parts are invisible: drawn over the same
  // sentence, it colours words later without moving anything.
  const rich = (x, y, src, size, color, ghost = false, anchor = 'middle') => `<text x="${x}" y="${y}" text-anchor="${anchor}" class="ls-cap" style="font-size:${size}px">${src.split(/(\[[^\]]*\])/).filter(Boolean)
    .map(p => p[0] === '[' ? `<tspan style="fill:${color}">${p.slice(1, -1)}</tspan>` : `<tspan${ghost ? ' style="fill-opacity:0"' : ''}>${p}</tspan>`).join('')}</text>`;
  const box = (x, y, w, h, extra = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" class="ls-card" ${extra}/>`;
  // A word pair card centred on cx; the sign between the words is coloured.
  const pair = (cx, y, w, h, a, sign, b, step, color, cls = '', icon = '') => `<g ${lsStep(step, 'ls-rise ' + cls)}>${box(cx - w / 2, y, w, h)}
    ${icon ? (typeof icon === 'function' ? icon(cx - w / 2 + 40, y + h / 2) : lsEmoji(cx - w / 2 + 40, y + h / 2, icon, 34)) : ''}
    ${rich(cx + (icon ? 22 : 0), y + h / 2 + 9, `${a} [${sign}] ${b}`, 25, color)}</g>`;
  const dot = color => (x, y) => `<circle cx="${x}" cy="${y}" r="15" fill="${color}" stroke="#3d4f63" stroke-width="2"/>`;
  const ok = (x, y) => `<circle cx="${x}" cy="${y}" r="17" fill="#2eaa83"/><path d="M${x - 8} ${y} l6 7 l11 -13" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  const no = (x, y) => `<circle cx="${x}" cy="${y}" r="17" fill="#e25d3f"/><path d="M${x - 7} ${y - 7} l14 14 M${x + 7} ${y - 7} l-14 14" stroke="#fff" stroke-width="5" stroke-linecap="round"/>`;
  const bubble = (x, y, w, h, tx, ty, text, size, step) => `<g ${lsStep(step, 'ls-pop')}><path d="M${x + w / 2 - 18} ${y + h - 2} L${tx} ${ty} L${x + w / 2 + 18} ${y + h - 2} Z" fill="#fff" stroke="#08796e" stroke-width="3"/>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="22" fill="#fff" stroke="#08796e" stroke-width="3"/><rect x="${x + w / 2 - 16}" y="${y + h - 6}" width="32" height="8" fill="#fff"/>${T(x + w / 2, y + h / 2 + 9, text, size)}</g>`;
  const pencil = (x, y, len) => `<rect x="${x}" y="${y}" width="${len}" height="24" rx="4" fill="#f2c94c" stroke="#c99a1e" stroke-width="2"/><rect x="${x}" y="${y}" width="16" height="24" rx="4" fill="#f29e9e"/><path d="M${x + len} ${y} L${x + len + 26} ${y + 12} L${x + len} ${y + 24} Z" fill="#f4dcae" stroke="#c99a1e" stroke-width="2"/><path d="M${x + len + 18} ${y + 8} L${x + len + 26} ${y + 12} L${x + len + 18} ${y + 16} Z" fill="#3d4f63"/>`;

  Object.assign(LESSON_SCENES, {
    'tr-es-zit-anlamli-intro': () => lsSvg(`
      ${lsKid(170, 340, 1.4, '#8a6d4f', '#d4d4d4')}<path d="M156 267 Q170 259 184 267" stroke="#d4d4d4" stroke-width="5" fill="none" stroke-linecap="round"/>
      <text x="170" y="436" text-anchor="middle" class="ls-label">Dedem</text>
      ${lsKid(640, 350, 1.2, '#4c8be6')}
      ${bubble(40, 50, 300, 72, 175, 205, 'Mektebe geç kalma!', 25, 0)}
      ${bubble(490, 120, 290, 66, 640, 236, 'Mektep ne demek?', 24, 1)}
      <g ${lsStep(2, 'ls-pop')}>${box(270, 200, 260, 104)}${lsEmoji(400, 236, '🏫', 44)}${rich(400, 290, 'MEKTEP [=] OKUL', 26, '#e25d3f')}</g>
      ${lsLabel(400, 415, 'Eş anlamlı ve zıt anlamlı', 3)}`),

    'tr-es-zit-anlamli-es': () => lsSvg(`
      ${lsLabel(400, 50, 'EŞ ANLAMLI KELİMELER', 0)}
      ${lsPill(400, 102, 'Yazılışı farklı, anlamı aynı', '#1f9a73', 0)}
      ${pair(215, 140, 330, 80, 'okul', '=', 'mektep', 1, '#1f9a73', '', '🏫')}
      ${pair(585, 140, 330, 80, 'öğrenci', '=', 'talebe', 2, '#1f9a73', '', '🧒')}
      ${pair(215, 245, 330, 80, 'kelime', '=', 'sözcük', 3, '#1f9a73', '', '🔤')}
      ${pair(585, 245, 330, 80, 'cevap', '=', 'yanıt', 3, '#1f9a73', 'ls-d1', '💬')}
      ${lsLabel(400, 395, '🤝 Anlamdaş kelimeler de denir', 4)}`),

    'tr-es-zit-anlamli-es2': () => lsSvg(`
      ${lsLabel(400, 45, '👵 Büyüklerimizden duyarız', 0)}
      ${pair(215, 78, 330, 60, 'misafir', '=', 'konuk', 1, '#1f9a73')}
      ${pair(585, 78, 330, 60, 'vatan', '=', 'yurt', 1, '#1f9a73', 'ls-d1')}
      ${pair(215, 152, 330, 60, 'hediye', '=', 'armağan', 2, '#1f9a73')}
      ${pair(585, 152, 330, 60, 'ihtiyar', '=', 'yaşlı', 2, '#1f9a73', 'ls-d1')}
      ${pair(215, 226, 330, 60, 'kırmızı', '=', 'al', 3, '#1f9a73', '', dot('#e53935'))}
      ${pair(585, 226, 330, 60, 'siyah', '=', 'kara', 3, '#1f9a73', 'ls-d1', dot('#1b1b1b'))}
      <g ${lsStep(4, 'ls-rise')}>${box(150, 305, 500, 105)}${lsEmoji(200, 345, '🚩', 40)}${rich(425, 352, 'Bayrağımız [al] renklidir.', 30, '#e53935')}
        <text x="425" y="392" text-anchor="middle" class="ls-small">al = kırmızı</text></g>`),

    'tr-es-zit-anlamli-swap': () => lsSvg(`
      ${lsLabel(400, 50, '🔁 Kolay yol: yerine koy!', 0)}
      ${lsPill(400, 105, 'Anlam değişmiyorsa eş anlamlı', '#1f9a73', 1)}
      <g ${lsStep(2, 'ls-rise')}>${box(80, 140, 640, 70)}${rich(400, 185, '[Okul] yolunda [hızlı] bir [araç] gördüm.', 26, '#2f6fd6')}</g>
      <g ${lsStep(3, 'ls-drop')}><path d="M400 216 V242 M388 232 L400 246 L412 232" stroke="#3d4f63" stroke-width="5" fill="none" stroke-linecap="round"/></g>
      <g ${lsStep(3, 'ls-rise ls-d1')}>${box(80, 252, 640, 70)}${rich(400, 297, '[Mektep] yolunda [süratli] bir [vasıta] gördüm.', 26, '#1f9a73')}</g>
      ${lsLabel(400, 380, '✅ Anlam değişmedi: eş anlamlı', 4)}`),

    'tr-es-zit-anlamli-zit': () => lsSvg(`
      ${lsLabel(400, 45, 'ZIT ANLAMLI KELİMELER', 0)}
      ${lsPill(400, 97, 'Anlamca birbirinin karşıtı', '#d9472b', 1)}
      <g ${lsStep(2, 'ls-rise')}>${box(150, 125, 500, 100)}${pencil(180, 145, 220)}${pencil(520, 145, 60)}
        ${T(300, 205, 'uzun', 24)}${T(560, 205, 'kısa', 24)}${T(470, 165, '↔', 30, 'fill="#d9472b"')}</g>
      ${pair(215, 245, 330, 70, 'sıcak', '↔', 'soğuk', 3, '#d9472b', '', '☀️')}
      ${pair(585, 245, 330, 70, 'eski', '↔', 'yeni', 3, '#d9472b', 'ls-d1')}
      ${pair(215, 335, 330, 70, 'erken', '↔', 'geç', 4, '#d9472b', '', '⏰')}
      ${pair(585, 335, 330, 70, 'kolay', '↔', 'zor', 4, '#d9472b', 'ls-d1')}`),

    'tr-es-zit-anlamli-zit2': () => {
      const sentence = 'Elindeki [kuru] bez ile [ıslak] sıraları siliyordu.';
      return lsSvg(`
      ${lsLabel(400, 45, 'Zıt anlamlılar aynı cümlede', 0)}
      <g ${lsStep(1, 'ls-rise')}>${box(40, 80, 720, 74)}${rich(400, 126, sentence.replace(/[[\]]/g, ''), 25, '#22392f')}</g>
      <g ${lsStep(2)}>${rich(400, 126, sentence, 25, '#d9472b', true)}</g>
      ${lsPill(400, 195, 'kuru ↔ ıslak', '#d9472b', 2, 'ls-d1')}
      ${lsLabel(150, 262, 'cimri ↔ cömert', 3)}${lsLabel(400, 262, 'ucuz ↔ pahalı', 3, 'ls-d1')}${lsLabel(650, 262, 'gerçek ↔ hayal', 3, 'ls-d2')}
      ${lsLabel(250, 332, 'üretici ↔ tüketici', 4)}${lsLabel(560, 332, 'tekil ↔ çoğul', 4, 'ls-d1')}
      <g ${lsStep(3, 'ls-pop ls-d3')}>${lsEmoji(250, 400, '💰', 34)}${lsEmoji(400, 400, '🛒', 34)}${lsEmoji(550, 400, '💭', 34)}</g>`);
    },

    'tr-es-zit-anlamli-dikkat': () => lsSvg(`
      ${lsPill(400, 45, '⚠️ DİKKAT!', '#d9472b', 0)}
      ${lsLabel(400, 100, 'Olumsuz yapmak zıt anlam değildir', 1)}
      <g ${lsStep(2, 'ls-rise')}>${box(40, 132, 340, 72)}${no(80, 168)}${rich(225, 177, 'gelmek [↔] gelmemek', 24, '#d9472b')}</g>
      <g ${lsStep(2, 'ls-rise ls-d1')}>${box(420, 132, 340, 72)}${ok(460, 168)}${rich(605, 177, 'gelmek [↔] gitmek', 24, '#1f9a73')}</g>
      <g ${lsStep(3, 'ls-rise')}>${box(40, 222, 340, 72)}${no(80, 258)}${rich(225, 267, 'güzel [↔] güzel değil', 24, '#d9472b')}</g>
      <g ${lsStep(3, 'ls-rise ls-d1')}>${box(420, 222, 340, 72)}${ok(460, 258)}${rich(605, 267, 'güzel [↔] çirkin', 24, '#1f9a73')}</g>
      ${lsLabel(400, 340, 'Bazı kelimelerin zıt anlamlısı yok', 4)}
      <g ${lsStep(4, 'ls-pop ls-d1')}>${T(270, 405, 'masa ↔ ❓', 28)}${T(530, 405, 'kalem ↔ ❓', 28)}</g>`),

    'tr-es-zit-anlamli-baglam': () => {
      const swatch = (x, y) => `<rect x="${x - 26}" y="${y - 20}" width="24" height="40" rx="6" fill="#9fd3ff"/><rect x="${x + 2}" y="${y - 20}" width="24" height="40" rx="6" fill="#1d4f91"/>`;
      const card = (x, y, icon, top, bottom, step, cls = '') => `<g ${lsStep(step, 'ls-rise ' + cls)}>${box(x, y, 345, 130)}
        ${typeof icon === 'function' ? icon(x + 50, y + 65) : lsEmoji(x + 50, y + 65, icon, 46)}
        ${T(x + 100, y + 55, top, 25, '', 'start')}${rich(x + 100, y + 98, bottom, 23, '#d9472b', false, 'start')}</g>`;
      return lsSvg(`
      ${lsLabel(400, 45, 'Cümleye göre değişir', 0)}
      ${card(40, 78, '🚪', 'açık kapı', '[↔] kapalı kapı', 1)}
      ${card(415, 78, swatch, 'açık mavi', '[↔] koyu mavi', 2)}
      ${card(40, 228, '🧽', 'kuru bez', '[↔] ıslak bez', 3)}
      ${card(415, 228, '🌿', 'kuru dal', '[↔] yaş dal', 3, 'ls-d1')}
      ${lsLabel(400, 410, '🔍 Cümledeki anlamına bak', 4)}`);
    },

    'tr-es-zit-anlamli-sesli': () => lsSvg(`
      ${lsLabel(400, 42, 'Eş sesli (sesteş) kelimeler', 0)}
      ${lsPill(400, 92, 'Yazılışı aynı, anlamı farklı', '#e8832f', 1)}
      <g ${lsStep(2, 'ls-pop')}>${T(125, 200, 'yüz', 60, 'fill="#e8832f"')}</g>
      ${[['💯', 'sayı', 230], ['🙂', 'insan yüzü', 410], ['🏊', 'yüzmek', 590]].map(([e, n, x], i) =>
        `<g ${lsStep(2, 'ls-rise ls-d' + (i + 1))}>${box(x, 122, 165, 112)}${lsEmoji(x + 82, 162, e, 40)}${T(x + 82, 216, n, 20)}</g>`).join('')}
      <g ${lsStep(3, 'ls-rise')}>${box(60, 250, 680, 70)}${rich(400, 295, 'Yeni [yaşımı] [yaş] pastayla kutladım.', 27, '#e8832f')}</g>
      ${lsLabel(210, 358, '🎂 yaş: kaç yıllık olduğumuz', 3, 'ls-d1')}${lsLabel(590, 358, '🍰 yaş pasta: kremalı pasta', 3, 'ls-d2')}
      ${lsPill(210, 414, 'Eş anlamlı: yazılış farklı', '#1f9a73', 4)}${lsPill(590, 414, 'Eş sesli: yazılış aynı', '#e8832f', 4, 'ls-d1')}`),

    'tr-es-zit-anlamli-summary': () => lsSummary([['🤝', 'Eş anlamlı: yazılış|farklı, anlam aynı'], ['↔️', 'Zıt anlamlı: anlamı|birbirinin karşıtı'], ['⚠️', 'Olumsuz yapmak|zıt anlam değildir'], ['🔤', 'Eş sesli: yazılış|aynı, anlam farklı']], 'Hazırsan mini teste geçelim!'),
  });
}
