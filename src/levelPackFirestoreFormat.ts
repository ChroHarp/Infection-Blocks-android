import type { CellCoord, Level, LevelPack } from "./domain/types";

interface FirestoreCoord {
  row: number;
  col: number;
}

type FirestoreLevel = Omit<Level, "holes" | "requiredSeeds" | "blockedSeeds"> & {
  holes: FirestoreCoord[];
  requiredSeeds: FirestoreCoord[];
  blockedSeeds: FirestoreCoord[];
};

export type FirestoreLevelPack = Omit<LevelPack, "levels"> & {
  levels: FirestoreLevel[];
};

export function toFirestoreLevelPack(pack: LevelPack): FirestoreLevelPack {
  return {
    ...pack,
    levels: pack.levels.map((level) => ({
      ...level,
      holes: level.holes.map(toFirestoreCoord),
      requiredSeeds: level.requiredSeeds.map(toFirestoreCoord),
      blockedSeeds: level.blockedSeeds.map(toFirestoreCoord)
    }))
  };
}

function toFirestoreCoord([row, col]: CellCoord): FirestoreCoord {
  return { row, col };
}
