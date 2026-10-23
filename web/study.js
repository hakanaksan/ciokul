const STUDY_REASONS={"":"Neden seçilmedi",topic:"Konuyu öğrenmeli",reading:"Soruyu yanlış okudu",attention:"Dikkat hatası",method:"Yöntemi geliştirmeli",other:"Diğer"};
let calmStartedAt=0,calmReminder=null;
function studyReasonSelect(value=''){
  return `<label class="study-reason">Zorlanma nedeni <select data-study-reason>${Object.entries(STUDY_REASONS).map(([key,label])=>`<option value="${key}" ${key===value?'selected':''}>${label}</option>`).join('')}</select></label>`;
}
function studyDashboardMarkup(data){
  const w=data.week,due=data.queue.filter(q=>q.due_date<=data.today&&!q.assigned_assignment_id),upcoming=data.queue.filter(q=>q.due_date>data.today||q.assigned_assignment_id);
  const row=q=>`<label class="study-repeat-row"><input type="checkbox" data-study-repeat="${esc(q.kind)}" data-study-key="${esc(q.item_key)}" ${q.assigned_assignment_id?'disabled':'checked'}><span><strong>${esc(q.kind==='reading'?q.reading_title:`${q.course} · ${q.unit_title}`)} · ${q.number}. soru</strong><small>${q.assigned_assignment_id?'Atandı, değerlendirme bekliyor':q.due_date<=data.today?'Tekrar zamanı geldi':`Tekrar: ${q.due_date}`} · ${q.stage+1}. adım${q.reason?' · '+esc(STUDY_REASONS[q.reason]||q.reason):''}</small></span></label>`;
  return `<section class="planning-section" id="studyDashboard"><div class="section-title"><h2>Bu haftanın özeti</h2><span class="pill blue">${esc(data.weekStart)} – ${esc(data.weekEnd)}</span></div>
    <div class="study-week-grid"><div class="card"><strong>${w.assigned}</strong><span>Atanan çalışma</span></div><div class="card"><strong>${w.submitted}</strong><span>Teslim edilen</span></div><div class="card"><strong>${w.reviewedQuestions}</strong><span>Kontrol edilen soru</span></div><div class="card"><strong>${w.pendingReviews}</strong><span>Veli kontrolü bekleyen</span></div><div class="card"><strong>${w.uncertain}</strong><span>“Emin değilim” işareti</span></div><div class="card"><strong>${w.dueReviews}</strong><span>Tekrar zamanı gelen</span></div></div>
    ${data.improvingSkills?.length?`<p class="small study-improving">Gelişen okuma becerileri: ${data.improvingSkills.map(x=>`${esc(x.name)} %${x.before} → %${x.now}`).join(' · ')}</p>`:''}
    ${data.reasons.length?`<p class="small muted">Sık görülen zorlanma nedenleri: ${data.reasons.slice(0,3).map(x=>`${esc(STUDY_REASONS[x.reason]||x.reason)} (${x.total})`).join(' · ')}</p>`:''}
    <div class="card study-queue"><div class="card-top"><h3>Tekrar kuyruğu</h3><span class="pill ${due.length?'amber':'gray'}">${due.length} soru hazır</span></div><p class="small muted">Yanlış veya kısmen doğru sorular 2 gün sonra; başarılı tekrarlar 7 ve 21 gün sonra önerilir. Çalışmayı veli atar.</p>
    ${due.length?`<div class="study-repeat-list">${due.map(row).join('')}</div><button class="btn" id="studyCreateDue">Seçilenleri ata</button>`:'<p class="small muted">Şu an tekrar zamanı gelen soru yok.</p>'}
    ${upcoming.length?`<details><summary>Yaklaşan tekrarlar (${upcoming.length})</summary><div class="study-repeat-list">${upcoming.map(row).join('')}</div></details>`:''}</div></section>`;
}
function bindStudyDashboard(data){
  document.querySelector('#studyCreateDue')?.addEventListener('click',async()=>{
    const selected=[...document.querySelectorAll('#studyDashboard [data-study-repeat]:checked')].filter(x=>data.queue.some(q=>q.kind===x.dataset.studyRepeat&&q.item_key===x.dataset.studyKey&&q.due_date<=data.today&&!q.assigned_assignment_id));
    if(!selected.length){showError(new Error('Tekrar sorusu seçin.'));return}
    const tests=selected.filter(x=>x.dataset.studyRepeat==='test').slice(0,15).map(x=>Number(x.dataset.studyKey));
    const reading=new Map();
    for(const x of selected.filter(x=>x.dataset.studyRepeat==='reading')){const [section,number]=x.dataset.studyKey.split(':').map(Number);if(!reading.has(section))reading.set(section,[]);if(reading.get(section).length<15)reading.get(section).push(number)}
    try{
      const created=[];
      if(tests.length){const a=await api('/api/assignments',{method:'POST',body:JSON.stringify({title:'Zamanı gelen tekrar · Fasiküller',questionIds:tests,fromRepeatQueue:true})});created.push({kind:'test',id:a.id})}
      for(const [section,numbers] of reading){const sectionTitle=data.queue.find(q=>q.kind==='reading'&&q.section_id===section)?.reading_title||'Okuma';const a=await api('/api/reading/assignments',{method:'POST',body:JSON.stringify({sectionId:section,numbers,title:`${sectionTitle} · Kısa tekrar`,fromRepeatQueue:true})});created.push({kind:'reading',id:a.id})}
      if(created.length){setFlash(`${created.length} tekrar çalışması atandı.`);renderHome()}
    }catch(e){showError(e)}
  });
}
function studyUncertainMarkup(q,done){
  return `<label class="study-uncertain"><input type="checkbox" id="studyUncertain" ${q.uncertain?'checked':''} ${done?'disabled':''}> Bu sorudan emin değilim</label>`;
}
function bindStudyUncertain(kind,aid,key,q){
  document.querySelector('#studyUncertain')?.addEventListener('change',async e=>{
    try{await api(`/api/study/reflections/${kind}/${aid}/${encodeURIComponent(key)}`,{method:'PUT',body:JSON.stringify({uncertain:e.target.checked})});q.uncertain=e.target.checked}
    catch(err){e.target.checked=!e.target.checked;showError(err)}
  });
}
function studyCalmMarkup(){
  return `<div class="study-calm-tools"><button type="button" class="btn secondary" id="studyCalmToggle" aria-pressed="${localStorage.getItem('cioCalmMode')==='1'}">${localStorage.getItem('cioCalmMode')==='1'?'Sakin modu kapat':'Sakin çalışma modu'}</button><button type="button" class="link-btn" id="studyFullscreen">${document.fullscreenElement?'Tam ekrandan çık':'Tam ekran'}</button><span id="studyBreakNotice" role="status"></span><span class="small muted study-shortcut-badge" title="A, B, C, D: Şık seç | Sol/Sağ: Soru geç | E: Emin değilim | K: Karalama">⌨️ Kısayollar: A-B-C-D · ← / → · E · K</span></div>`;
}
function bindStudyCalm(){
  const apply=()=>document.body.classList.toggle('calm-mode',localStorage.getItem('cioCalmMode')==='1');apply();
  if(!calmStartedAt)calmStartedAt=Date.now();
  if(!calmReminder)calmReminder=setInterval(()=>{
    if(localStorage.getItem('cioCalmMode')!=='1')return;
    const minutes=Math.floor((Date.now()-calmStartedAt)/60000);
    if(minutes>0&&minutes%20===0){const note=document.querySelector('#studyBreakNotice');if(note)note.textContent='İstersen kısa bir mola ver.'}
  },60000);
  document.querySelector('#studyCalmToggle')?.addEventListener('click',e=>{const active=localStorage.getItem('cioCalmMode')!=='1';localStorage.setItem('cioCalmMode',active?'1':'0');apply();e.currentTarget.textContent=active?'Sakin modu kapat':'Sakin çalışma modu';e.currentTarget.setAttribute('aria-pressed',String(active))});
  document.querySelector('#studyFullscreen')?.addEventListener('click',async e=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();e.currentTarget.textContent=document.fullscreenElement?'Tam ekrandan çık':'Tam ekran'}catch(err){showError(err)}});
}
let activeKeyHandler=null;
function bindStudyShortcuts(){
  if(activeKeyHandler)window.removeEventListener('keydown',activeKeyHandler);
  activeKeyHandler=e=>{
    if(e.target&&['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName))return;
    if(e.ctrlKey||e.metaKey||e.altKey)return;
    const key=e.key.toUpperCase();
    if(['A','B','C','D'].includes(key)){
      const radio=document.querySelector(`input[name="answer"][value="${key}"], input[name="readingAnswer"][value="${key}"]`);
      if(radio&&!radio.disabled){radio.checked=true;radio.dispatchEvent(new Event('change',{bubbles:true}))}
    }else if(e.key==='ArrowLeft'){
      const prev=document.querySelector('#prev, #readingPrev');
      if(prev&&!prev.disabled)prev.click();
    }else if(e.key==='ArrowRight'){
      const next=document.querySelector('#next, #readingNext');
      if(next&&!next.disabled)next.click();
    }else if(key==='E'){
      const uncertain=document.querySelector('#studyUncertain');
      if(uncertain&&!uncertain.disabled){uncertain.checked=!uncertain.checked;uncertain.dispatchEvent(new Event('change',{bubbles:true}))}
    }else if(key==='K'){
      const scratchToggle=document.querySelector('#scratchToggleBtn');
      if(scratchToggle)scratchToggle.click();
    }
  };
  window.addEventListener('keydown',activeKeyHandler);
}
function unbindStudyShortcuts(){
  if(activeKeyHandler){window.removeEventListener('keydown',activeKeyHandler);activeKeyHandler=null}
}
function stopStudyCalm(){
  if(calmReminder){clearInterval(calmReminder);calmReminder=null}
  calmStartedAt=0;
  unbindStudyShortcuts();
  document.body.classList.remove('calm-mode');
  if(document.fullscreenElement)document.exitFullscreen().catch(()=>{})
}
