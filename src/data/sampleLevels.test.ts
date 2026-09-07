import { describe, expect, it } from "vitest";
import { sampleLevelPacks, sampleLevels } from "./sampleLevels";

describe("sample level pack assignments", () => {
  it("moves generalized-cross-2 levels 09 through 16 into world-2", () => {
    const world2 = sampleLevelPacks.find((pack) => pack.id === "world-2");
    const movedIds = Array.from({ length: 8 }, (_, index) => `generalized-cross-2-${String(index + 9).padStart(2, "0")}`);
    const moved = sampleLevels.filter((level) => movedIds.includes(level.id));

    expect(world2?.levels).toHaveLength(10);
    expect(moved).toHaveLength(8);
    expect(moved.every((level) => level.packId === "world-2" && level.free === true)).toBe(true);
    expect(world2?.levels.filter((level) => movedIds.includes(level.id))).toHaveLength(8);
  });

  it("restores the mistakenly moved levels and removes only the requested levels from generalized-cross-2", () => {
    const threeWays = sampleLevelPacks.find((pack) => pack.id === "three-ways");
    const generalizedCross2 = sampleLevelPacks.find((pack) => pack.id === "generalized-cross-2");

    expect(threeWays?.levels).toHaveLength(9);
    expect(generalizedCross2?.levels).toHaveLength(8);
    expect(generalizedCross2?.levels.map((level) => level.id)).toEqual(
      Array.from({ length: 8 }, (_, index) => `generalized-cross-2-${String(index + 1).padStart(2, "0")}`)
    );
  });

  it("makes every pack and level free", () => {
    expect(sampleLevelPacks.every((pack) => pack.access === "free")).toBe(true);
    expect(sampleLevels.every((level) => level.free)).toBe(true);
  });
});
