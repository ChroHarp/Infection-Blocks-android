import { describe, expect, it } from "vitest";
import { runInfection } from "../domain/engine";
import type { CellCoord } from "../domain/types";
import { presentationLevelPacks } from "./presentationLevelPacks";

const threeStarSolutions: Record<string, CellCoord[]> = {
  "stairs-01": [[0, 1], [6, 4], [6, 6], [3, 2], [5, 2], [2, 3], [3, 0]],
  "stairs-02": [[2, 6], [3, 5], [0, 6], [6, 4], [4, 2], [5, 0], [5, 3]],
  "stairs-03": [[3, 0], [2, 1], [5, 0], [0, 2], [2, 7], [0, 4], [7, 0], [1, 5]],
  "stairs-04": [[3, 3], [0, 5], [0, 0], [2, 5], [7, 6], [1, 6], [5, 6], [2, 2]],
  "stairs-05": [[4, 0], [6, 3], [0, 0], [5, 4], [4, 2], [2, 2], [6, 6], [5, 6]],
  "stairs-06": [[4, 3], [5, 2], [7, 7], [7, 4], [2, 0], [0, 0], [5, 0], [6, 5]],
  "stairs-07": [[7, 4], [2, 3], [5, 6], [4, 3], [1, 0], [2, 1], [2, 5], [0, 3]],
  "stairs-08": [[7, 4], [8, 3], [4, 4], [0, 7], [2, 6], [0, 2], [1, 0], [3, 2], [5, 5]],
  "two-ways-01": [[4, 2], [1, 4], [6, 8], [3, 5], [0, 8], [2, 7], [4, 0], [4, 7]],
  "two-ways-02": [[0, 6], [5, 2], [4, 0], [4, 2], [5, 4], [3, 5], [7, 6], [1, 5]],
  "two-ways-03": [[4, 0], [2, 6], [7, 1], [5, 0], [0, 1], [3, 3], [2, 1], [2, 4]],
  "two-ways-04": [[5, 4], [8, 1], [3, 6], [0, 0], [6, 2], [2, 0], [1, 2], [4, 2]],
  "two-ways-05": [[6, 7], [4, 4], [1, 0], [4, 6], [0, 1], [2, 5], [5, 6], [2, 2]],
  "two-ways-06": [[7, 5], [5, 5], [4, 0], [8, 6], [0, 1], [2, 3], [8, 3], [7, 1]],
  "two-ways-07": [[3, 1], [3, 5], [0, 5], [3, 3], [1, 6], [5, 3], [6, 0]],
  "three-ways-01": [[0, 8], [9, 0], [6, 2], [5, 1], [2, 8], [6, 3], [3, 5], [7, 0], [4, 4], [1, 6]],
  "three-ways-02": [[4, 0], [0, 4], [3, 1], [2, 7], [4, 6], [6, 11], [5, 5], [5, 3], [7, 10], [4, 9]],
  "three-ways-03": [[7, 5], [9, 11], [5, 0], [6, 8], [4, 4], [5, 11], [2, 6], [6, 6], [5, 9], [0, 6], [4, 2]],
  "three-ways-04": [[3, 6], [7, 3], [1, 6], [3, 9], [7, 0], [5, 1], [0, 5], [5, 8], [8, 1], [5, 10]],
  "three-ways-05": [[5, 0], [0, 5], [10, 0], [4, 6], [5, 8], [5, 10], [3, 4], [7, 2], [9, 1], [1, 4], [8, 3]],
  "three-ways-06": [[8, 6], [5, 9], [7, 9], [6, 7], [2, 0], [6, 4], [3, 2], [10, 5], [7, 2], [5, 11], [1, 1], [0, 0]],
  "three-ways-07": [[6, 4], [5, 6], [5, 11], [8, 4], [4, 7], [9, 5], [0, 2], [4, 9], [5, 0], [1, 4], [2, 3]],
  "three-ways-08": [[1, 10], [7, 2], [0, 10], [9, 5], [4, 8], [4, 4], [2, 6], [3, 9], [5, 0], [5, 7], [4, 2]],
  "three-ways-09": [[5, 6], [6, 0], [5, 10], [4, 2], [0, 10], [8, 2], [4, 8], [5, 4], [6, 3], [2, 5]],
  "generalized-cross-2-01": [[0, 5], [4, 0], [7, 4], [7, 2], [4, 8], [6, 7], [9, 4], [5, 6], [2, 5], [4, 4]],
  "generalized-cross-2-02": [[5, 6], [4, 8], [0, 6], [2, 0], [3, 7], [7, 5], [2, 5], [1, 3], [3, 1]],
  "generalized-cross-2-03": [[6, 4], [0, 4], [4, 10], [2, 3], [8, 2], [4, 2], [3, 8], [3, 0], [5, 1], [3, 6]],
  "generalized-cross-2-04": [[4, 1], [2, 2], [8, 6], [5, 0], [2, 4], [4, 6], [5, 8], [5, 11], [10, 6], [1, 6], [6, 10], [0, 3]],
  "generalized-cross-2-05": [[5, 1], [4, 5], [3, 2], [3, 0], [0, 4], [4, 7], [1, 7], [3, 8], [7, 3]],
  "generalized-cross-2-06": [[4, 9], [5, 11], [4, 7], [4, 12], [7, 2], [2, 3], [0, 5], [9, 4], [6, 5], [2, 5], [4, 0], [4, 5]],
  "generalized-cross-2-07": [[6, 2], [2, 5], [0, 8], [8, 1], [3, 8], [9, 3], [4, 6], [6, 0], [6, 12], [6, 7], [4, 4], [4, 10]],
  "generalized-cross-2-08": [[2, 9], [3, 12], [3, 5], [6, 1], [3, 0], [0, 12], [4, 3], [2, 11], [3, 7], [3, 2]],
  "generalized-cross-2-09": [[9, 9], [1, 9], [7, 1], [4, 0], [1, 1], [2, 4], [5, 9], [7, 3], [8, 7], [9, 5], [3, 8], [2, 2], [1, 6], [0, 0], [7, 8]],
  "generalized-cross-2-10": [[6, 2], [1, 7], [3, 10], [0, 9], [5, 3], [0, 5], [4, 0], [3, 3], [10, 7], [9, 9], [8, 1], [9, 4], [1, 10], [10, 5], [1, 0], [5, 9], [7, 10]],
  "generalized-cross-2-11": [[1, 0], [0, 11], [9, 7], [4, 1], [8, 6], [8, 2], [8, 11], [3, 0], [2, 11], [0, 7], [0, 9], [6, 11], [4, 11], [6, 1], [1, 5], [11, 2], [10, 9], [9, 5], [7, 3]],
  "generalized-cross-2-12": [[8, 9], [5, 8], [0, 5], [4, 7], [8, 5], [10, 7], [7, 0], [1, 2], [6, 9], [2, 9], [7, 2], [11, 4], [1, 6]],
  "generalized-cross-2-13": [[9, 0], [8, 2], [0, 8], [6, 5], [9, 7], [1, 9], [9, 9], [2, 2], [10, 1], [5, 3], [3, 0], [7, 9], [7, 3], [3, 7], [5, 9]],
  "generalized-cross-2-14": [[0, 5], [7, 10], [9, 7], [11, 3], [0, 1], [0, 3], [8, 5], [8, 0], [6, 9], [1, 0], [11, 5], [7, 6], [1, 10], [3, 10], [5, 2], [3, 0], [0, 7]],
  "generalized-cross-2-15": [[7, 1], [0, 0], [2, 6], [3, 8], [1, 8], [4, 2], [10, 2], [2, 4], [10, 10], [6, 11], [1, 2], [5, 6], [7, 6], [8, 9], [6, 2], [11, 4], [12, 9]],
  "generalized-cross-2-16": [[3, 0], [11, 5], [4, 2], [10, 2], [10, 6], [8, 11], [10, 8], [0, 11], [9, 10], [8, 1], [6, 3], [6, 1], [0, 8], [4, 10], [2, 11], [12, 9], [6, 10], [1, 6], [0, 4]]
};

describe("presentation level packs", () => {
  const levels = presentationLevelPacks.flatMap((pack) => pack.levels);

  it("keeps the four PowerPoint sections and all 40 levels", () => {
    expect(presentationLevelPacks.map((pack) => [pack.id, pack.levels.length])).toEqual([
      ["stairs", 8],
      ["two-ways", 7],
      ["three-ways", 9],
      ["generalized-cross-2", 16]
    ]);
    expect(levels).toHaveLength(40);
  });

  it("uses the theoretical perimeter lower bound and synchronized passing limits", () => {
    for (const level of levels) {
      expect(level.stars.three).toBe(Math.ceil(perimeter(level) / 4));
      expect(level.stars.two).toBe(level.stars.three + 1);
      expect(level.stars.one).toBe(level.stars.three + 2);
      expect(level.maxSeeds).toBe(level.stars.one);
    }
  });

  it("has a valid solution at every three-star threshold, including required and blocked cells", () => {
    for (const level of levels) {
      const seeds = threeStarSolutions[level.id];
      expect(seeds, `missing verified solution for ${level.id}`).toBeDefined();
      expect(seeds).toHaveLength(level.stars.three);
      expect(runInfection(level, seeds), level.id).toMatchObject({ completed: true, stars: 3 });
    }
  });
});

function perimeter(level: (typeof presentationLevelPacks)[number]["levels"][number]): number {
  const holes = new Set(level.holes.map(([row, col]) => `${row},${col}`));
  const isCell = (row: number, col: number): boolean => (
    row >= 0 && row < level.rows && col >= 0 && col < level.cols && !holes.has(`${row},${col}`)
  );

  let total = 0;
  for (let row = 0; row < level.rows; row += 1) {
    for (let col = 0; col < level.cols; col += 1) {
      if (!isCell(row, col)) continue;
      if (!isCell(row - 1, col)) total += 1;
      if (!isCell(row + 1, col)) total += 1;
      if (!isCell(row, col - 1)) total += 1;
      if (!isCell(row, col + 1)) total += 1;
    }
  }
  return total;
}
