# Android Release Plan

This project is structured as a Vite web app first, then packaged for Android with Capacitor.

## Current MVP Scope

- Offline level packs.
- Local progress storage.
- Traditional Chinese, English, and Japanese UI strings through one shared i18n dictionary.
- Star rating is configured by which thresholds are filled in. Fill only 3 stars for `3 stars / fail`, fill 3 and 2 stars for `3 stars / 2 stars / fail`, or fill all three thresholds for `3 / 2 / 1 / fail`.
- No account system.
- No player-facing database calls.
- No custom server.
- Monetization target: free early levels, paid unlock later.

## Editor and Player App Split

The project should be treated as two products that share game rules and level types:

- Player app: packaged with Capacitor for Android, reads bundled level data, and should not call Firestore at runtime for the current MVP.
- Level editor: internal web tool for editing level packs and saving drafts/published data to Firestore.

Local entry points:

- Player app: `http://127.0.0.1:5173/`
- Editor: `http://127.0.0.1:5173/editor.html`

During early development the editor can remain open. Before sharing it broadly, add Google sign-in and restrict writes by allowed Gmail accounts in Firestore Security Rules.

Recommended data flow:

1. Edit level packs in the editor.
2. Save draft or published level pack documents to Firestore.
3. Before release, run a sync/export step that reads published packs from Firestore.
4. Generate source-controlled bundled data under `src/data/`.
5. Build the Android player app from bundled data.

This keeps the first Android app offline and deterministic while still giving the editor proper cloud persistence.

Firestore collection:

- `levelPacks/{packId}` stores one package document.
- Each document should use `status: "draft" | "published"`.
- Coordinates are stored as objects like `{ "row": 1, "col": 2 }` because Firestore does not support nested arrays.
- Development Security Rules must include `levelPacks`; opening only another collection such as `audience_votes` will not allow editor writes.

Development-only Firestore rule example:

```text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /levelPacks/{doc} {
      allow read, write: if true;
    }
  }
}
```

Tighten this with Google sign-in before sharing the editor outside your own development environment.

Developer sync command:

```bash
npm run firebase:push-levels
```

This pushes the local bundled `sampleLevelPacks` to Firestore as `published` documents. Firestore Security Rules must allow the current client to write during development, or this command will fail with `PERMISSION_DENIED`.

## When Player Backend Becomes Necessary

Do not add runtime Firestore calls to the player app for the first prototype. Add a player-facing backend only when one of these becomes real:

- cloud save across devices;
- leaderboards;
- daily levels;
- analytics-driven remote configuration;
- player-created levels;
- receipt validation for more complex purchases.

For the first paid unlock, prefer Google Play Billing on Android. Keep the unlocked state cached locally, and add server-side receipt validation only if abuse becomes a practical issue.

## Level Pack Format

Level unlocks and monetization should be controlled at package level. The local bundled data exports packages first, then can flatten levels for older UI code.

```json
{
  "id": "world-1",
  "order": 1,
  "titleKey": "pack.world1",
  "access": "free",
  "levels": []
}
```

- `access`: `free`, `paid`, or `conditional`.
- `purchaseId`: optional product id for paid packages, such as `unlock_full_game`.
- `unlockAfterPackId`: optional package dependency for conditional unlocks.
- `levels`: the level objects in this package.

## Level Format

Use JSON as the source of truth. The level input screen can export this format:

```json
{
  "id": "world-1-01",
  "packId": "world-1",
  "order": 1,
  "titleKey": "level.world1.01",
  "rows": 10,
  "cols": 7,
  "maxSeeds": 8,
  "free": true,
  "stars": {
    "three": 5,
    "two": 8,
    "one": null
  },
  "holes": [],
  "requiredSeeds": [],
  "blockedSeeds": []
}
```

- `holes`: cells that do not exist and do not need infection.
- `requiredSeeds`: blue cells that must be selected as initial infection sources.
- `blockedSeeds`: green cells that cannot be selected initially, but must be infected by the spread.
- `stars.three`: the 3-star seed limit.
- `stars.two`: the 2-star seed limit, or `null` when there is no 2-star tier.
- `stars.one`: the 1-star seed limit, or `null` when there is no 1-star tier.
- `maxSeeds`: cached lowest passing threshold for store/runtime convenience. The editor keeps it synchronized with the filled thresholds.

## Android Build Steps

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run local development:

   ```bash
   npm run dev
   ```

3. Build web assets:

   ```bash
   npm run build
   ```

4. Initialize Android once:

   ```bash
   npm run android:init
   ```

5. Sync future web changes into Android:

   ```bash
   npm run android:sync
   ```

6. Open Android Studio:

   ```bash
   npm run android:open
   ```

7. Build an Android App Bundle from Android Studio for Google Play.

## Store Readiness Checklist

- App name and icon.
- Feature graphic and screenshots.
- Privacy policy URL, even if the first build stores only local data.
- Content rating questionnaire.
- Closed testing track.
- Payment disclosure for paid level unlocks.
- Target SDK checked against current Google Play requirements before release.
