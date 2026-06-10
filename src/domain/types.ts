export type CellCoord = [row: number, col: number];

export type Locale = "zh-Hant" | "en" | "ja";

export type CellKind = "playable" | "hole" | "requiredSeed" | "blockedSeed";

export interface StarThresholds {
  one: number | null;
  two: number | null;
  three: number;
}

export interface Level {
  id: string;
  packId: string;
  order: number;
  titleKey: string;
  rows: number;
  cols: number;
  maxSeeds: number;
  free: boolean;
  stars: StarThresholds;
  holes: CellCoord[];
  requiredSeeds: CellCoord[];
  blockedSeeds: CellCoord[];
}

export interface LevelResult {
  completed: boolean;
  infected: Set<string>;
  waves: CellCoord[][];
  seedsUsed: number;
  stars: 0 | 1 | 2 | 3;
  failureReason?: "incomplete" | "missingRequiredSeed" | "blockedSeedSelected" | "tooManySeeds";
}
