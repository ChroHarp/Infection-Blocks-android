# Cleanup Recovery

This cleanup only removes files that were unused by the Vite app or duplicated
elsewhere in the repo.

To restore the removed prototype or preview artifacts from the parent commit:

```powershell
git checkout HEAD^ -- infection-blocks.html tmp theme-packs/soft-petri/assets-draft
```

To restore the removed React Vite plugin dependency:

```powershell
npm install @vitejs/plugin-react
```

To undo the whole cleanup commit:

```powershell
git revert HEAD
```
