/* CioOkul Student Progress Report Card Module (Gelişim Karnesi & Veli Bülteni) */

async function renderReportCard(onBack = renderHome) {
  setRoute('#/karne');
  try {
    const [progress, readingProgress, storyResults, badgesData, studyDashboard, authInfo] = await Promise.all([
      api('/api/progress'),
      api('/api/reading/progress'),
      api('/api/stories/results').catch(() => null),
      api('/api/student/badges'),
      api('/api/study/dashboard'),
      api('/api/state')
    ]);

    drawReportCard(progress, reportReading(readingProgress, storyResults), badgesData, studyDashboard, authInfo, onBack);
  } catch (err) {
    showError(err);
  }
}

// Reading for the report: assigned reading work (points given by the parent) and Hikâye Kitaplığı
// stories (auto-scored, latest attempt). The same skill (e.g. "Çıkarım yapma") adds up from both.
function reportReading(readingProgress, storyResults) {
  const attempts = (readingProgress?.attempts || []).filter(a => a.submitted_at);
  const names = { ...(readingProgress?.skillNames || {}) };
  const skills = new Map();
  const add = (key, name, score, possible) => {
    if (!possible) return;
    const s = skills.get(key) || { key, name: names[key] || name || key, score: 0, possible: 0 };
    s.score += score; s.possible += possible; skills.set(key, s);
  };
  for (const s of readingProgress?.skills || []) add(s.skill, names[s.skill], Number(s.earned) || 0, Number(s.possible) || 0);
  for (const s of storyResults?.skills || []) add(s.key, s.name, s.correct, s.total);
  return {
    assignments: attempts.length,
    waiting: attempts.filter(a => a.reviewed < a.total).length,
    stories: storyResults?.stories || [],
    completed: attempts.length + (storyResults?.stories?.length || 0),
    bySkill: [...skills.values()],
  };
}

function drawReportCard(progress, readingProgress, badgesData, studyDashboard, authInfo, onBack) {
  state.view = 'report_card';
  const studentName = authInfo?.studentName || state.studentName || 'Öğrenci';
  const today = new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  const period = new Date().toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });

  // Fasikül reviews and video lesson quizzes together (see courseResults in app.js).
  const results = courseResults(progress);
  const totalQuestions = results.reviewed;
  const overallRate = results.rate;
  const quizzes = progress.lessonQuizzes || [];

  const starsCount = badgesData?.stats?.totalStars || 0;
  const earnedBadgesCount = badgesData?.stats?.earnedCount || 0;

  // Reading skills
  const skills = readingProgress?.bySkill || [];

  // Reasons breakdown
  // /api/study/dashboard sends reasons as [{reason, total}]
  const reasons = Object.fromEntries((studyDashboard?.reasons || []).map(r => [r.reason, r.total]));
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
            <span class="kpi-num">${results.quizzes ? `${results.quizCorrect}/${results.quizTotal}` : '–'}</span>
            <span class="kpi-label">Video Ders Testi (${results.quizzes} ders)</span>
          </div>
          <div class="report-kpi-box">
            <span class="kpi-num">${readingProgress?.completed || 0}</span>
            <span class="kpi-label">Okunan Metin (${readingProgress.assignments} okuma, ${readingProgress.stories.length} hikâye)</span>
          </div>
          <div class="report-kpi-box gold">
            <span class="kpi-num">⭐ ${starsCount}</span>
            <span class="kpi-label">Kazanılan Yıldız (${earnedBadgesCount} Rozet)</span>
          </div>
        </section>

        <!-- Subject Performance Table -->
        <section class="report-section">
          <h2 class="report-sec-title">1. Ders Bazında Soru ve Başarı Dağılımı</h2>
          ${results.rows.length ? `
            <table class="report-table">
              <thead>
                <tr>
                  <th>Ders Adı</th>
                  <th style="text-align:center">Fasikül Sorusu</th>
                  <th style="text-align:center">Doğru</th>
                  <th style="text-align:center">Yanlış / Kısmi</th>
                  <th style="text-align:center">Video Ders Testi</th>
                  <th style="width:170px">Başarı Grafiği</th>
                  <th style="text-align:right">Yüzde</th>
                </tr>
              </thead>
              <tbody>
                ${results.rows.map(c => `
                    <tr>
                      <td><strong>${esc(c.course)}</strong></td>
                      <td style="text-align:center">${c.reviewed}</td>
                      <td style="text-align:center;color:#16a34a;font-weight:600">${c.correct}</td>
                      <td style="text-align:center;color:#dc2626">${c.incorrect + c.partial}</td>
                      <td style="text-align:center">${c.quizzes ? `${c.quizCorrect}/${c.quizTotal}` : '–'}</td>
                      <td>
                        <div class="report-bar-wrap">
                          <div class="report-bar-fill ${c.rate >= 70 ? 'good' : c.rate >= 50 ? 'med' : 'low'}" style="width:${c.rate}%"></div>
                        </div>
                      </td>
                      <td style="text-align:right;font-weight:bold">%${c.rate}</td>
                    </tr>
                  `).join('')}
              </tbody>
            </table>
            <p class="muted report-note">Yüzde, fasikül değerlendirmeleri ile video ders testlerinin birlikte sonucudur (kısmen doğru yarım sayılır; video ders testinde son deneme esas alınır).</p>
          ` : `
            <p class="muted">Henüz değerlendirilmiş fasikül çalışması veya video ders testi bulunmuyor.</p>
          `}
        </section>

        ${quizzes.length ? `
          <section class="report-section">
            <h2 class="report-sec-title">2. Video Ders Testleri</h2>
            <table class="report-table">
              <thead>
                <tr>
                  <th>Ders</th>
                  <th>Video Ders</th>
                  <th style="text-align:center">Son Deneme</th>
                  <th style="text-align:center">En İyi</th>
                  <th style="text-align:right">Yüzde</th>
                </tr>
              </thead>
              <tbody>
                ${quizzes.map(q => `
                  <tr>
                    <td>${esc(q.course)}</td>
                    <td><strong>${esc(q.title)}</strong></td>
                    <td style="text-align:center">${q.score}/${q.total}</td>
                    <td style="text-align:center">${q.best}/${q.total}</td>
                    <td style="text-align:right;font-weight:bold">%${Math.round(q.score / q.total * 100)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </section>
        ` : ''}

        <!-- Reading Skills Breakdown -->
        <section class="report-section">
          <h2 class="report-sec-title">${quizzes.length ? 3 : 2}. Türkçe ve Okuma Becerileri Kazanım Analizi</h2>
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
            <p class="muted report-note">Beceri yüzdeleri, okuma çalışmalarında verilen puanlar ile Hikâye Kitaplığı sorularının (son deneme) birlikte sonucudur.</p>
          ` : `
            <p class="muted">${readingProgress.completed ? 'Okuma becerisi puanı henüz oluşmadı.' : 'Henüz okuma çalışması ya da hikâye tamamlanmadı.'}</p>
          `}
          ${readingProgress.waiting ? `<p class="muted report-note">${readingProgress.waiting} okuma çalışması teslim edildi; puanları veli değerlendirmesinden sonra bu tabloya eklenecek.</p>` : ''}
          ${readingProgress.stories.length ? `
            <table class="report-table" style="margin-top:12px">
              <thead><tr><th>Hikâye Kitaplığı</th><th style="text-align:center">Seviye</th><th style="text-align:center">Son Deneme</th><th style="text-align:center">En İyi</th><th style="text-align:right">Yüzde</th></tr></thead>
              <tbody>${readingProgress.stories.map(s => `<tr><td><strong>${esc(s.title)}</strong></td><td style="text-align:center">${['', 'Kolay', 'Orta', 'Zor'][s.level] || ''}</td><td style="text-align:center">${s.score}/${s.total}</td><td style="text-align:center">${s.best}/${s.total}</td><td style="text-align:right;font-weight:bold">%${Math.round(s.score / s.total * 100)}</td></tr>`).join('')}</tbody>
            </table>` : ''}
        </section>

        <!-- Focus & Difficulty Diagnostics -->
        <section class="report-section">
          <h2 class="report-sec-title">${quizzes.length ? 4 : 3}. Zorlanma Nedenleri ve Pedagojik Teşhis Dağılımı</h2>
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
            <h2 class="report-sec-title">${quizzes.length ? 5 : 4}. Tekrar Edilmesi Önerilen Konu ve Üniteler</h2>
            <div class="weak-units-summary">
              ${progress.weakUnits.slice(0, 4).map(u => `
                <span class="weak-unit-pill">
                  <strong>${esc(u.course)}:</strong> ${esc(u.title)} (Başarı: %${u.reviewed ? Math.round(u.correct / u.reviewed * 100) : 0})
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
