/* CioOkul Mixed Quiz Builder Module */

const mixedState = {
  meta: null,
  distribution: {
    "Matematik": 4,
    "Türkçe": 4,
    "Fen Bilimleri": 3,
    "Sosyal Bilgiler": 2,
    "Din Kültürü ve Ahlak Bilgisi": 2
  },
  questions: [],
  title: 'Hafta Sonu Karma Denemesi',
  dueDate: '',
  selectedPreset: 'weekend',
  loading: false
};

async function renderMixedBuilder() {
  try {
    if (!mixedState.meta) {
      mixedState.meta = await api('/api/catalog/mixed-meta');
    }
    if (!mixedState.questions.length) {
      await generateMixedQuestions();
    } else {
      drawMixedBuilder();
    }
  } catch (err) {
    showError(err);
  }
}

async function generateMixedQuestions() {
  mixedState.loading = true;
  drawMixedBuilder();
  try {
    const res = await api('/api/catalog/mixed-generate', {
      method: 'POST',
      body: JSON.stringify({ distribution: mixedState.distribution })
    });
    mixedState.questions = res.questions || [];
  } catch (err) {
    showError(err);
  } finally {
    mixedState.loading = false;
    drawMixedBuilder();
  }
}

function drawMixedBuilder() {
  state.view = 'mixed';
  const meta = mixedState.meta || { courses: [], presets: [] };
  const totalQuestions = Object.values(mixedState.distribution).reduce((sum, n) => sum + (Number(n) || 0), 0);
  const isExact = totalQuestions === TEST_SIZE;

  shell(`
    <button class="link-btn back" id="mixedBack">← Çalışmalara dön</button>
    <div class="hero">
      <div class="eyebrow">Karma Deneme & Genel Tekrar</div>
      <h1>Karma Çalışma Oluşturucu</h1>
      <p>Farklı derslerden soruları harmanlayarak 15 soruluk karma deneme veya hafta sonu tekrarı hazırlayın.</p>
    </div>
    <div id="flash">${flash()}</div>

    <div class="split" style="margin-top:20px">
      <!-- Left Config Section -->
      <section class="card">
        <h3>1. Hızlı Şablonlar</h3>
        <p class="small muted">Tek tıkla dengeli bir ders dağılımı seçebilirsiniz.</p>
        <div class="mixed-preset-grid">
          ${meta.presets.map(p => `
            <div class="mixed-preset-card ${mixedState.selectedPreset === p.id ? 'active' : ''}" data-mixed-preset="${p.id}">
              <strong>${esc(p.name)}</strong>
              <p>${esc(p.desc)}</p>
            </div>
          `).join('')}
        </div>

        <h3>2. Ders Soru Dağılımı</h3>
        <div class="mixed-total-badge ${isExact ? 'exact' : totalQuestions < TEST_SIZE ? 'warn' : 'error'}">
          ${isExact ? `✓ Tam ${TEST_SIZE} Soru Belirlendi` : `Toplam: ${totalQuestions} / ${TEST_SIZE} Soru (Fark: ${TEST_SIZE - totalQuestions})`}
        </div>

        <div class="mixed-dist-list">
          ${meta.courses.map(course => {
            const val = mixedState.distribution[course] || 0;
            return `
              <div class="mixed-dist-row">
                <span>${esc(course)}</span>
                <input type="number" min="0" max="${TEST_SIZE}" value="${val}" class="mixed-dist-input" data-dist-course="${esc(course)}">
              </div>
            `;
          }).join('')}
        </div>

        <div class="toolbar" style="margin: 14px 0 20px">
          <button type="button" class="btn secondary" id="mixedRegenerate" ${totalQuestions > 0 && totalQuestions <= TEST_SIZE ? '' : 'disabled'}>
            🎲 Soruları Yeniden Seç
          </button>
        </div>

        <h3>3. Çalışma Bilgileri</h3>
        <div class="field">
          <label for="mixedTitle">Çalışmanın Adı</label>
          <input id="mixedTitle" maxlength="100" value="${esc(mixedState.title)}">
        </div>
        <div class="field">
          <label for="mixedDueDate">Hedef Tarih (isteğe bağlı)</label>
          <input id="mixedDueDate" type="date" value="${esc(mixedState.dueDate)}">
        </div>

        <button class="btn full" id="mixedSubmit" ${isExact && mixedState.questions.length ? '' : 'disabled'}>
          ${isExact ? `Seçilen ${mixedState.questions.length} Soruluk Karma Testi Ata →` : `Tam 15 Soru Seçin (${totalQuestions}/15)`}
        </button>
      </section>

      <!-- Right Preview Section -->
      <section class="card">
        <div class="card-top">
          <h3>Seçilen Sorular (${mixedState.questions.length} Soru)</h3>
          ${mixedState.loading ? '<span class="pill amber">Sorular getiriliyor...</span>' : '<span class="pill blue">Hazır</span>'}
        </div>
        <p class="small muted">Soru bankasındaki temiz ve onaylanmış sorulardan otomatik seçildi.</p>

        <div class="mixed-preview-list">
          ${mixedState.questions.map((q, idx) => `
            <div class="mixed-q-item">
              <div>
                <div class="card-top" style="margin-bottom:6px">
                  <span class="pill ${q.course.includes('Matematik') ? 'blue' : q.course.includes('Fen') ? 'amber' : 'gray'}">${esc(q.course)}</span>
                  <small style="font-weight:700">${idx + 1}. Soru</small>
                </div>
                <small class="muted" style="display:block;margin-bottom:6px">${esc(q.booklet_title)} · ${q.number}. soru</small>
                ${q.image_path ? `
                  <a class="image-zoom" href="/question-images/${encodeURIComponent(q.image_path)}" target="_blank" rel="noopener">
                    <img class="mixed-q-thumb" loading="lazy" src="/question-images/${encodeURIComponent(q.image_path)}" alt="${q.number}. soru">
                  </a>
                ` : `<p class="small">${esc(q.stem || '')}</p>`}
              </div>
            </div>
          `).join('')}
        </div>
      </section>
    </div>
  `);

  document.querySelector('#mixedBack')?.addEventListener('click', renderHome);

  document.querySelectorAll('[data-mixed-preset]').forEach(card => {
    card.onclick = () => {
      const presetId = card.dataset.mixedPreset;
      const preset = meta.presets.find(p => p.id === presetId);
      if (!preset) return;
      mixedState.selectedPreset = presetId;
      mixedState.distribution = { ...preset.distribution };
      mixedState.title = `${preset.name} · ${localToday()}`;
      generateMixedQuestions();
    };
  });

  document.querySelectorAll('[data-dist-course]').forEach(input => {
    input.oninput = e => {
      const course = input.dataset.distCourse;
      const val = Math.max(0, Math.min(TEST_SIZE, Number(e.target.value) || 0));
      mixedState.distribution[course] = val;
      mixedState.selectedPreset = '';
      drawMixedBuilder();
    };
  });

  document.querySelector('#mixedRegenerate')?.addEventListener('click', () => {
    generateMixedQuestions();
  });

  document.querySelector('#mixedTitle')?.addEventListener('input', e => {
    mixedState.title = e.target.value;
  });

  document.querySelector('#mixedDueDate')?.addEventListener('input', e => {
    mixedState.dueDate = e.target.value;
  });

  document.querySelector('#mixedSubmit')?.addEventListener('click', async () => {
    const title = mixedState.title.trim();
    if (!title) {
      showError(new Error('Çalışma adı girin.'));
      return;
    }
    const questionIds = mixedState.questions.map(q => q.id);
    if (!questionIds.length || questionIds.length > TEST_SIZE) {
      showError(new Error(`1–${TEST_SIZE} soru seçin.`));
      return;
    }
    try {
      const res = await api('/api/assignments', {
        method: 'POST',
        body: JSON.stringify({
          title,
          dueDate: mixedState.dueDate || null,
          questionIds
        })
      });
      setFlash(`“${title}” karma çalışması atandı.`);
      await renderAssignment(res.id);
    } catch (err) {
      showError(err);
    }
  });
}
