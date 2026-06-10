import "./styles.css";
import { coordKey, uniqueCoords } from "./domain/coords";
import { maxPassingSeeds, runInfection } from "./domain/engine";
import type { CellCoord, CellKind, Level, Locale } from "./domain/types";
import { sampleLevels } from "./data/sampleLevels";
import { t } from "./i18n";
import {
  loadEditorIndex,
  loadEditorLevels,
  loadLocale,
  saveEditorIndex,
  saveEditorLevels,
  saveLocale
} from "./storage";

type ViewMode = "play" | "editor";
type EditorTool = CellKind;

interface AppState {
  locale: Locale;
  viewMode: ViewMode;
  levels: Level[];
  levelIndex: number;
  level: Level;
  tool: EditorTool;
  seeds: CellCoord[];
  messageKey: string;
  jsonText: string;
  resultInfected: Set<string>;
  waveCells: Set<string>;
  isSpreading: boolean;
  lastStars: 0 | 1 | 2 | 3;
}

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("Missing #app root");
}

const root = app;
const initialLevels = loadEditorLevels(sampleLevels);
const initialIndex = loadEditorIndex(initialLevels.length);
const initialLevel = initialLevels[initialIndex];

const state: AppState = {
  locale: loadLocale(),
  viewMode: "editor",
  levels: initialLevels,
  levelIndex: initialIndex,
  level: initialLevel,
  tool: "playable",
  seeds: [...initialLevel.requiredSeeds],
  messageKey: "editorHelp",
  jsonText: JSON.stringify(initialLevel, null, 2),
  resultInfected: new Set(),
  waveCells: new Set(),
  isSpreading: false,
  lastStars: 0
};

function render(): void {
  root.innerHTML = `
    <main class="shell">
      <header class="topbar">
        <div>
          <p class="eyebrow">MOBILE PUZZLE PROTOTYPE</p>
          <h1>${t(state.locale, "appTitle")}</h1>
        </div>
        <label class="select-label">
          <span>${t(state.locale, "language")}</span>
          <select data-action="locale">
            <option value="zh-Hant" ${state.locale === "zh-Hant" ? "selected" : ""}>繁中</option>
            <option value="en" ${state.locale === "en" ? "selected" : ""}>English</option>
            <option value="ja" ${state.locale === "ja" ? "selected" : ""}>日本語</option>
          </select>
        </label>
      </header>

      <nav class="segmented" aria-label="Mode">
        ${segmentButton("editor", "modeEditor")}
        ${segmentButton("play", "modePlay")}
      </nav>

      ${state.viewMode === "editor" ? renderEditor() : renderPlayer()}
    </main>
  `;

  bindEvents();
}

function renderEditor(): string {
  return `
    <section class="layout">
      <aside class="panel controls">
        <div class="level-nav">
          <button data-action="prev-level" type="button" ${state.levelIndex === 0 ? "disabled" : ""}>${t(state.locale, "prevLevel")}</button>
          <div class="level-position">${state.levelIndex + 1} / ${state.levels.length}</div>
          <button data-action="next-level" type="button" ${state.levelIndex === state.levels.length - 1 ? "disabled" : ""}>${t(state.locale, "nextLevel")}</button>
        </div>
        <button data-action="new-level" type="button">${t(state.locale, "newLevel")}</button>
        <h2>${t(state.locale, "editorTitle")}</h2>
        <p class="hint">${t(state.locale, "editorHelp")}</p>

        <div class="field-grid">
          ${numberInput("rows", "rows", state.level.rows, 1, 16)}
          ${numberInput("cols", "cols", state.level.cols, 1, 16)}
          ${textInput("id", "levelId", state.level.id)}
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
        </div>
      </aside>

      <section class="workspace">
        ${renderGrid("editor")}
        <p class="message">${t(state.locale, state.messageKey)}</p>
        <textarea class="json-box" data-field="jsonText" spellcheck="false">${escapeHtml(state.jsonText)}</textarea>
        <p class="hint">${t(state.locale, "jsonHelp")}</p>
      </section>
    </section>
  `;
}

function renderPlayer(): string {
  const stars = "★".repeat(state.lastStars) + "☆".repeat(3 - state.lastStars);

  return `
    <section class="layout">
      <aside class="panel controls">
        <h2>${state.level.id}</h2>
        <div class="stats">
          <span>${t(state.locale, "seeds")}</span>
          <strong>${state.seeds.length} / ${maxPassingSeeds(state.level)}</strong>
        </div>
        <div class="stars" aria-label="stars">${stars}</div>
        <div class="toolbar">
          <button data-action="start-infection" ${state.isSpreading || state.seeds.length === 0 ? "disabled" : ""}>${t(state.locale, "start")}</button>
          <button data-action="undo" ${state.isSpreading ? "disabled" : ""}>${t(state.locale, "undo")}</button>
          <button data-action="reset-seeds" ${state.isSpreading ? "disabled" : ""}>${t(state.locale, "reset")}</button>
        </div>
        <p class="hint">${t(state.locale, state.isSpreading ? "spreading" : state.messageKey)}</p>
      </aside>

      <section class="workspace">
        ${renderGrid("play")}
        <p class="message">${t(state.locale, state.messageKey)}</p>
      </section>
    </section>
  `;
}

function renderGrid(mode: "editor" | "play"): string {
  const smallBoard = state.level.rows <= 5 && state.level.cols <= 5;
  const gridWidth = smallBoard ? "fit-content" : `min(100%, calc(72vh * ${state.level.cols} / ${state.level.rows}))`;
  const cellSize = smallBoard ? "46px" : "minmax(0, 1fr)";
  const style = `--rows:${state.level.rows};--cols:${state.level.cols};--grid-width:${gridWidth};--cell-size:${cellSize}`;
  const cells: string[] = [];

  for (let row = 0; row < state.level.rows; row += 1) {
    for (let col = 0; col < state.level.cols; col += 1) {
      const kind = getCellKind(state.level, row, col);
      const selected = state.seeds.some(([seedRow, seedCol]) => seedRow === row && seedCol === col);
      const infected = state.resultInfected.has(`${row}:${col}`);
      const spreading = state.waveCells.has(`${row}:${col}`);
      const playKind = mode === "play" ? `play-${kind}` : "";
      cells.push(`
        <button
          class="cell ${kind} ${playKind} ${selected ? "selected" : ""} ${infected ? "infected" : ""} ${spreading ? "spreading" : ""}"
          data-cell="${row},${col}"
          type="button"
          aria-label="${row + 1},${col + 1}"
        ></button>
      `);
    }
  }

  return `<div class="grid" style="${style}">${cells.join("")}</div>`;
}

function bindEvents(): void {
  root.querySelectorAll<HTMLElement>("[data-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      state.viewMode = button.dataset.mode as ViewMode;
      state.messageKey = state.viewMode === "editor" ? "editorHelp" : "readyToInfect";
      if (state.viewMode === "play") {
        syncRequiredSeeds();
      }
      render();
    });
  });

  root.querySelector<HTMLSelectElement>("[data-action='locale']")?.addEventListener("change", (event) => {
    const locale = (event.target as HTMLSelectElement).value as Locale;
    state.locale = locale;
    saveLocale(locale);
    render();
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

  root.querySelectorAll<HTMLElement>("[data-cell]").forEach((cell) => {
    cell.addEventListener("click", () => {
      const [row, col] = cell.dataset.cell?.split(",").map(Number) ?? [0, 0];
      state.viewMode === "editor" ? editCell(row, col) : toggleSeed(row, col);
      render();
    });
  });

  root.querySelector<HTMLElement>("[data-action='export-json']")?.addEventListener("click", exportJson);
  root.querySelector<HTMLElement>("[data-action='copy-json']")?.addEventListener("click", copyJson);
  root.querySelector<HTMLElement>("[data-action='import-json']")?.addEventListener("click", importJson);
  root.querySelector<HTMLElement>("[data-action='prev-level']")?.addEventListener("click", () => switchLevel(state.levelIndex - 1));
  root.querySelector<HTMLElement>("[data-action='next-level']")?.addEventListener("click", () => switchLevel(state.levelIndex + 1));
  root.querySelector<HTMLElement>("[data-action='new-level']")?.addEventListener("click", createLevel);
  root.querySelector<HTMLElement>("[data-action='start-infection']")?.addEventListener("click", startInfection);
  root.querySelector<HTMLElement>("[data-action='undo']")?.addEventListener("click", () => {
    if (state.isSpreading) return;
    state.seeds.pop();
    state.resultInfected = new Set();
    state.waveCells = new Set();
    state.lastStars = 0;
    state.messageKey = "readyToInfect";
    render();
  });
  root.querySelector<HTMLElement>("[data-action='reset-seeds']")?.addEventListener("click", () => {
    if (state.isSpreading) return;
    state.seeds = [...state.level.requiredSeeds];
    state.resultInfected = new Set();
    state.waveCells = new Set();
    state.lastStars = 0;
    state.messageKey = "readyToInfect";
    render();
  });
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
  if (state.isSpreading) return;

  const kind = getCellKind(state.level, row, col);
  if (kind === "hole" || kind === "blockedSeed" || kind === "requiredSeed") return;

  const key = `${row}:${col}`;
  const selected = state.seeds.some((coord) => coordKey(coord) === key);

  if (selected) {
    state.seeds = state.seeds.filter((coord) => coordKey(coord) !== key);
  } else {
    state.seeds = uniqueCoords([...state.seeds, [row, col]]);
  }

  state.resultInfected = new Set();
  state.waveCells = new Set();
  state.lastStars = 0;
  state.messageKey = "readyToInfect";
}

async function startInfection(): Promise<void> {
  if (state.isSpreading || state.seeds.length === 0) return;

  const result = runInfection(state.level, state.seeds);
  state.resultInfected = new Set(state.seeds.map(coordKey));
  state.waveCells = new Set();
  state.lastStars = 0;

  if (result.failureReason && result.waves.length === 0) {
    state.messageKey = result.failureReason;
    render();
    return;
  }

  state.isSpreading = true;
  state.messageKey = "spreading";
  render();

  for (const wave of result.waves) {
    await wait(280);
    state.waveCells = new Set(wave.map(coordKey));
    for (const coord of wave) {
      state.resultInfected.add(coordKey(coord));
    }
    render();
  }

  await wait(260);
  state.isSpreading = false;
  state.waveCells = new Set();
  state.resultInfected = result.infected;
  state.lastStars = result.stars;
  state.messageKey = result.completed ? "completed" : result.failureReason ?? "failed";
  render();
}

function updateField(input: HTMLInputElement | HTMLSelectElement): void {
  const field = input.dataset.field;
  if (!field) return;

  if (field === "id") state.level.id = input.value.trim() || "custom-level";
  if (field === "rows") state.level.rows = clamp(Number(input.value), 1, 16);
  if (field === "cols") state.level.cols = clamp(Number(input.value), 1, 16);
  if (field === "maxSeeds") state.level.maxSeeds = clamp(Number(input.value), 1, 99);
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
  state.levels[state.levelIndex] = state.level;
  saveEditorLevels(state.levels);
  saveEditorIndex(state.levelIndex);
}

function switchLevel(index: number): void {
  const nextIndex = clamp(index, 0, state.levels.length - 1);
  saveCurrentLevel();
  state.levelIndex = nextIndex;
  state.level = state.levels[nextIndex];
  resetToRequiredSeeds();
  state.resultInfected = new Set();
  state.waveCells = new Set();
  state.isSpreading = false;
  state.lastStars = 0;
  state.messageKey = "readyToInfect";
  exportJson();
  saveEditorIndex(nextIndex);
  render();
}

function createLevel(): void {
  saveCurrentLevel();
  const order = state.levels.length + 1;
  const level: Level = {
    id: `custom-${String(order).padStart(2, "0")}`,
    packId: "custom",
    order,
    titleKey: `level.custom.${String(order).padStart(2, "0")}`,
    rows: 5,
    cols: 5,
    maxSeeds: 5,
    free: true,
    stars: { three: 5, two: null, one: null },
    holes: [],
    requiredSeeds: [],
    blockedSeeds: []
  };

  state.levels.push(level);
  state.levelIndex = state.levels.length - 1;
  state.level = level;
  state.seeds = [];
  state.resultInfected = new Set();
  state.waveCells = new Set();
  state.isSpreading = false;
  state.lastStars = 0;
  state.messageKey = "editorHelp";
  saveCurrentLevel();
  exportJson();
  render();
}

function syncRequiredSeeds(): void {
  state.seeds = uniqueCoords([...state.level.requiredSeeds, ...state.seeds])
    .filter(([row, col]) => getCellKind(state.level, row, col) !== "blockedSeed" && getCellKind(state.level, row, col) !== "hole");
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

function segmentButton(mode: ViewMode, labelKey: string): string {
  return `<button class="${state.viewMode === mode ? "active" : ""}" data-mode="${mode}" type="button">${t(state.locale, labelKey)}</button>`;
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

render();
