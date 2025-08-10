import React, { useState, useEffect, useCallback, useRef } from "react";
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
  height: 150vh;
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
  const postLastDocsRef = useRef({}); // 페이지별 lastDoc 저장
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
  const userLastDocsRef = useRef({}); // 페이지별 lastDoc 저장
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
      console.log(
        `게시물 총 개수 로드: ${
          snapshot.data().count
        }개 (필터: ${filterStatus})`
      );
    } catch (error) {
      console.error("게시물 총 개수 로드 실패:", error);
    }
  }, []);

  const loadPosts = useCallback(
    async (page, filterStatus = "all", direction = "next") => {
      try {
        setLoading(true);
        console.log(
          `📄 게시물 로드 시작 - 페이지: ${page}, 필터: ${filterStatus}, 방향: ${direction}`
        );

        // 캐시 키 생성 (필터별로 별도 관리)
        const cacheKey = `${filterStatus}`;

        // 기본 쿼리 조건들
        const baseConditions = [
          orderBy("createdAt", "desc"),
          limit(itemsPerPage),
        ];

        // 필터 조건 추가
        if (filterStatus !== "all") {
          baseConditions.unshift(where("status", "==", filterStatus));
        }

        // 페이지네이션 조건 추가
        if (page > 1 && direction === "next") {
          // 이전 페이지의 lastDoc 확인
          const prevPage = page - 1;
          const lastDocKey = `${cacheKey}_page_${prevPage}`;
          const currentLastDoc = postLastDocsRef.current[lastDocKey];

          if (currentLastDoc) {
            console.log(
              `⏭️ startAfter 사용 - 마지막 문서 ID: ${currentLastDoc.id}`
            );
            baseConditions.push(startAfter(currentLastDoc));
          } else {
            console.warn(
              `⚠️ 페이지 ${page}로 이동하려 하지만 이전 페이지의 lastDoc이 없습니다. 첫 페이지부터 순차 로드를 시작합니다.`
            );
            // 첫 페이지부터 순차적으로 로드
            await loadPostsSequentially(page, filterStatus);
            return;
          }
        }

        // 최종 쿼리 생성
        const postsQuery = query(collection(db, "services"), ...baseConditions);

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

        console.log(`✅ 게시물 로드 완료 - ${postsData.length}개 항목`);
        console.log(`첫 번째 항목:`, postsData[0]?.serviceName);
        console.log(
          `마지막 항목:`,
          postsData[postsData.length - 1]?.serviceName
        );

        setPosts(postsData);
        setFilteredPosts(postsData);

        // 현재 페이지의 lastDoc 저장
        if (snapshot.docs.length > 0) {
          const newLastDoc = snapshot.docs[snapshot.docs.length - 1];
          const currentPageKey = `${cacheKey}_page_${page}`;
          postLastDocsRef.current[currentPageKey] = newLastDoc;
          console.log(
            `🔄 새로운 lastDoc 설정: ${currentPageKey} = ${newLastDoc.id}`
          );
        } else {
          console.log(`⚠️ 문서가 없어 lastDoc을 설정하지 않음`);
        }
      } catch (error) {
        console.error("게시물 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    },
    [itemsPerPage]
  );

  // 순차적으로 페이지 로드하는 함수 (중간 페이지 접근 시 사용)
  const loadPostsSequentially = useCallback(
    async (targetPage, filterStatus = "all") => {
      try {
        console.log(`🔄 순차 로드 시작: 목표 페이지 ${targetPage}`);
        const cacheKey = `${filterStatus}`;
        let currentPostLastDocs = {};

        // 첫 페이지부터 목표 페이지까지 순차 로드
        for (let page = 1; page <= targetPage; page++) {
          const pageKey = `${cacheKey}_page_${page}`;

          console.log(`📄 페이지 ${page} 로드 중...`);

          // 기본 쿼리 조건들
          const baseConditions = [
            orderBy("createdAt", "desc"),
            limit(itemsPerPage),
          ];

          // 필터 조건 추가
          if (filterStatus !== "all") {
            baseConditions.unshift(where("status", "==", filterStatus));
          }

          // 이전 페이지의 lastDoc 사용
          if (page > 1) {
            const prevPageKey = `${cacheKey}_page_${page - 1}`;
            const prevLastDoc = currentPostLastDocs[prevPageKey];
            if (prevLastDoc) {
              baseConditions.push(startAfter(prevLastDoc));
            }
          }

          // 쿼리 실행
          const postsQuery = query(
            collection(db, "services"),
            ...baseConditions
          );
          const snapshot = await getDocs(postsQuery);

          // 목표 페이지인 경우 데이터 설정
          if (page === targetPage) {
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
            console.log(`✅ 목표 페이지 ${targetPage} 데이터 설정 완료`);
          }

          // lastDoc 캐시 (로컬 및 상태)
          if (snapshot.docs.length > 0) {
            const lastDoc = snapshot.docs[snapshot.docs.length - 1];
            currentPostLastDocs[pageKey] = lastDoc;
            console.log(`💾 페이지 ${page} lastDoc 캐시됨: ${lastDoc.id}`);
          }
        }

        // useRef에 캐시 저장
        Object.assign(postLastDocsRef.current, currentPostLastDocs);
      } catch (error) {
        console.error("순차 로드 실패:", error);
      }
    },
    [itemsPerPage]
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
        console.log(
          `👥 회원 로드 시작 - 페이지: ${page}, 필터: ${filterStatus}, 방향: ${direction}`
        );

        // 캐시 키 생성 (필터별로 별도 관리)
        const cacheKey = `${filterStatus}`;

        // 기본 쿼리 조건들
        const baseConditions = [
          orderBy("createdAt", "desc"),
          limit(itemsPerPage),
        ];

        // 필터 조건 추가
        if (filterStatus !== "all") {
          baseConditions.unshift(where("status", "==", filterStatus));
        }

        // 페이지네이션 조건 추가
        if (page > 1 && direction === "next") {
          // 이전 페이지의 lastDoc 확인
          const prevPage = page - 1;
          const lastDocKey = `${cacheKey}_page_${prevPage}`;
          const currentLastDoc = userLastDocsRef.current[lastDocKey];

          if (currentLastDoc) {
            console.log(
              `⏭️ startAfter 사용 - 마지막 회원 문서 ID: ${currentLastDoc.id}`
            );
            baseConditions.push(startAfter(currentLastDoc));
          } else {
            console.warn(
              `⚠️ 회원 페이지 ${page}로 이동하려 하지만 이전 페이지의 lastDoc이 없습니다. 첫 페이지부터 순차 로드를 시작합니다.`
            );
            // 첫 페이지부터 순차적으로 로드
            await loadUsersSequentially(page, filterStatus);
            return;
          }
        }

        // 최종 쿼리 생성
        const usersQuery = query(collection(db, "users"), ...baseConditions);

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

        console.log(`✅ 회원 로드 완료 - ${usersData.length}개 항목`);

        setUsers(usersData);
        setFilteredUsers(usersData);

        // 현재 페이지의 lastDoc 저장
        if (snapshot.docs.length > 0) {
          const newLastDoc = snapshot.docs[snapshot.docs.length - 1];
          const currentPageKey = `${cacheKey}_page_${page}`;
          userLastDocsRef.current[currentPageKey] = newLastDoc;
          console.log(
            `🔄 새로운 회원 lastDoc 설정: ${currentPageKey} = ${newLastDoc.id}`
          );
        } else {
          console.log(`⚠️ 문서가 없어 lastDoc을 설정하지 않음`);
        }
      } catch (error) {
        console.error("회원 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    },
    [itemsPerPage]
  );

  // 회원 순차적으로 페이지 로드하는 함수 (중간 페이지 접근 시 사용)
  const loadUsersSequentially = useCallback(
    async (targetPage, filterStatus = "all") => {
      try {
        console.log(`🔄 회원 순차 로드 시작: 목표 페이지 ${targetPage}`);
        const cacheKey = `${filterStatus}`;
        let currentUserLastDocs = {};

        // 첫 페이지부터 목표 페이지까지 순차 로드
        for (let page = 1; page <= targetPage; page++) {
          const pageKey = `${cacheKey}_page_${page}`;

          console.log(`👥 회원 페이지 ${page} 로드 중...`);

          // 기본 쿼리 조건들
          const baseConditions = [
            orderBy("createdAt", "desc"),
            limit(itemsPerPage),
          ];

          // 필터 조건 추가
          if (filterStatus !== "all") {
            baseConditions.unshift(where("status", "==", filterStatus));
          }

          // 이전 페이지의 lastDoc 사용
          if (page > 1) {
            const prevPageKey = `${cacheKey}_page_${page - 1}`;
            const prevLastDoc = currentUserLastDocs[prevPageKey];
            if (prevLastDoc) {
              baseConditions.push(startAfter(prevLastDoc));
            }
          }

          // 쿼리 실행
          const usersQuery = query(collection(db, "users"), ...baseConditions);
          const snapshot = await getDocs(usersQuery);

          // 목표 페이지인 경우 데이터 설정
          if (page === targetPage) {
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
            console.log(`✅ 회원 목표 페이지 ${targetPage} 데이터 설정 완료`);
          }

          // lastDoc 캐시 (로컬 및 상태)
          if (snapshot.docs.length > 0) {
            const lastDoc = snapshot.docs[snapshot.docs.length - 1];
            currentUserLastDocs[pageKey] = lastDoc;
            console.log(`💾 회원 페이지 ${page} lastDoc 캐시됨: ${lastDoc.id}`);
          }
        }

        // useRef에 캐시 저장
        Object.assign(userLastDocsRef.current, currentUserLastDocs);
      } catch (error) {
        console.error("회원 순차 로드 실패:", error);
      }
    },
    [itemsPerPage]
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
      postLastDocsRef.current = {}; // 탭 변경 시 lastDoc 캐시 초기화
      loadPostTotalCount(postFilter);
      loadPosts(1, postFilter);
    } else {
      setUserCurrentPage(1);
      userLastDocsRef.current = {}; // 탭 변경 시 lastDoc 캐시 초기화
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
    console.log(`🔄 페이지 변경 요청: ${postCurrentPage} → ${newPage}`);
    if (newPage !== postCurrentPage) {
      setPostCurrentPage(newPage);
      const direction = newPage > postCurrentPage ? "next" : "prev";
      console.log(`📄 loadPosts 호출: 페이지 ${newPage}, 방향 ${direction}`);
      loadPosts(newPage, postFilter, direction);
    } else {
      console.log(`⚠️ 같은 페이지 요청으로 무시됨`);
    }
  };

  const handleUserPageChange = (newPage) => {
    console.log(`🔄 회원 페이지 변경 요청: ${userCurrentPage} → ${newPage}`);
    if (newPage !== userCurrentPage) {
      setUserCurrentPage(newPage);
      const direction = newPage > userCurrentPage ? "next" : "prev";
      console.log(`👥 loadUsers 호출: 페이지 ${newPage}, 방향 ${direction}`);
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
