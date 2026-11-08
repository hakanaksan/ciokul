/* Scenes for the video lesson "Dualar, Dinî Kavramlar ve Sübhaneke". Loaded when the lesson opens (see loadLessonScenes in lessons.js). */
{
  const P = 'din-dualar-ve-kavramlar';
  // A speech bubble centred on x; the tail points down, shifted by dx from the centre.
  const bubble = (x, y, text, step, dx = -20, cls = 'ls-pop') => {
    const w = lsLabelWidth(text) + 8, t = x + dx;
    return `<g ${lsStep(step, cls)}><path d="M${t - 14} ${y + 14} L${t - 6} ${y + 34} L${t + 14} ${y + 14} Z" fill="#fff" stroke="#08796e" stroke-width="2"/><rect x="${x - w / 2}" y="${y - 30}" width="${w}" height="46" rx="18" fill="#fff" stroke="#08796e" stroke-width="2"/><rect x="${t - 11}" y="${y + 12}" width="22" height="6" fill="#fff"/><text x="${x}" y="${y}" text-anchor="middle" class="ls-label">${text}</text></g>`;
  };
  const arrow = (x1, x2, y) => `<path d="M${x1} ${y} H${x2 - 10}" stroke="#3d4f63" stroke-width="5" stroke-linecap="round"/><path d="M${x2 - 14} ${y - 9} L${x2} ${y} L${x2 - 14} ${y + 9} Z" fill="#3d4f63"/>`;
  const lines = (x, ys, texts, cls = 'ls-small', anchor = 'middle') => texts.map((t, i) => `<text x="${x}" y="${ys[i]}" text-anchor="${anchor}" class="${cls}">${t}</text>`).join('');
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
  // One line of the Sübhaneke prayer with its meaning (one or two lines).
  const prayerRow = (y, said, meaning, step) => {
    const ys = meaning.length > 1 ? [y - 16, y + 12] : [y - 2];
    return `${lsPill(200, y, said, '#0b4f45', step)}<g ${lsStep(step, 'ls-d1')}>${arrow(330, 372, y - 5)}${lines(388, ys, meaning, 'ls-cap', 'start')}</g>`;
  };

  Object.assign(LESSON_SCENES, {
    [`${P}-intro`]: () => lsSvg(`<rect x="0" y="390" width="800" height="60" fill="#d9e4ea"/>
      ${lsKid(250, 340, 1.2, '#4c8be6')}${lsEmoji(205, 360, '🛍️', 40)}${lsEmoji(295, 360, '🛍️', 40)}${lsLabel(250, 428, 'Can', 0)}
      ${lsEmoji(560, 280, '👵', 120)}
      ${bubble(560, 120, 'Allah razı olsun evladım!', 1, -30)}
      ${lsLabel(560, 412, '🙏 Teşekkür + 🤲 Dua', 2)}
      ${lsLabel(160, 45, 'Dilek ve dualar', 3)}${lsLabel(400, 45, 'Dinî kavramlar', 3, 'ls-d1')}${lsLabel(620, 45, 'Sübhaneke', 3, 'ls-d2')}`),

    [`${P}-dua`]: () => lsSvg(`<rect x="40" y="70" width="290" height="330" rx="26" class="ls-card"/>
      ${lsKid(185, 330, 1.4, '#2eaa83')}${lsEmoji(185, 152, '🤲', 56)}
      <g ${lsStep(0)}>${lines(185, [434], ['Samimiyetle yönelmek'], 'ls-cap')}</g>
      ${lsPill(565, 112, 'İsteklerimizi iletiriz', '#1f9a73', 1)}${lsPill(565, 160, 'Yardım isteriz', '#1f9a73', 1, 'ls-d1')}${lsPill(565, 208, 'Allah’a güveniriz', '#1f9a73', 1, 'ls-d2')}
      ${lsLabel(565, 270, '👤 Kendimiz, 👥 başkaları için', 2)}
      ${lsLabel(565, 330, '🕰️ Her zaman, her yerde', 3)}
      ${lsPill(565, 402, 'Âmin: Allah’ım kabul eyle', '#08796e', 4)}`),

    [`${P}-dilekler`]: () => {
      const items = [['🤒', 'Hasta birine', 'Allah şifa versin', 1], ['🧳', 'Yolculuğa çıkana', 'Allah’a emanet ol', 2], ['📝', 'Sınava girene', 'Allah zihin açıklığı versin', 3], ['🛒', 'Alışveriş yaptığımıza', 'Allah bereket versin', 3],
        ['👶', 'Bebeği olan aileye', 'Allah bağışlasın', 4], ['🤝', 'İyilik yapana', 'Allah razı olsun', 4], ['😴', 'Uyumaya gidene', 'Allah rahatlık versin', 5], ['🕌', 'Namaz kılana', 'Allah kabul etsin', 5]];
      return lsSvg(`${lsLabel(400, 42, 'Dilek ve dua ifadeleri', 0)}
        ${items.map(([e, who, said, step], i) => { const x = i % 2 ? 410 : 30, y = 68 + Math.floor(i / 2) * 92;
          return `<g ${lsStep(step, 'ls-rise' + (i % 2 && items[i - 1][3] === step ? ' ls-d1' : ''))}><rect x="${x}" y="${y}" width="360" height="82" rx="18" class="ls-card"/>${lsEmoji(x + 40, y + 41, e, 36)}
            <text x="${x + 75}" y="${y + 32}" class="ls-small" style="fill:#5b6f66">${who}:</text><text x="${x + 75}" y="${y + 62}" style="font:800 19px Segoe UI,Arial,sans-serif;fill:#0b4f45">${said}</text></g>`; }).join('')}`);
    },

    [`${P}-insallah`]: () => lsSvg(`
      <rect x="30" y="70" width="355" height="255" rx="24" class="ls-card"/><rect x="415" y="70" width="355" height="255" rx="24" class="ls-card"/>
      ${lsPill(207, 110, 'İNŞALLAH', '#08796e', 0)}<g ${lsStep(0, 'ls-pop')}>${lsEmoji(207, 186, '📅', 60)}</g>
      <g ${lsStep(1)}>${lines(207, [256, 283], ['Allah izin verirse,', 'Allah dilerse'], 'ls-cap')}</g>
      ${lsLabel(207, 372, '“İnşallah yarın parka gideriz.”', 1, 'ls-d1')}
      ${lsPill(592, 110, 'MAŞALLAH', '#e8832f', 2)}<g ${lsStep(2, 'ls-pop')}>${lsEmoji(592, 186, '👶 🌷', 54)}</g>
      <g ${lsStep(3)}>${lines(592, [256], ['Allah’ın dilediği olur'], 'ls-cap')}${lines(592, [283], ['güzel bir şey görünce'])}</g>
      ${lsLabel(592, 372, '“Maşallah, ne güzel bebek!”', 3, 'ls-d1')}
      ${lsPill(400, 425, '💚 Allah’ı ve sevgiyi hatırlatır', '#1f9a73', 4)}`),

    [`${P}-dikkat`]: () => {
      const rows = [['🍽️', 'Yemeğe başlarken', 'Allah korusun', 'Bismillah'], ['🍲', 'Yemek yiyene', 'Kolay gelsin', 'Afiyet olsun'], ['🧳', 'Yolculuğa çıkana', 'Allah şifa versin', 'Allah’a emanet ol']];
      return lsSvg(`${lsLabel(400, 42, '⚠️ Doğru yerde kullanalım', 0)}
        ${rows.map(([e, who, wrong, right], i) => { const y = 122 + i * 88, step = i + 1;
          return `<g ${lsStep(step)}>${lsEmoji(52, y - 6, e, 34)}<text x="80" y="${y}" class="ls-small">${who}</text></g>
            ${lsLabel(395, y, wrong, step)}<g ${lsStep(step, 'ls-d1')}><line x1="${395 - lsLabelWidth(wrong) / 2 + 8}" y1="${y - 6}" x2="${395 + lsLabelWidth(wrong) / 2 - 8}" y2="${y - 6}" stroke="#e25d3f" stroke-width="4" stroke-linecap="round"/>${arrow(512, 554, y - 5)}</g>${lsPill(670, y, right, '#1f9a73', step, 'ls-d2')}`; }).join('')}
        ${lsLabel(400, 395, '😊 Yerinde söz, gönülleri sevindirir', 4)}`);
    },

    [`${P}-helal`]: () => lsSvg(`${lsLabel(400, 42, 'Günlük dilde: helal ve haram', 0)}
      <line ${lsStep(0)} x1="400" y1="78" x2="400" y2="285" stroke="#c9d6cd" stroke-width="4" stroke-dasharray="10 8"/>
      ${lsPill(205, 102, 'HELAL ✅', '#1f9a73', 1)}<g ${lsStep(1, 'ls-d1')}>${lines(205, [144, 167], ['Allah’ın izin verdiği,', 'serbest bıraktığı davranışlar'])}</g>
      ${[['⚽', 'spor', 105], ['💼', 'çalışmak', 205], ['🍎', 'temiz yiyecek', 315]].map(([e, t, x], i) => `<g ${lsStep(2, 'ls-rise ls-d' + i)}>${lsEmoji(x, 216, e, 42)}${lines(x, [262], [t])}</g>`).join('')}
      ${lsPill(595, 102, 'HARAM ⛔', '#d9472b', 3)}<g ${lsStep(3, 'ls-d1')}>${lines(595, [144, 167], ['Allah’ın kesin olarak', 'yasakladığı davranışlar'])}</g>
      ${[['👛', 'hırsızlık', 530], ['⚖️', 'hak yemek', 660]].map(([e, t, x], i) => `<g ${lsStep(4, 'ls-rise ls-d' + i)}>${lsEmoji(x, 216, e, 42)}${lsCross(x, 216, 56)}${lines(x, [262], [t])}</g>`).join('')}
      ${lsLabel(400, 332, '💬 “Hakkını helal et.”', 5)}<g ${lsStep(5, 'ls-d1')}>${lines(400, [376], ['Üzerimizde hakkı varsa bağışlamasını isteriz'])}</g>`),

    [`${P}-sevap`]: () => lsSvg(`<line x1="400" y1="50" x2="400" y2="280" stroke="#c9d6cd" stroke-width="4" stroke-dasharray="10 8"/>
      ${lsPill(205, 72, 'SEVAP 🌟', '#1f9a73', 0)}<g ${lsStep(0, 'ls-d1')}>${lines(205, [112, 135], ['Güzel davranışlarımız için', 'Allah’ın verdiği ödül'])}</g>
      ${[['🐱', 'merhamet', 95], ['🌳', 'ağaç', 205], ['🤝', 'yardım', 315]].map(([e, t, x], i) => `<g ${lsStep(1, 'ls-rise ls-d' + i)}><rect x="${x - 50}" y="160" width="100" height="110" rx="18" class="ls-card"/>${lsEmoji(x, 202, e, 42)}${lines(x, [255], [t])}</g>`).join('')}
      ${lsPill(595, 72, 'GÜNAH', '#d9472b', 2)}<g ${lsStep(2, 'ls-d1')}>${lines(595, [112, 135], ['Emir ve yasaklara', 'uymamanın karşılığı'])}${lsEmoji(595, 212, '⚖️', 70)}</g>
      ${lsPill(400, 334, '🌟 Salih amel: faydalı güzel işler', '#5b7fa6', 3)}
      ${lsLabel(400, 404, '⚠️ Haram: yasak • Günah: karşılığı', 4)}`),

    [`${P}-subhaneke`]: () => lsSvg(`<rect x="0" y="400" width="800" height="50" fill="#bfe3b4"/>
      ${mosque(185, 400)}${lsLabel(400, 42, 'SÜBHANEKE DUASI', 0)}
      ${lsLabel(575, 115, 'Peygamberimizin öğrettiği dua', 1)}
      ${lsLabel(575, 170, '✨ Allah’ı över, yüceltir', 2)}
      ${lsLabel(575, 225, 'Namazda tekbirden sonra ilk dua', 3)}
      ${lsPill(480, 287, 'Beş vakit', '#5b7fa6', 4)}${lsPill(650, 287, 'Bayram', '#5b7fa6', 4, 'ls-d1')}${lsPill(480, 333, 'Teravih', '#5b7fa6', 4, 'ls-d2')}${lsPill(650, 333, 'Cenaze', '#5b7fa6', 4, 'ls-d3')}
      ${lsPill(575, 405, 'Dikkat: Sure değil, duadır!', '#d9472b', 5)}`),

    [`${P}-anlam1`]: () => lsSvg(`${lsLabel(400, 45, 'Sübhaneke duası ve anlamı', 0)}
      ${prayerRow(135, 'Sübhâneke Allâhümme', ['Allah’ım! Sen tüm', 'eksikliklerden uzaksın.'], 1)}
      ${prayerRow(235, 'Ve bi hamdik', ['Seni daima överim.'], 2)}
      ${prayerRow(335, 'Ve tebârekesmük', ['Senin adın kutludur.'], 3)}`),

    [`${P}-anlam2`]: () => lsSvg(`${lsLabel(400, 45, 'Sübhaneke duası ve anlamı', 0)}
      ${prayerRow(125, 'Ve teâlâ ceddük', ['Senin şanın her şeyden', 'üstündür.'], 1)}
      ${prayerRow(210, 'Ve celle senâük', ['Senin övgün yücedir.'], 2)}
      ${prayerRow(295, 'Ve lâ ilâhe ğayruk', ['Senden başka ilah yoktur.'], 3)}
      ${lsLabel(400, 395, '📖 Ezberle, anlamını bilerek oku', 4)}`),

    [`${P}-summary`]: () => lsSummary([['🤲', 'Dua: samimiyetle|Allah’a yönelmek'], ['💬', 'Dilek ve duaları|yerinde kullan'], ['⚖️', 'Helal–haram,|sevap–günah'], ['🕌', 'Sübhaneke:|namazda ilk dua']], 'Hazırsan mini teste geçelim!'),
  });
}
