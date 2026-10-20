'use strict';

// Content for the project detail dialogs. Keep facts aligned with the resume.
// Add real repository/demo links to the project card HTML only after verifying them.
const projects = {
  orders: {
    eyebrow: '01 / CLOUD-NATIVE SYSTEMS · JUN–SEP 2026',
    title: 'Real-Time Order Processing Platform',
    summary: 'A five-service, event-driven order-processing platform built to demonstrate reproducible infrastructure, asynchronous communication and reliable delivery workflows.',
    bullets: [
      'Designed five microservices on a three-node Amazon EKS cluster, with Kafka deployed through the Strimzi operator.',
      'Provisioned EKS infrastructure using Terraform and stored remote state in Amazon S3 with state locking.',
      'Implemented Jenkins CI and Argo CD GitOps deployments, automated drift correction, and Git-based rollbacks.',
      'Used KEDA consumer-lag autoscaling, Kubernetes health checks, network policies and secrets management.'
    ],
    tech: ['AWS EKS', 'Terraform', 'S3', 'Kubernetes', 'Kafka', 'Strimzi', 'Jenkins', 'Argo CD', 'KEDA']
  },
  logs: {
    eyebrow: '02 / DEVELOPER TOOLING · MAR–JUN 2026',
    title: 'Infrastructure Log Analysis CLI',
    summary: 'A Go-based infrastructure log analysis tool designed to accelerate pattern detection and reduce repetitive manual log inspection.',
    bullets: [
      'Parsed more than 10,000 log lines across services and classified over five categories of error patterns by severity.',
      'Reduced manual log review from two hours to 15 minutes per incident—an 85% triage-time reduction, as documented in the resume.',
      'Added eight unit tests using Go’s built-in testing package.',
      'Built a three-stage GitLab CI pipeline for test, build and artifact publishing.'
    ],
    tech: ['Go', 'GitLab CI', 'Unit tests', 'CLI', 'Incident analysis']
  },
  network: {
    eyebrow: '03 / NETWORK ARCHITECTURE · SEP–DEC 2025',
    title: 'High-Availability Service Provider Core Network',
    summary: 'A high-availability ISP core network lab built in GNS3 to validate routing design, customer handoff configuration and failure recovery.',
    bullets: [
      'Designed a virtual multi-router topology using OSPFv2 Area 0, an iBGP mesh in AS 65000 and eBGP customer handoffs in AS 65100.',
      'Configured BGP next-hop-self and point-to-point transit addressing.',
      'Validated sessions, advertisements and end-to-end paths using Wireshark, ping and traceroute.',
      'Tested routing convergence during transit-link failures and documented a repeatable enterprise onboarding template.'
    ],
    tech: ['GNS3', 'OSPFv2', 'iBGP', 'eBGP', 'Wireshark', 'Routing']
  }
};

const nav = document.getElementById('navigation');
const menuButton = document.getElementById('menuToggle');
const menuIcon = menuButton.querySelector('use');
function setMenu(open) {
  nav.classList.toggle('open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  menuIcon.setAttribute('href', open ? '#i-close' : '#i-menu');
  document.body.classList.toggle('menu-open', open);
}
menuButton.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
window.addEventListener('resize', () => { if (window.innerWidth > 760) setMenu(false); });

const filterButtons = [...document.querySelectorAll('[data-filter]')];
const projectCards = [...document.querySelectorAll('[data-project]')];
filterButtons.forEach(button => button.addEventListener('click', () => {
  const category = button.dataset.filter;
  filterButtons.forEach(filter => {
    const active = filter === button;
    filter.classList.toggle('active', active);
    filter.setAttribute('aria-pressed', String(active));
  });
  projectCards.forEach(card => {
    card.hidden = category !== 'all' && card.dataset.category !== category;
  });
}));

const modalBackdrop = document.getElementById('projectModal');
const modalClose = document.getElementById('closeModal');
let priorFocus = null;
function openProject(id) {
  const info = projects[id];
  if (!info) return;
  document.getElementById('modalEyebrow').textContent = info.eyebrow;
  document.getElementById('modalTitle').textContent = info.title;
  document.getElementById('modalSummary').textContent = info.summary;
  document.getElementById('modalBullets').replaceChildren(...info.bullets.map(text => {
    const li = document.createElement('li'); li.textContent = text; return li;
  }));
  document.getElementById('modalTech').replaceChildren(...info.tech.map(text => {
    const span = document.createElement('span'); span.textContent = text; return span;
  }));
  priorFocus = document.activeElement;
  modalBackdrop.hidden = false;
  document.body.classList.add('modal-open');
  modalClose.focus();
}
function closeProject() {
  if (modalBackdrop.hidden) return;
  modalBackdrop.hidden = true;
  document.body.classList.remove('modal-open');
  priorFocus?.focus();
}
document.querySelectorAll('[data-open-project]').forEach(button => button.addEventListener('click', () => openProject(button.dataset.openProject)));
modalClose.addEventListener('click', closeProject);
modalBackdrop.addEventListener('click', event => { if (event.target === modalBackdrop) closeProject(); });
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') { closeProject(); setMenu(false); }
  if (event.key === 'Tab' && !modalBackdrop.hidden) {
    const focusable = [...modalBackdrop.querySelectorAll('a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])')].filter(el => el.getClientRects().length);
    if (!focusable.length) return;
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});

const toast = document.getElementById('toast');
let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 2800);
}
document.getElementById('copyEmail')?.addEventListener('click', async () => {
  const email = 'sai.sudarshan18@gmail.com';
  try {
    await navigator.clipboard.writeText(email);
    showToast('Email address copied');
    document.getElementById('copyEmailLabel').textContent = 'Copied!';
    setTimeout(() => document.getElementById('copyEmailLabel').textContent = 'Copy email', 2800);
  } catch {
    showToast('Copy unavailable — email: ' + email);
  }
});

const progress = document.getElementById('readingProgress');
let scrolling = false;
function updateScroll() {
  const scrollRange = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${scrollRange > 0 ? Math.min(1,window.scrollY / scrollRange) : 0})`;
  scrolling = false;
}
window.addEventListener('scroll', () => {
  if (!scrolling) { requestAnimationFrame(updateScroll); scrolling = true; }
}, {passive:true});
updateScroll();

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } });
  }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });
  document.querySelectorAll('.reveal').forEach(item => revealObserver.observe(item));

  const navLinks = [...document.querySelectorAll('[data-nav]')];
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) navLinks.forEach(link => link.classList.toggle('current', link.getAttribute('href') === '#' + entry.target.id));
    });
  }, {rootMargin: '-20% 0px -65% 0px'});
  document.querySelectorAll('section[id]').forEach(section => sectionObserver.observe(section));
} else {
  document.querySelectorAll('.reveal').forEach(item => item.classList.add('is-visible'));
}

document.getElementById('currentYear').textContent = new Date().getFullYear();
