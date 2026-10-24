const readingState={data:null,index:0,mode:'text',sideText:false};
const readingFeedbackTemplates=[
  ['Metinden kanıt','Cevabını metindeki bir cümleyle destekle.'],
  ['Açıklamayı genişlet','Bu sonuca nasıl vardığını bir cümleyle açıkla.'],
  ['Görseli yeniden incele','Tablo veya şemadaki bilgileri yeniden karşılaştır.'],
  ['Güçlü yön','Metindeki ipucunu doğru kullanmışsın.']
];
const readingImage=name=>`/reading-images/${encodeURIComponent(name)}`;
const readingAudioUrl=sectionId=>`/reading-audio/R${String(sectionId).padStart(2,'0')}.wav`;
const readingAudioRate=()=>localStorage.getItem('cioAudioRate')||'1';
function readingAudioMarkup(sectionId){
  return `<div class="reading-audio-bar card"><span class="reading-audio-title">🔊 Metni dinle</span><audio controls preload="none" src="${readingAudioUrl(sectionId)}"></audio><label class="reading-audio-rate">Hız <select id="readingAudioRate"><option value="0.8">0.8x</option><option value="1">1x</option><option value="1.25">1.25x</option></select></label></div>`;
}
function bindReadingAudio(){
  const audio=document.querySelector('.reading-audio-bar audio'),select=document.querySelector('#readingAudioRate');
  const mini=document.querySelector('.reading-audio-mini audio');
  const rate=Number(readingAudioRate());
  if(mini)mini.playbackRate=rate;
  if(!audio||!select)return;
  select.value=readingAudioRate();
  const apply=()=>{audio.playbackRate=Number(select.value);try{localStorage.setItem('cioAudioRate',select.value)}catch(e){}};
  select.onchange=apply;apply();
}
function readingHomeMarkup(list,isParent,progress){
  return `<section class="planning-section"><div class="section-title"><h2>Okuma Becerileri</h2>${isParent?'<div class="toolbar"><button class="btn secondary" id="readingAudit">Görselleri denetle</button><button class="btn" id="newReading">+ Okuma çalışması ata</button></div>':''}</div>
    <p class="small muted">Metni oku, soruları çöz, yazılı yanıtları birlikte değerlendir.</p>
    ${list.length?`<div class="grid">${list.map(a=>{const [status,klass]=assignmentStatus(a);return `<article class="card"><div class="card-top"><span class="eyebrow">${esc(a.reading_title)} · ${a.total} soru</span><span class="${klass}">${esc(status)}</span></div><h3>${esc(a.title)}</h3><p>${a.submitted_at?'Teslim edildi':'Çözülmeyi bekliyor'}${a.due_date?` · Hedef: ${esc(uiDueText(a.due_date,!!a.submitted_at))}`:''}</p><div class="card-actions"><button class="btn secondary" data-reading-open="${a.id}">${isParent?'Aç ve kontrol et':'Çalışmayı aç'} →</button><button class="link-btn" data-reading-print="${a.id}">Yazdır</button>${isParent?`<button class="link-btn" data-reading-rename="${a.id}">Adı değiştir</button><button class="link-btn" data-reading-due="${a.id}">Hedef tarih</button><button class="link-btn danger" data-reading-delete="${a.id}">Sil</button>`:''}</div></article>`}).join('')}</div>`:'<div class="empty">Henüz okuma çalışması atanmadı.</div>'}${isParent?readingProgressMarkup(progress):''}</section>`;
}
function readingProgressMarkup(progress){
  if(!progress)return '';
  const reviewed=progress.attempts.filter(a=>a.reviewed),ranked=[...progress.skills].filter(x=>x.possible).sort((a,b)=>a.earned/a.possible-b.earned/b.possible);
  return `<details class="card reading-progress"><summary>Okuma ilerlemesi · ${reviewed.length} değerlendirilmiş çalışma</summary>${reviewed.length?`<p class="small muted">Beceri etiketleri tahminidir; görsel denetim ekranında düzeltilebilir. Tekrar için en düşük puanlı beceriden başlayabilirsiniz.</p>${ranked.length?`<div class="reading-skill-grid">${ranked.map(x=>`<div class="reading-skill-item"><strong>${esc(progress.skillNames[x.skill]||x.skill)}</strong><span>${x.earned}/${x.possible} puan · %${Math.round(x.earned/x.possible*100)}</span><div class="progress"><span style="width:${x.earned/x.possible*100}%"></span></div></div>`).join('')}</div><p class="small muted">Tekrar önerisi: ${esc(progress.skillNames[ranked[0].skill]||ranked[0].skill)}</p>`:''}<h3>Önceki çalışmalar</h3><div class="planning-table">${progress.attempts.map(a=>`<div><strong>${esc(a.reading_title)}</strong><span>${esc(a.title)}</span><span>${a.reviewed?`${a.earned}/${a.possible} puan · %${Math.round(a.earned/a.possible*100)}`:a.submitted_at?'Veli kontrolü bekliyor':'Çözülüyor'}</span></div>`).join('')}</div>`:'<p>İlk okuma çalışması değerlendirildiğinde puanlar burada görünecek.</p>'}</details>`;
}
function bindReadingHome(list,isParent){
  document.querySelector('#newReading')?.addEventListener('click',renderReadingCatalog);
  document.querySelector('#readingAudit')?.addEventListener('click',()=>renderReadingAudit());
  document.querySelectorAll('[data-reading-open]').forEach(b=>b.onclick=()=>renderReadingAssignment(Number(b.dataset.readingOpen)));
  document.querySelectorAll('[data-reading-print]').forEach(b=>b.onclick=()=>renderPrintWorksheet('reading',Number(b.dataset.readingPrint),renderHome));
  if(!isParent)return;
  document.querySelectorAll('[data-reading-rename]').forEach(b=>b.onclick=async()=>{
    const a=list.find(x=>x.id===Number(b.dataset.readingRename));
    const title=await uiPrompt('Okuma çalışmasının yeni adı',a.title,{label:'Çalışma adı',max:100});
    if(title===null||title.trim()===a.title)return;
    try{await api(`/api/reading/assignments/${a.id}`,{method:'PUT',body:JSON.stringify({title})});setFlash('Okuma çalışmasının adı değiştirildi.');renderHome()}catch(e){showError(e)}
  });
  document.querySelectorAll('[data-reading-due]').forEach(b=>b.onclick=async()=>{
    const a=list.find(x=>x.id===Number(b.dataset.readingDue));
    const dueDate=await uiPrompt('Hedef tarih',a.due_date||'',{label:'Hedef tarih',type:'date',hint:'Temizlemek için tarihi silip kaydedin.'});
    if(dueDate===null)return;
    try{await api(`/api/reading/assignments/${a.id}`,{method:'PUT',body:JSON.stringify({dueDate:dueDate.trim()})});renderHome()}catch(e){showError(e)}
  });
  document.querySelectorAll('[data-reading-delete]').forEach(b=>b.onclick=async()=>{
    const a=list.find(x=>x.id===Number(b.dataset.readingDelete));
    if(!await uiConfirm('Okuma çalışması silinsin mi?',`“${esc(a.title)}” çalışması ve ${a.answered} yanıt silinecek.`))return;
    try{await api(`/api/reading/assignments/${a.id}`,{method:'DELETE'});setFlash('Okuma çalışması ve yanıtları silindi.');renderHome()}catch(e){showError(e)}
  });
}
async function renderReadingCatalog(){
  setRoute('#/yeni-okuma');
  try{
    const catalog=await api('/api/reading/catalog');
    shell(`<button class="link-btn back" id="readingBack">← Çalışmalara dön</button><section class="hero"><div class="eyebrow">Yeni çalışma</div><h1>Okuma Becerileri</h1><p>Bir metin seçin. Metin ve bütün soruları birlikte atanır.</p></section>
      <form class="card reading-create" id="readingCreate"><div class="field"><label for="readingSection">Metin</label><select id="readingSection">${catalog.sections.map(s=>`<option value="${s.id}">${s.id}. ${esc(s.title)} · ${s.total} soru</option>`).join('')}</select></div>
      <div class="field"><label for="readingTitle">Çalışma adı</label><input id="readingTitle" maxlength="100" required value="${esc(catalog.sections[0]?.title||'Okuma çalışması')}"></div>
      <div class="field"><label for="readingDue">Hedef tarih (isteğe bağlı)</label><input id="readingDue" type="date"></div><button class="btn">Çalışmayı ata</button><div id="flash">${flash()}</div></form>`);
    document.querySelector('#readingBack').onclick=renderHome;
    document.querySelector('#readingSection').onchange=e=>{document.querySelector('#readingTitle').value=catalog.sections.find(s=>s.id===Number(e.target.value)).title};
    document.querySelector('#readingCreate').onsubmit=async e=>{e.preventDefault();try{const result=await api('/api/reading/assignments',{method:'POST',body:JSON.stringify({sectionId:Number(document.querySelector('#readingSection').value),title:document.querySelector('#readingTitle').value.trim(),dueDate:document.querySelector('#readingDue').value})});await renderReadingAssignment(result.id)}catch(err){showError(err)}};
  }catch(err){showError(err)}
}
async function renderReadingAssignment(id){
  setRoute(`#/okuma/${id}`);
  try{
    readingState.data=await api(`/api/reading/assignments/${id}`);
    readingState.index=Math.min(readingState.data.assignment.last_question_index||0,readingState.data.questions.length-1);
    readingState.mode='text';
    readingState.sideText=false;
    if(state.role==='parent')drawReadingReview();else drawReadingStudent();
  }catch(err){showError(err)}
}
function readingScoreText(q){return q.score===null||q.score===undefined?'':`${q.score}/${q.max_score} puan`}
function readingParseAnswer(value){
  try{const parsed=JSON.parse(value||'');if(parsed?.format==='annotated-v1'&&Array.isArray(parsed.marks))return {text:String(parsed.text||''),marks:parsed.marks}}catch{}
  return {text:String(value||''),marks:[]};
}
function readingMarksMarkup(marks,editable=false){return marks.map((m,j)=>`<span class="reading-mark ${m.type==='check'?'check':''}" style="left:${Math.max(0,Math.min(100,Number(m.x)*100))}%;top:${Math.max(0,Math.min(100,Number(m.y)*100))}%">${esc(m.type==='check'?'✓':m.value)}${editable?`<button type="button" data-remove-mark="${j}" aria-label="İşareti sil">×</button>`:''}</span>`).join('')}
function readingResponseMarkup(q){
  if(q.kind!=='written')return `<strong>${esc(q.response||'Henüz yok')}</strong>`;
  const value=readingParseAnswer(q.response);
  return `<strong>${esc(value.text||(!value.marks.length?'Henüz yok':'Görsel üzerinde yanıtlandı'))}</strong>${value.marks.length?`<div class="reading-image-stage review-stage"><img class="review-image" src="${readingImage(q.image)}" alt="Öğrencinin işaretlediği soru">${readingMarksMarkup(value.marks)}</div>`:''}`;
}
function readingSuggestedScore(q){
  if(!q.answer_key||!q.response)return null;
  if(q.response===q.answer_key)return q.max_score;
  if(q.kind==='multi'&&q.max_score===2){
    const correct=new Set(q.answer_key.split(',')),chosen=q.response.split(',');
    if(chosen.length&&chosen.every(item=>correct.has(item)))return 1;
  }
  return 0;
}
function drawReadingStudent(){
  const d=readingState.data,a=d.assignment,done=!!a.submitted_at,ready=d.feedbackReady;
  const answered=d.questions.filter(q=>q.response).length;
  if(readingState.mode==='text'){
    shell(`${workHeader({backId:'readingExit',backText:'Çalışmalarıma dön',eyebrow:d.readingTitle,title:a.title,printId:'printReadingCurrent'})}<p class="small muted work-hint">Metni dikkatle oku. İstersen dinleyebilirsin. Soruları çözerken buraya tekrar dönebilirsin.</p>${studyCalmMarkup()}
      ${readingAudioMarkup(a.section_id)}
      <div class="reading-pages">${d.pages.map((name,i)=>`<figure><img loading="${i?'lazy':'eager'}" src="${readingImage(name)}" alt="Okuma metni ${i+1}. sayfa"><figcaption>Metin · ${i+1}/${d.pages.length}</figcaption></figure>`).join('')}</div>
      <div class="reading-bar"><span>${answered}/${d.questions.length} soru yanıtlandı</span><button class="btn" id="readingQuestions">${answered?'Sorulara dön':'Sorulara geç'} →</button></div>`);
    bindStudyCalm(drawReadingStudent);
    bindReadingAudio();
    document.querySelector('#printReadingCurrent')?.addEventListener('click',()=>renderPrintWorksheet('reading',a.id,drawReadingStudent));
    document.querySelector('#readingExit').onclick=renderHome;
    document.querySelector('#readingQuestions').onclick=()=>{readingState.mode='question';drawReadingStudent();scrollQuestionIntoView()};
    return;
  }
  const q=d.questions[readingState.index],idx=readingState.index,written=readingParseAnswer(q.kind==='written'?q.response:'');
  shell(`${workHeader({backId:'readingExit',backText:'Çalışmalarıma dön',eyebrow:d.readingTitle,title:a.title,status:done?(ready?'Veli değerlendirmesi hazır':'Veli kontrolü bekleniyor'):'',printId:'printReadingCurrent'})}${studyCalmMarkup()}
    <div class="split question-layout reading-work"><aside class="card question-nav"><button class="btn secondary full" id="readingText">Metni tekrar oku</button><details class="reading-audio-mini"><summary>🔊 Metni dinle</summary><audio controls preload="none" src="${readingAudioUrl(a.section_id)}"></audio></details><div class="question-progress"><strong>${answered}/${d.questions.length} yanıtlandı</strong></div>${numberNavMarkup(d.questions,idx,'data-reading-index',item=>item.response)}${done?'':submitButtonMarkup('readingSubmit',answered,d.questions.length)}</aside>
    <section class="question-card"><div class="question-kicker"><span>Soru ${idx+1} / ${d.questions.length}<span class="kicker-answered"> · ${answered} yanıt</span></span><div class="kicker-meta"><span class="pill gray" title="Bu soruda geçen süre">⏱️ <span id="readingLiveTimer">00:00</span></span><span>Kaynak PDF sayfa ${q.page}</span></div></div>${q.kind==='written'?`<div class="reading-image-stage ${done?'':'editable'}" id="readingImageStage"><img class="question-image" src="${readingImage(q.image)}" alt="${q.number}. soru">${readingMarksMarkup(written.marks,!done)}</div><a class="image-zoom reading-zoom-link" href="${readingImage(q.image)}" target="_blank" rel="noopener">Orijinal görseli büyüt ↗</a>`:`<a class="image-zoom" href="${readingImage(q.image)}" target="_blank" rel="noopener"><img class="question-image" src="${readingImage(q.image)}" alt="${q.number}. soru"><span>Görseli büyüt ↗</span></a>`}
    ${q.kind==='choice'?'':q.kind==='multi'?`<p class="answer-label">Uygun seçeneklerin hepsini işaretle</p><div class="reading-options">${q.options.map((option,j)=>`<label><input type="checkbox" name="readingMulti" value="${j+1}" ${String(q.response||'').split(',').includes(String(j+1))?'checked':''} ${done?'disabled':''}><span>${esc(option)}</span></label>`).join('')}</div>`:`${done?'':`<div class="reading-annotation-tools"><label>Görsele ekle <select id="readingMarkMode"><option value="text">Yazı</option><option value="check">✓ İşaret</option></select></label><input id="readingMarkText" maxlength="80" placeholder="Yazılacak kelime veya kısa yanıt"><p>Tablo veya şemadaki yere tıkla. Eklediğin işareti × ile kaldırabilirsin.</p></div>`}<div class="field"><label for="readingWritten">Yazılı yanıtın (isteğe bağlı)</label><textarea id="readingWritten" maxlength="4000" rows="5" placeholder="Açıklamanı buraya yazabilirsin." ${done?'disabled':''}>${esc(written.text)}</textarea></div>`}
    ${studyUncertainMarkup(q,done)}${ready?`<div class="feedback-box ${q.score===q.max_score?'correct':q.score?'partial':'incorrect'}"><strong>Veli değerlendirmesi: ${readingScoreText(q)}</strong>${q.answer_key?`<span>${q.kind==='multi'?'Doğru seçenekler':'Doğru şık'}: ${esc(q.answer_key)}</span>`:''}${q.note?`<p>${esc(q.note)}</p>`:''}</div>`:''}
    ${answerDockMarkup({options:q.kind==='choice'?letterOptionsMarkup(q,done,'readingAnswer'):'',prevId:'readingPrev',nextId:'readingNext',first:idx===0,last:idx===d.questions.length-1,submitId:done?'':'readingDockSubmit'})}<div id="flash">${flash()}</div></section></div><div id="readingSummary"></div>`);
  const layout=document.querySelector('.reading-work'),sideButton=document.createElement('button'),sidePanel=document.createElement('div');
  sideButton.type='button';sideButton.id='readingSideToggle';sideButton.className='btn secondary full';sideButton.textContent=readingState.sideText?'Metni kapat':'Metni yan yana göster';
  layout.querySelector('aside').append(sideButton);
  sidePanel.id='readingSidePanel';sidePanel.className='reading-side-panel';sidePanel.innerHTML=`<strong>Okuma metni</strong>${d.pages.map((name,i)=>`<a class="image-zoom" href="${readingImage(name)}"><img loading="lazy" src="${readingImage(name)}" alt="Metin ${i+1}. sayfa"></a>`).join('')}`;
  layout.insertBefore(sidePanel,layout.querySelector('.question-card'));
  uiBindImageZoom();
  const applySide=()=>{layout.classList.toggle('show-text',readingState.sideText);sidePanel.hidden=!readingState.sideText;sideButton.textContent=readingState.sideText?'Metni kapat':'Metni yan yana göster';sideButton.setAttribute('aria-expanded',String(readingState.sideText))};applySide();
  sideButton.onclick=()=>{readingState.sideText=!readingState.sideText;applySide()};
  bindStudyCalm(drawReadingStudent);
  bindReadingAudio();
  bindStudyShortcuts();
  if(!done){
    bindStudyUncertain('reading',a.id,`${a.section_id}:${q.number}`,q);
    resetReadingTimer();
  }
  document.querySelector('#printReadingCurrent')?.addEventListener('click',()=>renderPrintWorksheet('reading',a.id,drawReadingStudent));
  const saveWritten=async()=>{
    const field=document.querySelector('#readingWritten');if(!field||done)return true;
    const text=field.value.trim(),answer=written.marks.length?JSON.stringify({format:'annotated-v1',text,marks:written.marks}):text;if(answer===String(q.response||''))return true;
    const durationSeconds=consumeReadingDuration();
    try{await api(`/api/reading/assignments/${a.id}/answers/${q.number}`,{method:answer?'PUT':'DELETE',...(answer?{body:JSON.stringify({answer,durationSeconds})}:{})});q.response=answer||null;q.duration_seconds=(q.duration_seconds||0)+durationSeconds;return true}catch(e){showError(e);return false}
  };
  state.leaveGuard=saveWritten;
  document.querySelector('#readingExit').onclick=async()=>{if(await saveWritten())renderHome()};
  document.querySelector('#readingDockSubmit')?.addEventListener('click',()=>document.querySelector('#readingSubmit')?.click());
  document.querySelector('#readingText').onclick=async()=>{if(await saveWritten()){readingState.mode='text';drawReadingStudent()}};
  const go=async j=>{if(!await saveWritten())return;try{if(!done)await api(`/api/reading/assignments/${a.id}/progress`,{method:'PUT',body:JSON.stringify({index:j})});readingState.index=j;drawReadingStudent();scrollQuestionIntoView()}catch(e){showError(e)}};
  document.querySelectorAll('[data-reading-index]').forEach(b=>b.onclick=()=>go(Number(b.dataset.readingIndex)));
  document.querySelector('#readingPrev').onclick=()=>go(idx-1);
  document.querySelector('#readingNext')?.addEventListener('click',()=>go(idx+1));
  document.querySelectorAll('input[name=readingAnswer]').forEach(input=>input.onchange=async()=>{try{await api(`/api/reading/assignments/${a.id}/answers/${q.number}`,{method:'PUT',body:JSON.stringify({answer:input.value})});q.response=input.value;drawReadingStudent()}catch(e){showError(e)}});
  document.querySelectorAll('input[name=readingMulti]').forEach(input=>input.onchange=async()=>{const answer=[...document.querySelectorAll('input[name=readingMulti]:checked')].map(x=>Number(x.value)).sort((x,y)=>x-y).join(',');try{await api(`/api/reading/assignments/${a.id}/answers/${q.number}`,{method:answer?'PUT':'DELETE',...(answer?{body:JSON.stringify({answer})}:{})});q.response=answer||null;drawReadingStudent()}catch(e){showError(e)}});
  if(q.kind==='written'&&!done){
    const stage=document.querySelector('#readingImageStage');
    stage.onclick=async e=>{
      if(e.target.closest('.reading-mark')&&!e.target.closest('[data-remove-mark]'))return;
      if(e.target.closest('[data-remove-mark]')){written.marks.splice(Number(e.target.closest('[data-remove-mark]').dataset.removeMark),1)}
      else{
        const mode=document.querySelector('#readingMarkMode').value,value=document.querySelector('#readingMarkText').value.trim();
        if(mode==='text'&&!value){showError(new Error('Önce görsele yazılacak kısa yanıtı gir.'));return}
        const rect=stage.getBoundingClientRect();written.marks.push({type:mode,value:mode==='check'?'✓':value,x:Math.max(0,Math.min(1,Math.round((e.clientX-rect.left)/rect.width*1000)/1000)),y:Math.max(0,Math.min(1,Math.round((e.clientY-rect.top)/rect.height*1000)/1000))});
      }
      if(!await saveWritten())return;const scrollY=window.scrollY;drawReadingStudent();window.scrollTo(0,scrollY);
    };
  }
  document.querySelector('#readingSubmit')?.addEventListener('click',async()=>{
    if(!await saveWritten())return;
    const missing=d.questions.filter(item=>!item.response).map(item=>item.number);
    document.querySelector('#readingSummary').innerHTML=`<div class="summary-overlay"><div class="summary-dialog"><h2>Teslim özeti</h2><p>${d.questions.length-missing.length}/${d.questions.length} soru yanıtlandı.</p>${missing.length?`<div class="notice">Boş sorular: ${missing.join(', ')}</div>`:'<div class="success">Tüm sorular hazır.</div>'}<div class="toolbar"><button class="btn secondary" id="readingCloseSummary">Sorulara dön</button>${missing.length?'':'<button class="btn" id="readingConfirmSubmit">Çalışmayı teslim et</button>'}</div></div></div>`;
    document.querySelector('#readingCloseSummary').onclick=()=>{document.querySelector('#readingSummary').innerHTML=''};
    document.querySelector('#readingConfirmSubmit')?.addEventListener('click',async()=>{try{await api(`/api/reading/assignments/${a.id}/submit`,{method:'POST',body:'{}'});setFlash('Okuma çalışması teslim edildi.');renderHome()}catch(e){showError(e)}});
  });
}
let readingQuestionStart = Date.now();
let readingTimerInterval = null;
function resetReadingTimer(){
  readingQuestionStart = Date.now();
  if(readingTimerInterval) clearInterval(readingTimerInterval);
  const el = document.querySelector('#readingLiveTimer');
  if(!el) return;
  el.textContent = '00:00';
  readingTimerInterval = setInterval(()=>{
    const elapsed = Math.floor((Date.now() - readingQuestionStart)/1000);
    const m = String(Math.floor(elapsed/60)).padStart(2,'0');
    const s = String(elapsed%60).padStart(2,'0');
    if(el) el.textContent = `${m}:${s}`;
  },1000);
}
function consumeReadingDuration(){
  if(readingTimerInterval){clearInterval(readingTimerInterval);readingTimerInterval=null}
  const elapsed = Math.round((Date.now() - readingQuestionStart)/1000);
  readingQuestionStart = Date.now();
  return Math.max(elapsed, 1);
}
function drawReadingReview(){
  const d=readingState.data,a=d.assignment,submitted=!!a.submitted_at;
  const draft=new Map(d.questions.map(q=>[q.number,{score:q.score??(submitted?readingSuggestedScore(q):null),note:q.note||'',reason:q.reason||''}]));
  let dirty=false;
  shell(`<button class="link-btn back" id="readingReviewBack">← Çalışmalara dön</button><section class="hero"><div class="eyebrow">Veli kontrolü · ${esc(d.readingTitle)}</div><h1>${esc(a.title)}</h1><p>${submitted?'Resmi cevap görüntüsüyle karşılaştırın ve bütün puanları tek işlemde kaydedin.':'Öğrencinin teslim etmesi bekleniyor.'}</p></section>
    ${readingAudioMarkup(a.section_id)}
    <details class="card reading-parent-text"><summary>Okuma metnini göster</summary><div class="reading-pages">${d.pages.map(name=>`<img loading="lazy" src="${readingImage(name)}" alt="Okuma metni sayfası">`).join('')}</div></details>
    <div class="section-title"><h2>Sorular ve yanıtlar</h2><div class="toolbar">${submitted?'<button class="btn secondary" id="readingReviewFilter" aria-pressed="true"></button>':''}<button class="btn secondary" id="printReadingReview">🖨 Çalışma kağıdı yazdır</button><button class="btn reading-save" ${submitted?'':'disabled'}>Tümünü kaydet</button></div></div><div id="flash">${flash()}</div><div class="notice" id="readingSaveStatus">${submitted?'Şıklı soruların puanı önceden seçildi. Yazılı soruları değerlendirin.':'Teslim bekleniyor.'}</div>${submitted?'<p class="small muted review-keys-hint">Klavye: <kbd>0</kbd> <kbd>1</kbd> <kbd>2</kbd> puan verir ve sıradaki soruya geçer.</p>':''}
    <div class="review-grid">${d.questions.map(q=>{const selected=draft.get(q.number).score;const autoFull=submitted&&!q.uncertain&&readingSuggestedScore(q)===q.max_score;return `<article class="review-card" data-reading-review="${q.number}" ${autoFull?'data-auto-ok':''}><div class="card-top"><strong>${q.number}. soru</strong><div style="display:flex;align-items:center;gap:6px">${formatDurationBadge(q.duration_seconds)}<span class="pill gray">${q.max_score} puan</span></div></div><div class="reading-compare"><div><span class="eyebrow">Soru</span><img loading="lazy" class="review-image" src="${readingImage(q.image)}" alt="${q.number}. soru"></div><div><span class="eyebrow">Resmi cevap ve ölçüt</span><img loading="lazy" class="review-image" src="${readingImage(q.answer_image)}" alt="${q.number}. sorunun cevap ölçütü"></div></div><div class="review-meta"><div class="reading-response">Öğrencinin yanıtı: ${readingResponseMarkup(q)}</div>${q.answer_key?`<span>${q.kind==='multi'?'Doğru seçenekler':'Doğru şık'}: <strong>${esc(q.answer_key)}</strong></span>`:''}${q.uncertain?`<span class="pill amber">Öğrenci emin değildi</span>`:""}</div><div class="review-controls">${Array.from({length:q.max_score+1},(_,score)=>`<button data-score="${score}" class="${selected===score?'active '+(score===0?'incorrect':score===q.max_score?'correct':'partial'):''}" aria-pressed="${selected===score}" ${submitted?'':'disabled'}>${score} puan</button>`).join('')}</div>${studyReasonSelect(q.reason||'')}<div class="field"><label for="readingNote${q.number}">Veli notu</label><textarea id="readingNote${q.number}" maxlength="500" ${submitted?'':'disabled'}>${esc(q.note||'')}</textarea></div></article>`}).join('')}</div>    <div class="review-savebar"><span>Bütün sorular birlikte kaydedilir.</span><button class="btn reading-save" ${submitted?'':'disabled'}>Tümünü kaydet</button></div>`);
  bindReadingAudio();
  document.querySelector('#printReadingReview')?.addEventListener('click',()=>renderPrintWorksheet('reading',a.id,drawReadingReview));
  state.leaveGuard=()=>!dirty||confirm('Kaydedilmemiş puanlar var. Sayfadan çıkılsın mı?');
  document.querySelector('#readingReviewBack').onclick=()=>{if(state.leaveGuard())renderHome()};
  uiBindReviewFilter(document.querySelector('#readingReviewFilter'),'[data-reading-review]');
  if(submitted)uiBindReviewKeys('[data-reading-review]',{'0':'[data-score="0"]','1':'[data-score="1"]','2':'[data-score="2"]'});
  const markDirty=()=>{dirty=true;window.onbeforeunload=()=>true;document.querySelector('#readingSaveStatus').textContent='Kaydedilmemiş değişiklikler var.'};
  document.querySelectorAll('[data-reading-review]').forEach(card=>{
    const number=Number(card.dataset.readingReview),field=card.querySelector('textarea');
    card.querySelectorAll('[data-score]').forEach(button=>button.onclick=()=>{draft.get(number).score=Number(button.dataset.score);card.querySelectorAll('[data-score]').forEach(peer=>{const active=peer===button;peer.className=active?'active '+(Number(peer.dataset.score)===d.questions[number-1].max_score?'correct':Number(peer.dataset.score)===0?'incorrect':'partial'):'';peer.setAttribute('aria-pressed',String(active))});markDirty()});
    field.oninput=e=>{draft.get(number).note=e.target.value;markDirty()};const reason=card.querySelector("[data-study-reason]");reason.disabled=!submitted;reason.onchange=e=>{draft.get(number).reason=e.target.value;markDirty()};
    if(submitted){const chips=document.createElement('div');chips.className='reading-feedback-chips';chips.innerHTML=readingFeedbackTemplates.map(([,label],i)=>`<button type="button" data-feedback="${i}">${esc(readingFeedbackTemplates[i][0])}</button>`).join('');field.parentElement.append(chips);chips.querySelectorAll('button').forEach(button=>button.onclick=()=>{const value=readingFeedbackTemplates[Number(button.dataset.feedback)][1];if(field.value.includes(value))return;field.value=(field.value.trim()?field.value.trim()+'\n':'')+value;field.value=field.value.slice(0,500);draft.get(number).note=field.value;markDirty()})}
  });
  document.querySelectorAll('.reading-save').forEach(button=>button.onclick=async()=>{try{if([...draft.values()].some(x=>x.score===null))throw new Error('Tüm sorulara puan verin.');const reviews=d.questions.map(q=>({number:q.number,...draft.get(q.number)}));await api(`/api/reading/assignments/${a.id}/reviews`,{method:'POST',body:JSON.stringify({reviews})});d.questions.forEach(q=>{q.score=draft.get(q.number).score;q.note=draft.get(q.number).note;q.reason=draft.get(q.number).reason});dirty=false;setFlash(`${reviews.length} soru birlikte değerlendirildi.`);drawReadingReview()}catch(e){showError(e)}});
}
