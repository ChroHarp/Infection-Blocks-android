import type { LevelPack, LevelPackStatus } from "./domain/types";
import { getFirebaseConfig } from "./firebaseConfig";
import { toFirestoreLevelPack } from "./levelPackFirestoreFormat";

export async function saveLevelPackToFirestore(pack: LevelPack, status: LevelPackStatus): Promise<void> {
  const [{ initializeApp, getApps }, { doc, getFirestore, serverTimestamp, setDoc }] = await Promise.all([
    import("firebase/app"),
    import("firebase/firestore")
  ]);

  const app = getApps().length > 0 ? getApps()[0] : initializeApp(getFirebaseConfig());
  const db = getFirestore(app);
  const publishedAt = status === "published" ? serverTimestamp() : pack.publishedAt ?? null;

  await setDoc(
    doc(db, "levelPacks", pack.id),
    {
      ...pack,
      ...toFirestoreLevelPack(pack),
      status,
      updatedAt: serverTimestamp(),
      publishedAt
    },
    { merge: true }
  );
}
