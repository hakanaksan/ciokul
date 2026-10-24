/* CioOkul Mistake Notebook (Hata Defterim) Module */

const mistakesState = {
  data: null,
  activeTab: 'pending', // 'pending' | 'resolved' | 'all'
  selectedCourse: 'all',
  activeScratchQuestion: null
};

async function renderMistakesNotebook() {
  setRoute('#/hata-defteri');
  try {
    mistakesState.data = await api('/api/student/mistakes');
    drawMistakesNotebook();
  } catch (err) {
    showError(err);
  }
}

function drawMistakesNotebook() {
  state.view = 'mistakes';
  const data = mistakesState.data || { mistakes: [], stats: { total: 0, pending: 0, resolved: 0 } };
  const stats = data.stats;

  // Filter items
  let items = data.mistakes;
  if (mistakesState.activeTab === 'pending') {
    items = items.filter(m => !m.resolved_at);
  } else if (mistakesState.activeTab === 'resolved') {
    items = items.filter(m => !!m.resolved_at);
  }

  if (mistakesState.selectedCourse !== 'all') {
    items = items.filter(m => m.course === mistakesState.selectedCourse);
  }

  const courses = ['all', ...new Set(data.mistakes.map(m => m.course))];

  shell(`
    <button class="link-btn back" id="mistakesBack">← Ana sayfaya dön</button>
    <div class="hero">
      <div class="eyebrow">Öğrenci Gelişim & Pekiştirme</div>
      <h1>📓 Hata Defterim</h1>
      <p>Geçmiş çalışmalarda yanlış veya eksik kalan sorularını burada topluyoruz. Soruları tekrar inceleyebilir, üzerinde karalama yaparak yeniden çözebilir ve kavradıkça defterini tamamlayabilirsin!</p>
      
      <div class="stat-row">
        <div class="stat">
          <strong>${stats.pending}</strong>
          <span>Çözülecek Soru</span>
        </div>
        <div class="stat">
          <strong>${stats.resolved}</strong>
          <span>Kavranan Soru</span>
        </div>
        <div class="stat">
          <strong>${stats.total}</strong>
          <span>Toplam Defter Sorusu</span>
        </div>
      </div>
    </div>

    <!-- Navigation & Filters -->
    <div class="card mistake-filter-card">
      <div class="mistake-tabs-row">
        <button class="mistake-tab-btn ${mistakesState.activeTab === 'pending' ? 'active' : ''}" data-tab="pending">
          ⏳ Çözülecekler (${stats.pending})
        </button>
        <button class="mistake-tab-btn ${mistakesState.activeTab === 'resolved' ? 'active' : ''}" data-tab="resolved">
          ✅ Kavradıklarım (${stats.resolved})
        </button>
        <button class="mistake-tab-btn ${mistakesState.activeTab === 'all' ? 'active' : ''}" data-tab="all">
          📑 Tümü (${stats.total})
        </button>
      </div>

      <div class="mistake-courses-row">
        <span class="quick-title">Ders Filtresi:</span>
        <div class="quick-tags">
          ${courses.map(c => `
            <button class="quick-tag-btn ${mistakesState.selectedCourse === c ? 'active' : ''}" data-course="${esc(c)}">
              ${c === 'all' ? 'Tüm Dersler' : esc(c)}
            </button>
          `).join('')}
        </div>
      </div>
    </div>

    <!-- Mistakes List -->
    <div class="mistakes-container">
      ${items.length ? `
        <div class="mistakes-grid">
          ${items.map(m => {
            const isResolved = !!m.resolved_at;
            const imgSrc = m.kind === 'reading' ? `/reading-images/${m.image_path}` : `/question-images/${m.image_path}`;
            return `
              <article class="mistake-card ${isResolved ? 'resolved' : ''}">
                <div class="mistake-card-top">
                  <div class="mistake-meta">
                    <span class="pill blue">${esc(m.course)}</span>
                    <span class="mistake-unit">${esc(m.booklet_title)} · Soru ${m.number}</span>
                  </div>
                  <div class="mistake-badges">
                    ${m.grade === 'incorrect' ? '<span class="pill red">Yanlış</span>' : '<span class="pill amber">Kısmen</span>'}
                    ${m.uncertain ? '<span class="pill purple">Emin Değildim</span>' : ''}
                    ${isResolved ? '<span class="pill green">✓ Kavrandı</span>' : ''}
                  </div>
                </div>

                <div class="mistake-preview" id="mistakePreview-${m.kind}-${m.item_key}">
                  <img src="${esc(imgSrc)}" alt="Soru ${m.number}" loading="lazy" class="mistake-img" data-expand-img="${esc(imgSrc)}">
                </div>

                <!-- Notes & Hints -->
                <div class="mistake-details">
                  ${m.parent_note ? `
                    <div class="mistake-note">
                      <strong>💬 Veli Notu:</strong> ${esc(m.parent_note)}
                    </div>
                  ` : ''}

                  <div class="mistake-info-tags">
                    ${m.reason ? `<span class="pill gray">Neden: ${esc(m.reason)}</span>` : ''}
                    ${m.answer_key ? `<span class="pill green">Doğru Cevap: ${esc(m.answer_key)}</span>` : ''}
                    <span class="muted small">${esc(m.assignment_title)}</span>
                  </div>
                </div>

                <!-- Actions -->
                <div class="mistake-actions">
                  <button class="btn secondary btn-scratch-mistake" data-scratch-kind="${m.kind}" data-scratch-key="${m.item_key}" data-scratch-img="${esc(imgSrc)}">
                    ✏️ Üzerinde Karalama Yap
                  </button>
                  <button class="btn ${isResolved ? 'secondary' : ''} btn-toggle-resolve" data-kind="${m.kind}" data-item-key="${m.item_key}" data-resolved="${isResolved ? 'true' : 'false'}">
                    ${isResolved ? '↩️ Yeniden Listeye Al' : '✅ Anladım & Kavradım'}
                  </button>
                </div>
              </article>
            `;
          }).join('')}
        </div>
      ` : `
        <div class="empty card">
          <h3>🎉 Harika! Bu kategoride çözülecek hata yok.</h3>
          <p>${mistakesState.activeTab === 'pending' ? 'Bütün yanlış sorularını kavradın veya henüz değerlendirilmiş bir hata bulunmuyor.' : 'Henüz bu filtreye uygun soru bulunmuyor.'}</p>
        </div>
      `}
    </div>
  `);

  bindMistakesNotebook();
}

function bindMistakesNotebook() {
  document.querySelector('#mistakesBack')?.addEventListener('click', renderHome);

  // Tabs
  document.querySelectorAll('[data-tab]').forEach(btn => {
    btn.onclick = () => {
      mistakesState.activeTab = btn.dataset.tab;
      drawMistakesNotebook();
    };
  });

  // Course filters
  document.querySelectorAll('[data-course]').forEach(btn => {
    btn.onclick = () => {
      mistakesState.selectedCourse = btn.dataset.course;
      drawMistakesNotebook();
    };
  });

  // Toggle resolve
  document.querySelectorAll('.btn-toggle-resolve').forEach(btn => {
    btn.onclick = async () => {
      const kind = btn.dataset.kind;
      const itemKey = btn.dataset.itemKey;
      const currentResolved = btn.dataset.resolved === 'true';
      const newResolved = !currentResolved;

      try {
        await api('/api/student/mistakes/resolve', {
          method: 'POST',
          body: JSON.stringify({ kind, itemKey, resolved: newResolved })
        });
        // Update local state
        const item = mistakesState.data.mistakes.find(m => m.kind === kind && m.item_key === itemKey);
        if (item) {
          item.resolved_at = newResolved ? new Date().toISOString() : null;
        }
        const resolvedCount = mistakesState.data.mistakes.filter(m => !!m.resolved_at).length;
        mistakesState.data.stats.resolved = resolvedCount;
        mistakesState.data.stats.pending = mistakesState.data.mistakes.length - resolvedCount;
        setFlash(newResolved ? 'Tebrikler! Soru kavrananlar listesine eklendi. 🌟' : 'Soru tekrar çözülecekler listesine alındı.');
        drawMistakesNotebook();
      } catch (err) {
        showError(err);
      }
    };
  });

  // Scratchpad on mistake question
  document.querySelectorAll('.btn-scratch-mistake').forEach(btn => {
    btn.onclick = () => {
      const kind = btn.dataset.scratchKind;
      const itemKey = btn.dataset.scratchKey;
      const previewEl = document.querySelector(`#mistakePreview-${kind}-${itemKey}`);
      if (!previewEl) return;

      if (previewEl.querySelector('.scratchpad-container')) {
        // Close if already open
        previewEl.innerHTML = `<img src="${esc(btn.dataset.scratchImg)}" alt="Soru" loading="lazy" class="mistake-img">`;
        btn.textContent = '✏️ Üzerinde Karalama Yap';
      } else {
        // Mount scratchpad
        const storageKey = `mistake_scratch_${kind}_${itemKey}`;
        previewEl.innerHTML = '';
        initScratchpad(previewEl, btn.dataset.scratchImg, storageKey);
        btn.textContent = '✕ Karalamayı Kapat';
      }
    };
  });
}
