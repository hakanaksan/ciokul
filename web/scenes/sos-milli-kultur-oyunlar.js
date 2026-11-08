/* Scenes for the video lesson "Millî Kültürümüz ve Çocuk Oyunları". Loaded when the lesson opens (see loadLessonScenes in lessons.js). */
{
  // Small drawings of hand crafts, centred on (x, y).
  const crafts = {
    kilim: (x, y) => `<g transform="translate(${x} ${y})"><rect x="-36" y="-22" width="72" height="44" rx="3" fill="#b03a2e"/><path d="M-30 0 L-18 -14 L-6 0 L-18 14 Z M6 0 L18 -14 L30 0 L18 14 Z" fill="#f2c94c"/><path d="M-6 0 L0 -8 L6 0 L0 8 Z" fill="#fff"/>
      <path d="M-36 -22 H36 M-36 22 H36" stroke="#5a1e16" stroke-width="3"/></g>`,
    cini: (x, y) => `<g transform="translate(${x} ${y})"><rect x="-26" y="-26" width="52" height="52" rx="4" fill="#fff" stroke="#1f5fa8" stroke-width="3"/>
      ${[0, 90, 180, 270].map(a => `<ellipse cx="0" cy="-12" rx="6" ry="11" fill="#1f5fa8" transform="rotate(${a})"/>`).join('')}<circle r="6" fill="#d9472b"/></g>`,
    ebru: (x, y) => `<g transform="translate(${x} ${y})"><rect x="-32" y="-24" width="64" height="48" rx="6" fill="#1c6fa8"/>
      <path d="M-26 8 C-14 -18 4 22 26 -8" stroke="#f2c94c" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M-24 -10 C-8 4 6 -20 24 10" stroke="#e25d3f" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="-12" cy="14" r="5" fill="#fff"/></g>`,
    bakir: (x, y) => `<g transform="translate(${x} ${y})"><path d="M-20 -22 H20 L16 -14 Q30 4 22 22 H-22 Q-30 4 -16 -14 Z" fill="#c8733d" stroke="#8d4c22" stroke-width="3"/><path d="M20 -8 Q38 -6 34 10" stroke="#8d4c22" stroke-width="4" fill="none"/><path d="M-22 4 H22" stroke="#e8a06a" stroke-width="3"/></g>`,
    oya: (x, y) => `<g transform="translate(${x} ${y})"><rect x="-22" y="-22" width="44" height="44" fill="#8e44ad" transform="rotate(45)"/><path d="M-31 0 L0 -31 L31 0" stroke="#c39bd3" stroke-width="3" fill="none"/>
      ${[[-31, 0], [-20, 11], [-10, 21], [0, 31], [10, 21], [20, 11], [31, 0]].map(([dx, dy], i) => `<circle cx="${dx}" cy="${dy}" r="5" fill="${['#f2c94c', '#e25d3f', '#2eaa83'][i % 3]}"/>`).join('')}</g>`,
  };
  // A two-column card: title pill on top.
  const half = (x, title, color, n) => `<g ${lsStep(n, 'ls-rise')}><rect x="${x}" y="72" width="350" height="280" rx="22" class="ls-card"/></g>${lsPill(x + 175, 74, title, color, n)}`;

  Object.assign(LESSON_SCENES, {
    'sos-milli-kultur-oyunlar-intro': () => lsSvg(`<circle cx="700" cy="80" r="40" fill="#ffcf4d" class="ls-sun"/><rect x="0" y="380" width="800" height="70" fill="#9bd27d"/>
      ${lsKid(150, 380 - 55, 1.2, '#d9472b', '#5a3b22')}${lsLabel(150, 190, '✨ Bayramlıklar', 0)}${lsLabel(400, 45, '🌅 Bayram sabahı', 0)}
      <g ${lsStep(1, 'ls-pop')}><text x="390" y="260" text-anchor="middle" dominant-baseline="central" font-size="70">👵 👴</text></g>${lsLabel(390, 345, 'Büyüklerin elini öperiz', 1, 'ls-d1')}
      <g ${lsStep(2, 'ls-pop')}>${lsEmoji(640, 225, '🏠', 80)}<text x="640" y="300" text-anchor="middle" dominant-baseline="central" font-size="34">🍬 🍫 🍭</text></g>${lsLabel(650, 345, 'Ziyaret ve ikram', 2, 'ls-d1')}
      ${lsPill(400, 415, '🎉 Millî kültürümüzün parçası', '#08796e', 3)}`),

    'sos-milli-kultur-oyunlar-kultur': () => {
      const left = ['Dil', 'Tarih', 'İnanç', 'Gelenek ve görenek'], right = ['Bayramlar', 'El sanatları', 'Yemekler', 'Türküler', 'Oyunlar'];
      return lsSvg(`${lsLabel(400, 38, 'KÜLTÜR: maddi ve manevi değerlerin tümü', 0)}${lsLabel(400, 88, 'MİLLET: dil, tarih ve kültür birliği', 1)}
        <g ${lsStep(2)}>${left.map((t, i) => `<line x1="400" y1="250" x2="150" y2="${145 + i * 65}" stroke="#2f6f9f" stroke-width="3"/>`).join('')}</g>
        <g ${lsStep(3)}>${right.map((t, i) => `<line x1="400" y1="250" x2="650" y2="${140 + i * 52}" stroke="#e8832f" stroke-width="3"/>`).join('')}</g>
        <g ${lsStep(0, 'ls-pop')}><circle cx="400" cy="250" r="66" fill="#d9472b"/><text x="400" y="244" text-anchor="middle" class="ls-pill">Millî</text><text x="400" y="270" text-anchor="middle" class="ls-pill">Kültür</text></g>
        ${left.map((t, i) => lsPill(150, 145 + i * 65 + 5, t, '#2f6f9f', 2, 'ls-d' + i)).join('')}
        ${right.map((t, i) => lsPill(650, 140 + i * 52 + 5, t, '#e8832f', 3, 'ls-d' + i)).join('')}
        ${lsLabel(400, 418, '👴 ➜ 👨 ➜ 🧒 Nesilden nesile aktarılır', 4)}`);
    },

    'sos-milli-kultur-oyunlar-gelenek': () => {
      const row = (y, items, n) => items.map(([e, t], i) => `<g ${lsStep(n, 'ls-rise ls-d' + i)}><rect x="${30 + i * 250}" y="${y}" width="240" height="90" rx="18" class="ls-card"/>
        ${lsEmoji(150 + i * 250, y + 32, e, 30)}<text x="${150 + i * 250}" y="${y + 74}" text-anchor="middle" class="ls-small">${t}</text></g>`).join('');
      const milli = [['23 Nisan', 'Ulusal Egemenlik ve Çocuk Bayramı'], ['19 Mayıs', 'Atatürk’ü Anma, Gençlik ve Spor Bayramı'], ['30 Ağustos', 'Zafer Bayramı'], ['29 Ekim', 'Cumhuriyet Bayramı']];
      return lsSvg(`<g data-hide="5" class="ls-in on">${lsLabel(400, 36, 'Gelenek ve görenek: toplumun eski alışkanlıkları', 0)}</g>${lsLabel(400, 36, '📜 Millî bayramlar tarihimizi hatırlatır', 5)}
        ${row(62, [['🤲', 'Büyüklerin elini öpmek'], ['☕', 'Misafire ikram'], ['💐', 'Hasta ziyareti']], 1)}
        ${row(164, [['💍', 'Düğün'], ['🕯️', 'Kına gecesi'], ['🎖️', 'Asker uğurlama']], 2)}
        <g ${lsStep(3, 'ls-rise')}><rect x="30" y="270" width="215" height="165" rx="20" class="ls-card"/><text x="137" y="302" text-anchor="middle" class="ls-cap">Dinî bayramlar</text>
          <text x="137" y="340" text-anchor="middle" class="ls-small">Ramazan Bayramı</text><text x="137" y="366" text-anchor="middle" class="ls-small">Kurban Bayramı</text>${lsEmoji(137, 405, '🕌', 30)}</g>
        <g ${lsStep(4, 'ls-rise')}><rect x="260" y="270" width="510" height="165" rx="20" class="ls-card"/><text x="515" y="302" text-anchor="middle" class="ls-cap">Millî bayramlar</text>
          ${milli.map(([d], i) => `<text x="285" y="${335 + i * 26}" class="ls-small" style="fill:#08796e">${d}</text>`).join('')}</g>
        <g ${lsStep(5)}>${milli.map(([, t], i) => `<text x="390" y="${335 + i * 26}" class="ls-small" style="font-size:15px">${t}</text>`).join('')}</g>`);
    },

    'sos-milli-kultur-oyunlar-sanat': () => lsSvg(`${lsLabel(400, 38, 'El sanatları kültürümüzü yansıtır', 0)}
      ${lsFoodRow([[crafts.kilim, 'Halı, kilim'], [crafts.cini, 'Çini'], [crafts.ebru, 'Ebru'], [crafts.bakir, 'Bakır işleri'], [crafts.oya, 'Oya']], 140, 1)}
      ${lsLabel(165, 240, '🎶 Türküler, masallar', 2)}${lsLabel(420, 240, '📖 Dede Korkut', 2, 'ls-d1')}${lsLabel(640, 240, '😄 Nasreddin Hoca', 2, 'ls-d2')}
      ${lsLabel(110, 315, '🥟 Mantı', 3)}${lsLabel(255, 315, 'Baklava', 3, 'ls-d1')}${lsLabel(425, 315, '☕ Türk kahvesi', 3, 'ls-d2')}
      <g ${lsStep(4, 'ls-rise')}><path d="M600 300 Q670 268 740 300 Z" fill="#8a5a2b"/><rect x="600" y="300" width="140" height="74" rx="6" fill="#a0522d" stroke="#5a3b22" stroke-width="3"/>
        <rect x="600" y="296" width="140" height="10" fill="#5a3b22"/><rect x="662" y="320" width="16" height="18" rx="3" fill="#f2c94c"/>
        <rect x="610" y="300" width="40" height="34" fill="#8e44ad"/>${[614, 624, 634, 644].map((x, i) => `<circle cx="${x}" cy="336" r="4.5" fill="${['#f2c94c', '#e25d3f', '#2eaa83', '#f2c94c'][i]}"/>`).join('')}</g>
      ${lsLabel(590, 410, 'Çeyiz sandığı: oyalı yazmalar', 4, 'ls-d1')}`),

    'sos-milli-kultur-oyunlar-yapilar': () => {
      const salons = ['I. Dokuma eserler', 'II. Yazma eserler', 'III. Ahşap eserler', 'IV. Madeni eserler'];
      return lsSvg(`<g data-hide="4" class="ls-in on">${lsLabel(400, 36, 'Kültürümüz çevremizde de var', 0)}</g>${lsLabel(400, 36, '🔍 Gezelim, soralım, araştıralım', 4)}
        <g ${lsStep(1, 'ls-rise')}><rect x="40" y="200" width="720" height="10" rx="5" fill="#b9a68a"/>
          <rect x="60" y="150" width="96" height="50" fill="#efe6d6" stroke="#b9a68a" stroke-width="2"/><path d="M70 150 A38 38 0 0 1 146 150 Z" fill="#8fb3c9"/><line x1="108" y1="112" x2="108" y2="100" stroke="#8fb3c9" stroke-width="3"/>
          <rect x="164" y="82" width="12" height="118" fill="#efe6d6" stroke="#b9a68a" stroke-width="2"/><path d="M162 82 L170 58 L178 82 Z" fill="#8fb3c9"/><rect x="160" y="120" width="20" height="5" fill="#b9a68a"/>
          <path d="M238 196 Q300 150 362 196 Z" fill="#4fb3e8"/><path d="M220 200 V170 Q300 110 380 170 V200 H360 Q300 132 240 200 Z" fill="#b9a68a" stroke="#8d7a5f" stroke-width="2"/>
          <rect x="455" y="112" width="90" height="10" fill="#b9a68a"/><rect x="462" y="122" width="76" height="78" fill="#efe6d6" stroke="#b9a68a" stroke-width="2"/><path d="M480 200 V152 Q500 132 520 152 V200 Z" fill="#d8c8ac"/>
          <rect x="497" y="166" width="6" height="12" fill="#5d6d7e"/><path d="M500 182 V192" stroke="#4fb3e8" stroke-width="3"/><rect x="474" y="190" width="52" height="10" fill="#b9a68a"/>
          <rect x="622" y="132" width="136" height="68" fill="#d8c3a0" stroke="#a88d63" stroke-width="2"/>${[628, 652, 676, 700, 724, 748].map(x => `<rect x="${x - 6}" y="124" width="12" height="10" fill="#d8c3a0"/>`).join('')}
          <path d="M672 200 V164 Q690 146 708 164 V200 Z" fill="#8a6a3e"/>
          ${[[108, 'Cami'], [300, 'Köprü'], [500, 'Çeşme'], [690, 'Kervansaray']].map(([x, t]) => `<text x="${x}" y="236" text-anchor="middle" class="ls-cap">${t}</text>`).join('')}</g>
        <g ${lsStep(2, 'ls-rise')}><path d="M45 300 L175 258 L305 300 Z" fill="#c9b8a0"/><rect x="55" y="300" width="240" height="110" fill="#efe6d6" stroke="#c9b8a0" stroke-width="2"/>
          <rect x="55" y="300" width="240" height="30" fill="#e2d5bd"/><text x="175" y="321" text-anchor="middle" class="ls-small">Etnografya Müzesi</text>
          ${[75, 120, 165, 210, 255].map(x => `<rect x="${x}" y="334" width="18" height="76" fill="#fff" stroke="#c9b8a0" stroke-width="2"/>`).join('')}<rect x="45" y="410" width="260" height="14" fill="#c9b8a0"/>
          ${salons.map((t, i) => `<rect x="340" y="${262 + i * 42}" width="390" height="36" rx="12" class="ls-card"/><circle cx="362" cy="${280 + i * 42}" r="7" fill="${['#b03a2e', '#1f5fa8', '#8a5a2b', '#c8733d'][i]}"/>
            <text x="380" y="${287 + i * 42}" class="ls-cap">${t}</text>`).join('')}</g>
        <g ${lsStep(3, 'ls-pop')}><rect x="336" y="384" width="398" height="44" rx="14" fill="none" stroke="#d9472b" stroke-width="4"/>
          <circle cx="695" cy="406" r="11" fill="none" stroke="#c8733d" stroke-width="6"/><circle cx="695" cy="406" r="11" fill="none" stroke="#e8a06a" stroke-width="2"/></g>`);
    },

    'sos-milli-kultur-oyunlar-oyunlar': () => {
      const box = (x, title, sub, n, art) => `<g ${lsStep(n, 'ls-rise')}><rect x="${x}" y="62" width="230" height="268" rx="22" class="ls-card"/>${art}
        <text x="${x + 115}" y="294" text-anchor="middle" class="ls-cap">${title}</text><text x="${x + 115}" y="318" text-anchor="middle" class="ls-small">${sub}</text></g>`;
      const asik = (x, y, r) => `<g transform="translate(${x} ${y}) rotate(${r})"><path d="M-18 -12 Q-6 -6 0 -14 Q6 -6 18 -12 Q24 0 18 12 Q6 6 0 14 Q-6 6 -18 12 Q-24 0 -18 -12 Z" fill="#f4ead7" stroke="#bfae8f" stroke-width="3"/><circle cx="-8" cy="0" r="3" fill="#bfae8f"/></g>`;
      return lsSvg(`${lsLabel(400, 36, 'Geleneksel çocuk oyunları', 0)}
        ${box(40, 'Saklambaç', 'eski adı: karaguni', 1, `<rect x="88" y="150" width="16" height="110" fill="#8a5a2b"/><circle cx="96" cy="132" r="42" fill="#2eaa83"/>
          <g transform="translate(150 222) scale(0.8)"><circle cx="0" cy="-58" r="18" fill="#f2c7a5"/><path d="M-19 -60 Q-18 -82 0 -80 Q18 -82 19 -60 Q6 -72 -19 -60 Z" fill="#5a3b22"/>
            <rect x="-20" y="-40" width="40" height="52" rx="12" fill="#4c8be6"/><path d="M-16 -32 L-10 -56 M16 -32 L10 -56" stroke="#4c8be6" stroke-width="10" stroke-linecap="round"/>
            <circle cx="-7" cy="-58" r="7" fill="#f2c7a5" stroke="#d9a07a" stroke-width="2"/><circle cx="7" cy="-58" r="7" fill="#f2c7a5" stroke="#d9a07a" stroke-width="2"/>
            <rect x="-18" y="10" width="14" height="36" rx="6" fill="#3d4f63"/><rect x="4" y="10" width="14" height="36" rx="6" fill="#3d4f63"/></g><text x="160" y="110" class="ls-small">1, 2, 3…</text>
          <ellipse cx="232" cy="248" rx="30" ry="22" fill="#3c9a5f"/><circle cx="240" cy="226" r="11" fill="#f2c7a5"/><path d="M229 224 Q240 210 251 224" fill="#e8b84a"/>`)}
        ${box(285, 'Dalye', 'top ve yassı kiremitler', 2, `${[0, 1, 2, 3, 4, 5].map(i => `<rect x="${410 - 32 + (i % 2) * 4}" y="${232 - i * 12}" width="60" height="11" rx="2" fill="${i % 2 ? '#d9774f' : '#c0603a'}"/>`).join('')}
          <rect x="350" y="244" width="140" height="6" rx="3" fill="#b9a68a"/><circle cx="335" cy="200" r="15" fill="#f2c94c" stroke="#d9a43a" stroke-width="3"/><text x="400" y="120" text-anchor="middle" font-size="34">👦 👧</text>`)}
        ${box(530, 'Aşık', 'küçük kemiklerle oynanır', 3, `${asik(605, 150, -15)}${asik(670, 175, 20)}${asik(615, 215, 40)}${asik(690, 235, -30)}`)}
        ${[['Çelik çomak', 160, 368], ['Topaç', 400, 368], ['Seksek', 640, 368], ['İp atlama', 160, 414], ['Körebe', 400, 414], ['Mendil kapmaca', 640, 414]].map(([t, x, y], i) => lsPill(x, y, t, '#08796e', 4, 'ls-d' + Math.min(i, 5))).join('')}`);
    },

    'sos-milli-kultur-oyunlar-degisim': () => lsSvg(`${half(40, 'Geçmiş', '#a0522d', 0)}${half(410, 'Günümüz', '#2f6f9f', 2)}
      <g ${lsStep(0, 'ls-rise')}><rect x="60" y="190" width="310" height="14" rx="7" fill="#b9a68a"/>${lsKid(110, 156, 0.6, '#e25d3f')}${lsKid(160, 156, 0.6, '#2eaa83', '#e8b84a')}${lsKid(210, 156, 0.6, '#8e44ad')}${lsKid(260, 156, 0.6, '#f2994a', '#1b1b1b')}
        <rect x="318" y="140" width="10" height="52" fill="#8a5a2b"/><circle cx="323" cy="128" r="26" fill="#2eaa83"/>
        <text x="215" y="240" text-anchor="middle" class="ls-small">sokakta, bahçede, arsada</text><text x="215" y="266" text-anchor="middle" class="ls-small">kalabalık gruplarla</text></g>
      <g ${lsStep(1, 'ls-rise')}><text x="215" y="306" text-anchor="middle" class="ls-small">taş, sopa, ip, kemik, kiremit</text><text x="215" y="332" text-anchor="middle" class="ls-small">✂️ oyuncağını kendi yapardı</text></g>
      <g ${lsStep(2, 'ls-rise')}><path d="M500 140 L585 100 L670 140 Z" fill="#e25d3f"/><rect x="512" y="140" width="146" height="62" fill="#fff3d6" stroke="#c9a24a" stroke-width="3"/>${lsKid(585, 176, 0.5, '#4c8be6')}
        <text x="585" y="240" text-anchor="middle" class="ls-small">evde</text><text x="585" y="266" text-anchor="middle" class="ls-small">çoğu zaman tek başına</text></g>
      <g ${lsStep(3, 'ls-rise')}><text x="585" y="306" text-anchor="middle" class="ls-small">💻 📱 bilgisayar ve tablet</text><text x="585" y="332" text-anchor="middle" class="ls-small">🛒 plastik, satın alınan</text></g>
      ${lsPill(400, 400, 'Değişen: yer, kişi sayısı, malzeme', '#d9472b', 4)}`),

    'sos-milli-kultur-oyunlar-topac': () => lsSvg(`${lsLabel(400, 35, '🏫 Oynayalım, tanıtalım, yaşatalım', 5)}
      <g ${lsStep(0, 'ls-rise')}><rect x="40" y="75" width="350" height="210" rx="22" class="ls-card"/>
        <g transform="translate(180 170)"><path d="M-34 -34 Q0 -56 34 -34 L6 40 L0 54 L-6 40 Z" fill="#b5652f" stroke="#7a4220" stroke-width="3"/><path d="M-26 -22 Q0 -12 26 -22 M-18 0 Q0 8 18 0" stroke="#e8b84a" stroke-width="4" fill="none"/></g>
        <path d="M214 140 C240 120 250 170 276 150 S310 130 330 160" stroke="#f4ead7" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M214 140 C240 120 250 170 276 150 S310 130 330 160" stroke="#bfae8f" stroke-width="1.5" fill="none"/>
        <text x="215" y="262" text-anchor="middle" class="ls-cap">Ahşap topaç, pamuk ip</text></g>${lsPill(215, 77, 'Geçmiş', '#a0522d', 0)}
      <g ${lsStep(1, 'ls-rise')}><rect x="410" y="75" width="350" height="210" rx="22" class="ls-card"/>
        <g transform="translate(540 185)"><ellipse cx="0" cy="0" rx="52" ry="17" fill="#4c8be6"/><ellipse cx="0" cy="-6" rx="34" ry="10" fill="#e25d3f"/><circle cx="0" cy="-10" r="7" fill="#f2c94c"/><path d="M-8 14 L0 34 L8 14 Z" fill="#5d6d7e"/></g>
        <rect x="490" y="118" width="100" height="26" rx="10" fill="#2eaa83"/><path d="M590 131 H680" stroke="#5d6d7e" stroke-width="6" stroke-dasharray="4 3"/><circle cx="694" cy="131" r="13" fill="none" stroke="#e25d3f" stroke-width="5"/>
        <path d="M540 144 V160" stroke="#9aa7b1" stroke-width="3" stroke-dasharray="3 3"/>
        <text x="585" y="262" text-anchor="middle" class="ls-cap">Plastik topaç, kurma aracı</text></g>${lsPill(585, 77, 'Günümüz', '#2f6f9f', 1)}
      ${lsLabel(400, 316, '🏆 Kural aynı: en uzun dönen kazanır', 2)}
      ${lsPill(400, 364, '🔁 Süreklilik: saklambaç, seksek, ip atlama', '#08796e', 3)}
      ${lsLabel(400, 412, '🤝 Paylaşma · 📏 Kurallar · 👫 Birlik', 4)}`),

    'sos-milli-kultur-oyunlar-dikkat': () => {
      const rows = [[72, 62, ['💻 Bilgisayar oyunu, sudoku, yapboz: geleneksel değil']], [146, 86, ['Dinî bayramlar: Ramazan, Kurban', 'Millî bayramlar: 23 Nisan, 19 Mayıs, 30 Ağustos, 29 Ekim']],
        [244, 62, ['🔄 Kültür değişebilir, özü yaşamaya devam eder']], [318, 62, ['🏛️ Etnografya müzesi: halkın eski yaşayışı']]];
      return lsSvg(`${lsLabel(400, 38, '⚠️ Dikkat!', 0)}
        ${rows.map(([y, h, lines], i) => `<g ${lsStep(i + 1, 'ls-rise')}><rect x="40" y="${y}" width="720" height="${h}" rx="18" class="ls-card"/>
          ${lines.map((t, j) => `<text x="400" y="${y + (lines.length === 1 ? 38 : 34 + j * 30)}" text-anchor="middle" class="ls-cap">${t}</text>`).join('')}</g>`).join('')}`);
    },

    'sos-milli-kultur-oyunlar-summary': () => lsSummary([['🎉', 'Dil, tarih, gelenek:|millî kültürümüz'], ['🧶', 'El sanatları ve|tarihî yapılar'], ['🧒', 'Saklambaç, dalye,|aşık, topaç'], ['🔄', 'Değişim ve|süreklilik']], 'Hazırsan mini teste geçelim!'),
  });
}
