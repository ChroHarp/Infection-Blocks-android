import type { Level, LevelPack } from "../domain/types";

export const sampleLevelPacks: LevelPack[] = [
  {
    id: "world-1",
    order: 1,
    titleKey: "pack.world1",
    access: "free",
    levels: [
      {
        id: "world-1-01",
        packId: "world-1",
        order: 1,
        titleKey: "level.world1.01",
        rows: 6,
        cols: 1,
        maxSeeds: 4,
        free: true,
        stars: { three: 4, two: null, one: null },
        holes: [],
        requiredSeeds: [],
        blockedSeeds: []
      },
      {
        id: "world-1-02",
        packId: "world-1",
        order: 2,
        titleKey: "level.world1.02",
        rows: 7,
        cols: 2,
        maxSeeds: 4,
        free: true,
        stars: { three: 4, two: null, one: null },
        holes: [],
        requiredSeeds: [],
        blockedSeeds: []
      },
      {
        id: "world-1-03",
        packId: "world-1",
        order: 3,
        titleKey: "level.world1.03",
        rows: 4,
        cols: 4,
        maxSeeds: 5,
        free: true,
        stars: { three: 5, two: null, one: null },
        holes: [],
        requiredSeeds: [],
        blockedSeeds: []
      },
      {
        id: "world-1-04",
        packId: "world-1",
        order: 4,
        titleKey: "level.world1.04",
        rows: 6,
        cols: 4,
        maxSeeds: 5,
        free: true,
        stars: { three: 5, two: null, one: null },
        holes: [],
        requiredSeeds: [],
        blockedSeeds: []
      },
      {
        id: "world-1-05",
        packId: "world-1",
        order: 5,
        titleKey: "level.world1.05",
        rows: 7,
        cols: 2,
        maxSeeds: 5,
        free: true,
        stars: { three: 5, two: null, one: null },
        holes: [[6, 0]],
        requiredSeeds: [],
        blockedSeeds: []
      },
      {
        id: "world-1-06",
        packId: "world-1",
        order: 6,
        titleKey: "level.world1.06",
        rows: 6,
        cols: 2,
        maxSeeds: 4,
        free: true,
        stars: { three: 4, two: null, one: null },
        holes: [[5, 1]],
        requiredSeeds: [],
        blockedSeeds: []
      },
      {
        id: "world-1-07",
        packId: "world-1",
        order: 7,
        titleKey: "level.world1.07",
        rows: 6,
        cols: 3,
        maxSeeds: 5,
        free: true,
        stars: { three: 5, two: null, one: null },
        holes: [
          [1, 0],
          [2, 0],
          [3, 0],
          [4, 0],
          [5, 0],
          [0, 2],
          [1, 2],
          [3, 2],
          [4, 2],
          [5, 2]
        ],
        requiredSeeds: [[1, 1]],
        blockedSeeds: []
      },
      {
        id: "world-1-08",
        packId: "world-1",
        order: 8,
        titleKey: "level.world1.08",
        rows: 6,
        cols: 3,
        maxSeeds: 5,
        free: true,
        stars: { three: 5, two: null, one: null },
        holes: [
          [0, 0],
          [0, 2],
          [2, 0],
          [2, 2],
          [3, 0],
          [3, 2],
          [4, 0],
          [4, 2],
          [5, 0]
        ],
        requiredSeeds: [[3, 1]],
        blockedSeeds: []
      },
      {
        id: "world-1-09",
        packId: "world-1",
        order: 9,
        titleKey: "level.world1.09",
        rows: 7,
        cols: 2,
        maxSeeds: 6,
        free: true,
        stars: { three: 6, two: null, one: null },
        holes: [],
        requiredSeeds: [],
        blockedSeeds: [[3, 0]]
      },
      {
        id: "world-1-10",
        packId: "world-1",
        order: 10,
        titleKey: "level.world1.10",
        rows: 6,
        cols: 3,
        maxSeeds: 5,
        free: true,
        stars: { three: 5, two: null, one: null },
        holes: [
          [1, 0],
          [3, 0],
          [5, 0]
        ],
        requiredSeeds: [],
        blockedSeeds: [
          [3, 1],
          [1, 2]
        ]
      }
    ]
  },
  {
    id: "world-2",
    order: 2,
    titleKey: "pack.world2",
    access: "paid",
    purchaseId: "unlock_full_game",
    levels: [
      {
        id: "world-2-01",
        packId: "world-2",
        order: 11,
        titleKey: "level.world2.01",
        rows: 10,
        cols: 7,
        maxSeeds: 8,
        free: false,
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
        id: "world-2-02",
        packId: "world-2",
        order: 12,
        titleKey: "level.world2.02",
        rows: 8,
        cols: 8,
        maxSeeds: 4,
        free: false,
        stars: { three: 4, two: null, one: null },
        holes: [[3, 3], [3, 4], [4, 3], [4, 4]],
        requiredSeeds: [[0, 0]],
        blockedSeeds: [[7, 7]]
      }
    ]
  }
];

export const sampleLevels: Level[] = sampleLevelPacks
  .flatMap((pack) => pack.levels)
  .sort((a, b) => a.order - b.order);
