import { describe, expect, it } from "vitest";
import { firestoreDocId, stripUndefined } from "./editorFirestore";

describe("firestoreDocId", () => {
  it("keeps student draft pack ids usable as one Firestore document id", () => {
    expect(firestoreDocId(" class/a ")).toBe("class-a");
    expect(firestoreDocId("   ")).toBe("custom");
  });
});


describe("stripUndefined", () => {
  it("removes undefined fields before Firestore writes", () => {
    expect(stripUndefined({ a: 1, b: undefined, nested: { c: undefined, d: 2 }, list: [{ e: undefined, f: 3 }] })).toEqual({
      a: 1,
      nested: { d: 2 },
      list: [{ f: 3 }]
    });
  });
});
