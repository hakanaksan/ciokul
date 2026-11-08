/* Scenes for the video lesson "Günlük Konuşmalarda Dinî İfadeler". Loaded when the lesson opens (see loadLessonScenes in lessons.js). */
{
  const P = 'din-dini-ifadeler';
  const font = (size, weight = 800) => `style="font:${weight} ${size}px Segoe UI,Arial,sans-serif"`;
  // A speech bubble centred on x; the tail points down, shifted by dx from the centre.
  const bubble = (x, y, text, step, dx = -20, cls = 'ls-pop') => {
    const w = lsLabelWidth(text) + 8, t = x + dx;
    return `<g ${lsStep(step, cls)}><path d="M${t - 14} ${y + 14} L${t - 6} ${y + 34} L${t + 14} ${y + 14} Z" fill="#fff" stroke="#08796e" stroke-width="2"/><rect x="${x - w / 2}" y="${y - 30}" width="${w}" height="46" rx="18" fill="#fff" stroke="#08796e" stroke-width="2"/><rect x="${t - 11}" y="${y + 12}" width="22" height="6" fill="#fff"/><text x="${x}" y="${y}" text-anchor="middle" class="ls-label">${text}</text></g>`;
  };
  // A dark green band with a religious expression written in white.
  const banner = (x, y, w, text, size, color = '#0b4f45') =>
    `<rect x="${x - w / 2}" y="${y - 30}" width="${w}" height="56" rx="18" fill="${color}"/><text x="${x}" y="${y + 8}" text-anchor="middle" fill="#fff" ${font(size)}>${text}</text>`;
  const arrow = (x1, x2, y) => `<path d="M${x1} ${y} H${x2 - 10}" stroke="#3d4f63" stroke-width="5" stroke-linecap="round"/><path d="M${x2 - 14} ${y - 9} L${x2} ${y} L${x2 - 14} ${y + 9} Z" fill="#3d4f63"/>`;
  // A simple mosque; (x, y) is the middle of its base.
  const mosque = (x, y) => `<g transform="translate(${x} ${y})">
    <rect x="-105" y="-120" width="210" height="120" fill="#eef3f6" stroke="#9fb6c6" stroke-width="4"/>
    <path d="M-85 -120 Q0 -232 85 -120 Z" fill="#7fb6d6" stroke="#5f97b8" stroke-width="4"/>
    <line x1="0" y1="-176" x2="0" y2="-204" stroke="#d9a43a" stroke-width="5"/><circle cx="0" cy="-208" r="6" fill="#d9a43a"/>
    <path d="M-22 0 V-45 Q0 -72 22 -45 V0 Z" fill="#5b7fa6"/>
    <path d="M-72 -40 V-70 Q-60 -86 -48 -70 V-40 Z M48 -40 V-70 Q60 -86 72 -70 V-40 Z" fill="#9fc6e0"/>
    <rect x="115" y="-262" width="24" height="262" fill="#eef3f6" stroke="#9fb6c6" stroke-width="4"/>
    <path d="M111 -262 L127 -312 L143 -262 Z" fill="#7fb6d6" stroke="#5f97b8" stroke-width="3"/>
    <rect x="107" y="-205" width="40" height="10" rx="3" fill="#9fb6c6"/></g>`;
  // An open Qur'an on a wooden stand (rahle), centred on (cx, cy).
  const book = (cx, cy) => `<g>
    <path d="M${cx - 80} ${cy + 30} L${cx + 80} ${cy + 118} M${cx + 80} ${cy + 30} L${cx - 80} ${cy + 118}" stroke="#8a5a2b" stroke-width="12" stroke-linecap="round"/>
    <path d="M${cx} ${cy + 46} Q${cx - 66} ${cy + 30} ${cx - 128} ${cy + 42} V${cy - 60} Q${cx - 66} ${cy - 72} ${cx} ${cy - 52} Q${cx + 66} ${cy - 72} ${cx + 128} ${cy - 60} V${cy + 42} Q${cx + 66} ${cy + 30} ${cx} ${cy + 46} Z" fill="#1f6f54"/>
    <path d="M${cx} ${cy + 38} Q${cx - 60} ${cy + 22} ${cx - 118} ${cy + 32} V${cy - 56} Q${cx - 60} ${cy - 66} ${cx} ${cy - 46} Z" fill="#fffaf0" stroke="#c9a24a" stroke-width="3"/>
    <path d="M${cx} ${cy + 38} Q${cx + 60} ${cy + 22} ${cx + 118} ${cy + 32} V${cy - 56} Q${cx + 60} ${cy - 66} ${cx} ${cy - 46} Z" fill="#fffaf0" stroke="#c9a24a" stroke-width="3"/>
    ${[0, 1, 2, 3, 4].map(i => `<path d="M${cx - 104} ${cy - 34 + i * 15} H${cx - 16} M${cx + 16} ${cy - 34 + i * 15} H${cx + 104}" stroke="#c9b98a" stroke-width="3" stroke-linecap="round"/>`).join('')}</g>`;
  const panel = (cx, emoji, caption, said, step) =>
    `<g ${lsStep(step, 'ls-rise')}><rect x="${cx - 90}" y="150" width="180" height="180" rx="22" class="ls-card"/>${lsEmoji(cx, 222, emoji, 64)}<text x="${cx}" y="306" text-anchor="middle" class="ls-small">${caption}</text></g>${bubble(cx, 112, said, step, -20, 'ls-pop ls-d1')}`;

  Object.assign(LESSON_SCENES, {
    [`${P}-intro`]: () => lsSvg(`${lsLabel(400, 45, 'Zeynep’in bir günü', 0)}
      ${lsKid(95, 330, 1.1, '#e25d3f', '#3b2416')}${lsLabel(95, 418, 'Zeynep', 0)}
      ${panel(260, '🍳', 'kahvaltıda', 'Bismillah', 1)}${panel(460, '🏫', 'okulda', 'Selamün aleyküm', 2)}${panel(660, '🍲', 'akşam yemeğinde', 'Elhamdülillah', 3)}
      ${lsLabel(460, 400, 'Bunlar dinî ifadeler!', 4)}`),

    [`${P}-din`]: () => {
      const card = (cx, emoji, title, l1, l2, step) => `<g ${lsStep(step, 'ls-rise')}><rect x="${cx - 115}" y="80" width="230" height="220" rx="24" class="ls-card"/>${lsEmoji(cx, 135, emoji, 54)}
        <text x="${cx}" y="205" text-anchor="middle" class="ls-label">${title}</text><text x="${cx}" y="242" text-anchor="middle" class="ls-small">${l1}</text><text x="${cx}" y="267" text-anchor="middle" class="ls-small">${l2}</text></g>`;
      return lsSvg(`${card(145, '📖', 'Din', 'iyiyi ve doğruyu', 'gösteren ilahi kurallar', 0)}
        ${card(400, '🌌', 'Allah', 'evreni ve her şeyi', 'yok iken yaratan', 1)}
        ${card(655, '✉️', 'Peygamber', 'Allah’ın mesajlarını', 'ileten seçilmiş elçi', 2)}
        ${lsPill(400, 352, 'Dinî ifade: kaynağı din olan söz', '#08796e', 3)}
        ${lsLabel(400, 412, '🗣️ Dilimize, kültürümüze yerleşti', 4)}`);
    },

    [`${P}-besmele`]: () => lsSvg(`${lsLabel(400, 42, 'BESMELE', 0)}
      <g ${lsStep(0, 'ls-pop')}>${banner(400, 102, 560, 'Bismillâhirrahmânirrahîm', 30)}</g>
      <text ${lsStep(1, 'ls-cap')} x="400" y="166" text-anchor="middle">Rahman ve Rahim olan Allah’ın adıyla başlarım.</text>
      ${lsPill(190, 222, 'Rahman', '#5b7fa6', 2)}${lsPill(320, 222, 'Rahim', '#5b7fa6', 2, 'ls-d1')}${lsLabel(570, 222, 'Kısaca: Bismillah', 2, 'ls-d2')}
      ${[['🍽️', 'yemek', 95], ['📚', 'ders', 215], ['🧹', 'iş', 335]].map(([e, name, x], i) => `<g ${lsStep(3, 'ls-rise ls-d' + i)}><rect x="${x - 52}" y="262" width="104" height="112" rx="18" class="ls-card"/>${lsEmoji(x, 304, e, 42)}<text x="${x}" y="358" text-anchor="middle" class="ls-small">${name}</text></g>`).join('')}
      ${lsPill(600, 278, 'Allah’ı anarız', '#1f9a73', 4)}${lsPill(600, 323, 'Yardım dileriz', '#1f9a73', 4, 'ls-d1')}${lsPill(600, 368, 'Allah’a sığınırız', '#1f9a73', 4, 'ls-d2')}
      ${lsLabel(400, 422, '🍽️ Besmele bereket getirir', 5)}`),

    [`${P}-euzu`]: () => lsSvg(`${lsLabel(400, 45, 'Kur’an-ı Kerim okumadan önce', 0)}
      ${book(190, 250)}
      <g ${lsStep(1, 'ls-pop')}>${banner(575, 112, 400, 'Eûzü billâhi mineşşeytânirracîm', 20)}</g>
      <g ${lsStep(2)}><text x="575" y="178" text-anchor="middle" class="ls-cap">Kovulmuş şeytanın kötülüğünden</text><text x="575" y="205" text-anchor="middle" class="ls-cap">Allah’a sığınırım.</text></g>
      <g ${lsStep(3, 'ls-rise')}><rect x="370" y="232" width="410" height="108" rx="18" fill="#fff8e6" stroke="#e0c27a" stroke-width="3"/>
        <text x="575" y="264" text-anchor="middle" class="ls-small">“Kur’an okuyacağın vakit, o kovulmuş</text><text x="575" y="289" text-anchor="middle" class="ls-small">şeytandan Allah’a sığın.”</text>
        <text x="575" y="322" text-anchor="middle" class="ls-small" style="fill:#8a6a2a">(Nahl suresi, 98. ayet)</text></g>
      ${lsPill(400, 412, 'Eûzü + Besmele = Eûzü besmele', '#08796e', 4)}`),

    [`${P}-selam`]: () => lsSvg(`${lsLabel(400, 45, 'Selamlaşma', 0)}
      ${lsKid(200, 330, 1.2, '#4c8be6')}${lsKid(600, 330, 1.2, '#e25d3f', '#8a4b2a')}
      ${bubble(220, 140, 'Selamün aleyküm!', 1, -20)}<text ${lsStep(1, 'ls-d1 ls-small')} x="220" y="198" text-anchor="middle">ya da: Esselamü aleyküm</text>
      ${lsPill(400, 272, 'Esenlik, barış, güven', '#1f9a73', 2)}<text ${lsStep(2, 'ls-d1 ls-small')} x="400" y="306" text-anchor="middle">sizin üzerinize olsun</text>
      ${bubble(580, 140, 'Aleyküm selam!', 3, 20)}
      ${[['Günaydın', 120], ['Merhaba', 280], ['Hayırlı günler', 470], ['İyi akşamlar', 680]].map(([t, x], i) => lsLabel(x, 422, t, 4, 'ls-d' + i)).join('')}
      <g ${lsStep(5, 'ls-pop')}>${lsEmoji(400, 356, '🤝 ❤️ 🏠', 32)}</g>`),

    [`${P}-hamd`]: () => lsSvg(`${lsLabel(400, 40, 'Allah’ın nimetleri', 0)}
      ${lsFoodRow([['🍞', 'yiyecekler'], ['💪', 'sağlık'], ['👨‍👩‍👧', 'ailemiz'], ['🌳', 'doğa']], 135, 0)}
      ${lsPill(225, 247, 'HAMD: Allah’ı övmek', '#e8832f', 1)}${lsPill(575, 247, 'ŞÜKÜR: teşekkür etmek', '#1f9a73', 1, 'ls-d1')}
      ${lsLabel(400, 302, 'Elhamdülillah = Hamd, Allah içindir', 2)}
      ${lsLabel(260, 357, 'Allah’a şükürler olsun', 3)}${lsLabel(570, 357, 'Hamdolsun', 3, 'ls-d1')}
      <g ${lsStep(4, 'ls-rise')}><rect x="150" y="383" width="500" height="60" rx="16" fill="#fff8e6" stroke="#e0c27a" stroke-width="3"/>
        <text x="400" y="408" text-anchor="middle" class="ls-small">“…Bana şükredin, sakın nankörlük etmeyin.”</text>
        <text x="400" y="432" text-anchor="middle" class="ls-small" style="fill:#8a6a2a">(Bakara suresi, 152. ayet)</text></g>`),

    [`${P}-tekbir`]: () => lsSvg(`<rect x="0" y="400" width="800" height="50" fill="#bfe3b4"/>
      ${mosque(195, 400)}${lsLabel(195, 45, 'TEKBİR', 0)}
      <g ${lsStep(0, 'ls-pop')}>${banner(580, 95, 360, 'Allâhu ekber', 32)}</g>
      <text ${lsStep(0, 'ls-d1 ls-cap')} x="580" y="158" text-anchor="middle">Allah en büyüktür</text>
      ${lsLabel(580, 209, '✨ Yücelik ve sevinç anları', 1)}
      <g ${lsStep(2)}>${[14, 28, 42].map(r => `<path d="M${336 + r * 0.3} ${128 - r} Q${348 + r} 128 ${336 + r * 0.3} ${128 + r}" stroke="#08796e" stroke-width="4" fill="none" stroke-linecap="round"/>`).join('')}</g>
      ${lsLabel(580, 257, '🔊 Ezan tekbirle başlar', 2)}
      ${lsLabel(580, 305, 'Namaz tekbirle başlar', 3)}
      <g ${lsStep(4, 'ls-rise')}><rect x="380" y="345" width="400" height="98" rx="18" fill="#fff8e6" stroke="#e0c27a" stroke-width="3"/></g>
      ${lsPill(580, 345, '🎉 Bayram tekbiri', '#e8832f', 4)}
      <g ${lsStep(4, 'ls-d1')} data-hide="5"><text x="580" y="382" text-anchor="middle" class="ls-small">Allâhu ekber, Allâhu ekber,</text><text x="580" y="405" text-anchor="middle" class="ls-small">Lâ ilâhe illallâhu vallâhu ekber,</text><text x="580" y="428" text-anchor="middle" class="ls-small">Allâhu ekber ve lillâhi’l-hamd.</text></g>
      <g ${lsStep(5)}><text x="580" y="382" text-anchor="middle" class="ls-small">Allah en büyüktür. Allah’tan başka</text><text x="580" y="405" text-anchor="middle" class="ls-small">ilah yoktur. Allah en büyüktür ve</text><text x="580" y="428" text-anchor="middle" class="ls-small">hamd O’na mahsustur.</text></g>`),

    [`${P}-salavat`]: () => lsSvg(`${lsLabel(400, 45, 'Peygamberimizin adını duyunca', 0)}
      ${lsKid(110, 330, 1.2, '#2eaa83')}${lsEmoji(182, 296, '📖', 36)}
      <g ${lsStep(1, 'ls-pop')}>${banner(505, 110, 480, 'Sallallâhu aleyhi ve sellem', 26)}</g>
      <g ${lsStep(2)}><text x="505" y="174" text-anchor="middle" class="ls-cap">Allah ona salat ve selam eylesin.</text><text x="505" y="200" text-anchor="middle" class="ls-small">yani rahmet ve esenlik versin</text></g>
      ${lsPill(505, 247, 'SALAVAT: sevgi ve saygı duası', '#e8832f', 3)}
      <g ${lsStep(4, 'ls-rise')}><rect x="330" y="275" width="350" height="52" rx="14" class="ls-card"/><text x="505" y="309" text-anchor="middle" class="ls-cap">Hz. Muhammed <tspan style="fill:#e25d3f">(sav.)</tspan></text></g>
      <g ${lsStep(5, 'ls-rise')}><rect x="240" y="345" width="540" height="96" rx="18" fill="#eef6fb" stroke="#9fb6c6" stroke-width="3"/>
        <text x="510" y="377" text-anchor="middle" class="ls-small">Esselâtü vesselâmü aleyke yâ Resûlallah</text>
        <text x="510" y="403" text-anchor="middle" class="ls-small" style="fill:#0b4f45">Salat ve selam senin üzerine olsun,</text>
        <text x="510" y="427" text-anchor="middle" class="ls-small" style="fill:#0b4f45">ey Allah’ın elçisi.</text></g>`),

    [`${P}-subhanallah`]: () => lsSvg(`
      <rect x="30" y="70" width="350" height="230" rx="24" fill="url(#lsSky)" stroke="#9fc6e0" stroke-width="3"/>
      ${[[130, '#e25d3f'], [112, '#f2994a'], [94, '#f2c94c'], [76, '#6fbf73'], [58, '#4fb3e8']].map(([r, c]) => `<path d="M${205 - r} 292 A${r} ${r} 0 0 1 ${205 + r} 292" stroke="${c}" stroke-width="18" fill="none"/>`).join('')}
      ${lsEmoji(66, 98, '✨', 28)}${lsEmoji(346, 98, '✨', 28)}
      ${bubble(205, 112, 'Sübhanallah!', 0, 0)}
      <g ${lsStep(1)}><text x="205" y="336" text-anchor="middle" class="ls-cap">Allah her türlü eksiklik</text><text x="205" y="363" text-anchor="middle" class="ls-cap">ve kusurdan uzaktır.</text></g>
      <g ${lsStep(2, 'ls-rise')}><rect x="420" y="70" width="350" height="230" rx="24" class="ls-card"/>${lsEmoji(595, 196, '😔', 80)}<text x="595" y="280" text-anchor="middle" class="ls-small">bir hata yapınca</text></g>
      ${bubble(595, 112, 'Estağfirullah', 2, 0, 'ls-pop ls-d1')}
      <g ${lsStep(3)}><text x="595" y="336" text-anchor="middle" class="ls-cap">Allah’tan af ve</text><text x="595" y="363" text-anchor="middle" class="ls-cap">bağışlanma dilerim.</text></g>
      ${lsPill(595, 418, 'Tövbe: pişman olup dönmek', '#5b7fa6', 4)}`),

    [`${P}-dikkat`]: () => {
      const rows = [['Besmele', 'Bismillâhirrahmânirrahîm', '#08796e', 1, ''], ['Tekbir', 'Allâhu ekber', '#e8832f', 2, ''], ['Salavat', 'Sallallâhu aleyhi ve sellem', '#d9472b', 3, ''],
        ['Hamd', 'Elhamdülillah', '#5b7fa6', 4, ''], ['Selam', 'Selamün aleyküm', '#1f9a73', 4, 'ls-d2']];
      return lsSvg(`${lsLabel(400, 42, '⚠️ Karıştırmayalım!', 0)}
        ${rows.map(([name, said, color, step, d], i) => { const y = 108 + i * 66;
          return `${lsPill(170, y, name, color, step, d)}<g ${lsStep(step, d)}>${arrow(252, 380, y - 5)}</g>${lsLabel(565, y, said, step, d)}`; }).join('')}`);
    },

    [`${P}-summary`]: () => lsSummary([['🍽️', 'Besmeleyle başla,|eûzü ile sığın'], ['👋', 'Selam: esenlik|ve barış dileği'], ['🤲', 'Hamd ile şükür,|tekbir ile yücelik'], ['💚', 'Salavat:|Peygamberimize dua']], 'Hazırsan mini teste geçelim!'),
  });
}
