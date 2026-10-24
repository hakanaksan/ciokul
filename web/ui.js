const UI_TABS=[
  ['overview','Özet','📊','Bekleyen işler ve hızlı başlat'],
  ['tests','Fasikül Çalışmaları','📝','Test ata, aç ve kontrol et'],
  ['reading','Okuma Çalışmaları','📖','Metin ata, dinle ve değerlendir'],
  ['repeat','Tekrar & Hafta','🔁','Tekrar kuyruğu ve haftalık durum'],
  ['progress','İlerleme & Karne','📈','Grafikler ve gelişim karnesi'],
  ['tools','Araçlar & Ayarlar','🧰','Arama, takvim, denetim ve yedekleme'],
];
const UI_TAB_ALIAS={work:'tests'};
const UI_ACTIONS=[
  {t:'Yeni fasikül çalışması ata',d:'Fasikül Çalışmaları · 15 soruluk test',tab:'tests',run:()=>renderCatalog()},
  {t:'Yeni okuma çalışması ata',d:'Okuma Çalışmaları · metin + sorular',tab:'reading',run:()=>renderReadingCatalog()},
  {t:'Karma deneme oluştur',d:'Araçlar · ders karışık test',tab:'tools',run:()=>renderMixedBuilder()},
  {t:'Konu ve soru ara',d:'Araçlar · soru bankasında ara',tab:'tools',run:()=>renderQuestionSearch()},
  {t:'Okuma görsellerini denetle',d:'Okuma Çalışmaları · kesim ve beceri',tab:'reading',run:()=>renderReadingAudit()},
  {t:'Gelişim karnesi',d:'İlerleme · yazdırılabilir karne',tab:'progress',run:()=>renderReportCard(renderHome)},
  {t:'Hata defteri',d:'Öğrencinin yanlışları',tab:'tests',run:()=>renderMistakesNotebook()},
  {t:'Tekrar kuyruğu',d:'Tekrar & Hafta · zamanı gelenler',tab:'repeat',run:null},
  {t:'Çalışma takvimi',d:'Araçlar · hedef tarihli takvim',tab:'tools',run:null},
  {t:'Yedek indir / geri yükle',d:'Araçlar · veri güvenliği',tab:'tools',run:null},
  {t:'Soru denetim raporu',d:'Araçlar · otomatik denetim',tab:'tools',run:null},
  {t:'Şifre / PIN değiştir',d:'Araçlar · hesap ve güvenlik',tab:'tools',run:null},
  {t:'Tüm oturumları kapat',d:'Araçlar · hesap ve güvenlik',tab:'tools',run:null},
];
const UI_MONTHS_SHORT=['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'];
function uiParseDate(value){const m=/^(\d{4})-(\d{2})-(\d{2})/.exec(value||'');return m?new Date(Number(m[1]),Number(m[2])-1,Number(m[3])):null}
// "30 Ekim Perşembe"; year:true adds the year.
function uiDate(value,{weekday=true,year=false}={}){const d=uiParseDate(value);return d?d.toLocaleDateString('tr-TR',{day:'numeric',month:'long',...(year?{year:'numeric'}:{}),...(weekday?{weekday:'long'}:{})}):''}
function uiShortDate(value){const d=uiParseDate(value);return d?`${d.getDate()} ${UI_MONTHS_SHORT[d.getMonth()]}`:''}
function uiMonth(value){const m=/^(\d{4})-(\d{2})/.exec(value||'');return m?new Date(Number(m[1]),Number(m[2])-1,1).toLocaleDateString('tr-TR',{month:'long',year:'numeric'}):''}
// Server timestamps are UTC 'YYYY-MM-DD HH:MM:SS'; shown as the local calendar day.
function uiStamp(value){if(!value)return '';const d=new Date(String(value).replace(' ','T')+'Z');return isNaN(d)?'':d.toLocaleDateString('tr-TR',{day:'numeric',month:'long',year:'numeric'})}
// "30 Ekim Perşembe · 6 gün kaldı"; finished work shows only the date.
function uiDueText(value,finished=false){
  const d=uiParseDate(value);if(!d)return '';
  if(finished)return uiDate(value);
  const days=Math.round((d-uiParseDate(localToday()))/86400000);
  const relative=days===0?'bugün':days===1?'yarın':days>1?`${days} gün kaldı`:`${-days} gün geçti`;
  return `${uiDate(value)} · ${relative}`;
}
// Grading by keyboard for review screens: keys map to a button inside the active card.
let uiReviewKeyHandler=null;
function uiBindReviewKeys(cardSelector,keyMap){
  if(uiReviewKeyHandler)window.removeEventListener('keydown',uiReviewKeyHandler);
  let active=null;
  const cards=()=>[...document.querySelectorAll(cardSelector)].filter(card=>!card.hidden);
  document.querySelectorAll(cardSelector).forEach(card=>{card.addEventListener('focusin',()=>{active=card});card.addEventListener('pointerdown',()=>{active=card})});
  const handler=uiReviewKeyHandler=e=>{
    if(!document.querySelector(cardSelector)){window.removeEventListener('keydown',handler);uiReviewKeyHandler=null;return}
    if(e.ctrlKey||e.metaKey||e.altKey||['INPUT','TEXTAREA','SELECT'].includes(e.target?.tagName))return;
    const selector=keyMap[e.key.toLocaleLowerCase('tr')];if(!selector)return;
    const list=cards();if(!list.length)return;
    if(!active||active.hidden||!document.contains(active))active=list.find(card=>!card.querySelector('[aria-pressed="true"]'))||list[0];
    const button=active.querySelector(selector);if(!button||button.disabled)return;
    e.preventDefault();button.click();
    const next=list[list.indexOf(active)+1];
    if(next){active=next;next.scrollIntoView({behavior:'smooth',block:'start'})}
  };
  window.addEventListener('keydown',handler);
}
// Hides cards marked data-auto-ok (answer key already says correct) until the parent asks for all.
function uiBindReviewFilter(button,cardSelector){
  if(!button)return;
  const auto=[...document.querySelectorAll(`${cardSelector}[data-auto-ok]`)];
  if(!auto.length){button.hidden=true;return}
  let onlyChecks=true;
  const apply=()=>{auto.forEach(card=>{card.hidden=onlyChecks});button.textContent=onlyChecks?`Tümünü göster (${auto.length} otomatik doğru gizli)`:'Yalnızca kontrol gerekenler';button.setAttribute('aria-pressed',String(onlyChecks))};
  button.onclick=()=>{onlyChecks=!onlyChecks;apply()};apply();
}
function uiApplyPreferences(){
  const raw=localStorage.getItem('cioFontScale')||'1';
  const map={'0.9':'small','1':'normal','1.15':'large','1.3':'xlarge'};
  const key=map[raw]||'normal';
  document.documentElement.dataset.fontScale=key;
  // Eski zoom tabanlı ölçek kalıntısını temizle (Firefox uyumluluğu)
  document.documentElement.style.zoom='';
  document.body.classList.toggle('high-contrast',localStorage.getItem('cioHighContrast')==='1');
}
function uiPreferencesMarkup(){
  const scale=localStorage.getItem('cioFontScale')||'1';
  return `<div class="ui-preferences"><button type="button" id="uiPreferencesButton" class="link-btn" aria-expanded="false" aria-controls="uiPreferencesPanel">Görünüm</button><div id="uiPreferencesPanel" class="ui-preferences-panel" hidden><strong>Görünüm tercihleri</strong><label>Yazı ve ekran boyutu<select id="uiFontScale">${[['0.9','Küçük'],['1','Normal'],['1.15','Büyük'],['1.3','Çok büyük']].map(([v,t])=>`<option value="${v}" ${v===scale?'selected':''}>${t}</option>`).join('')}</select></label><label class="ui-contrast"><input type="checkbox" id="uiHighContrast" ${localStorage.getItem('cioHighContrast')==='1'?'checked':''}> Yüksek kontrast</label></div></div>`;
}
function uiBindPreferences(){
  uiApplyPreferences();
  const button=document.querySelector('#uiPreferencesButton'),panel=document.querySelector('#uiPreferencesPanel');
  button?.addEventListener('click',()=>{panel.hidden=!panel.hidden;button.setAttribute('aria-expanded',String(!panel.hidden))});
  document.querySelector('#uiFontScale')?.addEventListener('change',e=>{localStorage.setItem('cioFontScale',e.target.value);uiApplyPreferences()});
  document.querySelector('#uiHighContrast')?.addEventListener('change',e=>{localStorage.setItem('cioHighContrast',e.target.checked?'1':'0');uiApplyPreferences()});
}
function uiOverviewMarkup(data,readingData,dashboard){
  const all=[...data.assignments.map(a=>({...a,kind:'test'})),...readingData.assignments.map(a=>({...a,kind:'reading'}))];
  const pending=all.filter(a=>a.submitted_at&&a.reviewed<a.total),active=all.filter(a=>!a.submitted_at);
  return `<section class="ui-overview"><div class="ui-action-grid"><button type="button" class="ui-action-card" data-go-tab="tests"><span class="ui-action-icon">✓</span><strong>${pending.length}</strong><span>Kontrol bekleyen çalışma</span><small>${pending.length?'Aç ve değerlendir →':'Kontroller tamam'}</small></button><button type="button" class="ui-action-card" data-go-tab="repeat" data-focus-id="studyDashboard"><span class="ui-action-icon">↻</span><strong>${dashboard.dueCount}</strong><span>Tekrar zamanı gelen soru</span><small>${dashboard.dueCount?'Tekrar kuyruğuna git →':'Şimdilik hazır soru yok'}</small></button><button type="button" class="ui-action-card" data-go-tab="progress"><span class="ui-action-icon">▥</span><strong>${dashboard.week.submitted}</strong><span>Bu hafta teslim edilen</span><small>İlerlemeyi incele →</small></button></div>
    ${pending.length?`<div class="ui-quick-list"><h3>Kontrol sırası</h3>${pending.slice(0,4).map(a=>`<button type="button" data-quick-open="${a.kind}" data-assignment-id="${a.id}"><span>${esc(a.title)}</span><small>${a.answered}/${a.total} yanıt · ${a.kind==='reading'?'Okuma':'Fasikül'}</small></button>`).join('')}</div>`:''}
    ${active.length?`<p class="small muted">${active.length} çalışma öğrencinin çözmesini bekliyor.</p>`:''}</section>`;
}
function uiPrepareHomeNodes(){
  const main=document.querySelector('.main');if(!main)return;
  const heading=main.querySelector(':scope > .section-title'),badges=main.querySelector(':scope > .badges-showcase-card'),list=main.querySelector('#flash')?.nextElementSibling;
  if(heading)heading.id='assignmentHeading';
  if(badges)badges.id='badgesWidget';
  if(list)list.id='assignmentList';
  if(list?.nextElementSibling)list.nextElementSibling.id='readingHomeSection';
  for(const section of main.querySelectorAll('section')){const title=section.querySelector(':scope > h2,:scope > .section-title > h2')?.textContent||'';if(title==='Soru denetimi')section.id='auditSummary';else if(title==='Tahmini müfredat takvimi')section.id='curriculumSection';else if(title.startsWith('Yedekleme'))section.id='backupSection'}
}
function uiInitParentTabs(data,readingData,dashboard,progress){
  uiPrepareHomeNodes();
  const main=document.querySelector('.main'),hero=main?.querySelector('.hero');if(!hero)return;
  const shell=document.createElement('div');shell.className='admin-shell';shell.id='homeTabs';
  shell.innerHTML=`<aside class="admin-side" aria-label="Veli paneli menüsü">
      <div class="admin-create"><button type="button" class="btn full" data-quick-create="test">+ Fasikül çalışması</button><button type="button" class="btn secondary full" data-quick-create="reading">+ Okuma çalışması</button></div>
      <div class="admin-find"><label class="sr-only" for="adminFind">İşlem ara</label><input id="adminFind" type="search" placeholder="İşlem ara: örn. yedek, karne…" autocomplete="off"><div id="adminFindResults" class="admin-find-results" hidden></div></div>
      <nav class="admin-nav" aria-label="Veli paneli bölümleri" role="tablist">${UI_TABS.map(([id,label,icon,desc])=>`<button type="button" role="tab" id="tab-${id}" aria-controls="panel-${id}" data-ui-tab="${id}"><span class="admin-nav-icon" aria-hidden="true">${icon}</span><span class="admin-nav-text"><strong>${label}</strong><small>${desc}</small></span></button>`).join('')}</nav>
    </aside><div class="admin-content"></div>`;
  hero.insertAdjacentElement('afterend',shell);
  const content=shell.querySelector('.admin-content');
  const panels=Object.fromEntries(UI_TABS.map(([id])=>{const panel=document.createElement('section');panel.id=`panel-${id}`;panel.className='ui-tab-panel';content.append(panel);return [id,panel]}));
  panels.overview.innerHTML=uiOverviewMarkup(data,readingData,dashboard);
  const move=(selector,panel)=>{const node=document.querySelector(selector);if(node)panel.append(node)};
  const flash=document.querySelector('#flash');if(flash)content.prepend(flash);
  move('#badgesWidget',panels.overview);
  for(const selector of ['#assignmentHeading','#assignmentList'])move(selector,panels.tests);
  move('#readingHomeSection',panels.reading);
  move('#studyDashboard',panels.repeat);
  panels.progress.insertAdjacentHTML('afterbegin',uiWeekChart(dashboard.weekSeries||[])+uiHeatmap(progress));
  move('#progressSection',panels.progress);move('.reading-progress',panels.progress);
  for(const selector of ['#accountSection','#auditSummary','#calendarSection','#curriculumSection','#backupSection'])move(selector,panels.tools);
  const resolve=id=>UI_TAB_ALIAS[id]||id;
  const show=id=>{
    id=resolve(id);
    if(!UI_TABS.some(([key])=>key===id))id='overview';
    try{sessionStorage.setItem('cioParentTab',id)}catch(e){}
    if(('#tab-'+id)!==location.hash)history.replaceState(null,'','#tab-'+id);
    for(const [key] of UI_TABS){const panel=document.querySelector(`#panel-${key}`),tab=document.querySelector(`#tab-${key}`);if(!panel||!tab)continue;panel.hidden=key!==id;tab.setAttribute('aria-selected',String(key===id));tab.tabIndex=key===id?0:-1}
  };
  const initial=resolve((location.hash||'').replace('#tab-',''))||sessionStorage.getItem('cioParentTab')||'overview';
  window.uiShowParentTab=show;  // used by the router in app.js for back/forward between tabs
  const navButtons=[...shell.querySelectorAll('[data-ui-tab]')];
  navButtons.forEach((button,index)=>{button.onclick=()=>show(button.dataset.uiTab);button.onkeydown=e=>{if(!['ArrowRight','ArrowLeft','ArrowDown','ArrowUp','Home','End'].includes(e.key))return;e.preventDefault();const next=e.key==='Home'?0:e.key==='End'?UI_TABS.length-1:(index+((e.key==='ArrowRight'||e.key==='ArrowDown')?1:-1)+UI_TABS.length)%UI_TABS.length;show(UI_TABS[next][0]);navButtons[next].focus()}});
  document.querySelectorAll('[data-go-tab]').forEach(button=>button.onclick=()=>{show(button.dataset.goTab);const target=button.dataset.focusId&&document.querySelector('#'+button.dataset.focusId);target?.scrollIntoView({behavior:'smooth',block:'start'})});
  document.querySelectorAll('[data-quick-open]').forEach(button=>button.onclick=()=>button.dataset.quickOpen==='reading'?renderReadingAssignment(Number(button.dataset.assignmentId)):renderAssignment(Number(button.dataset.assignmentId)));
  shell.querySelectorAll('[data-quick-create]').forEach(button=>button.onclick=()=>button.dataset.quickCreate==='reading'?renderReadingCatalog():renderCatalog());
  const find=shell.querySelector('#adminFind'),results=shell.querySelector('#adminFindResults');
  const norm=s=>(s||'').toLocaleLowerCase('tr');
  find.addEventListener('input',()=>{
    const q=norm(find.value).trim();
    if(!q){results.hidden=true;results.innerHTML='';return}
    const hits=UI_ACTIONS.filter(a=>norm(a.t).includes(q)||norm(a.d).includes(q)).slice(0,7);
    results.innerHTML=hits.length?hits.map((a,i)=>`<button type="button" data-hit="${i}"><strong>${esc(a.t)}</strong><small>${esc(a.d)}</small></button>`).join(''):'<div class="admin-find-empty">Sonuç yok — sekmelere göz atın.</div>';
    results.hidden=false;
    results.querySelectorAll('[data-hit]').forEach(btn=>btn.onclick=()=>{const a=hits[Number(btn.dataset.hit)];show(a.tab);results.hidden=true;find.value='';if(a.run)a.run()});
  });
  find.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();results.querySelector('[data-hit]')?.click()}if(e.key==='Escape'){find.value='';results.hidden=true}});
  show(initial);
}
function uiWeekChart(series){
  const max=Math.max(1,...series.map(x=>Math.max(x.assigned,x.submitted)));
  return `<section class="card ui-chart-card"><h3>Son 8 hafta</h3><p class="small muted">Atanan ve teslim edilen çalışma sayısı</p><div class="ui-chart-legend"><span><i class="assigned"></i> Atanan</span><span><i class="submitted"></i> Teslim edilen</span></div><div class="ui-week-chart" role="img" aria-label="Son sekiz haftada atanan ve teslim edilen çalışma sayıları">${series.map(x=>`<div class="ui-week-col" title="${esc(uiDate(x.start,{weekday:false}))} haftası: ${x.assigned} atanan, ${x.submitted} teslim"><div class="ui-week-bars"><span class="assigned" style="height:${x.assigned?Math.max(7,x.assigned/max*100):0}%"></span><span class="submitted" style="height:${x.submitted?Math.max(7,x.submitted/max*100):0}%"></span></div><small>${esc(uiShortDate(x.start))}</small><span class="ui-chart-values">${x.assigned}/${x.submitted}</span></div>`).join('')}</div></section>`;
}
function uiHeatmap(progress){
  const items=progress.byBooklet||[];
  return `<section class="card ui-chart-card"><h3>Ders ve ünite görünümü</h3><p class="small muted">Yüzde için en az 5 soru değerlendirilmiş olmalı. Renklerin yanında sonuç sayısı da yazılır.</p>${items.length?`<div class="ui-heatmap">${items.map(x=>{const percent=Math.round(x.correct/x.reviewed*100),level=x.reviewed<5?'limited':percent>=80?'strong':percent>=50?'middle':'needs-work';return `<div class="ui-heat-cell ${level}"><strong>${esc(x.course)}</strong><span>${esc(x.title)}</span><small>${x.correct}/${x.reviewed} doğru${x.reviewed>=5?` · %${percent}`:' · Veri az'}</small></div>`}).join('')}</div>`:'<div class="empty">Ünite grafiği ilk değerlendirmelerden sonra oluşacak.</div>'}</section>`;
}
function uiEnhanceStudentHome(data,readingData){
  uiPrepareHomeNodes();
  const pending=[...data.assignments.map(a=>({...a,kind:'test'})),...readingData.assignments.map(a=>({...a,kind:'reading'}))].filter(a=>!a.submitted_at);
  pending.sort((a,b)=>(a.due_date||'9999-99-99').localeCompare(b.due_date||'9999-99-99')||b.id-a.id);
  const main=document.querySelector('.main'),hero=main?.querySelector('.hero');if(!hero)return;
  const focus=document.createElement('div');focus.id='homeFocus';hero.insertAdjacentElement('afterend',focus);
  const flash=document.querySelector('#flash');if(flash)hero.insertAdjacentElement('afterend',flash);
  const assignments=document.createElement('div');assignments.id='homeAssignments';
  for(const selector of ['#assignmentHeading','#assignmentList','#readingHomeSection']){const node=document.querySelector(selector);if(node)assignments.append(node)}
  focus.insertAdjacentElement('afterend',assignments);
  const completed=document.createElement('div');completed.id='completedWork';assignments.insertAdjacentElement('afterend',completed);
  // Pending work first; badges come after the student's tasks.
  const badges=document.querySelector('#badgesWidget');if(badges)completed.insertAdjacentElement('afterend',badges);
  const next=pending[0];
  const mistakesButton='<button type="button" class="btn secondary" id="openMistakes">📓 Hata Defterim</button>';
  focus.innerHTML=next?`<section class="student-today"><div><span class="eyebrow">Sıradaki çalışma</span><h2>${esc(next.title)}</h2><p>${next.kind==='reading'?'Okuma Becerileri':'Fasikül'} · ${next.answered}/${next.total} soru yanıtlandı</p>${next.due_date?`<p class="student-due">Hedef: <strong>${esc(uiDueText(next.due_date))}</strong></p>`:''}</div><div class="toolbar"><button class="btn" id="openToday">${next.answered?'Devam et':'Başla'} →</button>${mistakesButton}<button type="button" class="link-btn" id="printToday">🖨 Yazdır</button></div></section>`:`<section class="student-today finished"><div><h2>Şimdilik yeni çalışma yok</h2><p>Yeni bir çalışma atandığında burada görünecek.</p></div><div class="toolbar">${mistakesButton}</div></section>`;
  document.querySelector('#openToday')?.addEventListener('click',()=>next.kind==='reading'?renderReadingAssignment(next.id):renderAssignment(next.id));
  document.querySelector('#openMistakes')?.addEventListener('click',()=>renderMistakesNotebook());
  document.querySelector('#printToday')?.addEventListener('click',()=>renderPrintWorksheet(next.kind,next.id,renderHome));
  if(next){const selector=next.kind==='reading'?`[data-reading-open="${next.id}"]`:`[data-open="${next.id}"]`;document.querySelector(selector)?.closest('article')?.setAttribute('hidden','')}
  const cards=[...document.querySelectorAll('#homeAssignments [data-open],#homeAssignments [data-reading-open]')].map(b=>b.closest('article')).filter(Boolean);
  const finished=cards.filter(card=>{const button=card.querySelector('[data-open],[data-reading-open]');const a=button.hasAttribute('data-open')?data.assignments.find(x=>x.id===Number(button.dataset.open)):readingData.assignments.find(x=>x.id===Number(button.dataset.readingOpen));return !!a?.submitted_at});
  if(finished.length){completed.innerHTML=`<details class="card ui-completed"><summary>Tamamlanan çalışmalar (${finished.length})</summary><div class="grid"></div></details>`;const grid=completed.querySelector('.grid');finished.forEach(card=>grid.append(card))}
  const remaining=pending.filter(a=>!next||a.kind!==next.kind||a.id!==next.id);
  const hasTest=remaining.some(a=>a.kind==='test'),hasReading=remaining.some(a=>a.kind==='reading');
  document.querySelector('#assignmentHeading').hidden=!hasTest;
  document.querySelector('#assignmentList').hidden=!hasTest;
  document.querySelector('#readingHomeSection').hidden=!hasReading;
  assignments.hidden=!hasTest&&!hasReading;
}
function uiModal({title, body, okText='Kaydet', cancelText='Vazgeç'}){
  return new Promise(resolve=>{
    const wrap=document.createElement('div');
    wrap.className='summary-overlay';
    wrap.innerHTML=`<div class="summary-dialog" role="dialog" aria-modal="true" aria-label="${esc(title)}"><h2>${esc(title)}</h2><div class="modal-body">${body}</div><div class="toolbar" style="margin-top:16px"><button type="button" class="btn secondary" data-m="cancel">${esc(cancelText)}</button><button type="button" class="btn" data-m="ok">${esc(okText)}</button></div></div>`;
    document.body.append(wrap);
    const close=v=>{wrap.remove();resolve(v)};
    wrap.querySelector('[data-m=cancel]').onclick=()=>close(null);
    wrap.addEventListener('pointerdown',e=>{if(e.target===wrap)close(null)});
    wrap.querySelector('[data-m=ok]').onclick=()=>{
      const input=wrap.querySelector('[data-m=input]');
      close(input?input.value:null);
    };
    const input=wrap.querySelector('[data-m=input]');
    if(input){input.focus();input.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();wrap.querySelector('[data-m=ok]').click()}if(e.key==='Escape')close(null)})}
    else wrap.querySelector('[data-m=ok]').focus();
  });
}
function uiPrompt(title, value='', opts={}){
  const type=opts.type||'text';
  return uiModal({title, okText:opts.okText||'Kaydet',
    body:`<div class="field"><label for="uiPromptInput">${esc(opts.label||title)}</label><input id="uiPromptInput" data-m="input" type="${type}" maxlength="${opts.max||100}" value="${esc(value)}" placeholder="${esc(opts.placeholder||'')}"></div>${opts.hint?`<p class="small muted">${esc(opts.hint)}</p>`:''}`});
}
function uiConfirm(title, text, okText='Sil'){
  return uiModal({title, okText, body:`<p>${text}</p>`}).then(v=>v!==null);
}
function uiToast(msg, kind=''){
  let wrap=document.querySelector('.toast-wrap');
  if(!wrap){wrap=document.createElement('div');wrap.className='toast-wrap';wrap.setAttribute('aria-live','polite');document.body.append(wrap)}
  const el=document.createElement('div');
  el.className='toast '+kind;
  el.textContent=msg;
  wrap.append(el);
  setTimeout(()=>el.remove(),4500);
}
function uiBindImageZoom(){
  document.querySelectorAll('a.image-zoom').forEach(link=>link.addEventListener('click',e=>{e.preventDefault();uiOpenImageViewer(link.href,link.querySelector('img')?.alt||'Soru görseli')}));
}
function uiOpenImageViewer(src,alt){
  const dialog=document.createElement('dialog');dialog.className='ui-image-dialog';dialog.innerHTML=`<div class="ui-image-toolbar"><strong>${esc(alt)}</strong><div><button type="button" data-zoom="out" aria-label="Uzaklaştır">−</button><button type="button" data-zoom="reset">%100</button><button type="button" data-zoom="in" aria-label="Yakınlaştır">+</button><button type="button" data-zoom="close">Kapat</button></div></div><div class="ui-image-scroll"><img src="${esc(src)}" alt="${esc(alt)}"></div>`;
  document.body.append(dialog);dialog.showModal();let scale=1;const image=dialog.querySelector('img'),scroller=dialog.querySelector('.ui-image-scroll');
  const update=()=>{image.style.width=`${Math.round(scale*100)}%`;dialog.querySelector('[data-zoom=reset]').textContent=`%${Math.round(scale*100)}`};
  dialog.querySelectorAll('[data-zoom]').forEach(button=>button.onclick=()=>{if(button.dataset.zoom==='close'){dialog.close();return}scale=button.dataset.zoom==='reset'?1:Math.max(.75,Math.min(3,scale+(button.dataset.zoom==='in'?.25:-.25)));update()});
  let start=null;scroller.addEventListener('pointerdown',e=>{if(e.target!==image)return;start={x:e.clientX,y:e.clientY,left:scroller.scrollLeft,top:scroller.scrollTop};scroller.setPointerCapture(e.pointerId)});scroller.addEventListener('pointermove',e=>{if(!start)return;scroller.scrollLeft=start.left-(e.clientX-start.x);scroller.scrollTop=start.top-(e.clientY-start.y)});scroller.addEventListener('pointerup',()=>start=null);
  dialog.addEventListener('close',()=>dialog.remove());
}
uiApplyPreferences();

function formatDurationBadge(seconds) {
  if (!seconds || seconds <= 0) return '<span class="pill gray">⏱️ Süre: -</span>';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const timeStr = mins > 0 ? `${mins} dk ${secs} sn` : `${secs} sn`;
  if (seconds > 180) {
    return `<span class="pill purple" title="Öğrenci bu soruda 3 dakikadan uzun düşündü">⏱️ ${timeStr} (Uzun)</span>`;
  } else if (seconds < 15) {
    return `<span class="pill amber" title="Öğrenci bu soruyu 15 saniyeden kısa sürede yanıtladı">⚡ ${timeStr} (Hızlı)</span>`;
  } else {
    return `<span class="pill blue">⏱️ ${timeStr}</span>`;
  }
}
