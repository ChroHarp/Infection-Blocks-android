import type { Level, Locale } from "./domain/types";

const EDITOR_LEVEL_KEY = "infection-blocks.editor-level";
const EDITOR_LEVELS_KEY = "infection-blocks.editor-levels";
const EDITOR_INDEX_KEY = "infection-blocks.editor-index";
const LOCALE_KEY = "infection-blocks.locale";

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
  const raw = window.localStorage.getItem(EDITOR_LEVELS_KEY);
  if (raw) {
    try {
      const levels = JSON.parse(raw) as Level[];
      return Array.isArray(levels) && levels.length > 0 ? levels : fallback;
    } catch {
      return fallback;
    }
  }

  const oldLevel = loadEditorLevel(fallback[0]);
  return oldLevel ? [oldLevel, ...fallback.slice(1)] : fallback;
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
