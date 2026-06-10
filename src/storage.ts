import type { Level, Locale } from "./domain/types";

const EDITOR_LEVEL_KEY = "infection-blocks.editor-level";
const EDITOR_LEVELS_KEY = "infection-blocks.editor-levels";
const EDITOR_INDEX_KEY = "infection-blocks.editor-index";
const LOCALE_KEY = "infection-blocks.locale";
const PROGRESS_KEY = "infection-blocks.progress";

export interface LevelProgress {
  completed: boolean;
  bestStars: 0 | 1 | 2 | 3;
  bestSeeds: number | null;
}

export type ProgressMap = Record<string, LevelProgress>;

export interface StorageDiagnostics {
  keys: string[];
  levelIds: string[];
  customLevelIds: string[];
}

export function loadEditorLevel(fallback: Level): Level {
  const raw = window.localStorage.getItem(EDITOR_LEVEL_KEY);
  if (!raw) return fallback;

  try {
    return JSON.parse(raw) as Level;
  } catch {
    return fallback;
  }
}

export function saveEditorLevel(level: Level): void {
  window.localStorage.setItem(EDITOR_LEVEL_KEY, JSON.stringify(level));
}

export function loadEditorLevels(fallback: Level[]): Level[] {
  const oldLevel = loadEditorLevel(fallback[0]);
  const recoveredLevels = recoverLevelsFromStorage();
  const raw = window.localStorage.getItem(EDITOR_LEVELS_KEY);
  if (raw) {
    try {
      const levels = JSON.parse(raw) as Level[];
      if (!Array.isArray(levels) || levels.length === 0) return fallback;
      return mergeLevels([...levels, oldLevel, ...recoveredLevels], fallback);
    } catch {
      return fallback;
    }
  }

  return mergeLevels([oldLevel, ...recoveredLevels], fallback);
}

export function saveEditorLevels(levels: Level[]): void {
  window.localStorage.setItem(EDITOR_LEVELS_KEY, JSON.stringify(levels));
}

export function loadEditorIndex(max: number): number {
  const raw = Number(window.localStorage.getItem(EDITOR_INDEX_KEY));
  if (Number.isNaN(raw)) return 0;
  return Math.max(0, Math.min(max - 1, raw));
}

export function saveEditorIndex(index: number): void {
  window.localStorage.setItem(EDITOR_INDEX_KEY, String(index));
}

export function loadLocale(): Locale {
  const raw = window.localStorage.getItem(LOCALE_KEY);
  return raw === "en" || raw === "ja" || raw === "zh-Hant" ? raw : "zh-Hant";
}

export function saveLocale(locale: Locale): void {
  window.localStorage.setItem(LOCALE_KEY, locale);
}

export function loadProgress(): ProgressMap {
  const raw = window.localStorage.getItem(PROGRESS_KEY);
  if (!raw) return {};

  try {
    return JSON.parse(raw) as ProgressMap;
  } catch {
    return {};
  }
}

export function saveProgress(progress: ProgressMap): void {
  window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

export function getStorageDiagnostics(levels: Level[]): StorageDiagnostics {
  const keys: string[] = [];

  for (let index = 0; index < window.localStorage.length; index += 1) {
    const key = window.localStorage.key(index);
    if (key?.startsWith("infection-blocks")) keys.push(key);
  }

  const levelIds = levels.map((level) => level.id);

  return {
    keys,
    levelIds,
    customLevelIds: levelIds.filter((id) => id.startsWith("custom-"))
  };
}

function recoverLevelsFromStorage(): Level[] {
  const recovered: Level[] = [];

  for (let index = 0; index < window.localStorage.length; index += 1) {
    const key = window.localStorage.key(index);
    if (!key?.startsWith("infection-blocks")) continue;

    const raw = window.localStorage.getItem(key);
    if (!raw) continue;

    try {
      const parsed = JSON.parse(raw);
      if (isLevel(parsed)) recovered.push(parsed);
      if (Array.isArray(parsed)) recovered.push(...parsed.filter(isLevel));
    } catch {
      // Ignore non-JSON values such as locale strings.
    }
  }

  return recovered;
}

function mergeLevels(levels: Level[], fallback: Level[]): Level[] {
  const byId = new Map<string, Level>();

  for (const level of fallback) byId.set(level.id, level);
  for (const level of levels) {
    if (isLevel(level)) byId.set(level.id, level);
  }

  return Array.from(byId.values()).sort((a, b) => a.order - b.order);
}

function isLevel(value: unknown): value is Level {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<Level>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.rows === "number" &&
    typeof candidate.cols === "number" &&
    Array.isArray(candidate.holes) &&
    Array.isArray(candidate.requiredSeeds) &&
    Array.isArray(candidate.blockedSeeds)
  );
}
