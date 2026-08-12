# CLAUDE.md

Este arquivo orienta o Claude Code ao trabalhar neste repositório.

## O que é este projeto

Mini-projeto HTML + CSS + JS **standalone** — sem build, sem dependências, sem
framework. Contém um fluxograma do ciclo de vida do **Plano de Ação** do
sistema SISAUD/SUS Monitor (`fmr-frontend`) fmr-SemKey.

Nasceu como um artefato gerado pelo Claude (Artifact) e foi exportado para
arquivos reais em `C:\Users\ryan.pereira\Desktop\Fluxo-PA` para permitir
edição direta. Não tem relação técnica com o `fmr-frontend` — não importa
nada de lá, não faz parte do build dele, não é um repositório git. É um
documento de referência visual sobre o *comportamento* daquele sistema.

## Arquivos

| Arquivo        | Conteúdo                                                                                   |
| -------------- | ------------------------------------------------------------------------------------------- |
| `index.html` | Estrutura da página: cabeçalho, o SVG do fluxograma, "Regras de Negócio", notas, seção "Sugestões", rodapé |
| `style.css`  | Tokens de cor (claro/escuro), tipografia, layout, estilos do SVG                            |
| `script.js`  | Botão de alternância de tema (Sistema/Claro/Escuro), persistido em `localStorage`; filtro de "Sugestões" por tag |

Sem build step: abra `index.html` direto no navegador (duplo clique) ou sirva
com qualquer servidor estático.

## Como o tema funciona

Segue o padrão de 3 estados:

- `:root` puro define a paleta **clara**.
- `@media (prefers-color-scheme: dark)` cobre o modo **"sistema"** (usuário
  não escolheu nada, o SO está em dark).
- `:root[data-theme="dark"]` / `[data-theme="light"]` sobrescreve quando o
  usuário escolhe manualmente pelo botão no canto superior direito.

O botão (`script.js`) só alterna o atributo `data-theme` no `<html>` e grava
a escolha em `localStorage` (chave `planoAcaoTheme`).

⚠️ **Se adicionar uma cor nova, defina-a nos três blocos acima, não só em
um.** Uma cor definida apenas dentro de um `@media`/`[data-theme]` nunca
aparece no estado "não marcado" — que é o que a maioria dos visitantes vê.

## O fluxograma

Representa o ciclo de vida do Plano de Ação do `fmr-frontend`, do rascunho
aberto pelo auditor até a assinatura — que **ainda não existe** no sistema
real; é um passo planejado, desenhado tracejado de propósito.

### Codificação de cor (atores)

| Cor             | Token               | Quem age                                                              |
| --------------- | ------------------- | --------------------------------------------------------------------- |
| Azul            | `--accent-blue`   | Auditor / Elaborador (as 4 etapas do Wizard)                          |
| Âmbar          | `--accent-amber`  | Chefia (revisa, aprova ou devolve)                                    |
| Roxo            | `--accent-violet` | Sistema (transições automáticas: disponibilizar, gerar documentos) |
| Tracejado cinza | `--planned`       | Ainda não implementado (só a Assinatura, hoje)                      |

### Geometria

- SVG **horizontal**, `viewBox="0 0 2780 320"`, com **tamanho fixo em
  pixels** (`svg.flow { width: 2780px; height: 320px }`) — não escala para
  caber na tela. Decisão deliberada: com 9 nós numa única linha, encolher
  para caber destruiria a legibilidade do texto. `.diagram-scroll` rola
  horizontalmente quando a janela é menor que 2780px.
- Lane principal em `y=40..124`: os nós N1→N9 correm da esquerda para a
  direita. O ramo "Solicitar Ajustes" desce para um nó abaixo (`y=194..278`)
  e a seta de retorno passa por baixo do fluxo principal até reentrar em
  "Define as Recomendações".
- Coordenadas foram calculadas à mão, não há gerador/script. O pitch
  horizontal usado entre nós é **310px** (220 de largura do nó + 90 de seta
  e rótulo) — use o mesmo espaçamento se for inserir um nó novo na lane
  principal.
- Cada nó tem até 3 linhas de texto (título, subtítulo, e um "chip"
  monoespaçado opcional mostrando a transição de status real do backend,
  ex.: `→ AGUARDANDO_APROVACAO`). Os chips existem para ancorar o diagrama
  no vocabulário real do sistema (os valores do enum de status), não são
  decoração.

### Fonte da verdade

Este diagrama reflete o comportamento do `fmr-frontend` **verificado por
execução em 11/08/2026**. Ele **não é atualizado automaticamente** — se o
fluxo real mudar (novo status, nova regra de aprovação, a Assinatura ser
implementada de verdade), este arquivo fica desatualizado até alguém editá-lo
à mão.

## Seção "Regras de Negócio"

Fica logo abaixo do diagrama, numa `<section class="rules">` de largura
total (irmã de `<figure>` e de `<section class="suggestions">`, não dentro
do `.prose` estreito). Enquanto o SVG mostra a *sequência* das etapas, essa
seção documenta os *critérios* que o sistema aplica em cada uma — o que
precisa existir antes, o que é obrigatório, como uma decisão é tomada.

É um fluxo de cards conectados por setas (`.rules-scroll > .rules-flow`),
mesma ideia do diagrama SVG acima — largura fixa por card (252px), sem
encolher, `.rules-scroll` rola horizontalmente em telas estreitas. Optou-se
por HTML/CSS em vez de SVG porque o texto de cada regra é parágrafo corrido
(precisa quebrar linha), diferente dos nós do fluxograma. O círculo numerado
em cada card (`.rule-number`) ecoa visualmente os círculos numerados do
próprio wizard do `fmr-frontend` (Etapa 1‑2‑3‑4 vistos nos prints usados
neste projeto).

Hoje tem 5 regras, cobrindo do pré-requisito para gerar o plano (atividade
com constatações e recomendações) até a decisão da Chefia que dispara a
etapa de assinaturas. Os chips de status (`EM_EDICAO`,
`AGUARDANDO_APROVACAO`, `APROVADO`) são citados dentro do texto das regras
com `<code>`, para manter a regra ancorada no mesmo vocabulário do diagrama
— se um chip mudar no diagrama, procure o mesmo texto aqui.

Ao adicionar uma regra nova, siga o modelo (um `.rule-card` seguido de um
`.rule-arrow`, exceto depois do último card):

```html
<div class="rule-card">
  <span class="rule-number">N</span>
  <b>Título curto da regra.</b>
  <p>Explicação objetiva do critério e da consequência de cada caminho.</p>
</div>

<div class="rule-arrow" aria-hidden="true">
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4 12h14M13 6l7 6-7 6" />
  </svg>
</div>
```

## Seção "Sugestões"

Espaço para reunir sugestões de ajuste no fluxo, para avaliação da
supervisão. O `index.html` tem um comentário logo acima do grid, dentro de
`<section class="suggestions">`, com o modelo exato de marcação para um
cartão real:

```html
<div class="suggestion-card">
  <div class="card-badges">
    <span class="status open">Em aberto</span>
    <span class="tag">Contexto</span>
  </div>
  <h3>Título curto da sugestão</h3>
  <p>Descrição objetiva: o que muda e por quê.</p>
</div>
```

Status disponíveis (mesmas cores do diagrama, reaproveitadas de propósito):
`status open` (âmbar), `status accepted` (verde), `status rejected`
(terracota).

A `tag` dentro de `card-badges` é livre — nomeia a parte do fluxo a que a
sugestão se refere (ex.: "Assinaturas", "Wizard", "Aprovação"). Repita o
mesmo texto de tag em todo cartão que fale do mesmo contexto; não tem cor
própria (neutra, `--surface-2`/`--ink-muted`) porque o objetivo é agrupar
visualmente por assunto, não sinalizar estado como o `status` faz.

Quando várias sugestões forem a mesma proposta em formatos diferentes (ex.:
layouts alternativos de uma tela), adicione um `<span class="variant-tag">`
dentro do `card-badges`, depois da `tag`, com um identificador curto
(`1A`, `1B`...) — o número agrupa as variações, a letra distingue o
formato. Não entra no filtro (ele só lê `.tag`), é só uma pista visual pra
quem está comparando as opções lado a lado.

A tag também alimenta o filtro (`#suggestions-filter`, lógica em
`script.js`): no carregamento da página, o script lê a `.tag` de cada
`.suggestion-card`, monta um botão por tag única encontrada (mais um "Todas"
fixo) e, ao clicar, esconde via atributo `hidden` os cartões que não batem
com a tag escolhida. Não há lista de tags fixa em lugar nenhum — uma tag
nova aparece no filtro assim que o primeiro cartão com ela existir no HTML.
Com uma tag só (ou nenhuma) o filtro nem aparece, pois não haveria nada pra
agrupar.

Se a sugestão vier acompanhada de um mockup/print, salve a imagem na raiz
do projeto (ex.: `sugestao-<contexto>.png`) e adicione dentro do cartão,
depois do `<p>`:

```html
<a class="suggestion-mockup" href="sugestao-<contexto>.png" target="_blank" rel="noopener">
  <img src="sugestao-<contexto>.png" alt="Descrição do que a imagem mostra" loading="lazy" />
  <span>Ver mockup em tamanho real</span>
</a>
```

Isso abre a imagem em tamanho real numa nova aba — sem JS, sem lightbox.

Hoje há sete cartões reais, em duas tags:

- **Assinaturas** (5 cartões) — quatro propostas de layout para a mesma
  tela dedicada de acompanhamento de assinaturas (cartões por assinante,
  cartões com indicadores no cabeçalho, linha do tempo vertical, tabela de
  partes signatárias — mesmo título e texto, mockup diferente em cada uma,
  pensadas como opções alternativas de UI a comparar) e a proposta de exibir
  esse acompanhamento como bloco separado das 4 etapas do wizard (já que
  assinaturas não são preenchidas pelo usuário como as demais etapas). As
  quatro variações de layout têm um identificador extra dentro de
  `card-badges`, `<span class="variant-tag">1A</span>` (1A/1B/1C/1D) — só
  elas, por serem a mesma proposta em formatos diferentes; a de "bloco
  separado" e os cartões de "Aprovação" não levam variant-tag por serem
  propostas distintas, não variações umas das outras.
- **Aprovação** (2 cartões) — modal de confirmação com download em 2
  botões (planilha + plano, separados por causa do bloqueio de downloads
  simultâneos do navegador); o mesmo botão/modal de download reaproveitado
  na tabela "Meus Planos de Ação" para baixar de novo os documentos de um
  plano já aprovado.

O cartão placeholder ("Nenhuma sugestão registrada ainda") foi removido
quando o primeiro cartão real entrou — só existia para o estado vazio.

Ao adicionar cartões reais, **remova o cartão `placeholder`** — ele só existe
para deixar o estado vazio honesto, não é um exemplo para manter ao lado dos
reais.

## Histórico

- **11/08/2026** — criado como artefato Claude (fluxograma vertical, página
  de largura fixa ~760px).
- **11/08/2026** — exportado para este mini-projeto (`index.html` +
  `style.css` + `script.js`), com botão de tema adicionado (o artefato
  dependia do visualizador do claude.ai para isso).
- **11/08/2026** — redesenhado para horizontal + largura total da tela;
  seção "Sugestões" adicionada (ainda vazia, aguardando conteúdo).
- **11/08/2026** — quatro cartões reais adicionados em "Sugestões" (tags
  "Assinaturas" e "Aprovação", com mockups clicáveis); seção "Regras de
  Negócio" criada entre o diagrama e as notas, para preparar o material para
  apresentação à liderança.
- **11/08/2026** — sumário de navegação (`.toc`) adicionado no cabeçalho;
  "Regras de Negócio" migrada de lista numerada estreita para um fluxo de
  cards conectados por setas, largura total, mesma linguagem visual do
  diagrama SVG.
- **11/08/2026** — filtro por tag adicionado em "Sugestões" (gerado
  dinamicamente a partir das tags existentes, com opção "Todas").
- **12/08/2026** — três variações de mockup adicionadas ao cartão "Tela de
  Acompanhamento de Assinaturas" (cartões com indicadores, linha do tempo,
  tabela de partes signatárias), como opções alternativas de layout para a
  mesma proposta.
- **12/08/2026** — identificador `variant-tag` (1A/1B/1C/1D) adicionado nos
  quatro cartões de layout de "Acompanhamento de Assinaturas", pra deixar
  claro que são variações da mesma proposta, não sugestões distintas.
