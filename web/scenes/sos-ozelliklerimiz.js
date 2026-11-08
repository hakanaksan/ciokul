/* Scenes for the video lesson "İlgi, Yetenek ve Farklılıklarımız". Loaded when the lesson opens (see loadLessonScenes in lessons.js). */
{
  // The three concepts on top; the active one is coloured.
  const heads = active => [['İLGİ', 200, '#e8832f'], ['İHTİYAÇ', 400, '#2eaa83'], ['YETENEK', 600, '#2f6f9f']]
    .map(([t, x, c]) => lsPill(x, 42, t, t === active ? c : '#aab5bf', 0)).join('');
  // A wide definition card under the heads.
  const def = (text, color, n) => `<g ${lsStep(n, 'ls-rise')}><rect x="40" y="70" width="720" height="54" rx="18" fill="#fff" stroke="${color}" stroke-width="3"/>
    <text x="400" y="104" text-anchor="middle" class="ls-cap">${text}</text></g>`;
  // A card with an emoji on the left, a title and a small second line.
  const card = (x, y, w, emoji, title, sub, n, cls = '') => `<g ${lsStep(n, 'ls-rise ' + cls)}><rect x="${x}" y="${y}" width="${w}" height="90" rx="18" class="ls-card"/>
    ${lsEmoji(x + 42, y + 45, emoji, 36)}<text x="${x + 80}" y="${y + 38}" class="ls-cap">${title}</text><text x="${x + 80}" y="${y + 66}" class="ls-small">${sub}</text></g>`;

  Object.assign(LESSON_SCENES, {
    'sos-ozelliklerimiz-intro': () => {
      const kids = [[130, 1.0, '#e25d3f', '#5a3b22', '🎨', 0], [300, 1.3, '#4c8be6', '#1b1b1b', '⚽', 0], [470, 0.9, '#2eaa83', '#e8b84a', '💬', 1], [640, 1.15, '#8e44ad', '#8a5a2b', '📖', 1]];
      return lsSvg(`<rect x="0" y="380" width="800" height="70" fill="#9bd27d"/>
        ${kids.map(([x, s, shirt, hair, e, n], i) => `${lsKid(x, 380 - 46 * s, s, shirt, hair)}<g ${lsStep(n, 'ls-pop ls-d' + (i % 2))}>${lsEmoji(x, 380 - 128 * s - 30, e, 40)}</g>`).join('')}
        ${lsLabel(400, 52, '📏 Farklı boylar, farklı saçlar', 2)}
        ${lsPill(400, 418, '🌟 Herkes benzersizdir', '#08796e', 3)}`);
    },

    'sos-ozelliklerimiz-traits': () => {
      const col = (x, items, n) => items.map(([e, t], i) => `<g ${lsStep(n, 'ls-rise ls-d' + i)}>${lsEmoji(x + 22, 124 + i * 44, e, 26)}<text x="${x + 52}" y="${131 + i * 44}" class="ls-cap">${t}</text></g>`).join('');
      return lsSvg(`<rect x="40" y="70" width="350" height="270" rx="22" class="ls-card"/><rect x="410" y="70" width="350" height="270" rx="22" class="ls-card"/>
        ${lsPill(215, 72, 'Fiziksel özellikler', '#2f6f9f', 0)}${lsPill(585, 72, 'Kişisel özellikler', '#e8832f', 0)}
        ${col(80, [['📏', 'Boy'], ['⚖️', 'Kilo'], ['💇', 'Saç rengi'], ['👁️', 'Göz rengi'], ['✋', 'Ten rengi']], 1)}
        ${col(450, [['🤝', 'Dürüstlük'], ['🎁', 'Cömertlik'], ['🔍', 'Meraklılık'], ['😄', 'Neşeli olmak'], ['🙈', 'Utangaç olmak']], 2)}
        ${lsLabel(215, 376, 'Dış görünüşümüz', 1, 'ls-d5')}${lsLabel(585, 376, 'Davranışımız, karakterimiz', 3)}
        ${lsLabel(400, 422, '👪 Herkesin özellikleri farklı', 4)}`);
    },

    'sos-ozelliklerimiz-ilgi': () => lsSvg(`${heads('İLGİ')}
      ${def('İLGİ: bir şeyden hoşlanmak, ona yakınlık duymak', '#e8832f', 1)}
      ${[[170, '🌻', 'Çiçek yetiştirmek'], [400, '🚀', 'Uzayı araştırmak'], [630, '📺', 'Belgesel izlemek']].map(([x, e, t], i) => `<g ${lsStep(2, 'ls-rise ls-d' + i)}><rect x="${x - 105}" y="145" width="210" height="140" rx="20" class="ls-card"/>
        ${lsEmoji(x, 195, e, 50)}<text x="${x}" y="260" text-anchor="middle" class="ls-cap">${t}</text></g>`).join('')}
      ${lsLabel(400, 330, '🧸 ➜ 🎸 Yaş büyüdükçe ilgiler değişebilir', 3)}
      ${lsPill(400, 404, '🏅 Geliştiririz, uzmanlaşırız', '#e8832f', 4)}`),

    'sos-ozelliklerimiz-ihtiyac': () => lsSvg(`${heads('İHTİYAÇ')}
      ${def('İHTİYAÇ: yaşamak için gerekli olan şeyler', '#2eaa83', 0)}
      ${lsFoodRow([['💧', 'Su'], ['🍲', 'Beslenme'], ['😴', 'Uyku'], ['👕', 'Giyinme'], ['🏠', 'Barınma']], 208, 1)}
      ${lsPill(230, 310, '❤️ Sevgi', '#2eaa83', 2)}${lsPill(400, 310, '🛡️ Güven', '#2eaa83', 2, 'ls-d1')}${lsPill(570, 310, '🏫 Eğitim', '#2eaa83', 2, 'ls-d2')}
      ${lsLabel(400, 362, '🏃 Koştum, susadım ➜ 💧 su içtim: ihtiyaç', 3)}
      ${lsPill(400, 416, '🎨 Resim, 🎵 müzik, 🚲 bisiklet: ilgi', '#e8832f', 4)}`),

    'sos-ozelliklerimiz-yetenek': () => lsSvg(`${heads('YETENEK')}
      ${def('YETENEK: bir işi anlama ya da yapabilme becerisi', '#2f6f9f', 0)}
      ${lsLabel(400, 160, '🎁 Doğuştan gelir ➜ 💪 Çalışarak gelişir', 1)}
      ${card(40, 190, 350, '🎤', 'Kerem', 'koroda şarkı söylüyor', 2)}${card(410, 190, 350, '🖼️', 'Serkan', 'resmiyle ödül kazandı', 2, 'ls-d1')}
      ${card(40, 292, 350, '🏺', 'Seramik', 'oyun hamuruna şekil verir', 3)}${card(410, 292, 350, '🎹', 'Müzik', 'ilk duyduğu besteyi çalar', 3, 'ls-d1')}
      ${lsLabel(400, 420, '🔑 Keşfedilmemiş yeteneklerin olabilir', 4)}`),

    'sos-ozelliklerimiz-dikkat': () => {
      const cols = [[145, 'İLGİ', '#e8832f', ['seviyorum', 'hoşlanıyorum', 'merak ediyorum'], 'hoşlandığımız şey'],
        [400, 'YETENEK', '#2f6f9f', ['yapabiliyorum', 'başardım', 'ödül kazandım'], 'yapabildiğimiz iş'],
        [655, 'İHTİYAÇ', '#2eaa83', ['su', 'besin', 'uyku'], 'yaşamak için gerekli']];
      return lsSvg(`${lsLabel(400, 40, '⚠️ Dikkat! İpuçları', 0)}
        ${cols.map(([x, t, c, words, sub], i) => `<g ${lsStep(i + 1, 'ls-rise')}><rect x="${x - 115}" y="72" width="230" height="270" rx="22" class="ls-card"/>${lsPill(x, 106, t, c, i + 1)}
          ${words.map((w, j) => `<text x="${x}" y="${162 + j * 44}" text-anchor="middle" class="ls-cap">“${w}”</text>`).join('')}
          <line x1="${x - 80}" y1="282" x2="${x + 80}" y2="282" stroke="${c}" stroke-width="3" stroke-linecap="round"/><text x="${x}" y="314" text-anchor="middle" class="ls-small">${sub}</text></g>`).join('')}
        ${lsPill(400, 395, '❤️ Sevmek ≠ 💪 iyi yapabilmek', '#d9472b', 4)}`);
    },

    'sos-ozelliklerimiz-gelisim': () => {
      const cards = [[155, '🤝', 36, 'Okul kulüpleri', ['Sosyal Yardımlaşma', 've Dayanışma Kulübü', 'İzcilik Kulübü']], [400, '🎨 🎵 🏊 ♟️', 28, 'Kurslar', ['resim, müzik,', 'yüzme, satranç']], [645, '👪 🏫', 36, 'Destek', ['ailemiz ve', 'öğretmenlerimiz']]];
      return lsSvg(`${lsLabel(400, 45, 'İlgi ve yetenek ➜ 🌱 gelişim', 0)}
        ${cards.map(([x, e, size, title, lines], i) => `<g ${lsStep(i + 1, 'ls-rise')}><rect x="${x - 115}" y="80" width="230" height="250" rx="22" class="ls-card"/>${lsEmoji(x, 130, e, size)}
          <text x="${x}" y="192" text-anchor="middle" class="ls-cap">${title}</text>${lines.map((l, j) => `<text x="${x}" y="${228 + j * 26}" text-anchor="middle" class="ls-small">${l}</text>`).join('')}</g>`).join('')}
        ${lsPill(400, 385, '😊 Daha mutlu ve başarılı oluruz', '#2eaa83', 4)}`);
    },

    'sos-ozelliklerimiz-empati': () => lsSvg(`<rect x="0" y="340" width="800" height="110" fill="#9bd27d"/>
      <rect x="30" y="182" width="140" height="158" fill="#fff3d6" stroke="#c9a24a" stroke-width="3"/><rect x="22" y="170" width="156" height="14" rx="3" fill="#b5652f"/>
      <rect x="82" y="282" width="36" height="58" rx="4" fill="#8a5a2b"/><rect x="48" y="210" width="34" height="30" fill="#bfe6ff" stroke="#c9a24a" stroke-width="3"/><rect x="118" y="210" width="34" height="30" fill="#bfe6ff" stroke="#c9a24a" stroke-width="3"/>
      <g><path d="M190 340 Q190 290 215 288 Q240 290 240 340 Z" fill="#5b7fa6"/><rect x="215" y="322" width="56" height="16" rx="7" fill="#3d4f63"/>
        <circle cx="215" cy="266" r="18" fill="#f2c7a5"/><path d="M203 274 Q215 300 227 274 Z" fill="#d9d9d9"/><ellipse cx="215" cy="248" rx="25" ry="15" fill="#fff" stroke="#c9c9c9" stroke-width="2"/>
        <circle cx="209" cy="264" r="2" fill="#1b2a35"/><circle cx="221" cy="264" r="2" fill="#1b2a35"/><line x1="236" y1="300" x2="250" y2="318" stroke="#5b7fa6" stroke-width="9" stroke-linecap="round"/></g>
      ${lsEmoji(250, 222, '💫', 26)}
      ${lsKid(295, 296, 0.95, '#2eaa83', '#3b2a1e')}${lsKid(365, 296, 0.95, '#e8832f', '#8a5a2b')}
      ${lsLabel(290, 160, '🩺 Doktor!', 0)}${lsLabel(370, 205, '🧴 Merhem!', 0, 'ls-d1')}
      <g ${lsStep(1, 'ls-pop')}><path d="M150 108 L190 108 L205 225 Z" fill="#fff" stroke="#08796e" stroke-width="2"/><rect x="40" y="28" width="360" height="84" rx="20" fill="#fff" stroke="#08796e" stroke-width="2"/>
        <rect x="150" y="104" width="40" height="10" fill="#fff"/>
        <text x="220" y="62" text-anchor="middle" class="ls-cap">Bana daha önce damdan</text><text x="220" y="90" text-anchor="middle" class="ls-cap">düşmüş birini bulun!</text></g>
      ${lsLabel(595, 150, '💡 Yaşayan en iyi anlar', 2)}
      ${lsPill(595, 220, 'EMPATİ', '#08796e', 3)}
      <g ${lsStep(3, 'ls-rise ls-d1')}><text x="595" y="262" text-anchor="middle" class="ls-cap">Kendini başkasının</text><text x="595" y="288" text-anchor="middle" class="ls-cap">yerine koymak</text></g>
      ${lsLabel(595, 345, '🚚 Taşınan arkadaşı anlamak', 4)}${lsLabel(595, 398, '🤗 Üzgün arkadaşa moral', 4, 'ls-d1')}`),

    'sos-ozelliklerimiz-saygi': () => {
      const kids = [[80, '#e25d3f', '#5a3b22'], [145, '#4c8be6', '#e8b84a'], [210, '#2eaa83', '#1b1b1b'], [275, '#8e44ad', '#8a5a2b'], [340, '#f2994a', '#3b2a1e']];
      return lsSvg(`<g ${lsStep(0, 'ls-pop')}>${lsEmoji(110, 95, '🖐️', 80)}</g>${lsLabel(470, 75, '“Beş parmağın beşi bir olmaz.”', 0)}
        ${lsPill(470, 130, '🌈 Farklılıklar zenginliktir', '#e8832f', 1)}
        <g ${lsStep(2, 'ls-rise')}><rect x="40" y="170" width="720" height="70" rx="20" fill="#fff" stroke="#08796e" stroke-width="3"/>
          <text x="400" y="213" text-anchor="middle" class="ls-cap">HOŞGÖRÜ: farklılıklara anlayışla yaklaşmak</text></g>
        ${lsLabel(215, 290, '⚽ Farklı takıma saygı', 3)}${lsLabel(585, 290, '👂 Sözünü kesmeden dinlemek', 3, 'ls-d1')}
        <g ${lsStep(4, 'ls-rise')}>${kids.map(([x, shirt, hair]) => lsKid(x, 398, 0.7, shirt, hair)).join('')}</g>
        ${lsLabel(575, 385, '🤝 Kimseyi dışlamayız', 4, 'ls-d1')}`);
    },

    'sos-ozelliklerimiz-engel': () => lsSvg(`${lsLabel(150, 55, '♿ Engelli bireyler', 0)}${lsLabel(400, 55, '🩺 Hastalıklar', 0, 'ls-d1')}${lsLabel(640, 55, '🤲 Maddi zorluk', 0, 'ls-d2')}
      ${lsLabel(400, 110, '💭 Kendimizi onların yerine koyalım', 1)}
      <g ${lsStep(2, 'ls-rise')}><rect x="40" y="145" width="350" height="190" rx="22" class="ls-card"/>${lsEmoji(215, 190, '🏊', 44)}
        <text x="215" y="248" text-anchor="middle" class="ls-cap">Sümeyye Boyacı</text><text x="215" y="278" text-anchor="middle" class="ls-small">kolları olmadan doğdu</text>
        <text x="215" y="304" text-anchor="middle" class="ls-small">yüzmede Avrupa şampiyonu</text></g>
      <g ${lsStep(3, 'ls-rise')}><rect x="410" y="145" width="350" height="190" rx="22" class="ls-card"/>${lsEmoji(585, 190, '⚽', 44)}
        <text x="585" y="248" text-anchor="middle" class="ls-cap">Ampute Futbol</text><text x="585" y="278" text-anchor="middle" class="ls-small">Millî Takımımız</text>
        <text x="585" y="304" text-anchor="middle" class="ls-small">2017 Avrupa şampiyonu</text></g>
      <g ${lsStep(4, 'ls-pop')}>${lsEmoji(110, 385, '🏆', 44)}${lsEmoji(690, 385, '🏆', 44)}</g>
      ${lsPill(400, 390, '💪 Azimle herkes başarabilir', '#08796e', 4)}`),

    'sos-ozelliklerimiz-summary': () => lsSummary([['🌟', 'Herkes|benzersizdir'], ['🎯', 'İlgi, ihtiyaç|ve yetenek'], ['💭', 'Empati: kendini|başkasının yerine|koymak'], ['🤝', 'Farklılıklara|hoşgörü ve saygı']], 'Hazırsan mini teste geçelim!'),
  });
}
