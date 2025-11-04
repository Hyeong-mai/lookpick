import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
import { getFunctions } from "firebase/functions";

// Firebase 설정 정보 - 환경 변수에서 가져오기
const firebaseConfig = {
  apiKey:
    process.env.REACT_APP_FIREBASE_API_KEY ||
    "AIzaSyBOMFwPIkTeMua-6PWH3XEEDQ9yX9mS-UE",
  authDomain:
    process.env.REACT_APP_FIREBASE_AUTH_DOMAIN ||
    "lookpick-d1f95.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "lookpick-d1f95",
  storageBucket:
    process.env.REACT_APP_FIREBASE_STORAGE_BUCKET ||
    "lookpick-d1f95.firebasestorage.app",
  messagingSenderId:
    process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "4631088103",
  appId:
    process.env.REACT_APP_FIREBASE_APP_ID ||
    "1:4631088103:web:561305838576e0ef988b42",
  measurementId:
    process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-QG040NHGTN",
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);

// Firebase 서비스 인스턴스 생성
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

// Analytics (브라우저 환경에서만 초기화)
export const analytics =
  typeof window !== "undefined" ? getAnalytics(app) : null;

export default app;
