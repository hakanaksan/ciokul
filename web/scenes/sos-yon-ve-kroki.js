/* Scenes for the video lesson "Yön Bulma ve Kroki". Loaded when the lesson opens (see loadLessonScenes in lessons.js). */
{
  // A child seen from behind (so its right arm is on our right), arms stretched out.
  const backKid = (x, y, s, shirt = '#4c8be6', hair = '#5a3b22') => `<g transform="translate(${x} ${y}) scale(${s})">
    <circle cx="-18" cy="-58" r="5" fill="#f2c7a5"/><circle cx="18" cy="-58" r="5" fill="#f2c7a5"/><circle cx="0" cy="-58" r="18" fill="${hair}"/><rect x="-6" y="-43" width="12" height="6" fill="#f2c7a5"/>
    <line x1="-14" y1="-32" x2="-62" y2="-34" stroke="${shirt}" stroke-width="10" stroke-linecap="round"/><line x1="14" y1="-32" x2="62" y2="-34" stroke="${shirt}" stroke-width="10" stroke-linecap="round"/>
    <circle cx="-67" cy="-34" r="6" fill="#f2c7a5"/><circle cx="67" cy="-34" r="6" fill="#f2c7a5"/><rect x="-20" y="-40" width="40" height="52" rx="12" fill="${shirt}"/>
    <rect x="-18" y="10" width="14" height="36" rx="6" fill="#3d4f63"/><rect x="4" y="10" width="14" height="36" rx="6" fill="#3d4f63"/></g>`;
  // A straight arrow from (x1, y1) to (x2, y2).
  const arrow = (x1, y1, x2, y2, color = '#3d4f63', w = 5, dash = '') => {
    const a = Math.atan2(y2 - y1, x2 - x1), h = 3.6 * w + 4, f = n => n.toFixed(1);
    const p = t => `${f(x2 - h * Math.cos(a + t))} ${f(y2 - h * Math.sin(a + t))}`;
    return `<line x1="${x1}" y1="${y1}" x2="${f(x2 - h * 0.7 * Math.cos(a))}" y2="${f(y2 - h * 0.7 * Math.sin(a))}" stroke="${color}" stroke-width="${w}" stroke-linecap="round" ${dash ? `stroke-dasharray="${dash}"` : ''}/><path d="M${x2} ${y2} L${p(0.42)} L${p(-0.42)} Z" fill="${color}"/>`;
  };
  // A north arrow marked "K" (Kuzey), centred on (x, y).
  const north = (x, y) => `<g><circle cx="${x}" cy="${y}" r="28" fill="#fff" stroke="#3d4f63" stroke-width="2"/>${arrow(x, y + 20, x, y - 2, '#d9472b', 4)}<text x="${x}" y="${y - 7}" text-anchor="middle" class="ls-small">K</text></g>`;
  // A five-pointed star.
  const star = (x, y, r, color) => `<path d="${[...Array(10)].map((_, i) => { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r; return `${i ? 'L' : 'M'}${(x + rr * Math.cos(a)).toFixed(1)} ${(y + rr * Math.sin(a)).toFixed(1)}`; }).join(' ')} Z" fill="${color}"/>`;
  // A rectangle with a centred name, for the sketches.
  const place = (x, y, w, h, name, fill, cls = 'ls-small') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${fill}" stroke="#7a6a55" stroke-width="2"/><text x="${x + w / 2}" y="${y + h / 2 + 6}" text-anchor="middle" class="${cls}">${name}</text>`;

  Object.assign(LESSON_SCENES, {
    'sos-yon-ve-kroki-intro': () => lsSvg(`<rect x="40" y="50" width="390" height="270" rx="18" fill="#eef6e8" stroke="#c9d6cd" stroke-width="3"/>
      <rect x="42" y="172" width="386" height="26" fill="#cfd6dc"/><rect x="222" y="52" width="26" height="266" fill="#cfd6dc"/>
      <rect x="62" y="98" width="70" height="58" fill="#f6d365" stroke="#c9a24a" stroke-width="2"/><text x="97" y="90" text-anchor="middle" class="ls-small">Okul</text>
      <path d="M143 110 L175 86 L207 110 Z" fill="#e25d3f"/><rect x="148" y="110" width="54" height="46" fill="#fff3d6" stroke="#c9a24a" stroke-width="2"/><text x="175" y="76" text-anchor="middle" class="ls-small">Ev</text>
      <rect x="92" y="212" width="116" height="74" rx="10" fill="#9bd27d"/><circle cx="120" cy="240" r="13" fill="#2eaa83"/><circle cx="178" cy="256" r="15" fill="#2eaa83"/><text x="150" y="308" text-anchor="middle" class="ls-small">Park</text>
      <rect x="300" y="248" width="62" height="40" fill="#efe6d6" stroke="#b9a68a" stroke-width="2"/><path d="M308 248 A23 23 0 0 1 354 248 Z" fill="#8fb3c9"/><rect x="368" y="214" width="8" height="74" fill="#efe6d6" stroke="#b9a68a" stroke-width="2"/><path d="M366 214 L372 198 L378 214 Z" fill="#8fb3c9"/>
      <text x="330" y="308" text-anchor="middle" class="ls-small">Cami</text>
      <g ${lsStep(3, 'ls-rise')}><path d="M262 160 Q312 76 362 160 Z" fill="#7cb35b"/><text x="312" y="150" text-anchor="middle" class="ls-small" style="fill:#fff">Tepe</text>
        <path d="M402 54 C380 90 420 120 396 168" stroke="#4fb3e8" stroke-width="10" fill="none" stroke-linecap="round"/><text x="386" y="70" text-anchor="end" class="ls-small">Dere</text></g>
      <g ${lsStep(4)}><path d="M150 140 H130" stroke="#d9472b" stroke-width="3" stroke-dasharray="5 4"/><rect x="117" y="122" width="50" height="20" rx="8" fill="#fff"/><text x="142" y="137" text-anchor="middle" style="font:700 14px Segoe UI,Arial,sans-serif;fill:#d9472b">yakın</text>
        <path d="M190 156 L320 246" stroke="#d9472b" stroke-width="3" stroke-dasharray="5 4"/><rect x="250" y="206" width="50" height="20" rx="8" fill="#fff"/><text x="275" y="221" text-anchor="middle" style="font:700 14px Segoe UI,Arial,sans-serif;fill:#d9472b">uzak</text></g>
      ${lsKid(600, 290, 1.1)}<ellipse cx="600" cy="344" rx="44" ry="7" fill="#00000018"/>
      <g data-hide="1" class="ls-in ls-pop on"><text x="666" y="196" text-anchor="middle" font-size="44" font-weight="900" fill="#e25d3f">?</text></g>
      <g ${lsStep(1, 'ls-pop')}><path d="M582 133 L612 133 L598 196 Z" fill="#fff" stroke="#08796e" stroke-width="2"/><rect x="450" y="52" width="310" height="84" rx="20" fill="#fff" stroke="#08796e" stroke-width="2"/><rect x="584" y="130" width="26" height="8" fill="#fff"/>
        <text x="605" y="86" text-anchor="middle" class="ls-cap">Okulun yanında,</text><text x="605" y="116" text-anchor="middle" class="ls-cap">parkın karşısında!</text></g>
      ${lsPill(400, 374, '📍 KONUM: bir yerin bulunduğu yer', '#08796e', 2)}
      ${lsLabel(215, 420, '🏫 Beşerî: okul, park, cami', 3)}${lsLabel(595, 420, '🌳 Doğal: dere, tepe, orman', 3, 'ls-d1')}`),

    'sos-yon-ve-kroki-ana': () => {
      const cx = 200, cy = 235, tips = [[0, -88, 'Kuzey', '#d9472b'], [0, 88, 'Güney', '#3d4f63'], [88, 0, 'Doğu', '#3d4f63'], [-88, 0, 'Batı', '#3d4f63']];
      return lsSvg(`<g ${lsStep(0, 'ls-pop')}><circle cx="${cx}" cy="${cy}" r="150" fill="#fff" stroke="#c9d6cd" stroke-width="4"/><circle cx="${cx}" cy="${cy}" r="8" fill="#3d4f63"/></g>
        <g ${lsStep(1, 'ls-pop')}>${tips.map(([dx, dy, t, c]) => `${arrow(cx, cy, cx + dx, cy + dy, c, 7)}<text x="${cx + dx * 1.4}" y="${cy + dy * 1.42 + 7}" text-anchor="middle" class="ls-cap" style="fill:${c}">${t}</text>`).join('')}</g>
        ${lsLabel(590, 100, 'Kuzey ↔ Güney', 2)}${lsLabel(590, 150, 'Doğu ↔ Batı', 2, 'ls-d1')}
        <g ${lsStep(3, 'ls-rise')}><rect x="440" y="190" width="300" height="160" rx="14" fill="#eef6e8" stroke="#7a6a55" stroke-width="2"/>${lsEmoji(590, 278, '🗺️', 48)}
          ${arrow(590, 240, 590, 200, '#d9472b', 4)}<text x="620" y="222" class="ls-small">Kuzey</text><text x="590" y="340" text-anchor="middle" class="ls-small">Güney</text>
          <text x="455" y="284" class="ls-small">Batı</text><text x="725" y="284" text-anchor="end" class="ls-small">Doğu</text></g>
        ${lsLabel(590, 404, '🧭 Kaybolmayız, yolu buluruz', 4)}`);
    },

    'sos-yon-ve-kroki-ara': () => {
      const cx = 210, cy = 240, d = 70, main = [[0, -1, 'Kuzey'], [0, 1, 'Güney'], [1, 0, 'Doğu'], [-1, 0, 'Batı']];
      const mid = [[1, -1, 'Kuzeydoğu', 1], [-1, -1, 'Kuzeybatı', 1], [1, 1, 'Güneydoğu', 2], [-1, 1, 'Güneybatı', 2]];
      return lsSvg(`<circle cx="${cx}" cy="${cy}" r="160" fill="#fff" stroke="#c9d6cd" stroke-width="4"/>
        ${main.map(([dx, dy, t]) => `${arrow(cx, cy, cx + dx * 105, cy + dy * 105, dy < 0 ? '#d9472b' : '#3d4f63', 6)}<text x="${cx + dx * 136}" y="${cy + dy * 136 + 6}" text-anchor="middle" class="ls-small">${t}</text>`).join('')}
        ${mid.map(([dx, dy, t, n]) => `<g ${lsStep(n, 'ls-pop')}>${arrow(cx, cy, cx + dx * d, cy + dy * d, '#e8832f', 5)}</g>${lsPill(cx + dx * 92, cy + dy * 92 + 6, t, '#e8832f', n, 'ls-d1')}`).join('')}
        <circle cx="${cx}" cy="${cy}" r="7" fill="#3d4f63"/>
        ${lsLabel(585, 60, 'Ara yön: iki ana yönün ortası', 0)}
        ${lsLabel(500, 125, '✅ Kuzeydoğu', 3)}${lsLabel(670, 125, '❌ Doğukuzey', 3, 'ls-d1')}
        <g ${lsStep(4, 'ls-rise')}><rect x="440" y="168" width="320" height="252" rx="16" fill="#eef6e8" stroke="#7a6a55" stroke-width="2"/>${north(478, 206)}
          <circle cx="520" cy="372" r="9" fill="#d9472b"/><text x="520" y="404" text-anchor="middle" class="ls-cap">Hatay</text>
          <circle cx="715" cy="245" r="9" fill="#d9472b"/><text x="715" y="222" text-anchor="middle" class="ls-cap">Kars</text>
          ${arrow(530, 365, 703, 252, '#08796e', 4, '10 7')}</g>
        ${lsPill(660, 352, 'kuzeydoğu', '#08796e', 4, 'ls-d2')}`);
    },

    'sos-yon-ve-kroki-gunes': () => lsSvg(`<g ${lsStep(0)}><circle cx="720" cy="372" r="34" fill="#ffcf4d" class="ls-sun"/><circle cx="80" cy="372" r="34" fill="#f2994a" opacity=".7"/></g>
      <rect x="0" y="370" width="800" height="80" fill="#9bd27d"/>
      <g ${lsStep(0, 'ls-pop')}><text x="720" y="326" text-anchor="middle" class="ls-small">doğar</text><text x="80" y="326" text-anchor="middle" class="ls-small">batar</text></g>
      ${backKid(400, 340, 1.3)}
      <g ${lsStep(1)}>${arrow(500, 296, 652, 296, '#d9472b', 5)}</g>${lsLabel(575, 262, 'Sağ kol: DOĞU', 1, 'ls-d1')}
      <g ${lsStep(2)}>${arrow(300, 296, 150, 296, '#3d4f63', 5)}</g>${lsLabel(225, 262, 'Sol kol: BATI', 2)}${lsLabel(400, 205, '↑ Yüzümüz: KUZEY', 2, 'ls-d1')}${lsLabel(400, 428, 'Sırtımız: GÜNEY', 2, 'ls-d2')}
      <g ${lsStep(3, 'ls-rise')}><rect x="40" y="20" width="720" height="130" rx="20" class="ls-card"/><text x="400" y="56" text-anchor="middle" class="ls-cap">Güneş önce doğudaki şehirlerde doğar ve batar</text></g>
      <g ${lsStep(4, 'ls-pop')}>${lsEmoji(90, 108, '🌇', 34)}<text x="118" y="100" class="ls-small">Edirne (batıda)</text><text x="118" y="126" class="ls-small">güneş henüz batmadı</text>
        ${lsEmoji(450, 108, '🌙', 34)}<text x="478" y="100" class="ls-small">Kars (doğuda)</text><text x="478" y="126" class="ls-small">güneş battı</text></g>`),

    'sos-yon-ve-kroki-yildiz': () => {
      const stars = [[80, 70], [130, 200], [330, 70], [300, 160], [90, 140], [360, 230], [160, 60], [270, 110], [70, 260]];
      return lsSvg(`<rect x="40" y="40" width="350" height="320" rx="22" fill="#1d2b4f"/>${stars.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.5" fill="#fff"/>`).join('')}
        <rect x="40" y="330" width="350" height="30" fill="#2f5a3a"/><rect x="40" y="340" width="350" height="20" rx="0" fill="#2f5a3a"/>
        ${star(215, 90, 20, '#ffe066')}
        <g ${lsStep(0, 'ls-pop')}><text x="215" y="138" text-anchor="middle" class="ls-cap" style="fill:#fff">Kutup Yıldızı</text><text x="215" y="162" text-anchor="middle" class="ls-small" style="fill:#ffe066">(Demirkazık)</text></g>
        ${backKid(215, 300, 0.8, '#e8832f')}
        <g ${lsStep(1, 'ls-pop')}><text x="215" y="208" text-anchor="middle" class="ls-small" style="fill:#fff">↑ önümüz: kuzey</text>
          <text x="115" y="250" text-anchor="middle" class="ls-small" style="fill:#fff">batı</text><text x="315" y="250" text-anchor="middle" class="ls-small" style="fill:#fff">doğu</text></g>
        ${lsLabel(215, 395, 'arkamız: güney', 1, 'ls-d1')}
        <rect x="410" y="40" width="350" height="320" rx="22" fill="#cdeaff"/><path d="M410 300 H760 V338 Q760 360 738 360 H432 Q410 360 410 338 Z" fill="#9bd27d"/>
        <rect x="488" y="170" width="24" height="132" fill="#8a5a2b"/><circle cx="500" cy="140" r="55" fill="#2eaa83"/>
        <g ${lsStep(2)}>${[[488, 196, 36], [488, 244, 30], [488, 280, 18]].map(([x, y, h]) => `<rect x="${x - 3}" y="${y}" width="10" height="${h}" rx="4" fill="#4f7a22"/>`).join('')}</g>
        ${lsLabel(520, 330, '🌿 Yosun: kuzey', 2, 'ls-d1')}
        <g ${lsStep(3, 'ls-pop')}><path d="M612 302 Q662 236 712 302 Z" fill="#b08a5a"/><ellipse cx="694" cy="282" rx="8" ry="6" fill="#4a3520"/>${lsEmoji(725, 316, '🐜', 18)}</g>${lsLabel(655, 215, '🐜 Ağzı güneye', 3, 'ls-d1')}
        <g ${lsStep(4, 'ls-pop')}><circle cx="552" cy="150" r="30" fill="#2eaa83"/><circle cx="546" cy="110" r="24" fill="#2eaa83"/><circle cx="545" cy="186" r="18" fill="#2eaa83"/></g>${lsLabel(585, 70, '🌳 Güneydeki dallar daha gür', 4, 'ls-d1')}
        <g ${lsStep(2)}>${arrow(560, 392, 420, 392, '#3d4f63', 3)}${arrow(600, 392, 750, 392, '#3d4f63', 3)}<text x="470" y="418" class="ls-small">Kuzey</text><text x="745" y="418" text-anchor="end" class="ls-small">Güney</text></g>`);
    },

    'sos-yon-ve-kroki-pusula': () => {
      const cx = 190, cy = 215;
      return lsSvg(`${lsLabel(400, 38, 'Teknolojik araçlar da yardım eder', 0)}
        <g ${lsStep(1, 'ls-pop')}><circle cx="${cx}" cy="${cy}" r="112" fill="#c8733d"/><circle cx="${cx}" cy="${cy}" r="96" fill="#fff"/>
          ${[...Array(16)].map((_, i) => { const a = i * Math.PI / 8, r1 = i % 4 ? 88 : 80; return `<line x1="${(cx + r1 * Math.sin(a)).toFixed(1)}" y1="${(cy - r1 * Math.cos(a)).toFixed(1)}" x2="${(cx + 95 * Math.sin(a)).toFixed(1)}" y2="${(cy - 95 * Math.cos(a)).toFixed(1)}" stroke="#7a6a55" stroke-width="2"/>`; }).join('')}
          <text x="${cx}" y="${cy - 56}" text-anchor="middle" class="ls-cap" style="fill:#d9472b">K</text><text x="${cx}" y="${cy + 72}" text-anchor="middle" class="ls-cap">G</text>
          <text x="${cx + 66}" y="${cy + 7}" text-anchor="middle" class="ls-cap">D</text><text x="${cx - 66}" y="${cy + 7}" text-anchor="middle" class="ls-cap">B</text>
          <path d="M${cx - 9} ${cy} L${cx} ${cy - 50} L${cx + 9} ${cy} Z" fill="#d9472b"/><path d="M${cx - 9} ${cy} L${cx} ${cy + 50} L${cx + 9} ${cy} Z" fill="#9aa7b1"/><circle cx="${cx}" cy="${cy}" r="6" fill="#3d4f63"/></g>
        ${lsLabel(cx, 368, '🧲 Mıknatıslı ibre: kuzey', 1, 'ls-d1')}
        <g ${lsStep(2, 'ls-rise')}><rect x="400" y="70" width="360" height="72" rx="18" class="ls-card"/><text x="420" y="113" class="ls-cap">Doğal ipuçları</text><text x="665" y="106" text-anchor="middle" dominant-baseline="central" font-size="28">☀️ ⭐ 🌿 🐜</text></g>
        <g ${lsStep(2, 'ls-rise ls-d1')}><rect x="400" y="152" width="360" height="72" rx="18" class="ls-card"/><text x="420" y="195" class="ls-cap">Beşerî araç</text>${lsEmoji(620, 188, '🧭', 28)}<text x="645" y="196" class="ls-cap">pusula</text></g>
        <g ${lsStep(3, 'ls-rise')}><rect x="420" y="250" width="84" height="160" rx="14" fill="#1b2a35"/><rect x="428" y="264" width="68" height="128" rx="6" fill="#eef6e8"/>
          <path d="M428 300 H496 M428 350 H496 M455 264 V392" stroke="#cfd6dc" stroke-width="7"/><path d="M455 350 V300 H496" stroke="#4c8be6" stroke-width="4" fill="none"/>${lsEmoji(480, 290, '📍', 22)}
          <text x="530" y="292" class="ls-cap">Harita ve</text><text x="530" y="320" class="ls-cap">navigasyon</text></g>
        ${lsLabel(640, 392, '🏫 Okulu buluruz', 4)}`);
    },

    'sos-yon-ve-kroki-kroki': () => lsSvg(`${lsLabel(400, 38, 'KROKİ: kuş bakışı, basit, kabataslak çizim', 0)}
      <g ${lsStep(1, 'ls-rise')}><path d="M60 196 L110 156 L160 196 Z" fill="#e25d3f"/><rect x="70" y="196" width="80" height="62" fill="#fff3d6" stroke="#c9a24a" stroke-width="2"/><rect x="98" y="222" width="24" height="36" fill="#8a5a2b"/>
        <text x="110" y="284" text-anchor="middle" class="ls-small">yandan</text>${arrow(172, 222, 228, 222, '#3d4f63', 4)}
        <rect x="245" y="186" width="92" height="72" fill="#e25d3f" stroke="#a33a24" stroke-width="2"/><path d="M245 186 L272 222 L310 222 L337 186 M245 258 L272 222 M337 258 L310 222" stroke="#a33a24" stroke-width="2" fill="none"/>
        <text x="291" y="284" text-anchor="middle" class="ls-small">kuş bakışı</text>
        ${lsEmoji(291, 92, '🐦', 40)}<path d="M291 118 V178" stroke="#3d4f63" stroke-width="3" stroke-dasharray="6 5"/></g>
      ${lsLabel(210, 330, '👀 Ölçü yok, göz kararı', 2)}
      ${lsLabel(210, 376, '✏️ Kroki: ölçek yok', 3)}${lsLabel(210, 420, '🗺️ Harita: ölçekli', 3, 'ls-d1')}
      <g ${lsStep(4, 'ls-rise')}><rect x="420" y="75" width="340" height="345" rx="12" fill="#fffdf5" stroke="#c9b8a0" stroke-width="3"/>
        <rect x="422" y="236" width="336" height="26" fill="#cfd6dc"/><rect x="576" y="77" width="26" height="341" fill="#cfd6dc"/>
        ${place(445, 130, 100, 70, 'Ev', '#fff3d6', 'ls-cap')}${place(622, 130, 112, 74, 'Okul', '#f6d365', 'ls-cap')}
        ${place(445, 290, 100, 90, 'Park', '#9bd27d', 'ls-cap')}${place(622, 300, 112, 70, 'Market', '#f2c7a5', 'ls-cap')}${north(712, 104)}</g>`),

    'sos-yon-ve-kroki-ciz': () => lsSvg(`<rect x="40" y="40" width="480" height="380" rx="10" fill="#fffdf5" stroke="#c9b8a0" stroke-width="3"/>
      <text x="60" y="74" class="ls-cap">Okulumuzun krokisi</text>${lsEmoji(495, 400, '✏️', 26)}
      <g ${lsStep(1, 'ls-pop')}>${north(470, 80)}</g>
      <g ${lsStep(2, 'ls-rise')}><rect x="42" y="358" width="476" height="34" fill="#cfd6dc"/><path d="M50 375 H510" stroke="#fff" stroke-width="3" stroke-dasharray="14 10"/>
        <rect x="80" y="110" width="220" height="90" fill="#f6d365" stroke="#7a6a55" stroke-width="2"/><rect x="330" y="150" width="80" height="50" fill="#f2c7a5" stroke="#7a6a55" stroke-width="2"/>
        <rect x="330" y="220" width="170" height="70" fill="#a9cce3" stroke="#7a6a55" stroke-width="2"/><rect x="80" y="220" width="220" height="125" fill="#d5efc4" stroke="#7cb35b" stroke-width="2" stroke-dasharray="8 5"/>
        <rect x="170" y="345" width="40" height="13" fill="#d5efc4"/></g>
      <g ${lsStep(3)}><text x="190" y="150" text-anchor="middle" class="ls-cap">Okul</text><text x="370" y="181" text-anchor="middle" class="ls-small">Kantin</text>
        <text x="415" y="261" text-anchor="middle" class="ls-small">Spor salonu</text><text x="92" y="243" class="ls-small">Bahçe</text><text x="400" y="381" text-anchor="middle" class="ls-small">Okul Caddesi</text></g>
      <g ${lsStep(4, 'ls-pop')}><rect x="150" y="188" width="100" height="24" rx="6" fill="#2eaa83"/><text x="200" y="205" text-anchor="middle" style="font:800 14px Segoe UI,Arial,sans-serif;fill:#fff">ACİL ÇIKIŞ</text>
        <rect x="100" y="256" width="180" height="76" rx="10" fill="#2eaa8340" stroke="#2eaa83" stroke-width="3"/><text x="190" y="290" text-anchor="middle" class="ls-small">Acil toplanma</text><text x="190" y="312" text-anchor="middle" class="ls-small">alanı</text>
        <rect x="330" y="302" width="110" height="44" rx="8" fill="#5d6d7e"/><text x="385" y="330" text-anchor="middle" style="font:800 15px Segoe UI,Arial,sans-serif;fill:#fff">Sığınak</text></g>
      ${lsPill(640, 92, '1. Kuzey oku', '#08796e', 1)}${lsPill(640, 152, '2. Yollar, binalar', '#08796e', 2)}${lsPill(640, 212, '3. Yer adları', '#08796e', 3)}${lsPill(640, 272, '4. Güvenli alanlar', '#2eaa83', 4)}
      <g ${lsStep(5, 'ls-rise')}><rect x="540" y="310" width="220" height="110" rx="18" class="ls-card"/>${lsEmoji(650, 340, '🚨', 30)}
        <text x="650" y="380" text-anchor="middle" class="ls-small">Deprem ve yangında</text><text x="650" y="404" text-anchor="middle" class="ls-small">güvenli yeri biliriz</text></g>`),

    'sos-yon-ve-kroki-oku': () => {
      const box = (cx, cy, name, fill, cap, n) => `${place(cx - 75, cy - 30, 150, 60, '', fill)}<text x="${cx}" y="${cy + (cap ? -4 : 6)}" text-anchor="middle" class="ls-cap">${name}</text>
        ${cap ? `<g ${lsStep(n, 'ls-pop')}><text x="${cx}" y="${cy + 20}" text-anchor="middle" class="ls-small" style="fill:#d9472b">${cap}</text></g>` : ''}`;
      return lsSvg(`<rect x="40" y="40" width="720" height="380" rx="14" fill="#fffdf5" stroke="#c9b8a0" stroke-width="3"/>
        <rect x="120" y="165" width="560" height="20" fill="#cfd6dc"/><rect x="120" y="295" width="560" height="20" fill="#cfd6dc"/><rect x="295" y="60" width="20" height="350" fill="#cfd6dc"/><rect x="485" y="60" width="20" height="350" fill="#cfd6dc"/>
        ${box(400, 110, 'Okul', '#f6d365', 'kuzeyinde', 2)}${box(590, 110, 'Cami', '#d6e4ee', 'kuzeydoğusunda', 3)}
        ${box(210, 240, 'Market', '#f2c7a5', 'batısında', 1)}${box(400, 240, 'Ayşe’nin evi', '#ffe0b8', '', 0)}${box(590, 240, 'Eczane', '#d5efc4', 'doğusunda', 1)}
        ${box(400, 370, 'Park', '#9bd27d', 'güneyinde', 2)}
        <g ${lsStep(0, 'ls-pop')}>${north(90, 92)}<circle cx="90" cy="92" r="34" fill="none" stroke="#d9472b" stroke-width="4"/></g>
        <g ${lsStep(1)}>${arrow(476, 240, 514, 240, '#d9472b', 4)}${arrow(324, 240, 286, 240, '#d9472b', 4)}</g>
        <g ${lsStep(2)}>${arrow(400, 209, 400, 142, '#d9472b', 4)}${arrow(400, 271, 400, 338, '#d9472b', 4)}</g>
        <g ${lsStep(3)}>${arrow(476, 210, 514, 142, '#d9472b', 4, '6 4')}</g>
        ${lsLabel(195, 352, '🚶 Parka: güneye', 4)}${lsLabel(195, 400, '🚶 Markete: batıya', 4, 'ls-d1')}`);
    },

    'sos-yon-ve-kroki-dikkat': () => {
      const rows = ['✅ Kuzeydoğu doğru, ❌ Doğukuzey yanlış', '✏️ Kroki: ölçek yok · 🗺️ Harita: ölçekli', '🌿 Yosun: kuzey · 🐜 Yuva ağzı: güney', '☀️ Sağ kol güneşe ➜ yüzümüz kuzeye'];
      return lsSvg(`${lsLabel(400, 40, '⚠️ Dikkat!', 0)}
        ${rows.map((t, i) => `<g ${lsStep(i + 1, 'ls-rise')}><rect x="40" y="${80 + i * 85}" width="720" height="70" rx="18" class="ls-card"/><text x="400" y="${122 + i * 85}" text-anchor="middle" class="ls-cap">${t}</text></g>`).join('')}`);
    },

    'sos-yon-ve-kroki-summary': () => lsSummary([['🧭', '4 ana yön,|4 ara yön'], ['☀️', 'Güneş, yıldız,|yosun, pusula'], ['✏️', 'Kroki: kuş bakışı,|ölçüsüz çizim'], ['🚨', 'Krokide güvenli|alanlar']], 'Hazırsan mini teste geçelim!'),
  });
}
