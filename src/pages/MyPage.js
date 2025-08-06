import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  getCurrentUser,
  getCurrentUserInfo,
  isUserLoggedIn,
  getUserInfo,
} from "../firebase/auth";
import {
  doc,
  updateDoc,
  collection,
  query,
  where,
  orderBy,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { deleteServiceFiles } from "../firebase/storage";

const MyPageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  min-height: 80vh;
`;

const PageHeader = styled.div`
  margin-bottom: 40px;

  h1 {
    color: ${(props) => props.theme.colors.dark};
    margin-bottom: ${(props) => props.theme.spacing.sm};
  }

  p {
    color: ${(props) => props.theme.colors.gray[600]};
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 30px;

  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.div`
  background-color: white;
  border-radius: ${(props) => props.theme.borderRadius.md};
  box-shadow: ${(props) => props.theme.shadows.md};
  padding: 20px;
  height: fit-content;
`;

const SidebarMenu = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const MenuItem = styled.li`
  margin-bottom: 10px;
`;

const MenuButton = styled.button`
  width: 100%;
  text-align: left;
  padding: 12px;
  border: none;
  border-radius: ${(props) => props.theme.borderRadius.sm};
  background-color: ${(props) =>
    props.active ? props.theme.colors.primary : "transparent"};
  color: ${(props) => (props.active ? "white" : props.theme.colors.dark)};
  cursor: pointer;
  font-weight: ${(props) => (props.active ? "bold" : "normal")};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) =>
      props.active ? props.theme.colors.primary : props.theme.colors.gray[100]};
  }
`;

const MainContent = styled.div`
  background-color: white;
  border-radius: ${(props) => props.theme.borderRadius.md};
  box-shadow: ${(props) => props.theme.shadows.md};
  padding: 30px;
`;

const SectionTitle = styled.h2`
  margin-bottom: 20px;
  border-bottom: 2px solid ${(props) => props.theme.colors.gray[200]};
  padding-bottom: 10px;
  color: ${(props) => props.theme.colors.dark};
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;

  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: ${(props) => props.theme.colors.dark};
    font-size: 0.9rem;
  }

  input {
    width: 100%;
    padding: 12px;
    border: 1px solid ${(props) => props.theme.colors.gray[300]};
    border-radius: ${(props) => props.theme.borderRadius.md};
    font-size: 16px;
    transition: border-color 0.2s ease;

    &:focus {
      border-color: ${(props) => props.theme.colors.primary};
      outline: none;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    &:disabled {
      background-color: ${(props) => props.theme.colors.gray[100]};
      cursor: not-allowed;
    }
  }

  select {
    width: 100%;
    padding: 12px;
    border: 1px solid ${(props) => props.theme.colors.gray[300]};
    border-radius: ${(props) => props.theme.borderRadius.md};
    font-size: 16px;
    background-color: white;
    cursor: pointer;
    transition: border-color 0.2s ease;

    &:focus {
      border-color: ${(props) => props.theme.colors.primary};
      outline: none;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
  }
`;

const SaveButton = styled.button`
  padding: 12px 24px;
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${(props) => props.theme.borderRadius.md};
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${(props) => props.theme.colors.primaryDark};
  }

  &:disabled {
    background-color: ${(props) => props.theme.colors.gray[300]};
    cursor: not-allowed;
  }
`;

// 게시물 관리 관련 스타일
const PostsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const AddPostButton = styled.button`
  padding: 10px 20px;
  background-color: ${(props) => props.theme.colors.success || "#10B981"};
  color: white;
  border: none;
  border-radius: ${(props) => props.theme.borderRadius.sm};
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${(props) => props.theme.colors.successDark || "#059669"};
  }
`;

const PostCard = styled.div`
  border: 1px solid ${(props) => props.theme.colors.gray[300]};
  border-radius: ${(props) => props.theme.borderRadius.md};
  padding: 20px;
  margin-bottom: 15px;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${(props) => props.theme.colors.primary};
    box-shadow: ${(props) => props.theme.shadows.sm};
  }
`;

const PostHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 15px;

  h4 {
    margin: 0;
    color: ${(props) => props.theme.colors.dark};
    font-size: 1.2rem;
  }
`;

const PostActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  padding: 6px 12px;
  border: 1px solid
    ${(props) =>
      props.variant === "danger"
        ? props.theme.colors.danger || "#EF4444"
        : props.variant === "warning"
        ? props.theme.colors.warning || "#F59E0B"
        : props.theme.colors.primary};
  background-color: ${(props) =>
    props.variant === "danger"
      ? props.theme.colors.danger || "#EF4444"
      : props.variant === "warning"
      ? props.theme.colors.warning || "#F59E0B"
      : props.theme.colors.primary};
  color: white;
  border-radius: ${(props) => props.theme.borderRadius.sm};
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.8;
    transform: translateY(-1px);
  }
`;

const PostMeta = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 10px;

  span {
    font-size: 0.85rem;
    color: ${(props) => props.theme.colors.gray[600]};
  }
`;

const PostDescription = styled.p`
  color: ${(props) => props.theme.colors.gray[700]};
  line-height: 1.5;
  margin: 0;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
`;

const Tag = styled.span`
  background-color: ${(props) => props.theme.colors.primary}20;
  color: ${(props) => props.theme.colors.primary};
  padding: 2px 8px;
  border-radius: ${(props) => props.theme.borderRadius.sm};
  font-size: 0.75rem;
`;

const StatusBadge = styled.span`
  padding: 4px 8px;
  border-radius: ${(props) => props.theme.borderRadius.sm};
  font-size: 12px;
  font-weight: bold;
`;

// 모달 스타일
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: ${(props) => props.theme.borderRadius.lg};
  padding: 30px;
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  width: ${(props) => props.width || "600px"};
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid ${(props) => props.theme.colors.gray[200]};

  h3 {
    margin: 0;
    color: ${(props) => props.theme.colors.dark};
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${(props) => props.theme.colors.gray[500]};

  &:hover {
    color: ${(props) => props.theme.colors.dark};
  }
`;

const PreviewSection = styled.div`
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid ${(props) => props.theme.colors.gray[200]};

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
  }

  h4 {
    font-size: 1rem;
    font-weight: 600;
    color: ${(props) => props.theme.colors.dark};
    margin-bottom: 8px;
  }

  p {
    font-size: 0.9rem;
    color: ${(props) => props.theme.colors.gray[600]};
    line-height: 1.5;
    margin: 0;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${(props) => props.theme.colors.gray[500]};

  h3 {
    margin-bottom: 10px;
    color: ${(props) => props.theme.colors.gray[600]};
  }

  p {
    margin: 0;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: ${(props) => props.theme.colors.gray[600]};

  h3 {
    margin-bottom: 10px;
  }

  p {
    margin: 0;
    font-size: 0.9rem;
  }
`;

const MyPage = () => {
  const navigate = useNavigate();
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
          // 로컬 스토리지에 정보가 없으면 Firestore에서 직접 가져오기
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

      // 색인 생성 완료! orderBy 사용
      const servicesQuery = query(
        collection(db, "services"),
        where("userId", "==", currentUser.uid),
        orderBy("createdAt", "desc")
      );

      // 만약 아직 색인이 완성되지 않아서 에러가 나면 아래 코드 사용
      // const servicesQuery = query(
      //   collection(db, "services"),
      //   where("userId", "==", currentUser.uid)
      // );

      const querySnapshot = await getDocs(servicesQuery);
      const userPosts = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        userPosts.push({
          id: doc.id,
          serviceName: data.serviceName,
          companyWebsite: data.companyWebsite,
          price: data.price,
          isPricingOptional: data.isPricingOptional,
          serviceRegion: data.serviceRegion,
          serviceDescription: data.serviceDescription,
          categories: data.categories || [],
          tags: data.tags || [],
          files: data.files || [],
          freePostContent: data.freePostContent,
          status: data.status || "pending",
          createdAt: data.createdAt?.toDate
            ? data.createdAt.toDate().toLocaleDateString()
            : "Unknown",
          views: data.views || 0,
        });
      });

      // 서버에서 이미 orderBy로 정렬했으므로 클라이언트 정렬 불필요
      // (색인이 아직 완성되지 않았다면 아래 주석 해제)
      // userPosts.sort((a, b) => {
      //   const dateA = new Date(a.createdAt === "Unknown" ? 0 : a.createdAt);
      //   const dateB = new Date(b.createdAt === "Unknown" ? 0 : b.createdAt);
      //   return dateB.getTime() - dateA.getTime();
      // });

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

  const menuItems = [
    { id: "posts", label: "게시물 관리" },
    { id: "settings", label: "계정 설정" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!isUserLoggedIn()) {
      alert("로그인이 필요합니다.");
      return;
    }

    setIsSaving(true);

    try {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        alert("사용자 정보를 찾을 수 없습니다.");
        return;
      }

      console.log("사용자 정보 업데이트 시도:", userInfo);

      // Firestore에 사용자 정보 업데이트
      await updateDoc(doc(db, "users", currentUser.uid), {
        name: userInfo.name,
        phone: userInfo.phone,
        companyName: userInfo.companyName,
        businessNumber: userInfo.businessNumber,
        representative: userInfo.representative,
        companyAddress: userInfo.companyAddress,
        businessType: userInfo.businessType,
        businessField: userInfo.businessField,
        managerName: userInfo.managerName,
        updatedAt: new Date(),
      });

      // 로컬 스토리지의 사용자 정보도 업데이트
      const authData = JSON.parse(localStorage.getItem("authData"));
      if (authData && authData.userInfo) {
        authData.userInfo = {
          ...authData.userInfo,
          name: userInfo.name,
          phone: userInfo.phone,
          companyName: userInfo.companyName,
          businessNumber: userInfo.businessNumber,
          representative: userInfo.representative,
          companyAddress: userInfo.companyAddress,
          businessType: userInfo.businessType,
          businessField: userInfo.businessField,
          managerName: userInfo.managerName,
        };
        localStorage.setItem("authData", JSON.stringify(authData));
      }

      console.log("사용자 정보 업데이트 완료");
      alert("계정 정보가 성공적으로 저장되었습니다.");
    } catch (error) {
      console.error("사용자 정보 저장 실패:", error);
      alert("정보 저장 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSaving(false);
    }
  };

  const openModal = (type, post = null) => {
    setModalType(type);
    setSelectedPost(post);
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedPost(null);
  };

  const handleDeletePost = async (postId) => {
    try {
      console.log("서비스 삭제 시작:", postId);

      const currentUser = getCurrentUser();
      if (!currentUser) {
        alert("사용자 정보를 찾을 수 없습니다.");
        return;
      }

      // Firestore에서 서비스 문서 삭제
      await deleteDoc(doc(db, "services", postId));

      // Storage에서 관련 파일들 삭제 (에러가 나도 계속 진행)
      try {
        await deleteServiceFiles(currentUser.uid, postId);
      } catch (storageError) {
        console.warn("파일 삭제 중 오류 (무시됨):", storageError);
      }

      // 로컬 상태에서도 제거
      setPosts((prev) => prev.filter((post) => post.id !== postId));

      console.log("서비스 삭제 완료");
      alert("서비스가 성공적으로 삭제되었습니다.");
      closeModal();
    } catch (error) {
      console.error("서비스 삭제 실패:", error);

      let errorMessage = "서비스 삭제 중 오류가 발생했습니다.";
      if (error.code === "permission-denied") {
        errorMessage = "삭제 권한이 없습니다.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      alert(errorMessage);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      active: { text: "게시중", color: "#10B981" },
      pending: { text: "검토중", color: "#F59E0B" },
      rejected: { text: "반려됨", color: "#EF4444" },
    };
    return statusMap[status] || statusMap.pending;
  };

  const getCategoryNames = (categoryIds) => {
    const categoryMap = {
      hotel: "호텔/리조트",
      pension: "펜션/민박",
      guesthouse: "게스트하우스",
      camping: "캠핑/글램핑",
      motel: "모텔",
      experience: "체험/액티비티",
      food: "맛집/카페",
      transportation: "교통/렌터카",
    };
    return categoryIds.map((id) => categoryMap[id] || id).join(", ");
  };

  const renderModal = () => {
    if (!modalType || !selectedPost) return null;

    switch (modalType) {
      case "preview":
        return (
          <ModalOverlay onClick={closeModal}>
            <ModalContent width="700px" onClick={(e) => e.stopPropagation()}>
              <ModalHeader>
                <h3>게시물 미리보기</h3>
                <CloseButton onClick={closeModal}>×</CloseButton>
              </ModalHeader>

              <PreviewSection>
                <h4>서비스명</h4>
                <p>{selectedPost.serviceName}</p>
              </PreviewSection>

              {selectedPost.companyWebsite && (
                <PreviewSection>
                  <h4>홈페이지</h4>
                  <p>{selectedPost.companyWebsite}</p>
                </PreviewSection>
              )}

              {!selectedPost.isPricingOptional && selectedPost.price && (
                <PreviewSection>
                  <h4>가격</h4>
                  <p>{selectedPost.price}</p>
                </PreviewSection>
              )}

              <PreviewSection>
                <h4>서비스 지역</h4>
                <p>{selectedPost.serviceRegion}</p>
              </PreviewSection>

              <PreviewSection>
                <h4>설명</h4>
                <p>{selectedPost.serviceDescription}</p>
              </PreviewSection>

              <PreviewSection>
                <h4>카테고리</h4>
                <p>{getCategoryNames(selectedPost.categories)}</p>
              </PreviewSection>

              <PreviewSection>
                <h4>태그</h4>
                <TagContainer>
                  {selectedPost.tags.map((tag, index) => (
                    <Tag key={index}>#{tag}</Tag>
                  ))}
                </TagContainer>
              </PreviewSection>

              <PreviewSection>
                <h4>첨부 파일</h4>
                <div>
                  {selectedPost.files.map((file, index) => (
                    <p
                      key={index}
                      style={{ margin: "4px 0", fontSize: "0.85rem" }}
                    >
                      📎 {file.name}
                    </p>
                  ))}
                </div>
              </PreviewSection>

              {selectedPost.freePostContent && (
                <PreviewSection>
                  <h4>무료 서비스 종료 시 표시 내용</h4>
                  <p>{selectedPost.freePostContent}</p>
                </PreviewSection>
              )}
            </ModalContent>
          </ModalOverlay>
        );

      case "delete":
        return (
          <ModalOverlay onClick={closeModal}>
            <ModalContent width="400px" onClick={(e) => e.stopPropagation()}>
              <ModalHeader>
                <h3>게시물 삭제</h3>
                <CloseButton onClick={closeModal}>×</CloseButton>
              </ModalHeader>

              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <p style={{ marginBottom: "20px", fontSize: "1.1rem" }}>
                  정말로 "{selectedPost.serviceName}" 게시물을 삭제하시겠습니까?
                </p>
                <p
                  style={{
                    color: "#EF4444",
                    fontSize: "0.9rem",
                    marginBottom: "30px",
                  }}
                >
                  이 작업은 되돌릴 수 없습니다.
                </p>
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    justifyContent: "center",
                  }}
                >
                  <ActionButton onClick={closeModal}>취소</ActionButton>
                  <ActionButton
                    variant="danger"
                    onClick={() => handleDeletePost(selectedPost.id)}
                  >
                    삭제
                  </ActionButton>
                </div>
              </div>
            </ModalContent>
          </ModalOverlay>
        );

      default:
        return null;
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "posts":
        return (
          <div>
            <PostsHeader>
              <SectionTitle>게시물 관리</SectionTitle>
              <AddPostButton
                onClick={() => window.open("/service-register", "_blank")}
              >
                + 새 게시물 작성
              </AddPostButton>
            </PostsHeader>

            {isLoadingPosts ? (
              <LoadingContainer>
                <h3>게시물 목록을 불러오는 중...</h3>
                <p>잠시만 기다려주세요.</p>
              </LoadingContainer>
            ) : posts.length === 0 ? (
              <EmptyState>
                <h3>등록된 게시물이 없습니다</h3>
                <p>새로운 서비스를 등록하여 고객들에게 소개해보세요!</p>
              </EmptyState>
            ) : (
              posts.map((post) => {
                const status = getStatusBadge(post.status);
                return (
                  <PostCard key={post.id}>
                    <PostHeader>
                      <h4>{post.serviceName}</h4>
                      <PostActions>
                        <ActionButton
                          onClick={() => openModal("preview", post)}
                        >
                          미리보기
                        </ActionButton>
                        <ActionButton
                          variant="warning"
                          onClick={() => navigate(`/service-edit/${post.id}`)}
                        >
                          수정
                        </ActionButton>
                        <ActionButton
                          variant="danger"
                          onClick={() => openModal("delete", post)}
                        >
                          삭제
                        </ActionButton>
                      </PostActions>
                    </PostHeader>

                    <PostMeta>
                      <span>📅 {post.createdAt}</span>
                      <span>👁️ {post.views.toLocaleString()}회</span>
                      {!post.isPricingOptional && post.price && (
                        <span>💰 {post.price}</span>
                      )}
                      <span>📍 {post.serviceRegion}</span>
                      <span>📁 {post.files.length}개 파일</span>
                      <StatusBadge
                        style={{
                          backgroundColor: status.color + "20",
                          color: status.color,
                        }}
                      >
                        {status.text}
                      </StatusBadge>
                    </PostMeta>

                    <PostDescription>{post.serviceDescription}</PostDescription>

                    <TagContainer>
                      {post.tags.slice(0, 3).map((tag, index) => (
                        <Tag key={index}>#{tag}</Tag>
                      ))}
                      {post.tags.length > 3 && (
                        <Tag>+{post.tags.length - 3}개 더</Tag>
                      )}
                    </TagContainer>
                  </PostCard>
                );
              })
            )}
          </div>
        );

      case "settings":
        return (
          <div>
            <SectionTitle>계정 설정</SectionTitle>
            <FormGrid>
              <FormGroup>
                <label>이름 *</label>
                <input
                  type="text"
                  name="name"
                  value={userInfo.name}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <label>이메일 *</label>
                <input
                  type="email"
                  name="email"
                  value={userInfo.email}
                  onChange={handleInputChange}
                  required
                  disabled // 이메일은 수정 불가
                />
              </FormGroup>
              <FormGroup>
                <label>전화번호 *</label>
                <input
                  type="tel"
                  name="phone"
                  value={userInfo.phone}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <label>기업명</label>
                <input
                  type="text"
                  name="companyName"
                  value={userInfo.companyName}
                  onChange={handleInputChange}
                />
              </FormGroup>
              <FormGroup>
                <label>담당자명</label>
                <input
                  type="text"
                  name="managerName"
                  value={userInfo.managerName}
                  onChange={handleInputChange}
                />
              </FormGroup>
              <FormGroup>
                <label>대표자명</label>
                <input
                  type="text"
                  name="representative"
                  value={userInfo.representative}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </FormGrid>

            <FormGroup style={{ marginBottom: "20px" }}>
              <label>사업자 등록번호</label>
              <input
                type="text"
                name="businessNumber"
                value={userInfo.businessNumber}
                onChange={handleInputChange}
                placeholder="123-45-67890"
              />
            </FormGroup>

            <FormGroup style={{ marginBottom: "20px" }}>
              <label>회사 주소</label>
              <input
                type="text"
                name="companyAddress"
                value={userInfo.companyAddress}
                onChange={handleInputChange}
                placeholder="회사 주소를 입력하세요"
              />
            </FormGroup>

            <FormGrid style={{ marginBottom: "20px" }}>
              <FormGroup>
                <label>기업 구분</label>
                <select
                  name="businessField"
                  value={userInfo.businessField}
                  onChange={handleInputChange}
                >
                  <option value="">선택하세요</option>
                  <option value="large">대기업</option>
                  <option value="medium">중견기업</option>
                  <option value="small">중소기업</option>
                  <option value="startup">스타트업</option>
                  <option value="individual">개인사업자</option>
                </select>
              </FormGroup>
              <FormGroup>
                <label>기업 분야</label>
                <select
                  name="businessType"
                  value={userInfo.businessType}
                  onChange={handleInputChange}
                >
                  <option value="">선택하세요</option>
                  <option value="hotel">호텔/리조트</option>
                  <option value="pension">펜션/민박</option>
                  <option value="guesthouse">게스트하우스</option>
                  <option value="camping">캠핑/글램핑</option>
                  <option value="motel">모텔</option>
                  <option value="other">기타</option>
                </select>
              </FormGroup>
            </FormGrid>

            <SaveButton onClick={handleSave} disabled={isSaving}>
              {isSaving ? "저장 중..." : "변경사항 저장"}
            </SaveButton>
          </div>
        );

      default:
        return (
          <div>
            <SectionTitle>준비 중</SectionTitle>
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
          <Sidebar>
            <SidebarMenu>
              {menuItems.map((item) => (
                <MenuItem key={item.id}>
                  <MenuButton
                    active={activeTab === item.id}
                    onClick={() => setActiveTab(item.id)}
                  >
                    {item.label}
                  </MenuButton>
                </MenuItem>
              ))}
            </SidebarMenu>
          </Sidebar>

          <MainContent>{renderContent()}</MainContent>
        </ContentGrid>
      )}

      {renderModal()}
    </MyPageContainer>
  );
};

export default MyPage;
