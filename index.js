/* ==========================================================================
   Stonnegams — script.js
   Sommaire
   1. Outils            6. Compteurs animés        11. Filtre des réalisations
   2. Menu mobile       7. Texte qui s’écrit       12. Lightbox des images
   3. Défilement        8. Parallaxe flottante     13. Formulaire de contact
   4. Lien actif        9. Cartes interactives
   5. Apparitions      10. Boutons magnétiques
   ========================================================================== */
(function () {
  'use strict';

  /* ===== 1. Outils ===== */
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var toastTimer;

  function toast(msg) {
    var t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('show'); }, 3500);
  }

  /* ===== 2. Menu mobile ===== */
  var burger = $('#burger');
  var menu = $('#menu');

  function setMenu(open) {
    menu.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.textContent = open ? '✕' : '☰';
  }
  burger.addEventListener('click', function () { setMenu(!menu.classList.contains('open')); });
  $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });

  /* ===== 3. Défilement : progression, en-tête, boutons flottants ===== */
  var header = $('header');
  var progress = $('#progress');
  var toTop = $('#toTop');
  var quote = $('#quote');
  var contact = $('#contact');
  var ticking = false;

  function onScroll() {
    var y = window.scrollY;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')';
    header.classList.toggle('scrolled', y > 10);
    toTop.classList.toggle('show', y > 600);
    quote.classList.toggle('show', y > 400 && contact.getBoundingClientRect().top > window.innerHeight * 0.9);
  }
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { onScroll(); ticking = false; });
  }, { passive: true });
  onScroll();

  /* ===== 4. Lien actif dans le menu ===== */
  var spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      $$('#menu a').forEach(function (a) {
        a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id);
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach(function (s) { spy.observe(s); });

  /* ===== 5. Apparition progressive au défilement ===== */
  var revealSel = 'h2, .card, .step, details, .tabs, .note, .vis, .ct, form, .split > div';
  var revealObs = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      obs.unobserve(e.target);
    });
  }, { threshold: 0.12 });

  if (!reduce) {
    $$(revealSel).forEach(function (el) {
      var rang = Array.prototype.indexOf.call(el.parentNode.children, el);
      el.classList.add('reveal');
      el.style.setProperty('--d', (rang % 5) * 80 + 'ms');
      revealObs.observe(el);
    });
  }

  /* ===== 6. Compteurs animés ===== */
  function count(el) {
    var end = Number(el.dataset.count);
    var suffix = el.dataset.suffix || '';
    var start = null;
    if (reduce) { el.textContent = end + suffix; return; }
    requestAnimationFrame(function step(t) {
      if (start === null) start = t;
      var p = Math.min((t - start) / 1400, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + suffix;
      if (p < 1) requestAnimationFrame(step);
    });
  }
  var countObs = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      count(e.target);
      obs.unobserve(e.target);
    });
  }, { threshold: 0.6 });
  $$('[data-count]').forEach(function (el) { countObs.observe(el); });

  /* ===== 7. Texte qui s’écrit (hero) ===== */
  var typed = $('#typed');
  var words = ['votre activité', 'votre école', 'votre hôtel', 'votre restaurant', 'votre entreprise'];
  var wi = 0, ci = 0, deleting = false;

  function type() {
    var word = words[wi];
    var wait = deleting ? 45 : 90;
    ci += deleting ? -1 : 1;
    typed.textContent = word.slice(0, ci);
    if (!deleting && ci === word.length) { deleting = true; wait = 1600; }
    else if (deleting && ci === 0) { deleting = false; wi = (wi + 1) % words.length; wait = 350; }
    setTimeout(type, wait);
  }
  if (!reduce) { typed.textContent = ''; type(); }

  /* ===== 8. Éléments flottants : parallaxe à la souris ===== */
  if (canHover && !reduce) {
    var hero = $('.hero');
    var chips = $$('.chip');
    var orbs = $$('.bg-orbs span');

    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      chips.forEach(function (chip) {
        var d = Number(chip.dataset.depth);
        chip.style.setProperty('--tx', x * d + 'px');
        chip.style.setProperty('--ty', y * d + 'px');
      });
    });
    window.addEventListener('pointermove', function (e) {
      var x = e.clientX / window.innerWidth - 0.5;
      var y = e.clientY / window.innerHeight - 0.5;
      orbs.forEach(function (o, i) { o.style.translate = x * (i + 1) * -40 + 'px ' + y * (i + 1) * -40 + 'px'; });
    });
  }

  /* ===== 9. Cartes : halo lumineux et inclinaison 3D ===== */
  function tiltable(el) {
    return el.classList.contains('vis') || el.parentNode.classList.contains('g');
  }
  if (canHover && !reduce) {
    $$('.card, .vis').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width;
        var py = (e.clientY - r.top) / r.height;
        el.style.setProperty('--mx', px * 100 + '%');
        el.style.setProperty('--my', py * 100 + '%');
        if (tiltable(el)) {
          el.style.transform = 'perspective(800px) rotateX(' + (0.5 - py) * 6 + 'deg) rotateY(' + (px - 0.5) * 8 + 'deg) translateY(-4px)';
        }
      });
      el.addEventListener('pointerleave', function () { el.style.transform = ''; });
    });

    /* ===== 10. Boutons magnétiques ===== */
    $$('.btn').forEach(function (b) {
      b.addEventListener('pointermove', function (e) {
        var r = b.getBoundingClientRect();
        b.style.translate = (e.clientX - r.left - r.width / 2) * 0.18 + 'px ' + (e.clientY - r.top - r.height / 2) * 0.3 + 'px';
      });
      b.addEventListener('pointerleave', function () { b.style.translate = ''; });
    });
  }

  /* ===== 11. Filtre des réalisations ===== */
  var tabs = $$('.tabs button');
  var projects = $$('.proj');

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var f = tab.dataset.filter;
      tabs.forEach(function (t) {
        var on = t === tab;
        t.classList.toggle('on', on);
        t.setAttribute('aria-pressed', String(on));
      });
      projects.forEach(function (p) {
        var show = f === 'Tous' || p.dataset.cat === f;
        p.hidden = !show;
        p.classList.remove('pop');
        if (show) { void p.offsetWidth; p.classList.add('pop'); }
      });
    });
  });

  /* ===== 12. Lightbox des images ===== */
  var lb = $('#lightbox');
  var lbImg = $('img', lb);
  var lbCap = $('p', lb);
  var lastFocus = null;

  function openLightbox(fig) {
    var img = $('img', fig);
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbCap.textContent = img.alt;
    lastFocus = document.activeElement;
    lb.hidden = false;
    $('.lb-close', lb).focus();
  }
  function closeLightbox() {
    lb.hidden = true;
    if (lastFocus) lastFocus.focus();
  }
  $$('.proj-media').forEach(function (fig) {
    fig.addEventListener('click', function () { openLightbox(fig); });
    fig.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(fig); } });
  });
  lb.addEventListener('click', function (e) {
    if (e.target === lb || e.target.classList.contains('lb-close')) closeLightbox();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !lb.hidden) closeLightbox(); });

  /* ===== 13. Formulaire de contact ===== */
  var form = $('#f');

  form.addEventListener('input', function (e) { e.target.classList.remove('err'); });
  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var ok = true;
    $$('input, textarea', form).forEach(function (f) {
      var bad = !f.value.trim() || (f.type === 'email' && !/^\S+@\S+\.\S+$/.test(f.value));
      f.classList.toggle('err', bad);
      if (bad) ok = false;
    });
    if (!ok) { toast('Merci de compléter correctement les champs en rouge.'); return; }
    var nom = $('#n').value, mail = $('#e').value, msg = $('#m').value;
    location.href = 'mailto:stonnegams@gmail.com?subject=' + encodeURIComponent('Demande de devis — ' + nom) +
      '&body=' + encodeURIComponent(msg + '\n\n' + nom + ' (' + mail + ')');
    toast('Votre messagerie va s’ouvrir pour envoyer la demande.');
  });
})();