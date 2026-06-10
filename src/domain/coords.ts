import type { CellCoord } from "./types";

export function cellKey(row: number, col: number): string {
  return `${row}:${col}`;
}

export function coordKey([row, col]: CellCoord): string {
  return cellKey(row, col);
}

export function sameCoord(a: CellCoord, b: CellCoord): boolean {
  return a[0] === b[0] && a[1] === b[1];
}

export function uniqueCoords(coords: CellCoord[]): CellCoord[] {
  const seen = new Set<string>();
  const output: CellCoord[] = [];

  for (const coord of coords) {
    const key = coordKey(coord);
    if (!seen.has(key)) {
      seen.add(key);
      output.push(coord);
    }
  }

  return output;
}
