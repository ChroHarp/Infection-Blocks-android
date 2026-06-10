import { describe, expect, it } from "vitest";
import { runInfection } from "./engine";
import type { Level } from "./types";

const baseLevel: Level = {
  id: "test",
  packId: "test",
  order: 1,
  titleKey: "level.test",
  rows: 2,
  cols: 2,
  maxSeeds: 3,
  free: true,
  stars: { one: null, two: null, three: 3 },
  holes: [],
  requiredSeeds: [],
  blockedSeeds: []
};

describe("runInfection", () => {
  it("spreads into cells with two infected neighbors", () => {
    const result = runInfection(baseLevel, [[0, 0], [1, 1]]);

    expect(result.completed).toBe(true);
    expect(result.infected.size).toBe(4);
    expect(result.waves).toEqual([[[0, 1], [1, 0]]]);
  });

  it("supports two-tier star thresholds", () => {
    const result = runInfection(
      { ...baseLevel, maxSeeds: 3, stars: { three: 1, two: 2, one: null } },
      [[0, 0], [1, 1]]
    );

    expect(result.completed).toBe(true);
    expect(result.stars).toBe(2);
  });

  it("rejects missing required seeds", () => {
    const result = runInfection({ ...baseLevel, requiredSeeds: [[0, 0]] }, [[1, 1]]);

    expect(result.completed).toBe(false);
    expect(result.failureReason).toBe("missingRequiredSeed");
  });

  it("rejects blocked initial seeds", () => {
    const result = runInfection({ ...baseLevel, blockedSeeds: [[0, 1]] }, [[0, 1]]);

    expect(result.completed).toBe(false);
    expect(result.failureReason).toBe("blockedSeedSelected");
  });

  it("fails when seed count exceeds the lowest passing threshold", () => {
    const result = runInfection(
      { ...baseLevel, maxSeeds: 99, stars: { three: 1, two: 1, one: null } },
      [[0, 0], [1, 1]]
    );

    expect(result.completed).toBe(false);
    expect(result.failureReason).toBe("tooManySeeds");
  });
});
