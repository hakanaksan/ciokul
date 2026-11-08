/* Bugünün planı: the day's short list of steps (daily_plan.py). Steps tick themselves when the work is done. */

function dailyPlanStep(step, isParent) {
  let icon, detail, action = '';
  if (step.kind === 'test' || step.kind === 'reading') {
    icon = step.kind === 'reading' ? '📖' : '📝';
    detail = step.done ? 'Teslim edildi' : `${step.answered}/${step.total} soru yanıtlandı${step.dueDate ? ` · Hedef: ${uiDueText(step.dueDate)}` : ''}`;
    if (!step.done && !isParent) action = `<button class="btn" data-plan-open="${step.kind}" data-plan-id="${step.id}">${step.answered ? 'Devam et' : 'Başla'} →</button>`;
  } else if (step.kind === 'lesson') {
    icon = '🎬';
    const why = step.reason === 'mistake' ? 'Son yanlışlarınla ilgili video ders' : 'Yeni video ders';
    detail = step.done ? `Mini test çözüldü · ${step.score}/${step.total}` : `${why} · ${step.course} · ${step.minutes} dk`;
    if (!step.done && !isParent) action = `<button class="btn" data-lesson-open="${esc(step.id)}">İzle →</button>`;
  } else if (step.kind === 'story') {
    icon = '📚';
    detail = step.done ? `Sorular çözüldü · ${step.score}/${step.total}` : `Hikâye Kitaplığı · ${step.levelName} · yaklaşık ${step.minutes} dk`;
    if (!step.done && !isParent) action = `<button class="btn" data-story-open="${esc(step.id)}">Oku →</button>`;
  } else {
    icon = '📓';
    detail = `${step.solved}/${step.count} soru çözüldü olarak işaretlendi`;
    if (!step.done && !isParent) action = `<button class="btn" data-plan-mistakes>Aç →</button>`;
  }
  const title = step.kind === 'lesson' ? `Video: ${step.title}` : step.kind === 'story' ? `Hikâye: ${step.title}` : step.kind === 'reading' ? `Okuma: ${step.title}` : step.title;
  return `<li class="plan-step${step.done ? ' done' : ''}"><span class="plan-check" aria-hidden="true">${step.done ? '✓' : icon}</span>
    <span class="plan-text"><strong>${esc(title)}</strong><small>${esc(detail)}</small></span>
    <span class="sr-only">${step.done ? 'Tamamlandı' : 'Yapılacak'}</span>${action}</li>`;
}

function dailyPlanMarkup(plan, { isParent = false, dueCount = 0 } = {}) {
  if (!plan) return '';
  const percent = plan.total ? Math.round(plan.done / plan.total * 100) : 100;
  const heading = isParent ? 'Çocuğun bugünkü planı' : 'Bugünün planı';
  let body;
  if (!plan.total) {
    body = `<p class="plan-free">${isParent ? 'Bugün plana girecek iş yok: atanmış çalışma, hata defterinde soru ya da izlenmemiş video ders kalmadı.' : 'Bugün serbestsin 🎉 Yeni bir çalışma atandığında burada görünecek.'}</p>`;
  } else {
    body = `<div class="plan-bar" role="progressbar" aria-label="Plan ilerlemesi" aria-valuemin="0" aria-valuemax="${plan.total}" aria-valuenow="${plan.done}"><span style="width:${percent}%"></span></div>
      ${plan.complete ? `<p class="plan-complete">${isParent ? '🎉 Bugünün planı tamamlandı.' : '🎉 Bugünün planı tamam! Harika iş çıkardın.'}</p>` : ''}
      <ol class="plan-steps">${plan.steps.map(step => dailyPlanStep(step, isParent)).join('')}</ol>`;
  }
  const settings = isParent ? `<div class="plan-settings"><label>Günlük yük <select id="planSize">${Object.entries(plan.sizes).map(([value, name]) =>
      `<option value="${value}" ${Number(value) === plan.size ? 'selected' : ''}>${esc(name)} (${value} adım)</option>`).join('')}</select></label>
      ${dueCount ? `<button type="button" class="btn secondary" data-go-tab="repeat" data-focus-id="studyDashboard">${dueCount} sorunun tekrar vakti geldi — ata</button>` : ''}</div>
      <p class="small muted">Adımlar iş yapılınca kendiliğinden tiklenir. Plan günün ilk açılışında hazırlanır; gün içinde atanan çalışma, hedef tarihi bugün ise hemen, değilse ertesi gün plana girer.</p>` : '';
  return `<section class="daily-plan${plan.complete ? ' complete' : ''}" id="dailyPlan">
    <div class="plan-head"><div><span class="eyebrow">${esc(uiDate(plan.day))}</span><h2>☀️ ${heading}</h2></div>
    ${plan.total ? `<span class="plan-count">${plan.done} / ${plan.total} ✓</span>` : ''}</div>
    ${body}${settings}${!isParent && !plan.steps.some(step => step.kind === 'mistakes') ? '<div class="toolbar plan-tools"><button type="button" class="btn secondary" data-plan-mistakes>📓 Hata Defterim</button></div>' : ''}</section>`;
}

function bindDailyPlan(root = document) {
  root.querySelectorAll('[data-plan-open]').forEach(button => {
    button.onclick = () => button.dataset.planOpen === 'reading' ? renderReadingAssignment(Number(button.dataset.planId)) : renderAssignment(Number(button.dataset.planId));
  });
  root.querySelectorAll('[data-plan-mistakes]').forEach(button => { button.onclick = () => renderMistakesNotebook(); });
  bindLessonLinks(root.querySelector('#dailyPlan') || root);
  bindStoryLinks(root.querySelector('#dailyPlan') || root);
  root.querySelector('#planSize')?.addEventListener('change', async e => {
    try {
      await api('/api/daily-plan/size', { method: 'PUT', body: JSON.stringify({ size: Number(e.target.value) }) });
      setFlash('Günlük plan büyüklüğü kaydedildi; bugünün planı yeniden hazırlandı.');
      renderHome();
    } catch (err) { showError(err); }
  });
}
