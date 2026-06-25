import type { Level, LevelPack } from "../domain/types";

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
          "two": 6,
          "one": 7
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
          "two": 5,
          "one": 6
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
          "three": 5,
          "one": 7,
          "two": 6
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
          "three": 5,
          "one": 7,
          "two": 6
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
          "one": 6,
          "two": 5,
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
          "three": 5,
          "one": 7,
          "two": 6
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
          "three": 6,
          "two": 7,
          "one": 8
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
          "three": 6,
          "two": 7,
          "one": 8
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
        "maxSeeds": 14,
        "free": false,
        "stars": {
          "three": 12,
          "one": 14,
          "two": 13
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
        "maxSeeds": 12,
        "free": false,
        "stars": {
          "one": 12,
          "two": 11,
          "three": 10
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
      {
        "id": "cross-01-classic-plus",
        "packId": "generalized-cross",
        "order": 13,
        "titleKey": "Classic Plus",
        "rows": 7,
        "cols": 7,
        "maxSeeds": 10,
        "free": true,
        "stars": {
          "one": 10,
          "two": 9,
          "three": 8
        },
        "holes": [
          [
            0,
            0
          ],
          [
            0,
            1
          ],
          [
            0,
            2
          ],
          [
            0,
            4
          ],
          [
            0,
            5
          ],
          [
            0,
            6
          ],
          [
            1,
            0
          ],
          [
            1,
            1
          ],
          [
            1,
            2
          ],
          [
            1,
            4
          ],
          [
            1,
            5
          ],
          [
            1,
            6
          ],
          [
            2,
            0
          ],
          [
            2,
            1
          ],
          [
            2,
            2
          ],
          [
            2,
            4
          ],
          [
            2,
            5
          ],
          [
            2,
            6
          ],
          [
            4,
            0
          ],
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
            4
          ],
          [
            4,
            5
          ],
          [
            4,
            6
          ],
          [
            5,
            0
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
            4
          ],
          [
            5,
            5
          ],
          [
            5,
            6
          ],
          [
            6,
            0
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
            4
          ],
          [
            6,
            5
          ],
          [
            6,
            6
          ]
        ],
        "requiredSeeds": [],
        "blockedSeeds": []
      },
      {
        "id": "cross-02-thick-plus",
        "packId": "generalized-cross",
        "order": 14,
        "titleKey": "Thick Plus",
        "rows": 7,
        "cols": 7,
        "maxSeeds": 9,
        "free": true,
        "stars": {
          "three": 7,
          "one": 9,
          "two": 8
        },
        "holes": [
          [
            0,
            0
          ],
          [
            0,
            1
          ],
          [
            0,
            5
          ],
          [
            0,
            6
          ],
          [
            1,
            0
          ],
          [
            1,
            1
          ],
          [
            1,
            5
          ],
          [
            1,
            6
          ],
          [
            2,
            0
          ],
          [
            2,
            1
          ],
          [
            2,
            5
          ],
          [
            2,
            6
          ],
          [
            4,
            0
          ],
          [
            4,
            1
          ],
          [
            4,
            5
          ],
          [
            4,
            6
          ],
          [
            5,
            0
          ],
          [
            5,
            1
          ],
          [
            5,
            5
          ],
          [
            5,
            6
          ],
          [
            6,
            0
          ],
          [
            6,
            1
          ],
          [
            6,
            5
          ],
          [
            6,
            6
          ]
        ],
        "requiredSeeds": [],
        "blockedSeeds": []
      },
      {
        "id": "cross-03-stepped-gate",
        "packId": "generalized-cross",
        "order": 15,
        "titleKey": "Stepped Gate",
        "rows": 8,
        "cols": 8,
        "maxSeeds": 10,
        "free": true,
        "stars": {
          "one": 10,
          "two": 9,
          "three": 8
        },
        "holes": [
          [
            0,
            0
          ],
          [
            0,
            1
          ],
          [
            0,
            2
          ],
          [
            0,
            5
          ],
          [
            0,
            6
          ],
          [
            0,
            7
          ],
          [
            1,
            0
          ],
          [
            1,
            1
          ],
          [
            1,
            6
          ],
          [
            1,
            7
          ],
          [
            2,
            0
          ],
          [
            2,
            1
          ],
          [
            2,
            6
          ],
          [
            2,
            7
          ],
          [
            5,
            0
          ],
          [
            5,
            1
          ],
          [
            5,
            6
          ],
          [
            5,
            7
          ],
          [
            6,
            0
          ],
          [
            6,
            1
          ],
          [
            6,
            6
          ],
          [
            6,
            7
          ],
          [
            7,
            0
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
            5
          ],
          [
            7,
            6
          ],
          [
            7,
            7
          ]
        ],
        "requiredSeeds": [],
        "blockedSeeds": []
      },
      {
        "id": "cross-04-pinwheel",
        "packId": "generalized-cross",
        "order": 16,
        "titleKey": "Pinwheel Cross",
        "rows": 9,
        "cols": 9,
        "maxSeeds": 11,
        "free": true,
        "stars": {
          "one": 11,
          "two": 10,
          "three": 9
        },
        "holes": [
          [
            0,
            0
          ],
          [
            0,
            1
          ],
          [
            0,
            2
          ],
          [
            0,
            3
          ],
          [
            0,
            6
          ],
          [
            0,
            7
          ],
          [
            0,
            8
          ],
          [
            1,
            0
          ],
          [
            1,
            1
          ],
          [
            1,
            2
          ],
          [
            1,
            6
          ],
          [
            1,
            7
          ],
          [
            1,
            8
          ],
          [
            2,
            0
          ],
          [
            2,
            1
          ],
          [
            2,
            7
          ],
          [
            2,
            8
          ],
          [
            3,
            0
          ],
          [
            3,
            1
          ],
          [
            3,
            7
          ],
          [
            3,
            8
          ],
          [
            5,
            0
          ],
          [
            5,
            8
          ],
          [
            6,
            0
          ],
          [
            6,
            1
          ],
          [
            6,
            7
          ],
          [
            6,
            8
          ],
          [
            7,
            0
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
            6
          ],
          [
            7,
            7
          ],
          [
            7,
            8
          ],
          [
            8,
            0
          ],
          [
            8,
            1
          ],
          [
            8,
            2
          ],
          [
            8,
            5
          ],
          [
            8,
            6
          ],
          [
            8,
            7
          ],
          [
            8,
            8
          ]
        ],
        "requiredSeeds": [],
        "blockedSeeds": []
      },
      {
        "id": "cross-05-lantern",
        "packId": "generalized-cross",
        "order": 17,
        "titleKey": "Lantern Cross",
        "rows": 9,
        "cols": 10,
        "maxSeeds": 12,
        "free": true,
        "stars": {
          "two": 11,
          "one": 12,
          "three": 10
        },
        "holes": [
          [
            0,
            0
          ],
          [
            0,
            1
          ],
          [
            0,
            2
          ],
          [
            0,
            3
          ],
          [
            0,
            6
          ],
          [
            0,
            7
          ],
          [
            0,
            8
          ],
          [
            0,
            9
          ],
          [
            1,
            0
          ],
          [
            1,
            1
          ],
          [
            1,
            2
          ],
          [
            1,
            7
          ],
          [
            1,
            8
          ],
          [
            1,
            9
          ],
          [
            2,
            0
          ],
          [
            2,
            1
          ],
          [
            2,
            8
          ],
          [
            2,
            9
          ],
          [
            3,
            0
          ],
          [
            3,
            1
          ],
          [
            3,
            8
          ],
          [
            3,
            9
          ],
          [
            6,
            0
          ],
          [
            6,
            1
          ],
          [
            6,
            8
          ],
          [
            6,
            9
          ],
          [
            7,
            0
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
            7
          ],
          [
            7,
            8
          ],
          [
            7,
            9
          ],
          [
            8,
            0
          ],
          [
            8,
            1
          ],
          [
            8,
            2
          ],
          [
            8,
            3
          ],
          [
            8,
            6
          ],
          [
            8,
            7
          ],
          [
            8,
            8
          ],
          [
            8,
            9
          ]
        ],
        "requiredSeeds": [],
        "blockedSeeds": []
      },
      {
        "id": "cross-06-hourglass",
        "packId": "generalized-cross",
        "order": 18,
        "titleKey": "Hourglass Cross",
        "rows": 10,
        "cols": 10,
        "maxSeeds": 12,
        "free": true,
        "stars": {
          "three": 10,
          "one": 12,
          "two": 11
        },
        "holes": [
          [
            0,
            0
          ],
          [
            0,
            1
          ],
          [
            0,
            2
          ],
          [
            0,
            3
          ],
          [
            0,
            6
          ],
          [
            0,
            7
          ],
          [
            0,
            8
          ],
          [
            0,
            9
          ],
          [
            1,
            0
          ],
          [
            1,
            1
          ],
          [
            1,
            2
          ],
          [
            1,
            7
          ],
          [
            1,
            8
          ],
          [
            1,
            9
          ],
          [
            2,
            0
          ],
          [
            2,
            1
          ],
          [
            2,
            8
          ],
          [
            2,
            9
          ],
          [
            3,
            0
          ],
          [
            3,
            9
          ],
          [
            5,
            0
          ],
          [
            5,
            9
          ],
          [
            6,
            0
          ],
          [
            6,
            1
          ],
          [
            6,
            8
          ],
          [
            6,
            9
          ],
          [
            7,
            0
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
            7
          ],
          [
            7,
            8
          ],
          [
            7,
            9
          ],
          [
            8,
            0
          ],
          [
            8,
            1
          ],
          [
            8,
            2
          ],
          [
            8,
            7
          ],
          [
            8,
            8
          ],
          [
            8,
            9
          ],
          [
            9,
            0
          ],
          [
            9,
            1
          ],
          [
            9,
            2
          ],
          [
            9,
            3
          ],
          [
            9,
            6
          ],
          [
            9,
            7
          ],
          [
            9,
            8
          ],
          [
            9,
            9
          ]
        ],
        "requiredSeeds": [],
        "blockedSeeds": []
      },
      {
        "id": "cross-07-bridge",
        "packId": "generalized-cross",
        "order": 19,
        "titleKey": "Double Bridge",
        "rows": 10,
        "cols": 11,
        "maxSeeds": 13,
        "free": true,
        "stars": {
          "three": 11,
          "one": 13,
          "two": 12
        },
        "holes": [
          [
            0,
            0
          ],
          [
            0,
            1
          ],
          [
            0,
            2
          ],
          [
            0,
            3
          ],
          [
            0,
            7
          ],
          [
            0,
            8
          ],
          [
            0,
            9
          ],
          [
            0,
            10
          ],
          [
            1,
            0
          ],
          [
            1,
            1
          ],
          [
            1,
            2
          ],
          [
            1,
            8
          ],
          [
            1,
            9
          ],
          [
            1,
            10
          ],
          [
            2,
            0
          ],
          [
            2,
            1
          ],
          [
            2,
            2
          ],
          [
            2,
            8
          ],
          [
            2,
            9
          ],
          [
            2,
            10
          ],
          [
            3,
            0
          ],
          [
            3,
            1
          ],
          [
            3,
            9
          ],
          [
            3,
            10
          ],
          [
            6,
            0
          ],
          [
            6,
            1
          ],
          [
            6,
            9
          ],
          [
            6,
            10
          ],
          [
            7,
            0
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
            8
          ],
          [
            7,
            9
          ],
          [
            7,
            10
          ],
          [
            8,
            0
          ],
          [
            8,
            1
          ],
          [
            8,
            2
          ],
          [
            8,
            8
          ],
          [
            8,
            9
          ],
          [
            8,
            10
          ],
          [
            9,
            0
          ],
          [
            9,
            1
          ],
          [
            9,
            2
          ],
          [
            9,
            3
          ],
          [
            9,
            7
          ],
          [
            9,
            8
          ],
          [
            9,
            9
          ],
          [
            9,
            10
          ]
        ],
        "requiredSeeds": [],
        "blockedSeeds": []
      },
      {
        "id": "cross-08-shield",
        "packId": "generalized-cross",
        "order": 20,
        "titleKey": "Cross Shield",
        "rows": 11,
        "cols": 11,
        "maxSeeds": 14,
        "free": true,
        "stars": {
          "three": 12,
          "two": 13,
          "one": 14
        },
        "holes": [
          [
            0,
            0
          ],
          [
            0,
            1
          ],
          [
            0,
            2
          ],
          [
            0,
            3
          ],
          [
            0,
            4
          ],
          [
            0,
            6
          ],
          [
            0,
            7
          ],
          [
            0,
            8
          ],
          [
            0,
            9
          ],
          [
            0,
            10
          ],
          [
            1,
            0
          ],
          [
            1,
            1
          ],
          [
            1,
            2
          ],
          [
            1,
            3
          ],
          [
            1,
            7
          ],
          [
            1,
            8
          ],
          [
            1,
            9
          ],
          [
            1,
            10
          ],
          [
            2,
            0
          ],
          [
            2,
            1
          ],
          [
            2,
            2
          ],
          [
            2,
            8
          ],
          [
            2,
            9
          ],
          [
            2,
            10
          ],
          [
            3,
            0
          ],
          [
            3,
            1
          ],
          [
            3,
            9
          ],
          [
            3,
            10
          ],
          [
            4,
            0
          ],
          [
            4,
            10
          ],
          [
            6,
            0
          ],
          [
            6,
            10
          ],
          [
            7,
            0
          ],
          [
            7,
            1
          ],
          [
            7,
            9
          ],
          [
            7,
            10
          ],
          [
            8,
            0
          ],
          [
            8,
            1
          ],
          [
            8,
            2
          ],
          [
            8,
            8
          ],
          [
            8,
            9
          ],
          [
            8,
            10
          ],
          [
            9,
            0
          ],
          [
            9,
            1
          ],
          [
            9,
            2
          ],
          [
            9,
            3
          ],
          [
            9,
            7
          ],
          [
            9,
            8
          ],
          [
            9,
            9
          ],
          [
            9,
            10
          ],
          [
            10,
            0
          ],
          [
            10,
            1
          ],
          [
            10,
            2
          ],
          [
            10,
            3
          ],
          [
            10,
            4
          ],
          [
            10,
            6
          ],
          [
            10,
            7
          ],
          [
            10,
            8
          ],
          [
            10,
            9
          ],
          [
            10,
            10
          ]
        ],
        "requiredSeeds": [],
        "blockedSeeds": []
      },
      {
        "id": "cross-09-bloom-sigil",
        "packId": "generalized-cross",
        "order": 21,
        "titleKey": "Bloom Sigil",
        "rows": 12,
        "cols": 12,
        "maxSeeds": 15,
        "free": true,
        "stars": {
          "two": 14,
          "one": 15,
          "three": 13
        },
        "holes": [
          [
            0,
            0
          ],
          [
            0,
            1
          ],
          [
            0,
            2
          ],
          [
            0,
            3
          ],
          [
            0,
            4
          ],
          [
            0,
            7
          ],
          [
            0,
            8
          ],
          [
            0,
            9
          ],
          [
            0,
            10
          ],
          [
            0,
            11
          ],
          [
            1,
            0
          ],
          [
            1,
            1
          ],
          [
            1,
            2
          ],
          [
            1,
            3
          ],
          [
            1,
            8
          ],
          [
            1,
            9
          ],
          [
            1,
            10
          ],
          [
            1,
            11
          ],
          [
            2,
            0
          ],
          [
            2,
            1
          ],
          [
            2,
            2
          ],
          [
            2,
            9
          ],
          [
            2,
            10
          ],
          [
            2,
            11
          ],
          [
            3,
            0
          ],
          [
            3,
            1
          ],
          [
            3,
            10
          ],
          [
            3,
            11
          ],
          [
            4,
            0
          ],
          [
            4,
            11
          ],
          [
            7,
            0
          ],
          [
            7,
            11
          ],
          [
            8,
            0
          ],
          [
            8,
            1
          ],
          [
            8,
            10
          ],
          [
            8,
            11
          ],
          [
            9,
            0
          ],
          [
            9,
            1
          ],
          [
            9,
            2
          ],
          [
            9,
            9
          ],
          [
            9,
            10
          ],
          [
            9,
            11
          ],
          [
            10,
            0
          ],
          [
            10,
            1
          ],
          [
            10,
            2
          ],
          [
            10,
            3
          ],
          [
            10,
            8
          ],
          [
            10,
            9
          ],
          [
            10,
            10
          ],
          [
            10,
            11
          ],
          [
            11,
            0
          ],
          [
            11,
            1
          ],
          [
            11,
            2
          ],
          [
            11,
            3
          ],
          [
            11,
            4
          ],
          [
            11,
            7
          ],
          [
            11,
            8
          ],
          [
            11,
            9
          ],
          [
            11,
            10
          ],
          [
            11,
            11
          ]
        ],
        "requiredSeeds": [],
        "blockedSeeds": []
      },
      {
        "id": "cross-10-totem-crest",
        "packId": "generalized-cross",
        "order": 22,
        "titleKey": "Totem Crest",
        "rows": 12,
        "cols": 13,
        "maxSeeds": 16,
        "free": true,
        "stars": {
          "two": 15,
          "one": 16,
          "three": 14
        },
        "holes": [
          [
            0,
            0
          ],
          [
            0,
            1
          ],
          [
            0,
            2
          ],
          [
            0,
            3
          ],
          [
            0,
            4
          ],
          [
            0,
            5
          ],
          [
            0,
            7
          ],
          [
            0,
            8
          ],
          [
            0,
            9
          ],
          [
            0,
            10
          ],
          [
            0,
            11
          ],
          [
            0,
            12
          ],
          [
            1,
            0
          ],
          [
            1,
            1
          ],
          [
            1,
            2
          ],
          [
            1,
            3
          ],
          [
            1,
            4
          ],
          [
            1,
            8
          ],
          [
            1,
            9
          ],
          [
            1,
            10
          ],
          [
            1,
            11
          ],
          [
            1,
            12
          ],
          [
            2,
            0
          ],
          [
            2,
            1
          ],
          [
            2,
            2
          ],
          [
            2,
            3
          ],
          [
            2,
            9
          ],
          [
            2,
            10
          ],
          [
            2,
            11
          ],
          [
            2,
            12
          ],
          [
            3,
            0
          ],
          [
            3,
            1
          ],
          [
            3,
            2
          ],
          [
            3,
            10
          ],
          [
            3,
            11
          ],
          [
            3,
            12
          ],
          [
            4,
            0
          ],
          [
            4,
            1
          ],
          [
            4,
            11
          ],
          [
            4,
            12
          ],
          [
            5,
            0
          ],
          [
            5,
            12
          ],
          [
            7,
            0
          ],
          [
            7,
            12
          ],
          [
            8,
            0
          ],
          [
            8,
            1
          ],
          [
            8,
            11
          ],
          [
            8,
            12
          ],
          [
            9,
            0
          ],
          [
            9,
            1
          ],
          [
            9,
            2
          ],
          [
            9,
            10
          ],
          [
            9,
            11
          ],
          [
            9,
            12
          ],
          [
            10,
            0
          ],
          [
            10,
            1
          ],
          [
            10,
            2
          ],
          [
            10,
            3
          ],
          [
            10,
            9
          ],
          [
            10,
            10
          ],
          [
            10,
            11
          ],
          [
            10,
            12
          ],
          [
            11,
            0
          ],
          [
            11,
            1
          ],
          [
            11,
            2
          ],
          [
            11,
            3
          ],
          [
            11,
            4
          ],
          [
            11,
            8
          ],
          [
            11,
            9
          ],
          [
            11,
            10
          ],
          [
            11,
            11
          ],
          [
            11,
            12
          ]
        ],
        "requiredSeeds": [],
        "blockedSeeds": []
      }
    ]
  }
];

export const sampleLevels: Level[] = sampleLevelPacks
  .flatMap((pack) => pack.levels)
  .sort((a, b) => a.order - b.order);
