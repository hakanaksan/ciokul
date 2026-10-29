/* CioOkul Student Badges & Motivation Module: levels, tiered badges, collection page and celebrations */

let badgesCache = null;

async function fetchBadges(force = false) {
  if (!badgesCache || force) {
    badgesCache = await api('/api/student/badges');
  }
  return badgesCache;
}

const BADGE_TIERS = ['', 'bronze', 'silver', 'gold'];

function badgeTierClass(b) {
  return b.tier ? BADGE_TIERS[b.tier] : 'locked';
}

// One dot per goal; filled dots are the reached tiers.
function badgeMedalsMarkup(b) {
  return `<span class="badge-medals" aria-label="${b.tier}/${b.maxTier} basamak">${b.goals.map((_, i) =>
    `<i class="${i < b.tier ? BADGE_TIERS[i + 1] : ''}"></i>`).join('')}</span>`;
}

function badgeProgressMarkup(b) {
  if (!b.nextGoal) return '<div class="badge-progress done"><span style="width:100%"></span></div>';
  const previous = b.tier ? b.goals[b.tier - 1] : 0;
  const percent = Math.max(0, Math.min(100, (b.value - previous) / (b.nextGoal - previous) * 100));
  return `<div class="badge-progress" role="progressbar" aria-valuemin="0" aria-valuemax="${b.nextGoal}" aria-valuenow="${Math.min(b.value, b.nextGoal)}"><span style="width:${percent}%"></span></div>`;
}

function badgeLevelMarkup(data) {
  const { level, totalStars } = data.stats;
  const span = level.next ? level.next - level.from : 1;
  const percent = level.next ? Math.min(100, (totalStars - level.from) / span * 100) : 100;
  return `<div class="badge-level-card">
      <div class="badge-level-head"><span class="badge-level-number">Seviye ${level.number}</span><strong>${esc(level.name)}</strong><span class="badge-level-stars">⭐ ${totalStars}</span></div>
      <div class="badge-level-bar"><span style="width:${percent}%"></span></div>
      <p class="small muted">${level.next ? `Sonraki seviye <strong>${esc(level.nextName)}</strong> · ${level.next - totalStars} yıldız kaldı` : 'En yüksek seviyeye ulaştın!'}</p>
    </div>`;
}

function badgeStreakMarkup(data, isParent) {
  const { current, best } = data.streak || {};
  if (current) return `<div class="badge-streak">🔥 <strong>${current} günlük seri!</strong> ${isParent ? 'Her gün bir çalışma teslim edildi.' : 'Yarın da bir çalışma teslim edersen serin sürer.'}</div>`;
  if (best) return `<div class="badge-streak quiet">🔥 En uzun seri: ${best} gün. ${isParent ? '' : 'Bugün bir çalışma teslim ederek yeni bir seri başlat!'}</div>`;
  return '';
}

// Closest unfinished tiers first, so the student sees what is almost done.
function badgeNextGoals(badges, count = 3) {
  const previous = b => (b.tier ? b.goals[b.tier - 1] : 0);
  return badges.filter(b => b.nextGoal)
    .map(b => ({ b, ratio: (b.value - previous(b)) / (b.nextGoal - previous(b)) }))
    .sort((x, y) => y.ratio - x.ratio || x.b.nextGoal - y.b.nextGoal)
    .slice(0, count).map(x => x.b);
}

function badgeGoalMarkup(b) {
  const nextTier = ['Bronz', 'Gümüş', 'Altın'][b.tier] || '';
  return `<button type="button" class="badge-goal" data-badge-id="${esc(b.id)}">
      <span class="badge-goal-icon ${badgeTierClass(b)}">${b.icon}</span>
      <span class="badge-goal-text"><strong>${esc(b.title)}</strong><small>${esc(b.desc)}</small>${badgeProgressMarkup(b)}<small class="badge-goal-count">${esc(b.progress)} · ${nextTier} basamağı</small></span>
    </button>`;
}

function badgeTileMarkup(b) {
  return `<button type="button" class="badge-item ${b.earned ? 'earned' : 'locked'} tier-${badgeTierClass(b)}" data-badge-id="${esc(b.id)}" title="${esc(b.desc)}">
      <span class="badge-icon-wrap"><span class="badge-icon">${b.icon}</span>${b.earned ? '' : '<span class="badge-lock">🔒</span>'}</span>
      <strong class="badge-title">${esc(b.title)}</strong>
      ${badgeMedalsMarkup(b)}
      <span class="badge-progress-tag">${b.earned ? `${esc(b.tierName)} · +${b.stars} ⭐` : esc(b.progress)}</span>
    </button>`;
}

function badgesWidgetMarkup(data, isParent = false) {
  if (!data || !data.badges) return '';
  const earned = data.badges.filter(b => b.earned).sort((x, y) => y.tier - x.tier);
  return `
    <section class="card badges-showcase-card">
      <div class="badges-header">
        <div>
          <h2>🏆 ${isParent ? 'Öğrencinin rozetleri' : 'Başarılarım ve Rozetler'}</h2>
          <p class="muted small">${isParent ? 'Çalışmalar tamamlandıkça kazanılan rozetler, yıldızlar ve seviye.' : 'Çalışmaları tamamladıkça rozetler kazan, yıldız topla ve seviye atla!'}</p>
        </div>
        <button type="button" class="btn secondary" data-open-badges>Tüm rozetler (${data.stats.earnedCount}/${data.stats.totalCount}) →</button>
      </div>
      ${badgeLevelMarkup(data)}
      ${badgeStreakMarkup(data, isParent)}
      <h3 class="badges-subtitle">Sıradaki hedefler</h3>
      <div class="badge-goals">${badgeNextGoals(data.badges).map(badgeGoalMarkup).join('')}</div>
      <h3 class="badges-subtitle">${isParent ? 'Kazanılan rozetler' : 'Kazandığın rozetler'} (${data.stats.earnedCount}/${data.stats.totalCount})</h3>
      ${earned.length ? `<div class="badges-track">${earned.slice(0, 8).map(badgeTileMarkup).join('')}</div>` : `<p class="small muted">${isParent ? 'Henüz rozet yok.' : 'İlk çalışmanı teslim ettiğinde ilk rozetin burada parlayacak!'}</p>`}
    </section>
  `;
}

function badgeDetailOpen(b) {
  const goals = b.goals.map((goal, i) => {
    const name = ['Bronz', 'Gümüş', 'Altın'][i];
    return `<li class="${i < b.tier ? 'reached ' + BADGE_TIERS[i + 1] : ''}"><span>${name}</span><strong>${goal}</strong>${i < b.tier ? '<em>✓ kazanıldı</em>' : ''}</li>`;
  }).join('');
  const wrap = document.createElement('div');
  wrap.className = 'summary-overlay';
  wrap.innerHTML = `<div class="summary-dialog badge-detail" role="dialog" aria-modal="true" aria-label="${esc(b.title)}">
      <div class="badge-detail-icon ${badgeTierClass(b)}">${b.icon}</div>
      <h2>${esc(b.title)}</h2>
      ${b.earned ? `<span class="pill">${esc(b.tierName)} · +${b.stars} ⭐</span>` : '<span class="pill gray">Henüz kazanılmadı</span>'}
      <p>${esc(b.nextGoal ? b.desc : 'Bu rozetin bütün basamaklarını tamamladın!')}</p>
      ${badgeProgressMarkup(b)}<p class="small muted">${esc(b.progress)}</p>
      <ul class="badge-detail-goals">${goals}</ul>
      <button type="button" class="btn" data-close>Kapat</button>
    </div>`;
  document.body.append(wrap);
  const close = () => wrap.remove();
  wrap.querySelector('[data-close]').onclick = close;
  wrap.querySelector('[data-close]').focus();
  wrap.addEventListener('pointerdown', e => { if (e.target === wrap) close(); });
  wrap.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
}

function bindBadgesWidget(data = badgesCache) {
  if (data) badgesCache = data;
  document.querySelectorAll('[data-badge-id]').forEach(el => {
    el.onclick = () => {
      const badge = badgesCache?.badges.find(b => b.id === el.dataset.badgeId);
      if (badge) badgeDetailOpen(badge);
    };
  });
  document.querySelectorAll('[data-open-badges]').forEach(button => { button.onclick = () => renderBadgeCollection(); });
}

async function renderBadgeCollection() {
  setRoute('#/rozetler');
  try {
    const data = await fetchBadges(true);
    const isParent = state.role === 'parent';
    state.view = 'badges';
    const sections = Object.entries(data.categories).map(([key, label]) => {
      const items = data.badges.filter(b => b.category === key);
      const earned = items.filter(b => b.earned).length;
      return `<section class="badge-category"><div class="section-title"><h2>${esc(label)}</h2><span class="pill blue">${earned}/${items.length}</span></div>
        <div class="badge-collection-grid">${items.map(b => `<button type="button" class="badge-card tier-${badgeTierClass(b)}" data-badge-id="${esc(b.id)}">
          <span class="badge-card-icon">${b.icon}</span>
          <span class="badge-card-body"><strong>${esc(b.title)}</strong>${badgeMedalsMarkup(b)}<small>${esc(b.nextGoal ? b.desc : 'Bütün basamaklar tamam!')}</small>${badgeProgressMarkup(b)}<small class="badge-goal-count">${b.earned ? `${esc(b.tierName)} · ` : ''}${esc(b.progress)}</small></span>
        </button>`).join('')}</div></section>`;
    }).join('');
    shell(`${workHeader({ backId: 'badgesBack', backText: isParent ? 'Çalışmalara dön' : 'Ana sayfaya dön', eyebrow: 'Rozet koleksiyonu', title: isParent ? 'Öğrencinin rozetleri' : 'Rozetlerim', status: `${data.stats.earnedTiers}/${data.stats.totalTiers} basamak` })}
      <div class="badge-collection-top">${badgeLevelMarkup(data)}${badgeStreakMarkup(data, isParent)}</div>
      ${sections}`);
    document.querySelector('#badgesBack').onclick = renderHome;
    bindBadgesWidget(data);
  } catch (err) {
    showError(err);
  }
}

// Shown on the student's home page when tiers were reached since the last celebration.
function badgesCelebrate(data) {
  const fresh = data?.newlyEarned || [];
  if (!fresh.length || document.querySelector('.badge-celebration')) return;
  const colors = ['#f5c518', '#2eaa83', '#e25d3f', '#4c8be6', '#b06ad9', '#f28c28'];
  const confetti = Array.from({ length: 36 }, (_, i) =>
    `<i style="left:${(i * 37) % 100}%;background:${colors[i % colors.length]};animation-delay:${(i % 9) * 0.12}s;animation-duration:${2.4 + (i % 5) * 0.35}s"></i>`).join('');
  const shown = fresh.slice(0, 6);
  const wrap = document.createElement('div');
  wrap.className = 'summary-overlay badge-celebration';
  wrap.innerHTML = `<div class="badge-confetti" aria-hidden="true">${confetti}</div>
    <div class="summary-dialog badge-celebration-dialog" role="dialog" aria-modal="true" aria-label="Yeni rozet">
      <div class="badge-celebration-burst">🎉</div>
      <h2>${fresh.length === 1 ? 'Yeni rozet kazandın!' : `${fresh.length} yeni rozet kazandın!`}</h2>
      <div class="badge-celebration-list">${shown.map(b => `<div class="badge-celebration-item"><span class="badge-card-icon">${b.icon}</span><strong>${esc(b.title)}</strong>${b.tierName ? `<span class="pill">${esc(b.tierName)}</span>` : ''}</div>`).join('')}</div>
      ${fresh.length > shown.length ? `<p class="small muted">ve ${fresh.length - shown.length} rozet daha…</p>` : ''}
      <p class="badge-level-line">Seviye ${data.stats.level.number} · <strong>${esc(data.stats.level.name)}</strong> · ⭐ ${data.stats.totalStars}</p>
      <div class="toolbar"><button type="button" class="btn secondary" data-see-all>Rozetlerime bak</button><button type="button" class="btn" data-done>Harika!</button></div>
    </div>`;
  document.body.append(wrap);
  const finish = async next => {
    wrap.remove();
    try { await api('/api/student/badges/seen', { method: 'POST', body: '{}' }); } catch (err) { /* shown again next time */ }
    if (next) next();
  };
  wrap.querySelector('[data-done]').onclick = () => finish();
  wrap.querySelector('[data-see-all]').onclick = () => finish(renderBadgeCollection);
  wrap.querySelector('[data-done]').focus();
}
