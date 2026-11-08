/* Scenes for the video lesson "Kayaçlar ve Madenler". Loaded when the lesson opens (see loadLessonScenes in lessons.js). */
{
  // An uneven rock centred at (cx, cy) with radius r.
  const rock = (cx, cy, r, fill = '#9b8f84', stroke = '#6f6252', extra = '') => {
    const k = [1, 0.84, 1.06, 0.9, 1, 0.8, 1.08, 0.92];
    const pts = k.map((f, i) => { const a = Math.PI * 2 * i / k.length - 0.3; return `${(cx + Math.cos(a) * r * f * 1.25).toFixed(1)},${(cy + Math.sin(a) * r * f).toFixed(1)}`; }).join(' ');
    return `<polygon points="${pts}" fill="${fill}" stroke="${stroke}" stroke-width="3" stroke-linejoin="round" ${extra}/>`;
  };
  // A straight arrow from (x1, y1) to (x2, y2).
  const arrow = (x1, y1, x2, y2, color = '#3d4f63', w = 5, dash = '') => {
    const a = Math.atan2(y2 - y1, x2 - x1), h = 14;
    const p1 = `${(x2 - h * Math.cos(a - 0.5)).toFixed(1)},${(y2 - h * Math.sin(a - 0.5)).toFixed(1)}`;
    const p2 = `${(x2 - h * Math.cos(a + 0.5)).toFixed(1)},${(y2 - h * Math.sin(a + 0.5)).toFixed(1)}`;
    return `<line x1="${x1}" y1="${y1}" x2="${(x2 - 8 * Math.cos(a)).toFixed(1)}" y2="${(y2 - 8 * Math.sin(a)).toFixed(1)}" stroke="${color}" stroke-width="${w}" stroke-linecap="round" ${dash ? `stroke-dasharray="${dash}"` : ''}/><polygon points="${x2},${y2} ${p1} ${p2}" fill="${color}"/>`;
  };
  // Mineral grains inside a box: a few coloured polygons (granite-like).
  const grains = (x, y, w, h, colors, n = 18, seed = 3) => {
    let s = seed, out = '';
    const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
    for (let i = 0; i < n; i++) {
      const cx = x + 14 + rnd() * (w - 28), cy = y + 12 + rnd() * (h - 24), r = 6 + rnd() * 9, c = colors[i % colors.length];
      out += `<polygon points="${cx - r},${cy} ${cx - r * 0.3},${cy - r * 0.8} ${cx + r},${cy - r * 0.4} ${cx + r * 0.6},${cy + r * 0.7} ${cx - r * 0.5},${cy + r * 0.8}" fill="${c}"/>`;
    }
    return out;
  };
  const windowIcon = (x, y) => `<rect x="${x - 24}" y="${y - 22}" width="48" height="44" rx="4" fill="#bfe6ff" stroke="#8a5a2b" stroke-width="4"/><path d="M${x} ${y - 22} V${y + 22} M${x - 24} ${y} H${x + 24}" stroke="#8a5a2b" stroke-width="3"/><path d="M${x - 16} ${y - 14} l8 -4" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`;
  const pencilIcon = (x, y) => `<g transform="translate(${x} ${y}) rotate(-35)"><rect x="-26" y="-7" width="44" height="14" fill="#f2c94c" stroke="#b8902a" stroke-width="2"/><rect x="-34" y="-7" width="9" height="14" rx="2" fill="#e88aa0"/><path d="M18 -7 L34 0 L18 7 Z" fill="#f1d7b0"/><path d="M28 -2.5 L34 0 L28 2.5 Z" fill="#333"/></g>`;
  const potIcon = (x, y) => `<rect x="${x - 26}" y="${y - 8}" width="52" height="30" rx="8" fill="#9aa5ad" stroke="#6b7680" stroke-width="2"/><rect x="${x - 30}" y="${y - 14}" width="60" height="8" rx="4" fill="#b9c3ca"/><circle cx="${x}" cy="${y - 18}" r="4" fill="#6b7680"/><rect x="${x - 40}" y="${y - 2}" width="12" height="6" rx="3" fill="#6b7680"/><rect x="${x + 28}" y="${y - 2}" width="12" height="6" rx="3" fill="#6b7680"/>`;
  const cableIcon = (x, y) => `<g fill="none" stroke="#c8733d" stroke-width="5">${[-12, 0, 12].map(dx => `<ellipse cx="${x + dx}" cy="${y}" rx="10" ry="18"/>`).join('')}</g><path d="M${x + 22} ${y} q14 0 14 -16" stroke="#c8733d" stroke-width="5" fill="none"/><rect x="${x + 28}" y="${y - 30}" width="16" height="14" rx="3" fill="#3d4f63"/>`;
  // A rocky ground band: soil, then a stone layer.
  const ground = (y) => `<rect x="0" y="${y}" width="800" height="${450 - y}" fill="#b48a5a"/><rect x="0" y="${y + 60}" width="800" height="${390 - y}" fill="url(#lsStone)"/><path d="M0 ${y} Q200 ${y - 10} 400 ${y} T800 ${y} V${y + 8} H0 Z" fill="#6fbf73"/>`;

  Object.assign(LESSON_SCENES, {
    'fen-kayac-maden-intro': () => lsSvg(`
      ${ground(290)}
      ${lsKid(64, 244, 1)}
      ${lsLabel(400, 46, 'Eşyaların gizli sırrı', 0)}
      ${lsFoodRow([[windowIcon, 'Cam'], [pencilIcon, 'Kalem ucu'], [potIcon, 'Tencere'], [cableIcon, 'Kablo']], 150, 1)}
      <g ${lsStep(2)}>${[190, 330, 470, 610].map(x => arrow(x, 222, x, 368, '#fff', 5, '10 8')).join('')}</g>
      ${lsLabel(400, 330, 'Kayaçlardan geldi!', 2)}
      ${lsPill(400, 420, 'YER KABUĞU', '#6f6252', 3)}`),

    'fen-kayac-maden-crust': () => lsSvg(`
      <circle cx="180" cy="250" r="130" fill="#f2a65a"/><circle cx="180" cy="250" r="56" fill="#ffd25a"/>
      <circle cx="180" cy="250" r="126" fill="none" stroke="#8d6e4f" stroke-width="10"/>
      <path d="M86 170 q20 -24 46 -10 q10 18 -14 26 q-20 4 -32 -16 Z M210 140 q30 -10 50 8 q-6 22 -34 16 Z" fill="#6fbf73" opacity=".9"/>
      ${lsLabel(180, 80, 'Yer kabuğu', 0)}<line x1="180" y1="92" x2="180" y2="118" stroke="#3d4f63" stroke-width="3"/>
      <g ${lsStep(1)}>
        <rect x="360" y="90" width="420" height="320" rx="18" fill="#dff3ff"/>
        <rect x="360" y="300" width="420" height="110" fill="#f2a65a"/>
        <path d="M360 230 L470 150 L560 230 L610 230 L650 300 L780 300 L780 340 L650 340 Q630 380 600 380 L360 380 Z" fill="url(#lsStone)"/>
        <path d="M360 230 L470 150 L560 230 L610 230" stroke="#6fbf73" stroke-width="6" fill="none"/>
        <path d="M610 230 L780 230 L780 300 L650 300 Z" fill="#4fb3e8" opacity=".9"/>
        ${lsKid(588, 204, 0.6)}
        ${lsPill(700, 205, 'Okyanus', '#1c6fa8', 1)}
        ${lsPill(455, 268, 'Kara', '#2eaa83', 1)}
      </g>
      ${lsLabel(470, 342, 'Kayaçlar', 2)}
      <g ${lsStep(3)}><path d="M360 230 L470 150 L560 230" stroke="#e25d3f" stroke-width="5" fill="none" stroke-dasharray="10 7"/></g>
      ${lsPill(560, 125, 'Dağlar da kayaç', '#8d6e4f', 3)}
      <g ${lsStep(4, 'ls-pop')}>${arrow(380, 300, 380, 222, '#1b2a35', 4)}${arrow(380, 300, 380, 376, '#1b2a35', 4)}
        ${arrow(740, 320, 740, 302, '#1b2a35', 3)}${arrow(740, 320, 740, 338, '#1b2a35', 3)}</g>
      ${lsPill(440, 396, 'kalın', '#1b2a35', 4)}${lsPill(700, 376, 'ince', '#1b2a35', 4)}`),

    'fen-kayac-maden-rock': () => lsSvg(`
      <rect x="0" y="380" width="800" height="70" fill="#b48a5a"/>
      <g>${rock(210, 290, 120, '#a99a86')}${grains(110, 220, 200, 140, ['#d8d2c8', '#e8a0a0', '#3d3d3d', '#8e8070'], 22, 7)}</g>
      <g class="ls-in on"><circle cx="270" cy="250" r="48" fill="#ffffff55" stroke="#3d4f63" stroke-width="10"/><line x1="236" y1="284" x2="196" y2="324" stroke="#3d4f63" stroke-width="14" stroke-linecap="round"/></g>
      <g ${lsStep(1)}>
        <line x1="300" y1="215" x2="470" y2="128" stroke="#3d4f63" stroke-width="2" stroke-dasharray="6 6"/><line x1="306" y1="282" x2="470" y2="318" stroke="#3d4f63" stroke-width="2" stroke-dasharray="6 6"/>
        <circle cx="580" cy="222" r="120" fill="#f4ede3" stroke="#3d4f63" stroke-width="6"/>
        ${[[520, 170, '#d8d2c8'], [600, 150, '#e8a0a0'], [655, 205, '#3d3d3d'], [540, 245, '#e8a0a0'], [620, 270, '#d8d2c8'], [505, 205, '#3d3d3d'], [585, 210, '#8e8070'], [660, 260, '#e8a0a0'], [560, 300, '#3d3d3d']].map(([x, y, c]) => `<polygon points="${x - 26},${y} ${x - 10},${y - 24} ${x + 20},${y - 18} ${x + 28},${y + 6} ${x + 6},${y + 24} ${x - 20},${y + 18}" fill="${c}" stroke="#fff" stroke-width="3"/>`).join('')}
      </g>
      ${lsLabel(400, 52, 'Kayaç = mineraller bir arada', 1)}
      ${lsPill(210, 418, 'KAYAÇ', '#6f6252', 1)}
      <g ${lsStep(2, 'ls-pop')}>${arrow(470, 386, 540, 312, '#e25d3f', 4)}</g>
      ${lsPill(440, 408, 'Mineral', '#e25d3f', 2)}
      <g ${lsStep(3, 'ls-rise')}>${[0, 1, 2].map(r => [0, 1, 2].map(c => `<rect x="${640 + c * 40 + (r % 2) * 20 - 10}" y="${350 + r * 24}" width="38" height="22" rx="3" fill="${['#d8d2c8', '#e8a0a0', '#8e8070'][(r + c) % 3]}" stroke="#6f6252" stroke-width="2"/>`).join('')).join('')}
        <text x="710" y="440" text-anchor="middle" class="ls-small">Tuğlalar gibi</text></g>`),

    'fen-kayac-maden-minerals': () => lsSvg(`
      ${rock(100, 130, 40, '#b5654a', '#7a3f2c')}${rock(225, 130, 40, '#e6e1d8', '#a59f94')}<path d="M210 112 l12 -6 M236 140 l10 -4" stroke="#fff" stroke-width="4" stroke-linecap="round"/>${rock(350, 130, 40, '#3f3f46', '#1f1f24')}
      ${lsLabel(225, 222, 'Mineraller farklı!', 1)}
      <g ${lsStep(2)}>
        <rect x="40" y="262" width="400" height="160" rx="24" fill="#d9d4cf" stroke="#9e958b" stroke-width="4"/>
        ${grains(44, 280, 392, 140, ['#a9a9b0', '#e8a0a0', '#2f2f35', '#a9a9b0', '#e8a0a0'], 34, 11)}
        <g transform="translate(470 0)">${[[300, '#a9a9b0', 'Gri mineral'], [345, '#e8a0a0', 'Pembe mineral'], [390, '#2f2f35', 'Siyah mineral']].map(([y, c, t]) => `<circle cx="20" cy="${y - 6}" r="14" fill="${c}" stroke="#6f6252" stroke-width="2"/><text x="44" y="${y}" class="ls-cap">${t}</text>`).join('')}</g>
      </g>
      ${lsPill(240, 262, 'Granit', '#6b5d52', 2)}
      <g ${lsStep(3, 'ls-rise')}>
        <rect x="470" y="60" width="300" height="170" rx="22" class="ls-card"/>
        <text x="492" y="98" class="ls-cap" font-weight="800">Mineraller belirler:</text>
        ${['Rengini', 'Sertliğini', 'Parlaklığını'].map((t, i) => `<circle cx="506" cy="${132 + i * 34}" r="9" fill="#2eaa83"/><text x="526" y="${139 + i * 34}" class="ls-cap">${t}</text>`).join('')}
      </g>`),

    'fen-kayac-maden-breaking': () => lsSvg(`
      <rect x="0" y="380" width="800" height="70" fill="#b48a5a"/>
      <path d="M0 400 Q200 390 400 404 T800 398 V426 Q600 418 400 428 T0 424 Z" fill="#4fb3e8" ${lsStep(1).replace('class="ls-in ', 'class="ls-in ls-flow ')}/>
      <polygon points="70,380 100,230 150,170 220,150 280,190 320,250 340,380" fill="#a99a86" stroke="#6f6252" stroke-width="4" stroke-linejoin="round"/>
      <path d="M140 230 l30 10 M230 210 l20 30 M120 320 l40 -10" stroke="#8e8070" stroke-width="4" stroke-linecap="round"/>
      <g ${lsStep(1)}>
        <ellipse cx="200" cy="70" rx="80" ry="30" fill="#e8eef3"/><ellipse cx="150" cy="80" rx="40" ry="22" fill="#e8eef3"/>
        <g class="ls-rain">${[150, 185, 220, 255].map(x => `<line x1="${x}" y1="104" x2="${x - 8}" y2="130" stroke="#4fb3e8" stroke-width="5" stroke-linecap="round"/>`).join('')}</g>
        <g class="ls-wind">${[200, 230, 260].map(y => `<path d="M440 ${y} q-40 -14 -80 0" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round"/>`).join('')}</g>
      </g>
      ${lsPill(560, 110, 'Rüzgâr, yağmur, akarsu', '#4c8be6', 1)}
      <g ${lsStep(2)}>
        <circle cx="610" cy="185" r="26" fill="#ffcf4d" class="ls-sun"/><path d="M705 165 a24 24 0 1 0 18 40 a20 20 0 1 1 -18 -40 Z" fill="#f4e7a1" stroke="#c9b45a" stroke-width="2"/>
        <rect x="652" y="160" width="14" height="50" rx="7" fill="#fff" stroke="#3d4f63" stroke-width="2"/><circle cx="659" cy="214" r="10" fill="#e25d3f"/><rect x="656" y="178" width="6" height="34" fill="#e25d3f"/>
        <path d="M200 160 l-12 40 l16 20 l-10 40 M290 210 l-18 30 l10 24" stroke="#3d2f22" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
      <g ${lsStep(3, 'ls-rise')}>
        ${rock(445, 300, 34)}${rock(560, 304, 20)}
        ${[[642, 300], [660, 312], [650, 290], [668, 296], [636, 314]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="8" fill="#8e8070" stroke="#6f6252" stroke-width="2"/>`).join('')}
        ${[...Array(24)].map((_, i) => `<circle cx="${728 + (i % 6) * 8}" cy="${296 + Math.floor(i / 6) * 7}" r="2.6" fill="#d9a956"/>`).join('')}
        ${arrow(492, 302, 528, 302)}${arrow(588, 302, 622, 302)}${arrow(684, 302, 716, 302)}
        ${[[445, 'Kaya'], [560, 'Taş'], [652, 'Çakıl'], [748, 'Kum']].map(([x, t]) => `<text x="${x}" y="362" text-anchor="middle" class="ls-cap">${t}</text>`).join('')}
      </g>`),

    'fen-kayac-maden-ore': () => lsSvg(`
      ${lsLabel(400, 50, 'MADEN = ekonomik değeri olan', 1)}
      ${rock(130, 150, 42)}${rock(290, 150, 42, '#8e8070')}
      <g>${rock(450, 150, 42, '#9b8f84')}${[[436, 140], [462, 160], [452, 128], [474, 142]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="#f2c94c" stroke="#b8902a" stroke-width="2"/>`).join('')}${lsEmoji(500, 104, '✨', 34)}</g>
      <g ${lsStep(2)}>
        <path d="M30 420 L30 300 Q140 210 280 300 L280 420 Z" fill="#a99a86" stroke="#6f6252" stroke-width="4"/>
        <path d="M110 420 V340 Q155 300 200 340 V420 Z" fill="#2c2722"/><path d="M104 420 V336 H206 V420" stroke="#8a5a2b" stroke-width="10" fill="none"/>
        <g transform="translate(250 372)"><path d="M-40 -20 H40 L30 18 H-30 Z" fill="#6b7680" stroke="#3d4f63" stroke-width="3"/>${[[-20, -26], [0, -30], [18, -24]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="10" fill="#c8733d"/>`).join('')}<circle cx="-20" cy="22" r="8" fill="#3d4f63"/><circle cx="20" cy="22" r="8" fill="#3d4f63"/></g>
      </g>
      ${lsPill(155, 270, 'Maden ocağı', '#6f6252', 2)}
      <g ${lsStep(3)}>${arrow(304, 360, 400, 360, '#3d4f63', 5)}${lsEmoji(460, 350, '🏭', 64)}${arrow(510, 360, 590, 360, '#3d4f63', 5)}
        ${lsEmoji(630, 350, '🔌', 40)}${lsEmoji(690, 350, '💍', 40)}${lsEmoji(750, 350, '🍳', 40)}</g>
      ${lsPill(250, 428, 'Ham madde', '#c8733d', 3)}${lsPill(690, 410, 'Eşya', '#2eaa83', 3)}
      <g ${lsStep(4, 'ls-pop')}>${lsEmoji(655, 160, '♻️', 60)}</g>
      ${lsPill(655, 230, 'Tutumlu kullan', '#2eaa83', 4)}`),

    'fen-kayac-maden-bor': () => {
      // Pie: about three quarters for Türkiye.
      const a = Math.PI * 2 * 0.72, px = 215 + 62 * Math.sin(a), py = 225 - 62 * Math.cos(a);
      return lsSvg(`
      <g><rect x="246" y="22" width="48" height="32" rx="3" fill="#e30a17"/><circle cx="264" cy="38" r="9" fill="#fff"/><circle cx="266.6" cy="38" r="7.2" fill="#e30a17"/><polygon points="276,38 281.5,36 281.5,31.5 284.8,35.4 290,34 286.8,38 290,42 284.8,40.6 281.5,44.5 281.5,40" fill="#fff"/></g>
      ${lsLabel(445, 48, 'Ülkemiz madence zengin', 0)}
      <g ${lsStep(1, 'ls-rise')}>
        <rect x="30" y="88" width="360" height="340" rx="22" class="ls-card"/>
        <circle cx="215" cy="225" r="62" fill="#c9d6de"/><path d="M215 225 L215 163 A62 62 0 1 1 ${px.toFixed(1)} ${py.toFixed(1)} Z" fill="#e30a17"/>
        <text x="236" y="252" text-anchor="middle" class="ls-cap" style="fill:#fff" font-weight="800">Türkiye</text>
        <text x="215" y="312" text-anchor="middle" class="ls-small">Dünyadaki bor madeni</text>
      </g>
      ${lsPill(210, 120, 'BOR', '#7d5ba6', 1)}
      <g ${lsStep(2, 'ls-rise')}>${[[75, '🥛', 'Cam'], [160, '🧴', 'Deterjan'], [258, '🏺', 'Seramik'], [345, '🚀', 'Uzay']].map(([x, e, t]) => `${lsEmoji(x, 354, e, 36)}<text x="${x}" y="406" text-anchor="middle" class="ls-small">${t}</text>`).join('')}</g>
      <g ${lsStep(3, 'ls-rise')}>
        <rect x="410" y="88" width="360" height="340" rx="22" class="ls-card"/>
        <rect x="450" y="160" width="280" height="110" rx="10" fill="#f6f4f0" stroke="#c9c3ba" stroke-width="3"/>
        <path d="M460 190 q60 30 120 0 t140 20 M470 240 q50 -20 110 6 t120 -10 M520 170 q20 40 70 60" stroke="#a7a39c" stroke-width="3" fill="none"/>
        <text x="590" y="294" text-anchor="middle" class="ls-small">Mermer</text>
        ${lsEmoji(520, 352, '🏛️', 44)}<text x="520" y="406" text-anchor="middle" class="ls-small">Bina</text>
        <g transform="translate(660 352)"><circle cx="0" cy="-18" r="14" fill="#f6f4f0" stroke="#a7a39c" stroke-width="3"/><path d="M-18 18 Q-18 -2 0 -2 Q18 -2 18 18 Z" fill="#f6f4f0" stroke="#a7a39c" stroke-width="3"/><rect x="-22" y="18" width="44" height="10" rx="3" fill="#d9d4cf"/></g>
        <text x="660" y="406" text-anchor="middle" class="ls-small">Heykel</text>
      </g>
      ${lsPill(590, 120, 'MERMER', '#5d7a8c', 3)}`);
    },

    'fen-kayac-maden-metals': () => {
      const card = (x, y, step, title, color, icon, lines) => `<g ${lsStep(step, 'ls-rise')}><rect x="${x}" y="${y}" width="360" height="160" rx="22" class="ls-card"/>${icon(x + 70, y + 80)}
        <text x="${x + 140}" y="${y + 52}" class="ls-cap" font-weight="800" style="fill:${color}">${title}</text>
        ${lines.map((t, i) => `<text x="${x + 140}" y="${y + 92 + i * 30}" class="ls-small">${t}</text>`).join('')}</g>`;
      const copper = (x, y) => `${cableIcon(x - 12, y)}`;
      const rail = (x, y) => `<path d="M${x - 40} ${y + 30} L${x - 14} ${y - 34} M${x + 40} ${y + 30} L${x + 14} ${y - 34}" stroke="#6b7680" stroke-width="7" stroke-linecap="round"/>${[-24, -4, 16].map((d, i) => `<rect x="${x - 34 + i * 3}" y="${y + d}" width="${68 - i * 6}" height="7" rx="2" fill="#8a5a2b"/>`).join('')}`;
      const coal = (x, y) => `${rock(x - 18, y + 10, 18, '#2a2a2e', '#111')}${rock(x + 16, y + 14, 15, '#3a3a40', '#111')}${rock(x, y - 14, 14, '#2a2a2e', '#111')}`;
      return lsSvg(`
      ${lsLabel(400, 44, 'Ülkemizin diğer madenleri', 0)}
      ${card(30, 80, 1, 'Bakır', '#c8733d', copper, ['Elektrik kablosu', 'Mutfak eşyası'])}
      ${card(410, 80, 2, 'Demir', '#5d6b78', rail, ['Bina, köprü', 'Tren rayı, otomobil'])}
      ${card(30, 262, 3, 'Altın ve gümüş', '#b8902a', (x, y) => lsEmoji(x, y, '💍', 56), ['Takı', 'Elektronik alet'])}
      ${card(410, 262, 4, 'Taş kömürü, linyit', '#3d4f63', coal, ['Isınma', 'Elektrik üretimi'])}`);
    },

    'fen-kayac-maden-raw': () => {
      const item = (cx, y, step, raw, color, emoji, product, extra = '') => `<g ${lsStep(step, 'ls-rise')}><rect x="${cx - 120}" y="${y}" width="240" height="146" rx="20" class="ls-card"/>
        <rect x="${cx - lsLabelWidth(raw) / 2}" y="${y + 12}" width="${lsLabelWidth(raw)}" height="34" rx="17" fill="${color}"/><text x="${cx}" y="${y + 34}" text-anchor="middle" class="ls-pill">${raw}</text>
        ${arrow(cx, y + 52, cx, y + 76, '#3d4f63', 4)}${lsEmoji(cx, y + 98, emoji, 32)}<text x="${cx}" y="${y + 136}" text-anchor="middle" class="ls-small">${product}</text>${extra}</g>`;
      return lsSvg(`
      ${lsLabel(400, 40, 'Kayaçlar ham maddedir', 0)}
      ${item(140, 70, 1, 'Kum', '#c9963f', '🥛', 'Cam')}
      ${item(400, 70, 2, 'Kil', '#a0522d', '🧱', 'Porselen, tuğla')}
      ${item(660, 70, 2, 'Kireç taşı', '#8a8a8a', '🏗️', 'Çimento')}
      ${item(140, 236, 3, 'Grafit', '#4a4a4a', '✏️', 'Kalem ucu')}
      ${item(400, 236, 3, 'Tungsten', '#6d7b8d', '💡', 'Ampul teli')}
      ${item(660, 236, 4, 'Ağaç', '#2eaa83', '🥄', 'Tahta kaşık', `<line x1="560" y1="370" x2="760" y2="248" stroke="#e25d3f" stroke-width="7" stroke-linecap="round" opacity=".85"/>`)}
      ${lsPill(660, 418, 'Kayaç değil!', '#e25d3f', 4)}`);
    },

    'fen-kayac-maden-dikkat': () => {
      const row = (y, step, icon, term, color, text) => `<g ${lsStep(step, 'ls-rise')}><rect x="40" y="${y}" width="720" height="68" rx="18" class="ls-card"/>${icon(96, y + 34)}
        <text x="150" y="${y + 42}" class="ls-cap" font-weight="800" style="fill:${color}">${term}</text><text x="270" y="${y + 41}" class="ls-small">${text}</text></g>`;
      const mineral = (x, y) => `<polygon points="${x - 18},${y + 8} ${x - 6},${y - 20} ${x + 14},${y - 14} ${x + 20},${y + 10} ${x},${y + 22}" fill="#e8a0a0" stroke="#b5654a" stroke-width="3"/>`;
      const gold = (x, y) => `${rock(x, y, 18)}${[[x - 6, y - 4], [x + 8, y + 4], [x + 2, y - 10]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="5" fill="#f2c94c"/>`).join('')}`;
      const fossil = (x, y) => `<rect x="${x - 30}" y="${y - 22}" width="60" height="44" rx="10" fill="url(#lsStone)"/>${lsSkeleton(x - 2, y, 0.42, '#5d5145')}`;
      return lsSvg(`
      ${lsLabel(400, 44, '⚠️ Dikkat! Karıştırma', 0)}
      ${row(78, 1, mineral, 'Mineral', '#b5654a', 'Kayaçların yapısını oluşturan madde')}
      ${row(156, 2, (x, y) => rock(x, y, 20), 'Kayaç', '#6f6252', 'Minerallerden oluşan kaya ve taş parçası')}
      ${row(234, 3, gold, 'Maden', '#b8902a', 'Ekonomik değeri olan kayaç ya da mineral')}
      ${row(312, 4, fossil, 'Fosil', '#2f6f9f', 'Kayaçta korunmuş, taşlaşmış canlı kalıntısı')}
      ${lsPill(400, 420, 'Her kayaç maden değildir!', '#e25d3f', 3)}`);
    },

    'fen-kayac-maden-summary': () => lsSummary([
      ['🏔️', 'Yer kabuğu|kayaçlardan oluşur'],
      ['🔍', 'Kayaçlar|minerallerden oluşur'],
      ['⛏️', 'Maden: ekonomik|değeri olan kayaç'],
      ['🏭', 'Kayaçlar ve madenler|ham maddedir'],
    ], 'Hazırsan mini teste geçelim!'),
  });
}
