import { describe, expect, it, vi } from "vitest";
import { clearEditorLevels } from "./storage";

describe("clearEditorLevels", () => {
  it("removes stale editor cache keys", () => {
    const store = new Map<string, string>();
    vi.stubGlobal("window", {
      localStorage: {
        removeItem: (key: string) => store.delete(key),
        setItem: (key: string, value: string) => store.set(key, value),
        getItem: (key: string) => store.get(key) ?? null
      }
    });

    store.set("infection-blocks.editor-level", "old");
    store.set("infection-blocks.editor-levels", "old");
    store.set("infection-blocks.editor-index", "old");
    clearEditorLevels();

    expect([...store.keys()]).toEqual([]);
  });
});
