/* Scenes for the video lesson "Kısa Yoldan Çarpma ve Bölme". Loaded when the lesson opens (see loadLessonScenes in lessons.js). */
{
  const INK = '#22392f', BLUE = '#4c8be6', GREEN = '#2eaa83', ORANGE = '#e8832f', RED = '#e25d3f', PURPLE = '#9b59b6';
  const T = (x, y, s, size = 48, fill = INK, weight = 900, anchor = 'middle') =>
    `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="Segoe UI,Arial,sans-serif" font-weight="${weight}" font-size="${size}" fill="${fill}">${s}</text>`;
  const small = (x, y, s, anchor = 'middle') => `<text x="${x}" y="${y}" text-anchor="${anchor}" class="ls-small">${s}</text>`;
  const cap = (x, y, s, anchor = 'middle') => `<text x="${x}" y="${y}" text-anchor="${anchor}" class="ls-cap">${s}</text>`;
  const card = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="22" class="ls-card"/>`;
  const hi = (s, color) => `<tspan fill="${color}">${s}</tspan>`;
  const badge = (x, y, ok) => `<circle cx="${x}" cy="${y}" r="20" fill="${ok ? GREEN : RED}"/>` + (ok
    ? `<path d="M${x - 9} ${y} l6 7 l13 -15" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/>`
    : `<path d="M${x - 8} ${y - 8} l16 16 M${x + 8} ${y - 8} l-16 16" stroke="#fff" stroke-width="5" stroke-linecap="round"/>`);
  const box = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="#fff" stroke="${ORANGE}" stroke-width="3" stroke-dasharray="7 5"/>`;
  // One line "left = right": the left side ends at x0, the result starts after the equals sign.
  const eq = (x0, y, left, right, size = 44, color = GREEN) =>
    `${T(x0, y, left, size, INK, 900, 'end')}${T(x0 + 24, y, '=', size)}${T(x0 + 50, y, right, size, color, 900, 'start')}`;
  const P = 'mat-kisa-yoldan';

  Object.assign(LESSON_SCENES, {
    [`${P}-intro`]: () => {
      const carton = x => `<rect x="${x}" y="85" width="150" height="66" rx="10" fill="#b9c7d3" stroke="#8a9aa8" stroke-width="2"/>` +
        [0, 1].map(r => [0, 1, 2, 3, 4].map(c => `<ellipse cx="${x + 19 + c * 28}" cy="${102 + r * 32}" rx="11" ry="13" fill="#fdf3e1" stroke="#d9c7a5" stroke-width="2"/>`).join('')).join('');
      return lsSvg(`${lsLabel(400, 45, '🥚 Onlu yumurta kutuları', 0)}
        ${carton(80)}${carton(255)}${carton(430)}${T(660, 130, '…', 48)}
        <g ${lsStep(1, 'ls-rise')}>${T(400, 215, '37 kutu × 10 yumurta = ?', 36)}</g>
        <g ${lsStep(2, 'ls-pop')}>${T(400, 295, `37 × 10 = 37${hi('0', ORANGE)}`, 56, GREEN)}</g>
        ${lsPill(200, 385, '× 10', BLUE, 3)}${lsPill(400, 385, '× 100', ORANGE, 3, 'ls-d1')}${lsPill(600, 385, '÷ 1000', PURPLE, 3, 'ls-d2')}`);
    },

    [`${P}-sifir`]: () => {
      const C = [250, 340, 430, 520], N = ['Binler', 'Yüzler', 'Onlar', 'Birler'], HC = [BLUE, PURPLE, ORANGE, GREEN];
      const arrow = (x0, x1) => `<path d="M${x0} 362 Q${(x0 + x1) / 2} 362 ${x1} 382 M${x1 + 2} 370 L${x1} 382 L${x1 + 12} 383" stroke="${ORANGE}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
      return lsSvg(`
        <g ${lsStep(0, 'ls-rise')}>${eq(330, 90, '23 × 10', `23${hi('0', ORANGE)}`)}</g>${lsPill(690, 76, 'sağa 1 sıfır', BLUE, 0, 'ls-d1')}
        <g ${lsStep(1, 'ls-rise')}>${eq(330, 165, '45 × 100', `45${hi('00', ORANGE)}`)}</g>${lsPill(690, 151, 'sağa 2 sıfır', BLUE, 1, 'ls-d1')}
        <g ${lsStep(2, 'ls-rise')}>${eq(330, 240, '128 × 1000', `128 ${hi('000', ORANGE)}`)}</g>${lsPill(690, 226, 'sağa 3 sıfır', BLUE, 2, 'ls-d1')}
        <g ${lsStep(3, 'ls-rise')}>${C.map((x, i) => `<rect x="${x - 42}" y="282" width="84" height="28" rx="8" fill="${HC[i]}"/>${T(x, 302, N[i], 15, '#fff', 800)}`).join('')}
          ${T(C[2], 352, '2', 34)}${T(C[3], 352, '3', 34)}${T(C[1], 410, '2', 34, BLUE)}${T(C[2], 410, '3', 34, BLUE)}${T(C[3], 410, '0', 34, ORANGE)}
          ${arrow(C[2] - 8, C[1] + 8)}${arrow(C[3] - 8, C[2] + 8)}${small(640, 352, '23')}${small(640, 410, '23 × 10 = 230')}</g>`);
    },

    [`${P}-katlar`]: () => lsSvg(`
      ${T(400, 100, '24 × 300 = ?', 48)}
      <g ${lsStep(1, 'ls-pop')}>${T(400, 165, '24 × 3 = 72', 40, BLUE)}${small(400, 197, 'sıfırları ayır: 300 = 3 × 100')}</g>
      <g ${lsStep(2, 'ls-pop')}>${T(400, 252, `24 × 300 = 72${hi('00', ORANGE)}`, 44, GREEN)}</g>
      <g ${lsStep(3, 'ls-rise')}>${card(60, 280, 680, 145)}${T(400, 330, '125 × 30 → 125 × 3 = 375', 34)}</g>
      <g ${lsStep(4, 'ls-pop')}>${T(400, 395, `125 × 30 = 375${hi('0', ORANGE)}`, 40, GREEN)}</g>`),

    [`${P}-bes`]: () => lsSvg(`${lsLabel(400, 40, '✋ 5 ile kısa yoldan', 0)}
      <g ${lsStep(0, 'ls-rise')}>${small(400, 80, '10')}<rect x="200" y="88" width="400" height="44" rx="10" fill="#dbe6de"/><rect x="200" y="88" width="200" height="44" rx="10" fill="${GREEN}"/>
        ${T(300, 120, '5', 30, '#fff')}${T(500, 120, '5', 30)}${small(400, 158, '5, 10’un yarısıdır')}</g>
      ${lsPill(400, 205, '× 10, sonra ÷ 2', ORANGE, 1)}
      <g ${lsStep(2, 'ls-pop')}>${T(400, 272, '36 × 10 = 360', 44, BLUE)}</g>
      <g ${lsStep(3, 'ls-pop')}>${T(400, 338, '360 ÷ 2 = 180', 44, GREEN)}</g>
      ${lsLabel(400, 405, '36 × 5 = 180', 3, 'ls-d2')}`),

    [`${P}-yirmibes`]: () => lsSvg(`
      <g ${lsStep(0, 'ls-rise')}>${card(40, 40, 350, 300)}${cap(215, 80, '50 = 100’ün yarısı')}${small(215, 110, '× 100, sonra ÷ 2')}</g>
      <g ${lsStep(1, 'ls-pop')}>${T(215, 175, '64 × 100 = 6400', 28)}${T(215, 225, '6400 ÷ 2 = 3200', 28, GREEN)}</g>${lsLabel(215, 290, '64 × 50 = 3200', 1, 'ls-d2')}
      <g ${lsStep(2, 'ls-rise')}>${card(410, 40, 350, 300)}${cap(585, 80, '25 = 100’ün dörtte biri')}${small(585, 110, '× 100, sonra ÷ 4')}</g>
      <g ${lsStep(3, 'ls-pop')}>${T(585, 175, '48 × 100 = 4800', 28)}${T(585, 225, '4800 ÷ 4 = 1200', 28, GREEN)}</g>${lsLabel(585, 290, '48 × 25 = 1200', 3, 'ls-d2')}
      ${lsPill(400, 382, '4800 → 2400 → 1200', ORANGE, 4)}<g ${lsStep(4, 'ls-in ls-d1')}>${small(400, 422, '÷ 4 yerine iki kez ÷ 2')}</g>`),

    [`${P}-bolme`]: () => lsSvg(`${lsLabel(400, 40, '÷ Sondan sıfır sil', 0)}
      <g ${lsStep(1, 'ls-rise')}>${eq(340, 120, `46 00${hi('0', RED)} ÷ 10`, '4600', 42)}</g>${lsPill(690, 106, '1 sıfır sil', RED, 1, 'ls-d1')}
      <g ${lsStep(2, 'ls-rise')}>${eq(340, 190, `46 0${hi('00', RED)} ÷ 100`, '460', 42)}</g>${lsPill(690, 176, '2 sıfır sil', RED, 2, 'ls-d1')}
      <g ${lsStep(3, 'ls-rise')}>${eq(340, 260, `46 ${hi('000', RED)} ÷ 1000`, '46', 42)}</g>${lsPill(690, 246, '3 sıfır sil', RED, 3, 'ls-d1')}
      ${lsPill(400, 345, 'Kontrol: 46 × 1000 = 46 000 ✓', GREEN, 4)}`),

    [`${P}-dikkat`]: () => lsSvg(`${lsLabel(400, 40, '⚠️ Dikkat!', 0)}
      <g ${lsStep(1, 'ls-rise')}>${card(40, 68, 720, 100)}${T(370, 118, `405 × 100 = 40 5${hi('00', ORANGE)}`, 38, INK)}${badge(700, 108, true)}${small(370, 152, 'İçteki 0 kalır, iki 0 sona eklenir')}</g>
      <g ${lsStep(2, 'ls-rise')}>${card(40, 182, 720, 140)}${T(400, 228, '50 × 40 → 5 × 4 = 20', 34)}</g>
      <g ${lsStep(3, 'ls-pop')}>${T(260, 295, `50 × 40 = 20${hi('00', ORANGE)}`, 34, GREEN)}${badge(430, 284, true)}${T(600, 295, '200', 34, RED)}${badge(670, 284, false)}</g>
      <g ${lsStep(4, 'ls-rise')}>${card(40, 336, 720, 90)}${T(330, 393, '60 000 ÷ 100 = 600', 36, GREEN)}${badge(530, 381, true)}${T(640, 393, '6', 36, RED)}${badge(690, 381, false)}</g>`),

    [`${P}-eksik`]: () => lsSvg(`
      ${T(310, 105, '30 ×', 48, INK, 900, 'end')}${box(330, 64, 60, 52)}${T(410, 105, '= 150', 48, INK, 900, 'start')}
      <g ${lsStep(1, 'ls-pop')}>${T(400, 168, '3 × 5 = 15', 38, BLUE)}${small(400, 196, 'sıfırları ayır')}</g>
      <g ${lsStep(2, 'ls-pop')}>${T(360, 103, '5', 44, GREEN)}</g>${lsPill(400, 240, '30 × 5 = 150 ✓', GREEN, 2, 'ls-d1')}
      <g ${lsStep(3, 'ls-rise')}>${T(330, 318, '78 000 ÷', 44, INK, 900, 'end')}${box(350, 278, 82, 52)}${T(450, 318, '= 780', 44, INK, 900, 'start')}</g>
      <g ${lsStep(4, 'ls-pop')}>${T(391, 315, '100', 30, GREEN)}</g>${lsLabel(400, 395, 'Sondan 2 sıfır silinmiş: ÷ 100', 4, 'ls-d1')}`),

    [`${P}-problem`]: () => lsSvg(`${lsLabel(400, 40, '🧮 Kısa yolla problem', 0)}
      <g ${lsStep(1, 'ls-rise')}>${card(40, 68, 720, 165)}${lsEmoji(95, 120, '🚚', 44)}${cap(140, 112, '38 000 kg elma', 'start')}${cap(140, 145, 'Her kamyon 1000 kg taşıyor', 'start')}${T(640, 132, '? kamyon', 30, ORANGE)}</g>
      <g ${lsStep(2, 'ls-pop')}>${T(400, 208, '38 000 ÷ 1000 = 38 kamyon', 32, GREEN)}</g>
      <g ${lsStep(3, 'ls-rise')}>${card(40, 250, 720, 170)}${lsEmoji(95, 300, '✏️', 40)}${cap(140, 295, 'Bir kutuda 25 kalem var.', 'start')}${cap(140, 328, '32 kutuda kaç kalem var?', 'start')}</g>
      <g ${lsStep(4, 'ls-pop')}>${T(400, 392, '32 × 100 = 3200 → 3200 ÷ 4 = 800', 28, GREEN)}</g>`),

    [`${P}-summary`]: () => lsSummary([['✖️', '× 10, 100, 1000:|sağa 0 ekle'], ['🧩', 'Katlarla: önce çarp,|sonra 0 ekle'], ['✋', '5, 50 → ×10, ×100, ÷ 2|25 → ×100, ÷ 4'], ['➗', '÷ 10, 100, 1000:|sondan 0 sil']], 'Hazırsan mini teste geçelim!'),
  });
}
