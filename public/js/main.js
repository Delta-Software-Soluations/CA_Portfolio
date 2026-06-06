// Small UI animations: reveal on load and intersection observer for services
document.addEventListener('DOMContentLoaded', function () {
  const bodyDataset = document.body ? document.body.dataset : {};
  const supabaseUrl = bodyDataset.supabaseUrl || '';
  const supabaseAnonKey = bodyDataset.supabaseAnonKey || '';
  if (supabaseUrl && supabaseAnonKey) {
    window.__SUPABASE_PUBLIC_CONFIG__ = {
      url: supabaseUrl,
      anonKey: supabaseAnonKey
    };
  }

  // Staggered reveal for hero text
  document.querySelectorAll('.hero-copy .reveal').forEach(function(el, i){
    el.style.animationDelay = (i * 120) + 'ms';
  });

  // Observe service items and reveal when visible
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('show');
        obs.unobserve(entry.target);
      }
    });
  }, {threshold:0.2});

  document.querySelectorAll('.service-item').forEach(el=>obs.observe(el));
  document.querySelectorAll('.service-tile, .service-group, .services-intro').forEach(el=>obs.observe(el));

  // Service category filters
  const filterButtons = document.querySelectorAll('.filter-pill');
  const serviceGroups = document.querySelectorAll('.service-group');
  if(filterButtons.length && serviceGroups.length){
    const applyFilter = (filter) => {
      serviceGroups.forEach(group => {
        const match = filter === 'all' || group.dataset.group === filter;
        group.classList.toggle('is-filtered', !match);
      });
      filterButtons.forEach(button => {
        const active = button.dataset.filter === filter;
        button.classList.toggle('active', active);
        button.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
    };

    filterButtons.forEach(button => {
      button.addEventListener('click', () => applyFilter(button.dataset.filter));
    });

    applyFilter('all');
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', (e)=>{
      const target = document.querySelector(a.getAttribute('href'));
      if(target){
        e.preventDefault();
        target.scrollIntoView({behavior:'smooth',block:'start'});
      }
    });
  });

  // Service card expand/collapse
  function toggleCard(card){
    card.classList.toggle('open');
    const details = card.querySelector('.details');
    if(card.classList.contains('open')){
      // ensure max-height is large enough for content
      details.style.maxHeight = details.scrollHeight + 'px';
    } else {
      details.style.maxHeight = null;
    }
  }

  document.querySelectorAll('.service-card').forEach(card=>{
    card.addEventListener('click', (e)=>{
      // avoid toggling when clicking links or buttons inside
      if(e.target.closest('a') || e.target.closest('button')) return;
      toggleCard(card);
    });
    // keyboard support
    card.addEventListener('keydown', (e)=>{
      if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleCard(card); }
    });
    // details button
    const btn = card.querySelector('.open-detail');
    if(btn) btn.addEventListener('click', (ev)=>{ 
      ev.stopPropagation();
      // open modal with card content
      const title = btn.dataset.title || card.querySelector('h4')?.innerText || '';
      const details = btn.dataset.details || card.querySelector('.details')?.innerHTML || '';
      openServiceModal(title, details);
    });
  });

  // Card tilt / 3D micro-interaction
  const supportsTilt = window.matchMedia('(pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(supportsTilt){
    document.querySelectorAll('.service-card').forEach(card=>{
      let rect = null;
      card.addEventListener('mousemove', (e)=>{
        rect = rect || card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width; // 0..1
        const py = (e.clientY - rect.top) / rect.height; // 0..1
        const rotateY = (px - 0.5) * 8; // -4..4 deg
        const rotateX = (0.5 - py) * 8; // -4..4 deg
        const translateZ = 6; // subtle pop
        card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${translateZ}px)`;
      });
      card.addEventListener('mouseenter', ()=>{
        card.style.transition = 'transform 120ms cubic-bezier(.2,.9,.2,1)';
      });
      card.addEventListener('mouseleave', ()=>{
        card.style.transform = '';
        card.style.transition = 'transform 300ms cubic-bezier(.2,.9,.2,1)';
        rect = null;
      });
    });
  }

  // Service modal helpers
  const modal = document.getElementById('service-modal');
  const modalTitle = document.getElementById('service-modal-title');
  const modalBody = document.getElementById('service-modal-body');

  function openServiceModal(title, html){
    if(!modal) return;
    modalTitle.innerText = title;
    modalBody.innerHTML = html;
    modal.setAttribute('aria-hidden','false');
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    // focus first focusable element in modal
    const closeBtn = modal.querySelector('.service-modal-close');
    if(closeBtn) closeBtn.focus();
  }

  function closeServiceModal(){
    if(!modal) return;
    modal.setAttribute('aria-hidden','true');
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  // close handlers
  document.addEventListener('click', (e)=>{
    if(e.target.matches('[data-close]') || e.target.closest('.service-modal-close')){
      closeServiceModal();
    }
  });
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape') closeServiceModal();
  });
  
  // Mobile menu toggle
  const menuBtn = document.querySelector('.menu-btn');
  const mobileNav = document.querySelector('.mobile-nav');
  if(menuBtn && mobileNav){
    menuBtn.addEventListener('click', ()=>{
      const open = mobileNav.classList.toggle('open');
      mobileNav.setAttribute('aria-hidden', open ? 'false' : 'true');
    });
    // close when clicking outside
    document.addEventListener('click', (e)=>{
      if(!mobileNav.contains(e.target) && !menuBtn.contains(e.target)){
        mobileNav.classList.remove('open');
        mobileNav.setAttribute('aria-hidden','true');
      }
    });
  }

  // Mark active header nav link based on current path
  (function markActiveHeaderLink(){
    const path = window.location.pathname || '/';
    document.querySelectorAll('.main-nav a, .page-nav a').forEach(a=>{
      try{
        const href = a.getAttribute('href');
        if(!href) return;
        // Normalize anchors
        const url = new URL(href, window.location.origin);
        if(url.pathname === path || (href.startsWith('#') && path === '/')){
          a.setAttribute('aria-current','page');
        }
      }catch(e){}
    });
  })();

  // Inquiry form micro-interactions
  const inquiryForm = document.querySelector('.inquiry-form');
  if(inquiryForm){
    const submitBtn = inquiryForm.querySelector('.submit-btn');
    const requiredFields = inquiryForm.querySelectorAll('[required]');
    const emailField = inquiryForm.querySelector('input[type="email"]');
    const phoneField = inquiryForm.querySelector('input[type="tel"]');

    const validateLeadFields = () => {
      if(emailField){
        const hasEmailValue = emailField.value.trim().length > 0;
        emailField.setCustomValidity(hasEmailValue && emailField.validity.typeMismatch ? 'Please enter a valid email address.' : '');
      }
      if(phoneField){
        phoneField.value = phoneField.value.replace(/\D/g, '').slice(0, 10);
        const phoneValue = phoneField.value.trim();
        const phonePattern = new RegExp(phoneField.getAttribute('pattern') || '^[0-9]{10}$');
        const hasPhoneValue = phoneValue.length > 0;
        phoneField.setCustomValidity(hasPhoneValue && !phonePattern.test(phoneValue) ? 'Please enter a valid 10-digit phone number.' : '');
      }
    };

    inquiryForm.querySelectorAll('.field input, .field select, .field textarea').forEach(field=>{
      field.addEventListener('focus', ()=>field.parentElement.classList.add('focused'));
      field.addEventListener('blur', ()=>field.parentElement.classList.remove('focused'));
      field.addEventListener('input', validateLeadFields);
    });

    inquiryForm.addEventListener('submit', (e)=>{
      let firstInvalid = null;
      validateLeadFields();
      requiredFields.forEach(field=>{
        const valid = field.checkValidity();
        field.classList.toggle('invalid', !valid);
        if(!valid && !firstInvalid) firstInvalid = field;
      });

      if(!inquiryForm.checkValidity()){
        e.preventDefault();
        if(firstInvalid) firstInvalid.focus();
        inquiryForm.classList.add('shake');
        window.setTimeout(()=>inquiryForm.classList.remove('shake'), 500);
        return;
      }

      if(submitBtn){
        submitBtn.classList.add('loading');
        submitBtn.setAttribute('disabled', 'disabled');
      }
    });
  }
});
