import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, db } from "./config";
import { doc, setDoc, getDoc } from "firebase/firestore";

// 회원가입
export const signUp = async (email, password, userInfo) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // 프로필 업데이트
    await updateProfile(user, {
      displayName: userInfo.name,
    });

    // Firestore에 사용자 정보 저장
    await setDoc(doc(db, "users", user.uid), {
      name: userInfo.name,
      email: userInfo.email,
      phone: userInfo.phone,
      companyName: userInfo.companyName,
      businessNumber: userInfo.businessNumber,
      representative: userInfo.representative,
      companyAddress: userInfo.companyAddress,
      establishmentDate: userInfo.establishmentDate,
      businessType: userInfo.businessType,
      businessField: userInfo.businessField,
      managerName: userInfo.managerName,
      businessCertificateUrl: userInfo.businessCertificateUrl || null,
      isDocumentPending: userInfo.isDocumentPending || false,
      phoneVerified: userInfo.phoneVerified || false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return user;
  } catch (error) {
    throw error;
  }
};

// 로그인
export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

// 로그아웃
export const logOut = async () => {
  try {
    await signOut(auth);

    // 로컬 스토리지 클리어
    localStorage.removeItem("authData");
    localStorage.removeItem("isLoggedIn");
  } catch (error) {
    throw error;
  }
};

// 로컬 스토리지에서 인증 데이터 가져오기
export const getAuthDataFromStorage = () => {
  try {
    const authData = localStorage.getItem("authData");
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (authData && isLoggedIn === "true") {
      return JSON.parse(authData);
    }
    return null;
  } catch (error) {
    console.error("로컬 스토리지에서 인증 데이터 읽기 실패:", error);
    return null;
  }
};

// 로컬 스토리지에 인증 데이터 저장
export const saveAuthDataToStorage = async (user) => {
  try {
    // Firebase 토큰 가져오기
    const token = await user.getIdToken();

    // Firestore에서 사용자 상세 정보 가져오기 (실패해도 계속 진행)
    let userInfo = null;
    try {
      userInfo = await getUserInfo(user.uid);
    } catch (error) {
      console.warn("사용자 정보 가져오기 실패, 기본 정보로 진행:", error);
    }

    // 관리자 권한 확인
    const isAdmin = user.email === "admin@gmail.com";

    // 로컬 스토리지에 저장할 데이터 구성
    const authData = {
      token: token,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        emailVerified: user.emailVerified,
      },
      userInfo: userInfo, // null일 수 있음
      admin: isAdmin, // 관리자 권한 추가
      loginTime: new Date().toISOString(),
    };

    localStorage.setItem("authData", JSON.stringify(authData));
    localStorage.setItem("isLoggedIn", "true");

    return authData;
  } catch (error) {
    console.error("로컬 스토리지 저장 실패:", error);
    throw error;
  }
};

// 로그인 상태 확인
export const isUserLoggedIn = () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const authData = localStorage.getItem("authData");

  return isLoggedIn === "true" && authData !== null;
};

// 토큰 갱신
export const refreshAuthToken = async () => {
  try {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const newToken = await currentUser.getIdToken(true); // force refresh

      const authData = getAuthDataFromStorage();
      if (authData) {
        authData.token = newToken;
        authData.refreshTime = new Date().toISOString();
        localStorage.setItem("authData", JSON.stringify(authData));
        return newToken;
      }
    }
    return null;
  } catch (error) {
    console.error("토큰 갱신 실패:", error);
    throw error;
  }
};

// 사용자 정보 가져오기
export const getUserInfo = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      return null;
    }
  } catch (error) {
    console.warn("사용자 정보 가져오기 실패 (권한 없음):", error);
    // 권한 오류가 발생해도 null을 반환하여 로그인을 계속 진행할 수 있도록 함
    return null;
  }
};

// 인증 상태 변화 감지
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// 현재 사용자 토큰 가져오기
export const getCurrentUserToken = () => {
  const authData = getAuthDataFromStorage();
  return authData ? authData.token : null;
};

// 현재 사용자 정보 가져오기
export const getCurrentUser = () => {
  const authData = getAuthDataFromStorage();
  return authData ? authData.user : null;
};

// 현재 사용자 상세 정보 가져오기
export const getCurrentUserInfo = () => {
  const authData = getAuthDataFromStorage();
  return authData ? authData.userInfo : null;
};

// 로그인 시간 가져오기
export const getLoginTime = () => {
  const authData = getAuthDataFromStorage();
  return authData ? authData.loginTime : null;
};

// 관리자 권한 확인
export const isAdmin = () => {
  const authData = getAuthDataFromStorage();
  return authData ? authData.admin === true : false;
};

// 비밀번호 재설정 이메일 전송
export const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (error) {
    throw error;
  }
};
