/* Video lessons: list on the home page, the narrated player and the closing mini quiz. */

let lessonsCache = null;

async function ensureLessons(force = false) {
  if (!lessonsCache || force) {
    try { lessonsCache = (await api('/api/lessons')).lessons; } catch (err) { lessonsCache = []; }
  }
  return lessonsCache;
}

// The video lesson for a question, matched by course and words in the question text.
function lessonForQuestion(course, text) {
  const value = String(text || '').toLocaleLowerCase('tr');
  return (lessonsCache || []).find(l => (!l.match?.course || l.match.course === course)
    && (l.match?.keywords || []).some(k => value.includes(k.toLocaleLowerCase('tr'))));
}

function lessonLinkMarkup(lesson, label = 'Bu konunun video dersini izle') {
  return lesson ? `<button type="button" class="btn secondary lesson-link" data-lesson-open="${esc(lesson.id)}">🎬 ${esc(label)}: ${esc(lesson.title)}</button>` : '';
}

function bindLessonLinks(root = document) {
  root.querySelectorAll('[data-lesson-open]').forEach(button => { button.onclick = () => renderLesson(button.dataset.lessonOpen); });
}

function lessonMinutes(seconds) {
  return seconds ? `${Math.max(1, Math.round(seconds / 60))} dk` : '';
}

function lessonStatus(lesson) {
  const p = lesson.progress;
  if (p?.quiz_total) return [`✓ İzlendi · Test ${p.best_score}/${p.quiz_total}`, 'pill'];
  if (p?.watched) return ['İzlendi · test bekliyor', 'pill amber'];
  return ['Yeni', 'pill blue'];
}

function lessonsHomeMarkup(list, isParent) {
  if (!list?.length) return '';
  return `<section class="planning-section" id="lessonsSection"><div class="section-title"><h2>🎬 Video Dersler</h2></div>
    <p class="small muted">${isParent ? 'MEB kazanımlarına göre hazırlanmış, seslendirmeli ve animasyonlu konu anlatımları. Sonunda kısa bir test vardır.' : 'Zorlandığın konuları seslendirmeli animasyonlarla öğren, sonunda kısa testi çöz!'}</p>
    <div class="grid lesson-grid">${list.map(l => { const [status, klass] = lessonStatus(l); return `<article class="card lesson-card">
      <div class="card-top"><span class="eyebrow">${esc(l.course)} · ${esc(l.kazanim.code)}</span><span class="${klass}">${esc(status)}</span></div>
      <h3>${esc(l.title)}</h3><p>${esc(l.summary)}</p>
      <p class="small muted">${l.scenes} bölüm · ${esc(lessonMinutes(l.duration))} · ${l.progress?.quiz_total ? 'mini test çözüldü' : 'sonunda mini test'}</p>
      <div class="card-actions"><button class="btn" data-lesson-open="${esc(l.id)}">${l.progress?.watched ? 'Tekrar izle' : 'İzle'} →</button></div></article>`; }).join('')}</div></section>`;
}

const lessonPlayer = { lesson: null, scene: 0, sentence: -1, started: false, quiz: null };

async function renderLesson(id) {
  setRoute(`#/ders/${id}`);
  try {
    const lesson = await api(`/api/lessons/${encodeURIComponent(id)}`);
    Object.assign(lessonPlayer, { lesson, scene: 0, sentence: -1, started: false, quiz: null });
    drawLessonPlayer();
  } catch (err) {
    showError(err);
  }
}

function drawLessonPlayer() {
  const { lesson } = lessonPlayer;
  state.view = 'lesson';
  const total = lesson.audio.duration || 0;
  shell(`${workHeader({ backId: 'lessonBack', backText: state.role === 'parent' ? 'Çalışmalara dön' : 'Ana sayfaya dön', eyebrow: `${lesson.course} · ${lesson.kazanim.code}`, title: lesson.title, status: lessonMinutes(total) })}
    <div class="lesson-player" id="lessonPlayer">
      <div class="lesson-stage" id="lessonStage"></div>
      <div class="lesson-caption" id="lessonCaption" aria-live="polite"></div>
      <div class="lesson-timeline" id="lessonTimeline" role="group" aria-label="Bölümler">${lesson.scenes.map((s, i) =>
        `<button type="button" data-lesson-scene="${i}" style="flex-grow:${Math.max(1, Math.round(lesson.audio.scenes[s.id]?.duration || 10))}" title="${i + 1}. ${esc(s.title)}"><span></span></button>`).join('')}
        <button type="button" class="lesson-quiz-segment" data-lesson-quiz title="Mini test">✎</button></div>
      <div class="lesson-controls">
        <button type="button" class="btn secondary" id="lessonPrev" aria-label="Önceki bölüm">⏮</button>
        <button type="button" class="btn" id="lessonPlay">▶ Oynat</button>
        <button type="button" class="btn secondary" id="lessonNext" aria-label="Sonraki bölüm">⏭</button>
        <span class="lesson-scene-name" id="lessonSceneName"></span>
        <label class="lesson-option">Hız <select id="lessonRate"><option value="0.85">0.85x</option><option value="1">1x</option><option value="1.2">1.2x</option></select></label>
        <label class="lesson-option"><input type="checkbox" id="lessonCaptions" checked> Altyazı</label>
        <button type="button" class="link-btn" id="lessonFullscreen">⛶ Tam ekran</button>
      </div>
      <audio id="lessonAudio" preload="auto"></audio>
    </div>
    <details class="card lesson-info"><summary>Bu ders hangi kazanıma göre hazırlandı?</summary><p><strong>${esc(lesson.kazanim.code)} · ${esc(lesson.kazanim.text)}</strong></p><p class="small muted">${esc(lesson.kazanim.note)} Ünite: ${esc(lesson.unit)}.</p><p class="small muted">Dersteki anlatıcı sesi yapay zekâ ile üretildi.</p></details>`);
  const audio = document.querySelector('#lessonAudio'), rate = document.querySelector('#lessonRate');
  try { rate.value = localStorage.getItem('cioLessonRate') || '1'; } catch (e) { rate.value = '1'; }
  rate.onchange = () => { audio.playbackRate = Number(rate.value); try { localStorage.setItem('cioLessonRate', rate.value); } catch (e) {} };
  document.querySelector('#lessonBack').onclick = () => { audio.pause(); renderHome(); };
  document.querySelector('#lessonPlay').onclick = () => lessonTogglePlay();
  document.querySelector('#lessonPrev').onclick = () => lessonGoScene(lessonPlayer.scene - 1, true);
  document.querySelector('#lessonNext').onclick = () => lessonGoScene(lessonPlayer.scene + 1, true);
  document.querySelectorAll('[data-lesson-scene]').forEach(b => { b.onclick = () => lessonGoScene(Number(b.dataset.lessonScene), true); });
  document.querySelector('[data-lesson-quiz]').onclick = () => { audio.pause(); lessonStartQuiz(); };
  document.querySelector('#lessonCaptions').onchange = e => document.querySelector('#lessonCaption').classList.toggle('hidden', !e.target.checked);
  document.querySelector('#lessonFullscreen').onclick = async () => {
    const player = document.querySelector('#lessonPlayer');
    try { if (document.fullscreenElement) await document.exitFullscreen(); else await player.requestFullscreen(); } catch (err) { showError(err); }
  };
  audio.addEventListener('timeupdate', () => lessonSync(audio.currentTime));
  audio.addEventListener('play', () => { document.querySelector('#lessonPlay').textContent = '⏸ Duraklat'; });
  audio.addEventListener('pause', () => { const b = document.querySelector('#lessonPlay'); if (b) b.textContent = '▶ Oynat'; });
  audio.addEventListener('ended', () => {
    if (lessonPlayer.scene < lesson.scenes.length - 1) setTimeout(() => lessonGoScene(lessonPlayer.scene + 1, true), 700);
    else { lessonMarkWatched(); setTimeout(lessonStartQuiz, 900); }
  });
  lessonBindKeys();
  lessonGoScene(0, false);
  lessonShowStart();
  window.scrollTo(0, 0);
}

function lessonShowStart() {
  const stage = document.querySelector('#lessonStage');
  const overlay = document.createElement('button');
  overlay.type = 'button';
  overlay.className = 'lesson-start';
  overlay.innerHTML = `<span class="lesson-start-icon">▶</span><span>Dersi başlat</span>`;
  overlay.onclick = () => { overlay.remove(); lessonPlayer.started = true; lessonGoScene(lessonPlayer.scene, true); };
  stage.append(overlay);
}

function lessonGoScene(index, play) {
  const { lesson } = lessonPlayer;
  const audio = document.querySelector('#lessonAudio');
  if (!audio || index < 0) return;
  if (index >= lesson.scenes.length) { audio.pause(); lessonStartQuiz(); return; }
  document.querySelector('.lesson-start')?.remove();
  lessonPlayer.started = lessonPlayer.started || play;
  lessonPlayer.scene = index;
  lessonPlayer.sentence = -1;
  const scene = lesson.scenes[index];
  const stage = document.querySelector('#lessonStage');
  stage.innerHTML = lessonSceneSvg(scene.visual);
  stage.classList.remove('quiz');
  document.querySelector('#lessonSceneName').textContent = `${index + 1}/${lesson.scenes.length} · ${scene.title}`;
  document.querySelectorAll('[data-lesson-scene]').forEach((b, i) => { b.classList.toggle('done', i < index); b.classList.toggle('current', i === index); });
  audio.src = `/lesson-audio/${encodeURIComponent(lesson.id)}/${scene.id}.wav`;
  audio.playbackRate = Number(document.querySelector('#lessonRate').value);
  lessonSync(0);
  if (play) audio.play().catch(() => {});
}

function lessonSync(time) {
  const { lesson } = lessonPlayer;
  const scene = lesson.scenes[lessonPlayer.scene];
  const timing = lesson.audio.scenes[scene.id];
  if (!scene || !timing) return;
  let index = 0;
  timing.sentences.forEach((s, i) => { if (time >= s.start - 0.05) index = i; });
  const bar = document.querySelector(`[data-lesson-scene="${lessonPlayer.scene}"] span`);
  if (bar) bar.style.width = `${Math.min(100, time / timing.duration * 100)}%`;
  if (index === lessonPlayer.sentence) return;
  lessonPlayer.sentence = index;
  document.querySelector('#lessonCaption').textContent = scene.sentences[index];
  const stage = document.querySelector('#lessonStage');
  // Visible from data-step (default: from the start) until data-hide (default: to the end).
  stage.querySelectorAll('[data-step],[data-hide]').forEach(el => el.classList.toggle('on',
    index >= Number(el.dataset.step || 0) && (el.dataset.hide === undefined || index < Number(el.dataset.hide))));
}

function lessonTogglePlay() {
  const audio = document.querySelector('#lessonAudio');
  if (!audio) return;
  if (lessonPlayer.quiz) { lessonGoScene(0, true); return; }
  if (!lessonPlayer.started) { document.querySelector('.lesson-start')?.click(); return; }
  if (audio.paused) audio.play().catch(() => {}); else audio.pause();
}

let lessonKeyHandler = null;
function lessonBindKeys() {
  if (lessonKeyHandler) window.removeEventListener('keydown', lessonKeyHandler);
  lessonKeyHandler = e => {
    if (!document.querySelector('#lessonPlayer')) { window.removeEventListener('keydown', lessonKeyHandler); lessonKeyHandler = null; return; }
    if (['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes(e.target?.tagName) && e.key === ' ') return;
    if (e.key === ' ' || e.key === 'k') { e.preventDefault(); lessonTogglePlay(); }
    else if (e.key === 'ArrowRight' && !lessonPlayer.quiz) lessonGoScene(lessonPlayer.scene + 1, true);
    else if (e.key === 'ArrowLeft' && !lessonPlayer.quiz) lessonGoScene(lessonPlayer.scene - 1, true);
  };
  window.addEventListener('keydown', lessonKeyHandler);
}

function lessonMarkWatched() {
  if (state.role !== 'student') return;
  api(`/api/lessons/${encodeURIComponent(lessonPlayer.lesson.id)}/progress`, { method: 'POST', body: '{}' }).catch(() => {});
}

function lessonStartQuiz() {
  const { lesson } = lessonPlayer;
  lessonPlayer.quiz = { index: 0, score: 0, answered: false };
  document.querySelectorAll('[data-lesson-scene]').forEach(b => { b.classList.add('done'); b.classList.remove('current'); });
  document.querySelector('[data-lesson-quiz]')?.classList.add('current');
  document.querySelector('#lessonSceneName').textContent = `Mini test · ${lesson.quiz.length} soru`;
  document.querySelector('#lessonCaption').textContent = '';
  lessonDrawQuestion();
}

function lessonDrawQuestion() {
  const { lesson, quiz } = lessonPlayer;
  const stage = document.querySelector('#lessonStage');
  stage.classList.add('quiz');
  if (quiz.index >= lesson.quiz.length) { lessonDrawResult(); return; }
  const q = lesson.quiz[quiz.index];
  stage.innerHTML = `<div class="lesson-quiz"><div class="lesson-quiz-head"><span class="eyebrow">Mini test · ${quiz.index + 1}/${lesson.quiz.length}</span><span class="pill">✓ ${quiz.score}</span></div>
    <h2>${esc(q.question)}</h2>
    <div class="lesson-options">${q.options.map((o, i) => `<button type="button" data-option="${i}"><span>${'ABCD'[i]}</span>${esc(o)}</button>`).join('')}</div>
    <div id="lessonFeedback"></div></div>`;
  stage.querySelectorAll('[data-option]').forEach(button => button.onclick = () => {
    if (quiz.answered) return;
    quiz.answered = true;
    const chosen = Number(button.dataset.option), right = chosen === q.answer;
    if (right) quiz.score += 1;
    stage.querySelectorAll('[data-option]').forEach(b => {
      const i = Number(b.dataset.option);
      b.disabled = true;
      b.classList.toggle('right', i === q.answer);
      b.classList.toggle('wrong', i === chosen && !right);
    });
    const sceneIndex = lesson.scenes.findIndex(s => s.id === q.scene);
    stage.querySelector('#lessonFeedback').innerHTML = `<div class="lesson-feedback ${right ? 'right' : 'wrong'}"><strong>${right ? '🎉 Doğru!' : 'Bir daha düşünelim.'}</strong> ${esc(q.explain)}</div>
      <div class="toolbar">${!right && sceneIndex >= 0 ? `<button type="button" class="btn secondary" data-replay="${sceneIndex}">↺ Bu bölümü tekrar izle</button>` : ''}<button type="button" class="btn" data-next-question>${quiz.index + 1 < lesson.quiz.length ? 'Sonraki soru →' : 'Sonucu gör →'}</button></div>`;
    stage.querySelector('[data-next-question]').onclick = () => { quiz.index += 1; quiz.answered = false; lessonDrawQuestion(); };
    stage.querySelector('[data-replay]')?.addEventListener('click', () => { lessonPlayer.quiz = null; lessonGoScene(sceneIndex, true); });
    stage.querySelector('[data-next-question]').focus();
  });
}

function lessonDrawResult() {
  const { lesson, quiz } = lessonPlayer;
  const total = lesson.quiz.length, perfect = quiz.score === total;
  const stage = document.querySelector('#lessonStage');
  stage.innerHTML = `<div class="lesson-quiz lesson-result"><div class="lesson-result-icon">${perfect ? '🏆' : quiz.score >= total / 2 ? '⭐' : '💪'}</div>
    <h2>${quiz.score}/${total} doğru</h2>
    <p>${perfect ? 'Harika! Fosillerin nasıl oluştuğunu çok iyi öğrendin.' : quiz.score >= total / 2 ? 'Güzel! Yanlış yaptığın soruların bölümlerini tekrar izleyebilirsin.' : 'Videoyu bir kez daha izlemek konuyu pekiştirir. Sen yaparsın!'}</p>
    <div class="toolbar"><button type="button" class="btn secondary" data-replay-all>↺ Videoyu baştan izle</button><button type="button" class="btn secondary" data-quiz-again>Testi tekrar çöz</button><button type="button" class="btn" data-lesson-home>Ana sayfaya dön</button></div></div>`;
  stage.querySelector('[data-replay-all]').onclick = () => { lessonPlayer.quiz = null; lessonGoScene(0, true); };
  stage.querySelector('[data-quiz-again]').onclick = () => lessonStartQuiz();
  stage.querySelector('[data-lesson-home]').onclick = () => renderHome();
  if (state.role === 'student') {
    api(`/api/lessons/${encodeURIComponent(lesson.id)}/progress`, { method: 'POST', body: JSON.stringify({ score: quiz.score, total }) })
      .then(() => ensureLessons(true)).catch(err => showError(err));
  }
}
