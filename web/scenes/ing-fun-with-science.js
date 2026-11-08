/* Scenes for the video lesson "Bilimle Eğlence: Yönergeler ve Yerler". Loaded when the lesson opens (see loadLessonScenes in lessons.js). */
{
  const F = 'font-family="Segoe UI,Arial,sans-serif" font-weight="800"';
  // Rough widths of bold English text (font size fs) and of Turkish ls-small text, for sizing cards.
  const enW = (t, fs) => [...t].reduce((w, c) => w + fs * (/[mwMW]/.test(c) ? 0.9 : /[A-Z]/.test(c) ? 0.68 : /[ijlI.,:;'!-]/.test(c) ? 0.3 : /[frt ]/.test(c) ? 0.4 : /[a-z0-9?]/.test(c) ? 0.58 : 1), 0);
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
  const MERT = [90, 360], LILY = [710, 360];
  const kids = () => kid(MERT[0], MERT[1], 1, '#e8832f', '#3b2416') + kid(LILY[0], LILY[1], 1, '#d4589a', '#e8b84a', true) + name(MERT[0], 435, 'Mert') + name(LILY[0], 435, 'Lily');
  // A picture card (w x h): picture, English word (shrunk to fit), Turkish meaning; (x, top) is the top centre.
  const pic = (x, top, w, h, icon, en, tr, step, i, big = 34) => {
    const fs = Math.min(24, Math.floor((w - 18) / enW(en, 1)));
    return `<g ${lsStep(step, 'ls-rise ls-d' + i)}><rect x="${x - w / 2}" y="${top}" width="${w}" height="${h}" rx="18" class="ls-card"/>
    ${typeof icon === 'function' ? icon(x, top + 34) : lsEmoji(x, top + 34, icon, big)}<text x="${x}" y="${top + h - 32}" text-anchor="middle" ${F} font-size="${fs}" fill="#0b4f45">${en}</text>
    <text x="${x}" y="${top + h - 11}" text-anchor="middle" class="ls-small" style="font-size:15px">${tr}</text></g>`;
  };
  const bottle = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">${lsBottle('#8fd3ff')(0, 0)}</g>`;
  const fold = (x, y) => `<g transform="translate(${x} ${y})"><path d="M-26 -18 H22 L-2 20 Z" fill="#fff" stroke="#5b7fa6" stroke-width="3"/><path d="M-26 -18 L-2 20 L-30 14 Z" fill="#dce8f5" stroke="#5b7fa6" stroke-width="3"/></g>`;
  const shake = (x, y) => `<g transform="translate(${x} ${y})"><g transform="rotate(-18)">${lsBottle('#ffb36b')(0, 0)}</g><path d="M-34 -16 q-8 10 0 20 M34 -10 q8 10 0 20" stroke="#5b7fa6" stroke-width="3" fill="none" stroke-linecap="round"/></g>`;
  const cup = (x, y) => `<g transform="translate(${x} ${y})"><path d="M18 -12 q20 0 18 14 q-2 12 -20 10" stroke="#5b7fa6" stroke-width="5" fill="none"/><path d="M-24 -22 H24 L18 22 Q16 28 10 28 H-10 Q-16 28 -18 22 Z" fill="#fff" stroke="#5b7fa6" stroke-width="3"/><path d="M-21 -10 H21 L18 18 Q16 24 10 24 H-10 Q-16 24 -17 18 Z" fill="#7cc6f2"/></g>`;
  const brush = (x, y) => `<g transform="translate(${x} ${y})"><rect x="-44" y="-4" width="58" height="8" rx="4" fill="#c8733d"/><rect x="12" y="-6" width="10" height="12" fill="#9aa7b5"/><path d="M22 -7 Q44 -6 46 0 Q44 6 22 7 Z" fill="#4c8be6"/></g>`;
  const ball = (x, y) => `<circle cx="${x}" cy="${y}" r="18" fill="#e25d3f"/><path d="M${x - 18} ${y} Q${x} ${y - 10} ${x + 18} ${y}" stroke="#fff" stroke-width="3" fill="none"/><circle cx="${x - 6}" cy="${y - 7}" r="4" fill="#fff" opacity=".8"/>`;
  // A box standing on the ground line gy, centred at cx; open = true shows its opening on top, with `inside` drawn in it.
  const box = (cx, gy, open = false, inside = '') => `<path d="M${cx - 50} ${gy - 60} L${cx - 30} ${gy - 80} H${cx + 70} L${cx + 50} ${gy - 60} Z" fill="${open ? '#6b4422' : '#e8b877'}" stroke="#a8672f" stroke-width="3"/>${inside}
    <path d="M${cx + 50} ${gy - 60} L${cx + 70} ${gy - 80} V${gy - 20} L${cx + 50} ${gy} Z" fill="#c98f4a" stroke="#a8672f" stroke-width="3"/>
    <path d="M${cx - 50} ${gy - 60} H${cx + 50} V${gy} H${cx - 50} Z" fill="#d9a35b" stroke="#a8672f" stroke-width="3"/>`;
  const table = (cx, gy, w = 150) => `<path d="M${cx - w / 2} ${gy - 72} H${cx + w / 2} V${gy - 60} H${cx - w / 2} Z" fill="#a8672f"/><path d="M${cx - w / 2 + 10} ${gy - 60} V${gy} M${cx + w / 2 - 10} ${gy - 60} V${gy}" stroke="#8a5a2b" stroke-width="9" stroke-linecap="round"/>`;
  const ground = (cx, gy) => `<path d="M${cx - 95} ${gy} H${cx + 135}" stroke="#9bd27d" stroke-width="5" stroke-linecap="round"/>`;
  // One row of a location scene: a little picture on the left, the English sentence on the right.
  const where = (y, draw, en, tr, step) => `<g ${lsStep(step, 'ls-pop')}>${ground(130, y + 42)}${draw(130, y + 42)}</g>${say(505, y, en, tr, step, { fs: 30, cls: 'ls-pop ls-d1' })}`;
  const blob = (x, y, c) => `<circle cx="${x}" cy="${y}" r="22" fill="${c}" stroke="#5f6b76" stroke-width="2"/>`;

  Object.assign(LESSON_SCENES, {
    'ing-fun-with-science-intro': () => lsSvg(`<g ${lsStep(0, 'ls-rise')}>${table(400, 420, 560)}${bottle(250, 318)}${cup(330, 320)}${box(470, 348)}${brush(620, 340)}${lsEmoji(400, 220, '🔬', 70)}</g>
      ${lsPill(220, 60, '✂️ kes', '#5b7fa6', 1)}${lsPill(400, 60, '📄 katla', '#5b7fa6', 1, 'ls-d1')}${lsPill(580, 60, '🎨 karıştır', '#5b7fa6', 1, 'ls-d2')}
      <g ${lsStep(2, 'ls-pop')}>${lsEmoji(250, 245, '❓', 34)}${lsEmoji(630, 290, '❓', 34)}</g>
      ${lsLabel(400, 140, '🧪 Fun with Science · Bilimle Eğlence', 3)}`),

    'ing-fun-with-science-words': () => lsSvg(`
      ${[['🔬', 'science', 'bilim'], ['👩‍🔬', 'scientist', 'bilim insanı'], ['🧪', 'experiment', 'deney']].map(([e, en, tr], i) => pic(160 + i * 240, 50, 225, 104, e, en, tr, 1, i)).join('')}
      ${[['📦', 'box', 'kutu'], [(x, y) => `<g transform="translate(${x} ${y}) scale(0.6)">${cup(0, 0)}</g>`, 'cup', 'fincan'], [(x, y) => bottle(x, y + 2, 0.55), 'bottle', 'şişe'], ['🖌️', 'brush', 'fırça']].map(([e, en, tr], i) => pic(107 + i * 195, 164, 178, 104, e, en, tr, 2, i)).join('')}
      ${[['📄', 'paper', 'kâğıt'], ['✂️', 'scissors', 'makas'], ['🎨', 'paints', 'boyalar']].map(([e, en, tr], i) => pic(160 + i * 240, 278, 225, 104, e, en, tr, 3, i)).join('')}
      ${lsPill(400, 418, 'science ➜ scientist', '#5b7fa6', 4)}`),

    'ing-fun-with-science-instructions': () => lsSvg(`${lsLabel(400, 34, '🧪 Deney yönergeleri', 0)}
      ${[['✂️', 'Cut the paper.', 'Kâğıdı kes.'], [fold, 'Fold the paper.', 'Kâğıdı katla.'], ['🎨', 'Mix the paints.', 'Boyaları karıştır.'], [shake, 'Shake the bottle.', 'Şişeyi salla.']].map(([e, en, tr], i) =>
        pic(210 + (i % 2) * 380, 62 + Math.floor(i / 2) * 140, 340, 126, e, en, tr, i + 1, 0, 40)).join('')}
      ${lsPill(400, 380, 'Eylem başta: Cut … Fold … Mix … Shake …', '#2eaa83', 5)}`),

    'ing-fun-with-science-plant': () => lsSvg(`${lsLabel(170, 34, '🌱 Tohum ekelim', 0)}
      <path d="M115 330 H225 L208 410 H132 Z" fill="#c8733d" stroke="#8d4c22" stroke-width="3"/><ellipse cx="170" cy="330" rx="55" ry="11" fill="#6b4422"/>
      <g ${lsStep(1, 'ls-drop')}><ellipse cx="170" cy="325" rx="8" ry="5" fill="#8a5a2b"/></g>
      <g ${lsStep(2, 'ls-in')}><g class="ls-rain"><circle cx="150" cy="240" r="5" fill="#4c8be6"/><circle cx="175" cy="225" r="5" fill="#4c8be6"/><circle cx="195" cy="245" r="5" fill="#4c8be6"/></g>${lsEmoji(170, 298, '🌱', 40)}</g>
      <g ${lsStep(3, 'ls-pop')}>${lsEmoji(170, 150, '✂️', 54)}</g><g ${lsStep(4, 'ls-pop')}>${lsCross(170, 150, 80)}</g>
      ${say(530, 100, 'Plant the seed.', 'Tohumu ek.', 1)}
      ${say(530, 195, 'Water it.', 'Onu sula.', 2)}
      ${lsPill(530, 262, "Don't + eylem = yapma!", '#e25d3f', 3)}
      ${say(530, 345, "Don't cut it now!", 'Onu şimdi kesme!', 4, { color: '#e25d3f' })}`),

    'ing-fun-with-science-colours': () => {
      const row = (y, a, b, c, en, tr, s) => `<g ${lsStep(s, 'ls-pop')}>${blob(55, y - 4, a)}<text x="95" y="${y + 6}" text-anchor="middle" ${F} font-size="28" fill="#3d4f63">+</text>${blob(135, y - 4, b)}<text x="175" y="${y + 6}" text-anchor="middle" ${F} font-size="28" fill="#3d4f63">=</text>${blob(215, y - 4, c)}</g>
        ${say(520, y, en, tr, s, { fs: 24, cls: 'ls-pop ls-d1' })}`;
      return lsSvg(`${lsLabel(400, 36, '🎨 Renkleri karıştır · Mix', 0)}
        ${row(115, '#e53935', '#ffd23f', '#ff8c1a', 'Mix red and yellow, and you get orange.', 'Kırmızı ile sarıyı karıştır, turuncu elde edersin.', 1)}
        ${row(200, '#2f6fde', '#ffd23f', '#3fae4a', 'Mix blue and yellow, and you get green.', 'Mavi ile sarıyı karıştır, yeşil elde edersin.', 2)}
        ${row(285, '#e53935', '#2f6fde', '#8e44ad', 'Mix red and blue, and you get purple.', 'Kırmızı ile maviyi karıştır, mor elde edersin.', 3)}
        ${row(370, '#222', '#fff', '#9a9a9a', 'Mix black and white, and you get gray.', 'Siyah ile beyazı karıştır, gri elde edersin.', 4)}`);
    },

    'ing-fun-with-science-what-is': () => lsSvg(`${kids()}
      ${bubble(330, 70, 'What is “experiment” in Turkish?', '“experiment” Türkçede ne demek?', 1, -1, '#e8832f', 'data-hide="3"')}
      ${bubble(480, 165, 'Deney.', 'experiment = deney', 2, 1, '#d4589a', 'data-hide="3"')}
      <g ${lsStep(3, 'ls-pop')}>${table(400, 420, 220)}${cup(400, 318)}${lsEmoji(455, 270, '❓', 32)}</g>
      ${bubble(480, 70, 'What is in the cup?', 'Fincanın içinde ne var?', 4, 1, '#d4589a')}
      ${bubble(320, 165, 'It is water.', 'Su.', 5, -1, '#e8832f')}`),

    'ing-fun-with-science-in-on-under': () => lsSvg(`${lsLabel(400, 34, '📍 Nerede? in · on · under', 0)}
      ${where(115, (x, g) => box(x, g, true, ball(x + 10, g - 70)), 'The ball is in the box.', 'Top kutunun içinde.', 1)}
      ${where(235, (x, g) => box(x, g) + ball(x + 10, g - 88), 'The ball is on the box.', 'Top kutunun üstünde.', 2)}
      ${where(355, (x, g) => table(x, g) + ball(x, g - 18), 'The ball is under the table.', 'Top masanın altında.', 3)}`),

    'ing-fun-with-science-behind': () => lsSvg(`${lsLabel(400, 34, '📍 behind · in front of · near', 0)}
      ${where(115, (x, g) => ball(x + 72, g - 84) + box(x, g), 'The ball is behind the box.', 'Top kutunun arkasında.', 1)}
      ${where(235, (x, g) => box(x, g) + ball(x - 10, g - 14), 'The ball is in front of the box.', 'Top kutunun önünde.', 2)}
      ${where(355, (x, g) => box(x - 20, g) + ball(x + 92, g - 18), 'The ball is near the box.', 'Top kutunun yanında.', 3)}`),

    'ing-fun-with-science-where': () => lsSvg(`${kids()}
      ${table(400, 420, 300)}${cup(320, 320)}${bottle(460, 312)}${brush(450, 342)}
      ${bubble(480, 70, 'Where is the brush?', 'Fırça nerede?', 1, 1, '#d4589a', 'data-hide="3"')}
      ${bubble(320, 165, 'It is in front of the bottle.', 'Şişenin önünde.', 2, -1, '#e8832f', 'data-hide="3"')}
      <g ${lsStep(2, 'ls-pop')} data-hide="3"><circle cx="470" cy="342" r="38" fill="none" stroke="#2eaa83" stroke-width="4"/></g>
      ${lsLabel(400, 40, '🎤 Sen de tekrar et!', 3)}
      ${bubble(480, 110, 'Where is the cup?', 'Fincan nerede?', 4, 1, '#d4589a')}
      ${bubble(320, 200, 'It is on the table.', 'Masanın üstünde.', 5, -1, '#e8832f')}
      <g ${lsStep(5, 'ls-pop')}><circle cx="320" cy="320" r="40" fill="none" stroke="#2eaa83" stroke-width="4"/></g>`),

    'ing-fun-with-science-careful': () => lsSvg(`${lsLabel(400, 30, '⚠️ Dikkat!', 0)}
      <g ${lsStep(0, 'ls-pop')}>${ground(110, 200)}${box(110, 200)}${lsEmoji(120, 112, '🐈', 50)}</g>
      ${say(480, 95, 'The cat is in the box.', '', 0, { fs: 28, color: '#e25d3f', mark: 'no', cls: 'ls-pop ls-d1' })}
      ${say(480, 185, 'The cat is on the box.', 'Kedi kutunun üstünde.', 1, { fs: 28, mark: 'ok' })}
      <g ${lsStep(2, 'ls-pop')}>${ground(110, 400)}${lsEmoji(178, 316, '🐈', 50)}${box(110, 400)}</g>
      ${say(480, 290, 'The cat is in front of the box.', '', 2, { fs: 28, color: '#e25d3f', mark: 'no', cls: 'ls-pop ls-d1' })}
      ${say(480, 380, 'The cat is behind the box.', 'Kedi kutunun arkasında.', 3, { fs: 28, mark: 'ok' })}`),

    'ing-fun-with-science-summary': () => lsSummary([['✂️', 'Cut the paper.|Fold it.'], ['🚫', "Don't cut it now!"], ['🎨', 'red + yellow|= orange'], ['📦', 'in, on, under|behind, near|in front of']], 'Hazırsan mini teste geçelim!'),
  });
}
