// ===== Track switcher (Professional / Freelance) =====
const tabs = document.querySelectorAll('.tab');
const indicator = document.querySelector('.tab-indicator');
const panels = {
  professional: document.getElementById('panel-professional'),
  freelance: document.getElementById('panel-freelance'),
};

function setTrack(track) {
  tabs.forEach((tab) => {
    const isActive = tab.dataset.track === track;
    tab.classList.toggle('is-active', isActive);
    tab.setAttribute('aria-selected', String(isActive));
  });

  Object.entries(panels).forEach(([key, panel]) => {
    panel.classList.toggle('is-hidden', key !== track);
  });

  if (indicator) {
    indicator.style.transform = track === 'freelance' ? 'translateX(100%)' : 'translateX(0)';
  }
}

tabs.forEach((tab) => {
  tab.addEventListener('click', () => setTrack(tab.dataset.track));
});

// Match the indicator width to the first tab on load, in case fonts
// shift the rendered width slightly.
window.addEventListener('load', () => {
  if (indicator && tabs.length) {
    indicator.style.width = `${tabs[0].offsetWidth}px`;
  }
});

// ===== Scroll reveal =====
const revealTargets = document.querySelectorAll(
  '.lineup-head, .tabs, .track-panel, .stack-section, .contact'
);

revealTargets.forEach((el) => el.classList.add('reveal'));

if ('IntersectionObserver' in window) {
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