import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  getCurrentUser,
  getCurrentUserInfo,
  isUserLoggedIn,
  getUserInfo,
} from "../firebase/auth";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

// MyPage 컴포넌트들 import
import MyPageSidebar from "../components/mypage/MyPageSidebar";
import ProfileSection from "../components/mypage/ProfileSection";
import MyPostsList from "../components/mypage/MyPostsList";
import PostModal from "../components/mypage/PostModal";
import NotificationModal from "../components/common/NotificationModal";

const MyPageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  min-height: 80vh;

  @media (max-width: 768px) {
    padding: 20px 16px;
  }

  @media (max-width: 480px) {
    padding: 16px 12px;
  }
`;

const PageHeader = styled.div`
  margin-bottom: 40px;

  @media (max-width: 768px) {
    margin-bottom: 24px;
    text-align: center;
  }

  h1 {
    background: ${(props) => props.theme.gradients.primary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: ${(props) => props.theme.spacing.sm};
    font-size: 2.5rem;

    @media (max-width: 768px) {
      font-size: 2rem;
    }

    @media (max-width: 480px) {
      font-size: 1.75rem;
    }
  }

  p {
    color: ${(props) => props.theme.colors.gray[600]};
    font-size: 1.1rem;

    @media (max-width: 768px) {
      font-size: 1rem;
    }

    @media (max-width: 480px) {
      font-size: 0.9rem;
    }
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 30px;

  @media (max-width: 1024px) {
    grid-template-columns: 200px 1fr;
    gap: 24px;
  }

  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  @media (max-width: 480px) {
    gap: 16px;
  }
`;

const MainContent = styled.div`
  background-color: white;
  border-radius: ${(props) => props.theme.borderRadius.md};
  box-shadow: ${(props) => props.theme.shadows.md};
  padding: 30px;

  @media (max-width: 768px) {
    padding: 24px;
    border-radius: 12px;
  }

  @media (max-width: 480px) {
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: ${(props) => props.theme.colors.gray[600]};

  @media (max-width: 768px) {
    padding: 40px 16px;
  }

  @media (max-width: 480px) {
    padding: 32px 12px;
  }

  h3 {
    margin-bottom: 10px;
    font-size: 1.5rem;

    @media (max-width: 768px) {
      font-size: 1.3rem;
    }

    @media (max-width: 480px) {
      font-size: 1.2rem;
    }
  }

  p {
    margin: 0;
    font-size: 0.9rem;

    @media (max-width: 480px) {
      font-size: 0.85rem;
    }
  }
`;

const MyPage = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
    companyName: "",
    businessNumber: "",
    representative: "",
    companyAddress: "",
    businessType: "",
    businessField: "",
    managerName: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [posts, setPosts] = useState([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);

  const [selectedPost, setSelectedPost] = useState(null);
  const [modalType, setModalType] = useState(null); // 'preview', 'delete'
  const [notificationModal, setNotificationModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
    onConfirm: null,
    showCancel: false,
  });

  // 메뉴 아이템
  const menuItems = [
    { id: "posts", label: "게시물 관리" },
    { id: "settings", label: "계정 설정" },
  ];

  // Firebase에서 사용자 정보 로드
  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        if (!isUserLoggedIn()) {
          console.log("로그인되지 않은 사용자");
          setIsLoading(false);
          return;
        }

        const currentUser = getCurrentUser();
        const currentUserInfo = getCurrentUserInfo();

        if (currentUser && currentUserInfo) {
          console.log("로컬 스토리지에서 사용자 정보 로드:", currentUserInfo);
          setUserInfo({
            name: currentUserInfo.name || "",
            email: currentUser.email || "",
            phone: currentUserInfo.phone || "",
            companyName: currentUserInfo.companyName || "",
            businessNumber: currentUserInfo.businessNumber || "",
            representative: currentUserInfo.representative || "",
            companyAddress: currentUserInfo.companyAddress || "",
            businessType: currentUserInfo.businessType || "",
            businessField: currentUserInfo.businessField || "",
            managerName: currentUserInfo.managerName || "",
          });
        } else {
          console.log("로컬 스토리지에 정보가 없어서 Firestore에서 다시 로드");
          const freshUserInfo = await getUserInfo(currentUser?.uid);
          if (freshUserInfo) {
            setUserInfo({
              name: freshUserInfo.name || "",
              email: currentUser?.email || "",
              phone: freshUserInfo.phone || "",
              companyName: freshUserInfo.companyName || "",
              businessNumber: freshUserInfo.businessNumber || "",
              representative: freshUserInfo.representative || "",
              companyAddress: freshUserInfo.companyAddress || "",
              businessType: freshUserInfo.businessType || "",
              businessField: freshUserInfo.businessField || "",
              managerName: freshUserInfo.managerName || "",
            });
          }
        }
      } catch (error) {
        console.error("사용자 정보 로드 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserInfo();
  }, []);

  // Firebase에서 사용자의 서비스 목록 로드
  const loadUserPosts = async () => {
    if (!isUserLoggedIn()) return;

    setIsLoadingPosts(true);
    try {
      const currentUser = getCurrentUser();
      if (!currentUser) return;

      console.log("사용자 서비스 목록 로드 중...");

      const servicesQuery = query(
        collection(db, "services"),
        where("userId", "==", currentUser.uid),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(servicesQuery);
      const userPosts = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        userPosts.push({
          id: doc.id,
          serviceName: data.serviceName,
          companyWebsite: data.companyWebsite,
          companyLogo: data.companyLogo || null, // 회사 로고 추가
          price: data.price,
          pricingOptions: data.pricingOptions || [], // 가격 옵션 추가
          isPricingOptional: data.isPricingOptional,
          serviceRegion: data.serviceRegion,
          serviceDescription: data.serviceDescription,
          categories: data.categories || [],
          subcategories: data.subcategories || [],
          tags: data.tags || [],
          files: data.files || [],
          thumbnail: data.thumbnail || null, // 썸네일 추가
          uploadMethod: data.uploadMethod || "upload", // 업로드 방식 추가
          directContent: data.directContent || "", // 직접 작성 콘텐츠 추가
          freePostContent: data.freePostContent,
          // 담당자 정보 추가
          contactName: data.contactName || "",
          contactPosition: data.contactPosition || "",
          contactPhone: data.contactPhone || "",
          contactEmail: data.contactEmail || "",
          status: data.status || "pending",
          createdAt: data.createdAt?.toDate
            ? data.createdAt.toDate().toLocaleDateString()
            : "Unknown",
          views: data.views || 0,
          userId: data.userId,
        });
      });

      console.log("로드된 서비스 목록:", userPosts);
      setPosts(userPosts);
    } catch (error) {
      console.error("서비스 목록 로드 실패:", error);
    } finally {
      setIsLoadingPosts(false);
    }
  };

  // 게시물 관리 탭을 선택했을 때 서비스 목록 로드
  useEffect(() => {
    if (activeTab === "posts" && isUserLoggedIn()) {
      loadUserPosts();
    }
  }, [activeTab]);

  // 모달 관련 함수들
  const openModal = (type, post) => {
    setModalType(type);
    setSelectedPost(post);
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedPost(null);
  };

  const handleDeleteSuccess = (deletedPostId) => {
    // 삭제된 게시물을 목록에서 제거
    setPosts((prevPosts) =>
      prevPosts.filter((post) => post.id !== deletedPostId)
    );
  };

  // 유틸리티 함수들
  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "심사중";
      case "approved":
        return "승인됨";
      case "rejected":
        return "거절됨";
      default:
        return "알 수 없음";
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "posts":
        return (
          <MyPostsList
            posts={posts}
            isLoadingPosts={isLoadingPosts}
            openModal={openModal}
            getStatusText={getStatusText}
          />
        );

      case "settings":
        return (
          <ProfileSection
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            isSaving={isSaving}
            setIsSaving={setIsSaving}
            showNotification={(title, message, type) => 
              setNotificationModal({
                isOpen: true,
                title,
                message,
                type,
                onConfirm: null,
                showCancel: false,
              })
            }
          />
        );

      default:
        return (
          <div>
            <h2>준비 중</h2>
            <p>해당 기능은 준비 중입니다.</p>
          </div>
        );
    }
  };

  return (
    <MyPageContainer>
      <PageHeader>
        <h1>마이페이지</h1>
        <p>게시물과 계정 정보를 관리할 수 있습니다.</p>
      </PageHeader>

      {isLoading ? (
        <LoadingContainer>
          <h3>사용자 정보를 불러오는 중...</h3>
          <p>잠시만 기다려주세요.</p>
        </LoadingContainer>
      ) : !isUserLoggedIn() ? (
        <LoadingContainer>
          <h3>로그인이 필요합니다</h3>
          <p>마이페이지를 이용하려면 로그인해주세요.</p>
        </LoadingContainer>
      ) : (
        <ContentGrid>
          <MyPageSidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            menuItems={menuItems}
          />
          <MainContent>{renderContent()}</MainContent>
        </ContentGrid>
      )}

      <PostModal
        modalType={modalType}
        selectedPost={selectedPost}
        closeModal={closeModal}
        onDeleteSuccess={handleDeleteSuccess}
      />
      
      <NotificationModal
        isOpen={notificationModal.isOpen}
        onClose={() => setNotificationModal(prev => ({ ...prev, isOpen: false }))}
        title={notificationModal.title}
        message={notificationModal.message}
        type={notificationModal.type}
        onConfirm={notificationModal.onConfirm}
        showCancel={notificationModal.showCancel}
      />
    </MyPageContainer>
  );
};

export default MyPage;
