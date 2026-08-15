/* ==========================================================================
   PET LOVE PETSHOP - Interatividade da página
   --------------------------------------------------------------------------
   SUMÁRIO
   1. Utilitários
   2. Menu de navegação no celular
   3. Efeito do cabeçalho ao rolar a página
   4. Animação de entrada dos elementos
   5. Contadores dos indicadores
   6. Carrossel de depoimentos
   7. Acordeão das dúvidas frequentes
   8. Validação do formulário de contato
   9. Ano atual no rodapé
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
     8. VALIDAÇÃO DO FORMULÁRIO DE CONTATO
     O formulário tem o atributo novalidate no HTML, então as mensagens padrão do navegador ficam desligadas e toda a checagem acontece aqui. Cada campo tem uma regra que devolve a mensagem de erro ou uma string vazia quando está correto.
     ======================================================================== */
  function iniciarFormulario() {
    var formulario = pegar('#formulario-contato');

    if (!formulario) {
      return;
    }

    var retorno = pegar('#formulario-retorno');
    var contador = pegar('#contador-mensagem');
    var campoMensagem = pegar('#mensagem');
    var campoTelefone = pegar('#telefone');
    var campoData = pegar('#data');

    var LIMITE_MENSAGEM = 500;
    var AVISO_LIMITE = 50;

    // Formato mínimo aceitável: algo@algo.dominio, sem espaços
    var FORMATO_EMAIL = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

    /** Data de hoje no formato aaaa-mm-dd, igual ao usado pelo input type="date". */
    function dataDeHoje() {
      var agora = new Date();
      var mes = agora.getMonth() + 1;
      var dia = agora.getDate();

      return agora.getFullYear()
        + '-' + (mes < 10 ? '0' + mes : mes)
        + '-' + (dia < 10 ? '0' + dia : dia);
    }

    /* Regras de validação. Recebem o valor já sem espaços nas pontas e o próprio elemento, e devolvem a mensagem de erro ou '' quando o campo está válido. */
    var regras = {
      nome: function (valor) {
        if (valor === '') {
          return 'Escreva o seu nome para sabermos como chamar você.';
        }
        if (valor.length < 3) {
          return 'O nome precisa ter pelo menos 3 letras.';
        }
        return '';
      },

      email: function (valor) {
        if (valor === '') {
          return 'Informe um e-mail para o nosso retorno.';
        }
        if (!FORMATO_EMAIL.test(valor)) {
          return 'Confira o e-mail: o formato esperado é nome@provedor.com.';
        }
        return '';
      },

      telefone: function (valor) {
        var digitos = valor.replace(/\D/g, '');

        if (digitos === '') {
          return 'Informe um telefone com DDD.';
        }
        if (digitos.length < 10) {
          return 'O telefone precisa do DDD mais 8 ou 9 dígitos.';
        }
        return '';
      },

      servico: function (valor) {
        if (valor === '') {
          return 'Escolha o serviço que você precisa.';
        }
        return '';
      },

      data: function (valor) {
        // campo opcional: só é conferido quando preenchido
        if (valor === '') {
          return '';
        }
        if (valor < dataDeHoje()) {
          return 'Escolha uma data de hoje em diante.';
        }
        return '';
      },

      mensagem: function (valor) {
        if (valor === '') {
          return 'Conte rapidamente do que o seu pet precisa.';
        }
        if (valor.length < 10) {
          return 'Escreva um pouco mais: pelo menos 10 caracteres.';
        }
        return '';
      },

      aceite: function (valor, elemento) {
        if (!elemento.checked) {
          return 'É preciso autorizar o contato para enviarmos a solicitação.';
        }
        return '';
      }
    };

    // Elementos que passam pela validação, na mesma ordem em que aparecem na tela
    var campos = Object.keys(regras)
      .map(function (id) {
        return document.getElementById(id);
      })
      .filter(function (elemento) {
        return elemento !== null;
      });

    /** Bloco .campo que envolve o elemento e recebe as classes de estado. */
    function blocoDe(elemento) {
      return elemento.closest('.campo');
    }

    /** Mensagem <small> ligada ao campo pelo aria-describedby. */
    function avisoDe(elemento) {
      return document.getElementById('erro-' + elemento.id);
    }

    function mostrarErro(elemento, mensagem) {
      var bloco = blocoDe(elemento);
      var aviso = avisoDe(elemento);

      bloco.classList.add('campo--invalido');
      bloco.classList.remove('campo--valido');
      elemento.setAttribute('aria-invalid', 'true');

      if (aviso) {
        aviso.textContent = mensagem;
      }
    }

    function marcarCorreto(elemento) {
      var bloco = blocoDe(elemento);
      var aviso = avisoDe(elemento);
      var preenchido = elemento.type === 'checkbox'
        ? elemento.checked
        : elemento.value.trim() !== '';

      bloco.classList.remove('campo--invalido');
      // a borda verde só aparece depois que o visitante escreveu algo
      bloco.classList.toggle('campo--valido', preenchido);
      elemento.removeAttribute('aria-invalid');

      if (aviso) {
        aviso.textContent = '';
      }
    }

    /** Aplica a regra do campo e devolve true quando ele está válido. */
    function validarCampo(elemento) {
      var regra = regras[elemento.id];

      if (!regra) {
        return true;
      }

      var mensagem = regra(elemento.value.trim(), elemento);

      if (mensagem === '') {
        marcarCorreto(elemento);
        return true;
      }

      mostrarErro(elemento, mensagem);
      return false;
    }

    /** Devolve o formulário ao estado neutro depois de um envio. */
    function limparEstados() {
      campos.forEach(function (elemento) {
        var aviso = avisoDe(elemento);

        blocoDe(elemento).classList.remove('campo--invalido', 'campo--valido');
        elemento.removeAttribute('aria-invalid');

        if (aviso) {
          aviso.textContent = '';
        }
      });
    }

    /** Escreve o aviso final. O texto entra por textContent para que um nome digitado nunca seja interpretado como HTML. */
    function mostrarRetorno(tipo, icone, texto) {
      if (!retorno) {
        return;
      }

      var simbolo = document.createElement('i');
      var frase = document.createElement('span');

      simbolo.className = 'bi ' + icone;
      simbolo.setAttribute('aria-hidden', 'true');
      frase.textContent = texto;

      retorno.className = 'formulario__retorno formulario__retorno--' + tipo;
      retorno.innerHTML = '';
      retorno.appendChild(simbolo);
      retorno.appendChild(frase);
      retorno.hidden = false;
    }

    /** Vai escrevendo o telefone no formato (48) 99999-0000. */
    function formatarTelefone(valor) {
      var digitos = valor.replace(/\D/g, '').slice(0, 11);

      if (digitos.length === 0) {
        return '';
      }
      if (digitos.length <= 2) {
        return '(' + digitos;
      }
      if (digitos.length <= 6) {
        return '(' + digitos.slice(0, 2) + ') ' + digitos.slice(2);
      }
      // 8 dígitos (fixo) ou 9 dígitos (celular) mudam a posição do hífen
      if (digitos.length <= 10) {
        return '(' + digitos.slice(0, 2) + ') ' + digitos.slice(2, 6) + '-' + digitos.slice(6);
      }
      return '(' + digitos.slice(0, 2) + ') ' + digitos.slice(2, 7) + '-' + digitos.slice(7);
    }

    function atualizarContador() {
      if (!contador || !campoMensagem) {
        return;
      }

      var usados = campoMensagem.value.length;

      contador.textContent = usados + ' / ' + LIMITE_MENSAGEM;
      contador.classList.toggle(
        'campo__contador--limite',
        usados > LIMITE_MENSAGEM - AVISO_LIMITE
      );
    }

    // O calendário não deixa escolher um dia que já passou
    if (campoData) {
      campoData.min = dataDeHoje();
    }

    if (campoTelefone) {
      campoTelefone.addEventListener('input', function () {
        campoTelefone.value = formatarTelefone(campoTelefone.value);
      });
    }

    if (campoMensagem) {
      campoMensagem.addEventListener('input', atualizarContador);
      atualizarContador();
    }

    campos.forEach(function (elemento) {
      // listas e caixas de marcação avisam no change; os demais campos, ao perder o foco
      var evento = (elemento.tagName === 'SELECT' || elemento.type === 'checkbox')
        ? 'change'
        : 'blur';

      elemento.addEventListener(evento, function () {
        validarCampo(elemento);
      });

      // depois de um erro, o aviso some assim que o campo é corrigido
      elemento.addEventListener('input', function () {
        if (blocoDe(elemento).classList.contains('campo--invalido')) {
          validarCampo(elemento);
        }
      });
    });

    formulario.addEventListener('submit', function (evento) {
      evento.preventDefault();

      var invalidos = campos.filter(function (elemento) {
        return !validarCampo(elemento);
      });

      if (invalidos.length > 0) {
        mostrarRetorno('erro', 'bi-exclamation-triangle-fill',
          invalidos.length === 1
            ? 'Um campo precisa ser revisado antes do envio.'
            : invalidos.length + ' campos precisam ser revisados antes do envio.');

        // leva o visitante direto ao primeiro problema
        invalidos[0].focus();
        return;
      }

      /* Não existe servidor neste projeto: a confirmação é apenas na camada de front-end, como pede o desafio. */
      var primeiroNome = pegar('#nome').value.trim().split(' ')[0];

      mostrarRetorno('sucesso', 'bi-check-circle-fill',
        'Tudo certo, ' + primeiroNome + '! Recebemos a sua solicitação e retornamos em até um dia útil.');

      formulario.reset();
      limparEstados();
      atualizarContador();
    });
  }


  /* ========================================================================
     9. ANO ATUAL NO RODAPÉ
     O ano já vem escrito no HTML para aparecer mesmo sem JavaScript; aqui ele é apenas atualizado para não envelhecer sozinho.
     ======================================================================== */
  function iniciarAnoDoRodape() {
    var ano = pegar('#ano-atual');

    if (ano) {
      ano.textContent = new Date().getFullYear();
    }
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
    iniciarFormulario();
    iniciarAnoDoRodape();
  });

})();
