/* Scenes for the video lesson "Toplama, Çıkarma ve Tahmin". Loaded when the lesson opens (see loadLessonScenes in lessons.js). */
{
  const INK = '#22392f', BLUE = '#4c8be6', GREEN = '#2eaa83', ORANGE = '#e8832f', RED = '#e25d3f';
  const T = (x, y, s, size = 48, fill = INK, weight = 900, anchor = 'middle') =>
    `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="Segoe UI,Arial,sans-serif" font-weight="${weight}" font-size="${size}" fill="${fill}">${s}</text>`;
  const small = (x, y, s, anchor = 'middle') => `<text x="${x}" y="${y}" text-anchor="${anchor}" class="ls-small">${s}</text>`;
  const cap = (x, y, s, anchor = 'middle') => `<text x="${x}" y="${y}" text-anchor="${anchor}" class="ls-cap">${s}</text>`;
  const hi = (s, color) => `<tspan fill="${color}">${s}</tspan>`;
  const badge = (x, y, ok) => `<circle cx="${x}" cy="${y}" r="22" fill="${ok ? GREEN : RED}"/>` + (ok
    ? `<path d="M${x - 10} ${y} l7 8 l14 -16" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/>`
    : `<path d="M${x - 9} ${y - 9} l18 18 M${x + 9} ${y - 9} l-18 18" stroke="#fff" stroke-width="5" stroke-linecap="round"/>`);
  const arrowDown = (x, y0, y1, color) => `<path d="M${x} ${y0} V${y1} M${x - 8} ${y1 - 10} L${x} ${y1} L${x + 8} ${y1 - 10}" stroke="${color}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  // Column work: thousands, hundreds, tens, ones.
  const COLX = [260, 340, 420, 500], NAMES = ['Binler', 'Yüzler', 'Onlar', 'Birler'], HEADC = [BLUE, '#9b59b6', ORANGE, GREEN];
  const header = y => COLX.map((x, i) => `<rect x="${x - 37}" y="${y}" width="74" height="30" rx="8" fill="${HEADC[i]}"/>${T(x, y + 21, NAMES[i], 15, '#fff', 800)}`).join('');
  const digits = (y, s, color = INK) => [...s].map((d, i) => T(COLX[i + 4 - s.length], y, d, 56, color)).join('');
  const colMark = (c, step, hide) => `<rect ${lsStep(step)}${hide ? ` data-hide="${hide}"` : ''} x="${COLX[c] - 34}" y="108" width="68" height="262" rx="14" fill="#fff3c4"/>`;
  const strike = c => `<line x1="${COLX[c] - 20}" y1="200" x2="${COLX[c] + 20}" y2="160" stroke="${RED}" stroke-width="4" stroke-linecap="round"/>`;
  const P = 'mat-toplama-cikarma';

  Object.assign(LESSON_SCENES, {
    [`${P}-intro`]: () => lsSvg(`${lsLabel(400, 45, '📚 Kitap Kampanyası', 0)}
      ${[['1. hafta', '📚', '2475', BLUE, 1], ['2. hafta', '📚', '1658', BLUE, 2], ['Hedef', '🚩', '5000', GREEN, 3]].map(([t, e, n, c, step], i) => {
        const x = 60 + i * 240;
        return `<g ${lsStep(step, 'ls-rise')}><rect x="${x}" y="90" width="220" height="210" rx="24" class="ls-card"/>${cap(x + 110, 130, t)}${lsEmoji(x + 110, 190, e, 56)}${T(x + 110, 275, n, 44, c)}</g>`;
      }).join('')}
      ${lsLabel(260, 380, '➕ Toplam kaç?', 3)}${lsLabel(560, 380, '➖ Hedefe kaç kaldı?', 3, 'ls-d1')}`),

    [`${P}-toplama`]: () => lsSvg(`
      ${colMark(3, 1, 2)}${colMark(2, 2, 3)}${colMark(1, 3, 4)}${colMark(0, 4)}
      ${header(68)}
      <g ${lsStep(1, 'ls-drop ls-d2')}>${T(COLX[2], 140, '1', 28, ORANGE)}</g>
      <g ${lsStep(2, 'ls-drop ls-d2')}>${T(COLX[1], 140, '1', 28, ORANGE)}</g>
      <g ${lsStep(3, 'ls-drop ls-d2')}>${T(COLX[0], 140, '1', 28, ORANGE)}</g>
      ${digits(200, '2475')}${T(185, 262, '+', 52)}${digits(262, '1658')}
      <line x1="175" y1="285" x2="540" y2="285" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
      ${[3, 2, 1, 0].map((c, k) => `<g ${lsStep(k + 1, 'ls-pop ls-d1')}>${T(COLX[c], 348, '3314'[k], 56, GREEN)}</g>`).join('')}
      ${lsLabel(655, 150, '5 + 8 = 13', 1)}${lsLabel(655, 205, '7 + 5 + 1 = 13', 2)}${lsLabel(655, 260, '4 + 6 + 1 = 11', 3)}${lsLabel(655, 315, '2 + 1 + 1 = 4', 4)}
      <g data-hide="4" class="ls-in on">${lsLabel(360, 410, 'Basamaklar alt alta gelir', 0)}</g>
      ${lsPill(360, 410, 'Toplam: 4133 kitap', GREEN, 4, 'ls-d2')}`),

    [`${P}-cikarma`]: () => lsSvg(`
      ${colMark(0, 1, 2)}
      ${header(68)}
      ${digits(200, '5000')}${T(185, 262, '−', 52)}${digits(262, '4133')}
      <line x1="175" y1="285" x2="540" y2="285" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
      <g ${lsStep(1)}>${strike(0)}${T(COLX[0], 142, '4', 28, ORANGE)}</g>
      ${[1, 2, 3].map((c, k) => `<g ${lsStep(2, 'ls-d' + k)}>${strike(c)}${T(COLX[c], 142, c === 3 ? '10' : '9', 28, ORANGE)}</g>`).join('')}
      <rect ${lsStep(3)} x="230" y="114" width="300" height="38" rx="12" fill="none" stroke="${ORANGE}" stroke-width="3" stroke-dasharray="8 6"/>
      ${[3, 2, 1].map((c, k) => `<g ${lsStep(4, 'ls-pop ls-d' + k)}>${T(COLX[c], 348, '768'[k], 56, GREEN)}</g>`).join('')}
      ${lsPill(650, 200, '0 − 3 olmaz!', RED, 1)}${lsLabel(650, 262, '1000 = 10 yüzlük', 2)}
      <g data-hide="4" class="ls-in on">${lsLabel(360, 410, '5000 = 4000 + 900 + 90 + 10', 3)}</g>
      ${lsPill(360, 410, 'Hedefe kalan: 867 kitap', GREEN, 4, 'ls-d3')}`),

    [`${P}-dikkat`]: () => lsSvg(`${lsLabel(400, 40, '⚠️ Dikkat!', 0)}
      <g ${lsStep(1, 'ls-rise')}><rect x="40" y="70" width="340" height="235" rx="22" class="ls-card"/>${cap(65, 105, 'Hatalı işlem', 'start')}${badge(350, 95, false)}
        ${T(300, 150, '5000', 44, INK, 900, 'end')}${T(165, 200, '−', 44)}${T(300, 200, '4133', 44, INK, 900, 'end')}
        <line x1="150" y1="216" x2="310" y2="216" stroke="${INK}" stroke-width="4"/>${T(300, 262, '1133', 44, RED, 900, 'end')}${small(210, 292, '0 − 3 yerine 3 − 0 yapılmış')}</g>
      ${lsPill(400, 345, 'Üstteki küçükse: BOZ!', ORANGE, 2)}
      <g ${lsStep(3, 'ls-rise')}><rect x="420" y="70" width="340" height="235" rx="22" class="ls-card"/>${cap(445, 105, 'Sağlama', 'start')}
        ${T(680, 150, '867', 44, INK, 900, 'end')}${T(545, 200, '+', 44)}${T(680, 200, '4133', 44, INK, 900, 'end')}
        <line x1="530" y1="216" x2="690" y2="216" stroke="${INK}" stroke-width="4"/></g>
      <g ${lsStep(4, 'ls-pop')}>${T(680, 262, '5000', 44, GREEN, 900, 'end')}${badge(730, 95, true)}${small(590, 292, 'eksilene eşit')}</g>
      ${lsLabel(400, 405, 'fark + çıkan = eksilen', 4, 'ls-d1')}`),

    [`${P}-tahmin-toplama`]: () => lsSvg(`${lsLabel(400, 45, '≈ Tahmin', 0)}
      <g ${lsStep(1, 'ls-rise')}>${T(200, 135, '3618', 48)}${T(310, 135, '+', 44)}${T(420, 135, '5852', 48)}${T(530, 135, '=', 44)}${T(640, 135, '?', 48, ORANGE)}</g>
      <g ${lsStep(2)}>${arrowDown(200, 152, 205, GREEN)}${arrowDown(420, 152, 205, GREEN)}${small(310, 186, 'yüzlüğe yuvarla')}</g>
      <g ${lsStep(2, 'ls-pop ls-d1')}>${T(200, 258, '3600', 48, BLUE)}${T(420, 258, '5900', 48, BLUE)}</g>
      <g ${lsStep(3, 'ls-pop')}>${T(310, 258, '+', 44)}${T(530, 258, '=', 44)}${T(640, 258, '9500', 48, ORANGE)}${small(640, 288, 'tahmin')}</g>
      ${lsLabel(400, 345, 'Gerçek sonuç: 9470', 4)}${lsPill(400, 405, 'Aradaki fark: 9500 − 9470 = 30', GREEN, 4, 'ls-d1')}`),

    [`${P}-tahmin-cikarma`]: () => lsSvg(`${lsLabel(400, 40, '≈ Çıkarmada tahmin', 0)}
      <g ${lsStep(1, 'ls-rise')}>${T(200, 115, '5218', 46)}${T(310, 115, '−', 44)}${T(420, 115, '2981', 46)}${T(530, 115, '=', 44)}${T(640, 115, '?', 46, ORANGE)}</g>
      <g ${lsStep(2)}>${arrowDown(200, 130, 172, GREEN)}${arrowDown(420, 130, 172, GREEN)}${small(310, 158, 'yüzlüğe')}</g>
      <g ${lsStep(2, 'ls-pop ls-d1')}>${T(200, 218, '5200', 46, BLUE)}${T(420, 218, '3000', 46, BLUE)}</g>
      <g ${lsStep(3, 'ls-pop')}>${T(310, 218, '−', 44)}${T(530, 218, '=', 44)}${T(640, 218, '2200', 46, ORANGE)}${small(640, 246, 'tahmin')}</g>
      <g ${lsStep(4, 'ls-rise')}><rect x="40" y="270" width="350" height="150" rx="22" class="ls-card"/>${cap(215, 307, 'Gerçek sonuç')}${T(215, 360, '2237', 40)}${small(215, 400, '2237 − 2200 = 37 fark')}</g>
      <g ${lsStep(5, 'ls-rise')}><rect x="410" y="270" width="350" height="150" rx="22" class="ls-card"/>${cap(585, 307, 'Onluğa yuvarlarsak')}${T(585, 358, '5220 − 2980 = 2240', 28, GREEN)}${small(585, 400, '2240 − 2237 = 3 fark')}</g>`),

    [`${P}-zihinden`]: () => lsSvg(`${lsLabel(400, 40, '🧠 Zihinden toplama', 0)}
      <g ${lsStep(1, 'ls-rise')}><rect x="60" y="70" width="680" height="125" rx="22" class="ls-card"/>${T(470, 145, `2${hi('5', ORANGE)}23 + ${hi('2', ORANGE)}00`, 50, INK, 900, 'end')}${small(400, 182, 'yalnızca yüzler basamağı değişir')}</g>
      <g ${lsStep(2, 'ls-pop')}>${T(490, 145, `= 2${hi('7', GREEN)}23`, 50, INK, 900, 'start')}</g>
      <g ${lsStep(3, 'ls-rise')}><rect x="60" y="215" width="680" height="210" rx="22" class="ls-card"/>${T(470, 285, `3${hi('6', ORANGE)}52 + ${hi('5', ORANGE)}00`, 50, INK, 900, 'end')}</g>
      ${lsLabel(400, 340, '600 + 500 = 1100', 3, 'ls-d1')}
      <g ${lsStep(4, 'ls-pop')}>${T(490, 285, `= ${hi('41', GREEN)}52`, 50, INK, 900, 'start')}</g>
      ${lsPill(400, 395, 'Binler basamağı da 1 arttı', ORANGE, 4, 'ls-d1')}`),

    [`${P}-problem`]: () => {
      const X = m => 60 + m * 680 / 9800, a = X(2565), b = X(2565 + 3025);
      return lsSvg(`${lsLabel(230, 40, '1 Anla', 0)}${lsLabel(360, 40, '2 Planla', 3)}${lsLabel(485, 40, '3 Çöz', 4)}${lsLabel(630, 40, '4 Kontrol et', 5)}
        <g ${lsStep(1)}><path d="M60 112 v-8 h680 v8" fill="none" stroke="${INK}" stroke-width="3"/>${T(400, 94, '9800 m', 24, INK, 900)}
          <path d="M${a} 150 Q${(a + b) / 2} 112 ${b} 150 Z" fill="#8d7b68"/>
          <rect x="60" y="150" width="${a - 60}" height="36" fill="#9bd27d"/><rect x="${a}" y="150" width="${b - a}" height="36" fill="#5d5145"/>
          <path d="M${a + 10} 168 H${b - 10}" stroke="#f2c94c" stroke-width="3" stroke-dasharray="12 10"/><rect x="${b}" y="150" width="${740 - b}" height="36" fill="#cfd8dc"/>
          ${lsEmoji(110, 166, '🚗', 30)}${T((60 + a) / 2, 214, '2565 m', 20, INK, 800)}${T((a + b) / 2, 214, '3025 m tünel', 20, INK, 800)}</g>
        <rect ${lsStep(2)} x="${b}" y="148" width="${740 - b}" height="40" fill="none" stroke="${ORANGE}" stroke-width="4" stroke-dasharray="9 6"/>
        <g ${lsStep(2, 'ls-pop')} data-hide="4">${T((b + 740) / 2, 216, '? m', 24, ORANGE)}</g>
        <g ${lsStep(4, 'ls-pop')}>${T((b + 740) / 2, 216, '4210 m', 22, GREEN)}</g>
        ${lsLabel(400, 270, '2565 + 3025 = 5590', 3)}${lsLabel(400, 330, '9800 − 5590 = 4210', 4)}
        ${lsPill(400, 395, 'Kontrol: 5590 + 4210 = 9800 ✓', GREEN, 5)}`);
    },

    [`${P}-ipucu`]: () => lsSvg(`${lsLabel(400, 40, '🔑 İpucu sözcükler', 0)}
      <g ${lsStep(1, 'ls-rise')}><rect x="40" y="70" width="350" height="140" rx="22" class="ls-card"/>${T(215, 112, 'Toplama', 26, BLUE)}${cap(215, 152, 'toplam • hepsi')}${cap(215, 186, 'birlikte')}</g>
      <g ${lsStep(2, 'ls-rise')}><rect x="410" y="70" width="350" height="140" rx="22" class="ls-card"/>${T(585, 112, 'Çıkarma', 26, ORANGE)}${cap(585, 152, 'kaç fazla • kaç eksik')}${cap(585, 186, 'fark • kalan')}</g>
      <g ${lsStep(3, 'ls-rise')}>${lsEmoji(75, 268, '👦', 40)}${cap(105, 276, 'Ali: 1256 adım', 'start')}${lsEmoji(75, 343, '👧', 40)}${cap(105, 351, 'Ece: 2463 adım', 'start')}</g>
      ${lsPill(575, 270, 'Kaç fazla? 2463 − 1256 = 1207', ORANGE, 4)}
      ${lsPill(575, 345, 'Birlikte? 1256 + 2463 = 3719', BLUE, 5)}`),

    [`${P}-summary`]: () => lsSummary([['➕', 'Eldeyi unutma,|birlerden başla'], ['➖', 'Küçükse bir büyük|basamaktan boz'], ['🎯', 'Tahmin: önce yuvarla,|sonra işlem yap'], ['✅', 'Anla, planla,|çöz, kontrol et']], 'Hazırsan mini teste geçelim!'),
  });
}
