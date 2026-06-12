# Infection Blocks — CLAUDE.md

手機解謎遊戲，玩家在方格盤上放置初始感染源，按下開始後感染波浪自動擴散，最終評分取決於使用的感染源數量。

## 技術堆疊

- **語言**：TypeScript
- **打包**：Vite 7
- **行動包裝**：Capacitor 7（Android 優先）
- **測試**：Vitest
- **UI**：原生 DOM + CSS（無框架）
- **本機儲存**：`localStorage`

```bash
npm install
npm run dev        # 開發伺服器，http://127.0.0.1:5173
npm run test       # Vitest 單元測試
npm run build      # TypeScript 編譯 + Vite 打包
npm run android:init   # 首次建立 Android 專案
npm run android:sync   # 後續同步 web 變更到 Android
npm run android:open   # 以 Android Studio 開啟
```

編輯器（隱藏功能）：URL 加上 `?editor=1` 才會顯示。

## 目錄結構

```
src/
  domain/
    types.ts          # 核心型別：Level、LevelResult、CellKind 等
    engine.ts         # 純函式感染規則與星等計算
    engine.test.ts    # 引擎單元測試
    coords.ts         # 座標輔助函式（cellKey、coordKey 等）
  data/
    sampleLevels.ts   # 內建範例關卡
  main.ts             # 全部 UI 邏輯（render、事件綁定、狀態管理）
  storage.ts          # localStorage 封裝（關卡、進度、語言）
  i18n.ts             # 多語言字串（繁中、英、日）
  styles.css          # 版面與格子樣式
docs/
  handoff-2026-06-11.md   # 工作交接文件
  android-release-plan.md # Android 發布計畫
infection-blocks.html     # 原始單檔原型（保留作參考）
capacitor.config.ts       # App ID：com.infectionblocks.game
```

## 核心型別

```typescript
// 座標：[row, col]，零基底，row 向下遞增
type CellCoord = [row: number, col: number];

type CellKind = "playable" | "hole" | "requiredSeed" | "blockedSeed";

interface Level {
  id: string;
  packId: string;
  order: number;
  rows: number; cols: number;
  maxSeeds: number;        // 緩存的最低通關上限
  free: boolean;
  stars: { three: number; two: number | null; one: number | null };
  holes: CellCoord[];          // 不存在的格子，不需被感染
  requiredSeeds: CellCoord[];  // 必放的初始感染源（藍色）
  blockedSeeds: CellCoord[];   // 禁放但必須被感染的格子（紅色）
}
```

## 感染規則（`src/domain/engine.ts`）

`runInfection(level, seeds)` 是純函式，回傳 `LevelResult`。

1. 種子數 > 最低通關上限 → `tooManySeeds`
2. requiredSeeds 未全選 → `missingRequiredSeed`
3. 選了 blockedSeed → `blockedSeedSelected`
4. 每波：所有未感染、非 hole 的格子，若有 **≥ 2 個已感染的正交鄰格**，則該格本波被感染
5. 重複直到無新格被感染
6. 所有非 hole 格皆感染才算過關
7. 星等：`seeds ≤ stars.three → 3★`、`≤ stars.two → 2★`、`≤ stars.one → 1★`

僅正交（上下左右），**不含對角線**。

## 星等設定規則

| 填入欄位 | 結果 |
|---|---|
| 只填 `three` | 3★ / 失敗 |
| 填 `three` + `two` | 3★ / 2★ / 失敗 |
| 全填 | 3★ / 2★ / 1★ / 失敗 |

編輯器修改 3★ 上限時，會自動填入 2★ = 3★+1、1★ = 3★+2（可手動覆寫）。

## 狀態管理（`src/main.ts`）

單一 `AppState` 物件，`render()` 重繪整個 DOM。有三個畫面：

- `levels`：關卡選擇
- `play`：遊玩
- `editor`：關卡編輯器（需 `?editor=1`）

感染動畫：每波間隔 280ms，最後等 260ms 後顯示結果。

## localStorage 鍵值

| Key | 內容 |
|---|---|
| `infection-blocks.editor-levels` | 關卡陣列（JSON） |
| `infection-blocks.editor-index` | 目前關卡索引 |
| `infection-blocks.editor-level` | 舊版單一關卡（向下相容） |
| `infection-blocks.locale` | 語言（`zh-Hant` / `en` / `ja`） |
| `infection-blocks.progress` | 各關進度（最佳星等、最少種子） |

不同瀏覽器或裝置間的自訂關卡不共享，需透過 JSON 匯出/匯入，或將關卡移至 `src/data/` 納入版控。

## 多語言（`src/i18n.ts`）

`t(locale, key)` 查字典，找不到回退 `en`。目前支援：`zh-Hant`（繁中）、`en`（英）、`ja`（日）。

## 關卡解鎖邏輯

- 第 0 關永遠解鎖
- `free: true` 的關卡永遠解鎖
- 其餘關卡需要上一關已完成

## Android 狀態

Capacitor 設定已存在（`capacitor.config.ts`），`android/` 目錄已在 `.gitignore`，尚未提交到 repo。
首次部署需在本機執行 `npm run android:init`。

## 已知問題與待辦

- 尚無正式關卡包（只有 2 個範例關卡），需建立 `src/data/levels.json` 或 `levelPacks.ts`
- 無付費解鎖機制
- 無真正的關卡選擇畫面（現在編輯器和遊玩混在一起）
- 缺少 Android 圖示、截圖、隱私政策等上架素材
- `infection-blocks.html` 為歷史參考，文字有 mojibake，勿編輯
- 需補充測試：必放種子未選、禁放種子選了、星等邊界、1×1 盤面

## 近期建議優先項

1. 建立版控關卡包（`src/data/levelPacks.ts`）
2. 拆分遊玩 UI 與編輯器，建立正式關卡選擇畫面
3. 以 Capacitor 在真實 Android 裝置測試
4. 加入 Google Play Billing 付費解鎖
