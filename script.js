/* =========================================================
   CLINIC WEBSITE — SCRIPT.JS
   ========================================================= */
(function(){
'use strict';

/* ── Scroll progress ── */
const prog = document.getElementById('prog');

/* ── Navbar ── */
const navbar = document.getElementById('navbar');

/* ── Back to top ── */
const btt = document.getElementById('btt');
if(btt) btt.addEventListener('click', () => window.scrollTo({top:0,behavior:'smooth'}));

/* ── Combined scroll ── */
window.addEventListener('scroll', function(){
  const s = window.scrollY, h = document.documentElement.scrollHeight - window.innerHeight;
  if(prog) prog.style.width = (h > 0 ? (s/h)*100 : 0) + '%';
  if(navbar) navbar.classList.toggle('scrolled', s > 60);
  if(btt) btt.classList.toggle('show', s > 400);
  updateActiveLink();
}, {passive:true});

/* ── Hamburger ── */
const burger = document.getElementById('burger');
const mobNav = document.getElementById('mobNav');
if(burger && mobNav){
  burger.addEventListener('click', function(){
    burger.classList.toggle('open');
    mobNav.classList.toggle('open');
    document.body.style.overflow = mobNav.classList.contains('open') ? 'hidden' : '';
  });
  mobNav.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){
      burger.classList.remove('open');
      mobNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ── Announcement close ── */
var annClose = document.getElementById('annClose');
if(annClose) annClose.addEventListener('click', function(){ document.getElementById('ann').remove(); });

/* ── Smooth scroll ── */
document.querySelectorAll('a[href^="#"]').forEach(function(a){
  a.addEventListener('click', function(e){
    var href = a.getAttribute('href');
    if(href === '#') return;
    var target = document.querySelector(href);
    if(target){
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.scrollY - ((navbar ? navbar.offsetHeight : 70) + 8);
      window.scrollTo({top:top, behavior:'smooth'});
    }
  });
});

/* ── Active nav link ── */
var sections = document.querySelectorAll('section[id]');
var navAs = document.querySelectorAll('.nav-links a[href^="#"]');
function updateActiveLink(){
  var cur = '';
  sections.forEach(function(s){ if(s.getBoundingClientRect().top <= (navbar ? navbar.offsetHeight : 70) + 80) cur = s.id; });
  navAs.forEach(function(a){ a.classList.toggle('active', a.getAttribute('href') === '#' + cur); });
}

/* ── Reveal on scroll ── */
var revEls = document.querySelectorAll('.reveal');
var revIO = new IntersectionObserver(function(entries){
  entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); revIO.unobserve(e.target); }});
}, {threshold:0.1, rootMargin:'0px 0px -40px 0px'});
revEls.forEach(function(el){ revIO.observe(el); });

/* ── Animated counters ── */
function animCount(el){
  var target = +el.dataset.target, dur = 2000, start = performance.now();
  function tick(now){
    var p = Math.min((now - start) / dur, 1);
    el.textContent = Math.round((1 - Math.pow(1-p, 3)) * target);
    if(p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
var cIO = new IntersectionObserver(function(entries){
  entries.forEach(function(e){ if(e.isIntersecting){ animCount(e.target); cIO.unobserve(e.target); }});
}, {threshold:.5});
document.querySelectorAll('.counter').forEach(function(c){ cIO.observe(c); });

/* ── Before/After slider ── */
var sliderEl = document.getElementById('baSlider');
var img2 = sliderEl ? sliderEl.querySelector('.ba-img2') : null;
var baLine = document.getElementById('baLine');
var baActive = false;
function moveBA(e){
  if(!baActive || !sliderEl) return;
  var r = sliderEl.getBoundingClientRect();
  var x = Math.max(0, Math.min((e.touches ? e.touches[0].clientX : e.clientX) - r.left, r.width));
  var p = (x / r.width) * 100;
  img2.style.clipPath = 'inset(0 ' + (100-p) + '% 0 0)';
  baLine.style.left = p + '%';
}
if(sliderEl){
  sliderEl.addEventListener('mousedown',  function(){ baActive = true; });
  sliderEl.addEventListener('touchstart', function(){ baActive = true; }, {passive:true});
  window.addEventListener('mouseup',   function(){ baActive = false; });
  window.addEventListener('touchend',  function(){ baActive = false; });
  sliderEl.addEventListener('mousemove', moveBA);
  sliderEl.addEventListener('touchmove', moveBA, {passive:true});
}

/* ── Scroll strip pause ── */
var st = document.getElementById('scrollTrack');
if(st){
  st.addEventListener('mouseenter', function(){ st.classList.add('paused'); });
  st.addEventListener('mouseleave', function(){ st.classList.remove('paused'); });
}

/* ── Services expand ── */
var srvBtn = document.getElementById('srvBtn');
var hiddenSrvs = document.querySelectorAll('.hidden-srv');

let isExpanded = false;

if (srvBtn) {
  srvBtn.addEventListener('click', function () {

    if (!isExpanded) {
      // 👉 SHOW
      hiddenSrvs.forEach(function (c, i) {
        setTimeout(function () {
          c.style.display = 'block';
          c.style.opacity = '0';
          c.style.transform = 'translateY(22px)';
          void c.offsetHeight;

          c.style.transition = 'opacity .45s ease, transform .45s ease';
          c.style.opacity = '1';
          c.style.transform = 'translateY(0)';
        }, i * 120);
      });

      srvBtn.innerHTML = 'View Less';
      isExpanded = true;

    } else {
      // 👉 HIDE
      hiddenSrvs.forEach(function (c, i) {
        c.style.opacity = '0';
        c.style.transform = 'translateY(22px)';

        setTimeout(() => {
          c.style.display = 'none';
        }, 300);
      });

      srvBtn.innerHTML = 'View All Treatments';
      isExpanded = false;

      // 👉 SCROLL BACK UP (important UX fix)
      window.scrollTo({
        top: document.getElementById('services').offsetTop - 45,
        behavior: 'smooth'
      });
    }

  });
}


/* ── FAQ accordion ── */
document.querySelectorAll('.faq-item').forEach(function(item){
  item.querySelector('.faq-q').addEventListener('click', function(){
    var wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(function(o){ o.classList.remove('open'); });
    if(!wasOpen) item.classList.add('open');
  });
});

/* ── Hero particles ── */
var pc = document.getElementById('particles');
if(pc){
  for(var i = 0; i < 20; i++){
    var d = document.createElement('div');
    d.className = 'p';
    var sz = Math.random() * 5 + 2;
    d.style.cssText = 'width:' + sz + 'px;height:' + sz + 'px;left:' + (Math.random()*100) + '%;top:' + (60+Math.random()*40) + '%;animation-duration:' + (7+Math.random()*12) + 's;animation-delay:' + (Math.random()*8) + 's;opacity:' + (.2+Math.random()*.5);
    pc.appendChild(d);
  }
}

})();

/* ── real-images page ── */
 /* ── Gallery Data ─────────────────────────── */
    const gallery = [
      {
        id: 1, category: 'skin',
        caption: 'Acne Scar Revision',
        tag: '6-Month Result',
        before: 'photos/piece_0_0.png',
        after:  'photos/piece1.png',
      },
      {
        id: 2, category: 'face',
        caption: 'Facial Rejuvenation',
        tag: '3-Month Result',
        before: 'photos/piece_0_1.png',
        after:  'photos/piece2.png',
      },
      {
        id: 3, category: 'hair',
        caption: 'Hair Restoration',
        tag: '12-Month Result',
        before: 'photos/piece_0_2.png',
        after:  'photos/piece3.png',
      },
      {
        id: 4, category: 'body',
        caption: 'Body Contouring',
        tag: '4-Month Result',
        before: 'photos/piece_0_3.png',
        after:  'photos/piece4.png',
      },
      {
        id: 5, category: 'skin',
        caption: 'Skin Brightening',
        tag: '2-Month Result',
        before: 'photos/piece_1_0.png',
        after:  'photos/piece5.png',
      },
      {
        id: 6, category: 'face',
        caption: 'Anti-Ageing Treatment',
        tag: '9-Month Result',
        before: 'photos/piece_1_1.png',
        after:  'photos/piece6.png',
      },
      {
        id: 7, category: 'hair',
        caption: 'Hair Loss Reversal',
        tag: '8-Month Result',
        before: 'photos/piece_1_2.png',
        after:  'photos/piece7.png',
      },
      {
        id: 8, category: 'body',
        caption: 'Stretch Mark Reduction',
        tag: '5-Month Result',
        before: 'photos/piece_1_3.png',
        after:  'photos/piece8.png',
      },
    ];
 
    /* ── Render Gallery ───────────────────────── */
    const grid = document.getElementById('galleryGrid');
 
    function buildCard(item) {
      const card = document.createElement('div');
      card.className = 'Real-result-card';
      card.dataset.category = item.category;
      card.innerHTML = `
        <div class="Real-card-images">
          <div class="Real-img-wrap">
            <img src="${item.before}" alt="Before – ${item.caption}" loading="lazy"/>
            <span class="Real-img-label">Before</span>
          </div>
          <div class="Real-img-wrap">
            <img src="${item.after}" alt="After – ${item.caption}" loading="lazy"/>
            <span class="Real-img-label Real-img-label--after">After</span>
          </div>
        </div>
        <div class="Real-card-footer">
          <span class="Real-card-caption">${item.caption}</span>
          <span class="Real-card-tag">${item.tag}</span>
          <div class="Real-card-expand-hint">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round">
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
            </svg>
          </div>
        </div>
      `;
      card.addEventListener('click', () => openModal(item));
      return card;
    }
 
    function renderGallery(filter = 'all') {
      grid.innerHTML = '';
      const items = filter === 'all' ? gallery : gallery.filter(i => i.category === filter);
      items.forEach(item => grid.appendChild(buildCard(item)));
    }
 
    renderGallery();
 
    /* ── Filter Tabs ──────────────────────────── */
    document.querySelectorAll('.Real-filter-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.Real-filter-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        renderGallery(tab.dataset.filter);
      });
    });
 
    /* ── Lightbox Modal ───────────────────────── */
    const overlay    = document.getElementById('modalOverlay');
    const modalImgs  = document.getElementById('modalImages');
    const modalCap   = document.getElementById('modalCaption');
    const modalMeta  = document.getElementById('modalMeta');
 
    function openModal(item) {
      modalImgs.innerHTML = `
        <div class="Real-modal-img-wrap">
          <img src="${item.before}" alt="Before"/>
          <span class="Real-modal-label">Before</span>
        </div>
        <div class="Real-modal-img-wrap">
          <img src="${item.after}" alt="After"/>
          <span class="Real-modal-label Real-modal-label--after">After</span>
        </div>
      `;
      modalCap.textContent  = item.caption;
      modalMeta.textContent = item.tag + ' · ' + item.category.charAt(0).toUpperCase() + item.category.slice(1);
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
 
    function closeModal() {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
 
    document.getElementById('modalClose').addEventListener('click', closeModal);
    overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
 
    /* ── Before / After Slider ────────────────── */
    const slider     = document.getElementById('baSlider');
    const afterWrap  = document.getElementById('baAfterWrap');
    const divider    = document.getElementById('baDivider');
    const handle     = document.getElementById('baHandle');
 
    let dragging = false;
 
    function setPos(x) {
      const rect  = slider.getBoundingClientRect();
      let   pct   = (x - rect.left) / rect.width;
      pct = Math.min(Math.max(pct, 0.04), 0.96);
      const pctPx = pct * 100;
 
      afterWrap.style.width   = pctPx + '%';
      divider.style.left      = pctPx + '%';
      handle.style.left       = pctPx + '%';
 
      // keep after-image visually correct
      afterWrap.querySelector('img').style.width     = slider.offsetWidth + 'px';
      afterWrap.querySelector('img').style.minWidth  = 'unset';
    }
 
    // Init at 50%
    window.addEventListener('load', () => setPos(slider.getBoundingClientRect().left + slider.offsetWidth * 0.5));
    window.addEventListener('resize', () => setPos(slider.getBoundingClientRect().left + (parseFloat(afterWrap.style.width) / 100) * slider.offsetWidth));
 
    slider.addEventListener('mousedown',  e => { dragging = true; setPos(e.clientX); });
    slider.addEventListener('touchstart', e => { dragging = true; setPos(e.touches[0].clientX); }, { passive: true });
 
    window.addEventListener('mousemove',  e => { if (dragging) setPos(e.clientX); });
    window.addEventListener('touchmove',  e => { if (dragging) setPos(e.touches[0].clientX); }, { passive: true });
 
    window.addEventListener('mouseup',  () => dragging = false);
    window.addEventListener('touchend', () => dragging = false);