/* CioOkul Student Badges & Motivation Module */

let badgesCache = null;

async function fetchBadges(force = false) {
  if (!badgesCache || force) {
    badgesCache = await api('/api/student/badges');
  }
  return badgesCache;
}

function badgesWidgetMarkup(data) {
  if (!data || !data.badges) return '';
  const { badges, stats } = data;

  return `
    <section class="card badges-showcase-card">
      <div class="badges-header">
        <div>
          <h2>🏆 Başarılarım ve Rozetler</h2>
          <p class="muted small">Çalışmaları tamamladıkça rozetler kazan ve yıldızları topla!</p>
        </div>
        <div class="stars-counter-badge">
          <span class="star-icon">⭐</span>
          <strong>${stats.totalStars}</strong>
          <span>Yıldız</span>
        </div>
      </div>

      <div class="badges-track">
        ${badges.map(b => `
          <div class="badge-item ${b.earned ? 'earned' : 'locked'}" data-badge-id="${esc(b.id)}" title="${esc(b.desc)}">
            <div class="badge-icon-wrap">
              <span class="badge-icon">${b.icon}</span>
              ${b.earned ? '<span class="badge-check">✓</span>' : '<span class="badge-lock">🔒</span>'}
            </div>
            <strong class="badge-title">${esc(b.title)}</strong>
            <span class="badge-progress-tag">${b.earned ? `+${b.stars} ⭐` : esc(b.progress)}</span>
          </div>
        `).join('')}
      </div>
    </section>
  `;
}

function bindBadgesWidget() {
  document.querySelectorAll('[data-badge-id]').forEach(el => {
    el.onclick = () => {
      const badgeId = el.dataset.badgeId;
      const badge = badgesCache?.badges.find(b => b.id === badgeId);
      if (!badge) return;

      const modalHtml = `
        <div class="modal-backdrop" id="badgeModal">
          <div class="modal-card badge-modal-card">
            <div class="badge-modal-icon">${badge.icon}</div>
            <h3>${esc(badge.title)}</h3>
            <p class="badge-modal-desc">${esc(badge.desc)}</p>
            <div class="badge-modal-status">
              ${badge.earned ? `
                <span class="pill green">🎉 Kazanıldı! (+${badge.stars} Yıldız)</span>
              ` : `
                <span class="pill gray">İlerleme: ${esc(badge.progress)} (Kazanıldığında +${badge.stars} ⭐)</span>
              `}
            </div>
            <button class="btn" id="btnCloseBadgeModal">Kapat</button>
          </div>
        </div>
      `;
      const div = document.createElement('div');
      div.innerHTML = modalHtml;
      document.body.appendChild(div.firstElementChild);

      const modal = document.querySelector('#badgeModal');
      const close = () => modal?.remove();
      document.querySelector('#btnCloseBadgeModal')?.addEventListener('click', close);
      modal?.addEventListener('click', (e) => {
        if (e.target === modal) close();
      });
    };
  });
}
