
/* ══════════════════════════════════════════
   CURSOR
══════════════════════════════════════════ */
const dot = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{
  mx=e.clientX;my=e.clientY;
  dot.style.left=mx+'px';dot.style.top=my+'px';
});
(function animCursor(){
  rx+=(mx-rx)*0.12;ry+=(my-ry)*0.12;
  ring.style.left=rx+'px';ring.style.top=ry+'px';
  requestAnimationFrame(animCursor);
})();
document.querySelectorAll('a,button,.plot-card:not(.booked),.gallery-item,.video-thumb').forEach(el=>{
  el.addEventListener('mouseenter',()=>ring.classList.add('hovered'));
  el.addEventListener('mouseleave',()=>ring.classList.remove('hovered'));
});
document.addEventListener('mousedown',()=>ring.classList.add('clicking'));
document.addEventListener('mouseup',()=>ring.classList.remove('clicking'));

/* ══════════════════════════════════════════
   NAV SCROLL
══════════════════════════════════════════ */
const nav=document.getElementById('mainNav');
window.addEventListener('scroll',()=>{
  if(window.scrollY>60)nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
},{passive:true});

/* MOBILE NAV */
const toggle=document.getElementById('navToggle');
const drawer=document.getElementById('mobileDrawer');
toggle.addEventListener('click',()=>{
  toggle.classList.toggle('open');
  drawer.classList.toggle('open');
  document.body.style.overflow=drawer.classList.contains('open')?'hidden':'';
});
document.querySelectorAll('.drawer-link').forEach(a=>{
  a.addEventListener('click',()=>{
    toggle.classList.remove('open');
    drawer.classList.remove('open');
    document.body.style.overflow='';
  });
});

/* ══════════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════════ */
const revealObserver=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')});
},{threshold:0.12});
document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.reveal-scale').forEach(el=>{
  revealObserver.observe(el);
});

/* ══════════════════════════════════════════
   COUNTER ANIMATION
══════════════════════════════════════════ */
function animCount(el,target,suffix=''){
  const dur=2000,fps=60,step=target/(dur/1000*fps);
  let cur=0;
  const id=setInterval(()=>{
    cur=Math.min(cur+step,target);
    el.textContent=Math.round(cur).toLocaleString()+(suffix?'+':'');
    if(cur>=target){el.textContent=target.toLocaleString()+(suffix?'+':'');clearInterval(id)}
  },1000/fps);
}
const counterObserver=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      const el=e.target;
      const val=parseInt(el.dataset.count);
      if(!isNaN(val)){
        animCount(el,val,val>100?true:false);
        counterObserver.unobserve(el);
      }
    }
  });
},{threshold:0.5});
document.querySelectorAll('[data-count]').forEach(el=>counterObserver.observe(el));

/* ══════════════════════════════════════════
   PARALLAX HERO
══════════════════════════════════════════ */
const heroBg=document.getElementById('heroBg');
window.addEventListener('scroll',()=>{
  const y=window.scrollY;
  if(y<window.innerHeight && heroBg){
    heroBg.style.transform=`translateY(${y*0.4}px)`;
  }
},{passive:true});

/* ══════════════════════════════════════════
   TESTIMONIALS
══════════════════════════════════════════ */
(function(){
  const track=document.getElementById('testimTrack');
  const cards=track?track.querySelectorAll('.testimonial-card'):[];
  const dotsEl=document.getElementById('tDots');
  const prevBtn=document.getElementById('tPrev');
  const nextBtn=document.getElementById('tNext');
  if(!cards.length)return;
  const visibleCount=()=>window.innerWidth<768?1:3;
  let current=0;
  const total=cards.length;
  function buildDots(){
    if(!dotsEl)return;
    dotsEl.innerHTML='';
    const pages=total-visibleCount()+1;
    for(let i=0;i<pages;i++){
      const d=document.createElement('button');
      d.className='t-dot'+(i===current?' active':'');
      d.setAttribute('aria-label','Slide '+(i+1));
      d.addEventListener('click',()=>goTo(i));
      dotsEl.appendChild(d);
    }
  }
  function goTo(idx){
    const pages=total-visibleCount()+1;
    current=Math.max(0,Math.min(idx,pages-1));
    const cardW=cards[0].getBoundingClientRect().width+20;
    track.style.transform=`translateX(-${current*cardW}px)`;
    dotsEl.querySelectorAll('.t-dot').forEach((d,i)=>d.classList.toggle('active',i===current));
  }
  prevBtn&&prevBtn.addEventListener('click',()=>goTo(current-1));
  nextBtn&&nextBtn.addEventListener('click',()=>goTo(current+1));
  window.addEventListener('resize',()=>{buildDots();goTo(current)});
  buildDots();
  // Auto-slide
  setInterval(()=>goTo(current+1>=total-visibleCount()+1?0:current+1),5000);
})();

/* ══════════════════════════════════════════
   GALLERY LIGHTBOX
══════════════════════════════════════════ */
const lightbox=document.getElementById('lightbox');
const lbImg=document.getElementById('lightboxImg');
document.querySelectorAll('.gallery-item').forEach(item=>{
  item.addEventListener('click',()=>{
    lbImg.src=item.dataset.src||'';
    lightbox.classList.add('open');
    document.body.style.overflow='hidden';
  });
});
document.getElementById('lightboxClose').addEventListener('click',closeLightbox);
lightbox.addEventListener('click',e=>{if(e.target===lightbox)closeLightbox()});
function closeLightbox(){lightbox.classList.remove('open');document.body.style.overflow=''}
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeLightbox();closeVideoModal()}});

/* ══════════════════════════════════════════
   VIDEO MODAL
══════════════════════════════════════════ */
const videoModal=document.getElementById('videoModal');
const videoFrame=document.getElementById('videoFrame');
function openVideoModal(){
  // Replace with actual YouTube embed URL
  videoFrame.src='https://www.youtube.com/embed/?autoplay=1&rel=0';
  videoModal.classList.add('open');
  document.body.style.overflow='hidden';
}
function closeVideoModal(){
  videoModal.classList.remove('open');
  videoFrame.src='';
  document.body.style.overflow='';
}
document.getElementById('modalClose').addEventListener('click',closeVideoModal);
videoModal.addEventListener('click',e=>{if(e.target===videoModal)closeVideoModal()});

/* ══════════════════════════════════════════
   CONTACT SUBMIT
══════════════════════════════════════════ */
document.querySelector('.submit-btn').addEventListener('click',function(){
  const name=document.querySelector('input[placeholder="Your Name"]').value.trim();
  const phone=document.querySelector('input[placeholder="Phone Number"]').value.trim();
  if(!name||!phone){
    this.textContent='Please fill in your name & phone ✗';
    this.style.background='rgba(192,57,43,0.9)';
    setTimeout(()=>{this.textContent='Request a Callback →';this.style.background=''},2500);
    return;
  }
  this.textContent='Request Sent! We\'ll call you soon ✓';
  this.style.background='rgba(31,143,71,0.9)';
  setTimeout(()=>{this.textContent='Request a Callback →';this.style.background=''},3000);
});


const slides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.hero-dot');

let currentSlide = 0;

function showSlide(index){

    slides.forEach(slide=>{
        slide.classList.remove('active');
    });

    dots.forEach(dot=>{
        dot.classList.remove('active');
    });

    slides[index].classList.add('active');
    dots[index].classList.add('active');
}

setInterval(()=>{

    currentSlide++;

    if(currentSlide >= slides.length){
        currentSlide = 0;
    }

    showSlide(currentSlide);

},5000);

particleColor = [
 "#D4A017", // Gold
 "#F2D27A", // Light Gold
 "#1E5A35", // Green
 "#2E7D4A"  // Light Green
];


