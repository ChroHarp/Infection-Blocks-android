import type { Level, LevelPack } from "../domain/types";

function levelFromPattern(
  id: string,
  order: number,
  titleKey: string,
  pattern: string[],
  extraThreeStarSeed = 0
): Level {
  const rows = pattern.length;
  const cols = pattern[0]?.length ?? 0;
  const holes: Level["holes"] = [];

  pattern.forEach((line, row) => {
    if (line.length !== cols) {
      throw new Error(`Invalid level pattern width for ${id}`);
    }

    [...line].forEach((cell, col) => {
      if (cell === ".") holes.push([row, col]);
    });
  });

  const three = Math.ceil((rows + cols) / 2) + extraThreeStarSeed;

  return {
    id,
    packId: "generalized-cross",
    order,
    titleKey,
    rows,
    cols,
    maxSeeds: three + 2,
    free: true,
    stars: {
      three,
      two: three + 1,
      one: three + 2
    },
    holes,
    requiredSeeds: [],
    blockedSeeds: []
  };
}

export const sampleLevelPacks: LevelPack[] = [
  {
    "id": "world-1",
    "order": 1,
    "titleKey": "pack.world1",
    "access": "free",
    "status": "published",
    "levels": [
      {
        "id": "world-1-01",
        "packId": "world-1",
        "order": 1,
        "titleKey": "level.world1.01",
        "rows": 6,
        "cols": 1,
        "maxSeeds": 7,
        "free": true,
        "stars": {
          "three": 5,
          "one": 7,
          "two": 6
        },
        "holes": [],
        "requiredSeeds": [],
        "blockedSeeds": []
      },
      {
        "id": "world-1-02",
        "packId": "world-1",
        "order": 2,
        "titleKey": "level.world1.02",
        "rows": 7,
        "cols": 2,
        "maxSeeds": 7,
        "free": true,
        "stars": {
          "two": 6,
          "one": 7,
          "three": 5
        },
        "holes": [],
        "requiredSeeds": [],
        "blockedSeeds": []
      },
      {
        "id": "world-1-03",
        "packId": "world-1",
        "order": 3,
        "titleKey": "level.world1.03",
        "rows": 4,
        "cols": 4,
        "maxSeeds": 6,
        "free": true,
        "stars": {
          "three": 4,
          "one": 6,
          "two": 5
        },
        "holes": [],
        "requiredSeeds": [],
        "blockedSeeds": []
      },
      {
        "id": "world-1-04",
        "packId": "world-1",
        "order": 4,
        "titleKey": "level.world1.04",
        "rows": 6,
        "cols": 4,
        "maxSeeds": 7,
        "free": true,
        "stars": {
          "two": 6,
          "one": 7,
          "three": 5
        },
        "holes": [],
        "requiredSeeds": [],
        "blockedSeeds": []
      },
      {
        "id": "world-1-05",
        "packId": "world-1",
        "order": 5,
        "titleKey": "level.world1.05",
        "rows": 7,
        "cols": 2,
        "maxSeeds": 7,
        "free": true,
        "stars": {
          "one": 7,
          "two": 6,
          "three": 5
        },
        "holes": [
          [
            6,
            0
          ]
        ],
        "requiredSeeds": [],
        "blockedSeeds": []
      },
      {
        "id": "world-1-06",
        "packId": "world-1",
        "order": 6,
        "titleKey": "level.world1.06",
        "rows": 6,
        "cols": 2,
        "maxSeeds": 6,
        "free": true,
        "stars": {
          "two": 5,
          "one": 6,
          "three": 4
        },
        "holes": [
          [
            5,
            1
          ]
        ],
        "requiredSeeds": [],
        "blockedSeeds": []
      },
      {
        "id": "world-1-07",
        "packId": "world-1",
        "order": 7,
        "titleKey": "level.world1.07",
        "rows": 6,
        "cols": 3,
        "maxSeeds": 7,
        "free": true,
        "stars": {
          "one": 7,
          "two": 6,
          "three": 5
        },
        "holes": [
          [
            1,
            0
          ],
          [
            2,
            0
          ],
          [
            3,
            0
          ],
          [
            4,
            0
          ],
          [
            5,
            0
          ],
          [
            0,
            2
          ],
          [
            1,
            2
          ],
          [
            3,
            2
          ],
          [
            4,
            2
          ],
          [
            5,
            2
          ]
        ],
        "requiredSeeds": [
          [
            1,
            1
          ]
        ],
        "blockedSeeds": []
      },
      {
        "id": "world-1-08",
        "packId": "world-1",
        "order": 8,
        "titleKey": "level.world1.08",
        "rows": 6,
        "cols": 3,
        "maxSeeds": 8,
        "free": true,
        "stars": {
          "one": 8,
          "two": 7,
          "three": 6
        },
        "holes": [
          [
            0,
            0
          ],
          [
            0,
            2
          ],
          [
            2,
            0
          ],
          [
            2,
            2
          ],
          [
            3,
            0
          ],
          [
            3,
            2
          ],
          [
            4,
            0
          ],
          [
            4,
            2
          ],
          [
            5,
            0
          ]
        ],
        "requiredSeeds": [
          [
            3,
            1
          ]
        ],
        "blockedSeeds": []
      },
      {
        "id": "world-1-09",
        "packId": "world-1",
        "order": 9,
        "titleKey": "level.world1.09",
        "rows": 7,
        "cols": 2,
        "maxSeeds": 8,
        "free": true,
        "stars": {
          "one": 8,
          "two": 7,
          "three": 6
        },
        "holes": [
          [
            1,
            0
          ],
          [
            3,
            0
          ],
          [
            5,
            0
          ]
        ],
        "requiredSeeds": [],
        "blockedSeeds": [
          [
            3,
            1
          ]
        ]
      },
      {
        "id": "world-1-10",
        "packId": "world-1",
        "order": 10,
        "titleKey": "level.world1.10",
        "rows": 6,
        "cols": 3,
        "maxSeeds": 8,
        "free": true,
        "stars": {
          "one": 8,
          "two": 7,
          "three": 6
        },
        "holes": [
          [
            1,
            0
          ],
          [
            3,
            0
          ],
          [
            5,
            0
          ]
        ],
        "requiredSeeds": [],
        "blockedSeeds": [
          [
            3,
            1
          ],
          [
            1,
            2
          ]
        ]
      }
    ]
  },
  {
    "id": "world-2",
    "order": 2,
    "titleKey": "pack.world2",
    "access": "paid",
    "status": "published",
    "purchaseId": "unlock_full_game",
    "levels": [
      {
        "id": "world-2-01",
        "packId": "world-2",
        "order": 11,
        "titleKey": "level.world2.01",
        "rows": 10,
        "cols": 7,
        "maxSeeds": 8,
        "free": false,
        "stars": {
          "two": 8,
          "one": null,
          "three": 5
        },
        "holes": [
          [
            4,
            1
          ],
          [
            4,
            2
          ],
          [
            4,
            3
          ],
          [
            5,
            1
          ],
          [
            5,
            2
          ],
          [
            5,
            3
          ],
          [
            6,
            1
          ],
          [
            6,
            2
          ],
          [
            6,
            3
          ],
          [
            7,
            1
          ],
          [
            7,
            2
          ],
          [
            7,
            3
          ]
        ],
        "requiredSeeds": [],
        "blockedSeeds": []
      },
      {
        "id": "world-2-02",
        "packId": "world-2",
        "order": 12,
        "titleKey": "level.world2.02",
        "rows": 8,
        "cols": 8,
        "maxSeeds": 4,
        "free": false,
        "stars": {
          "three": 4,
          "two": null,
          "one": null
        },
        "holes": [
          [
            3,
            3
          ],
          [
            3,
            4
          ],
          [
            4,
            3
          ],
          [
            4,
            4
          ]
        ],
        "requiredSeeds": [
          [
            0,
            0
          ]
        ],
        "blockedSeeds": [
          [
            7,
            7
          ]
        ]
      }
    ]
  },
  {
    "id": "generalized-cross",
    "order": 3,
    "titleKey": "Generalized Cross",
    "access": "free",
    "status": "published",
    "levels": [
      levelFromPattern("cross-01-classic-plus", 13, "Classic Plus", [
        "...#...",
        "...#...",
        "...#...",
        "#######",
        "...#...",
        "...#...",
        "...#..."
      ], 1),
      levelFromPattern("cross-02-thick-plus", 14, "Thick Plus", [
        "..###..",
        "..###..",
        "..###..",
        "#######",
        "..###..",
        "..###..",
        "..###.."
      ]),
      levelFromPattern("cross-03-stepped-gate", 15, "Stepped Gate", [
        "...##...",
        "..####..",
        "..####..",
        "########",
        "########",
        "..####..",
        "..####..",
        "...##..."
      ]),
      levelFromPattern("cross-04-pinwheel", 16, "Pinwheel Cross", [
        "....##...",
        "...###...",
        "..#####..",
        "..#####..",
        "#########",
        ".#######.",
        "..#####..",
        "...###...",
        "...##...."
      ]),
      levelFromPattern("cross-05-lantern", 17, "Lantern Cross", [
        "....##....",
        "...####...",
        "..######..",
        "..######..",
        "##########",
        "##########",
        "..######..",
        "...####...",
        "....##...."
      ]),
      levelFromPattern("cross-06-hourglass", 18, "Hourglass Cross", [
        "....##....",
        "...####...",
        "..######..",
        ".########.",
        "##########",
        ".########.",
        "..######..",
        "...####...",
        "...####...",
        "....##...."
      ]),
      levelFromPattern("cross-07-bridge", 19, "Double Bridge", [
        "....###....",
        "...#####...",
        "...#####...",
        "..#######..",
        "###########",
        "###########",
        "..#######..",
        "...#####...",
        "...#####...",
        "....###...."
      ]),
      levelFromPattern("cross-08-shield", 20, "Cross Shield", [
        ".....#.....",
        "....###....",
        "...#####...",
        "..#######..",
        ".#########.",
        "###########",
        ".#########.",
        "..#######..",
        "...#####...",
        "....###....",
        ".....#....."
      ], 1),
      levelFromPattern("cross-09-bloom-sigil", 21, "Bloom Sigil", [
        ".....##.....",
        "....####....",
        "...######...",
        "..########..",
        ".##########.",
        "############",
        "############",
        ".##########.",
        "..########..",
        "...######...",
        "....####....",
        ".....##....."
      ], 1),
      levelFromPattern("cross-10-totem-crest", 22, "Totem Crest", [
        "......#......",
        ".....###.....",
        "....#####....",
        "...#######...",
        "..#########..",
        ".###########.",
        "#############",
        ".###########.",
        "..#########..",
        "...#######...",
        "....#####....",
        ".....###....."
      ], 1)
    ]
  }
];

export const sampleLevels: Level[] = sampleLevelPacks
  .flatMap((pack) => pack.levels)
  .sort((a, b) => a.order - b.order);
