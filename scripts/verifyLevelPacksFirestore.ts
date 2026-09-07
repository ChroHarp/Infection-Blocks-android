import { initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore, orderBy, query } from "firebase/firestore";

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
const expectedLevelPacks = new Map([
  ["world-2", 10],
  ["generalized-cross", 10],
  ["stairs", 8],
  ["two-ways", 7],
  ["three-ways", 9],
  ["generalized-cross-2", 8]
]);

if (snapshot.empty) {
  throw new Error("No level packs found in Firestore collection: levelPacks");
}

const firstPack = snapshot.docs[0];
const firstPackData = firstPack.data();
const levelCount = Array.isArray(firstPackData.levels) ? firstPackData.levels.length : 0;

if (!firstPackData.id || levelCount === 0) {
  throw new Error(`Invalid level pack document: ${firstPack.id}`);
}

console.log(`Read ${snapshot.size} level packs; first is ${firstPack.id} (${levelCount} levels)`);
for (const pack of snapshot.docs) {
  const data = pack.data();
  const levels = Array.isArray(data.levels) ? data.levels.length : 0;
  console.log(`${pack.id}: ${levels} levels (${data.status ?? "no-status"})`);

  const expectedLevelCount = expectedLevelPacks.get(pack.id);
  if (expectedLevelCount !== undefined && (levels !== expectedLevelCount || data.status !== "published")) {
    throw new Error(`Unexpected published data for ${pack.id}`);
  }
}

const publishedIds = new Set(snapshot.docs.map((pack) => pack.id));
for (const packId of expectedLevelPacks.keys()) {
  if (!publishedIds.has(packId)) throw new Error(`Missing published level pack: ${packId}`);
}

const movedIds = Array.from({ length: 8 }, (_, index) => `generalized-cross-2-${String(index + 9).padStart(2, "0")}`);
const world2 = snapshot.docs.find((pack) => pack.id === "world-2")?.data();
const generalizedCross2 = snapshot.docs.find((pack) => pack.id === "generalized-cross-2")?.data();
const world2Ids = new Set(Array.isArray(world2?.levels) ? world2.levels.map((level) => level.id) : []);
const remainingGeneralizedCross2Ids = new Set(
  Array.isArray(generalizedCross2?.levels) ? generalizedCross2.levels.map((level) => level.id) : []
);

if (!movedIds.every((id) => world2Ids.has(id) && !remainingGeneralizedCross2Ids.has(id))) {
  throw new Error("generalized-cross-2 levels 09 through 16 were not moved exclusively into world-2");
}
