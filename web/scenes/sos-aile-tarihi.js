/* Scenes for the video lesson "Aile Tarihimi Araştırıyorum". Loaded when the lesson opens (see loadLessonScenes in lessons.js). */
{
  const font = 'font-family="Segoe UI,Arial,sans-serif"';
  // A wooden chest, 220×120 in its own units, top-left at (x, y).
  const chest = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">
    <path d="M0 40 Q0 0 40 0 H180 Q220 0 220 40 Z" fill="#b5652f"/><rect y="40" width="220" height="80" rx="6" fill="#a0522d"/>
    <rect x="30" y="0" width="18" height="120" fill="#d9a441"/><rect x="172" y="0" width="18" height="120" fill="#d9a441"/>
    <line x1="0" y1="40" x2="220" y2="40" stroke="#7a3d1f" stroke-width="4"/><rect x="98" y="30" width="24" height="30" rx="4" fill="#e8c07a" stroke="#a8862f" stroke-width="2"/></g>`;
  // A pocket watch with its chain.
  const watch = (x, y, r) => `<g><path d="M${x} ${y - r - 8} q${r * 0.8} ${-r * 0.6} ${r * 1.5} ${-r * 0.1}" stroke="#a8862f" stroke-width="3" fill="none"/>
    <rect x="${x - 6}" y="${y - r - 12}" width="12" height="12" rx="3" fill="#d9a441"/><circle cx="${x}" cy="${y}" r="${r}" fill="#f2d27a" stroke="#a8862f" stroke-width="4"/>
    <circle cx="${x}" cy="${y}" r="${r * 0.78}" fill="#fffbe8"/><path d="M${x} ${y} V${y - r * 0.55} M${x} ${y} L${x + r * 0.4} ${y + r * 0.2}" stroke="#3d4f63" stroke-width="3" stroke-linecap="round"/></g>`;
  // An old black-and-white photograph of two people.
  const photo = (x, y, w, h, turn = 0) => `<g transform="rotate(${turn} ${x + w / 2} ${y + h / 2})"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#fff" stroke="#c9b28f" stroke-width="2"/>
    <rect x="${x + 6}" y="${y + 6}" width="${w - 12}" height="${h - 20}" fill="#9a9187"/>
    ${[0.35, 0.65].map(k => `<circle cx="${x + w * k}" cy="${y + h * 0.35}" r="${w * 0.09}" fill="#4f4a44"/><rect x="${x + w * k - w * 0.12}" y="${y + h * 0.48}" width="${w * 0.24}" height="${h * 0.3}" rx="6" fill="#4f4a44"/>`).join('')}</g>`;
  const person = (x, y, e, name, size = 50) => `${lsEmoji(x, y, e, size)}<text x="${x}" y="${y + size / 2 + 26}" text-anchor="middle" class="ls-small">${name}</text>`;
  const mark = (x, y, ok) => `<circle cx="${x}" cy="${y}" r="16" fill="${ok ? '#2eaa83' : '#e25d3f'}"/>${ok
    ? `<path d="M${x - 8} ${y} l6 7 l11 -13" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/>`
    : `<path d="M${x - 7} ${y - 7} l14 14 M${x + 7} ${y - 7} l-14 14" stroke="#fff" stroke-width="5" stroke-linecap="round"/>`}`;
  // Wrong (left, red) and right (right, green) way side by side.
  const compare = (y, h, bad, good, n) => [[50, bad, false], [410, good, true]].map(([x, [icons, text], ok], i) =>
    `<g ${lsStep(n, 'ls-rise' + (i ? ' ls-d1' : ''))}><rect x="${x}" y="${y}" width="340" height="${h}" rx="18" fill="#fff" stroke="${ok ? '#2eaa83' : '#e25d3f'}" stroke-width="3"/>
      <text x="${x + 52}" y="${y + h / 2}" text-anchor="middle" dominant-baseline="central" font-size="30">${icons}</text>
      <text x="${x + 104}" y="${y + h / 2 + 6}" class="ls-small">${text}</text>${mark(x + 314, y + h / 2, ok)}</g>`).join('');

  Object.assign(LESSON_SCENES, {
    'sos-aile-tarihi-intro': () => lsSvg(`${lsLabel(400, 50, 'Anneannemin sandığı', 0)}
      ${lsKid(140, 340, 1.2, '#2eaa83', '#8a4b2a')}${chest(300, 250)}
      <g ${lsStep(1, 'ls-rise')}>${photo(300, 140, 90, 80, -8)}${lsEmoji(445, 160, '✉️', 50)}${watch(560, 190, 34)}</g>
      <g ${lsStep(2, 'ls-pop')}><circle cx="200" cy="150" r="42" fill="#fff" stroke="#dbe6de" stroke-width="3"/><circle cx="168" cy="200" r="8" fill="#fff" stroke="#dbe6de" stroke-width="3"/>
        <text x="200" y="168" text-anchor="middle" font-size="52" font-weight="900" fill="#e25d3f">?</text></g>
      ${lsLabel(400, 415, '🌳 Aile tarihi çalışması', 3)}`),

    'sos-aile-tarihi-tree': () => lsSvg(`<g ${lsStep(0)}><ellipse cx="400" cy="200" rx="370" ry="170" fill="#dff3e0"/><rect x="382" y="300" width="36" height="150" fill="#b08a5a"/></g>
      <g ${lsStep(1, 'ls-rise')}>${person(330, 365, '👧', 'Ece')}${person(470, 365, '👦', 'kardeşi')}</g>
      <g ${lsStep(2, 'ls-rise')}><path d="M256 250 H544 M400 250 V320 H330 V338 M400 320 H470 V338" stroke="#8a6a3e" stroke-width="4" fill="none"/>${person(230, 250, '👩', 'Anne', 52)}${person(570, 250, '👨', 'Baba', 52)}</g>
      <g ${lsStep(3, 'ls-rise')}><path d="M137 120 H223 M180 120 V200 H230 V222 M577 120 H663 M620 120 V200 H570 V222" stroke="#8a6a3e" stroke-width="4" fill="none"/>
        ${person(110, 120, '👵', 'Anneanne')}${person(250, 120, '👴', 'Dede')}${person(550, 120, '👵', 'Babaanne')}${person(690, 120, '👴', 'Dede')}</g>
      ${lsLabel(400, 40, '🌳 Aile ağacı', 4)}`),

    'sos-aile-tarihi-topics': () => lsSvg(`${lsLabel(400, 45, 'Aile tarihinde neler var?', 0)}
      ${lsLabel(220, 105, '📍 Doğdukları yer', 0, 'ls-d1')}${lsLabel(580, 105, '🏠 Yaşadıkları yerler', 0, 'ls-d2')}
      ${lsLabel(150, 165, '🔧 Meslekler', 1)}${lsLabel(400, 165, '💍 Evlilikler', 1, 'ls-d1')}${lsLabel(650, 165, '🏫 Okullar', 1, 'ls-d2')}
      ${lsLabel(150, 225, '👶 Doğumlar', 2)}${lsLabel(400, 225, '🧳 Göçler', 2, 'ls-d1')}${lsLabel(650, 225, '⭐ Önemli olaylar', 2, 'ls-d2')}
      <g ${lsStep(3)}><line x1="60" y1="270" x2="740" y2="270" stroke="#c9d6cd" stroke-width="4" stroke-dasharray="10 8"/><text x="400" y="315" text-anchor="middle" class="ls-cap">4 çeşit kaynak</text></g>
      ${lsPill(115, 370, '🗣️ Sözlü', '#5b7fa6', 3, 'ls-d1')}${lsPill(305, 370, '✉️ Yazılı', '#e8832f', 3, 'ls-d2')}${lsPill(495, 370, '📷 Görsel', '#1f9a73', 3, 'ls-d3')}${lsPill(685, 370, '⌚ Nesneler', '#a0522d', 3, 'ls-d4')}`),

    'sos-aile-tarihi-oral': () => lsSvg(`${lsPill(400, 45, '🗣️ Sözlü kaynaklar', '#5b7fa6', 0)}
      ${lsEmoji(190, 235, '👴', 110)}${lsKid(610, 300, 1.1, '#e8832f')}
      <g ${lsStep(1, 'ls-pop')}><rect x="270" y="95" width="220" height="70" rx="22" fill="#fff" stroke="#dbe6de" stroke-width="3"/><path d="M290 162 L250 190 L318 164 Z" fill="#fff" stroke="#dbe6de" stroke-width="3"/><rect x="288" y="150" width="34" height="14" fill="#fff"/>
        <text x="380" y="137" text-anchor="middle" class="ls-small">Ben çocukken...</text></g>
      ${lsLabel(190, 330, '👴 Geçmişin canlı tanığı', 1)}
      <g ${lsStep(2, 'ls-pop')}>${lsEmoji(470, 280, '🎙️', 44)}</g>
      ${lsPill(400, 395, 'SÖZLÜ TARİH = büyüklerle görüşme', '#5b7fa6', 2)}
      ${lsLabel(640, 115, '⭐ En çok kullanılır', 3)}${lsLabel(640, 175, '💬 Anı ve atasözü', 4)}`),

    'sos-aile-tarihi-steps': () => {
      const rows = [['👵', 'Görüşülecek kişiyi belirle'], ['📅', 'Yeri ve zamanı belirle'], ['📝', 'Soruları ve araç gereçleri hazırla'], ['🎙️', 'Görüşmeyi yap ve kaydet'], ['✍️', 'Kayıtları yazıya geçir']];
      return lsSvg(`${lsLabel(400, 42, 'Sözlü tarih: adım adım', 0)}
        ${rows.map(([e, t], i) => { const y = 75 + i * 70;
          return `<g ${lsStep(i + 1, 'ls-rise')}><rect x="50" y="${y}" width="700" height="60" rx="16" class="ls-card"/><circle cx="90" cy="${y + 30}" r="20" fill="#08796e"/>
            <text x="90" y="${y + 37}" text-anchor="middle" font-size="20" font-weight="900" fill="#fff" ${font}>${i + 1}</text>${lsEmoji(145, y + 30, e, 32)}<text x="185" y="${y + 37}" class="ls-cap">${t}</text></g>`; }).join('')}`);
    },

    'sos-aile-tarihi-written': () => lsSvg(`
      <g ${lsStep(0, 'ls-rise')}><rect x="40" y="70" width="345" height="260" rx="24" class="ls-card"/></g>${lsPill(212, 70, '✉️ Yazılı kaynaklar', '#e8832f', 0)}
      ${[['✉️', 'mektup', 100, 160], ['📄', 'karne', 212, 160], ['📜', 'diploma', 325, 160], ['📘', 'nüfus cüzdanı', 140, 255], ['📒', 'anı defteri', 290, 255]].map(([e, n, x, y], i) =>
        `<g ${lsStep(1, 'ls-pop ls-d' + i)}>${lsEmoji(x, y, e, 44)}<text x="${x}" y="${y + 48}" text-anchor="middle" class="ls-small">${n}</text></g>`).join('')}
      <g ${lsStep(2, 'ls-rise')}><rect x="415" y="70" width="345" height="260" rx="24" class="ls-card"/></g>${lsPill(587, 70, '📷 Görsel kaynaklar', '#1f9a73', 2)}
      <g ${lsStep(3)}>${photo(435, 150, 80, 76, -6)}<text x="475" y="265" text-anchor="middle" class="ls-small">fotoğraf</text>
        ${lsEmoji(590, 190, '🖼️', 56)}<text x="590" y="265" text-anchor="middle" class="ls-small">resim</text>${lsEmoji(705, 190, '📼', 56)}<text x="705" y="265" text-anchor="middle" class="ls-small">video</text></g>
      ${lsLabel(400, 395, '📇 Kimlik kartı: anne adı, baba adı', 4)}`),

    'sos-aile-tarihi-objects': () => lsSvg(`${lsPill(400, 45, '⌚ Eski nesneler', '#a0522d', 0)}
      <rect x="60" y="200" width="680" height="14" rx="5" fill="#b08a5a"/><rect x="60" y="330" width="680" height="14" rx="5" fill="#b08a5a"/>
      <g ${lsStep(1, 'ls-rise')}>${watch(180, 150, 38)}<text x="180" y="240" text-anchor="middle" class="ls-small">cep saati</text>
        <g><rect x="340" y="120" width="120" height="78" rx="8" fill="#f7f1e3" stroke="#d6c7a8" stroke-width="3"/>${[0, 1, 2, 3, 4].map(i => `<circle cx="${352 + i * 24}" cy="198" r="7" fill="#f7f1e3" stroke="#d6c7a8" stroke-width="2"/>`).join('')}
          <path d="M360 140 L400 175 L440 140 M360 175 L400 140 L440 175" stroke="#e25d3f" stroke-width="3" fill="none"/></g><text x="400" y="240" text-anchor="middle" class="ls-small">örtü</text>
        ${chest(560, 132, 0.55)}<text x="620" y="240" text-anchor="middle" class="ls-small">çeyiz sandığı</text></g>
      <g ${lsStep(2, 'ls-rise')}>${lsEmoji(180, 292, '🏅', 56)}<text x="180" y="370" text-anchor="middle" class="ls-small">madalya</text>
        ${lsEmoji(400, 292, '🧸', 56)}<text x="400" y="370" text-anchor="middle" class="ls-small">oyuncak</text>
        <path d="M585 275 H655 L647 318 Q620 330 593 318 Z" fill="#c8733d" stroke="#8d4c22" stroke-width="3"/><rect x="578" y="268" width="84" height="10" rx="5" fill="#d98a52"/><path d="M655 285 q18 6 4 22" stroke="#8d4c22" stroke-width="4" fill="none"/>
        <text x="620" y="370" text-anchor="middle" class="ls-small">bakır kap</text></g>
      ${lsLabel(400, 415, 'Geçmişteki yaşamı anlatır', 3)}`),

    'sos-aile-tarihi-dikkat': () => lsSvg(`${lsLabel(400, 42, '⚠️ Dikkat!', 0)}
      ${compare(75, 80, ['👶🧒', 'kardeş, arkadaş'], ['👵👴', 'aile büyükleri'], 1)}
      ${lsLabel(400, 195, 'Büyüklerimiz o yılları yaşadı', 2)}
      ${compare(220, 80, ['📱💻', 'tablet, telefon'], ['📷✉️', 'fotoğraf, mektup'], 3)}
      ${compare(320, 80, ['🤷', 'rastgele sorular'], ['📝', 'hazırlanmış sorular'], 4)}`),

    'sos-aile-tarihi-timeline': () => {
      const events = [[130, true, '💍', '1978', 'Anneannem ile|dedem evlendi', 1, ''], [300, false, '👶', '1982', 'Annem doğdu', 1, 'ls-d2'], [500, true, '💒', '2010', 'Annem ile|babam evlendi', 2, ''], [670, false, '🧒', '2016', 'Ben doğdum', 3, '']];
      return lsSvg(`${lsLabel(400, 45, 'Kronoloji: oluş sırasına göre', 0)}
        <g ${lsStep(0)}><line x1="50" y1="260" x2="735" y2="260" stroke="#3d4f63" stroke-width="6" stroke-linecap="round"/><path d="M730 246 L756 260 L730 274 Z" fill="#3d4f63"/></g>
        ${events.map(([x, up, e, year, text, n, d]) => { const y = up ? 95 : 290, lines = text.split('|');
          return `<g ${lsStep(n, 'ls-rise ' + d)}><line x1="${x}" y1="${up ? 225 : 260}" x2="${x}" y2="${up ? 260 : 290}" stroke="#3d4f63" stroke-width="3"/><circle cx="${x}" cy="260" r="10" fill="#e8832f"/>
            <rect x="${x - 85}" y="${y}" width="170" height="130" rx="18" class="ls-card"/>${lsEmoji(x, y + 30, e, 34)}
            <text x="${x}" y="${y + 74}" text-anchor="middle" font-size="22" font-weight="900" fill="#08796e" ${font}>${year}</text>
            ${lines.map((l, j) => `<text x="${x}" y="${y + 100 + j * 21}" text-anchor="middle" class="ls-small">${l}</text>`).join('')}</g>`; }).join('')}
        <g ${lsStep(3)}><text x="55" y="246" class="ls-small">en eski</text><text x="725" y="246" text-anchor="end" class="ls-small">en yeni</text></g>`);
    },

    'sos-aile-tarihi-summary': () => lsSummary([['🌳', 'Ailemizin geçmişini|araştırırız'], ['👵', 'Büyüklerle görüşme:|sözlü tarih'], ['✉️', 'Yazılı ve görsel|kaynaklar'], ['⌚', 'Nesneler ve|kronoloji']], 'Hazırsan mini teste geçelim!'),
  });
}
