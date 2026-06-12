import { initializeApp } from "firebase/app";
import { doc, getFirestore, serverTimestamp, setDoc } from "firebase/firestore";
import { sampleLevelPacks } from "../src/data/sampleLevels";
import { toFirestoreLevelPack } from "../src/levelPackFirestoreFormat";

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

for (const pack of sampleLevelPacks) {
  await setDoc(
    doc(db, "levelPacks", pack.id),
    {
      ...toFirestoreLevelPack(pack),
      status: "published",
      updatedAt: serverTimestamp(),
      publishedAt: serverTimestamp()
    },
    { merge: true }
  );

  console.log(`Published ${pack.id} (${pack.levels.length} levels)`);
}
