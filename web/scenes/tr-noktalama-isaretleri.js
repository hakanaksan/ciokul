/* Scenes for the video lesson "Noktalama İşaretleri". Loaded when the lesson opens (see loadLessonScenes in lessons.js). */
{
  const RED = '#e25d3f';
  const T = (x, y, text, size = 24, extra = '', anchor = 'middle') => `<text x="${x}" y="${y}" text-anchor="${anchor}" class="ls-cap" style="font-size:${size}px" ${extra}>${text}</text>`;
  // Parts in [brackets] are drawn red and a little larger (the punctuation marks). With ghost the other
  // parts are invisible: drawn over the same sentence, it colours a part later without moving anything.
  const rich = (x, y, src, size, color = RED, ghost = false, anchor = 'middle') => `<text x="${x}" y="${y}" text-anchor="${anchor}" class="ls-cap" style="font-size:${size}px">${src.split(/(\[[^\]]*\])/).filter(Boolean)
    .map(p => p[0] === '[' ? `<tspan style="fill:${color};font-weight:900">${p.slice(1, -1)}</tspan>` : `<tspan${ghost ? ' style="fill-opacity:0"' : ''}>${p}</tspan>`).join('')}</text>`;
  const box = (x, y, w, h, extra = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" class="ls-card" ${extra}/>`;
  // The left tile of a punctuation scene: the mark, large, and its name.
  const tile = (mark, name, markSize = 150, markY = 250, nameSize = 22) => `<g ${lsStep(0, 'ls-pop')}>${box(40, 75, 200, 330)}
    <text x="140" y="${markY}" text-anchor="middle" style="font:900 ${markSize}px Segoe UI,Arial,sans-serif;fill:${RED}">${mark}</text>${T(140, 370, name, nameSize, 'fill="#0b4f45"')}</g>`;
  const example = (y, h, src, step, size = 26, tag = '', cls = '') => `<g ${lsStep(step, 'ls-rise ' + cls)}>${box(270, y, 490, h)}
    ${tag ? `<text x="290" y="${y + h / 2 + 6}" class="ls-small">${tag}</text>` : ''}${rich(tag ? 590 : 515, y + h / 2 + 9, src, size)}</g>`;
  const ok = (x, y) => `<circle cx="${x}" cy="${y}" r="16" fill="#2eaa83"/><path d="M${x - 8} ${y} l6 7 l11 -13" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  const no = (x, y) => `<circle cx="${x}" cy="${y}" r="16" fill="${RED}"/><path d="M${x - 7} ${y - 7} l14 14 M${x + 7} ${y - 7} l-14 14" stroke="#fff" stroke-width="5" stroke-linecap="round"/>`;

  Object.assign(LESSON_SCENES, {
    'tr-noktalama-isaretleri-intro': () => lsSvg(`
      <g ${lsStep(0, 'ls-rise')}><rect x="112" y="250" width="16" height="170" fill="#5d6d7e"/><rect x="80" y="70" width="80" height="190" rx="18" fill="#2c3e50"/>
        <circle cx="120" cy="113" r="22" fill="#e74c3c"/><circle cx="120" cy="165" r="22" fill="#f1c40f"/><circle cx="120" cy="217" r="22" fill="#2ecc71"/></g>
      ${lsLabel(470, 50, 'Trafikte işaretler yol gösterir', 0)}
      ${['.', ',', '?', '!', '“ ”', '’', ':', '…'].map((m, i) => `<g ${lsStep(1, 'ls-pop ls-d' + Math.min(i, 5))}><rect x="${226 + i * 67}" y="110" width="58" height="80" rx="14" class="ls-card"/>
        <text x="${255 + i * 67}" y="168" text-anchor="middle" style="font:900 ${m.length > 1 ? 30 : 46}px Segoe UI,Arial,sans-serif;fill:${RED}">${m}</text></g>`).join('')}
      ${lsLabel(490, 240, '✍️ Noktalama işaretleri', 1)}
      ${lsLabel(490, 320, 'Nasıl okuyacağımızı gösterir', 2)}
      ${lsPill(490, 405, '✨ Bir virgül anlamı değiştirir!', '#e8832f', 3)}`),

    'tr-noktalama-isaretleri-nokta': () => lsSvg(`
      ${tile('.', 'NOKTA', 200, 250, 26)}
      ${example(75, 58, 'Ali okula gitti[.]', 1, 26, 'bitmiş cümle')}
      ${example(143, 58, '23[.]04[.]2026', 2, 26, 'tarih')}
      ${example(211, 58, '13[.]30', 3, 26, 'saat')}
      ${example(279, 58, 'Dr[.] Ahmet Bey', 4, 26, 'kısaltma')}
      <g ${lsStep(5, 'ls-rise')}>${box(270, 347, 490, 58)}<text x="290" y="382" class="ls-small">büyük harfli</text>
        ${T(495, 386, 'TBMM', 24)}${ok(555, 377)}${T(650, 386, 'T.B.M.M.', 24)}${no(730, 377)}</g>`),

    'tr-noktalama-isaretleri-virgul': () => {
      const line2 = 'portakal [ve] muz aldık.';
      return lsSvg(`
      ${tile(',', 'VİRGÜL', 200, 230, 26)}
      <g ${lsStep(1, 'ls-rise')}>${box(270, 75, 490, 92)}${rich(515, 112, 'Pazardan elma[,] armut[,]', 26)}${rich(515, 150, line2.replace(/[[\]]/g, ''), 26)}</g>
      <g ${lsStep(2)}>${rich(515, 150, line2, 26, '#e8832f', true)}</g>
      ${lsLabel(515, 196, '⚠️ ve kelimesinden önce virgül yok', 2, 'ls-d1')}
      <g ${lsStep(3, 'ls-rise')}>${box(270, 220, 490, 58)}${lsEmoji(305, 249, '📣', 32)}${rich(530, 258, 'Arkadaşlar[,] ders başlıyor.', 25)}</g>
      <g ${lsStep(4, 'ls-rise')}>${box(270, 292, 240, 113)}${rich(390, 324, 'Genç[,] kıza', 24)}${T(390, 352, 'hediye aldı.', 24)}
        <text x="390" y="388" text-anchor="middle" class="ls-small">🧑 Hediyeyi genç aldı</text></g>
      <g ${lsStep(5, 'ls-rise')}>${box(520, 292, 240, 113)}${T(640, 324, 'Genç kıza', 24)}${T(640, 352, 'hediye aldı.', 24)}
        <text x="640" y="388" text-anchor="middle" class="ls-small">👧 Hediye genç kıza</text></g>`);
    },

    'tr-noktalama-isaretleri-soru': () => lsSvg(`
      ${tile('?', 'SORU İŞARETİ', 170, 260, 22)}
      ${example(75, 64, '🙋 Benimle kim gelmek ister[?]', 1, 25)}
      ${example(155, 64, 'Ödevini bitirdin [mi?]', 2, 26)}
      ${lsLabel(515, 254, 'mı, mi, mu, mü soru yapar', 2, 'ls-d1')}
      ${lsPill(515, 303, '⚠️ Her soru kelimesi soru yapmaz', '#e8832f', 3)}
      <g ${lsStep(4, 'ls-rise')}>${box(270, 330, 490, 75)}${rich(495, 377, 'Ne zaman geldiğini hatırlamıyorum[.]', 21)}${ok(732, 368)}</g>`),

    'tr-noktalama-isaretleri-unlem': () => lsSvg(`
      ${tile('!', 'ÜNLEM', 170, 260, 26)}
      ${[['😃', 'sevinç'], ['😨', 'korku'], ['😲', 'şaşkınlık']].map(([e, n], i) => `<g ${lsStep(1, 'ls-pop ls-d' + i)}>${box(275 + i * 160, 75, 145, 110)}${lsEmoji(347 + i * 160, 115, e, 44)}${T(347 + i * 160, 170, n, 20)}</g>`).join('')}
      ${example(200, 58, 'Yaşasın, takımımız kazandı[!]', 2, 24)}
      ${example(268, 58, 'Eyvah, süt taştı[!]', 2, 24, '', 'ls-d1')}
      <g ${lsStep(3, 'ls-pop')}><rect x="270" y="342" width="490" height="63" rx="16" fill="#fff6cc" stroke="#f2c94c" stroke-width="4"/>${rich(515, 383, '⚠️ Dikkat[!] Yerler ıslak.', 26)}</g>`),

    'tr-noktalama-isaretleri-tirnak': () => lsSvg(`
      ${tile('“ ”', 'TIRNAK İŞARETİ', 110, 240, 19)}
      <g ${lsStep(1, 'ls-rise')}>${lsKid(335, 240, 1, '#e8832f', '#2b1a10')}${lsKid(690, 240, 1, '#4c8be6')}${lsEmoji(712, 222, '🩹', 24)}
        <path d="M478 140 L350 166 L500 140 Z" fill="#fff" stroke="#08796e" stroke-width="3"/><rect x="380" y="82" width="230" height="60" rx="20" fill="#fff" stroke="#08796e" stroke-width="3"/>
        <rect x="474" y="136" width="30" height="8" fill="#fff"/>${T(495, 120, 'Geçmiş olsun.', 24)}${T(335, 312, 'Deniz', 18)}</g>
      ${example(320, 58, 'Deniz bana [“]Geçmiş olsun.[”] dedi.', 2, 23)}
      ${lsLabel(395, 412, '🔠 Büyük harfle başlar', 3)}${lsLabel(650, 412, '📍 Nokta içeride', 3, 'ls-d1')}`),

    'tr-noktalama-isaretleri-kesme': () => lsSvg(`
      ${tile('’', 'KESME İŞARETİ', 200, 270, 21)}
      <g ${lsStep(1, 'ls-pop')}>${box(270, 75, 490, 120)}${lsEmoji(318, 128, '✂️', 40)}${rich(530, 145, 'Ankara[’]dan', 56)}
        <text x="530" y="182" text-anchor="middle" class="ls-small">özel isim + ek</text></g>
      ${lsLabel(365, 236, 'Atatürk’ün', 2)}${lsLabel(520, 236, 'Denizli’de', 2, 'ls-d1')}${lsLabel(678, 236, 'Türkiye’nin', 2, 'ls-d2')}
      <g ${lsStep(3, 'ls-rise')}>${box(270, 270, 490, 135)}${T(515, 300, 'Özel olmayan isimlerde kesme yok', 20)}
        ${no(305, 337)}${T(365, 346, 'okul’a', 26)}${T(425, 346, '➜', 24)}${ok(470, 337)}${T(527, 346, 'okula', 26)}${lsEmoji(660, 340, '🏫', 34)}
        ${no(305, 380)}${T(365, 389, 'ev’den', 26)}${T(425, 389, '➜', 24)}${ok(470, 380)}${T(527, 389, 'evden', 26)}${lsEmoji(660, 383, '🏠', 34)}</g>`),

    'tr-noktalama-isaretleri-iki-uc': () => lsSvg(`
      <g ${lsStep(0, 'ls-rise')}>${box(30, 70, 360, 335)}<text x="90" y="160" text-anchor="middle" style="font:900 90px Segoe UI,Arial,sans-serif;fill:${RED}">:</text>${T(235, 140, 'İKİ NOKTA', 28, 'fill="#0b4f45"')}</g>
      <g ${lsStep(0, 'ls-rise ls-d1')}>${box(410, 70, 360, 335)}<text x="480" y="160" text-anchor="middle" style="font:900 80px Segoe UI,Arial,sans-serif;fill:${RED}">…</text>${T(630, 140, 'ÜÇ NOKTA', 28, 'fill="#0b4f45"')}</g>
      <g ${lsStep(1)}>${T(210, 210, 'Örnek ya da açıklama', 20)}${T(210, 238, 'yapmadan önce konur', 20)}</g>
      <g ${lsStep(2, 'ls-pop')}><rect x="45" y="270" width="330" height="115" rx="14" fill="#f4f8f5" stroke="#dbe6de" stroke-width="2"/>
        ${rich(210, 315, 'Denizli’de gezilecek yerler[:]', 19)}${T(210, 352, 'Pamukkale ve Karahayıt.', 19)}</g>
      <g ${lsStep(3)}>${T(590, 210, 'Tamamlanmamış cümlelerin', 20)}${T(590, 238, 'sonuna konur', 20)}</g>
      <g ${lsStep(4, 'ls-pop')}><rect x="425" y="270" width="330" height="115" rx="14" fill="#f4f8f5" stroke="#dbe6de" stroke-width="2"/>
        ${rich(590, 312, 'Keskin bir tren düdüğü[…]', 21)}${lsEmoji(560, 352, '🚂', 34)}${lsEmoji(615, 352, '💭', 30)}</g>`),

    'tr-noktalama-isaretleri-cizgi': () => lsSvg(`
      <g ${lsStep(0, 'ls-rise')}>${box(30, 70, 360, 335)}<text x="80" y="150" text-anchor="middle" style="font:900 70px Segoe UI,Arial,sans-serif;fill:${RED}">—</text>${T(240, 142, 'KONUŞMA ÇİZGİSİ', 22, 'fill="#0b4f45"')}</g>
      <g ${lsStep(0, 'ls-rise ls-d1')}>${box(410, 70, 360, 335)}<text x="465" y="160" text-anchor="middle" style="font:900 80px Segoe UI,Arial,sans-serif;fill:${RED}">/</text>${T(620, 142, 'EĞİK ÇİZGİ', 24, 'fill="#0b4f45"')}</g>
      <g ${lsStep(1)}>${T(210, 205, 'Satır başında konuşmaları', 19)}${T(210, 233, 'göstermek için', 19)}</g>
      <g ${lsStep(2, 'ls-pop')}><rect x="45" y="260" width="330" height="125" rx="14" fill="#f4f8f5" stroke="#dbe6de" stroke-width="2"/>
        ${rich(65, 305, '[—] Buyurun öğretmenim.', 21, RED, false, 'start')}${rich(65, 350, '[—] Teşekkür ederim.', 21, RED, false, 'start')}</g>
      <g ${lsStep(3)}>${T(590, 205, 'Adreste apartman ve', 19)}${T(590, 233, 'daire numarası arasında', 19)}</g>
      <g ${lsStep(3, 'ls-pop ls-d1')}><rect x="425" y="260" width="330" height="125" rx="14" fill="#f4f8f5" stroke="#dbe6de" stroke-width="2"/>${rich(590, 298, '🏢 Gül Sokak No: 5[/]3', 22)}</g>
      <g ${lsStep(4)}>${T(590, 335, 'Tarihte de kullanılır', 17)}${rich(590, 368, '23[/]04[/]2026', 24)}</g>`),

    'tr-noktalama-isaretleri-dikkat': () => {
      const row = (y, wrong, right, step) => `<g ${lsStep(step, 'ls-rise')}>${box(40, y, 340, 64)}${no(75, y + 32)}${rich(225, y + 41, wrong, 24)}</g>
        <text ${lsStep(step, 'ls-pop ls-d1')} x="400" y="${y + 42}" text-anchor="middle" font-size="28">➜</text>
        <g ${lsStep(step, 'ls-rise ls-d2')}>${box(420, y, 340, 64)}${ok(455, y + 32)}${rich(605, y + 41, right, 24, '#1f9a73')}</g>`;
      return lsSvg(`
      ${lsPill(400, 45, '⚠️ DİKKAT!', '#d9472b', 0)}
      ${lsLabel(400, 98, 'Sık yapılan noktalama hataları', 0, 'ls-d1')}
      ${row(130, 'Türkiyenin başkenti', 'Türkiye[’]nin başkenti', 1)}
      ${row(210, 'Defterim nerede[.]', 'Defterim nerede[?]', 2)}
      ${row(290, 'Dr[:] Ahmet Bey', 'Dr[.] Ahmet Bey', 3)}
      ${lsLabel(400, 404, '🔊 Sesli oku, kontrol et', 4)}`);
    },

    'tr-noktalama-isaretleri-summary': () => lsSummary([['⚫', 'Nokta: bitmiş|cümlenin sonunda'], ['✋', 'Virgül: sıralanan|kelimelerin arasına'], ['❓', 'Soru işareti ve|ünlem cümle sonunda'], ['💬', 'Tırnak: aktarılan|söz; kesme: özel ad']], 'Hazırsan mini teste geçelim!'),
  });
}
