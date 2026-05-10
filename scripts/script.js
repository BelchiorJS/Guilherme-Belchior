/**
 * script.js — JavaScript puro (sem frameworks)
 * Portfólio de Guilherme Ramos Belchior de Oliveira
 *
 * Funcionalidades:
 *  1. Menu hamburguer responsivo (mobile)
 *  2. Alternância de tema claro / escuro
 *  3. Destaque do link ativo no menu conforme scroll (Intersection Observer)
 *  4. Animação de entrada das seções no scroll
 *  5. Validação do formulário de contato
 *  6. Simulação do envio do formulário
 *  7. Ano dinâmico no rodapé
 */

// ── 1. REFERÊNCIAS AOS ELEMENTOS DO DOM ──────────────────────────────────────

const menuToggle  = document.getElementById('menuToggle');   // Botão hamburguer
const mainNav     = document.getElementById('mainNav');       // Menu de navegação
const themeToggle = document.getElementById('themeToggle');  // Botão de tema
const contactForm = document.getElementById('contactForm');  // Formulário de contato
const formSuccess = document.getElementById('formSuccess');  // Mensagem de sucesso
const yearSpan    = document.getElementById('year');          // Span do ano no rodapé

// Campos do formulário
const campoNome     = document.getElementById('nome');
const campoEmail    = document.getElementById('email');
const campoMensagem = document.getElementById('mensagem');

// Mensagens de erro dos campos
const erroNome     = document.getElementById('erroNome');
const erroEmail    = document.getElementById('erroEmail');
const erroMensagem = document.getElementById('erroMensagem');

// ── 2. ANO DINÂMICO NO RODAPÉ ─────────────────────────────────────────────────
// Evita ter que atualizar manualmente o ano no HTML
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// ── 3. MENU HAMBURGUER (MOBILE) ───────────────────────────────────────────────
// Ao clicar no botão, adiciona/remove a classe 'open' no menu

if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', function () {
    // Alterna abertura/fechamento do menu
    const isOpen = mainNav.classList.toggle('open');

    // Atualiza aria-label para acessibilidade
    menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
  });

  // Fecha o menu ao clicar em qualquer link de navegação
  mainNav.querySelectorAll('.nav__link').forEach(function (link) {
    link.addEventListener('click', function () {
      mainNav.classList.remove('open');
    });
  });
}

// ── 4. TEMA CLARO / ESCURO ─────────────────────────────────────────────────────
// Salva a preferência no localStorage para manter entre recarregamentos

function aplicarTema(tema) {
  if (tema === 'dark') {
    document.body.classList.add('dark');
    themeToggle.textContent = '☀️';     // Ícone de sol no modo escuro
  } else {
    document.body.classList.remove('dark');
    themeToggle.textContent = '🌙';     // Ícone de lua no modo claro
  }
}

// Ao carregar a página, verifica se há preferência salva
const temaSalvo = localStorage.getItem('tema') || 'light';
aplicarTema(temaSalvo);

// Ao clicar no botão, alterna o tema e salva no localStorage
if (themeToggle) {
  themeToggle.addEventListener('click', function () {
    const temaAtual = document.body.classList.contains('dark') ? 'dark' : 'light';
    const novoTema  = temaAtual === 'dark' ? 'light' : 'dark';

    aplicarTema(novoTema);
    localStorage.setItem('tema', novoTema); // Persiste a preferência
  });
}

// ── 5. LINK ATIVO NO MENU (INTERSECTION OBSERVER) ────────────────────────────
// Detecta qual seção está visível e destaca o link correspondente no menu

const secoes = document.querySelectorAll('section[id]');
const linksNav = document.querySelectorAll('.nav__link');

// Intersection Observer: dispara quando a seção entra/sai da viewport
const observerOpcoes = {
  root: null,           // viewport
  rootMargin: '-40% 0px -50% 0px', // ativa quando a seção está no centro
  threshold: 0
};

const observer = new IntersectionObserver(function (entradas) {
  entradas.forEach(function (entrada) {
    if (entrada.isIntersecting) {
      // Remove classe 'active' de todos os links
      linksNav.forEach(function (link) { link.classList.remove('active'); });

      // Adiciona 'active' no link que corresponde à seção visível
      const linkAtivo = document.querySelector('.nav__link[href="#' + entrada.target.id + '"]');
      if (linkAtivo) {
        linkAtivo.classList.add('active');
      }
    }
  });
}, observerOpcoes);

// Observa cada seção
secoes.forEach(function (secao) { observer.observe(secao); });

// ── 6. ANIMAÇÃO DE ENTRADA DAS SEÇÕES NO SCROLL ───────────────────────────────
// Usa Intersection Observer para animar elementos ao entrar na tela

const animaveis = document.querySelectorAll(
  '.timeline-card, .project-card, .skill-item, .lang-card, .cert-card, .about__card'
);

// Começa com os elementos invisíveis (via estilo inline)
animaveis.forEach(function (el) {
  el.style.opacity  = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
});

// Observer que anima ao entrar na viewport
const observerAnim = new IntersectionObserver(function (entradas) {
  entradas.forEach(function (entrada) {
    if (entrada.isIntersecting) {
      entrada.target.style.opacity   = '1';
      entrada.target.style.transform = 'translateY(0)';
      observerAnim.unobserve(entrada.target); // Para de observar após animar
    }
  });
}, { threshold: 0.15 });

animaveis.forEach(function (el) { observerAnim.observe(el); });

// ── 7. VALIDAÇÃO DO FORMULÁRIO DE CONTATO ─────────────────────────────────────

/**
 * Valida o formato de e-mail usando expressão regular
 * Aceita o padrão: usuario@dominio.com
 */
function emailValido(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Limpa o estado de erro de um campo
 */
function limparErro(campo, mensagemEl) {
  campo.classList.remove('erro');
  mensagemEl.textContent = '';
}

/**
 * Define estado de erro em um campo
 */
function definirErro(campo, mensagemEl, msg) {
  campo.classList.add('erro');
  mensagemEl.textContent = msg;
}

/**
 * Valida todos os campos e retorna true se tudo estiver correto
 */
function validarFormulario() {
  let valido = true;

  // Limpa todos os erros antes de revalidar
  limparErro(campoNome, erroNome);
  limparErro(campoEmail, erroEmail);
  limparErro(campoMensagem, erroMensagem);

  // Validação do nome: obrigatório e mínimo 3 caracteres
  const nome = campoNome.value.trim();
  if (nome === '') {
    definirErro(campoNome, erroNome, 'Por favor, informe seu nome.');
    valido = false;
  } else if (nome.length < 3) {
    definirErro(campoNome, erroNome, 'O nome deve ter pelo menos 3 caracteres.');
    valido = false;
  }

  // Validação do e-mail: obrigatório e formato correto
  const email = campoEmail.value.trim();
  if (email === '') {
    definirErro(campoEmail, erroEmail, 'Por favor, informe seu e-mail.');
    valido = false;
  } else if (!emailValido(email)) {
    definirErro(campoEmail, erroEmail, 'Informe um e-mail válido (ex: usuario@dominio.com).');
    valido = false;
  }

  // Validação da mensagem: obrigatória e mínimo 10 caracteres
  const mensagem = campoMensagem.value.trim();
  if (mensagem === '') {
    definirErro(campoMensagem, erroMensagem, 'Por favor, escreva sua mensagem.');
    valido = false;
  } else if (mensagem.length < 10) {
    definirErro(campoMensagem, erroMensagem, 'A mensagem deve ter pelo menos 10 caracteres.');
    valido = false;
  }

  return valido;
}

// ── 8. ENVIO DO FORMULÁRIO (SIMULAÇÃO) ────────────────────────────────────────

if (contactForm) {
  contactForm.addEventListener('submit', function (evento) {
    // Previne o comportamento padrão de recarregar a página
    evento.preventDefault();

    // Só prossegue se todos os campos forem válidos
    if (!validarFormulario()) {
      // Foca no primeiro campo com erro para melhor UX
      const primeiroErro = contactForm.querySelector('.erro');
      if (primeiroErro) { primeiroErro.focus(); }
      return;
    }

    // ── Simulação de envio ──
    // Em um projeto real, aqui iria um fetch() para uma API

    // 1. Desabilita o botão para evitar duplo envio
    const btnEnviar = contactForm.querySelector('button[type="submit"]');
    btnEnviar.disabled = true;
    btnEnviar.textContent = 'Enviando...';

    // 2. Simula um delay de rede (1.2 segundos)
    setTimeout(function () {
      // 3. Limpa todos os campos do formulário
      campoNome.value     = '';
      campoEmail.value    = '';
      campoMensagem.value = '';

      // 4. Exibe a mensagem de confirmação de sucesso
      formSuccess.style.display = 'block';

      // 5. Reabilita o botão e restaura o texto
      btnEnviar.disabled    = false;
      btnEnviar.textContent = 'Enviar mensagem ✉️';

      // 6. Esconde a mensagem de sucesso após 5 segundos
      setTimeout(function () {
        formSuccess.style.display = 'none';
      }, 5000);

    }, 1200);
  });

  // Limpa erros em tempo real ao digitar (melhor UX)
  campoNome.addEventListener('input', function () { limparErro(campoNome, erroNome); });
  campoEmail.addEventListener('input', function () { limparErro(campoEmail, erroEmail); });
  campoMensagem.addEventListener('input', function () { limparErro(campoMensagem, erroMensagem); });
}

// ── 9. HEADER COM SOMBRA AO SCROLLAR ─────────────────────────────────────────
// Adiciona sombra ao header quando o usuário rola a página para baixo

const header = document.querySelector('.header');

window.addEventListener('scroll', function () {
  if (window.scrollY > 20) {
    header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
  } else {
    header.style.boxShadow = 'none';
  }
});
