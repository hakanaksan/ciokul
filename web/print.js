/* CioOkul Printable Worksheet Module */

const printState = {
  data: null,
  kind: 'test',
  showOptic: true,
  showAnswerKey: false,
  onBack: null
};

async function renderPrintWorksheet(kind, id, onBack) {
  try {
    printState.kind = kind;
    printState.onBack = onBack || renderHome;
    if (kind === 'reading') {
      printState.data = await api(`/api/reading/assignments/${id}`);
    } else {
      printState.data = await api(`/api/assignments/${id}`);
    }
    drawPrintSheet();
  } catch (err) {
    showError(err);
  }
}

function drawPrintSheet() {
  state.view = 'print';
  const d = printState.data;
  const isReading = printState.kind === 'reading';
  const a = d.assignment;
  const isParent = state.role === 'parent';
  const title = isReading ? `${d.readingTitle} · ${a.title}` : a.title;
  const questions = d.questions || [];

  const opticMarkup = () => {
    if (!printState.showOptic || !questions.length) return '';
    return `<div class="print-optic-box">
      <div class="print-optic-title">Optik Cevap Alanı</div>
      <div class="print-optic-grid">
        ${questions.map((q, idx) => `
          <div class="print-optic-row">
            <span class="print-optic-num">${idx + 1}.</span>
            <div class="print-optic-bubbles">
              ${'ABCD'.split('').map(c => `<span class="print-bubble">${c}</span>`).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </div>`;
  };

  const readingPagesMarkup = () => {
    if (!isReading || !d.pages?.length) return '';
    return `<div class="print-reading-pages">
      <div class="print-header-top" style="margin-bottom:6px">
        <strong>Okuma Metni</strong>
        <span class="small muted">Metni dikkatle okuduktan sonra soruları yanıtlayınız.</span>
      </div>
      ${d.pages.map((imgName, i) => `
        <div class="print-reading-page-card">
          <img src="${readingImage(imgName)}" alt="Okuma metni sayfa ${i + 1}">
          <div class="print-reading-page-caption">Sayfa ${i + 1} / ${d.pages.length}</div>
        </div>
      `).join('')}
    </div>
    <div class="print-page-break"></div>`;
  };

  const questionsMarkup = () => {
    return questions.map((q, idx) => {
      const qNum = idx + 1;
      const courseUnit = isReading ? `${d.readingTitle} · Soru ${q.number}` : `${q.course || ''} · ${q.booklet_title || ''} · ${q.number}. Soru`;
      const hasImage = isReading ? !!q.image : !!q.image_path;
      const imgSrc = isReading ? readingImage(q.image) : `/question-images/${encodeURIComponent(q.image_path)}`;
      const isWritten = isReading ? (q.kind === 'written') : (q.kind === 'written');

      return `<article class="print-q-card">
        <div class="print-q-head">
          <strong>${qNum}. Soru</strong>
          <span>${esc(courseUnit)}</span>
        </div>
        ${hasImage ? `<img class="print-q-image" src="${imgSrc}" alt="${qNum}. soru">` : (q.stem ? `<p class="print-q-stem">${esc(q.stem)}</p>` : '')}
        ${isWritten ? `
          <div class="print-handwriting-lines">
            <span class="small muted" style="border:none;margin-bottom:-10px">Cevabınız:</span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        ` : (q.choices && q.choices.length ? `
          <div class="print-q-choices">
            ${q.choices.map(c => `
              <div class="print-choice-item">
                <span class="print-choice-bubble">${c.label}</span>
                <span>${esc(c.text)}</span>
              </div>
            `).join('')}
          </div>
        ` : (isReading && q.options && q.options.length ? `
          <div class="print-q-choices">
            ${q.options.map((opt, oi) => `
              <div class="print-choice-item">
                <span class="print-choice-square">${oi + 1}</span>
                <span>${esc(opt)}</span>
              </div>
            `).join('')}
          </div>
        ` : ''))}
      </article>`;
    }).join('');
  };

  const answerKeyMarkup = () => {
    if (!isParent || !printState.showAnswerKey) return '';
    return `<div class="print-answer-key">
      <div class="print-key-head">✂️ Veli Cevap Anahtarı (Sayfa sonu kontrol listesi)</div>
      <div class="print-key-list">
        ${questions.map((q, idx) => `
          <div>${idx + 1}. Soru: <strong>${esc(q.answer_key || 'Yazılı / Ölçüt')}</strong></div>
        `).join('')}
      </div>
    </div>`;
  };

  shell(`
    <div class="print-view-wrapper">
      <div class="print-toolbar">
        <button class="link-btn back" id="printExit" style="margin-bottom:0">← Geri dön</button>
        <div class="print-toolbar-options">
          <label>
            <input type="checkbox" id="toggleOptic" ${printState.showOptic ? 'checked' : ''}>
            Optik form kutusu
          </label>
          ${isParent ? `
            <label>
              <input type="checkbox" id="toggleKey" ${printState.showAnswerKey ? 'checked' : ''}>
              Veli cevap anahtarı
            </label>
          ` : ''}
        </div>
        <button class="btn" id="triggerPrint">🖨 Yazdır / PDF Kaydet</button>
      </div>

      <div class="print-sheet">
        <header class="print-header">
          <div class="print-header-top">
            <div class="print-logo">✦ CioOkul</div>
            <div class="print-tag">${isReading ? 'Okuma Becerileri' : 'MEB 4. Sınıf Fasikül'}</div>
          </div>
          <div class="print-title">${esc(title)}</div>
          <div class="print-meta-grid">
            <div><strong>Öğrenci:</strong> ............................................................</div>
            <div><strong>Tarih:</strong> ..... / ..... / 202...</div>
            <div><strong>Doğru / Puan:</strong> ...... / ......</div>
          </div>
        </header>

        ${opticMarkup()}
        ${readingPagesMarkup()}
        <div class="print-questions-list">
          ${questionsMarkup()}
        </div>
        ${answerKeyMarkup()}
      </div>
    </div>
  `);

  document.querySelector('#printExit')?.addEventListener('click', () => {
    if (typeof printState.onBack === 'function') {
      printState.onBack();
    } else {
      renderHome();
    }
  });

  document.querySelector('#toggleOptic')?.addEventListener('change', e => {
    printState.showOptic = e.target.checked;
    drawPrintSheet();
  });

  document.querySelector('#toggleKey')?.addEventListener('change', e => {
    printState.showAnswerKey = e.target.checked;
    drawPrintSheet();
  });

  document.querySelector('#triggerPrint')?.addEventListener('click', () => {
    window.print();
  });
}
