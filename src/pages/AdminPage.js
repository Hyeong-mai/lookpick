import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  collection,
  query,
  orderBy,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { deleteServiceFiles } from "../firebase/storage";
import { isUserLoggedIn, getCurrentUser, isAdmin } from "../firebase/auth";

const AdminContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const AdminHeader = styled.div`
  margin-bottom: 40px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: ${(props) => props.theme.colors.dark};
  margin-bottom: 16px;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: ${(props) => props.theme.colors.gray[600]};
`;

const FilterSection = styled.div`
  margin-bottom: 30px;
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  padding: 8px 16px;
  border: 2px solid ${(props) => props.theme.colors.primary};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  background: ${(props) =>
    props.active ? props.theme.colors.primary : "transparent"};
  color: ${(props) => (props.active ? "white" : props.theme.colors.primary)};
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => props.theme.colors.primary};
    color: white;
  }
`;

const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background: white;
  padding: 20px;
  border-radius: ${(props) => props.theme.borderRadius.md};
  box-shadow: ${(props) => props.theme.shadows.sm};
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: ${(props) => props.color || props.theme.colors.primary};
  margin-bottom: 8px;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: ${(props) => props.theme.colors.gray[600]};
`;

const PostsSection = styled.div`
  background: white;
  border-radius: ${(props) => props.theme.borderRadius.md};
  box-shadow: ${(props) => props.theme.shadows.sm};
  overflow: hidden;
`;

const PostsHeader = styled.div`
  padding: 20px;
  background: ${(props) => props.theme.colors.gray[50]};
  border-bottom: 1px solid ${(props) => props.theme.colors.gray[200]};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PostsTitle = styled.h2`
  font-size: 1.3rem;
  color: ${(props) => props.theme.colors.dark};
`;

const PostsCount = styled.span`
  color: ${(props) => props.theme.colors.gray[600]};
  font-size: 0.9rem;
`;

const PostsList = styled.div`
  max-height: 600px;
  overflow-y: auto;
`;

const PostItem = styled.div`
  padding: 20px;
  border-bottom: 1px solid ${(props) => props.theme.colors.gray[200]};
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 20px;
  align-items: center;

  &:hover {
    background: ${(props) => props.theme.colors.gray[50]};
  }

  &:last-child {
    border-bottom: none;
  }
`;

const PostInfo = styled.div``;

const PostTitle = styled.h3`
  font-size: 1.1rem;
  color: ${(props) => props.theme.colors.dark};
  margin-bottom: 8px;
`;

const PostMeta = styled.div`
  font-size: 0.9rem;
  color: ${(props) => props.theme.colors.gray[600]};
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
`;

const StatusBadge = styled.span`
  padding: 4px 12px;
  border-radius: ${(props) => props.theme.borderRadius.sm};
  font-size: 0.8rem;
  font-weight: 500;
  background: ${(props) => {
    switch (props.status) {
      case "pending":
        return "#FEF3C7";
      case "approved":
        return "#D1FAE5";
      case "rejected":
        return "#FEE2E2";
      default:
        return props.theme.colors.gray[200];
    }
  }};
  color: ${(props) => {
    switch (props.status) {
      case "pending":
        return "#92400E";
      case "approved":
        return "#065F46";
      case "rejected":
        return "#991B1B";
      default:
        return props.theme.colors.gray[600];
    }
  }};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  padding: 6px 12px;
  border: none;
  border-radius: ${(props) => props.theme.borderRadius.sm};
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &.approve {
    background: #10b981;
    color: white;
    &:hover {
      background: #059669;
    }
  }

  &.reject {
    background: #ef4444;
    color: white;
    &:hover {
      background: #dc2626;
    }
  }

  &.delete {
    background: #6b7280;
    color: white;
    &:hover {
      background: #4b5563;
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LoadingMessage = styled.div`
  padding: 40px;
  text-align: center;
  color: ${(props) => props.theme.colors.gray[600]};
`;

const EmptyMessage = styled.div`
  padding: 40px;
  text-align: center;
  color: ${(props) => props.theme.colors.gray[600]};
`;

const AdminPage = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    // 관리자 권한 확인
    if (!isUserLoggedIn()) {
      navigate("/login");
      return;
    }

    if (!isAdmin()) {
      alert("관리자 권한이 필요합니다.");
      navigate("/");
      return;
    }

    loadAllPosts();
  }, [navigate]);

  useEffect(() => {
    // 필터링 적용
    if (filter === "all") {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(posts.filter((post) => post.status === filter));
    }
  }, [posts, filter]);

  useEffect(() => {
    // 통계 계산
    const newStats = {
      total: posts.length,
      pending: posts.filter((post) => post.status === "pending").length,
      approved: posts.filter((post) => post.status === "approved").length,
      rejected: posts.filter((post) => post.status === "rejected").length,
    };
    setStats(newStats);
  }, [posts]);

  const loadAllPosts = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, "services"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);

      const postsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPosts(postsData);
    } catch (error) {
      console.error("게시물 로드 실패:", error);
      alert("게시물을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const updatePostStatus = async (postId, newStatus) => {
    try {
      const postRef = doc(db, "services", postId);
      await updateDoc(postRef, {
        status: newStatus,
        updatedAt: new Date(),
      });

      // 로컬 상태 업데이트
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, status: newStatus } : post
        )
      );

      alert(
        `게시물이 ${newStatus === "approved" ? "승인" : "거절"}되었습니다.`
      );
    } catch (error) {
      console.error("상태 업데이트 실패:", error);
      alert("상태 업데이트 중 오류가 발생했습니다.");
    }
  };

  const deletePost = async (postId, userId) => {
    if (!window.confirm("정말로 이 게시물을 삭제하시겠습니까?")) {
      return;
    }

    try {
      // Firestore에서 게시물 삭제
      await deleteDoc(doc(db, "services", postId));

      // Storage에서 관련 파일들 삭제
      try {
        await deleteServiceFiles(`services/${userId}/${postId}`);
      } catch (storageError) {
        console.warn("파일 삭제 중 일부 오류 발생:", storageError);
      }

      // 로컬 상태 업데이트
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));

      alert("게시물이 삭제되었습니다.");
    } catch (error) {
      console.error("게시물 삭제 실패:", error);
      alert("게시물 삭제 중 오류가 발생했습니다.");
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "날짜 없음";

    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return (
      date.toLocaleDateString("ko-KR") +
      " " +
      date.toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "대기중";
      case "approved":
        return "승인됨";
      case "rejected":
        return "거절됨";
      default:
        return "알 수 없음";
    }
  };

  if (loading) {
    return (
      <AdminContainer>
        <LoadingMessage>게시물을 불러오는 중...</LoadingMessage>
      </AdminContainer>
    );
  }

  return (
    <AdminContainer>
      <AdminHeader>
        <Title>관리자 페이지</Title>
        <Subtitle>모든 게시물을 상태별로 관리할 수 있습니다</Subtitle>
      </AdminHeader>

      <StatsSection>
        <StatCard>
          <StatNumber color="#3B82F6">{stats.total}</StatNumber>
          <StatLabel>전체 게시물</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber color="#F59E0B">{stats.pending}</StatNumber>
          <StatLabel>대기중</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber color="#10B981">{stats.approved}</StatNumber>
          <StatLabel>승인됨</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber color="#EF4444">{stats.rejected}</StatNumber>
          <StatLabel>거절됨</StatLabel>
        </StatCard>
      </StatsSection>

      <FilterSection>
        <FilterButton
          active={filter === "all"}
          onClick={() => setFilter("all")}
        >
          전체
        </FilterButton>
        <FilterButton
          active={filter === "pending"}
          onClick={() => setFilter("pending")}
        >
          대기중 ({stats.pending})
        </FilterButton>
        <FilterButton
          active={filter === "approved"}
          onClick={() => setFilter("approved")}
        >
          승인됨 ({stats.approved})
        </FilterButton>
        <FilterButton
          active={filter === "rejected"}
          onClick={() => setFilter("rejected")}
        >
          거절됨 ({stats.rejected})
        </FilterButton>
      </FilterSection>

      <PostsSection>
        <PostsHeader>
          <PostsTitle>게시물 목록</PostsTitle>
          <PostsCount>{filteredPosts.length}개</PostsCount>
        </PostsHeader>

        <PostsList>
          {filteredPosts.length === 0 ? (
            <EmptyMessage>
              {filter === "all"
                ? "게시물이 없습니다."
                : `${getStatusText(filter)} 게시물이 없습니다.`}
            </EmptyMessage>
          ) : (
            filteredPosts.map((post) => (
              <PostItem key={post.id}>
                <PostInfo>
                  <PostTitle>{post.serviceName || "제목 없음"}</PostTitle>
                  <PostMeta>
                    <span>작성자: {post.companyName || post.userEmail}</span>
                    <span>등록일: {formatDate(post.createdAt)}</span>
                    <span>
                      카테고리: {post.categories?.join(", ") || "없음"}
                    </span>
                  </PostMeta>
                </PostInfo>

                <StatusBadge status={post.status}>
                  {getStatusText(post.status)}
                </StatusBadge>

                <ActionButtons>
                  {post.status === "pending" && (
                    <>
                      <ActionButton
                        className="approve"
                        onClick={() => updatePostStatus(post.id, "approved")}
                      >
                        승인
                      </ActionButton>
                      <ActionButton
                        className="reject"
                        onClick={() => updatePostStatus(post.id, "rejected")}
                      >
                        거절
                      </ActionButton>
                    </>
                  )}
                  {post.status === "approved" && (
                    <ActionButton
                      className="reject"
                      onClick={() => updatePostStatus(post.id, "rejected")}
                    >
                      거절
                    </ActionButton>
                  )}
                  {post.status === "rejected" && (
                    <ActionButton
                      className="approve"
                      onClick={() => updatePostStatus(post.id, "approved")}
                    >
                      승인
                    </ActionButton>
                  )}
                  <ActionButton
                    className="delete"
                    onClick={() => deletePost(post.id, post.userId)}
                  >
                    삭제
                  </ActionButton>
                </ActionButtons>
              </PostItem>
            ))
          )}
        </PostsList>
      </PostsSection>
    </AdminContainer>
  );
};

export default AdminPage;
