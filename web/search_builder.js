/* CioOkul Question Bank Topic Search & Assignment Builder */

const searchState = {
  query: '',
  selectedCourse: 'all',
  courses: ['Matematik', 'Fen Bilimleri', 'Türkçe', 'Sosyal Bilgiler', 'Din Kültürü ve Ahlak Bilgisi', 'İngilizce'],
  results: [],
  selectedQuestions: [],
  title: 'Konu Çalışması',
  dueDate: '',
  loading: false,
  hasSearched: false
};

const QUICK_TOPICS = [
  { label: 'Kesirler', query: 'kesir', course: 'Matematik' },
  { label: 'Doğal Sayılar', query: 'doğal sayı', course: 'Matematik' },
  { label: 'Çevre ve Alan', query: 'çevre', course: 'Matematik' },
  { label: 'Açılar', query: 'açı', course: 'Matematik' },
  { label: 'Işık ve Ses', query: 'ışık', course: 'Fen Bilimleri' },
  { label: 'Kuvvet ve Hareket', query: 'kuvvet', course: 'Fen Bilimleri' },
  { label: 'Madde ve Özellikleri', query: 'madde', course: 'Fen Bilimleri' },
  { label: 'Milli Mücadele', query: 'milli mücadele', course: 'Sosyal Bilgiler' },
  { label: 'Hak ve Sorumluluk', query: 'sorumluluk', course: 'Sosyal Bilgiler' },
  { label: 'Namaz', query: 'namaz', course: 'Din Kültürü ve Ahlak Bilgisi' },
  { label: 'Güzel Ahlak', query: 'ahlak', course: 'Din Kültürü ve Ahlak Bilgisi' },
  { label: 'Okuma & Anlama', query: 'metin', course: 'Türkçe' }
];

async function renderQuestionSearch(initialQuery = '') {
  setRoute('#/soru-ara');
  if (initialQuery) {
    searchState.query = initialQuery;
  }
  if (!searchState.hasSearched && searchState.query) {
    await performQuestionSearch();
  } else {
    drawQuestionSearch();
  }
}

async function performQuestionSearch() {
  searchState.loading = true;
  searchState.hasSearched = true;
  drawQuestionSearch();
  try {
    const params = new URLSearchParams();
    if (searchState.query.trim()) params.set('q', searchState.query.trim());
    if (searchState.selectedCourse && searchState.selectedCourse !== 'all') {
      params.set('course', searchState.selectedCourse);
    }
    params.set('limit', '40');
    const res = await api(`/api/catalog/search?${params.toString()}`);
    searchState.results = res.questions || [];
  } catch (err) {
    showError(err);
  } finally {
    searchState.loading = false;
    drawQuestionSearch();
  }
}

function drawQuestionSearch() {
  state.view = 'search';
  const selCount = searchState.selectedQuestions.length;
  const isFull = selCount >= TEST_SIZE;

  shell(`
    <button class="link-btn back" id="searchBack">← Çalışmalara dön</button>
    <div class="hero">
      <div class="eyebrow">Soru Bankası Arama & Konu Testi</div>
      <h1>Kazanım ve Konu Odaklı Ödev Hazırla</h1>
      <p>3.467 MEB fasikül sorusu içinde anahtar kelime veya konu arayın; istediğiniz soruları seçip tek tıkla öğrenciye ödev olarak atayın.</p>
    </div>

    <section class="card search-control-card">
      <div class="search-input-wrapper">
        <input type="search" id="questionSearchInput" class="search-box-input" placeholder="Konu, kavram veya soru metni arayın (örn. kesirler, kuvvet, milli mücadele)..." value="${esc(searchState.query)}" autocomplete="off">
        <button class="btn" id="btnDoSearch">🔍 Ara</button>
      </div>

      <div class="quick-topics-row">
        <span class="quick-title">Hızlı Konular:</span>
        <div class="quick-tags">
          ${QUICK_TOPICS.map(t => `
            <button class="quick-tag-btn ${searchState.query === t.query ? 'active' : ''}" data-topic-query="${esc(t.query)}" data-topic-course="${esc(t.course)}">
              ${esc(t.label)}
            </button>
          `).join('')}
        </div>
      </div>

      <div class="course-filter-row">
        <button class="course-tab-btn ${searchState.selectedCourse === 'all' ? 'active' : ''}" data-filter-course="all">Tüm Dersler</button>
        ${searchState.courses.map(c => `
          <button class="course-tab-btn ${searchState.selectedCourse === c ? 'active' : ''}" data-filter-course="${esc(c)}">
            ${esc(c)}
          </button>
        `).join('')}
      </div>
    </section>

    <!-- Results Section -->
    <div class="search-results-container">
      <div class="section-title">
        <h2>${searchState.hasSearched ? `Bulunan Sorular (${searchState.results.length})` : 'Arama Sonuçları'}</h2>
        <span class="muted small">${searchState.loading ? 'Aranıyor...' : (searchState.hasSearched && !searchState.results.length ? 'Eşleşen soru bulunamadı' : '')}</span>
      </div>

      ${searchState.loading ? `
        <div class="loading-box">
          <div class="spinner"></div>
          <p>Soru bankası taranıyor...</p>
        </div>
      ` : (
        searchState.results.length ? `
          <div class="search-questions-grid">
            ${searchState.results.map(q => {
              const isSelected = searchState.selectedQuestions.some(sq => sq.id === q.id);
              return `
                <article class="search-q-card ${isSelected ? 'selected' : ''}">
                  <div class="search-q-header">
                    <span class="pill blue">${esc(q.course)}</span>
                    <span class="search-q-loc">${esc(q.booklet_title)} · Soru ${q.number}</span>
                    <button class="btn ${isSelected ? 'danger' : 'secondary'} btn-q-toggle" data-q-id="${q.id}" ${(!isSelected && isFull) ? 'disabled title="En fazla 15 soru seçebilirsiniz"' : ''}>
                      ${isSelected ? '✓ Seçildi (Çıkar)' : '+ Seç'}
                    </button>
                  </div>
                  <div class="search-q-preview">
                    ${q.image_path ? `
                      <img src="/question-images/${esc(q.image_path)}" alt="Soru ${q.number}" loading="lazy" class="search-q-img">
                    ` : `<div class="empty small">Görsel bulunamadı</div>`}
                  </div>
                  ${q.stem ? `
                    <p class="search-q-snippet small muted">${esc(q.stem.slice(0, 140))}${q.stem.length > 140 ? '...' : ''}</p>
                  ` : ''}
                </article>
              `;
            }).join('')}
          </div>
        ` : (
          searchState.hasSearched ? `
            <div class="empty">Bu arama kriterine uygun soru bulunamadı. Lütfen farklı bir arama terimi veya ders filtresi deneyin.</div>
          ` : `
            <div class="empty">Aramak istediğiniz konuyu yukarıya yazın veya yukarıdaki hazır konu etiketlerinden birine tıklayın.</div>
          `
        )
      )}
    </div>

    <!-- Sticky Bottom Assignment Creator -->
    <aside class="search-sticky-tray ${selCount > 0 ? 'visible' : ''}">
      <div class="tray-content">
        <div class="tray-status">
          <strong>Seçilen Sorular:</strong>
          <span class="pill ${selCount === TEST_SIZE ? 'green' : 'blue'}">${selCount} / ${TEST_SIZE} Soru</span>
          ${isFull ? '<span class="pill red">Maksimum sınıra ulaşıldı</span>' : ''}
        </div>

        <div class="tray-inputs">
          <input type="text" id="searchAssignTitle" class="tray-input-title" placeholder="Çalışma Adı" value="${esc(searchState.title)}">
          <input type="date" id="searchAssignDue" class="tray-input-date" value="${esc(searchState.dueDate)}" title="Hedef teslim tarihi">
          <button class="btn ${selCount > 0 ? '' : 'disabled'}" id="btnCreateFromSearch" ${selCount === 0 ? 'disabled' : ''}>
            🚀 Çalışmayı Ata (${selCount} Soru)
          </button>
        </div>
      </div>
      ${selCount > 0 ? `
        <div class="tray-selected-list">
          ${searchState.selectedQuestions.map((sq, idx) => `
            <span class="selected-pill">
              ${idx + 1}. [${esc(sq.course)}] ${esc(sq.booklet_title)} #${sq.number}
              <button class="pill-remove" data-remove-id="${sq.id}" title="Listeden çıkar">✕</button>
            </span>
          `).join('')}
        </div>
      ` : ''}
    </aside>
  `);

  bindQuestionSearch();
}

function bindQuestionSearch() {
  document.querySelector('#searchBack')?.addEventListener('click', renderHome);

  const searchInput = document.querySelector('#questionSearchInput');
  const btnDoSearch = document.querySelector('#btnDoSearch');

  const executeSearch = () => {
    const val = searchInput?.value.trim() || '';
    searchState.query = val;
    if (val && searchState.title === 'Konu Çalışması') {
      searchState.title = `${val.charAt(0).toUpperCase() + val.slice(1)} Konu Çalışması`;
    }
    performQuestionSearch();
  };

  btnDoSearch?.addEventListener('click', executeSearch);
  searchInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      executeSearch();
    }
  });

  // Quick topic buttons
  document.querySelectorAll('[data-topic-query]').forEach(btn => {
    btn.onclick = () => {
      searchState.query = btn.dataset.topicQuery;
      searchState.selectedCourse = btn.dataset.topicCourse;
      searchState.title = `${btn.textContent.trim()} Çalışması`;
      performQuestionSearch();
    };
  });

  // Course filter tabs
  document.querySelectorAll('[data-filter-course]').forEach(btn => {
    btn.onclick = () => {
      searchState.selectedCourse = btn.dataset.filterCourse;
      if (searchState.query.trim()) {
        performQuestionSearch();
      } else {
        drawQuestionSearch();
      }
    };
  });

  // Toggle selection
  document.querySelectorAll('.btn-q-toggle').forEach(btn => {
    btn.onclick = () => {
      const qid = Number(btn.dataset.qId);
      const idx = searchState.selectedQuestions.findIndex(q => q.id === qid);
      if (idx >= 0) {
        searchState.selectedQuestions.splice(idx, 1);
      } else {
        if (searchState.selectedQuestions.length >= TEST_SIZE) {
          showError(new Error(`En fazla ${TEST_SIZE} soru seçebilirsiniz.`));
          return;
        }
        const found = searchState.results.find(q => q.id === qid);
        if (found) {
          searchState.selectedQuestions.push(found);
        }
      }
      drawQuestionSearch();
    };
  });

  // Remove from tray
  document.querySelectorAll('.pill-remove').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const qid = Number(btn.dataset.removeId);
      searchState.selectedQuestions = searchState.selectedQuestions.filter(q => q.id !== qid);
      drawQuestionSearch();
    };
  });

  // Inputs sync
  document.querySelector('#searchAssignTitle')?.addEventListener('input', (e) => {
    searchState.title = e.target.value;
  });
  document.querySelector('#searchAssignDue')?.addEventListener('change', (e) => {
    searchState.dueDate = e.target.value;
  });

  // Create Assignment
  document.querySelector('#btnCreateFromSearch')?.addEventListener('click', async () => {
    if (!searchState.selectedQuestions.length) return;
    const title = searchState.title.trim() || 'Konu Çalışması';
    const ids = searchState.selectedQuestions.map(q => q.id);
    const dueDate = searchState.dueDate.trim() || null;

    try {
      const res = await api('/api/assignments', {
        method: 'POST',
        body: JSON.stringify({ title, questionIds: ids, dueDate })
      });
      setFlash(`"${title}" başarıyla atandı (${ids.length} soru).`);
      searchState.selectedQuestions = [];
      await renderAssignment(res.id);
    } catch (err) {
      showError(err);
    }
  });
}
