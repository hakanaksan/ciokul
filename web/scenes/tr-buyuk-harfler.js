/* Scenes for the video lesson "Büyük Harflerin Kullanımı". Loaded when the lesson opens (see loadLessonScenes in lessons.js). */
{
  const RED = '#e25d3f', GREEN = '#1f9a73', TEAL = '#0b4f45';
  const T = (x, y, text, size = 24, extra = '', anchor = 'middle') => `<text x="${x}" y="${y}" text-anchor="${anchor}" class="ls-cap" style="font-size:${size}px" ${extra}>${text}</text>`;
  // Parts in [brackets] are drawn in colour and bold (the capital letters). With ghost the other parts
  // are invisible: drawn over the same text, it colours a letter later without moving anything.
  const rich = (x, y, src, size, color = RED, ghost = false, anchor = 'middle', fill = '') => `<text x="${x}" y="${y}" text-anchor="${anchor}" class="ls-cap" style="font-size:${size}px${fill ? ';fill:' + fill : ''}">${src.split(/(\[[^\]]*\])/).filter(Boolean)
    .map(p => p[0] === '[' ? `<tspan style="fill:${color};font-weight:900">${p.slice(1, -1)}</tspan>` : `<tspan${ghost ? ' style="fill-opacity:0"' : ''}>${p}</tspan>`).join('')}</text>`;
  const box = (x, y, w, h, extra = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" class="ls-card" ${extra}/>`;
  const tag = (x, y, w, text, color) => `<rect x="${x}" y="${y}" width="${w}" height="36" rx="18" fill="${color}"/><text x="${x + w / 2}" y="${y + 24}" text-anchor="middle" style="font:800 16px Segoe UI,Arial,sans-serif;fill:#fff">${text}</text>`;
  const ok = (x, y) => `<circle cx="${x}" cy="${y}" r="16" fill="#2eaa83"/><path d="M${x - 8} ${y} l6 7 l11 -13" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  const no = (x, y) => `<circle cx="${x}" cy="${y}" r="16" fill="${RED}"/><path d="M${x - 7} ${y - 7} l14 14 M${x + 7} ${y - 7} l-14 14" stroke="#fff" stroke-width="5" stroke-linecap="round"/>`;
  // A fix badge: wrong word ➜ right word, centred on x.
  const fix = (x, y, wrong, right, step, cls = '') => `<g ${lsStep(step, 'ls-pop ' + cls)}><rect x="${x - 165}" y="${y - 25}" width="330" height="40" rx="20" fill="#fff6cc" stroke="#f2c94c" stroke-width="3"/>
    ${rich(x, y + 3, `${wrong} ➜ ${right}`, 21, GREEN)}</g>`;

  Object.assign(LESSON_SCENES, {
    'tr-buyuk-harfler-intro': () => lsSvg(`
      <g ${lsStep(0, 'ls-rise')}>${box(40, 70, 350, 180)}${lsEmoji(215, 122, '🐈', 60)}${rich(215, 215, '[P]amuk bahçede uyuyor.', 26, '#22392f')}</g>
      <g ${lsStep(0, 'ls-rise ls-d1')}>${box(410, 70, 350, 180)}
        <path d="M585 160 V110 M585 135 L560 112 M585 128 L612 106" stroke="#7a5230" stroke-width="5" fill="none" stroke-linecap="round"/>
        ${[[560, 104], [612, 100], [585, 98]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="15" fill="#fff" stroke="#b9c3c9" stroke-width="2"/>`).join('')}
        ${rich(585, 215, 'Tarlada [p]amuk topladık.', 26, '#22392f')}</g>
      <g ${lsStep(1)}>${rich(215, 215, '[P]amuk bahçede uyuyor.', 26, RED, true)}
        <text x="105" y="360" text-anchor="middle" style="font:900 100px Segoe UI,Arial,sans-serif;fill:${RED}">P</text></g>
      ${lsLabel(255, 320, '🐱 Kedinin adı', 1, 'ls-d1')}
      <g ${lsStep(2)}>${rich(585, 215, 'Tarlada [p]amuk topladık.', 26, GREEN, true)}
        <text x="475" y="350" text-anchor="middle" style="font:900 100px Segoe UI,Arial,sans-serif;fill:${GREEN}">p</text></g>
      ${lsLabel(625, 320, '🌱 Bir bitki', 2, 'ls-d1')}
      ${lsPill(400, 415, '💡 Büyük harf bir ipucudur!', '#e8832f', 3)}`),

    'tr-buyuk-harfler-cumle': () => {
      const row = (y, h, label, color, lines, step) => `<g ${lsStep(step, 'ls-rise')}>${box(40, y, 720, h)}${tag(55, y + h / 2 - 18, 180, label, color)}
        ${lines.map((src, i) => rich(495, y + h / 2 + 10 - (lines.length - 1) * 17 + i * 34, src, lines.length > 1 ? 26 : 30)).join('')}</g>`;
      return lsSvg(`
      ${lsLabel(400, 45, '🔠 Cümleler büyük harfle başlar', 0)}
      ${row(78, 70, 'cümle başı', '#08796e', ['[B]ugün hava çok güzel.'], 1)}
      ${row(160, 70, 'noktadan sonra', '#4c8be6', ['Ders bitti. [Z]il çaldı.'], 2)}
      ${row(242, 70, 'tırnak içinde', '#8e5cc8', ['Annem “[E]rken yat.” dedi.'], 3)}
      ${row(324, 100, 'iki noktadan sonra', '#e8832f', ['Öğretmen şöyle dedi:', '[Y]arın müzeye gideceğiz.'], 4)}`);
    },

    'tr-buyuk-harfler-kisi': () => lsSvg(`
      ${lsLabel(400, 42, '👤 Kişi adları ve soyadları', 0)}
      <g ${lsStep(1, 'ls-rise')}>${lsKid(110, 150, 0.8, '#e8832f', '#2b1a10')}${box(190, 72, 570, 100)}${rich(475, 140, '[Z]eynep [K]aya', 54)}</g>
      <g ${lsStep(2, 'ls-rise')}>${box(40, 190, 350, 95)}${lsEmoji(110, 237, '🐕', 52)}${rich(260, 252, '[K]arabaş', 42)}</g>
      <g ${lsStep(2, 'ls-rise ls-d1')}>${box(410, 190, 350, 95)}${lsEmoji(480, 237, '🐈', 52)}${rich(630, 252, '[B]oncuk', 42)}</g>
      <g ${lsStep(3, 'ls-rise')}>${box(40, 302, 720, 58)}${rich(400, 341, '[K]arabaş bütün gece havladı.', 28)}</g>
      <g ${lsStep(4, 'ls-rise')}>${box(40, 375, 720, 60)}${rich(225, 415, '[D]oktor [S]elin [H]anım', 28)}${rich(590, 415, '[M]urat [B]ey', 28)}</g>`),

    'tr-buyuk-harfler-yer': () => {
      const sign = (x, src, d) => `<g ${lsStep(2, 'ls-pop ls-d' + d)}><rect x="${x}" y="170" width="230" height="56" rx="8" fill="#fff" stroke="#2f6fb5" stroke-width="5"/>${rich(x + 115, 206, src, 21)}</g>`;
      return lsSvg(`
      ${lsLabel(400, 42, '📍 Yer adları büyük harfle başlar', 0)}
      ${[['[T]ürkiye', 'ülke'], ['[A]nkara', 'şehir'], ['[U]rla', 'ilçe']].map(([n, k], i) => `<g ${lsStep(1, 'ls-rise ls-d' + i)}>${box(40 + i * 245, 70, 230, 82)}${rich(155 + i * 245, 113, n, 34)}<text x="${155 + i * 245}" y="140" text-anchor="middle" class="ls-small">${k}</text></g>`).join('')}
      ${sign(40, '[Ç]içek [M]ahallesi', 0)}${sign(285, '[A]tatürk [C]addesi', 1)}${sign(530, '[L]ale [S]okağı', 2)}
      <g ${lsStep(3, 'ls-rise')}>${box(40, 245, 230, 100)}<path d="M62 325 L102 262 L122 290 L135 272 L170 325 Z" fill="#8d7b68"/><path d="M93 276 L102 262 L111 276 Z" fill="#fff"/>${rich(215, 303, '[A]ğrı', 24)}${rich(215, 331, '[D]ağı', 24)}</g>
      <g ${lsStep(3, 'ls-rise ls-d1')}>${box(285, 245, 230, 100)}<ellipse cx="345" cy="298" rx="42" ry="24" fill="#4fb3e8"/>${rich(455, 303, '[V]an', 24)}${rich(455, 331, '[G]ölü', 24)}</g>
      <g ${lsStep(3, 'ls-rise ls-d2')}>${box(530, 245, 230, 100)}<path d="M545 275 C565 255 575 315 595 295 S610 282 620 300" stroke="#4fb3e8" stroke-width="9" fill="none" stroke-linecap="round"/>${rich(692, 305, '[K]ızılırmak', 21)}</g>
      <g ${lsStep(4, 'ls-rise')}>${box(40, 362, 720, 70)}${rich(400, 408, '[İ]zmir, [E]ge [B]ölgesi’ndedir.', 32)}</g>`);
    },

    'tr-buyuk-harfler-gezegen': () => {
      const YEL = '#ffd34d';
      const planet = (x, y, r, color, name, d) => `<g ${lsStep(1, 'ls-pop ls-d' + d)}><circle cx="${x}" cy="${y}" r="${r}" fill="${color}"/>${rich(x, y + r + 24, name, 18, YEL, false, 'middle', '#fff')}</g>`;
      return lsSvg(`
      <g ${lsStep(0, 'ls-in')}><rect x="30" y="65" width="360" height="370" rx="20" fill="#1d2b4a"/>
        ${[[60, 90], [370, 100], [200, 80], [330, 260], [55, 270], [250, 300]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2" fill="#fff"/>`).join('')}</g>
      ${lsLabel(210, 42, '🔭 Gökyüzü', 0)}
      ${planet(85, 125, 14, '#b0a69a', '[M]erkür', 0)}${planet(205, 125, 20, '#e9c37a', '[V]enüs', 1)}${planet(320, 125, 21, '#3f8fd8', '[D]ünya', 2)}
      ${planet(130, 215, 17, '#d2603a', '[M]ars', 3)}<g ${lsStep(1, 'ls-pop ls-d4')}><circle cx="275" cy="210" r="30" fill="#d9a066"/><path d="M247 203 H303 M249 216 H301" stroke="#b07a48" stroke-width="5"/>${rich(275, 264, '[J]üpiter', 18, YEL, false, 'middle', '#fff')}</g>
      <g ${lsStep(2, 'ls-rise')}>${rich(210, 318, '[A]y, [D]ünya’nın uydusudur.', 22, YEL, false, 'middle', '#fff')}${rich(210, 356, '[G]üneş bir yıldızdır.', 22, YEL, false, 'middle', '#fff')}
        ${lsEmoji(170, 400, '☀️', 34)}${lsEmoji(250, 400, '🌙', 30)}</g>
      ${lsLabel(590, 42, '📚 Kitaplık', 0, 'ls-d1')}
      <g ${lsStep(3, 'ls-rise')}><rect x="420" y="70" width="165" height="205" rx="10" fill="#8e5cc8"/><rect x="430" y="80" width="145" height="185" rx="6" fill="none" stroke="#fff" stroke-width="2"/>
        ${['[D]ede', '[K]orkut', '[H]ikâyeleri'].map((w, i) => rich(502, 135 + i * 34, w, 22, YEL, false, 'middle', '#fff')).join('')}
        <text x="502" y="300" text-anchor="middle" class="ls-small">kitap</text></g>
      <g ${lsStep(3, 'ls-rise ls-d1')}><rect x="600" y="70" width="165" height="205" rx="10" fill="#2eaa83"/>
        ${rich(682, 118, '[B]ilim', 30, YEL, false, 'middle', '#fff')}${rich(682, 156, '[Ç]ocuk', 30, YEL, false, 'middle', '#fff')}${lsEmoji(682, 220, '🔬', 46)}
        <text x="682" y="300" text-anchor="middle" class="ls-small">dergi</text></g>
      <g ${lsStep(4, 'ls-rise')}>${box(410, 318, 360, 117)}${rich(590, 348, '[D]ede [K]orkut [H]ikâyeleri', 19)}${T(590, 372, 'kitabını okudum.', 19)}
        ${rich(590, 404, 'Her ay [B]ilim [Ç]ocuk', 19)}${T(590, 427, 'dergisini okurum.', 19)}</g>`);
    },

    'tr-buyuk-harfler-millet': () => lsSvg(`
      ${lsLabel(400, 42, '🗣️ Millet ve dil adları', 0)}
      <g ${lsStep(1, 'ls-rise')}>${box(40, 70, 720, 64)}${rich(400, 113, '[T]ürk milleti [T]ürkçe konuşur.', 30)}</g>
      <g ${lsStep(1, 'ls-rise ls-d1')}>${box(40, 146, 720, 64)}${rich(400, 189, 'Kardeşim [İ]ngilizce öğreniyor.', 30)}</g>
      <g ${lsStep(2, 'ls-rise')}>${box(40, 226, 720, 104)}${lsEmoji(85, 278, '🏛️', 46)}
        ${rich(420, 270, '[T]ürkiye [B]üyük [M]illet [M]eclisi', 30)}
        <circle cx="398" cy="309" r="16" fill="#e30a17"/><circle cx="405" cy="306" r="13" fill="#fff"/>${rich(470, 318, '[K]ızılay', 28)}</g>
      <g ${lsStep(3, 'ls-rise')}>${box(40, 346, 720, 88)}${lsEmoji(110, 390, '🏫', 52)}
        <rect x="230" y="363" width="440" height="56" rx="8" fill="#fff" stroke="#08796e" stroke-width="5"/>${rich(450, 400, '[C]umhuriyet [İ]lkokulu', 30)}</g>`),

    'tr-buyuk-harfler-tarih': () => {
      const row = (y, h, label, color, src, size, step, accent = RED) => `<g ${lsStep(step, 'ls-rise')}>${box(40, y, 720, h)}${tag(55, y + h / 2 - 18, 165, label, color)}
        ${rich(490, y + h / 2 + size * 0.36, src, size, accent)}</g>`;
      return lsSvg(`
      ${lsLabel(400, 42, '📅 Gün ve ay adları', 0)}
      ${row(70, 82, 'belirli tarih', '#08796e', '29 [E]kim 1923', 44, 1)}
      ${row(164, 82, 'belirli tarih', '#08796e', '23 [N]isan 1920 [C]uma', 40, 2)}
      ${row(262, 76, 'belirli değil', '#e8832f', 'Her [p]azartesi kütüphaneye gideriz.', 24, 3, GREEN)}
      ${row(350, 76, 'belirli değil', '#e8832f', 'Bu yıl tatile [a]ğustos ayında gideceğiz.', 22, 4, GREEN)}`);
    },

    'tr-buyuk-harfler-dikkat': () => {
      const row = (y, wrong, right, step, size = 24) => `<g ${lsStep(step, 'ls-rise')}>${box(40, y, 340, 62)}${no(72, y + 31)}${rich(230, y + 40, wrong, size)}</g>
        <text ${lsStep(step, 'ls-pop ls-d1')} x="400" y="${y + 41}" text-anchor="middle" font-size="28">➜</text>
        <g ${lsStep(step, 'ls-rise ls-d2')}>${box(420, y, 340, 62)}${ok(452, y + 31)}${rich(610, y + 40, right, size, GREEN)}</g>`;
      return lsSvg(`
      ${lsPill(400, 45, '⚠️ DİKKAT!', '#d9472b', 0)}
      ${lsLabel(400, 96, 'Bunlar küçük harfle yazılır', 0, 'ls-d1')}
      ${row(124, 'Ali [D]ayı', 'Ali [d]ayı', 1, 30)}
      ${row(198, '[D]ünya kadar işim var', '[d]ünya kadar işim var', 2, 22)}
      ${row(272, 'Bu [A]y çok kitap okudum', 'Bu [a]y çok kitap okudum', 3, 22)}
      ${row(346, 'Elma, [A]rmut ve muz', 'Elma, [a]rmut ve muz', 4, 24)}`);
    },

    'tr-buyuk-harfler-duzelt': () => lsSvg(`
      ${lsLabel(400, 40, '🔍 Yanlışları bulalım', 0)}
      <g ${lsStep(0, 'ls-rise ls-d1')}>${box(40, 64, 720, 120)}${no(80, 102)}${T(410, 112, 'selin dün ankara’ya gitti.', 32)}</g>
      ${fix(225, 160, 'selin', '[S]elin', 1)}${fix(575, 160, 'ankara’ya', '[A]nkara’ya', 2)}
      <g ${lsStep(3, 'ls-rise')}>${box(40, 196, 720, 110)}${no(80, 230)}${T(410, 240, 'Ablam fransızca öğreniyor.', 32)}</g>
      ${fix(400, 285, 'fransızca', '[F]ransızca', 3, 'ls-d1')}
      <g ${lsStep(4, 'ls-rise')}>${box(40, 318, 720, 116)}${no(80, 352)}${T(410, 362, 'kızılırmak, karadeniz’e dökülür.', 32)}</g>
      ${fix(225, 410, 'kızılırmak', '[K]ızılırmak', 4, 'ls-d1')}${fix(575, 410, 'karadeniz’e', '[K]aradeniz’e', 4, 'ls-d2')}`),

    'tr-buyuk-harfler-summary': () => lsSummary([['🔠', 'Cümleler büyük|harfle başlar'], ['👤', 'Kişi, hayvan ve|yer adları'], ['🪐', 'Gezegen, kitap,|dergi, dil adları'], ['⚠️', 'dayı, teyze, dünya|kadar küçük yazılır']], 'Hazırsan mini teste geçelim!'),
  });
}
