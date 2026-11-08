/* Scenes for the video lesson "Metnin Konusu ve Ana Fikri". Loaded when the lesson opens (see loadLessonScenes in lessons.js). */
{
  const RED = '#e25d3f', GREEN = '#1f9a73', TEAL = '#08796e', ORANGE = '#e8832f', INK = '#22392f';
  const T = (x, y, text, size = 24, extra = '', anchor = 'middle') => `<text x="${x}" y="${y}" text-anchor="${anchor}" class="ls-cap" style="font-size:${size}px" ${extra}>${text}</text>`;
  const TB = (x, y, text, size, color) => `<text x="${x}" y="${y}" text-anchor="middle" class="ls-cap" style="font-size:${size}px;fill:${color};font-weight:900">${text}</text>`;
  // Parts in [brackets] are drawn bold in colour; with ghost the rest is invisible, so drawn over the
  // same text it colours words later without moving anything.
  const rich = (x, y, src, size, color = RED, ghost = false, anchor = 'middle') => `<text x="${x}" y="${y}" text-anchor="${anchor}" class="ls-cap" style="font-size:${size}px">${src.split(/(\[[^\]]*\])/).filter(Boolean)
    .map(p => p[0] === '[' ? `<tspan style="fill:${color};font-weight:900">${p.slice(1, -1)}</tspan>` : `<tspan${ghost ? ' style="fill-opacity:0"' : ''}>${p}</tspan>`).join('')}</text>`;
  const box = (x, y, w, h, extra = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" class="ls-card" ${extra}/>`;
  const tag = (x, y, w, text, color) => `<rect x="${x}" y="${y}" width="${w}" height="38" rx="19" fill="${color}"/><text x="${x + w / 2}" y="${y + 26}" text-anchor="middle" style="font:800 18px Segoe UI,Arial,sans-serif;fill:#fff">${text}</text>`;
  const ok = (x, y) => `<circle cx="${x}" cy="${y}" r="16" fill="#2eaa83"/><path d="M${x - 8} ${y} l6 7 l11 -13" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  const no = (x, y) => `<circle cx="${x}" cy="${y}" r="16" fill="${RED}"/><path d="M${x - 7} ${y - 7} l14 14 M${x + 7} ${y - 7} l-14 14" stroke="#fff" stroke-width="5" stroke-linecap="round"/>`;
  const sapling = (x, y) => `<path d="M${x} ${y} V${y - 40}" stroke="#7a5230" stroke-width="5"/><ellipse cx="${x - 11}" cy="${y - 42}" rx="12" ry="7" fill="#58b368"/><ellipse cx="${x + 11}" cy="${y - 48}" rx="12" ry="7" fill="#58b368"/><rect x="${x - 26}" y="${y}" width="52" height="8" rx="4" fill="#9c6b3f"/>`;
  const tree = (x, y) => `<rect x="${x - 10}" y="${y - 70}" width="20" height="70" fill="#7a5230"/><circle cx="${x}" cy="${y - 100}" r="45" fill="#3e9d4f"/><circle cx="${x - 35}" cy="${y - 78}" r="28" fill="#4bb05d"/><circle cx="${x + 35}" cy="${y - 78}" r="28" fill="#4bb05d"/>`;
  const cicada = (x, y, sad = false) => `<g transform="translate(${x} ${y})"><ellipse cx="-14" cy="-6" rx="26" ry="11" fill="#cfe9f7" stroke="#7aa6bf" stroke-width="2" transform="rotate(-20 -14 -6)"/><ellipse cx="14" cy="-6" rx="26" ry="11" fill="#cfe9f7" stroke="#7aa6bf" stroke-width="2" transform="rotate(20 14 -6)"/>
    <ellipse cx="0" cy="4" rx="13" ry="24" fill="#6b8e23"/><circle cx="-8" cy="-18" r="5" fill="#2c3e50"/><circle cx="8" cy="-18" r="5" fill="#2c3e50"/>${sad ? '<path d="M-6 0 Q0 -5 6 0" stroke="#2c3e50" stroke-width="2" fill="none"/>' : '<path d="M-6 -4 Q0 2 6 -4" stroke="#2c3e50" stroke-width="2" fill="none"/>'}</g>`;

  Object.assign(LESSON_SCENES, {
    'tr-konu-ana-fikir-intro': () => lsSvg(`
      <g ${lsStep(0, 'ls-rise')}><rect x="50" y="80" width="300" height="200" rx="18" fill="#2c3e50"/><rect x="66" y="96" width="268" height="168" rx="10" fill="#bfe6ff"/>
        <rect x="66" y="224" width="268" height="40" fill="#8fd18a"/><circle cx="290" cy="130" r="20" fill="#ffd34d"/>${lsKid(150, 228, 0.8, '#e8832f')}${lsEmoji(230, 205, '🐶', 40)}
        <rect x="185" y="280" width="30" height="30" fill="#5d6d7e"/><rect x="140" y="306" width="120" height="12" rx="6" fill="#5d6d7e"/></g>
      ${lsLabel(200, 360, '🗣️ Tek cümleyle anlat!', 0, 'ls-d1')}
      <g ${lsStep(1, 'ls-rise')}>${box(390, 80, 370, 110)}${T(575, 122, '❓ Neyi anlatıyor?', 28)}</g>${lsPill(575, 165, 'KONU', TEAL, 1, 'ls-d1')}
      <g ${lsStep(2, 'ls-rise')}>${box(390, 210, 370, 110)}${T(575, 252, '❓ Ne öğretiyor?', 28)}</g>${lsPill(575, 295, 'ANA FİKİR', ORANGE, 2, 'ls-d1')}
      ${lsPill(575, 380, '📖 Metinlerde de var!', '#4c8be6', 3)}`),

    'tr-konu-ana-fikir-konu': () => lsSvg(`
      <g ${lsStep(0, 'ls-rise')}>${box(40, 60, 720, 110)}${tag(60, 96, 140, 'KONU', TEAL)}${T(470, 106, 'Metinde anlatılan', 28)}${T(470, 144, 'olay ya da düşünce', 28)}</g>
      <g ${lsStep(1, 'ls-pop')}><rect x="90" y="190" width="620" height="64" rx="32" fill="#fff6cc" stroke="#f2c94c" stroke-width="4"/>${T(400, 233, '🔎 Bu metin neyi anlatıyor?', 30)}</g>
      ${lsPill(170, 300, 'Kitap sevgisi', TEAL, 2)}${lsPill(395, 300, 'Arkadaşlık', TEAL, 2, 'ls-d1')}${lsPill(615, 300, 'Okulun ilk günü', TEAL, 2, 'ls-d2')}
      <text ${lsStep(2, 'ls-small ls-d3')} x="400" y="345" text-anchor="middle">kısa bir söz grubu</text>
      <g ${lsStep(3, 'ls-rise')}>${box(40, 362, 345, 70)}${lsEmoji(90, 397, '📰', 36)}${T(240, 406, 'Başlığa bak', 24)}</g>
      <g ${lsStep(3, 'ls-rise ls-d1')}>${box(415, 362, 345, 70)}${lsEmoji(460, 397, '🔁', 34)}${T(610, 406, 'Tekrar eden kelimeler', 22)}</g>`),

    'tr-konu-ana-fikir-metin': () => {
      const lines = [['Mert ile dedesi bahçeye', 1], ['küçük bir [fidan] dikti.', 1], ['Mert her gün [fidanı] [suladı],', 1], ['ona özenle baktı.', 1],
        ['Yıllar geçti, [fidan]', 2], ['kocaman bir [ağaç] oldu.', 2], ['Şimdi Mert, [ağacın]', 2], ['gölgesinde kitap okuyor.', 2]];
      return lsSvg(`
      <g ${lsStep(0, 'ls-rise')}>${box(30, 58, 440, 285)}${TB(250, 93, 'Mert’in Fidanı', 24, TEAL)}</g>
      ${lines.map(([src, step], i) => `<g ${lsStep(step, 'ls-in ls-d' + (i % 4))}>${rich(250, 128 + i * 28, src, 21, INK)}</g>`).join('')}
      <g ${lsStep(3)}>${lines.map(([src], i) => src.includes('[') ? rich(250, 128 + i * 28, src, 21, GREEN, true) : '').join('')}</g>
      <g ${lsStep(1, 'ls-rise')}>${box(490, 58, 280, 135)}${sapling(570, 165)}${lsKid(690, 160, 0.75, '#4c8be6')}${lsEmoji(625, 112, '💧', 30)}</g>
      <g ${lsStep(2, 'ls-rise')}>${box(490, 205, 280, 138)}${tree(570, 335)}${lsKid(700, 315, 0.75, '#4c8be6')}${lsEmoji(728, 278, '📖', 26)}</g>
      <g ${lsStep(4, 'ls-pop')}>${box(30, 358, 740, 76)}${tag(45, 377, 105, 'KONU', TEAL)}${T(460, 405, 'Dikilen bir fidanın bakımla ağaca dönüşmesi', 23)}</g>`);
    },

    'tr-konu-ana-fikir-anafikir': () => lsSvg(`
      <g ${lsStep(0, 'ls-rise')}>${box(40, 60, 720, 110)}${tag(60, 96, 150, 'ANA FİKİR', ORANGE)}${lsEmoji(250, 115, '💡', 44)}${T(500, 106, 'Yazarın vermek istediği', 28)}${T(500, 144, 'asıl mesaj', 28)}</g>
      <g ${lsStep(1, 'ls-pop')}><rect x="60" y="188" width="680" height="62" rx="31" fill="#fff6cc" stroke="#f2c94c" stroke-width="4"/>${T(400, 229, '🔎 Yazar bana ne öğretmek istiyor?', 28)}</g>
      <g ${lsStep(2, 'ls-rise')}>${box(40, 268, 300, 92)}${TB(190, 298, 'Konu', 20, TEAL)}${T(190, 336, 'Kitap sevgisi', 26)}</g>
      <g ${lsStep(2, 'ls-rise ls-d1')}>${box(360, 268, 400, 92)}${TB(560, 298, 'Ana fikir', 20, ORANGE)}${T(560, 336, 'Kitap okumak bizi geliştirir.', 24)}</g>
      <text ${lsStep(2, 'ls-small ls-d2')} x="190" y="382" text-anchor="middle">kısa söz grubu</text>
      <text ${lsStep(2, 'ls-small ls-d2')} x="560" y="382" text-anchor="middle">tam bir cümle</text>
      <g ${lsStep(3, 'ls-pop')}><rect x="70" y="398" width="34" height="42" rx="4" fill="#fff" stroke="#9fb3a8" stroke-width="2"/><line x1="78" y1="410" x2="96" y2="410" stroke="#9fb3a8" stroke-width="3"/><line x1="78" y1="419" x2="96" y2="419" stroke="#9fb3a8" stroke-width="3"/><rect x="76" y="425" width="22" height="7" fill="#f2c94c"/></g>
      ${lsLabel(400, 422, '👀 Metnin sonuna dikkat et!', 3, 'ls-d1')}`),

    'tr-konu-ana-fikir-mert': () => lsSvg(`
      <g ${lsStep(0, 'ls-rise')}>${box(250, 20, 300, 44)}${T(400, 50, '🌱 Mert’in Fidanı 🌳', 22)}</g>
      <g ${lsStep(1, 'ls-rise')}>${box(40, 80, 350, 115)}${lsEmoji(85, 120, '💧', 36)}${T(235, 128, 'Her gün suladı', 26)}${tag(140, 145, 190, 'sabır ve emek', TEAL)}</g>
      <g ${lsStep(2, 'ls-rise')}>${box(410, 80, 350, 115)}${lsEmoji(455, 120, '🌳', 40)}${T(605, 128, 'Ağaç oldu', 26)}${tag(510, 145, 190, 'güzel sonuç', GREEN)}</g>
      <g ${lsStep(3, 'ls-pop')}><rect x="40" y="212" width="720" height="104" rx="20" fill="#fff6cc" stroke="${ORANGE}" stroke-width="4"/>${tag(310, 222, 180, 'ANA FİKİR', ORANGE)}
        ${T(400, 297, 'Sabırla emek verirsek güzel sonuçlar alırız.', 27)}</g>
      <g ${lsStep(4, 'ls-rise')}>${box(40, 336, 350, 96)}${tag(125, 348, 180, 'KONU', TEAL)}${T(215, 415, 'Neyi anlatıyor?', 24)}</g>
      <g ${lsStep(4, 'ls-rise ls-d1')}>${box(410, 336, 350, 96)}${tag(495, 348, 180, 'ANA FİKİR', ORANGE)}${T(585, 415, 'Ne öğretiyor?', 24)}</g>`),

    'tr-konu-ana-fikir-masal': () => lsSvg(`
      ${lsLabel(400, 40, '🐜 Karınca ile Ağustos Böceği', 0)}
      <g ${lsStep(1, 'ls-rise')}><rect x="40" y="65" width="350" height="190" rx="18" fill="#fff3c4" stroke="#f2c94c" stroke-width="3"/>${T(90, 100, 'YAZ', 22)}${lsEmoji(345, 105, '☀️', 40)}
        ${lsEmoji(110, 190, '🐜', 46)}${lsEmoji(160, 200, '🌾', 34)}${cicada(285, 190)}${lsEmoji(330, 160, '🎵', 28)}${lsEmoji(240, 150, '🎶', 24)}
        <text x="125" y="240" text-anchor="middle" class="ls-small">karınca</text><text x="285" y="240" text-anchor="middle" class="ls-small">ağustos böceği</text></g>
      <g ${lsStep(2, 'ls-rise')}><rect x="410" y="65" width="350" height="190" rx="18" fill="#e3f1fb" stroke="#9cc9e6" stroke-width="3"/>${T(460, 100, 'KIŞ', 22)}${lsEmoji(715, 100, '❄️', 34)}${lsEmoji(620, 95, '❄️', 24)}
        ${lsEmoji(480, 190, '🐜', 46)}${lsEmoji(530, 205, '🌾', 30)}${lsEmoji(560, 205, '🌾', 30)}${cicada(670, 195, true)}${lsEmoji(710, 160, '💧', 20)}</g>
      <g ${lsStep(3, 'ls-pop')}>${box(40, 268, 720, 76)}${tag(55, 287, 120, 'KONU', TEAL)}${T(470, 299, 'Karıncanın çalışkanlığı,', 23)}${T(470, 329, 'ağustos böceğinin tembelliği', 23)}</g>
      <g ${lsStep(4, 'ls-pop')}><rect x="40" y="356" width="720" height="78" rx="18" fill="#fff6cc" stroke="${ORANGE}" stroke-width="3"/>${tag(55, 376, 150, 'ANA FİKİR', ORANGE)}
        ${T(480, 388, 'Geleceğimizi düşünerek', 24)}${T(480, 420, 'bugünden çalışmalıyız.', 24)}</g>`),

    'tr-konu-ana-fikir-duygu': () => lsSvg(`
      ${lsLabel(400, 40, '❤️ Şiirde ana duygu', 0)}
      <g ${lsStep(1, 'ls-in')}>${T(400, 88, 'Şiirin bize en çok hissettirdiği duygu', 24)}</g>
      <g ${lsStep(1, 'ls-rise ls-d1')}>${box(40, 110, 400, 255)}${lsEmoji(410, 140, '🌸', 30)}</g>
      ${['Annem, tatlı sesli annem,', 'Her sabah öper beni.', 'Sarılınca boynuna,', 'Unuturum her derdimi.'].map((l, i) => `<g ${lsStep(2, 'ls-in ls-d' + i)}>${T(240, 175 + i * 48, l, 26, 'font-style="italic"')}</g>`).join('')}
      <g ${lsStep(3, 'ls-pop')}>${box(470, 110, 290, 255)}${lsEmoji(615, 185, '❤️', 74)}<text x="615" y="262" text-anchor="middle" class="ls-small">ana duygu</text></g>
      ${lsPill(615, 310, 'Anne sevgisi', RED, 3, 'ls-d1')}
      ${lsPill(150, 405, 'Vatan sevgisi', '#4c8be6', 4)}${lsPill(360, 405, 'Doğa sevgisi', GREEN, 4, 'ls-d1')}${lsPill(530, 405, 'Özlem', '#8e5cc8', 4, 'ls-d2')}${lsPill(650, 405, 'Hüzün', '#5d6d7e', 4, 'ls-d3')}`),

    'tr-konu-ana-fikir-tahmin': () => lsSvg(`
      ${lsLabel(400, 40, '🔮 Okumadan önce tahmin et', 0)}
      <g ${lsStep(1, 'ls-rise')}>${box(40, 64, 420, 366)}${TB(250, 108, 'Denizimizi Koruyalım', 30, TEAL)}<line x1="80" y1="122" x2="420" y2="122" stroke="#dbe6de" stroke-width="3"/></g>
      <g ${lsStep(2, 'ls-rise')}><rect x="62" y="140" width="376" height="270" rx="12" fill="url(#lsSea)"/>
        ${lsBottle('#bfe3d8')(130, 210)}<g transform="rotate(70 330 190)">${lsBottle('#f6d7a7')(330, 190)}</g>${lsBottle('#cfd8f0')(220, 345)}
        ${lsFish(300, 300, 1, '#ff9f43')}<path d="M270 312 Q278 306 286 312" stroke="#1b2a35" stroke-width="2.5" fill="none"/>${lsEmoji(262, 280, '💧', 16)}</g>
      <g ${lsStep(3, 'ls-pop')}><text x="500" y="200" text-anchor="middle" font-size="40">➜</text>${box(530, 140, 230, 130)}${T(645, 180, '🤔 Konu', 24)}${T(645, 218, 'Denizlerin', 26)}${T(645, 252, 'kirlenmesi', 26)}</g>
      <g ${lsStep(4, 'ls-rise')}>${box(490, 300, 270, 120)}${lsEmoji(540, 360, '🔍', 40)}${T(660, 352, 'Okurken', 24)}${T(660, 386, 'kontrol et', 24)}</g>`),

    'tr-konu-ana-fikir-dikkat': () => {
      const row = (y, src, mark, label, color, step) => `<g ${lsStep(step, 'ls-rise')}>${box(40, y, 720, 62)}${mark(75, y + 31)}${T(110, y + 40, src, 25, '', 'start')}${tag(575, y + 12, 170, label, color)}</g>`;
      return lsSvg(`
      ${lsPill(400, 40, '⚠️ DİKKAT!', '#d9472b', 0)}
      ${lsLabel(400, 90, 'Mert’in Fidanı metninin konusu?', 0, 'ls-d1')}
      ${row(118, 'Mert’in kitap okuması', no, 'ayrıntı', RED, 1)}
      ${row(190, 'Doğa', no, 'çok genel', RED, 2)}
      ${row(262, 'Dikilen fidanın bakımla ağaç olması', ok, 'metnin tamamı', GREEN, 3)}
      <g ${lsStep(4, 'ls-rise')}>${box(40, 344, 350, 86)}${tag(120, 354, 190, 'KONU', TEAL)}${T(215, 416, 'Neyi anlatıyor?', 22)}</g>
      <text ${lsStep(4, 'ls-pop ls-d1')} x="400" y="400" text-anchor="middle" style="font:900 34px Segoe UI,Arial,sans-serif;fill:${RED}">≠</text>
      <g ${lsStep(4, 'ls-rise ls-d1')}>${box(410, 344, 350, 86)}${tag(490, 354, 190, 'ANA FİKİR', ORANGE)}${T(585, 416, 'Ne öğretiyor?', 22)}</g>`);
    },

    'tr-konu-ana-fikir-summary': () => lsSummary([['📖', 'Konu: Metin|neyi anlatıyor?'], ['💡', 'Ana fikir: Metin|ne öğretiyor?'], ['❤️', 'Şiirde ana|duygu aranır'], ['🖼️', 'Başlık ve görsel|ipucu verir']], 'Hazırsan mini teste geçelim!'),
  });
}
