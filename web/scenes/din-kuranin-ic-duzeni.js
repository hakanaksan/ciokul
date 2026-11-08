/* Scenes for the video lesson "Kur'an-ı Kerim'in İç Düzeni". Loaded when the lesson opens (see loadLessonScenes in lessons.js). */
{
  const P = 'din-kuranin-ic-duzeni';
  const font = (size, weight = 800) => `style="font:${weight} ${size}px Segoe UI,Arial,sans-serif"`;
  const lines = (x, ys, texts, cls = 'ls-small', anchor = 'middle', extra = '') => texts.map((t, i) => `<text x="${x}" y="${ys[i]}" text-anchor="${anchor}" class="${cls}" ${extra}>${t}</text>`).join('');
  const arrow = (x1, x2, y, color = '#3d4f63') => `<path d="M${x1} ${y} H${x2 - 10}" stroke="${color}" stroke-width="5" stroke-linecap="round"/><path d="M${x2 - 14} ${y - 9} L${x2} ${y} L${x2 - 14} ${y + 9} Z" fill="${color}"/>`;
  // A calligraphy-like wavy line standing for Arabic script, written from x2 leftwards to x1.
  const script = (x1, x2, y, color = '#3d4f63') => {
    const n = Math.max(1, Math.floor((x2 - x1) / 20));
    return `<path d="M${x2} ${y} q-10 -10 -20 0${' t-20 0'.repeat(n - 1)}" stroke="${color}" stroke-width="3" fill="none" stroke-linecap="round"/>`
      + Array.from({ length: Math.floor(n / 3) }, (_, i) => `<circle cx="${x2 - 30 - i * 60}" cy="${y - 14}" r="2.2" fill="${color}"/>`).join('');
  };
  // An ayet stop: a small ornamented circle with the ayet number in it.
  const stop = (x, y, n, r = 15) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff7dc" stroke="#c49a2c" stroke-width="3"/><circle cx="${x}" cy="${y}" r="${r - 4}" fill="none" stroke="#e0c27a" stroke-width="1.5"/><text x="${x}" y="${y + r * 0.38}" text-anchor="middle" fill="#8a6a2a" ${font(Math.round(r * 1.05))}>${n}</text>`;
  // A closed Kur'an-ı Kerim with a green cover; (x, y) is its centre.
  const book = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-52" y="-68" width="104" height="136" rx="8" fill="#1f6f54"/><rect x="-52" y="-68" width="14" height="136" rx="6" fill="#165a44"/>
    <rect x="-30" y="-52" width="70" height="104" rx="6" fill="none" stroke="#e0c27a" stroke-width="3"/><circle cx="5" cy="0" r="18" fill="none" stroke="#e0c27a" stroke-width="3"/><circle cx="5" cy="0" r="6" fill="#e0c27a"/></g>`;
  // A wrong statement (crossed out) on the left, an arrow and the right one on the right.
  const fixRow = (y, wrong, right, note, step) => `<g ${lsStep(step, 'ls-rise')}><rect x="40" y="${y - 30}" width="720" height="62" rx="16" class="ls-card"/>
    <rect x="58" y="${y - 19}" width="200" height="38" rx="19" fill="#fde3dc"/><text x="158" y="${y + 7}" text-anchor="middle" class="ls-cap" style="fill:#b2402a">${wrong}</text>${lsCross(158, y, 150)}
    ${arrow(272, 322, y)}<text x="338" y="${note ? y - 3 : y + 7}" class="ls-label">${right}</text>${note ? `<text x="338" y="${y + 21}" class="ls-small" style="fill:#5d6b78">${note}</text>` : ''}</g>`;

  Object.assign(LESSON_SCENES, {
    [`${P}-intro`]: () => lsSvg(`<rect x="0" y="380" width="800" height="70" fill="#d9e4ea"/>
      <g transform="translate(205 240)"><path d="M-150 -95 Q-75 -112 0 -92 V92 Q-75 72 -150 90 Z" fill="#fffaf0" stroke="#c9b98a" stroke-width="3"/><path d="M150 -95 Q75 -112 0 -92 V92 Q75 72 150 90 Z" fill="#fffaf0" stroke="#c9b98a" stroke-width="3"/>
        ${[-60, -35, -10, 15, 40].map(y => `<line x1="-130" y1="${y}" x2="-20" y2="${y}" stroke="#c9d6cd" stroke-width="5" stroke-linecap="round"/><line x1="20" y1="${y}" x2="130" y2="${y}" stroke="#c9d6cd" stroke-width="5" stroke-linecap="round"/>`).join('')}
        <text x="75" y="80" text-anchor="middle" class="ls-small">12</text></g>
      ${lsLabel(205, 105, '📖 Hikâye kitabı', 0)}
      <g ${lsStep(1)}><rect x="72" y="171" width="128" height="16" rx="6" fill="none" stroke="#e8832f" stroke-width="3"/></g>
      ${lsPill(100, 365, 'cümle', '#e8832f', 1)}${lsPill(205, 365, 'bölüm', '#5b7fa6', 1, 'ls-d1')}${lsPill(310, 365, 'sayfa', '#1f9a73', 1, 'ls-d2')}
      <g ${lsStep(2, 'ls-rise')}><path d="M500 372 L680 250 M680 372 L500 250" stroke="#a0703c" stroke-width="14" stroke-linecap="round"/>
        <path d="M590 250 L470 222 L478 152 L590 172 Z" fill="#1f6f54"/><path d="M590 250 L710 222 L702 152 L590 172 Z" fill="#1f6f54"/>
        <path d="M590 242 L482 216 L488 160 L590 178 Z" fill="#fffaf0"/><path d="M590 242 L698 216 L692 160 L590 178 Z" fill="#fffaf0"/>
        ${[185, 200, 215].map(y => `<path d="M495 ${y - 4} q12 -8 24 0 t24 0 t24 0 t24 0" stroke="#3d4f63" stroke-width="2" fill="none" transform="rotate(12 540 ${y})"/><path d="M600 ${y + 6} q12 -8 24 0 t24 0 t24 0 t24 0" stroke="#3d4f63" stroke-width="2" fill="none" transform="rotate(-12 640 ${y})"/>`).join('')}</g>
      ${lsLabel(590, 105, 'Kur’an-ı Kerim', 2, 'ls-d1')}
      ${lsPill(500, 420, 'Ayet', '#08796e', 3)}${lsPill(590, 420, 'Sure', '#08796e', 3, 'ls-d1')}${lsPill(680, 420, 'Cüz', '#08796e', 3, 'ls-d2')}`),

    [`${P}-kuran`]: () => lsSvg(`<rect x="30" y="30" width="230" height="240" rx="22" class="ls-card"/>
      ${book(145, 125, 0.9)}${lines(145, [222, 248], ['Son ilahi kitap', 'Peygamberimize indi'], 'ls-small')}
      <g ${lsStep(1, 'ls-rise')}><rect x="285" y="30" width="230" height="240" rx="22" fill="#1b2a4a"/>
        ${lsEmoji(400, 82, '🌙', 44)}<circle cx="320" cy="60" r="2.5" fill="#fff"/><circle cx="480" cy="110" r="2" fill="#fff"/><circle cx="345" cy="130" r="2" fill="#fff"/>
        <text x="400" y="170" text-anchor="middle" fill="#ffd66b" ${font(46, 900)}>610</text>
        <text x="400" y="210" text-anchor="middle" fill="#fff" ${font(20)}>Ramazan ayı</text><text x="400" y="243" text-anchor="middle" fill="#fff" ${font(20)}>Kadir Gecesi</text></g>
      <g ${lsStep(3, 'ls-rise')}><rect x="540" y="30" width="230" height="240" rx="22" class="ls-card"/>${lsEmoji(655, 100, '🌍', 64)}
        ${lines(655, [182, 212, 242], ['Arapça indirildi', 'Bütün insanlara', 'doğru yolu gösterir'], 'ls-small')}</g>
      <g ${lsStep(2)}><line x1="80" y1="350" x2="720" y2="350" stroke="#c9d6cd" stroke-width="8" stroke-linecap="round"/>
        <text x="80" y="390" text-anchor="middle" class="ls-small">610</text><text x="400" y="312" text-anchor="middle" class="ls-label">yaklaşık 23 yıl</text></g>
      ${Array.from({ length: 12 }, (_, i) => `<rect ${lsStep(2, 'ls-drop ls-d' + Math.min(5, Math.floor(i / 2)))} x="${86 + i * 52}" y="340" width="40" height="20" rx="5" fill="#1f9a73"/>`).join('')}
      ${lsPill(400, 415, '✅ Parça parça', '#1f9a73', 2, 'ls-d3')}
      <g ${lsStep(2, 'ls-d4')}><text x="640" y="415" text-anchor="middle" class="ls-cap" style="fill:#b2402a">tek seferde</text>${lsCross(640, 408, 120)}</g>`),

    [`${P}-ayet`]: () => lsSvg(`<rect x="50" y="35" width="700" height="190" rx="14" fill="#fffaf0" stroke="#c9b98a" stroke-width="3"/>
      ${script(400, 720, 80)}${stop(375, 78, 1)}${script(80, 350, 80)}
      ${script(520, 720, 135)}${stop(495, 133, 2)}${script(80, 470, 135)}
      ${script(320, 720, 190)}${stop(295, 188, 3)}${script(180, 270, 190)}
      <rect x="393" y="56" width="340" height="40" rx="10" fill="#08796e22" stroke="#08796e" stroke-width="3"/>
      ${lsLabel(565, 252, '1 ayet = 1 cümle', 0)}
      ${lsPill(200, 280, 'Ayet = işaret, delil', '#5b7fa6', 1)}
      <g ${lsStep(2, 'ls-pop')}>${[[375, 78], [495, 133], [295, 188]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="22" fill="none" stroke="#e8832f" stroke-width="4"/>`).join('')}</g>
      ${lsLabel(200, 340, '⭕ Ayet durağı', 2, 'ls-d1')}
      <g ${lsStep(3, 'ls-pop')}>${stop(560, 320, 3, 52)}</g>
      <g ${lsStep(3, 'ls-d1')}>${lines(560, [400], ['İçinde ayetin numarası'], 'ls-cap')}</g>
      ${lsPill(200, 410, 'Altı binden fazla ayet', '#08796e', 4)}`),

    [`${P}-sure`]: () => {
      const widths = [30, 130, 96, 60, 40, 110, 52, 34, 26];
      let x = 40;
      const bars = widths.map((w, i) => { const r = { x, w }; x += w + (i < widths.length - 1 ? 14 : 0); return r; });
      const total = x - 40, shift = (720 - total) / 2;
      const colors = ['#1f6f54', '#2e8b6a', '#3fa07c', '#1f6f54', '#2e8b6a', '#3fa07c', '#1f6f54', '#2e8b6a', '#3fa07c'];
      return lsSvg(`${lsPill(400, 48, 'Sure: ayetlerden oluşan bölüm', '#08796e', 0)}
        ${bars.map((b, i) => `<g ${lsStep(0, 'ls-rise ls-d' + Math.min(5, i))}><rect x="${b.x + shift}" y="85" width="${b.w}" height="48" rx="8" fill="${colors[i]}"/></g>`).join('')}
        <g ${lsStep(2, 'ls-pop')}>${bars.slice(1).map(b => `<path d="M${b.x + shift - 7} 96 l6 13 l-6 13 l-6 -13 Z" fill="#e8b10f"/>`).join('')}</g>
        <g ${lsStep(1, 'ls-pop')}><circle cx="110" cy="220" r="56" fill="#e8832f"/><text x="110" y="226" text-anchor="middle" fill="#fff" ${font(40, 900)}>114</text><text x="110" y="254" text-anchor="middle" fill="#fff" ${font(18)}>sure</text></g>
        ${lsLabel(345, 180, '🔸 Besmele ile ayrılır', 2)}<g ${lsStep(2, 'ls-d1')}>${lines(345, [214], ['(Tevbe suresinin başında yok)'])}</g>
        ${lsLabel(630, 180, '📏 Uzunlukları farklı', 3)}${lsLabel(630, 232, '🏷️ Her birinin adı var', 3, 'ls-d1')}
        ${[['🐄', 'Bakara suresi', '“inek”'], ['🐝', 'Nahl suresi', '“bal arısı”'], ['🐘', 'Fil suresi', '“fil”']].map(([e, name, mean], i) => { const cx = 160 + i * 240;
          return `<g ${lsStep(4, 'ls-rise ls-d' + i)}><rect x="${cx - 105}" y="290" width="210" height="135" rx="20" class="ls-card"/>${lsEmoji(cx, 330, e, 40)}<text x="${cx}" y="380" text-anchor="middle" class="ls-cap">${name}</text><text x="${cx}" y="408" text-anchor="middle" class="ls-small" style="fill:#5d6b78">${mean}</text></g>`; }).join('')}`);
    },

    [`${P}-onemli`]: () => {
      const cards = [['İLK', '#1f9a73', 'Fatiha suresi', '1. sure • 1. cüzde'], ['SON', '#5b7fa6', 'Nas suresi', '114. sure • 30. cüzde'],
        ['EN UZUN', '#e8832f', 'Bakara suresi', '286 ayet'], ['EN KISA', '#8e6bbf', 'Kevser suresi', '3 ayet']];
      return lsSvg(`${lsLabel(400, 42, '⭐ Önemli sureler', 0)}
        ${cards.map(([tag, color, name, info], i) => { const x = 40 + (i % 2) * 370, y = 75 + Math.floor(i / 2) * 180;
          const bar = i === 2 ? `<rect x="${x + 30}" y="${y + 130}" width="290" height="14" rx="7" fill="${color}"/>` : i === 3 ? `<rect x="${x + 30}" y="${y + 130}" width="22" height="14" rx="7" fill="${color}"/>` : '';
          return `<g ${lsStep(i + 1, 'ls-rise')}><rect x="${x}" y="${y}" width="350" height="160" rx="22" class="ls-card"/>
            <rect x="${x + 20}" y="${y + 18}" width="${lsLabelWidth(tag)}" height="34" rx="17" fill="${color}"/><text x="${x + 20 + lsLabelWidth(tag) / 2}" y="${y + 42}" text-anchor="middle" class="ls-pill">${tag}</text>
            <text x="${x + 175}" y="${y + 90}" text-anchor="middle" fill="#22392f" ${font(28, 900)}>${name}</text>
            <text x="${x + 175}" y="${y + 120}" text-anchor="middle" class="ls-cap" style="fill:#5d6b78">${info}</text>${bar}</g>`; }).join('')}`);
    },

    [`${P}-cuz`]: () => {
      const cell = n => { const c = (n - 1) % 6, r = Math.floor((n - 1) / 6); return [40 + c * 56, 70 + r * 50]; };
      const grid = Array.from({ length: 30 }, (_, i) => { const [x, y] = cell(i + 1);
        return `<g ${lsStep(1, 'ls-pop ls-d' + Math.min(5, Math.floor(i / 6)))}><rect x="${x}" y="${y}" width="50" height="42" rx="8" fill="#e6f2ec" stroke="#2e8b6a" stroke-width="2"/><text x="${x + 25}" y="${y + 28}" text-anchor="middle" class="ls-small" style="fill:#0b4f45">${i + 1}</text></g>`; }).join('');
      const [x1, y1] = cell(1), [x30, y30] = cell(30);
      return lsSvg(`${grid}
        <g transform="translate(480 115)">${[12, 6, 0].map(d => `<rect x="${-40 + d}" y="${-48 + d}" width="70" height="90" rx="6" fill="#fffaf0" stroke="#c9b98a" stroke-width="3"/>`).join('')}
          ${[-12, 2, 16].map(y => `<line x1="-14" y1="${y}" x2="30" y2="${y}" stroke="#c9d6cd" stroke-width="4" stroke-linecap="round"/>`).join('')}</g>
        ${lsLabel(645, 115, '1 cüz = 20 sayfa', 0)}
        ${lsPill(595, 205, 'Toplam 30 cüz', '#08796e', 1)}
        ${lsLabel(595, 265, 'Sayfa sayısına göre ayrılır', 2)}<g ${lsStep(2, 'ls-d1')}>${lines(595, [298], ['(ayet sayısına göre değil)'])}</g>
        ${lsLabel(595, 355, '📅 Günde 1 cüz → 30 gün', 3)}
        <g ${lsStep(4, 'ls-pop')}><rect x="${x1 - 5}" y="${y1 - 5}" width="60" height="52" rx="10" fill="none" stroke="#e8b10f" stroke-width="5"/><rect x="${x30 - 5}" y="${y30 - 5}" width="60" height="52" rx="10" fill="none" stroke="#e8b10f" stroke-width="5"/></g>
        ${lsPill(140, 370, 'Fatiha: 1. cüz', '#1f9a73', 4, 'ls-d1')}${lsPill(275, 418, 'Nas: 30. cüz', '#5b7fa6', 4, 'ls-d2')}`);
    },

    [`${P}-sayfa`]: () => lsSvg(`<rect x="250" y="25" width="300" height="370" rx="10" fill="#fffaf0" stroke="#c9b98a" stroke-width="4"/>
      <rect x="265" y="40" width="270" height="340" rx="6" fill="none" stroke="#e0c27a" stroke-width="2"/>
      ${script(285, 515, 95)}${script(285, 515, 125)}
      <g ${lsStep(1)}><rect x="280" y="50" width="70" height="24" rx="6" fill="#08796e"/><text x="315" y="68" text-anchor="middle" fill="#fff" ${font(15)}>30. cüz</text></g>
      <g ${lsStep(2)}><rect x="285" y="150" width="230" height="40" rx="10" fill="#1f6f54"/><rect x="291" y="156" width="218" height="28" rx="7" fill="none" stroke="#e0c27a" stroke-width="2"/>
        <text x="400" y="177" text-anchor="middle" fill="#fff" ${font(17)}>Kevser suresi</text></g>
      <g ${lsStep(2, 'ls-d1')}>${script(330, 470, 222, '#1f6f54')}</g>
      ${script(330, 515, 270)}${stop(310, 268, 1, 13)}
      ${script(400, 515, 315)}${stop(380, 313, 2, 13)}${script(285, 360, 315)}
      ${script(360, 515, 360)}${stop(340, 358, 3, 13)}
      ${lsLabel(130, 62, 'Cüz bilgisi', 1)}<g ${lsStep(1, 'ls-d1')}>${arrow(205, 274, 62, '#08796e')}</g>
      ${lsLabel(670, 170, 'Surenin adı', 2)}<g ${lsStep(2)}><path d="M594 170 H530" stroke="#08796e" stroke-width="4"/></g>
      ${lsLabel(130, 222, 'Besmele', 2, 'ls-d1')}<g ${lsStep(2, 'ls-d1')}>${arrow(185, 320, 222, '#08796e')}</g>
      <g ${lsStep(3, 'ls-pop')}>${[[310, 268], [380, 313], [340, 358]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="20" fill="none" stroke="#e8832f" stroke-width="4"/>`).join('')}</g>
      ${lsLabel(670, 313, 'Ayet durağı', 3)}<g ${lsStep(3)}><path d="M594 313 H530" stroke="#e8832f" stroke-width="4"/></g>
      ${lsPill(400, 428, 'Kevser suresi: 3 ayet, 30. cüz', '#e8832f', 4)}`),

    [`${P}-kartlar`]: () => {
      const cards = [[['Kur’an-ı Kerim’in', 'her bir cümlesi'], 'Ayet', '#08796e'], [['Kur’an-ı Kerim’in', '114 bölümünden', 'her biri'], 'Sure', '#e8832f'], [['Kur’an-ı Kerim’in', '20 sayfalık', 'her bir bölümü'], 'Cüz', '#5b7fa6']];
      return lsSvg(`<rect x="0" y="390" width="800" height="60" fill="#d9e4ea"/>${lsKid(100, 340, 1.3, '#2eaa83')}${lsLabel(100, 425, 'Hasan', 0)}
        ${lsLabel(470, 50, '🃏 Bilgi kartları', 0)}
        ${cards.map(([def, name, color], i) => { const cx = 285 + i * 185;
          return `<g ${lsStep(0, 'ls-rise ls-d' + i)}><rect x="${cx - 85}" y="85" width="170" height="250" rx="18" fill="#fffaf0" stroke="#c9b98a" stroke-width="3"/>
            <circle cx="${cx}" cy="118" r="20" fill="${color}"/><text x="${cx}" y="125" text-anchor="middle" fill="#fff" ${font(20, 900)}>${i + 1}</text>
            ${lines(cx, def.map((_, j) => 172 + j * 26), def)}</g>${lsPill(cx, 296, name, color, i + 1)}`; }).join('')}
        ${lsLabel(470, 385, '✅ Sıra: Ayet, Sure, Cüz', 4)}`);
    },

    [`${P}-dikkat`]: () => lsSvg(`${lsLabel(400, 40, '⚠️ Karıştırmayalım!', 0)}
      ${fixRow(105, '114 ayet', '114 sure', 'ayet sayısı altı binden fazladır', 1)}
      ${fixRow(185, '20 cüz', '30 cüz', '20: bir cüzdeki sayfa sayısı', 2)}
      <g ${lsStep(3, 'ls-rise')}><rect x="40" y="235" width="720" height="62" rx="16" class="ls-card"/>${lsPill(158, 272, 'Hatim', '#8e6bbf', 3)}${arrow(272, 322, 266)}
        <text x="338" y="263" class="ls-label">Kur’an-ı Kerim’i baştan sona okumak</text><text x="338" y="287" class="ls-small" style="fill:#5d6b78">iç düzen kavramı değildir</text></g>
      <g ${lsStep(4, 'ls-rise')}><rect x="40" y="315" width="720" height="120" rx="16" class="ls-card"/><text x="158" y="382" text-anchor="middle" fill="#0b4f45" ${font(30, 900)}>Sure ≠ Cüz</text>
        ${[0, 1, 2].map(i => `<rect x="${300 + i * 80}" y="335" width="74" height="34" rx="6" fill="#e6f2ec" stroke="#2e8b6a" stroke-width="2"/><text x="${337 + i * 80}" y="358" text-anchor="middle" class="ls-small">${i + 1}. cüz</text>`).join('')}
        <rect x="300" y="376" width="234" height="14" rx="7" fill="#e8832f"/><text x="417" y="414" text-anchor="middle" class="ls-small">Bakara suresi</text>
        <rect x="570" y="335" width="170" height="34" rx="6" fill="#e6f2ec" stroke="#2e8b6a" stroke-width="2"/><text x="655" y="358" text-anchor="middle" class="ls-small">30. cüz</text>
        ${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `<rect x="${572 + i * 21}" y="376" width="17" height="14" rx="4" fill="#5b7fa6"/>`).join('')}<text x="655" y="414" text-anchor="middle" class="ls-small">birçok kısa sure</text></g>`),

    [`${P}-summary`]: () => lsSummary([['📖', 'Ayet: her bir cümle,|ayet durağıyla biter'], ['📚', 'Sure: 114 bölüm,|besmeleyle ayrılır'], ['🗂️', 'Cüz: 20 sayfa,|toplam 30 cüz'], ['⭐', 'İlk: Fatiha, son: Nas|En uzun: Bakara|En kısa: Kevser']], 'Hazırsan mini teste geçelim!'),
  });
}
