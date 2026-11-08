/* Scenes for the video lesson "İslam'ın İnanç Esasları ve Şartları". Loaded when the lesson opens (see loadLessonScenes in lessons.js). */
{
  const P = 'din-iman-ve-islamin-sartlari';
  const font = (size, weight = 800) => `style="font:${weight} ${size}px Segoe UI,Arial,sans-serif"`;
  const lines = (x, ys, texts, cls = 'ls-small', extra = '') => texts.map((t, i) => `<text x="${x}" y="${ys[i]}" text-anchor="middle" class="${cls}" ${extra}>${t}</text>`).join('');
  const arrow = (x1, x2, y) => `<path d="M${x1} ${y} H${x2 - 10}" stroke="#3d4f63" stroke-width="5" stroke-linecap="round"/><path d="M${x2 - 14} ${y - 9} L${x2} ${y} L${x2 - 14} ${y + 9} Z" fill="#3d4f63"/>`;
  const divider = `<line x1="400" y1="30" x2="400" y2="380" stroke="#c9d6cd" stroke-width="4" stroke-dasharray="10 8"/>`;
  // A row of coloured pills centred on the stage.
  const pillRow = (items, y, color, step) => {
    const gap = 8, widths = items.map(lsLabelWidth), total = widths.reduce((a, b) => a + b, 0) + gap * (items.length - 1);
    let x = 400 - total / 2;
    return items.map((t, i) => { const cx = x + widths[i] / 2; x += widths[i] + gap; return lsPill(cx, y, t, color, step, 'ls-d' + Math.min(i, 5)); }).join('');
  };
  const pillarIcons = ['💬', '🕌', '🌙', '🤝', '🕋'];

  Object.assign(LESSON_SCENES, {
    [`${P}-intro`]: () => {
      const pillars = [200, 300, 400, 500, 600];
      return lsSvg(`<rect x="0" y="392" width="800" height="58" fill="#bfe3b4"/>
        <path d="M150 150 L400 85 L650 150 Z" fill="#dfe6ea" stroke="#9fb6c6" stroke-width="4"/>
        <rect x="140" y="150" width="520" height="25" fill="#dfe6ea" stroke="#9fb6c6" stroke-width="4"/>
        <rect x="130" y="318" width="540" height="20" fill="#dfe6ea" stroke="#9fb6c6" stroke-width="4"/>
        ${pillars.map(x => `<rect x="${x - 20}" y="175" width="40" height="143" fill="none" stroke="#9fb6c6" stroke-width="3" stroke-dasharray="8 6"/>`).join('')}
        <rect x="110" y="338" width="580" height="54" fill="none" stroke="#9fb6c6" stroke-width="3" stroke-dasharray="8 6"/>
        <g ${lsStep(1)}><path d="M150 150 L400 85 L650 150 Z" fill="#08796e"/><rect x="140" y="150" width="520" height="25" fill="#0b4f45"/><text x="400" y="140" text-anchor="middle" fill="#fff" ${font(24)}>İSLAM</text></g>
        ${[0, 1, 2, 3, 4, 5].map(i => { const x = 111 + i * 96.6;
          return `<g ${lsStep(2, 'ls-rise ls-d' + Math.min(i, 5))}><rect x="${x}" y="339" width="94" height="52" rx="6" fill="#c49a62" stroke="#8d6a3a" stroke-width="2"/><text x="${x + 47}" y="373" text-anchor="middle" fill="#fff" ${font(22)}>${i + 1}</text></g>`; }).join('')}
        ${pillars.map((x, i) => `<g ${lsStep(3, 'ls-drop ls-d' + i)}><rect x="${x - 20}" y="175" width="40" height="143" fill="#f3efe4" stroke="#c9b98a" stroke-width="3"/>${lsEmoji(x, 246, pillarIcons[i], 26)}</g>`).join('')}
        ${lsLabel(230, 428, '🧱 Temel: 6 inanç esası', 2)}${lsLabel(590, 428, '🏛️ Direkler: 5 şart', 3)}
        ${lsLabel(400, 45, 'İslam beş esas üzerine kurulu', 4)}`);
    },

    [`${P}-esaslar`]: () => {
      const items = [['🌌', 'Allah’a iman'], ['✨', 'Meleklere iman'], ['📚', 'Kitaplara iman'], ['✉️', 'Peygamberlere iman'], ['♾️', 'Ahirete iman'], ['📏', 'Kadere iman']];
      return lsSvg(`${lsLabel(400, 48, 'İMAN = inanmak, doğrulamak', 0)}
        ${lsPill(250, 110, 'İnanç esasları', '#08796e', 1)}<g ${lsStep(1)}><text x="400" y="114" text-anchor="middle" fill="#3d4f63" ${font(32, 900)}>=</text></g>${lsPill(550, 110, 'İmanın şartları', '#08796e', 1)}
        ${items.map(([e, name], i) => { const x = 45 + (i % 3) * 245, y = 150 + Math.floor(i / 3) * 130, step = i < 4 ? 2 : 3;
          return `<g ${lsStep(step, 'ls-rise ls-d' + (i < 4 ? i : i - 4))}><rect x="${x}" y="${y}" width="220" height="110" rx="20" class="ls-card"/><circle cx="${x + 26}" cy="${y + 26}" r="16" fill="#08796e"/><text x="${x + 26}" y="${y + 33}" text-anchor="middle" fill="#fff" ${font(18)}>${i + 1}</text>
            ${lsEmoji(x + 110, y + 40, e, 36)}<text x="${x + 110}" y="${y + 92}" text-anchor="middle" class="ls-cap">${name}</text></g>`; }).join('')}`);
    },

    [`${P}-allah-melek`]: () => lsSvg(`<clipPath id="dinImanNature"><rect x="30" y="70" width="355" height="230" rx="24"/></clipPath>
      <g clip-path="url(#dinImanNature)"><rect x="30" y="70" width="355" height="230" fill="#d6efff"/><circle cx="330" cy="145" r="22" fill="#ffcf4d" class="ls-sun"/>
        <path d="M30 300 V240 L110 172 L180 228 L255 160 L385 250 V300 Z" fill="#8fbf8a"/><path d="M30 300 V270 Q200 240 385 280 V300 Z" fill="#6fae64"/>
        <rect x="88" y="236" width="10" height="36" fill="#8a5a2b"/><circle cx="93" cy="226" r="22" fill="#4f9a4a"/></g>
      <rect x="30" y="70" width="355" height="230" rx="24" fill="none" stroke="#9fc6e0" stroke-width="3"/>
      ${lsPill(207, 102, 'Temel: Allah’a iman', '#08796e', 0)}
      <g ${lsStep(1)}>${lines(207, [338, 364], ['Eşi ve benzeri olmayan,', 'her şeyi yaratan tek Allah'], 'ls-cap')}</g>
      <g ${lsStep(2, 'ls-rise')}><rect x="415" y="70" width="355" height="230" rx="24" fill="#fffdf2" stroke="#efdc9a" stroke-width="3"/>
        <circle cx="592" cy="160" r="38" fill="#fff3b0" opacity=".6"/><circle cx="592" cy="160" r="24" fill="#ffe680" opacity=".7"/><circle cx="592" cy="160" r="11" fill="#fff"/>
        ${lsEmoji(535, 140, '✨', 26)}${lsEmoji(652, 176, '✨', 22)}</g>
      ${lsPill(592, 102, 'Meleklere iman', '#5b7fa6', 2)}
      <g ${lsStep(3)}>${lines(592, [226, 252, 278], ['Nurdan yaratılmıştır', 'Gözle görülmez', 'İnsanların iyiliğini ister'])}</g>
      ${lsLabel(592, 350, 'Cebrail: vahiy meleği', 4)}`),

    [`${P}-kitap-peygamber`]: () => {
      const books = [['Tevrat', '#8e6bbf'], ['Zebur', '#4c8be6'], ['İncil', '#e8832f'], ['Kur’an', '#1f6f54']];
      return lsSvg(`<line x1="400" y1="30" x2="400" y2="340" stroke="#c9d6cd" stroke-width="4" stroke-dasharray="10 8"/>
        ${lsPill(207, 55, 'Peygamberlere iman', '#08796e', 0)}
        <g ${lsStep(1)}>${lines(207, [110, 142], ['✅ Allah’ın seçtiği elçiler', '❌ İnsanlar seçmez'], 'ls-cap')}</g>
        <g ${lsStep(2)}><line x1="80" y1="195" x2="335" y2="195" stroke="#9fb6c6" stroke-width="6" stroke-linecap="round"/>
          ${[140, 200, 260].map(x => `<circle cx="${x}" cy="195" r="5" fill="#9fb6c6"/>`).join('')}<circle cx="80" cy="195" r="11" fill="#08796e"/><circle cx="335" cy="195" r="11" fill="#08796e"/>
          ${lines(110, [230], ['İlk: Hz. Âdem'])}${lines(290, [230], ['Son: Hz. Muhammed'])}</g>
        ${lsLabel(207, 285, 'Dürüst ve güvenilir', 2, 'ls-d1')}
        ${lsPill(595, 55, 'Kitaplara iman', '#e8832f', 3)}
        ${books.map(([name, color], i) => { const x = 471 + i * 85;
          return `<g ${lsStep(3, 'ls-rise ls-d' + i)}><rect x="${x - 31}" y="95" width="62" height="110" rx="6" fill="${color}"/><rect x="${x - 31}" y="95" width="10" height="110" rx="4" fill="#00000026"/><rect x="${x - 16}" y="125" width="36" height="20" rx="4" fill="#ffffffb0"/>${lines(x, [230], [name])}</g>`; }).join('')}
        <rect ${lsStep(4)} x="689" y="88" width="74" height="124" rx="10" fill="none" stroke="#e8b10f" stroke-width="5"/>
        ${lsLabel(595, 278, '⭐ Son ilahi kitap', 4)}<g ${lsStep(4, 'ls-d1')}>${lines(595, [322], ['iman • ibadet • ahlak'])}</g>
        ${lsLabel(400, 405, '🧭 Doğru yolu gösterirler', 0)}`);
    },

    [`${P}-ahiret-kader`]: () => lsSvg(`${divider}
      ${lsPill(207, 55, 'Ahirete iman', '#5b7fa6', 0)}
      <g ${lsStep(0, 'ls-d1')}><rect x="55" y="118" width="110" height="16" rx="8" fill="#9bd27d"/>${arrow(172, 300, 126)}${lsEmoji(335, 126, '♾️', 40)}
        ${lines(110, [162], ['dünya'])}${lines(305, [162], ['sonsuz hayat'])}</g>
      <g ${lsStep(1, 'ls-pop')}>${lsEmoji(207, 225, '⚖️', 56)}${lines(207, [282], ['iyi ve kötünün karşılığı'])}</g>
      ${lsPill(207, 340, '💚 İyiliğe yönlendirir', '#1f9a73', 2)}
      ${lsPill(595, 55, 'Kadere iman', '#e8832f', 3)}
      <g ${lsStep(3, 'ls-d1')}>${lines(595, [106, 132], ['Her şey Allah’ın bilgisi ve', 'dilemesiyle, bir ölçüyle'], 'ls-cap')}</g>
      <g ${lsStep(4, 'ls-pop')}>${lsEmoji(595, 192, '🌅 ☀️ 🌇', 38)}${lsEmoji(595, 255, '🌸 ☀️ 🍂 ❄️', 34)}</g>
      ${lsLabel(595, 322, '📏 Düzen ve ölçü', 4, 'ls-d1')}`),

    [`${P}-amentu`]: () => lsSvg(`${lsLabel(400, 45, 'ÂMENTÜ DUASI', 0)}
      ${lsPill(400, 100, 'Âmentü = İnandım', '#08796e', 1)}
      <g ${lsStep(1, 'ls-rise')}><rect x="40" y="125" width="720" height="100" rx="18" fill="#fff8e6" stroke="#e0c27a" stroke-width="3"/>
        ${lines(400, [155, 180, 205], ['Âmentü billâhi ve melâiketihî ve kütübihî ve rusülihî', 've’l-yevmi’l-âhiri ve bi’l-kaderi hayrihî ve şerrihî minallâhi teâlâ', 've’l-ba‘sü ba‘de’l-mevti hakkun.'])}</g>
      ${pillRow(['Allah', 'melekler', 'kitaplar', 'peygamberler', 'ahiret günü', 'kader'], 272, '#5b7fa6', 2)}
      ${lsLabel(400, 328, 'Öldükten sonra diriliş haktır', 3)}
      ${lsPill(400, 386, 'Sonunda: Kelime-i şehadet', '#e8832f', 4)}
      <g ${lsStep(4, 'ls-d1')}>${lines(400, [428], ['Eşhedü en lâ ilâhe illallâh ve eşhedü enne Muhammeden abdühû ve rasûlüh'])}</g>`),

    [`${P}-sartlar`]: () => {
      const names = ['Şehadet', 'Namaz', 'Oruç', 'Zekât', 'Hac'], xs = [130, 265, 400, 535, 670];
      return lsSvg(`<rect x="70" y="62" width="660" height="36" rx="10" fill="#0b4f45"/><text x="400" y="88" text-anchor="middle" fill="#fff" ${font(22)}>İSLAM’IN 5 ŞARTI</text>
        ${xs.map(x => `<rect x="${x - 30}" y="98" width="60" height="122" fill="#f3efe4" stroke="#c9b98a" stroke-width="3"/>`).join('')}<rect x="70" y="220" width="660" height="14" rx="4" fill="#c9b98a"/>
        ${xs.map((x, i) => `<g ${lsStep(1, 'ls-pop ls-d' + i)}>${lsEmoji(x, 152, pillarIcons[i], 32)}</g>${lsLabel(x, 266, names[i], 1, 'ls-d' + i)}`).join('')}
        <rect ${lsStep(2)} x="92" y="92" width="76" height="136" rx="8" fill="none" stroke="#e8b10f" stroke-width="5"/>
        ${lsLabel(260, 309, '1. şart: Kelime-i şehadet', 2)}${lsPill(640, 309, '📜 Âmentü’de de geçer', '#5b7fa6', 4)}
        <g ${lsStep(3, 'ls-rise')}><rect x="40" y="330" width="720" height="110" rx="18" fill="#eef6fb" stroke="#9fb6c6" stroke-width="3"/>
          ${lines(400, [357], ['Eşhedü en lâ ilâhe illallâh ve eşhedü enne Muhammeden abdühû ve rasûlüh'])}
          ${lines(400, [385, 411], ['Allah’tan başka ilah olmadığına şahitlik ederim.', 'Hz. Muhammed’in O’nun kulu ve elçisi olduğuna da şahitlik ederim.'], 'ls-small', 'style="fill:#0b4f45"')}</g>`);
    },

    [`${P}-namaz-oruc`]: () => lsSvg(`${divider}
      ${lsPill(207, 50, 'NAMAZ', '#08796e', 0)}
      <g ${lsStep(0, 'ls-d1')}>${[['🌅', 'sabah'], ['☀️', 'öğle'], ['🌤️', 'ikindi'], ['🌇', 'akşam'], ['🌙', 'yatsı']].map(([e, t], i) => lsEmoji(67 + i * 70, 105, e, 34) + lines(67 + i * 70, [146], [t])).join('')}</g>
      <g ${lsStep(1, 'ls-rise')}><rect x="30" y="175" width="355" height="160" rx="18" fill="#fff8e6" stroke="#e0c27a" stroke-width="3"/>
        ${lines(207, [207, 232, 257], ['“…Namazı dosdoğru kılın, çünkü', 'namaz müminler üzerine vakitleri', 'belli bir farzdır.”'])}${lines(207, [302], ['(Nisâ suresi, 103. ayet)'], 'ls-small', 'style="fill:#8a6a2a"')}</g>
      ${lsPill(595, 50, 'ORUÇ', '#e8832f', 2)}${lsLabel(595, 105, '🌙 Ramazan ayı', 2, 'ls-d1')}
      <g ${lsStep(3)}>${lsEmoji(450, 180, '🌅', 34)}${lsEmoji(740, 180, '🌇', 34)}<line x1="476" y1="180" x2="714" y2="180" stroke="#e8832f" stroke-width="5" stroke-dasharray="10 7"/>
        ${lines(595, [160], ['sabahtan akşama'])}${lines(595, [218], ['yemez, içmez'], 'ls-cap')}</g>
      ${lsPill(530, 272, 'Sabır', '#1f9a73', 4)}${lsPill(660, 272, 'Şükür', '#e8832f', 4, 'ls-d1')}
      ${lsLabel(595, 332, '🤝 Aç olanları anlarız', 4, 'ls-d2')}`),

    [`${P}-zekat-hac`]: () => lsSvg(`${divider}
      ${lsPill(207, 50, 'ZEKÂT', '#1f9a73', 0)}
      <g ${lsStep(1, 'ls-pop')}>${lsEmoji(140, 122, '💰', 44)}${arrow(175, 238, 122)}${lsEmoji(275, 122, '🤲', 44)}</g>
      <g ${lsStep(1, 'ls-d1')}>${lines(207, [180, 204], ['Malının belli bir bölümü', 'ihtiyaç sahiplerine'])}</g>
      ${lsPill(207, 256, 'Yardımlaşma ve paylaşma', '#5b7fa6', 2)}${lsLabel(207, 316, '🚫 Cimrilik, bencillik', 2, 'ls-d1')}
      ${lsPill(595, 50, 'HAC', '#e8832f', 3)}
      <g ${lsStep(3, 'ls-rise')}><ellipse cx="595" cy="172" rx="120" ry="12" fill="#e8e2d0"/><rect x="550" y="85" width="90" height="85" fill="#1b2a35"/><rect x="550" y="103" width="90" height="10" fill="#d9a43a"/><rect x="606" y="135" width="16" height="35" fill="#d9a43a"/>
        ${lines(595, [207], ['Mekke’de Kâbe ve kutsal yerler'])}</g>
      ${lsLabel(595, 256, 'İmkânı olana ömürde bir kez', 4)}
      <g ${lsStep(4, 'ls-pop ls-d1')}>${lsEmoji(595, 305, '👩🏻 👨🏿 👵 🧒🏽', 30)}</g>
      ${lsLabel(595, 356, '🤝 Herkes eşit ve kardeş', 4, 'ls-d2')}`),

    [`${P}-dikkat`]: () => {
      const faith = ['Allah’a iman', 'Meleklere iman', 'Kitaplara iman', 'Peygamberlere iman', 'Ahirete iman', 'Kadere iman'];
      const pillars = ['Kelime-i şehadet', 'Namaz kılmak', 'Oruç tutmak', 'Zekât vermek', 'Hacca gitmek'];
      return lsSvg(`${lsLabel(400, 40, '⚠️ Karıştırmayalım!', 0)}
        <g ${lsStep(0)}><rect x="30" y="70" width="355" height="275" rx="22" fill="#eef8f2" stroke="#2eaa83" stroke-width="3"/><text x="207" y="104" text-anchor="middle" class="ls-label">İnanç esasları</text>
          <rect x="415" y="70" width="355" height="275" rx="22" fill="#fff4e6" stroke="#e8832f" stroke-width="3"/><text x="592" y="104" text-anchor="middle" class="ls-label" style="fill:#a4520f">İslam’ın şartları</text></g>
        <g ${lsStep(1)}>${lines(207, faith.map((_, i) => 142 + i * 30), faith, 'ls-cap')}${lines(207, [330], ['💚 kalbimizle inanırız'])}</g>
        <g ${lsStep(2)}>${lines(592, pillars.map((_, i) => 142 + i * 30), pillars, 'ls-cap')}</g>
        ${lsLabel(400, 392, '🤲 Dua etmek: listelerde yok', 3)}
        <g ${lsStep(4, 'ls-pop')}><circle cx="350" cy="97" r="20" fill="#2eaa83"/><text x="350" y="105" text-anchor="middle" fill="#fff" ${font(22, 900)}>6</text>
          <circle cx="735" cy="97" r="20" fill="#e8832f"/><text x="735" y="105" text-anchor="middle" fill="#fff" ${font(22, 900)}>5</text></g>`);
    },

    [`${P}-summary`]: () => lsSummary([['💚', 'İman: inanmak,|6 inanç esası'], ['📜', 'Âmentü:|“İnandım” demek'], ['🕌', 'İslam’ın 5 şartı:|namaz, oruç, zekât…'], ['🏛️', 'İnanç temeldir,|şartlar direktir']], 'Hazırsan mini teste geçelim!'),
  });
}
