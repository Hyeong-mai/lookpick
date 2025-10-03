import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { IoEyeOutline, IoPencilOutline, IoTrashOutline } from "react-icons/io5";

const SectionTitle = styled.h2`
  margin-bottom: 20px;
  border-bottom: 2px solid ${(props) => props.theme.colors.gray[200]};
  padding-bottom: 10px;
  color: ${(props) => props.theme.colors.dark};
  font-size: 1.5rem;

  @media (max-width: 768px) {
    font-size: 1.3rem;
    margin-bottom: 16px;
  }

  @media (max-width: 480px) {
    font-size: 1.2rem;
    margin-bottom: 12px;
  }
`;

const PostsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
    margin-bottom: 16px;
  }
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
  font-size: 0.95rem;

  &:hover {
    background-color: ${(props) => props.theme.colors.successDark || "#059669"};
  }

  @media (max-width: 768px) {
    padding: 12px 16px;
    width: 100%;
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    padding: 10px 14px;
    font-size: 0.9rem;
  }
`;

const PostCard = styled.div`
  border: 1px solid ${(props) => props.theme.colors.gray[300]};
  border-radius: ${(props) => props.theme.borderRadius.md};
  padding: 20px;
  margin-bottom: 15px;
  transition: all 0.2s ease;

  &:hover {
    border: 1px solid transparent;
    background: linear-gradient(white, white) padding-box,
                ${(props) => props.theme.gradients.primary} border-box;
    box-shadow: ${(props) => props.theme.shadows.sm};
  }

  @media (max-width: 768px) {
    padding: 16px;
    margin-bottom: 12px;
  }

  @media (max-width: 480px) {
    padding: 14px;
    margin-bottom: 10px;
    border-radius: 8px;
  }
`;

const PostHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 15px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
    margin-bottom: 12px;
  }
`;

const PostActions = styled.div`
  display: flex;
  gap: 8px;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-end;
  }

  @media (max-width: 480px) {
    gap: 6px;
  }
`;

const ActionButton = styled.button`
  padding: 8px;
  border: none;
  background: transparent;
  color: ${(props) =>
    props.variant === "danger"
      ? props.theme.colors.danger || "#EF4444"
      : props.variant === "warning"
      ? props.theme.colors.warning || "#F59E0B"
      : props.theme.colors.gray[600]};
  cursor: pointer;
  font-size: 0;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 32px;

  svg {
    font-size: 16px;
    width: 16px;
    height: 16px;
  }

  &:hover {
    opacity: 0.7;
    transform: scale(1.1);
  }

  @media (max-width: 768px) {
    padding: 8px;
    min-width: 32px;
  }

  @media (max-width: 480px) {
    padding: 6px;
    min-width: 32px;
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

  @media (max-width: 768px) {
    gap: 12px;
    flex-wrap: wrap;
  }

  @media (max-width: 480px) {
    gap: 8px;

    span {
      font-size: 0.8rem;
    }
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
  font-size: 0.95rem;

  @media (max-width: 768px) {
    font-size: 0.9rem;
    -webkit-line-clamp: 3;
  }

  @media (max-width: 480px) {
    font-size: 0.85rem;
    line-height: 1.4;
  }
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
`;



const Tag = styled.span`
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  color: #0ea5e9;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid #0ea5e930;
  transition: all 0.2s ease;
  
  &:hover {
    background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
    transform: translateY(-1px);
    box-shadow: 0 2px 8px #0ea5e920;
  }
`;

const PricingInfo = styled.div`
  margin-top: 8px;
  padding: 8px 12px;
  background-color: ${(props) => props.theme.colors.gray[50]};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  border: 1px solid ${(props) => props.theme.colors.gray[200]};
`;

const PricingTitle = styled.div`
  font-size: 0.8rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.gray[700]};
  margin-bottom: 6px;
`;

const PricingOptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const PricingOptionItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 8px;
  background-color: white;
  border-radius: 4px;
  border: 1px solid ${(props) => props.theme.colors.gray[100]};
`;

const PricingOptionName = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
  color: ${(props) => props.theme.colors.dark};
`;

const PricingOptionPrice = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.primary || '#7366FF'};
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

  // 가격 정보 렌더링 함수
  const renderPricingInfo = (post) => {
    // 가격 옵션이 있는 경우
    console.log('Pricing options found:', post.pricingOptions); // 디버깅
    if (post.pricingOptions && post.pricingOptions.length > 0) {
      const validOptions = post.pricingOptions.filter(option => 
        option && option.name && option.name.trim() && option.price && option.price.trim()
      );
      
      if (validOptions.length > 0) {
        return (
          <PricingInfo>
            <PricingTitle>가격 옵션</PricingTitle>
            <PricingOptionsContainer>
              {validOptions.map((option, index) => (
                <PricingOptionItem key={index}>
                  <PricingOptionName>{option.name}</PricingOptionName>
                  <PricingOptionPrice>{option.price}원</PricingOptionPrice>
                </PricingOptionItem>
              ))}
            </PricingOptionsContainer>
          </PricingInfo>
        );
      }
    }
    
    // 기존 단일 가격이 있는 경우 (하위 호환성)
    if (post.price && post.price !== "문의") {
      return (
        <PricingInfo>
          <PricingTitle>가격</PricingTitle>
          <PricingOptionItem>
            <PricingOptionName>기본 가격</PricingOptionName>
            <PricingOptionPrice>{post.price}</PricingOptionPrice>
          </PricingOptionItem>
        </PricingInfo>
      );
    }
    
    // 가격 옵션이 있는 경우
    if (post.pricingOptions && Array.isArray(post.pricingOptions) && post.pricingOptions.length > 0) {
      console.log('Pricing options found:', post.pricingOptions); // 디버깅
      
      return (
        <PricingInfo>
          <PricingTitle>가격 옵션</PricingTitle>
          <PricingOptionsContainer>
            {post.pricingOptions.map((option, index) => (
              <PricingOptionItem key={index}>
                <PricingOptionName>{option.name || '옵션명 없음'}</PricingOptionName>
                <PricingOptionPrice>{option.price || '가격 없음'}원</PricingOptionPrice>
              </PricingOptionItem>
            ))}
          </PricingOptionsContainer>
        </PricingInfo>
      );
    }
    
    // 기존 단일 가격이 있는 경우
    if (post.price && post.price !== "문의" && post.price !== "") {
      return (
        <PricingInfo>
          <PricingTitle>가격</PricingTitle>
          <PricingOptionItem>
            <PricingOptionName>기본 가격</PricingOptionName>
            <PricingOptionPrice>{post.price}</PricingOptionPrice>
          </PricingOptionItem>
        </PricingInfo>
      );
    }
    
    // 가격 정보가 없는 경우
    return (
      <PricingInfo>
        <PricingTitle>가격 정보</PricingTitle>
        <PricingOptionItem>
          <PricingOptionName>문의</PricingOptionName>
          <PricingOptionPrice>문의</PricingOptionPrice>
        </PricingOptionItem>
      </PricingInfo>
    );
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
                  <StatusBadge status={post.status}>
                    {getStatusText(post.status)}
                  </StatusBadge>
                </PostMeta>
              </div>
              <PostActions>
                <ActionButton 
                  onClick={() => openModal("preview", post)}
                  title="미리보기"
                >
                  <IoEyeOutline />
                </ActionButton>
                <ActionButton
                  variant="warning"
                  onClick={() => handleEditPost(post)}
                  title="수정"
                >
                  <IoPencilOutline />
                </ActionButton>
                <ActionButton
                  variant="danger"
                  onClick={() => openModal("delete", post)}
                  title="삭제"
                >
                  <IoTrashOutline />
                </ActionButton>
              </PostActions>
            </PostHeader>

            <PostDescription>{post.serviceDescription}</PostDescription>

            {/* 가격 정보 표시 */}
            {renderPricingInfo(post)}

            {(post.categories?.length > 0 || post.subcategories?.length > 0 || post.tags?.length > 0) && (
              <TagContainer>
                {post.categories?.map((categoryId, index) => {
                  // 카테고리 ID를 카테고리명으로 변환
                  const categoryNames = {
                    software: "개발 / 소프트웨어 / IT",
                    design: "디자인 / 콘텐츠 / 마케팅",
                    logistics: "물류 / 운송 / 창고",
                    manufacturing: "제조 / 생산 / 가공",
                    infrastructure: "설비 / 건설 / 유지보수",
                    education: "교육 / 컨설팅 / 인증",
                    office: "사무 / 문서 / 번역",
                    advertising: "광고 / 프로모션 / 행사",
                    machinery: "기계 / 장비 / 산업재",
                    lifestyle: "생활 / 복지 / 기타 서비스"
                  };
                  
                  const categoryName = categoryNames[categoryId] || categoryId;
                  
                  return (
                    <Tag key={`cat-${index}`}>{categoryName}</Tag>
                  );
                })}
                {post.subcategories?.map((subcategoryKey, index) => {
                  // "categoryId:subcategoryName" 형식에서 서브카테고리명만 추출
                  const subcategoryName = subcategoryKey.includes(':') 
                    ? subcategoryKey.split(':')[1] 
                    : subcategoryKey;
                  
                  return (
                    <Tag 
                      key={`sub-${index}`}
                      style={{
                        background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
                        color: "#16a34a",
                        borderColor: "#16a34a30",
                        fontSize: "0.8rem",
                        padding: "4px 8px"
                      }}
                    >
                      {subcategoryName}
                    </Tag>
                  );
                })}
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
