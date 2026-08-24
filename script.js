const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ===== Track switcher (Professional / Freelance) =====
const tabs = document.querySelectorAll('.tab');
const indicator = document.querySelector('.tab-indicator');
const panels = {
  professional: document.getElementById('panel-professional'),
  freelance: document.getElementById('panel-freelance'),
};

function staggerCardsIn(panel) {
  const cards = panel.querySelectorAll('.project-card');
  cards.forEach((card, i) => {
    card.classList.add('card-pending');
    card.style.transitionDelay = prefersReducedMotion ? '0ms' : `${i * 70}ms`;
  });
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      cards.forEach((card) => card.classList.remove('card-pending'));
    });
  });
}

function revealPanel(panel) {
  panel.classList.remove('is-hidden');
  staggerCardsIn(panel);
}

function setTrack(track) {
  const next = panels[track];
  if (!next || !next.classList.contains('is-hidden')) return;

  tabs.forEach((tab) => {
    const isActive = tab.dataset.track === track;
    tab.classList.toggle('is-active', isActive);
    tab.setAttribute('aria-selected', String(isActive));
  });

  if (indicator) {
    indicator.style.transform = track === 'freelance' ? 'translateX(100%)' : 'translateX(0)';
  }

  const current = Object.values(panels).find((p) => p !== next && !p.classList.contains('is-hidden'));

  if (!current || prefersReducedMotion) {
    if (current) current.classList.add('is-hidden');
    revealPanel(next);
    return;
  }

  current.classList.add('is-fading-out');
  window.setTimeout(() => {
    current.classList.add('is-hidden');
    current.classList.remove('is-fading-out');
    revealPanel(next);
  }, 180);
}

tabs.forEach((tab) => {
  tab.addEventListener('click', () => setTrack(tab.dataset.track));
});

window.addEventListener('load', () => {
  if (indicator && tabs.length) {
    indicator.style.width = `${tabs[0].offsetWidth}px`;
  }
  // stagger in the initially-visible panel's cards on first load
  const initiallyVisible = Object.values(panels).find((p) => !p.classList.contains('is-hidden'));
  if (initiallyVisible) staggerCardsIn(initiallyVisible);
});

// ===== Cursor-reactive glow on project cards =====
if (!prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
  document.querySelectorAll('.project-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      card.style.setProperty('--my', `${e.clientY - rect.top}px`);
    });
  });
}

// ===== Scroll progress readout =====
const progressFill = document.querySelector('.scroll-progress-fill');

function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  if (progressFill) progressFill.style.width = `${pct}%`;
}

window.addEventListener('scroll', updateScrollProgress, { passive: true });
window.addEventListener('resize', updateScrollProgress);
updateScrollProgress();

// ===== Scroll reveal for sections =====
const revealTargets = document.querySelectorAll(
  '.lineup-head, .tabs, .stack-section, .contact'
);

revealTargets.forEach((el) => el.classList.add('reveal'));

if ('IntersectionObserver' in window && !prefersReducedMotion) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealTargets.forEach((el) => observer.observe(el));
} else {
  revealTargets.forEach((el) => el.classList.add('is-visible'));
}