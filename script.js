/**
 * Alterna o tema entre Sistema / Claro / Escuro e lembra a escolha.
 *
 * O artefato original vivia dentro do visualizador do claude.ai, que resolve
 * o tema por você. Um arquivo aberto direto no navegador não tem esse
 * controle — este botão substitui isso enquanto você ajusta o diagrama.
 */
(function () {
  const STORAGE_KEY = "planoAcaoTheme";
  const MODES = ["system", "light", "dark"];
  const LABELS = {
    system: "Tema: Sistema",
    light: "Tema: Claro",
    dark: "Tema: Escuro",
  };

  const root = document.documentElement;
  const button = document.getElementById("theme-toggle");

  function applyTheme(mode) {
    if (mode === "light" || mode === "dark") {
      root.setAttribute("data-theme", mode);
    } else {
      root.removeAttribute("data-theme");
    }
    button.textContent = LABELS[mode];
    button.setAttribute("data-mode", mode);
  }

  function loadInitialMode() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return MODES.includes(stored) ? stored : "system";
  }

  let mode = loadInitialMode();
  applyTheme(mode);

  button.addEventListener("click", () => {
    mode = MODES[(MODES.indexOf(mode) + 1) % MODES.length];
    localStorage.setItem(STORAGE_KEY, mode);
    applyTheme(mode);
  });
})();

/**
 * Filtro de sugestões por tag (flag). Os botões não são fixos no HTML —
 * são gerados a partir das tags que já existem nos cartões, então uma tag
 * nova (ex.: "Wizard") aparece sozinha no filtro assim que o primeiro
 * cartão com ela for adicionado, sem editar este arquivo.
 */
(function () {
  const filterBar = document.getElementById("suggestions-filter");
  const grid = document.querySelector(".suggestions-grid");
  if (!filterBar || !grid) return;

  const cards = Array.from(grid.querySelectorAll(".suggestion-card"));
  const tags = [];

  cards.forEach((card) => {
    const tagEl = card.querySelector(".tag");
    const tag = tagEl ? tagEl.textContent.trim() : "";
    card.dataset.tag = tag;
    if (tag && !tags.includes(tag)) tags.push(tag);
  });

  // Sem tags (ou só uma), o filtro não agrega nada — não mostra a barra.
  if (tags.length < 2) return;

  function countFor(tag) {
    return tag === "" ? cards.length : cards.filter((c) => c.dataset.tag === tag).length;
  }

  function makeChip(tag, label) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "filter-chip";
    btn.dataset.filter = tag;
    btn.textContent = `${label} (${countFor(tag)})`;
    return btn;
  }

  const allChip = makeChip("", "Todas");
  allChip.classList.add("is-active");
  filterBar.appendChild(allChip);
  tags.forEach((tag) => filterBar.appendChild(makeChip(tag, tag)));

  filterBar.addEventListener("click", (event) => {
    const chip = event.target.closest(".filter-chip");
    if (!chip) return;

    filterBar
      .querySelectorAll(".filter-chip")
      .forEach((btn) => btn.classList.toggle("is-active", btn === chip));

    const filter = chip.dataset.filter;
    cards.forEach((card) => {
      card.hidden = filter !== "" && card.dataset.tag !== filter;
    });
  });
})();

/**
 * Expande/recolhe cada grupo de Regras de Negócio. Recolhido é o estado
 * inicial (resumo de uma linha); clicar no cabeçalho troca o resumo pela
 * lista completa de regras daquele grupo. Cada grupo é independente —
 * expandir um não afeta os outros.
 */
(function () {
  const toggles = document.querySelectorAll(".rule-group-toggle");

  toggles.forEach((toggle) => {
    const group = toggle.closest(".rule-group");
    const summary = group.querySelector(".rule-group-summary");
    const list = group.querySelector(".rule-group-list");
    if (!list) return;

    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      list.hidden = expanded;
      if (summary) summary.hidden = !expanded;
      group.classList.toggle("is-expanded", !expanded);
    });
  });
})();
