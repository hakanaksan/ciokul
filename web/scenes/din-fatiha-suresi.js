/* Scenes for the video lesson "Bir Sure Tanıyorum: Fatiha Suresi". Loaded when the lesson opens (see loadLessonScenes in lessons.js). */
{
  const P = 'din-fatiha-suresi';
  const font = (size, weight = 800) => `style="font:${weight} ${size}px Segoe UI,Arial,sans-serif"`;
  const lines = (x, ys, texts, cls = 'ls-small', anchor = 'middle') => texts.map((t, i) => `<text x="${x}" y="${ys[i]}" text-anchor="${anchor}" class="${cls}">${t}</text>`).join('');
  const arrow = (x1, x2, y, color = '#3d4f63') => `<path d="M${x1} ${y} H${x2 - 10}" stroke="${color}" stroke-width="5" stroke-linecap="round"/><path d="M${x2 - 14} ${y - 9} L${x2} ${y} L${x2 - 14} ${y + 9} Z" fill="${color}"/>`;
  // The okunuş (reading) of the seven ayets, as in the booklet.
  const OKUNUS = ['Bismillâhirrahmânirrahîm', 'Elhamdü lillâhi rabbi’l-âlemîn', 'Errahmânirrahîm', 'Mâliki yevmiddîn', 'İyyâke na’büdü ve iyyâke nestaîn', 'İhdinas-sırâtal müstakîm', 'Sırâtallezîne en’amte aleyhim ğayril mağdûbi aleyhim veleddâllîn'];
  // One ayet card: number, okunuş (gold) and meaning lines; y is the top of the card.
  const ayetCard = (y, n, meaning, step, h = 85) => `<g ${lsStep(step, 'ls-rise')}><rect x="40" y="${y}" width="720" height="${h}" rx="18" class="ls-card"/>
    <circle cx="80" cy="${y + h / 2}" r="22" fill="#08796e"/><text x="80" y="${y + h / 2 + 8}" text-anchor="middle" fill="#fff" ${font(22, 900)}>${n}</text>
    <text x="118" y="${y + 32}" fill="#8a6a2a" ${font(18, 700)}>${OKUNUS[n - 1]}</text>
    ${meaning.map((t, i) => `<text x="118" y="${y + 64 + i * 27}" class="ls-cap">${t}</text>`).join('')}</g>`;
  // A wrong statement (crossed out) and the right one in a small card; (x, y) is the card's top left.
  const fixBox = (x, y, wrong, right, step, cls = '') => `<g ${lsStep(step, 'ls-rise ' + cls)}><rect x="${x}" y="${y}" width="355" height="66" rx="16" class="ls-card"/>
    <rect x="${x + 14}" y="${y + 14}" width="132" height="38" rx="19" fill="#fde3dc"/><text x="${x + 80}" y="${y + 40}" text-anchor="middle" class="ls-cap" style="fill:#b2402a">${wrong}</text>${lsCross(x + 80, y + 33, 110)}
    ${arrow(x + 156, x + 200, y + 33)}<text x="${x + 212}" y="${y + 40}" class="ls-label">${right}</text></g>`;

  Object.assign(LESSON_SCENES, {
    [`${P}-intro`]: () => lsSvg(`<rect x="0" y="380" width="800" height="70" fill="#d9e4ea"/>
      <g transform="translate(270 220)"><rect x="-200" y="-125" width="400" height="250" rx="14" fill="#1f6f54"/>
        <path d="M0 -112 Q-90 -126 -186 -110 V110 Q-90 96 0 112 Z" fill="#fffaf0"/><path d="M0 -112 Q90 -126 186 -110 V110 Q90 96 0 112 Z" fill="#fffaf0"/>
        ${[-70, -45, -20, 5, 30, 55, 80].map(y => `<path d="M-30 ${y} q-10 -9 -20 0 t-20 0 t-20 0 t-20 0 t-20 0 t-20 0 t-20 0" stroke="#9fb6c6" stroke-width="2.5" fill="none"/>`).join('')}
        <rect x="25" y="-92" width="140" height="184" rx="10" fill="none" stroke="#c49a2c" stroke-width="5"/><rect x="35" y="-82" width="120" height="164" rx="8" fill="none" stroke="#e0c27a" stroke-width="2"/>
        ${[-45, -20, 5, 30, 55].map(y => `<path d="M140 ${y} q-10 -9 -20 0 t-20 0 t-20 0 t-20 0 t-20 0" stroke="#3d4f63" stroke-width="2.5" fill="none"/>`).join('')}</g>
      ${lsLabel(270, 55, '📖 Kur’an-ı Kerim', 0)}
      <g ${lsStep(1, 'ls-pop')}><rect x="288" y="121" width="154" height="198" rx="14" fill="none" stroke="#e8832f" stroke-width="5"/></g>
      ${lsPill(365, 365, 'Fatiha suresi', '#e8832f', 1, 'ls-d1')}
      <g ${lsStep(2, 'ls-rise')}><rect x="540" y="90" width="220" height="230" rx="22" class="ls-card"/>${lsEmoji(650, 170, '🕌', 80)}
        ${lines(650, [255, 283], ['Namazların', 'her rekâtında'], 'ls-cap')}</g>
      ${lsPill(200, 425, 'Okunuşu', '#08796e', 3)}${lsPill(400, 425, 'Anlamı', '#5b7fa6', 3, 'ls-d1')}${lsPill(600, 425, 'Öğütleri', '#1f9a73', 3, 'ls-d2')}`),

    [`${P}-tanitim`]: () => {
      const cards = [['📖', ['1. sure', '1. cüzde']], ['🕋', ['Mekke’de', 'indirildi']], ['7', ['ayet']], ['🤲', ['Övgü, şükür', 've dua']]];
      return lsSvg(`<g><rect x="250" y="30" width="300" height="100" rx="20" fill="#1f6f54"/><rect x="260" y="40" width="280" height="80" rx="14" fill="none" stroke="#e0c27a" stroke-width="3"/>
          <text x="400" y="96" text-anchor="middle" fill="#fff" style="font:700 46px 'Segoe UI','Traditional Arabic',Arial,sans-serif">الفاتحة</text></g>
        ${lsLabel(400, 175, 'Fatiha = açan, başlangıç', 0)}
        ${cards.map(([icon, text], i) => { const cx = 115 + i * 190;
          const top = icon === '7' ? `<text x="${cx}" y="${300}" text-anchor="middle" fill="#e8832f" ${font(64, 900)}>7</text>` : lsEmoji(cx, 280, icon, 50);
          return `<g ${lsStep(i + 1, 'ls-rise')}><rect x="${cx - 85}" y="215" width="170" height="195" rx="22" class="ls-card"/>${top}${lines(cx, text.map((_, j) => 350 + j * 28), text, 'ls-cap')}</g>`; }).join('')}`);
    },

    [`${P}-okunus`]: () => lsSvg(`${lsLabel(400, 38, 'Fatiha suresinin okunuşu', 0)}
      <rect x="30" y="60" width="740" height="320" rx="20" fill="#fffaf0" stroke="#e0c27a" stroke-width="3"/>
      <rect ${lsStep(1)} data-hide="2" x="40" y="68" width="720" height="38" rx="10" fill="#e8832f33"/>
      <rect ${lsStep(2)} data-hide="3" x="40" y="112" width="720" height="38" rx="10" fill="#e8832f33"/>
      ${OKUNUS.map((t, i) => `<g ${lsStep(0, 'ls-rise ls-d' + Math.min(5, i))}><circle cx="62" cy="${87 + i * 44}" r="15" fill="#08796e"/><text x="62" y="${93 + i * 44}" text-anchor="middle" fill="#fff" ${font(16, 900)}>${i + 1}</text>
        <text x="90" y="${94 + i * 44}" fill="#22392f" ${font(19, 700)}>${t}</text></g>`).join('')}
      <g ${lsStep(3)}>${OKUNUS.map((_, i) => `<circle cx="62" cy="${87 + i * 44}" r="19" fill="none" stroke="#e8b10f" stroke-width="3"/>`).join('')}</g>
      ${lsLabel(400, 420, '🤝 Bir büyüğünle birlikte oku', 4)}`),

    [`${P}-anlam1`]: () => lsSvg(`${ayetCard(25, 1, ['Rahman ve Rahim olan Allah’ın adıyla.'], 0)}
      ${lsLabel(400, 148, '💗 Çok merhametli, çok esirgeyici', 1)}
      ${ayetCard(170, 2, ['Hamd (övme ve övülme), âlemlerin Rabb’i olan Allah’adır.'], 2)}
      ${lsLabel(400, 293, 'Âlemler = bütün varlıklar  🌍 🌳 🐦 🐟 ⭐', 3)}
      ${ayetCard(320, 3, ['O, Rahman ve Rahim’dir.'], 4)}`),

    [`${P}-anlam2`]: () => lsSvg(`${ayetCard(25, 4, ['Hesap gününün sahibidir.'], 0)}
      ${lsLabel(400, 148, '⚖️ Herkes yaptıklarının karşılığını alır', 1)}
      ${ayetCard(170, 5, ['Rabb’imiz! Yalnızca sana kulluk eder', 've yalnızca senden yardım dileriz.'], 2, 112)}
      <g ${lsStep(3, 'ls-rise')}><rect x="150" y="310" width="500" height="120" rx="22" fill="#eef8f2" stroke="#2eaa83" stroke-width="3"/>
        ${lsEmoji(230, 370, '🕌', 54)}${lines(440, [358, 390], ['İbadet yalnızca', 'Allah için yapılır'], 'ls-label')}</g>`),

    [`${P}-anlam3`]: () => lsSvg(`${ayetCard(20, 6, ['Bizleri doğru yola ilet.'], 0)}
      ${ayetCard(118, 7, ['Kendilerine nimet verdiklerinin yoluna;', 'gazaba uğramışların ve sapmışların yoluna değil.'], 1, 112)}
      <g ${lsStep(2)}><path d="M330 450 L385 250 H415 L470 450 Z" fill="#e8dcc0"/><path d="M400 440 V420 M400 400 V380 M400 360 V340 M400 320 V302 M400 286 V272 M400 262 V254" stroke="#fff" stroke-width="4"/>
        ${lsEmoji(400, 248, '☀️', 30)}${lsKid(290, 400, 0.8, '#4c8be6')}</g>
      ${lsLabel(170, 280, '🤲 Doğru yol için dua', 2, 'ls-d1')}
      ${lsLabel(150, 345, '👫 İyileri örnek al', 4)}
      ${lsPill(620, 290, 'İyilik', '#1f9a73', 3)}${lsPill(620, 345, 'Dürüstlük', '#5b7fa6', 3, 'ls-d1')}${lsPill(620, 400, 'Güzel ahlak', '#e8832f', 3, 'ls-d2')}`),

    [`${P}-mesajlar`]: () => {
      const cards = [['🙏', ['Allah’a hamd et,', 'nimetler için', 'şükret']], ['🕌', ['Yalnızca Allah’a', 'ibadet et, yardımı', 'O’ndan iste']], ['⚖️', ['Sorumlu', 'olduğunu bilerek', 'davran']], ['🧭', ['Doğru yol için', 'dua et, iyileri', 'örnek al']]];
      return lsSvg(`${lsLabel(400, 42, '💡 Fatiha suresinin öğütleri', 0)}
        ${cards.map(([icon, text], i) => { const x = 40 + (i % 2) * 370, y = 70 + Math.floor(i / 2) * 182;
          return `<g ${lsStep(i + 1, 'ls-rise')}><rect x="${x}" y="${y}" width="350" height="165" rx="22" class="ls-card"/>${lsEmoji(x + 60, y + 82, icon, 54)}${lines(x + 115, text.map((_, j) => y + 55 + j * 30), text, 'ls-cap', 'start')}</g>`; }).join('')}`);
    },

    [`${P}-nerede`]: () => {
      const cards = [['🕌', ['Namazların', 'her rekâtında']], ['🤲', ['Dualarımızın', 'sonunda']], ['🌿', ['Vefat eden', 'yakınlarımızı', 'anarken']]];
      return lsSvg(`${lsLabel(400, 50, '📍 Fatiha nerelerde okunur?', 0)}
        <g ${lsStep(0, 'ls-d1')}>${lsEmoji(400, 120, '❓', 44)}</g>
        ${cards.map(([icon, text], i) => { const cx = 160 + i * 240;
          return `<g ${lsStep(i + 1, 'ls-rise')}><rect x="${cx - 110}" y="160" width="220" height="235" rx="22" class="ls-card"/>${lsEmoji(cx, 230, icon, 64)}${lines(cx, text.map((_, j) => 310 + j * 30), text, 'ls-cap')}</g>`; }).join('')}
        ${lsLabel(400, 432, '💭 Anlamını düşünerek oku', 4)}`);
    },

    [`${P}-dikkat`]: () => {
      const words = [['âlemîn', '= âlemler', 'rabbi’l-âlemîn'], ['yevmiddîn', '= hesap günü', 'mâliki yevmiddîn'], ['müstakîm', '= doğru', 'sırâtal müstakîm']];
      return lsSvg(`${lsLabel(400, 40, '⚠️ Doğrusu ne?', 0)}
        ${fixBox(40, 65, '10 ayet', '7 ayet', 1)}${fixBox(405, 65, 'İlk rekât', 'Her rekât', 1, 'ls-d1')}
        ${fixBox(40, 145, 'Son cüz', '1. cüz', 2)}${fixBox(405, 145, 'Kapatmak', 'Açmak', 2, 'ls-d1')}
        ${words.map(([w, mean, ctx], i) => { const cx = 160 + i * 240;
          return `${lsPill(cx, 260, w, '#8e6bbf', 3, 'ls-d' + i)}<g ${lsStep(4, 'ls-rise ls-d' + i)}><rect x="${cx - 110}" y="290" width="220" height="120" rx="20" class="ls-card"/>
            <text x="${cx}" y="338" text-anchor="middle" class="ls-label">${mean}</text><text x="${cx}" y="380" text-anchor="middle" class="ls-small" style="fill:#8a6a2a">${ctx}</text></g>`; }).join('')}`);
    },

    [`${P}-summary`]: () => lsSummary([['📖', 'Fatiha: açan,|ilk sure, 1. cüz'], ['🕋', 'Mekke’de indi,|7 ayet'], ['🤲', 'Hamd, ibadet,|doğru yol duası'], ['🕌', 'Namazda her rekâtta|ve dualarda okunur']], 'Hazırsan mini teste geçelim!'),
  });
}
