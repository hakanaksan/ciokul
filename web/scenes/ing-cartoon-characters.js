/* Scenes for the video lesson "Çizgi Film Kahramanları: Neler Yapabilir?". Loaded when the lesson opens (see loadLessonScenes in lessons.js). */
{
  const F = 'font-family="Segoe UI,Arial,sans-serif" font-weight="800"';
  // Rough widths of bold English text (font size fs) and of Turkish ls-small text, for sizing cards.
  const enW = (t, fs) => [...t].reduce((w, c) => w + fs * (/[mwMW]/.test(c) ? 0.9 : /[A-Z]/.test(c) ? 0.68 : /[ijlI.,:;'!]/.test(c) ? 0.3 : /[frt ]/.test(c) ? 0.4 : /[a-z0-9?]/.test(c) ? 0.58 : 1), 0);
  const trW = t => [...t].reduce((w, c) => w + (c === ' ' ? 5 : c !== c.toLocaleLowerCase('tr') ? 12 : 9.4), 0);
  const card = (x, y, en, tr, fs, color, extra = '') => {
    const w = Math.round(Math.max(enW(en, fs), tr ? trW(tr) : 0) + 44), top = Math.round(y - fs * 0.78 - 14), bottom = y + (tr ? 38 : 16);
    return { w, bottom, svg: `<rect x="${x - w / 2}" y="${top}" width="${w}" height="${bottom - top}" rx="18" fill="#fff" stroke="${color}" stroke-width="3"/>${typeof extra === 'function' ? extra(w, bottom) : extra}<text x="${x}" y="${y}" text-anchor="middle" ${F} font-size="${fs}" fill="#0b4f45">${en}</text>${tr ? `<text x="${x}" y="${y + 28}" text-anchor="middle" class="ls-small">${tr}</text>` : ''}` };
  };
  // An English sentence shown big, with its Turkish meaning below.
  const say = (x, y, en, tr, step, { fs = 32, color = '#08796e', cls = 'ls-pop', attrs = '' } = {}) =>
    `<g ${lsStep(step, cls)} ${attrs}>${card(x, y, en, tr, fs, color).svg}</g>`;
  // A speech bubble whose tail points down-left (side -1) or down-right (side 1) to the speaker.
  const bubble = (x, y, en, tr, step, side, color, attrs = '') =>
    `<g ${lsStep(step, 'ls-pop')} ${attrs}>${card(x, y, en, tr, 30, color, (w, bottom) => {
      const bx = x + side * (w / 2 - 46);
      return `<path d="M${bx - 14} ${bottom - 3} L${bx + side * 34} ${bottom + 26} L${bx + 14} ${bottom - 3}" fill="#fff" stroke="${color}" stroke-width="3"/>`;
    }).svg}</g>`;
  const kid = (x, y, s, shirt, hair, girl = false) =>
    (girl ? `<path transform="translate(${x} ${y}) scale(${s})" d="M-21 -64 Q-29 -34 -20 -24 H20 Q29 -34 21 -64 Z" fill="${hair}"/>` : '') + lsKid(x, y, s, shirt, hair) +
    (girl ? `<g transform="translate(${x} ${y}) scale(${s})"><circle cx="9" cy="-79" r="5" fill="#ff6fa8"/><circle cx="19" cy="-77" r="5" fill="#ff6fa8"/><circle cx="14" cy="-78" r="3" fill="#e0408a"/></g>` : '');
  const name = (x, y, t) => `<text x="${x}" y="${y}" text-anchor="middle" class="ls-label">${t}</text>`;
  const ok = (x, y) => `<circle cx="${x}" cy="${y}" r="17" fill="#2eaa83"/><path d="M${x - 8} ${y} l6 7 l11 -13" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  const no = (x, y) => `<circle cx="${x}" cy="${y}" r="17" fill="#e25d3f"/><path d="M${x - 7} ${y - 7} l14 14 M${x + 7} ${y - 7} l-14 14" stroke="#fff" stroke-width="5" stroke-linecap="round"/>`;
  // Super Cat: a cat with a red cape and a star badge; (x, y) is the centre of the face.
  const superCat = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-30 -10 Q0 -22 30 -10 L56 82 Q0 98 -56 82 Z" fill="#e25d3f"/></g>${lsEmoji(x, y, '🐱', 90 * s)}${lsEmoji(x, y + 62 * s, '⭐', 28 * s)}`;
  // An action card: emoji, English words, Turkish meaning; (x, top) is the top centre.
  const act = (x, top, emoji, en, tr, step, i, w = 170, h = 130) => `<g ${lsStep(step, 'ls-rise ls-d' + i)}><rect x="${x - w / 2}" y="${top}" width="${w}" height="${h}" rx="20" class="ls-card"/>
    ${lsEmoji(x, top + (h > 120 ? 42 : 30), emoji, h > 120 ? 46 : 34)}<text x="${x}" y="${top + h - (h > 120 ? 38 : 39)}" text-anchor="middle" ${F} font-size="${h > 120 ? 22 : 21}" fill="#0b4f45">${en}</text>
    <text x="${x}" y="${top + h - (h > 120 ? 14 : 15)}" text-anchor="middle" class="ls-small" style="font-size:15px">${tr}</text></g>`;
  const ZEYNEP = [90, 360], MAX = [710, 360];

  Object.assign(LESSON_SCENES, {
    'ing-cartoon-characters-intro': () => lsSvg(`${lsLabel(400, 40, 'Çizgi film kahramanları', 0)}
      <g ${lsStep(0)}><path d="M190 80 L160 58 M270 80 L300 58" stroke="#3d4f63" stroke-width="5" stroke-linecap="round"/><rect x="60" y="80" width="340" height="220" rx="22" fill="#3d4f63"/><rect x="76" y="96" width="308" height="188" rx="12" fill="#bfe6ff"/></g>
      <g ${lsStep(1, 'ls-pop')}>${superCat(230, 175)}</g>
      ${lsLabel(230, 330, 'Süper Kedi', 1)}
      ${lsLabel(600, 120, '☁️ Uçabilir ✓', 1, 'ls-d1')}${lsLabel(600, 180, '🌳 Tırmanabilir ✓', 1, 'ls-d2')}${lsLabel(600, 240, '🌊 Yüzemez ✗', 1, 'ls-d3')}
      ${lsPill(280, 375, '✓ Yapabilirim', '#1f9a73', 2)}${lsPill(520, 375, '✗ Yapamam', '#d9472b', 2, 'ls-d1')}
      ${lsLabel(400, 425, '🎸 ⚽ 🚲 Bunlar kimin?', 3)}`),

    'ing-cartoon-characters-moves': () => lsSvg(`${lsLabel(400, 40, 'Eylemler · Actions', 0)}
      ${[['🦅', 'fly', 'uçmak'], ['🦘', 'jump', 'zıplamak'], ['🏊', 'swim', 'yüzmek'], ['🤿', 'dive', 'dalmak']].map(([e, en, tr], i) => act(121 + i * 186, 75, e, en, tr, 1, i)).join('')}
      ${[['🏃', 'run', 'koşmak'], ['🧗', 'climb a tree', 'ağaca tırmanmak'], ['📦', 'carry', 'taşımak'], ['⚾', 'catch', 'yakalamak']].map(([e, en, tr], i) => act(121 + i * 186, 225, e, en, tr, 2, i)).join('')}
      ${lsLabel(400, 405, '💪 Süper kahramanlar yapabilir!', 3)}`),

    'ing-cartoon-characters-hobbies': () => lsSvg(`${lsLabel(400, 38, 'Oyunlar ve hobiler', 0)}
      ${[['🎸', 'play the guitar', 'gitar çalmak'], ['🎹', 'play the piano', 'piyano çalmak'], ['🧩', 'do puzzles', 'yapboz yapmak']].map(([e, en, tr], i) => act(180 + i * 220, 70, e, en, tr, 1, i, 200, 105)).join('')}
      ${[['🐎', 'ride a horse', 'ata binmek'], ['🚲', 'ride a bike', 'bisiklete binmek'], ['📷', 'take pictures', 'fotoğraf çekmek']].map(([e, en, tr], i) => act(180 + i * 220, 185, e, en, tr, 2, i, 200, 105)).join('')}
      ${[['🚗', 'drive a car', 'araba sürmek'], ['🗣️', 'speak English', 'İngilizce konuşmak']].map(([e, en, tr], i) => act(290 + i * 220, 300, e, en, tr, 3, i, 200, 105)).join('')}`),

    'ing-cartoon-characters-can': () => lsSvg(`
      ${lsPill(200, 50, '✓ yapabilmek', '#1f9a73', 0)}<g ${lsStep(0, 'ls-pop ls-d1')}>${lsEmoji(200, 135, '🏊', 70)}</g>
      ${say(200, 235, 'I can swim.', 'Ben yüzebilirim.', 1)}
      ${lsPill(600, 50, '✗ yapamamak', '#d9472b', 2)}<g ${lsStep(2, 'ls-pop ls-d1')}>${lsEmoji(560, 135, '🧒', 66)}${lsEmoji(645, 125, '🦅', 52)}${lsCross(645, 125, 60)}</g>
      ${say(600, 235, "I can't fly.", "Ben uçamam. (can't = cannot)", 3)}
      ${lsLabel(400, 320, 'can + eylem: hiç değişmez!', 4)}
      ${say(400, 392, "She can ride a bike. He can't drive a car.", 'O bisiklete binebilir. O araba süremez.', 5, { fs: 26 })}`),

    'ing-cartoon-characters-but': () => lsSvg(`${lsPill(400, 45, 'ama = but', '#5b7fa6', 0)}
      <g ${lsStep(1, 'ls-pop')}>${lsEmoji(320, 118, '🚲', 44)}${ok(355, 100)}${lsEmoji(470, 118, '🐎', 44)}${no(505, 100)}</g>
      ${say(400, 200, "I can ride a bike, but I can't ride a horse.", 'Bisiklete binebilirim ama ata binemem.', 1, { fs: 28 })}
      <g ${lsStep(2, 'ls-pop')}>${superCat(110, 315, 0.7)}</g>${lsLabel(125, 420, 'it = o (hayvan)', 2)}
      <g ${lsStep(3, 'ls-pop')}>${lsEmoji(400, 268, '☁️', 34)}${ok(430, 255)}${lsEmoji(560, 268, '🌊', 34)}${no(590, 255)}</g>
      ${say(470, 330, "Super Cat can fly, but it can't swim.", 'Süper Kedi uçabilir ama yüzemez.', 3, { fs: 26 })}`),

    'ing-cartoon-characters-can-you': () => lsSvg(`${kid(ZEYNEP[0], ZEYNEP[1], 1, '#9b59b6', '#3b2416', true)}${kid(MAX[0], MAX[1], 1, '#2eaa83', '#c46a2b')}${name(ZEYNEP[0], 435, 'Zeynep')}${name(MAX[0], 435, 'Max')}
      ${lsPill(400, 425, 'Can + you + eylem?', '#5b7fa6', 0)}
      ${bubble(320, 80, 'Can you play the piano?', 'Piyano çalabilir misin?', 1, -1, '#9b59b6', 'data-hide="3"')}
      ${bubble(480, 190, 'Yes, I can.', 'Evet, çalabilirim.', 2, 1, '#2eaa83', 'data-hide="3"')}
      <g ${lsStep(3, 'ls-pop')}><circle cx="640" cy="296" r="22" fill="#fff" stroke="#2eaa83" stroke-width="3"/><text x="640" y="306" text-anchor="middle" ${F} font-size="28" fill="#2eaa83">?</text></g>
      ${bubble(480, 80, 'Can you ride a horse?', 'Ata binebilir misin?', 4, 1, '#2eaa83')}
      ${bubble(320, 190, "No, I can't.", 'Hayır, binemem.', 5, -1, '#9b59b6')}`),

    'ing-cartoon-characters-mine': () => lsSvg(`${lsLabel(400, 40, 'my · your · his · her', 0)}
      ${[['🙋', '🎸', 'This is my guitar.', 'Bu benim gitarım.'], ['👉', '⚽', 'This is your ball.', 'Bu senin topun.'], ['👦', '🚲', 'This is his bike.', 'Bu onun bisikleti.'], ['👧', '🪁', 'This is her kite.', 'Bu onun uçurtması.']].map(([who, what, en, tr], i) => {
        const x = i % 2 ? 600 : 200, y = i < 2 ? 95 : 260;
        return `<g ${lsStep(i + 1, 'ls-pop')}>${lsEmoji(x - 35, y, who, 46)}${lsEmoji(x + 35, y, what, 46)}</g>${say(x, y + 80, en, tr, i + 1, { fs: 30, cls: 'ls-rise' })}`; }).join('')}
      ${lsPill(230, 420, '👦 his = onun (erkek)', '#3f7fd6', 5)}${lsPill(570, 420, '👧 her = onun (kız)', '#d4589a', 5, 'ls-d1')}`),

    'ing-cartoon-characters-whose': () => lsSvg(`
      <g ${lsStep(0, 'ls-pop')}>${lsEmoji(130, 140, '🚲', 80)}</g>${lsLabel(130, 225, 'Kimin?', 0)}
      ${say(470, 110, 'Whose bike is this?', 'Bu bisiklet kimin?', 1, { fs: 30 })}
      ${lsPill(470, 190, "Ali + 's = Ali's", '#5b7fa6', 2)}
      <g ${lsStep(3, 'ls-pop')}>${lsEmoji(228, 135, '👦', 54)}<text x="228" y="190" text-anchor="middle" class="ls-small">Ali</text></g>
      ${say(470, 260, "This is Ali's bike.", "Bu Ali'nin bisikleti.", 3, { fs: 30 })}
      <g ${lsStep(4, 'ls-pop')}>${lsEmoji(130, 345, '📚', 60)}</g>${lsLabel(130, 415, 'these = bunlar', 4)}
      <g ${lsStep(5, 'ls-pop')}>${lsEmoji(215, 345, '👧', 48)}</g>
      ${say(480, 375, 'These are her books.', 'Bunlar onun kitapları. (kız)', 5, { fs: 30 })}`),

    'ing-cartoon-characters-careful': () => lsSvg(`${lsLabel(400, 40, '⚠️ Dikkat!', 0)}
      ${say(220, 115, 'He can swims.', '', 1, { fs: 28, color: '#e25d3f' })}<g ${lsStep(1, 'ls-pop ls-d1')}>${no(330, 92)}</g>
      ${say(580, 115, 'He cans swim.', '', 1, { fs: 28, color: '#e25d3f', cls: 'ls-pop ls-d1' })}<g ${lsStep(1, 'ls-pop ls-d2')}>${no(690, 92)}</g>
      ${say(400, 205, 'He can swim.', 'O yüzebilir.', 2)}<g ${lsStep(2, 'ls-pop ls-d1')}>${ok(548, 190)}</g>
      ${say(400, 295, 'Can you swim? Yes, I do.', '', 3, { fs: 28, color: '#e25d3f' })}<g ${lsStep(3, 'ls-pop ls-d1')}>${no(600, 272)}</g>
      ${say(400, 380, 'Can you swim? Yes, I can.', 'Yüzebilir misin? Evet, yüzebilirim.', 4, { fs: 30 })}<g ${lsStep(4, 'ls-pop ls-d1')}>${ok(625, 362)}</g>`),

    'ing-cartoon-characters-practice': () => lsSvg(`${lsLabel(400, 40, '🎤 Sen de söyle!', 0)}
      <g ${lsStep(0, 'ls-pop')}>${lsEmoji(90, 108, '📷', 50)}<text x="90" y="160" text-anchor="middle" class="ls-small">Anlat</text></g>
      ${say(450, 115, 'I can take pictures.', 'Fotoğraf çekebilirim.', 1)}
      <g ${lsStep(2, 'ls-pop')}>${lsEmoji(90, 228, '🗣️', 50)}<text x="90" y="280" text-anchor="middle" class="ls-small">Sor</text></g>
      ${say(450, 235, 'Can you speak English?', 'İngilizce konuşabilir misin?', 3)}
      <g ${lsStep(4, 'ls-pop')}>${lsEmoji(90, 348, '🎸', 50)}<text x="90" y="400" text-anchor="middle" class="ls-small">Göster</text></g>
      ${say(450, 355, 'This is my guitar.', 'Bu benim gitarım.', 5)}`),

    'ing-cartoon-characters-summary': () => lsSummary([['💪', "I can swim.|I can't fly."], ['❓', 'Can you dive?|Yes, I can.'], ['🎸', 'This is my guitar.|his · her · your'], ['🚲', "Whose bike is this?|This is Ali's bike."]], 'Hazırsan mini teste geçelim!'),
  });
}
