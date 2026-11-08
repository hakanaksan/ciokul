/* Scenes for the video lesson "Nerelisin? Ülkeler ve Milliyetler". Loaded when the lesson opens (see loadLessonScenes in lessons.js). */
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

  // Flags are drawn in a 30 x 20 box; a nested <svg> clips them.
  const star = (cx, cy, r, rot = -90) => Array.from({ length: 10 }, (_, i) => {
    const a = (rot + i * 36) * Math.PI / 180, d = i % 2 ? r * 0.4 : r;
    return `${(cx + d * Math.cos(a)).toFixed(2)},${(cy + d * Math.sin(a)).toFixed(2)}`;
  }).join(' ');
  const bands = (colors, vertical = false) => colors.map((c, i) => vertical
    ? `<rect x="${i * 30 / colors.length}" width="${30 / colors.length + 0.1}" height="20" fill="${c}"/>`
    : `<rect y="${i * 20 / colors.length}" width="30" height="${20 / colors.length + 0.1}" fill="${c}"/>`).join('');
  const FLAGS = {
    turkey: `<rect width="30" height="20" fill="#e30a17"/><circle cx="10.5" cy="10" r="5" fill="#fff"/><circle cx="11.8" cy="10" r="4" fill="#e30a17"/><polygon points="${star(16.3, 10, 2.3, 180)}" fill="#fff"/>`,
    britain: `<rect width="30" height="20" fill="#012169"/><path d="M0 0L30 20M30 0L0 20" stroke="#fff" stroke-width="4"/><path d="M0 0L30 20M30 0L0 20" stroke="#c8102e" stroke-width="1.4"/><path d="M15 0V20M0 10H30" stroke="#fff" stroke-width="6"/><path d="M15 0V20M0 10H30" stroke="#c8102e" stroke-width="3.4"/>`,
    america: `<rect width="30" height="20" fill="#fff"/>${[0, 2, 4, 6, 8, 10, 12].map(i => `<rect y="${(i * 20 / 13).toFixed(2)}" width="30" height="1.54" fill="#b22234"/>`).join('')}<rect width="12" height="10.77" fill="#3c3b6e"/>${[2, 5, 8, 11].flatMap(y => [2, 4.6, 7.2, 9.8].map(x => `<circle cx="${x}" cy="${y * 0.9}" r="0.55" fill="#fff"/>`)).join('')}`,
    germany: bands(['#000', '#dd0000', '#ffce00']),
    russia: bands(['#fff', '#0039a6', '#d52b1e']),
    japan: `<rect width="30" height="20" fill="#fff"/><circle cx="15" cy="10" r="6" fill="#bc002d"/>`,
    pakistan: `<rect width="30" height="20" fill="#01411c"/><rect width="7.5" height="20" fill="#fff"/><circle cx="18.6" cy="10.4" r="5.6" fill="#fff"/><circle cx="20.2" cy="9" r="4.9" fill="#01411c"/><polygon points="${star(22, 7.4, 1.7, -60)}" fill="#fff"/>`,
    iran: `${bands(['#239f40', '#fff', '#da0000'])}<circle cx="15" cy="10" r="2" fill="none" stroke="#da0000" stroke-width="0.9"/>`,
    iraq: `${bands(['#ce1126', '#fff', '#000'])}<path d="M9.5 10.6 q1.4 -2 2.8 0 t2.8 0 t2.8 0 t2.8 0" stroke="#007a3d" stroke-width="1" fill="none"/>`,
  };
  const flag = (kind, x, y, w) => `<svg x="${x}" y="${y}" width="${w}" height="${w * 2 / 3}" viewBox="0 0 30 20" preserveAspectRatio="none">${FLAGS[kind]}</svg><rect x="${x}" y="${y}" width="${w}" height="${w * 2 / 3}" fill="none" stroke="#3d4f63" stroke-width="2"/>`;

  // A simple outline of Turkey (longitude, latitude), mapped onto the stage.
  const geo = ([lon, lat]) => [70 + (lon - 26) * 19, 140 + (42.2 - lat) * 30];
  const TURKEY = [[26, 40.6], [26.6, 41.9], [28, 42], [29, 41.2], [31, 41.1], [33, 41.9], [35, 42], [36, 41.6], [37.5, 41], [39.5, 41], [41.5, 41.5], [42.5, 41.5], [43.5, 41.1], [44.8, 39.7], [44.4, 38.4], [44.8, 37.2], [42.4, 37.1], [40.5, 37.1], [38, 36.8], [36.6, 36.8], [36.2, 36], [35.8, 36.6], [34.5, 36.8], [33, 36.1], [32, 36.5], [30.6, 36.8], [29.6, 36.2], [28, 36.7], [27.3, 37.5], [26.4, 38.3], [26.2, 39.4], [26.6, 40]];
  const turkeyMap = () => `<path d="M${TURKEY.map(p => geo(p).map(v => v.toFixed(1)).join(' ')).join(' L')} Z" fill="#f2d49b" stroke="#b08a5a" stroke-width="4" stroke-linejoin="round"/>`;
  const city = (lonLat, step, label, lx, ly) => {
    const [x, y] = geo(lonLat);
    return `<g ${lsStep(step, 'ls-pop')}><circle cx="${x}" cy="${y}" r="9" fill="#e25d3f" stroke="#fff" stroke-width="3"/></g>${lsLabel(lx, ly, label, step)}`;
  };
  const COUNTRIES = [['turkey', 'Turkey', 'Türkiye', 'Turkish', 'Türk'], ['britain', 'Britain', 'Britanya', 'British', 'Britanyalı'], ['america', 'America', 'Amerika', 'American', 'Amerikalı'],
    ['germany', 'Germany', 'Almanya', 'German', 'Alman'], ['russia', 'Russia', 'Rusya', 'Russian', 'Rus'], ['japan', 'Japan', 'Japonya', 'Japanese', 'Japon'],
    ['pakistan', 'Pakistan', 'Pakistan', 'Pakistani', 'Pakistanlı'], ['iran', 'Iran', 'İran', 'Iranian', 'İranlı'], ['iraq', 'Iraq', 'Irak', 'Iraqi', 'Iraklı']];
  const ELIF = [90, 360], TOM = [710, 360];
  const kids = () => kid(ELIF[0], ELIF[1], 1, '#e25d3f', '#5a3b22', true) + kid(TOM[0], TOM[1], 1, '#4c8be6', '#e8b84a') + name(ELIF[0], 435, 'Elif') + name(TOM[0], 435, 'Tom');

  Object.assign(LESSON_SCENES, {
    'ing-nationality-intro': () => lsSvg(`${lsLabel(400, 40, 'Dünyadan arkadaşlar', 0)}
      <g ${lsStep(0)}><circle cx="400" cy="170" r="85" fill="#4fb3e8" stroke="#1c6fa8" stroke-width="5"/>
        <path d="M352 120 q22 -22 50 -10 q14 18 -6 34 q-26 12 -44 -24 Z M420 170 q30 -14 46 8 q-6 34 -34 44 q-20 -18 -12 -52 Z M346 190 q20 -6 30 14 q-8 22 -26 20 q-12 -14 -4 -34 Z" fill="#6fbf73"/></g>
      ${['turkey', 'britain', 'america', 'germany', 'japan', 'russia'].map((k, i) => `<g ${lsStep(1, 'ls-pop ls-d' + (i % 3))}>${flag(k, i < 3 ? 60 : 656, 70 + (i % 3) * 90, 84)}</g>`).join('')}
      <g ${lsStep(2, 'ls-rise')}>${kid(130, 385, 0.9, '#e25d3f', '#5a3b22', true)}${kid(670, 385, 0.9, '#4c8be6', '#e8b84a')}</g>
      ${say(400, 330, 'Where are you from?', 'Nerelisin?', 3, { fs: 40 })}
      ${lsLabel(400, 420, 'Haydi öğrenelim!', 4)}`),

    'ing-nationality-countries': () => lsSvg(`${lsLabel(400, 40, 'Ülkeler · Countries', 0)}
      ${COUNTRIES.map(([k, en, tr], i) => { const x = 35 + (i % 3) * 250, y = 70 + Math.floor(i / 3) * 105;
        return `<g ${lsStep(Math.floor(i / 3) + 1, 'ls-rise ls-d' + (i % 3))}><rect x="${x}" y="${y}" width="230" height="92" rx="18" class="ls-card"/>${flag(k, x + 14, y + 22, 72)}
          <text x="${x + 100}" y="${y + 44}" ${F} font-size="26" fill="#0b4f45">${en}</text><text x="${x + 100}" y="${y + 72}" class="ls-small">${tr}</text></g>`; }).join('')}
      ${lsLabel(400, 415, 'Büyük harfle başlar: Turkey ✓', 4)}`),

    'ing-nationality-nationalities': () => lsSvg(`${lsLabel(400, 40, 'Ülke ➜ Milliyet (Nationality)', 0)}
      ${COUNTRIES.map(([k, en, , nat, natTr], i) => { const x = 35 + (i % 3) * 250, y = 66 + Math.floor(i / 3) * 106, step = [1, 2, 2, 3, 3, 3, 4, 4, 4][i];
        return `<g ${lsStep(step, 'ls-rise ls-d' + (i % 3))}><rect x="${x}" y="${y}" width="230" height="96" rx="18" class="ls-card"/>${flag(k, x + 14, y + 28, 60)}
          <text x="${x + 88}" y="${y + 28}" class="ls-small" fill="#5b6f66">${en} ➜</text><text x="${x + 88}" y="${y + 60}" ${F} font-size="25" fill="#c0392b">${nat}</text><text x="${x + 88}" y="${y + 84}" class="ls-small" style="font-size:15px">${natTr}</text></g>`; }).join('')}
      ${lsLabel(400, 415, '🌍 Ülkeden milliyete', 1)}`),

    'ing-nationality-where': () => lsSvg(`${kids()}
      ${lsLabel(400, 425, 'Elif ve Tom tanışıyor', 0)}
      ${bubble(320, 80, 'Where are you from?', 'Nerelisin?', 1, -1, '#e25d3f')}
      ${bubble(480, 190, 'I am from Britain.', "Ben Britanya'danım.", 2, 1, '#4c8be6')}
      <g ${lsStep(2, 'ls-pop ls-d2')}>${flag('britain', 672, 200, 72)}</g>
      <g ${lsStep(3, 'ls-pop')}><circle cx="640" cy="296" r="22" fill="#fff" stroke="#4c8be6" stroke-width="3"/><text x="640" y="306" text-anchor="middle" ${F} font-size="28" fill="#4c8be6">?</text></g>
      ${bubble(320, 300, 'I am from Turkey.', "Ben Türkiye'denim.", 4, -1, '#e25d3f')}
      <g ${lsStep(4, 'ls-pop ls-d2')}>${flag('turkey', 54, 200, 72)}</g>`),

    'ing-nationality-what': () => lsSvg(`${kids()}
      ${lsLabel(400, 425, 'Milliyet sorusu', 0)}
      ${bubble(320, 80, 'What nationality are you?', 'Milliyetin ne?', 1, -1, '#e25d3f')}
      <g ${lsStep(2, 'ls-pop')}>${flag('britain', 672, 200, 72)}</g>
      ${bubble(480, 190, 'I am British.', 'Ben Britanyalıyım.', 3, 1, '#4c8be6')}
      <g ${lsStep(4, 'ls-pop')}>${flag('turkey', 54, 200, 72)}</g>
      ${bubble(320, 300, 'I am Turkish.', 'Ben Türküm.', 5, -1, '#e25d3f')}`),

    'ing-nationality-heshe': () => lsSvg(`
      ${lsPill(250, 40, '👧 she = o (kız)', '#d4589a', 0)}${lsPill(550, 40, '👦 he = o (erkek)', '#3f7fd6', 0, 'ls-d1')}
      <g ${lsStep(1, 'ls-pop')}>${lsEmoji(75, 150, '👧', 76)}</g>
      ${say(320, 110, 'Where is she from?', 'O nereli?', 1, { fs: 30 })}
      ${say(400, 190, 'She is from Pakistan.', "O Pakistan'dan.", 2, { fs: 30 })}
      <g ${lsStep(2, 'ls-pop ls-d2')}>${flag('pakistan', 650, 160, 84)}</g>
      <g ${lsStep(3, 'ls-pop')}>${lsEmoji(75, 325, '👦', 76)}</g>
      ${say(320, 285, 'Is he Russian?', 'O Rus mu?', 3, { fs: 30 })}
      <g ${lsStep(3, 'ls-pop ls-d2')}>${flag('russia', 650, 262, 84)}</g><g ${lsStep(4)}>${no(748, 262)}</g>
      ${say(400, 365, "No, he isn't. He is German.", 'Hayır, değil. O Alman.', 4, { fs: 30 })}
      <g ${lsStep(4, 'ls-pop ls-d2')}>${flag('germany', 650, 352, 84)}</g><g ${lsStep(4, 'ls-d3')}>${ok(748, 352)}</g>`),

    'ing-nationality-yesno': () => lsSvg(`${kids()}
      <g data-hide="1" class="ls-in on">${lsPill(300, 200, '✓ Evet', '#1f9a73', 0)}${lsPill(500, 200, '✗ Hayır', '#d9472b', 0, 'ls-d1')}</g>
      ${bubble(480, 80, 'Are you British?', 'Britanyalı mısın?', 1, 1, '#4c8be6', 'data-hide="3"')}
      ${bubble(320, 180, 'No, I am not.', 'Hayır, değilim.', 2, -1, '#e25d3f', 'data-hide="3"')}
      <g ${lsStep(3, 'ls-rise')}><rect x="340" y="250" width="120" height="110" rx="12" fill="#fff" stroke="#c9a24a" stroke-width="6"/>${lsEmoji(400, 300, '👧', 60)}<text x="440" y="275" text-anchor="middle" ${F} font-size="26" fill="#e25d3f">?</text></g>
      ${bubble(480, 80, 'Is she from Japan?', 'O Japonya’dan mı?', 3, 1, '#4c8be6')}
      ${bubble(320, 180, 'I think so.', 'Sanırım öyle.', 4, -1, '#e25d3f')}
      ${lsLabel(400, 410, '🤔 Emin değilsek: I think so.', 5)}`),

    'ing-nationality-directions': () => lsSvg(`
      ${lsLabel(250, 95, 'Türkiye', 0)}<g ${lsStep(0)}>${turkeyMap()}</g>
      <g ${lsStep(1, 'ls-pop')}><circle cx="620" cy="124" r="40" fill="#fff" stroke="#08796e" stroke-width="4"/>
        <path d="M620 88 L630 124 L620 160 L610 124 Z" fill="#e25d3f"/><path d="M584 124 L620 114 L656 124 L620 134 Z" fill="#9fb6c6"/><circle cx="620" cy="124" r="5" fill="#3d4f63"/>
        <text x="620" y="70" text-anchor="middle" ${F} font-size="20" fill="#0b4f45">north · kuzey</text>
        <text x="620" y="190" text-anchor="middle" ${F} font-size="20" fill="#0b4f45">south · güney</text>
        <text x="548" y="120" text-anchor="middle" ${F} font-size="20" fill="#0b4f45">west</text><text x="548" y="142" text-anchor="middle" class="ls-small">batı</text>
        <text x="692" y="120" text-anchor="middle" ${F} font-size="20" fill="#0b4f45">east</text><text x="692" y="142" text-anchor="middle" class="ls-small">doğu</text></g>
      ${city([36.3, 41.15], 2, 'Samsun', 266, 210)}
      ${say(620, 245, 'Where is Samsun?', 'Samsun nerede?', 2, { fs: 28, attrs: 'data-hide="4"' })}
      ${say(620, 330, 'It is in the north.', 'Kuzeyde.', 3, { fs: 28, attrs: 'data-hide="4"' })}
      ${city([30.7, 37.05], 4, 'Antalya', 160, 262)}
      ${say(620, 245, 'Where is Antalya?', 'Antalya nerede?', 4, { fs: 28 })}
      ${say(620, 330, 'It is in the south.', 'Güneyde.', 5, { fs: 28 })}`),

    'ing-nationality-careful': () => lsSvg(`${lsLabel(400, 40, '⚠️ Dikkat!', 0)}
      ${say(400, 110, 'I am from Turkish.', 'Yanlış!', 0, { fs: 30, color: '#e25d3f' })}<g ${lsStep(0, 'ls-pop ls-d1')}>${no(560, 98)}</g>
      ${lsPill(140, 205, '🌍 Ülke', '#5b7fa6', 1)}
      ${say(430, 205, 'I am from Turkey.', "Ben Türkiye'denim.", 2, { fs: 30 })}<g ${lsStep(2, 'ls-pop ls-d1')}>${ok(650, 193)}</g>
      ${lsPill(140, 300, '🧒 Milliyet', '#5b7fa6', 3)}
      ${say(430, 300, 'I am Turkish.', 'Ben Türküm.', 4, { fs: 30 })}<g ${lsStep(4, 'ls-pop ls-d1')}>${ok(650, 288)}</g>
      ${lsLabel(400, 410, 'Büyük harf: Turkey, Turkish', 5)}`),

    'ing-nationality-practice': () => lsSvg(`${lsLabel(400, 40, '🎤 Sen de söyle!', 0)}
      <g ${lsStep(0, 'ls-pop')}>${lsEmoji(90, 108, '🙋', 50)}<text x="90" y="160" text-anchor="middle" class="ls-small">Sor</text></g>
      ${say(450, 115, 'Where are you from?', 'Nerelisin?', 1)}
      <g ${lsStep(2, 'ls-pop')}>${flag('turkey', 55, 200, 70)}<text x="90" y="275" text-anchor="middle" class="ls-small">Cevap ver</text></g>
      ${say(450, 235, 'I am from Turkey. I am Turkish.', "Ben Türkiye'denim. Ben Türküm.", 3, { fs: 30 })}
      <g ${lsStep(4, 'ls-pop')}>${lsEmoji(90, 345, '🧭', 50)}<text x="90" y="397" text-anchor="middle" class="ls-small">Şehrini anlat</text></g>
      ${say(450, 355, 'Izmir is in the west.', 'İzmir batıda.', 5)}`),

    'ing-nationality-summary': () => lsSummary([['🌍', 'Where are you from?|I am from Turkey.'], ['🧒', 'I am Turkish.|He is German.'], ['❓', 'Is she Russian?|Yes, she is.'], ['🧭', 'Where is Samsun?|It is in the north.']], 'Hazırsan mini teste geçelim!'),
  });
}
