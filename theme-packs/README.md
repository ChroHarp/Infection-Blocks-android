# Theme packs

Each theme pack is a replaceable pair of presentation files:

- `styles.css`: visual treatment, layout polish, palette, and component states.
- `i18n.ts`: user-facing copy for the same UI keys.

Current packs:

- `soft-petri`: the active soft petri dish theme.
- `classic-infection`: the previous infection/source wording and the pre-change stylesheet snapshot.

To swap a theme manually, copy the pack files over:

```powershell
Copy-Item theme-packs\soft-petri\styles.css src\styles.css -Force
Copy-Item theme-packs\soft-petri\i18n.ts src\i18n.ts -Force
```

Keep progress and level data separate from theme packs. Level data lives in `src/data/sampleLevels.ts`; player progress stays in local storage.
