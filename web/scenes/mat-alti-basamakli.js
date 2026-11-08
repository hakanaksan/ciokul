/* Scenes for the video lesson "Altı Basamaklı Sayılar ve Bölükler". Loaded when the lesson opens (see loadLessonScenes in lessons.js). */
{
  const INK = '#22392f', BLUE = '#4c8be6', GREEN = '#2eaa83', ORANGE = '#e8832f', RED = '#e25d3f';
  // Bold number or word text; s may contain <tspan> markup.
  const T = (x, y, s, size = 48, fill = INK, weight = 900, anchor = 'middle') =>
    `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="Segoe UI,Arial,sans-serif" font-weight="${weight}" font-size="${size}" fill="${fill}">${s}</text>`;
  const zero = s => s.replace(/0/g, `<tspan fill="${ORANGE}">0</tspan>`);
  // Place-value table: six columns, thousands group on the left, ones group on the right.
  const COLS = [95, 210, 325, 475, 590, 705];
  const NAMES = ['Yüz binler', 'On binler', 'Binler', 'Yüzler', 'Onlar', 'Birler'];
  const head = (i, y, step, cls = '') =>
    `<g ${lsStep(step, 'ls-pop ' + cls)}><rect x="${COLS[i] - 52}" y="${y}" width="104" height="38" rx="10" fill="${i < 3 ? BLUE : GREEN}"/>${T(COLS[i], y + 25, NAMES[i], 16, '#fff', 800)}</g>`;
  const cell = (i, y, digit, step) =>
    `<g ${lsStep(step, 'ls-rise ls-d' + i)}><rect x="${COLS[i] - 52}" y="${y}" width="104" height="84" rx="14" class="ls-card"/>${T(COLS[i], y + 62, digit, 60, i < 3 ? BLUE : GREEN)}</g>`;
  const P = 'mat-alti-basamakli';

  Object.assign(LESSON_SCENES, {
    [`${P}-intro`]: () => lsSvg(`
      ${lsKid(130, 340, 1.3)}
      <g ${lsStep(0, 'ls-rise')}><rect x="270" y="70" width="470" height="230" rx="24" class="ls-card"/><text x="505" y="120" text-anchor="middle" class="ls-label">📰 Günün haberi</text></g>
      <g ${lsStep(1, 'ls-pop')}><text x="505" y="175" text-anchor="middle" class="ls-cap">İlçenin nüfusu</text>${T(505, 258, '708 093', 72, '#0b4f45')}</g>
      <g ${lsStep(2, 'ls-pop')}><text x="130" y="200" text-anchor="middle" class="ls-big">?</text></g>
      ${lsLabel(300, 395, '📖 Okuma', 3)}${lsLabel(470, 395, '✏️ Yazma', 3, 'ls-d1')}${lsLabel(650, 395, '🔢 Basamaklar', 3, 'ls-d2')}`),

    [`${P}-basamaklar`]: () => lsSvg(`${lsLabel(400, 50, 'Basamaklar', 0)}
      ${[...'386512'].map((d, i) => cell(i, 170, d, 0)).join('')}
      ${[5, 4, 3].map((i, k) => head(i, 120, 1, 'ls-d' + k)).join('')}
      ${[2, 1, 0].map((i, k) => head(i, 120, 2, 'ls-d' + k)).join('')}
      ${lsLabel(590, 315, '⬅ Sağdan başla', 1)}
      <rect ${lsStep(3)} x="${COLS[0] - 58}" y="110" width="116" height="154" rx="16" fill="none" stroke="${RED}" stroke-width="5" stroke-dasharray="10 7"/>
      ${lsPill(150, 315, 'En büyük basamak', RED, 3)}`),

    [`${P}-bolukler`]: () => lsSvg(`
      <rect ${lsStep(1)} x="413" y="20" width="354" height="148" rx="18" fill="${GREEN}" opacity=".18"/>
      <rect ${lsStep(2)} x="33" y="20" width="354" height="148" rx="18" fill="${BLUE}" opacity=".18"/>
      ${[0, 1, 2, 3, 4, 5].map(i => head(i, 30, 0)).join('')}
      ${[...'386512'].map((d, i) => cell(i, 76, d, 0)).join('')}
      <path ${lsStep(1)} d="M423 172 v12 h334 v-12" fill="none" stroke="${GREEN}" stroke-width="5" stroke-linejoin="round"/>
      ${lsPill(590, 222, 'Birler bölüğü', GREEN, 1)}
      <path ${lsStep(2)} d="M43 172 v12 h334 v-12" fill="none" stroke="${BLUE}" stroke-width="5" stroke-linejoin="round"/>
      ${lsPill(210, 222, 'Binler bölüğü', BLUE, 2)}
      <g ${lsStep(3, 'ls-pop')}>${T(385, 330, '386', 80, BLUE, 900, 'end')}${T(415, 330, '512', 80, GREEN, 900, 'start')}
        <path d="M400 382 V346 M390 358 L400 344 L410 358" stroke="${RED}" stroke-width="4" fill="none" stroke-linecap="round"/></g>
      ${lsLabel(400, 415, 'Bölükler arasında boşluk', 3)}`),

    [`${P}-okuma`]: () => lsSvg(`
      <text x="245" y="72" text-anchor="middle" class="ls-small">binler bölüğü</text><text x="555" y="72" text-anchor="middle" class="ls-small">birler bölüğü</text>
      <rect x="120" y="85" width="250" height="115" rx="22" fill="#e6f0fd" stroke="${BLUE}" stroke-width="4"/>${T(245, 172, '386', 80, BLUE)}
      <rect x="430" y="85" width="250" height="115" rx="22" fill="#e3f6ee" stroke="${GREEN}" stroke-width="4"/>${T(555, 172, '512', 80, GREEN)}
      <g ${lsStep(0, 'ls-pop')}><circle cx="120" cy="88" r="20" fill="${ORANGE}"/>${T(120, 96, '1', 22, '#fff')}</g>
      <g ${lsStep(2, 'ls-pop')}><circle cx="430" cy="88" r="20" fill="${ORANGE}"/>${T(430, 96, '2', 22, '#fff')}</g>
      ${lsPill(245, 252, 'üç yüz seksen altı BİN', BLUE, 1)}
      ${lsPill(555, 252, 'beş yüz on iki', GREEN, 2)}
      ${lsLabel(400, 335, '🔊 üç yüz seksen altı bin beş yüz on iki', 3)}
      <g ${lsStep(3, 'ls-rise ls-d1')}>${T(400, 410, `<tspan fill="${BLUE}">386</tspan> <tspan fill="${GREEN}">512</tspan>`, 44)}</g>`),

    [`${P}-sifir`]: () => lsSvg(`${lsLabel(400, 40, '⚠️ Dikkat: Sıfırlar', 0)}
      <g ${lsStep(1, 'ls-rise')}><rect x="60" y="70" width="160" height="82" rx="16" fill="#e6f0fd" stroke="${BLUE}" stroke-width="4"/>${T(140, 132, zero('708'), 56, BLUE)}
        <rect x="235" y="70" width="160" height="82" rx="16" fill="#e3f6ee" stroke="${GREEN}" stroke-width="4"/>${T(315, 132, zero('093'), 56, GREEN)}
        <text x="228" y="178" text-anchor="middle" class="ls-small">Sıfırlar okunmaz</text></g>
      ${lsLabel(600, 95, 'yedi yüz sekiz bin', 1, 'ls-d1')}${lsLabel(600, 142, 'doksan üç', 1, 'ls-d2')}
      <line x1="40" y1="196" x2="760" y2="196" stroke="#dbe6de" stroke-width="3"/>
      ${lsLabel(230, 232, '✏️ otuz iki bin üç', 2)}
      <g ${lsStep(2)}><rect x="60" y="255" width="130" height="86" rx="16" fill="none" stroke="${BLUE}" stroke-width="4" stroke-dasharray="9 7"/>
        <rect x="205" y="255" width="195" height="86" rx="16" fill="none" stroke="${GREEN}" stroke-width="4" stroke-dasharray="9 7"/></g>
      <g ${lsStep(3, 'ls-pop')}>${T(125, 320, '32', 60, BLUE)}${T(302, 320, zero('003'), 60, GREEN)}<text x="230" y="378" text-anchor="middle" class="ls-cap">✓ 32 003</text></g>
      <g ${lsStep(4, 'ls-rise')}><rect x="450" y="225" width="310" height="120" rx="20" class="ls-card"/>${T(605, 305, '32 300', 56, RED)}${lsCross(605, 288, 210)}
        <text x="605" y="378" text-anchor="middle" class="ls-small">Bu, otuz iki bin üç yüz olur!</text></g>`),

    [`${P}-deger`]: () => {
      const xs = [160, 250, 340, 460, 550, 640];
      return lsSvg(`
      ${[...'386512'].map((d, i) => T(xs[i], 130, d, 72)).join('')}
      <circle ${lsStep(1, 'ls-pop')} cx="250" cy="105" r="42" fill="none" stroke="${ORANGE}" stroke-width="5"/>
      <g ${lsStep(2)}><text x="250" y="182" text-anchor="middle" class="ls-small">on binler basamağı</text></g>
      <circle ${lsStep(4, 'ls-pop')} cx="460" cy="105" r="42" fill="none" stroke="${ORANGE}" stroke-width="5"/>
      <g ${lsStep(4)}><text x="460" y="182" text-anchor="middle" class="ls-small">yüzler basamağı</text></g>
      <g ${lsStep(1, 'ls-rise')}><rect x="40" y="215" width="340" height="145" rx="22" class="ls-card"/><text x="65" y="268" class="ls-cap">Sayı değeri</text>${T(355, 272, '8', 36, GREEN, 900, 'end')}</g>
      <g ${lsStep(3, 'ls-pop')}><text x="65" y="330" class="ls-cap">Basamak değeri</text>${T(355, 334, '80 000', 36, ORANGE, 900, 'end')}</g>
      <g ${lsStep(4, 'ls-rise ls-d1')}><rect x="420" y="215" width="340" height="145" rx="22" class="ls-card"/><text x="445" y="268" class="ls-cap">Sayı değeri</text>${T(735, 272, '5', 36, GREEN, 900, 'end')}
        <text x="445" y="330" class="ls-cap">Basamak değeri</text>${T(735, 334, '500', 36, ORANGE, 900, 'end')}</g>
      ${lsLabel(400, 405, 'Her rakamın iki değeri var', 0)}`);
    },

    [`${P}-cozumleme`]: () => {
      const xs = [95, 217, 339, 461, 583, 705], terms = ['300 000', '80 000', '6000', '500', '10', '2'];
      const st = i => i < 3 ? 2 : 3, col = i => i < 3 ? BLUE : GREEN;
      return lsSvg(`${lsLabel(400, 45, 'ÇÖZÜMLEME', 0)}
      <g ${lsStep(1, 'ls-pop')}>${[...'386512'].map((d, i) => T(xs[i], 140, d, 64, col(i))).join('')}</g>
      ${xs.map((x, i) => `<g ${lsStep(st(i), 'ls-rise ls-d' + (i % 3))}><path d="M${x} 156 V198 M${x - 9} 188 L${x} 200 L${x + 9} 188" stroke="${col(i)}" stroke-width="4" fill="none" stroke-linecap="round"/>${T(x, 240, terms[i], 22, col(i))}</g>`).join('')}
      ${xs.slice(0, 5).map((x, i) => `<g ${lsStep(i < 2 ? 2 : 3, 'ls-d' + (i < 2 ? i + 1 : i - 2))}>${T(x + 61, 240, '+', 26, INK)}</g>`).join('')}
      <path ${lsStep(4)} d="M45 262 v12 h710 v-12" fill="none" stroke="${INK}" stroke-width="3"/>
      ${lsLabel(400, 322, 'Toplamı: 386 512', 4)}
      ${lsPill(400, 395, 'Sayı = basamak değerlerinin toplamı', ORANGE, 4, 'ls-d2')}`);
    },

    [`${P}-abakus`]: () => {
      const xs = [150, 250, 350, 450, 550, 650], beads = [5, 3, 0, 6, 7, 4];
      const colors = ['#e25d3f', '#f2994a', '#f2c94c', '#2eaa83', '#4c8be6', '#9b59b6'];
      const names = ['Yüz binler', 'On binler', 'Binler', 'Yüzler', 'Onlar', 'Birler'];
      const digitStep = i => i < 2 ? 2 : i === 2 ? 3 : 4;
      return lsSvg(`${lsLabel(150, 50, '🧮 Abaküs', 0)}
      ${xs.map(x => `<line x1="${x}" y1="150" x2="${x}" y2="352" stroke="#b08a5a" stroke-width="8" stroke-linecap="round"/>`).join('')}
      <rect x="90" y="350" width="620" height="22" rx="8" fill="#8a5a2b"/>
      ${xs.map((x, i) => T(x, 400, names[i], 15, INK, 700)).join('')}
      ${xs.map((x, i) => `<g ${lsStep(1, 'ls-drop ls-d' + i)}>${Array.from({ length: beads[i] }, (_, k) => `<ellipse cx="${x}" cy="${337 - k * 22}" rx="34" ry="11" fill="${colors[i]}" stroke="#fff" stroke-width="2"/>`).join('')}</g>`).join('')}
      ${xs.map((x, i) => `<g ${lsStep(digitStep(i), 'ls-pop ls-d' + (i > 2 ? i - 3 : 0))}>${T(x, 130, beads[i], 44, i === 2 ? ORANGE : INK)}</g>`).join('')}
      <g ${lsStep(3, 'ls-pop')}><rect x="312" y="312" width="76" height="28" rx="10" fill="#fff" stroke="${ORANGE}" stroke-width="2"/><text x="350" y="332" text-anchor="middle" class="ls-small">boş = 0</text></g>
      ${lsPill(560, 50, 'Sayımız: 530 674', GREEN, 4, 'ls-d3')}`);
    },

    [`${P}-karsilastir`]: () => {
      const L = [95, 133, 171, 225, 263, 301], R = [499, 537, 575, 629, 667, 705];
      const digits = (xs, s) => [...s].map((d, i) => T(xs[i], 272, d, 48, i < 2 ? '#8a9a91' : INK)).join('');
      return lsSvg(`${lsLabel(400, 45, 'Hangisi büyük?', 0)}
      <g ${lsStep(1, 'ls-rise')}><rect x="40" y="78" width="720" height="118" rx="22" class="ls-card"/>
        ${T(330, 145, '98 765', 52, INK, 900, 'end')}${T(400, 145, '&lt;', 56, RED)}${T(470, 145, '102 340', 52, INK, 900, 'start')}
        <text x="245" y="182" text-anchor="middle" class="ls-small">5 basamak</text><text x="570" y="182" text-anchor="middle" class="ls-small">6 basamak</text></g>
      <g ${lsStep(2, 'ls-rise')}><rect x="40" y="215" width="720" height="85" rx="22" class="ls-card"/></g>
      <g ${lsStep(3, 'ls-pop')}><rect x="154" y="226" width="34" height="58" rx="8" fill="#fde2c4" stroke="${ORANGE}" stroke-width="3"/><rect x="558" y="226" width="34" height="58" rx="8" fill="#fde2c4" stroke="${ORANGE}" stroke-width="3"/></g>
      <g ${lsStep(2, 'ls-rise')}>${digits(L, '362861')}${digits(R, '361836')}
        <path d="M78 286 H150 M482 286 H554" stroke="#8a9a91" stroke-width="4" stroke-linecap="round"/></g>
      ${lsLabel(400, 340, 'Soldan başla: 3 = 3, 6 = 6', 2, 'ls-d1')}
      <g ${lsStep(3, 'ls-pop')}>${T(400, 274, '&gt;', 56, RED)}</g>
      ${lsLabel(400, 410, '🐊 Açık ağız büyük sayıya bakar', 4)}`);
    },

    [`${P}-summary`]: () => lsSummary([['🧩', 'Üçerli gruplar:|bölükler'], ['📖', 'Önce binler bölüğü,|sonra birler bölüğü'], ['⚠️', 'Sıfır okunmaz,|ama yazılır'], ['💎', 'Basamak değeri|yere göre değişir']], 'Hazırsan mini teste geçelim!'),
  });
}
