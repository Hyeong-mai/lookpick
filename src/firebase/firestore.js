import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./config";

// 서비스 등록
export const createService = async (serviceData, userId) => {
  try {
    const docRef = await addDoc(collection(db, "services"), {
      ...serviceData,
      userId: userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: "pending", // pending, active, rejected
      views: 0,
    });
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

// 서비스 목록 가져오기 (사용자별)
export const getUserServices = async (userId) => {
  try {
    const q = query(
      collection(db, "services"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    const services = [];
    querySnapshot.forEach((doc) => {
      services.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    return services;
  } catch (error) {
    throw error;
  }
};

// 모든 서비스 가져오기 (공개용)
export const getAllServices = async () => {
  try {
    const q = query(
      collection(db, "services"),
      where("status", "==", "active"),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    const services = [];
    querySnapshot.forEach((doc) => {
      services.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    return services;
  } catch (error) {
    throw error;
  }
};

// 카테고리별 서비스 가져오기
export const getServicesByCategory = async (categoryId) => {
  try {
    const q = query(
      collection(db, "services"),
      where("categories", "array-contains", categoryId),
      where("status", "==", "active"),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    const services = [];
    querySnapshot.forEach((doc) => {
      services.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    return services;
  } catch (error) {
    throw error;
  }
};

// 서비스 상세 정보 가져오기
export const getService = async (serviceId) => {
  try {
    const docRef = doc(db, "services", serviceId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      };
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

// 서비스 업데이트
export const updateService = async (serviceId, serviceData) => {
  try {
    const docRef = doc(db, "services", serviceId);
    await updateDoc(docRef, {
      ...serviceData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    throw error;
  }
};

// 서비스 삭제
export const deleteService = async (serviceId) => {
  try {
    await deleteDoc(doc(db, "services", serviceId));
  } catch (error) {
    throw error;
  }
};

// 서비스 조회수 증가
export const incrementServiceViews = async (serviceId) => {
  try {
    const docRef = doc(db, "services", serviceId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const currentViews = docSnap.data().views || 0;
      await updateDoc(docRef, {
        views: currentViews + 1,
      });
    }
  } catch (error) {
    throw error;
  }
};

// 사용자 정보 업데이트
export const updateUserInfo = async (userId, userInfo) => {
  try {
    const docRef = doc(db, "users", userId);
    await updateDoc(docRef, {
      ...userInfo,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    throw error;
  }
};
