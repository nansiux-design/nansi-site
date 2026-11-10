let projects=[];
const container=document.getElementById('projects');
const modal=document.getElementById('case');
function sectionText(text){return text.split('\n\n').map(t=>`<p>${t}</p>`).join('')}
function openCase(i){const p=projects[i];document.getElementById('case-body').innerHTML=`<div class="eyebrow">${p.tag}</div><h2 id="case-title">${p.title}</h2><p class="case-role">${p.role}</p><img class="case-cover" src="assets/${p.image}" alt="${p.alt}">${p.sections.map((s,j)=>`<h3>0${j+1} / ${s[0]}</h3>${sectionText(s[1])}`).join('')}<a class="source-link" href="${p.url}" target="_blank" rel="noopener">Explore original case study ↗</a><p class="source-note">Adapted from my portfolio and updated résumé. Reflections labeled as next steps are proposed evaluations.</p>`;modal.showModal();modal.scrollTop=0;animateDialog()}
const categories=['commerce','travel','systems'];
const decisions=['Prioritize comprehension and trust at the point of financing choice.','Connect planning and life onboard through one continuous guest experience.','Use a shared foundation to address fragmented patterns across an internal platform.'];
const results=[['+17%','checkout conversion'],['250+','screens across the guest journey'],['+40%','delivery velocity']];
function renderProjects(filter='all'){
 container.replaceChildren();
 projects.forEach((p,i)=>{if(filter!=='all'&&categories[i]!==filter)return;
 const card=document.createElement('article');card.className='project';
 card.innerHTML=`<button class="project-visual" aria-label="Read ${p.title}"><img src="assets/${p.image}" alt="${p.alt}" loading="lazy"></button><div class="project-content"><div class="project-meta"><span>${['Commerce','Travel','Design systems'][i]}</span><span>${['2024–2025','2025–2026','2025'][i]}</span></div><h3>${p.title}</h3><p>${p.focus}</p><div class="decision"><span>Product lens</span>${decisions[i]}</div><div class="card-result"><strong>${results[i][0]}</strong><span>${results[i][1]}</span></div><div class="card-role">${p.role}</div><button class="text-button">Read ${i===0?'case study':'project summary'} →</button></div>`;
 card.querySelectorAll('button').forEach(b=>b.onclick=()=>openCase(i));container.append(card);animateCard(card,i);
 });
 document.getElementById('filter-status').textContent=`${container.children.length} project${container.children.length===1?'':'s'} shown`;
}
fetch('projects.json').then(r=>{if(!r.ok)throw Error('Content unavailable');return r.json()}).then(data=>{projects=data;renderProjects();document.querySelectorAll('[data-case]').forEach(b=>b.onclick=()=>openCase(Number(b.dataset.case)))}).catch(()=>{container.innerHTML='<p>Project stories could not load. <a href="https://nansisingh.framer.website/">Explore my original portfolio →</a></p>'});
document.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-filter]').forEach(f=>{f.classList.toggle('selected',f===b);f.setAttribute('aria-pressed',String(f===b))});renderProjects(b.dataset.filter)});
const themeButton=document.getElementById('theme-toggle');
function applyTheme(light){document.documentElement.dataset.theme=light?'light':'dark';themeButton.textContent=light?'☀':'☾';themeButton.setAttribute('aria-label',light?'Switch to dark theme':'Switch to light theme')}
try{applyTheme(localStorage.getItem('nansi-theme')==='light')}catch{applyTheme(false)}
themeButton.onclick=()=>{const light=document.documentElement.dataset.theme!=='light';applyTheme(light);try{localStorage.setItem('nansi-theme',light?'light':'dark')}catch{}};
modal.querySelector('.close').onclick=()=>modal.close();modal.addEventListener('click',e=>{if(e.target===modal){const r=modal.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)modal.close()}});
// Motion enhances the page; all content stays available without animation.
const motionPreference=window.matchMedia('(prefers-reduced-motion: reduce)');
const motionEase='cubic-bezier(0.16, 1, 0.3, 1)';
function animateCard(card,index){
 if(window.matchMedia('(prefers-reduced-motion: reduce)').matches||!card.animate)return;
 card.animate([{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}],{duration:420,delay:index*65,easing:motionEase,fill:'backwards'});
}
function animateDialog(){
 if(motionPreference.matches||!modal.animate)return;
 modal.animate([{opacity:0,transform:'translateY(12px) scale(.985)'},{opacity:1,transform:'translateY(0) scale(1)'}],{duration:260,easing:motionEase});
}
const motionGroups=document.querySelectorAll('.project-grid,.about,.company-list,#writing,#contact');
if('IntersectionObserver' in window){
 const revealObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{
  if(!entry.isIntersecting)return;
  revealObserver.unobserve(entry.target);
  if(!motionPreference.matches&&entry.target.animate)entry.target.animate([{opacity:.25,transform:'translateY(20px)'},{opacity:1,transform:'translateY(0)'}],{duration:650,easing:motionEase});
 })},{threshold:.08});
 motionGroups.forEach(el=>revealObserver.observe(el));
}
// Each timeline entry has its own reveal; the replay control makes it repeatable.
const timeline=document.querySelector('.timeline');
const timelineItems=[...timeline.querySelectorAll('details')];
let timelineRun=0;
function playTimeline(manual=false){
 timelineRun++;
 timeline.dataset.animationRun=String(timelineRun);
 timeline.classList.remove('timeline-playing');
 timelineItems.forEach(item=>item.getAnimations().forEach(a=>a.cancel()));
 if(!motionPreference.matches){
  requestAnimationFrame(()=>{requestAnimationFrame(()=>timeline.classList.add('timeline-playing'))});
  timelineItems.forEach((item,i)=>item.animate([
   {opacity:.15,transform:'translateX(-24px)'},
   {opacity:1,transform:'translateX(0)'}
  ],{duration:700,delay:i*140,easing:motionEase,fill:'backwards'}));
 }
 if(manual)document.getElementById('timeline-status').textContent=motionPreference.matches?'Timeline shown. Animations disabled by your reduced-motion preference.':'Experience timeline animation replayed.';
}
if('IntersectionObserver' in window){
 let visible=false;
 const timelineObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(entry.isIntersecting&&!visible)playTimeline();
  visible=entry.isIntersecting;
 }),{threshold:.15});
 timelineObserver.observe(timeline);
}
const expandingDetails=new WeakMap();
timelineItems.forEach(details=>{
 const summary=details.querySelector('summary'),body=details.querySelector('.timeline-body');
 summary.addEventListener('click',event=>{
  if(window.focusExperience)window.focusExperience(details.dataset.role);
  if(motionPreference.matches||!body.animate){if(!details.open)timelineItems.forEach(other=>{if(other!==details)other.open=false});return;}
  event.preventDefault();
  const previous=expandingDetails.get(details);
  const opening=previous?!previous.opening:!details.open;
  if(opening)timelineItems.forEach(other=>{if(other===details)return;const pending=expandingDetails.get(other);if(pending){pending.animation.onfinish=null;pending.animation.cancel();expandingDetails.delete(other);const otherBody=other.querySelector('.timeline-body');otherBody.style.height='';otherBody.style.overflow=''}other.open=false;});
  const startHeight=details.open?body.getBoundingClientRect().height:0;
  if(previous){previous.animation.onfinish=null;previous.animation.cancel()}
  details.open=true;
  body.style.overflow='hidden';
  body.style.height='auto';
  const fullHeight=body.getBoundingClientRect().height;
  const animation=body.animate([
   {height:startHeight+'px',opacity:opening?.2:1,transform:opening?'translateY(-8px)':'translateY(0)'},
   {height:(opening?fullHeight:0)+'px',opacity:opening?1:0,transform:opening?'translateY(0)':'translateY(-8px)'}
  ],{duration:400,easing:motionEase,fill:'both'});
  expandingDetails.set(details,{animation,opening});
  animation.onfinish=()=>{
   details.open=opening;animation.cancel();body.style.height='';body.style.overflow='';expandingDetails.delete(details);
  };
 });
});
const metricNodes=[...document.querySelectorAll('.hero-metrics strong')];
const metricValues=[17,3,32,5];
metricNodes.forEach(node=>{
 const label=node.textContent;node.dataset.finalValue=label;
 const accessible=document.createElement('span');accessible.className='sr-only';accessible.textContent=label;
 node.setAttribute('aria-hidden','true');node.parentNode.insertBefore(accessible,node);
});
function animateMetric(node,index){
 if(motionPreference.matches)return;
 const start=performance.now(),duration=1000;
 function tick(now){
  if(motionPreference.matches){node.textContent=node.dataset.finalValue;return}
  const t=Math.min((now-start)/duration,1),value=metricValues[index]*(1-Math.pow(1-t,3));
  node.textContent=index===0||index===2?'+'+Math.round(value)+'%':index===1?Math.round(value)+'×':value.toFixed(0);
  if(t<1)requestAnimationFrame(tick);else node.textContent=node.dataset.finalValue;
 }
 requestAnimationFrame(tick);
}
if('IntersectionObserver' in window){
 const metricObserver=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){metricObserver.disconnect();metricNodes.forEach(animateMetric)}},{threshold:.4});
 metricObserver.observe(document.querySelector('.hero-metrics'));
}
motionPreference.addEventListener('change',()=>{
 if(motionPreference.matches){timeline.classList.remove('timeline-playing');timelineItems.forEach(details=>{const pending=expandingDetails.get(details);if(pending){pending.animation.onfinish=null;details.open=pending.opening;pending.animation.cancel();expandingDetails.delete(details);const body=details.querySelector('.timeline-body');body.style.height='';body.style.overflow=''}});document.getAnimations().forEach(a=>a.cancel());metricNodes.forEach(n=>n.textContent=n.dataset.finalValue)}
});

// Enhance the static skill lists only when motion is available.
const skills=document.querySelector('.skills');
skills.querySelectorAll('.skills-list').forEach(list=>{
 const copy=list.cloneNode(true);
 copy.setAttribute('aria-hidden','true');
 list.after(copy);
});
skills.classList.add('is-enhanced');

const opportunityDot=document.querySelector('.opportunity-dot');
if('IntersectionObserver' in window){
 const animationObserver=new IntersectionObserver(entries=>{
  entries.forEach(({target,isIntersecting})=>target.classList.toggle('is-visible',isIntersecting));
 });
 animationObserver.observe(skills);
 animationObserver.observe(opportunityDot);
}else{
 skills.classList.add('is-visible');
 opportunityDot.classList.add('is-visible');
}
