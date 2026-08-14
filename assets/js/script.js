/* ==========================================================================
   PET LOVE PETSHOP — Interatividade da página
   --------------------------------------------------------------------------
   SUMÁRIO
   1. Utilitários
   2. Menu de navegação no celular
   3. Efeito do cabeçalho ao rolar a página
   ========================================================================== */

(function () {
  'use strict';

  /* ========================================================================
     1. UTILITÁRIOS
     ======================================================================== */

  /** Atalho para document.querySelector. */
  function pegar(seletor) {
    return document.querySelector(seletor);
  }

  /** Atalho para querySelectorAll já convertido em array de verdade. */
  function pegarTodos(seletor) {
    return Array.prototype.slice.call(document.querySelectorAll(seletor));
  }


  /* ========================================================================
     2. MENU DE NAVEGAÇÃO NO CELULAR
     Abre e fecha o painel lateral, mantendo os atributos de acessibilidade (aria-expanded) sincronizados com o estado visual.
     ======================================================================== */
  function iniciarMenu() {
    var botao = pegar('#abrir-menu');
    var navegacao = pegar('#navegacao');
    var fundo = pegar('#fundo-menu');

    if (!botao || !navegacao || !fundo) {
      return;
    }

    function abrirMenu() {
      navegacao.classList.add('navegacao--aberta');
      document.body.classList.add('menu-aberto');
      fundo.hidden = false;
      // o requestAnimationFrame garante que a transição de opacidade aconteça
      window.requestAnimationFrame(function () {
        fundo.classList.add('fundo-menu--visivel');
      });
      botao.setAttribute('aria-expanded', 'true');
      botao.setAttribute('aria-label', 'Fechar menu de navegação');
      botao.innerHTML = '<i class="bi bi-x-lg" aria-hidden="true"></i>';
    }

    function fecharMenu() {
      navegacao.classList.remove('navegacao--aberta');
      document.body.classList.remove('menu-aberto');
      fundo.classList.remove('fundo-menu--visivel');
      fundo.hidden = true;
      botao.setAttribute('aria-expanded', 'false');
      botao.setAttribute('aria-label', 'Abrir menu de navegação');
      botao.innerHTML = '<i class="bi bi-list" aria-hidden="true"></i>';
    }

    function alternarMenu() {
      if (navegacao.classList.contains('navegacao--aberta')) {
        fecharMenu();
      } else {
        abrirMenu();
      }
    }

    botao.addEventListener('click', alternarMenu);
    fundo.addEventListener('click', fecharMenu);

    // Clicar em qualquer link do menu leva à seção e fecha o painel
    pegarTodos('#navegacao a').forEach(function (link) {
      link.addEventListener('click', fecharMenu);
    });

    // A tecla Esc também fecha o menu
    document.addEventListener('keydown', function (evento) {
      if (evento.key === 'Escape') {
        fecharMenu();
      }
    });

    // Se a janela for ampliada para desktop, o painel não pode continuar aberto
    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) {
        fecharMenu();
      }
    });
  }


  /* ========================================================================
     3. EFEITO DO CABEÇALHO AO ROLAR A PÁGINA
     A partir de 40px de rolagem o cabeçalho ganha fundo sólido e sombra.
     ======================================================================== */
  function iniciarCabecalho() {
    var cabecalho = pegar('#cabecalho');

    if (!cabecalho) {
      return;
    }

    function atualizarCabecalho() {
      cabecalho.classList.toggle('cabecalho--rolado', window.scrollY > 40);
    }

    atualizarCabecalho();
    window.addEventListener('scroll', atualizarCabecalho, { passive: true });
  }


  /* ========================================================================
     INICIALIZAÇÃO
     ======================================================================== */
  document.addEventListener('DOMContentLoaded', function () {
    iniciarMenu();
    iniciarCabecalho();
  });

})();
