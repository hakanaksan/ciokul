/* Scenes for the video lesson "En Yakın Onluğa ve Yüzlüğe Yuvarlama". Loaded when the lesson opens (see loadLessonScenes in lessons.js). */
{
  const INK = '#22392f', BLUE = '#4c8be6', GREEN = '#2eaa83', ORANGE = '#e8832f', RED = '#e25d3f', GRAY = '#3d4f63';
  const T = (x, y, s, size = 48, fill = INK, weight = 900, anchor = 'middle') =>
    `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="Segoe UI,Arial,sans-serif" font-weight="${weight}" font-size="${size}" fill="${fill}">${s}</text>`;
  const small = (x, y, s, anchor = 'middle') => `<text x="${x}" y="${y}" text-anchor="${anchor}" class="ls-small">${s}</text>`;
  const hline = (x0, x1, y) => `<line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" stroke="${GRAY}" stroke-width="5" stroke-linecap="round"/>`;
  const tick = (x, y, h = 12) => `<line x1="${x}" y1="${y - h}" x2="${x}" y2="${y + h}" stroke="${GRAY}" stroke-width="3"/>`;
  const hop = (xa, xb, y, color, lift = 34) => `<path d="M${xa} ${y} Q${(xa + xb) / 2} ${y - lift} ${xb} ${y}" fill="none" stroke="${color}" stroke-width="4" stroke-linecap="round"/>`;
  const badge = (x, y, ok) => `<circle cx="${x}" cy="${y}" r="22" fill="${ok ? GREEN : RED}"/>` + (ok
    ? `<path d="M${x - 10} ${y} l7 8 l14 -16" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/>`
    : `<path d="M${x - 9} ${y - 9} l18 18 M${x + 9} ${y - 9} l-18 18" stroke="#fff" stroke-width="5" stroke-linecap="round"/>`);
  // One worked example: the number with the digit we look at highlighted, the direction, then the result.
  const row = (y, num, hi, up, res, step, resStep, note = []) => {
    const n = num.length, xs = [...num].map((_, i) => 300 - (n - 1 - i) * 36);
    return `<g ${lsStep(step, 'ls-rise')}><rect x="70" y="${y - 52}" width="660" height="80" rx="18" class="ls-card"/>
      <rect x="${xs[hi] - 19}" y="${y - 44}" width="38" height="60" rx="8" fill="#fde2c4" stroke="${ORANGE}" stroke-width="3"/>
      ${[...num].map((d, i) => T(xs[i], y, d, 50, i === hi ? ORANGE : INK)).join('')}
      ${T(400, y - 6, '➜', 40)}${small(400, y + 20, up ? 'yukarı ⬆' : 'aşağı ⬇')}</g>
      <g ${lsStep(resStep, 'ls-pop')}>${T(560, y, res, 50, GREEN)}${note.length ? small(680, y - 14, note[0]) + small(680, y + 10, note[1]) : ''}</g>`;
  };
  const P = 'mat-yuvarlama';

  Object.assign(LESSON_SCENES, {
    [`${P}-intro`]: () => lsSvg(`
      ${lsKid(140, 360, 1.3, '#9b59b6')}
      <g ${lsStep(0, 'ls-rise')}><rect x="590" y="60" width="150" height="200" rx="12" fill="${BLUE}"/><rect x="728" y="66" width="10" height="188" rx="3" fill="#fff"/>
        <rect x="610" y="80" width="105" height="30" rx="6" fill="#fff" opacity=".85"/>${T(662, 102, 'MASAL', 18, BLUE, 900)}</g>
      <g ${lsStep(1, 'ls-pop')}>${T(662, 185, '197', 56, '#fff')}${T(662, 222, 'sayfa', 22, '#fff', 800)}</g>
      <g ${lsStep(1, 'ls-pop ls-d2')}><rect x="230" y="60" width="300" height="120" rx="26" fill="#fff" stroke="#9fb6c6" stroke-width="3"/><path d="M262 176 L196 236 L300 178 Z" fill="#fff" stroke="#9fb6c6" stroke-width="3" stroke-linejoin="round"/><rect x="250" y="168" width="70" height="10" fill="#fff"/>
        <text x="380" y="105" text-anchor="middle" class="ls-cap">Yaklaşık</text>${T(380, 158, '200 sayfa', 40, GREEN)}</g>
      ${lsPill(480, 305, 'Bu bir YUVARLAMA!', ORANGE, 2)}
      ${lsLabel(380, 392, 'En yakın onluk', 3)}${lsLabel(610, 392, 'En yakın yüzlük', 3, 'ls-d1')}`),

    [`${P}-dogru`]: () => {
      const X = v => 100 + (v - 40) * 60;
      const nums = Array.from({ length: 11 }, (_, i) => 40 + i);
      return lsSvg(`${lsLabel(400, 50, 'En yakın onluk', 0)}
        ${hline(75, 725, 230)}${nums.map(v => tick(X(v), 230, v % 10 ? 10 : 18)).join('')}
        ${nums.map(v => v === 47 ? T(X(v), 274, '47', 26, RED) : T(X(v), 270, v, v % 10 ? 18 : 24, INK, v % 10 ? 700 : 900)).join('')}
        <circle cx="${X(47)}" cy="230" r="11" fill="${RED}"/>
        <g ${lsStep(1, 'ls-pop')}><circle cx="${X(40)}" cy="262" r="24" fill="none" stroke="${BLUE}" stroke-width="4"/><circle cx="${X(50)}" cy="262" r="24" fill="none" stroke="${BLUE}" stroke-width="4"/></g>
        ${lsLabel(400, 335, 'Komşu onluklar: 40 ve 50', 1)}
        <g ${lsStep(2)}>${[47, 48, 49].map(v => hop(X(v), X(v + 1), 220, GREEN)).join('')}${T(X(48.5), 170, '3 adım', 24, GREEN, 800)}</g>
        <g ${lsStep(2, 'ls-d2')}>${[47, 46, 45, 44, 43, 42, 41].map(v => hop(X(v), X(v - 1), 220, ORANGE)).join('')}${T(X(43.5), 170, '7 adım', 24, ORANGE, 800)}</g>
        ${lsPill(400, 400, 'Sonuç: 47 ➜ 50', GREEN, 3)}`);
    },

    [`${P}-kural`]: () => lsSvg(`${lsLabel(400, 45, '📏 Kısa yol: KURAL', 0)}
      <g ${lsStep(1, 'ls-pop')}><rect x="417" y="88" width="38" height="62" rx="8" fill="#fde2c4" stroke="${ORANGE}" stroke-width="3"/>
        ${T(364, 140, '3', 60)}${T(400, 140, '4', 60)}${T(436, 140, '7', 60, ORANGE)}${small(475, 126, '⬅ birler basamağına bak', 'start')}</g>
      ${[0, 1, 2, 3, 4].map(d => `<g ${lsStep(2, 'ls-rise ls-d' + d)}><rect x="${70 + d * 66}" y="195" width="60" height="60" rx="12" fill="#dcebfb" stroke="${BLUE}" stroke-width="3"/>${T(100 + d * 66, 238, d, 34, BLUE)}</g>`).join('')}
      ${[5, 6, 7, 8, 9].map(d => `<g ${lsStep(3, 'ls-rise ls-d' + (d - 5))}><rect x="${435 + (d - 5) * 66}" y="195" width="60" height="60" rx="12" fill="#fde9d6" stroke="${ORANGE}" stroke-width="3"/>${T(465 + (d - 5) * 66, 238, d, 34, ORANGE)}</g>`).join('')}
      ${lsPill(232, 300, '⬇ Aşağı yuvarla', BLUE, 2)}${lsPill(597, 300, '⬆ Yukarı yuvarla', ORANGE, 3)}
      ${lsLabel(260, 385, '342 ➜ 340', 4)}${lsLabel(540, 385, '347 ➜ 350', 4, 'ls-d1')}`),

    [`${P}-onluk`]: () => lsSvg(`${lsLabel(400, 45, 'Onluğa: birler basamağına bak', 0)}
      ${row(145, '7395', 3, true, '7400', 1, 2, ['onlarda', '9 + 1 = 10'])}
      ${row(245, '2417', 3, true, '2420', 3, 3)}
      ${row(345, '874', 2, false, '870', 4, 4)}`),

    [`${P}-yuzluk`]: () => {
      const X = v => 100 + (v - 6700) * 6;
      return lsSvg(`${lsLabel(400, 45, 'En yakın yüzlük', 0)}${lsPill(400, 102, '🔍 Onlar basamağına bak', BLUE, 0)}
        <g ${lsStep(1)}>${hline(80, 720, 300)}${Array.from({ length: 11 }, (_, i) => tick(X(6700 + i * 10), 300, i % 5 ? 8 : 16)).join('')}
          ${[6700, 6750, 6800].map(v => T(X(v), 342, v, 22, INK, 800)).join('')}<circle cx="${X(6743)}" cy="300" r="11" fill="${RED}"/></g>
        ${lsLabel(X(6743), 250, '6743', 1, 'ls-d1')}
        <g ${lsStep(2)}><path d="M340 290 Q220 196 104 288" fill="none" stroke="${ORANGE}" stroke-width="5" stroke-linecap="round"/><path d="M104 288 l4 -16 M104 288 l15 -6" stroke="${ORANGE}" stroke-width="5" stroke-linecap="round"/></g>
        ${lsLabel(600, 200, 'Onlar basamağı 4 ➜ aşağı', 2)}
        ${lsPill(400, 405, 'Sonuç: 6743 ➜ 6700', GREEN, 3)}`);
    },

    [`${P}-yuzluk-ornek`]: () => lsSvg(`${lsLabel(400, 45, 'Yüzlüğe: onlar basamağına bak', 0)}
      ${row(145, '3652', 2, true, '3700', 1, 1)}
      ${row(245, '1050', 2, true, '1100', 2, 2)}
      ${row(345, '2960', 2, true, '3000', 3, 3, ['yüzlerde', '9 + 1 = 10'])}`),

    [`${P}-dikkat`]: () => {
      const X = v => 150 + (v - 1400) * 5, xs = [349, 383, 417, 451];
      return lsSvg(`${lsLabel(400, 40, '⚠️ Dikkat!', 0)}
        <rect ${lsStep(3)} x="399" y="68" width="36" height="58" rx="8" fill="#fde2c4" stroke="${ORANGE}" stroke-width="3"/>
        <g ${lsStep(1, 'ls-pop')}>${[...'1449'].map((d, i) => T(xs[i], 114, d, 56)).join('')}</g>
        <g ${lsStep(2, 'ls-rise')}><rect x="40" y="145" width="340" height="125" rx="20" class="ls-card"/>${T(210, 205, '1449 ➜ 1450 ➜ 1500', 26, RED, 800)}
          ${small(210, 248, 'önce onluk, sonra yüzlük')}${badge(360, 150, false)}</g>
        <g ${lsStep(3, 'ls-rise')}><rect x="420" y="145" width="340" height="125" rx="20" class="ls-card"/>${T(590, 207, '1449 ➜ 1400', 32, GREEN)}
          ${small(590, 248, 'yalnız onlar basamağına bak')}${badge(740, 150, true)}</g>
        <g ${lsStep(4)}>${hline(130, 670, 345)}${Array.from({ length: 11 }, (_, i) => tick(X(1400 + i * 10), 345, i % 5 ? 7 : 14)).join('')}
          ${[1400, 1450, 1500].map(v => T(X(v), 380, v, 20, INK, 800)).join('')}
          ${hop(X(1449) - 4, X(1400), 333, GREEN, 50)}${hop(X(1449) + 4, X(1500), 333, '#9fb0bd', 50)}
          ${T(272, 300, '49', 22, GREEN)}${T(522, 300, '51', 22, '#7d8f9c')}<circle cx="${X(1449)}" cy="345" r="10" fill="${RED}"/></g>
        ${lsPill(400, 420, '1449, 1400 sayısına daha yakın', GREEN, 4, 'ls-d1')}`);
    },

    [`${P}-ters`]: () => {
      const X = v => 100 + (v - 260) * 30;
      const dots = (from, to, color, step) => `<g ${lsStep(step)}>${Array.from({ length: to - from + 1 }, (_, i) => `<circle cx="${X(from + i)}" cy="250" r="9" fill="${color}"/>`).join('')}</g>`;
      return lsSvg(`${lsLabel(400, 45, 'Hangi sayılar 270 olur?', 0)}
        ${hline(85, 715, 250)}${Array.from({ length: 21 }, (_, i) => tick(X(260 + i), 250, i % 5 ? 7 : 14)).join('')}
        ${[260, 265, 270, 275, 280].map(v => T(X(v), 290, v, v === 270 ? 26 : 20, v === 270 ? GREEN : INK, 800)).join('')}
        ${dots(265, 269, GREEN, 1)}${lsLabel(220, 345, '265 … 269 ⬆ 270', 1)}
        ${dots(270, 270, GREEN, 2)}${dots(271, 274, ORANGE, 2)}
        <g ${lsStep(2, 'ls-d1')}><circle cx="${X(275)}" cy="250" r="9" fill="${RED}"/>${T(X(275) + 8, 224, '➜ 280', 18, RED, 800)}</g>
        ${lsLabel(580, 345, '271 … 274 ⬇ 270', 2)}
        <path ${lsStep(3)} d="M${X(265)} 232 V214 H${X(274)} V232" fill="none" stroke="${INK}" stroke-width="3"/>
        ${lsPill(X(265), 170, 'en küçük 265', BLUE, 3)}${lsPill(X(274), 170, 'en büyük 274', BLUE, 3, 'ls-d1')}`);
    },

    [`${P}-hayat`]: () => lsSvg(`${lsLabel(400, 45, 'Günlük hayatta yuvarlama', 0)}
      <g ${lsStep(1, 'ls-rise')}><rect x="50" y="80" width="330" height="220" rx="24" class="ls-card"/>${lsEmoji(215, 135, '🚲', 62)}${T(215, 212, '1260 TL', 36)}${T(215, 270, '≈ 1300 TL', 36, GREEN)}</g>
      <g ${lsStep(2, 'ls-rise')}><rect x="420" y="80" width="330" height="220" rx="24" class="ls-card"/>${lsEmoji(585, 135, '🏫', 62)}${T(585, 212, '987 m', 36)}${T(585, 270, '≈ 1000 m', 36, GREEN)}</g>
      ${lsLabel(400, 350, '🧠 Zihinden işlem kolaylaşır', 3)}${lsPill(400, 405, '≈ Buna TAHMİN denir', ORANGE, 3, 'ls-d1')}`),

    [`${P}-summary`]: () => lsSummary([['🔍', 'Onluğa: birler|basamağına bak'], ['🔎', 'Yüzlüğe: onlar|basamağına bak'], ['⬆️', '5, 6, 7, 8, 9|yukarı yuvarlanır'], ['⬇️', '0, 1, 2, 3, 4|aşağı yuvarlanır']], 'Hazırsan mini teste geçelim!'),
  });
}
