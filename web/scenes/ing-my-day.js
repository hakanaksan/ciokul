/* Scenes for the video lesson "Günüm: Günlük İşler ve Saatler". Loaded when the lesson opens (see loadLessonScenes in lessons.js). */
{
  const F = 'font-family="Segoe UI,Arial,sans-serif" font-weight="800"';
  // Rough widths of bold English text (font size fs) and of Turkish ls-small text, for sizing cards.
  const enW = (t, fs) => [...t].reduce((w, c) => w + fs * (/[mwMW]/.test(c) ? 0.9 : /[A-Z]/.test(c) ? 0.68 : /[ijlI.,:;'!-]/.test(c) ? 0.3 : /[frt ]/.test(c) ? 0.4 : /[a-z0-9?]/.test(c) ? 0.58 : 1), 0);
  const trW = t => [...t].reduce((w, c) => w + (c === ' ' ? 5 : c !== c.toLocaleLowerCase('tr') ? 12 : 9.4), 0);
  const card = (x, y, en, tr, fs, color, extra = '') => {
    const w = Math.round(Math.max(enW(en, fs), tr ? trW(tr) : 0) + 44), top = Math.round(y - fs * 0.78 - 14), bottom = y + (tr ? 38 : 16);
    return { w, top, bottom, svg: `<rect x="${x - w / 2}" y="${top}" width="${w}" height="${bottom - top}" rx="18" fill="#fff" stroke="${color}" stroke-width="3"/>${typeof extra === 'function' ? extra(w, bottom) : extra}<text x="${x}" y="${y}" text-anchor="middle" ${F} font-size="${fs}" fill="#0b4f45">${en}</text>${tr ? `<text x="${x}" y="${y + 28}" text-anchor="middle" class="ls-small">${tr}</text>` : ''}` };
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
  const MERT = [90, 360], LILY = [710, 360];
  const kids = () => kid(MERT[0], MERT[1], 1, '#e8832f', '#3b2416') + kid(LILY[0], LILY[1], 1, '#d4589a', '#e8b84a', true) + name(MERT[0], 435, 'Mert') + name(LILY[0], 435, 'Lily');
  // An activity card (w x h): picture, English words (shrunk to fit), Turkish meaning; (x, top) is the top centre.
  const act = (x, top, w, h, icon, en, tr, step, i) => {
    const fs = Math.min(21, Math.floor((w - 16) / enW(en, 1)));
    return `<g ${lsStep(step, 'ls-rise ls-d' + i)}><rect x="${x - w / 2}" y="${top}" width="${w}" height="${h}" rx="18" class="ls-card"/>
    ${lsEmoji(x, top + 34, icon, 36)}<text x="${x}" y="${top + h - 34}" text-anchor="middle" ${F} font-size="${fs}" fill="#0b4f45">${en}</text>
    <text x="${x}" y="${top + h - 12}" text-anchor="middle" class="ls-small" style="font-size:15px">${tr}</text></g>`;
  };
  // A clock face (numbers 1-12) and its hands for h:m; hands can carry their own data-step / data-hide.
  const face = (cx, cy, r) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff" stroke="#5b7fa6" stroke-width="${Math.max(4, r / 18)}"/>` +
    Array.from({ length: 12 }, (_, i) => {
      const a = (i + 1) * Math.PI / 6;
      return `<text x="${(cx + r * 0.78 * Math.sin(a)).toFixed(1)}" y="${(cy - r * 0.78 * Math.cos(a) + r * 0.08).toFixed(1)}" text-anchor="middle" ${F} font-size="${Math.round(r * 0.2)}" fill="#3d4f63">${i + 1}</text>`;
    }).join('') + `<circle cx="${cx}" cy="${cy}" r="${Math.max(5, r / 20)}" fill="#3d4f63"/>`;
  const hands = (cx, cy, r, h, m, attrs = '') => {
    const ha = ((h % 12) + m / 60) * Math.PI / 6, ma = m * Math.PI / 30;
    const end = (a, l) => `${(cx + l * Math.sin(a)).toFixed(1)} ${(cy - l * Math.cos(a)).toFixed(1)}`;
    return `<g ${attrs}><path d="M${cx} ${cy} L${end(ma, r * 0.72)}" stroke="#e25d3f" stroke-width="${Math.max(3, r / 30)}" stroke-linecap="round"/><path d="M${cx} ${cy} L${end(ha, r * 0.48)}" stroke="#1b2a35" stroke-width="${Math.max(5, r / 16)}" stroke-linecap="round"/><circle cx="${cx}" cy="${cy}" r="${Math.max(5, r / 20)}" fill="#3d4f63"/></g>`;
  };

  Object.assign(LESSON_SCENES, {
    'ing-my-day-intro': () => lsSvg(`<circle cx="735" cy="300" r="34" fill="#ffcf4d" class="ls-sun"/>
      ${[['⏰', 'uyan'], ['🍳', 'kahvaltı'], ['🏫', 'okul']].map(([e, t], i) => `<g ${lsStep(0, 'ls-rise ls-d' + i)}><rect x="${95 + i * 220}" y="60" width="170" height="140" rx="22" class="ls-card"/>${lsEmoji(180 + i * 220, 115, e, 56)}<text x="${180 + i * 220}" y="180" text-anchor="middle" class="ls-small">${t}</text></g>`).join('')}
      <g ${lsStep(0, 'ls-in ls-d3')}><text x="290" y="140" text-anchor="middle" font-size="30" fill="#5b7fa6">➜</text><text x="510" y="140" text-anchor="middle" font-size="30" fill="#5b7fa6">➜</text></g>
      ${lsPill(400, 245, 'Her gün aynı sırayla: günlük işler', '#5b7fa6', 1)}
      ${lsLabel(400, 300, '🌞 My Day · Günüm', 2)}
      <g ${lsStep(3, 'ls-pop')}>${face(200, 375, 58)}${hands(200, 375, 58, 7, 0)}</g>
      ${lsPill(530, 375, 'Monday, Tuesday …', '#2eaa83', 3, 'ls-d1')}`),

    'ing-my-day-morning': () => lsSvg(`${lsLabel(400, 34, '🌅 Sabah · In the morning', 0)}
      ${[['⏰', 'wake up', 'uyanmak', 1], ['🛏️', 'get up', 'kalkmak', 1], ['💧', 'wash my face', 'yüzümü yıkamak', 2], ['🦷', 'brush my teeth', 'dişlerimi fırçalamak', 2]].map(([e, en, tr, s], i) => act(110 + i * 193, 62, 180, 125, e, en, tr, s, i % 2)).join('')}
      ${[['👕', 'get dressed', 'giyinmek', 3], ['🍳', 'have breakfast', 'kahvaltı yapmak', 3], ['🏫', 'go to school', 'okula gitmek', 4]].map(([e, en, tr, s], i) => act(207 + i * 193, 202, 180, 125, e, en, tr, s, i % 2)).join('')}
      ${lsPill(400, 385, 'I = Ben (hep büyük harf)', '#5b7fa6', 5)}`),

    'ing-my-day-later': () => lsSvg(`${lsLabel(400, 34, '🌇 Okuldan sonra ve akşam', 0)}
      ${[['🥪', 'have lunch', 'öğle yemeği yemek', 1], ['👫', 'meet my friends', 'arkadaşlarımla buluşmak', 1], ['🎠', 'go to the playground', 'oyun parkına gitmek', 2], ['📝', 'do my homework', 'ödevimi yapmak', 2]].map(([e, en, tr, s], i) => act(110 + i * 193, 62, 182, 125, e, en, tr, s, i % 2)).join('')}
      ${[['📺', 'watch TV', 'televizyon izlemek', 3], ['🍽️', 'have dinner', 'akşam yemeği yemek', 3], ['🚿', 'have a shower', 'duş almak', 4], ['🛏️', 'go to bed', 'yatmak', 4]].map(([e, en, tr, s], i) => act(110 + i * 193, 212, 182, 125, e, en, tr, s, i % 2)).join('')}
      <g ${lsStep(4, 'ls-pop ls-d2')}><circle cx="720" cy="395" r="30" fill="#3d4f63"/><circle cx="732" cy="385" r="26" fill="url(#lsSky)"/><text x="400" y="400" text-anchor="middle" class="ls-small">Sabahtan geceye günlük işler</text></g>`),

    'ing-my-day-parts': () => {
      const parts = [['🌅', 'in the morning', 'sabah', 1, '#4c8be6'], ['☀️', 'at noon', 'öğle', 3, '#e25d3f'], ['🌤️', 'in the afternoon', 'öğleden sonra', 1, '#4c8be6'], ['🌆', 'in the evening', 'akşam', 1, '#4c8be6'], ['🌙', 'at night', 'gece', 3, '#e25d3f']];
      return lsSvg(`<rect x="20" y="20" width="760" height="170" rx="22" fill="#fff" opacity=".55"/>
        ${parts.map(([e, en, tr, s, c], i) => `<g ${lsStep(s, 'ls-rise ls-d' + (i % 3))}>${lsEmoji(85 + i * 157.5, 70, e, 46)}<text x="${85 + i * 157.5}" y="132" text-anchor="middle" ${F} font-size="17" fill="${c}">${en}</text><text x="${85 + i * 157.5}" y="160" text-anchor="middle" class="ls-small">${tr}</text></g>`).join('')}
        <g ${lsStep(0, 'ls-in')}><text x="400" y="215" text-anchor="middle" class="ls-small">Günün bölümleri</text></g>
        ${lsPill(400, 250, 'öğle ve gece: at', '#e25d3f', 2)}
        ${say(400, 315, 'I have breakfast in the morning.', 'Sabah kahvaltı yaparım.', 5, { fs: 26 })}
        ${say(400, 400, 'I go to bed at night.', 'Gece yatarım.', 5, { fs: 26, cls: 'ls-pop ls-d2' })}
        <g ${lsStep(4, 'ls-pop')} data-hide="5">${lsEmoji(400, 340, '✍️', 50)}</g>`);
    },

    'ing-my-day-oclock': () => lsSvg(`${face(210, 235, 150)}
      ${hands(210, 235, 150, 7, 0, 'data-hide="4"')}
      ${hands(210, 235, 150, 12, 0, lsStep(4, 'ls-pop'))}
      ${say(590, 85, 'What time is it?', 'Saat kaç?', 1)}
      ${lsPill(590, 175, 'kısa kol ➜ saat', '#1b2a35', 2)}${lsPill(590, 222, 'uzun kol ➜ dakika', '#e25d3f', 2, 'ls-d1')}
      ${say(590, 320, "It is seven o'clock.", 'Saat yedi.', 3, { fs: 30, attrs: 'data-hide="4"' })}
      <g ${lsStep(4, 'ls-pop')}>${lsEmoji(590, 410, '❓', 40)}</g>
      ${say(590, 320, "It is twelve o'clock.", 'Saat on iki.', 5, { fs: 30 })}`),

    'ing-my-day-half': () => lsSvg(`<path d="M210 235 L210 85 A150 150 0 0 1 210 385 Z" fill="#ffe9a8"/>
      ${face(210, 235, 150).replace('fill="#fff"', 'fill="none"')}
      ${hands(210, 235, 150, 7, 30, 'data-hide="3"')}
      ${hands(210, 235, 150, 8, 30, lsStep(3, 'ls-pop'))}
      ${lsPill(590, 40, 'uzun kol 6 ➜ buçuk', '#e25d3f', 0)}
      ${say(590, 115, 'It is half past seven.', 'Saat yedi buçuk.', 1, { fs: 30, attrs: 'data-hide="3"' })}
      ${lsPill(510, 215, 'half = yarım', '#5b7fa6', 2)}${lsPill(680, 215, 'past = geçe', '#5b7fa6', 2, 'ls-d1')}
      ${lsLabel(590, 300, '🎤 Sen de tekrar et!', 3)}
      ${say(590, 115, 'It is half past eight.', 'Saat sekiz buçuk.', 4, { fs: 30 })}`),

    'ing-my-day-what-time': () => lsSvg(`${kids()}
      <g data-hide="3">${lsPill(400, 425, '⏰ Saat kaçta?', '#5b7fa6', 0)}</g>
      ${bubble(480, 70, 'What time do you get up?', 'Saat kaçta kalkarsın?', 1, 1, '#d4589a')}
      ${bubble(320, 155, "I get up at seven o'clock.", 'Saat yedide kalkarım.', 2, -1, '#e8832f')}
      ${lsPill(400, 425, '🌤️ Öğleden sonra', '#5b7fa6', 3)}
      ${bubble(470, 240, 'What do you do in the afternoon?', 'Öğleden sonra ne yaparsın?', 4, 1, '#d4589a')}
      ${bubble(320, 325, 'I go to the playground.', 'Oyun parkına giderim.', 5, -1, '#e8832f')}`),

    'ing-my-day-days': () => {
      const days = [['Monday', 'Pazartesi', 1], ['Tuesday', 'Salı', 1], ['Wednesday', 'Çarşamba', 1], ['Thursday', 'Perşembe', 2], ['Friday', 'Cuma', 2], ['Saturday', 'Cumartesi', 3], ['Sunday', 'Pazar', 3]];
      const pos = i => i < 4 ? [121 + i * 186, 70] : [214 + (i - 4) * 186, 200];
      return lsSvg(`${lsLabel(400, 36, '📅 Haftanın günleri', 0)}
        ${days.map(([en, tr, s], i) => { const [x, top] = pos(i); return `<g ${lsStep(s, 'ls-rise ls-d' + (i % 3))}><rect x="${x - 85}" y="${top}" width="170" height="104" rx="18" fill="#fff" stroke="${i > 4 ? '#e8832f' : '#4c8be6'}" stroke-width="3"/><text x="${x}" y="${top + 52}" text-anchor="middle" ${F} font-size="26" fill="#0b4f45">${en}</text><text x="${x}" y="${top + 82}" text-anchor="middle" class="ls-small">${tr}</text></g>`; }).join('')}
        ${days.map((d, i) => { const [x, top] = pos(i); return `<g ${lsStep(4, 'ls-pop ls-d' + Math.min(i, 5))}><circle cx="${x - 70}" cy="${top + 4}" r="17" fill="#5b7fa6"/><text x="${x - 70}" y="${top + 11}" text-anchor="middle" ${F} font-size="19" fill="#fff">${i + 1}</text></g>`; }).join('')}
        ${lsPill(400, 365, 'Büyük harfle başlar: M, T, W, F, S', '#5b7fa6', 4)}`);
    },

    'ing-my-day-careful': () => {
      const row = (y, word, color, note, en, tr, s) => `<g ${lsStep(s, 'ls-pop')}><rect x="40" y="${y - 40}" width="110" height="52" rx="18" fill="${color}"/><text x="95" y="${y - 3}" text-anchor="middle" ${F} font-size="30" fill="#fff">${word}</text><text x="95" y="${y + 36}" text-anchor="middle" class="ls-small">${note}</text></g>
        ${say(480, y, en, tr, s + 1, { fs: 22, color })}`;
      return lsSvg(`${row(95, 'at', '#e25d3f', 'saat, öğle, gece', "I get up at seven o'clock. I go to bed at night.", 'Saat yedide kalkarım. Gece yatarım.', 0)}
        ${row(225, 'in', '#4c8be6', 'günün bölümleri', 'I watch TV in the evening.', 'Akşam televizyon izlerim.', 2)}
        ${row(355, 'on', '#2eaa83', 'günler', 'I go shopping with my mom on Saturdays.', 'Cumartesileri annemle alışverişe giderim.', 4)}`);
    },

    'ing-my-day-practice': () => lsSvg(`${lsLabel(400, 40, '🎤 Sen de söyle!', 0)}
      <g ${lsStep(0, 'ls-pop')}>${lsEmoji(90, 108, '🙋', 50)}<text x="90" y="160" text-anchor="middle" class="ls-small">Sor</text></g>
      ${say(450, 115, 'What time do you go to school?', 'Saat kaçta okula gidersin?', 1, { fs: 28 })}
      <g ${lsStep(2, 'ls-pop')}>${lsEmoji(90, 228, '⏰', 50)}<text x="90" y="280" text-anchor="middle" class="ls-small">Sabahın</text></g>
      ${say(450, 235, "I wake up at seven o'clock.", 'Saat yedide uyanırım.', 3, { fs: 28 })}
      <g ${lsStep(4, 'ls-pop')}>${lsEmoji(90, 348, '📝', 50)}<text x="90" y="400" text-anchor="middle" class="ls-small">Akşamın</text></g>
      ${say(450, 355, 'I do my homework in the evening.', 'Akşam ödevimi yaparım.', 5, { fs: 28 })}`),

    'ing-my-day-summary': () => lsSummary([['⏰', 'I wake up.|I have breakfast.'], ['🕖', "It is seven o'clock.|half past seven"], ['📅', 'Monday, Tuesday …|Saturday, Sunday'], ['🔤', "at seven o'clock|in the evening|on Sunday"]], 'Hazırsan mini teste geçelim!'),
  });
}
