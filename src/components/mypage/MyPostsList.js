import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const SectionTitle = styled.h2`
  margin-bottom: 20px;
  border-bottom: 2px solid ${(props) => props.theme.colors.gray[200]};
  padding-bottom: 10px;
  color: ${(props) => props.theme.colors.dark};
`;

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
  font-weight: 500;
`;

const StatusBadge = styled.span`
  padding: 4px 8px;
  border-radius: ${(props) => props.theme.borderRadius.sm};
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;

  ${(props) => {
    switch (props.status) {
      case "pending":
        return `
          background-color: #FEF3C7;
          color: #92400E;
        `;
      case "approved":
        return `
          background-color: #D1FAE5;
          color: #065F46;
        `;
      case "rejected":
        return `
          background-color: #FEE2E2;
          color: #991B1B;
        `;
      default:
        return `
          background-color: ${props.theme.colors.gray[200]};
          color: ${props.theme.colors.gray[600]};
        `;
    }
  }}
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: ${(props) => props.theme.colors.gray[600]};

  h3 {
    margin-bottom: 10px;
  }

  p {
    margin: 0;
    font-size: 0.9rem;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: ${(props) => props.theme.colors.gray[600]};
`;

const MyPostsList = ({ posts, isLoadingPosts, openModal, getStatusText }) => {
  const navigate = useNavigate();

  const handleAddPost = () => {
    navigate("/service-register");
  };

  const handleEditPost = (post) => {
    navigate(`/service-edit/${post.id}`);
  };

  return (
    <>
      <SectionTitle>게시물 관리</SectionTitle>
      <PostsHeader>
        <h3>내 게시물 ({posts.length}개)</h3>
        <AddPostButton onClick={handleAddPost}>새 게시물 작성</AddPostButton>
      </PostsHeader>

      {isLoadingPosts ? (
        <LoadingMessage>게시물을 불러오는 중...</LoadingMessage>
      ) : posts.length === 0 ? (
        <EmptyMessage>
          <h3>등록된 게시물이 없습니다</h3>
          <p>새로운 서비스를 등록해보세요!</p>
        </EmptyMessage>
      ) : (
        posts.map((post) => (
          <PostCard key={post.id}>
            <PostHeader>
              <div>
                <h4>{post.serviceName}</h4>
                <PostMeta>
                  <span>등록일: {post.createdAt}</span>
                  <span>조회수: {post.views}</span>
                  <span>가격: {post.price || "문의"}</span>
                  <StatusBadge status={post.status}>
                    {getStatusText(post.status)}
                  </StatusBadge>
                </PostMeta>
              </div>
              <PostActions>
                <ActionButton onClick={() => openModal("preview", post)}>
                  미리보기
                </ActionButton>
                <ActionButton
                  variant="warning"
                  onClick={() => handleEditPost(post)}
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

            <PostDescription>{post.serviceDescription}</PostDescription>

            {(post.categories?.length > 0 || post.tags?.length > 0) && (
              <TagContainer>
                {post.categories?.map((category, index) => (
                  <Tag key={`cat-${index}`}>{category}</Tag>
                ))}
                {post.tags?.map((tag, index) => (
                  <Tag key={`tag-${index}`}>#{tag}</Tag>
                ))}
              </TagContainer>
            )}
          </PostCard>
        ))
      )}
    </>
  );
};

export default MyPostsList;
