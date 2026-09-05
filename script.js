
const $=(s,c=document)=>c.querySelector(s);
const $$=(s,c=document)=>[...c.querySelectorAll(s)];

const menu=$('.menu-toggle'), nav=$('.site-nav');
menu?.addEventListener('click',()=>{const o=nav.classList.toggle('open');menu.setAttribute('aria-expanded',o?'true':'false')});

const current=location.pathname.split('/').pop()||'index.html';
$$('.site-nav a').forEach(a=>{if(a.getAttribute('href')===current)a.classList.add('active')});

// Header hides on downward scroll.
const header=$('.site-header');let lastY=0;
addEventListener('scroll',()=>{const y=scrollY;if(header)header.style.transform=(y>lastY&&y>130)?'translateY(-112%)':'translateY(0)';lastY=y},{passive:true});

// Custom cursor.
const cursor=$('.cursor');
addEventListener('pointermove',e=>{if(cursor){cursor.style.left=e.clientX+'px';cursor.style.top=e.clientY+'px'}});
$$('a,button,.drawing').forEach(el=>{el.addEventListener('pointerenter',()=>cursor?.classList.add('active'));el.addEventListener('pointerleave',()=>cursor?.classList.remove('active'))});

// Scroll reveals.
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.08});
$$('.project-gate-copy>*,.practice-heading>*,.system-orbit,.patch,.relations-grid-home>*,.page-lead>*,.split-section>*,.ethos-list article,.operation-grid article,.fieldnote-grid article,.project-entry,.relation-roles article,.link-index a,.reference-list a,.open-call-grid>*').forEach(el=>{el.classList.add('reveal');io.observe(el)});

// Particulate field - slow, grayscale, responsive to pointer proximity.
const canvas=$('#spore-field');
if(canvas&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
 const ctx=canvas.getContext('2d');let w,h,dpr,pts=[],mx=-9999,my=-9999;
 function size(){dpr=Math.min(devicePixelRatio||1,2);w=canvas.width=innerWidth*dpr;h=canvas.height=innerHeight*dpr;pts=Array.from({length:Math.min(78,Math.floor(innerWidth/16))},()=>({x:Math.random()*w,y:Math.random()*h,r:(Math.random()*1.2+.2)*dpr,vx:(Math.random()-.5)*.09*dpr,vy:(Math.random()*.13+.03)*dpr}))}
 addEventListener('pointermove',e=>{mx=e.clientX*dpr;my=e.clientY*dpr});
 function tick(){ctx.clearRect(0,0,w,h);ctx.fillStyle='rgba(70,73,71,.42)';for(const p of pts){const dx=p.x-mx,dy=p.y-my,d=Math.hypot(dx,dy);if(d<120*dpr){p.x+=dx/(d||1)*.12;p.y+=dy/(d||1)*.12}p.x+=p.vx;p.y-=p.vy;if(p.y<0)p.y=h;if(p.x<0)p.x=w;if(p.x>w)p.x=0;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill()}requestAnimationFrame(tick)}
 size();addEventListener('resize',size);tick();
}

// Hero refraction lens: stable image with localized distortion.
const hero=$('.hero-plate'), refract=$('.hero-refract');
if(hero&&refract){
 hero.addEventListener('pointermove',e=>{const r=hero.getBoundingClientRect();const x=e.clientX-r.left,y=e.clientY-r.top;refract.style.clipPath=`circle(92px at ${x}px ${y}px)`;refract.style.transform=`translate(${(x/r.width-.5)*8}px,${(y/r.height-.5)*-5}px)`});
 hero.addEventListener('pointerleave',()=>refract.style.clipPath='circle(0px at 50% 50%)');
}

// Practice field parallax + contextual note.
const orbit=$('#system-orbit'), orbitNote=$('#orbit-note');
if(orbit){
 orbit.addEventListener('pointermove',e=>{const r=orbit.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;$$('.system-node',orbit).forEach((n,i)=>{const d=(i%3)+1;n.style.translate=`${x*d*3}px ${y*d*2}px`})});
 $$('.system-node',orbit).forEach(n=>{const show=()=>{if(orbitNote)orbitNote.textContent=n.dataset.note||''};n.addEventListener('pointerenter',show);n.addEventListener('focus',show)});
}

// Lightbox.
const triggers=$$('.lightbox-trigger'), box=$('.lightbox');
if(box&&triggers.length){
 const img=$('.lightbox-image',box);let cur=0;
 const openAt=i=>{cur=(i+triggers.length)%triggers.length;const t=triggers[cur];img.src=t.dataset.full||$('img',t)?.src;img.alt=$('img',t)?.alt||'';box.classList.add('open');box.setAttribute('aria-hidden','false');document.body.style.overflow='hidden'};
 triggers.forEach((t,i)=>t.addEventListener('click',()=>openAt(i)));
 $('.lightbox-close',box)?.addEventListener('click',()=>{box.classList.remove('open');box.setAttribute('aria-hidden','true');document.body.style.overflow=''});
 $('.lightbox-prev',box)?.addEventListener('click',()=>openAt(cur-1));$('.lightbox-next',box)?.addEventListener('click',()=>openAt(cur+1));
 box.addEventListener('click',e=>{if(e.target===box)$('.lightbox-close',box)?.click()});
 addEventListener('keydown',e=>{if(!box.classList.contains('open'))return;if(e.key==='Escape')$('.lightbox-close',box)?.click();if(e.key==='ArrowLeft')openAt(cur-1);if(e.key==='ArrowRight')openAt(cur+1)});
}

// Atmosphere audio.
// Audible autoplay is attempted. If the browser blocks it on the homepage,
// the cinematic entry pauses and presents a single deliberate "enter with sound" gesture.
const audio=$('#site-ambience'), sound=$('#sound-toggle'), stage=$('#entry-stage'), gate=$('#entry-gate');
let introStarted=false;
const state=on=>{if(sound)sound.dataset.on=on?'true':'false'};
async function playAudio(){if(!audio)return false;audio.volume=.16;try{await audio.play();state(true);return true}catch(e){state(false);return false}}
function runIntro(){if(introStarted)return;introStarted=true;stage?.classList.add('run')}
async function boot(){
 if(!stage){state(false);return}
 const ok=await playAudio();
 if(ok){runIntro()}else{
   setTimeout(()=>{if(!introStarted&&gate){gate.hidden=false}},220);
 }
}
document.addEventListener('DOMContentLoaded',boot,{once:true});
$('#enter-sound')?.addEventListener('click',async()=>{await playAudio();if(gate)gate.hidden=true;runIntro()});
$('#enter-silent')?.addEventListener('click',()=>{audio?.pause();state(false);if(gate)gate.hidden=true;runIntro()});
sound?.addEventListener('click',async e=>{e.stopPropagation();if(!audio)return;if(audio.paused)await playAudio();else{audio.pause();state(false)}});

// On inner pages, preserve the user's sound choice when possible.
if(!stage&&audio){
 const remembered=sessionStorage.getItem('ereipiapolis-sound');
 if(remembered==='on') playAudio();
 sound?.addEventListener('click',()=>setTimeout(()=>sessionStorage.setItem('ereipiapolis-sound',audio.paused?'off':'on'),0));
}
if(stage&&audio){
 audio.addEventListener('play',()=>sessionStorage.setItem('ereipiapolis-sound','on'));
 audio.addEventListener('pause',()=>sessionStorage.setItem('ereipiapolis-sound','off'));
}
