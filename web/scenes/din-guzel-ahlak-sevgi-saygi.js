/* Scenes for the video lesson "Din Güzel Ahlaktır: Sevgi ve Saygı". Loaded when the lesson opens (see loadLessonScenes in lessons.js). */
{
  const P = 'din-guzel-ahlak-sevgi-saygi';
  const font = (size, weight = 800) => `style="font:${weight} ${size}px Segoe UI,Arial,sans-serif"`;
  const lines = (x, ys, texts, cls = 'ls-small', anchor = 'middle', extra = '') => texts.map((t, i) => `<text x="${x}" y="${ys[i]}" text-anchor="${anchor}" class="${cls}" ${extra}>${t}</text>`).join('');
  // A quote card (ayet or hadis): quote lines and the source under them; (x, y) top left.
  const quote = (x, y, w, h, texts, source, step, cls = 'ls-cap', gap = 26) => `<g ${lsStep(step, 'ls-rise')}><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="#fff8e6" stroke="#e0c27a" stroke-width="3"/>
    ${lines(x + w / 2, texts.map((_, i) => y + 32 + i * gap), texts, cls)}${lines(x + w / 2, [y + 32 + texts.length * gap], [source], 'ls-small', 'middle', 'style="fill:#8a6a2a"')}</g>`;
  // A simple house; (x, y) is the middle of its base.
  const house = (x, y, wall = '#f3efe4', roof = '#c8733d') => `<g transform="translate(${x} ${y})"><rect x="-38" y="-52" width="76" height="52" fill="${wall}" stroke="#c9b98a" stroke-width="3"/><path d="M-48 -50 L0 -88 L48 -50 Z" fill="${roof}"/><rect x="-10" y="-30" width="20" height="30" fill="#8a5a2b"/><rect x="-30" y="-42" width="14" height="14" fill="#9fc6e0"/><rect x="16" y="-42" width="14" height="14" fill="#9fc6e0"/></g>`;
  // A row card with a green tick or a red cross and a sentence.
  const ruleRow = (y, ok, text, step) => `<g ${lsStep(step, 'ls-rise')}><rect x="40" y="${y}" width="720" height="66" rx="18" class="ls-card"/>
    <circle cx="80" cy="${y + 33}" r="20" fill="${ok ? '#2eaa83' : '#e25d3f'}"/><text x="80" y="${y + 41}" text-anchor="middle" fill="#fff" ${font(22, 900)}>${ok ? '✓' : '✗'}</text>
    <text x="115" y="${y + 41}" class="ls-label" ${ok ? '' : 'style="fill:#b2402a"'}>${text}</text></g>`;

  Object.assign(LESSON_SCENES, {
    [`${P}-intro`]: () => lsSvg(`<rect x="0" y="380" width="800" height="70" fill="#bfe3b4"/><circle cx="60" cy="60" r="28" fill="#ffcf4d" class="ls-sun"/>
      ${house(80, 380)}<rect x="250" y="320" width="10" height="60" fill="#8a5a2b"/><circle cx="255" cy="305" r="30" fill="#4f9a4a"/>
      ${lsKid(170, 345, 1.3, '#e85d8f', '#3b2416')}${lsLabel(170, 428, 'Elif', 0)}
      ${lsLabel(520, 70, '👋 Komşusuna selam verdi', 0)}
      ${lsLabel(520, 130, '🤝 Arkadaşına yardım etti', 1)}
      ${lsLabel(520, 190, '✏️ İzin alarak kullandı', 2)}${lsLabel(520, 250, '✅ Sözünü tuttu', 2, 'ls-d1')}
      ${lsPill(520, 315, '💚 Güzel ahlak', '#1f9a73', 3)}
      ${lsPill(390, 420, 'Din ve ahlak', '#08796e', 4)}${lsPill(555, 420, 'Sevgi', '#e85d8f', 4, 'ls-d1')}${lsPill(675, 420, 'Saygı', '#5b7fa6', 4, 'ls-d2')}`),

    [`${P}-ahlak`]: () => {
      const good = [['🗣️', 'Dürüst'], ['🤝', 'Güvenilir'], ['💗', 'Merhametli'], ['⚖️', 'Adaletli']];
      const bad = [['🤥', 'Yalan söylemek'], ['😝', 'Alay etmek'], ['🙊', 'Dedikodu yapmak'], ['😤', 'Kibirlenmek']];
      const list = (x, items, color) => items.map(([e, t], i) => `${lsEmoji(x + 45, 170 + i * 50, e, 30)}<text x="${x + 80}" y="${177 + i * 50}" class="ls-cap" style="fill:${color}">${t}</text>`).join('');
      return lsSvg(`${lsLabel(400, 42, 'Ahlak = huylar ve davranışlar', 0)}
        <g ${lsStep(1, 'ls-rise')}><rect x="40" y="75" width="345" height="300" rx="22" fill="#eef8f2" stroke="#2eaa83" stroke-width="3"/><text x="212" y="118" text-anchor="middle" class="ls-label">😊 Güzel ahlak</text>${list(55, good, '#22392f')}</g>
        <g ${lsStep(2, 'ls-rise')}><rect x="415" y="75" width="345" height="300" rx="22" fill="#fff1ee" stroke="#e25d3f" stroke-width="3"/><text x="587" y="118" text-anchor="middle" class="ls-label" style="fill:#b2402a">🚫 Kötü davranışlar</text>${list(430, bad, '#7a2c1d')}</g>
        ${lsPill(400, 415, 'Dinimiz güzel davranışları öğütler', '#08796e', 3)}`);
    },

    [`${P}-din`]: () => lsSvg(`${lsPill(180, 45, '💚 İnanç', '#5b7fa6', 0)}${lsPill(400, 45, '🕌 İbadet', '#5b7fa6', 0, 'ls-d1')}${lsPill(620, 45, '🌟 Ahlak', '#e8832f', 0, 'ls-d2')}
      ${quote(40, 78, 720, 80, ['“Ben güzel ahlakı tamamlamak için gönderildim.”'], '(Hadis-i şerif)', 1)}
      ${quote(40, 168, 720, 80, ['“Müminlerin iman yönünden en üstünü, ahlakı en güzel olandır.”'], '(Hadis-i şerif)', 2)}
      ${quote(40, 258, 720, 104, ['“Müslüman, elinden ve dilinden diğer', 'Müslümanların emin olduğu kişidir.”'], '(Hadis-i şerif)', 3)}
      ${lsLabel(400, 405, '🤝 Sözüyle ve davranışıyla güven verir', 4)}`),

    [`${P}-ibadet`]: () => lsSvg(`${lsLabel(400, 42, 'İbadetler davranışlarımızı güzelleştirir', 0)}
      <g ${lsStep(1, 'ls-rise')}><rect x="40" y="75" width="345" height="185" rx="22" class="ls-card"/>${lsEmoji(110, 140, '🌙', 54)}<text x="250" y="125" text-anchor="middle" class="ls-label">ORUÇ</text>
        ${lines(250, [165, 195], ['Sabır', 'Kendini kontrol etmek'], 'ls-cap')}</g>
      <g ${lsStep(2, 'ls-rise')}><rect x="415" y="75" width="345" height="185" rx="22" class="ls-card"/>${lsEmoji(485, 140, '🕌', 54)}<text x="625" y="125" text-anchor="middle" class="ls-label">NAMAZ</text>
        ${lines(625, [165, 195, 225], ['Temizlik', 'Düzenli olmak', 'Vakti iyi kullanmak'], 'ls-cap')}</g>
      <g ${lsStep(3, 'ls-rise')}><rect x="40" y="285" width="720" height="145" rx="22" fill="#eef6fb" stroke="#9fb6c6" stroke-width="3"/>
        <text x="215" y="345" text-anchor="middle" class="ls-cap" style="fill:#b2402a">👀 İnsanlar görsün diye</text>${lsCross(215, 338, 220)}
        <text x="585" y="345" text-anchor="middle" class="ls-label">💚 Allah’ın rızası için</text>
        ${lines(585, [380], ['(Allah’ın hoşnutluğu)'], 'ls-small')}</g>`),

    [`${P}-sevgi`]: () => lsSvg(`${lsLabel(400, 40, '❤️ Sevgi ve saygı: ilişkilerin temeli', 0)}
      <g ${lsStep(1, 'ls-rise')}><rect x="40" y="65" width="720" height="85" rx="18" class="ls-card"/>
        ${lines(400, [100, 130], ['<tspan style="fill:#08796e">Saygı:</tspan> dikkatli, özenli ve ölçülü davranmak,', 'başkalarını rahatsız etmekten çekinmek'], 'ls-cap')}</g>
      <g ${lsStep(2, 'ls-rise')}><rect x="40" y="165" width="345" height="135" rx="20" fill="#eef8f2" stroke="#2eaa83" stroke-width="3"/><text x="212" y="198" text-anchor="middle" class="ls-label">😊 Sevgi ve saygı varsa</text>
        ${lines(212, [235, 262, 289], ['huzur', 'yardımlaşma', 'kardeşlik'], 'ls-cap')}</g>
      <g ${lsStep(3, 'ls-rise')}><rect x="415" y="165" width="345" height="135" rx="20" fill="#fff1ee" stroke="#e25d3f" stroke-width="3"/><text x="587" y="198" text-anchor="middle" class="ls-label" style="fill:#b2402a">😟 Sevgi ve saygı yoksa</text>
        ${lines(587, [235, 262, 289], ['kıskançlık', 'öfke', 'bencillik'], 'ls-cap', 'middle', 'style="fill:#7a2c1d"')}</g>
      ${quote(40, 315, 720, 118, ['“Küçüğümüze merhamet etmeyen, büyüğümüze', 'saygı göstermeyen bizden değildir.”'], '(Hadis-i şerif)', 4, 'ls-cap', 28)}`),

    [`${P}-aile`]: () => lsSvg(`<rect x="0" y="390" width="320" height="60" fill="#e8dcc0"/>
      ${lsKid(75, 330, 1.5, '#5b7fa6', '#2b1a10')}${lsKid(165, 330, 1.45, '#e8832f', '#3b2416')}${lsKid(245, 360, 0.95, '#e85d8f', '#3b2416')}
      ${lsEmoji(165, 120, '🏡', 60)}${lsLabel(160, 430, 'Önce ailemizde', 0)}
      <g ${lsStep(1, 'ls-rise')}><rect x="335" y="25" width="430" height="250" rx="18" fill="#fff8e6" stroke="#e0c27a" stroke-width="3"/>
        ${lines(550, [62, 90, 118], ['“…ana babanıza da iyi davranmanızı', 'kesin bir şekilde emretti. Onlardan', 'biri veya her ikisi senin yanında'], 'ls-cap')}</g>
      <g ${lsStep(2)}><rect x="345" y="128" width="410" height="90" rx="10" fill="#e8832f22"/>${lines(550, [146, 174, 202], ['yaşlanırsa kendilerine ‘Of!’ bile deme,', 'onları azarlama ve ikisine de', 'güzel söz söyle!”'], 'ls-cap')}</g>
      <g ${lsStep(1, 'ls-d1')}>${lines(550, [250], ['(İsrâ suresi, 23. ayet)'], 'ls-small', 'middle', 'style="fill:#8a6a2a"')}</g>
      ${lsPill(550, 335, '🤲 Anne babamız için dua', '#5b7fa6', 3)}
      ${lsPill(550, 385, '🧺 Onlara yardım ederiz', '#1f9a73', 4)}${lsPill(550, 432, '🤝 Kardeşlerle iyi geçiniriz', '#e8832f', 4, 'ls-d1')}`),

    [`${P}-komsu`]: () => lsSvg(`<rect x="30" y="25" width="360" height="355" rx="22" class="ls-card"/><rect x="410" y="25" width="360" height="355" rx="22" class="ls-card"/>
      ${lsPill(210, 60, 'Akrabalar', '#08796e', 0)}<g ${lsStep(0, 'ls-pop')}>${lsEmoji(210, 115, '🏡 🚗 👵', 40)}</g>
      ${lsLabel(210, 172, '💞 Sıla-i rahim', 0, 'ls-d1')}
      ${quote(45, 200, 330, 165, ['“…Allah’a karşı gelmekten ve', 'akrabalık bağlarını', 'koparmaktan sakının…”'], '(Nisâ suresi, 1. ayet)', 1, 'ls-cap', 30)}
      ${lsPill(590, 60, 'Komşular', '#5b7fa6', 2)}<g ${lsStep(2, 'ls-rise')}>${house(540, 178, '#f3efe4', '#c8733d')}${house(640, 178, '#eef3f6', '#5b7fa6')}${lsEmoji(590, 95, '💬', 30)}</g>
      ${quote(425, 200, 330, 165, ['“…Allah’a ve ahiret gününe', 'iman eden kişi komşusunu', 'rahatsız etmesin…”'], '(Hadis-i şerif)', 3, 'ls-cap', 30)}
      ${lsPill(150, 420, '🍲 Paylaşırız', '#1f9a73', 4)}${lsPill(395, 420, '🤝 Yanlarında oluruz', '#1f9a73', 4, 'ls-d1')}${lsPill(655, 420, '🔇 Rahatsız etmeyiz', '#1f9a73', 4, 'ls-d2')}`),

    [`${P}-arkadas`]: () => lsSvg(`${lsKid(95, 265, 1.15, '#4c8be6', '#5a3b22')}${lsKid(185, 265, 1.15, '#e85d8f', '#2b1a10')}
      <g ${lsStep(0, 'ls-pop')}>${lsEmoji(140, 140, '💛', 44)}</g>${lsLabel(140, 352, 'Arkadaşlar', 0)}
      ${quote(290, 25, 480, 125, ['“Allah katında arkadaşların en hayırlısı,', 'arkadaşına karşı hayırlı davranandır.”'], '(Hadis-i şerif)', 1, 'ls-cap', 28)}
      ${lsLabel(530, 190, '👫 Kişi arkadaşından bellidir', 2)}
      <g ${lsStep(3, 'ls-rise')}><rect x="300" y="222" width="200" height="105" rx="8" fill="#2f5d50" stroke="#8a5a2b" stroke-width="6"/>
        <text x="400" y="262" text-anchor="middle" fill="#fff" ${font(22)}>Ders</text><path d="M330 290 H470 M330 308 H430" stroke="#ffffffb0" stroke-width="4" stroke-linecap="round"/></g>
      ${lsLabel(640, 280, '🙋 Öğretmene saygı', 3, 'ls-d1')}
      ${lsLabel(400, 392, '🍯 Tatlı dil yılanı deliğinden çıkarır', 4)}
      <g ${lsStep(4, 'ls-d1')}>${lines(400, [432], ['Güzel söz insanları birbirine yaklaştırır'])}</g>`),

    [`${P}-dikkat`]: () => lsSvg(`${lsLabel(400, 40, '⚠️ Saygı nasıl olur?', 0)}
      ${ruleRow(70, true, 'Farklı düşünenleri dinleriz, kırmayız', 1)}
      ${ruleRow(158, false, 'Alay, kusur araştırmak, kötü lakap takmak', 2)}
      ${ruleRow(246, true, 'Hatada ısrar etmeyiz, özür dileriz', 3)}
      ${ruleRow(334, true, 'Kendimize istediğimizi başkasına da isteriz', 4)}`),

    [`${P}-summary`]: () => lsSummary([['🌟', 'Ahlak: huylar ve|davranışlar'], ['🕌', 'İbadetler davranışı|güzelleştirir'], ['❤️', 'Sevgi ve saygı:|ilişkilerin temeli'], ['🏡', 'Aile, akraba, komşu,|arkadaş, öğretmen']], 'Hazırsan mini teste geçelim!'),
  });
}
