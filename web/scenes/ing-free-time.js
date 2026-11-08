/* Scenes for the video lesson "Boş Zaman: Neleri Severiz?". Loaded when the lesson opens (see loadLessonScenes in lessons.js). */
{
  const F = 'font-family="Segoe UI,Arial,sans-serif" font-weight="800"';
  // Rough widths of bold English text (font size fs) and of Turkish ls-small text, for sizing cards.
  const enW = (t, fs) => [...t].reduce((w, c) => w + fs * (/[mwMW]/.test(c) ? 0.9 : /[A-Z]/.test(c) ? 0.68 : /[ijlI.,:;'!]/.test(c) ? 0.3 : /[frt ]/.test(c) ? 0.4 : /[a-z0-9?]/.test(c) ? 0.58 : 1), 0);
  const trW = t => [...t].reduce((w, c) => w + (c === ' ' ? 5 : c !== c.toLocaleLowerCase('tr') ? 12 : 9.4), 0);
  const card = (x, y, en, tr, fs, color, extra = '') => {
    const w = Math.round(Math.max(enW(en, fs), tr ? trW(tr) : 0) + 44), top = Math.round(y - fs * 0.78 - 14), bottom = y + (tr ? 38 : 16);
    return { w, top, bottom, svg: `<rect x="${x - w / 2}" y="${top}" width="${w}" height="${bottom - top}" rx="18" fill="#fff" stroke="${color}" stroke-width="3"/>${typeof extra === 'function' ? extra(w, bottom) : extra}<text x="${x}" y="${y}" text-anchor="middle" ${F} font-size="${fs}" fill="#0b4f45">${en}</text>${tr ? `<text x="${x}" y="${y + 28}" text-anchor="middle" class="ls-small">${tr}</text>` : ''}` };
  };
  const ok = (x, y) => `<circle cx="${x}" cy="${y}" r="17" fill="#2eaa83"/><path d="M${x - 8} ${y} l6 7 l11 -13" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  const no = (x, y) => `<circle cx="${x}" cy="${y}" r="17" fill="#e25d3f"/><path d="M${x - 7} ${y - 7} l14 14 M${x + 7} ${y - 7} l-14 14" stroke="#fff" stroke-width="5" stroke-linecap="round"/>`;
  // An English sentence shown big, with its Turkish meaning below; mark 'ok' or 'no' adds a badge on the right edge.
  const say = (x, y, en, tr, step, { fs = 32, color = '#08796e', cls = 'ls-pop', attrs = '', mark = '' } = {}) => {
    const c = card(x, y, en, tr, fs, color);
    return `<g ${lsStep(step, cls)} ${attrs}>${c.svg}${mark === 'ok' ? ok(x + c.w / 2 - 6, c.top + 6) : mark === 'no' ? no(x + c.w / 2 - 6, c.top + 6) : ''}</g>`;
  };
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
  const marbles = (x, y) => [[-18, 5, '#4c8be6'], [0, -7, '#e25d3f'], [18, 5, '#2eaa83']].map(([dx, dy, c]) =>
    `<circle cx="${x + dx}" cy="${y + dy}" r="10" fill="${c}"/><circle cx="${x + dx - 3}" cy="${y + dy - 3}" r="3" fill="#fff" opacity=".8"/>`).join('');
  // An activity card (230 x 120): picture, English words, Turkish meaning; (x, top) is the top centre.
  const act = (x, top, icon, en, tr, step, i) => `<g ${lsStep(step, 'ls-rise ls-d' + i)}><rect x="${x - 115}" y="${top}" width="230" height="120" rx="20" class="ls-card"/>
    ${typeof icon === 'function' ? icon(x, top + 32) : lsEmoji(x, top + 32, icon, 36)}<text x="${x}" y="${top + 81}" text-anchor="middle" ${F} font-size="21" fill="#0b4f45">${en}</text>
    <text x="${x}" y="${top + 105}" text-anchor="middle" class="ls-small" style="font-size:15px">${tr}</text></g>`;
  const MERT = [90, 360], LILY = [710, 360];
  const kids = () => kid(MERT[0], MERT[1], 1, '#e8832f', '#3b2416') + kid(LILY[0], LILY[1], 1, '#d4589a', '#e8b84a', true) + name(MERT[0], 435, 'Mert') + name(LILY[0], 435, 'Lily');

  Object.assign(LESSON_SCENES, {
    'ing-free-time-intro': () => lsSvg(`<circle cx="720" cy="70" r="34" fill="#ffcf4d" class="ls-sun"/><rect x="0" y="330" width="800" height="120" fill="#9bd27d"/>
      ${lsLabel(400, 40, 'Boş zaman · Free time', 0)}
      ${kid(170, 300, 1, '#4c8be6', '#5a3b22', true)}${kid(400, 300, 1, '#e8832f', '#3b2416')}${kid(630, 300, 1, '#2eaa83', '#c46a2b', true)}
      ${[['📖', 170], ['⚽', 400], ['🎨', 630]].map(([e, x], i) => `<g ${lsStep(1, 'ls-pop ls-d' + i)}>${lsEmoji(x, 175, e, 50)}</g>`).join('')}
      ${lsPill(280, 375, '😊 Severim', '#1f9a73', 2)}${lsPill(520, 375, '🙁 Sevmem', '#d9472b', 2, 'ls-d1')}
      ${lsLabel(400, 425, '💬 Tekrar söyler misin?', 3)}`),

    'ing-free-time-activities': () => lsSvg(`${lsLabel(400, 40, 'Etkinlikler · Activities', 0)}
      ${[['🏊', 'swimming', 'yüzme'], ['🎨', 'drawing', 'resim yapma'], ['📚', 'reading comics', 'çizgi roman okuma']].map(([e, en, tr], i) => act(160 + i * 240, 70, e, en, tr, 1, i)).join('')}
      ${[['🚲', 'riding a bike', 'bisiklete binme'], ['🪁', 'flying a kite', 'uçurtma uçurma'], ['📺', 'watching cartoons', 'çizgi film izleme']].map(([e, en, tr], i) => act(160 + i * 240, 205, e, en, tr, 2, i)).join('')}
      ${lsLabel(400, 380, 'swim ➜ swimming · read ➜ reading', 3)}`),

    'ing-free-time-games': () => lsSvg(`${lsLabel(400, 40, 'Oyunlar · Games', 0)}
      ${[['♟️', 'playing chess', 'satranç oynama'], ['⚽', 'playing football', 'futbol oynama'], ['🏓', 'playing table tennis', 'masa tenisi oynama']].map(([e, en, tr], i) => act(160 + i * 240, 80, e, en, tr, 1, i)).join('')}
      ${[[marbles, 'playing with marbles', 'misket oynama'], ['🔤', 'learning English', 'İngilizce öğrenme']].map(([e, en, tr], i) => act(280 + i * 240, 230, e, en, tr, 2, i)).join('')}
      ${lsPill(400, 400, 'playing = oynama', '#5b7fa6', 0)}`),

    'ing-free-time-like': () => lsSvg(`${lsLabel(400, 38, 'Severim · Sevmem', 0)}
      <g ${lsStep(0, 'ls-pop')}>${lsEmoji(90, 105, '🙂', 60)}</g>
      ${say(450, 105, 'I like swimming.', 'Yüzmeyi severim.', 1)}
      <g ${lsStep(2, 'ls-pop')}>${lsEmoji(90, 210, '😍', 60)}</g>
      ${say(450, 210, 'I love reading comics.', 'Çizgi roman okumayı çok severim.', 3)}
      <g ${lsStep(4, 'ls-pop')}>${lsEmoji(90, 330, '🙁', 60)}<text x="90" y="392" text-anchor="middle" class="ls-small">2 yol</text></g>
      ${say(450, 300, 'I dislike playing chess.', '', 5, { fs: 28 })}
      ${say(450, 360, "I don't like playing chess.", '', 5, { fs: 28, cls: 'ls-pop ls-d2' })}
      <g ${lsStep(5, 'ls-d3')}><text x="450" y="408" text-anchor="middle" class="ls-small">İkisi de: Satranç oynamayı sevmem.</text></g>`),

    'ing-free-time-but': () => lsSvg(`${lsPill(400, 45, 'ama = but', '#5b7fa6', 0)}
      ${name(90, 112, 'Elif')}${kid(90, 200, 0.9, '#4c8be6', '#5a3b22', true)}
      ${say(460, 150, "I like drawing, but I don't like singing.", 'Resim yapmayı severim ama şarkı söylemeyi sevmem.', 1, { fs: 24 })}
      <g ${lsStep(1, 'ls-pop ls-d2')}>${lsEmoji(400, 222, '🎨', 34)}${ok(432, 208)}${lsEmoji(560, 222, '🎤', 34)}${no(592, 208)}</g>
      <g ${lsStep(2, 'ls-rise')}>${name(90, 308, 'Kerem')}${kid(90, 395, 0.9, '#e8832f', '#3b2416')}</g>
      ${say(460, 345, 'I love playing football, but I dislike swimming.', 'Futbol oynamayı çok severim ama yüzmeyi sevmem.', 3, { fs: 24 })}
      <g ${lsStep(3, 'ls-pop ls-d2')}>${lsEmoji(400, 415, '⚽', 34)}${ok(432, 401)}${lsEmoji(560, 415, '🏊', 34)}${no(592, 401)}</g>`),

    'ing-free-time-do-you': () => lsSvg(`${kids()}
      ${lsPill(400, 425, 'Do you like + etkinlik?', '#5b7fa6', 0)}
      ${bubble(320, 80, 'Do you like playing chess?', 'Satranç oynamayı sever misin?', 1, -1, '#e8832f', 'data-hide="3"')}
      ${bubble(480, 190, 'Yes, I do.', 'Evet, severim.', 2, 1, '#d4589a', 'data-hide="3"')}
      <g ${lsStep(3, 'ls-pop')}><circle cx="640" cy="296" r="22" fill="#fff" stroke="#d4589a" stroke-width="3"/><text x="640" y="306" text-anchor="middle" ${F} font-size="28" fill="#d4589a">?</text></g>
      ${bubble(480, 80, 'Do you like watching cartoons?', 'Çizgi film izlemeyi sever misin?', 4, 1, '#d4589a')}
      ${bubble(320, 190, "No, I don't.", 'Hayır, sevmem.', 5, -1, '#e8832f')}`),

    'ing-free-time-pardon': () => lsSvg(`${kid(100, 330, 1.2, '#e8832f', '#3b2416')}
      <g ${lsStep(0, 'ls-pop')}>${lsEmoji(100, 170, '❓', 44)}${lsEmoji(175, 215, '💨', 40)}</g>
      ${say(470, 95, 'Pardon me?', 'Efendim?', 1, { fs: 30 })}
      ${say(470, 180, 'Say that again, please.', 'Lütfen tekrar söyle.', 2, { fs: 30 })}
      ${say(470, 265, 'Can you say that again, please?', 'Tekrar söyleyebilir misin, lütfen?', 3, { fs: 30 })}
      <g ${lsStep(4, 'ls-pop')}><text x="250" y="402" text-anchor="middle" font-size="34">🐇 ➜ 🐢</text></g>
      ${say(470, 390, 'Slowly, please.', 'Yavaş, lütfen.', 5, { fs: 30 })}`),

    'ing-free-time-dialogue': () => lsSvg(`${kids()}
      ${lsPill(400, 425, '👂 Mert iyi duyamıyor', '#5b7fa6', 0)}
      ${bubble(480, 70, 'Do you like riding a bike?', 'Bisiklete binmeyi sever misin?', 1, 1, '#d4589a')}
      ${bubble(320, 155, 'Pardon me?', 'Efendim?', 2, -1, '#e8832f')}
      ${bubble(480, 240, 'Do you like riding a bike?', 'Bisiklete binmeyi sever misin?', 3, 1, '#d4589a')}
      ${bubble(320, 325, 'Yes, I do. I love it.', 'Evet, severim. Çok severim.', 4, -1, '#e8832f')}`),

    'ing-free-time-careful': () => lsSvg(`${lsLabel(400, 40, '⚠️ Dikkat!', 0)}
      ${say(400, 115, 'I like swim.', '', 1, { fs: 28, color: '#e25d3f', mark: 'no' })}
      ${say(400, 205, 'I like swimming.', 'Yüzmeyi severim.', 2, { mark: 'ok' })}
      ${say(400, 295, 'Do you like swimming? Yes, I can.', '', 3, { fs: 26, color: '#e25d3f', mark: 'no' })}
      ${say(400, 380, 'Do you like swimming? Yes, I do.', 'Yüzmeyi sever misin? Evet, severim.', 4, { fs: 28, mark: 'ok' })}`),

    'ing-free-time-practice': () => lsSvg(`${lsLabel(400, 40, '🎤 Sen de söyle!', 0)}
      <g ${lsStep(0, 'ls-pop')}>${lsEmoji(90, 108, '🙋', 50)}<text x="90" y="160" text-anchor="middle" class="ls-small">Sor</text></g>
      ${say(450, 115, 'What do you like doing?', 'Ne yapmayı seversin?', 1)}
      <g ${lsStep(2, 'ls-pop')}>${lsEmoji(90, 228, '🪁', 50)}<text x="90" y="280" text-anchor="middle" class="ls-small">Sevdiğin</text></g>
      ${say(450, 235, 'I like flying a kite.', 'Uçurtma uçurmayı severim.', 3)}
      <g ${lsStep(4, 'ls-pop')}>${lsEmoji(90, 348, '📺', 50)}<text x="90" y="400" text-anchor="middle" class="ls-small">Sevmediğin</text></g>
      ${say(450, 355, "I don't like watching TV.", 'Televizyon izlemeyi sevmem.', 5)}`),

    'ing-free-time-summary': () => lsSummary([['😊', 'I like swimming.|I love reading comics.'], ['🙁', "I dislike singing.|I don't like singing."], ['❓', "Do you like drawing?|Yes, I do. No, I don't."], ['👂', 'Pardon me?|Slowly, please.']], 'Hazırsan mini teste geçelim!'),
  });
}
