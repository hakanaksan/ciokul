/* Scenes for the video lesson "Bölme İşlemi ve Problemleri". Loaded when the lesson opens (see loadLessonScenes in lessons.js). */
{
  const INK = '#22392f', BLUE = '#4c8be6', GREEN = '#2eaa83', ORANGE = '#e8832f', RED = '#e25d3f', PURPLE = '#9b59b6', SOFT = '#fff3c4', GRAY = '#9aa8a2';
  const T = (x, y, s, size = 48, fill = INK, weight = 900, anchor = 'middle') =>
    `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="Segoe UI,Arial,sans-serif" font-weight="${weight}" font-size="${size}" fill="${fill}">${s}</text>`;
  const small = (x, y, s, anchor = 'middle') => `<text x="${x}" y="${y}" text-anchor="${anchor}" class="ls-small">${s}</text>`;
  const cap = (x, y, s, anchor = 'middle') => `<text x="${x}" y="${y}" text-anchor="${anchor}" class="ls-cap">${s}</text>`;
  const card = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="22" class="ls-card"/>`;
  const hi = (s, color) => `<tspan fill="${color}">${s}</tspan>`;
  const badge = (x, y, ok) => `<circle cx="${x}" cy="${y}" r="18" fill="${ok ? GREEN : RED}"/>` + (ok
    ? `<path d="M${x - 8} ${y} l6 7 l12 -14" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/>`
    : `<path d="M${x - 7} ${y - 7} l14 14 M${x + 7} ${y - 7} l-14 14" stroke="#fff" stroke-width="5" stroke-linecap="round"/>`);
  const hline = (x1, x2, y, color = INK) => `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${color}" stroke-width="3.5" stroke-linecap="round"/>`;
  const vline = (x, y1, y2) => `<line x1="${x}" y1="${y1}" x2="${x}" y2="${y2}" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>`;
  const down = (x, y0, y1) => `<path d="M${x} ${y0} V${y1} M${x - 6} ${y1 - 8} L${x} ${y1} L${x + 6} ${y1 - 8}" stroke="${BLUE}" stroke-width="3" fill="none" stroke-linecap="round" stroke-dasharray="5 4"/>`;
  // A division layout: digits of the work are placed in columns cx(c) = x0 + c * w.
  const grid = (x0, w, size) => {
    const cx = c => x0 + c * w;
    return {
      cx,
      put: (c, y, s, color = INK) => [...s].map((d, i) => T(cx(c + i), y, d, size, color)).join(''),
      minus: (c, y) => T(cx(c) - w * 0.9, y - size * 0.08, '−', size * 0.8),
      box: (c, n, y, step) => `<rect ${lsStep(step, 'ls-pop')} x="${cx(c) - w / 2 - 4}" y="${y - size * 0.86}" width="${n * w + 8}" height="${size * 1.08}" rx="10" fill="${SOFT}" stroke="${ORANGE}" stroke-width="3"/>`,
    };
  };
  const P = 'mat-bolme';

  Object.assign(LESSON_SCENES, {
    [`${P}-intro`]: () => lsSvg(`${lsLabel(400, 45, '🏛️ Müze gezisi', 0)}
      <g ${lsStep(0, 'ls-rise')}>${card(60, 85, 300, 170)}${lsEmoji(210, 135, '🎒', 52)}${T(210, 205, '690 öğrenci', 32, BLUE)}${small(210, 235, 'müzeye gidecek')}</g>
      <g ${lsStep(1, 'ls-rise')}>${card(440, 85, 300, 170)}${lsEmoji(590, 135, '🚌', 52)}${T(590, 205, '32 kişilik', 32, PURPLE)}${small(590, 235, 'her otobüs')}</g>
      <g ${lsStep(2, 'ls-pop')}>${T(400, 320, `690 ÷ 32 = ${hi('?', ORANGE)}`, 48)}${small(400, 352, 'Kaç otobüs gerekir?')}</g>
      ${lsLabel(400, 405, 'Önce bölmenin adımları!', 3)}`),

    [`${P}-terimler`]: () => {
      const g = grid(200, 40, 52);
      const dots = Array.from({ length: 47 }, (_, i) => {
        const group = Math.floor(i / 5), k = i % 5, x = 108 + group * 64 + k * 11;
        return `<circle cx="${x}" cy="330" r="4.5" fill="${group === 9 ? ORANGE : BLUE}"/>`;
      }).join('');
      const frames = Array.from({ length: 9 }, (_, i) => `<rect x="${100 + i * 64}" y="318" width="60" height="24" rx="8" fill="none" stroke="${GREEN}" stroke-width="2.5"/>`).join('');
      return lsSvg(`
        ${g.put(0, 130, '47', BLUE)}${vline(270, 90, 210)}${T(318, 130, '5', 52, PURPLE)}${hline(270, 370, 146)}
        <g ${lsStep(0, 'ls-in')}>${dots}</g><g ${lsStep(2, 'ls-in')}>${frames}${small(380, 370, '9 grup')}</g>
        <g ${lsStep(2, 'ls-pop')}>${T(318, 195, '9', 52, GREEN)}</g>
        <g ${lsStep(3, 'ls-in')}>${g.minus(0, 190)}${g.put(0, 190, '45')}${hline(165, 262, 205)}${g.put(1, 250, '2', ORANGE)}</g>
        ${lsPill(590, 100, 'bölünen: 47', BLUE, 1)}${lsPill(590, 150, 'bölen: 5', PURPLE, 1, 'ls-d1')}
        ${lsPill(590, 200, 'bölüm: 9', GREEN, 2)}${lsPill(590, 250, 'kalan: 2', ORANGE, 3)}
        ${lsLabel(400, 410, 'Kalan bölenden küçük: 2 &lt; 5 ✓', 4)}`);
    },

    [`${P}-basamak`]: () => {
      const side = (x, a, b, step, ok) => {
        const g = grid(x - 80, 26, 40);
        return `${g.box(0, 2, 140, step)}${g.put(0, 140, a)}${T(x + 10, 140, '÷', 40)}${T(x + 60, 140, b, 40, PURPLE)}
          <g ${lsStep(step, 'ls-in ls-d1')}>${small(x, 185, `ilk iki basamak: ${a.slice(0, 2)}`)}</g>
          <g ${lsStep(step + 1, 'ls-pop')}>${T(x, 235, `${a.slice(0, 2)} ${ok ? '&gt;' : '&lt;'} ${b}`, 34, ok ? GREEN : ORANGE)}</g>`;
      };
      return lsSvg(`${lsLabel(400, 40, 'Bölüm kaç basamaklı olacak?', 0)}
        <g ${lsStep(0, 'ls-rise')}>${card(40, 75, 350, 250)}</g>${side(215, '756', '36', 1, true)}${lsPill(215, 290, 'bölüm 2 basamaklı', GREEN, 2, 'ls-d1')}
        <g ${lsStep(3, 'ls-rise')}>${card(410, 75, 350, 250)}</g>${side(585, '268', '34', 3, false)}${lsPill(585, 290, 'bölüm 1 basamaklı', ORANGE, 4, 'ls-d1')}
        ${lsLabel(400, 385, 'İlk iki basamak ≥ bölen ise bölüm 2 basamaklı', 2, 'ls-d2')}`);
    },

    [`${P}-uzun`]: () => {
      const g = grid(140, 44, 48);
      return lsSvg(`
        ${g.box(0, 2, 128, 0)}${g.put(0, 128, '756')}${vline(262, 88, 220)}${T(326, 128, '36', 48, PURPLE)}${hline(262, 390, 145)}
        <g ${lsStep(1, 'ls-pop')}>${T(310, 195, '2', 48, GREEN)}</g><g ${lsStep(3, 'ls-pop')}>${T(342, 195, '1', 48, GREEN)}</g>
        <g ${lsStep(1, 'ls-in ls-d1')}>${g.minus(0, 180)}${g.put(0, 180, '72')}</g>
        <g ${lsStep(2, 'ls-in')}>${hline(108, 210, 194)}${g.put(1, 236, '3')}</g>
        <g ${lsStep(3, 'ls-in')}>${down(g.cx(2), 140, 200)}${g.put(2, 236, '6', BLUE)}</g>
        <g ${lsStep(3, 'ls-in ls-d1')}>${g.minus(1, 282)}${g.put(1, 282, '36')}</g>
        <g ${lsStep(4, 'ls-in')}>${hline(152, 254, 296)}${g.put(2, 338, '0')}</g>
        ${lsLabel(600, 105, 'En büyük basamaktan başla', 0)}
        ${lsLabel(600, 160, '36 × 2 = 72', 1)}${lsLabel(600, 215, '75 − 72 = 3', 2)}
        ${lsLabel(600, 270, '6’yı indir: 36', 3)}${lsLabel(600, 320, '36 × 1 = 36', 3, 'ls-d1')}${lsLabel(600, 370, '36 − 36 = 0', 4)}
        ${lsPill(230, 405, '756 ÷ 36 = 21', GREEN, 4, 'ls-d1')}`);
    },

    [`${P}-tek`]: () => {
      const g = grid(130, 34, 40);
      return lsSvg(`
        ${g.box(0, 2, 105, 1)}${g.put(0, 105, '1356')}${vline(258, 70, 180)}${T(296, 105, '6', 40, PURPLE)}${hline(258, 360, 120)}
        <g ${lsStep(1, 'ls-pop')}>${T(286, 160, '2', 40, GREEN)}</g><g ${lsStep(2, 'ls-pop')}>${T(312, 160, '2', 40, GREEN)}</g><g ${lsStep(3, 'ls-pop')}>${T(338, 160, '6', 40, GREEN)}</g>
        <g ${lsStep(1, 'ls-in ls-d1')}>${g.minus(0, 147)}${g.put(0, 147, '12')}${hline(112, 182, 157)}${g.put(1, 192, '1')}</g>
        <g ${lsStep(2, 'ls-in')}>${down(g.cx(2), 112, 168)}${g.put(2, 192, '5', BLUE)}</g>
        <g ${lsStep(2, 'ls-in ls-d1')}>${g.minus(1, 234)}${g.put(1, 234, '12')}${hline(146, 216, 244)}${g.put(2, 279, '3')}</g>
        <g ${lsStep(3, 'ls-in')}>${down(g.cx(3), 112, 255)}${g.put(3, 279, '6', BLUE)}</g>
        <g ${lsStep(3, 'ls-in ls-d1')}>${g.minus(2, 321)}${g.put(2, 321, '36')}${hline(180, 250, 331)}${g.put(3, 366, '0')}</g>
        ${lsLabel(590, 80, '4 basamaklı ÷ 1 basamaklı', 0)}
        ${lsLabel(590, 135, '1 &lt; 6, 13’e bak', 1)}${lsLabel(590, 180, '6 × 2 = 12, kalan 1', 1, 'ls-d1')}
        ${lsLabel(590, 230, '15: 6 × 2 = 12, kalan 3', 2)}${lsLabel(590, 280, '36: 6 × 6 = 36, kalan 0', 3)}
        ${lsPill(590, 345, '1356 ÷ 6 = 226', GREEN, 4)}`);
    },

    [`${P}-dikkat`]: () => {
      const g = grid(110, 34, 40);
      return lsSvg(`${lsLabel(400, 40, '⚠️ Dikkat!', 0)}
        ${g.put(0, 105, '2824')}${vline(238, 70, 180)}${T(272, 105, '4', 40, PURPLE)}${hline(238, 360, 120)}
        <g ${lsStep(1, 'ls-pop')}>${T(266, 160, '7', 40, GREEN)}</g>
        <g ${lsStep(1, 'ls-in ls-d1')}>${g.minus(0, 147)}${g.put(0, 147, '28')}${hline(92, 162, 157)}${g.put(1, 192, '0', GRAY)}</g>
        <g ${lsStep(2, 'ls-in')}>${down(g.cx(2), 112, 168)}${g.put(2, 192, '2', BLUE)}</g>
        <g ${lsStep(2, 'ls-pop ls-d1')}><circle cx="300" cy="146" r="19" fill="${SOFT}" stroke="${ORANGE}" stroke-width="3"/>${T(300, 160, '0', 40, ORANGE)}</g>
        <g ${lsStep(3, 'ls-in')}>${down(g.cx(3), 112, 168)}${g.put(3, 192, '4', BLUE)}${T(334, 160, '6', 40, GREEN)}</g>
        <g ${lsStep(3, 'ls-in ls-d1')}>${g.minus(2, 234)}${g.put(2, 234, '24')}${hline(160, 230, 244)}${g.put(3, 279, '0')}</g>
        ${lsLabel(590, 100, '2 &lt; 4: bölüme 0 yaz!', 2)}
        <g ${lsStep(3, 'ls-rise')}>${card(420, 130, 340, 90)}${T(520, 188, '706', 40, GREEN)}${badge(590, 176, true)}${T(670, 188, '76', 40, RED)}${badge(722, 176, false)}</g>
        ${lsPill(210, 335, '2824 ÷ 4 = 706', GREEN, 3, 'ls-d2')}
        <g ${lsStep(4, 'ls-rise')}>${card(420, 240, 340, 180)}${cap(590, 278, '47 ÷ 5: kalan &lt; bölen')}
          ${T(565, 330, '8, kalan 7', 28, RED)}${badge(700, 320, false)}${T(565, 390, '9, kalan 2', 28, GREEN)}${badge(700, 380, true)}</g>
        <g ${lsStep(4, 'ls-in ls-d1')}>${small(210, 395, '7, 5’ten büyük: 5 bir kez daha sığar')}</g>`);
    },

    [`${P}-saglama`]: () => lsSvg(`${lsLabel(400, 45, '× ile ÷ birbirinin tersidir', 0)}
      <g ${lsStep(1, 'ls-rise')}>${card(40, 80, 720, 120)}${T(250, 145, '756 ÷ 36 = 21', 34)}${T(410, 145, '→', 34, GRAY)}${T(560, 145, '36 × 21 = 756', 34, BLUE)}</g>
      <g ${lsStep(2, 'ls-pop')}>${badge(718, 133, true)}${small(560, 182, 'bölünene eşit')}</g>
      <g ${lsStep(3, 'ls-rise')}>${card(40, 220, 720, 120)}${T(250, 290, '47 ÷ 5 = 9, kalan 2', 30)}${T(420, 290, '→', 30, GRAY)}${T(580, 290, '5 × 9 + 2 = 47', 30, BLUE)}</g>
      ${lsPill(400, 395, 'bölen × bölüm + kalan = bölünen', GREEN, 4)}`),

    [`${P}-eksik`]: () => lsSvg(`${lsLabel(400, 40, '🔍 Eksik sayıyı bul', 0)}
      <g ${lsStep(1, 'ls-pop')}>${T(400, 112, `${hi('?', ORANGE)} × 7 = 1470`, 46)}</g>
      <g ${lsStep(2, 'ls-pop')}>${T(400, 175, '1470 ÷ 7 = 210', 40, GREEN)}${small(400, 205, 'çarpmanın tersi bölmedir')}</g>
      <g ${lsStep(3, 'ls-rise')}>${card(40, 230, 720, 190)}<rect x="226" y="258" width="52" height="52" rx="8" fill="#fff" stroke="${ORANGE}" stroke-width="3" stroke-dasharray="7 5"/>${T(296, 300, '× 8 = 29 − 5', 44, INK, 900, 'start')}</g>
      <g ${lsStep(4, 'ls-pop')}>${T(252, 300, '3', 44, GREEN)}${T(400, 355, '29 − 5 = 24', 30, BLUE)}${T(400, 398, '3 × 8 = 24 ✓', 30, GREEN)}</g>`),

    [`${P}-tahmin`]: () => {
      const arrow = x => `<path d="M${x} 152 V198 M${x - 8} 188 L${x} 198 L${x + 8} 188" stroke="${GREEN}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
      return lsSvg(`${lsLabel(400, 45, '≈ Bölümü tahmin et', 0)}
        <g ${lsStep(1, 'ls-rise')}>${T(250, 135, '596', 50)}${T(340, 135, '÷', 46)}${T(420, 135, '21', 50)}${T(490, 135, '=', 46)}${T(560, 135, '?', 50, ORANGE)}</g>
        <g ${lsStep(1, 'ls-in ls-d1')}>${arrow(250)}${arrow(420)}${small(335, 183, 'onluğa')}</g>
        <g ${lsStep(2, 'ls-pop')}>${T(250, 250, '600', 50, BLUE)}${T(420, 250, '20', 50, BLUE)}</g>
        <g ${lsStep(3, 'ls-pop')}>${T(340, 250, '÷', 46)}${T(490, 250, '=', 46)}${T(560, 250, '30', 50, ORANGE)}${small(560, 282, 'tahmin')}${small(380, 312, 'çünkü 20 × 30 = 600')}</g>
        ${lsLabel(400, 358, 'Gerçek sonuç: bölüm 28, kalan 8', 4)}${lsPill(400, 408, 'Tahmin 2 fazla: 30 − 28 = 2', GREEN, 4, 'ls-d1')}`);
    },

    [`${P}-problem`]: () => {
      const g = grid(110, 30, 36);
      const bus = i => lsEmoji(385 + (i % 8) * 46, 95 + Math.floor(i / 8) * 46, '🚌', 28);
      return lsSvg(`
        ${g.put(0, 110, '690')}${vline(192, 78, 175)}${T(232, 110, '32', 36, PURPLE)}${hline(192, 280, 124)}
        <g ${lsStep(1, 'ls-in')}>${T(232, 160, '21', 36, GREEN)}${g.minus(0, 148)}${g.put(0, 148, '64')}${hline(96, 156, 158)}${g.put(1, 190, '50')}
          ${g.minus(1, 228)}${g.put(1, 228, '32')}${hline(126, 186, 238)}${g.put(1, 270, '18', ORANGE)}${small(140, 298, 'kalan 18')}</g>
        <g ${lsStep(2, 'ls-in')}>${Array.from({ length: 21 }, (_, i) => bus(i)).join('')}</g>${lsLabel(560, 240, '21 otobüs dolu, 18 öğrenci kaldı', 2, 'ls-d1')}
        <g ${lsStep(3, 'ls-pop')}><circle cx="${385 + 5 * 46}" cy="187" r="22" fill="${SOFT}" stroke="${ORANGE}" stroke-width="3"/>${bus(21)}</g>${lsPill(560, 290, 'Cevap: 22 otobüs', GREEN, 3, 'ls-d1')}
        ${lsLabel(400, 345, 'Kontrol: 32 × 21 + 18 = 672 + 18 = 690', 4)}
        ${lsPill(160, 405, 'eşit paylaştır', BLUE, 5)}${lsPill(400, 405, 'her birine kaç?', BLUE, 5, 'ls-d1')}${lsPill(630, 405, 'kaç grup?', BLUE, 5, 'ls-d2')}`);
    },

    [`${P}-summary`]: () => lsSummary([['➗', 'Soldan başla, kalan|bölenden küçük'], ['⭕', 'Küçükse bölüme|0 yazmayı unutma'], ['✅', 'bölen × bölüm + kalan|= bölünen'], ['🚌', 'Kalanı unutma:|bir otobüs daha!']], 'Hazırsan mini teste geçelim!'),
  });
}
