// Estilo Mix — JavaScript Principal

// ===== BARRA DE PROGRESSO DE SCROLL =====
const barraProgresso = document.createElement('div');
barraProgresso.id = 'progresso-scroll';
document.body.prepend(barraProgresso);

function atualizarProgresso() {
  const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
  const pct = scrollTotal > 0 ? (window.scrollY / scrollTotal) * 100 : 0;
  barraProgresso.style.width = pct + '%';
}

// ===== HEADER — adicionar classe ao rolar =====
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
  header.classList.toggle('rolado', window.scrollY > 50);
  atualizarProgresso();
}, { passive: true });

// ===== MENU MOBILE =====
const menuToggle = document.getElementById('menuToggle');
const navMenu    = document.getElementById('navMenu');
const navLinks   = document.querySelectorAll('.nav-link');

function fecharMenu() {
  navMenu.classList.remove('aberto');
  menuToggle.classList.remove('ativo');
  menuToggle.setAttribute('aria-expanded', 'false');
  navMenu.setAttribute('aria-hidden', 'true');
}

menuToggle.addEventListener('click', () => {
  const estaAberto = navMenu.classList.toggle('aberto');
  menuToggle.classList.toggle('ativo', estaAberto);
  menuToggle.setAttribute('aria-expanded', String(estaAberto));
  navMenu.setAttribute('aria-hidden', String(!estaAberto));
});

navLinks.forEach(link => link.addEventListener('click', fecharMenu));

document.addEventListener('click', (e) => {
  if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) fecharMenu();
});

// ===== LINK ATIVO NO DESKTOP NAV =====
const secoes       = document.querySelectorAll('section[id]');
const linksDesktop = document.querySelectorAll('.desktop-nav a');

function atualizarLinkAtivo() {
  const scrollY = window.scrollY + 100;
  secoes.forEach(secao => {
    const topo   = secao.offsetTop;
    const altura = secao.offsetHeight;
    const id     = secao.getAttribute('id');
    if (scrollY >= topo && scrollY < topo + altura) {
      linksDesktop.forEach(link => {
        link.classList.toggle('ativo', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}

window.addEventListener('scroll', atualizarLinkAtivo, { passive: true });

// ===== ANIMAÇÕES DE ENTRADA (Intersection Observer) =====
const observadorFade = new IntersectionObserver((entradas) => {
  entradas.forEach(entrada => {
    if (entrada.isIntersecting) entrada.target.classList.add('visivel');
  });
}, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' });

document.querySelectorAll(
  '.produto-card, .depoimento-card, .diferencial-item, .contato-card, .mvv-item'
).forEach(el => {
  el.classList.add('fade-in');
  observadorFade.observe(el);
});

// ===== UNDERLINE ANIMADO NOS TÍTULOS DAS SEÇÕES =====
const observadorTitulo = new IntersectionObserver((entradas) => {
  entradas.forEach(entrada => {
    if (entrada.isIntersecting) {
      entrada.target.classList.add('linha-ativa');
      observadorTitulo.unobserve(entrada.target);
    }
  });
}, { threshold: 0.6 });

document.querySelectorAll('.cabecalho-secao h2').forEach(h2 => {
  observadorTitulo.observe(h2);
});

// ===== CONTADOR ANIMADO NAS STATS =====
function animarContador(el) {
  const textoOriginal = el.textContent.trim();
  const match = textoOriginal.match(/\d+/);
  if (!match) return;

  const num     = parseInt(match[0]);
  const prefixo = textoOriginal.startsWith('+') ? '+' : '';
  const sufixo  = textoOriginal.replace(/[+\d]/g, '');
  const duracao = 1600;
  let inicioTs  = null;

  el.closest('.stat')?.classList.remove('animou');

  function tick(ts) {
    if (!inicioTs) inicioTs = ts;
    const prog  = Math.min((ts - inicioTs) / duracao, 1);
    const ease  = 1 - Math.pow(1 - prog, 3); // ease out cúbico
    const atual = Math.round(ease * num);
    el.textContent = prefixo + atual + sufixo;

    if (prog < 1) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = textoOriginal;
      // dispara o pop animation no final
      const stat = el.closest('.stat');
      if (stat) {
        stat.classList.add('animou');
        stat.addEventListener('animationend', () => stat.classList.remove('animou'), { once: true });
      }
    }
  }

  requestAnimationFrame(tick);
}

const sobreStats = document.querySelector('.sobre-stats');
if (sobreStats) {
  const observadorStats = new IntersectionObserver((entradas) => {
    entradas.forEach(entrada => {
      if (entrada.isIntersecting) {
        entrada.target.querySelectorAll('.stat strong').forEach(animarContador);
        observadorStats.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.5 });

  observadorStats.observe(sobreStats);
}

// ===== RIPPLE NOS BOTÕES =====
function criarRipple(e) {
  const btn = e.currentTarget;
  const old = btn.querySelector('.ripple');
  if (old) old.remove();

  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 2;
  const x    = e.clientX - rect.left - size / 2;
  const y    = e.clientY - rect.top  - size / 2;

  const ripple = document.createElement('span');
  ripple.className = 'ripple';
  ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px;`;
  btn.appendChild(ripple);

  setTimeout(() => ripple.remove(), 700);
}

document.querySelectorAll(
  '.btn-primario, .btn-contorno, .btn-whatsapp, .btn-instagram, .header-whatsapp'
).forEach(btn => {
  btn.addEventListener('click', criarRipple);
});
