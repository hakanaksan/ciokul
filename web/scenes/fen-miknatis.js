/* Scenes for the video lesson "Mıknatısı Tanıyalım". Loaded when the lesson opens (see loadLessonScenes in lessons.js). */
{
  const RED = '#e25d3f', BLUE = '#4c8be6', font = 'font-family="Segoe UI,Arial,sans-serif"';
  // A bar magnet, top-left (x, y), w × h; left = the pole on the left ('N' or 'S'); letters can be hidden.
  const bar = (x, y, w, h, left = 'N', letters = true) => {
    const right = left === 'N' ? 'S' : 'N', c = p => p === 'N' ? RED : BLUE, fs = Math.min(h * 0.6, 34);
    return `<g ${font}><rect x="${x}" y="${y}" width="${w / 2}" height="${h}" rx="6" fill="${c(left)}"/><rect x="${x + w / 2}" y="${y}" width="${w / 2}" height="${h}" rx="6" fill="${c(right)}"/><rect x="${x + w / 2 - 6}" y="${y}" width="12" height="${h}" fill="${c(right)}"/><rect x="${x + w / 2 - 6}" y="${y}" width="6" height="${h}" fill="${c(left)}"/>
      ${letters ? `<text x="${x + w / 4}" y="${y + h / 2 + fs * 0.36}" text-anchor="middle" font-size="${fs}" font-weight="900" fill="#fff">${left}</text><text x="${x + w * 0.75}" y="${y + h / 2 + fs * 0.36}" text-anchor="middle" font-size="${fs}" font-weight="900" fill="#fff">${right}</text>` : ''}</g>`;
  };
  // A horseshoe magnet centred at (cx, cy), opening downwards.
  const horseshoe = (cx, cy, s = 1) => `<g transform="translate(${cx} ${cy}) scale(${s})"><path d="M-50 40 V-10 A50 50 0 0 1 50 -10 V40" stroke="#8a95a0" stroke-width="30" fill="none"/><rect x="-65" y="20" width="30" height="26" fill="${RED}"/><rect x="35" y="20" width="30" height="26" fill="${BLUE}"/></g>`;
  const pin = (x, y, rot = 0, head = '#e25d3f') => `<g transform="translate(${x} ${y}) rotate(${rot})"><line x1="0" y1="0" x2="0" y2="30" stroke="#7d8a96" stroke-width="3" stroke-linecap="round"/><circle cx="0" cy="0" r="5" fill="${head}"/></g>`;
  const clip = (x, y, rot = 0, color = '#7d8a96') => `<g transform="translate(${x} ${y}) rotate(${rot})"><path d="M-5 14 V-8 a5 5 0 0 1 10 0 V12 a3 3 0 0 1 -6 0 V-4" stroke="${color}" stroke-width="2.5" fill="none" stroke-linecap="round"/></g>`;
  const nail = (x, y, rot = 0) => `<g transform="translate(${x} ${y}) rotate(${rot})"><rect x="-12" y="-3" width="24" height="5" rx="1" fill="#5d6b78"/><path d="M-3 2 H3 L1 40 H-1 Z" fill="#7d8a96"/></g>`;
  const ok = (x, y, good) => good
    ? `<circle cx="${x}" cy="${y}" r="15" fill="#2eaa83"/><path d="M${x - 7} ${y} l5 6 l10 -11" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/>`
    : `<circle cx="${x}" cy="${y}" r="15" fill="${RED}"/><path d="M${x - 6} ${y - 6} l12 12 M${x + 6} ${y - 6} l-12 12" stroke="#fff" stroke-width="4" stroke-linecap="round"/>`;
  const arrowH = (x1, x2, y, color = '#3d4f63') => { const d = x2 > x1 ? 1 : -1; return `<line x1="${x1}" y1="${y}" x2="${x2 - d * 10}" y2="${y}" stroke="${color}" stroke-width="5" stroke-linecap="round"/><polygon points="${x2},${y} ${x2 - d * 14},${y - 9} ${x2 - d * 14},${y + 9}" fill="${color}"/>`; };

  Object.assign(LESSON_SCENES, {
    'fen-miknatis-intro': () => {
      const floorPins = [[270, 380, 70], [320, 410, -40], [380, 375, 100], [430, 415, 20], [490, 385, -70], [540, 410, 50], [600, 380, -20], [650, 412, 80], [700, 388, -50]];
      return lsSvg(`
      <rect x="0" y="340" width="800" height="110" fill="#d9b98a"/>
      ${lsKid(110, 290, 1.2, '#e88aa0', '#2b2b2b')}
      <g data-hide="2" class="ls-in on">${floorPins.map(([x, y, r], i) => pin(x, y, r, ['#e25d3f', '#4c8be6', '#f2c94c'][i % 3])).join('')}</g>
      <g ${lsStep(1)}><g class="ls-swim">${horseshoe(470, 250, 1)}</g></g>
      <g ${lsStep(2, 'ls-pop')}>${[[-72, 300, 10], [-60, 302, -15], [-46, 300, 20], [44, 300, -10], [58, 302, 15], [70, 300, -20]].map(([dx, y, r], i) => pin(470 + dx, y, r, ['#e25d3f', '#4c8be6', '#f2c94c'][i % 3])).join('')}</g>
      ${lsLabel(640, 200, 'Şak! Yapıştı!', 2)}
      ${lsLabel(400, 56, 'Mıknatıs nasıl çekti?', 3)}`);
    },

    'fen-miknatis-what': () => lsSvg(`
      ${lsLabel(400, 44, 'Mıknatıs: demir, nikel, kobalt çeker', 0)}
      <g ${lsStep(1, 'ls-rise')}><polygon points="90,150 130,112 190,118 220,160 200,214 140,226 96,200" fill="#3a3a40" stroke="#1f1f24" stroke-width="4"/>
        ${clip(120, 108, -30)}${clip(208, 140, 40)}${clip(214, 198, 70)}${clip(92, 196, -70)}</g>
      ${lsPill(155, 256, 'Manyetit', '#3a3a40', 1)}
      ${lsLabel(560, 150, 'İnsanların ürettikleri', 2)}
      <g ${lsStep(3, 'ls-rise')}>
        ${bar(70, 296, 120, 40)}
        ${horseshoe(310, 300, 0.75)}
        <circle cx="500" cy="316" r="36" fill="none" stroke="${RED}" stroke-width="20"/><path d="M500 280 A36 36 0 0 1 500 352" stroke="${BLUE}" stroke-width="20" fill="none"/>
        <ellipse cx="690" cy="330" rx="44" ry="12" fill="#3d6fb8"/><rect x="646" y="304" width="88" height="26" fill="${BLUE}"/><ellipse cx="690" cy="304" rx="44" ry="12" fill="${RED}"/>
        ${[[130, 'Çubuk'], [310, 'At nalı'], [500, 'Halka'], [690, 'Disk']].map(([x, t]) => `<text x="${x}" y="388" text-anchor="middle" class="ls-cap">${t}</text>`).join('')}
      </g>
      ${lsPill(400, 426, 'Manyetik kuvvet', '#7d5ba6', 4)}`),

    'fen-miknatis-poles': () => lsSvg(`
      <g><rect x="180" y="150" width="220" height="84" rx="8" fill="${RED}"/><rect x="400" y="150" width="220" height="84" rx="8" fill="${BLUE}"/><rect x="392" y="150" width="16" height="84" fill="${BLUE}"/><rect x="392" y="150" width="8" height="84" fill="${RED}"/></g>
      <g ${lsStep(1, 'ls-pop')} ${font}><text x="240" y="208" text-anchor="middle" font-size="50" font-weight="900" fill="#fff">N</text><text x="560" y="208" text-anchor="middle" font-size="50" font-weight="900" fill="#fff">S</text></g>
      <text x="240" y="122" text-anchor="middle" class="ls-cap">Kuzey kutbu</text><text x="560" y="122" text-anchor="middle" class="ls-cap">Güney kutbu</text>
      ${lsPill(200, 400, 'N = Kuzey', RED, 1)}${lsPill(600, 400, 'S = Güney', BLUE, 1)}
      <g ${lsStep(2)}><ellipse cx="178" cy="192" rx="34" ry="52" fill="#ffcf4d" opacity=".55"/><ellipse cx="622" cy="192" rx="34" ry="52" fill="#ffcf4d" opacity=".55"/></g>
      ${lsLabel(400, 60, 'Çekme etkisi en çok uçlarda!', 2)}
      <g ${lsStep(3, 'ls-drop')}>${[[180, 0], [196, 20], [212, -15], [228, 10], [244, -25], [190, 30], [556, -10], [572, 15], [588, -20], [604, 25], [620, -5], [610, 35], [400, 5]].map(([x, r], i) => clip(x, 252 + (i % 2) * 14, r)).join('')}
        ${[[200, 288, 10], [226, 292, -20], [580, 290, 15], [606, 288, -10]].map(([x, y, r]) => clip(x, y, r)).join('')}</g>`),

    'fen-miknatis-pushpull': () => lsSvg(`
      ${lsLabel(400, 40, 'Yaklaştırınca ne olur?', 0)}
      <g ${lsStep(1, 'ls-rise')}>${bar(80, 90, 170, 52, 'N')}${bar(274, 90, 170, 52, 'N')}
        ${arrowH(180, 240, 166, '#2eaa83')}${arrowH(344, 284, 166, '#2eaa83')}</g>
      ${lsPill(640, 118, 'ÇEKER', '#2eaa83', 1)}
      <g ${lsStep(2, 'ls-rise')}>${bar(60, 206, 170, 52, 'N')}${bar(330, 206, 170, 52, 'S')}
        ${arrowH(210, 160, 282, RED)}${arrowH(350, 400, 282, RED)}</g>
      ${lsPill(640, 234, 'İTER', RED, 2)}
      <g ${lsStep(2, 'ls-rise ls-d1')}>${bar(60, 310, 170, 52, 'S')}${bar(330, 310, 170, 52, 'N')}
        ${arrowH(210, 160, 386, RED)}${arrowH(350, 400, 386, RED)}</g>
      ${lsPill(640, 338, 'İTER', RED, 2)}
      ${lsLabel(400, 426, 'Zıt kutuplar çeker, aynı kutuplar iter', 3)}`),

    'fen-miknatis-split': () => lsSvg(`
      <g>${bar(200, 70, 400, 64)}</g>
      <g ${lsStep(0)}><line x1="400" y1="56" x2="400" y2="148" stroke="#1b2a35" stroke-width="4" stroke-dasharray="8 6"/>${lsEmoji(436, 160, '✂️', 30)}</g>
      <g ${lsStep(1, 'ls-rise')}>${bar(190, 190, 196, 54, 'N')}${bar(414, 190, 196, 54, 'N')}
        <circle cx="337" cy="217" r="34" fill="none" stroke="#f2c94c" stroke-width="5"/><circle cx="463" cy="217" r="34" fill="none" stroke="#f2c94c" stroke-width="5"/></g>
      <g ${lsStep(2, 'ls-rise')}>${[0, 1, 2, 3].map(i => bar(186 + i * 110, 296, 98, 44, 'N')).join('')}</g>
      ${lsPill(400, 410, 'Her parça yine mıknatıs!', '#2eaa83', 3)}`),

    'fen-miknatis-test': () => {
      const yes = [[110, 172, 'Demir çivi'], [290, 172, 'Ataş'], [110, 250, 'Toplu iğne'], [290, 250, 'Nikel tel']];
      const icons = [
        (x, y) => nail(x + 18, y - 2, 90),
        (x, y) => clip(x, y - 10, 0),
        (x, y) => pin(x, y - 16, 20),
        (x, y) => `<path d="M${x - 18} ${y} q8 -16 16 0 t16 0" stroke="#9aa5ad" stroke-width="4" fill="none"/>`,
      ];
      const noItems = [[450, 165, x => lsEmoji(x, 165, '✏️', 30), 'Kurşun kalem'], [620, 165, x => `<rect x="${x - 16}" y="155" width="32" height="20" rx="4" fill="#f4a6b7"/>`, 'Silgi'],
        [450, 220, x => lsEmoji(x, 220, '🥤', 30), 'Plastik bardak'], [620, 220, x => `<circle cx="${x}" cy="220" r="13" fill="#7fc6ea" stroke="#3d8fbf" stroke-width="2"/><circle cx="${x - 4}" cy="216" r="4" fill="#fff"/>`, 'Cam bilye'],
        [450, 275, x => lsEmoji(x, 275, '📄', 30), 'Kâğıt']];
      return lsSvg(`
      ${lsLabel(240, 46, 'Deney zamanı!', 0)}
      <g>${bar(420, 28, 170, 36)}</g>
      <g ${lsStep(1, 'ls-rise')}><rect x="30" y="92" width="360" height="212" rx="20" class="ls-card"/>
        ${yes.map(([x, y, t], i) => `${icons[i](x - 40, y)}<text x="${x - 10}" y="${y + 6}" class="ls-small">${t}</text>`).join('')}</g>
      ${lsPill(210, 112, 'Çekilir', '#2eaa83', 1)}
      <g ${lsStep(2, 'ls-rise')}><rect x="410" y="92" width="360" height="212" rx="20" class="ls-card"/>
        ${noItems.map(([x, y, draw, t]) => `${draw(x - 30)}<text x="${x - 6}" y="${y + 6}" class="ls-small">${t}</text>`).join('')}</g>
      ${lsPill(590, 112, 'Çekilmez', RED, 2)}
      <g ${lsStep(3)}><text x="40" y="358" class="ls-cap">Her metal çekilmez:</text></g>
      ${[[330, 'Altın', '#c9a227'], [450, 'Gümüş', '#8e9aa5'], [562, 'Bakır', '#c8733d'], [690, 'Alüminyum', '#7d8a96']].map(([x, t, c]) => lsPill(x, 357, t, c, 3)).join('')}
      ${lsPill(400, 422, 'Demir, nikel, kobalt çekilir', '#2eaa83', 4)}`);
    },

    'fen-miknatis-nocontact': () => lsSvg(`
      <rect x="0" y="360" width="800" height="90" fill="#8fd18f"/>
      <line x1="400" y1="20" x2="400" y2="380" stroke="#c9d6de" stroke-width="3" stroke-dasharray="8 8"/>
      ${lsKid(110, 312, 1.1)}${lsEmoji(180, 352, '⚽', 40)}${lsEmoji(156, 336, '💥', 26)}
      ${lsEmoji(300, 250, '🚪', 70)}${lsEmoji(262, 262, '✋', 34)}
      ${lsPill(200, 414, 'Temas gerektiren', '#6b7680', 0)}
      <g ${lsStep(1)}>${bar(430, 238, 120, 44, 'N')}
        <g fill="none" stroke="#7d5ba6" stroke-width="3" stroke-dasharray="6 6"><path d="M550 248 Q590 230 628 248"/><path d="M550 272 Q590 290 628 272"/></g>
        <g class="ls-swim">${nail(650, 256, 90)}${nail(724, 256, 90)}</g></g>
      ${lsPill(600, 414, 'Temas gerektirmeyen', '#7d5ba6', 2)}
      <g ${lsStep(3, 'ls-rise')}><rect x="612" y="60" width="160" height="120" fill="#4fb3e8" opacity=".75"/><rect x="604" y="56" width="10" height="128" fill="#bfe6ff" stroke="#7fa7c4" stroke-width="2"/>
        ${lsEmoji(700, 130, '🐠', 34)}
        <rect x="566" y="96" width="36" height="40" rx="8" fill="${RED}"/><rect x="616" y="96" width="36" height="40" rx="8" fill="${BLUE}"/>
        <text x="520" y="122" text-anchor="middle" class="ls-small">Akvaryum</text><text x="520" y="144" text-anchor="middle" class="ls-small">sileceği</text></g>`),

    'fen-miknatis-uses': () => {
      const cardAt = (cx, y, step, icon, title, sub = '') => `<g ${lsStep(step, 'ls-rise')}><rect x="${cx - 115}" y="${y}" width="230" height="150" rx="20" class="ls-card"/>${icon(cx, y + 58)}<text x="${cx}" y="${y + 120}" text-anchor="middle" class="ls-cap">${title}</text>${sub ? `<text x="${cx}" y="${y + 142}" text-anchor="middle" class="ls-small" style="fill:#4d6358">${sub}</text>` : ''}</g>`;
      const fridge = (x, y) => `<rect x="${x - 26}" y="${y - 40}" width="52" height="80" rx="6" fill="#eef5fb" stroke="#8fb3d1" stroke-width="3"/><line x1="${x - 26}" y1="${y - 10}" x2="${x + 26}" y2="${y - 10}" stroke="#8fb3d1" stroke-width="3"/><rect x="${x + 14}" y="${y - 34}" width="5" height="16" rx="2" fill="#7d8a96"/><rect x="${x + 14}" y="${y}" width="5" height="22" rx="2" fill="#7d8a96"/><rect x="${x - 18}" y="${y - 36}" width="12" height="10" rx="2" fill="${RED}"/><circle cx="${x - 8}" cy="${y + 14}" r="6" fill="${BLUE}"/>`;
      return lsSvg(`
      ${lsLabel(400, 36, 'Mıknatıs nerelerde kullanılır?', 0)}
      ${cardAt(145, 64, 1, fridge, 'Buzdolabı kapağı')}
      ${cardAt(400, 64, 1, (x, y) => lsEmoji(x, y, '👜', 60), 'Çanta kapağı')}
      ${cardAt(655, 64, 2, (x, y) => lsEmoji(x, y, '🧭', 60), 'Pusula', 'en eski kullanım')}
      ${cardAt(145, 234, 3, (x, y) => `${lsEmoji(x - 28, y, '🔊', 48)}${lsEmoji(x + 30, y, '🎧', 48)}`, 'Hoparlör, kulaklık')}
      ${cardAt(400, 234, 4, (x, y) => `${lsEmoji(x - 20, y, '🏗️', 56)}${horseshoe(x + 40, y + 6, 0.32)}`, 'Hurdalık vinci')}
      ${cardAt(655, 234, 4, (x, y) => lsEmoji(x, y, '🏥', 60), 'Emar cihazı', 'hastanede')}`);
    },

    'fen-miknatis-dikkat': () => {
      const row = (y, step, wrong, right) => `<g ${lsStep(step, 'ls-rise')}><rect x="30" y="${y}" width="740" height="64" rx="18" class="ls-card"/>
        ${ok(62, y + 32, false)}<text x="88" y="${y + 39}" class="ls-cap" style="fill:#a63a24">${wrong}</text><line x1="88" y1="${y + 32}" x2="${88 + (lsLabelWidth(wrong) - 28) * 0.9}" y2="${y + 32}" stroke="${RED}" stroke-width="3"/>
        ${arrowH(366, 404, y + 32)}${ok(432, y + 32, true)}<text x="458" y="${y + 39}" class="ls-cap" style="fill:#1f7a5c">${right}</text></g>`;
      return lsSvg(`
      ${lsLabel(400, 40, '⚠️ Dikkat! Sık yapılan hatalar', 0)}
      ${row(72, 1, 'Zıt kutuplar iter', 'Zıt kutuplar çeker')}
      ${row(148, 2, 'Bütün metalleri çeker', 'Altın, gümüş, bakır: hayır')}
      ${row(224, 3, 'En güçlü yeri ortası', 'En güçlü yerleri uçlar')}
      <g ${lsStep(4, 'ls-rise')}><rect x="30" y="306" width="740" height="110" rx="18" fill="#fff4e5" stroke="#f2a65a" stroke-width="3"/>
        ${['📱', '💻', '📺', '💳'].map((e, i) => lsEmoji(90 + i * 70, 344, e, 40)).join('')}
        <text x="400" y="400" text-anchor="middle" class="ls-cap">Mıknatısı elektronik eşyalardan uzak tut!</text>
        ${horseshoe(640, 340, 0.4)}<line x1="610" y1="368" x2="676" y2="316" stroke="${RED}" stroke-width="6" stroke-linecap="round"/></g>`);
    },

    'fen-miknatis-future': () => lsSvg(`
      ${lsLabel(400, 40, 'Mıknatısların yeni kullanım alanları', 0)}
      <g ${lsStep(1)}>
        <rect x="40" y="214" width="720" height="26" rx="6" fill="#8a95a0"/>
        <g class="ls-swim"><path d="M140 200 V150 Q140 118 180 118 H560 Q660 118 700 172 Q712 200 690 200 Z" fill="#fff" stroke="#3d6fb8" stroke-width="4"/>
          <path d="M150 168 H690" stroke="#3d6fb8" stroke-width="8"/>${[200, 270, 340, 410, 480].map(x => `<rect x="${x}" y="132" width="44" height="26" rx="6" fill="#bfe6ff"/>`).join('')}
          ${[180, 300, 420, 540, 640].map((x, i) => `<rect x="${x}" y="200" width="30" height="8" fill="${i % 2 ? BLUE : RED}"/>`).join('')}</g>
        ${[120, 240, 360, 480, 600, 700].map((x, i) => `<rect x="${x}" y="214" width="30" height="8" fill="${i % 2 ? RED : BLUE}"/>`).join('')}
      </g>
      ${lsPill(400, 92, 'Maglev: raylara değmez!', '#3d6fb8', 1)}
      <g ${lsStep(2)}>${[150, 172, 194].map(y => `<path d="M40 ${y} H110" stroke="#9aa5ad" stroke-width="5" stroke-linecap="round"/>`).join('')}</g>
      ${lsPill(250, 274, 'Çok hızlı', '#2eaa83', 2)}${lsPill(520, 274, 'Daha sessiz', '#2eaa83', 2)}
      <g ${lsStep(3, 'ls-rise')}><rect x="30" y="306" width="360" height="74" rx="18" class="ls-card"/>${lsEmoji(70, 343, '✏️', 34)}<text x="102" y="350" class="ls-cap">Mıknatıslı kalem kutusu</text></g>
      <g ${lsStep(3, 'ls-rise ls-d1')}><rect x="410" y="306" width="360" height="74" rx="18" class="ls-card"/>${lsEmoji(450, 343, '🔨', 34)}<text x="482" y="350" class="ls-cap">Çivi tutan çekiç</text></g>
      ${lsLabel(400, 422, '💡 Fikrini çiz ve anlat!', 4)}`),

    'fen-miknatis-summary': () => lsSummary([
      ['🧲', 'İki kutup: N ve S|uçlarda daha güçlü'],
      ['↔️', 'Zıt kutuplar çeker,|aynı kutuplar iter'],
      ['📎', 'Demir, nikel, kobalt|dokunmadan çekilir'],
      ['🧭', 'Pusula, buzdolabı,|hoparlör, maglev'],
    ], 'Hazırsan mini teste geçelim!'),
  });
}
