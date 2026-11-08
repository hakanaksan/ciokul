/* Hikâye Kitaplığı: original stories read page by page (with narration that highlights the sentence
   being read) and a closing comprehension quiz. Data: stories.py. */

let storiesCache = null;

async function ensureStories(force = false) {
  if (!storiesCache || force) {
    try { storiesCache = (await api('/api/stories')).stories; } catch (err) { storiesCache = []; }
  }
  return storiesCache;
}

function storyStatus(story) {
  const p = story.progress;
  if (p?.quiz_total) return [`✓ Okundu · ${p.best_score}/${p.quiz_total}`, 'pill'];
  if (p?.opened) return ['Okunuyor · sorular bekliyor', 'pill amber'];
  return ['Yeni', 'pill blue'];
}

function storyMinutes(story) {
  // About 70 words a minute for a careful 4th-grade reader, plus the questions.
  return Math.max(3, Math.round(story.words / 70) + 2);
}

function storiesHomeMarkup(list, isParent, results) {
  if (!list?.length) return '';
  const done = list.filter(s => s.progress?.quiz_total).length;
  const skills = isParent && results?.skills?.length ? `<div class="story-skills">${results.skills.map(s => {
      const percent = Math.round(s.correct / s.total * 100);
      return `<div><strong>${esc(s.name)}</strong><span class="story-skill-bar"><i style="width:${percent}%"></i></span><small>${s.correct}/${s.total} doğru · %${percent}</small></div>`;
    }).join('')}</div>` : '';
  return `<section class="planning-section" id="storiesSection"><div class="section-title"><h2>📚 Hikâye Kitaplığı</h2><span class="pill blue">${done}/${list.length} okundu</span></div>
    <p class="small muted">${isParent ? 'Seviyesine göre özgün hikâyeler: çocuk sayfa sayfa okur ya da dinler, sonra okuduğunu anlama sorularını çözer. Sorular kendiliğinden puanlanır; aşağıda beceri sonuçları görünür.' : 'Bir hikâye seç, oku ya da dinle; sonunda 6 soruyla ne kadar anladığını gör!'}</p>
    ${skills}
    <div class="grid story-grid">${list.map(s => { const [status, klass] = storyStatus(s); return `<article class="card story-card">
      <div class="story-cover" style="background:${esc(s.color)}">${s.cover}</div>
      <div class="card-top"><span class="eyebrow">${esc(s.theme)}</span><span class="${klass}">${esc(status)}</span></div>
      <h3><span aria-hidden="true">${esc(s.icon)}</span> ${esc(s.title)}</h3><p>${esc(s.summary)}</p>
      <p class="small muted"><span class="story-level level-${s.level}">${esc(s.levelName)}</span> · ${s.pages} sayfa · ${s.words} kelime · yaklaşık ${storyMinutes(s)} dk</p>
      <div class="card-actions"><button class="btn" data-story-open="${esc(s.id)}">${s.progress?.quiz_total ? 'Tekrar oku' : s.progress?.opened ? 'Devam et' : 'Oku'} →</button></div></article>`; }).join('')}</div></section>`;
}

function bindStoryLinks(root = document) {
  root.querySelectorAll('[data-story-open]').forEach(button => { button.onclick = () => renderStory(button.dataset.storyOpen); });
}

const storyReader = { story: null, page: 0, sentence: -1, listening: false, quiz: null };

async function renderStory(id) {
  setRoute(`#/hikaye/${id}`);
  try {
    const story = await api(`/api/stories/${encodeURIComponent(id)}`);
    Object.assign(storyReader, { story, page: 0, sentence: -1, listening: false, quiz: null });
    if (state.role === 'student') api(`/api/stories/${encodeURIComponent(id)}/progress`, { method: 'POST', body: '{}' }).catch(() => {});
    drawStoryReader();
  } catch (err) {
    showError(err);
  }
}

function storySentences(page) {
  return page.paragraphs.flat();
}

function drawStoryReader() {
  const { story } = storyReader;
  state.view = 'story';
  shell(`${workHeader({ backId: 'storyBack', backText: 'Ana sayfaya dön', eyebrow: `${story.theme} · ${story.levelName}`, title: story.title, status: `${story.pages.length} sayfa` })}
    <div class="story-reader" id="storyReader">
      <div class="story-toolbar">
        <button type="button" class="btn" id="storyListen">🔊 Dinle</button>
        <label class="lesson-option">Hız <select id="storyRate"><option value="0.85">0.85x</option><option value="1">1x</option><option value="1.2">1.2x</option></select></label>
        <span class="story-page-dots" id="storyDots" role="group" aria-label="Sayfalar">${story.pages.map((p, i) => `<button type="button" data-story-page="${i}" aria-label="${i + 1}. sayfa"></button>`).join('')}<button type="button" class="story-quiz-dot" data-story-quiz aria-label="Sorular">✎</button></span>
      </div>
      <article class="story-page" id="storyPage" aria-live="polite"></article>
      <div class="story-nav">
        <button type="button" class="btn secondary" id="storyPrev">← Önceki sayfa</button>
        <span class="story-page-name" id="storyPageName"></span>
        <button type="button" class="btn" id="storyNext">Sonraki sayfa →</button>
      </div>
      <audio id="storyAudio" preload="auto"></audio>
    </div>
    <p class="small muted story-credit">Bu hikâye CioOkul için özgün olarak yazıldı. Okuyan ses yapay zekâ ile üretildi. Bir cümleye tıklarsan oradan dinlemeye başlar.</p>`);
  const audio = document.querySelector('#storyAudio'), rate = document.querySelector('#storyRate');
  try { rate.value = localStorage.getItem('cioStoryRate') || '1'; } catch (e) { rate.value = '1'; }
  rate.onchange = () => { audio.playbackRate = Number(rate.value); try { localStorage.setItem('cioStoryRate', rate.value); } catch (e) {} };
  document.querySelector('#storyBack').onclick = () => { audio.pause(); renderHome(); };
  document.querySelector('#storyListen').onclick = () => storyToggleListen();
  document.querySelector('#storyPrev').onclick = () => storyGoPage(storyReader.page - 1);
  document.querySelector('#storyNext').onclick = () => storyGoPage(storyReader.page + 1);
  document.querySelectorAll('[data-story-page]').forEach(b => { b.onclick = () => storyGoPage(Number(b.dataset.storyPage)); });
  document.querySelector('[data-story-quiz]').onclick = () => { audio.pause(); storyStartQuiz(); };
  audio.addEventListener('timeupdate', () => storySync(audio.currentTime));
  audio.addEventListener('play', () => { storyReader.listening = true; storyListenLabel(); });
  audio.addEventListener('pause', () => { if (!audio.ended) storyReader.listening = false; storyListenLabel(); });
  audio.addEventListener('ended', () => {
    storySync(Infinity);
    if (storyReader.page < story.pages.length - 1) setTimeout(() => { if (storyReader.listening && !storyReader.quiz) storyGoPage(storyReader.page + 1); }, 800);
    else { storyReader.listening = false; storyListenLabel(); }
  });
  storyBindKeys();
  storyGoPage(0);
  window.scrollTo(0, 0);
}

function storyListenLabel() {
  const button = document.querySelector('#storyListen');
  if (button) button.textContent = storyReader.listening ? '⏸ Durdur' : '🔊 Dinle';
}

function storyToggleListen() {
  const audio = document.querySelector('#storyAudio');
  if (!audio) return;
  if (storyReader.quiz) return;
  if (audio.paused) { storyReader.listening = true; audio.play().catch(() => { storyReader.listening = false; storyListenLabel(); }); }
  else { storyReader.listening = false; audio.pause(); }
}

function storyGoPage(index) {
  const { story } = storyReader;
  const audio = document.querySelector('#storyAudio');
  if (!audio || index < 0) return;
  if (index >= story.pages.length) { audio.pause(); storyStartQuiz(); return; }
  const keepListening = storyReader.listening;
  storyReader.quiz = null;
  storyReader.page = index;
  storyReader.sentence = -1;
  const page = story.pages[index];
  let n = 0;
  document.querySelector('#storyPage').innerHTML = `${index === 0 ? `<div class="story-page-cover" style="background:${esc(story.color)}">${story.cover}</div>` : ''}
    ${page.paragraphs.map(paragraph => `<p>${paragraph.map((sentence, i) =>
      // A line of dialogue (starting with a dash) begins on its own line, as in a printed book.
      `${i && (sentence.startsWith('—') || paragraph[i - 1].startsWith('—')) ? '<br>' : i ? ' ' : ''}<span class="story-sentence" data-sentence="${n++}">${esc(sentence)}</span>`).join('')}</p>`).join('')}`;
  document.querySelector('#storyPageName').textContent = `Sayfa ${index + 1} / ${story.pages.length}`;
  document.querySelector('#storyPrev').disabled = index === 0;
  document.querySelector('#storyNext').textContent = index === story.pages.length - 1 ? 'Sorulara geç →' : 'Sonraki sayfa →';
  document.querySelector('.story-nav').hidden = false;
  document.querySelector('.story-toolbar').hidden = false;
  document.querySelectorAll('[data-story-page]').forEach((b, i) => { b.classList.toggle('done', i < index); b.classList.toggle('current', i === index); });
  document.querySelector('[data-story-quiz]').classList.remove('current');
  document.querySelectorAll('#storyPage [data-sentence]').forEach(span => { span.onclick = () => storyPlayFrom(Number(span.dataset.sentence)); });
  audio.src = `/story-audio/${encodeURIComponent(story.id)}/${page.id}.wav`;
  audio.playbackRate = Number(document.querySelector('#storyRate').value);
  if (keepListening) audio.play().catch(() => {});
  else storyListenLabel();
  document.querySelector('#storyReader').scrollIntoView({ block: 'start', behavior: 'smooth' });
}

function storyPlayFrom(index) {
  const { story } = storyReader;
  const audio = document.querySelector('#storyAudio');
  const timing = story.audio.pages?.[story.pages[storyReader.page].id];
  if (!audio || !timing?.sentences[index]) return;
  audio.currentTime = timing.sentences[index].start;
  storyReader.listening = true;
  audio.play().catch(() => {});
}

function storySync(time) {
  const { story } = storyReader;
  const timing = story.audio.pages?.[story.pages[storyReader.page]?.id];
  if (!timing) return;
  let index = -1;
  if (time !== Infinity) timing.sentences.forEach((s, i) => { if (time >= s.start - 0.05) index = i; });
  if (index === storyReader.sentence) return;
  storyReader.sentence = index;
  document.querySelectorAll('#storyPage [data-sentence]').forEach(span => span.classList.toggle('reading', Number(span.dataset.sentence) === index));
}

let storyKeyHandler = null;
function storyBindKeys() {
  if (storyKeyHandler) window.removeEventListener('keydown', storyKeyHandler);
  storyKeyHandler = e => {
    if (!document.querySelector('#storyReader')) { window.removeEventListener('keydown', storyKeyHandler); storyKeyHandler = null; return; }
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target?.tagName) || storyReader.quiz) return;
    if (e.key === 'ArrowRight') storyGoPage(storyReader.page + 1);
    else if (e.key === 'ArrowLeft') storyGoPage(storyReader.page - 1);
  };
  window.addEventListener('keydown', storyKeyHandler);
}

function storyStartQuiz() {
  const { story } = storyReader;
  document.querySelector('#storyAudio')?.pause();
  storyReader.listening = false;
  storyReader.quiz = { index: 0, answers: [], answered: false };
  document.querySelector('.story-nav').hidden = true;
  document.querySelector('.story-toolbar').hidden = false;
  document.querySelectorAll('[data-story-page]').forEach(b => { b.classList.add('done'); b.classList.remove('current'); });
  document.querySelector('[data-story-quiz]').classList.add('current');
  storyDrawQuestion();
}

function storyDrawQuestion() {
  const { story, quiz } = storyReader;
  const box = document.querySelector('#storyPage');
  if (quiz.index >= story.questions.length) { storyDrawResult(); return; }
  const q = story.questions[quiz.index];
  const score = quiz.answers.filter((a, i) => a === story.questions[i].answer).length;
  box.innerHTML = `<div class="story-quiz"><div class="lesson-quiz-head"><span class="eyebrow">Soru ${quiz.index + 1}/${story.questions.length} · ${esc(story.skills?.[q.skill] || '')}</span><span class="pill">✓ ${score}</span></div>
    <h2>${esc(q.question)}</h2>
    <div class="lesson-options">${q.options.map((o, i) => `<button type="button" data-option="${i}"><span>${'ABCD'[i]}</span>${esc(o)}</button>`).join('')}</div>
    <div id="storyFeedback"></div></div>`;
  box.querySelectorAll('[data-option]').forEach(button => button.onclick = () => {
    if (quiz.answered) return;
    quiz.answered = true;
    const chosen = Number(button.dataset.option), right = chosen === q.answer;
    quiz.answers[quiz.index] = chosen;
    box.querySelectorAll('[data-option]').forEach(b => {
      const i = Number(b.dataset.option);
      b.disabled = true;
      b.classList.toggle('right', i === q.answer);
      b.classList.toggle('wrong', i === chosen && !right);
    });
    const pageIndex = story.pages.findIndex(p => p.id === q.page);
    box.querySelector('#storyFeedback').innerHTML = `<div class="lesson-feedback ${right ? 'right' : 'wrong'}"><strong>${right ? '🎉 Doğru!' : 'Bir daha bakalım.'}</strong> ${esc(q.explain)}</div>
      <div class="toolbar">${pageIndex >= 0 ? `<button type="button" class="btn secondary" data-peek="${pageIndex}">📖 ${pageIndex + 1}. sayfaya bak</button>` : ''}<button type="button" class="btn" data-next-question>${quiz.index + 1 < story.questions.length ? 'Sonraki soru →' : 'Sonucu gör →'}</button></div>`;
    box.querySelector('[data-next-question]').onclick = () => { quiz.index += 1; quiz.answered = false; storyDrawQuestion(); };
    box.querySelector('[data-peek]')?.addEventListener('click', () => storyPeek(pageIndex));
    box.querySelector('[data-next-question]').focus();
  });
}

// Shows a page over the quiz, so the child can look back without losing the place.
function storyPeek(index) {
  const page = storyReader.story.pages[index];
  const wrap = document.createElement('div');
  wrap.className = 'summary-overlay';
  wrap.innerHTML = `<div class="summary-dialog story-peek" role="dialog" aria-modal="true" aria-label="${index + 1}. sayfa"><h2>${index + 1}. sayfa</h2>
    <div class="story-page">${page.paragraphs.map(p => `<p>${esc(p.join(' '))}</p>`).join('')}</div>
    <div class="toolbar"><button type="button" class="btn" data-close>Sorulara dön</button></div></div>`;
  document.body.append(wrap);
  const close = () => wrap.remove();
  wrap.querySelector('[data-close]').onclick = close;
  wrap.addEventListener('pointerdown', e => { if (e.target === wrap) close(); });
  wrap.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  wrap.querySelector('[data-close]').focus();
}

function storyDrawResult() {
  const { story, quiz } = storyReader;
  const total = story.questions.length;
  const score = quiz.answers.filter((a, i) => a === story.questions[i].answer).length;
  const bySkill = {};
  story.questions.forEach((q, i) => {
    bySkill[q.skill] ||= { right: 0, total: 0 };
    bySkill[q.skill].total += 1;
    bySkill[q.skill].right += quiz.answers[i] === q.answer ? 1 : 0;
  });
  const perfect = score === total;
  document.querySelector('#storyPage').innerHTML = `<div class="story-quiz lesson-result"><div class="lesson-result-icon">${perfect ? '🏆' : score >= total / 2 ? '⭐' : '💪'}</div>
    <h2>${score}/${total} doğru</h2>
    <p>${perfect ? 'Harika! Hikâyeyi çok dikkatli okumuşsun.' : score >= total / 2 ? 'Güzel! Yanlış yaptığın soruların sayfalarına bir daha bakabilirsin.' : 'Hikâyeyi bir kez daha okumak çok işe yarar. Sen yaparsın!'}</p>
    <ul class="story-skill-list">${Object.entries(bySkill).map(([key, value]) => `<li><span>${esc(story.skills?.[key] || key)}</span><strong>${value.right}/${value.total}</strong></li>`).join('')}</ul>
    <div class="toolbar"><button type="button" class="btn secondary" data-read-again>📖 Baştan oku</button><button type="button" class="btn secondary" data-quiz-again>Soruları tekrar çöz</button><button type="button" class="btn" data-story-home>Ana sayfaya dön</button></div></div>`;
  const box = document.querySelector('#storyPage');
  box.querySelector('[data-read-again]').onclick = () => storyGoPage(0);
  box.querySelector('[data-quiz-again]').onclick = () => storyStartQuiz();
  box.querySelector('[data-story-home]').onclick = () => renderHome();
  if (state.role === 'student') {
    api(`/api/stories/${encodeURIComponent(story.id)}/progress`, { method: 'POST', body: JSON.stringify({ answers: quiz.answers }) })
      .then(() => ensureStories(true)).catch(err => showError(err));
  }
}
