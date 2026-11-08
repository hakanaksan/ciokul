/* Scenes for the video lesson "Kimlik Kartımız". Loaded when the lesson opens (see loadLessonScenes in lessons.js). */
{
  const font = 'font-family="Segoe UI,Arial,sans-serif"';
  const at = (n, cls = '') => n == null ? '' : lsStep(n, cls);
  // Front of an identity card: 380×240 in its own units, top-left at (x, y), scaled by s.
  // steps says when parts appear (no, name, seri, photo); "lite" draws grey bars instead of text.
  const card = (x, y, s, f = {}, steps = {}, extra = '', lite = false) => {
    const lines = [
      ['T.C. Kimlik No', f.no || '12345678901', steps.no],
      ['Soyadı', f.soyad || 'YILMAZ', steps.name],
      ['Adı', f.ad || 'ELA', steps.name],
      ['Doğum Tarihi', f.dogum || '15.03.2016', steps.name],
      ['Cinsiyeti / Uyruğu', `${f.cins || 'K'} / T.C.`, steps.seri],
      ['Seri No', f.seri || 'A12B34567', steps.seri],
      ['Son Geçerlilik', f.son || '15.03.2031', steps.photo],
    ];
    const text = lite
      ? lines.map((l, i) => `<rect x="124" y="${54 + i * 24}" width="${[200, 120, 90, 150, 130, 140, 160][i]}" height="12" rx="6" fill="#9fb6c6"/>`).join('')
      : lines.map(([label, value, n], i) => `<g ${at(n)}><text x="124" y="${66 + i * 24}" font-size="14" font-weight="700" fill="#22392f"><tspan fill="#5b7fa6">${label}: </tspan>${value}</text></g>`).join('');
    const photo = f.noPhoto
      ? `<text x="62" y="122" text-anchor="middle" font-size="44" font-weight="900" fill="#9fb6c6">?</text>`
      : `<g ${at(steps.photo)}>${lsEmoji(62, 108, f.face || '👧', 66)}<path d="M22 204 q10 -18 20 0 t20 -2 t20 4 t18 -6" stroke="#3d4f63" stroke-width="2.5" fill="none" stroke-linecap="round"/></g>`;
    return `<g transform="translate(${x} ${y}) scale(${s})" ${font}>
      <rect width="380" height="240" rx="16" fill="#eef5fb" stroke="#8fb3d1" stroke-width="3"/>
      <path d="M0 196 Q120 168 240 202 T380 186 V224 Q380 240 364 240 H16 Q0 240 0 224 Z" fill="#d7e8f7"/>
      <path d="M0 16 Q0 0 16 0 H364 Q380 0 380 16 V38 H0 Z" fill="#2f6f9f"/>
      <text x="190" y="25" text-anchor="middle" font-size="15" font-weight="800" fill="#fff">TÜRKİYE CUMHURİYETİ KİMLİK KARTI</text>
      <rect x="16" y="52" width="92" height="116" rx="8" fill="#fff" stroke="#9fb6c6" stroke-width="2" stroke-dasharray="${f.noPhoto ? '6 5' : '0'}"/>
      ${photo}${text}${extra}</g>`;
  };
  // Back of the card: parents' names, issuing office (blurred) and the machine-readable lines.
  const back = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" ${font}>
      <rect width="380" height="240" rx="16" fill="#eef5fb" stroke="#8fb3d1" stroke-width="3"/>
      <text x="24" y="44" font-size="15" font-weight="700" fill="#22392f"><tspan fill="#5b7fa6">Anne Adı: </tspan>AYŞE</text>
      <text x="24" y="74" font-size="15" font-weight="700" fill="#22392f"><tspan fill="#5b7fa6">Baba Adı: </tspan>MEHMET</text>
      <text x="24" y="104" font-size="15" font-weight="700" fill="#5b7fa6">Veren Makam:</text><rect x="130" y="92" width="150" height="14" rx="7" fill="#9fb6c6"/>
      <rect x="16" y="140" width="348" height="84" rx="10" fill="#fff"/>
      ${[158, 180, 202].map(y => `<rect x="28" y="${y}" width="324" height="10" rx="5" fill="#c9d6de"/>`).join('')}</g>`;
  const mark = (x, y, ok, n) => `<g ${lsStep(n, 'ls-pop')}><circle cx="${x}" cy="${y}" r="24" fill="${ok ? '#2eaa83' : '#e25d3f'}"/>${ok
    ? `<path d="M${x - 11} ${y} l8 9 l15 -17" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round"/>`
    : `<path d="M${x - 9} ${y - 9} l18 18 M${x + 9} ${y - 9} l-18 18" stroke="#fff" stroke-width="6" stroke-linecap="round"/>`}</g>`;
  // A simple fingerprint: nested arches; "turn" makes two prints look different.
  const print = (x, y, r, turn) => `<g transform="translate(${x} ${y}) rotate(${turn})" fill="none" stroke="#8a5a2b" stroke-width="2.5" stroke-linecap="round">${[0.2, 0.4, 0.6, 0.8, 1].map(k =>
    `<path d="M${-r * k} ${r * 0.5} Q${-r * k} ${-r * k} 0 ${-r * k} Q${r * k} ${-r * k} ${r * k} ${r * 0.5 - (turn > 0 ? k * 8 : 0)}"/>`).join('')}</g>`;
  const box = (ly, color, n) => `<rect ${lsStep(n)} x="118" y="${ly - 17}" width="252" height="23" rx="6" fill="none" stroke="${color}" stroke-width="3.5"/>`;

  Object.assign(LESSON_SCENES, {
    'sos-kimlik-kartimiz-intro': () => lsSvg(`${lsLabel(400, 50, 'Bu kart ne işe yarar?', 0)}
      <g data-hide="3" class="ls-in on">${card(95, 112, 0.42, {}, {}, '', true)}
        <rect x="60" y="170" width="240" height="160" rx="22" fill="#8a5a2b"/><rect x="72" y="182" width="216" height="136" rx="16" fill="none" stroke="#c79a63" stroke-width="3" stroke-dasharray="8 6"/>
        <rect x="60" y="170" width="240" height="54" rx="22" fill="#9c6a37"/><circle cx="270" cy="248" r="10" fill="#e8c07a"/></g>
      <g ${lsStep(1, 'ls-pop')}>${card(350, 95, 1.05)}</g>
      ${lsLabel(400, 400, '📜 Kim olduğumuzu gösteren resmî belge', 2)}
      <g ${lsStep(3, 'ls-pop')}>${lsEmoji(110, 160, '👨', 56)}${lsEmoji(240, 160, '👩', 56)}${lsEmoji(110, 270, '👧', 56)}${lsEmoji(240, 270, '👶', 56)}
        <text x="175" y="345" text-anchor="middle" class="ls-small">bebekler ve çocuklar da</text></g>`),

    'sos-kimlik-kartimiz-front': () => lsSvg(`${lsLabel(240, 55, 'Kartın ön yüzü', 0)}
      ${card(40, 95, 1.05, {}, { no: 1, name: 2, seri: 3, photo: 4 })}
      ${lsLabel(615, 130, '🔢 Kimlik numarası', 1)}${lsLabel(615, 185, '👤 Adı, soyadı', 2)}${lsLabel(615, 240, '🎂 Doğum tarihi', 2, 'ls-d1')}
      ${lsLabel(615, 295, '🚻 Cinsiyet, uyruk', 3)}${lsLabel(615, 350, '🔖 Seri numarası', 3, 'ls-d1')}
      ${lsLabel(615, 405, '📷 Fotoğraf ve imza', 4)}${lsLabel(240, 395, '📅 Son geçerlilik tarihi', 4, 'ls-d1')}`),

    'sos-kimlik-kartimiz-back': () => lsSvg(`${lsLabel(230, 55, 'Kartın arka yüzü', 0)}${back(40, 95, 1)}
      <g ${lsStep(1, 'ls-pop')}><rect x="540" y="115" width="120" height="90" rx="16" fill="#e0b84f" stroke="#a8862f" stroke-width="4"/>
        <path d="M540 145 H580 M540 175 H580 M620 145 H660 M620 175 H660 M580 115 V205 M620 115 V205" stroke="#a8862f" stroke-width="3"/><rect x="580" y="145" width="40" height="30" rx="5" fill="#f2d27a" stroke="#a8862f" stroke-width="3"/></g>
      ${lsLabel(600, 250, 'Elektronik çip = yonga', 1)}
      <g ${lsStep(2, 'ls-rise')}>${lsEmoji(490, 310, '📷', 40)}${lsEmoji(600, 310, '👆', 40)}${lsEmoji(715, 310, '📋', 40)}
        <text x="490" y="360" text-anchor="middle" class="ls-small">fotoğraf</text><text x="600" y="360" text-anchor="middle" class="ls-small">parmak izi</text><text x="715" y="360" text-anchor="middle" class="ls-small">nüfus kaydı</text></g>
      ${lsPill(400, 415, '💡 Akıllı kart', '#1f9a73', 3)}`),

    'sos-kimlik-kartimiz-number': () => lsSvg(`${lsLabel(400, 45, 'Kimlik numarası', 0)}
      ${[...'12345678901'].map((d, i) => `<g ${lsStep(0, 'ls-pop ls-d' + Math.min(5, Math.floor(i / 2)))}><rect x="${52 + i * 64}" y="80" width="56" height="56" rx="10" fill="#fff" stroke="#2f6f9f" stroke-width="3"/><text x="${80 + i * 64}" y="119" text-anchor="middle" font-size="30" font-weight="800" fill="#2f6f9f" ${font}>${d}</text></g>`).join('')}
      <g ${lsStep(0, 'ls-d5')}><path d="M52 146 Q52 158 64 158 H388 Q400 158 400 170 Q400 158 412 158 H736 Q748 158 748 146" stroke="#3d4f63" stroke-width="3" fill="none"/><text x="400" y="196" text-anchor="middle" class="ls-cap">11 rakam</text></g>
      <g ${lsStep(1, 'ls-rise')}><rect x="40" y="215" width="350" height="170" rx="22" class="ls-card"/>
        ${[['👦', '345…12', 105], ['👩', '701…48', 215], ['👴', '128…90', 325]].map(([e, n, x]) => `${lsEmoji(x, 262, e, 48)}<text x="${x}" y="315" text-anchor="middle" font-size="16" font-weight="700" fill="#2f6f9f" ${font}>${n}</text>`).join('')}
        <text x="215" y="362" text-anchor="middle" class="ls-cap">🔒 Herkesinki farklı</text></g>
      <g ${lsStep(2, 'ls-rise')}><rect x="410" y="215" width="350" height="170" rx="22" class="ls-card"/>
        ${lsEmoji(470, 262, '👶', 44)}<text x="525" y="272" text-anchor="middle" font-size="28">➜</text>${lsEmoji(580, 262, '🧒', 44)}<text x="635" y="272" text-anchor="middle" font-size="28">➜</text>${lsEmoji(690, 262, '👴', 44)}
        <text x="585" y="315" text-anchor="middle" font-size="18" font-weight="800" fill="#2f6f9f" ${font}>12345678901</text>
        <text x="585" y="362" text-anchor="middle" class="ls-cap">📌 Hiç değişmez</text></g>
      ${lsPill(400, 418, '🤫 Tanımadığın kişilerle paylaşma', '#d9472b', 3)}`),

    'sos-kimlik-kartimiz-twins': () => {
      const marks = [box(92, '#1f9a73', 1), box(140, '#1f9a73', 1), box(164, '#1f9a73', 1), box(66, '#e25d3f', 2), box(188, '#e25d3f', 3)].join('');
      return lsSvg(`${lsLabel(400, 40, 'İkizlerin kimlik kartları', 0)}
        ${card(30, 75, 0.9, { ad: 'BUSE', no: '34567890124', seri: 'A12B34567' }, {}, marks)}
        ${card(428, 75, 0.9, { ad: 'EZGİ', no: '34567890132', seri: 'A12B34568' }, {}, marks)}
        ${lsPill(210, 335, '✅ Aynı: soyadı, doğum tarihi', '#1f9a73', 1)}${lsPill(590, 335, '❌ Farklı: kimlik numarası', '#d9472b', 2)}
        ${lsPill(590, 380, '❌ Farklı: seri numarası', '#d9472b', 3)}
        <g ${lsStep(4, 'ls-pop')}>${print(90, 405, 26, -12)}<text x="140" y="418" text-anchor="middle" font-size="36" font-weight="900" fill="#e25d3f">≠</text>${print(190, 405, 26, 18)}
          <text x="230" y="412" class="ls-small">ikizlerde bile farklı</text></g>`);
    },

    'sos-kimlik-kartimiz-office': () => lsSvg(`
      <path d="M40 150 L190 85 L340 150 Z" fill="#c9d6cd"/><rect x="60" y="150" width="260" height="190" fill="#fff" stroke="#9fb6c6" stroke-width="4"/>
      <rect x="80" y="165" width="220" height="40" rx="8" fill="#2f6f9f"/><text x="190" y="191" text-anchor="middle" font-size="16" font-weight="800" fill="#fff" ${font}>NÜFUS MÜDÜRLÜĞÜ</text>
      ${[90, 250].map(x => `<rect x="${x}" y="225" width="40" height="40" rx="4" fill="#bfe6ff" stroke="#9fb6c6" stroke-width="3"/>`).join('')}
      <rect x="160" y="265" width="60" height="75" rx="6" fill="#8fa3b3"/><rect x="30" y="340" width="320" height="10" rx="5" fill="#9fb6c6"/>
      <g ${lsStep(0, 'ls-pop')}>${lsEmoji(110, 300, '👩', 40)}${lsEmoji(270, 300, '👨', 40)}</g>
      <g ${lsStep(1, 'ls-rise')}><rect x="380" y="80" width="390" height="80" rx="18" class="ls-card"/>${lsEmoji(422, 120, '👶', 44)}${card(462, 91, 0.24, {}, {}, '', true)}
        <text x="572" y="114" class="ls-small">Bebeklere de kimlik</text><text x="572" y="138" class="ls-small">kartı çıkarılabilir</text></g>
      <g ${lsStep(2, 'ls-rise')}><rect x="380" y="175" width="390" height="100" rx="18" class="ls-card"/>${card(395, 189, 0.3, { noPhoto: true }, {}, '', true)}
        <text x="525" y="218" class="ls-small">15 yaşından küçük:</text><text x="525" y="246" class="ls-small">fotoğraf zorunlu değil</text></g>
      <g ${lsStep(3, 'ls-rise')}><rect x="380" y="290" width="390" height="100" rx="18" class="ls-card"/>${card(395, 304, 0.3, { face: '🧑' }, {}, '', true)}
        <text x="525" y="333" class="ls-small">15 yaşını dolduran:</text><text x="525" y="361" class="ls-small">fotoğraflı kart</text></g>
      ${lsLabel(190, 400, '📅 Süresi bitince yenile', 4)}`),

    'sos-kimlik-kartimiz-use': () => {
      const items = [['🏫', 'Okul kaydı', 1, true], ['🏥', 'Hastane', 2, true], ['🛂', 'Pasaport', 3, true], ['🌳', 'Park', 4, false], ['🛒', 'Market', 4, false]];
      return lsSvg(`${lsLabel(400, 60, 'Kimliğimizi nerede kullanırız?', 0)}
        ${items.map(([e, name, n, ok], i) => { const x = 104 + i * 148;
          return `<g ${lsStep(n, 'ls-rise' + (i === 4 ? ' ls-d1' : ''))}><rect x="${x - 65}" y="140" width="130" height="130" rx="20" class="ls-card"/>${lsEmoji(x, 190, e, 52)}<text x="${x}" y="250" text-anchor="middle" class="ls-small">${name}</text></g>${mark(x, 315, ok, n)}`; }).join('')}
        ${lsPill(252, 395, '✅ Kimlik gerekir', '#1f9a73', 3)}${lsPill(622, 395, '❌ Gerekmez', '#d9472b', 4)}`);
    },

    'sos-kimlik-kartimiz-history': () => lsSvg(`${lsLabel(400, 50, 'Kimlik belgesinin tarihi', 0)}
      <g ${lsStep(0)}><line x1="50" y1="300" x2="735" y2="300" stroke="#3d4f63" stroke-width="6" stroke-linecap="round"/><path d="M730 286 L756 300 L730 314 Z" fill="#3d4f63"/></g>
      <g ${lsStep(1, 'ls-rise')}><rect x="85" y="105" width="150" height="160" rx="6" fill="#f3e2b8" stroke="#c9a24a" stroke-width="3" transform="rotate(-4 160 185)"/>
        ${[135, 160, 225, 245].map(y => `<line x1="105" y1="${y}" x2="215" y2="${y - 6}" stroke="#c9a24a" stroke-width="3"/>`).join('')}
        <text x="160" y="196" text-anchor="middle" font-size="19" font-weight="800" fill="#8a5a2b" ${font} transform="rotate(-4 160 190)">kafa kâğıdı</text><circle cx="160" cy="300" r="11" fill="#c9a24a"/></g>
      ${lsLabel(160, 345, 'Osmanlı Devleti', 1)}
      <g ${lsStep(2, 'ls-rise')}><rect x="320" y="120" width="70" height="100" rx="8" fill="#4c8be6"/><rect x="410" y="120" width="70" height="100" rx="8" fill="#f28cb1"/>
        ${[355, 445].map(x => `<rect x="${x - 22}" y="140" width="44" height="8" rx="4" fill="#ffffffaa"/><rect x="${x - 16}" y="156" width="32" height="6" rx="3" fill="#ffffffaa"/>`).join('')}
        <text x="355" y="248" text-anchor="middle" class="ls-small">erkek</text><text x="445" y="248" text-anchor="middle" class="ls-small">kadın</text><circle cx="400" cy="300" r="11" fill="#4c8be6"/></g>
      ${lsLabel(400, 345, 'Nüfus cüzdanı', 2)}
      <g ${lsStep(3, 'ls-rise')}>${card(560, 125, 0.45, {}, {}, '', true)}<circle cx="645" cy="300" r="11" fill="#2f6f9f"/></g>
      ${lsLabel(645, 345, 'Akıllı kimlik kartı', 3)}${lsPill(645, 410, '🚫 Renk farkı yok', '#1f9a73', 4)}`),

    'sos-kimlik-kartimiz-dikkat': () => {
      const rows = [['👪', 'Aynı aile: soyadı aynı, kimlik numarası farklı'], ['🏫', 'Okul adı, adres ve meslek kartta yazmaz'], ['🔄', 'Kart yenilenince seri no değişir, kimlik no değişmez'], ['👶', 'Çocukların da kimlik kartı olabilir']];
      return lsSvg(`${lsLabel(400, 45, '⚠️ Dikkat!', 0)}
        ${rows.map(([e, t], i) => { const y = 85 + i * 85;
          return `<g ${lsStep(i + 1, 'ls-rise')}><rect x="50" y="${y}" width="700" height="70" rx="18" class="ls-card"/>${lsEmoji(100, y + 35, e, 36)}<text x="145" y="${y + 42}" class="ls-cap">${t}</text></g>`; }).join('')}`);
    },

    'sos-kimlik-kartimiz-summary': () => lsSummary([['📇', 'Kim olduğumuzu|gösteren belge'], ['🔢', '11 rakam, herkese|özel, hiç değişmez'], ['🔐', 'Çipte fotoğraf ve|parmak izi saklanır'], ['🏛️', 'Nüfus müdürlüğü|verir']], 'Hazırsan mini teste geçelim!'),
  });
}
