import React from "react";
import styled from "styled-components";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { deleteServiceFiles } from "../../firebase/storage";
import NotificationModal from "../common/NotificationModal";
import { deletePdfConversionService } from "../../services/pdfConverter";
import ServiceDetailPage from "../../pages/ServiceDetailPage";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(12px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ModalContent = styled.div`
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 32px 64px -12px rgba(0, 0, 0, 0.3);
  max-width: ${(props) => props.width || "98vw"};
  width: ${(props) => props.width || "98vw"};
  max-height: 96vh;
  overflow-y: auto;
  position: relative;
  margin: 10px;
  animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(20px) scale(0.96);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;

    &:hover {
      background: rgba(0, 0, 0, 0.3);
    }
  }
`;

const ModalHeader = styled.div`
  position: sticky;
  top: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #e2e8f0;
  background: #ffffff;
  z-index: 100;

  h3 {
    margin: 0;
    color: #0f172a;
    font-size: 1.1rem;
    font-weight: 700;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #64748b;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: #f1f5f9;
    color: #0f172a;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const DeleteConfirmContainer = styled.div`
  text-align: center;
  padding: 32px 24px;

  p {
    margin-bottom: 20px;
    font-size: 1.05rem;
    color: #374151;
  }

  .warning {
    color: #ef4444;
    font-size: 0.9rem;
    margin-bottom: 30px;
    font-weight: 600;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
`;

const DeleteActionButton = styled.button`
  padding: 12px 28px;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;

  ${(props) =>
    props.variant === "danger"
      ? `
    background: #ef4444;
    color: white;
    
    &:hover {
      background: #dc2626;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
    }
  `
      : `
    background: #f3f4f6;
    color: #374151;
    
    &:hover {
      background: #e5e7eb;
    }
  `}
`;

const PostModal = ({ modalType, selectedPost, closeModal, onDeleteSuccess }) => {
  const [isHeaderScrolled, setIsHeaderScrolled] = React.useState(false);
  const [notificationModal, setNotificationModal] = React.useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
    onConfirm: null,
    showCancel: false,
  });

  // 키보드 이벤트 핸들링
  React.useEffect(() => {
    if (!modalType || !selectedPost) return;

    const handleKeyPress = (e) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
      document.body.style.overflow = "unset";
    };
  }, [modalType, selectedPost, closeModal]);

  if (!modalType || !selectedPost) return null;

  const handleDeletePost = async (postId) => {
    if (!postId) return;

    try {
      await deleteDoc(doc(db, "services", postId));

      if (selectedPost.userId) {
        try {
          await deleteServiceFiles(`services/${selectedPost.userId}/${postId}`);
        } catch (fileError) {
          console.warn("파일 삭제 중 일부 오류:", fileError);
        }

        try {
          await deletePdfConversionService(postId, selectedPost.userId);
        } catch (pdfError) {
          console.warn("PDF 변환 결과 삭제 중 일부 오류:", pdfError);
        }
      }

      setNotificationModal({
        isOpen: true,
        title: "삭제 완료",
        message: "게시물이 성공적으로 삭제되었습니다.",
        type: "success",
        onConfirm: () => {
          closeModal();
          if (onDeleteSuccess) {
            onDeleteSuccess(selectedPost.id);
          }
        },
        showCancel: false,
      });

      if (onDeleteSuccess) {
        onDeleteSuccess(postId);
      }
    } catch (error) {
      console.error("게시물 삭제 실패:", error);
      setNotificationModal({
        isOpen: true,
        title: "오류 발생",
        message: "게시물 삭제 중 오류가 발생했습니다. 다시 시도해주세요.",
        type: "error",
        onConfirm: null,
        showCancel: false,
      });
    }
  };

  if (modalType === "preview") {
    return (
      <ModalOverlay onClick={closeModal}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <ModalHeader isScrolled={isHeaderScrolled}>
            <h3>서비스 상세 정보</h3>
            <CloseButton onClick={closeModal}>×</CloseButton>
          </ModalHeader>

          {/* ServiceDetailPage를 모달 내부에 렌더링 */}
          <div style={{ overflow: 'hidden' }}>
            <ServiceDetailPage serviceId={selectedPost.id} isModal={true} onClose={closeModal} />
          </div>
        </ModalContent>
      </ModalOverlay>
    );
  }

  if (modalType === "delete") {
    return (
      <>
        <ModalOverlay onClick={closeModal}>
          <ModalContent width="450px" onClick={(e) => e.stopPropagation()}>
            <ModalHeader isScrolled={isHeaderScrolled}>
              <h3>게시물 삭제</h3>
              <CloseButton onClick={closeModal}>×</CloseButton>
            </ModalHeader>
            <DeleteConfirmContainer>
              <p>정말로 "{selectedPost.serviceName}" 게시물을 삭제하시겠습니까?</p>
              <p className="warning">이 작업은 되돌릴 수 없습니다.</p>
              <ButtonGroup>
                <DeleteActionButton onClick={closeModal}>취소</DeleteActionButton>
                <DeleteActionButton variant="danger" onClick={() => handleDeletePost(selectedPost.id)}>
                  삭제
                </DeleteActionButton>
              </ButtonGroup>
            </DeleteConfirmContainer>
          </ModalContent>
        </ModalOverlay>

        <NotificationModal
          isOpen={notificationModal.isOpen}
          onClose={() => setNotificationModal((prev) => ({ ...prev, isOpen: false }))}
          title={notificationModal.title}
          message={notificationModal.message}
          type={notificationModal.type}
          onConfirm={notificationModal.onConfirm}
          showCancel={notificationModal.showCancel}
        />
      </>
    );
  }

  return null;
};

export default PostModal;

