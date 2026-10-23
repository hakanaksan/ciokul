const app = document.querySelector('#app');
const TEST_SIZE = 15;
const state = { role: null, studentName: '', view: 'home', assignment: null, catalog: null, bookletId: null, testIndex: 0, draftTitle: '', draftDueDate:'', calendarMonth:'', questionIndex: 0, loginRole: 'student', selected: new Set(), flash: '' };

const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
async function api(path, options={}) {
  const response = await fetch(path, {credentials:'same-origin', headers:{'Content-Type':'application/json'}, ...options});
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Bir hata oluştu.');
  return data;
}
function brand(){return `<div class="brand"><span class="mark">✦</span><span>CioOkul</span></div>`}
function shell(content){app.innerHTML=`<div class="shell"><a class="skip-link" href="#mainContent">İçeriğe atla</a><header class="topbar">${brand()}<div class="top-actions"><span>${state.role==='parent'?'Veli paneli':esc(state.studentName)+' · Öğrenci'}</span>${uiPreferencesMarkup()}<button id="logout">Çıkış yap</button></div></header><main class="main" id="mainContent" tabindex="-1">${content}</main></div>`;document.querySelector('#logout').onclick=logout;uiBindPreferences()}
function flash(){return state.flash?`<div class="${state.flash.startsWith('Hata')?'error':'success'}">${esc(state.flash)}</div>`:''}
function setFlash(message){state.flash=message;setTimeout(()=>{state.flash=''},5000);if(message)uiToast(message,message.startsWith('Hata')?'error':'')}
function showError(err){setFlash('Hata: '+err.message);const el=document.querySelector('#flash');if(el)el.innerHTML=flash();else uiToast(err.message,'error')}
async function logout(){await api('/api/logout',{method:'POST',body:'{}'});state.role=null;state.assignment=null;renderLogin()}

function renderSetup(){app.innerHTML=`<div class="auth-wrap"><div class="auth">${brand()}<h1>Çalışma masanızı kurun</h1><p>${state.setupTokenRequired?'Bu bilgiler çalışma masasının sunucusunda tutulur.':'Bu bilgiler yalnızca bu bilgisayarda tutulur.'} Önce veli şifresini ve öğrenci girişini oluşturun.</p><form id="setup"><div class="field"><label for="studentName">Öğrencinin adı</label><input id="studentName" maxlength="50" required placeholder="Örneğin: Ali"></div><div class="field"><label for="parentPassword">Veli şifresi</label><input id="parentPassword" type="password" minlength="8" required placeholder="En az 8 karakter"></div><div class="field"><label for="studentPin">Öğrenci PIN'i</label><input id="studentPin" type="password" inputmode="numeric" pattern="[0-9]{4,}" required placeholder="En az 4 rakam"></div>${state.setupTokenRequired?`<div class="field"><label for="setupToken">Kurulum anahtarı</label><input id="setupToken" type="password" required placeholder="Sunucuda tanımlı anahtar"></div>`:''}<div id="flash"></div><button class="btn full">Kurulumu tamamla</button></form></div></div>`;document.querySelector('#setup').onsubmit=async e=>{e.preventDefault();try{const studentName=document.querySelector('#studentName').value,parentPassword=document.querySelector('#parentPassword').value,studentPin=document.querySelector('#studentPin').value,setupToken=document.querySelector('#setupToken')?.value||'';await api('/api/setup',{method:'POST',body:JSON.stringify({studentName,parentPassword,studentPin,setupToken})});state.studentName=studentName;setFlash('Kurulum tamamlandı. Giriş yapabilirsiniz.');renderLogin()}catch(err){showError(err)}}}
function renderLogin(){app.innerHTML=`<div class="auth-wrap"><div class="auth">${brand()}<h1>Hoş geldiniz</h1><p>${esc(state.studentName||'Öğrenci')} için hazırlanan çalışma masası.</p><div class="role-switch"><button data-role="student" class="${state.loginRole==='student'?'active':''}">Öğrenci</button><button data-role="parent" class="${state.loginRole==='parent'?'active':''}">Veli</button></div><form id="login"><div class="field"><label>${state.loginRole==='parent'?'Veli şifresi':'Öğrenci PIN’i'}</label><input id="secret" type="password" ${state.loginRole==='student'?'inputmode="numeric"':''} required autofocus></div><div id="flash">${flash()}</div><button class="btn full">Giriş yap</button></form><div class="footer-note">${state.setupTokenRequired?'Çalışmalar güvenli sunucuda saklanır.':'Çalışmalar bu bilgisayarda saklanır.'}</div></div></div>`;document.querySelectorAll('[data-role]').forEach(b=>b.onclick=()=>{state.loginRole=b.dataset.role;renderLogin()});document.querySelector('#login').onsubmit=async e=>{e.preventDefault();try{const data=await api('/api/login',{method:'POST',body:JSON.stringify({role:state.loginRole,secret:document.querySelector('#secret').value})});state.role=data.role;state.view='home';await renderHome()}catch(err){showError(err)}}}
function localToday(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
function assignmentStatus(a){if(a.submitted_at)return a.reviewed===a.total?['Değerlendirildi','pill']:['Kontrol bekliyor','pill amber'];if(a.due_date&&a.due_date<localToday())return ['Hedef tarih geçti','pill amber'];if(a.answered)return [`${a.answered}/${a.total} yanıtlandı`,'pill blue'];return ['Başlamadı','pill gray']}
function progressMarkup(progress){
  const total=progress.byCourse.reduce((n,x)=>n+x.reviewed,0),correct=progress.byCourse.reduce((n,x)=>n+x.correct,0);
  return `<section class="planning-section" id="progressSection"><div class="section-title"><h2>İlerleme ve tekrar</h2><div class="toolbar"><span class="pill blue">${total} soru değerlendirildi</span><button class="btn secondary" data-action="report-card">📄 Gelişim Karnesi Yazdır</button></div></div>
    <p class="small muted">Sayılar velinin kaydettiği değerlendirmelerden hesaplanır. Kısmen doğru yanıtlar ayrı gösterilir.</p>
    ${total?`<div class="grid">${progress.byCourse.map(x=>`<article class="card"><strong>${esc(x.course)}</strong><p>${x.reviewed} soru · ${x.correct} doğru · ${x.incorrect} yanlış · ${x.partial} kısmen doğru</p><div class="progress"><span style="width:${Math.round(x.correct/x.reviewed*100)}%"></span></div></article>`).join('')}</div>
    <details class="planning-all"><summary>Ünite ayrıntıları</summary><div class="planning-table">${progress.byBooklet.map(x=>`<div><strong>${esc(x.course)}</strong><span>${esc(x.title)}</span><span>${x.correct} doğru / ${x.reviewed} değerlendirme · ${x.incorrect} yanlış · ${x.partial} kısmen</span></div>`).join('')}</div></details>
    <details class="planning-all"><summary>Aylara göre değişim</summary><div class="planning-table">${progress.trend.map(x=>`<div><strong>${esc(x.month)}</strong><span>${x.reviewed} soru</span><span>${x.correct} doğru · %${Math.round(x.correct/x.reviewed*100)}</span></div>`).join('')}</div></details>`:'<div class="empty">İlk çalışma değerlendirildiğinde ilerleme burada görünecek.</div>'}
    ${progress.weakUnits?.length?`<h3>Tekrar önerileri</h3><p class="small muted">Yanlış oranı yüksek üniteler önce gösterilir. Önerilen soruları kaldırıp çalışmanın adını düzenleyebilirsiniz.</p><div class="grid">${progress.weakUnits.map((unit,index)=>`<article class="card recommendation" data-recommendation="${index}"><h3>${esc(unit.course)} · ${esc(unit.title)}</h3><p>${unit.incorrect} yanlış · ${unit.partial} kısmen doğru / ${unit.reviewed} değerlendirme</p><div class="repeat-list">${unit.questions.map(q=>`<label><input type="checkbox" data-rec-q="${q.id}" checked><span>${q.number}. soru <small>${esc(q.reason)}</small></span></label>`).join('')}</div><div class="field"><label>Çalışma adı</label><input class="rec-title" maxlength="100" value="${esc(unit.course)} · ${esc(unit.title)} · Tekrar"></div><button class="btn" data-create-recommendation="${index}">Seçilenleri ata</button></article>`).join('')}</div>`:''}
    ${progress.wrongQuestions.length?`<div class="card repeat-card"><h3>Yanlışları tekrar çalışması</h3><p>Her sorunun son değerlendirmesi kullanılır. En fazla 15 soru seçin.</p><div class="repeat-list">${progress.wrongQuestions.map((q,i)=>`<label><input type="checkbox" data-repeat="${q.id}" ${i<15?'checked':''}><span>${esc(q.course)} · ${esc(q.booklet_title)} · ${q.number}. soru <small>${q.grade==='partial'?'Kısmen doğru':'Yanlış'}</small></span></label>`).join('')}</div><div class="field"><label for="repeatTitle">Yeni çalışmanın adı</label><input id="repeatTitle" maxlength="100" value="Yanlışları tekrar çalışması"></div><button class="btn" id="createRepeat">Seçilenlerden çalışma oluştur</button></div>`:''}
  </section>`;
}
function calendarMarkup(assignments,month){
  const [year,number]=month.split('-').map(Number),first=new Date(year,number-1,1);
  const offset=(first.getDay()+6)%7,days=new Date(year,number,0).getDate();
  const cells=Array.from({length:offset},()=>'<div class="calendar-day muted-day"></div>');
  for(let day=1;day<=days;day++){
    const date=`${month}-${String(day).padStart(2,'0')}`;
    const due=assignments.filter(a=>a.due_date===date);
    cells.push(`<div class="calendar-day ${date===localToday()?'today':''}"><strong>${day}</strong>${due.map(a=>`<button class="calendar-task ${a.submitted_at?'finished':''}" data-calendar-open="${a.id}" data-calendar-kind="${a.reading?'reading':'test'}" title="${esc(a.title)}">${a.submitted_at?'✓ ':''}${esc(a.title)}</button>`).join('')}</div>`);
  }
  return `<section class="planning-section" id="calendarSection"><div class="section-title"><h2>Çalışma takvimi</h2><input id="calendarMonth" type="month" value="${esc(month)}" aria-label="Takvim ayı"></div><div class="calendar-grid">${['Pzt','Sal','Çar','Per','Cum','Cmt','Paz'].map(x=>`<div class="calendar-weekday">${x}</div>`).join('')}${cells.join('')}</div><p class="small muted">Hedef tarihi çalışma kartından değiştirebilirsiniz. ✓ işareti teslim edilen çalışmayı gösterir.</p></section>`;
}
async function renderHome(){
  state.view='home';
  stopStudyCalm();
  if(state.role)shell(`<div class="hero"><div class="eyebrow">Yükleniyor</div><h1>Çalışmalar hazırlanıyor…</h1></div><div class="grid" style="margin-top:16px"><div class="skeleton"></div><div class="skeleton"></div><div class="skeleton"></div></div>`);
  try{
    const isParent=state.role==='parent';
    const [data,planning,progress,backupStatus,auditStatus,readingData,readingProgress,studyDashboard,badgesData]=await Promise.all([api('/api/assignments'),isParent?api('/api/catalog'):Promise.resolve(null),isParent?api('/api/progress'):Promise.resolve(null),isParent?api('/api/backup/status'):Promise.resolve(null),isParent?api('/api/audit/status'):Promise.resolve(null),api('/api/reading/assignments'),isParent?api('/api/reading/progress'):Promise.resolve(null),isParent?api('/api/study/dashboard'):Promise.resolve(null),api('/api/student/badges')]);
    if(!state.calendarMonth)state.calendarMonth=localToday().slice(0,7);
    const backupAge=backupStatus?.lastBackupAt?(Date.now()-Date.parse(backupStatus.lastBackupAt.replace(' ','T')+'Z'))/86400000:Infinity;
    const currentMonth=`${new Date().getFullYear()}-${String(new Date().getMonth()+1).padStart(2,'0')}`;
    const suggested=isParent?[...new Set(planning.booklets.map(b=>b.course))].map(course=>{
      const candidates=planning.booklets.filter(b=>b.course===course).flatMap(b=>b.suggestedTests.map(t=>({booklet:b,test:t})));
      return candidates.find(item=>item.test.yearMonth>=currentMonth)||candidates.at(-1);
    }).filter(Boolean):[];
    shell(`<section class="hero"><div class="eyebrow">${isParent?'Veli çalışma alanı':'Öğrenci çalışma alanı'}</div><h1>${isParent?'Çalışmaları birlikte takip edin.':'Bugün hangi soruları çözeceğiz?'}</h1><p>${isParent?'15 soruluk testleri seçin, çalışmayı adlandırın ve cevapları kontrol edin.':'Atanan çalışmanı aç, soruları cevapla ve teslim et.'}</p><div class="stat-row"><div class="stat"><strong>${data.assignments.length+readingData.assignments.length}</strong><span>Toplam çalışma</span></div><div class="stat"><strong>${data.assignments.filter(a=>a.submitted_at).length+readingData.assignments.filter(a=>a.submitted_at).length}</strong><span>Teslim edilen</span></div><div class="stat"><strong>⭐ ${badgesData?.stats?.totalStars||0}</strong><span>Kazanılan yıldız</span></div></div></section>
      ${badgesWidgetMarkup(badgesData)}
      <div class="section-title"><h2>${isParent?'Atanan çalışmalar':'Çalışmalarım'}</h2><div class="toolbar">${isParent?'<button class="btn secondary" id="btnSearchQuestions">🔍 Konu & Soru Ara</button><button class="btn secondary" id="newMixedAssignment">🎯 Karma deneme oluştur</button><button class="btn" id="newAssignment">+ Yeni çalışma</button><button class="btn secondary" id="btnReportCard">📄 Gelişim Karnesi</button>':''}<button class="btn secondary" id="btnMistakes">📓 Hata Defteri${isParent?'':'m'}</button></div></div><div id="flash">${flash()}</div>
      ${data.assignments.length?`<div class="grid">${data.assignments.map(a=>{const[s,c]=assignmentStatus(a);return `<article class="card"><div class="card-top"><div class="eyebrow">${a.total} soru</div><span class="${c}">${esc(s)}</span></div><h3>${esc(a.title)}</h3><p>${a.submitted_at?'Teslim edildi':'Çözülmeyi bekliyor'} · ${esc(a.created_at.slice(0,10))}${a.due_date?` · Hedef: ${esc(a.due_date)}`:''}</p><div class="card-actions"><button class="btn secondary" data-open="${a.id}">${isParent?'Aç ve kontrol et':'Çalışmayı aç'} →</button><button class="link-btn" data-print="${a.id}">Yazdır</button>${isParent?`<button class="link-btn" data-rename="${a.id}">Adı değiştir</button><button class="link-btn" data-due="${a.id}">Hedef tarih</button><button class="link-btn danger" data-delete="${a.id}">Sil</button>`:''}</div></article>`}).join('')}</div>`:`<div class="empty">Henüz fasikül çalışması yok.</div>`}
      ${readingHomeMarkup(readingData.assignments,isParent,readingProgress)}
      ${isParent?studyDashboardMarkup(studyDashboard):''}
      ${isParent&&auditStatus?.summary?`<section class="planning-section card"><h2>Soru denetimi</h2><p>${auditStatus.summary.clean} / ${auditStatus.summary.questions} soru otomatik dosya, sayfa ve cevap anahtarı denetiminden geçti. ${auditStatus.contextQuestions} sorunun ortak metin veya grafiği görseline eklendi; ${auditStatus.trimmedPrevious} kesimden sonraki soruya ait içerik çıkarıldı.</p><p class="small muted">Otomatik denetim, tek tek insan gözüyle onay anlamına gelmez. Şüpheli bir görseli fasikül listesinden işaretleyip düzeltebilirsiniz.</p><a href="/api/audit/report" download="soru_denetimi.csv">Ayrıntılı denetim raporunu indir</a></section>`:''}
      ${isParent?progressMarkup(progress):''}
      ${isParent?calendarMarkup([...data.assignments,...readingData.assignments.map(a=>({...a,reading:true}))],state.calendarMonth):''}
      ${isParent?`<section class="planning-section"><div class="section-title"><h2>Tahmini müfredat takvimi</h2><span class="pill blue">${esc(planning.schoolYear)}</span></div>
        <p class="small muted">Ay önerileri, MEB takvimi ve ünite sırasından hesaplandı. Fasiküller 2020–2021 döneminde yayımlandı; öğretmenin işleyişine göre zamanı değiştirebilirsiniz.</p>
        <div class="planning-grid">${suggested.map(({booklet:b,test:t})=>`<article class="planning-card"><strong>${esc(b.course)}</strong><span>${esc(b.title)} · Test ${t.test}</span><span class="pill blue">Tahmini: ${esc(t.month)}</span><button class="link-btn" data-planned="${b.id}" data-test-index="${t.test-1}">Testi aç →</button></article>`).join('')}</div>
        <details class="planning-all"><summary>Tüm fasiküllerin tahmini aylarını göster</summary><div class="planning-table">${planning.booklets.map(b=>`<div><strong>${esc(b.course)}</strong><span>${esc(b.title)}</span><span>${esc(b.suggestedMonths)}</span></div>`).join('')}</div></details>
        <details class="planning-sources"><summary>Hesaplama ve MEB kaynakları</summary><p>Öneri, ünitenin yaklaşık bitişinden sonra haftada iki kısa test çözülmesi varsayımıyla hazırlanır. Türkçe tema ve İngilizce üniteleri yıl içine yaklaşık eşit dağıtılmıştır.</p><ul>${planning.planningSources.map(s=>`<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.title)}</a></li>`).join('')}</ul></details>
      </section>`:''}
      ${isParent?`<section class="planning-section card"><h2>Yedekleme ve Veri Güvenliği</h2>${backupAge>=14?`<div class="notice">Son 14 günde manuel yedek alınmadı. Çalışmaları korumak için yeni bir yedek indirin.</div>`:`<p class="small muted">Son manuel yedek: ${esc(backupStatus.lastBackupAt.slice(0,10))}</p>`}<div style="margin:10px 0;padding:10px 14px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;font-size:13px;line-height:1.5;color:#166534"><strong>🛡️ Yerel Otomatik Yedek: Aktif</strong><br><span>Her günün ilk açılışında ve ödev değerlendirmelerinde anlık veritabanı kopyası alınır. <code>data/backups/</code> klasöründe son ${backupStatus?.autoBackupsCount||0} günlük snapshot saklanıyor.</span></div><p class="small muted">Manuel yedek, veritabanını ve soru görsellerini tek ZIP dosyasında saklar. Geri yükleme mevcut çalışmaları değiştirir; tamamlamak için uygulamayı kapatıp yeniden açın.</p><div class="toolbar"><a class="btn" href="/api/backup" download="cio_okul_yedek.zip">Manuel yedek indir</a><label class="btn secondary upload-label">Yedeği geri yükle<input id="restoreFile" type="file" accept=".zip,application/zip" hidden></label></div></section>`:''}
      <div class="footer-note">MEB 4. sınıf çalışma fasikülleri · 6 ders · 39 fasikül</div>`);
    document.querySelector('#newAssignment')?.addEventListener('click',()=>renderCatalog());
    document.querySelector('#newMixedAssignment')?.addEventListener('click',()=>renderMixedBuilder());
    document.querySelector('#btnSearchQuestions')?.addEventListener('click',()=>renderQuestionSearch());
    document.querySelector('#btnMistakes')?.addEventListener('click',()=>renderMistakesNotebook());
    document.querySelector('#btnReportCard')?.addEventListener('click',()=>renderReportCard(renderHome));
    document.querySelectorAll('[data-action="report-card"]').forEach(b=>b.onclick=()=>renderReportCard(renderHome));
    bindReadingHome(readingData.assignments,isParent);
    if(isParent)bindStudyDashboard(studyDashboard);
    bindBadgesWidget();
    document.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>renderAssignment(Number(b.dataset.open)));
    document.querySelectorAll('[data-print]').forEach(b=>b.onclick=()=>renderPrintWorksheet('test',Number(b.dataset.print),renderHome));
    document.querySelectorAll('[data-planned]').forEach(b=>b.onclick=()=>renderCatalog(Number(b.dataset.planned),Number(b.dataset.testIndex)));
    document.querySelector('#calendarMonth')?.addEventListener('change',e=>{state.calendarMonth=e.target.value;renderHome()});
    document.querySelectorAll('[data-calendar-open]').forEach(b=>b.onclick=()=>b.dataset.calendarKind==='reading'?renderReadingAssignment(Number(b.dataset.calendarOpen)):renderAssignment(Number(b.dataset.calendarOpen)));
    document.querySelectorAll('[data-rename]').forEach(b=>b.onclick=async()=>{
      const assignment=data.assignments.find(a=>a.id===Number(b.dataset.rename));
      const title=await uiPrompt('Çalışmanın yeni adı',assignment.title,{label:'Çalışma adı',max:100});
      if(title===null||title.trim()===assignment.title)return;
      try{await api(`/api/assignments/${assignment.id}`,{method:'PUT',body:JSON.stringify({title})});setFlash('Çalışmanın adı değiştirildi.');renderHome()}catch(err){showError(err)}
    });
    document.querySelectorAll('[data-due]').forEach(b=>b.onclick=async()=>{
      const assignment=data.assignments.find(a=>a.id===Number(b.dataset.due));
      const value=await uiPrompt('Hedef tarih (YYYY-AA-GG)',assignment.due_date||'',{label:'Hedef tarih',hint:'Temizlemek için boş bırakın.'});
      if(value===null)return;
      try{await api(`/api/assignments/${assignment.id}`,{method:'PUT',body:JSON.stringify({dueDate:value.trim()})});setFlash('Hedef tarih kaydedildi.');renderHome()}catch(err){showError(err)}
    });
    document.querySelectorAll('[data-delete]').forEach(b=>b.onclick=async()=>{
      const assignment=data.assignments.find(a=>a.id===Number(b.dataset.delete));
      if(!await uiConfirm('Çalışma silinsin mi?',`“${esc(assignment.title)}” çalışması, ${assignment.answered} yanıt ve ${assignment.reviewed} değerlendirme silinecek.`))return;
      try{await api(`/api/assignments/${assignment.id}`,{method:'DELETE'});setFlash('Çalışma ve ona ait yanıtlar silindi.');renderHome()}catch(err){showError(err)}
    });
    document.querySelector('#createRepeat')?.addEventListener('click',async()=>{
      const ids=[...document.querySelectorAll('[data-repeat]:checked')].map(x=>Number(x.dataset.repeat));
      if(!ids.length||ids.length>TEST_SIZE){showError(new Error('1–15 soru seçin.'));return}
      try{const result=await api('/api/assignments',{method:'POST',body:JSON.stringify({title:document.querySelector('#repeatTitle').value.trim(),questionIds:ids})});await renderAssignment(result.id)}catch(err){showError(err)}
    });
    document.querySelectorAll('[data-create-recommendation]').forEach(button=>button.onclick=async()=>{
      const card=button.closest('.recommendation');
      const ids=[...card.querySelectorAll('[data-rec-q]:checked')].map(x=>Number(x.dataset.recQ));
      if(!ids.length||ids.length>TEST_SIZE){showError(new Error('1–15 soru seçin.'));return}
      try{const result=await api('/api/assignments',{method:'POST',body:JSON.stringify({title:card.querySelector('.rec-title').value.trim(),questionIds:ids})});await renderAssignment(result.id)}catch(err){showError(err)}
    });
    document.querySelector('#restoreFile')?.addEventListener('change',async e=>{
      const file=e.target.files[0];if(!file)return;
      if(!confirm('Bu yedek geri yüklendiğinde mevcut çalışmalar ve görsel düzeltmeleri değişecek. Devam edilsin mi?'))return;
      try{const response=await fetch('/api/backup/restore',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/zip'},body:file});const result=await response.json();if(!response.ok)throw new Error(result.error||'Geri yükleme başarısız.');if(result.restartRequired){setFlash('Yedek hazır. Uygulamayı kapatıp yeniden açın.');document.querySelector('#flash').innerHTML=flash()}else{setFlash('Yedek geri yüklendi'+(result.imagesSkipped?' (görsel düzeltmeleri bu sunucuda yüklenmedi)':'')+'. Lütfen yeniden giriş yapın.');state.role=null;renderLogin()}}catch(err){showError(err)}
    });
    if(isParent)uiInitParentTabs(data,readingData,studyDashboard,progress);
    else uiEnhanceStudentHome(data,readingData);
  }catch(err){showError(err)}
}
async function renderCatalog(bookletId,testIndex=0){
  try{
    const list=await api('/api/catalog');
    state.bookletId=(Number.isInteger(bookletId)?bookletId:null)||list.booklets.find(b=>b.count)?.id;
    const data=await api(`/api/catalog?bookletId=${state.bookletId}`);
    state.catalog=data;
    state.testIndex=Number.isInteger(testIndex)?testIndex:0;
    state.selected=new Set(data.questions.slice(state.testIndex*TEST_SIZE,(state.testIndex+1)*TEST_SIZE).map(q=>q.id));
    const booklet=data.booklets.find(b=>b.id===state.bookletId);
    state.draftTitle=`${booklet.course} · ${booklet.title} · Test ${state.testIndex+1}`;
    state.draftDueDate='';
    drawCatalog();
  }catch(err){showError(err)}
}
async function refreshCatalog(){
  const selected=new Set(state.selected),title=state.draftTitle;
  state.catalog=await api(`/api/catalog?bookletId=${state.bookletId}`);
  state.selected=selected;state.draftTitle=title;drawCatalog();
}
async function updateQuestionFlag(id,current,after){
  const note=await uiPrompt('Görsel sorunu',current||'',{label:'Sorun notu',max:500,placeholder:'Sorunu yazın…',hint:'İşareti kaldırmak için boş bırakıp kaydedin.',okText:'Kaydet'});
  if(note===null)return;
  try{await api(`/api/questions/${id}/flag`,{method:'PUT',body:JSON.stringify({note})});await after()}catch(err){showError(err)}
}
async function verifyQuestion(id,after){
  try{await api(`/api/questions/${id}/verify`,{method:'PUT',body:'{}'});await after()}catch(err){showError(err)}
}
function renderCropEditor(q,back){
  state.view='crop';
  shell(`<button class="link-btn back" id="back">← Geri dön</button><div class="hero"><div class="eyebrow">Görsel düzeltme</div><h1>${esc(q.number)}. soru · PDF sayfa ${esc(q.page)}</h1><p>PDF sayfasında sorunun tamamını, şıkları ve grafikleri kapsayan bir dikdörtgen çizin.</p></div><div id="flash"></div>
    <div class="crop-layout"><div class="card"><div class="crop-surface" id="cropSurface"><img id="cropPage" src="/api/questions/${q.id}/page" alt="PDF sayfası"><div id="cropSelection"></div></div></div>
    <aside class="card"><h3>Seçilen alan</h3><p class="small muted">Fareyle veya dokunarak sayfa üzerinde sürükleyin. Alanı yeniden çizerek değiştirebilirsiniz.</p><button class="btn full" id="saveCrop" disabled>Görseli kes ve kaydet</button><p class="small muted">Kaydedilen görsel mevcut soru dosyasının yerine geçer ve doğrulandı olarak işaretlenir.</p></aside></div>`);
  document.querySelector('#back').onclick=back;
  const surface=document.querySelector('#cropSurface'),selection=document.querySelector('#cropSelection');
  let start=null,box=null;
  const point=e=>{const r=surface.getBoundingClientRect();return [Math.max(0,Math.min(1,(e.clientX-r.left)/r.width)),Math.max(0,Math.min(1,(e.clientY-r.top)/r.height))]};
  surface.onpointerdown=e=>{start=point(e);surface.setPointerCapture(e.pointerId);selection.style.display='block'};
  surface.onpointermove=e=>{if(!start)return;const p=point(e);box=[Math.min(start[0],p[0]),Math.min(start[1],p[1]),Math.max(start[0],p[0]),Math.max(start[1],p[1])];selection.style.left=box[0]*100+'%';selection.style.top=box[1]*100+'%';selection.style.width=(box[2]-box[0])*100+'%';selection.style.height=(box[3]-box[1])*100+'%'};
  surface.onpointerup=e=>{if(!start)return;surface.onpointermove(e);start=null;document.querySelector('#saveCrop').disabled=!box||box[2]-box[0]<.02||box[3]-box[1]<.02};
  document.querySelector('#saveCrop').onclick=async()=>{try{await api(`/api/questions/${q.id}/crop`,{method:'PUT',body:JSON.stringify({box})});setFlash('Görsel düzeltildi ve doğrulandı.');await back()}catch(err){showError(err)}};
}
function drawCatalog(){
  state.view='catalog';
  const data=state.catalog, allQuestions=data.questions, selectedBooklet=data.booklets.find(b=>b.id===state.bookletId);
  const testCount=Math.ceil(allQuestions.length/TEST_SIZE);
  const qs=allQuestions.slice(state.testIndex*TEST_SIZE,(state.testIndex+1)*TEST_SIZE);
  const suggested=selectedBooklet.suggestedTests[state.testIndex];
  const courses=[...new Set(data.booklets.map(b=>b.course))];
  shell(`<button class="link-btn back" id="back">← Çalışmalara dön</button><div class="hero"><div class="eyebrow">Yeni çalışma</div><h1>${esc(selectedBooklet.title)} · Test ${state.testIndex+1}</h1><p>Her test en fazla 15 sorudan oluşur. Görselleri kontrol edip çalışmaya kendi adınızı verin.</p></div><div id="flash">${flash()}</div>
    <div class="split" style="margin-top:20px"><section class="card"><h3>Çalışma bilgileri</h3>
    <div class="field"><label>Ders</label><select id="course">${courses.map(c=>`<option ${c===selectedBooklet.course?'selected':''}>${esc(c)}</option>`).join('')}</select></div>
    <div class="field"><label>Fasikül</label><select id="booklet">${data.booklets.filter(b=>b.course===selectedBooklet.course).map(b=>`<option value="${b.id}" ${b.id===state.bookletId?'selected':''}>${esc(b.title)} · ${Math.ceil(b.count/TEST_SIZE)} test</option>`).join('')}</select></div>
    <div class="field"><label>Test</label><div class="test-grid">${Array.from({length:testCount},(_,index)=>{const part=allQuestions.slice(index*TEST_SIZE,(index+1)*TEST_SIZE);const timing=selectedBooklet.suggestedTests[index];return `<button type="button" data-test="${index}" class="${index===state.testIndex?'active':''}">Test ${index+1}<small>${part[0].number}–${part.at(-1).number}. soru</small><small>${esc(timing.month)}</small></button>`}).join('')}</div></div>
    <div class="timing-notice"><strong>Tahmini zaman: ${esc(suggested.month)}</strong><span>Ünite konuları işlendiğinde verin; okulun yıllık planı daha önce veya sonra olabilir.</span></div>
    <div class="field"><label for="plannedMonth">Öğretmenin ilerleyişine göre planlanan ay</label><input id="plannedMonth" type="month" value="${esc(suggested.yearMonth)}"></div><div class="toolbar"><button class="btn secondary" id="savePlannedMonth">Ayı kaydet</button>${suggested.overridden?'<button class="link-btn" id="resetPlannedMonth">Tahmine dön</button>':''}</div>
    <div class="field"><label for="title">Çalışmanın adı</label><input id="title" maxlength="100" value="${esc(state.draftTitle)}" placeholder="Örneğin: Pazartesi matematik çalışması"></div>
    <div class="field"><label for="dueDate">Hedef tarih (isteğe bağlı)</label><input id="dueDate" type="date" value="${esc(state.draftDueDate)}"></div>
    <button class="btn full" id="create" ${state.selected.size?'':'disabled'}>Seçilen ${state.selected.size} soruyu ata</button>
    <div class="notice">Görseller otomatik kesildi. Cevap anahtarı olmayan sorular veli tarafından değerlendirilecektir.</div>
    <a href="/api/source-pdf?bookletId=${state.bookletId}" target="_blank" rel="noopener">Kaynak PDF’yi aç ↗</a></section>
    <section class="card catalog-list"><div class="card-top"><h3>Test ${state.testIndex+1} · ${qs.length} soru</h3><button class="link-btn" id="toggleAll">${state.selected.size===qs.length?'Tümünü kaldır':'Tümünü seç'}</button></div>
    ${qs.map(q=>`<div class="catalog-item"><label class="question-row"><input type="checkbox" data-q="${q.id}" ${state.selected.has(q.id)?'checked':''}><div><strong>${q.number}. soru <span>· PDF sayfa ${q.page}</span></strong><span>${q.answer_key?'Anahtar: '+q.answer_key:'Veli kontrolü gerekli'} · ${q.flag_note?'⚠ '+esc(q.flag_note):q.verified?'Kontrol edildi':'Otomatik kesim'}</span></div></label><details><summary>Görseli önizle</summary><img loading="lazy" class="review-image" src="/question-images/${encodeURIComponent(q.image_path)}" alt="${q.number}. soru"></details><div class="question-tools"><button class="link-btn" data-edit="${q.id}">Kesimi düzelt</button><button class="link-btn" data-flag="${q.id}">${q.flag_note?'Sorun notunu düzenle':'Sorun işaretle'}</button><button class="link-btn" data-verify="${q.id}">Doğrulandı</button></div></div>`).join('')}</section></div>`);
  document.querySelector('#back').onclick=renderHome;
  document.querySelector('#course').onchange=e=>renderCatalog(data.booklets.find(b=>b.course===e.target.value&&b.count)?.id);
  document.querySelector('#booklet').onchange=e=>renderCatalog(Number(e.target.value));
  document.querySelector('#title').oninput=e=>{state.draftTitle=e.target.value};
  document.querySelector('#dueDate').oninput=e=>{state.draftDueDate=e.target.value};
  const saveMonth=async value=>{try{await api('/api/plan-overrides',{method:'PUT',body:JSON.stringify({bookletId:state.bookletId,testIndex:state.testIndex,yearMonth:value})});setFlash(value?'Planlanan ay kaydedildi.':'Tahmini aya dönüldü.');await refreshCatalog()}catch(err){showError(err)}};
  document.querySelector('#savePlannedMonth').onclick=()=>saveMonth(document.querySelector('#plannedMonth').value);
  document.querySelector('#resetPlannedMonth')?.addEventListener('click',()=>saveMonth(''));
  document.querySelectorAll('[data-test]').forEach(button=>button.onclick=()=>{
    state.testIndex=Number(button.dataset.test);
    const part=allQuestions.slice(state.testIndex*TEST_SIZE,(state.testIndex+1)*TEST_SIZE);
    state.selected=new Set(part.map(q=>q.id));
    state.draftTitle=`${selectedBooklet.course} · ${selectedBooklet.title} · Test ${state.testIndex+1}`;
    drawCatalog();
  });
  document.querySelectorAll('[data-q]').forEach(c=>c.onchange=()=>{c.checked?state.selected.add(Number(c.dataset.q)):state.selected.delete(Number(c.dataset.q));document.querySelector('#create').textContent=`Seçilen ${state.selected.size} soruyu ata`;document.querySelector('#create').disabled=!state.selected.size;document.querySelector('#toggleAll').textContent=state.selected.size===qs.length?'Tümünü kaldır':'Tümünü seç'});
  document.querySelector('#toggleAll').onclick=()=>{state.selected=state.selected.size===qs.length?new Set():new Set(qs.map(q=>q.id));drawCatalog()};
  document.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>renderCropEditor(qs.find(q=>q.id===Number(b.dataset.edit)),refreshCatalog));
  document.querySelectorAll('[data-flag]').forEach(b=>b.onclick=()=>{const q=qs.find(x=>x.id===Number(b.dataset.flag));updateQuestionFlag(q.id,q.flag_note,refreshCatalog)});
  document.querySelectorAll('[data-verify]').forEach(b=>b.onclick=()=>verifyQuestion(Number(b.dataset.verify),refreshCatalog));
  document.querySelector('#create').onclick=async()=>{try{const title=document.querySelector('#title').value.trim();const result=await api('/api/assignments',{method:'POST',body:JSON.stringify({title,dueDate:document.querySelector('#dueDate').value,questionIds:[...state.selected]})});await renderAssignment(result.id)}catch(err){showError(err)}};
}
async function renderAssignment(id){try{const data=await api(`/api/assignments/${id}`);state.assignment=data;state.questionIndex=state.role==='student'?Math.min(data.assignment.last_question_index||0,data.questions.length-1):0;if(state.role==='parent')drawReview();else drawStudentFull()}catch(err){showError(err)}}
function studentQuestion(q,done){
  if(q.image_path)return `${scratchpadToolbarMarkup()}<div class="scratchpad-stage" id="questionScratchStage"><a class="image-zoom" href="/question-images/${encodeURIComponent(q.image_path)}" target="_blank" rel="noopener"><img class="question-image" src="/question-images/${encodeURIComponent(q.image_path)}" alt="${q.number}. soru görseli"><span>Görseli büyüt ↗</span></a></div>${q.kind==='written'?`<div class="field"><label for="writtenAnswer">Yanıtın</label><textarea id="writtenAnswer" maxlength="4000" rows="5" placeholder="Yanıtını buraya yaz" ${done?'disabled':''}>${esc(q.response||'')}</textarea></div>`:`<p class="answer-label">Yanıtını seç</p><div class="letter-options">${'ABCD'.split('').map(c=>`<label class="letter-choice ${q.response===c?'selected':''}"><input type="radio" name="answer" value="${c}" ${q.response===c?'checked':''} ${done?'disabled':''}><span>${c}</span></label>`).join('')}</div>`}`;
  return `<p class="stem">${esc(q.stem)}</p><div class="choices">${q.choices.map(c=>`<label class="choice ${q.response===c.label?'selected':''}"><input type="radio" name="answer" value="${c.label}" ${q.response===c.label?'checked':''} ${done?'disabled':''}><span class="letter">${c.label}</span><span>${esc(c.text)}</span></label>`).join('')}</div>`;
}
async function drawStudentFull(){
  state.view='assignment';
  const {assignment:a,questions:qs}=state.assignment;
  const i=state.questionIndex,q=qs[i],done=!!a.submitted_at,answered=qs.filter(x=>x.response).length;
  const feedbackReady=state.assignment.feedbackReady;
  shell(`<button class="link-btn back" id="back">← Çalışmalarıma dön</button><button class="link-btn" id="printCurrentTest" style="margin-left:14px;margin-bottom:18px">🖨 Yazdır</button><div class="hero"><div class="eyebrow">${done?'Teslim edildi':'Çalışma sürüyor'}</div><h1>${esc(a.title)}</h1><p>${done?(feedbackReady?'Veli kontrolü tamamlandı. Sonuçlarını inceleyebilirsin.':'Cevapların kaydedildi. Veli kontrolü bekleniyor.'):'Soruları çöz. Yanıtların kaydedilir.'}</p></div>${studyCalmMarkup()}
    <div class="split question-layout" style="margin-top:20px"><aside class="card"><strong>${answered}/${qs.length} soru yanıtlandı</strong><div class="progress"><span style="width:${answered/qs.length*100}%"></span></div><div class="number-nav">${qs.map((x,j)=>`<button data-index="${j}" class="${x.response?'answered':''} ${j===i?'current':''}" aria-label="${j+1}. soru">${j+1}</button>`).join('')}</div>${done?'':`<button class="btn full" id="submit">Teslim özetini aç</button>`}</aside>
    <section class="question-card"><div class="question-kicker"><span>Soru ${i+1} / ${qs.length}</span><div style="display:flex;align-items:center;gap:12px"><span class="pill gray" title="Bu soruda geçen süre">⏱️ <span id="studentLiveTimer">00:00</span></span><span>${esc(q.course)} · ${esc(q.booklet_title)} · ${q.number}. soru</span></div></div>${studentQuestion(q,done)}${studyUncertainMarkup(q,done)}
    ${feedbackReady?`<div class="feedback-box ${esc(q.grade)}"><strong>Veli değerlendirmesi: ${{correct:'Doğru',incorrect:'Yanlış',partial:'Kısmen doğru'}[q.grade]||''}</strong>${q.answer_key?`<span>Doğru cevap: ${esc(q.answer_key)}</span>`:''}${q.note?`<p>Veli notu: ${esc(q.note)}</p>`:''}</div>`:''}
    <div class="question-actions"><button class="btn secondary" id="prev" ${i===0?'disabled':''}>← Önceki</button><button class="btn" id="next" ${i===qs.length-1?'disabled':''}>Sonraki →</button></div><div id="flash">${flash()}</div></section></div><div id="submitSummary"></div>`);
  uiBindImageZoom();
  bindStudyCalm(drawStudentFull);
  bindStudyShortcuts();
  if(!done){
    bindStudyUncertain('test',a.id,String(q.id),q);
    resetStudentTimer();
  }
  initScratchpad('#questionScratchStage', `test_${a.id}_${q.id}`);
  document.querySelector('#printCurrentTest')?.addEventListener('click',()=>renderPrintWorksheet('test',a.id,drawStudentFull));
  const saveWritten=async()=>{
    const field=document.querySelector('#writtenAnswer');
    if(!field||done)return true;
    const text=field.value.trim();
    if(text===String(q.response||''))return true;
    const durationSeconds = consumeQuestionDuration();
    if(!text){
      if(q.response){try{await api(`/api/assignments/${a.id}/answers/${q.id}`,{method:'DELETE'});q.response=null}catch(err){showError(err);return false}}
      return true;
    }
    try{await api(`/api/assignments/${a.id}/answers/${q.id}`,{method:'PUT',body:JSON.stringify({text,durationSeconds})});q.response=text;q.duration_seconds=(q.duration_seconds||0)+durationSeconds;return true}catch(err){showError(err);return false}
  };
  document.querySelector('#back').onclick=async()=>{if(await saveWritten())renderHome()};
  const go=async index=>{if(!await saveWritten())return;try{if(!done)await api(`/api/assignments/${a.id}/progress`,{method:'PUT',body:JSON.stringify({index})});state.questionIndex=index;drawStudentFull()}catch(err){showError(err)}};
  document.querySelectorAll('[data-index]').forEach(b=>b.onclick=()=>go(Number(b.dataset.index)));
  document.querySelectorAll('input[name=answer]').forEach(input=>input.onchange=async()=>{const durationSeconds=consumeQuestionDuration();try{await api(`/api/assignments/${a.id}/answers/${q.id}`,{method:'PUT',body:JSON.stringify({choice:input.value,durationSeconds})});q.response=input.value;q.duration_seconds=(q.duration_seconds||0)+durationSeconds;drawStudentFull()}catch(err){showError(err)}});
  document.querySelector('#prev').onclick=()=>go(state.questionIndex-1);
  document.querySelector('#next').onclick=()=>go(state.questionIndex+1);
  document.querySelector('#submit')?.addEventListener('click',async()=>{
    if(!await saveWritten())return;
    const missing=qs.map((x,j)=>x.response?null:j+1).filter(Boolean);
    const panel=document.querySelector('#submitSummary');
    panel.innerHTML=`<div class="summary-overlay"><div class="summary-dialog"><h2>Teslim özeti</h2><p>${qs.length-missing.length} / ${qs.length} soru yanıtlandı.</p>${missing.length?`<div class="notice">Boş sorular: ${missing.join(', ')}. Teslim etmek için hepsini yanıtla.</div>`:'<div class="success">Tüm sorular yanıtlandı. Çalışmanı teslim edebilirsin.</div>'}<div class="toolbar"><button class="btn secondary" id="closeSummary">Sorulara dön</button>${missing.length?'':'<button class="btn" id="confirmSubmit">Çalışmayı teslim et</button>'}</div></div></div>`;
    panel.querySelector('#closeSummary').onclick=()=>{panel.innerHTML=''};
    panel.querySelector('#confirmSubmit')?.addEventListener('click',async()=>{try{await api(`/api/assignments/${a.id}/submit`,{method:'POST',body:'{}'});setFlash('Çalışma teslim edildi. Ana sayfaya döndün.');await renderHome()}catch(err){showError(err)}});
  });
}
let studentQuestionStart = Date.now();
let studentTimerInterval = null;
function resetStudentTimer(){
  studentQuestionStart = Date.now();
  if(studentTimerInterval) clearInterval(studentTimerInterval);
  const el = document.querySelector('#studentLiveTimer');
  if(!el) return;
  el.textContent = '00:00';
  studentTimerInterval = setInterval(()=>{
    const elapsed = Math.floor((Date.now() - studentQuestionStart)/1000);
    const m = String(Math.floor(elapsed/60)).padStart(2,'0');
    const s = String(elapsed%60).padStart(2,'0');
    if(el) el.textContent = `${m}:${s}`;
  },1000);
}
function consumeQuestionDuration(){
  if(studentTimerInterval){clearInterval(studentTimerInterval);studentTimerInterval=null}
  const elapsed = Math.round((Date.now() - studentQuestionStart)/1000);
  studentQuestionStart = Date.now();
  return Math.max(elapsed, 1);
}
function drawReview(){
  state.view='review';
  const {assignment:a,questions:qs}=state.assignment;
  const submitted=!!a.submitted_at;
  const answered=qs.filter(q=>q.response).length;
  const reviewed=qs.filter(q=>q.grade).length;
  const draft=new Map(qs.map(q=>[q.id,{
    grade:q.grade||(q.answer_key&&q.kind==='multiple_choice'?(q.response===q.answer_key?'correct':'incorrect'):''),
    note:q.note||'',reason:q.reason||''
  }]));
  let dirty=false;
  const statusText=!submitted?'Öğrencinin teslim etmesi bekleniyor.':reviewed===qs.length?'Tüm değerlendirmeler kaydedildi.':'Anahtarlı sorular önceden seçildi. Diğerlerini değerlendirin ve tümünü kaydedin.';
  shell(`<button class="link-btn back" id="back">← Çalışmalara dön</button>
    <div class="hero"><div class="eyebrow">Veli kontrolü</div><h1>${esc(a.title)}</h1>
    <p>${submitted?'Önceden seçilen sonuçları gözden geçirin, gerekiyorsa düzeltin ve tümünü birlikte kaydedin.':'Öğrenci henüz çalışmayı teslim etmedi. Yanıtlarını görebilirsiniz.'}</p>
    <div class="stat-row"><div class="stat"><strong>${answered}/${qs.length}</strong><span>Yanıt</span></div>
    <div class="stat"><strong>${reviewed}/${qs.length}</strong><span>Kaydedilmiş kontrol</span></div></div></div>
    <div class="section-title"><h2>Sorular ve yanıtlar</h2><div class="toolbar"><button class="btn secondary" id="printReviewCurrent">🖨 Çalışma kağıdı yazdır</button><button class="btn save-all" ${submitted?'':'disabled'}>Tümünü kaydet</button></div></div>
    <div id="flash">${flash()}</div><div class="notice save-status">${esc(statusText)}</div>
    <div class="review-grid">${qs.map(q=>{
      const selection=draft.get(q.id).grade;
      return `<article class="review-card" data-review="${q.id}"><div class="card-top"><strong>${q.number}. soru</strong><div style="display:flex;align-items:center;gap:6px">${formatDurationBadge(q.duration_seconds)}<span class="pill gray">PDF sayfa ${q.page}</span></div></div>
      ${q.image_path?`<a class="image-zoom" href="/question-images/${encodeURIComponent(q.image_path)}"><img loading="lazy" class="review-image" src="/question-images/${encodeURIComponent(q.image_path)}" alt="${q.number}. soru görseli"><span>Görseli büyüt ↗</span></a>`:`<p class="stem">${esc(q.stem)}</p>`}
      <div class="review-meta"><span>${esc(q.course)} · ${esc(q.booklet_title)} · <a href="/api/source-pdf?bookletId=${q.booklet_id}" target="_blank" rel="noopener">PDF ↗</a></span><span>Öğrencinin yanıtı: <strong>${esc(q.response||'Henüz yok')} ${esc(q.choices.find(c=>c.label===q.response)?.text||'')}</strong></span>
      <span>Doğru cevap: <strong>${q.answer_key?esc(q.answer_key)+' '+esc(q.choices.find(c=>c.label===q.answer_key)?.text||''):'Anahtar yok · veli kontrolü'}</strong></span>${q.uncertain?'<span class="pill amber">Öğrenci emin değildi</span>':''}</div>
      ${q.flag_note?`<div class="notice">Görsel sorunu: ${esc(q.flag_note)}</div>`:''}<div class="question-tools"><button class="link-btn" data-edit="${q.id}">Kesimi düzelt</button><button class="link-btn" data-flag="${q.id}">Görsel sorunu ${q.flag_note?'düzenle':'işaretle'}</button></div>
      <div class="review-controls">${[['correct','Doğru'],['incorrect','Yanlış'],['partial','Kısmen doğru']].map(([v,t])=>`<button data-grade="${v}" class="${selection===v?'active '+v:''}" aria-pressed="${selection===v}" ${submitted?'':'disabled'}>${t}</button>`).join('')}</div>
      ${studyReasonSelect(q.reason||'')}
      <div class="field"><label>Notunuz</label><textarea maxlength="500" placeholder="İsteğe bağlı kısa açıklama" ${submitted?'':'disabled'}>${esc(q.note||'')}</textarea></div></article>`;
    }).join('')}</div>
    <div class="review-savebar"><span>Tüm sorular tek işlemde kaydedilir.</span><button class="btn save-all" ${submitted?'':'disabled'}>Tümünü kaydet</button></div>`);
  document.querySelector('#printReviewCurrent')?.addEventListener('click',()=>renderPrintWorksheet('test',a.id,drawReview));
  uiBindImageZoom();
  document.querySelector('#back').onclick=()=>{
    if(dirty&&!confirm('Kaydedilmemiş değişiklikler var. Çalışmalara dönmek istiyor musunuz?'))return;
    renderHome();
  };
  const safeReturn=()=>{if(dirty&&!confirm('Kaydedilmemiş değerlendirmeler var. Yine de görsel düzenlemeye geçilsin mi?'))return false;return true};
  document.querySelectorAll('[data-edit]').forEach(button=>button.onclick=()=>{if(!safeReturn())return;const q=qs.find(x=>x.id===Number(button.dataset.edit));renderCropEditor(q,()=>renderAssignment(a.id))});
  document.querySelectorAll('[data-flag]').forEach(button=>button.onclick=()=>{if(!safeReturn())return;const q=qs.find(x=>x.id===Number(button.dataset.flag));updateQuestionFlag(q.id,q.flag_note,()=>renderAssignment(a.id))});
  const markDirty=()=>{dirty=true;document.querySelector('.save-status').textContent='Kaydedilmemiş değişiklikler var.'};
  document.querySelectorAll('[data-review]').forEach(card=>{
    const id=Number(card.dataset.review);
    card.querySelectorAll('[data-grade]').forEach(button=>button.onclick=()=>{
      draft.get(id).grade=button.dataset.grade;
      card.querySelectorAll('[data-grade]').forEach(peer=>{
        const active=peer===button;
        peer.className=active?'active '+peer.dataset.grade:'';
        peer.setAttribute('aria-pressed',String(active));
      });
      markDirty();
    });
    card.querySelector('textarea').oninput=e=>{draft.get(id).note=e.target.value;markDirty()};
    const reason=card.querySelector('[data-study-reason]');reason.disabled=!submitted;reason.onchange=e=>{draft.get(id).reason=e.target.value;markDirty()};
  });
  document.querySelectorAll('.save-all').forEach(button=>button.onclick=async()=>{
    try{
      if([...draft.values()].some(x=>!x.grade))throw new Error('Anahtarı olmayan tüm soruları değerlendirin.');
      document.querySelectorAll('.save-all').forEach(b=>b.disabled=true);
      const reviews=qs.map(q=>({questionId:q.id,...draft.get(q.id)}));
      await api(`/api/assignments/${a.id}/reviews`,{method:'POST',body:JSON.stringify({reviews})});
      qs.forEach(q=>{q.grade=draft.get(q.id).grade;q.note=draft.get(q.id).note;q.reason=draft.get(q.id).reason});
      dirty=false;
      setFlash(`${reviews.length} sorunun değerlendirmesi birlikte kaydedildi.`);
      drawReview();
    }catch(err){document.querySelectorAll('.save-all').forEach(b=>b.disabled=false);showError(err)}
  });
}
async function init(){try{const data=await api('/api/state');state.role=data.role;state.studentName=data.studentName||'';state.setupTokenRequired=!!data.setupTokenRequired;if(!data.configured)renderSetup();else if(!data.role)renderLogin();else renderHome()}catch(err){app.innerHTML=`<div class="auth-wrap"><div class="auth"><h1>Uygulama açılamadı</h1><div class="error">${esc(err.message)}</div></div></div>`}}
init();

