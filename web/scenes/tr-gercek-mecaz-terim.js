/* Scenes for the video lesson "Gerçek, Mecaz ve Terim Anlam". Loaded when the lesson opens (see loadLessonScenes in lessons.js). */
{
  const BLUE = '#2f6fb5', ORANGE = '#e8832f', PURPLE = '#8e5cc8', RED = '#e25d3f';
  const T = (x, y, text, size = 24, extra = '', anchor = 'middle') => `<text x="${x}" y="${y}" text-anchor="${anchor}" class="ls-cap" style="font-size:${size}px" ${extra}>${text}</text>`;
  const TB = (x, y, text, size, color, anchor = 'middle') => `<text x="${x}" y="${y}" text-anchor="${anchor}" class="ls-cap" style="font-size:${size}px;fill:${color};font-weight:900">${text}</text>`;
  // Parts in [brackets] (the word we look at) are drawn bold in colour.
  const rich = (x, y, src, size, color, anchor = 'middle') => `<text x="${x}" y="${y}" text-anchor="${anchor}" class="ls-cap" style="font-size:${size}px">${src.split(/(\[[^\]]*\])/).filter(Boolean)
    .map(p => p[0] === '[' ? `<tspan style="fill:${color};font-weight:900">${p.slice(1, -1)}</tspan>` : `<tspan>${p}</tspan>`).join('')}</text>`;
  const box = (x, y, w, h, extra = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" class="ls-card" ${extra}/>`;
  const tag = (cx, y, w, text, color) => `<rect x="${cx - w / 2}" y="${y}" width="${w}" height="34" rx="17" fill="${color}"/><text x="${cx}" y="${y + 23}" text-anchor="middle" style="font:800 16px Segoe UI,Arial,sans-serif;fill:#fff">${text}</text>`;
  const small = (x, y, text, anchor = 'middle') => `<text x="${x}" y="${y}" text-anchor="${anchor}" class="ls-small">${text}</text>`;
  // Gerçek / mecaz scenes: a tall tile on the left, three example rows and a closing label on the right.
  const kindScene = (name, color, icon, defLines, rows, closing) => lsSvg(`
      <g ${lsStep(0, 'ls-pop')}>${box(40, 70, 200, 340)}${TB(140, 135, name, 30, color)}${TB(140, 170, 'ANLAM', 30, color)}${lsEmoji(140, 245, icon, 64)}
        ${defLines.map((l, i) => small(140, 325 + i * 24, l)).join('')}</g>
      ${rows.map(([emoji, src, meaning, size = 22], i) => `<g ${lsStep(i + 1, 'ls-rise')}>${box(260, 70 + i * 92, 500, 80)}${lsEmoji(300, 110 + i * 92, emoji, 38)}
        ${rich(340, 102 + i * 92, src, size, color, 'start')}<text x="340" y="${132 + i * 92}" class="ls-small" style="fill:${color}">➜ ${meaning}</text></g>`).join('')}
      ${lsLabel(510, 380, closing, 4)}`);
  const castle = (x, y) => `<g transform="translate(${x} ${y})"><rect x="-40" y="-30" width="80" height="50" fill="#b9a68d"/><rect x="-52" y="-50" width="26" height="70" fill="#a8957c"/><rect x="26" y="-50" width="26" height="70" fill="#a8957c"/>
    ${[-52, -39, 26, 39].map(d => `<rect x="${d}" y="-60" width="9" height="11" fill="#a8957c"/>`).join('')}<path d="M-12 20 V0 a12 12 0 0 1 24 0 V20 Z" fill="#6b5a45"/></g>`;
  const goal = (x, y) => `<g transform="translate(${x} ${y})"><rect x="-50" y="-35" width="100" height="55" fill="none" stroke="#fff" stroke-width="6"/>
    ${[-30, -10, 10, 30].map(d => `<line x1="${d}" y1="-35" x2="${d}" y2="20" stroke="#cfd8dc" stroke-width="1.5"/>`).join('')}${[-17, 2].map(d => `<line x1="-50" y1="${d}" x2="50" y2="${d}" stroke="#cfd8dc" stroke-width="1.5"/>`).join('')}
    <rect x="-60" y="20" width="120" height="8" fill="#58b368"/><text x="18" y="12" font-size="22" text-anchor="middle">⚽</text></g>`;
  const cube = (x, y) => `<g transform="translate(${x} ${y})"><path d="M-25 -10 L5 -10 L5 20 L-25 20 Z" fill="#c9b6ea" stroke="${PURPLE}" stroke-width="2.5"/><path d="M-25 -10 L-10 -25 L20 -25 L5 -10 Z" fill="#e2d6f5" stroke="${PURPLE}" stroke-width="2.5"/><path d="M5 -10 L20 -25 L20 5 L5 20 Z" fill="#b39ddb" stroke="${PURPLE}" stroke-width="2.5"/></g>`;

  Object.assign(LESSON_SCENES, {
    'tr-gercek-mecaz-terim-intro': () => lsSvg(`
      <g ${lsStep(0, 'ls-rise')}>${box(40, 60, 350, 250)}${lsEmoji(150, 135, '💔', 70)}${lsEmoji(250, 125, '❓', 46)}${T(215, 230, '“Kalbimi kırdın.”', 32)}</g>
      <g ${lsStep(1, 'ls-pop')}>${lsKid(355, 285, 0.55, '#4c8be6')}</g>${lsPill(190, 280, '= çok üzüldü', ORANGE, 1, 'ls-d1')}
      <g ${lsStep(2, 'ls-rise')}>${box(410, 60, 350, 250)}
        <path d="M510 92 L552 92 L547 115 L558 127 L546 140 L540 165 L518 165 Z" fill="#d6eef8" stroke="#6aa3c0" stroke-width="3"/>
        <path d="M580 98 L620 98 L612 172 L592 172 L600 150 L588 136 L598 118 Z" fill="#d6eef8" stroke="#6aa3c0" stroke-width="3" transform="rotate(16 600 135)"/>
        <path d="M560 182 l10 -8 l6 9 Z M640 180 l12 -4 l-2 10 Z M675 170 l8 -9 l5 8 Z" fill="#a9d2e6"/>
        ${T(585, 230, 'Bardak kırıldı.', 32)}</g>${lsPill(585, 280, '= parçalandı', BLUE, 2, 'ls-d1')}
      ${lsPill(210, 395, 'Gerçek', BLUE, 3)}${lsPill(400, 395, 'Mecaz', ORANGE, 3, 'ls-d1')}${lsPill(590, 395, 'Terim', PURPLE, 3, 'ls-d2')}`),

    'tr-gercek-mecaz-terim-gercek': () => kindScene('GERÇEK', BLUE, '🎯', ['herkesçe bilinen,', 'akla ilk gelen'], [
      ['🥛', 'Bardak yere düşüp [kırıldı].', 'parçalandı'],
      ['🎒', 'Çantam kitaplarla dolu, çok [ağır].', 'kaldırması zor'],
      ['🍵', 'Bu çay çok [sıcak], dikkat et!', 'ısısı yüksek'],
    ], '💭 Akla ilk gelen anlam'),

    'tr-gercek-mecaz-terim-mecaz': () => kindScene('MECAZ', ORANGE, '🎨', ['gerçek anlamından', 'uzaklaşan yeni anlam'], [
      ['💔', 'Sözlerinle kalbimi [kırdın].', 'üzdün'],
      ['📰', 'Bu haber bana çok [ağır] geldi.', 'çok üzücü'],
      ['😊', '[Sıcak] bir gülümsemeyle karşıladı.', 'içten, sevecen', 21],
    ], '✨ Anlatımı etkili ve renkli yapar'),

    'tr-gercek-mecaz-terim-iki': () => {
      const card = (x, y, emoji, src, meaning, color, step, cls = '') => `<g ${lsStep(step, 'ls-rise ' + cls)}>${box(x, y, 350, 92)}${lsEmoji(x + 36, y + 46, emoji, 36)}
        ${rich(x + 68, y + 42, src, 20, color, 'start')}<text x="${x + 68}" y="${y + 72}" class="ls-small" style="fill:${color}">➜ ${meaning}</text></g>`;
      return lsSvg(`
      ${lsPill(215, 45, 'GERÇEK', BLUE, 0)}${lsPill(585, 45, 'MECAZ', ORANGE, 0, 'ls-d1')}
      ${card(40, 78, '🍰', 'Bu kek çok [tatlı].', 'şekerli', BLUE, 1)}${card(410, 78, '🐱', 'Ne [tatlı] bir kedi yavrusu!', 'sevimli', ORANGE, 2)}
      ${card(40, 183, '🥤', 'Kışın [soğuk] su içme.', 'ısısı düşük', BLUE, 3)}${card(410, 183, '🙄', 'Bize [soğuk] davrandı.', 'ilgisiz, mesafeli', ORANGE, 3, 'ls-d1')}
      ${card(40, 288, '🌿', '[İnce] bir dal kırıldı.', 'kalın olmayan', BLUE, 4)}${card(410, 288, '🤝', 'Çok [ince] düşünceli biri.', 'nazik, düşünceli', ORANGE, 4, 'ls-d1')}
      ${lsLabel(400, 415, '👀 Anlamı cümle belirler', 4, 'ls-d2')}`);
    },

    'tr-gercek-mecaz-terim-terim': () => {
      const card = (x, y, icon, lines, subject, step) => `<g ${lsStep(step, 'ls-rise')}>${box(x, y, 350, 160)}${icon(x + 58, y + 70)}
        ${lines.map((l, i) => rich(x + 222, y + 52 + i * 30 - (lines.length - 1) * 15, l, 21, PURPLE)).join('')}${tag(x + 222, y + 108, 170, subject, PURPLE)}</g>`;
      const tri = (x, y) => `<path d="M${x - 38} ${y + 30} L${x + 38} ${y + 30} L${x - 10} ${y - 32} Z" fill="#e2d6f5" stroke="${PURPLE}" stroke-width="3"/><path d="M${x - 22} ${y + 30} A16 16 0 0 0 ${x - 29} ${y + 17}" stroke="${RED}" stroke-width="4" fill="none"/>`;
      return lsSvg(`
      ${lsLabel(400, 42, '🔬 Bir bilim, sanat, spor ya da meslek dalına ait', 0)}
      ${card(40, 72, tri, ['Üçgenin üç', '[açısı] vardır.'], 'Matematik', 1)}
      ${card(410, 72, (x, y) => lsEmoji(x, y, '🎼', 56), ['Öğretmen', '[notaları] yazdı.'], 'Müzik', 2)}
      ${card(40, 250, (x, y) => `<rect x="${x - 18}" y="${y - 30}" width="36" height="50" rx="5" fill="#f4d03f" transform="rotate(-10 ${x} ${y})"/>${lsEmoji(x + 20, y + 26, '⚽', 26)}`, ['Hakem, [faul] yapan', 'oyuncuya sarı kart', 'gösterdi.'], 'Spor', 3)}
      ${card(410, 250, (x, y) => lsEmoji(x, y, '🪐', 60), ['Mars bir', '[gezegendir].'], 'Fen Bilimleri', 4)}`);
    },

    'tr-gercek-mecaz-terim-kale': () => {
      const card = (x, y, icon, src, kind, color, step) => `<g ${lsStep(step, 'ls-rise')}>${box(x, y, 350, 165)}${icon}
        ${rich(x + 175, y + 118, src, 22, color)}${tag(x + 175, y + 128, 120, kind, color)}</g>`;
      return lsSvg(`
      ${lsLabel(400, 40, '🔁 Aynı kelime, farklı anlam', 0)}
      ${card(40, 64, `<rect x="140" y="72" width="150" height="80" rx="10" fill="#bfe6ff"/>${castle(215, 132)}`, 'Tarihî bir [kaleyi] gezdik.', 'GERÇEK', BLUE, 1)}
      ${card(410, 64, `<rect x="510" y="72" width="150" height="75" rx="10" fill="#8fd18a"/>${goal(585, 112)}`, 'Topu [kaleye] attı, gol oldu!', 'TERİM', PURPLE, 2)}
      ${card(40, 245, lsEmoji(215, 290, '🙂', 52), 'Sabah [yüzümü] yıkadım.', 'GERÇEK', BLUE, 3)}
      ${card(410, 245, cube(585, 295), 'Küpün altı [yüzü] vardır.', 'TERİM', PURPLE, 4)}`);
    },

    'tr-gercek-mecaz-terim-nasil': () => {
      const row = (y, kind, color, lines, step) => `<g ${lsStep(step, 'ls-rise')}>${box(40, y, 720, 100)}${tag(130, y + 33, 150, kind, color)}
        ${lines.map((l, i) => T(470, y + 58 - (lines.length - 1) * 16 + i * 32, l, 24)).join('')}</g>`;
      return lsSvg(`
      ${lsLabel(400, 45, '🔎 Kelimeye cümlenin içinde bak', 0)}
      ${row(85, 'GERÇEK', BLUE, ['Akla ilk gelen anlamında mı?'], 1)}
      ${row(200, 'MECAZ', ORANGE, ['Yeni bir anlam kazanmış mı?', 'Duygu ya da benzetme var mı?'], 2)}
      ${row(315, 'TERİM', PURPLE, ['Bir bilim, sanat, spor ya da', 'meslek dalına mı ait?'], 3)}`);
    },

    'tr-gercek-mecaz-terim-deneme': () => {
      const row = (y, src, kind, color, step) => `<g ${lsStep(step, 'ls-rise')}>${box(40, y, 720, 72)}${rich(65, y + 44, src, 23, color, 'start')}</g>
        <g ${lsStep(step, 'ls-pop ls-d2')}>${tag(670, y + 19, 140, kind, color)}</g>`;
      return lsSvg(`
      ${lsLabel(400, 42, '🤔 Renkli kelime hangi anlamda?', 0)}
      ${row(72, 'Annem bize [sıcak] bir çorba yaptı.', 'GERÇEK', BLUE, 1)}
      ${row(162, 'Ali, arkadaşlarına karşı çok [sıcak] davranır.', 'MECAZ', ORANGE, 2)}
      ${row(252, 'Mıknatısın iki [kutbu] vardır.', 'TERİM', PURPLE, 3)}
      ${row(342, 'Dedem bu işte çok [pişmiş].', 'MECAZ', ORANGE, 4)}`);
    },

    'tr-gercek-mecaz-terim-dikkat': () => {
      const row = (y, emoji, title, sub, step) => `<g ${lsStep(step, 'ls-rise')}>${box(40, y, 720, 78)}${lsEmoji(85, y + 39, emoji, 38)}
        ${TB(130, y + 34, title, 24, '#0b4f45', 'start')}${small(130, y + 62, sub, 'start')}</g>`;
      return lsSvg(`
      ${lsPill(400, 42, '⚠️ DİKKAT!', '#d9472b', 0)}
      ${row(80, '👀', 'Kelimeye cümlenin içinde bak', 'Aynı kelime gerçek, mecaz ya da terim anlamlı olabilir.', 1)}
      ${row(168, '🗣️', 'Deyimler çoğunlukla mecazdır', 'kulak vermek: dinlemek • göz atmak: kısaca bakmak', 2)}
      ${row(256, '📚', 'Terimler derslerde, mesleklerde geçer', 'açı, nota, gezegen, kutup', 3)}
      ${row(344, '✍️', 'Mecaz anlam yanlış değildir', 'Yazılarımızı daha etkili ve güzel yapar.', 4)}`);
    },

    'tr-gercek-mecaz-terim-summary': () => lsSummary([['🎯', 'Gerçek: akla ilk|gelen anlam'], ['🎨', 'Mecaz: sonradan|kazanılan anlam'], ['🔬', 'Terim: bir bilim|dalına özel anlam'], ['👀', 'Anlamı cümlenin|içinde bul']], 'Hazırsan mini teste geçelim!'),
  });
}
