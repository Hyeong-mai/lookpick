import React from "react";
import styled from "styled-components";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { deleteServiceFiles } from "../../firebase/storage";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: ${(props) => props.theme.borderRadius.lg};
  box-shadow: ${(props) => props.theme.shadows.lg};
  max-width: ${(props) => props.width || "80vw"};
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  margin: 20px;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid ${(props) => props.theme.colors.gray[200]};
  background-color: ${(props) => props.theme.colors.gray[50]};

  h3 {
    margin: 0;
    color: ${(props) => props.theme.colors.dark};
    font-size: 1.25rem;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${(props) => props.theme.colors.gray[600]};
  padding: 5px;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${(props) => props.theme.colors.gray[200]};
  }
`;

const ModalBody = styled.div`
  padding: 20px;
`;

const PreviewCard = styled.div`
  padding: 20px;
  border: 1px solid ${(props) => props.theme.colors.gray[300]};
  border-radius: ${(props) => props.theme.borderRadius.md};
  background-color: white;
`;

const PreviewTitle = styled.h2`
  color: ${(props) => props.theme.colors.dark};
  margin-bottom: 15px;
`;

const PreviewMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid ${(props) => props.theme.colors.gray[200]};

  span {
    font-size: 0.9rem;
    color: ${(props) => props.theme.colors.gray[600]};
  }
`;

const PreviewDescription = styled.div`
  line-height: 1.6;
  color: ${(props) => props.theme.colors.gray[700]};
  margin-bottom: 20px;
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 15px;
`;

const Tag = styled.span`
  background-color: ${(props) => props.theme.colors.primary}20;
  color: ${(props) => props.theme.colors.primary};
  padding: 4px 8px;
  border-radius: ${(props) => props.theme.borderRadius.sm};
  font-size: 0.8rem;
  font-weight: 500;
`;

const FilesContainer = styled.div`
  margin-top: 15px;
`;

const FileItem = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid ${(props) => props.theme.colors.gray[100]};

  &:last-child {
    border-bottom: none;
  }
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

const DeleteConfirmContainer = styled.div`
  text-align: center;
  padding: 20px 0;

  p {
    margin-bottom: 20px;
    font-size: 1.1rem;
  }

  .warning {
    color: #ef4444;
    font-size: 0.9rem;
    margin-bottom: 30px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
`;

const PostModal = ({
  modalType,
  selectedPost,
  closeModal,
  onDeleteSuccess,
}) => {
  if (!modalType || !selectedPost) return null;

  const handleDeletePost = async (postId) => {
    if (!postId) return;

    try {
      console.log("게시물 삭제 시도:", postId);

      // Firestore에서 게시물 삭제
      await deleteDoc(doc(db, "services", postId));

      // Storage에서 파일들도 삭제 (userId 필요)
      if (selectedPost.userId) {
        try {
          await deleteServiceFiles(`services/${selectedPost.userId}/${postId}`);
          console.log("관련 파일들도 삭제됨");
        } catch (fileError) {
          console.warn("파일 삭제 중 일부 오류:", fileError);
        }
      }

      alert("게시물이 성공적으로 삭제되었습니다.");
      closeModal();

      // 부모 컴포넌트에 삭제 완료 알림
      if (onDeleteSuccess) {
        onDeleteSuccess(postId);
      }
    } catch (error) {
      console.error("게시물 삭제 실패:", error);
      alert("게시물 삭제 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  if (modalType === "preview") {
    return (
      <ModalOverlay onClick={closeModal}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <ModalHeader>
            <h3>게시물 미리보기</h3>
            <CloseButton onClick={closeModal}>×</CloseButton>
          </ModalHeader>
          <ModalBody>
            <PreviewCard>
              <PreviewTitle>{selectedPost.serviceName}</PreviewTitle>
              <PreviewMeta>
                <span>📅 등록일: {selectedPost.createdAt}</span>
                <span>👁️ 조회수: {selectedPost.views}회</span>
                <span>💰 가격: {selectedPost.price || "문의"}</span>
                <span>📍 지역: {selectedPost.serviceRegion}</span>
                {selectedPost.companyWebsite && (
                  <span>🌐 웹사이트: {selectedPost.companyWebsite}</span>
                )}
              </PreviewMeta>

              {selectedPost.categories?.length > 0 && (
                <div style={{ marginBottom: "15px" }}>
                  <strong>카테고리:</strong>
                  <TagContainer>
                    {selectedPost.categories.map((category, index) => (
                      <Tag key={index}>{category}</Tag>
                    ))}
                  </TagContainer>
                </div>
              )}

              {selectedPost.tags?.length > 0 && (
                <div style={{ marginBottom: "15px" }}>
                  <strong>태그:</strong>
                  <TagContainer>
                    {selectedPost.tags.map((tag, index) => (
                      <Tag key={index}>#{tag}</Tag>
                    ))}
                  </TagContainer>
                </div>
              )}

              <PreviewDescription>
                <strong>서비스 설명:</strong>
                <div style={{ marginTop: "8px" }}>
                  {selectedPost.serviceDescription}
                </div>
              </PreviewDescription>

              {selectedPost.freePostContent && (
                <PreviewDescription>
                  <strong>추가 내용:</strong>
                  <div style={{ marginTop: "8px" }}>
                    {selectedPost.freePostContent}
                  </div>
                </PreviewDescription>
              )}

              {selectedPost.files?.length > 0 && (
                <FilesContainer>
                  <strong>첨부 파일 ({selectedPost.files.length}개):</strong>
                  {selectedPost.files.map((file, index) => (
                    <FileItem key={index}>
                      📎 {file.name || `파일 ${index + 1}`}
                    </FileItem>
                  ))}
                </FilesContainer>
              )}
            </PreviewCard>
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    );
  }

  if (modalType === "delete") {
    return (
      <ModalOverlay onClick={closeModal}>
        <ModalContent width="400px" onClick={(e) => e.stopPropagation()}>
          <ModalHeader>
            <h3>게시물 삭제</h3>
            <CloseButton onClick={closeModal}>×</CloseButton>
          </ModalHeader>
          <DeleteConfirmContainer>
            <p>
              정말로 "{selectedPost.serviceName}" 게시물을 삭제하시겠습니까?
            </p>
            <p className="warning">이 작업은 되돌릴 수 없습니다.</p>
            <ButtonGroup>
              <ActionButton onClick={closeModal}>취소</ActionButton>
              <ActionButton
                variant="danger"
                onClick={() => handleDeletePost(selectedPost.id)}
              >
                삭제
              </ActionButton>
            </ButtonGroup>
          </DeleteConfirmContainer>
        </ModalContent>
      </ModalOverlay>
    );
  }

  return null;
};

export default PostModal;
