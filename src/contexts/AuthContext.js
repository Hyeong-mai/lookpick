import React, { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChange, getUserInfo } from "../firebase/auth";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth는 AuthProvider 내부에서 사용되어야 합니다");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      setCurrentUser(user);

      if (user) {
        try {
          const userData = await getUserInfo(user.uid);
          setUserInfo(userData);
        } catch (error) {
          console.error("사용자 정보 가져오기 실패:", error);
          setUserInfo(null);
        }
      } else {
        setUserInfo(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const updateUserInfo = (newUserInfo) => {
    setUserInfo(newUserInfo);
  };

  const value = {
    currentUser,
    userInfo,
    loading,
    updateUserInfo,
    isLoggedIn: !!currentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
