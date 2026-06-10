import { cellKey, coordKey } from "./coords";
import type { CellCoord, Level, LevelResult } from "./types";

export function runInfection(level: Level, seeds: CellCoord[]): LevelResult {
  const seedSet = new Set(seeds.map(coordKey));
  const holeSet = new Set(level.holes.map(coordKey));
  const blockedSet = new Set(level.blockedSeeds.map(coordKey));
  const requiredSet = new Set(level.requiredSeeds.map(coordKey));

  if (seedSet.size > maxPassingSeeds(level)) {
    return failure(level, seedSet, [], "tooManySeeds");
  }

  for (const required of requiredSet) {
    if (!seedSet.has(required)) {
      return failure(level, seedSet, [], "missingRequiredSeed");
    }
  }

  for (const seed of seedSet) {
    if (blockedSet.has(seed)) {
      return failure(level, seedSet, [], "blockedSeedSelected");
    }
  }

  const infected = new Set(seedSet);
  const waves: CellCoord[][] = [];
  let wave = findNextWave(level, infected, holeSet);

  while (wave.length > 0) {
    waves.push(wave);
    for (const coord of wave) {
      infected.add(coordKey(coord));
    }
    wave = findNextWave(level, infected, holeSet);
  }

  const completed = infected.size === targetCellCount(level);

  return {
    completed,
    infected,
    waves,
    seedsUsed: seedSet.size,
    stars: completed ? starsFor(level, seedSet.size) : 0,
    failureReason: completed ? undefined : "incomplete"
  };
}

export function targetCellCount(level: Level): number {
  return level.rows * level.cols - level.holes.length;
}

export function starsFor(level: Level, seedsUsed: number): 0 | 1 | 2 | 3 {
  if (seedsUsed <= level.stars.three) return 3;
  if (level.stars.two !== null && seedsUsed <= level.stars.two) return 2;
  if (level.stars.one !== null && seedsUsed <= level.stars.one) return 1;
  return 0;
}

export function maxPassingSeeds(level: Level): number {
  return level.stars.one ?? level.stars.two ?? level.stars.three;
}

function failure(
  level: Level,
  infected: Set<string>,
  waves: CellCoord[][],
  failureReason: LevelResult["failureReason"]
): LevelResult {
  return {
    completed: false,
    infected,
    waves,
    seedsUsed: infected.size,
    stars: 0,
    failureReason
  };
}

function findNextWave(level: Level, infected: Set<string>, holes: Set<string>): CellCoord[] {
  const nextWave: CellCoord[] = [];

  for (let row = 0; row < level.rows; row += 1) {
    for (let col = 0; col < level.cols; col += 1) {
      const key = cellKey(row, col);
      if (holes.has(key) || infected.has(key)) continue;
      if (infectedNeighborCount(level, row, col, infected) >= 2) {
        nextWave.push([row, col]);
      }
    }
  }

  return nextWave;
}

function infectedNeighborCount(level: Level, row: number, col: number, infected: Set<string>): number {
  return [
    [row - 1, col],
    [row + 1, col],
    [row, col - 1],
    [row, col + 1]
  ].filter(([nextRow, nextCol]) => (
    nextRow >= 0 &&
    nextRow < level.rows &&
    nextCol >= 0 &&
    nextCol < level.cols &&
    infected.has(cellKey(nextRow, nextCol))
  )).length;
}
