/* Scenes for the video lesson "Çok Basamaklı Çarpma". Loaded when the lesson opens (see loadLessonScenes in lessons.js). */
{
  const INK = '#22392f', BLUE = '#4c8be6', GREEN = '#2eaa83', ORANGE = '#e8832f', RED = '#e25d3f', SOFT = '#fff3c4';
  const T = (x, y, s, size = 48, fill = INK, weight = 900, anchor = 'middle') =>
    `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="Segoe UI,Arial,sans-serif" font-weight="${weight}" font-size="${size}" fill="${fill}">${s}</text>`;
  const small = (x, y, s, anchor = 'middle') => `<text x="${x}" y="${y}" text-anchor="${anchor}" class="ls-small">${s}</text>`;
  const cap = (x, y, s, anchor = 'middle') => `<text x="${x}" y="${y}" text-anchor="${anchor}" class="ls-cap">${s}</text>`;
  const card = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="22" class="ls-card"/>`;
  const badge = (x, y, ok) => `<circle cx="${x}" cy="${y}" r="20" fill="${ok ? GREEN : RED}"/>` + (ok
    ? `<path d="M${x - 9} ${y} l6 7 l13 -15" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/>`
    : `<path d="M${x - 8} ${y - 8} l16 16 M${x + 8} ${y - 8} l-16 16" stroke="#fff" stroke-width="5" stroke-linecap="round"/>`);
  const arrowDown = (x, y0, y1, color) => `<path d="M${x} ${y0} V${y1} M${x - 8} ${y1 - 10} L${x} ${y1} L${x + 8} ${y1 - 10}" stroke="${color}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  const line = (x1, x2, y) => `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`;
  // Column work: thousands, hundreds, tens, ones.
  const X = [250, 310, 370, 430], Y = { carry: 100, a: 150, b: 205, p1: 272, p2: 327, sum: 395 };
  const digit = (c, y, d, color = INK, size = 48) => T(X[c], y, d, size, color);
  const num = (y, s, color = INK) => [...s].map((d, i) => digit(i + 4 - s.length, y, d, color)).join('');
  const frame = () => `${num(Y.a, '136')}${T(190, Y.b, '×', 44)}${num(Y.b, '24')}${line(180, 460, 222)}`;
  const ring = (c, y, step) => `<circle ${lsStep(step, 'ls-pop')} cx="${X[c]}" cy="${y - 16}" r="30" fill="${SOFT}" stroke="${ORANGE}" stroke-width="3"/>`;
  const carry = (c, d, step, color = ORANGE, y = Y.carry) => `<g ${lsStep(step, 'ls-drop ls-d1')}>${digit(c, y, d, color, 26)}</g>`;
  const at = (c, y, d, step, color = GREEN) => `<g ${lsStep(step, 'ls-pop ls-d1')}>${digit(c, y, d, color)}</g>`;
  const P = 'mat-carpma';

  Object.assign(LESSON_SCENES, {
    [`${P}-intro`]: () => {
      const box = (x, y) => `<rect x="${x}" y="${y}" width="44" height="34" rx="5" fill="#c8925a" stroke="#9a6a3a" stroke-width="2"/><line x1="${x + 22}" y1="${y}" x2="${x + 22}" y2="${y + 34}" stroke="#f2d39c" stroke-width="5"/>`;
      const rows = [0, 1, 2].map(r => `<g ${lsStep(1, 'ls-rise ls-d' + r)}>${Array.from({ length: 8 }, (_, i) => box(60 + i * 54, 85 + r * 48)).join('')}</g>`).join('');
      return lsSvg(`${lsLabel(400, 45, '📦 Defter siparişi', 0)}
        ${rows}${lsLabel(270, 255, '24 koli', 1, 'ls-d3')}
        <g ${lsStep(1, 'ls-rise ls-d2')}>${card(540, 80, 220, 160)}${lsEmoji(650, 130, '📒', 48)}${T(650, 196, '136 defter', 30, BLUE)}${small(650, 224, 'her kolide')}</g>
        <g ${lsStep(2, 'ls-in')}>${T(400, 312, '136 + 136 + 136 + … + 136', 34)}${small(400, 342, '24 tane 136 toplamak çok uzun!')}</g>
        ${lsPill(400, 400, 'Kısa yol: 136 × 24 = ?', BLUE, 3)}`);
    },

    [`${P}-plan`]: () => lsSvg(`
      ${T(250, 110, '136', 56)}${T(330, 110, '×', 50)}${T(410, 110, '24', 56)}${T(490, 110, '=', 50)}${T(570, 110, '?', 56, ORANGE)}
      ${small(250, 145, 'çarpan')}${small(410, 145, 'çarpan')}${small(570, 145, 'çarpım')}
      <g ${lsStep(1, 'ls-pop')}>${T(400, 210, '24 = 20 + 4', 40, BLUE)}${small(400, 240, '2 onluk + 4 birlik')}</g>
      <g ${lsStep(2, 'ls-rise')}>${card(80, 268, 280, 96)}${small(220, 295, '1. adım')}${T(220, 343, '136 × 4', 38, GREEN)}</g>
      <g ${lsStep(3, 'ls-rise')}>${card(440, 268, 280, 96)}${small(580, 295, '2. adım')}${T(580, 343, '136 × 20', 38, ORANGE)}</g>
      <g ${lsStep(4, 'ls-pop')}>${T(400, 330, '+', 48)}</g>
      ${lsPill(400, 410, 'İki sonucu topla = çarpım', BLUE, 4, 'ls-d1')}`),

    [`${P}-birler`]: () => lsSvg(`
      ${ring(3, Y.b, 0)}${frame()}
      ${lsLabel(625, 110, '1. adım: 4 ile çarp', 0)}
      ${at(3, Y.p1, '4', 1)}${carry(2, '2', 1)}${lsLabel(625, 170, '4 × 6 = 24', 1)}
      ${at(2, Y.p1, '4', 2)}${carry(1, '1', 2)}${lsLabel(625, 230, '4 × 3 + 2 = 14', 2)}
      ${at(1, Y.p1, '5', 3)}${lsLabel(625, 290, '4 × 1 + 1 = 5', 3)}
      ${lsPill(400, 395, '136 × 4 = 544', GREEN, 4)}`),

    [`${P}-onlar`]: () => lsSvg(`
      ${ring(2, Y.b, 0)}${frame()}${num(Y.p1, '544', GREEN)}
      ${lsLabel(625, 110, '2. adım: 20 ile çarp', 0)}
      ${at(3, Y.p2, '0', 1, ORANGE)}${lsLabel(625, 170, 'Birlere önce 0 yaz', 1)}
      ${at(2, Y.p2, '2', 2, ORANGE)}${carry(2, '1', 2, BLUE)}${lsLabel(625, 230, '2 × 6 = 12', 2)}
      ${at(1, Y.p2, '7', 3, ORANGE)}${at(0, Y.p2, '2', 3, ORANGE)}${lsLabel(625, 290, '2 × 3 + 1 = 7', 3)}${lsLabel(625, 340, '2 × 1 = 2', 3, 'ls-d1')}
      ${lsPill(400, 405, '136 × 20 = 2720', ORANGE, 4)}`),

    [`${P}-toplama`]: () => lsSvg(`
      ${frame()}${num(Y.p1, '544', GREEN)}${num(Y.p2, '2720', ORANGE)}
      <g ${lsStep(0)}>${T(190, Y.p2, '+', 44)}${line(180, 460, 345)}</g>
      ${lsLabel(625, 110, '3. adım: topla', 0)}
      ${at(3, Y.sum, '4', 1, BLUE)}${at(2, Y.sum, '6', 1, BLUE)}${lsLabel(625, 170, '4 + 0 = 4 ve 4 + 2 = 6', 1)}
      ${at(1, Y.sum, '2', 2, BLUE)}${carry(0, '1', 2, ORANGE, 262)}${lsLabel(625, 230, '5 + 7 = 12', 2)}
      ${at(0, Y.sum, '3', 3, BLUE)}${lsLabel(625, 290, '2 + 1 = 3', 3)}
      ${lsPill(625, 355, '136 × 24 = 3264', BLUE, 4)}${lsLabel(625, 405, '3264 defter 📒', 4, 'ls-d1')}`),

    [`${P}-dikkat`]: () => lsSvg(`${lsLabel(400, 40, '⚠️ Dikkat!', 0)}
      <g ${lsStep(1, 'ls-rise')}>${card(40, 70, 340, 250)}${cap(65, 105, 'Sıfır unutulmuş', 'start')}
        ${T(290, 150, '544', 40, INK, 900, 'end')}${T(170, 195, '+', 40)}${T(290, 195, '272', 40, RED, 900, 'end')}${line(160, 300, 210)}</g>
      <g ${lsStep(2, 'ls-pop')}>${T(290, 252, '816', 40, RED, 900, 'end')}${badge(345, 100, false)}${small(210, 300, 'Doğrusu: 544 + 2720 = 3264')}</g>
      <g ${lsStep(3, 'ls-rise')}>${card(420, 70, 340, 250)}${cap(445, 105, 'Elde unutulmasın', 'start')}
        ${T(570, 165, '4 × 3 = 12', 30, RED)}${badge(715, 155, false)}
        ${T(570, 235, '4 × 3 + 2 = 14', 30, GREEN)}${badge(715, 225, true)}${small(590, 290, 'Eldeyi her zaman ekle')}</g>
      ${lsPill(400, 362, '100 × 24 = 2400', ORANGE, 4)}${lsLabel(400, 412, 'Sonuç 2400’den büyük olmalı', 4, 'ls-d1')}`),

    [`${P}-tahmin`]: () => lsSvg(`${lsLabel(400, 45, '≈ Çarpımı tahmin et', 0)}
      <g ${lsStep(1, 'ls-rise')}>${T(250, 135, '38', 52)}${T(330, 135, '×', 46)}${T(400, 135, '7', 52)}${T(470, 135, '=', 46)}${T(550, 135, '?', 52, ORANGE)}</g>
      <g ${lsStep(2)}>${arrowDown(250, 152, 200, GREEN)}${small(345, 185, 'onluğa yuvarla')}</g>
      <g ${lsStep(2, 'ls-pop ls-d1')}>${T(250, 250, '40', 52, BLUE)}</g>
      <g ${lsStep(3, 'ls-pop')}>${T(330, 250, '×', 46)}${T(400, 250, '7', 52)}${T(470, 250, '=', 46)}${T(550, 250, '280', 52, ORANGE)}${small(550, 282, 'tahmin')}</g>
      ${lsLabel(400, 340, 'Gerçek sonuç: 38 × 7 = 266', 4)}${lsPill(400, 400, 'Fark: 280 − 266 = 14', GREEN, 4, 'ls-d1')}`),

    [`${P}-uc-sayi`]: () => lsSvg(`${lsLabel(400, 45, '🔄 Sıra değişir, çarpım değişmez', 0)}
      <g ${lsStep(1, 'ls-pop')}>${T(400, 122, '25 × 7 × 4 = ?', 44)}</g>
      <g ${lsStep(2, 'ls-rise')}>${card(40, 150, 350, 170)}${cap(215, 185, 'Önce 25 × 7')}${T(215, 240, '(25 × 7) × 4', 32)}${T(215, 292, '175 × 4 = 700', 32, BLUE)}</g>
      <g ${lsStep(3, 'ls-rise')}>${card(410, 150, 350, 170)}${cap(585, 185, 'Önce 25 × 4')}${T(585, 240, '(25 × 4) × 7', 32)}${T(585, 292, '100 × 7 = 700', 32, GREEN)}${badge(735, 180, true)}</g>
      ${lsPill(400, 365, 'Parantez içi önce yapılır', ORANGE, 4)}${lsLabel(400, 415, '(7 × 5) × 13 = 13 × (5 × 7) = 455', 4, 'ls-d1')}`),

    [`${P}-problem`]: () => {
      const seats = Array.from({ length: 6 }, (_, r) => Array.from({ length: 12 }, (_, c) =>
        `<rect x="${82 + c * 25}" y="${108 + r * 22}" width="19" height="15" rx="4" fill="${r * 12 + c < 64 ? '#e25d3f' : '#cfd8dc'}"/>`).join('')).join('');
      return lsSvg(`${lsLabel(140, 40, '1 Anla', 0)}${lsLabel(310, 40, '2 Planla', 2)}${lsLabel(470, 40, '3 Çöz', 3)}${lsLabel(640, 40, '4 Kontrol et', 5)}
        <g ${lsStep(0)}><rect x="80" y="78" width="300" height="12" rx="6" fill="#4c5d6b"/>${seats}${small(230, 254, '… 18 sıra')}
          ${cap(570, 115, '18 sıra')}${cap(570, 150, 'her sırada 24 koltuk')}</g>
        <g ${lsStep(1, 'ls-rise')}>${lsEmoji(475, 198, '🍿', 34)}${cap(505, 205, '395 izleyici', 'start')}${T(570, 248, 'Boş koltuk: ?', 28, ORANGE)}</g>
        ${lsLabel(400, 290, 'Bütün koltuklar − izleyiciler', 2)}
        ${lsLabel(400, 333, '18 × 24 = 432 koltuk', 3)}
        ${lsLabel(400, 376, '432 − 395 = 37 boş koltuk', 4)}
        ${lsPill(400, 418, 'Kontrol: 395 + 37 = 432 ✓', GREEN, 5)}`);
    },

    [`${P}-ipucu`]: () => lsSvg(`${lsLabel(400, 45, '🔑 Çarpmayı gösteren ipuçları', 0)}
      ${lsPill(190, 110, 'her birinde', BLUE, 1)}${lsPill(400, 110, 'tanesi', BLUE, 1, 'ls-d1')}${lsPill(610, 110, 'her gün', BLUE, 1, 'ls-d2')}
      <g ${lsStep(2, 'ls-rise')}>${card(40, 150, 720, 90)}${T(400, 207, '48’in 3 katı = 48 × 3 = 144', 32)}</g>
      <g ${lsStep(3, 'ls-rise')}>${card(40, 260, 720, 160)}${lsEmoji(100, 312, '✏️', 40)}${cap(140, 320, 'Tanesi 34 lira, 12 tane alan kaç lira öder?', 'start')}</g>
      <g ${lsStep(4, 'ls-pop')}>${T(400, 385, '34 × 12 = 408 lira', 40, GREEN)}</g>`),

    [`${P}-summary`]: () => lsSummary([['✖️', 'Önce birlerle çarp,|eldeyi ekle'], ['🔢', 'Onlarla çarparken|0 yaz, sonra topla'], ['🎯', 'Tahmin: onluğa|yuvarla, sonra çarp'], ['🔄', 'Sıra değişse de|çarpım değişmez']], 'Hazırsan mini teste geçelim!'),
  });
}
