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

### Abas (Fluxo 1 / Fluxo 2 / Fluxo 3)

Desde 13/08/2026 o `<figure id="diagrama">` tem três abas
(`.diagram-tabs`, `role="tablist"`), uma por visão de fluxo — pedido do
usuário para preparar o espaço pra mais de um fluxo na mesma tela. Painéis
nasceram como cópia idêntica do Fluxo 1 (placeholder); Fluxo 2 e Fluxo 3
ganharam conteúdo próprio no mesmo dia (ver abaixo).

- **Fluxo 1** (`#diagram-panel-1`) é o fluxo real, verificado por execução
  (ver "Fonte da verdade") — 9 nós, Etapa 4 = "Validação", devolução passa
  por um nó "Devolve para Ajustes" antes do loop de volta pra Etapa 3,
  Assinatura é um N9 tracejado/planejado no fim.
- **Fluxo 2** (`#diagram-panel-2`) é uma proposta alternativa, **não**
  verificada por execução no `fmr-frontend` — é hipotética/de discussão.
  Diferenças estruturais do Fluxo 1: Etapa 2 é só leitura pro auditor
  ("Visualiza a Equipe" — edição fica com a Chefia); Etapa 4 é validação
  das partes envolvidas, exceto a Chefia (`actor-shared`, não
  `actor-elaborador`); a Chefia decide entre **Assinar** (gera e libera os
  documentos direto, sem N9 separado — a assinatura deixa de ser um passo
  planejado e passa a acontecer aqui) ou **Solicitar Ajuste**, que passa
  por um nó "Devolve para Ajustes" (mesmo texto/chip `→ EM_EDICAO` do B1
  do Fluxo 1) antes do loop de volta pra "Define as Recomendações" — nisso
  o mecanismo é idêntico ao do Fluxo 1, só a etapa anterior (Etapa 4) e o
  gatilho da Chefia (assinar em vez de aprovar) que mudam. `viewBox="0 0
  960 1400"` (mais baixo que o Fluxo 1 por não ter o N9 tracejado no fim).
  Legenda não lista "Planejado, não implementado" porque não há nó
  tracejado neste fluxo.
- **Fluxo 3** (`#diagram-panel-3`) é outra proposta alternativa, **não**
  verificada por execução no `fmr-frontend`. Maior diferença estrutural:
  **não tem etapa de equipe no início** — vai direto de "Inicia o Plano de
  Ação" (Etapa 1) para "Define as Recomendações" (Etapa 2); em vez disso, a
  equipe aparece como último nó do fluxo, "Equipe Disponível para
  Visualização" (`actor-shared`), só depois de "Baixa os Documentos". Etapa
  3 é "Validação de Todas as Partes" (`actor-shared`, sem excluir a Chefia
  explicitamente — diferença do texto do Fluxo 2). O ramo de devolução
  segue o mesmo mecanismo do Fluxo 1/2 (nó "Devolve para Ajustes", chip
  `→ EM_EDICAO`), mas o loop de retorno reentra em "Define as
  Recomendações", que aqui é a **Etapa 2** (não a 3) — o `y` do loop-back
  muda de acordo (`y=256`, não `y=430`). Só 3 "Etapas" numeradas (era 4 no
  Fluxo 1/2), porque não há etapa de equipe. `viewBox="0 0 960 1400"`.

- Cada aba é um `<div class="diagram-panel" role="tabpanel">` completo e
  independente: SVG + `<figcaption>` + `.legend` próprios. Nada é
  compartilhado entre painéis — ao diferenciar os fluxos, edite cada painel
  isoladamente (`#diagram-panel-1`, `#diagram-panel-2`, `#diagram-panel-3`),
  sem medo de vazar mudança pros outros.
- **Os `id` dos `<marker>` no `<defs>` de cada SVG levam sufixo `-1`/`-2`/
  `-3`** (`ah-neutral-1`, `ah-green-2`, `ah-rust-3`...), e os `marker-end`
  correspondentes apontam pro sufixo certo. Isso é obrigatório, não
  estético: `id` duplicado entre os três SVGs do mesmo documento HTML seria
  inválido, e o navegador resolveria `url(#ah-neutral)` sempre pro primeiro
  elemento com esse id — as setas do painel 2/3 acabariam usando a cor do
  painel 1 por trás das costas. Se copiar o SVG pra uma 4ª aba, mantenha o
  padrão (`-4`).
- Alternância controlada por `script.js` (IIFE `.diagram-tab`): clique troca
  `aria-selected`/`tabindex` na aba e `hidden` no painel via
  `aria-controls`/`id` — mesmo padrão de acessibilidade do
  `.rule-group-toggle`. Painel 1 começa visível, 2 e 3 com `hidden` no HTML
  (funciona sem JS: mostra só o Fluxo 1, sem os botões de aba fazerem nada).
- Estilo (`.diagram-tab`, pill ativo = `--accent-blue-soft`) reaproveita a
  mesma linguagem visual do `.filter-chip` de Sugestões, não inventa um
  visual de aba de navegador.

### Codificação de cor (atores)

| Cor             | Token               | Quem age                                                              |
| --------------- | ------------------- | --------------------------------------------------------------------- |
| Azul            | `--accent-blue`   | Auditor / Elaborador (as 4 etapas do Wizard)                          |
| Âmbar          | `--accent-amber`  | Chefia (revisa, aprova ou devolve)                                    |
| Roxo            | `--accent-violet` | Sistema (transições automáticas: disponibilizar, gerar documentos) |
| Tracejado cinza | `--planned`       | Ainda não implementado (só a Assinatura, hoje)                      |

### Geometria

- SVG **vertical**, `viewBox="0 0 960 1560"`, escalado por `svg.flow {
  width: 100%; max-width: 640px; height: auto }` — cabe na largura de
  qualquer tela, sem scroll horizontal. Essa é a segunda geometria do
  diagrama: até 13/08/2026 era horizontal (`2780×320`, tamanho fixo em
  pixels, sem escalar), o que forçava scroll horizontal em qualquer janela
  menor que 2780px. Trocado por pedido explícito do usuário — "tudo em uma
  view", sem precisar rolar pra ver o resto das etapas. Ver "Histórico".
- Coluna principal em `x=40..360` (largura de nó **320px**): os nós N1→N9
  correm de cima para baixo, cada um em `y=topo..topo+84`, com **pitch
  vertical de 174px** entre os topos (84 de altura do nó + 90 de seta) —
  use o mesmo espaçamento se for inserir um nó novo na coluna principal.
  Topos: N1=40, N2=214, N3=388, N4=562, N5=736, N6=910, N7=1084, N8=1258,
  N9=1432.
- O ramo "Solicitar Ajustes" sai da lateral direita de N6 (`x=360,y=952`)
  até o nó "Devolve para Ajustes" (`x=500..820`, mesma linha de N6). O loop
  de retorno ("Auditor corrige e reenvia") sai da lateral direita desse nó,
  sobe pela margem direita (`x=900`) até a altura de N3 (`y=430`) e reentra
  pela lateral direita de "Define as Recomendações". É por isso que o
  viewBox tem 960px de largura — os 340px extras além da coluna principal
  (360→) são só para essa moldura do loop, não para mais nós.
- Coordenadas foram calculadas à mão, não há gerador/script.
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
referência categorizada com **11 grupos** (`.rule-group`, letras A a J, com
C.1 como subgrupo de C), cada um cobrindo uma parte do sistema (criação do
plano, equipe, recomendações, validação/status, controle de edição,
documentos, ajuste por recomendação, aprovação da Chefia, histórico,
controle de acesso). Os grupos ficam num grid responsivo
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

Exceção já usada uma vez: em 13/08/2026, por pedido explícito do usuário,
D2/D5/F4 foram removidas e a numeração de D e F foi fechada, o grupo G
("Solicitar Ajustes") foi removido inteiro e H/I/J/K foram reletrados para
G/H/I/J. Foi uma decisão pontual, não uma mudança na política — a partir de
agora os códigos atuais (A–J) voltam a ser estáveis pelo mesmo motivo de
sempre; só renumere de novo se o usuário pedir explicitamente.

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
  C6 `useLimparRecomendacoes.tsx:17-19`, `planoAcaoLocalStore.ts:123-138`
- **C.1** — C8 `edicaoEmLote.ts:14-20`; C9 `edicaoEmLote.ts:30-38`; C10
  `useSelecaoMultipla.ts:41-52`
- **D** — D1 `validarPlano.ts:28-62`; D2
  `ConfirmationView.tsx:247-259`; D3 `ConfirmationView.tsx:261-303`; D4
  `usePlanoLifecycle.ts:54-66`; D5
  `ConfirmationView.tsx:186-204`, `gerar-preliminar.tsx:72-74`; D7
  `useRascunhoAutosave.ts:129-135`; D8 `useRascunhoAutosave.ts:14`,
  `planoAcaoWizard.service.ts:173-191`; D9 `useRascunhoAutosave.ts:85-127`
- **E** — E1 `usePlanoSomenteLeitura.ts:47-72`; E2
  `usePlanoSomenteLeitura.ts:55-56`; E3 `ConfirmationView.tsx:71-79`
- **F** — F1 `gerar-preliminar.tsx:72-74`; F3
  `gerarDocumentosPlano.service.ts:45-56`; F4 `useAcoesAprovacao.ts:101-121`
- **G** — G1 `ajustePlanoAcao.type.ts:14-29`; G3
  `planosAprovacao.service.ts:100-118`; G4 `ajustePlanoAcao.type.ts:22-27`;
  G5 `ajustePlanoAcao.service.ts:22-28`; G6
  `useAjusteRecomendacao.ts:62-82`; G7
  `ajusteRecomendacao.validacao.ts:44-53`; G8
  `ajusteRecomendacao.validacao.ts:18-30,70-76`; G10
  `useAjustesRecomendacaoPendentes.ts:11-25`
- **H** — H1 `planoAprovacao.type.ts:25`; H2 `useFilaAprovacao.ts:42-58`;
  H3, H4, H5, H6 `planoDetalhe.derive.ts` (H4 `:183-185`, H5 `:72-86`, H6
  `:78-84`); H7 `useDetalhePlanoAprovacao.ts:16-34`; H8
  `useDevolverAjustes.ts:82-89`; H9 `resumoDevolucao.derive.ts:15-26`
- **I** — I1 `historicoTramitacao.type.ts:12-17`; I3
  `planosAprovacao.service.ts:25-27`
- **J** — J1 `permissions.ts:22-49`; J2 `role-permissions.ts:16-30,56-92`;
  J3 `role-permissions.ts:41-54`

Sem referência no levantamento original: C2, C5, D6, F2, G2, G9, H10, I2,
J4 — regras de comportamento/decisão de produto sem um ponto único de
código, ou levantadas por leitura geral do fluxo.

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

Hoje há nove cartões reais, em quatro tags:

- **Assinaturas** (5 cartões) — quatro propostas de layout para a mesma
  tela dedicada de acompanhamento de assinaturas (1A cartões por
  assinante, 1B cartões com indicadores no cabeçalho, 1C linha do tempo
  vertical, 1D tabela de partes signatárias — mesmo título/texto, mockup
  diferente em cada uma), mais a proposta de exibir esse acompanhamento
  como bloco separado das 4 etapas do wizard (já que assinaturas não são
  preenchidas pelo usuário como as demais etapas). As quatro variações de
  layout levam `<span class="variant-tag">` (1A/1B/1C/1D) — só elas, pela
  mesma razão de sempre (mesma proposta em formatos diferentes). **1A, 1B
  e 1C estão com `status rejected` ("Reprovado"); a 1D está com
  `status accepted` ("Aprovado")** — a decisão entre as quatro variações
  de layout já foi tomada: 1D (tabela de partes signatárias) venceu. Ver
  "Histórico".
- **Aprovação** (2 cartões) — modal de confirmação com download em 2
  botões (planilha + plano, separados por causa do bloqueio de downloads
  simultâneos do navegador); o mesmo botão/modal de download reaproveitado
  na tabela "Meus Planos de Ação" para baixar de novo os documentos de um
  plano já aprovado.
- **Parametrização** (1 cartão, primeiro com essa tag) — tela de
  parametrização dinâmica reunindo as regras de configuração de um
  contexto (no caso, quais recomendações entram no Plano de Ação), com a
  ideia de servir de base extensível pra mais padronizações desse tipo
  pelo próprio frontend. Mockup (`sugestao-parametrizacao-dinamica.png`) é
  um screenshot real da tela "Parametrização de Recomendações" do
  `fmr-frontend` (Administração), não um mockup desenhado — a sugestão é
  acrescentar essa mesma lógica a outros contextos de parametrização, não
  redesenhar a tela em si.
- **Relatório Gerencial** (1 cartão, primeiro com essa tag) — tela onde a
  Chefia marca atividades de auditoria e gera um relatório gerencial
  consolidado de monitoramento em Excel, com os filtros aplicados
  refletidos no arquivo. Reaproveita a mesma lógica da tela "Relatório
  Consolidado" já existente em Consultar (seleção de atividades, filtros,
  resumo com totais antes de gerar), só que com recorte gerencial da
  Chefia em vez de por atividade de auditoria individual. Mockup
  (`sugestao-relatorio-gerencial.png`) é screenshot real da tela
  "Relatório Consolidado" (Consultar → Relatório Consolidado) do
  `fmr-frontend`, mesma lógica do cartão de "Parametrização": ilustra o
  padrão existente que a sugestão propõe adaptar, não um desenho da tela
  nova em si.

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
- **13/08/2026** — fluxograma redesenhado de horizontal (`2780×320`,
  tamanho fixo, exigia scroll horizontal em qualquer tela menor) para
  vertical (`960×1560`, escala por `viewBox` até 640px de largura, sem
  scroll horizontal em tela nenhuma). Coluna única de cima para baixo; o
  ramo "Solicitar Ajustes" e o loop de retorno "Auditor corrige e reenvia"
  passaram a rodear a coluna pela margem direita em vez de por baixo do
  fluxo principal. Pedido do usuário: a versão horizontal "quebrava pra
  fora da página".
- **13/08/2026** — N4 do diagrama renomeado de "Revisa e Valida" para
  "Validação", com subtítulo reescrito para deixar explícita a bifurcação:
  o usuário valida os dados preenchidos e então escolhe entre disponibilizar
  para a Chefia ou permanecer em edição. Alinha o rótulo do nó com o termo
  já usado nas Regras de Negócio (D2/D3, "Validar Informações").
- **13/08/2026** — Regras de Negócio: D2, D5 e F4 removidas e a numeração
  de D e F fechada (sem buraco); grupo G ("Solicitar Ajustes") removido
  inteiro; H/I/J/K reletrados para G/H/I/J. Total passou de 12 para 11
  grupos (A–J + C.1). Rastreabilidade técnica em "Referências técnicas"
  atualizada para acompanhar os novos códigos — ver nota de exceção logo
  acima de "Linguagem de negócio, não de código".
- **13/08/2026** — `<figure id="diagrama">` ganhou três abas (Fluxo 1/2/3,
  ver "Abas" em "O fluxograma"), preparando espaço pra mais de uma visão de
  fluxo na mesma tela. Por enquanto as três mostram o mesmo diagrama
  duplicado — pedido explícito do usuário foi só gerar o placeholder das
  três abas por ora; conteúdo de Fluxo 2 e Fluxo 3 ainda não foi definido.
- **13/08/2026** — Fluxo 2 (`#diagram-panel-2`) ganhou um fluxo próprio,
  diferente do Fluxo 1: equipe só visualizada pelo auditor (edição vira
  exclusiva da Chefia), validação da Etapa 4 passa a ser das partes
  envolvidas exceto a Chefia, e a decisão da Chefia na revisão vira
  **Assinar** (gera e libera os documentos ali mesmo, sem N9 planejado
  separado) ou **Solicitar Ajuste** (nesta primeira versão, voltava direto
  pra Etapa 3 sem nó intermediário — corrigido ainda no mesmo dia, ver
  entrada seguinte). É uma proposta/hipótese do usuário, **não** verificada
  por execução no `fmr-frontend` — ver "Abas" pros detalhes estruturais.
  Fluxo 3, neste momento, seguia como placeholder idêntico ao Fluxo 1 —
  ganhou conteúdo próprio ainda no mesmo dia (ver entradas seguintes).
- **13/08/2026** — Fluxo 2: adicionado o nó "Devolve para Ajustes" (mesmo
  texto/chip `→ EM_EDICAO` do B1 do Fluxo 1) entre "Chefia Revisa o Plano"
  e o loop de volta pra "Define as Recomendações", quando a Chefia solicita
  ajuste. Antes o loop voltava direto sem etapa intermediária; a pedido do
  usuário, o Fluxo 2 passou a espelhar o mesmo mecanismo de devolução do
  Fluxo 1 (só o gatilho da Chefia — assinar em vez de aprovar — continua
  diferente).
- **13/08/2026** — Fluxo 3 (`#diagram-panel-3`) ganhou um fluxo próprio, a
  terceira proposta/hipótese, **não** verificada por execução no
  `fmr-frontend`: sem etapa de equipe no início (vai direto de "Inicia" pra
  "Define as Recomendações"), Etapa 3 = "Validação de Todas as Partes",
  Chefia decide entre Assinar/Solicitar Ajuste com o mesmo mecanismo de
  devolução do Fluxo 1/2 (confirmado com o usuário antes de implementar,
  já que ele não tinha descrito esse ramo), e a equipe só aparece no fim
  do fluxo como "Equipe Disponível para Visualização" — ver "Abas" pros
  detalhes estruturais completos.
- **13/08/2026** — Cartões de "Sugestões" das variações 1A, 1B e 1C de
  "Tela de Acompanhamento de Assinaturas" removidos a pedido do usuário;
  ficou só a 1D (tabela de partes signatárias), que perdeu o
  `variant-tag` por não ter mais variação ao lado pra distinguir. Imagens
  órfãs (`sugestao-assinaturas-mockup.png`,
  `sugestao-assinaturas-mockup-cards.png`,
  `sugestao-assinaturas-mockup-timeline.png`) apagadas do projeto. Total
  caiu de sete para quatro cartões reais.
- **13/08/2026** — Cartão novo em "Sugestões": "Tela de Parametrização
  Dinâmica", primeira com a tag "Parametrização" (aparece sozinha no
  filtro agora). Mockup (`sugestao-parametrizacao-dinamica.png`) é
  screenshot real da tela "Parametrização de Recomendações" do
  `fmr-frontend` (Administração → Parametrização de Recomendações),
  colado pelo usuário e localizado em
  `C:\Users\ryan.pereira\Pictures\Screenshots\` pelo timestamp mais
  recente — não um mockup desenhado como os demais cartões. Total subiu
  de quatro para cinco cartões reais, em três tags.
- **13/08/2026** — Cartões 1A, 1B e 1C de "Tela de Acompanhamento de
  Assinaturas" voltaram (removidos mais cedo no mesmo dia), agora com
  `status rejected` ("Reprovado") em vez de `status open` — decisão
  registrada em vez de removida. `variant-tag` voltou nos três e também
  foi devolvido na 1D (agora as quatro variações estão marcadas de novo,
  já que a comparação lado a lado faz sentido outra vez). Imagens
  restauradas do git (`git checkout --`) em vez de recriadas. Total voltou
  de cinco para oito cartões reais.
- **13/08/2026** — Status da 1D ("Tela de Acompanhamento de Assinaturas",
  tabela de partes signatárias) mudou de `status open` ("Em aberto") pra
  `status accepted` ("Aprovado") — fecha a decisão entre as quatro
  variações de layout, já que as outras três (1A/1B/1C) estão `rejected`.
- **19/08/2026** — Cartão novo em "Sugestões": "Relatório Gerencial de
  Monitoramento", primeira com a tag "Relatório Gerencial" (aparece
  sozinha no filtro agora). Proposta: a Chefia marca atividades de
  auditoria e gera um relatório gerencial consolidado em Excel, com os
  filtros aplicados refletidos no arquivo — reaproveitando a mesma lógica
  da tela "Relatório Consolidado" já existente em Consultar, mas com
  recorte gerencial da Chefia em vez de por atividade. Mockup
  (`sugestao-relatorio-gerencial.png`) é screenshot real dessa tela
  existente, colado pelo usuário e localizado em
  `C:\Users\ryan.pereira\Pictures\Screenshots\` pelo timestamp mais
  recente — mesmo padrão do cartão de "Parametrização" (screenshot real
  do sistema como ilustração do padrão a adaptar, não mockup desenhado).
  Total subiu de oito para nove cartões reais, em quatro tags.
