# Infection Blocks 工作流程

## 關卡資料的來源與優先順序

- 玩家內建關卡來源是 `src/data/sampleLevels.ts`；不要只改資料庫而不改此檔。
- 編輯器會讀取 Firestore 已發布的 `levelPacks`；同 ID 的資料庫關卡包會覆蓋內建版本。修改既有關卡包時，必須同步兩邊。
- 既有玩家進度以關卡 ID 為鍵。保留既有 `pack.id`、`level.id` 與舊關卡，除非需求明確要求移除或改名；「改顯示名稱」只改 `titleKey`，不要改 ID。

## 新增關卡與培養包

1. 先確認來源素材中的分節；每一節對應一個培養包，新增資料放在 `src/data/presentationLevelPacks.ts`。
2. 維持固定且可讀的包 ID、關卡 ID、`order`，並為每一關提供可驗證的解法。不要覆蓋舊包來騰出排序。
3. 星等門檻依 `docs/level-generator-theory.md`：三星為盤面外周長除以 4、向上取整；二星 +1；一星 +2；`maxSeeds` 等於一星門檻。
4. 把新增關卡的棋盤、門檻與解法加入 `presentationLevelPacks.test.ts`，以 `runInfection` 驗證每關可用三星解法通關。
5. 若需求是跨包移動關卡，保留原關卡 ID 和全域 `order`，只改 `packId` 與所屬包的 `levels`；同時以測試確認來源包及目標包的關卡數量與 ID。
6. 目前特殊配置：`generalized-cross-2-09` 到 `generalized-cross-2-16` 已移至 `world-2`；`generalized-cross-2` 保留 01–08。舊 `generalized-cross` 顯示名稱為 `Cross`，必須保留其原始 10 關。

## 免費、進階與解鎖：目前實際行為

- `level.free: true`：關卡立即開放。`LevelPack.access: "free"` 是培養包的資料／顯示設定。
- `level.free: false`：畫面顯示「進階」，解鎖條件是完成全域排序中的前一關；不檢查星等。第 1 關永遠開放。
- 培養包能否點入，取決於其第一關能否開放。沒有「前一包累積星數」的條件。
- `purchaseId` 沒有付款或購買驗證功能；`unlockAfterPackId` 目前也沒有接到解鎖判斷。不要宣稱已實作收費或包別前置解鎖。
- 要讓全遊戲免費，必須同時讓每個包 `access: "free"`，且每個關卡 `free: true`。目前所有包與關卡皆為免費。

## 驗證、資料庫與發布

1. 本機修改後執行 `npm test` 與 `npm run build`。
2. 使用 `npm run firebase:verify-levels` 讀取 Firestore，核對發布包的數量、狀態和特殊搬移規則。
3. 寫入 Firestore 需要已登入的 Firebase CLI 身分；普通網頁 SDK 在此專案環境可能沒有寫入權限。寫入前確認目標 pack ID 與欄位，寫入後重新讀取驗證。
4. Netlify 正式發佈前須先完成測試和建置，然後執行 `npx netlify deploy --prod`。目前連結站點為 `infection-blocks-player-test`。
5. 不要提交 `.env.local` 或任何 Firebase／Netlify 憑證。
