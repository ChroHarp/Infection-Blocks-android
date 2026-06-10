import type { Level } from "../domain/types";

export const sampleLevels: Level[] = [
  {
    id: "world-1-01",
    packId: "world-1",
    order: 1,
    titleKey: "level.world1.01",
    rows: 10,
    cols: 7,
    maxSeeds: 8,
    free: true,
    stars: { three: 5, two: 8, one: null },
    holes: [
      [4, 1], [4, 2], [4, 3],
      [5, 1], [5, 2], [5, 3],
      [6, 1], [6, 2], [6, 3],
      [7, 1], [7, 2], [7, 3]
    ],
    requiredSeeds: [],
    blockedSeeds: []
  },
  {
    id: "world-1-02",
    packId: "world-1",
    order: 2,
    titleKey: "level.world1.02",
    rows: 8,
    cols: 8,
    maxSeeds: 4,
    free: true,
    stars: { three: 4, two: null, one: null },
    holes: [[3, 3], [3, 4], [4, 3], [4, 4]],
    requiredSeeds: [[0, 0]],
    blockedSeeds: [[7, 7]]
  }
];
