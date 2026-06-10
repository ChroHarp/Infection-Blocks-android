# Android Release Plan

This project is structured as a Vite web app first, then packaged for Android with Capacitor.

## Current MVP Scope

- Offline level packs.
- Local progress storage.
- Traditional Chinese, English, and Japanese UI strings through one shared i18n dictionary.
- Star rating is configured by which thresholds are filled in. Fill only 3 stars for `3 stars / fail`, fill 3 and 2 stars for `3 stars / 2 stars / fail`, or fill all three thresholds for `3 / 2 / 1 / fail`.
- No account system.
- No database.
- No custom server.
- Monetization target: free early levels, paid unlock later.

## When Backend Becomes Necessary

Do not add a backend for the first prototype. Add a hosted service such as Firebase only when one of these becomes real:

- cloud save across devices;
- leaderboards;
- daily levels;
- analytics-driven remote configuration;
- player-created levels;
- receipt validation for more complex purchases.

For the first paid unlock, prefer Google Play Billing on Android. Keep the unlocked state cached locally, and add server-side receipt validation only if abuse becomes a practical issue.

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
