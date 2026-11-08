/* Scenes for the video lesson "Deyimler ve Atasözleri". Loaded when the lesson opens (see loadLessonScenes in lessons.js). */
{
  const PURPLE = '#7b5cc4';
  const T = (x, y, text, size = 24, extra = '', anchor = 'middle') => `<text x="${x}" y="${y}" text-anchor="${anchor}" class="ls-cap" style="font-size:${size}px" ${extra}>${text}</text>`;
  // Parts in [brackets] are coloured.
  const rich = (x, y, src, size, color = PURPLE) => `<text x="${x}" y="${y}" text-anchor="middle" class="ls-cap" style="font-size:${size}px">${src.split(/(\[[^\]]*\])/).filter(Boolean)
    .map(p => p[0] === '[' ? `<tspan style="fill:${color}">${p.slice(1, -1)}</tspan>` : `<tspan>${p}</tspan>`).join('')}</text>`;
  const box = (x, y, w, h, extra = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" class="ls-card" ${extra}/>`;
  const ok = (x, y) => `<circle cx="${x}" cy="${y}" r="15" fill="#2eaa83"/><path d="M${x - 7} ${y} l5 6 l10 -12" stroke="#fff" stroke-width="4.5" fill="none" stroke-linecap="round"/>`;
  const no = (x, y) => `<circle cx="${x}" cy="${y}" r="15" fill="#e25d3f"/><path d="M${x - 6} ${y - 6} l12 12 M${x + 6} ${y - 6} l-12 12" stroke="#fff" stroke-width="4.5" stroke-linecap="round"/>`;
  // A card with an icon, a title (deyim or atasözü, "|" breaks the line) and its meaning in small text.
  const card = (x, y, icon, title, meaning, step, cls = '') => {
    const t = title.split('|'), m = meaning.split('|'), top = y + (t.length > 1 ? 40 : 52);
    return `<g ${lsStep(step, 'ls-rise ' + cls)}>${box(x, y, 360, 145)}${lsEmoji(x + 45, y + 72, icon, 46)}
      ${t.map((line, i) => T(x + 90, top + i * 26, line, 21, `fill="${PURPLE}"`, 'start')).join('')}
      ${m.map((line, i) => `<text x="${x + 90}" y="${top + (t.length - 1) * 26 + 36 + i * 24}" class="ls-small">${line}</text>`).join('')}</g>`;
  };

  Object.assign(LESSON_SCENES, {
    'tr-deyim-atasozu-intro': () => lsSvg(`
      ${lsLabel(400, 50, 'Ağzı kulaklarına vardı!', 0)}
      ${lsKid(150, 330, 1.4, '#e25d3f', '#3b2314')}${lsEmoji(205, 300, '📄', 34)}
      <text x="150" y="436" text-anchor="middle" class="ls-label">Ayşe</text>
      <g ${lsStep(1, 'ls-pop')}><circle cx="355" cy="205" r="22" fill="#e8b48f"/><circle cx="545" cy="205" r="22" fill="#e8b48f"/>
        <circle cx="450" cy="200" r="95" fill="#f2c7a5"/><path d="M370 150 Q450 70 530 150 Q450 115 370 150 Z" fill="#3b2314"/>
        <circle cx="415" cy="180" r="8" fill="#1b2a35"/><circle cx="485" cy="180" r="8" fill="#1b2a35"/>
        <path d="M360 212 Q450 330 540 212 Q450 250 360 212 Z" fill="#b8323a"/><path d="M372 218 Q450 248 528 218 L522 230 Q450 256 378 230 Z" fill="#fff"/></g>
      <g ${lsStep(1, 'ls-pop ls-d2')}><text x="660" y="250" class="ls-big">?</text></g>
      ${lsPill(450, 345, '= çok sevinmek 😄', '#1f9a73', 2)}
      ${lsPill(340, 410, 'Deyimler', PURPLE, 3)}${lsPill(560, 410, 'Atasözleri', '#e8832f', 3, 'ls-d1')}`),

    'tr-deyim-atasozu-deyim': () => lsSvg(`
      ${lsLabel(400, 45, 'DEYİM', 0)}${lsPill(400, 97, 'Kalıplaşmış söz grubu', PURPLE, 0, 'ls-d1')}
      ${lsLabel(400, 150, 'Gerçek anlamından farklı anlam', 1)}
      <g ${lsStep(2, 'ls-rise')}>${box(60, 180, 680, 105)}${lsEmoji(115, 232, '👂', 50)}
        ${T(330, 225, 'kulak vermek', 30, `fill="${PURPLE}"`)}${T(330, 263, '= dikkatle dinlemek', 22)}
        <g>${lsEmoji(600, 232, '👂', 40)}${lsEmoji(650, 232, '🎁', 40)}${lsCross(625, 232, 110)}</g></g>
      <g ${lsStep(3, 'ls-rise')}>${box(60, 305, 340, 60)}${no(95, 335)}${T(245, 343, 'kulak bağışlamak', 22)}<line x1="160" y1="336" x2="330" y2="336" stroke="#e25d3f" stroke-width="3"/></g>
      ${lsLabel(230, 405, 'Kelimeleri değiştirilemez', 3, 'ls-d1')}
      <g ${lsStep(4, 'ls-rise')}>${box(420, 305, 320, 60)}${rich(580, 344, 'göz at[mak] · kulak ver[mek]', 23)}</g>
      ${lsLabel(580, 405, 'Çoğu -mak, -mek ile biter', 4, 'ls-d1')}`),

    'tr-deyim-atasozu-vucut': () => lsSvg(`
      ${lsLabel(400, 42, '🙂 Vücudumuzla ilgili deyimler', 0)}
      ${card(30, 75, '👀', 'Göz atmak', 'kısaca bakmak', 1)}
      ${card(410, 75, '👅', 'Dilinde tüy bitmek', 'aynı şeyi söylemekten|yorulmak', 2)}
      ${card(30, 240, '👃', 'Burnunun dikine gitmek', 'kimseyi dinlemeden|bildiğini yapmak', 3)}
      ${card(410, 240, '😟', 'Başı dara düşmek', 'sıkıntılı bir duruma|düşmek', 4)}`),

    'tr-deyim-atasozu-duygu': () => lsSvg(`
      ${lsLabel(400, 42, '💗 Duyguları anlatan deyimler', 0)}
      ${card(30, 75, '😄', 'Etekleri zil çalmak', 'çok sevinmek', 1)}
      ${card(410, 75, '😡', 'Ateş püskürmek', 'çok öfkelenmek', 2)}
      ${card(30, 240, '🤩', 'İçi içine sığmamak', 'heyecandan yerinde|duramamak', 3)}
      ${card(410, 240, '⏳', 'Dört gözle beklemek', 'çok istekle beklemek', 4)}`),

    'tr-deyim-atasozu-katki': () => lsSvg(`
      ${lsLabel(400, 45, 'Deyimler metne ne katar?', 0)}
      <g ${lsStep(1, 'ls-rise')}>${box(100, 80, 600, 70)}${T(400, 124, 'Ali bütün gece hiç uyumadı.', 26)}</g>
      <g ${lsStep(2, 'ls-drop')}><path d="M400 156 V176 M388 166 L400 180 L412 166" stroke="#3d4f63" stroke-width="5" fill="none" stroke-linecap="round"/></g>
      <g ${lsStep(2, 'ls-rise ls-d1')}>${box(100, 188, 600, 70, `style="stroke:${PURPLE};stroke-width:3"`)}${lsEmoji(135, 223, '✨', 30)}${lsEmoji(665, 223, '✨', 30)}
        ${rich(400, 232, 'Ali bütün gece [gözünü kırpmadı].', 26)}</g>
      ${lsPill(280, 305, '🎨 Daha canlı', '#e8832f', 3)}${lsPill(520, 305, '💪 Daha etkili', '#1f9a73', 3, 'ls-d1')}
      ${lsLabel(400, 385, '🔍 Anlamı cümleden tahmin et', 4)}`),

    'tr-deyim-atasozu-atasozu': () => lsSvg(`
      ${lsLabel(400, 45, 'ATASÖZLERİ', 0)}
      <g ${lsStep(1, 'ls-pop')}>${lsEmoji(105, 190, '👴', 70)}${lsEmoji(195, 190, '👵', 70)}<text x="150" y="262" text-anchor="middle" class="ls-small">atalarımız</text></g>
      ${lsLabel(510, 140, '📜 Atalarımızın deneyimleri', 1)}
      ${lsLabel(510, 205, '👥 Kimin söylediği bilinmez', 2)}
      ${lsPill(510, 270, '💡 Öğüt veren tam cümle', '#e8832f', 3)}
      <g ${lsStep(4, 'ls-rise')}>${box(60, 312, 680, 100)}${T(330, 372, 'Damlaya damlaya göl olur.', 28, 'fill="#c0641c"')}
        <ellipse cx="650" cy="385" rx="70" ry="16" fill="#4fb3e8"/>
        <g class="ls-rain"><circle cx="615" cy="335" r="6" fill="#4fb3e8"/><circle cx="650" cy="325" r="6" fill="#4fb3e8"/><circle cx="685" cy="340" r="6" fill="#4fb3e8"/></g></g>`),

    'tr-deyim-atasozu-ornek': () => lsSvg(`
      ${lsLabel(400, 42, '📚 Atasözlerini tanıyalım', 0)}
      ${card(30, 75, '👐', 'Bir elin nesi var,|iki elin sesi var.', 'Birlikte çalışınca|iş kolaylaşır.', 1)}
      ${card(410, 75, '🔨', 'İşleyen demir|ışıldar.', 'Çalışan insan|gelişir, parlar.', 2)}
      ${card(30, 240, '🌾', 'Sakla samanı,|gelir zamanı.', 'Gereksiz görünen şey|bir gün işe yarar.', 3)}
      ${card(410, 240, '🤝', 'Dost kara günde|belli olur.', 'Gerçek dost zor|günde yanındadır.', 4)}`),

    'tr-deyim-atasozu-metin': () => {
      const options = ['A) Damlaya damlaya göl olur.', 'B) Üzüm üzüme baka baka kararır.', 'C) Sakla samanı, gelir zamanı.'];
      return lsSvg(`
      ${lsLabel(400, 42, '📝 Metne uygun atasözü', 0)}
      <g ${lsStep(1, 'ls-rise')}>${box(40, 72, 720, 92)}${T(400, 110, 'Can, tembel arkadaşlarıyla gezmeye başlayınca', 22)}${T(400, 142, 'o da derslerini aksatmaya başladı.', 22)}</g>
      ${lsPill(400, 197, 'İnsan arkadaşından etkilenir', PURPLE, 2)}
      ${options.map((o, i) => `<g ${lsStep(3, 'ls-rise ls-d' + i)}>${box(130, 222 + i * 52, 540, 44)}${T(400, 251 + i * 52, o, 21)}</g>`).join('')}
      <g ${lsStep(3, 'ls-pop ls-d4')}><rect x="130" y="274" width="540" height="44" rx="18" fill="none" stroke="#2eaa83" stroke-width="5"/>${ok(700, 296)}</g>
      ${lsLabel(400, 414, '🔍 Önce ana düşünce, sonra atasözü', 4)}`);
    },

    'tr-deyim-atasozu-dikkat': () => lsSvg(`
      ${lsPill(400, 42, '⚠️ DİKKAT!', '#d9472b', 0)}${lsLabel(400, 92, 'Deyim mi, atasözü mü?', 0, 'ls-d1')}
      <g ${lsStep(1, 'ls-rise')}>${box(40, 122, 345, 150)}${T(212, 158, 'DEYİM', 24, `fill="${PURPLE}"`)}
        <text x="212" y="192" text-anchor="middle" class="ls-small">söz grubudur, öğüt vermez</text>${T(212, 240, 'Etekleri zil çalmak', 22)}</g>
      <g ${lsStep(2, 'ls-rise')}>${box(415, 122, 345, 150)}${T(587, 158, 'ATASÖZÜ', 24, 'fill="#c0641c"')}
        <text x="587" y="192" text-anchor="middle" class="ls-small">öğüt veren tam cümledir</text>${T(587, 240, 'Akan su yosun tutmaz.', 22)}</g>
      <g ${lsStep(3, 'ls-rise')}>${box(40, 290, 345, 115)}${lsEmoji(80, 330, '🦷', 36)}${T(230, 338, 'Dişini fırçaladı.', 22)}
        ${no(80, 378)}<text x="108" y="384" class="ls-small">gerçek anlam: deyim değil</text></g>
      <g ${lsStep(4, 'ls-rise')}>${box(415, 290, 345, 115)}${lsEmoji(455, 330, '😬', 36)}${T(605, 338, 'Dişini sıkmak', 22, `fill="${PURPLE}"`)}
        ${ok(455, 378)}<text x="483" y="384" class="ls-small">sabırla katlanmak: deyim</text></g>`),

    'tr-deyim-atasozu-summary': () => lsSummary([['🗣️', 'Deyim: kalıplaşmış|söz grubu'], ['🎭', 'Çoğu zaman gerçek|anlamından farklı'], ['👴', 'Atasözü: öğüt veren|tam bir cümle'], ['🔍', 'Önce metnin|ana fikrini bul']], 'Hazırsan mini teste geçelim!'),
  });
}
