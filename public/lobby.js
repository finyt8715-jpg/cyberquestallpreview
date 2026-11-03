/* Dashboard and onboarding presentation. All scoring and game behavior stay in app.js. */
const HUB_MISSIONS = [
 {kind:'vault',tag:'Data protection',copy:'Sort the files. Keep sensitive data safe.',detail:'Desk shift · 9 files',color:'linear-gradient(145deg,#2b2b2b,#11274a)'},
 {kind:'mail',tag:'Social engineering',copy:'Hunt clues, swipe scams and steer packets past scam bots. Then secure your inbox.',detail:'3 mini-games · 10 emails',color:'linear-gradient(145deg,#11274a,#d1202733)'},
 {kind:'shield',tag:'Malware defence',copy:'Collect the Virus Zoo creatures. Learn their tricks, then defend the firewall.',detail:'4 modules · 2 available',color:'linear-gradient(145deg,#11274a,#1ca4dd3d)'},
 {kind:'desk',tag:'Investigation',copy:'Explore the office. Find the security risks.',detail:'4 case files · 3D',color:'linear-gradient(145deg,#11274a,#d0964040)'},
 {kind:'voice',tag:'Social engineering',copy:'Take the call. Outsmart the impersonator.',detail:'4 conversations',color:'linear-gradient(145deg,#11274a,#1ca4dd59)'}
];

function missionMeta(level){return HUB_MISSIONS[level.n-1]||level.meta}

function profilePhotoValid(photo) {
 return typeof photo==='string'&&photo.length<=180000&&/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(photo);
}

function hubAvatar(name,photo) {
 if(profilePhotoValid(photo))return `<img class="hub-photo" src="${photo}" alt="">`;
 const initials=String(name||'Player').trim().split(/\s+/).slice(0,2).map(n=>n[0]||'').join('').toUpperCase();
 return `<span aria-hidden="true">${esc(initials)}</span>`;
}

function readServerPhoto(userId) {
 try{const photo=localStorage.getItem('cyberquest.profile.'+userId)||'';return profilePhotoValid(photo)?photo:''}catch(e){return ''}
}

function hubArt(kind, id) {
 const shapes = {
 mail:`<g transform="translate(26 28)"><rect x="26" y="22" width="123" height="75" rx="7" fill="#11274a" opacity=".45" transform="translate(7 12)"/><path d="M24 24h124v74H24z" fill="url(#${id}-face)" stroke="#d2d0cd" stroke-width="1.4"/><path d="M24 24l62 43 62-43" fill="#d2d0cd"/><path d="M24 98l43-38m81 38l-43-38" stroke="#1ca4dd" stroke-width="2"/><circle cx="146" cy="35" r="19" fill="#d12027" stroke="#ffffff"/><path d="M146 25v12m0 7v2" stroke="#11274a" stroke-width="3" stroke-linecap="round"/><path d="M5 63h12m148 10h14m-133 44h77" stroke="#1ca4dd" stroke-width="2"/></g>`,
 shield:`<g transform="translate(37 13)"><path d="M68 5l55 23v54c0 25-27 48-55 62-28-14-55-37-55-62V28z" fill="#11274a" opacity=".5" transform="translate(8 8)"/><path d="M68 5l55 23v54c0 25-27 48-55 62-28-14-55-37-55-62V28z" fill="url(#${id}-face)" stroke="#1ca4dd" stroke-width="2"/><path d="M68 20l40 17v44c0 18-21 36-40 46-19-10-40-28-40-46V37z" fill="#11274a"/><path d="M45 72l16 15 33-36" fill="none" stroke="#1da049" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/><path d="M-16 49H4m129 0h22M-3 109h14m117 0h20" stroke="#d2d0cd" stroke-width="2"/></g>`,
 desk:`<g transform="translate(23 8)"><path d="M87 14L9 49v74l78 34 79-34V49z" fill="#11274a" stroke="#1ca4dd"/><path d="M87 14v89l79 20V49z" fill="#1ca4dd"/><path d="M9 49l78 35v73L9 123z" fill="#2b2b2b"/><path d="M22 81l65-27 65 27-65 30z" fill="#d09640" stroke="#d2d0cd"/><path d="M22 81v7l65 30 65-30v-7l-65 30z" fill="#d09640"/><path d="M31 91v35m109-35v35" stroke="#d2d0cd" stroke-width="5"/><path d="M68 45l39 17v31L68 77z" fill="#11274a" stroke="#d2d0cd"/><path d="M73 52l29 13v20L73 72z" fill="#1ca4dd"/><path d="M83 91l17 7-13 6-17-7z" fill="#11274a"/><path d="M59 115l28 11 20-10v17l-20 12-28-12z" fill="#11274a"/><path d="M87 145v10" stroke="#1ca4dd" stroke-width="3"/><circle cx="129" cy="82" r="6" fill="#d2d0cd"/></g>`,
 voice:`<g transform="translate(26 16)"><circle cx="80" cy="66" r="57" fill="#11274a" stroke="#1ca4dd"/><path d="M35 69V54a45 45 0 0190 0v15" stroke="#d2d0cd" stroke-width="13" fill="none"/><rect x="22" y="58" width="23" height="42" rx="8" fill="url(#${id}-face)" stroke="#d2d0cd"/><rect x="115" y="58" width="23" height="42" rx="8" fill="url(#${id}-face)" stroke="#d2d0cd"/><path d="M127 100v11c0 9-12 15-35 15" stroke="#d2d0cd" stroke-width="4" fill="none"/><rect x="74" y="121" width="21" height="9" rx="4" fill="#1da049"/><path d="M53 70v9m11-24v40m11-26v14m11-29v43m11-28v14m11-17v20" stroke="#1ca4dd" stroke-width="4" stroke-linecap="round"/></g>`,
 vault:`<g transform="translate(25 15)"><path d="M38 28l88-12 27 15v101l-89 17-26-20z" fill="#11274a" stroke="#1ca4dd"/><path d="M38 28l26 14 89-11-27-15z" fill="#1ca4dd"/><path d="M64 42l89-11v101l-89 17z" fill="url(#${id}-face)"/><path d="M75 54l65-10v77l-65 11z" fill="#2b2b2b" stroke="#d2d0cd"/><ellipse cx="108" cy="85" rx="21" ry="24" fill="#1ca4dd" stroke="#1ca4dd" stroke-width="3"/><path d="M108 66v39m-15-30l29 21m-30 1l31-24" stroke="#d2d0cd" stroke-width="4"/><circle cx="108" cy="85" r="6" fill="#d09640"/><path d="M52 49v74" stroke="#11274a" stroke-width="5"/><path d="M16 80h17m126-11h12M19 108h14" stroke="#1ca4dd" stroke-width="2"/></g>`
 };
 return `<svg viewBox="0 0 220 170" aria-hidden="true"><defs><linearGradient id="${id}-face" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#1ca4dd"/><stop offset="1" stop-color="#11274a"/></linearGradient><radialGradient id="${id}-glow"><stop stop-color="#d2d0cd" stop-opacity=".24"/><stop offset="1" stop-color="#d2d0cd" stop-opacity="0"/></radialGradient></defs><circle cx="112" cy="85" r="104" fill="url(#${id}-glow)"/><path d="M0 34H220M0 68H220M0 102H220M0 136H220M44 0V170M88 0V170M132 0V170M176 0V170" stroke="#d2d0cd09"/>${shapes[kind]||shapes.shield}</svg>`;
}

function hubDefenderArt(id) {
 return `<svg viewBox="0 0 360 340" aria-hidden="true"><defs><linearGradient id="${id}-metal" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#1ca4dd"/><stop offset=".45" stop-color="#11274a"/><stop offset="1" stop-color="#2b2b2b"/></linearGradient><linearGradient id="${id}-core" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#1ca4dd"/><stop offset="1" stop-color="#1da049"/></linearGradient><radialGradient id="${id}-aura"><stop stop-color="#d2d0cd" stop-opacity=".3"/><stop offset="1" stop-color="#1ca4dd" stop-opacity="0"/></radialGradient></defs><circle cx="180" cy="173" r="163" fill="url(#${id}-aura)"/><g transform="translate(0 9)"><ellipse cx="180" cy="260" rx="109" ry="33" fill="#d2d0cd0b" stroke="#d2d0cd2d"/><ellipse cx="180" cy="260" rx="80" ry="22" fill="none" stroke="#1da04926"/><path d="M43 153l36-69 82-35 87 30 58 85-34 70-87 44-103-41z" fill="none" stroke="#d2d0cd20"/><path d="M52 195l-22-40 30-44m208-28l44 54-9 61M86 261l80 35 60-19" fill="none" stroke="#1ca4dd52" stroke-width="2"/><path d="M177 72l91 37v75c0 43-42 80-91 99-49-19-91-56-91-99v-75z" fill="#11274a" transform="translate(9 7)"/><path d="M177 62l91 37v75c0 43-42 80-91 99-49-19-91-56-91-99V99z" fill="url(#${id}-metal)" stroke="#ffffff" stroke-width="1.5"/><path d="M177 78l75 31v65c0 33-34 63-75 82-41-19-75-49-75-82v-65z" fill="#11274a" stroke="#1da0493b"/><path d="M177 94l60 24v57c0 27-27 51-60 67-33-16-60-40-60-67v-57z" fill="#11274a" stroke="#1da04980"/><path d="M151 146l25-15 29 16v32l-28 20-29-19z" fill="url(#${id}-core)"/><path d="M154 159l17 16 27-30" fill="none" stroke="#ffffff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><path d="M117 119l22 9m-22 52l24-7m96-54l-22 9m22 52l-24-7M177 96v21m0 97v21" stroke="#1da04980" stroke-width="2"/><path d="M57 167h27m187-12h27m-171-94V41h32m69 192v28h25" stroke="#d2d0cd5e" fill="none"/><circle cx="55" cy="167" r="4" fill="#1da049"/><circle cx="300" cy="155" r="3" fill="#d2d0cd"/><circle cx="128" cy="41" r="3" fill="#d2d0cd"/><path d="M82 293h197" stroke="#1da04926"/><path d="M97 298h30m105 0h30" stroke="#1ca4dd51"/></g></svg>`;
}

function lobbyDashboard() {
 const current=curLv(),cleared=LV.filter(l=>S.done.includes(l.n)).length;
 const earned=REW.filter(r=>allDone()&&S.score>=r.req).length;
 const reward=REW.slice().sort((a,b)=>a.req-b.req).find(r=>!S.claimed[r.id])||REW[REW.length-1];
 const rewardProgress=reward?(reward.req?Math.min(100,S.score/reward.req*100):100):0;
 $('#app').innerHTML=`<div class="lobby"><div class="hub-welcome"><div><h1>Ready for your next win, <span>${esc(S.name.split(' ')[0])}?</span></h1><p>Your skills. Your progress. Your next challenge.</p></div><div class="hub-session"><b>●</b> ${SERVER?'Company player profile':'Progress saved on this device'}</div></div>
 <div class="hub-top"><section class="hub-hero insight-carousel" aria-label="Cyber awareness insights" aria-roledescription="carousel"><div class="hub-hero-copy"><div class="hub-eyebrow"><span class="live-dot"></span>Cyber awareness. Game on.</div><h2>LEVEL UP.<br><em>STAY SHARP.</em></h2><p>Catch the scams. Protect your team. Turn everyday security skills into your next high score.</p><div class="hub-actions"><button class="hub-button" data-a="play" data-v="${current.n}">${cleared===LV.length?'Play again':'Continue mission'}<span class="arrow" aria-hidden="true">↗</span></button><button class="hub-button secondary" data-a="nav" data-v="road">Explore missions</button></div></div><div class="hub-hero-art">${hubDefenderArt('hero')}<span class="hub-art-tag">BUILD YOUR DEFENDER INSTINCT</span></div><div class="insight-controls"><button type="button" data-slide-prev aria-label="Previous insight">←</button><div class="insight-dots">${CYBER_INSIGHTS.map((x,i)=>`<button type="button" data-slide="${i}" aria-label="Insight ${i+1}: ${x.label}" aria-pressed="${i===0}"></button>`).join('')}</div><span data-slide-count>01 / 05</span><button type="button" data-slide-next aria-label="Next insight">→</button><button type="button" data-slide-pause aria-label="Pause slideshow">Ⅱ</button></div></section>
 <aside class="hub-player"><div class="hub-player-top"><button class="hub-link" data-a="profile">Player profile ↗</button><span>${tier()}</span></div><div class="hub-profile"><button type="button" class="hub-avatar hub-avatar-edit" data-a="profile" aria-label="Edit player profile">${hubAvatar(S.name,S.photo)}</button><div><h3>${esc(S.name)}</h3><p>CyberQuest defender</p></div><div class="hub-player-level"><small>LEVEL</small>${String(Math.min(LV.length,cleared+1)).padStart(2,'0')}</div></div><div class="hub-progress-label"><span>Campaign progress</span><b>${cleared}/${LV.length} complete</b></div><div class="hub-progress" role="progressbar" aria-label="Campaign completion" aria-valuemin="0" aria-valuemax="${LV.length}" aria-valuenow="${cleared}"><span style="width:${cleared/LV.length*100}%"></span></div><div class="hub-level-dots" aria-label="Level completion">${LV.map(l=>`<span class="${S.done.includes(l.n)?'complete':''}" aria-label="Level ${l.n}: ${S.done.includes(l.n)?'complete':'not complete'}">${S.done.includes(l.n)?'✓':l.n}</span>`).join('')}</div><div class="hub-player-foot">${cleared===LV.length?'Campaign cleared. Beat your best scores.':'Up next: '+esc(current.name)}</div></aside></div>
 <section class="hub-stats" aria-label="Player statistics"><div class="hub-stat"><span class="hub-stat-icon" aria-hidden="true">ϟ</span><div><p>Total points</p><strong>${fmt(S.score)}</strong><small>PTS</small></div></div><div class="hub-stat"><span class="hub-stat-icon" aria-hidden="true">✓</span><div><p>Missions cleared</p><strong>${cleared}<small>/ ${LV.length}</small></strong></div></div><div class="hub-stat"><span class="hub-stat-icon" aria-hidden="true">♜</span><div><p>${SERVER?'Leaderboard rank':'Sample board rank'}</p><strong>#${rank()}</strong></div></div><div class="hub-stat"><span class="hub-stat-icon" aria-hidden="true">◇</span><div><p>Rewards unlocked</p><strong>${earned}<small>/ ${REW.length}</small></strong></div></div></section>
 <section class="hub-missions"><div class="hub-heading-row"><div><div class="hub-eyebrow" style="color:#1ca4dd">THE CAMPAIGN</div><h2>Pick your next challenge</h2><p>${LV.length} ways to play. Skills that stay with you.</p></div><button class="hub-link" data-a="nav" data-v="road">Mission map <span aria-hidden="true">↗</span></button></div><div class="hub-cards">${LV.map((l,i)=>{const meta=missionMeta(l),done=S.done.includes(l.n),available=open(l.n);return `<article class="hub-card ${available?'':'locked'}"><div class="hub-card-art" style="--card-bg:${meta.color}">${hubArt(meta.kind,'mission-'+l.n)}<span class="hub-card-status ${done?'complete':available?'ready':''}">${done?'✓ Completed':available?'Ready to play':'Locked'}</span></div><div class="hub-card-body"><div class="hub-card-index">0${l.n} / ${meta.tag}</div><h3>${l.name}</h3><p>${meta.copy}</p><div class="hub-card-foot"><span>${meta.detail}</span><span>${S.best[l.n]?fmt(S.best[l.n])+' best':l.q.length+' quiz Qs'}</span></div><button class="hub-button ${done||!available?'secondary':''}" data-a="play" data-v="${l.n}" aria-label="${done?'Replay':available?'Play':'Locked'} ${esc(l.name)}" ${available?'':'disabled'}>${done?'Beat your best':available?'Play mission':'Clear level '+(l.n-1)}<span aria-hidden="true">${available?'↗':'⌑'}</span></button></div></article>`}).join('')}</div></section>
 <div class="hub-bottom">${reward?`<section class="hub-reward"><div class="hub-reward-art" aria-hidden="true"><svg viewBox="0 0 64 64">${ICON[reward.i]||''}</svg></div><div class="hub-reward-copy"><div class="hub-eyebrow" style="color:#d2d0cd">Play. Progress. Get rewarded.</div><h3>${esc(reward.name)}</h3><p>${esc(reward.d)}</p><div class="hub-progress" role="progressbar" aria-label="Score progress toward ${esc(reward.name)}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(rewardProgress)}"><span style="width:${rewardProgress}%"></span></div><p>${fmt(S.score)} / ${fmt(reward.req)} pts · ${allDone()?'All levels cleared':'Clear all '+LV.length+' levels to claim'}</p><button class="hub-link" data-a="nav" data-v="rew">Open reward locker <span aria-hidden="true">↗</span></button></div></section>`:''}
 <section class="hub-skills"><div class="hub-eyebrow" style="color:#1ca4dd">YOUR SKILL COLLECTION</div><h3>Build instincts. Not just points.</h3><div class="hub-skill-list">${['Data classification','Phishing detection','Threat defense','Office security','Caller verification'].map((skill,i)=>`<span class="${S.done.includes(i+1)?'earned':''}">${S.done.includes(i+1)?'✓ ':''}${skill}</span>`).join('')}</div><p>Complete a mission to add its skill to your collection.</p></section></div>
 <div class="hub-settings"><span class="hub-eyebrow" style="color:#1ca4dd">PLAYER SETTINGS</span>${SERVER?(window.CQ_AUTH==='password'?'<button class="hub-link" data-a="pwd">Change password</button><button class="hub-link" data-a="logout">Sign out</button>':''):'<button class="hub-link" data-a="profile">Edit player profile</button><button class="hub-link" data-a="resetme">Reset progress</button>'}</div></div>`;
 const carousel=$('#app').querySelector?.('.insight-carousel');if(carousel)mountInsights(carousel);
}

function retroCyberArt() {
 return `<svg viewBox="0 0 500 290" aria-hidden="true" style="shape-rendering:crispEdges"><defs><linearGradient id="retro-screen" x2="0" y2="1"><stop stop-color="#11274a"/><stop offset="1" stop-color="#11274a"/></linearGradient></defs><path d="M22 242h456m-400-28h338m-316-21h294" stroke="#1ca4dd50" stroke-width="2"/><ellipse cx="250" cy="247" rx="132" ry="18" fill="#1ca4dd12"/><path d="M158 59h184v14h14v136h-14v14H158v-14h-14V73h14z" fill="#11274a" stroke="#1ca4dd" stroke-width="3"/><rect x="159" y="76" width="182" height="126" fill="url(#retro-screen)"/><path d="M178 97h50m-50 10h30m-30 10h43m69 60h28" stroke="#1ca4dd" stroke-width="3"/><path d="M238 105h24v-8h16v8h24v65h-8v16h-16v8h-16v-8h-16v-16h-8z" fill="#1da049"/><path d="M250 118h40v43h-7v14h-13v7h-7v-7h-7v-14h-6z" fill="#11274a"/><path d="M256 141h7v7h7v-7h7v-7h7v7h-7v7h-7v7h-7v-7h-7z" fill="#ffffff"/><rect x="239" y="223" width="22" height="18" fill="#1ca4dd"/><rect x="219" y="241" width="62" height="7" fill="#1ca4dd"/><path d="M69 49h46v7h7v29h-7v7H69v-7h-7V56h7z" fill="#1ca4dd"/><path d="M69 57l23 16 23-16" stroke="#d2d0cd" stroke-width="5" fill="none"/><path d="M102 36h14v7h7v14h-7v7h-14v-7h-7V43h7z" fill="#d12027"/><path d="M109 43v7m0 5v2" stroke="#11274a" stroke-width="3"/><path d="M378 91h42v7h7v37h-7v7h-42v-7h-7V98h7z" fill="#1ca4dd"/><path d="M386 108v-8h24v8m-27 0h30v22h-30z" stroke="#d2d0cd" stroke-width="3" fill="none"/><path d="M398 117v7" stroke="#d09640" stroke-width="3"/><path d="M90 167h42v7h7v40h-7v7H90z" fill="#11274a"/><path d="M100 184h28m-28 10h22m-22 10h28" stroke="#1ca4dd" stroke-width="3"/><path d="M392 193h18v6h6v18h-6v6h-18v-6h-6v-18h6z" fill="#1da049"/><path d="M57 125h8v8h-8zm275-96h8v8h-8zm109 126h8v8h-8z" fill="#d2d0cd"/><path d="M44 30h7m-4-4v8m385-10h7m-4-4v8M53 215h7m-4-4v8" stroke="#1da049" stroke-width="2"/></svg>`;
}

function retroEntry(form) {
 return `<div class="retro-entry"><section class="retro-story"><div class="retro-kicker"><span></span>CYBERQUEST / AWARENESS ARCADE</div><h1>DEFEND YOUR<br><em>DIGITAL WORLD.</em></h1><p>Scams are getting smarter. So can you.<br>Play your way to sharper cyber instincts.</p><div class="retro-art">${retroCyberArt()}</div><div class="retro-skill-tags"><span>01 / SPOT PHISHING</span><span>02 / PROTECT ACCESS</span><span>03 / GUARD DATA</span></div><div class="retro-caption">5 missions. Real-world skills. Your next high score.</div></section><section class="retro-card"><div class="retro-card-bar"><span>PLAYER ACCESS TERMINAL</span><span aria-hidden="true">● ● ●</span></div><div class="retro-card-body"><span class="retro-pixel-label">INSERT PLAYER<span class="retro-cursor" aria-hidden="true">_</span></span><h2>Your quest starts here.</h2>${form}<div class="retro-rules"><span>YOUR FIRST DEFENSE</span><p>Check the sender. Protect your passwords.<br>Never share a one-time code.</p></div></div><div class="retro-card-footer">LEARN IT. PLAY IT. USE IT.</div></section></div>`;
}

function lobbyWelcome() {
 $('#app').innerHTML=retroEntry(`<p class="retro-form-intro">Enter your player name to start Cyber Awareness Basics. Clear 20 checks to unlock the arcade.</p><label for="nm">PLAYER NAME</label><input id="nm" maxlength="40" autocomplete="name" value="${esc(S.name)}" placeholder="Choose your player name"><button class="retro-start" data-a="setname">START BASICS <span aria-hidden="true">▶</span></button><small>Press Enter to begin. Your progress stays in this browser.</small>`);
 $('#nm').focus();$('#nm').onkeydown=e=>{if(e.key==='Enter')act.setname()};
}

function lobbyLogin() {
 const proxy=window.CQ_AUTH==='proxy';
 const form=proxy?`<p class="retro-form-intro">Sign in through your company portal, then return to begin your mission.</p><div id="lerr" role="alert" class="profile-error"></div><button class="retro-start" id="rl2">RELOAD TERMINAL <span aria-hidden="true">↻</span></button>`:`<p class="retro-form-intro">Use your company account to continue your mission.</p><label for="em">COMPANY EMAIL</label><input id="em" type="email" autocomplete="username" placeholder="you@company.com"><label for="pw">PASSWORD</label><input id="pw" type="password" autocomplete="current-password" placeholder="Your company password"><div id="lerr" role="alert" class="profile-error"></div><button class="retro-start" data-a="dologin">SIGN IN & PLAY <span aria-hidden="true">▶</span></button>`;
 $('#app').innerHTML=retroEntry(form);
 if(proxy){$('#rl2').onclick=()=>location.reload();return}
 $('#em').focus();$('#pw').onkeydown=e=>{if(e.key==='Enter')act.dologin()};$('#em').onkeydown=e=>{if(e.key==='Enter')$('#pw').focus()};
}

async function resizeProfilePhoto(file) {
 if(!['image/jpeg','image/png','image/webp'].includes(file.type))throw new Error('Choose a JPG, PNG, or WebP image.');
 if(file.size>8*1024*1024)throw new Error('Choose a photo smaller than 8 MB.');
 const data=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(new Error('This file could not be read. Try another photo.'));reader.readAsDataURL(file)});
  const image=new Image();image.src=data;
  try{await image.decode()}catch(e){throw new Error('This image could not be opened. Try another photo.')}
  const canvas=document.createElement('canvas');canvas.width=canvas.height=256;
  const ctx=canvas.getContext('2d');const side=Math.min(image.naturalWidth,image.naturalHeight);
  if(!side)throw new Error('This image could not be opened. Try another photo.');
  ctx.fillStyle='#11274a';ctx.fillRect(0,0,256,256);
  ctx.drawImage(image,(image.naturalWidth-side)/2,(image.naturalHeight-side)/2,side,side,0,0,256,256);
  const photo=canvas.toDataURL('image/jpeg',.86);
  if(!profilePhotoValid(photo))throw new Error('This photo could not be saved. Try a smaller image.');
  return photo;
}

function lobbyProfile() {
 const cleared=LV.filter(l=>S.done.includes(l.n)).length;
 $('#app').innerHTML=`<section class="profile-editor" id="profile-editor"><div class="hub-heading-row"><div><div class="hub-eyebrow">YOUR PLAYER IDENTITY</div><h1>Make it yours.</h1><p>A familiar face. A sharper defender.</p></div><button class="hub-link" data-a="nav" data-v="dash">← Dashboard</button></div><div class="profile-grid"><aside class="profile-preview"><div class="profile-large-avatar" id="profile-photo-preview">${hubAvatar(S.name,S.photo)}</div><h2 id="profile-name-preview">${esc(S.name)}</h2><span class="profile-tier">${tier()} / Level ${String(Math.min(LV.length,cleared+1)).padStart(2,'0')}</span><div class="profile-preview-stats"><div><strong>${fmt(S.score)}</strong><span>POINTS</span></div><div><strong>${cleared}/${LV.length}</strong><span>MISSIONS</span></div></div><p>Your photo appears on your dashboard and in the top-left profile icon.</p></aside><form class="profile-form" id="profile-form"><h2>Edit player profile</h2><p>Choose a photo and make your player card your own.</p><label for="profile-name">Player name</label><input id="profile-name" maxlength="40" value="${esc(S.name)}" autocomplete="name" ${SERVER?'readonly':''}>${SERVER?'<small>Your name is managed by your company account.</small>':''}<label for="profile-photo-input">Profile photo</label><input id="profile-photo-input" type="file" accept="image/jpeg,image/png,image/webp" class="profile-file" aria-describedby="photo-help"><div class="profile-photo-actions"><button type="button" class="hub-button secondary" id="profile-choose">Upload photo</button><button type="button" class="hub-link" id="profile-remove" ${profilePhotoValid(S.photo)?'':'disabled'}>Remove photo</button></div><small id="photo-help">JPG, PNG, or WebP · up to 8 MB. Center-cropped into a square. Saved only in this browser.</small><p class="profile-error" id="profile-error" role="alert"></p><div class="profile-form-actions"><button type="submit" class="hub-button" id="profile-save">Save profile <span aria-hidden="true">✓</span></button><button type="button" class="hub-button secondary" data-a="nav" data-v="dash">Cancel</button></div></form></div><button class="hub-link profile-entry-link" data-a="entry">Back to player entry ↗</button></section>`;
 const root=$('#profile-editor'),nameInput=root.querySelector('#profile-name'),input=root.querySelector('#profile-photo-input'),preview=root.querySelector('#profile-photo-preview'),error=root.querySelector('#profile-error'),saveButton=root.querySelector('#profile-save'),remove=root.querySelector('#profile-remove');
 let draftPhoto=profilePhotoValid(S.photo)?S.photo:'',revision=0;
 const show=()=>{preview.innerHTML=hubAvatar(nameInput.value||'Player',draftPhoto);root.querySelector('#profile-name-preview').textContent=nameInput.value||'Player';remove.disabled=!draftPhoto};
 nameInput.oninput=show;
 root.querySelector('#profile-choose').onclick=()=>input.click();
 input.onchange=async()=>{
  const file=input.files[0];if(!file)return;const request=++revision;error.textContent='';saveButton.disabled=true;
  try{const photo=await resizeProfilePhoto(file);if(request!==revision||!root.isConnected)return;draftPhoto=photo;show()}
  catch(e){if(request===revision&&root.isConnected)error.textContent=e.message||'Could not open this photo. Try another image.'}
  finally{if(request===revision&&root.isConnected){saveButton.disabled=false;input.value=''}}
 };
 remove.onclick=()=>{revision++;draftPhoto='';input.value='';error.textContent='';saveButton.disabled=false;show()};
 root.querySelector('#profile-form').onsubmit=e=>{
  e.preventDefault();if(saveButton.disabled)return;
  const name=nameInput.value.replace(/\s+/g,' ').trim().slice(0,40);
  if(!name){error.textContent='Enter a player name before saving.';nameInput.focus();return}
  const previous={name:S.name,photo:S.photo};if(!SERVER)S.name=name;S.photo=draftPhoto;
  if(!save()){S.name=previous.name;S.photo=previous.photo;error.textContent='Your browser could not save the profile. Free some browser storage and try again.';return}
  S.view='dash';render();toast('Player profile saved','#1da049');
 };
}
function leaderboardView(rows,{sample=false,title='Top defenders',me=null}={}){
 const podium=rows.filter(r=>r.rank<=3),own=rows.find(r=>r.me)||me;
 // Use actual adjacent ranks, including when the server returns our row separately.
 // Never substitute an unrelated top-25 player for a missing neighbour.
 const nearby=own?[...rows.filter(r=>!r.me&&Math.abs(Number(r.rank)-Number(own.rank))===1),{...own,me:true}].sort((a,b)=>Number(a.rank)-Number(b.rank)):[];
 const row=r=>`<tr class="${r.me?'ranking-you':''}"><td><span class="rank-number">${r.rank<=3?['🥇','🥈','🥉'][r.rank-1]:'#'+r.rank}</span></td><td><div class="ranking-player"><span class="ranking-avatar">${hubAvatar(r.name,r.me?S.photo:'')}</span><b>${esc(r.name)}${r.me?' <em>YOU</em>':''}</b></div></td><td class="rank-points">${fmt(r.score)} <small>PTS</small></td></tr>`;
 return `<section class="arena-board"><header class="arena-heading"><div><div class="hub-eyebrow">THE HALL OF DEFENDERS</div><h1>${esc(title)}</h1><p>Sharp instincts. Strong scores. A place in the spotlight.</p></div><span class="board-mode">${sample?'SAMPLE LEADERBOARD':'PLAYER RANKINGS'}</span></header>${sample?'<p class="board-note">Practice standings with sample players and your browser’s saved score.</p>':''}<div class="champion-podium" aria-label="Top three players">${podium.map(r=>`<article class="podium-card podium-${r.rank}"><div class="podium-award">${['♛','✦','✧'][r.rank-1]}</div><div class="podium-avatar">${hubAvatar(r.name,r.me?S.photo:'')}<span>${r.rank}</span></div><div class="podium-title">${['CHAMPION','SILVER DEFENDER','BRONZE DEFENDER'][r.rank-1]}</div><h2>${esc(r.name)}${r.me?' (you)':''}</h2><p>${['Leading the charge. Setting the standard.','Brilliant instincts. A standout performance.','A podium finish. A defender to celebrate.'][r.rank-1]}</p><strong>${fmt(r.score)} <small>PTS</small></strong></article>`).join('')}</div>${!rows.length?'<div class="ranking-empty"><h2>The podium is waiting.</h2><p>Finish a mission to put your name on the board.</p></div>':''}${own?`<div class="your-standing"><span class="hub-avatar">${hubAvatar(own.name,S.photo)}</span><div><small>YOUR POSITION</small><b>#${own.rank} · ${esc(own.name)}</b></div><strong>${fmt(own.score)} <small>PTS</small></strong><button class="hub-button secondary" data-a="nav" data-v="road">Play a mission ↗</button></div>`:''}<div class="rankings"><div class="hub-heading-row"><h2>The standings</h2><span>${nearby.length} player${nearby.length===1?'':'s'} shown</span></div><table><thead><tr><th scope="col">Rank</th><th scope="col">Player</th><th scope="col">Score</th></tr></thead><tbody>${nearby.length?nearby.map(row).join(''):'<tr><td colspan="3">Complete a mission to see your position.</td></tr>'}</tbody></table></div></section>`;
}

const CYBER_INSIGHTS=[
 {label:'Cyber awareness. Game on.',title:'LEVEL UP.',accent:'STAY SHARP.',copy:'Catch the scams. Protect your team. Turn everyday security skills into your next high score.',tag:'BUILD YOUR DEFENDER INSTINCT',kind:null,color:'#11274a'},
 {label:'01 / Spot the phishing trap',title:'PAUSE FIRST.',accent:'CLICK LATER.',copy:'An urgent message is a reason to slow down. Check the sender’s full address and open the official app or website to verify the request.',tag:'URGENCY IS NOT PROOF',kind:'mail',color:'#11274a'},
 {label:'02 / Protect your accounts',title:'ONE ACCOUNT.',accent:'ONE PASSWORD.',copy:'Use a unique password for every account. Let a password manager remember them, and turn on multi-factor authentication wherever available.',tag:'ADD AN EXTRA LAYER OF DEFENSE',kind:'shield',color:'#2b2b2b'},
 {label:'03 / Keep your workspace safe',title:'STEP AWAY.',accent:'LOCK IT UP.',copy:'Lock your screen before leaving your desk. Keep badges and sensitive papers secure, even when you are only stepping away for a moment.',tag:'SMALL HABIT. STRONG DEFENSE.',kind:'desk',color:'#11274a'},
 {label:'04 / Verify unexpected requests',title:'SOUNDS REAL?',accent:'CHECK AGAIN.',copy:'A familiar name or voice is not enough. Verify unexpected requests for money, files or login codes using a trusted contact method.',tag:'VERIFY BEFORE YOU SHARE',kind:'voice',color:'#2b2b2b'}
];
function mountInsights(root){
 let index=0,paused=window.matchMedia('(prefers-reduced-motion: reduce)').matches,hover=false,focused=false;
 const q=s=>root.querySelector(s),dots=[...root.querySelectorAll('[data-slide]')];
 function show(n){index=(n+CYBER_INSIGHTS.length)%CYBER_INSIGHTS.length;const s=CYBER_INSIGHTS[index];q('.hub-eyebrow').textContent=s.label;q('h2').innerHTML=`${s.title}<br><em>${s.accent}</em>`;q('.hub-hero-copy>p').textContent=s.copy;q('.hub-hero-art').innerHTML=(s.kind?hubArt(s.kind,'insight-art'):hubDefenderArt('hero'))+`<span class="hub-art-tag">${s.tag}</span>`;root.style.setProperty('--insight-color',s.color);q('[data-slide-count]').textContent=String(index+1).padStart(2,'0')+' / 05';dots.forEach((d,i)=>d.setAttribute('aria-pressed',String(i===index)));}
 function state(){q('[data-slide-pause]').textContent=paused?'▶':'Ⅱ';q('[data-slide-pause]').setAttribute('aria-label',paused?'Play slideshow':'Pause slideshow');}
 function manual(n){paused=true;state();show(n)}
 q('[data-slide-prev]').onclick=()=>manual(index-1);q('[data-slide-next]').onclick=()=>manual(index+1);dots.forEach(d=>d.onclick=()=>manual(+d.dataset.slide));q('[data-slide-pause]').onclick=()=>{paused=!paused;state()};
 root.onmouseenter=()=>hover=true;root.onmouseleave=()=>hover=false;root.onfocusin=()=>focused=true;root.onfocusout=e=>focused=root.contains(e.relatedTarget);
 const timer=setInterval(()=>{if(!root.isConnected){clearInterval(timer);observer.disconnect();return}if(!paused&&!hover&&!focused&&!document.hidden)show(index+1)},8500);
 const observer=new MutationObserver(()=>{if(!root.isConnected){clearInterval(timer);observer.disconnect()}});observer.observe(root.parentNode.parentNode,{childList:true,subtree:true});state();
}

function dataSorterCoverArt(){
 return `<svg class="play-scene" viewBox="0 0 1100 700" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="sort-bg" x2="1" y2="1"><stop stop-color="#07142d"/><stop offset=".55" stop-color="#11274a"/><stop offset="1" stop-color="#092b42"/></linearGradient><linearGradient id="sort-card" x2="0" y2="1"><stop stop-color="#f4f9ff"/><stop offset="1" stop-color="#a9c5d8"/></linearGradient><linearGradient id="sort-belt" x2="0" y2="1"><stop stop-color="#335a78"/><stop offset="1" stop-color="#0b1c33"/></linearGradient><radialGradient id="sort-glow"><stop stop-color="#1ca4dd" stop-opacity=".5"/><stop offset="1" stop-color="#1ca4dd" stop-opacity="0"/></radialGradient></defs><rect width="1100" height="700" fill="url(#sort-bg)"/><circle cx="810" cy="305" r="360" fill="url(#sort-glow)"/><g stroke="#54bbdf" stroke-opacity=".12"><path d="M0 85h1100M0 175h1100M0 265h1100M0 355h1100M0 445h1100M0 535h1100M0 625h1100M95 0v700M225 0v700M355 0v700M485 0v700M615 0v700M745 0v700M875 0v700M1005 0v700"/></g><path d="M0 510 1100 400v300H0z" fill="#081728" opacity=".78"/><g transform="translate(710 64) rotate(9)"><rect x="22" y="22" width="258" height="340" rx="17" fill="#000" opacity=".3"/><path d="M0 0h210l49 49v292q0 18-18 18H18q-18 0-18-18z" fill="url(#sort-card)" stroke="#59c6f0" stroke-width="5"/><path d="M210 0v49h49" fill="#8ebbd1" stroke="#59c6f0" stroke-width="4"/><rect x="24" y="29" width="125" height="24" rx="5" fill="#11274a"/><path d="M28 91h193M28 115h149M28 139h185M28 163h126M28 280h188M28 304h137" stroke="#5b8ba6" stroke-width="9" stroke-linecap="round"/><rect x="27" y="198" width="201" height="54" rx="9" fill="#d09640"/><path d="m49 226 13 13 26-28" fill="none" stroke="#11274a" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/><path d="M100 224h104" stroke="#11274a" stroke-width="8" stroke-linecap="round"/></g><g transform="translate(595 450)"><path d="M0 0h500v69H0z" fill="url(#sort-belt)" stroke="#65bee2" stroke-width="4"/><path d="M16 15h468M16 55h468" stroke="#1ca4dd" stroke-opacity=".65" stroke-width="3"/><g fill="#0b2038" stroke="#5fa4c1" stroke-width="4"><circle cx="37" cy="35" r="20"/><circle cx="122" cy="35" r="20"/><circle cx="207" cy="35" r="20"/><circle cx="292" cy="35" r="20"/><circle cx="377" cy="35" r="20"/><circle cx="462" cy="35" r="20"/></g><path d="M26 73v66m445-66v66" stroke="#557b90" stroke-width="18"/></g><g font-family="Arial,sans-serif" font-weight="800" text-anchor="middle"><g transform="translate(615 570)"><path d="M0 0h136l-12 100H12z" fill="#21547d" stroke="#60c6ef" stroke-width="4"/><text x="68" y="55" font-size="13" fill="#eaf8ff">PUBLIC</text></g><g transform="translate(776 570)"><path d="M0 0h136l-12 100H12z" fill="#294d64" stroke="#99d6ee" stroke-width="4"/><text x="68" y="55" font-size="13" fill="#eaf8ff">INTERNAL</text></g><g transform="translate(937 570)"><path d="M0 0h136l-12 100H12z" fill="#816029" stroke="#e9b458" stroke-width="4"/><text x="68" y="55" font-size="12" fill="#fff4de">CONFIDENTIAL</text></g></g><g fill="#d09640"><circle cx="175" cy="98" r="3"/><circle cx="971" cy="104" r="3"/><circle cx="482" cy="568" r="3"/></g></svg>`;
}

function blasterCoverArt(){
 return `<svg class="play-scene" viewBox="0 0 1100 700" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="blaster-sky" x2="0" y2="1"><stop stop-color="#07162e"/><stop offset=".6" stop-color="#11274a"/><stop offset="1" stop-color="#123c55"/></linearGradient><linearGradient id="blaster-ship" x2="0" y2="1"><stop stop-color="#9de6fa"/><stop offset=".55" stop-color="#1ca4dd"/><stop offset="1" stop-color="#11274a"/></linearGradient><radialGradient id="blaster-glow"><stop stop-color="#1ca4dd" stop-opacity=".5"/><stop offset="1" stop-color="#1ca4dd" stop-opacity="0"/></radialGradient></defs><rect width="1100" height="700" fill="url(#blaster-sky)"/><circle cx="765" cy="335" r="330" fill="url(#blaster-glow)"/><g stroke="#75c7e8" stroke-opacity=".15"><path d="M0 70h1100M0 140h1100M0 210h1100M0 280h1100M0 350h1100M0 420h1100M0 490h1100M0 560h1100M0 630h1100M80 0v700M200 0v700M320 0v700M440 0v700M560 0v700M680 0v700M800 0v700M920 0v700M1040 0v700"/></g><g fill="#d09640"><circle cx="620" cy="87" r="3"/><circle cx="1030" cy="112" r="4"/><circle cx="945" cy="510" r="3"/><circle cx="525" cy="446" r="2"/></g><g transform="translate(765 480)"><ellipse cx="0" cy="124" rx="175" ry="36" fill="#1ca4dd" opacity=".2"/><path d="M0-100 46-32 105 16 95 52 36 35 0 84-36 35-95 52-105 16-46-32z" fill="url(#blaster-ship)" stroke="#c7edfb" stroke-width="6"/><path d="M0-70 30-19 58 19 33 13 0 45-33 13-58 19-30-19z" fill="#11274a" stroke="#d09640" stroke-width="4"/><path d="M-32 55-21 96 0 70 21 96 32 55" fill="#d09640"/><path d="M0-24v-206" stroke="#e7bd7c" stroke-width="14" stroke-linecap="round"/><path d="M0-245-19-200h38z" fill="#f7dca8"/><path d="M-12-8h24" stroke="#1ca4dd" stroke-width="7"/></g><g transform="translate(765 116)"><path d="M0-69 18-49 48-57 43-30 69-13 49 5 58 35 27 30 0 64-27 30-58 35-49 5-69-13-43-30-48-57-18-49z" fill="#922f4f" stroke="#ff9eae" stroke-width="5"/><path d="m-30-19 22 7m38-7-22 7" stroke="#411b2d" stroke-width="8" stroke-linecap="round"/><path d="M-20 24q20-20 40 0" fill="none" stroke="#411b2d" stroke-width="7"/></g><g transform="translate(975 287)"><rect x="-82" y="-35" width="164" height="70" rx="16" fill="#1c3e52" stroke="#82e0cb" stroke-width="4"/><circle cx="-47" cy="0" r="17" fill="none" stroke="#82e0cb" stroke-width="4"/><path d="m-56 0 9 9 14-18" fill="none" stroke="#82e0cb" stroke-width="4"/><path d="M-14 0h67" stroke="#a8e9d9" stroke-width="6"/></g><path d="M540 642h530" stroke="#1ca4dd" stroke-opacity=".5" stroke-width="3" stroke-dasharray="20 16"/></svg>`;
}
function lobbyGames(){
 const blaster=(typeof previewUnlocked==='function'&&previewUnlocked())||S.done.includes(1);
 $('#app').innerHTML=`<section class="play-now-page"><div class="play-now-cover ${blaster?'blaster-cover':''}">${blaster?blasterCoverArt():dataSorterCoverArt()}<div class="play-cover-shade"></div><div class="play-now-copy"><div class="play-now-kicker"><span class="live-dot"></span> ${blaster?'LEVEL 01 CLEARED · BONUS ROUND READY':'LEVEL 01 · DATA PROTECTION'}</div><h1>${blaster?'FIREWALL<br>BLASTER':'DATA<br>SORTER'}</h1><p>${blaster?'Your data mission is complete. Now shoot threats, protect the network and chase a new high score.':'Sort the files. Protect what matters.'}</p><button class="play-now-launch" data-a="${blaster?'blaster':'quickplay'}" ${blaster?'':'data-v="1"'} aria-label="${blaster?'Play Firewall Blaster':'Play Data Sorter'} now"><span aria-hidden="true">▶</span><b>PLAY NOW</b></button><div class="play-now-time"><strong data-daily-time>15:00</strong> REMAINING TODAY</div></div></div></section>`;
}


/* Upward campaign path: level one is always the bottom checkpoint. */
function revealSelectedMission(){
 if(S.view!=='road'||!window.matchMedia('(max-width: 900px)').matches)return;
 const button=document.querySelector('.campaign-info .mission-play');
 if(!button)return;
 button.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'center'});
 if(!button.disabled)button.focus({preventScroll:true});
}
function lobbyMissions(){
 const selected=LV.find(l=>l.n===S.sel)||curLv(),meta=missionMeta(selected),done=S.done.includes(selected.n),available=open(selected.n);
 const count=LV.length,height=Math.max(1050,count*210),step=height/count;
 const points=Array.from({length:count},(_,i)=>({x:i%2?430:170,y:Math.round(step*(i+.5))}));
 const route=points.reduce((d,p,i)=>i?d+' C'+points[i-1].x+' '+Math.round((points[i-1].y+p.y)/2)+' '+p.x+' '+Math.round((points[i-1].y+p.y)/2)+' '+p.x+' '+p.y:'M'+p.x+' '+p.y,'');
 const victory=S.lastResult?`<div class='journey-victory' role='status'><span class='journey-victory-medal' aria-hidden='true'>★</span><div><small>MISSION ${String(S.lastResult.level).padStart(2,'0')} CLEARED</small><b>Your journey continues!</b><p>+${fmt(S.lastResult.points)} pts · Quiz ${S.lastResult.correct}/${S.lastResult.total} · ${S.lastResult.level<count?'Level '+String(S.lastResult.level+1).padStart(2,'0')+' unlocked':'All levels cleared'}</p></div><button type='button' data-a='dismissResult' aria-label='Dismiss mission result'>×</button></div>`:'';
 const stops=LV.map((l,i)=>{
  const cleared=S.done.includes(l.n),here=l.n===curLv().n&&!cleared,display=count-1-i,m=missionMeta(l);
  const color=['#1ca4dd','#d09640','#d2d0cd','#1da049','#d09640'][i%5];
  return `<button type='button' data-a='sel' data-v='${l.n}' class='journey-stop ${display%2?'right':'left'} ${cleared?'cleared':''} ${here?'current':''} ${selected.n===l.n?'selected':''}' style='--level-accent:${color}' aria-label='Select ${esc(l.name)}' aria-pressed='${selected.n===l.n}'>${here?'<span class="journey-here">YOU ARE HERE</span>':''}<span class='journey-node'><em>${String(l.n).padStart(2,'0')}</em>${cleared?'<i class="journey-clear">✓</i>':''}</span><span class='journey-stars' aria-label='${cleared?'Level cleared':open(l.n)?'Level available':'Level locked'}'>${cleared?'★ ★ ★':here?'★ ☆ ☆':'☆ ☆ ☆'}</span><span class='journey-stop-copy'><small>LEVEL ${String(l.n).padStart(2,'0')} · ${cleared?'COMPLETE':here?'UP NEXT':open(l.n)?'READY':'LOCKED'}</small><b>${esc(l.name)}</b><span>${esc(m.tag)}</span></span></button>`;
 }).join('');
 $('#app').innerHTML=`<section class='campaign'>${victory}<header class='arena-heading'><div><div class='hub-eyebrow'>EVERY DEFENDER STARTS SOMEWHERE</div><h1>Your defender journey</h1><p>Start at Level 01 below. Follow the path upward to the next checkpoint.</p></div><div class='arena-counter'><b>${S.done.length}<small> / ${count}</small></b><span>MISSIONS CLEARED</span></div></header><div class='journey-layout'><div class='journey-map'><div class='journey-map-head'><b>DEFENDER WORLD</b><span>${S.done.length} / ${count} BADGES</span></div><div class='journey-finish'><span>⚑</span><b>CYBER DEFENDER</b><small>${S.done.length===count?'Journey complete. Keep sharpening your skills.':'Reach the summit by clearing every chapter.'}</small></div><div class='journey-path'><svg class='journey-route' viewBox='0 0 600 ${height}' preserveAspectRatio='none' aria-hidden='true'><path d='${route}' fill='none' stroke='#315474' stroke-width='28'/><path d='${route}' fill='none' stroke='#1ca4dd' stroke-width='6' stroke-dasharray='10 13'/></svg><div class='journey-stops' style='height:${height}px' aria-label='Your mission journey'>${stops}</div></div><div class='journey-start'>YOUR JOURNEY STARTS HERE <span>↑</span></div></div><div class='campaign-feature'><div class='campaign-art' style='background:${meta.color}'>${hubArt(meta.kind,'campaign-feature')}<span>MISSION ${String(selected.n).padStart(2,'0')} / ${String(count).padStart(2,'0')}</span></div><div class='campaign-info'><div class='hub-eyebrow'>${esc(meta.tag)}</div><h2>${esc(selected.name)}</h2><p>${esc(selected.blurb)}</p><div class='campaign-facts'><span><b>${esc(meta.detail)}</b>Game challenge</span><span><b>${selected.q.length} questions</b>Knowledge check</span><span><b>${fmt(S.best[selected.n]||0)} pts</b>Your personal best</span></div><button class='hub-button mission-play' data-a='play' data-v='${selected.n}' ${available?'':'disabled'}>${done?'Replay & beat your best':available?'Play mission →':'Clear mission '+(selected.n-1)+' to unlock'}</button><small>${done?'Mission cleared. Replays keep your highest score.':available?'Ready when you are. Your next win starts here.':'Complete the previous mission to continue your campaign.'}</small></div></div></div><div class='campaign-tip'><span>✦</span><div><b>Every mission builds a real-world skill.</b><p>Keep climbing. Each new checkpoint gives you another chance to practice.</p></div><button class='hub-link' data-a='nav' data-v='top'>Meet the top defenders ↗</button></div></section>`;
}

/* Required, untimed cyber-awareness briefing before the arcade unlocks. */
const BASICS_QUIZ=[
 {question:'What does multi-factor authentication (MFA) add to a work account?',choices:['A second check that it is really you','A shared password for the team','A faster way to skip sign-in','A replacement for software updates'],answer:0,why:'MFA asks for another proof of identity, so a stolen password alone is not enough.'},
 {question:'Which password habit is safest for your work accounts?',choices:['Reuse one memorable password everywhere','Use a long, unique password for each account','Add the current year to a short password','Share your password with your manager'],answer:1,why:'Use long, unique passwords. An approved password manager can create and remember them.'},
 {question:'Someone claiming to be IT asks for your one-time sign-in code. What do you do?',choices:['Read it out if they sound helpful','Send only half of the code','Refuse and contact the help desk using an approved channel','Approve the sign-in and change the password later'],answer:2,why:'Never share a one-time code or approve an MFA request you did not start.'},
 {question:'You leave your desk for a short conversation. What should happen first?',choices:['Leave your laptop open so work can continue','Ask a colleague to watch your screen','Lock your screen and secure sensitive papers','Turn the monitor brightness down'],answer:2,why:'Lock your screen every time you step away, and keep confidential documents out of view.'},
 {question:'An urgent email asks you to sign in through a link. What is the safest first move?',choices:['Click quickly before the deadline','Open the known company portal yourself and report the suspicious message','Reply with your password to check whether it is real','Forward the link to everyone on your team'],answer:1,why:'Urgency can be a phishing trick. Use a known address or app, then report the message.'},
 {question:'Your work laptop says an approved security update is ready. What should you do?',choices:['Install it through the approved update process','Ignore it until the computer breaks','Download a different installer from a search result','Disable updates to keep the laptop fast'],answer:0,why:'Approved updates fix known weaknesses. Follow your organization’s update process.'},
 {question:'You find an unknown USB drive near your workstation. What is safest?',choices:['Plug it in to find the owner','Give it to a colleague to test','Take it home for later','Hand it to IT or security without connecting it'],answer:3,why:'Unknown removable drives can be unsafe. Let your security team handle them.'},
 {question:'You notice a strange login alert or a lost confidential document. What now?',choices:['Wait to see whether it happens again','Report it promptly using your organization’s security channel','Delete the alert and keep working','Post the details in a public chat'],answer:1,why:'Early reporting gives your organization the best chance to contain a problem.'}
];
const BASICS_MATCH=[
 {place:'WORKSTATION',scenario:'An unlocked laptop is left at an empty desk.',action:'Lock the screen before stepping away.',why:'A locked screen keeps others out of a signed-in account.'},
 {place:'STAFF ENTRANCE',scenario:'A visitor follows someone toward a staff-only area without a badge.',action:'Verify the visitor and direct them to the approved check-in process.',why:'Do not let an unverified visitor bypass physical access controls.'},
 {place:'SHARED TABLE',scenario:'A printout with customer details sits on a shared table.',action:'Secure the paper using approved storage and alert its owner.',why:'Confidential papers should not be left where others can read them.'},
 {place:'MEETING ROOM',scenario:'You find a USB drive beside a meeting-room computer.',action:'Hand the unknown device to IT without plugging it in.',why:'Unknown devices may contain malware or expose data.'},
 {place:'YOUR PHONE',scenario:'Your phone shows an MFA approval request you did not initiate.',action:'Deny the request and report the unexpected prompt.',why:'An unexpected MFA prompt may mean someone has your password.'},
 {place:'FILE REQUEST',scenario:'A colleague asks for a payroll file for an urgent task.',action:'Verify their identity and need-to-know through an approved channel.',why:'Urgency does not replace permission to access confidential data.'}
];
const BASICS_MATCH_ORDER=[3,0,5,2,4,1];
const BASICS_QUIZ_TOPICS=['ACCOUNT ACCESS','PASSWORDS','ONE-TIME CODES','DESK SECURITY','PHISHING','DEVICE UPDATES','UNKNOWN DEVICES','INCIDENT REPORTING'];
const BASICS_SORT=[
 {name:'Approved careers flyer',file:'Innovatiview_Careers_Approved.pdf',type:'PDF',team:'People team',detail:'This sample flyer is approved for sharing on the public careers page.',preview:'Open roles · How to apply · Public contact',category:'Public',why:'Approved careers material can be shared outside Innovatiview.'},
 {name:'Office visitor guide',file:'Innovatiview_Visitor_Guide.docx',type:'DOC',team:'Workplace team',detail:'A staff-only guide to checking in visitors at the office.',preview:'Reception steps · Badge return · Staff contacts',category:'Internal',why:'This work instruction is for Innovatiview staff, not for public release.'},
 {name:'Client service agreement',file:'Innovatiview_Client_Agreement_Draft.pdf',type:'PDF',team:'Client team',detail:'A draft with client terms, pricing, and signature fields.',preview:'Client terms · Pricing · Signatures',category:'Confidential',why:'Client agreements contain sensitive business details and need restricted access.'},
 {name:'Published service brochure',file:'Innovatiview_Service_Brochure.pdf',type:'PDF',team:'Marketing team',detail:'An approved brochure already published on the company website.',preview:'Services overview · Public enquiries',category:'Public',why:'Material approved for the public website belongs in Public.'},
 {name:'Employee payroll export',file:'Innovatiview_Payroll_Export.xlsx',type:'XLS',team:'People team',detail:'A sample export containing names, salaries, and bank details.',preview:'Employee names · Salaries · Bank details',category:'Confidential',why:'Payroll contains highly sensitive personal information and is need-to-know only.'},
 {name:'Team kickoff notes',file:'Innovatiview_Team_Kickoff.docx',type:'DOC',team:'Operations team',detail:'Planning notes for staff, without client or employee records.',preview:'Objectives · Owners · Next steps',category:'Internal',why:'Routine staff planning notes stay inside Innovatiview.'}
];
const BASICS_MODULES=[
 {kind:'quiz',name:'Cyber security quiz',short:'Know the essentials',total:8,tag:'ACCOUNT DEFENSE',icon:'01'},
 {kind:'match',name:'Match the right response',short:'Secure your workspace',total:6,tag:'DESK AWARENESS',icon:'02'},
 {kind:'sort',name:'Sort the files',short:'Handle data with care',total:6,tag:'DATA HANDLING',icon:'03'}
];
let basicsHold=null,basicsFeedback=null,basicsSelected=null,basicsWrongChoice=null,basicsTransition=null;
const basicsCount=()=>{const b=cleanBasics(S.basics);return b.quiz.length+b.match.length+b.sort.length};
const basicsComplete=()=>basicsCount()===20;
function basicsCurrent(){
 const b=cleanBasics(S.basics);
 return BASICS_MODULES.find(m=>b[m.kind].length<m.total)||null
}
function basicsMark(kind,index){
 const previous=S.basics;
 const updated=cleanBasics(previous);
 if(updated[kind].includes(index))return true;
 updated[kind].push(index);updated[kind].sort((a,b)=>a-b);
 S.basics=updated;
 if(save())return true;
 S.basics=previous;
 basicsFeedback={type:'error',text:'Your progress could not be saved. Enable browser storage and try again.'};
 return false
}
function basicsNotice(){
 if(!basicsFeedback)return '';
 return `<div class="basics-feedback ${basicsFeedback.type}" id="basics-feedback" role="status" tabindex="-1"><span aria-hidden="true">${basicsFeedback.type==='good'?'✓':basicsFeedback.type==='error'?'!':'↻'}</span><p>${esc(basicsFeedback.text)}</p>${basicsHold?'<button type="button" data-basic="advance">Next check →</button>':''}</div>`
}
function basicsQuizCard(index){
 const item=BASICS_QUIZ[index],held=basicsHold&&basicsHold.kind==='quiz',done=cleanBasics(S.basics).quiz.length;
 return `<div class="basics-stage-head"><span>MODULE 01 / KNOW THE ESSENTIALS</span><b>CHECK ${String(index+1).padStart(2,'0')} / 08</b></div>
 <div class="basics-challenge-title"><div><span class="basics-mode-label">KNOWLEDGE CHECK</span><h2>Cyber security quiz</h2><p class="basics-stage-intro">Build the habits that protect your account and your workstation.</p></div><div class="basics-challenge-icon" aria-hidden="true">?</div></div>
 <div class="basics-quiz-meter" aria-label="${done} of 8 quiz questions complete">${BASICS_QUIZ.map((_,i)=>`<span class="${i<done?'complete':i===index?'current':''}"></span>`).join('')}</div>
 <div class="basics-question"><div class="basics-question-top"><span>DECISION ${String(index+1).padStart(2,'0')}</span><span>${BASICS_QUIZ_TOPICS[index]}</span></div><h3>${esc(item.question)}</h3><div class="basics-question-foot"><span class="basics-pulse" aria-hidden="true"></span> THINK LIKE A DEFENDER</div></div>
 <div class="basics-choice-label">SELECT THE SAFEST RESPONSE <span>01—04</span></div>
 <div class="basics-answers">${item.choices.map((choice,i)=>`<button type="button" data-basic="quiz" data-choice="${i}" class="basics-answer ${held&&i===item.answer?'correct':''} ${basicsWrongChoice===i?'wrong':''}" ${held||basicsWrongChoice===i?'disabled':''}><span class="basics-answer-key">${String.fromCharCode(65+i)}</span><span class="basics-answer-text">${esc(choice)}</span><span class="basics-answer-arrow" aria-hidden="true">↗</span></button>`).join('')}</div>${basicsNotice()}`
}
function basicsMatchCard(){
 const done=cleanBasics(S.basics).match;
 return `<div class="basics-stage-head"><span>MODULE 02 / SECURE YOUR WORKSPACE</span><b>${done.length} / 06 MATCHED</b></div>
 <div class="basics-challenge-title"><div><span class="basics-mode-label">FIELD EXERCISE</span><h2>Match the right response</h2><p class="basics-stage-intro">Pick a situation on the left. Connect it to the safest action on the right.</p></div><div class="basics-challenge-icon match" aria-hidden="true">⇄</div></div>
 <div class="basics-match-meter"><span>CONNECTIONS MADE</span><div aria-label="${done.length} of 6 pairs matched">${BASICS_MATCH.map((_,i)=>`<i class="${done.includes(i)?'complete':''}">${done.includes(i)?'✓':String(i+1).padStart(2,'0')}</i>`).join('')}</div><b>${done.length}/6</b></div>
 <div class="basics-match-grid"><div class="basics-match-column situations"><div class="basics-match-column-head"><span class="basics-column-glyph" aria-hidden="true">!</span><div><small>CHOOSE FIRST</small><h3>WORKPLACE SITUATION</h3></div></div>${BASICS_MATCH.map((pair,i)=>`<button type="button" data-basic="scenario" data-choice="${i}" class="basics-match-card ${done.includes(i)?'matched':''} ${basicsSelected===i?'selected':''}" aria-pressed="${basicsSelected===i}" ${done.includes(i)?'disabled':''}><small class="basics-match-number">${String(i+1).padStart(2,'0')}</small><span class="basics-match-copy"><small>${pair.place}</small>${esc(pair.scenario)}</span>${done.includes(i)?'<b aria-label="Matched">✓</b>':'<em aria-hidden="true">↗</em>'}</button>`).join('')}</div>
 <div class="basics-match-column actions"><div class="basics-match-column-head"><span class="basics-column-glyph" aria-hidden="true">✓</span><div><small>THEN CONNECT</small><h3>SAFE ACTION</h3></div></div><div class="basics-selected-situation" role="status"><small>ACTIVE SITUATION</small><span>${basicsSelected===null?'Select a situation, then choose its safest action.':esc(BASICS_MATCH[basicsSelected].scenario)}</span></div>${BASICS_MATCH_ORDER.map((i,position)=>`<button type="button" data-basic="action" data-choice="${i}" class="basics-match-card ${done.includes(i)?'matched':''} ${basicsWrongChoice===i?'wrong':''}" ${done.includes(i)?'disabled':''}><small class="basics-match-number">${String.fromCharCode(65+position)}</small><span>${esc(BASICS_MATCH[i].action)}</span>${done.includes(i)?'<b aria-label="Matched">✓</b>':'<em aria-hidden="true">↗</em>'}</button>`).join('')}</div></div>${basicsNotice()}`
}
function basicsSortCard(index){
 const item=BASICS_SORT[index],held=basicsHold&&basicsHold.kind==='sort',done=cleanBasics(S.basics).sort.length;
 return `<div class="basics-stage-head"><span>MODULE 03 / HANDLE DATA WITH CARE</span><b>FILE ${String(index+1).padStart(2,'0')} / 06</b></div>
 <div class="basics-challenge-title"><div><span class="basics-mode-label">DATA HANDLING CHALLENGE</span><h2>Sort the files</h2><p class="basics-stage-intro">Classify six sample Innovatiview files. For real documents, follow your company policy.</p></div><div class="basics-challenge-icon sort" aria-hidden="true">▤</div></div>
 <div class="basics-sort-meter" aria-label="${done} of 6 files classified">${BASICS_SORT.map((_,i)=>`<span class="${i<done?'complete':i===index?'current':''}"></span>`).join('')}</div>
 <div class="basics-sort-console"><div class="basics-sort-console-top"><span><i></i> INNOVATIVIEW / TRAINING INBOX</span><b>FILE ${String(index+1).padStart(2,'0')} OF 06</b></div>
 <div class="basics-file"><div class="basics-file-sheet basics-file-sheet-${item.type.toLowerCase()}" aria-hidden="true"><div class="basics-file-sheet-brand">IV <span>INNOVATIVIEW</span></div><div class="basics-file-sheet-lines"><i></i><i></i><i></i><i></i></div><strong>${item.type}</strong></div><div class="basics-file-details"><div class="basics-file-overline"><span>TRAINING SAMPLE</span><span>${esc(item.team)}</span></div><h3>${esc(item.name)}</h3><code>${esc(item.file)}</code><p>${esc(item.detail)}</p><div class="basics-file-preview"><small>FILE CONTENTS</small><span>${esc(item.preview)}</span></div></div></div></div>
 <div class="basics-sort-title"><span>CHOOSE A DESTINATION</span><b>Where should this file live?</b></div>
 <div class="basics-bins">${['Public','Internal','Confidential'].map((category,i)=>`<button type="button" data-basic="sort" data-choice="${i}" class="basics-bin basics-bin-${category.toLowerCase()} ${held&&category===item.category?'correct':''} ${basicsWrongChoice===i?'wrong':''}" ${held||basicsWrongChoice===i?'disabled':''}><span class="basics-bin-folder" aria-hidden="true">${['◎','▣','◆'][i]}</span><span class="basics-bin-copy"><b>${category}</b><small>${['Approved for anyone','Staff use only','Approved need-to-know'][i]}</small></span><span class="basics-bin-arrow" aria-hidden="true">↗</span></button>`).join('')}</div>${basicsNotice()}`
}
function basicsMilestone(kind){
 const final=kind==='sort'||basicsComplete();
 const title=final?'Basics cleared. Game on.':kind==='quiz'?'Module 01 cleared.':'Module 02 cleared.';
 const copy=final?(previewUnlocked()?'You have completed all 20 checks. The arcade is unlocked. Choose a mission and put your new skills into practice.':'You have mastered all 20 checks. Your 15-minute daily game timer starts when you begin playing.'):kind==='quiz'?'You know the core account and device habits. Next, protect the space around your desk.':'You can spot workplace risks. One final challenge: sort company information safely.';
 return `<div class="basics-milestone"><div class="basics-medal" aria-hidden="true">${final?'★':'✓'}</div><span class="basics-kicker">${final?'20 / 20 CHECKS COMPLETE':'CHECKPOINT CLEARED'}</span><h2>${title}</h2><p>${copy}</p><button type="button" class="basics-primary" data-basic="${final?'unlock':'continue'}">${final?'Enter PLAY Now':'Continue to next module'} <span aria-hidden="true">→</span></button></div>`
}
function basicsView(){
 S.basics=cleanBasics(S.basics);
 const progress=basicsCount(),current=basicsCurrent();
 const kind=basicsHold?basicsHold.kind:basicsTransition||current?.kind||'sort';
 const module=BASICS_MODULES.find(m=>m.kind===kind)||BASICS_MODULES[2];
 const count=S.basics[module.kind].length;
 let stage;
 if(basicsTransition||!current)stage=basicsMilestone(basicsTransition||'sort');
 else if(kind==='quiz')stage=basicsQuizCard(basicsHold?.index??BASICS_QUIZ.findIndex((_,i)=>!S.basics.quiz.includes(i)));
 else if(kind==='match')stage=basicsMatchCard();
 else stage=basicsSortCard(basicsHold?.index??BASICS_SORT.findIndex((_,i)=>!S.basics.sort.includes(i)));
 const tips=kind==='quiz'?['Turn on MFA for your work account.','Use long, unique passwords.','Report unexpected prompts and messages.']:kind==='match'?['Lock the screen before leaving.','Keep confidential papers out of view.','Verify visitors and unusual requests.']:['Public: approved for external release.','Internal: only for employees.','Confidential: approved need-to-know only.'];
 const first=String(S.name||'Defender').trim().split(/\s+/)[0];
 $('#app').innerHTML=`<section class="basics-shell">
 <header class="basics-hero"><div class="basics-hero-copy"><div class="basics-kicker"><i></i> REQUIRED PLAYER BRIEFING</div><small>WELCOME, ${esc(first).toUpperCase()}</small><h1>Know the basics.<br><em>Then play to win.</em></h1><p>Three short modules. Twenty checks. Learn to protect your account, your desk, and company data before the arcade unlocks.</p><div class="basics-hero-chips"><span>NO GAME TIME USED</span><span>PROGRESS SAVED</span></div></div><div class="basics-hero-art" aria-hidden="true"><div class="basics-monitor"><span>✓</span><i></i><i></i></div><div class="basics-desk"></div><div class="basics-note">CONFIDENTIAL <b>◆</b></div><div class="basics-shield">✓</div></div></header>
 <div class="basics-progress"><div><span class="basics-kicker">YOUR READINESS</span><b>${progress}<small> / 20 CHECKS</small></b></div><div class="basics-track" role="progressbar" aria-label="Basics completed" aria-valuemin="0" aria-valuemax="20" aria-valuenow="${progress}"><span style="width:${progress*5}%"></span></div><strong>${basicsComplete()?'ARCADE UNLOCKED':'ARCADE LOCKED UNTIL BASICS ARE COMPLETE'}</strong></div>
 <div class="basics-modules" aria-label="Training modules">${BASICS_MODULES.map((m,i)=>`<div class="basics-module ${S.basics[m.kind].length===m.total?'done':kind===m.kind?'active':'locked'}"><span class="basics-module-number">${m.icon}</span><div><small>${m.tag}</small><b>${m.name}</b><p>${m.short}</p></div><strong>${S.basics[m.kind].length===m.total?'✓':S.basics[m.kind].length+'/'+m.total}</strong></div>`).join('')}</div>
 <div class="basics-workspace"><section class="basics-stage basics-stage-${kind}" id="basics-stage" aria-label="Current training challenge">${stage}</section><aside class="basics-aside"><div class="basics-aside-top"><span>FIELD GUIDE</span><strong>${module.icon}</strong></div><h3>Keep this in mind</h3><ul>${tips.map(t=>`<li><span>✓</span>${esc(t)}</li>`).join('')}</ul><div class="basics-aside-foot"><b>LEARN • PRACTICE • DEFEND</b><p>Wrong answer? Try again. Every check counts when you get it right.</p></div></aside></div>
 </section>`
}
function basicsAnswer(kind,choice){
 if(basicsHold||basicsTransition||basicsComplete())return;
 const done=cleanBasics(S.basics)[kind],items=kind==='quiz'?BASICS_QUIZ:BASICS_SORT;
 const index=items.findIndex((_,i)=>!done.includes(i));
 if(index<0)return;
 const item=items[index],right=kind==='quiz'?item.answer:['Public','Internal','Confidential'].indexOf(item.category);
 if(choice===right){
  if(!basicsMark(kind,index)){basicsView();return}
  basicsHold={kind,index};basicsWrongChoice=null;
  basicsFeedback={type:'good',text:item.why};SFX.ok()
 }else{
  basicsWrongChoice=choice;basicsFeedback={type:'retry',text:'Not quite. '+item.why};SFX.bad()
 }
 basicsView();document.getElementById('basics-feedback')?.focus()
}
function basicsMatchAction(action,choice){
 if(basicsTransition||basicsComplete())return;
 const done=cleanBasics(S.basics).match;
 if(action==='scenario'){
  if(done.includes(choice))return;
  basicsSelected=choice;basicsWrongChoice=null;basicsFeedback=null;basicsView();
  if(typeof window!=='undefined'&&window.matchMedia('(max-width: 600px)').matches)document.querySelector('.basics-selected-situation')?.scrollIntoView({behavior:'smooth',block:'center'});
  return
 }
 if(basicsSelected===null){basicsFeedback={type:'retry',text:'Select a situation first, then choose its safest action.'};basicsView();return}
 if(done.includes(choice))return;
 const pair=BASICS_MATCH[basicsSelected];
 if(choice===basicsSelected){
  if(!basicsMark('match',choice)){basicsView();return}
  basicsFeedback={type:'good',text:pair.why};basicsSelected=null;basicsWrongChoice=null;SFX.ok();
  if(S.basics.match.length===BASICS_MATCH.length)basicsTransition='match'
 }else{
  basicsWrongChoice=choice;basicsFeedback={type:'retry',text:'Try a different action. '+pair.why};SFX.bad()
 }
 basicsView();document.getElementById('basics-feedback')?.focus()
}
if(typeof document!=='undefined')document.addEventListener('click',e=>{
 const button=e.target.closest('[data-basic]');
 if(!button||S.view!=='basics')return;
 const action=button.dataset.basic,choice=Number(button.dataset.choice);
 if(action==='quiz'||action==='sort')basicsAnswer(action,choice);
 else if(action==='scenario'||action==='action')basicsMatchAction(action,choice);
 else if(action==='advance'){
  const previous=basicsHold?.kind;
  basicsHold=null;basicsFeedback=null;basicsWrongChoice=null;
  if(previous==='quiz'&&S.basics.quiz.length===BASICS_QUIZ.length)basicsTransition='quiz';
  if(previous==='sort'&&basicsComplete())basicsTransition='sort';
  basicsView()
 }else if(action==='continue'){
  basicsTransition=null;basicsFeedback=null;basicsSelected=null;basicsView()
 }else if(action==='unlock'&&basicsComplete()){
  basicsTransition=null;basicsFeedback=null;S.view='games';render()
 }
});

/* Packet Rescue — Byte's three-lane courier run. Physics stays independent of rendering. */
const PACKET_STAGES=[
 {zone:'NEON TRANSIT / PAYMENT DISTRICT',title:'Packet Rescue',request:'Jump small scam emails. Change lanes around giant phishing emails, viruses and fake logins. Collect 15 coins to finish.',checks:['KNOWN CALLBACK','SECOND APPROVER','SENDER CHECK'],lesson:'Check the sender before opening an email. Open saved portals instead of surprise login links, and never share MFA codes.',coinGoal:15,accent:'#65dbfa',sky:'#102c4e',building:'#174666'}

];
const PACKET_BOTS=[['PHISH','MAIL'],['FAKE BOSS','BOSS'],['URGENCY','TIME'],['SMS','SMS'],['QR','QR']];
const PACKET_TRAPS=[['CLICK TO VERIFY','BAIT'],['FREE ACCESS','BAIT'],['QUICK LOGIN','BAIT']];
const PACKET_JUMP_SECONDS=1.2;
const PACKET_MAIL=['PHISHING MAIL','URGENT PAYMENT','MFA CODE BAIT'];
const PACKET_ATTACKS=['PHISHING MAIL','VIRUS','FAKE LOGIN','RANSOMWARE'];
const PACKET_RUN_SPEED=.11; // About 35% slower; leave time to read each threat.
const PACKET_WAVE_SECONDS=2.5*.17/PACKET_RUN_SPEED; // Preserve space between waves at the slower pace.
function packetSafetyTip(label){
 if(/VIRUS|RANSOMWARE/.test(label))return 'Avoid unknown downloads and report suspicious files to IT.';
 if(/MFA|CODE/.test(label))return 'Never share an MFA code.';
 if(/PAYMENT|BOSS|URGENCY/.test(label))return 'Verify urgent requests with a known contact.';
 if(/QR/.test(label))return 'Check the destination before using a QR link.';
 if(/LOGIN|VERIFY|ACCESS/.test(label))return 'Use your saved company portal.';
 return 'Check the sender before opening a message.';
}
function newPacketRun(index){return {index,lane:1,visualLane:1,elapsed:0,waveClock:0,waves:0,entities:[],verified:[false,false,false],shield:3,hits:0,invulnerable:0,gate:false,complete:false,failed:false,jumpTime:0,jumpHeight:0,jumps:0,slideTime:0,slides:0,cleared:0,bytes:0,combo:0,bestCombo:0,score:0,guard:0,pulse:0}}
function steerPacket(run,lane){if(!run.complete&&!run.failed&&Number.isInteger(lane)&&lane>=0&&lane<3)run.lane=lane}
function packetThreatAhead(run){
 return run.entities.filter(o=>o.lane===run.lane&&!o.resolved&&!o.passed&&o.y>.25&&o.y<.9&&['barrier','bot','wall','overhead','trap'].includes(o.kind)).sort((a,b)=>b.y-a.y)[0]||null;
}
function packetThreatCaption(run){
 const held=run.jumpCue&&run.elapsed<run.jumpCueUntil,threat=held?run.jumpCue:packetThreatAhead(run);
 if(!threat||run.gate)return null;
 const jumpable=threat.kind==='barrier'||threat.kind==='bot';
 const action=jumpable?(held?(run.jumpTime>0?'JUMPING OVER':'LAST JUMP'):'JUMP OVER'):threat.kind==='overhead'?'SLIDE UNDER':'CHANGE LANES';
 return {action,label:threat.label,tip:packetSafetyTip(threat.label)};
}
function jumpPacket(run){if(run.complete||run.failed||run.jumpTime>0||run.slideTime>0)return false;run.jumpTime=.001;run.jumps++;run.jumpCue=packetThreatAhead(run);run.jumpCueUntil=run.elapsed+PACKET_JUMP_SECONDS+1;return true}
function slidePacket(run){if(run.complete||run.failed||run.slideTime>0||run.jumpTime>0)return false;run.slideTime=.85;run.slides++;return true}
function packetCombo(run,points){run.combo++;run.bestCombo=Math.max(run.bestCombo,run.combo);const multiplier=Math.min(4,1+Math.floor(run.combo/6));run.score+=points*multiplier;return multiplier}
function spawnPacketWave(run){
 if(run.gate)return;
 const w=run.waves++,lane=(w+Math.floor(w/4)+run.index)%3,missing=run.verified.findIndex(v=>!v),bot=(w+run.index)%5;
 const add=(kind,lane,index,label,y=-.14,high=false)=>{const entity={kind,lane,index,label,y,high};if(kind==='wall'){entity.length=2.6;entity.label=PACKET_ATTACKS[Math.floor(w/2)%PACKET_ATTACKS.length]}run.entities.push(entity)};
 let free=(lane+2)%3;
 if(w%4===1&&missing>=0){add('check',lane,missing,PACKET_STAGES[run.index].checks[missing]);add('bot',(lane+1)%3,bot,PACKET_BOTS[bot][0])}
 else if(w%4===2){
  const overhead=w%8===6;add(overhead?'overhead':'barrier',lane,0,overhead?'MFA CODE THEFT':PACKET_MAIL[Math.floor(w/4)%3]);add('wall',(lane+1)%3,0,'FAKE LOGIN');
  // The low barrier has an optional jump arc. The third lane stays fully clear.
  if(!overhead)for(let i=0;i<3;i++)add('byte',lane,0,'DATA',-.10-i*.07,true);
 }
 else if(w%4===3){const trap=Math.floor(w/4)%3;add('trap',lane,trap,PACKET_TRAPS[trap][0]);add('wall',(lane+1)%3,0,'FAKE LOGIN')}
 else {add('wall',lane,0,'FAKE LOGIN');add('barrier',(lane+1)%3,0,PACKET_MAIL[Math.floor(w/4)%3])}
 // Each wave has a clear coin trail. Compact cyber attacks leave time to
 // read the next threat and change lanes after its full depth has passed.
 for(let i=0;i<5;i++)add('byte',free,0,'DATA',-.14-i*.08);
}
function advancePacketRun(run,seconds){
 if(run.complete||run.failed||!Number.isFinite(seconds)||seconds<=0)return [];
 const dt=Math.min(seconds,.12),events=[];
 run.elapsed+=dt;run.waveClock+=dt;run.slideTime=Math.max(0,run.slideTime-dt);run.invulnerable=Math.max(0,run.invulnerable-dt);run.pulse=Math.max(0,run.pulse-dt);
 run.visualLane+=(run.lane-run.visualLane)*(1-Math.exp(-dt*18));
 if(run.jumpTime>0){run.jumpTime+=dt;if(run.jumpTime>=PACKET_JUMP_SECONDS){run.jumpTime=0;run.jumpHeight=0}else run.jumpHeight=Math.sin(Math.PI*run.jumpTime/PACKET_JUMP_SECONDS)}
 if(run.waveClock>=PACKET_WAVE_SECONDS){run.waveClock=0;spawnPacketWave(run)}
 const speed=PACKET_RUN_SPEED;
 run.distance=(run.distance||0)+dt*speed*52;
 for(const entity of run.entities){
  entity.y+=dt*(entity.kind==='gate'?.38:speed);
  if(entity.kind==='wall'){
   // Solid cyber attacks occupy the lane until their back edge passes.
   // Sideways entry still collides, but jumping never bypasses a tall threat.
   entity.passed=entity.y>.83+(entity.length||10)/52;
   if(entity.passed){entity.resolved=true;continue}
   if(entity.y<.83||entity.hit||entity.lane!==run.lane||run.invulnerable>0)continue;
   entity.hit=true;
  }else{
   if(entity.resolved||entity.y<.83)continue;
   entity.resolved=true;entity.passed=true;
  }
  if(entity.kind==='gate'){run.complete=true;events.push({type:'complete'});break}
  if(entity.lane!==run.lane)continue;
  if(entity.kind==='check'){
   entity.collected=true;
   if(!run.verified[entity.index]){run.verified[entity.index]=true;run.score+=60;run.shield=Math.min(3,run.shield+1);run.pulse=1;events.push({type:'check',index:entity.index,label:entity.label});if(run.verified.every(Boolean)){run.guard=1;events.push({type:'trust'})}}
  }else if(entity.kind==='byte'){
   if(!entity.high||run.jumpHeight>.48){entity.collected=true;run.bytes++;const multiplier=packetCombo(run,2);events.push({type:'byte',lane:entity.lane,multiplier});if(run.bytes>=PACKET_STAGES[run.index].coinGoal)break}
  }else if(entity.kind==='overhead'&&run.slideTime>0){run.cleared++;const multiplier=packetCombo(run,15);events.push({type:'slide',lane:entity.lane,multiplier,label:entity.label})}
  else if((entity.kind==='bot'||entity.kind==='barrier')&&run.jumpHeight>.5){run.cleared++;const multiplier=packetCombo(run,10);events.push({type:'jump',lane:entity.lane,multiplier,label:entity.label})}
  else if(run.invulnerable===0){
   run.invulnerable=1.35;run.combo=0;
   if(run.guard){run.guard=0;run.pulse=1;events.push({type:'guard'})}
   else {run.hits++;run.shield--;run.score=Math.max(0,run.score-20);run.failed=run.shield===0;events.push({type:'hit',kind:entity.kind,label:entity.label});if(run.failed){events.push({type:'failed'});break}}
  }
 }
 // The final coin ends the challenge immediately; the short gate animation is the finish.
 if(!run.failed&&!run.gate&&run.bytes>=PACKET_STAGES[run.index].coinGoal){run.gate=true;run.entities=[{kind:'gate',lane:-1,y:.1,label:'DELIVERY COMPLETE'}];events.push({type:'gate'})}
 run.entities=run.entities.filter(o=>o.y<(o.kind==='wall'?.83+(o.length||10)/52+.28:1.16));
 return events;
}

function packetRescue(el,ctx,finish){
 let run=newPacketRun(0),mode='brief',raf=0,last=0,surface,g,width=0,height=0,pointer=null,disposed=false,observer=null,city=null,sceneId=0;
 let particles=[],notice='COLLECT 15 COINS · JUMP PHISHING MAIL · DODGE VIRUSES & GIANT EMAILS',noticeUntil=0,hudKey='';
 const active=()=>!disposed&&el.isConnected!==false;
 const now=()=>performance.now();
 const clock=on=>{if(typeof dailyActive!=='undefined'){dailyActive=on;dailyLast=Date.now()}};
 const stage=()=>PACKET_STAGES[run.index];
 function halt(){if(raf)cancelAnimationFrame(raf);raf=0;clock(false)}
 function dispose(){halt();sceneId++;city?.dispose();city=null;disposed=true;observer?.disconnect();window.removeEventListener('resize',resize);document.removeEventListener('visibilitychange',visibility);el.onclick=el.onkeydown=el.onpointerdown=el.onpointerup=el.onpointercancel=null}
 function message(text){notice=text;noticeUntil=now()+2600;const node=el.querySelector('[data-runner-status]');if(node)node.textContent=text}
 function scene(){
  mode='brief';city?.dispose();city=null;const thisScene=++sceneId;
  el.innerHTML=`<section class="attack-lab pr-shell pr-v2 pr-neon pr-quick" aria-labelledby="pr-title" style="--route-accent:${stage().accent}">
   <div class="pr-topline"><span>TRUSTED ROUTES <i>/</i> PACKET RESCUE</span><span>GATE 01 / 02</span></div>
   <div class="pr-heading"><div><p class="attack-type">${stage().zone}</p><h2 id="pr-title">PACKET <em>RESCUE</em><small>A QUICK RUN. A SAFER INBOX.</small></h2></div><div class="pr-clock"><b data-runner-clock>0 / ${stage().coinGoal}</b><small>COINS TO FINISH</small></div></div>
   <div class="pr-checks" aria-label="Optional verification bonuses">${stage().checks.map((c,i)=>`<span data-runner-check="${i}"><b>◇</b>${c}</span>`).join('')}</div>
   <div class="pr-track-wrap"><canvas class="pr-canvas" width="960" height="620" tabindex="0" role="img" aria-label="Byte's three-lane runner. Left and right change lanes. Space or up arrow jumps. Down arrow slides. Swipe sideways to steer, up to jump, down to slide."></canvas>
    <div class="pr-live"><div><span>PACKET INTEGRITY</span><b data-runner-shield>♥ ♥ ♥</b></div><div class="pr-combo"><b data-runner-combo>1×</b><span data-runner-bytes>0 COINS</span></div><button type="button" data-runner-pause aria-label="Pause Packet Rescue">Ⅱ</button></div>
    <div class="pr-threat-caption" data-runner-threat hidden role="status" aria-live="polite" aria-atomic="true"><span data-threat-action></span><strong data-threat-label></strong><small data-threat-tip></small></div>
    <div class="pr-distance"><i data-runner-distance></i></div><div class="pr-game-status" data-runner-status role="status">${notice}</div><div class="pr-overlay" data-runner-overlay></div>
   </div>
   <div class="pr-bottom"><div class="pr-direction"><button type="button" data-steer="left" aria-label="Move left">← <span>LEFT</span></button><button type="button" data-runner-jump class="pr-jump" aria-label="Jump">↑ <span>JUMP</span><kbd>SPACE</kbd></button><button type="button" data-steer="right" aria-label="Move right"><span>RIGHT</span> →</button><button type="button" data-runner-slide class="pr-slide" aria-label="Slide">↓ <span>SLIDE</span></button></div><small>← → STEER · ↑ JUMP · ↓ SLIDE<br>ON PHONE: SWIPE OR USE BUTTONS</small></div>
  </section>`;
  surface=el.querySelector('canvas');g=surface.getContext('2d');hudKey='';resize();bind();updateHud();brief();
  loadCity(thisScene);
 }
 async function loadCity(id){
  if(typeof document.createElement!=='function')return;
  try{
   const module=await import('./packet-city.mjs?v=ac58c2a2bf');
   if(!active()||id!==sceneId||mode==='result')return;
   const next=surface.cloneNode(false),view=module.createPacketCity(next);
   const focused=document.activeElement===surface;surface.replaceWith(next);surface=next;city=view;
   surface.addEventListener('webglcontextlost',()=>{if(active()&&city===view&&mode==='running')pause()});
   resize();if(focused)surface.focus({preventScroll:true});
  }catch(error){if(active()&&id===sceneId)console.warn('Packet Rescue is using its canvas renderer.',error)}
 }
 function brief(){
  mode='brief';halt();el.querySelector('.pr-shell')?.classList.toggle('pr-intro-active',true);const overlay=el.querySelector('[data-runner-overlay]');overlay.hidden=false;
  overlay.innerHTML=`<div class="pr-intro-layout"><div class="pr-brief"><div class="pr-brief-tag">NEON TRANSIT · GATE 01</div><h3>RUN THE CITY.<br><em>OUTSMART THE SCAM.</em></h3><p>${stage().request}</p><div class="pr-rules"><span><b>↑</b><strong>JUMP</strong><small>Leap over small scam emails</small></span><span><b>↔</b><strong>DODGE</strong><small>Dodge giant emails & viruses</small></span><span><b>↓</b><strong>SLIDE</strong><small>Duck under MFA-code traps</small></span></div></div><div class="pr-brief pr-intro-footer"><button class="btn attack-next pr-start" type="button" data-runner-start>LET’S PLAY →</button><small class="pr-brief-note">Relaxed speed · 15 coins = finish · Gold checks = bonus protection · Next: Message Patrol</small></div></div>`;
 }
 function begin(){if(!active()||!['brief','paused'].includes(mode))return;mode='running';el.querySelector('.pr-shell')?.classList.toggle('pr-intro-active',false);el.querySelector('[data-runner-overlay]').hidden=true;last=now();clock(true);surface.focus({preventScroll:true});raf=requestAnimationFrame(tick)}
 function pause(){if(mode!=='running')return;mode='paused';halt();const overlay=el.querySelector('[data-runner-overlay]');overlay.hidden=false;overlay.innerHTML='<div class="pr-brief pr-pause-card"><div class="pr-brief-tag">PACKET ON HOLD</div><h3>Take a breath.</h3><p>Your route is waiting right here.</p><button class="btn attack-next" type="button" data-runner-start>RESUME RUN →</button></div>'}
 function visibility(){if(!active()){dispose();return}if(document.hidden)pause()}
 function resize(){if(!surface||!g||mode==='result')return;const r=surface.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,2);width=Math.max(1,r.width);height=Math.max(1,r.height);if(city){city.resize(width,height);city.render(run);return}surface.width=Math.round(width*dpr);surface.height=Math.round(height*dpr);g.setTransform(dpr,0,0,dpr,0,0);draw()}
 function project(lane,depth){const d=Math.max(0,depth),p=Math.pow(d/.83,1.65);return {x:width/2+(lane-1)*width*(.055+.235*p),y:height*.17+height*.67*p,s:.17+.83*p}}
 function box(x,y,w,h,r,fill,stroke){g.beginPath();g.roundRect(x,y,w,h,r);if(fill){g.fillStyle=fill;g.fill()}if(stroke){g.strokeStyle=stroke;g.stroke()}}
 function line(points,color,weight=2){g.beginPath();points.forEach((p,i)=>i?g.lineTo(...p):g.moveTo(...p));g.strokeStyle=color;g.lineWidth=weight;g.stroke()}
 function text(value,x,y,size,color='#fff',weight=700){g.fillStyle=color;g.font=`${weight} ${size}px 'Rajdhani',Arial,sans-serif`;g.textAlign='center';g.fillText(value,x,y)}
 function world(){
  const W=width,H=height,t=run.elapsed,m=stage(),horizon=H*.17;
  const sky=g.createLinearGradient(0,0,0,H);sky.addColorStop(0,'#061326');sky.addColorStop(.5,m.sky);sky.addColorStop(1,'#07121e');g.fillStyle=sky;g.fillRect(0,0,W,H);
  g.save();g.globalAlpha=.15;g.fillStyle=m.accent;g.beginPath();g.arc(W*.5,horizon,Math.min(W*.24,H*.25),0,Math.PI*2);g.fill();g.restore();
  // Distinct server skylines pass on both sides of the suspended cable.
  for(let side of [-1,1])for(let i=0;i<9;i++){
   const d=((i/9+t*.055)%1),p=d*d,bw=W*(.025+.09*p),bh=H*(.06+.32*p),x=W/2+side*W*(.15+.45*p),y=horizon+H*.85*p;
   g.globalAlpha=.35+.5*d;box(x-bw/2,y-bh,bw,bh,3,m.building);g.fillStyle='#030e20';g.fillRect(x-bw/2+3,y-bh+4,bw*.17,bh-4);
   for(let row=0;row<5;row++){g.fillStyle=row%2?m.accent:'#8eabbf';g.globalAlpha=.15+.45*d;g.fillRect(x-bw*.2,y-bh+bh*(.15+row*.15),bw*.5,Math.max(1,2*p))}
  }g.globalAlpha=1;
  // Network cable lanes use the same projection as collision objects.
  g.beginPath();g.moveTo(W*.40,horizon);g.lineTo(W*.60,horizon);g.lineTo(W*1.04,H);g.lineTo(-W*.04,H);g.closePath();g.fillStyle='#122a3e';g.fill();
  for(let lane=0;lane<3;lane++){const top=project(lane,0),bottom=project(lane,1);g.lineWidth=W*.035;g.strokeStyle='#ffffff04';line([[top.x,top.y],[bottom.x,bottom.y]],'#ffffff04',W*.035)}
  for(const lane of [-.5,.5,1.5,2.5]){const a=project(lane,0),b=project(lane,1.05);line([[a.x,a.y],[b.x,b.y]],lane===-.5||lane===2.5?m.accent:'#82b4c34a',lane===-.5||lane===2.5?3:1)}
  for(let k=0;k<18;k++){const d=(k/18+t*PACKET_RUN_SPEED)%1,a=project(-.5,d),b=project(2.5,d);line([[a.x,a.y],[b.x,b.y]],'#80c7dc22',1+2*d)}
  const gx=W*.5,gy=horizon-8,gs=Math.min(W*.08,54);g.save();g.shadowBlur=16;g.shadowColor=m.accent;
  for(let i=0;i<3;i++){const a=(i*2*Math.PI/3)-Math.PI*.5;g.beginPath();g.arc(gx,gy,gs,a,a+1.75);g.lineWidth=5;g.strokeStyle=run.verified[i]?'#f6ce82':'#405e74';g.stroke()}g.restore();text('FINISH GATE',gx,gy+4,Math.max(8,gs*.22),'#c8e8f5');
  if(run.gate){g.save();g.globalAlpha=.12+.07*Math.sin(t*8);g.fillStyle='#a1ffd7';g.fillRect(0,0,W,H);g.restore()}
 }
 function item(o){
  const p=project(o.lane,o.y),size=Math.min(90,width*.16)*p.s,x=p.x,y=p.y;
  g.save();g.translate(x,y);g.lineWidth=2;
  if(o.kind==='gate'){
   g.translate(width/2-x,0);g.shadowColor='#8cffc7';g.shadowBlur=28;box(-width*.41,-height*.3*p.s,width*.82,height*.3*p.s,14,'#3df2a41a','#8cffc7');text('DELIVERY COMPLETE',0,-height*.17*p.s,Math.max(15,30*p.s),'#defff1');text('DELIVER THE PACKET',0,-height*.11*p.s,Math.max(10,15*p.s),'#8cffc7');g.restore();return
  }
  if(o.kind==='byte'){
   const lift=o.high?size*1.25:0;g.translate(0,-size*.45-lift);g.rotate(run.elapsed*2);g.fillStyle='#c8f8ff';g.shadowColor=stage().accent;g.shadowBlur=12;g.fillRect(-size*.11,-size*.11,size*.22,size*.22);g.strokeStyle=stage().accent;g.strokeRect(-size*.18,-size*.18,size*.36,size*.36);g.restore();return
  }
  g.fillStyle='#0005';g.beginPath();g.ellipse(0,2,size*.58,size*.12,0,0,Math.PI*2);g.fill();
  if(o.kind==='check'){
   const bob=Math.sin(run.elapsed*3+o.index)*size*.06;g.translate(0,-size*.55+bob);g.shadowColor='#f8c971';g.shadowBlur=15;
   g.beginPath();g.moveTo(0,-size*.52);g.lineTo(size*.44,-size*.33);g.lineTo(size*.35,size*.18);g.lineTo(0,size*.46);g.lineTo(-size*.35,size*.18);g.lineTo(-size*.44,-size*.33);g.closePath();g.fillStyle='#cd9844';g.fill();g.strokeStyle='#ffe6aa';g.stroke();text('✓',0,size*.13,size*.58,'#fff8da');g.shadowBlur=0;
  }else if(o.kind==='bot'){
   g.translate(0,-size*.47);const type=o.index%5;g.shadowColor='#f06b80';g.shadowBlur=8;
   box(-size*.44,-size*.4,size*.88,size*.7,size*.14,'#793f59','#f29ca9');box(-size*.36,-size*.32,size*.72,size*.33,size*.07,'#25182e');
   line([[-size*.27,-size*.25],[-size*.08,-size*.17]],'#ffcb9b',3);line([[size*.27,-size*.25],[size*.08,-size*.17]],'#ffcb9b',3);
   g.shadowBlur=0;line([[-size*.15,size*.03],[0,-size*.02],[size*.15,size*.03]],'#ffc8cc',2);
   if(type===0){line([[-size*.37,-size*.44],[0,-size*.65],[size*.37,-size*.44]],'#fbb4c3',3)}
   if(type===1){line([[-size*.3,-size*.43],[-size*.38,-size*.7],[-size*.08,-size*.55],[0,-size*.78],[size*.13,-size*.55],[size*.37,-size*.7],[size*.29,-size*.43]],'#f8c373',3)}
   if(type===2){g.beginPath();g.arc(0,-size*.58,size*.18,0,Math.PI*2);g.strokeStyle='#f4c276';g.stroke();line([[0,-size*.7],[0,-size*.58],[size*.1,-size*.53]],'#f4c276',2)}
   if(type===3){box(-size*.23,-size*.68,size*.46,size*.23,4,'#d49ec0');text('···',0,-size*.48,size*.26,'#482c49')}
   if(type===4){for(let a=0;a<3;a++)for(let b=0;b<3;b++)if((a+b)%2===0)g.fillRect((a-1)*size*.14-size*.05,-size*.72+b*size*.11,size*.1,size*.1)}
   for(let foot of [-1,1]){box(foot*size*.28-size*.14,size*.24,size*.28,size*.16,4,'#3e233a','#bd708f')}
  }else if(o.kind==='barrier'){
   box(-size*.57,-size*.68,size*1.14,size*.55,4,'#eee8ef','#ff7aa8');line([[-size*.54,-size*.64],[0,-size*.3],[size*.54,-size*.64]],'#c24b80',3);text('!',0,-size*.22,size*.24,'#a52d61');line([[-size*.5,-size*.18],[-size*.5,0]],'#d7a473',5);line([[size*.5,-size*.18],[size*.5,0]],'#d7a473',5);text('↑ JUMP',0,-size*.8,Math.max(9,size*.2),'#ffe0a8');
  }else if(o.kind==='overhead'){
   box(-size*.55,-size*1.65,size*1.1,size*.8,6,'#271c43','#ff83bf');line([[-size*.56,-size*1.65],[-size*.56,0]],'#87c4d1',4);line([[size*.56,-size*1.65],[size*.56,0]],'#87c4d1',4);text('↓ SLIDE',0,-size*1.2,Math.max(10,size*.22),'#ffb2d3');
  }else if(o.kind==='wall'){
   if(o.label==='VIRUS'||o.label==='RANSOMWARE'){
    const purple=o.label==='RANSOMWARE',color=purple?'#9874d9':'#e36b8c';
    for(let i=0;i<10;i++){const a=i*Math.PI/5;line([[Math.cos(a)*size*.45,-size*.8+Math.sin(a)*size*.55],[Math.cos(a)*size*.65,-size*.8+Math.sin(a)*size*.75]],color,size*.1)}
    g.beginPath();g.ellipse(0,-size*.8,size*.5,size*.64,0,0,Math.PI*2);g.fillStyle=color;g.fill();
    box(-size*.36,-size*1.1,size*.72,size*.39,8,'#202c48');line([[-size*.27,-size*1.02],[-size*.1,-size*.94]],'#ffe0a8',4);line([[size*.27,-size*1.02],[size*.1,-size*.94]],'#ffe0a8',4);text(purple?'LOCKED':'× × ×',0,-size*.42,size*.18,'#fff0cb');
   }else if(o.label==='PHISHING MAIL'){
    box(-size*.53,-size*1.55,size*1.06,size*1.5,8,'#eee8ef','#ff7aa8');line([[-size*.5,-size*1.48],[0,-size*.8],[size*.5,-size*1.48]],'#bd305c',4);line([[-size*.5,-size*.13],[0,-size*.83],[size*.5,-size*.13]],'#bd305c',2);box(-size*.17,-size*.98,size*.34,size*.4,5,'#bd305c');text('!',0,-size*.66,size*.32,'#fff0cb');
   }else{
    box(-size*.5,-size*1.55,size,size*1.55,8,'#321b37','#e27ca1');box(-size*.38,-size*1.4,size*.76,size*1.23,5,'#202c48','#ff9cbd');for(let i=0;i<2;i++)box(-size*.3,-size*1.19+i*size*.36,size*.6,size*.22,3,'#46789c');text('LOGIN',0,-size*.3,size*.19,'#ffc6d8');
   }
   text('← DODGE →',0,-size*1.75,Math.max(10,size*.21),'#ffe0a8');
  }else{
   g.translate(0,-size*.62);g.rotate(Math.sin(run.elapsed*2)*.08);g.beginPath();g.moveTo(0,-size*.46);g.lineTo(size*.46,0);g.lineTo(0,size*.46);g.lineTo(-size*.46,0);g.closePath();g.fillStyle='#b8648d';g.fill();g.strokeStyle='#ffd0e1';g.stroke();text('↗',0,size*.13,size*.55,'#fff');
  }
  g.restore();if(o.y>.12){const label=o.label,fs=Math.max(9,Math.min(14,size*.2));g.font=`700 ${fs}px 'Rajdhani',Arial,sans-serif`;const lw=Math.min(width*.29,g.measureText(label).width+14);box(x-lw/2,y+8,lw,19,5,'#071527e8');text(label,x,y+21,fs,o.kind==='check'?'#ffe1a1':'#ffc5d5')}
 }
 function courier(){
  const p=project(run.visualLane,.83),size=Math.min(78,width*.17),lift=run.jumpHeight*size*1.7,t=run.elapsed,bob=run.jumpTime?0:Math.sin(t*17)*size*.035,lean=(run.lane-run.visualLane)*.32;
  g.save();g.translate(p.x,p.y);g.fillStyle='#0007';g.beginPath();g.ellipse(0,7,size*(.43-run.jumpHeight*.13),size*.11,0,0,Math.PI*2);g.fill();
  if(run.guard||run.pulse>0){g.strokeStyle=run.guard?'#f7d086':'#8ff7d0';g.lineWidth=2;g.globalAlpha=.6;g.beginPath();g.ellipse(0,-size*.58-lift,size*.68,size*.91,0,0,Math.PI*2);g.stroke();g.globalAlpha=1}
  g.translate(0,-lift+bob);if(run.slideTime>0)g.scale(1.2,.48);g.rotate(lean);if(run.invulnerable>0)g.globalAlpha=.55+.45*Math.abs(Math.sin(t*19));
  // Backpack = the protected packet. Byte runs on articulated legs, rather than flying.
  box(-size*.33,-size*.96,size*.66,size*.58,size*.13,'#d6a44e','#ffe0a2');
  const stride=run.jumpTime?-.55:Math.sin(t*17)*.65;
  for(let side of [-1,1]){g.save();g.translate(side*size*.17,-size*.35);g.rotate(side*stride);line([[0,0],[side*size*.08,size*.17],[side*size*.04,size*.31]],'#91c7d7',size*.13);box(-size*.12,size*.24,size*.29,size*.13,4,'#e0f4f2','#73bbd4');g.restore()}
  box(-size*.27,-size*.94,size*.54,size*.62,size*.12,'#e7f0e8','#6dafbf');box(-size*.2,-size*.79,size*.4,size*.28,5,'#173b53');text('✓',0,-size*.57,size*.23,'#f2ce84');
  for(let side of [-1,1]){g.save();g.translate(side*size*.3,-size*.81);g.rotate(run.jumpTime?side*-.95:side*-stride*.7);line([[0,0],[side*size*.09,size*.2],[side*size*.03,size*.28]],'#c7dedc',size*.1);box(side*size*.03-size*.07,size*.23,size*.14,size*.14,4,'#edbc6d');g.restore()}
  // Amber scarf and a bright visor give the courier its own identity.
  g.fillStyle='#edb558';g.beginPath();g.moveTo(-size*.21,-size*.98);g.lineTo(-size*.68,-size*.83+Math.sin(t*12)*size*.08);g.lineTo(-size*.51,-size*1.06);g.closePath();g.fill();
  box(-size*.33,-size*1.48,size*.66,size*.55,size*.16,'#eaf3ec','#82b4c4');box(-size*.27,-size*1.35,size*.54,size*.23,size*.08,'#132e45');
  for(let side of [-1,1])box(side*size*.13-size*.065,-size*1.29,size*.13,size*.065,3,'#77e6ed');
  line([[0,-size*1.49],[size*.04,-size*1.63]],'#83bdcb',3);g.fillStyle='#f1c86d';g.beginPath();g.arc(size*.04,-size*1.66,size*.055,0,Math.PI*2);g.fill();g.restore();
 }
 function burst(lane,color){const p=project(lane,.83);for(let i=0;i<12;i++){const angle=i*Math.PI/6;particles.push({x:p.x,y:p.y-height*.09,vx:Math.cos(angle)*80,vy:Math.sin(angle)*90-40,life:.55,color})}}
 function draw(){if(city){city.render(run);return}if(!g)return;world();for(const o of run.entities.filter(o=>!o.resolved&&o.y>-.12).sort((a,b)=>a.y-b.y))item(o);courier();for(const p of particles){g.globalAlpha=p.life/.55;g.fillStyle=p.color;g.fillRect(p.x,p.y,4,4)}g.globalAlpha=1}
 function updateHud(){
  // Screen-space text stays readable above either renderer, even behind a jumping courier.
  const caption=packetThreatCaption(run),panel=el.querySelector('[data-runner-threat]');
  panel.hidden=!caption||mode!=='running';
  if(caption){for(const [field,value] of Object.entries(caption)){const node=panel.querySelector(`[data-threat-${field}]`);if(node.textContent!==value)node.textContent=value}}
  const key=[Math.floor(run.elapsed),run.shield,run.bytes,run.combo,...run.verified].join(':');if(key===hudKey)return;hudKey=key;
  el.querySelector('[data-runner-clock]').textContent=run.gate?'GO':Math.min(run.bytes,stage().coinGoal)+' / '+stage().coinGoal;
  el.querySelector('.pr-clock small').textContent=run.gate?'FINISH OPEN':'COINS TO FINISH';
  el.querySelector('[data-runner-shield]').textContent='♥ '.repeat(run.shield)+'♡ '.repeat(3-run.shield);
  el.querySelector('[data-runner-bytes]').textContent=run.bytes+' COINS';el.querySelector('[data-runner-combo]').textContent=Math.min(4,1+Math.floor(run.combo/6))+'×';
  el.querySelector('[data-runner-distance]').style.width=Math.min(100,run.bytes/stage().coinGoal*100)+'%';
  run.verified.forEach((done,i)=>{const chip=el.querySelector(`[data-runner-check="${i}"]`);chip.classList.toggle('collected',done);chip.querySelector('b').textContent=done?'✓':'◇'});
  if(now()>noticeUntil){const copy=run.gate?'15 COINS! DELIVERY COMPLETE → NEXT: MESSAGE PATROL':run.verified.every(Boolean)?'BONUS SHIELD READY · KEEP COLLECTING COINS':'COINS = FINISH · GOLD CHECKS = BONUS · JUMP THE PHISHING MAIL';el.querySelector('[data-runner-status]').textContent=copy}

 }
 function result(success){
  mode='result';halt();sceneId++;city?.dispose();city=null;const stars=run.hits===0?3:run.hits<3?2:1;
  if(success)ctx.add(run.score+100+run.shield*20,'packet delivered');
  if(!active())return;
  el.innerHTML=`<section class="attack-lab pr-result pr-v2"><p class="attack-type">${stage().zone} / ${success?'DELIVERY COMPLETE':'PACKET INTERCEPTED'}</p><div class="pr-result-stars">${success?'★'.repeat(stars)+'☆'.repeat(3-stars):'↻'}</div><h2>${success?'Special delivery.':'Byte needs a reboot.'}</h2><p>${success?stage().lesson:'Three hits stopped this delivery. Jump phishing emails, slide under code-theft traps, and dodge giant emails, viruses and fake logins. Collect 15 coins to reach Message Patrol.'}</p><div class="pr-result-stats"><span><b>${run.bytes}</b>COINS</span><span><b>${run.cleared}</b>CLEAN MOVES</span><span><b>${run.bestCombo}</b>BEST STREAK</span></div><button class="btn attack-next" type="button" data-runner-next>${success?'START MESSAGE PATROL →':'RETRY THIS RESCUE →'}</button></section>`;
  el.onclick=e=>{if(!e.target.closest('[data-runner-next]'))return;el.onclick=null;if(success){dispose();clock(true);finish();return}run=newPacketRun(0);particles=[];notice='COLLECT 15 COINS · JUMP PHISHING MAIL · DODGE VIRUSES & GIANT EMAILS';scene()};el.onkeydown=el.onpointerdown=el.onpointerup=el.onpointercancel=null;
 }
 function tick(timestamp){
  if(!active()){dispose();return}if(mode!=='running')return;
  const dt=Math.min(.06,(timestamp-last)/1000||0);last=timestamp;
  const events=advancePacketRun(run,dt);
  for(const e of events){
   if(e.type==='check'){SFX.ok();burst(run.lane,'#ffd580');message('✓ '+e.label+' SECURED · +60')}
   else if(e.type==='trust'){message('ALL CHECKS SECURED! TRUST SHIELD ACTIVATED')}
   else if(e.type==='slide'){burst(e.lane,'#f68ed1');message('CODE THEFT AVOIDED · Never share an MFA code.')}
   else if(e.type==='jump'){burst(e.lane,stage().accent);message(e.label+' AVOIDED · '+packetSafetyTip(e.label))}
   else if(e.type==='byte'){burst(e.lane,stage().accent)}
   else if(e.type==='guard'){SFX.ok();message('TRUST SHIELD BLOCKED THAT SCAM!')}
   else if(e.type==='hit'){SFX.bad();message(e.label+' · '+packetSafetyTip(e.label))}
   else if(e.type==='gate'){SFX.ok();message('15 COINS COLLECTED! NEXT STOP: MESSAGE PATROL')}
   else if(e.type==='complete'){SFX.ok();result(true);return}
   else if(e.type==='failed'){result(false);return}
  }
  particles=particles.filter(p=>{p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;return p.life>0});updateHud();draw();raf=requestAnimationFrame(tick)
 }
 function steer(lane){if(mode==='running'&&active())steerPacket(run,lane)}
 function leap(){if(mode==='running'&&active())jumpPacket(run)}
 function duck(){if(mode==='running'&&active())slidePacket(run)}
 function bind(){
  el.onclick=e=>{const t=e.target;if(t.closest('[data-runner-start]')){begin();return}if(t.closest('[data-runner-pause]')){pause();return}if(t.closest('[data-runner-jump]')){leap();return}if(t.closest('[data-runner-slide]')){duck();return}const button=t.closest('[data-steer]');if(button)steer(run.lane+(button.dataset.steer==='left'?-1:1))};
  el.onkeydown=e=>{if(!active())return;if(['ArrowLeft','a','A','ArrowRight','d','D','ArrowUp','w','W','ArrowDown','s','S',' '].includes(e.key)){if(e.target.tagName==='BUTTON'&&e.key===' ')return;e.preventDefault();if(['ArrowDown','s','S'].includes(e.key)){if(!e.repeat)duck()}else if(['ArrowUp','w','W',' '].includes(e.key)){if(!e.repeat)leap()}else steer(run.lane+(['ArrowLeft','a','A'].includes(e.key)?-1:1))}else if(e.key==='p'||e.key==='P'){e.preventDefault();mode==='running'?pause():mode==='paused'&&begin()}};
  el.onpointerdown=e=>{if(e.target===surface&&mode==='running'){pointer={x:e.clientX,y:e.clientY};surface.setPointerCapture?.(e.pointerId)}};
  el.onpointerup=e=>{if(!pointer)return;const dx=e.clientX-pointer.x,dy=e.clientY-pointer.y;pointer=null;if(dy>28&&Math.abs(dy)>Math.abs(dx)){duck();return}if(dy<-28&&Math.abs(dy)>Math.abs(dx)){leap();return}if(Math.abs(dx)>28&&Math.abs(dx)>Math.abs(dy)){steer(run.lane+(dx<0?-1:1));return}if(Math.abs(dx)<20&&Math.abs(dy)<20){const r=surface.getBoundingClientRect();steer(Math.max(0,Math.min(2,Math.floor((e.clientX-r.left)/r.width*3))))}};
  el.onpointercancel=()=>{pointer=null}
 }
 window.addEventListener('resize',resize);document.addEventListener('visibilitychange',visibility);
 if(typeof MutationObserver!=='undefined'){observer=new MutationObserver(()=>{if(!active())dispose()});observer.observe(el.closest('#app')||el.parentNode,{childList:true,subtree:true})}
 scene();return {dispose};
}

/* Trust Chase: a second gate in Trusted Routes. Model is independent of the canvas. */
const PHISH_MAZE_MAP=[
 '###############',
 '#S....#....1..#',
 '#.##..#..##...#',
 '#o...........o#',
 '#.##.#.#.##.#.#',
 '#....#.#....#.#',
 '###..#...#..#.#',
 '#2...#.#.#...E#',
 '#.##...#...##.#',
 '#....#...#.4..#',
 '#.##.#.#.#.##.#',
 '#o...#.#.....o#',
 '#.#..#...##.#.#',
 '#...3.........#',
 '###############'
];
const MAZE_CHECKS=[
 {name:'EXACT DOMAIN',icon:'1',tip:'Check the exact website address. A familiar logo alone proves nothing.',title:'Stop the phishing trap',practice:'Open your saved company portal instead of a surprise link. Avoid unexpected attachments and downloads.'},
 {name:'KNOWN IT CONTACT',icon:'2',tip:'Contact IT using the company directory, not the number in a surprise message.',title:'Keep viruses out',practice:'Keep your device and security software updated. If you suspect an infection, stop using the suspicious file and report it to IT promptly.'},
 {name:'SELF-STARTED MFA',icon:'3',tip:'Approve only sign-ins you started. Never share your one-time code.',title:'Protect your accounts',practice:'Use a unique password for each account, keep it in a password manager, and turn on multi-factor authentication.'},
 {name:'SAFE DOWNLOADS',icon:'4',tip:'Install apps and updates only from approved stores or your company IT portal.',title:'Block malicious downloads',practice:'Avoid cracked software and unexpected attachments. If a download looks suspicious, stop and ask IT before opening it.'}
];
const MAZE_DIRS={up:[0,-1],right:[1,0],down:[0,1],left:[-1,0]};
const MAZE_BOT_HOMES=[[7,3],[11,7],[9,13]];
const MAZE_PLAYER_STEP=.18,MAZE_BOT_STEP=.43;
function mazeOpen(x,y){return !!PHISH_MAZE_MAP[y]?.[x]&&PHISH_MAZE_MAP[y][x]!=='#'}
function mazeKey(x,y){return x+','+y}
// Interpolate each straight corridor segment; never ease diagonally through a corner.
// Simulation time also freezes these animations when the game is paused.
function mazePosition(actor,time){
 const m=actor.motion;if(!m||m.x!==actor.x||m.y!==actor.y)return {x:actor.x,y:actor.y};
 const p=Math.max(0,Math.min(1,(time-m.start)/m.duration));
 return {x:m.fromX+(m.x-m.fromX)*p,y:m.fromY+(m.y-m.fromY)*p};
}
function mazeMove(actor,x,y,start,duration){
 actor.motion={fromX:actor.x,fromY:actor.y,x,y,start,duration};actor.x=x;actor.y=y;
}
function newPhishMaze(){
 const dots=new Set(),powers=new Set();
 PHISH_MAZE_MAP.forEach((row,y)=>[...row].forEach((c,x)=>{if(c==='.')dots.add(mazeKey(x,y));if(c==='o')powers.add(mazeKey(x,y))}));
 return {x:1,y:1,dir:'right',wanted:'right',moving:false,elapsed:0,playerTick:0,botTick:0,dots,powers,verified:MAZE_CHECKS.map(()=>false),hearts:3,shield:0,invulnerable:2,score:0,bytes:0,tags:0,complete:false,failed:false,bots:MAZE_BOT_HOMES.map(([x,y],i)=>({x,y,homeX:x,homeY:y,id:i,sleep:3+i}))};
}
function steerPhishMaze(run,dir){if(MAZE_DIRS[dir]&&!run.complete&&!run.failed){run.wanted=dir;run.moving=true}}
function mazeDistances(x,y){
 const queue=[[x,y]],dist=new Map([[mazeKey(x,y),0]]);
 for(let i=0;i<queue.length;i++){const [cx,cy]=queue[i];for(const [dx,dy] of Object.values(MAZE_DIRS)){const nx=cx+dx,ny=cy+dy,k=mazeKey(nx,ny);if(mazeOpen(nx,ny)&&!dist.has(k)){dist.set(k,dist.get(mazeKey(cx,cy))+1);queue.push([nx,ny])}}}
 return dist;
}
function mazeContact(run,events){
 for(const bot of run.bots){
  if(bot.sleep>0||bot.x!==run.x||bot.y!==run.y)continue;
  if(run.shield>0){bot.x=bot.homeX;bot.y=bot.homeY;bot.motion=null;bot.sleep=5;run.score+=40;run.tags++;events.push({type:'tag'});continue}
  if(run.invulnerable>0)continue;
  run.hearts--;run.invulnerable=2.5;run.x=1;run.y=1;run.motion=null;run.moving=false;run.playerTick=0;
  run.bots.forEach(b=>{b.x=b.homeX;b.y=b.homeY;b.motion=null;b.sleep=2});
  events.push({type:'hit'});if(run.hearts===0){run.failed=true;events.push({type:'failed'})}break;
 }
}
function advancePhishMaze(run,seconds){
 if(run.complete||run.failed||!Number.isFinite(seconds)||seconds<=0)return [];
 const dt=Math.min(.1,seconds),events=[];
 run.elapsed+=dt;run.playerTick+=dt;run.botTick+=dt;run.shield=Math.max(0,run.shield-dt);run.invulnerable=Math.max(0,run.invulnerable-dt);
 run.bots.forEach(b=>b.sleep=Math.max(0,b.sleep-dt));
 mazeContact(run,events);if(run.failed)return events;
 if(run.playerTick+1e-9>=MAZE_PLAYER_STEP){
  run.playerTick=Math.max(0,run.playerTick-MAZE_PLAYER_STEP);
  const can=dir=>{const [dx,dy]=MAZE_DIRS[dir];return mazeOpen(run.x+dx,run.y+dy)};
  if(run.moving&&can(run.wanted))run.dir=run.wanted;
  if(run.moving&&can(run.dir)){const [dx,dy]=MAZE_DIRS[run.dir];mazeMove(run,run.x+dx,run.y+dy,run.elapsed-run.playerTick,MAZE_PLAYER_STEP)}
  const key=mazeKey(run.x,run.y),cell=PHISH_MAZE_MAP[run.y][run.x];
  if(run.dots.delete(key)){run.score+=2;run.bytes++;events.push({type:'byte'})}
  if(run.powers.delete(key)){run.shield=7;events.push({type:'shield'})}
  // Stop this simulation step at a new target so the safety card opens before enemies move.
  if(/^[1-4]$/.test(cell)&&!run.verified[Number(cell)-1]){const i=Number(cell)-1;run.verified[i]=true;run.score+=60;run.motion=null;events.push({type:'check',index:i});return events}
  mazeContact(run,events);
  if(!run.failed&&PHISH_MAZE_MAP[run.y][run.x]==='E'){
   if(run.verified.every(Boolean)){run.complete=true;events.push({type:'complete'});return events}
   if(run.moving)events.push({type:'locked'});run.moving=false;
  }
 }
 if(!run.failed&&run.botTick+1e-9>=MAZE_BOT_STEP){
  run.botTick=Math.max(0,run.botTick-MAZE_BOT_STEP);
  for(const bot of run.bots){
   if(bot.sleep>0)continue;
   // Bots chase, anticipate a turn, or intercept near the exit. Shield turns the chase around.
   const [dx,dy]=MAZE_DIRS[run.dir],ahead=bot.id===1&&mazeOpen(run.x+dx*2,run.y+dy*2);
   const target=bot.id===2&&run.verified.filter(Boolean).length<2?[11,7]:ahead?[run.x+dx*2,run.y+dy*2]:[run.x,run.y];
   const dist=mazeDistances(...target);
   const choices=Object.values(MAZE_DIRS).map(([a,b])=>[bot.x+a,bot.y+b]).filter(([x,y])=>mazeOpen(x,y));
   choices.sort((a,b)=>((dist.get(mazeKey(...a))??999)-(dist.get(mazeKey(...b))??999))*(run.shield>0?-1:1));
   if(choices.length)mazeMove(bot,...choices[0],run.elapsed-run.botTick,MAZE_BOT_STEP);mazeContact(run,events);if(run.failed)break;
  }
 }
 return events;
}

function phishMaze(el,ctx,finish){
 let run=newPhishMaze(),mode='brief',raf=0,last=0,canvas,g,size=0,board=null,observer=null,disposed=false,pointer=null,noticeUntil=0,hudKey='',bursts=[];
 const reducedMotion=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
 const active=()=>!disposed&&el.isConnected!==false;
 const clock=on=>{if(typeof dailyActive!=='undefined'){dailyActive=on;dailyLast=Date.now()}};
 function halt(){cancelAnimationFrame(raf);raf=0;clock(false)}
 function dispose(){if(disposed)return;halt();disposed=true;observer?.disconnect();window.removeEventListener('resize',resize);document.removeEventListener('visibilitychange',visibility);el.onclick=el.onkeydown=el.onpointerdown=el.onpointerup=el.onpointercancel=null}
 function status(copy){const node=el.querySelector('[data-maze-status]');if(node)node.textContent=copy;noticeUntil=performance.now()+4200}
 function scene(){
  mode='brief';halt();hudKey='';bursts=[];
  el.innerHTML=`<section class="attack-lab pm-shell" aria-labelledby="pm-title"><div class="pm-topline"><span>TRUSTED ROUTES / PHISH MAZE</span><b>GATE 02 / 02</b></div><div class="pm-heading"><div><p class="attack-type">THE VERIFICATION ARCADE</p><h2 id="pm-title">PHISH <em>MAZE</em><small>CHASE THE KEYS. OUTSMART THE VIRUSES.</small></h2></div><div class="pm-gate-badge"><span>✓</span>GATE 01<br>SECURED</div></div><div class="pm-layout"><div class="pm-arena"><div class="pm-hud"><span><small>INTEGRITY</small><b data-maze-hearts>♥ ♥ ♥</b></span><span><small>SCORE</small><b data-maze-score>00000</b></span><span class="pm-bits"><small>BITS</small><b data-maze-bytes>0</b></span><button type="button" data-maze-pause aria-label="Pause maze">Ⅱ</button></div><canvas class="pm-canvas" tabindex="0" role="img" aria-label="Phish Maze. Use arrow keys, WASD, swipe, or direction buttons. Collect the four numbered gold checks and reach the exit on the right. Guide the gold-helmeted defender. Avoid viruses; mint shields give temporary protection."></canvas><div class="pm-overlay" data-maze-overlay></div><div class="pm-status" data-maze-status role="status">Collect 1, 2, 3 and 4. Then find the trusted exit →</div></div><aside class="pm-sidebar"><div class="pm-mission"><p class="attack-type">YOUR EXIT KEYS</p><h3>Verify. Then enter.</h3><p>A surprise payroll link brought you here. Build a trusted route back.</p><div class="pm-checks">${MAZE_CHECKS.map((c,i)=>`<div data-maze-check="${i}"><b>${i+1}</b><span>${c.name}<small>Find the gold beacon</small></span></div>`).join('')}</div></div><div class="pm-legend"><span><i class="pm-dot"></i>Data bits <small>Bonus points</small></span><span><i class="pm-power">✦</i>Trust shield <small>7 sec · Tag viruses for a bonus</small></span><span><i class="pm-bot">!</i>Viruses <small>Spiked threats · Avoid contact</small></span></div><div class="pm-controls"><button type="button" data-maze-dir="up" aria-label="Move up">↑</button><button type="button" data-maze-dir="left" aria-label="Move left">←</button><button type="button" data-maze-dir="down" aria-label="Move down">↓</button><button type="button" data-maze-dir="right" aria-label="Move right">→</button></div><small class="pm-control-note">ARROWS / WASD · SWIPE TO TURN<br>Keep moving. Queue your next turn early.</small></aside></div></section>`;
  canvas=el.querySelector('canvas');g=canvas.getContext('2d');resize();bind();overlay(false);hud();
 }
 function overlay(paused){const node=el.querySelector('[data-maze-overlay]');node.hidden=false;node.innerHTML=`<div class="pm-brief"><div class="pm-brief-icon">${paused?'Ⅱ':'◕'}</div><p class="attack-type">${paused?'ROUTE PAUSED':'GATE 01 CLEAR · NEW CHALLENGE'}</p><h3>${paused?'Your packet is safe.':'READY,<br>PLAYER ONE?'}</h3><p>${paused?'Take a breath. Continue when you’re ready.':'Guide your <strong>cyber defender</strong>. Dodge the viruses.<br>Collect <strong>4 gold targets</strong> and learn a safety tip at each.<br>Mint shields let you chase back!'}</p><button class="btn attack-next" type="button" data-maze-start>${paused?'RESUME CHASE →':'START CHASE →'}</button><small>${paused?'Your daily play clock is paused.':'Arrows / WASD · Swipe · On-screen controls'}</small></div>`}
 function showSafetyTip(index){
  mode='lesson';halt();pointer=null;const check=MAZE_CHECKS[index],node=el.querySelector('[data-maze-overlay]');
  node.hidden=false;node.classList.add('pm-tip-overlay');
  node.innerHTML=`<div class="pm-safety-tip" role="dialog" aria-modal="true" aria-labelledby="maze-tip-title" aria-describedby="maze-tip-copy"><span class="pm-tip-badge">✓ TARGET ${index+1} SECURED · +60 PTS</span><h3 id="maze-tip-title">${esc(check.title)}</h3><div id="maze-tip-copy"><p>${esc(check.tip)}</p><p>${esc(check.practice)}</p></div><small>The maze is paused. Take a moment to learn.</small><button type="button" class="btn attack-next" data-maze-continue>${run.verified.every(Boolean)?'FIND THE EXIT →':'CONTINUE CHASE →'}</button></div>`;
  el.querySelector('.pm-sidebar').inert=true;el.querySelector('.pm-hud').inert=true;canvas.inert=true;
  node.querySelector('[data-maze-continue]').focus({preventScroll:true});
 }
 function begin(){if(!active()||!['brief','paused','lesson'].includes(mode))return;mode='running';const overlay=el.querySelector('[data-maze-overlay]');overlay.hidden=true;overlay.classList.remove('pm-tip-overlay');el.querySelector('.pm-sidebar').inert=false;el.querySelector('.pm-hud').inert=false;canvas.inert=false;clock(true);canvas.focus({preventScroll:true});last=performance.now();raf=requestAnimationFrame(tick)}
 function pause(){if(mode!=='running')return;mode='paused';halt();overlay(true)}
 function visibility(){if(!active()){dispose();return}if(document.hidden)pause()}
 function resize(){
  if(!active()||mode==='result'||!canvas)return;
  size=Math.max(1,canvas.getBoundingClientRect().width);const dpr=Math.min(window.devicePixelRatio||1,2);
  canvas.width=canvas.height=Math.round(size*dpr);g.setTransform(dpr,0,0,dpr,0,0);
  // Cache the neon walls: only characters and pickups need repainting each frame.
  board=document.createElement?.('canvas')||null;
  if(board){board.width=canvas.width;board.height=canvas.height;const bg=board.getContext('2d');bg.setTransform(dpr,0,0,dpr,0,0);paintBoard(bg)}
  draw();
 }
 function paintBoard(bg){
  const cell=size/15;bg.fillStyle='#090c23';bg.fillRect(0,0,size,size);
  PHISH_MAZE_MAP.forEach((row,y)=>[...row].forEach((c,x)=>{
   const left=x*cell,top=y*cell;
   if(c!=='#'){
    bg.fillStyle=(x+y)%2?'#11152e':'#10132b';bg.fillRect(left,top,cell,cell);return;
   }
   const color=y<5?'#55dff7':y<10?'#a592ff':'#ff77bc';
   bg.fillStyle=y<5?'#133149':y<10?'#242249':'#39203f';bg.fillRect(left,top,cell,cell);
   bg.beginPath();const inset=cell*.12;
   // Only outline exposed edges, forming continuous arcade corridors.
   if(mazeOpen(x,y-1)){bg.moveTo(left,top+inset);bg.lineTo(left+cell,top+inset)}
   if(mazeOpen(x,y+1)){bg.moveTo(left,top+cell-inset);bg.lineTo(left+cell,top+cell-inset)}
   if(mazeOpen(x-1,y)){bg.moveTo(left+inset,top);bg.lineTo(left+inset,top+cell)}
   if(mazeOpen(x+1,y)){bg.moveTo(left+cell-inset,top);bg.lineTo(left+cell-inset,top+cell)}
   bg.strokeStyle=color;bg.lineWidth=Math.max(1.3,cell*.065);bg.lineCap='round';bg.shadowColor=color;bg.shadowBlur=5;bg.stroke();bg.shadowBlur=0;
   // Tiny circuit inlays keep large wall blocks from becoming flat slabs.
   bg.fillStyle=color+'30';bg.fillRect(left+cell*.43,top+cell*.43,cell*.14,cell*.14);
  }));
  bg.strokeStyle='#8498e04d';bg.lineWidth=2;bg.strokeRect(1,1,size-2,size-2);
 }
 function draw(){
  const cell=size/15,t=run.elapsed,decor=reducedMotion?0:t;
  g.clearRect(0,0,size,size);if(board)g.drawImage(board,0,0,size,size);else paintBoard(g);
  function circle(x,y,r,color){g.beginPath();g.arc(x,y,r,0,Math.PI*2);g.fillStyle=color;g.fill()}
  function label(text,x,y,color,font=.38){g.font='800 '+cell*font+'px "JetBrains Mono",monospace';g.textAlign='center';g.textBaseline='middle';g.fillStyle=color;g.fillText(text,x,y)}
  PHISH_MAZE_MAP.forEach((row,y)=>[...row].forEach((c,x)=>{
   const cx=(x+.5)*cell,cy=(y+.5)*cell;
   if(run.dots.has(mazeKey(x,y))){g.fillStyle='#ffe9a0';g.fillRect(cx-cell*.07,cy-cell*.07,cell*.14,cell*.14)}
   if(run.powers.has(mazeKey(x,y))){
    const pulse=1+.08*Math.sin(decor*4);circle(cx,cy,cell*.36*pulse,'#63ffd521');circle(cx,cy,cell*.24,'#71ffd4');
    g.strokeStyle='#c2ffed';g.lineWidth=1;g.stroke();label('✦',cx,cy,'#133c41',.39);
   }
   if(/^[1-4]$/.test(c)&&!run.verified[Number(c)-1]){
    g.save();g.translate(cx,cy);g.shadowColor='#ffcb55';g.shadowBlur=10;
    g.fillStyle='#ffd565';g.strokeStyle='#fff1b3';g.lineWidth=cell*.045;
    g.beginPath();g.roundRect(-cell*.33,-cell*.33,cell*.66,cell*.66,cell*.1);g.fill();g.stroke();g.shadowBlur=0;
    label(c,0,0,'#372543',.5);g.restore();
   }
   if(c==='E'){
    const open=run.verified.every(Boolean);g.fillStyle=open?'#74ffd4':'#292d53';g.strokeStyle=open?'#d5fff3':'#6d71a4';g.lineWidth=cell*.045;
    g.beginPath();g.roundRect(x*cell+cell*.05,y*cell+cell*.05,cell*.9,cell*.9,cell*.12);g.fill();g.stroke();
    label(open?'→':'×',cx,cy,open?'#163a42':'#c2c5e9',.65);
   }
  }));
  run.bots.forEach(bot=>{
   const pos=mazePosition(bot,t),x=(pos.x+.5)*cell,y=(pos.y+.5)*cell,colors=['#ff5d93','#bb93ff','#ff995b'];
   const scared=run.shield>0,color=scared?'#649dff':colors[bot.id];
   g.save();g.globalAlpha=bot.sleep>0?.38:1;g.translate(x,y);
   g.shadowColor=color;g.shadowBlur=bot.sleep>0?0:7;g.fillStyle=color;
   // Spiked virus silhouettes remain recognizable at small mobile cell sizes.
   g.strokeStyle=color;g.lineWidth=cell*.075;g.lineCap='round';
   for(let i=0;i<8+bot.id;i++){const a=i*Math.PI*2/(8+bot.id)+Math.sin(decor*2+bot.id)*.08;g.beginPath();g.moveTo(Math.cos(a)*cell*.23,Math.sin(a)*cell*.23);g.lineTo(Math.cos(a)*cell*.4,Math.sin(a)*cell*.4);g.stroke();circle(Math.cos(a)*cell*.4,Math.sin(a)*cell*.4,cell*.055,color)}
   circle(0,0,cell*.3,color);g.shadowBlur=0;circle(-cell*.13,-cell*.15,cell*.06,'#ffffff65');circle(cell*.14,cell*.15,cell*.045,'#17214055');
   circle(-cell*.11,-cell*.025,cell*.065,'#172140');circle(cell*.11,-cell*.025,cell*.065,'#172140');
   g.strokeStyle='#172140';g.lineWidth=cell*.045;g.beginPath();
   if(scared){g.arc(0,cell*.16,cell*.075,Math.PI,Math.PI*2)}else{g.moveTo(-cell*.19,-cell*.14);g.lineTo(-cell*.055,-cell*.08);g.moveTo(cell*.19,-cell*.14);g.lineTo(cell*.055,-cell*.08);g.moveTo(-cell*.1,cell*.13);g.lineTo(cell*.1,cell*.13)}g.stroke();g.restore();
  });
  const pos=mazePosition(run,t),px=(pos.x+.5)*cell,py=(pos.y+.5)*cell;
  g.save();g.translate(px,py);if(run.invulnerable>0)g.globalAlpha=reducedMotion?.8:.65+.35*Math.abs(Math.sin(t*9));
  if(run.shield>0){g.strokeStyle='#78ffda';g.lineWidth=cell*.065;g.beginPath();g.arc(0,0,cell*.46,0,Math.PI*2);g.stroke()}
  // A gold-helmeted cyber defender with a visor, boots and shield chest badge.
  const walking=run.motion&&t-run.motion.start<MAZE_PLAYER_STEP,stride=walking?Math.sin(decor*22)*cell*.035:0;
  g.shadowColor='#ffd359';g.shadowBlur=7;
  g.fillStyle='#ffdc64';g.beginPath();g.roundRect(-cell*.25,-cell*.36,cell*.5,cell*.35,cell*.12);g.fill();g.shadowBlur=0;
  g.fillStyle='#132840';g.beginPath();g.roundRect(-cell*.2,-cell*.27,cell*.4,cell*.14,cell*.045);g.fill();
  const [lookX,lookY]=MAZE_DIRS[run.dir];circle(lookX*cell*.09,-cell*.2+lookY*cell*.025,cell*.045,'#8cfff0');
  g.fillStyle='#e8f4ff';g.beginPath();g.roundRect(-cell*.2,0,cell*.4,cell*.26,cell*.065);g.fill();
  g.fillStyle='#ffdc64';g.fillRect(-cell*.31,cell*.015+stride,cell*.09,cell*.19);g.fillRect(cell*.22,cell*.015-stride,cell*.09,cell*.19);
  g.fillStyle='#75d9ef';g.fillRect(-cell*.18,cell*.25+stride,cell*.14,cell*.12);g.fillRect(cell*.04,cell*.25-stride,cell*.14,cell*.12);
  g.fillStyle='#17666f';g.beginPath();g.moveTo(-cell*.1,cell*.065);g.lineTo(cell*.1,cell*.065);g.lineTo(cell*.08,cell*.17);g.lineTo(0,cell*.22);g.lineTo(-cell*.08,cell*.17);g.closePath();g.fill();g.restore();
  bursts=bursts.filter(b=>t-b.start<.55);
  if(!reducedMotion)bursts.forEach(b=>{
   const p=(t-b.start)/.55;g.save();g.globalAlpha=1-p;g.strokeStyle=b.color;g.lineWidth=2;g.beginPath();g.arc((b.x+.5)*cell,(b.y+.5)*cell,cell*(.3+p*.7),0,Math.PI*2);g.stroke();
   for(let i=0;i<6;i++){const a=i*Math.PI/3;g.fillStyle=b.color;g.fillRect((b.x+.5+Math.cos(a)*p)*cell,(b.y+.5+Math.sin(a)*p)*cell,cell*.08,cell*.08)}g.restore();
  });
 }
 function hud(){
  const key=[run.hearts,run.score,run.bytes,...run.verified,Math.ceil(run.shield),performance.now()>noticeUntil].join(':');
  if(key===hudKey)return;hudKey=key;
  el.querySelector('[data-maze-score]').textContent=String(run.score).padStart(5,'0');
  el.querySelector('[data-maze-hearts]').textContent='♥ '.repeat(run.hearts)+'♡ '.repeat(3-run.hearts);el.querySelector('[data-maze-bytes]').textContent=run.bytes;
  run.verified.forEach((done,i)=>{const node=el.querySelector(`[data-maze-check="${i}"]`);node.classList.toggle('collected',done);node.querySelector('b').textContent=done?'✓':i+1;node.querySelector('small').textContent=done?'Verified · key secured':'Find the gold beacon'});
  if(performance.now()>noticeUntil)el.querySelector('[data-maze-status]').textContent=run.shield>0?`TRUST SHIELD · ${Math.ceil(run.shield)}s · Chase the viruses!`:run.verified.every(Boolean)?'ALL KEYS SECURED · REACH THE EXIT ON THE RIGHT →':'Collect the gold checks · Mint shields protect you';
 }
 function result(success){
  mode='result';halt();if(success)ctx.add(run.score+100+run.hearts*20,'phish maze verified');if(!active())return;
  el.innerHTML=`<section class="attack-lab pr-result pm-result"><p class="attack-type">GATE 02 / ${success?'NETWORK VERIFIED':'PACKET INTERCEPTED'}</p><div class="pr-result-stars">${success?'★'.repeat(run.hearts)+'☆'.repeat(3-run.hearts):'↻'}</div><h2>${success?'Two gates. One safe packet.':'Another route awaits.'}</h2><p>${success?'You escaped the fake payroll link. Use the exact domain, a known IT contact and MFA you started to keep real work safe.':'The viruses caught your packet. Take a different turn, grab a mint shield, and try again.'}</p><div class="pr-result-stats"><span><b>${run.bytes}</b>DATA BITS</span><span><b>${run.tags}</b>VIRUSES TAGGED</span><span><b>${Math.floor(run.elapsed)}s</b>CHASE TIME</span></div><button type="button" class="btn attack-next" data-maze-next>${success?'OPEN PHISH OR LEGIT INBOX →':'RETRY THE MAZE →'}</button></section>`;
  el.onkeydown=el.onpointerdown=el.onpointerup=el.onpointercancel=null;
  el.onclick=e=>{if(!e.target.closest('[data-maze-next]'))return;el.onclick=null;if(success){dispose();clock(true);finish()}else{run=newPhishMaze();scene()}};
 }
 function tick(time){
  if(!active()){dispose();return}if(mode!=='running')return;const dt=Math.max(0,Math.min(.06,(time-last)/1000));last=time;
  let collectedTarget=null;
  for(const event of advancePhishMaze(run,dt)){
   if(['check','shield','tag'].includes(event.type))bursts.push({x:run.x,y:run.y,start:run.elapsed,color:event.type==='check'?'#ffdc64':'#78ffda'});
   if(event.type==='check'){SFX.ok();status('✓ '+MAZE_CHECKS[event.index].tip);collectedTarget=event.index}
   if(event.type==='shield'){SFX.ok();status('TRUST SHIELD! You can tag viruses for 7 seconds.')}
   if(event.type==='tag'){SFX.ok();status('VIRUS QUARANTINED · +40')}
   if(event.type==='hit'){SFX.bad();status('VIRUS HIT · Your keys are safe. Choose a direction to restart.')}
   if(event.type==='locked')status('EXIT LOCKED · Find all 4 gold verification checks first.');
   if(event.type==='complete'){SFX.ok();result(true);return}if(event.type==='failed'){result(false);return}
  }
  hud();draw();if(collectedTarget!==null){showSafetyTip(collectedTarget);return}raf=requestAnimationFrame(tick);
 }
 function steer(dir){if(mode==='running'&&active())steerPhishMaze(run,dir)}
 function bind(){
  el.onclick=e=>{if(e.target.closest('[data-maze-start],[data-maze-continue]')){begin();return}if(e.target.closest('[data-maze-pause]')){pause();return}const button=e.target.closest('[data-maze-dir]');if(button)steer(button.dataset.mazeDir)};
  el.onkeydown=e=>{if(mode==='lesson'){if(e.key==='Tab'){e.preventDefault();el.querySelector('[data-maze-continue]').focus()}else if(e.key==='Escape'){e.preventDefault();begin()}else if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key))e.preventDefault();return}const dir={ArrowUp:'up',w:'up',W:'up',ArrowDown:'down',s:'down',S:'down',ArrowLeft:'left',a:'left',A:'left',ArrowRight:'right',d:'right',D:'right'}[e.key];if(dir){e.preventDefault();steer(dir)}else if(e.key.toLowerCase()==='p'){e.preventDefault();mode==='running'?pause():mode==='paused'&&begin()}};
  el.onpointerdown=e=>{if(e.target===canvas&&mode==='running'){pointer={x:e.clientX,y:e.clientY};canvas.setPointerCapture?.(e.pointerId)}};
  el.onpointerup=e=>{if(!pointer)return;const dx=e.clientX-pointer.x,dy=e.clientY-pointer.y;pointer=null;if(Math.max(Math.abs(dx),Math.abs(dy))<15)return;steer(Math.abs(dx)>Math.abs(dy)?dx>0?'right':'left':dy>0?'down':'up')};el.onpointercancel=()=>{pointer=null};
 }
 window.addEventListener('resize',resize);document.addEventListener('visibilitychange',visibility);
 if(typeof MutationObserver!=='undefined'){observer=new MutationObserver(()=>{if(!active())dispose()});observer.observe(el.closest('#app')||el.parentNode,{childList:true,subtree:true})}
 scene();return {dispose};
}

/* Level 2 arcade: inspect, swipe, steer. The quiz follows the inbox. */
const PHISH_PATROL=[
 {channel:'SMS',from:'Parcel desk',body:'Work parcel on hold. Pay ₹20 at iv-parcel.help using your work login.',risk:true,why:'Delivery payments do not need your work password.'},
 {channel:'WORK CHAT',from:'Project teammate',body:'Our 3 PM review is confirmed. The agenda is in our usual project folder.',risk:false,why:'Expected meeting, familiar workspace, no new link.'},
 {channel:'PROJECT CHAT',from:'“Project lead” · external account',body:'Alex, upload the Atlas customer list to my personal drive. Need it now!',risk:true,why:'Knowing a project name does not authorise a data request.'},
 {channel:'QR POSTER',from:'Printer sticker',body:'Scan to unlock printing. Enter your work password before 5 PM.',risk:true,why:'A sticker can hide a fake login. Verify with IT.'},
 {channel:'IT BULLETIN',from:'Security team',body:'Reminder: never share MFA codes. Review your account through your saved portal.',risk:false,why:'Use the portal you already trust.'},
 {channel:'OFFICE NOTICE',from:'Facilities',body:'Scheduled fire drill at 11 AM tomorrow. Lock your screen before leaving.',risk:false,why:'Routine notice; no money, passwords or downloads requested.'},
 {channel:'SMS',from:'“Director” · unknown number',body:'In a meeting. Buy gift cards and text me the codes. Keep this private.',risk:true,why:'Secrecy and gift-card codes are impersonation clues.'},
 {channel:'VOICE TRANSCRIPT',from:'“IT support”',body:'Read me the six-digit code on your phone so I can fix your account.',risk:true,why:'Never read an MFA code to a caller.'}
];
function phishCampaign(el,ctx){return phishLevelModules(el,ctx)}

function phishMiniGames(el,ctx,options={}){
 let game=options.start||0,card=0,answer=null,feedback='',streak=0,bestStreak=0,patrolHits=0,points=0,finished=false,swipeStart=null,autoTimer=null,manual=false;
 const found=new Set(),decoys=new Set();
 const clues={
  domain:{risk:true,label:'Look-alike domain',why:'Wrong destination: innovatiview-login.co is not innovatiview.com.'},
  code:{risk:true,label:'Code sent to a person',why:'Never send your MFA code to a support agent.'},
  urgent:{risk:true,label:'Lockout pressure',why:'The deadline is bait. Open the real portal yourself.'},
  logo:{risk:false,why:'Logos can be copied. Look for evidence in the address and request.'},
  help:{risk:false,why:'A help label is not evidence. Inspect the address, code request and deadline.'}
 };
 const alive=()=>!finished&&el.isConnected!==false;
 function award(n,label){points=Math.max(0,points+n);ctx.add(n,label)}
 function clearAdvance(){if(autoTimer!==null){clearTimeout(autoTimer);autoTimer=null}}
 const names=['Link detective','Packet rescue','Message patrol','Phish maze'];
 function frame(content){const step=game===1?2:0;return `<section class="attack-lab pa-arena" aria-labelledby="pa-title"><div class="attack-lab-top"><span class="attack-kicker">PHISHING ARCADE</span><span class="pa-score">✦ ${points} <small>PTS</small></span></div><div class="pa-track">${names.map((n,i)=>`<span class="${i<step?'done':i===step?'active':''}">${i<step?'✓':String(i+1).padStart(2,'0')} ${n}</span>`).join('')}</div>${content}</section>`}
 const note=()=>`<div class="pa-feedback pa-live-feedback" role="status">${feedback||'Scan carefully. Every clue counts.'}</div>`;
 function draw(focus){
  if(game===0){
   const hit=id=>found.has(id)?'found':decoys.has(id)?'checked':'';
   const disabled=id=>found.has(id)||decoys.has(id)?'disabled':'';
   el.innerHTML=frame(`<div class="pa-heading"><div><p class="attack-type">DETECTIVE MODE / CASE 01</p><h2 id="pa-title">Something feels off.</h2><p>Tap 3 suspicious details. No real credentials needed.</p></div><strong class="pa-counter">${found.size}<small> / 3 evidence</small></strong></div><div class="ld-workstation"><div class="ld-window-tabs"><span class="ld-traffic" aria-hidden="true">● ● ●</span><span>▣ &nbsp; Workspace · Sign in <i>×</i></span><b>＋</b><em>SIMULATION</em></div><div class="ld-toolbar"><span aria-hidden="true">← &nbsp; → &nbsp; ↻</span><button class="pa-hotspot ld-url ${hit('domain')}" data-clue="domain" ${disabled('domain')} aria-label="Inspect website address">${found.has('domain')?'⚑':'◈'} &nbsp; innovatiview-login.co<span>/workspace/verify</span></button><span aria-hidden="true">⋮</span></div><div class="ld-page"><aside class="ld-brand-panel"><span class="ld-wordmark">▣ INNOVATIVIEW</span><div class="ld-orbit" aria-hidden="true"><span>◈</span><i></i><b>+</b><em>●</em></div><h3>Your work.<br>One workspace.</h3><p>Connect. Collaborate. Create.</p><small>Workspace identity services</small></aside><div class="ld-login"><button class="pa-hotspot ld-login-brand ${hit('logo')}" data-clue="logo" ${disabled('logo')}>▣ &nbsp; Workspace</button><h3>Welcome back</h3><p class="ld-login-sub">Continue to your employee account</p><div class="ld-field"><small>Work email</small><span>employee@innovatiview.com</span><b>✎</b></div><div class="ld-field"><small>Password</small><span class="ld-password">••••••••••••</span><b>◉</b></div><button class="pa-hotspot ld-code ${hit('code')}" data-clue="code" ${disabled('code')}><span>Verification code ${found.has('code')?'⚑':''}</span><div aria-hidden="true"><i>0</i><i>0</i><i>0</i><i>0</i><i>0</i><i>0</i></div><small>Your support agent will receive this MFA code.</small></button><button class="pa-hotspot ld-urgency ${hit('urgent')}" data-clue="urgent" ${disabled('urgent')}><span>◷</span><div>Session expires in <b>10:00</b><small>Verify now to prevent account lockout.</small></div>${found.has('urgent')?'⚑':''}</button><div class="ld-signin" aria-hidden="true">Continue securely &nbsp; →</div><button class="pa-hotspot ld-help ${hit('help')}" data-clue="help" ${disabled('help')}>Having trouble signing in?</button><small class="ld-simulation">Training screen · nothing is submitted</small></div></div><div class="ld-evidence">${['domain','code','urgent'].map((id,i)=>`<span class="${found.has(id)?'collected':''}"><b>${found.has(id)?'✓':'0'+(i+1)}</b>${found.has(id)?clues[id].label:'Evidence unknown'}</span>`).join('')}</div>${found.size===3?'<div class="ld-sealed"><b>✓ SITE QUARANTINED</b><span>Credentials protected. Nice detective work.</span></div>':''}</div>${note()}${found.size===3?'<button class="btn attack-next" data-game-next>CASE CLOSED · PACKET RESCUE →</button>':''}`);
  }else if(game===1){
   if(card===PHISH_PATROL.length){el.innerHTML=frame(`<div class="pa-round-clear"><span>✦</span><p class="attack-type">PATROL COMPLETE</p><h2 id="pa-title">Inbox defended.</h2><div><b>${patrolHits} / ${PHISH_PATROL.length}<small>CORRECT CALLS</small></b><b>${bestStreak}×<small>BEST STREAK</small></b></div><button class="btn attack-next" data-game-next>ENTER THE PHISH MAZE →</button></div>`)}else{
    const m=PHISH_PATROL[card],judged=answer!==null,correct=answer===m.risk;
    el.innerHTML=frame(`<div class="pa-heading"><div><p class="attack-type">FLICK / SORT / PROTECT</p><h2 id="pa-title">Clear the signal.</h2><p>← Report suspicious &nbsp; · &nbsp; Keep expected →</p></div><strong class="pa-counter">${card+1}<small> / ${PHISH_PATROL.length}</small></strong></div><div class="mp-hud"><span>⚡ ${streak}<small>STREAK</small></span><div class="mp-meter"><i style="width:${card/PHISH_PATROL.length*100}%"></i></div><button data-pace aria-pressed="${manual}">${manual?'▶ Auto deal':'Ⅱ Review pace'}</button></div><div class="mp-arena"><div class="mp-lane report"><b>⌫</b><span>QUARANTINE</span><small>← LEFT</small></div><div class="mp-deck"><div class="mp-ghost"></div><article class="mp-card ${judged?'mp-fling-'+(answer?'left':'right'):''}" data-swipe-card tabindex="0" aria-label="Message. Swipe or press left to report, right to keep."><div class="mp-card-top"><span>${m.channel}</span><span>● ● ●</span></div><div class="mp-avatar" aria-hidden="true">${m.channel==='QR POSTER'?'▦':m.channel==='VOICE TRANSCRIPT'?'☎':'✉'}</div><h3>${m.from}</h3><p>${m.body}</p><div class="mp-card-bottom"><span>INCOMING TRANSMISSION</span><b>↔</b></div></article><div class="mp-verdict ${judged?'show':''}" role="status"><b>${judged?(correct?'NICE CATCH!':'MISSED SIGNAL'):''}</b><span>${judged?m.why:''}</span><small>${judged?(m.risk?'SCAM → QUARANTINE':'EXPECTED → TRUSTED'):''}</small></div></div><div class="mp-lane keep"><b>◈</b><span>TRUSTED</span><small>RIGHT →</small></div></div><div class="mp-controls"><button data-message="report" ${judged?'disabled':''}>⌫ &nbsp; REPORT</button><span>DRAG / SWIPE / ← →</span><button data-message="keep" ${judged?'disabled':''}>KEEP &nbsp; ◈</button></div>${judged&&manual?'<button class="btn attack-next" data-message-next>DEAL NEXT SIGNAL →</button>':''}`);
   }
  }
  if(focus)el.querySelector?.(focus)?.focus({preventScroll:true});
 }
 function nextMessage(){clearAdvance();if(!alive()||game!==1||answer===null||card>=PHISH_PATROL.length)return;card++;answer=null;swipeStart=null;draw(card===PHISH_PATROL.length?'[data-game-next]':'[data-swipe-card]')}
 function schedule(){clearAdvance();if(!manual)autoTimer=setTimeout(()=>{autoTimer=null;nextMessage()},1700)}
 function judge(risk){if(!alive()||game!==1||answer!==null||card>=PHISH_PATROL.length)return;answer=risk;const correct=risk===PHISH_PATROL[card].risk;streak=correct?streak+1:0;bestStreak=Math.max(bestStreak,streak);if(correct)patrolHits++;award(correct?50+10*Math.min(streak-1,3):-10,correct?'signal secured':'signal missed');SFX[correct?'ok':'bad']();draw(manual?'[data-message-next]':null);schedule()}
 el.onclick=e=>{
  if(!alive())return;
  const t=e.target,clue=t.closest('[data-clue]'),message=t.closest('[data-message]');
  if(game===0&&clue){const id=clue.dataset.clue,c=clues[id];if(!c||found.has(id)||decoys.has(id))return;feedback=c.why;if(c.risk){found.add(id);award(50,'evidence secured');SFX.ok()}else{decoys.add(id);award(-10,'keep scanning');SFX.bad()}draw(found.size===3?'[data-game-next]':'[data-clue]:not(:disabled)');return}
  if(game===1&&message)return judge(message.dataset.message==='report');
  if(game===1&&t.closest('[data-pace]')){manual=!manual;if(manual)clearAdvance();else if(answer!==null)schedule();draw('[data-pace]');return}
  if(game===1&&t.closest('[data-message-next]'))return nextMessage();
  if(t.closest('[data-game-next]')){if(game===0&&found.size===3){if(options.finish){dispose();options.finish();return}dispose();packetRescue(el,ctx,()=>phishMiniGames(el,ctx,{start:1}));el.scrollIntoView?.({block:'start'})}else if(game===1&&card===PHISH_PATROL.length){finished=true;clearAdvance();el.onclick=el.onkeydown=el.onpointerdown=el.onpointermove=el.onpointerup=el.onpointercancel=null;if(options.finish){options.finish();return}phishMaze(el,ctx,()=>phish(el,ctx));el.scrollIntoView?.({block:'start'})}}
 };
 el.onkeydown=e=>{if(game===1&&e.target.closest('[data-swipe-card]')&&(e.key==='ArrowLeft'||e.key==='ArrowRight')){e.preventDefault();judge(e.key==='ArrowLeft')}};
 el.onpointerdown=e=>{const target=e.target.closest('[data-swipe-card]');if(game===1&&answer===null&&target){swipeStart={x:e.clientX,y:e.clientY,target};target.setPointerCapture?.(e.pointerId)}};
 el.onpointermove=e=>{if(!swipeStart||answer!==null)return;const dx=e.clientX-swipeStart.x;swipeStart.target.style.transform=`translateX(${Math.max(-145,Math.min(145,dx))}px) rotate(${dx/20}deg)`};
 el.onpointerup=e=>{if(!swipeStart)return;const {x,y,target}=swipeStart,dx=e.clientX-x,dy=e.clientY-y;swipeStart=null;target.style.transform='';if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.5)judge(dx<0)};
 el.onpointercancel=()=>{if(swipeStart)swipeStart.target.style.transform='';swipeStart=null};
 function dispose(){finished=true;clearAdvance();el.onclick=el.onkeydown=el.onpointerdown=el.onpointermove=el.onpointerup=el.onpointercancel=null}
 draw();return {dispose};
}

/* One navigation session per level attempt. Replays never award points twice. */
let activeMiniLevel=null;
function miniGameLevel(el,ctx,modules,options={}){
 let host=el,child=null,control=null,generation=0,current=-1;
 const completed=new Set(modules.flatMap((m,i)=>m.complete?[i]:[]));
 const level=typeof S!=='undefined'?S.cur:options.level;
 const clock=on=>{if(typeof dailyActive!=='undefined'){dailyActive=on;dailyLast=Date.now()}};
 function stop(){generation++;control?.dispose?.();control=null;child?.remove();child=null;clock(false);if(typeof leaveFirewallScreen==='function')leaveFirewallScreen()}
 function connected(){return host.isConnected!==false}
 const unlocked=()=>typeof previewUnlocked==='function'&&previewUnlocked();
 function available(i){return !modules[i].planned&&(unlocked()||modules.slice(0,i).every((m,j)=>m.planned||completed.has(j)))}
 function hub(){
  stop();current=-1;if(!connected())return;
  host.innerHTML=`<section class="mini-level-hub ${level===2?'phishing-hub':''}"><p class="mini-level-kicker">LEVEL ${String(level).padStart(2,'0')} · YOUR MINI-GAMES</p><h2>${esc(options.title||'Choose your next challenge')}</h2><p>Pick up where you left off, or revisit a completed game for practice.</p><div class="mini-level-cards">${modules.map((m,i)=>`<article class="${completed.has(i)?'complete':''}"><span>${String(i+1).padStart(2,'0')} / ${m.planned?'COMING SOON':completed.has(i)?'✓ COMPLETED':available(i)?'READY TO PLAY':'LOCKED'}</span><h3>${esc(m.title)}</h3><p>${esc(m.copy)}</p><button type="button" data-mini-launch="${i}" ${available(i)?'':'disabled'}>${m.planned?'COMING SOON':completed.has(i)?'REVISIT GAME →':available(i)?'PLAY GAME →':'FINISH PREVIOUS GAME'}</button></article>`).join('')}</div>${modules.every((m,i)=>m.planned||completed.has(i))?'<button type="button" class="mini-level-quiz" data-mini-quiz>CONTINUE TO KNOWLEDGE CHECK →</button>':''}<p class="mini-level-note">Completed games stay unlocked during this level attempt. Practice replays do not change your score. Leaving an unfinished mini-game restarts that game; Virus Zoo saves its collection.</p></section>`;
  host.onclick=e=>{const b=e.target.closest('[data-mini-launch]');if(b&&!b.disabled)launch(Number(b.dataset.miniLaunch));else if(e.target.closest('[data-mini-quiz]'))openQuiz()};
 }
 function openQuiz(){stop();host.onclick=null;clock(true);if(nav.checkpoint)nav.checkpoint();else ctx.done()}
 function launch(i){
  if(!connected()||!Number.isInteger(i)||!modules[i]||!available(i)||(typeof dailyAllow==='function'&&!dailyAllow()))return;
  stop();host.onclick=null;current=i;const token=generation,practice=completed.has(i);let earned=0,finished=false;
  host.innerHTML=`<div class="mini-level-run">${practice?'<p class="mini-level-practice">PRACTICE REPLAY · YOUR COMPLETED PROGRESS IS SAFE</p>':''}<div class="mini-level-game"></div></div>`;
  child=host.querySelector('.mini-level-game');clock(true);
  const valid=()=>!finished&&generation===token&&connected()&&child?.isConnected!==false;
  const done=()=>{if(!valid())return;finished=true;completed.add(i);if(!practice&&earned)ctx.add(Math.max(0,earned),modules[i].title);const next=modules.findIndex((m,j)=>j>i&&!m.planned&&!completed.has(j));if(practice)hub();else if(next>=0)launch(next);else openQuiz()};
  control=modules[i].mount(child,{add:n=>{if(valid()&&Number.isFinite(n))earned+=n},done},done)||null;
 }
 const nav={level,checkpoint:null,back(){if(current===-1&&connected()&&typeof act!=='undefined'){act.nav('road');return}stop();host=stage('Game');hub()},hub,launch,dispose:stop,get current(){return current},get completed(){return [...completed]}};
 activeMiniLevel=nav;
 if(options.initialScore)ctx.add(options.initialScore,'Virus Zoo');
 if(options.start!==undefined&&!unlocked())launch(options.start);else hub();
 return nav;
}
function phishLevelModules(el,ctx){return miniGameLevel(el,ctx,[
 {title:'Link Detective',copy:'Inspect the login screen and find three traps.',mount:(e,c,done)=>phishMiniGames(e,c,{start:0,finish:done})},
 {title:'Packet Rescue',copy:'Run the cable, dodge phishing traps and rescue the packet.',mount:packetRescue},
 {title:'Message Patrol',copy:'Swipe scams away and keep expected messages.',mount:(e,c,done)=>phishMiniGames(e,c,{start:1,finish:done})},
 {title:'Phish Maze',copy:'Collect four targets, learn safety tips and escape the viruses.',mount:phishMaze},
 {title:'Phish or Legit',copy:'Protect the inbox by inspecting ten emails.',mount:(e,c)=>phish(e,c)}
],{title:'The Phishing Arcade'})}

/* Original vector specimens. Each silhouette communicates the malware's behaviour. */
let zooArtSerial=0;
function zooCreatureArt(card,large=false){
 const ink='#061224';
 const shapes={
  virus: `<path class="vz-art-limb" d="M60 44 47 22 40 23 44 45 25 40 20 47 40 61 21 78 24 86 44 84 40 109 48 113 62 94M113 43l18-22 8 3-5 23 22-6 5 8-21 16 19 16-3 9-23-3 6 25-9 4-17-21"/>
   <path d="m66 36 41-1 29 27-2 43-31 26-40-4-26-28 3-39Z"/><path class="vz-art-facet" d="m66 36 41-1 29 27-49-10-47 8Z"/>
   <path class="vz-art-dark" d="m51 67 29 8-6 14-20-5zm69 0-29 8 5 14 21-5Z"/><path class="vz-art-eye" d="m57 74 17 5-2 4-14-3zm56 0-16 5 1 4 14-3Z"/>
   <path class="vz-art-dark" d="m60 101 25-9 26 10-10 16-31-1Z"/><path class="vz-art-tooth" d="m68 101 6 1 2 8 5-11 8 1 2 10 6-8 6 1-5 9-24-1Z"/>
   <circle cx="58" cy="51" r="5" class="vz-art-mark"/><circle cx="119" cy="99" r="4" class="vz-art-mark"/>`,
  worm: `<path d="M53 48C17 60 26 98 63 95s57 31 27 44" fill="none" stroke="${ink}" stroke-width="35"/><path d="M53 48C17 60 26 98 63 95s57 31 27 44" fill="none" stroke="currentColor" stroke-width="27"/>
   <path class="vz-art-wire" d="m33 66 24 9m-23 10 21-9m1 21 4-22m12 25 9-20m6 30 17-16m-9 28 21-4M89 135l17 6"/>
   <path d="m54 26 40 1 24 20-11 29-35 7-29-23Z"/><path class="vz-art-facet" d="m54 26 40 1 24 20-40-5-35 18Z"/>
   <path class="vz-art-dark" d="m63 44 21 4-3 13-17-5zm42 6-16-1-1 14 12-3Z"/><path class="vz-art-eye" d="m68 48 11 3-1 4-10-3zm32 6-8-1v4h7Z"/>
   <path class="vz-art-tooth" d="m73 68 9 1 3 9 4-10 9-1-6 11-13 1Z"/><path class="vz-art-wire" d="m91 30 7-15 12 1m-46 15-4-16-12 2"/>`,
  trojan: `<path d="m47 100-6 35h17l12-33m32-4 12 37h18l-5-41"/><path d="m46 59 49-10 27 26-6 39H50L34 88Z"/>
   <path d="m88 62-2-28 20-20 8 18 19 9 11 21-18 10-20-3-8 15Z"/><path class="vz-art-facet" d="m106 14 8 18 19 9 11 21-23-15-20-14Z"/>
   <path class="vz-art-eye" d="m111 44 17 6-13 5Z"/><path class="vz-art-dark" d="M59 72h34v42H59Z"/><path class="vz-art-door" d="m61 73 23-8v43l-23 7Z"/><circle class="vz-art-eye" cx="77" cy="91" r="2"/>
   <path class="vz-art-wire" d="m36 70-12-15 7-14m75 52 15-4M53 65l39-8"/><path class="vz-art-mark" d="m91 31 7 4-3 11-8-3Z"/>`,
  ransomware: `<path class="vz-art-wire" d="m42 77-15 5-5 21 14 14 16-3m86-39 14 7 2 23-15 12-16-5"/>
   <path d="M56 66V46a29 29 0 0 1 58 0v20H98V46a13 13 0 0 0-26 0v20Z"/><path class="vz-art-facet" d="M57 45a28 28 0 0 1 56 0h-7a21 21 0 0 0-42 0Z"/>
   <path d="m45 60 15-9 48 1 20 10v57l-16 18H60l-16-18Z"/><path d="m47 67-12-20 21 9m68 10 13-21-22 12"/>
   <path class="vz-art-dark" d="m58 78 21 8-6 12-15-4zm56 0-23 8 5 12 17-4Z"/><path class="vz-art-eye" d="m62 85 12 4-2 4-10-3zm47 0-13 4 2 4 10-3Z"/>
   <path class="vz-art-dark" d="M91 110a7 7 0 1 0-12 0l-3 13h18Z"/><path class="vz-art-mark" d="m51 111 8 14h12m48-14-8 14h-11"/>`,
  spyware: `<path class="vz-art-limb" d="m51 64-25-13-12 11m34 18L18 84l-5 16m37-4-23 19 3 17m92-68 25-13 12 11m-34 18 30 4 5 16m-37-4 23 19-3 17"/>
   <path d="m31 80 22-34 34-13 34 13 22 34-23 29-33 12-35-12Z"/><path class="vz-art-dark" d="M43 79q42-49 87 0-43 49-87 0Z"/>
   <circle cx="86" cy="78" r="26"/><circle class="vz-art-eye" cx="86" cy="78" r="17"/><path class="vz-art-dark" d="m83 63 8 4 4 23-9 5-8-9Z"/>
   <path class="vz-art-facet" d="m48 60 17-17 21-4 32 17-32-7Z"/><path class="vz-art-wire" d="M86 21v-8m-6 4h12M67 111l-9 13m47-13 9 13"/>`,
  keylogger: `<path class="vz-art-limb" d="m45 65-18-15-11 7m22 24-20 1-8 12m29 6-16 15 4 12m100-62 18-15 11 7m-22 24 20 1 8 12m-29 6 16 15-4 12"/>
   <path d="m45 39 80 1 17 62-20 29H51l-20-29Z"/><path class="vz-art-facet" d="m45 39 80 1 5 17-91 1Z"/>
   <path class="vz-art-dark" d="m51 50 28 6-5 13-23-5zm70 0-28 6 5 13 23-5Z"/><path class="vz-art-eye" d="m58 57 16 3-2 4-14-3zm56 0-15 3 2 4 13-3Z"/>
   <path class="vz-art-dark" d="m47 77 79 1 7 29-12 13H53l-12-13Z"/><path class="vz-art-key" d="M52 85h10v8H52zm18 0h10v8H70zm18 0h10v8H88zm18 0h10v8h-10zm-50 16h10v8H56zm18 0h25v8H74zm33 0h10v8h-10Z"/>
   <path class="vz-art-wire" d="M86 39V24l19-7 11 6"/>`,
  adware: `<path class="vz-art-dark" d="M19 30h83v65H19Zm54 47h81v74H73Z"/><path class="vz-art-wire" d="M19 44h83m-29 17h81"/>
   <path d="m42 53 75-5 21 71-12 20-77-3-21-20Z"/><path class="vz-art-facet" d="m42 53 75-5 7 18-89 4Z"/><path class="vz-art-dark" d="m42 77 80-5 7 42-10 10-70-1-12-10Z"/>
   <path class="vz-art-eye" d="m49 83 26 6-6 10-17-6zm67-2-26 7 5 10 18-7Z"/><path class="vz-art-tooth" d="m55 106 7-3 5 9 5-8 8 8 8-9 7 8 6-9 7 4-9 12-34-1Z"/>
   <path class="vz-art-wire" d="m28 32 8 8m0-8-8 8m109 10 8 8m0-8-8 8m-98 57-16 10m111-15 17 10"/>`,
  botnet: `<path class="vz-art-wire" d="M87 49v26M46 96 82 77l40 19m-78 21 42 16 41-16"/>
   <path d="m64 21 43 1 14 30-16 21H67L52 52Z"/><path class="vz-art-facet" d="m64 21 43 1 14 30-34-12-35 12Z"/>
   <path class="vz-art-dark" d="m65 43 17 5-4 12-12-5zm43 0-17 5 4 12 12-5Z"/><path class="vz-art-eye" d="m69 48 8 3-1 4-7-3zm35 0-8 3 1 4 7-3Z"/>
   <path d="m22 87 35-1 10 22-12 22H24l-13-22Zm94-1 35 1 11 21-13 22h-31l-12-22Z"/>
   <path class="vz-art-eye" d="m23 100 14 4-3 7-10-4zm32 0-13 4 3 7 9-4zm62 0 14 4-3 7-10-4zm33 0-13 4 3 7 9-4Z"/>
   <path class="vz-art-dark" d="M76 61h19v5H76ZM30 119h20v5H30Zm93 0h20v5h-20Z"/>`,
  rootkit: `<path class="vz-art-wire" d="M42 116h91M72 113l-10 15-23 5-8 12m56-30 1 29m13-29 13 15 25 5 5 11m-82-18 8 17m44-15-5 16"/>
   <path d="m86 17 33 27 16 69-24-9-13 14-13-10-17 10-12-14-22 9 15-69Z"/><path class="vz-art-facet" d="m86 17 33 27 16 69-24-34-25-45-24 45-28 34 15-69Z"/>
   <path class="vz-art-dark" d="m85 37 22 30 3 29-24 8-26-9 3-29Z"/><path class="vz-art-eye" d="m66 70 15 6-4 9-11-7zm38 0-15 6 4 9 11-7Z"/>
   <path class="vz-art-mark" d="m43 101 14-7m61 0 12 9"/>`,
  cryptominer: `<path class="vz-art-limb" d="m49 70-23 13 2 27 16 9m80-49 23 13-2 27-16 9"/>
   <path d="m60 35 52 1 17 24-8 51-26 23-37-24-7-49Z"/><path class="vz-art-facet" d="m60 35 52 1 17 24-78 1Z"/>
   <path class="vz-art-dark" d="M60 66h58l-6 27H65Z"/><path class="vz-art-eye" d="m65 72 18 5-5 9-11-5zm46 0-18 5 5 9 11-5Z"/>
   <path d="m70 99 31 1 9 15-23 32-25-32Z"/><path class="vz-art-wire" d="m67 109 37 6m-30 5 22 5m-16 4 11 2"/>
   <path class="vz-art-key" d="m88 13 15 11-6 17H78l-5-17Z"/><path class="vz-art-wire" d="M88 14v24M36 67 27 54m111 13 9-13"/>`,
  macro: `<path d="M48 22h55l25 27v79l-16 12H48l-13-12V36Z"/><path class="vz-art-facet" d="M48 22h55v27h25L103 22Z"/>
   <path class="vz-art-dark" d="m46 65 32 10-5 16-24-9zm70 0-29 10 5 16 21-9Z"/><path class="vz-art-eye" d="m52 73 20 6-2 5-17-6zm57 0-16 6 2 5 13-6Z"/>
   <path class="vz-art-dark" d="M51 105h61v20H51Z"/><path class="vz-art-tooth" d="m55 105 8 1 4 10 6-10 8 1 4 11 7-11h8l3 10 5-11-6 16H61Z"/>
   <path class="vz-art-wire" d="M51 45h37M24 77 14 91l13 10m107-24 13 14-12 10M117 30l10-11 12 7"/><path class="vz-art-eye" d="m137 20 8 5-9 5Z"/>`,
  hijacker: `<path class="vz-art-limb" d="m47 102-28-8 1-24 13-9m94 41 26-8-1-24-13-9"/>
   <path d="m58 29 53 1 18 25-11 47-30 27-32-27-11-47Z"/><path class="vz-art-facet" d="m58 29 53 1 18 25-39-8-45 8Z"/>
   <path class="vz-art-dark" d="m56 57 27 9-6 16-19-8zm61 0-27 9 6 16 19-8Z"/><path class="vz-art-eye" d="m61 65 16 5-2 5-12-4zm51 0-16 5 2 5 12-4Z"/>
   <circle cx="87" cy="110" r="31" class="vz-art-dark"/><circle cx="87" cy="110" r="23" fill="none" stroke="currentColor" stroke-width="8"/><path class="vz-art-wire" d="m67 99 20 11 20-11m-20 11v24"/>
   <path class="vz-art-key" d="M78 23V11H62v-7l-17 12 17 12v-8h9v10m25-7V11h16v-7l17 12-17 12v-8h-9v10"/>`
 };
 if(!shapes[card.id]||card.name==='Dr. Patch')return null;
 const id='vz-specimen-'+(++zooArtSerial),color=/^#[0-9a-f]{6}$/i.test(card.color)?card.color:'#70d9cf';
 return `<svg class="vz-sprite vz-specimen ${large?'large':''}" viewBox="0 0 174 166" role="img" aria-label="${esc(card.name)} malware creature" style="color:${color}"><defs><linearGradient id="${id}" x1="0" y1="0" x2=".8" y2="1"><stop stop-color="${color}"/><stop offset=".55" stop-color="${color}"/><stop offset="1" stop-color="#16334e"/></linearGradient></defs><ellipse class="vz-art-floor" cx="87" cy="148" rx="57" ry="9"/><g class="vz-art-body" fill="url(#${id})" stroke="${ink}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">${shapes[card.id]}</g><path class="vz-art-reticle" d="M12 38V23h15m120 0h15v15M12 121v15h15m120 0h15v-15"/></svg>`;
}

/* Virus Zoo: data-driven module, with a model shared by the UI and validation tests. */
const VIRUS_ZOO_DATA={"version":1,"scoreCap":1300,"minimumActiveSeconds":150,"creatures":[{"id":"virus","name":"Virus","nickname":"The Clingy Parasite","rarity":"Common","stats":[3,3,2],"entry":"Infected files, USB drives and downloads","does":"Attaches to a program and spreads when you run it.","warning":"Programs crash or files change.","counter":"Never run unknown files; use company antivirus.","fact":"Spreads when an infected program runs.","sprite":["00100100","01111110","11011011","01111110","01100110","11000011","00100100"],"color":"#6fe1ca"},{"id":"worm","name":"Worm","nickname":"The Self-Spreader","rarity":"Rare","stats":[3,4,5],"entry":"Unpatched software and networks","does":"Spreads between vulnerable devices without anyone clicking.","warning":"The network slows and several PCs are affected.","counter":"Patch promptly; isolate affected devices and report to IT.","fact":"Can spread without a click.","sprite":["00000110","00001111","00111101","01111000","11010000","11100000","01000000"],"color":"#6bc6ff"},{"id":"trojan","name":"Trojan","nickname":"The Gift Horse","rarity":"Common","stats":[4,4,1],"entry":"Free or cracked software","does":"Pretends to be useful software and can open a back door.","warning":"A free tool unexpectedly asks for administrator rights.","counter":"Install approved apps from trusted sources only.","fact":"Looks helpful, but hides a harmful payload.","sprite":["00100100","01111100","01101110","00111111","01111110","01001010","11001100"],"color":"#e5ae78"},{"id":"ransomware","name":"Ransomware","nickname":"The Hostage Taker","rarity":"Legendary","stats":[3,5,3],"entry":"Phishing attachments or weak remote access","does":"Locks or steals files and demands payment.","warning":"Renamed files, inaccessible documents or a ransom note.","counter":"Disconnect from the network and report. Do not pay yourself; IT handles recovery from tested backups.","fact":"Locks files and demands a ransom.","sprite":["00111100","01100110","01000010","11111111","11011011","11100111","01111110"],"color":"#ffd36f"},{"id":"spyware","name":"Spyware","nickname":"The Nosy Neighbour","rarity":"Common","stats":[5,3,1],"entry":"Fake updates and bundled apps","does":"Secretly watches activity and collects information.","warning":"Unexpected data use or unfamiliar programs.","counter":"Use company antivirus and review app permissions with IT.","fact":"Secretly collects information about you.","sprite":["00011000","00111100","01111110","11100111","11011011","01111110","00100100"],"color":"#c0a0ff"},{"id":"keylogger","name":"Keylogger","nickname":"The Over-the-Shoulder Snoop","rarity":"Rare","stats":[5,4,1],"entry":"Trojans or rogue hardware","does":"Records keystrokes, which can expose passwords.","warning":"An unfamiliar device attached to the keyboard cable.","counter":"Report suspicious hardware; use antivirus and MFA. MFA alone does not remove a keylogger.","fact":"Records the keys you type.","sprite":["00011000","01111110","11011011","11111111","01111110","11111111","10101011"],"color":"#ff9bc1"},{"id":"adware","name":"Adware","nickname":"The Pop-up Pest","rarity":"Common","stats":[2,2,2],"entry":"Free software bundles","does":"Floods the screen with unwanted ads; some lead to scams.","warning":"Persistent pop-ups and advertising.","counter":"Use approved, official software sources.","fact":"Bombards you with unwanted ads.","sprite":["01000010","11100111","11011011","01111110","11011011","11100111","01000010"],"color":"#9fe881"},{"id":"botnet","name":"Botnet","nickname":"The Zombie Army","rarity":"Epic","stats":[5,4,4],"entry":"Weak credentials or unpatched devices","does":"Connects compromised devices into an attacker-controlled network.","warning":"Unusual traffic or a fan running while the PC is idle.","counter":"Patch devices, use strong unique passwords and company antivirus.","fact":"An attacker remotely controls a group of infected devices.","sprite":["01100110","11111111","11011011","01111110","00111100","01100110","11000011"],"color":"#93a9ff"},{"id":"rootkit","name":"Rootkit","nickname":"The Invisible Ghost","rarity":"Epic","stats":[5,5,1],"entry":"Malware with administrator privileges","does":"Hides itself or other malware deep in the system.","warning":"Security tools unexpectedly stop working.","counter":"Isolate and report. IT may need to rebuild the device.","fact":"Hides malware from normal security checks.","sprite":["00111100","01111110","11011011","11111111","11100111","11011011","10011001"],"color":"#c6aeef"},{"id":"cryptominer","name":"Cryptominer","nickname":"The Power Thief","rarity":"Rare","stats":[3,2,2],"entry":"Malicious ads or browser extensions","does":"Hijacks processing power to mine cryptocurrency.","warning":"Very high CPU use, a loud fan and slow performance.","counter":"Report unusual load; ask IT to remove unapproved extensions.","fact":"Steals processing power to mine crypto.","sprite":["00011000","00111100","01111110","11011011","01111110","00111100","00011000"],"color":"#ffb26d"},{"id":"macro","name":"Macro Virus","nickname":"The Document Bomb","rarity":"Common","stats":[3,3,2],"entry":"Documents sent by email","does":"Malicious document code runs when macros are allowed.","warning":"A document asks you to Enable content.","counter":"Never enable macros in an unexpected or untrusted document.","fact":"Can run when you enable document macros.","sprite":["01111100","01000110","01000011","01111111","01011011","01100111","01111111"],"color":"#f59ea6"},{"id":"hijacker","name":"Browser Hijacker","nickname":"The Detour Driver","rarity":"Common","stats":[2,2,1],"entry":"Untrusted extensions and free tools","does":"Changes browser settings and sends you to unwanted destinations.","warning":"Your homepage or search engine changes unexpectedly.","counter":"Report it; remove unapproved extensions and reset the browser with IT.","fact":"Redirects your browser or changes its settings.","sprite":["00111100","01100110","11000011","11111111","11011011","01111110","00100100"],"color":"#84d7ea"}],"packs":[{"title":"First contact","cards":["virus","worm","trojan"],"question":{"prompt":"Which creature can spread through vulnerable networks without a click?","options":["Virus","Worm","Trojan","Adware"],"answer":1,"why":"A worm can spread itself; a virus usually needs its infected host program to run."}},{"title":"Secrets & hostages","cards":["ransomware","spyware","keylogger"],"question":{"prompt":"What should an employee do after finding a ransom note?","options":["Pay personally","Forward it to everyone","Disconnect and report to IT","Disable antivirus"],"answer":2,"why":"Contain the incident and report. Let your incident-response team manage recovery."}},{"title":"Hidden trouble","cards":["adware","botnet","rootkit"],"question":{"prompt":"Which creature specialises in hiding malware from security tools?","options":["Adware","Botnet","Rootkit","Worm"],"answer":2,"why":"Rootkits hide their presence or other malware; investigation belongs with IT."}},{"title":"Browser & document beasts","cards":["cryptominer","macro","hijacker"],"question":{"prompt":"An unexpected document asks you to Enable content. Your move?","options":["Enable it to read","Keep macros blocked and report","Try it on a colleague’s PC","Turn off security"],"answer":1,"why":"A document can use macros to run malicious code. Do not enable them for an unexpected file."}}],"clues":[{"answer":"worm","prompt":"I copy myself across a vulnerable network without anyone clicking.","options":["virus","worm","trojan","adware"]},{"answer":"trojan","prompt":"I look like a free tool, but let attackers in through a back door.","options":["trojan","cryptominer","hijacker","worm"]},{"answer":"macro","prompt":"I wait for you to click Enable content in a document.","options":["virus","macro","adware","rootkit"]},{"answer":"keylogger","prompt":"I record every key you type, including passwords.","options":["spyware","keylogger","ransomware","botnet"]},{"answer":"ransomware","prompt":"Your files will not open. I leave a note demanding payment.","options":["ransomware","rootkit","adware","worm"]},{"answer":"botnet","prompt":"I recruit infected PCs into a remotely controlled zombie army.","options":["worm","botnet","virus","trojan"]},{"answer":"cryptominer","prompt":"I use your processor for cryptocurrency, leaving your work painfully slow.","options":["adware","cryptominer","spyware","rootkit"]},{"answer":"hijacker","prompt":"Your browser opens a different homepage and redirects your searches.","options":["adware","hijacker","macro","keylogger"]},{"answer":"rootkit","prompt":"I help other malware hide, and security tools may stop working.","options":["trojan","spyware","rootkit","virus"]},{"answer":"spyware","prompt":"I quietly watch activity and gather information, beyond just typed keys.","options":["spyware","keylogger","adware","worm"]},{"answer":"adware","prompt":"Your homepage stays the same, but I flood your screen with unwanted ads.","options":["hijacker","adware","ransomware","botnet"]},{"answer":"virus","prompt":"I attach to a program and spread when that infected program runs.","options":["worm","trojan","virus","macro"]},{"answer":"worm","prompt":"No one opened a file. Unpatched PCs still infected one another.","options":["virus","worm","trojan","keylogger"]},{"answer":"keylogger","prompt":"My specialty is stealing the characters typed into a login form.","options":["spyware","hijacker","keylogger","cryptominer"]},{"answer":"trojan","prompt":"Unlike a self-spreading worm, I trick you into installing something that appears useful.","options":["trojan","virus","worm","adware"]}],"defences":[{"id":"patch","name":"Patch","copy":"Close known software weaknesses.","icon":"↑"},{"id":"filter","name":"Email Filter","copy":"Block suspicious mail before it reaches the inbox.","icon":"✉"},{"id":"macros","name":"Block Macros","copy":"Stop untrusted document code.","icon":"▣"},{"id":"usb","name":"USB Block","copy":"Keep unknown USB devices disconnected.","icon":"⊥"},{"id":"apps","name":"Approved Apps","copy":"Use authorised software and extensions.","icon":"✓"},{"id":"antivirus","name":"Antivirus","copy":"Detect and remove known malicious code.","icon":"✦"},{"id":"isolate","name":"Isolate","copy":"Disconnect the affected device from the network.","icon":"⊘"},{"id":"backup","name":"Backup","copy":"Recover clean data after containment.","icon":"↶"},{"id":"mfa","name":"MFA","copy":"Add another sign-in check to protect accounts.","icon":"◆"}],"duels":[{"attacker":"worm","entry":"Unpatched server","best":"patch","partial":"isolate","why":"Patch the weakness before the worm arrives. If already infected, isolate and report."},{"attacker":"macro","entry":"Emailed document","best":"macros","partial":"antivirus","why":"Block untrusted macros. Antivirus helps, but is not permission to enable content."},{"attacker":"keylogger","entry":"Found USB stick","best":"usb","partial":"mfa","why":"Do not plug it in. MFA helps protect accounts but does not stop a keylogger recording keys."},{"attacker":"trojan","entry":"Cracked software","best":"apps","partial":"antivirus","why":"Use approved apps. A cracked tool can hide a Trojan even if it appears to work."},{"attacker":"ransomware","entry":"Phishing link","best":"filter","partial":"backup","why":"Filtering is the best available prevention card here. Avoid the link; backups support recovery, not prevention."},{"attacker":"cryptominer","entry":"Browser extension","best":"apps","partial":"antivirus","why":"Use approved extensions; report suspicious CPU use. Antivirus is a supporting defence."},{"attacker":"botnet","entry":"Weak password","best":"mfa","partial":"patch","why":"MFA is the best card in this hand for credential attacks. Also replace weak passwords with strong unique ones."},{"attacker":"rootkit","entry":"Admin-rights Trojan","best":"isolate","partial":"report","why":"Isolate and report to IT. Do not attempt to repair a deeply compromised device yourself."}],"check":[{"prompt":"Which statement separates a virus from a worm?","options":["A virus always looks red","A worm can self-spread; a virus attaches to a host program","A worm only infects phones","They are always identical"],"answer":1,"why":"The route matters: worms can self-spread, while viruses attach to a host."},{"prompt":"You suspect malware on your work PC. What is the best first response?","options":["Keep working and hide it","Install a random cleaner","Follow your incident process, isolate if instructed and report to IT","Send the files to a personal account"],"answer":2,"why":"Report promptly and follow your company incident process. Do not investigate using unapproved tools."}]};
const ZOO_PHASES=['entrance','pack','packQuiz','matchBrief','match','matchFailed','duelBrief','duel','checkBrief','check','results'];
function newVirusZoo(){return {version:VIRUS_ZOO_DATA.version,phase:'entrance',pack:0,opened:[],collected:[],packAnswers:[],matchIndex:0,matchAnswers:[],matchHearts:3,matchCombo:0,matchTime:15,duelIndex:0,duels:[],health:100,checkIndex:0,checkAnswers:[],feedback:null,activeSeconds:0}}
function zooShuffle(items,rng=Math.random){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function zooHand(index){const duel=VIRUS_ZOO_DATA.duels[index],ids=VIRUS_ZOO_DATA.defences.map(d=>d.id),required=[duel.best,...(duel.partial==='report'?[]:[duel.partial])];return zooShuffle([...required,...zooShuffle(ids.filter(id=>!required.includes(id))).slice(0,4-required.length)])}
function zooCard(id){return VIRUS_ZOO_DATA.creatures.find(c=>c.id===id)}
function zooScan(run,id){
 if(run.phase!=='pack'||!VIRUS_ZOO_DATA.packs[run.pack].cards.includes(id)||!run.opened.includes(id)||run.collected.includes(id))return false;
 run.collected.push(id);return true;
}
function zooRespond(run,choice){
 if(run.feedback)return null;let feedback;
 if(run.phase==='packQuiz'){
  const q=VIRUS_ZOO_DATA.packs[run.pack].question;if(!Number.isInteger(choice)||choice<0||choice>3)return null;
  const correct=choice===q.answer;run.packAnswers.push(choice);feedback={correct,delta:correct?15:0,why:q.why};
 }else if(run.phase==='match'){
  const q=VIRUS_ZOO_DATA.clues[run.matchIndex];if(choice!==null&&!q.options.includes(choice))return null;
  const correct=choice===q.answer,bonus=correct?Math.min(25,run.matchCombo*5):0,delta=correct?30+Math.ceil(run.matchTime/15*10)+bonus:-20;
  run.matchAnswers.push({choice,remaining:run.matchTime,delta});run.matchCombo=correct?run.matchCombo+1:0;if(!correct)run.matchHearts--;
  feedback={correct,delta,why:zooCard(q.answer).name+': '+zooCard(q.answer).fact};
 }else if(run.phase==='duel'){
  const q=VIRUS_ZOO_DATA.duels[run.duelIndex];if(choice!=='report'&&!VIRUS_ZOO_DATA.defences.some(d=>d.id===choice))return null;
  const best=choice===q.best,partial=choice===q.partial||choice==='report',delta=best?60:partial?25:-30;
  if(!best&&!partial)run.health=Math.max(0,run.health-15);run.duels.push(choice);
  feedback={correct:best,partial,delta,why:(choice==='report'?'Good call: report early. Then '+q.why:q.why)};
 }else if(run.phase==='check'){
  const q=VIRUS_ZOO_DATA.check[run.checkIndex];if(!Number.isInteger(choice)||choice<0||choice>3)return null;
  const correct=choice===q.answer;run.checkAnswers.push(choice);feedback={correct,delta:correct?50:-25,why:q.why};
 }else return null;
 run.feedback=feedback;return feedback;
}
function zooNext(run){
 if(!run.feedback)return false;run.feedback=null;
 if(run.phase==='packQuiz'){run.pack++;run.phase=run.pack<VIRUS_ZOO_DATA.packs.length?'pack':'matchBrief'}
 else if(run.phase==='match'){run.matchIndex++;run.matchTime=15;run.phase=run.matchHearts<=0?'matchFailed':run.matchIndex>=VIRUS_ZOO_DATA.clues.length?'duelBrief':'match'}
 else if(run.phase==='duel'){run.duelIndex++;run.phase=run.duelIndex>=VIRUS_ZOO_DATA.duels.length?'checkBrief':'duel'}
 else if(run.phase==='check'){run.checkIndex++;run.phase=run.checkIndex>=VIRUS_ZOO_DATA.check.length?'results':'check'}
 return true;
}
function zooTick(run,seconds){
 if(!Number.isFinite(seconds)||seconds<=0||['entrance','results','matchFailed'].includes(run.phase))return false;
 const dt=Math.min(seconds,1);run.activeSeconds+=dt;
 if(run.phase==='match'&&!run.feedback){run.matchTime=Math.max(0,run.matchTime-dt);if(run.matchTime===0){zooRespond(run,null);return true}}
 return false;
}
function zooSummary(run){
 const d=VIRUS_ZOO_DATA,pack=run.collected.length*10+run.packAnswers.reduce((n,a,i)=>n+(a===d.packs[i]?.question.answer?15:0),0);
 const match=run.matchAnswers.reduce((n,a)=>n+a.delta,0),correct=run.matchAnswers.filter((a,i)=>a.choice===d.clues[i]?.answer).length;
 let best=0,partial=0;const duel=run.duels.reduce((n,a,i)=>{if(a===d.duels[i]?.best){best++;return n+60}if(a==='report'||a===d.duels[i]?.partial){partial++;return n+25}return n-30},0);
 const checks=run.checkAnswers.filter((a,i)=>a===d.check[i]?.answer).length,check=checks*50-(run.checkAnswers.length-checks)*25;
 const health=run.duels.length===d.duels.length?run.health:0,raw=Math.max(0,pack+match+duel+health+check),accuracy=correct/d.clues.length;
 const quality=accuracy*.5+(best+partial*.4)/d.duels.length*.35+checks/d.check.length*.15;
 return {pack,match,duel,check,health,raw,credited:Math.min(d.scoreCap,raw),correct,accuracy,grade:quality>=.95?'S':quality>=.8?'A':quality>=.65?'B':quality>=.5?'C':'D',keeper:run.collected.length===d.creatures.length&&accuracy>=.8,perfect:run.duels.length===d.duels.length&&run.health===100,complete:run.phase==='results'&&run.checkAnswers.length===d.check.length};
}
function zooStorageKey(){return 'cyberquest.virus-zoo.v1.'+(typeof SERVER!=='undefined'&&SERVER&&S.user?.id?'user.'+S.user.id:'local')}
function readVirusZoo(){
 try{const r=JSON.parse(localStorage.getItem(zooStorageKey())||'null');if(!r||r.version!==VIRUS_ZOO_DATA.version||!ZOO_PHASES.includes(r.phase))return null;
  for(const k of ['pack','matchIndex','duelIndex','checkIndex'])if(!Number.isInteger(r[k])||r[k]<0)return null;
  if(r.pack>VIRUS_ZOO_DATA.packs.length||r.matchIndex>VIRUS_ZOO_DATA.clues.length||r.duelIndex>VIRUS_ZOO_DATA.duels.length||r.checkIndex>2)return null;
  if(!Array.isArray(r.collected)||!Array.isArray(r.opened)||[...r.collected,...r.opened].some(id=>!zooCard(id))||new Set(r.collected).size!==r.collected.length)return null;
  if(!Array.isArray(r.packAnswers)||r.packAnswers.length>4||!Array.isArray(r.matchAnswers)||r.matchAnswers.length>15||!Array.isArray(r.duels)||r.duels.length>8||!Array.isArray(r.checkAnswers)||r.checkAnswers.length>2)return null;
  if([...r.packAnswers,...r.checkAnswers].some(a=>!Number.isInteger(a)||a<0||a>3)||r.matchAnswers.some((a,i)=>!a||!Number.isFinite(a.delta)||a.delta < -20||a.delta > 65||!Number.isFinite(a.remaining)||a.remaining<0||a.remaining>15||(a.choice!==null&&!VIRUS_ZOO_DATA.clues[i].options.includes(a.choice)))||r.duels.some(id=>id!=='report'&&!VIRUS_ZOO_DATA.defences.some(d=>d.id===id)))return null;
  if(!Number.isFinite(r.health)||r.health<0||r.health>100||!Number.isFinite(r.activeSeconds)||r.activeSeconds<0||!Number.isFinite(r.matchTime)||r.matchTime<0||r.matchTime>15||!Number.isInteger(r.matchHearts)||r.matchHearts<0||r.matchHearts>3)return null;
  if(['pack','packQuiz'].includes(r.phase)&&r.pack>=4||r.phase==='match'&&r.matchIndex>=15||r.phase==='duel'&&r.duelIndex>=8||r.phase==='check'&&r.checkIndex>=2)return null;
  if(!Number.isInteger(r.matchCombo)||r.matchCombo<0||r.matchCombo>15||r.feedback!==null&&(!r.feedback||typeof r.feedback.why!=='string'||typeof r.feedback.correct!=='boolean'||!Number.isFinite(r.feedback.delta)))return null;
  return r;
 }catch(e){return null}
}
function saveVirusZoo(run){try{localStorage.setItem(zooStorageKey(),JSON.stringify(run));return true}catch(e){return false}}
function zooSprite(card,large=false){
 const artwork=typeof zooCreatureArt==='function'?zooCreatureArt(card,large):null;if(artwork)return artwork;
 const cells=[];card.sprite.forEach((row,y)=>[...row].forEach((v,x)=>{if(v==='1')cells.push(`<rect x="${x*8+8}" y="${y*8+8}" width="8" height="8"/>`)}));
 return `<svg class="vz-sprite ${large?'large':''}" viewBox="0 0 80 80" role="img" aria-label="${esc(card.name)} pixel creature" shape-rendering="crispEdges"><g fill="#020c22" transform="translate(3 5)">${cells.join('')}</g><g fill="${card.color}">${cells.join('')}</g><path d="M24 30h8v7h-8zm24 0h8v7h-8z" fill="#102442"/><path d="M24 28h8v2h-8zm24 0h8v2h-8z" fill="#fff8dc"/></svg>`;
}
function zooMiniStats(c){return '<span class="vz-mini-stats">'+['Sneak','Damage','Spread'].map((label,i)=>'<span aria-label="'+label+' '+c.stats[i]+' out of 5"><b>'+label+'</b><i style="--stat:'+c.stats[i]+'"></i></span>').join('')+'</span>'}
function virusZoo(el,ctx,finish,options={}){
 let run=options.fresh?newVirusZoo():readVirusZoo()||newVirusZoo(),selected=null,codex=false,codexCard=null,paused=false,disposed=false,last=performance.now(),interval=null,observer=null,saveClock=0,hand=[],handIndex=-1,returnFocus=null;
 const d=VIRUS_ZOO_DATA,active=()=>!disposed&&el.isConnected!==false;
 const clock=on=>{if(typeof dailyActive!=='undefined'){dailyActive=on;dailyLast=Date.now()}};
 const learning=()=>!paused&&!codex&&!document.hidden&&!['entrance','results','matchFailed'].includes(run.phase);
 const sound=name=>SFX[name]?.();
 function persist(){if(options.persist!==false)saveVirusZoo(run)}
 function layout(){const shell=el.querySelector('.vz-shell'),header=document.querySelector('.site-bar');shell?.style.setProperty('--vz-top',(header?.getBoundingClientRect().height||0)+'px')}
 function dispose(){if(disposed)return;persist();disposed=true;clearInterval(interval);observer?.disconnect();document.removeEventListener('visibilitychange',visibility);window.removeEventListener('resize',layout);el.onclick=el.onkeydown=null;clock(false)}
 function visibility(){if(document.hidden&&!paused&&!['entrance','results','matchFailed'].includes(run.phase)){paused=true;draw()}last=performance.now();clock(learning())}
 function creatureButton(id,index,action='answer'){
  const c=zooCard(id);return `<button type="button" class="vz-creature vz-${c.rarity.toLowerCase()}" data-zoo-action="${action}" data-value="${id}" ${run.feedback&&action==='answer'?'disabled':''}><span class="vz-rarity">${esc(c.rarity)}${index===undefined?'':` <kbd>${index+1}</kbd>`}</span>${zooSprite(c)}<strong>${esc(c.name)}</strong><small>${esc(c.nickname)}</small>${zooMiniStats(c)}</button>`;
 }
 function field(c){return `<article class="vz-field"><div><p class="vz-eyebrow">FIELD NOTES / ${esc(c.rarity)}</p><h3>${esc(c.name)}</h3><p>${esc(c.nickname)}</p><div class="vz-stats">${['Sneak','Damage','Spread'].map((label,i)=>`<span>${label}<b aria-label="${c.stats[i]} out of 5">${Array.from({length:5},(_,j)=>`<i class="${j<c.stats[i]?'on':''}"></i>`).join('')}</b></span>`).join('')}</div></div><dl><dt>Entry route</dt><dd>${esc(c.entry)}</dd><dt>What it does</dt><dd>${esc(c.does)}</dd><dt>Warning sign</dt><dd>${esc(c.warning)}</dd><dt>Counter-move</dt><dd>${esc(c.counter)}</dd></dl></article>`}
 const button=(label,action,value='',cls='')=>`<button type="button" class="vz-btn ${cls}" data-zoo-action="${action}" data-value="${value}">${label}</button>`;
 function feedback(){const f=run.feedback;if(!f)return '';return `<div class="vz-feedback ${f.correct?'good':f.partial?'partial':'wrong'}" role="status"><b>${f.correct?'Great catch':f.partial?'A helpful first move':'Dr. Patch says'} · ${f.delta>=0?'+':''}${f.delta} PTS</b><p>${esc(f.why)}</p>${button('CONTINUE →','next')}</div>`}
 function answers(q){return `<div class="vz-answers">${q.options.map((copy,i)=>`<button type="button" data-zoo-action="answer" data-value="${i}" ${run.feedback?'disabled':''}><kbd>${i+1}</kbd>${esc(copy)}</button>`).join('')}</div>${feedback()}`}
 function briefing(title,copy,action,label){return `<div class="vz-round-intro"><span class="vz-lab-icon">✦</span><h3>${title}</h3><p>${copy}</p>${button(label,action)}</div>`}
 function content(){
  if(run.phase==='entrance')return `<div class="vz-entrance"><div class="vz-guide"><div class="vz-guide-art">${zooSprite({...d.creatures[0],name:'Dr. Patch',color:'#78e3ce',sprite:['00111100','01111110','11111111','01011010','01111110','00111100','01111110']},true)}<span>DR. PATCH</span></div><p>“Welcome, rookie keeper.<br>Meet the creatures. Learn their tricks.<br>Then defend Innovatiview.”</p></div><div><p class="vz-eyebrow">LEVEL 03 · MODULE 01</p><h3>Small creatures.<br><em>Big cyber trouble.</em></h3><p>Collect 12 malware cards across four packs. Recognise the threat, then play the right defence.</p><div class="vz-route"><span>01 <b>OPEN PACKS</b></span><span>02 <b>MATCH MANIA</b></span><span>03 <b>DEFENCE DUEL</b></span></div>${button('START MY COLLECTION →','start')}<small class="vz-note">About 6–8 minutes · Progress saves on this device<br>Warning signs are clues, not a diagnosis. Report concerns to IT.</small></div></div>`;
  if(run.phase==='pack'){
   const pack=d.packs[run.pack],complete=pack.cards.every(id=>run.collected.includes(id));if(!pack.cards.includes(selected))selected=null;
   return `<div class="vz-section-head"><div><p class="vz-eyebrow">ROUND A / PACK ${run.pack+1} OF 4</p><h3>${esc(pack.title)}</h3></div><span>${pack.cards.filter(id=>run.collected.includes(id)).length}/3 SCANNED</span></div><p class="vz-instruction">Flip a card, read its field notes, then tap the highlighted fact to scan it.</p><div class="vz-pack">${pack.cards.map((id,i)=>{const c=zooCard(id),opened=run.opened.includes(id),scanned=run.collected.includes(id);return `<button type="button" class="vz-flip ${opened?'is-open':''} ${selected===id?'selected':''} vz-${c.rarity.toLowerCase()}" data-zoo-action="flip" data-value="${id}" aria-label="${opened?c.name:'Open creature card '+(i+1)}${scanned?', scanned':''}"><span class="vz-flip-inner"><span class="vz-card-back"><span>IV</span><b>VIRUS ZOO</b><small>SEALED SPECIMEN ${i+1}</small><em>FLIP TO DISCOVER</em></span><span class="vz-card-front"><span class="vz-rarity">${esc(c.rarity)} ${scanned?'✓':''}</span>${zooSprite(c)}<strong>${esc(c.name)}</strong><small>${esc(c.nickname)}</small>${zooMiniStats(c)}</span></span></button>`}).join('')}</div>${selected?field(zooCard(selected))+`<button type="button" class="vz-scan" data-zoo-action="scan" data-value="${selected}" ${run.collected.includes(selected)?'disabled':''}><span>${run.collected.includes(selected)?'✓ SCANNED':'SCAN KEY FACT · +10'}</span>${esc(zooCard(selected).fact)}</button>`:'<div class="vz-scan-hint">↑ Choose any sealed card to meet your first creature.</div>'}${complete?button('PACK CHECK · DID YOU KNOW? →','packQuiz'):''}`;
  }
  if(run.phase==='packQuiz'){const q=d.packs[run.pack].question;return `<p class="vz-eyebrow">PACK ${run.pack+1} / DID YOU KNOW?</p><h3 class="vz-prompt">${esc(q.prompt)}</h3>${answers(q)}`}
  if(run.phase==='matchBrief')return briefing('MATCH MANIA','15 clues. Four creatures. You have 15 seconds per clue and three hearts. Queue up your instincts; the Malware Guide pauses the clock.','matchStart','START MATCH MANIA →');
  if(run.phase==='matchFailed')return briefing('One more field trip?','Your three hearts are gone. Review your Malware Guide, then try Match Mania again. Your collected cards are safe; this round’s points reset.','matchStart','RETRY MATCH MANIA →');
  if(run.phase==='match'){
   const q=d.clues[run.matchIndex];return `<div class="vz-section-head"><p class="vz-eyebrow">ROUND B / CLUE ${run.matchIndex+1} OF ${d.clues.length}</p><span class="vz-hearts" aria-label="${run.matchHearts} hearts">${'♥ '.repeat(run.matchHearts)}${'♡ '.repeat(3-run.matchHearts)}</span></div><div class="vz-clue"><span>WHO AM I?</span><h3>${esc(q.prompt)}</h3><b class="vz-countdown" data-zoo-time aria-label="Seconds remaining">${Math.ceil(run.matchTime)}s</b><div class="vz-timer-track"><i data-zoo-meter style="width:${run.matchTime/15*100}%"></i></div></div><div class="vz-choice-grid">${q.options.map((id,i)=>creatureButton(id,i)).join('')}</div><p class="vz-key-hint">1–4 TO CHOOSE · ARROW KEYS TO MOVE · ENTER TO SELECT</p>${feedback()}`;
  }
  if(run.phase==='duelBrief')return briefing('DEFENCE DUEL','Eight incoming threats. Protect 100 company health by choosing one of four defence cards. Report is always helpful, but the best defence earns more.','duelStart','DEFEND INNOVATIVIEW →');
  if(run.phase==='duel'){
   const q=d.duels[run.duelIndex],c=zooCard(q.attacker);if(handIndex!==run.duelIndex){hand=zooHand(run.duelIndex);handIndex=run.duelIndex}
   return `<div class="vz-section-head"><p class="vz-eyebrow">ROUND C / DUEL ${run.duelIndex+1} OF 8</p><div class="vz-health">COMPANY HEALTH <b>${run.health}/100</b><progress max="100" value="${run.health}">${run.health}%</progress></div></div><div class="vz-battle"><div class="vz-attacker">${zooSprite(c,true)}<strong>${esc(c.name)}</strong><span>${esc(c.nickname)}</span></div><div class="vz-entry-route"><span>ATTACK ROUTE</span><h3>${esc(q.entry)}</h3><p>Play the best defence for this route.</p><div class="vz-attack-arrow">→ → →</div></div><div class="vz-company"><span>▥</span><b>INNOVATIVIEW</b><small>KEEP THE COMPANY SAFE</small></div></div><div class="vz-choice-grid">${hand.map((id,i)=>{const c=d.defences.find(v=>v.id===id);return `<button type="button" class="vz-defence" data-zoo-action="answer" data-value="${id}" ${run.feedback?'disabled':''}><kbd>${i+1}</kbd><span>${c.icon}</span><strong>${esc(c.name)}</strong><small>${esc(c.copy)}</small></button>`}).join('')}</div><button type="button" class="vz-report" data-zoo-action="answer" data-value="report" ${run.feedback?'disabled':''}>⚑ REPORT TO IT <small>Always a helpful first move · +25</small></button>${feedback()}`;
  }
  if(run.phase==='checkBrief')return briefing('KEEPER CHECK','Two quick questions to seal your training. Your Malware Guide is always available if you want a refresher.','checkStart','TAKE THE KEEPER CHECK →');
  if(run.phase==='check'){const q=d.check[run.checkIndex];return `<p class="vz-eyebrow">KEEPER CHECK / ${run.checkIndex+1} OF 2</p><h3 class="vz-prompt">${esc(q.prompt)}</h3>${answers(q)}`}
  const report=zooSummary(run);return `<div class="vz-results"><p class="vz-eyebrow">MODULE 01 COMPLETE / VIRUS ZOO</p><div class="vz-grade">${report.grade}</div><h3>Your keeper report</h3><p>You collected every creature. Keep the Malware Guide nearby when something looks suspicious.</p><div class="vz-result-stats"><span><b>${run.collected.length}/12</b>CARDS COLLECTED</span><span><b>${report.correct}/15</b>MATCHES CORRECT</span><span><b>${report.credited}</b>MODULE POINTS</span></div><div class="vz-badges"><div class="${report.keeper?'earned':''}">✦ <b>ZOO KEEPER</b><small>${report.keeper?'Earned · all cards + 80% matching':'Collect all cards and reach 80% matching'}</small></div><div class="${report.perfect?'earned':''}">◆ <b>PERFECT DEFENCE</b><small>${report.perfect?'Earned · no company health lost':'Finish every duel without losing health'}</small></div></div><p class="vz-note">Raw score ${report.raw} · Module credit capped at ${d.scoreCap}.<br>Module 2 is unlocked for when its game is added.</p><div class="vz-result-actions">${button('OPEN MALWARE GUIDE','codex','','secondary')}${button('BACK TO LEVEL 3 →','finish')}</div></div>`;
 }
 function codexHtml(){return `<div class="vz-modal" role="dialog" aria-modal="true" aria-labelledby="vz-codex-title"><div class="vz-modal-panel"><div class="vz-section-head"><div><p class="vz-eyebrow">FIELD GUIDE / ${run.collected.length} OF 12</p><h3 id="vz-codex-title">Malware Guide</h3></div>${button('CLOSE ×','closeCodex','','secondary')}</div><p class="vz-note">Timed rounds are paused. Malware categories can overlap; these cards teach their defining behaviours.</p><div class="vz-codex-grid">${d.creatures.map(c=>run.collected.includes(c.id)?creatureButton(c.id,undefined,'inspect'):`<div class="vz-empty-slot"><b>?</b><span>UNDISCOVERED</span></div>`).join('')}</div>${codexCard?field(zooCard(codexCard)):''}</div></div>`}
 function draw(){
  if(!active()){dispose();return}clock(learning());const score=zooSummary(run).raw;
  const panel=content();el.innerHTML=`<section class="vz-shell" aria-labelledby="vz-title"><header class="vz-header" ${codex?'inert':''}><div><p class="vz-eyebrow">INNOVATIVIEW / MALWARE LAB</p><h2 id="vz-title">VIRUS <em>ZOO</em></h2></div><div class="vz-tools"><span class="vz-score">${score}<small>PTS</small></span>${button('GUIDE '+run.collected.length+'/12','codex','','secondary')}${!['entrance','results'].includes(run.phase)?button(paused?'RESUME':'Ⅱ','pause','','secondary'):''}</div></header><div class="vz-content" ${paused||codex?'inert':''}>${panel}</div>${paused&&!codex?`<div class="vz-pause"><h3>LAB ON HOLD</h3><p>Your timers are paused.</p>${button('RESUME →','pause')}</div>`:''}${codex?codexHtml():''}</section>`;
  if(codex)el.querySelector('[data-zoo-action="closeCodex"]')?.focus({preventScroll:true});
  layout();persist();last=performance.now();
 }
 function action(name,value){
  if(!active())return;
  if(name==='codex'){returnFocus=document.activeElement?.dataset?.zooAction||'codex';codex=true;codexCard=null;draw();return}
  if(name==='closeCodex'){codex=false;draw();el.querySelector(`[data-zoo-action="${returnFocus||'codex'}"]`)?.focus({preventScroll:true});return}
  if(name==='inspect'&&codex&&run.collected.includes(value)){codexCard=value;draw();el.querySelector('.vz-modal .vz-field')?.scrollIntoView({block:'nearest'});return}
  if(name==='pause'){paused=!paused;draw();return}
  if(paused||codex)return;
  if(name==='start'&&run.phase==='entrance'){run.phase='pack';sound('blip')}
  else if(name==='flip'&&run.phase==='pack'&&d.packs[run.pack].cards.includes(value)){
   selected=value;if(!run.opened.includes(value))run.opened.push(value);sound('blip');
  }else if(name==='scan'){if(zooScan(run,value))sound('ok');else return}
  else if(name==='packQuiz'&&run.phase==='pack'&&d.packs[run.pack].cards.every(id=>run.collected.includes(id)))run.phase='packQuiz';
  else if(name==='matchStart'&&['matchBrief','matchFailed'].includes(run.phase)){run.phase='match';run.matchIndex=0;run.matchTime=15;run.matchHearts=3;run.matchCombo=0;run.matchAnswers=[];run.feedback=null}
  else if(name==='duelStart'&&run.phase==='duelBrief')run.phase='duel';
  else if(name==='checkStart'&&run.phase==='checkBrief')run.phase='check';
  else if(name==='answer'){
   if(run.phase==='duel'&&value!=='report'&&!hand.includes(value))return;
   const response=zooRespond(run,['packQuiz','check'].includes(run.phase)?Number(value):value);if(!response)return;sound(response.correct||response.partial?'ok':'bad');
  }else if(name==='next'){if(!zooNext(run))return;if(run.phase==='results')sound('win')}
  else if(name==='finish'&&zooSummary(run).complete){const summary=zooSummary(run);dispose();finish(summary);return}
  else return;
  draw();if(name==='answer')el.querySelector('[data-zoo-action="next"]')?.focus({preventScroll:true});
  else if(['next','start','matchStart','duelStart','checkStart','packQuiz'].includes(name)){el.querySelector('.vz-header')?.scrollIntoView({block:'start'});el.querySelector('.vz-content button:not(:disabled)')?.focus({preventScroll:true})}
 }
 el.onclick=e=>{const b=e.target.closest('[data-zoo-action]');if(b&&!b.disabled)action(b.dataset.zooAction,b.dataset.value)};
 el.onkeydown=e=>{
  if(e.key==='Escape'&&codex){e.preventDefault();action('closeCodex');return}
  const root=codex?el.querySelector('.vz-modal'):el;
  if(codex&&e.key==='Tab'){const buttons=[...root.querySelectorAll('button:not(:disabled)')];const i=buttons.indexOf(document.activeElement);if(e.shiftKey&&i<=0){e.preventDefault();buttons.at(-1)?.focus()}else if(!e.shiftKey&&i===buttons.length-1){e.preventDefault();buttons[0]?.focus()}return}
  if(paused||codex)return;
  const selectors=run.phase==='pack'?'[data-zoo-action="flip"]':'[data-zoo-action="answer"]:not([data-value="report"])';const choices=[...el.querySelectorAll(selectors)].filter(b=>!b.disabled);
  if(/^[1-4]$/.test(e.key)&&choices[Number(e.key)-1]){e.preventDefault();const b=choices[Number(e.key)-1];action(b.dataset.zooAction,b.dataset.value)}
  else if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)&&choices.length){e.preventDefault();const i=choices.indexOf(document.activeElement),direction=['ArrowLeft','ArrowUp'].includes(e.key)?-1:1;choices[(i+direction+choices.length)%choices.length]?.focus()}
 };
 document.addEventListener('visibilitychange',visibility);
 window.addEventListener('resize',layout);
 interval=setInterval(()=>{
  if(!active()){dispose();return}const now=performance.now(),dt=(now-last)/1000;last=now;if(!learning())return;
  if(zooTick(run,dt)){sound('bad');draw()}else if(run.phase==='match'&&!run.feedback){const timer=el.querySelector('[data-zoo-time]'),meter=el.querySelector('[data-zoo-meter]');if(timer)timer.textContent=Math.ceil(run.matchTime)+'s';if(meter)meter.style.width=run.matchTime/15*100+'%'}
  saveClock+=dt;if(saveClock>=2){saveClock=0;persist()}
 },100);
 if(typeof MutationObserver!=='undefined'){observer=new MutationObserver(()=>{if(!active())dispose()});observer.observe(el.closest('#app')||el.parentNode,{childList:true,subtree:true})}
 draw();return {dispose};
}
function malwareCampaign(el,ctx){
 const saved=readVirusZoo(),report=saved?zooSummary(saved):null;
 return miniGameLevel(el,ctx,[
  {title:'Virus Zoo',copy:'Collect 12 creatures. Match the threats. Play your defence.',complete:!!report?.complete,mount:(e,c,done)=>virusZoo(e,c,r=>{c.add(r.credited,'Virus Zoo');done()})},
  {title:'Next discovery',copy:'Reserved for the next malware mini-game.',planned:true},
  {title:'Next defence',copy:'Reserved for the next malware mini-game.',planned:true},
  {title:'Firewall Defender',copy:'Blast the threats and protect safe traffic.',mount:(e,c)=>shoot(e,c)}
 ],{title:'Meet. Learn. Defend.',initialScore:report?.complete?report.credited:0});
}
