/* JEELE is a static, client-side field guide. No network, accounts or analytics. */
(() => {
  'use strict';
  const {sports, sources} = window.JEELE_DATA;
  const $ = id => document.getElementById(id);
  const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const state = {filter:'all',query:'',expanded:false};
  let saved = new Set();
  let persistent = true;
  try {const raw=JSON.parse(localStorage.getItem('jeele.saved.v1')||'[]');if(Array.isArray(raw)) saved=new Set(raw.filter(n=>sports.some(s=>s.id===n)));} catch {persistent=false;}
  let toastTimer;
  const toast = message => { $('toast').textContent=message;$('toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('visible'),2600); };
  const store = () => {try{localStorage.setItem('jeele.saved.v1',JSON.stringify([...saved]));}catch{persistent=false;}$('saved-count').textContent=saved.size;};
  const bookmark = '<svg viewBox="0 0 20 24" aria-hidden="true"><path d="M4 3h12v18l-6-4-6 4z"/></svg>';
  const toggleSave = id => {if(saved.has(id)){saved.delete(id);toast('Removed from your saved paths.');}else{saved.add(id);toast(persistent?'Saved. Your next chapter is taking shape.':'Saved for this visit. Browser storage is unavailable.');}store();render();};
  const featured=[2,8,26,16,3,6,13,11,20];
  function render(){
    let items=sports.filter(s=>(state.filter==='all'||s.category===state.filter)&&(`${s.name} ${s.location} ${s.earn}`.toLowerCase().includes(state.query)));
    if(state.filter==='all'&&!state.query){items.sort((a,b)=>{const x=featured.indexOf(a.id),y=featured.indexOf(b.id);return (x<0?100+a.id:x)-(y<0?100+b.id:y);});}
    const limited=state.filter==='all'&&!state.query&&!state.expanded;
    const visible=limited?items.slice(0,9):items;
    $('result-count').textContent=limited?`9 starting points · ${items.length} paths in the full map`:`${items.length} ${items.length===1?'path':'paths'} to explore`;
    $('empty-state').hidden=items.length!==0;
    $('load-more').hidden=!limited||items.length<=9;
    $('sport-grid').innerHTML=visible.map(s=>`<article class="sport-card"><div class="card-top"><span class="card-category">${esc(s.label)}</span><button class="save-button" data-save="${s.id}" aria-pressed="${saved.has(s.id)}" aria-label="${saved.has(s.id)?'Unsave':'Save'} ${esc(s.name)}">${bookmark}</button></div><h3>${esc(s.name)}</h3><p>${esc(s.earn)}</p><button class="card-detail" data-detail="${s.id}">Explore the pathway <span aria-hidden="true">↗</span></button></article>`).join('');
    document.querySelectorAll('[data-filter]').forEach(b=>{const active=b.dataset.filter===state.filter;b.classList.toggle('active',active);b.setAttribute('aria-pressed',active);});
    $('saved-count').textContent=saved.size;
  }
  function setFilter(filter){state.filter=filter;state.expanded=true;render();}
  const dialog=$('detail-dialog');
  function openDialog(content){$('dialog-content').innerHTML=content;if(!dialog.open)dialog.showModal();document.body.style.overflow='hidden';}
  function closeDialog(){dialog.close();document.body.style.overflow='';}
  dialog.querySelector('.dialog-close').addEventListener('click',closeDialog);
  dialog.addEventListener('close',()=>{document.body.style.overflow='';});
  dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDialog();}});
  const linkSources = refs => refs.length?`<h3>Check the source</h3><ul class="source-links">${refs.map(r=>sources[r]?`<li><a href="${esc(sources[r].url)}" target="_blank" rel="noopener noreferrer">${esc(sources[r].title)} ↗</a></li>`:'').join('')}</ul>`:'<p class="dialog-note">This is an editorial pathway, not a verified job or price listing. Ask local qualified providers for current requirements and costs.</p>';
  function showSport(id){
    const s=sports.find(x=>x.id===id);if(!s)return;
    const extra=id===26?'<h3>A published cost anchor</h3><p>Skyhigh India lists its 25-jump A-licence package at ₹4,52,400 plus 18% GST (₹5,33,832). This is not a professional rating or a job. Confirm inclusions, repeat jumps, living and travel costs directly.</p>':id===11||id===12?'<h3>A published cost anchor</h3><p>IISM lists Gulmarg snow-skiing/snowboarding at ₹10,000 for eligible Indian citizens up to age 25. Confirm current sanction, dates, fees and inclusions. An introductory course does not establish instructor competence.</p>':id===6?'<h3>The professional distinction</h3><p>PADI lists 40 logged dives to start adult Divemaster training and 60 to certify, alongside other prerequisites. Divemaster is not Instructor; paid responsibility depends on your actual qualification and centre approval.</p>':'';
    openDialog(`<div class="eyebrow">${esc(s.label)} / PATH ${String(s.id).padStart(2,'0')}</div><h2 id="dialog-title">${esc(s.name)}</h2><p>${esc(s.location)}</p><h3>The paid-work route</h3><p>${esc(s.earn)}</p><h3>Your first move</h3><p>${esc(s.start)}</p><h3>The money reality</h3><p>${esc(s.reality)}</p><p><b>Cost exposure:</b> ${esc(s.exposure)}. This describes relative spending—not an all-in quote.</p>${extra}<div class="dialog-actions"><button class="button primary" data-dialog-save="${s.id}">${saved.has(s.id)?'Remove from saved':'Save this path'} <span aria-hidden="true">${saved.has(s.id)?'−':'+'}</span></button><button class="button secondary" data-go-plan>Build a starting plan <span aria-hidden="true">↗</span></button></div>${linkSources(s.refs)}<p class="dialog-note">Professional work requires competence, recognised qualifications where relevant, permissions, insurance and an actual hiring/client route. This is not technical or financial advice.</p>`);
  }
  function showSaved(){
    const selected=sports.filter(s=>saved.has(s.id));
    openDialog(`<div class="eyebrow">YOUR OPEN POSSIBILITIES</div><h2 id="dialog-title">${selected.length?'A few future chapters.':'Your list starts here.'}</h2><p>${selected.length?'Keep a shortlist, not a pile of unpaid certificates. Explore each path before spending.':'Save any sport pathway to build a shortlist. It stays in this browser where storage is available.'}</p>${selected.length?`<ul class="saved-list">${selected.map(s=>`<li><button class="saved-title" data-detail="${s.id}">${esc(s.name)} ↗</button><button class="remove-save" data-remove="${s.id}" aria-label="Remove ${esc(s.name)}">Remove</button></li>`).join('')}</ul><div class="dialog-actions"><button class="button primary" data-export-saved>Download shortlist <span aria-hidden="true">↓</span></button><button class="button secondary" data-clear-saved>Clear saved paths</button></div>`:'<button class="button primary" data-go-explore>Explore the map <span aria-hidden="true">↗</span></button>'}<p class="dialog-note">Local saves do not sync across devices. No account, personal profile or server submission is used.</p>`);
  }
  const roles={
    media:['Adventure media','Sell a finished service: editing, operator reels, event coverage or expedition storytelling. Learn sound, backups, delivery and contracts before buying expensive equipment.','Build a small portfolio using safe, permitted shoots. Ask three operators what they buy and how they commission it. Followers and viral clips are not guaranteed income.',[]],
    drone:['Drone work','Cinematography and survey support are different services. Training, permissions, aircraft legality and airspace rules matter; survey work may need mapping skills.','Verify current DGCA/RPTO requirements, then speak to an employer or client before purchasing a drone. An old product recommendation does not establish legal or commercial suitability.',[14]],
    rope:['Industrial rope access','This is commercial work at height, not recreational climbing. Combine approved training and assessment with an employable trade and the required supervision.','Ask an approved training centre and employers about real vacancies, costs and supervision. IRATA advancement needs logged work experience and periodic revalidation.',[15]],
    operations:['Trip & outdoor operations','Route planning, bookings, camp work, logistics and equipment systems can be as varied as frontline guiding. Paid technical leadership still requires activity-specific competence.','Assist a qualified, lawful operator. Learn group communication, first aid and risk systems. Check safeguarding for programmes involving children.',[17]],
    motorsport:['Motorsport team work','Mechanics, logistics, data, photography and event operations are separate skill tracks. Competitive racing does not automatically qualify someone to coach or do film stunts.','Pick a useful service skill and speak to authorised event organisers or teams. Keep a racing hobby budget separate from professional development.',[13]],
    expedition:['Expedition production','Good production means permissions, staffing, suppliers, safe logistics and client care. Owning a fleet is not a prerequisite to learning the business.','Start under an experienced legal operator and study delivery economics. Ownership brings liability and operating costs, not just upside.',[7]]
  };
  function showRole(key){const r=roles[key];if(!r)return;openDialog(`<div class="eyebrow">WORK BESIDE THE ADVENTURE</div><h2 id="dialog-title">${esc(r[0])}</h2><p>${esc(r[1])}</p><h3>A practical starting point</h3><p>${esc(r[2])}</p>${linkSources(r[3])}<p class="dialog-note">These are directions to investigate, not verified current vacancies or salary forecasts.</p>`);}
  function showSources(){openDialog(`<div class="eyebrow">RESEARCH & IMAGE CREDITS</div><h2 id="dialog-title">Stay curious.<br>Check the source.</h2><p>Guide research checked 6 October 2026. Requirements, prices and availability can change. No comparable cross-role salary dataset is claimed.</p><ul class="source-list">${Object.values(sources).map(s=>`<li><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.title)} ↗</a><p>${esc(s.note)}</p></li>`).join('')}</ul><h3>Landscape photography</h3><p>Bundled photographs sourced from Unsplash. Their original image URLs and the Unsplash licence are documented in IMAGE-CREDITS.md in the site package. Landscapes are mood imagery, not a claim about a training site.</p><p><a href="https://unsplash.com/license" target="_blank" rel="noopener noreferrer" class="text-link">Unsplash licence ↗</a></p><p class="dialog-note">JEELE is independent and not affiliated with these organisations. An operator’s marketing statement is not independent regulatory verification.</p>`);}
  function showPrivacy(){openDialog(`<div class="eyebrow">SMALL FOOTPRINT. NO ACCOUNT.</div><h2 id="dialog-title">Your shortlist.<br>Your browser.</h2><p>This static site uses localStorage only for saved sport IDs. These choices are not submitted to a server or synced between devices. Clear them using “Saved”. If storage is unavailable, saves last only for the current visit.</p><p>The plan builder runs in your browser. There are no forms sent to a backend, analytics scripts, advertising trackers, external fonts or third-party scripts in this package.</p><p>The website host may keep its own access logs. Opening an external source link takes you to that site and its own policies.</p><p class="dialog-note">Public downloads are public files. Do not add personal records, API keys or sensitive information to a GitHub Pages repository.</p>`);}
  function downloadText(text,filename){const blob=new Blob([text],{type:'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  let latestPlan='';
  const recommendations={mountains:[3,1,2],water:[9,8,6],wind:[11,12,13],wheels:[17,19,16],local:[25,22,23],mixed:[27,28,26]};
  function makePlan(e){
    e.preventDefault();
    const environment=$('environment').value,availability=$('availability').value,priority=$('priority').value;
    const labels={mountains:'Mountains & trails',water:'Ocean & water',wind:'Snow & wind',wheels:'Speed & wheels',local:'Movement close to home',mixed:'Air, rivers & new worlds'};
    let ids=[...recommendations[environment]];
    if(availability==='weekends'&&environment==='mountains')ids=[3,1];
    if(availability==='weekends'&&environment==='wheels')ids=[17,19,20];
    if(priority==='passion'&&availability!=='weekends')ids.reverse();
    const selected=ids.map(id=>sports.find(s=>s.id===id));
    const focus=priority==='income'?'Keep dependable income while building a useful service. Talk to hiring managers before paying for professional progression.':priority==='passion'?'Book a supervised trial and notice whether you enjoy ordinary practice—not only the dramatic moment.':'Try one supervised experience. Set an affordable novelty budget before adding a second activity.';
    const schedule=availability==='weekends'?'Choose somewhere close enough for regular practice. These routes may still need multi-day courses: confirm the schedule first.':availability==='blocks'?'A seasonal block can make destination training more practical. Include travel, lodging and low-season living costs.':'Use the flexibility to practise consistently—not to buy every certification. Choose one deep sport first.';
    const next=priority==='income'?'Contact three employers/providers. Ask for the all-in training cost, qualification scope, availability requirements and actual pay terms. Then book one affordable trial.':'Contact a qualified provider. Confirm supervision, course inclusions, safety, medical requirements and insurance exclusions. Book one trial before committing to a full package.';
    $('plan-result').innerHTML=`<span class="plan-index">YOUR STARTING DIRECTION / ${esc(labels[environment])}</span><h3>Explore first.<br>Commit with clarity.</h3><p class="plan-intro">${esc(focus)}</p><ul class="plan-paths">${selected.map(s=>`<li><button data-detail="${s.id}">${esc(s.name)} <span aria-hidden="true">↗</span></button></li>`).join('')}</ul><p class="plan-intro">${esc(schedule)}</p><p class="plan-next"><b>Your next move:</b> ${esc(next)}</p><p class="plan-note">Directions to investigate—not a claim that you qualify, that jobs are open, or that your spending will pay back.</p><button class="text-link" data-export-plan>Download this starting plan <span aria-hidden="true">↓</span></button>`;
    latestPlan=`JEELE — MY STARTING PLAN\n\nEnvironment: ${labels[environment]}\nTime: ${$('availability').selectedOptions[0].textContent}\nPriority: ${$('priority').selectedOptions[0].textContent}\n\n${focus}\n\nPaths to investigate:\n${selected.map(s=>'- '+s.name+'\n  Start: '+s.start+'\n  Money reality: '+s.reality).join('\n')}\n\n${schedule}\n\nNext move: ${next}\n\nThis is a starting direction, not technical advice, a qualification assessment, a job offer or an earnings forecast. Verify current local rules and insurance with qualified providers.\n`;
    if(matchMedia('(max-width:600px)').matches)$('plan-result').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth',block:'start'});
  }
  const panels={
    job:{title:'Start inside a good operation.',text:'Schools, gyms, resorts and trip operators need people who can deliver consistently. Begin with a role appropriate to your competence; an employer’s equipment can reduce startup exposure.',tags:['Instruction','Guiding','Centre operations'],note:'Ask about vacancies, minimum commitment, qualification scope and actual pay. Certification alone is not employment.'},
    freelance:{title:'Sell a finished, useful service.',text:'Editing, adventure photography, route support or competent specialist work can sit alongside a sport. Start with a clear deliverable, a realistic price and clients who need it.',tags:['Adventure media','Event work','Specialist services'],note:'Calculate take-home after costs. Bookings are uncertain; keep dependable income while testing demand.'},
    business:{title:'Build systems before a fleet.',text:'A school, camp or expedition business can grow beyond your own working hours. But permissions, staffing, bookings, risk systems, insurance and delivery costs must work first.',tags:['Schools & camps','Trips & logistics','Expedition production'],note:'Pilot with an experienced legal operator. Business ownership adds capital exposure and liability—not guaranteed profit.'}
  };
  function setTab(key){const panel=panels[key];document.querySelectorAll('[data-tab]').forEach(b=>{const active=b.dataset.tab===key;b.setAttribute('aria-selected',active);b.tabIndex=active?0:-1;});$('money-panel').setAttribute('aria-labelledby','tab-'+key);$('money-panel').innerHTML=`<h3>${panel.title}</h3><p>${panel.text}</p><ul>${panel.tags.map(x=>`<li>${x}</li>`).join('')}</ul><p class="small">${panel.note}</p>`;}
  document.querySelectorAll('[data-tab]').forEach(button=>{button.addEventListener('click',()=>setTab(button.dataset.tab));button.addEventListener('keydown',e=>{const buttons=[...document.querySelectorAll('[data-tab]')];let i=buttons.indexOf(button);if(e.key==='ArrowRight')i=(i+1)%buttons.length;else if(e.key==='ArrowLeft')i=(i-1+buttons.length)%buttons.length;else if(e.key==='Home')i=0;else if(e.key==='End')i=buttons.length-1;else return;e.preventDefault();setTab(buttons[i].dataset.tab);buttons[i].focus();});});
  document.addEventListener('click',e=>{
    const b=e.target.closest('button');if(!b)return;
    if(b.dataset.filter)setFilter(b.dataset.filter);
    if(b.dataset.world){state.query='';$('sport-search').value='';setFilter(b.dataset.world);$('explore').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'});}
    if(b.dataset.save)toggleSave(Number(b.dataset.save));
    if(b.dataset.detail)showSport(Number(b.dataset.detail));
    if(b.dataset.dialogSave){const id=Number(b.dataset.dialogSave);toggleSave(id);showSport(id);}
    if(b.dataset.remove){toggleSave(Number(b.dataset.remove));showSaved();}
    if(b.dataset.role)showRole(b.dataset.role);
    if(b.hasAttribute('data-go-plan')){closeDialog();$('plan').scrollIntoView({behavior:'smooth'});$('environment').focus({preventScroll:true});}
    if(b.hasAttribute('data-go-explore')){closeDialog();$('explore').scrollIntoView({behavior:'smooth'});}
    if(b.hasAttribute('data-clear-saved')){saved.clear();store();render();showSaved();toast('Saved paths cleared.');}
    if(b.hasAttribute('data-export-saved'))downloadText('JEELE — MY SAVED PATHS\n\n'+sports.filter(s=>saved.has(s.id)).map(s=>`${s.name}\nLocation leads: ${s.location}\nPaid route: ${s.earn}\nFirst move: ${s.start}\nMoney reality: ${s.reality}\n`).join('\n')+'\nVerify current training, rules, insurance and work availability before spending.','JEELE-shortlist.txt');
    if(b.hasAttribute('data-export-plan'))downloadText(latestPlan,'JEELE-starting-plan.txt');
  });
  $('sport-search').addEventListener('input',e=>{state.query=e.target.value.trim().toLowerCase();render();});
  $('load-more').addEventListener('click',()=>{state.expanded=true;render();});
  $('reset-search').addEventListener('click',()=>{state.query='';state.filter='all';state.expanded=true;$('sport-search').value='';render();$('sport-search').focus();});
  $('saved-open').addEventListener('click',showSaved);
  $('source-open').addEventListener('click',showSources);
  $('faq-sources').addEventListener('click',showSources);
  $('privacy-open').addEventListener('click',showPrivacy);
  $('plan-form').addEventListener('submit',makePlan);
  const menu=document.querySelector('.menu-toggle');
  menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',open);$('nav-links').classList.toggle('open',open);});
  $('nav-links').addEventListener('click',e=>{if(e.target.closest('a,button')&&!e.target.closest('.menu-toggle')){menu.setAttribute('aria-expanded','false');$('nav-links').classList.remove('open');}});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){menu.setAttribute('aria-expanded','false');$('nav-links').classList.remove('open');}});
  render();setTab('job');
})();
