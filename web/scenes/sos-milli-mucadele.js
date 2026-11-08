/* Scenes for the video lesson "Millî Mücadele Kahramanları". Loaded when the lesson opens (see loadLessonScenes in lessons.js). */
{
  // A simple, generic portrait (not a likeness): head centre (x, y), scaled by s.
  // kind: 'man' (short hair, moustache), 'efe' (head wrap, moustache), 'woman' (head scarf).
  const bust = (x, y, s, color, kind = 'man') => {
    const head = kind === 'woman'
      ? `<path d="M-38 34 Q-46 -42 0 -42 Q46 -42 38 34 Q30 -18 0 -22 Q-30 -18 -38 34 Z" fill="#7a4b8c"/>`
      : kind === 'efe'
        ? `<path d="M-33 -8 Q-31 -42 0 -44 Q31 -42 33 -8 Q0 -22 -33 -8 Z" fill="#8a5a2b"/><path d="M28 -20 l14 18 M30 -14 l10 20" stroke="#c0392b" stroke-width="4" stroke-linecap="round"/>`
        : `<path d="M-30 -6 Q-28 -36 0 -36 Q28 -36 30 -6 Q14 -22 -30 -6 Z" fill="#3b2a1e"/>`;
    const moustache = (kind === 'woman' ? '' : `<path d="M-14 11 Q-7 4 0 8 Q7 4 14 11 Q7 9 0 11 Q-7 9 -14 11 Z" fill="#3b2a1e"/>`)
      + `<path d="M-8 16 Q0 23 8 16" stroke="#1b2a35" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-58 100 Q-58 44 0 40 Q58 44 58 100 Z" fill="${color}"/><circle r="30" fill="#f2c7a5"/>
      <circle cx="-10" cy="-2" r="3" fill="#1b2a35"/><circle cx="10" cy="-2" r="3" fill="#1b2a35"/>${moustache}${head}</g>`;
  };
  // A hero card: portrait, name and place; w wide, 230 high, top at y.
  const hero = (cx, y, w, name, place, color, kind, n, cls = '') => `<g ${lsStep(n, 'ls-rise ' + cls)}><rect x="${cx - w / 2}" y="${y}" width="${w}" height="230" rx="20" class="ls-card"/>
    ${bust(cx, y + 75, 1, color, kind)}<text x="${cx}" y="${y + 196}" text-anchor="middle" class="ls-cap">${name}</text><text x="${cx}" y="${y + 220}" text-anchor="middle" class="ls-small">${place}</text></g>`;
  const ship = (x, y) => `<g><path d="M${x - 50} ${y} H${x + 50} L${x + 36} ${y + 22} H${x - 36} Z" fill="#5d6d7e"/><line x1="${x}" y1="${y}" x2="${x}" y2="${y - 52}" stroke="#3d4f63" stroke-width="4"/><path d="M${x + 3} ${y - 48} L${x + 38} ${y - 8} H${x + 3} Z" fill="#e8eef3"/></g>`;
  const stop = (x, y, name, note, color, n) => `<g ${lsStep(n, 'ls-pop')}><rect x="${x - 75}" y="${y - 28}" width="150" height="56" rx="16" fill="#fff" stroke="${color}" stroke-width="3"/>
    <text x="${x}" y="${y + 7}" text-anchor="middle" class="ls-cap">${name}</text><text x="${x}" y="${y + 52}" text-anchor="middle" class="ls-small">${note}</text></g>`;
  const arrow = (d, n) => `<path ${lsStep(n)} d="${d}" stroke="#3d4f63" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;

  Object.assign(LESSON_SCENES, {
    'sos-milli-mucadele-intro': () => lsSvg(`<path d="M0 340 Q200 300 400 330 T800 320 V450 H0 Z" fill="#9bd27d"/>
      <path d="M70 210 L170 140 L270 210 Z" fill="#e25d3f"/><rect x="90" y="210" width="160" height="125" fill="#fff3d6" stroke="#c9a24a" stroke-width="3"/>
      <rect x="150" y="265" width="40" height="70" rx="4" fill="#8a5a2b"/>${[105, 200].map(x => `<rect x="${x}" y="228" width="34" height="30" fill="#bfe6ff" stroke="#c9a24a" stroke-width="3"/>`).join('')}
      ${lsKid(320, 335, 1)}<g ${lsStep(0, 'ls-pop')}><text x="320" y="232" text-anchor="middle" font-size="48" font-weight="900" fill="#e25d3f">?</text></g>
      <g ${lsStep(1)}><g fill="#6e7f8e"><ellipse cx="530" cy="90" rx="70" ry="34"/><ellipse cx="610" cy="72" rx="70" ry="42"/><ellipse cx="680" cy="96" rx="64" ry="30"/></g></g>
      ${lsPill(600, 165, '⚠️ Yurdumuz işgal edildi', '#d9472b', 1)}
      <g ${lsStep(2, 'ls-pop')}><text x="600" y="262" text-anchor="middle" dominant-baseline="central" font-size="44">👨 👩 👴 👵 🧒</text></g>
      ${lsLabel(600, 315, '🤝 Birlik oldu', 2, 'ls-d1')}
      ${lsPill(400, 405, 'Millî Mücadele = Kurtuluş Savaşı', '#08796e', 3)}`),

    'sos-milli-mucadele-mondros': () => lsSvg(`
      <g ${lsStep(0, 'ls-rise')}><rect x="40" y="70" width="320" height="130" rx="22" class="ls-card"/>${lsEmoji(200, 105, '⚔️', 36)}
        <text x="200" y="155" text-anchor="middle" class="ls-cap">Birinci Dünya Savaşı</text><text x="200" y="182" text-anchor="middle" class="ls-small">1914 - 1918</text></g>
      <g ${lsStep(1, 'ls-pop')}><text x="400" y="150" text-anchor="middle" font-size="40">➜</text></g>
      <g ${lsStep(1, 'ls-rise ls-d1')}><rect x="440" y="70" width="320" height="130" rx="22" class="ls-card"/>${lsEmoji(600, 105, '📜', 36)}
        <text x="600" y="155" text-anchor="middle" class="ls-cap">Mondros Ateşkes Antlaşması</text><text x="600" y="182" text-anchor="middle" class="ls-small">30 Ekim 1918</text></g>
      ${lsPill(400, 240, '⚠️ Yurdumuzun birçok yeri işgal edildi', '#d9472b', 2)}
      <g ${lsStep(3, 'ls-rise')}><rect x="40" y="280" width="350" height="80" rx="18" class="ls-card"/><text x="215" y="312" text-anchor="middle" class="ls-cap">Batıda: Yunanlılar</text><text x="215" y="342" text-anchor="middle" class="ls-small">İzmir</text></g>
      <g ${lsStep(3, 'ls-rise ls-d1')}><rect x="410" y="280" width="350" height="80" rx="18" class="ls-card"/><text x="585" y="312" text-anchor="middle" class="ls-cap">Güneyde: Fransızlar</text><text x="585" y="342" text-anchor="middle" class="ls-small">Maraş, Antep, Urfa</text></g>
      ${lsPill(400, 410, '🛡️ Kuvayımilliye: halkın birlikleri', '#08796e', 4)}`),

    'sos-milli-mucadele-izmir': () => lsSvg(`
      ${[[20, 60], [80, 40], [130, 70], [200, 50], [260, 65]].map(([x, h]) => `<rect x="${x}" y="${250 - h}" width="56" height="${h}" fill="#c9b8a0"/>`).join('')}
      <rect x="0" y="250" width="330" height="200" fill="url(#lsSea)"/>
      <g ${lsStep(0, 'ls-rise')}>${ship(110, 300)}${ship(240, 360)}</g>
      ${lsLabel(170, 60, 'İzmir, 15 Mayıs 1919', 0)}
      ${hero(450, 75, 200, 'Hasan Tahsin', 'gazeteci', '#5b7fa6', 'man', 1)}${lsLabel(450, 345, 'İlk kurşunu attı', 1, 'ls-d1')}
      ${lsLabel(450, 400, '⭐ Sembol kahraman', 2)}
      ${hero(680, 75, 200, 'Yörük Ali Efe', 'Aydın yöresi', '#8a5a2b', 'efe', 3)}${lsLabel(670, 345, 'Efeler de savaştı', 3, 'ls-d1')}`),

    'sos-milli-mucadele-samsun': () => lsSvg(`
      <g ${lsStep(0, 'ls-rise')}>${lsEmoji(110, 70, '🚢', 44)}<text x="145" y="78" class="ls-small">Bandırma Vapuru</text></g>
      ${stop(110, 140, 'Samsun', '19 Mayıs 1919', '#08796e', 0)}
      ${arrow('M188 140 H210 M202 132 L212 140 L202 148', 1)}${stop(290, 140, 'Havza', 'genelge', '#e8832f', 1)}
      ${arrow('M368 140 H390 M382 132 L392 140 L382 148', 1)}${stop(470, 140, 'Amasya', 'genelge', '#e8832f', 1)}
      ${arrow('M548 140 H570 M562 132 L572 140 L562 148', 2)}${stop(650, 140, 'Erzurum', 'kongre', '#5b7fa6', 2)}
      ${arrow('M650 205 V252 M642 244 L650 254 L658 244', 3)}${stop(650, 290, 'Sivas', 'kongre', '#5b7fa6', 3)}
      ${arrow('M572 290 H482 M490 282 L480 290 L490 298', 4)}${stop(400, 290, 'Ankara', '23 Nisan 1920: Meclis', '#d9472b', 4)}
      ${lsLabel(170, 280, '📣 Halk uyandırıldı', 1, 'ls-d2')}
      ${lsPill(200, 405, '🧩 Vatan bir bütündür', '#5b7fa6', 2, 'ls-d1')}${lsPill(600, 405, '🤝 Cemiyetler birleşti', '#5b7fa6', 3, 'ls-d1')}`),

    'sos-milli-mucadele-fronts': () => {
      const fronts = [[155, 'Batı Cephesi', '#2f6f9f', 3, 'Yunanlılara karşı', 'Düzenli ordu', ''], [400, 'Güney Cephesi', '#e8832f', 2, 'Fransızlara karşı', 'Kuvayımilliye', 'halk direnişi'], [645, 'Doğu Cephesi', '#8e44ad', 1, 'Ermenilere karşı', 'Kâzım Karabekir', 'komutan']];
      return lsSvg(`${fronts.map(([cx, name, color, n, enemy, main, sub]) => `<rect x="${cx - 115}" y="80" width="230" height="250" rx="22" class="ls-card"/>${lsPill(cx, 82, name, color, 0)}
          <g ${lsStep(n, 'ls-rise')}>${lsEmoji(cx, 140, '⚔️', 40)}<text x="${cx}" y="190" text-anchor="middle" class="ls-small">${enemy}</text>
            <text x="${cx}" y="235" text-anchor="middle" class="ls-cap">${main}</text><text x="${cx}" y="262" text-anchor="middle" class="ls-small">${sub}</text></g>`).join('')}
        <g ${lsStep(4, 'ls-pop')}><text x="155" y="292" text-anchor="middle" class="ls-cap">İsmet İnönü</text><text x="155" y="317" text-anchor="middle" class="ls-small">ilk zaferi kazandı</text></g>
        ${lsLabel(400, 385, 'Üç cephede savaşıldı', 0)}`);
    },

    'sos-milli-mucadele-south': () => lsSvg(`${lsLabel(400, 38, 'Güney Cephesi kahramanları', 0)}
      ${hero(115, 70, 175, 'Sütçü İmam', 'Maraş', '#2f6f9f', 'man', 1)}${hero(305, 70, 175, 'Şahin Bey', 'Antep', '#2eaa83', 'man', 2)}
      ${hero(495, 70, 175, 'Ali Saip Bey', 'Urfa', '#e8832f', 'man', 3)}${hero(685, 70, 175, 'Tayyar Rahmiye', 'Osmaniye', '#5b7fa6', 'woman', 3, 'ls-d2')}
      ${lsPill(115, 345, 'Kahraman', '#d9472b', 4)}${lsPill(305, 345, 'Gazi', '#d9472b', 4, 'ls-d1')}${lsPill(495, 345, 'Şanlı', '#d9472b', 4, 'ls-d2')}
      ${lsLabel(400, 405, 'Kahramanmaraş · Gaziantep · Şanlıurfa', 4, 'ls-d3')}`),

    'sos-milli-mucadele-women': () => lsSvg(`${lsLabel(400, 40, 'Herkes fedakârlık gösterdi', 0)}
      <g ${lsStep(0, 'ls-pop')}><text x="400" y="100" text-anchor="middle" dominant-baseline="central" font-size="38">👩 👵 🧒 👴</text></g>
      <g ${lsStep(1)}><line x1="110" y1="200" x2="690" y2="200" stroke="#b0a08a" stroke-width="12" stroke-linecap="round"/>
        ${[[110, 'İnebolu'], [400, 'Kastamonu'], [690, 'Ankara']].map(([x, n]) => `<circle cx="${x}" cy="200" r="11" fill="#3d4f63"/><text x="${x}" y="234" text-anchor="middle" class="ls-small">${n}</text>`).join('')}
        <text x="545" y="186" text-anchor="middle" class="ls-cap">İstiklal Yolu</text>
        <rect x="230" y="154" width="40" height="16" rx="3" fill="#6e7f5a"/><rect x="222" y="168" width="60" height="22" rx="4" fill="#b5652f"/><circle cx="240" cy="192" r="14" fill="#8a5a2b" stroke="#5a3b22" stroke-width="3"/>
        ${lsEmoji(312, 178, '🐂', 36)}</g>
      <g ${lsStep(2, 'ls-pop')}>${lsEmoji(190, 140, '❄️', 22)}${lsEmoji(262, 128, '❄️', 20)}${lsEmoji(335, 146, '❄️', 22)}</g>
      <g ${lsStep(2, 'ls-rise')}><rect x="40" y="255" width="350" height="135" rx="20" class="ls-card"/>${bust(95, 305, 0.55, '#a0522d', 'woman')}
        <text x="150" y="300" class="ls-cap">Şerife Bacı</text><text x="150" y="328" class="ls-small">İnebolu - Kastamonu</text><text x="150" y="354" class="ls-small">kağnıyla cephane taşıdı</text></g>
      <g ${lsStep(3, 'ls-rise')}><rect x="410" y="255" width="350" height="135" rx="20" class="ls-card"/>${bust(465, 305, 0.55, '#2eaa83', 'woman')}
        <text x="520" y="300" class="ls-cap">Gördesli Makbule</text><text x="520" y="328" class="ls-small">eşi Halil Efe ile</text><text x="520" y="354" class="ls-small">düşmana karşı savaştı</text></g>
      ${lsLabel(400, 420, '📦 Cephane · 🩹 Yaralılar · 🧵 Giysi', 4)}`),

    'sos-milli-mucadele-victory': () => {
      const events = [[100, true, '⚔️', '1921', 'Sakarya Meydan|Muharebesi', 0, 'ls-d1'], [220, false, '🎖️', '1921', 'Gazi unvanı ve|mareşallik', 1, ''],
        [340, true, '🏆', '30 Ağustos 1922', 'Başkomutanlık|Meydan Muharebesi', 2, ''], [460, false, '⚓', '9 Eylül 1922', 'İzmir’in|kurtuluşu', 3, ''],
        [580, true, '📜', '11 Ekim 1922', 'Mudanya Ateşkes|Antlaşması', 4, ''], [700, false, '🎉', '29 Ekim 1923', 'Cumhuriyet ilan|edildi', 4, 'ls-d2']];
      return lsSvg(`<g data-hide="2" class="ls-in on">${lsLabel(400, 45, 'Zafere giden yol', 0)}</g>${lsLabel(400, 45, '“Ordular! İlk hedefiniz Akdeniz’dir.”', 2)}
        <g ${lsStep(0)}><line x1="40" y1="250" x2="740" y2="250" stroke="#3d4f63" stroke-width="6" stroke-linecap="round"/><path d="M736 236 L762 250 L736 264 Z" fill="#3d4f63"/></g>
        ${events.map(([x, up, e, date, text, n, d]) => { const y = up ? 100 : 280;
          return `<g ${lsStep(n, 'ls-rise ' + d)}><line x1="${x}" y1="${up ? 220 : 250}" x2="${x}" y2="${up ? 250 : 280}" stroke="#3d4f63" stroke-width="3"/><circle cx="${x}" cy="250" r="9" fill="#e25d3f"/>
            <rect x="${x - 80}" y="${y}" width="160" height="120" rx="16" class="ls-card"/>${lsEmoji(x, y + 26, e, 30)}
            <text x="${x}" y="${y + 60}" text-anchor="middle" class="ls-small" style="fill:#08796e">${date}</text>
            ${text.split('|').map((l, j) => `<text x="${x}" y="${y + 84 + j * 20}" text-anchor="middle" class="ls-small" style="font-size:15px">${l}</text>`).join('')}</g>`; }).join('')}`);
    },

    'sos-milli-mucadele-dikkat': () => {
      const rows = [['Batı ➜ Yunanlılar', 'Güney ➜ Fransızlar'], ['Şerife Bacı ➜ İstiklal Yolu', 'Tayyar Rahmiye ➜ Osmaniye'], ['Hasan Tahsin ➜ İzmir', 'Sütçü İmam ➜ Maraş', 'Şahin Bey ➜ Antep'], ['Kâzım Karabekir ➜ Doğu', 'İsmet İnönü ➜ Batı']];
      return lsSvg(`${lsLabel(400, 40, '⚠️ Dikkat!', 0)}
        ${rows.map((items, i) => { const y = 80 + i * 85, xs = items.length === 2 ? [225, 575] : [165, 400, 635];
          return `<g ${lsStep(i + 1, 'ls-rise')}><rect x="40" y="${y}" width="720" height="70" rx="18" class="ls-card"/>${items.map((t, j) => `<text x="${xs[j]}" y="${y + 42}" text-anchor="middle" class="ls-cap">${t}</text>`).join('')}</g>`; }).join('')}`);
    },

    'sos-milli-mucadele-why': () => lsSvg(`${lsLabel(400, 50, 'Neden önemli?', 0)}
      <g data-hide="1" class="ls-in on"><text x="400" y="270" text-anchor="middle" class="ls-big">?</text></g>
      ${lsPill(230, 140, '🕊️ Bağımsızlık', '#08796e', 1)}${lsLabel(560, 140, '🏠 Yurdumuz kurtuldu', 1, 'ls-d1')}
      <g ${lsStep(2, 'ls-pop')}><text x="400" y="235" text-anchor="middle" dominant-baseline="central" font-size="50">👫 👭 👬 👫</text></g>
      ${lsLabel(400, 300, '🤝 Birlik ve beraberlik', 2, 'ls-d1')}
      <g ${lsStep(3, 'ls-pop')}>${lsEmoji(180, 380, '🏫', 50)}${lsEmoji(620, 380, '🎉', 50)}</g>${lsLabel(400, 385, 'Kahramanlarımıza teşekkürler', 3)}`),

    'sos-milli-mucadele-summary': () => lsSummary([['📜', 'Mondros sonrası|işgaller başladı'], ['🚢', '19 Mayıs: Samsun|23 Nisan: Meclis'], ['🛡️', 'Üç cephede|kahramanca savaştık'], ['⭐', 'Kahramanlarımızı|unutmayacağız']], 'Hazırsan mini teste geçelim!'),
  });
}
