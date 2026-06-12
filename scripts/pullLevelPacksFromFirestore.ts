import { writeFile } from "node:fs/promises";
import { initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore, orderBy, query } from "firebase/firestore";
import type { LevelPack } from "../src/domain/types";
import { fromFirestoreLevelPack, type FirestoreLevelPack } from "../src/levelPackFirestoreFormat";

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};

const missingConfig = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingConfig.length > 0) {
  throw new Error(`Missing Firebase config values: ${missingConfig.join(", ")}`);
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const snapshot = await getDocs(query(collection(db, "levelPacks"), orderBy("order", "asc")));

const packs = snapshot.docs
  .map((doc) => normalizePack(doc.id, doc.data() as FirestoreLevelPack))
  .sort((a, b) => a.order - b.order);

if (packs.length === 0) {
  throw new Error("No level packs found in Firestore collection: levelPacks");
}

const source = `import type { Level, LevelPack } from "../domain/types";

export const sampleLevelPacks: LevelPack[] = ${JSON.stringify(packs, null, 2)};

export const sampleLevels: Level[] = sampleLevelPacks
  .flatMap((pack) => pack.levels)
  .sort((a, b) => a.order - b.order);
`;

await writeFile("src/data/sampleLevels.ts", source, "utf8");

for (const pack of packs) {
  console.log(`Pulled ${pack.id} (${pack.levels.length} levels, ${pack.status ?? "no-status"})`);
}

function normalizePack(id: string, data: FirestoreLevelPack): LevelPack {
  const pack = fromFirestoreLevelPack({
    ...data,
    id: data.id ?? id,
    levels: data.levels ?? []
  });

  return {
    id: pack.id,
    order: pack.order,
    titleKey: pack.titleKey,
    access: pack.access,
    ...(pack.status ? { status: pack.status } : {}),
    ...(pack.purchaseId ? { purchaseId: pack.purchaseId } : {}),
    ...(pack.unlockAfterPackId ? { unlockAfterPackId: pack.unlockAfterPackId } : {}),
    levels: pack.levels.map((level) => ({
      id: level.id,
      packId: level.packId,
      order: level.order,
      titleKey: level.titleKey,
      rows: level.rows,
      cols: level.cols,
      maxSeeds: level.maxSeeds,
      free: level.free,
      stars: level.stars,
      holes: level.holes,
      requiredSeeds: level.requiredSeeds,
      blockedSeeds: level.blockedSeeds
    }))
  };
}
