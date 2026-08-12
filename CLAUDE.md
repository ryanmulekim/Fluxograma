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

Desde 12/08/2026 não é mais um fluxo sequencial de 5 passos — é uma
referência categorizada com **12 grupos** (`.rule-group`, letras A a K, com
C.1 como subgrupo de C), cada um cobrindo uma parte do sistema (criação do
plano, equipe, recomendações, validação/status, controle de edição,
documentos, solicitar ajustes, ajuste por recomendação, aprovação da
Chefia, histórico, controle de acesso). Os grupos ficam num grid responsivo
(`.rules-groups`, `repeat(auto-fit, minmax(340px, 1fr))`) — não há mais
setas entre eles, porque não é mais uma sequência única, é uma
categorização. Cada grupo é um `.rule-group` com título (letra + nome +
etapa/contexto entre parênteses) e uma lista compacta de regras.

Cada regra tem um código curto (`<code class="rule-id">A1</code>,
`B2`...) antes do título em negrito, pra ficar referenciável em conversa
("a regra D7 já cobre isso"). Esses códigos são estáveis — não renumere ao
editar; se uma regra for removida, deixe o buraco na numeração em vez de
renumerar as seguintes, porque a referência técnica abaixo (e qualquer
conversa/ata que já citou o código) depende do código não mudar.

**Linguagem de negócio, não de código.** As regras são escritas pra quem
não lê código — sem nome de arquivo, hook, variável, endpoint ou termo
técnico do React. Onde faz sentido, os chips de status reais do backend
(`EM_EDICAO`, `AGUARDANDO_APROVACAO`, `APROVADO`) continuam citados com
`<code>`, pela mesma razão do resto do documento: ancorar no vocabulário
real do sistema. Isso foi decisão explícita ao reescrever esta seção em
12/08/2026 — a fonte original (abaixo) é bem mais técnica, com referência
de arquivo:linha do `fmr-frontend`; a rastreabilidade fica só aqui no
CLAUDE.md, não na página.

**Cada grupo começa recolhido**, mostrando só o cabeçalho (letra + nome +
contexto) e um resumo de uma frase; clicar expande e troca o resumo pela
lista completa (`script.js`, IIFE do `.rule-group-toggle`). É por grupo, não
um "expandir tudo" global — abrir um não afeta os outros. O botão cobre a
faixa inteira do cabeçalho (maior área de clique, não só a setinha), e o
estado vai em `aria-expanded` no botão + atributo `hidden` no resumo/lista.

O `<ul class="rule-group-list">` já nasce com `hidden` no HTML — sem
JavaScript (script bloqueado, erro de carregamento), a lista fica escondida
e só o resumo aparece, com um botão que não faz nada. É um trade-off
consciente: prioriza a página não abrir com 67 regras expandidas de uma vez,
ao custo de depender de JS pra ver o detalhe.

Ao adicionar um grupo novo, siga o modelo:

```html
<div class="rule-group">
  <button type="button" class="rule-group-toggle" aria-expanded="false" aria-controls="rules-X">
    <span class="rule-group-heading">
      <span class="rule-group-letter">X</span>
      <span class="rule-group-name">Nome do Grupo</span>
      <span class="rule-group-sub">contexto opcional (ex.: Etapa 4)</span>
    </span>
    <svg class="rule-group-chevron" aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M6 9l6 6 6-6" />
    </svg>
  </button>
  <p class="rule-group-summary">Resumo de uma frase sobre o que esse grupo cobre.</p>
  <ul class="rule-group-list" id="rules-X" hidden>
    <li>
      <b><code class="rule-id">X1</code> Título curto da regra.</b>
      Explicação objetiva do critério e da consequência de cada caminho.
    </li>
  </ul>
</div>
```

O `id` do `<ul>` e o `aria-controls` do botão precisam bater (`rules-X`) —
é só semântica de acessibilidade, o script encontra a lista por
`.closest(".rule-group")` + `querySelector`, não pelo id.

### Referências técnicas (fmr-frontend)

Rastreabilidade das regras acima até o código-fonte do `fmr-frontend`, na
forma como foram levantadas em 12/08/2026 (arquivo:linha — sujeito a
desatualizar se o código mudar sem que este documento seja revisado; ver
"Fonte da verdade" no início deste arquivo). Regras sem entrada aqui não
vieram com uma referência específica no levantamento original.

- **A** — A1 `gerar-preliminar.tsx:116-134`; A2 `gerar-preliminar.tsx:112-115`
- **B** — B1 `equipeValidacao.ts:25-40`; B2 `equipeValidacao.ts:31`; B3
  `equipeValidacao.ts:48-59`; B4 `useEquipeLocal.ts:20-23`,
  `planoAcaoLocalStore.ts:9-14`; B5 `montarDetalhePlano.ts:55-60`
- **C** — C1 `recomendacaoValidacao.ts:17-29`; C3
  `ordenacaoRecomendacoes.ts:14-33`; C4 `ordenacaoRecomendacoes.ts:18-28`;
  C7 `useLimparRecomendacoes.tsx:17-19`, `planoAcaoLocalStore.ts:123-138`
- **C.1** — C8 `edicaoEmLote.ts:14-20`; C9 `edicaoEmLote.ts:30-38`; C10
  `useSelecaoMultipla.ts:41-52`
- **D** — D1 `validarPlano.ts:28-62`; D2 `validarPlano.ts:40-51`; D3
  `ConfirmationView.tsx:247-259`; D4 `ConfirmationView.tsx:261-303`; D5
  `ConfirmationView.tsx:266-277`; D6 `usePlanoLifecycle.ts:54-66`; D7
  `ConfirmationView.tsx:186-204`, `gerar-preliminar.tsx:72-74`; D9
  `useRascunhoAutosave.ts:129-135`; D10 `useRascunhoAutosave.ts:14`,
  `planoAcaoWizard.service.ts:173-191`; D11 `useRascunhoAutosave.ts:85-127`
- **E** — E1 `usePlanoSomenteLeitura.ts:47-72`; E2
  `usePlanoSomenteLeitura.ts:55-56`; E3 `ConfirmationView.tsx:71-79`
- **F** — F1 `gerar-preliminar.tsx:72-74`; F3
  `gerarDocumentosPlano.service.ts:45-56`; F4
  `gerarDocumentosPlano.service.ts:16-27`; F5 `useAcoesAprovacao.ts:101-121`
- **H** — H1 `ajustePlanoAcao.type.ts:14-29`; H3
  `planosAprovacao.service.ts:100-118`; H4 `ajustePlanoAcao.type.ts:22-27`;
  H5 `ajustePlanoAcao.service.ts:22-28`; H6
  `useAjusteRecomendacao.ts:62-82`; H7
  `ajusteRecomendacao.validacao.ts:44-53`; H8
  `ajusteRecomendacao.validacao.ts:18-30,70-76`; H10
  `useAjustesRecomendacaoPendentes.ts:11-25`
- **I** — I1 `planoAprovacao.type.ts:25`; I2 `useFilaAprovacao.ts:42-58`;
  I3, I4, I5, I6 `planoDetalhe.derive.ts` (I4 `:183-185`, I5 `:72-86`, I6
  `:78-84`); I7 `useDetalhePlanoAprovacao.ts:16-34`; I8
  `useDevolverAjustes.ts:82-89`; I9 `resumoDevolucao.derive.ts:15-26`
- **J** — J1 `historicoTramitacao.type.ts:12-17`; J3
  `planosAprovacao.service.ts:25-27`
- **K** — K1 `permissions.ts:22-49`; K2 `role-permissions.ts:16-30,56-92`;
  K3 `role-permissions.ts:41-54`

Sem referência no levantamento original: C2, C5, C6, C11, D8, F2, G1, G2,
G3, H2, H9, I10, J2, K4 — regras de comportamento/decisão de produto sem um
ponto único de código, ou levantadas por leitura geral do fluxo.

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
- **12/08/2026** — "Regras de Negócio" reescrita do zero a partir de um
  levantamento técnico completo do `fmr-frontend` (12 grupos, A a K, quase
  70 regras). Layout mudou de fluxo de 5 cards com setas para grid de
  categorias; texto traduzido pra linguagem de negócio (sem arquivo/linha/
  hook/endpoint na página); rastreabilidade técnica movida pro CLAUDE.md.
- **12/08/2026** — grupos de "Regras de Negócio" passaram a nascer
  recolhidos (resumo de uma frase + botão pra expandir), em vez de mostrar
  as 67 regras todas abertas de uma vez.
