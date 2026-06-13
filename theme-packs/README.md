# Theme Packs 須知

主題包只管理「介面呈現」，不要放關卡資料或玩家進度。

每個主題包是一個資料夾，至少包含兩個檔案：

- `styles.css`：整套視覺樣式、色票、版面、元件狀態、動畫。
- `i18n.ts`：同一套 UI key 的文案字典，需包含 `zh-Hant`、`en`、`ja`。

目前主題包：

- `biolab`：目前啟用的生化實驗室主題。
- `soft-petri`：上一版柔光培養皿主題。
- `classic-infection`：更早的感染方塊原始主題快照。

## 更換主題包

主題包不會被程式動態載入。更換主題時，把目標主題包複製到 `src`：

```powershell
Copy-Item theme-packs\biolab\styles.css src\styles.css -Force
Copy-Item theme-packs\biolab\i18n.ts src\i18n.ts -Force
```

如果主題使用不同字型或瀏覽器 theme color，還要同步更新：

- `index.html`
- `editor.html`

例如 `biolab` 使用 Space Grotesk / Space Mono，所以兩個 HTML 都需要載入相同 Google Fonts，`theme-color` 也應改成主題背景色。

更換後執行：

```powershell
npm run build
```

如果是視覺改動，建議再跑一次 dev server 並檢查首頁、關卡選擇、遊玩中、成功彈窗、失敗彈窗、編輯器。

## 製作主題包

建議流程：

1. 先複製一個現有主題包。

```powershell
Copy-Item theme-packs\biolab theme-packs\new-theme -Recurse
```

2. 修改 `theme-packs\new-theme\styles.css`。
3. 修改 `theme-packs\new-theme\i18n.ts`。
4. 複製到 `src` 啟用並實測。
5. Build 通過後，再更新本 README 的「目前主題包」清單。

## i18n 規則

`i18n.ts` 必須保留目前程式使用的所有 key。不要只改中文，英文與日文也要符合主題語氣。

至少要檢查這三類文案：

- 導覽與選關：`appTitle`、`appSubtitle`、`screenPackages`、`levelSelect`、`freeLevel`、`paidLevel`
- 遊玩狀態：`seeds`、`start`、`readyToInfect`、`spreading`、`tooManySeeds`、`incomplete`
- 結算與編輯器：`completed`、`victoryTitle`、`failed`、`returnToLevel`、`editorTitle`、`toolRequired`、`toolBlocked`

`theme-packs/*/i18n.ts` 內的 import 會看起來像：

```ts
import type { Locale } from "./domain/types";
```

這是因為主題包會被複製到 `src/i18n.ts` 後才參與編譯；不要為了主題包資料夾本身改成相對 `../../src` 的路徑。

## styles.css 規則

主題包應優先沿用現有 class 名稱，避免改 TypeScript render code。

常見需要覆蓋的區塊：

- `:root`：色票、字型、圓角、陰影。
- `body`：背景與全域文字色。
- `button`、`.primary-action`、`.ghost-button`：按鈕狀態。
- `.package-card`、`.level-card`、`.play-panel`、`.play-status`：主要容器。
- `.grid`、`.cell` 與 `.cell.*`：盤面與格子狀態。
- `.result-dialog`、`.failure-dialog`：成功與失敗彈窗。
- `@media (max-width: 560px)`：手機遊玩版面。

避免在主題包中修改：

- 關卡資料：`src/data/sampleLevels.ts`
- 遊戲邏輯：`src/domain/*`
- 儲存與 Firestore 邏輯
- 玩家進度格式

## 驗收清單

更換或製作主題包後，至少確認：

- `npm run build` 通過。
- `src/styles.css` 和啟用的 `theme-packs/<name>/styles.css` 一致。
- `src/i18n.ts` 和啟用的 `theme-packs/<name>/i18n.ts` 一致。
- 中文、英文、日文都沒有舊主題詞彙殘留。
- 首頁、選關、遊玩、勝利、失敗、編輯器都能讀到文案。
- 手機寬度下按鈕文字不溢出，棋盤不擠壓操作列。

可用下列指令比對啟用檔與主題包：

```powershell
Compare-Object (Get-Content -Encoding UTF8 src\styles.css) (Get-Content -Encoding UTF8 theme-packs\biolab\styles.css)
Compare-Object (Get-Content -Encoding UTF8 src\i18n.ts) (Get-Content -Encoding UTF8 theme-packs\biolab\i18n.ts)
```

沒有輸出代表內容一致。
