import type { FirebaseApp } from "firebase/app";
import type { LevelPack, LevelPackStatus } from "./domain/types";
import { getFirebaseConfig } from "./firebaseConfig";
import { fromFirestoreLevelPack, toFirestoreLevelPack, type FirestoreLevelPack } from "./levelPackFirestoreFormat";

export async function loadPublishedLevelPacksFromFirestore(): Promise<LevelPack[]> {
  const { collection, getDocs, getFirestore } = await import("firebase/firestore");
  const db = getFirestore(await getFirebaseApp());
  const snapshot = await getDocs(collection(db, "levelPacks"));

  return snapshot.docs
    .map((doc) => normalizeFirestorePack(doc.id, doc.data() as FirestoreLevelPack))
    .filter((pack) => pack.status !== "draft")
    .sort((a, b) => a.order - b.order);
}

export async function loadStudentDraftPacksFromFirestore(): Promise<LevelPack[]> {
  const { collectionGroup, getDocs, getFirestore } = await import("firebase/firestore");
  const app = await getFirebaseApp();
  await signInTeacherWithGoogle(app);
  const db = getFirestore(app);
  const snapshot = await getDocs(collectionGroup(db, "packs"));

  return snapshot.docs
    .map((doc) => normalizeFirestorePack(doc.id, doc.data() as FirestoreLevelPack))
    .filter((pack) => pack.status === "draft")
    .sort((a, b) => a.order - b.order);
}

function normalizeFirestorePack(id: string, data: FirestoreLevelPack): LevelPack {
  return fromFirestoreLevelPack({
    ...data,
    id: data.id ?? id,
    levels: data.levels ?? []
  });
}

export async function saveLevelPackToFirestore(pack: LevelPack, status: LevelPackStatus): Promise<void> {
  if (status === "draft") {
    await saveStudentDraftToFirestore(pack);
    return;
  }

  await savePublishedPacks([pack]);
}

export async function saveLevelPacksToFirestore(packs: LevelPack[]): Promise<void> {
  await savePublishedPacks(packs);
}

async function savePublishedPacks(packs: LevelPack[]): Promise<void> {
  const app = await getFirebaseApp();
  await signInTeacherWithGoogle(app);
  const { doc, getFirestore, serverTimestamp, setDoc } = await import("firebase/firestore");
  const db = getFirestore(app);

  for (const pack of packs) {
    await setDoc(
      doc(db, "levelPacks", pack.id),
      {
        ...stripUndefined(toFirestoreLevelPack(pack)),
        status: "published",
        updatedAt: serverTimestamp(),
        publishedAt: pack.publishedAt ?? serverTimestamp()
      },
      { merge: true }
    );
  }
}

async function saveStudentDraftToFirestore(pack: LevelPack): Promise<void> {
  const [{ getAuth, signInAnonymously }, { doc, getFirestore, serverTimestamp, setDoc }] = await Promise.all([
    import("firebase/auth"),
    import("firebase/firestore")
  ]);

  const app = await getFirebaseApp();
  const auth = getAuth(app);
  // ponytail: anonymous auth keeps the student flow tiny; upgrade to Google/Classroom login when drafts must follow students across devices.
  const user = auth.currentUser ?? (await signInAnonymously(auth)).user;
  const db = getFirestore(app);

  await setDoc(
    doc(db, "studentDrafts", user.uid, "packs", firestoreDocId(pack.id)),
    {
      ...stripUndefined(toFirestoreLevelPack(pack)),
      status: "draft",
      ownerUid: user.uid,
      updatedAt: serverTimestamp(),
      publishedAt: null
    },
    { merge: true }
  );
}

async function signInTeacherWithGoogle(app: FirebaseApp): Promise<void> {
  const { getAuth, GoogleAuthProvider, signInWithPopup } = await import("firebase/auth");
  const auth = getAuth(app);

  if (auth.currentUser && !auth.currentUser.isAnonymous) return;

  await signInWithPopup(auth, new GoogleAuthProvider());
}

async function getFirebaseApp(): Promise<FirebaseApp> {
  const { initializeApp, getApps } = await import("firebase/app");
  return getApps().length > 0 ? getApps()[0] : initializeApp(getFirebaseConfig());
}

export function stripUndefined<T>(value: T): T {
  if (Array.isArray(value)) return value.map((item) => stripUndefined(item)) as T;
  if (!value || typeof value !== "object") return value;

  return Object.fromEntries(
    Object.entries(value)
      .filter(([, entryValue]) => entryValue !== undefined)
      .map(([key, entryValue]) => [key, stripUndefined(entryValue)])
  ) as T;
}

export function firestoreDocId(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "custom";
  return trimmed.replaceAll("/", "-");
}


