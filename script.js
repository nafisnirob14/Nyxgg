const $=(s,root=document)=>root.querySelector(s);
const nav=$('#nav'),menu=$('.menu-toggle');
menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.textContent=open?'×':'☰'});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.textContent='☰'}));
const themeBtn=$('#themeBtn');
themeBtn.addEventListener('click',()=>{document.body.classList.toggle('light');themeBtn.innerHTML=document.body.classList.contains('light')?'<i class="fa-solid fa-moon icon" aria-hidden="true"></i>':'<i class="fa-solid fa-sun icon" aria-hidden="true"></i>';themeBtn.setAttribute('aria-label',document.body.classList.contains('light')?'Switch to dark theme':'Switch to light theme')});
const pickerBtn=$('#themePickerBtn'),themeMenu=$('#themeMenu'),animeVideo=$('#animeVideo');
const transition=$('#themeTransition'),transitionTitle=$('#transitionTitle'),transitionSubtitle=$('#transitionSubtitle');
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const themeConfig={
 normal:{label:'NORMAL',subtitle:'CLEAN · MINIMAL · EDITORIAL',video:null,accent:'#a78bfa'},
 zenitsu:{label:'ZENITSU',subtitle:'THUNDER BREATHING · FIRST FORM',video:'assets/video/zenitsu.mp4',accent:'#f4c65e'},
 eren:{label:'EREN YEAGER',subtitle:'FREEDOM · THE ATTACK TITAN',video:'assets/video/eren.mp4',accent:'#d85d52'},
 itachi:{label:'ITACHI UCHIHA',subtitle:'MOONLIGHT · THE SHARINGAN',video:'assets/video/itachi.mp4',accent:'#d96b85'}
};
let activeTheme='normal',transitionTimer=null;
function closeThemeMenu(){themeMenu.hidden=true;pickerBtn.setAttribute('aria-expanded','false')}
pickerBtn.addEventListener('click',()=>{
 const open=themeMenu.hidden;
 themeMenu.hidden=!open;pickerBtn.setAttribute('aria-expanded',String(open));
});
document.addEventListener('click',e=>{if(!e.target.closest('.theme-picker'))closeThemeMenu()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeThemeMenu()});
function syncThemeOptions(){
 document.querySelectorAll('.theme-option').forEach(btn=>{
  const active=btn.dataset.theme===activeTheme;
  btn.classList.toggle('active',active);btn.setAttribute('aria-pressed',String(active));
 });
 pickerBtn.innerHTML=`<i class="fa-solid fa-palette icon" aria-hidden="true"></i><span class="mode-label">${activeTheme==='normal'?'Customize':themeConfig[activeTheme].label}</span><i class="fa-solid fa-chevron-down icon picker-chevron" aria-hidden="true"></i>`;
 pickerBtn.setAttribute('aria-expanded',String(!themeMenu.hidden));
}
function playThemeTransition(theme){
 if(reducedMotion)return;
 const cfg=themeConfig[theme];
 transition.style.setProperty('--transition-accent',cfg.accent);
 transitionTitle.textContent=cfg.label;
 transitionSubtitle.textContent=cfg.subtitle;
 transition.classList.remove('play');void transition.offsetWidth;transition.classList.add('play');
 clearTimeout(transitionTimer);transitionTimer=setTimeout(()=>transition.classList.remove('play'),1780);
}
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
function resetCustomStyle(){
 document.body.classList.remove('custom-theme','custom-bg-midnight','custom-bg-graphite','custom-bg-cream','custom-bg-ocean','custom-font-space','custom-font-dm','custom-font-serif','custom-font-condensed');
 document.body.style.removeProperty('--custom-accent');
 try{localStorage.removeItem('nirob-customizer')}catch(e){}
 const accent=$('#accentPicker'),bg=$('#backgroundSelect'),font=$('#fontSelect');
 if(accent)accent.value='#a78bfa';if(bg)bg.value='midnight';if(font)font.value='space';
}
async function applyTheme(theme){
 if(!themeConfig[theme]||theme===activeTheme)return;
 closeThemeMenu();playThemeTransition(theme);
 await wait(reducedMotion?0:570);
 activeTheme=theme;resetCustomStyle();
 document.body.classList.remove('theme-zenitsu','theme-eren','theme-itachi','anime-mode');
 if(theme!=='normal')document.body.classList.add('theme-'+theme);
 const cfg=themeConfig[theme];
 if(cfg.video){
  const current=animeVideo.getAttribute('src');
  if(current!==cfg.video){animeVideo.pause();animeVideo.removeAttribute('src');animeVideo.load();animeVideo.src=cfg.video;animeVideo.load()}
  try{await animeVideo.play()}catch(err){console.info('Video autoplay was blocked by the browser; the theme styling remains active.',err)}
 }else{animeVideo.pause();animeVideo.removeAttribute('src');animeVideo.load()}
 syncThemeOptions();
}
document.querySelectorAll('.theme-option').forEach(btn=>btn.addEventListener('click',()=>applyTheme(btn.dataset.theme)));
syncThemeOptions();
const accentPicker=$('#accentPicker'),backgroundSelect=$('#backgroundSelect'),fontSelect=$('#fontSelect');
const customizerStatus=$('#customizerStatus');
const customClasses=['custom-bg-midnight','custom-bg-graphite','custom-bg-cream','custom-bg-ocean','custom-font-space','custom-font-dm','custom-font-serif','custom-font-condensed'];
function applyCustomStyle(settings,save=true){
 if(!settings)return;
 document.body.classList.add('custom-theme');
 document.body.classList.remove(...customClasses);
 document.body.classList.add('custom-bg-'+(settings.background||'midnight'),'custom-font-'+(settings.font||'space'));
 document.body.style.setProperty('--custom-accent',settings.accent||'#a78bfa');
 if(accentPicker)accentPicker.value=settings.accent||'#a78bfa';
 if(backgroundSelect)backgroundSelect.value=settings.background||'midnight';
 if(fontSelect)fontSelect.value=settings.font||'space';
 if(customizerStatus)customizerStatus.textContent='Your style is active';
 if(save){try{localStorage.setItem('nirob-customizer',JSON.stringify(settings))}catch(e){}}
}
function readCustomStyle(){return{accent:accentPicker.value,background:backgroundSelect.value,font:fontSelect.value}}
[accentPicker,backgroundSelect,fontSelect].forEach(control=>{control.addEventListener('input',()=>applyCustomStyle(readCustomStyle()));control.addEventListener('change',()=>applyCustomStyle(readCustomStyle()))});
$('#resetCustomizer').addEventListener('click',()=>{resetCustomStyle();if(customizerStatus)customizerStatus.textContent='Original theme restored'});
try{const saved=JSON.parse(localStorage.getItem('nirob-customizer')||'null');if(saved)applyCustomStyle(saved,false)}catch(e){}
let bengali=false;$('#langBtn').addEventListener('click',()=>{bengali=!bengali;document.documentElement.lang=bengali?'bn':'en';$('#langBtn').textContent=bengali?'EN':'বাংলা';document.querySelectorAll('[data-en][data-bn]').forEach(el=>el.innerHTML=bengali?el.dataset.bn:el.dataset.en)});
$('#year').textContent=new Date().getFullYear();
document.querySelectorAll('a[href^="#"]').forEach(link=>link.addEventListener('click',event=>{
 const target=document.querySelector(link.getAttribute('href'));
 if(target){event.preventDefault();target.scrollIntoView({behavior:reducedMotion?'auto':'smooth',block:'start'});history.replaceState(null,'',link.getAttribute('href'))}
}));
const progress=$('#scrollProgress');
const updateProgress=()=>{const max=document.documentElement.scrollHeight-window.innerHeight;progress.style.width=(max>0?(window.scrollY/max)*100:0)+'%'};
window.addEventListener('scroll',updateProgress,{passive:true});updateProgress();
const form=$('#contactForm');form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;const d=new FormData(form);const subject=encodeURIComponent('Portfolio enquiry from '+d.get('name'));const body=encodeURIComponent('Name: '+d.get('name')+'\nEmail: '+d.get('email')+'\n\n'+d.get('message'));$('#formNote').textContent='Opening your email app… If it does not open, email nafisnirob14@gmail.com directly.';window.location.href='mailto:nafisnirob14@gmail.com?subject='+subject+'&body='+body});
const panel=$('#terminalPanel'),out=$('#terminalOutput');$('#terminalLaunch').addEventListener('click',()=>{panel.classList.add('open');panel.setAttribute('aria-hidden','false');$('#terminalInput').focus()});$('#terminalClose').addEventListener('click',()=>{panel.classList.remove('open');panel.setAttribute('aria-hidden','true')});
const commands={help:'Commands: about, skills, work, contact, socials, clear, date',about:'Nafis Islam Nirob — student, creator and digital enthusiast from Bangladesh.',skills:'Social media · GFX & graphic design · Community management · Tournament management · Leadership · Digital marketing.',work:'Explore the selected work section for photography, Minecraft and creative explorations.',contact:'Email: nafisnirob14@gmail.com',socials:'GitHub: github.com/nafisnirob14 · YouTube: @slayerxxx2026 · Instagram: @lwky._.nirob',date:new Date().toLocaleDateString()};
$('#terminalForm').addEventListener('submit',e=>{e.preventDefault();const input=$('#terminalInput'),cmd=input.value.trim().toLowerCase();if(!cmd)return;const line=document.createElement('p');line.textContent='visitor@nirob:~$ '+cmd;out.append(line);const result=document.createElement('p');if(cmd==='clear'){out.innerHTML='';input.value='';return}result.textContent=commands[cmd]||'Command not found. Type help to see available commands.';out.append(result);input.value='';out.scrollTop=out.scrollHeight});
const revealTargets=document.querySelectorAll('.section,.work-card,.skill-card,.timeline article,.venture-grid article');revealTargets.forEach((el,i)=>{el.classList.add('reveal');if(el.matches('.skill-card,.work-card,.venture-grid article'))el.style.transitionDelay=(Math.min(i%6,4)*65)+'ms'});if('IntersectionObserver'in window){const io=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');io.unobserve(entry.target)}}),{threshold:.08});revealTargets.forEach(el=>io.observe(el))}else revealTargets.forEach(el=>el.classList.add('visible'));
const dot=$('.cursor-dot'),ring=$('.cursor-ring');if(matchMedia('(hover:hover) and (pointer:fine)').matches){let x=0,y=0,rx=0,ry=0;document.addEventListener('mousemove',e=>{x=e.clientX;y=e.clientY;dot.style.transform=`translate(${x-2}px,${y-2}px)`});function tick(){rx+=(x-rx)*.18;ry+=(y-ry)*.18;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(tick)}tick();document.querySelectorAll('a,button').forEach(el=>{el.addEventListener('mouseenter',()=>{ring.style.width='42px';ring.style.height='42px'});el.addEventListener('mouseleave',()=>{ring.style.width='28px';ring.style.height='28px'})})}
