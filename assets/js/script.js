/* ==========================================================================
   PET LOVE PETSHOP — Interatividade da página
   --------------------------------------------------------------------------
   SUMÁRIO
   1. Utilitários
   2. Menu de navegação no celular
   3. Efeito do cabeçalho ao rolar a página
   4. Animação de entrada dos elementos
   5. Contadores dos indicadores
   6. Carrossel de depoimentos
   7. Acordeão das dúvidas frequentes
   ========================================================================== */

(function () {
  'use strict';

  /* A classe .js que libera as animações do CSS é aplicada por um script curto dentro do <head>, antes da página ser desenhada, para evitar que o conteúdo pisque na tela. */

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
     4. ANIMAÇÃO DE ENTRADA DOS ELEMENTOS
     Usa IntersectionObserver para revelar cada elemento marcado com o atributo data-revelar assim que ele entra na área visível da tela.
     ======================================================================== */
  function iniciarRevelacao() {
    var elementos = pegarTodos('[data-revelar]');

    if (elementos.length === 0) {
      return;
    }

    // Navegadores antigos sem IntersectionObserver: mostra tudo de uma vez
    if (!('IntersectionObserver' in window)) {
      elementos.forEach(function (elemento) {
        elemento.classList.add('revelado');
      });
      return;
    }

    var observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) {
          entrada.target.classList.add('revelado');
          // uma vez revelado, o elemento não precisa mais ser observado
          observador.unobserve(entrada.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    elementos.forEach(function (elemento) {
      observador.observe(elemento);
    });
  }


  /* ========================================================================
     5. CONTADORES DOS INDICADORES
     Cada número sobe de 0 até o valor de data-alvo quando a lista aparece na tela. O texto original já vem escrito no HTML, então o valor correto continua visível mesmo sem a animação.
     ======================================================================== */
  function iniciarContadores() {
    var numeros = pegarTodos('[data-contador]');

    if (numeros.length === 0 || !('IntersectionObserver' in window)) {
      return;
    }

    var DURACAO = 1800;

    /** Monta o texto final: prefixo + número separado por ponto + sufixo. */
    function formatar(elemento, valor) {
      var prefixo = elemento.getAttribute('data-prefixo') || '';
      var sufixo = elemento.getAttribute('data-sufixo') || '';
      return prefixo + valor.toLocaleString('pt-BR') + sufixo;
    }

    function animar(elemento) {
      var alvo = Number(elemento.getAttribute('data-alvo'));

      if (!isFinite(alvo)) {
        return;
      }

      var inicio = null;

      function passo(momento) {
        if (inicio === null) {
          inicio = momento;
        }

        var progresso = Math.min((momento - inicio) / DURACAO, 1);
        // suavização: começa rápido e desacelera no fim
        var suave = 1 - Math.pow(1 - progresso, 3);

        elemento.textContent = formatar(elemento, Math.round(alvo * suave));

        if (progresso < 1) {
          window.requestAnimationFrame(passo);
        }
      }

      window.requestAnimationFrame(passo);
    }

    var observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) {
          animar(entrada.target);
          observador.unobserve(entrada.target);
        }
      });
    }, { threshold: 0.5 });

    numeros.forEach(function (numero) {
      observador.observe(numero);
    });
  }


  /* ========================================================================
     6. CARROSSEL DE DEPOIMENTOS
     A trilha é deslocada com transform: translateX em passos de 100%, então o cálculo não depende da largura da tela e continua correto quando a janela é redimensionada. Os pontos de navegação são criados aqui, um para cada depoimento.
     ======================================================================== */
  function iniciarCarrossel() {
    var carrossel = pegar('#carrossel');
    var trilha = pegar('#carrossel-trilha');
    var botaoAnterior = pegar('#carrossel-anterior');
    var botaoProximo = pegar('#carrossel-proximo');
    var listaPontos = pegar('#carrossel-pontos');

    if (!carrossel || !trilha || !botaoAnterior || !botaoProximo || !listaPontos) {
      return;
    }

    var itens = Array.prototype.slice.call(trilha.children);

    if (itens.length === 0) {
      return;
    }

    var TEMPO_TROCA = 7000;
    var DISTANCIA_MINIMA_TOQUE = 50;

    var atual = 0;
    var relogio = null;
    var pontos = [];
    var toqueInicial = null;

    // Quem prefere menos animação no sistema não recebe a troca automática
    var menosMovimento = window.matchMedia
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /** Cria um ponto de navegação para cada depoimento. */
    function montarPontos() {
      itens.forEach(function (item, indice) {
        var ponto = document.createElement('button');

        ponto.type = 'button';
        ponto.className = 'carrossel__ponto';
        ponto.setAttribute('role', 'tab');
        ponto.setAttribute('aria-label',
          'Ver depoimento ' + (indice + 1) + ' de ' + itens.length);

        ponto.addEventListener('click', function () {
          irPara(indice);
          reiniciarRelogio();
        });

        listaPontos.appendChild(ponto);
        pontos.push(ponto);
      });
    }

    /** Mostra o depoimento do índice indicado, voltando ao início ao passar do último. */
    function irPara(indice) {
      atual = (indice + itens.length) % itens.length;

      trilha.style.transform = 'translateX(-' + (atual * 100) + '%)';

      itens.forEach(function (item, i) {
        // os depoimentos fora da janela não devem ser lidos por leitores de tela
        item.setAttribute('aria-hidden', i === atual ? 'false' : 'true');
      });

      pontos.forEach(function (ponto, i) {
        ponto.classList.toggle('carrossel__ponto--ativo', i === atual);
        ponto.setAttribute('aria-selected', i === atual ? 'true' : 'false');
      });
    }

    function iniciarRelogio() {
      if (menosMovimento || relogio !== null) {
        return;
      }
      relogio = window.setInterval(function () {
        irPara(atual + 1);
      }, TEMPO_TROCA);
    }

    function pararRelogio() {
      window.clearInterval(relogio);
      relogio = null;
    }

    /** Zera a contagem depois de uma troca manual, para não trocar logo em seguida. */
    function reiniciarRelogio() {
      pararRelogio();
      iniciarRelogio();
    }

    botaoAnterior.addEventListener('click', function () {
      irPara(atual - 1);
      reiniciarRelogio();
    });

    botaoProximo.addEventListener('click', function () {
      irPara(atual + 1);
      reiniciarRelogio();
    });

    // A troca automática pausa enquanto o visitante está lendo
    carrossel.addEventListener('mouseenter', pararRelogio);
    carrossel.addEventListener('mouseleave', iniciarRelogio);
    carrossel.addEventListener('focusin', pararRelogio);
    carrossel.addEventListener('focusout', iniciarRelogio);

    // Setas do teclado quando o carrossel está em foco
    carrossel.addEventListener('keydown', function (evento) {
      if (evento.key === 'ArrowLeft') {
        irPara(atual - 1);
        reiniciarRelogio();
      } else if (evento.key === 'ArrowRight') {
        irPara(atual + 1);
        reiniciarRelogio();
      }
    });

    // Arrastar com o dedo no celular
    trilha.addEventListener('touchstart', function (evento) {
      toqueInicial = evento.changedTouches[0].clientX;
      pararRelogio();
    }, { passive: true });

    trilha.addEventListener('touchend', function (evento) {
      if (toqueInicial === null) {
        return;
      }

      var distancia = evento.changedTouches[0].clientX - toqueInicial;

      if (Math.abs(distancia) > DISTANCIA_MINIMA_TOQUE) {
        irPara(distancia < 0 ? atual + 1 : atual - 1);
      }

      toqueInicial = null;
      iniciarRelogio();
    }, { passive: true });

    montarPontos();
    irPara(0);
    iniciarRelogio();
  }


  /* ========================================================================
     7. ACORDEÃO DAS DÚVIDAS FREQUENTES
     Abre uma resposta por vez. O aria-expanded do botão é a fonte da verdade do estado; o CSS anima a altura a partir da classe do item.
     ======================================================================== */
  function iniciarAcordeao() {
    var botoes = pegarTodos('#acordeao .acordeao__botao');

    if (botoes.length === 0) {
      return;
    }

    function fechar(botao) {
      botao.setAttribute('aria-expanded', 'false');
      botao.closest('.acordeao__item').classList.remove('acordeao__item--aberto');
    }

    function abrir(botao) {
      botao.setAttribute('aria-expanded', 'true');
      botao.closest('.acordeao__item').classList.add('acordeao__item--aberto');
    }

    botoes.forEach(function (botao) {
      botao.addEventListener('click', function () {
        var jaEstavaAberto = botao.getAttribute('aria-expanded') === 'true';

        // fecha todas para deixar apenas uma resposta aberta por vez
        botoes.forEach(fechar);

        // clicar na pergunta já aberta apenas fecha a resposta
        if (!jaEstavaAberto) {
          abrir(botao);
        }
      });
    });

    // A primeira dúvida começa aberta, para a seção não parecer vazia
    abrir(botoes[0]);
  }


  /* ========================================================================
     INICIALIZAÇÃO
     ======================================================================== */
  document.addEventListener('DOMContentLoaded', function () {
    iniciarMenu();
    iniciarCabecalho();
    iniciarRevelacao();
    iniciarContadores();
    iniciarCarrossel();
    iniciarAcordeao();
  });

})();
