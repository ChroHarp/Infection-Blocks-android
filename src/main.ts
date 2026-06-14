import "./styles.css";
import blockedAssetUrl from "./assets/theme/blocked.png";
import infectedAssetUrl from "./assets/theme/infected.png";
import requiredSeedAssetUrl from "./assets/theme/required-seed.png";
import selectedAssetUrl from "./assets/theme/selected.png";
import spreadingAssetUrl from "./assets/theme/spreading.png";
import { coordKey, uniqueCoords } from "./domain/coords";
import { maxPassingSeeds, runInfection } from "./domain/engine";
import type { CellCoord, CellKind, Level, LevelPack, LevelPackStatus, Locale } from "./domain/types";
import { sampleLevels } from "./data/sampleLevels";
import { t } from "./i18n";
import {
  loadEditorIndex,
  loadEditorLevels,
  loadLocale,
  loadProgress,
  type ProgressMap,
  saveEditorIndex,
  saveEditorLevels,
  saveLocale,
  saveProgress
} from "./storage";

type Screen = "packages" | "levels" | "play" | "editor";
type EditorTool = CellKind;

interface AppState {
  locale: Locale;
  screen: Screen;
  levels: Level[];
  levelIndex: number;
  level: Level;
  selectedPackId: string;
  tool: EditorTool;
  seeds: CellCoord[];
  messageKey: string;
  jsonText: string;
  resultInfected: Set<string>;
  waveCells: Set<string>;
  growingCells: Set<string>;
  finishBloomCells: Set<string>;
  isSpreading: boolean;
  isFinalizing: boolean;
  failureDimming: boolean;
  victoryOpen: boolean;
  failureOpen: boolean;
  boardShakeKey: number;
  lastStars: 0 | 1 | 2 | 3;
  progress: ProgressMap;
}

const appRoot = document.querySelector<HTMLDivElement>("#app");

if (!appRoot) {
  throw new Error("Missing #app root");
}

const root = appRoot;
const themeAssetUrls = [selectedAssetUrl, spreadingAssetUrl, infectedAssetUrl, requiredSeedAssetUrl, blockedAssetUrl];

const searchParams = new URLSearchParams(window.location.search);
const editorBuildEnabled = import.meta.env.VITE_ENABLE_EDITOR !== "false";
const editorEnabled = editorBuildEnabled && (searchParams.get("editor") === "1" || window.location.pathname.endsWith("/editor.html"));
const initialLevels = editorEnabled ? loadEditorLevels(sampleLevels) : sampleLevels;
const initialIndex = editorEnabled ? loadEditorIndex(initialLevels.length) : 0;
const initialLevel = initialLevels[initialIndex];

const state: AppState = {
  locale: loadLocale(),
  screen: editorEnabled ? "editor" : "packages",
  levels: initialLevels,
  levelIndex: initialIndex,
  level: initialLevel,
  selectedPackId: initialLevel.packId,
  tool: "playable",
  seeds: [...initialLevel.requiredSeeds],
  messageKey: "readyToInfect",
  jsonText: JSON.stringify(initialLevel, null, 2),
  resultInfected: new Set(),
  waveCells: new Set(),
  growingCells: new Set(),
  finishBloomCells: new Set(),
  isSpreading: false,
  isFinalizing: false,
  failureDimming: false,
  victoryOpen: false,
  failureOpen: false,
  boardShakeKey: 0,
  lastStars: 0,
  progress: loadProgress()
};

function preloadThemeAssets(): void {
  for (const assetUrl of themeAssetUrls) {
    const image = new Image();
    image.decoding = "async";
    image.src = assetUrl;
    void image.decode?.().catch(() => undefined);
  }
}

function render(): void {
  root.innerHTML = `
    <main class="app-shell screen-${state.screen}">
      <header class="app-header">
        <div>
          <p class="eyebrow">INFECTION BLOCKS</p>
          <h1>${t(state.locale, "appTitle")}</h1>
          <p class="subtitle">${t(state.locale, "appSubtitle")}</p>
        </div>
        <label class="language-control">
          <span>${t(state.locale, "language")}</span>
          <select data-action="locale">
            <option value="zh-Hant" ${state.locale === "zh-Hant" ? "selected" : ""}>繁中</option>
            <option value="en" ${state.locale === "en" ? "selected" : ""}>English</option>
            <option value="ja" ${state.locale === "ja" ? "selected" : ""}>日本語</option>
          </select>
        </label>
      </header>

      ${editorEnabled ? renderDevNav() : ""}

      ${state.screen === "packages" ? renderPackageSelect() : ""}
      ${state.screen === "levels" ? renderLevelSelect() : ""}
      ${state.screen === "play" ? renderPlayScreen() : ""}
      ${editorEnabled && state.screen === "editor" ? renderEditor() : ""}
    </main>
  `;

  bindEvents();
}

function renderDevNav(): string {
  return `
    <nav class="dev-tabs" aria-label="Developer">
      ${tabButton("packages", "screenPackages")}
      ${tabButton("levels", "screenLevels")}
      ${tabButton("play", "screenPlay")}
      ${tabButton("editor", "screenEditor")}
    </nav>
  `;
}

function renderPackageSelect(): string {
  const completed = state.levels.filter((level) => state.progress[level.id]?.completed).length;
  const totalStars = state.levels.reduce((sum, level) => sum + (state.progress[level.id]?.bestStars ?? 0), 0);
  const packs = groupedLevels();

  return `
    <section class="level-screen">
      <div class="summary-band">
        <div>
          <span>${t(state.locale, "levelSelect")}</span>
          <strong>${completed} / ${state.levels.length}</strong>
        </div>
        <div>
          <span>${t(state.locale, "starsEarned")}</span>
          <strong>${starText(totalStars, state.levels.length * 3)}</strong>
        </div>
      </div>

      <div class="package-grid">
        ${packs.map((pack) => renderPackageCard(pack)).join("")}
      </div>
    </section>
  `;
}

function renderPackageCard(pack: LevelPack): string {
  const completed = pack.levels.filter((level) => state.progress[level.id]?.completed).length;
  const totalStars = pack.levels.reduce((sum, level) => sum + (state.progress[level.id]?.bestStars ?? 0), 0);
  const paid = pack.levels.some((level) => !level.free);
  const unlocked = isPackageUnlocked(pack);
  const nextIndex = recommendedLevelIndex(pack);
  const nextLevel = nextIndex >= 0 ? state.levels[nextIndex] : pack.levels[0];

  return `
    <button class="package-card ${unlocked ? "" : "locked"}" data-pack-id="${pack.id}" ${unlocked ? "" : "disabled"}>
      <div class="package-card-main">
        <span>${t(state.locale, "package")}</span>
        <strong>${pack.id}</strong>
      </div>
      <div class="package-card-stats">
        <span class="pill ${paid ? "paid" : "free"}">${t(state.locale, paid ? "paidLevel" : "freeLevel")}</span>
        <span>${completed} / ${pack.levels.length}</span>
        <span>${starText(totalStars, pack.levels.length * 3)}</span>
      </div>
      <div class="package-card-continue">
        <span>${t(state.locale, completed > 0 ? "continueLevel" : "playLevel")}</span>
        <strong>${nextLevel?.id ?? pack.id}</strong>
      </div>
    </button>
  `;
}

function renderLevelSelect(): string {
  const packs = groupedLevels();
  const pack = packs.find((candidate) => candidate.id === state.selectedPackId) ?? packs[0];

  if (!pack) return "";

  return `
    <section class="level-screen">
      <header class="level-pack-header">
        <button class="ghost-button" data-action="back-packages">${t(state.locale, "backToPackages")}</button>
        <div>
          <span>${t(state.locale, "package")}</span>
          <strong>${pack.id}</strong>
        </div>
        <button class="primary-action" data-action="continue-package">${t(state.locale, "continueLevel")}</button>
      </header>
      ${renderPackageSection(pack)}
    </section>
  `;
}

function renderPackageSection(pack: LevelPack): string {
  const completed = pack.levels.filter((level) => state.progress[level.id]?.completed).length;
  const totalStars = pack.levels.reduce((sum, level) => sum + (state.progress[level.id]?.bestStars ?? 0), 0);
  const paid = pack.levels.some((level) => !level.free);

  return `
    <section class="package-section">
      <header class="package-header">
        <div>
          <span>${t(state.locale, "package")}</span>
          <strong>${pack.id}</strong>
        </div>
        <div class="package-meta">
          <span class="pill ${paid ? "paid" : "free"}">${t(state.locale, paid ? "paidLevel" : "freeLevel")}</span>
          <span>${completed} / ${pack.levels.length}</span>
          <span>${starText(totalStars, pack.levels.length * 3)}</span>
        </div>
      </header>
      <div class="level-list">
        ${pack.levels.map((level) => renderLevelCard(level, state.levels.findIndex((candidate) => candidate.id === level.id))).join("")}
      </div>
    </section>
  `;
}

function renderLevelCard(level: Level, index: number): string {
  const progress = state.progress[level.id];
  const unlocked = isLevelUnlocked(index);
  const selected = index === state.levelIndex;
  const label = progress?.completed ? `${t(state.locale, "best")} ${"★".repeat(progress.bestStars)}` : t(state.locale, "notCleared");

  return `
    <button class="level-card ${selected ? "selected" : ""} ${unlocked ? "" : "locked"}" data-level-index="${index}" ${unlocked ? "" : "disabled"}>
      <div class="level-card-main">
        <span class="level-number">${String(index + 1).padStart(2, "0")}</span>
        <div>
          <strong>${level.id}</strong>
          <span>${level.rows}x${level.cols} · ${t(state.locale, "seedLimit")} ${maxPassingSeeds(level)}</span>
        </div>
      </div>
      <div class="level-card-meta">
        <span class="pill ${level.free ? "free" : "paid"}">${t(state.locale, level.free ? "freeLevel" : "paidLevel")}</span>
        <span>${unlocked ? label : t(state.locale, "locked")}</span>
      </div>
      <div class="mini-board-frame">
        ${renderMiniBoard(level)}
      </div>
    </button>
  `;
}

function renderMiniBoard(level: Level): string {
  const cells: string[] = [];
  const maxDimension = Math.max(level.rows, level.cols);
  const miniCellSize = Math.max(7, Math.floor((112 - (maxDimension - 1) * 2) / maxDimension));

  for (let row = 0; row < level.rows; row += 1) {
    for (let col = 0; col < level.cols; col += 1) {
      cells.push(`<span class="mini-cell ${getCellKind(level, row, col)}"></span>`);
    }
  }

  return `<div class="mini-board" style="--rows:${level.rows};--cols:${level.cols};--mini-cell:${miniCellSize}px">${cells.join("")}</div>`;
}

function groupedLevels(): LevelPack[] {
  const packIds = uniquePackIds();

  return packIds.map((packId, index) => {
    const levels = state.levels
      .filter((level) => level.packId === packId)
      .sort((a, b) => a.order - b.order);
    const paid = levels.some((level) => !level.free);

    return {
      id: packId,
      order: index + 1,
      titleKey: `pack.${packId.replaceAll("-", "")}`,
      access: paid ? "paid" : "free",
      purchaseId: paid ? "unlock_full_game" : undefined,
      levels
    };
  });
}

function renderPlayScreen(): string {
  const progress = state.progress[state.level.id];

  return `
    <section class="play-screen">
      <header class="play-status">
        <button class="ghost-button" data-action="back-levels">${t(state.locale, "backToLevels")}</button>
        <div>
          <span>${t(state.locale, "level")} ${state.levelIndex + 1}</span>
          <strong>${state.level.id}</strong>
        </div>
        <div class="status-stars">${progress?.completed ? "★".repeat(progress.bestStars) : "☆☆☆"}</div>
      </header>

      <section class="board-stage ${state.boardShakeKey > 0 ? "limit-shake" : ""} ${state.failureDimming ? "failure-dimming" : ""}">
        ${renderGrid("play")}
      </section>

      <section class="play-panel">
        <div class="play-metrics">
          <div>
            <span>${t(state.locale, "seeds")}</span>
            <strong>${state.seeds.length} / ${maxPassingSeeds(state.level)}</strong>
          </div>
          <div>
            <span>${t(state.locale, "starsEarned")}</span>
            <strong>${"★".repeat(state.lastStars)}${"☆".repeat(3 - state.lastStars)}</strong>
          </div>
        </div>
        <p class="message">${t(state.locale, state.isSpreading || (state.isFinalizing && !state.failureDimming) ? "spreading" : state.messageKey)}</p>
        <div class="bottom-actions">
          <button data-action="undo" ${state.isSpreading || state.isFinalizing ? "disabled" : ""}>${t(state.locale, "undo")}</button>
          <button class="primary-action" data-action="start-infection" ${state.isSpreading || state.isFinalizing || state.seeds.length === 0 ? "disabled" : ""}>${t(state.locale, "start")}</button>
          <button data-action="reset-seeds" ${state.isSpreading || state.isFinalizing ? "disabled" : ""}>${t(state.locale, "reset")}</button>
        </div>
      </section>

      ${state.victoryOpen ? renderVictoryDialog() : ""}
      ${state.failureOpen ? renderFailureDialog() : ""}
    </section>
  `;
}

function renderVictoryDialog(): string {
  const nextIndex = nextLevelIndex();
  const hasNext = nextIndex !== null;

  return `
    <div class="modal-backdrop" role="dialog" aria-modal="true">
      <section class="result-dialog">
        <div class="result-burst" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <span class="result-kicker">${t(state.locale, "completed")}</span>
        <h2>${t(state.locale, "victoryTitle")}</h2>
        ${renderResultStars()}
        <p class="result-message">${t(state.locale, "victoryMessage")}</p>
        <div class="result-actions">
          <button class="primary-action" data-action="next-after-win" ${hasNext ? "" : "disabled"}>${t(state.locale, "nextLevel")}</button>
          <button data-action="retry-after-win">${t(state.locale, "retryLevel")}</button>
          <button data-action="exit-after-win">${t(state.locale, "backToLevels")}</button>
        </div>
      </section>
    </div>
  `;
}

function renderResultStars(): string {
  const stars = Array.from({ length: 3 }, (_, index) => {
    const filled = index < state.lastStars;
    const label = filled ? "filled" : "empty";
    const glyph = filled ? "&#9733;" : "&#9734;";

    return `<span class="result-star ${label}" style="--star-index:${index}">${glyph}</span>`;
  }).join("");

  return `<div class="result-stars" aria-label="${t(state.locale, "starsEarned")}: ${state.lastStars} / 3">${stars}</div>`;
}

function renderFailureDialog(): string {
  const message = t(state.locale, state.messageKey === "completed" ? "failed" : state.messageKey);

  return `
    <div class="modal-backdrop" role="dialog" aria-modal="true">
      <section class="result-dialog failure-dialog">
        <span class="result-kicker">${t(state.locale, "failureKicker")}</span>
        <h2>${t(state.locale, "failed")}</h2>
        <div class="failure-mark" aria-hidden="true">!</div>
        <p class="result-message">${message}</p>
        <div class="result-actions">
          <button class="primary-action" data-action="return-after-fail">${t(state.locale, "returnToLevel")}</button>
          <button data-action="exit-after-fail">${t(state.locale, "exitLevel")}</button>
        </div>
      </section>
    </div>
  `;
}

function renderEditor(): string {
  return `
    <section class="editor-layout">
      <aside class="editor-panel">
        <div class="level-nav">
          <button data-action="prev-level" type="button" ${state.levelIndex === 0 ? "disabled" : ""}>${t(state.locale, "prevLevel")}</button>
          <div class="level-position">${state.levelIndex + 1} / ${state.levels.length}</div>
          <button data-action="next-level" type="button" ${state.levelIndex === state.levels.length - 1 ? "disabled" : ""}>${t(state.locale, "nextLevel")}</button>
        </div>
        <div class="editor-actions">
          <button data-action="new-level" type="button">${t(state.locale, "newLevel")}</button>
          <button data-action="duplicate-level" type="button">${t(state.locale, "duplicateLevel")}</button>
          <button data-action="reorder-levels" type="button">${t(state.locale, "reorderLevels")}</button>
        </div>
        <h2>${t(state.locale, "editorTitle")}</h2>
        <p class="hint">${t(state.locale, "editorHelp")}</p>

        <div class="field-grid">
          ${numberInput("rows", "rows", state.level.rows, 1, 16)}
          ${numberInput("cols", "cols", state.level.cols, 1, 16)}
          ${textInput("id", "levelId", state.level.id)}
          ${textInput("packId", "packId", state.level.packId)}
          ${numberInput("star3", "star3Limit", state.level.stars.three, 1, 99)}
          ${optionalNumberInput("star2", "star2Limit", state.level.stars.two, 1, 99)}
          ${optionalNumberInput("star1", "star1Limit", state.level.stars.one, 1, 99)}
          <label class="check-row">
            <input data-field="free" type="checkbox" ${state.level.free ? "checked" : ""} />
            <span>${t(state.locale, "freeLevel")}</span>
          </label>
        </div>

        <div class="tool-grid">
          ${toolButton("playable", "toolPlayable")}
          ${toolButton("hole", "toolHole")}
          ${toolButton("requiredSeed", "toolRequired")}
          ${toolButton("blockedSeed", "toolBlocked")}
        </div>

        <div class="json-actions">
          <button data-action="export-json">${t(state.locale, "exportJson")}</button>
          <button data-action="copy-json">${t(state.locale, "copyJson")}</button>
          <button data-action="import-json">${t(state.locale, "importJson")}</button>
          <button data-action="save-draft">${t(state.locale, "saveDraft")}</button>
          <button data-action="publish-pack">${t(state.locale, "publishPack")}</button>
        </div>
      </aside>

      <section class="editor-workspace">
        ${renderGrid("editor")}
        <p class="message">${t(state.locale, state.messageKey)}</p>
        <textarea class="json-box" data-field="jsonText" spellcheck="false">${escapeHtml(state.jsonText)}</textarea>
        <p class="hint">${t(state.locale, "jsonHelp")}</p>
      </section>
    </section>
  `;
}

function renderGrid(mode: "editor" | "play"): string {
  const cellSize = `${calculateCellSize(mode)}px`;
  const cells: string[] = [];

  for (let row = 0; row < state.level.rows; row += 1) {
    for (let col = 0; col < state.level.cols; col += 1) {
      const key = `${row}:${col}`;
      const kind = getCellKind(state.level, row, col);
      const selected = state.seeds.some((coord) => coordKey(coord) === key);
      const infected = state.resultInfected.has(key);
      const spreading = state.waveCells.has(key);
      const growing = state.growingCells.has(key);
      const blooming = state.finishBloomCells.has(key);
      const playKind = mode === "play" ? `play-${kind}` : "";
      const layer = row * state.level.cols + col;

      cells.push(`
        <button
          class="cell ${kind} ${playKind} ${selected ? "selected" : ""} ${infected ? "infected" : ""} ${spreading ? "spreading" : ""} ${growing ? "growing" : ""} ${blooming ? "blooming" : ""}"
          style="--cell-layer:${layer}"
          data-cell="${row},${col}"
          type="button"
          aria-label="${row + 1},${col + 1}"
        >
          ${spreading ? `<span class="cell-wave" aria-hidden="true"></span>` : ""}
          ${blooming ? `<span class="cell-bloom" aria-hidden="true"></span>` : ""}
        </button>
      `);
    }
  }

  return `<div class="grid ${mode}-grid" style="--rows:${state.level.rows};--cols:${state.level.cols};--cell-size:${cellSize}">${cells.join("")}</div>`;
}

function bindEvents(): void {
  root.querySelector<HTMLSelectElement>("[data-action='locale']")?.addEventListener("change", (event) => {
    const locale = (event.target as HTMLSelectElement).value as Locale;
    state.locale = locale;
    saveLocale(locale);
    render();
  });

  root.querySelectorAll<HTMLElement>("[data-screen]").forEach((button) => {
    button.addEventListener("click", () => setScreen(button.dataset.screen as Screen));
  });

  root.querySelectorAll<HTMLElement>("[data-pack-id]").forEach((button) => {
    button.addEventListener("click", () => openPackage(button.dataset.packId ?? state.selectedPackId));
  });

  root.querySelectorAll<HTMLElement>("[data-level-index]").forEach((button) => {
    button.addEventListener("click", () => openLevel(Number(button.dataset.levelIndex)));
  });

  root.querySelector<HTMLElement>("[data-action='back-packages']")?.addEventListener("click", () => setScreen("packages"));
  root.querySelector<HTMLElement>("[data-action='continue-package']")?.addEventListener("click", continuePackage);
  root.querySelector<HTMLElement>("[data-action='back-levels']")?.addEventListener("click", () => setScreen("levels"));
  root.querySelector<HTMLElement>("[data-action='next-after-win']")?.addEventListener("click", openNextLevelAfterWin);
  root.querySelector<HTMLElement>("[data-action='retry-after-win']")?.addEventListener("click", retryAfterWin);
  root.querySelector<HTMLElement>("[data-action='exit-after-win']")?.addEventListener("click", exitAfterWin);
  root.querySelector<HTMLElement>("[data-action='return-after-fail']")?.addEventListener("click", returnAfterFail);
  root.querySelector<HTMLElement>("[data-action='exit-after-fail']")?.addEventListener("click", exitAfterFail);
  root.querySelector<HTMLElement>("[data-action='start-infection']")?.addEventListener("click", startInfection);
  root.querySelector<HTMLElement>("[data-action='undo']")?.addEventListener("click", undoSeed);
  root.querySelector<HTMLElement>("[data-action='reset-seeds']")?.addEventListener("click", resetPlayState);

  root.querySelectorAll<HTMLElement>("[data-cell]").forEach((cell) => {
    cell.addEventListener("click", () => {
      const [row, col] = cell.dataset.cell?.split(",").map(Number) ?? [0, 0];
      state.screen === "editor" ? editCell(row, col) : toggleSeed(row, col);
      render();
    });
  });

  root.querySelectorAll<HTMLInputElement | HTMLSelectElement>("[data-field]").forEach((input) => {
    input.addEventListener("change", () => updateField(input));
  });

  root.querySelector<HTMLTextAreaElement>("[data-field='jsonText']")?.addEventListener("input", (event) => {
    state.jsonText = (event.target as HTMLTextAreaElement).value;
  });

  root.querySelectorAll<HTMLElement>("[data-tool]").forEach((button) => {
    button.addEventListener("click", () => {
      state.tool = button.dataset.tool as EditorTool;
      render();
    });
  });

  root.querySelector<HTMLElement>("[data-action='export-json']")?.addEventListener("click", exportJson);
  root.querySelector<HTMLElement>("[data-action='copy-json']")?.addEventListener("click", copyJson);
  root.querySelector<HTMLElement>("[data-action='import-json']")?.addEventListener("click", importJson);
  root.querySelector<HTMLElement>("[data-action='prev-level']")?.addEventListener("click", () => {
    switchLevel(state.levelIndex - 1);
    render();
  });
  root.querySelector<HTMLElement>("[data-action='next-level']")?.addEventListener("click", () => {
    switchLevel(state.levelIndex + 1);
    render();
  });
  root.querySelector<HTMLElement>("[data-action='new-level']")?.addEventListener("click", createLevel);
  root.querySelector<HTMLElement>("[data-action='duplicate-level']")?.addEventListener("click", duplicateLevel);
  root.querySelector<HTMLElement>("[data-action='reorder-levels']")?.addEventListener("click", reorderLevels);
  root.querySelector<HTMLElement>("[data-action='save-draft']")?.addEventListener("click", () => saveCurrentPackToFirestore("draft"));
  root.querySelector<HTMLElement>("[data-action='publish-pack']")?.addEventListener("click", () => saveCurrentPackToFirestore("published"));
}

function setScreen(screen: Screen): void {
  if (screen === "editor" && !editorEnabled) return;

  state.screen = screen;
  if (screen === "packages" || screen === "levels") {
    clearTransientRunFlags();
    state.victoryOpen = false;
    state.failureOpen = false;
  }
  if (screen === "play") {
    syncRequiredSeeds();
    state.messageKey = "readyToInfect";
  }
  if (screen === "editor") {
    exportJson();
    state.messageKey = "editorHelp";
  }
  render();
}

function openPackage(packId: string): void {
  state.selectedPackId = packId;
  setScreen("levels");
}

function continuePackage(): void {
  const pack = groupedLevels().find((candidate) => candidate.id === state.selectedPackId);
  if (!pack) return;

  const index = recommendedLevelIndex(pack);
  if (index >= 0) openLevel(index);
}

function openLevel(index: number): void {
  if (!isLevelUnlocked(index)) return;
  switchLevel(index);
  setScreen("play");
}

function openNextLevelAfterWin(): void {
  const index = nextLevelIndex();
  if (index === null) return;
  state.victoryOpen = false;
  openLevel(index);
}

function exitAfterWin(): void {
  state.victoryOpen = false;
  setScreen("levels");
}

function retryAfterWin(): void {
  resetPlayState();
}

function returnAfterFail(): void {
  clearRunState();
  state.messageKey = "readyToInfect";
  render();
}

function exitAfterFail(): void {
  state.failureOpen = false;
  setScreen("levels");
}

function isLevelUnlocked(index: number): boolean {
  if (index === 0) return true;
  if (state.levels[index]?.free) return true;
  return Boolean(state.progress[state.levels[index - 1]?.id]?.completed);
}

function isPackageUnlocked(pack: LevelPack): boolean {
  const firstIndex = state.levels.findIndex((level) => level.id === pack.levels[0]?.id);
  return firstIndex >= 0 && isLevelUnlocked(firstIndex);
}

function recommendedLevelIndex(pack: LevelPack): number {
  const firstPlayable = pack.levels
    .map((level) => state.levels.findIndex((candidate) => candidate.id === level.id))
    .find((index) => index >= 0 && isLevelUnlocked(index) && !state.progress[state.levels[index].id]?.completed);

  if (firstPlayable !== undefined) return firstPlayable;

  const firstLevelIndex = state.levels.findIndex((level) => level.id === pack.levels[0]?.id);
  return firstLevelIndex;
}

function nextLevelIndex(): number | null {
  const currentPackLevels = state.levels
    .map((level, index) => ({ level, index }))
    .filter((entry) => entry.level.packId === state.selectedPackId)
    .sort((a, b) => a.level.order - b.level.order);
  const position = currentPackLevels.findIndex((entry) => entry.index === state.levelIndex);
  const next = position >= 0 ? currentPackLevels[position + 1] : undefined;

  return next && isLevelUnlocked(next.index) ? next.index : null;
}

function editCell(row: number, col: number): void {
  removeCoordFromAll(row, col);

  if (state.tool === "hole") state.level.holes.push([row, col]);
  if (state.tool === "requiredSeed") state.level.requiredSeeds.push([row, col]);
  if (state.tool === "blockedSeed") state.level.blockedSeeds.push([row, col]);

  normalizeLevel();
  saveCurrentLevel();
  exportJson();
}

function toggleSeed(row: number, col: number): void {
  if (state.isSpreading || state.isFinalizing) return;

  const kind = getCellKind(state.level, row, col);
  if (kind === "hole" || kind === "blockedSeed" || kind === "requiredSeed") return;

  const key = `${row}:${col}`;
  const selected = state.seeds.some((coord) => coordKey(coord) === key);

  if (!selected && state.seeds.length >= maxPassingSeeds(state.level)) {
    triggerSeedLimitFeedback();
    return;
  }

  state.seeds = selected
    ? state.seeds.filter((coord) => coordKey(coord) !== key)
    : uniqueCoords([...state.seeds, [row, col]]);

  state.resultInfected = new Set();
  state.waveCells = new Set();
  state.growingCells = new Set();
  state.finishBloomCells = new Set();
  state.lastStars = 0;
  state.failureOpen = false;
  state.failureDimming = false;
  state.messageKey = "readyToInfect";
}

function triggerSeedLimitFeedback(): void {
  state.boardShakeKey += 1;
  state.messageKey = "tooManySeeds";
  const shakeKey = state.boardShakeKey;

  window.setTimeout(() => {
    if (state.boardShakeKey !== shakeKey) return;
    state.boardShakeKey = 0;
    render();
  }, 280);
}

async function startInfection(): Promise<void> {
  if (state.isSpreading || state.isFinalizing || state.seeds.length === 0) return;

  const result = runInfection(state.level, state.seeds);
  const seedKeys = state.seeds.map(coordKey);
  state.resultInfected = new Set();
  state.waveCells = new Set();
  state.growingCells = new Set();
  state.finishBloomCells = new Set();
  state.lastStars = 0;
  state.victoryOpen = false;
  state.failureOpen = false;
  state.failureDimming = false;

  if (result.failureReason && result.waves.length === 0) {
    state.messageKey = result.failureReason;
    await showFailureAfterDim();
    return;
  }

  state.isSpreading = true;
  state.messageKey = "spreading";
  state.waveCells = new Set(seedKeys);
  render();

  await wait(280);
  state.resultInfected = new Set(seedKeys);
  state.growingCells = new Set(seedKeys);
  state.waveCells = new Set();
  render();
  await wait(180);

  for (const wave of result.waves) {
    const waveKeys = wave.map(coordKey);
    await wait(120);
    state.growingCells = new Set();
    state.waveCells = new Set(waveKeys);
    render();
    await wait(280);
    state.waveCells = new Set();
    state.growingCells = new Set(waveKeys);
    for (const coord of wave) {
      state.resultInfected.add(coordKey(coord));
    }
    render();
    await wait(180);
  }

  await wait(260);
  state.isSpreading = false;
  state.waveCells = new Set();
  state.growingCells = new Set();
  state.resultInfected = result.infected;
  state.lastStars = result.stars;
  state.messageKey = result.completed ? "completed" : result.failureReason ?? "failed";

  if (result.completed) {
    recordProgress(result.stars, result.seedsUsed);
    await playCompletionBloomRows();
    state.victoryOpen = true;
  } else {
    await showFailureAfterDim();
    return;
  }

  render();
}

async function playCompletionBloomRows(): Promise<void> {
  state.isFinalizing = true;
  state.finishBloomCells = new Set();
  state.resultInfected = new Set(playableCellKeys(state.level));
  render();

  for (let row = 0; row < state.level.rows; row += 1) {
    const rowKeys = playableCellKeysInRow(state.level, row);
    if (rowKeys.length === 0) continue;
    state.finishBloomCells = new Set(rowKeys);
    render();
    await wait(170);
  }

  await wait(280);
  state.finishBloomCells = new Set();
  state.isFinalizing = false;
}

async function showFailureAfterDim(): Promise<void> {
  state.isSpreading = false;
  state.isFinalizing = true;
  state.waveCells = new Set();
  state.growingCells = new Set();
  state.finishBloomCells = new Set();
  state.failureOpen = false;
  render();
  await wait(500);
  state.isFinalizing = false;
  state.failureOpen = true;
  render();
}

function recordProgress(stars: 0 | 1 | 2 | 3, seedsUsed: number): void {
  const current = state.progress[state.level.id];
  const betterStars = stars > (current?.bestStars ?? 0);
  const betterSeeds = stars === (current?.bestStars ?? 0) && (current?.bestSeeds === null || seedsUsed < (current?.bestSeeds ?? Infinity));

  if (!current || betterStars || betterSeeds) {
    state.progress[state.level.id] = {
      completed: true,
      bestStars: stars,
      bestSeeds: seedsUsed
    };
    saveProgress(state.progress);
  }
}

function undoSeed(): void {
  if (state.isSpreading || state.isFinalizing) return;
  const required = new Set(state.level.requiredSeeds.map(coordKey));
  const reversed = [...state.seeds].reverse();
  const removable = reversed.find((coord) => !required.has(coordKey(coord)));
  if (!removable) return;

  const removableKey = coordKey(removable);
  state.seeds = state.seeds.filter((coord) => coordKey(coord) !== removableKey);
  clearRunState();
  render();
}

function resetPlayState(): void {
  if (state.isSpreading || state.isFinalizing) return;
  resetToRequiredSeeds();
  clearRunState();
  state.failureOpen = false;
  state.victoryOpen = false;
  state.messageKey = "readyToInfect";
  render();
}

function clearRunState(): void {
  state.resultInfected = new Set();
  state.waveCells = new Set();
  state.growingCells = new Set();
  state.finishBloomCells = new Set();
  state.lastStars = 0;
  state.failureOpen = false;
  state.victoryOpen = false;
  state.failureDimming = false;
  clearTransientRunFlags();
}

function clearTransientRunFlags(): void {
  state.isSpreading = false;
  state.isFinalizing = false;
  state.failureDimming = false;
}

function updateField(input: HTMLInputElement | HTMLSelectElement): void {
  const field = input.dataset.field;
  if (!field) return;

  if (field === "id") state.level.id = input.value.trim() || "custom-level";
  if (field === "packId") state.level.packId = input.value.trim() || "custom";
  if (field === "rows") state.level.rows = clamp(Number(input.value), 1, 16);
  if (field === "cols") state.level.cols = clamp(Number(input.value), 1, 16);
  if (field === "free" && input instanceof HTMLInputElement) state.level.free = input.checked;
  if (field === "star3") {
    state.level.stars.three = clamp(Number(input.value), 1, 99);
    state.level.stars.two = clamp(state.level.stars.three + 1, 1, 99);
    state.level.stars.one = clamp(state.level.stars.three + 2, 1, 99);
  }
  if (field === "star2") state.level.stars.two = optionalThreshold(input.value);
  if (field === "star1") state.level.stars.one = optionalThreshold(input.value);

  normalizeLevel();
  saveCurrentLevel();
  exportJson();
  render();
}

function exportJson(): void {
  normalizeLevel();
  state.jsonText = JSON.stringify(state.level, null, 2);
  state.messageKey = "jsonHelp";
}

async function copyJson(): Promise<void> {
  exportJson();
  await navigator.clipboard?.writeText(state.jsonText);
  render();
}

function importJson(): void {
  try {
    const parsed = JSON.parse(state.jsonText) as Level;
    state.level = parsed;
    normalizeLevel();
    resetToRequiredSeeds();
    saveCurrentLevel();
    state.messageKey = "editorHelp";
  } catch {
    state.messageKey = "failed";
  }
  render();
}

function normalizeLevel(): void {
  delete (state.level as Level & { starMode?: unknown }).starMode;
  const inside = ([row, col]: CellCoord) => row >= 0 && row < state.level.rows && col >= 0 && col < state.level.cols;
  state.level.holes = uniqueCoords(state.level.holes.filter(inside));
  state.level.requiredSeeds = uniqueCoords(state.level.requiredSeeds.filter(inside));
  state.level.blockedSeeds = uniqueCoords(state.level.blockedSeeds.filter(inside));
  state.level.stars.three = clamp(Number(state.level.stars.three), 1, 99);

  if (state.level.stars.two !== null) {
    state.level.stars.two = Math.max(state.level.stars.three, clamp(Number(state.level.stars.two), 1, 99));
  }

  if (state.level.stars.two === null) {
    state.level.stars.one = null;
  } else if (state.level.stars.one !== null) {
    state.level.stars.one = Math.max(state.level.stars.two, clamp(Number(state.level.stars.one), 1, 99));
  }

  state.level.maxSeeds = maxPassingSeeds(state.level);
}

function saveCurrentLevel(): void {
  if (!editorEnabled) return;

  state.levels[state.levelIndex] = state.level;
  saveEditorLevels(state.levels);
  saveEditorIndex(state.levelIndex);
}

function switchLevel(index: number): void {
  const nextIndex = clamp(index, 0, state.levels.length - 1);
  saveCurrentLevel();
  state.levelIndex = nextIndex;
  state.level = state.levels[nextIndex];
  state.selectedPackId = state.level.packId;
  resetToRequiredSeeds();
  clearRunState();
  clearTransientRunFlags();
  state.victoryOpen = false;
  state.failureOpen = false;
  state.messageKey = "readyToInfect";
  if (editorEnabled) {
    exportJson();
    saveEditorIndex(nextIndex);
  }
}

function createLevel(): void {
  saveCurrentLevel();
  const packId = state.level.packId || "custom";
  const insertIndex = lastIndexInPack(packId) + 1;
  const order = nextOrderInPack(packId);
  const id = nextLevelId(packId);
  const level: Level = {
    id,
    packId,
    order,
    titleKey: nextTitleKey(packId, order),
    rows: 5,
    cols: 5,
    maxSeeds: 5,
    free: state.level.free,
    stars: { three: 5, two: null, one: null },
    holes: [],
    requiredSeeds: [],
    blockedSeeds: []
  };

  state.levels.splice(insertIndex, 0, level);
  renumberOrders();
  state.levelIndex = insertIndex;
  state.level = level;
  resetToRequiredSeeds();
  clearRunState();
  clearTransientRunFlags();
  state.messageKey = "editorHelp";
  saveCurrentLevel();
  exportJson();
  render();
}

function duplicateLevel(): void {
  saveCurrentLevel();
  const source = state.level;
  const level: Level = {
    ...structuredClone(source),
    id: nextLevelId(source.packId),
    order: source.order + 1,
    titleKey: nextTitleKey(source.packId, nextOrderInPack(source.packId))
  };
  const insertIndex = state.levelIndex + 1;

  state.levels.splice(insertIndex, 0, level);
  renumberOrders();
  state.levelIndex = insertIndex;
  state.level = level;
  resetToRequiredSeeds();
  clearRunState();
  clearTransientRunFlags();
  state.messageKey = "editorHelp";
  saveCurrentLevel();
  exportJson();
  render();
}

function reorderLevels(): void {
  saveCurrentLevel();
  const currentId = state.level.id;
  const packs = uniquePackIds();
  const levels = packs.flatMap((packId) => {
    const packLevels = state.levels
      .filter((level) => level.packId === packId)
      .sort((a, b) => a.order - b.order);

    return packLevels.map((level, index) => {
      const orderInPack = index + 1;
      return {
        ...level,
        id: `${packId}-${String(orderInPack).padStart(2, "0")}`,
        order: 0,
        titleKey: nextTitleKey(packId, orderInPack)
      };
    });
  });

  state.levels = levels;
  renumberOrders();
  state.levelIndex = Math.max(0, state.levels.findIndex((level) => level.id === currentId));
  state.level = state.levels[state.levelIndex];
  saveCurrentLevel();
  exportJson();
  render();
}

async function saveCurrentPackToFirestore(status: LevelPackStatus): Promise<void> {
  saveCurrentLevel();

  try {
    const { saveLevelPackToFirestore } = await import("./editorFirestore");
    await saveLevelPackToFirestore(buildCurrentPack(status), status);
    state.messageKey = status === "published" ? "publishSucceeded" : "draftSaved";
  } catch (error) {
    state.messageKey = error instanceof Error ? error.message : "firestoreSaveFailed";
  }

  render();
}

function buildCurrentPack(status: LevelPackStatus): LevelPack {
  const packId = state.level.packId || "custom";
  const levels = state.levels
    .filter((level) => level.packId === packId)
    .sort((a, b) => a.order - b.order);
  const hasPaidLevel = levels.some((level) => !level.free);
  const pack: LevelPack = {
    id: packId,
    order: uniquePackIds().indexOf(packId) + 1,
    titleKey: `pack.${packId.replaceAll("-", "")}`,
    access: hasPaidLevel ? "paid" : "free",
    status,
    publishedAt: status === "published" ? new Date().toISOString() : null,
    levels
  };

  if (hasPaidLevel) {
    pack.purchaseId = "unlock_full_game";
  }

  return pack;
}

function lastIndexInPack(packId: string): number {
  const index = state.levels.map((level) => level.packId).lastIndexOf(packId);
  return index >= 0 ? index : state.levels.length - 1;
}

function nextOrderInPack(packId: string): number {
  const count = state.levels.filter((level) => level.packId === packId).length;
  return count + 1;
}

function nextLevelId(packId: string): string {
  return `${packId}-${String(nextOrderInPack(packId)).padStart(2, "0")}`;
}

function nextTitleKey(packId: string, order: number): string {
  return `level.${packId.replaceAll("-", "")}.${String(order).padStart(2, "0")}`;
}

function uniquePackIds(): string[] {
  return [...new Set(state.levels.map((level) => level.packId))];
}

function renumberOrders(): void {
  state.levels.forEach((level, index) => {
    level.order = index + 1;
  });
}

function syncRequiredSeeds(): void {
  state.seeds = uniqueCoords([...state.level.requiredSeeds, ...state.seeds])
    .filter(([row, col]) => {
      const kind = getCellKind(state.level, row, col);
      return kind !== "blockedSeed" && kind !== "hole";
    });
}

function resetToRequiredSeeds(): void {
  state.seeds = [...state.level.requiredSeeds];
}

function removeCoordFromAll(row: number, col: number): void {
  const key = `${row}:${col}`;
  state.level.holes = state.level.holes.filter((coord) => coordKey(coord) !== key);
  state.level.requiredSeeds = state.level.requiredSeeds.filter((coord) => coordKey(coord) !== key);
  state.level.blockedSeeds = state.level.blockedSeeds.filter((coord) => coordKey(coord) !== key);
}

function getCellKind(level: Level, row: number, col: number): CellKind {
  const key = `${row}:${col}`;
  if (level.holes.some((coord) => coordKey(coord) === key)) return "hole";
  if (level.requiredSeeds.some((coord) => coordKey(coord) === key)) return "requiredSeed";
  if (level.blockedSeeds.some((coord) => coordKey(coord) === key)) return "blockedSeed";
  return "playable";
}

function playableCellKeys(level: Level): string[] {
  const keys: string[] = [];

  for (let row = 0; row < level.rows; row += 1) {
    keys.push(...playableCellKeysInRow(level, row));
  }

  return keys;
}

function playableCellKeysInRow(level: Level, row: number): string[] {
  const keys: string[] = [];

  for (let col = 0; col < level.cols; col += 1) {
    if (getCellKind(level, row, col) !== "hole") {
      keys.push(`${row}:${col}`);
    }
  }

  return keys;
}

function tabButton(screen: Screen, labelKey: string): string {
  return `<button class="${state.screen === screen ? "active" : ""}" data-screen="${screen}" type="button">${t(state.locale, labelKey)}</button>`;
}

function toolButton(tool: EditorTool, labelKey: string): string {
  return `<button class="${state.tool === tool ? "active" : ""}" data-tool="${tool}" type="button">${t(state.locale, labelKey)}</button>`;
}

function numberInput(field: string, labelKey: string, value: number, min: number, max: number): string {
  return `
    <label>
      <span>${t(state.locale, labelKey)}</span>
      <input data-field="${field}" type="number" min="${min}" max="${max}" value="${value}" />
    </label>
  `;
}

function optionalNumberInput(field: string, labelKey: string, value: number | null, min: number, max: number): string {
  return `
    <label>
      <span>${t(state.locale, labelKey)}</span>
      <input data-field="${field}" type="number" min="${min}" max="${max}" value="${value ?? ""}" placeholder="${t(state.locale, "optional")}" />
    </label>
  `;
}

function textInput(field: string, labelKey: string, value: string): string {
  return `
    <label>
      <span>${t(state.locale, labelKey)}</span>
      <input data-field="${field}" type="text" value="${escapeHtml(value)}" />
    </label>
  `;
}

function starText(stars: number, maxStars = 3): string {
  return `${stars} / ${maxStars}`;
}

function calculateCellSize(mode: "editor" | "play"): number {
  const maxDimension = Math.max(state.level.rows, state.level.cols);
  const availableWidth = window.innerWidth - 44;
  const availableHeight = mode === "play" ? window.innerHeight - 330 : window.innerHeight * 0.52;
  const boardLimit = Math.min(availableWidth, availableHeight, 620);
  const gapSize = 6;
  const paddingSize = 28;
  const rawSize = Math.floor((boardLimit - paddingSize - gapSize * (maxDimension - 1)) / maxDimension);

  return clamp(rawSize, 30, 56);
}

function clamp(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min;
  return Math.max(min, Math.min(max, value));
}

function optionalThreshold(value: string): number | null {
  return value.trim() === "" ? null : clamp(Number(value), 1, 99);
}

function wait(milliseconds: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

let resizeTimer: number | undefined;
window.addEventListener("resize", () => {
  window.clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(render, 120);
});

preloadThemeAssets();
render();
