/* CioOkul Student Progress Report Card Module (Gelişim Karnesi & Veli Bülteni) */

async function renderReportCard(onBack = renderHome) {
  setRoute('#/karne');
  try {
    const [progress, readingProgress, badgesData, studyDashboard, authInfo] = await Promise.all([
      api('/api/progress'),
      api('/api/reading/progress'),
      api('/api/student/badges'),
      api('/api/study/dashboard'),
      api('/api/auth')
    ]);

    drawReportCard(progress, readingProgress, badgesData, studyDashboard, authInfo, onBack);
  } catch (err) {
    showError(err);
  }
}

function drawReportCard(progress, readingProgress, badgesData, studyDashboard, authInfo, onBack) {
  state.view = 'report_card';
  const studentName = authInfo?.studentName || 'Cio';
  const today = new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  const period = new Date().toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });

  // Calculate totals
  let totalQuestions = 0;
  let totalCorrect = 0;
  let totalIncorrect = 0;
  let totalPartial = 0;

  progress.byCourse.forEach(c => {
    totalQuestions += c.reviewed;
    totalCorrect += c.correct;
    totalIncorrect += c.incorrect;
    totalPartial += c.partial;
  });

  const overallRate = totalQuestions > 0 ? Math.round(((totalCorrect + totalPartial * 0.5) / totalQuestions) * 100) : 0;
  const starsCount = badgesData?.stats?.totalStars || 0;
  const earnedBadgesCount = badgesData?.stats?.earnedCount || 0;

  // Reading skills
  const skills = readingProgress?.bySkill || [];

  // Reasons breakdown
  const reasons = studyDashboard?.reflectionCounts || {};
  const reasonLabels = {
    attention: 'Dikkat Hatası',
    topic: 'Konuyu Öğrenmeli',
    reading: 'Soruyu Yanlış Okudu',
    method: 'Yöntem Geliştirmeli',
    other: 'Diğer'
  };

  shell(`
    <div class="print-view-wrapper">
      <div class="print-toolbar no-print">
        <button class="link-btn back" id="btnReportBack">← Geri dön</button>
        <div class="print-toolbar-options">
          <button class="btn print-action-btn" id="btnPrintReport">🖨️ A4 Karne Yazdır / PDF Kaydet</button>
        </div>
      </div>

      <article class="print-sheet report-card-sheet">
        <!-- Report Header -->
        <header class="report-header">
          <div class="report-header-brand">
            <span class="report-badge">MEB 4. SINIF ÇALIŞMA MASASI</span>
            <h1>Öğrenci Gelişim Karnesi ve Veli Değerlendirme Bülteni</h1>
            <p class="muted">Yerel Çalışma Masası Bireysel Öğrenme ve Kazanım Takip Raporu</p>
          </div>

          <div class="report-meta-grid">
            <div><span class="label">Öğrenci Adı:</span> <strong>${esc(studentName)}</strong></div>
            <div><span class="label">Sınıf / Düzey:</span> <strong>4. Sınıf</strong></div>
            <div><span class="label">Rapor Dönemi:</span> <strong>${esc(period)}</strong></div>
            <div><span class="label">Rapor Tarihi:</span> <strong>${esc(today)}</strong></div>
          </div>
        </header>

        <!-- KPI Summary Cards -->
        <section class="report-kpi-row">
          <div class="report-kpi-box">
            <span class="kpi-num">${totalQuestions}</span>
            <span class="kpi-label">Değerlendirilen Soru</span>
          </div>
          <div class="report-kpi-box accent">
            <span class="kpi-num">%${overallRate}</span>
            <span class="kpi-label">Genel Başarı Oranı</span>
          </div>
          <div class="report-kpi-box">
            <span class="kpi-num">${readingProgress?.completed || 0}</span>
            <span class="kpi-label">Okunan Metin</span>
          </div>
          <div class="report-kpi-box gold">
            <span class="kpi-num">⭐ ${starsCount}</span>
            <span class="kpi-label">Kazanılan Yıldız (${earnedBadgesCount} Rozet)</span>
          </div>
        </section>

        <!-- Subject Performance Table -->
        <section class="report-section">
          <h2 class="report-sec-title">1. Ders Bazında Soru ve Başarı Dağılımı</h2>
          ${progress.byCourse.length ? `
            <table class="report-table">
              <thead>
                <tr>
                  <th>Ders Adı</th>
                  <th style="text-align:center">Çözülen Soru</th>
                  <th style="text-align:center">Doğru</th>
                  <th style="text-align:center">Yanlış / Kısmi</th>
                  <th style="width:200px">Başarı Grafiği</th>
                  <th style="text-align:right">Yüzde</th>
                </tr>
              </thead>
              <tbody>
                ${progress.byCourse.map(c => {
                  const rate = c.reviewed > 0 ? Math.round(((c.correct + c.partial * 0.5) / c.reviewed) * 100) : 0;
                  return `
                    <tr>
                      <td><strong>${esc(c.course)}</strong></td>
                      <td style="text-align:center">${c.reviewed}</td>
                      <td style="text-align:center;color:#16a34a;font-weight:600">${c.correct}</td>
                      <td style="text-align:center;color:#dc2626">${c.incorrect + c.partial}</td>
                      <td>
                        <div class="report-bar-wrap">
                          <div class="report-bar-fill ${rate >= 70 ? 'good' : rate >= 50 ? 'med' : 'low'}" style="width:${rate}%"></div>
                        </div>
                      </td>
                      <td style="text-align:right;font-weight:bold">%${rate}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          ` : `
            <p class="muted">Henüz değerlendirilmiş fasikül çalışması bulunmuyor.</p>
          `}
        </section>

        <!-- Reading Skills Breakdown -->
        <section class="report-section">
          <h2 class="report-sec-title">2. Türkçe ve Okuma Becerileri Kazanım Analizi</h2>
          ${skills.length ? `
            <div class="report-skills-grid">
              ${skills.map(s => {
                const sRate = s.possible > 0 ? Math.round((s.score / s.possible) * 100) : 0;
                return `
                  <div class="report-skill-card">
                    <div class="skill-name"><strong>${esc(s.name)}</strong></div>
                    <div class="report-bar-wrap" style="margin:6px 0">
                      <div class="report-bar-fill ${sRate >= 70 ? 'good' : sRate >= 50 ? 'med' : 'low'}" style="width:${sRate}%"></div>
                    </div>
                    <div class="skill-bottom">
                      <span>${s.score} / ${s.possible} puan</span>
                      <strong>%${sRate}</strong>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          ` : `
            <p class="muted">Henüz değerlendirilmiş okuma becerileri çalışması bulunmuyor.</p>
          `}
        </section>

        <!-- Focus & Difficulty Diagnostics -->
        <section class="report-section">
          <h2 class="report-sec-title">3. Zorlanma Nedenleri ve Pedagojik Teşhis Dağılımı</h2>
          <div class="report-reasons-row">
            ${Object.entries(reasonLabels).map(([key, label]) => {
              const count = reasons[key] || 0;
              return `
                <div class="report-reason-chip">
                  <span class="reason-label">${esc(label)}</span>
                  <strong class="reason-count">${count} soru</strong>
                </div>
              `;
            }).join('')}
          </div>
        </section>

        <!-- Recommended Review Units & Focus Areas -->
        ${progress.weakUnits && progress.weakUnits.length ? `
          <section class="report-section">
            <h2 class="report-sec-title">4. Tekrar Edilmesi Önerilen Konu ve Üniteler</h2>
            <div class="weak-units-summary">
              ${progress.weakUnits.slice(0, 4).map(u => `
                <span class="weak-unit-pill">
                  <strong>${esc(u.course)}:</strong> ${esc(u.booklet_title)} (Başarı: %${u.rate || 0})
                </span>
              `).join('')}
            </div>
          </section>
        ` : ''}

        <!-- Parent Notes & Signatures -->
        <section class="report-section report-footer-section">
          <div class="report-notes-box">
            <strong>Gelecek Dönem İçin Veli Değerlendirme & Çalışma Notu:</strong>
            <div class="handwriting-ruled-box" style="margin-top:8px;min-height:70px">
              <div class="rule-line"></div>
              <div class="rule-line"></div>
              <div class="rule-line"></div>
            </div>
          </div>

          <div class="report-signatures">
            <div class="sig-col">
              <span>Öğrenci İmzası</span>
              <div class="sig-line"></div>
              <small>${esc(studentName)}</small>
            </div>
            <div class="sig-col">
              <span>Veli / Rehber İmzası</span>
              <div class="sig-line"></div>
              <small>Veli</small>
            </div>
          </div>
        </section>
      </article>
    </div>
  `);

  document.querySelector('#btnReportBack')?.addEventListener('click', () => onBack());
  document.querySelector('#btnPrintReport')?.addEventListener('click', () => window.print());
}
