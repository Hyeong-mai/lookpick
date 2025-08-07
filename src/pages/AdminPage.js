import React, { useState, useEffect, useCallback } from "react";
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
  limit,
  startAfter,
  getCountFromServer,
  where,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { deleteServiceFiles } from "../firebase/storage";
import { isUserLoggedIn, isAdmin } from "../firebase/auth";

// Admin 컴포넌트들 import
import AdminTabNavigation from "../components/admin/AdminTabNavigation";
import AdminStatsCards from "../components/admin/AdminStatsCards";
import AdminFilters from "../components/admin/AdminFilters";
import AdminPostsList from "../components/admin/AdminPostsList";
import AdminUsersList from "../components/admin/AdminUsersList";
import AdminModals from "../components/admin/AdminModals";

const AdminContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 20px;
  height: 100vh;
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

const LoadingMessage = styled.div`
  padding: 40px;
  text-align: center;
  color: ${(props) => props.theme.colors.gray[600]};
`;

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("posts");

  // 모달 관련 상태
  const [modalType, setModalType] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  // 게시물 관련 상태
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [postFilter, setPostFilter] = useState("all");
  const [postCurrentPage, setPostCurrentPage] = useState(1);
  const [postTotalCount, setPostTotalCount] = useState(0);
  const [postLastDoc, setPostLastDoc] = useState(null);
  const [postStats, setPostStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  // 회원 관련 상태
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [userFilter] = useState("all"); // setUserFilter 제거 (사용되지 않음)
  const [userCurrentPage, setUserCurrentPage] = useState(1);
  const [userTotalCount, setUserTotalCount] = useState(0);
  const [userLastDoc, setUserLastDoc] = useState(null);
  const [userStats, setUserStats] = useState({
    total: 0,
    active: 0,
    suspended: 0,
    pending: 0,
  });

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const itemsPerPage = 10;

  // 게시물 관련 함수들을 useCallback으로 감싸기
  const loadPostStats = useCallback(async () => {
    try {
      const [totalQuery, pendingQuery, approvedQuery, rejectedQuery] =
        await Promise.all([
          getCountFromServer(query(collection(db, "services"))),
          getCountFromServer(
            query(collection(db, "services"), where("status", "==", "pending"))
          ),
          getCountFromServer(
            query(collection(db, "services"), where("status", "==", "approved"))
          ),
          getCountFromServer(
            query(collection(db, "services"), where("status", "==", "rejected"))
          ),
        ]);

      setPostStats({
        total: totalQuery.data().count,
        pending: pendingQuery.data().count,
        approved: approvedQuery.data().count,
        rejected: rejectedQuery.data().count,
      });
    } catch (error) {
      console.error("게시물 통계 로드 실패:", error);
    }
  }, []);

  const loadPostTotalCount = useCallback(async (filterStatus) => {
    try {
      let countQuery;
      if (filterStatus === "all") {
        countQuery = query(collection(db, "services"));
      } else {
        countQuery = query(
          collection(db, "services"),
          where("status", "==", filterStatus)
        );
      }

      const snapshot = await getCountFromServer(countQuery);
      setPostTotalCount(snapshot.data().count);
    } catch (error) {
      console.error("게시물 총 개수 로드 실패:", error);
    }
  }, []);

  const loadPosts = useCallback(
    async (page, filterStatus = "all", direction = "next") => {
      try {
        setLoading(true);

        let postsQuery;
        if (filterStatus === "all") {
          postsQuery = query(
            collection(db, "services"),
            orderBy("createdAt", "desc"),
            limit(itemsPerPage)
          );
        } else {
          postsQuery = query(
            collection(db, "services"),
            where("status", "==", filterStatus),
            orderBy("createdAt", "desc"),
            limit(itemsPerPage)
          );
        }

        if (page > 1 && postLastDoc && direction === "next") {
          postsQuery = query(postsQuery._query, startAfter(postLastDoc));
        }

        const snapshot = await getDocs(postsQuery);
        const postsData = [];

        snapshot.forEach((doc) => {
          const data = doc.data();
          postsData.push({
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate
              ? data.createdAt.toDate().toLocaleDateString()
              : "Unknown",
          });
        });

        setPosts(postsData);
        setFilteredPosts(postsData);

        if (snapshot.docs.length > 0) {
          setPostLastDoc(snapshot.docs[snapshot.docs.length - 1]);
        }
      } catch (error) {
        console.error("게시물 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    },
    [postLastDoc, itemsPerPage]
  );

  const loadUserStats = useCallback(async () => {
    try {
      const [totalQuery, activeQuery, suspendedQuery, pendingQuery] =
        await Promise.all([
          getCountFromServer(query(collection(db, "users"))),
          getCountFromServer(
            query(collection(db, "users"), where("status", "==", "active"))
          ),
          getCountFromServer(
            query(collection(db, "users"), where("status", "==", "suspended"))
          ),
          getCountFromServer(
            query(collection(db, "users"), where("status", "==", "pending"))
          ),
        ]);

      setUserStats({
        total: totalQuery.data().count,
        active: activeQuery.data().count,
        suspended: suspendedQuery.data().count,
        pending: pendingQuery.data().count,
      });
    } catch (error) {
      console.error("회원 통계 로드 실패:", error);
    }
  }, []);

  const loadUserTotalCount = useCallback(async (filterStatus) => {
    try {
      let countQuery;
      if (filterStatus === "all") {
        countQuery = query(collection(db, "users"));
      } else {
        countQuery = query(
          collection(db, "users"),
          where("status", "==", filterStatus)
        );
      }

      const snapshot = await getCountFromServer(countQuery);
      setUserTotalCount(snapshot.data().count);
    } catch (error) {
      console.error("회원 총 개수 로드 실패:", error);
    }
  }, []);

  const loadUsers = useCallback(
    async (page, filterStatus = "all", direction = "next") => {
      try {
        setLoading(true);

        let usersQuery;
        if (filterStatus === "all") {
          usersQuery = query(
            collection(db, "users"),
            orderBy("createdAt", "desc"),
            limit(itemsPerPage)
          );
        } else {
          usersQuery = query(
            collection(db, "users"),
            where("status", "==", filterStatus),
            orderBy("createdAt", "desc"),
            limit(itemsPerPage)
          );
        }

        if (page > 1 && userLastDoc && direction === "next") {
          usersQuery = query(usersQuery._query, startAfter(userLastDoc));
        }

        const snapshot = await getDocs(usersQuery);
        const usersData = [];

        snapshot.forEach((doc) => {
          const data = doc.data();
          usersData.push({
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate
              ? data.createdAt.toDate().toLocaleDateString()
              : "Unknown",
          });
        });

        setUsers(usersData);
        setFilteredUsers(usersData);

        if (snapshot.docs.length > 0) {
          setUserLastDoc(snapshot.docs[snapshot.docs.length - 1]);
        }
      } catch (error) {
        console.error("회원 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    },
    [userLastDoc, itemsPerPage]
  );

  // 첫 번째 useEffect - 의존성 추가
  useEffect(() => {
    if (!isUserLoggedIn()) {
      navigate("/login");
      return;
    }

    if (!isAdmin()) {
      alert("관리자 권한이 필요합니다.");
      navigate("/");
      return;
    }

    loadPostStats();
    loadUserStats();
    loadPosts(1);
    loadUsers(1);
  }, [navigate, loadPostStats, loadUserStats, loadPosts, loadUsers]);

  // 두 번째 useEffect - 의존성 추가
  useEffect(() => {
    if (activeTab === "posts") {
      setPostCurrentPage(1);
      loadPostTotalCount(postFilter);
      loadPosts(1, postFilter);
    } else {
      setUserCurrentPage(1);
      loadUserTotalCount(userFilter);
      loadUsers(1, userFilter);
    }
  }, [
    activeTab,
    postFilter,
    userFilter,
    loadPostTotalCount,
    loadPosts,
    loadUserTotalCount,
    loadUsers,
  ]);

  const handlePostPageChange = (newPage) => {
    if (newPage !== postCurrentPage) {
      setPostCurrentPage(newPage);
      const direction = newPage > postCurrentPage ? "next" : "prev";
      loadPosts(newPage, postFilter, direction);
    }
  };

  const handleUserPageChange = (newPage) => {
    if (newPage !== userCurrentPage) {
      setUserCurrentPage(newPage);
      const direction = newPage > userCurrentPage ? "next" : "prev";
      loadUsers(newPage, userFilter, direction);
    }
  };

  const updatePostStatus = async (postId, newStatus) => {
    try {
      await updateDoc(doc(db, "services", postId), {
        status: newStatus,
        updatedAt: new Date(),
      });

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, status: newStatus } : post
        )
      );

      setFilteredPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, status: newStatus } : post
        )
      );

      await loadPostStats();
      await loadPostTotalCount(postFilter);

      alert(
        `게시물이 ${newStatus === "approved" ? "승인" : "거절"}되었습니다.`
      );
    } catch (error) {
      console.error("게시물 상태 업데이트 실패:", error);
      alert("상태 업데이트에 실패했습니다.");
    }
  };

  const deletePost = async (postId, userId) => {
    if (window.confirm("정말로 이 게시물을 삭제하시겠습니까?")) {
      try {
        await deleteDoc(doc(db, "services", postId));

        try {
          await deleteServiceFiles(`services/${userId}/${postId}`);
        } catch (fileError) {
          console.warn("파일 삭제 중 오류:", fileError);
        }

        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
        setFilteredPosts((prevPosts) =>
          prevPosts.filter((post) => post.id !== postId)
        );

        await loadPostStats();
        await loadPostTotalCount(postFilter);

        alert("게시물이 삭제되었습니다.");
      } catch (error) {
        console.error("게시물 삭제 실패:", error);
        alert("게시물 삭제에 실패했습니다.");
      }
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm("정말로 이 회원을 삭제하시겠습니까?")) {
      try {
        await deleteDoc(doc(db, "users", userId));

        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
        setFilteredUsers((prevUsers) =>
          prevUsers.filter((user) => user.id !== userId)
        );

        await loadUserStats();

        alert("회원이 삭제되었습니다.");
      } catch (error) {
        console.error("회원 삭제 실패:", error);
        alert("회원 삭제에 실패했습니다.");
      }
    }
  };

  const openModal = (type, item) => {
    setModalType(type);
    setSelectedItem(item);
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedItem(null);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "Unknown";
    return timestamp.toDate
      ? timestamp.toDate().toLocaleDateString()
      : timestamp;
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

  if (loading && activeTab === "posts" && posts.length === 0) {
    return (
      <AdminContainer>
        <LoadingMessage>데이터를 불러오는 중...</LoadingMessage>
      </AdminContainer>
    );
  }

  if (loading && activeTab === "users" && users.length === 0) {
    return (
      <AdminContainer>
        <LoadingMessage>데이터를 불러오는 중...</LoadingMessage>
      </AdminContainer>
    );
  }

  return (
    <AdminContainer>
      <AdminHeader>
        <Title>관리자 페이지</Title>
        <Subtitle>게시물과 회원을 관리할 수 있습니다</Subtitle>
      </AdminHeader>

      <AdminTabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "posts" && (
        <>
          <AdminStatsCards type="posts" stats={postStats} />
          <AdminFilters
            filter={postFilter}
            setFilter={setPostFilter}
            stats={postStats}
          />
          <AdminPostsList
            filteredPosts={filteredPosts}
            postFilter={postFilter}
            itemsPerPage={itemsPerPage}
            formatDate={formatDate}
            getStatusText={getStatusText}
            openModal={openModal}
            updatePostStatus={updatePostStatus}
            deletePost={deletePost}
            postCurrentPage={postCurrentPage}
            postTotalCount={postTotalCount}
            handlePostPageChange={handlePostPageChange}
          />
        </>
      )}

      {activeTab === "users" && (
        <>
          <AdminStatsCards type="users" stats={userStats} />
          <AdminUsersList
            filteredUsers={filteredUsers}
            itemsPerPage={itemsPerPage}
            formatDate={formatDate}
            openModal={openModal}
            deleteUser={deleteUser}
            userCurrentPage={userCurrentPage}
            userTotalCount={userTotalCount}
            handleUserPageChange={handleUserPageChange}
          />
        </>
      )}

      <AdminModals
        modalType={modalType}
        selectedItem={selectedItem}
        closeModal={closeModal}
        formatDate={formatDate}
        getStatusText={getStatusText}
      />
    </AdminContainer>
  );
};

export default AdminPage;
