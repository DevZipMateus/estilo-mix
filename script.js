// Estilo Mix — JavaScript Principal

// ===== HEADER: adicionar classe ao rolar =====
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
  header.classList.toggle('rolado', window.scrollY > 50);
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
  if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
    fecharMenu();
  }
});

// ===== LINK ATIVO NO DESKTOP NAV =====
const secoes      = document.querySelectorAll('section[id]');
const linksDesktop = document.querySelectorAll('.desktop-nav a');

function atualizarLinkAtivo() {
  const scrollY = window.scrollY + 100;
  secoes.forEach(secao => {
    const topo   = secao.offsetTop;
    const altura = secao.offsetHeight;
    const id     = secao.getAttribute('id');

    if (scrollY >= topo && scrollY < topo + altura) {
      linksDesktop.forEach(link => {
        const esteLink = link.getAttribute('href') === `#${id}`;
        link.classList.toggle('ativo', esteLink);
      });
    }
  });
}

window.addEventListener('scroll', atualizarLinkAtivo, { passive: true });

// ===== ANIMAÇÕES DE ENTRADA (Intersection Observer) =====
const opcoes = {
  threshold: 0.12,
  rootMargin: '0px 0px -48px 0px'
};

const observador = new IntersectionObserver((entradas) => {
  entradas.forEach(entrada => {
    if (entrada.isIntersecting) {
      entrada.target.classList.add('visivel');
    }
  });
}, opcoes);

const elementosAnimados = document.querySelectorAll(
  '.produto-card, .depoimento-card, .diferencial-item, .contato-card, .mvv-item'
);

elementosAnimados.forEach(el => {
  el.classList.add('fade-in');
  observador.observe(el);
});
