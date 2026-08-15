# Pet Love Petshop - Landing Page

Documentação do projeto desenvolvido para o **Desafio Extra** da Carreira Tech do SCTECdo SCTEC / LAB365 SENAI-SC.

---

## 1. Identificação

| | |
|---|---|
| **Projeto** | Pet Love Petshop - landing page institucional |
| **Atividade** | Desafio Extra - ciclo 2 da Carreira Tech / SCTEC |
| **Tecnologias** | HTML5, CSS3 e JavaScript (ES5+), sem frameworks |

### Sobre a marca

A Pet Love é um petshop **fictício**, criado para esta atividade. A proposta é um petshop e clínica veterinária que reúne banho e tosa, consultas, vacinação, hotelzinho, táxi pet e loja no mesmo lugar. Todos os dados de contato, preços, depoimentos e números apresentados na página são ilustrativos.

A identidade visual partiu do logotipo criado para a marca, de onde saíram as cinco cores usadas em toda a página:

| Cor | Código | Uso na página |
|---|---|---|
| Rosa | `#e87ac9` | cor principal, botões, ícones e destaques |
| Marrom | `#7f513b` | títulos, quadro de horários e apoio |
| Creme | `#e6d1b9` | fundos suaves e bordas |
| Grafite | `#3e393a` | texto corrido e fundo do rodapé |
| Branco | `#ffffff` | fundo geral e cartões |

---

## 2. Tecnologias e recursos externos

- **HTML5** com marcação semântica (`header`, `nav`, `main`, `section`, `article`, `footer`, `blockquote`, `form`).
- **CSS3** puro, sem pré-processador nem framework: variáveis (`:root`), Grid, Flexbox, `position`, `aspect-ratio`, `clamp()`, gradientes, transições e *media queries*.
- **JavaScript** puro (*vanilla*), sem bibliotecas, organizado em funções independentes dentro de uma IIFE.
- **[Google Fonts](https://fonts.google.com)** - duas famílias, carregadas por CDN:
  - **Roboto** (400, 500, 700) no texto corrido, pela boa legibilidade;
  - **Baloo 2** (600, 700, 800) nos títulos e nas palavras em destaque. É uma fonte arredondada e alegre, escolhida por conversar com o traço do logotipo e com o tom da marca.
- **[Bootstrap Icons](https://icons.getbootstrap.com) v1.13.1** - biblioteca de ícones, também por CDN, usada em botões, cards, listas, redes sociais e mensagens de erro.

> **Atenção ao avaliar sem internet:** as fontes e os ícones vêm de CDN. Sem conexão, a página continua funcionando normalmente (layout, responsividade e todos os scripts), apenas com as fontes substituídas pelas de sistema e sem os ícones.

---

## 3. Estrutura de arquivos

```
pet-love/
├── index.html                    Página completa, com todas as seções
├── documentacao.md               Este arquivo
├── README.md                     Apresentação curta do repositório
├── .gitignore
└── assets/
    ├── css/
    │   └── style.css             Folha de estilo única, em 12 blocos comentados
    ├── js/
    │   └── script.js             Interatividade, em 9 blocos comentados
    └── img/
        ├── logo-simbolo.png      Símbolo da marca, no cabeçalho e no rodapé
        ├── favicon.png           Ícone da aba do navegador
        ├── apple-touch-icon.png  Ícone ao salvar na tela inicial do celular
        ├── pets.webp             Foto da seção de destaque
        ├── pets2.jpg             Foto principal da seção Sobre
        ├── pets3.jpg             Segunda foto da seção Sobre
        └── pets.jpeg             Faixa decorativa acima do rodapé
```

A pasta de imagens contém apenas os arquivos efetivamente usados pela página.

O CSS e o JavaScript ficam em arquivos externos, e ambos começam com um sumário numerado que corresponde exatamente à ordem dos blocos dentro do arquivo, para facilitar a leitura.

---

## 4. Seções da página

| # | Seção | Conteúdo |
|---|---|---|
| — | **Cabeçalho** | Logotipo, menu de 6 itens e botão "Agendar". Fixo no topo, vira menu lateral no celular |
| 1 | **Destaque** (`#inicio`) | Título, texto de apresentação, dois CTAs, foto com cartões sobrepostos e formas decorativas |
| 2 | **Sobre** (`#sobre`) | História do petshop, três diferenciais, composição de duas fotos e quatro indicadores animados |
| 3 | **Serviços** (`#servicos`) | Seis cards com ícone, descrição, preço e link de agendamento |
| 4 | **Depoimentos** (`#depoimentos`) | Carrossel com quatro depoimentos de clientes |
| 5 | **Dúvidas** (`#duvidas`) | Acordeão com cinco perguntas frequentes |
| 6 | **Contato** (`#contato`) | Dados da loja, horários e formulário com validação |
| — | **Rodapé** | Faixa decorativa, marca, redes sociais, três colunas de links e créditos |

---

## 5. Etapas de desenvolvimento

O projeto foi construído em etapas, cada uma versionada em commits separados no Git. A ordem abaixo é a mesma do histórico do repositório.

### Etapa 1 - Estrutura do projeto e identidade visual

Organização das pastas (`assets/css`, `assets/js`, `assets/img`), separação do logotipo e das fotos, e criação do `.gitignore`.

Em seguida, a base do CSS: as cinco cores da marca foram transformadas em variáveis CSS no `:root`, junto com variações mais claras e mais escuras derivadas delas (por exemplo `--cor-rosa-escuro` para o texto rosa sobre fundo branco, que sozinho não teria contraste
suficiente). No mesmo bloco entraram as variáveis de tipografia, arredondamento, sombra e transição, para que o mesmo valor não ficasse repetido ao longo do arquivo.

Foram definidos também o *reset*, a tipografia base e os elementos reutilizáveis que se repetem em todas as seções: `.container`, `.secao`, `.secao__titulo`, `.etiqueta` e `.botao`.

### Etapa 2 - Cabeçalho e navegação

Cabeçalho fixo com `position: fixed`, fundo translúcido e sombra que só aparece depois de 40px de rolagem, controlada por JavaScript.

No celular, o menu vira um painel lateral que desliza com `transform: translateX()`, com uma camada escura atrás. O JavaScript mantém o atributo `aria-expanded` do botão sincronizado com o estado visual, fecha o menu ao clicar em um link, ao pressionar `Esc` ou ao ampliar a janela para o tamanho de desktop, e trava a rolagem do fundo enquanto o painel está aberto.

### Etapa 3 - Seção de destaque

Seção construída em duas colunas com Grid. É aqui que o posicionamento é mais explorado: o contêiner recebe `position: relative` e, sobre ele, são posicionados com `position: absolute` duas formas coloridas de fundo, três corações decorativos, um selo redondo e dois cartões flutuantes ("4,9 de 5" e "+12 mil pets atendidos") sobrepostos às bordas da foto. Uma onda em SVG faz a transição para a seção seguinte.

Os dois CTAs ("Agendar horário" e "Conhecer os serviços") levam às seções de contato e de serviços.

### Etapa 4 - Seção Sobre e indicadores animados

Texto de apresentação e lista de diferenciais organizados com Grid e Flexbox, ao lado de uma composição de duas fotos sobrepostas com um selo de ano.

Nesta etapa entraram dois recursos de JavaScript reaproveitados pelo resto da página:

- **Animação de entrada:** um `IntersectionObserver` observa todos os elementos marcados com `data-revelar` e adiciona a classe `revelado` quando eles entram na tela. O CSS que esconde esses elementos só vale quando existe a classe `.js` no `<html>`, incluída por um script curto no `<head>` — assim, se o JavaScript falhar, nada fica invisível.
- **Contadores:** os quatro indicadores (anos, pets atendidos, profissionais e taxa de retorno) sobem de zero até o valor final quando aparecem na tela, com `requestAnimationFrame` e uma suavização que desacelera no fim. O número correto já está escrito no HTML, então continua visível mesmo sem a animação.

### Etapa 5 - Seção de serviços

Grade de seis cards (3 colunas → 2 → 1, conforme a largura). A área do ícone de cada card usa `aspect-ratio: 16 / 9`, o que garante que todos tenham exatamente a mesma altura sem precisar de altura fixa. O `margin-top: auto` no link "Agendar" empurra o botão para a base, alinhando os cards mesmo quando os textos têm tamanhos diferentes.

### Etapa 6 - Depoimentos e dúvidas frequentes

**Carrossel de depoimentos.** A trilha é deslocada com `transform: translateX(-N * 100%)`. Como o passo é em porcentagem, o cálculo continua correto quando a janela é redimensionada. Os pontos de navegação são gerados pelo JavaScript, um para cada depoimento, então adicionar ou remover um depoimento no HTML não exige mexer no script. O carrossel troca sozinho a cada 7 segundos, mas pausa quando o mouse está sobre ele ou quando algum elemento interno recebe foco, e responde também às setas do teclado e ao arrastar com o dedo. Quem tem `prefers-reduced-motion` ativado no sistema não recebe a troca automática.

**Acordeão de dúvidas.** Abre uma resposta por vez; clicar na pergunta já aberta fecha. O `aria-expanded` do botão é a fonte da verdade do estado, e o CSS anima a altura com a transição de `grid-template-rows` de `0fr` para `1fr` — o que evita medir alturas no JavaScript. Quando fechada, a resposta recebe `visibility: hidden`, saindo também da leitura de leitores de tela.

Nas duas seções vale a mesma proteção: sem JavaScript, os depoimentos aparecem empilhados e todas as respostas ficam abertas, de modo que nenhum conteúdo fica escondido.

### Etapa 7 - Seção de contato e validação do formulário

Layout em duas colunas: de um lado endereço, WhatsApp, telefone, e-mail e um quadro de horários; do outro, o formulário.

O `<form>` recebe o atributo `novalidate`, o que desliga as mensagens padrão do navegador e deixa toda a checagem no JavaScript, como pede o desafio. Cada campo tem uma regra que devolve a mensagem de erro ou uma string vazia:

| Campo | Regra |
|---|---|
| Nome | obrigatório, mínimo de 3 caracteres |
| E-mail | obrigatório e no formato `nome@provedor.com` |
| Telefone | obrigatório, DDD mais 8 ou 9 dígitos |
| Nome do pet | opcional |
| Serviço | obrigatório, escolhido da lista |
| Data | opcional, mas não aceita data anterior a hoje |
| Mensagem | obrigatória, mínimo de 10 e máximo de 500 caracteres |
| Autorização de contato | obrigatório marcar |

O erro aparece quando o campo perde o foco (ou muda, no caso da lista e da caixa de marcação) e desaparece assim que o campo é corrigido. No envio, se houver problemas, a página informa quantos campos faltam e leva o foco direto para o primeiro deles. O campo de telefone é formatado automaticamente como `(48) 99999-0000` enquanto o visitante digita, e o campo de mensagem tem um contador de caracteres que muda de cor perto do limite.

Como o desafio pede o formulário funcional apenas na camada de front-end, não há envio para servidor: com tudo preenchido corretamente, a página exibe uma confirmação e limpa os campos.

### Etapa 8 - Rodapé

Faixa decorativa com uma foto de pets recortados em fundo branco, o que faz a emenda com a seção anterior desaparecer e dá a impressão de que os animais estão apoiados na borda do rodapé. A altura da faixa é controlada por `clamp()` e a largura acompanha sozinha, para a foto nunca ser cortada nem esticada.

Abaixo dela, o rodapé em fundo grafite com a marca, quatro redes sociais, três colunas de links e a linha final com os créditos e um botão "Voltar ao topo". O ano do copyright já vem escrito no HTML e é apenas atualizado pelo JavaScript, para não envelhecer sozinho.

### Etapa 9 - Documentação

Redação deste arquivo, revisão dos comentários do código e conferência final dos requisitos.

---

## 6. Responsividade

O layout foi ajustado em seis pontos de quebra:

| Largura | O que muda |
|---|---|
| **acima de 1080px** | Layout completo, menu horizontal com os seis itens |
| **1080px – 901px** | Espaçamentos do menu reduzidos, para os seis itens caberem em uma linha |
| **até 980px** | Seção Sobre e seção de contato passam a uma coluna; serviços vão de 3 para 2 cards por linha; indicadores em 2×2 |
| **até 900px** | Menu vira painel lateral com botão hambúrguer; seção de destaque empilha e centraliza; parte dos elementos decorativos é escondida; rodapé passa a uma coluna |
| **até 620px** | Serviços e colunas do rodapé em coluna única; um campo de formulário por linha |
| **até 560px** | Ajustes finos: cartões flutuantes menores, segunda foto da seção Sobre escondida, indicadores empilhados, botões ocupando a linha inteira |
| **até 480px** | Recuo lateral do `.container` e tamanho da marca no cabeçalho reduzidos |

Todas as imagens usam `max-width: 100%` e altura automática, e o `body` recebe `overflow-x: hidden` para que os elementos decorativos posicionados fora da tela não criem barra de rolagem horizontal.

---

## 7. Acessibilidade

Alguns cuidados aplicados ao longo de todo o projeto:

- Link "Pular para o conteúdo", visível apenas na navegação por teclado.
- Hierarquia de títulos sem saltos (`h1` → `h2` → `h3`).
- `aria-label` nos botões que só têm ícone e nos links de redes sociais.
- `aria-expanded` no botão do menu e nas perguntas do acordeão, sempre sincronizado.
- `aria-hidden` nos ícones decorativos e nos depoimentos fora da tela.
- Mensagens de erro do formulário ligadas aos campos por `aria-describedby`, com `aria-invalid` marcado nos campos com problema, e mensagem de retorno em uma região `aria-live`.
- Contorno de foco visível (`:focus-visible`) em toda a página.
- Suporte a `prefers-reduced-motion`, que reduz as transições e desliga a troca automática do carrossel.
- Textos alternativos descritivos nas fotos de conteúdo e `alt=""` nas puramente decorativas.

## 8. Como executar o projeto localmente

O projeto é feito apenas de arquivos estáticos: **não precisa instalar nada, nem compilar, nem subir servidor.**

### Opção 1 — Abrir direto no navegador (mais simples)

1. Descompacte o arquivo `.zip` em uma pasta qualquer.
2. Abra a pasta e dê **duplo clique em `index.html`**.
3. A página abre no navegador padrão, pronta para uso.

### Opção 2 — Com servidor local (recomendado para desenvolvimento)

Usando a extensão **Live Server** do Visual Studio Code:

1. Abra a pasta do projeto no VS Code.
2. Clique com o botão direito em `index.html` e escolha **"Open with Live Server"**.
3. A página abre em `http://127.0.0.1:5500`, recarregando sozinha a cada alteração.

### O que conferir na página

- Rolar até o fim para ver as animações de entrada e os indicadores subindo.
- Reduzir a largura da janela abaixo de 900px para ver o menu lateral.
- Trocar os depoimentos pelas setas, pelos pontos ou pelas setas do teclado.
- Abrir e fechar as perguntas em "Dúvidas".
- Enviar o formulário vazio para ver a validação, e depois preenchido para ver a confirmação.

### Requisitos

Qualquer navegador atualizado (Chrome, Edge, Firefox ou Safari, nas versões dos últimos dois anos). Conexão com a internet é opcional: sem ela, a página funciona igual, apenas sem as fontes do Google Fonts e sem os ícones do Bootstrap Icons.