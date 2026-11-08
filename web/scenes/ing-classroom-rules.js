/* Scenes for the video lesson "Sınıfta İngilizce: Kurallar, Rica ve İzin". Loaded when the lesson opens (see loadLessonScenes in lessons.js). */
{
  const F = 'font-family="Segoe UI,Arial,sans-serif" font-weight="800"';
  // Rough widths of bold English text (font size fs) and of Turkish ls-small text, for sizing cards.
  const enW = (t, fs) => [...t].reduce((w, c) => w + fs * (/[mwMW]/.test(c) ? 0.9 : /[A-Z]/.test(c) ? 0.68 : /[ijlI.,:;'!-]/.test(c) ? 0.3 : /[frt ]/.test(c) ? 0.4 : /[a-z0-9?]/.test(c) ? 0.58 : 1), 0);
  const trW = t => [...t].reduce((w, c) => w + (c === ' ' ? 5 : c !== c.toLocaleLowerCase('tr') ? 12 : 9.4), 0);
  // A white card with big English text and its Turkish meaning below; an optional icon sits inside on the left.
  const card = (x, y, en, tr, fs, color, { extra = '', icon = '' } = {}) => {
    const pad = icon ? 56 : 0, w = Math.round(Math.max(enW(en, fs), tr ? trW(tr) : 0) + 44 + pad), top = Math.round(y - fs * 0.78 - 14), bottom = y + (tr ? 38 : 16), tx = x + pad / 2;
    const ic = !icon ? '' : typeof icon === 'function' ? icon(x - w / 2 + 38, (top + bottom) / 2) : lsEmoji(x - w / 2 + 38, (top + bottom) / 2, icon, 34);
    return { w, top, bottom, svg: `<rect x="${x - w / 2}" y="${top}" width="${w}" height="${bottom - top}" rx="18" fill="#fff" stroke="${color}" stroke-width="3"/>${typeof extra === 'function' ? extra(w, bottom) : extra}${ic}<text x="${tx}" y="${y}" text-anchor="middle" ${F} font-size="${fs}" fill="#0b4f45">${en}</text>${tr ? `<text x="${tx}" y="${y + 28}" text-anchor="middle" class="ls-small">${tr}</text>` : ''}` };
  };
  const ok = (x, y) => `<circle cx="${x}" cy="${y}" r="17" fill="#2eaa83"/><path d="M${x - 8} ${y} l6 7 l11 -13" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  const no = (x, y) => `<circle cx="${x}" cy="${y}" r="17" fill="#e25d3f"/><path d="M${x - 7} ${y - 7} l14 14 M${x + 7} ${y - 7} l-14 14" stroke="#fff" stroke-width="5" stroke-linecap="round"/>`;
  // An English sentence shown big, with its Turkish meaning below; mark 'ok' or 'no' adds a badge on the right edge.
  const say = (x, y, en, tr, step, { fs = 32, color = '#08796e', cls = 'ls-pop', attrs = '', mark = '', icon = '' } = {}) => {
    const c = card(x, y, en, tr, fs, color, { icon });
    return `<g ${lsStep(step, cls)} ${attrs}>${c.svg}${mark === 'ok' ? ok(x + c.w / 2 - 6, c.top + 6) : mark === 'no' ? no(x + c.w / 2 - 6, c.top + 6) : ''}</g>`;
  };
  // A speech bubble whose tail points down-left (side -1) or down-right (side 1) to the speaker.
  const bubble = (x, y, en, tr, step, side, color, attrs = '', fs = 30) =>
    `<g ${lsStep(step, 'ls-pop')} ${attrs}>${card(x, y, en, tr, fs, color, { extra: (w, bottom) => {
      const bx = x + side * (w / 2 - 46);
      return `<path d="M${bx - 14} ${bottom - 3} L${bx + side * 34} ${bottom + 26} L${bx + 14} ${bottom - 3}" fill="#fff" stroke="${color}" stroke-width="3"/>`;
    } }).svg}</g>`;
  const kid = (x, y, s, shirt, hair, girl = false) =>
    (girl ? `<path transform="translate(${x} ${y}) scale(${s})" d="M-21 -64 Q-29 -34 -20 -24 H20 Q29 -34 21 -64 Z" fill="${hair}"/>` : '') + lsKid(x, y, s, shirt, hair) +
    (girl ? `<g transform="translate(${x} ${y}) scale(${s})"><circle cx="9" cy="-79" r="5" fill="#ff6fa8"/><circle cx="19" cy="-77" r="5" fill="#ff6fa8"/><circle cx="14" cy="-78" r="3" fill="#e0408a"/></g>` : '');
  const name = (x, y, t) => `<text x="${x}" y="${y}" text-anchor="middle" class="ls-label">${t}</text>`;
  const MERT = [90, 360], LILY = [710, 360];
  const kids = () => kid(MERT[0], MERT[1], 1, '#e8832f', '#3b2416') + kid(LILY[0], LILY[1], 1, '#d4589a', '#e8b84a', true) + name(MERT[0], 435, 'Mert') + name(LILY[0], 435, 'Lily');
  // An object card (w x h): picture, English word (shrunk to fit), Turkish meaning; (x, top) is the top centre.
  const obj = (x, top, w, h, icon, en, tr, step, i) => {
    const fs = Math.min(21, Math.floor((w - 18) / enW(en, 1)));
    return `<g ${lsStep(step, 'ls-rise ls-d' + i)}><rect x="${x - w / 2}" y="${top}" width="${w}" height="${h}" rx="18" class="ls-card"/>
    ${typeof icon === 'function' ? icon(x, top + 30) : lsEmoji(x, top + 30, icon, 32)}<text x="${x}" y="${top + h - 32}" text-anchor="middle" ${F} font-size="${fs}" fill="#0b4f45">${en}</text>
    <text x="${x}" y="${top + h - 12}" text-anchor="middle" class="ls-small" style="font-size:15px">${tr}</text></g>`;
  };
  const eraser = (x, y) => `<g transform="translate(${x} ${y}) rotate(-15)"><rect x="-24" y="-12" width="48" height="24" rx="5" fill="#ff8fb1"/><rect x="6" y="-12" width="18" height="24" rx="3" fill="#4c8be6"/></g>`;
  const sharpener = (x, y) => `<g transform="translate(${x} ${y})"><rect x="-18" y="-13" width="36" height="26" rx="5" fill="#9aa7b5"/><circle cx="-4" cy="0" r="7" fill="#3d4f63"/><rect x="6" y="-9" width="8" height="18" rx="2" fill="#d8dee5"/></g>`;
  const windowIcon = (x, y) => `<g transform="translate(${x} ${y})"><rect x="-16" y="-16" width="32" height="32" rx="3" fill="#bfe6ff" stroke="#8a5a2b" stroke-width="4"/><path d="M0 -16 V16 M-16 0 H16" stroke="#8a5a2b" stroke-width="3"/></g>`;
  const door = (x, y) => `<g transform="translate(${x} ${y})"><rect x="0" y="0" width="110" height="230" rx="6" fill="#b9773e" stroke="#7a4a22" stroke-width="5"/><rect x="16" y="20" width="78" height="80" rx="4" fill="#a8672f"/><rect x="16" y="120" width="78" height="90" rx="4" fill="#a8672f"/><circle cx="92" cy="120" r="7" fill="#f2c94c"/></g>`;
  const board = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="#2f6b4f" stroke="#8a5a2b" stroke-width="8"/>`;
  const chalk = (x, y, t, fs = 30) => `<text x="${x}" y="${y}" text-anchor="middle" ${F} font-size="${fs}" fill="#fff">${t}</text>`;

  Object.assign(LESSON_SCENES, {
    'ing-classroom-rules-intro': () => lsSvg(`<rect x="0" y="340" width="800" height="110" fill="#e9d9b8"/>${board(220, 50, 360, 170)}
      <g ${lsStep(0, 'ls-rise')}>${lsKid(670, 360, 1.35, '#5b7fa6', '#3b2416')}${lsEmoji(605, 255, '📢', 46)}</g>
      <g ${lsStep(1, 'ls-rise')}>${kid(110, 420, 1, '#4c8be6', '#5a3b22', true)}${kid(250, 420, 1, '#e8832f', '#3b2416')}${lsEmoji(110, 290, '🙏', 40)}${lsEmoji(250, 290, '🙋', 40)}</g>
      <g ${lsStep(2, 'ls-in')}>${chalk(400, 120, 'Classroom English', 34)}</g>
      <g ${lsStep(3, 'ls-in')}>${chalk(400, 185, '1, 2, 3 … 50', 32)}</g>
      ${lsLabel(450, 300, 'Haydi başlayalım!', 3, 'ls-d2')}`),

    'ing-classroom-rules-objects': () => lsSvg(`${lsLabel(400, 34, 'Sınıf eşyaları', 0)}
      ${[['📕', 'book', 'kitap'], ['📓', 'notebook', 'defter'], ['✏️', 'pencil', 'kurşun kalem']].map(([e, en, tr], i) => obj(160 + i * 240, 58, 220, 96, e, en, tr, 1, i)).join('')}
      ${[[eraser, 'eraser', 'silgi'], ['📏', 'ruler', 'cetvel'], [sharpener, 'pencil sharpener', 'kalemtıraş']].map(([e, en, tr], i) => obj(160 + i * 240, 164, 220, 96, e, en, tr, 2, i)).join('')}
      ${[['👝', 'pencil case', 'kalem kutusu'], ['🎒', 'schoolbag', 'okul çantası'], ['✂️', 'scissors', 'makas']].map(([e, en, tr], i) => obj(160 + i * 240, 270, 220, 96, e, en, tr, 3, i)).join('')}
      ${lsPill(400, 408, 'pencil = kurşun kalem', '#5b7fa6', 4)}`),

    'ing-classroom-rules-instructions': () => lsSvg(`${lsLabel(400, 38, '📢 Öğretmen ne diyor?', 0)}
      ${say(210, 115, 'Stand up, please.', 'Ayağa kalk, lütfen.', 1, { fs: 28, icon: '⬆️' })}
      ${say(590, 115, 'Sit down, please.', 'Otur, lütfen.', 2, { fs: 28, icon: '⬇️' })}
      ${say(400, 225, 'Open your book. Close your book.', 'Kitabını aç. Kitabını kapat.', 3, { fs: 28, icon: '📖' })}
      ${say(210, 335, 'Raise your hand.', 'Parmak kaldır.', 4, { fs: 28, icon: '✋' })}
      ${say(590, 335, 'Be quiet, please.', 'Sessiz ol, lütfen.', 5, { fs: 28, icon: '🤫' })}`),

    'ing-classroom-rules-more': () => lsSvg(`${lsLabel(400, 28, 'Başka yönergeler', 0)}
      ${say(400, 95, 'Look at the board, please.', 'Tahtaya bak, lütfen.', 1, { fs: 25, icon: '👀' })}
      ${say(400, 171, 'Clean the board, please.', 'Tahtayı sil, lütfen.', 2, { fs: 25, icon: '🧽' })}
      ${say(400, 247, 'Open the window, please.', 'Pencereyi aç, lütfen.', 3, { fs: 25, icon: windowIcon })}
      ${say(400, 323, 'Turn on the lights. Turn off the lights.', 'Işıkları aç. Işıkları kapat.', 4, { fs: 25, icon: '💡' })}
      ${say(400, 399, 'Go back to your place, please.', 'Yerine dön, lütfen.', 5, { fs: 25, icon: '↩️' })}`),

    'ing-classroom-rules-request': () => lsSvg(`${kids()}
      ${lsPill(400, 425, 'Rica: … please.', '#5b7fa6', 0)}
      <g ${lsStep(0, 'ls-pop')} data-hide="3">${lsEmoji(660, 330, '📏', 36)}</g>
      ${bubble(330, 70, 'Give me the ruler, please.', 'Bana cetveli ver, lütfen.', 1, -1, '#e8832f')}
      ${bubble(480, 155, 'Sure. Here you are.', 'Tabii. Buyur.', 2, 1, '#d4589a')}
      <g ${lsStep(3, 'ls-pop')}>${lsEmoji(140, 330, '📏', 36)}</g>
      ${bubble(320, 240, 'Thank you.', 'Teşekkür ederim.', 4, -1, '#e8832f')}
      ${bubble(480, 325, "You're welcome.", 'Rica ederim.', 5, 1, '#d4589a')}`),

    'ing-classroom-rules-permission': () => lsSvg(`<rect x="0" y="400" width="800" height="50" fill="#e9d9b8"/>${door(30, 170)}
      <g ${lsStep(0, 'ls-rise')}>${lsKid(210, 395, 1.1, '#2eaa83', '#5a3b22')}${lsEmoji(150, 150, '✊', 34)}</g>
      ${lsKid(690, 395, 1.3, '#5b7fa6', '#3b2416')}
      ${bubble(330, 110, 'May I come in?', 'Girebilir miyim?', 1, -1, '#2eaa83', 'data-hide="3"')}
      ${bubble(450, 230, 'Yes, you can. Please come in.', 'Evet, girebilirsin. Lütfen gir.', 2, 1, '#5b7fa6', 'data-hide="3"')}
      ${lsPill(560, 40, 'Kerem dışarı çıkmak istiyor', '#5b7fa6', 3)}
      ${bubble(330, 110, 'Can I go out?', 'Dışarı çıkabilir miyim?', 4, -1, '#2eaa83')}
      ${bubble(450, 230, 'Sorry, not right now.', 'Üzgünüm, şimdi olmaz.', 5, 1, '#5b7fa6')}`),

    'ing-classroom-rules-dialogue': () => lsSvg(`${kids()}
      ${lsPill(400, 425, '👂 Mert iyi duyamıyor', '#5b7fa6', 0)}
      ${bubble(480, 70, 'May I take your eraser?', 'Silgini alabilir miyim?', 1, 1, '#d4589a')}
      ${bubble(320, 155, 'Say that again, please.', 'Tekrar söyler misin, lütfen?', 2, -1, '#e8832f')}
      ${bubble(480, 240, 'May I take your eraser?', 'Silgini alabilir miyim?', 3, 1, '#d4589a')}
      ${bubble(320, 325, 'Of course. Here you are.', 'Tabii ki. Buyur.', 4, -1, '#e8832f')}`),

    'ing-classroom-rules-tens': () => lsSvg(`${[[10, 'ten'], [20, 'twenty'], [30, 'thirty'], [40, 'forty'], [50, 'fifty']].map(([n, en], i) =>
        `<g ${lsStep(1, 'ls-rise ls-d' + i)}><rect x="${40 + i * 148}" y="20" width="128" height="110" rx="18" class="ls-card"/><text x="${104 + i * 148}" y="76" text-anchor="middle" ${F} font-size="44" fill="#08796e">${n}</text><text x="${104 + i * 148}" y="112" text-anchor="middle" ${F} font-size="22" fill="#0b4f45">${en}</text></g>`).join('')}
      <g ${lsStep(0, 'ls-pop')}><text x="400" y="160" text-anchor="middle" class="ls-small">Onar onar sayalım</text></g>
      <g ${lsStep(2, 'ls-pop')}><rect x="160" y="178" width="480" height="62" rx="18" fill="#fff" stroke="#5b7fa6" stroke-width="3"/><text x="400" y="220" text-anchor="middle" ${F} font-size="28" fill="#0b4f45">20 + 1 ➜ twenty<tspan fill="#e25d3f">-</tspan>one</text></g>
      ${[[21, 'twenty-one'], [35, 'thirty-five'], [42, 'forty-two']].map(([n, en], i) =>
        `<g ${lsStep(3, 'ls-rise ls-d' + i)}><rect x="${60 + i * 235}" y="258" width="210" height="80" rx="18" class="ls-card"/><text x="${165 + i * 235}" y="292" text-anchor="middle" ${F} font-size="30" fill="#08796e">${n}</text><text x="${165 + i * 235}" y="324" text-anchor="middle" ${F} font-size="21" fill="#0b4f45">${en}</text></g>`).join('')}
      <g ${lsStep(4, 'ls-pop')}>${board(28, 362, 230, 74)}${chalk(143, 410, '15 + 20 = ?', 30)}</g>
      ${say(530, 398, 'Fifteen plus twenty is thirty-five.', 'On beş artı yirmi, otuz beş eder.', 5, { fs: 22 })}`),

    'ing-classroom-rules-careful': () => {
      const pair = (y, n1, a, b, n2, c, step) => `<g ${lsStep(step, 'ls-pop')}>
        <rect x="90" y="${y - 44}" width="270" height="78" rx="18" fill="#fff" stroke="#4c8be6" stroke-width="3"/><text x="140" y="${y + 8}" text-anchor="middle" ${F} font-size="34" fill="#4c8be6">${n1}</text><text x="255" y="${y + 6}" text-anchor="middle" ${F} font-size="28" fill="#0b4f45">${a}<tspan fill="#4c8be6">${b}</tspan></text>
        <text x="400" y="${y + 10}" text-anchor="middle" ${F} font-size="34" fill="#e25d3f">≠</text>
        <rect x="440" y="${y - 44}" width="270" height="78" rx="18" fill="#fff" stroke="#e8832f" stroke-width="3"/><text x="490" y="${y + 8}" text-anchor="middle" ${F} font-size="34" fill="#e8832f">${n2}</text><text x="605" y="${y + 6}" text-anchor="middle" ${F} font-size="28" fill="#0b4f45">${c}<tspan fill="#e8832f">ty</tspan></text></g>`;
      return lsSvg(`${lsLabel(400, 36, '⚠️ Dikkat! teen ≠ ty', 0)}
      ${pair(115, 13, 'thir', 'teen', 30, 'thir', 1)}${pair(210, 14, 'four', 'teen', 40, 'for', 2)}${pair(305, 15, 'fif', 'teen', 50, 'fif', 3)}
      ${say(275, 400, 'forty', '40 = kırk', 4, { fs: 30, mark: 'ok' })}${say(525, 400, 'fourty', '', 4, { fs: 30, color: '#e25d3f', mark: 'no', cls: 'ls-pop ls-d1' })}
      <g ${lsStep(4, 'ls-d2')}>${lsCross(525, 394, 110)}</g>`);
    },

    'ing-classroom-rules-practice': () => lsSvg(`${lsLabel(400, 40, '🎤 Sen de söyle!', 0)}
      <g ${lsStep(0, 'ls-pop')}>${lsEmoji(90, 108, '🚪', 50)}<text x="90" y="160" text-anchor="middle" class="ls-small">İzin iste</text></g>
      ${say(450, 115, 'May I come in?', 'Girebilir miyim?', 1)}
      <g ${lsStep(2, 'ls-pop')}>${eraser(90, 228)}<text x="90" y="280" text-anchor="middle" class="ls-small">Rica et</text></g>
      ${say(450, 235, 'Give me the eraser, please.', 'Bana silgiyi ver, lütfen.', 3)}
      <g ${lsStep(4, 'ls-pop')}>${lsEmoji(90, 348, '😊', 50)}<text x="90" y="400" text-anchor="middle" class="ls-small">Teşekkür et</text></g>
      ${say(450, 355, 'Thank you.', 'Teşekkür ederim.', 5)}`),

    'ing-classroom-rules-summary': () => lsSummary([['✋', 'Raise your hand.|Be quiet, please.'], ['📏', 'The ruler, please.|Here you are.'], ['🚪', 'May I come in?|Yes, you can.'], ['🔢', 'ten, twenty … fifty|thirteen ≠ thirty']], 'Hazırsan mini teste geçelim!'),
  });
}
