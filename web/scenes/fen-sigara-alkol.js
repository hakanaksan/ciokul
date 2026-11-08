/* Scenes for the video lesson "Sigara ve Alkolün Zararları". Loaded when the lesson opens (see loadLessonScenes in lessons.js). */
{
  // A cigarette starting at (x, y), pointing right, with a glowing tip.
  const cig = (x, y, len = 44, rot = 0) => `<g transform="translate(${x} ${y}) rotate(${rot})"><rect x="0" y="-4" width="${len * 0.3}" height="8" fill="#e5a35a"/><rect x="${len * 0.3}" y="-4" width="${len * 0.7}" height="8" fill="#fff" stroke="#c9c3ba" stroke-width="1"/><rect x="${len}" y="-4" width="5" height="8" fill="#e25d3f"/></g>`;
  // Grey smoke curls rising from (x, y) towards (tx, ty).
  const smoke = (x, y, tx, ty, w = 8) => `<g class="ls-wind" fill="none" stroke="#9aa5ad" stroke-width="${w}" stroke-linecap="round" opacity=".75"><path d="M${x} ${y} C${x + 20} ${y - 30} ${(x + tx) / 2 - 30} ${(y + ty) / 2 + 10} ${(x + tx) / 2} ${(y + ty) / 2} S${tx + 20} ${ty + 20} ${tx} ${ty}"/></g>`;
  const bench = (x, y) => `<rect x="${x - 80}" y="${y}" width="160" height="12" rx="4" fill="#a0673a"/><rect x="${x - 80}" y="${y - 40}" width="160" height="12" rx="4" fill="#a0673a"/><rect x="${x - 70}" y="${y + 12}" width="8" height="30" fill="#5c4630"/><rect x="${x + 62}" y="${y + 12}" width="8" height="30" fill="#5c4630"/><rect x="${x - 70}" y="${y - 40}" width="8" height="52" fill="#5c4630"/><rect x="${x + 62}" y="${y - 40}" width="8" height="52" fill="#5c4630"/>`;
  const adult = (x, y, s = 1.15, shirt = '#7d8a96') => lsKid(x, y, s, shirt, '#2b2b2b');
  const lungs = (cx, cy, s = 1, color = '#f19aa6', stroke = '#c4596a') => `<g transform="translate(${cx} ${cy}) scale(${s})">
    <path d="M0 -110 V-60 M0 -60 L-26 -36 M0 -60 L26 -36" stroke="#d98c96" stroke-width="12" fill="none" stroke-linecap="round"/>
    <path d="M-20 -70 C-80 -84 -112 30 -96 84 C-80 112 -40 104 -24 84 C-14 40 -14 -20 -20 -70 Z" fill="${color}" stroke="${stroke}" stroke-width="4"/>
    <path d="M20 -70 C80 -84 112 30 96 84 C80 112 40 104 24 84 C14 40 14 -20 20 -70 Z" fill="${color}" stroke="${stroke}" stroke-width="4"/></g>`;
  const card = (x, y, w, h, step, inner) => `<g ${lsStep(step, 'ls-rise')}><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="20" class="ls-card"/>${inner}</g>`;
  // A card row: emoji at the left, a title and a smaller second line.
  const infoRow = (x, y, w, step, emoji, title, line) => card(x, y, w, 76, step, `${lsEmoji(x + 42, y + 38, emoji, 36)}<text x="${x + 84}" y="${y + 33}" class="ls-cap">${title}</text><text x="${x + 84}" y="${y + 60}" class="ls-small" style="fill:#4d6358">${line}</text>`);
  const crescent = (x, y, r, color) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}"/><circle cx="${x + r * 0.35}" cy="${y - r * 0.1}" r="${r * 0.8}" fill="#fff"/>`;

  Object.assign(LESSON_SCENES, {
    'fen-sigara-alkol-intro': () => lsSvg(`
      <rect x="0" y="340" width="800" height="110" fill="#8fd18f"/>
      <rect x="672" y="200" width="18" height="150" fill="#8a5a2b"/><circle cx="680" cy="180" r="70" fill="#4caf6a"/><circle cx="630" cy="210" r="40" fill="#5cbf7a"/>
      ${bench(400, 330)}
      ${lsKid(330, 294, 1)}<rect x="340" y="276" width="34" height="24" rx="3" fill="#e25d3f" stroke="#a63a24" stroke-width="2"/>
      <g ${lsStep(1)}>${adult(486, 286, 1.15)}${cig(440, 290, 34, 160)}${smoke(404, 282, 340, 214)}
        <ellipse cx="220" cy="190" rx="78" ry="34" fill="#fff" stroke="#9aa5ad" stroke-width="3"/><path d="M270 214 l26 22 l-6 -28 Z" fill="#fff"/>
        <text x="220" y="198" text-anchor="middle" class="ls-cap">Öhö! Öhö!</text></g>
      ${lsLabel(400, 70, 'Ali ne yapmalı?', 2)}
      ${lsLabel(400, 412, 'Sigara ve alkol neler yapar?', 3)}`),

    'fen-sigara-alkol-inside': () => lsSvg(`
      <g transform="translate(92 160) rotate(-20)"><path d="M0 -50 C40 -30 40 30 0 50 C-40 30 -40 -30 0 -50 Z" fill="#7a9a3a" stroke="#556b2a" stroke-width="3"/><path d="M0 -46 V46 M0 -10 l18 -14 M0 10 l-18 -14 M0 24 l16 -10" stroke="#556b2a" stroke-width="3"/></g>
      <text x="92" y="240" text-anchor="middle" class="ls-small">Tütün yaprağı</text>
      ${'' /* arrow */}<path d="M150 165 H176" stroke="#3d4f63" stroke-width="5" stroke-linecap="round"/><polygon points="188,165 174,156 174,174" fill="#3d4f63"/>
      <g><rect x="200" y="148" width="70" height="34" fill="#e5a35a"/><rect x="270" y="148" width="200" height="34" fill="#fff" stroke="#c9c3ba" stroke-width="2"/><rect x="470" y="148" width="16" height="34" fill="#e25d3f"/><rect x="486" y="152" width="8" height="26" fill="#9aa5ad"/></g>
      <g ${lsStep(1)}>${smoke(496, 150, 560, 60, 12)}${smoke(500, 156, 620, 96, 9)}</g>
      ${lsPill(650, 160, 'Binlerce kimyasal madde', '#6b7680', 1)}
      ${lsPill(210, 270, 'Nikotin: bağımlılık', '#7d5ba6', 2)}
      <g ${lsStep(2, 'ls-pop')}>${lsEmoji(60, 268, '⛓️', 40)}</g>
      ${lsPill(580, 270, 'Katran: akciğere yapışır', '#5c4630', 4)}
      ${card(60, 320, 680, 80, 3, `<text x="400" y="352" text-anchor="middle" class="ls-cap">Bağımlılık:</text><text x="400" y="382" text-anchor="middle" class="ls-small">bırakmak istediği hâlde bırakmakta zorlanmak</text>`)}`),

    'fen-sigara-alkol-lungs': () => lsSvg(`
      ${lsPill(210, 66, 'En çok zarar: AKCİĞER', '#e25d3f', 0)}
      <g data-hide="2" class="ls-in on">${lungs(210, 270, 1.15)}</g>
      <g ${lsStep(2)}>${lungs(210, 270, 1.15, '#c7a3a3', '#8a6464')}${[[160, 250], [130, 300], [175, 330], [250, 240], [280, 300], [245, 335]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="#5c4630" opacity=".7"/>`).join('')}</g>
      ${card(420, 92, 350, 160, 1, ['Sık öksürür', 'Çabuk yorulur', 'Nefes almakta zorlanır'].map((t, i) => `<circle cx="450" cy="${128 + i * 42}" r="9" fill="#e25d3f"/><text x="470" y="${135 + i * 42}" class="ls-cap">${t}</text>`).join(''))}
      ${lsPill(595, 296, 'KOAH', '#7d5ba6', 2)}
      <g ${lsStep(2)}><text x="595" y="340" text-anchor="middle" class="ls-small">uzun süren bir akciğer hastalığı</text></g>
      ${lsPill(595, 404, 'Kanser riski artar', '#e25d3f', 3)}`),

    'fen-sigara-alkol-body': () => lsSvg(`
      ${lsLabel(400, 44, 'Sigara tüm vücuda zarar verir', 0)}
      <g><circle cx="190" cy="140" r="44" fill="#f2c7a5"/><path d="M150 128 Q152 92 190 94 Q228 92 230 128 Q210 108 150 128 Z" fill="#2b2b2b"/>
        <circle cx="175" cy="140" r="4" fill="#1b2a35"/><circle cx="205" cy="140" r="4" fill="#1b2a35"/><path d="M178 164 Q190 170 202 164" stroke="#1b2a35" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M120 200 Q120 186 140 186 H240 Q260 186 260 200 V400 H120 Z" fill="#7d8a96"/></g>
      <g ${lsStep(1, 'ls-pop')}>${lsEmoji(214, 240, '❤️', 44)}</g>
      <g ${lsStep(2, 'ls-pop')}><rect x="179" y="160" width="22" height="7" rx="2" fill="#e8c95a"/></g>
      <g ${lsStep(3, 'ls-pop')}><path d="M140 112 q-12 -8 -24 0 M140 100 q-12 -8 -24 0" stroke="#9aa5ad" stroke-width="3" fill="none"/></g>
      ${infoRow(330, 100, 440, 1, '❤️', 'Kalp ve damarlar', 'Kalp krizi riski artar')}
      ${infoRow(330, 196, 440, 2, '🦷', 'Dişler ve diş eti', 'Dişler sararır, diş eti hastalanır')}
      ${infoRow(330, 292, 440, 3, '👃', 'Koku ve tat alma', 'Bu duyular zayıflar')}`),

    'fen-sigara-alkol-passive': () => lsSvg(`
      <rect x="0" y="0" width="800" height="380" fill="#f6ead7"/><rect x="0" y="380" width="800" height="70" fill="#c9a77c"/>
      <rect x="60" y="50" width="160" height="110" rx="8" fill="#bfe6ff" stroke="#8a5a2b" stroke-width="6"/><path d="M140 50 V160 M60 105 H220" stroke="#8a5a2b" stroke-width="4"/>
      <rect x="690" y="190" width="80" height="190" rx="6" fill="#2eaa83" stroke="#1f7a5c" stroke-width="4"/><circle cx="704" cy="290" r="6" fill="#f2c94c"/>
      ${adult(150, 320, 1.15)}${cig(176, 318, 34, -20)}
      ${smoke(214, 300, 300, 230, 10)}
      <g ${lsStep(1)}>${[[340, 220, 90], [480, 200, 110], [600, 230, 80], [420, 270, 70]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.45}" fill="#9aa5ad" opacity=".35"/>`).join('')}
        ${lsKid(410, 330, 1)}${lsKid(550, 330, 1, '#e88aa0', '#7a4a1e')}</g>
      ${lsPill(480, 120, 'PASİF İÇİCİ', '#7d5ba6', 2)}
      <g ${lsStep(2)}><path d="M450 140 L420 238 M510 140 L545 238" stroke="#7d5ba6" stroke-width="4" stroke-dasharray="8 6"/></g>
      <g ${lsStep(3, 'ls-pop')}><path d="M590 300 H660" stroke="#2eaa83" stroke-width="8" stroke-linecap="round"/><polygon points="680,300 660,288 660,312" fill="#2eaa83"/></g>
      ${lsPill(560, 420, 'Dumandan uzak dur', '#2eaa83', 3)}`),

    'fen-sigara-alkol-alcohol': () => lsSvg(`
      ${lsLabel(400, 36, 'Alkol vücuda zarar verir', 0)}
      <g><circle cx="190" cy="120" r="48" fill="#f2c7a5"/><path d="M146 108 Q148 70 190 72 Q232 70 234 108 Q214 88 146 108 Z" fill="#5a3b22"/><circle cx="175" cy="132" r="4" fill="#1b2a35"/><circle cx="205" cy="132" r="4" fill="#1b2a35"/><path d="M178 150 Q190 156 202 150" stroke="#1b2a35" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M110 190 Q110 174 130 174 H250 Q270 174 270 190 V420 H110 Z" fill="#cfe3f2" stroke="#8fb3d1" stroke-width="3"/></g>
      <g ${lsStep(0)}>${lsBottle('#8e5a9b')(60, 400)}</g>
      <g ${lsStep(1, 'ls-pop')}><path d="M126 250 Q140 226 196 232 Q206 252 186 274 Q150 290 130 276 Z" fill="#a0402a" stroke="#6e2a1b" stroke-width="3"/></g>
      <g ${lsStep(2, 'ls-pop')}><path d="M214 240 Q252 236 254 270 Q254 300 224 302 Q206 300 210 284 Q232 282 230 266 Q226 254 214 254 Z" fill="#e88aa0" stroke="#b5596f" stroke-width="3"/></g>
      <g ${lsStep(3, 'ls-pop')}><path d="M160 96 Q160 78 190 78 Q220 78 220 96 Q220 112 190 112 Q160 112 160 96 Z" fill="#f4a6b7" stroke="#c4596a" stroke-width="3"/><path d="M190 80 V110" stroke="#c4596a" stroke-width="2"/></g>
      ${infoRow(320, 66, 450, 1, '🟤', 'Karaciğer', 'En çok zarar gören organ')}
      ${infoRow(320, 152, 450, 2, '🍽️', 'Mide', 'Yara ve sindirim hastalıkları')}
      ${infoRow(320, 238, 450, 3, '🧠', 'Beyin ve sinirler', 'Görme, konuşma, algılama yavaşlar')}
      ${infoRow(320, 324, 450, 4, '🚗', 'Trafik', 'Alkollü araç kullanmak tehlikelidir')}`),

    'fen-sigara-alkol-budget': () => lsSvg(`
      ${lsLabel(220, 56, 'Bağımlılık yapar', 0)}
      <g ${lsStep(0, 'ls-pop')}>${lsEmoji(80, 52, '⛓️', 36)}</g>
      ${lsPill(560, 56, 'En doğrusu: hiç başlamamak', '#2eaa83', 1)}
      <g ${lsStep(2)}>${[0, 1, 2, 3].map(i => `<ellipse cx="160" cy="${200 - i * 10}" rx="34" ry="11" fill="#f2c94c" stroke="#b8902a" stroke-width="2"/>`).join('')}
        <path d="M206 180 H300" stroke="#3d4f63" stroke-width="5" stroke-linecap="round"/><polygon points="314,180 298,170 298,190" fill="#3d4f63"/>
        ${cig(336, 168, 50, 0)}${lsBottle('#8e5a9b')(426, 182)}</g>
      ${lsPill(620, 180, 'Aile bütçesine zarar', '#e25d3f', 2)}
      ${lsLabel(400, 262, 'Bu para şunlara harcanabilirdi:', 3)}
      ${lsFoodRow([['🍎', 'Besin'], ['📚', 'Kitap'], ['🎡', 'Gezi']], 360, 3)}`),

    'fen-sigara-alkol-dikkat': () => {
      const row = (y, step, inner) => card(40, y, 720, 68, step, inner);
      return lsSvg(`
      ${lsLabel(400, 40, '⚠️ Dikkat! Karıştırma', 0)}
      ${row(72, 1, `${lsEmoji(86, 106, '🚬', 34)}<text x="120" y="114" class="ls-cap">Sigara: en çok akciğer</text>${lsEmoji(436, 106, '🍷', 34)}<text x="470" y="114" class="ls-cap">Alkol: en çok karaciğer</text>`)}
      ${row(152, 2, `${lsEmoji(86, 186, '🚭', 34)}<text x="120" y="194" class="ls-cap">Az içilen sigara da zararlıdır</text>`)}
      ${row(232, 3, `${lsEmoji(86, 266, '💨', 34)}<text x="120" y="274" class="ls-cap">Yanındakilere de zarar verir</text>`)}
      ${row(312, 4, `${lsEmoji(86, 346, '⏳', 34)}<text x="120" y="354" class="ls-cap">Zarar yıllar sonra fark edilebilir</text>`)}
      ${lsPill(400, 418, 'Zararsız sigara yoktur!', '#e25d3f', 2)}`);
    },

    'fen-sigara-alkol-rules': () => {
      const box = (x, y, step, icon, title, l1, l2) => card(x, y, 360, 140, step, `${icon(x + 64, y + 70)}<text x="${x + 128}" y="${y + 46}" class="ls-cap">${title}</text><text x="${x + 128}" y="${y + 82}" class="ls-small" style="fill:#4d6358">${l1}</text><text x="${x + 128}" y="${y + 108}" class="ls-small" style="fill:#4d6358">${l2}</text>`);
      const age = (x, y) => `<circle cx="${x}" cy="${y}" r="38" fill="#fff" stroke="#e25d3f" stroke-width="7"/><text x="${x}" y="${y + 12}" text-anchor="middle" font-size="32" font-weight="900" fill="#22392f" font-family="Segoe UI,Arial,sans-serif">18</text><line x1="${x - 26}" y1="${y + 26}" x2="${x + 26}" y2="${y - 26}" stroke="#e25d3f" stroke-width="6"/>`;
      const pack = (x, y) => `<rect x="${x - 28}" y="${y - 40}" width="56" height="80" rx="5" fill="#e8e2d8" stroke="#8e8070" stroke-width="3"/><rect x="${x - 28}" y="${y - 2}" width="56" height="34" fill="#22392f"/><text x="${x}" y="${y + 20}" text-anchor="middle" font-size="13" font-weight="800" fill="#fff" font-family="Segoe UI,Arial,sans-serif">ZARARLI</text>`;
      return lsSvg(`
      ${lsLabel(400, 38, 'Ülkemizde alınan önlemler', 0)}
      ${box(30, 66, 1, (x, y) => lsEmoji(x, y, '🚭', 60), 'Dumansız hava sahası', 'Kapalı alanlarda ve', 'toplu taşımada yasak')}
      ${box(410, 66, 2, age, 'Satış yasağı', 'On sekiz yaşından', 'küçüklere satılmaz')}
      ${box(30, 220, 3, pack, 'Uyarılar', 'Paketlerde uyarı', 'Kamu spotları')}
      ${box(410, 220, 4, (x, y) => crescent(x - 6, y, 36, '#2eaa83'), 'Yeşilay', 'Bağımlılıkla', 'mücadele eder')}
      ${lsPill(400, 412, 'Yeşilay ile Kızılay farklıdır', '#e25d3f', 5)}`);
    },

    'fen-sigara-alkol-me': () => {
      const item = (y, step, emoji, text) => card(24, y, 470, 62, step, `${lsEmoji(62, y + 31, emoji, 32)}<text x="98" y="${y + 38}" class="ls-cap">${text}</text>`);
      return lsSvg(`
      ${lsLabel(260, 40, 'Ben ne yapabilirim?', 0)}
      <rect x="510" y="330" width="290" height="120" fill="#8fd18f"/>
      ${bench(720, 320)}${adult(726, 290, 0.95)}${cig(700, 296, 28, 160)}${smoke(672, 290, 640, 200, 7)}
      ${item(76, 1, '🚶', 'Dumandan uzaklaşırım')}
      ${item(150, 2, '💬', 'Kibarca uyarır, destek olurum')}
      ${item(224, 3, '🖍️', 'Afiş hazırlarım')}
      ${item(298, 4, '☎️', 'ALO 171: danışma hattı')}
      <g ${lsStep(5)}>${bench(570, 380)}${lsKid(560, 342, 0.9)}<circle cx="560" cy="110" r="32" fill="#ffcf4d" class="ls-sun"/></g>
      ${lsPill(250, 410, 'Ali temiz havayı seçti!', '#2eaa83', 5)}`);
    },

    'fen-sigara-alkol-summary': () => lsSummary([
      ['🚭', 'Nikotin bağımlılık|yapar, akciğere zarar'],
      ['💨', 'Duman herkese zarar|verir: pasif içici'],
      ['🍷', 'Alkol: karaciğer|ve trafik kazası'],
      ['💚', 'Uzak dur,|kibarca uyar'],
    ], 'Hazırsan mini teste geçelim!'),
  });
}
