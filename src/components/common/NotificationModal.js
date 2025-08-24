import React from "react";
import styled from "styled-components";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.4) 0%,
    rgba(0, 0, 0, 0.6) 100%
  );
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;

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
  background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.8);
  max-width: 500px;
  width: 90vw;
  position: relative;
  margin: 20px;
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  border-bottom: 1px solid #e5e7eb;
  background: linear-gradient(
    135deg,
    #f8fafc 0%,
    #f1f5f9 100%
  );
  border-radius: 16px 16px 0 0;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      ${(props) => props.theme.gradients.primary}40 50%,
      transparent 100%
    );
  }

  h3 {
    margin: 0;
    background: ${(props) => props.theme.gradients.primary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-size: 1.3rem;
    font-weight: 700;
  }
`;

const CloseButton = styled.button`
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid #d1d5db;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
  padding: 8px;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
    transform: rotate(90deg) scale(1.1);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const ModalBody = styled.div`
  padding: 32px;
  text-align: center;
`;

const Message = styled.div`
  font-size: 1.1rem;
  color: #374151;
  line-height: 1.6;
  margin-bottom: 24px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const ActionButton = styled.button`
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  min-width: 100px;

  ${(props) =>
    props.variant === "primary"
      ? `
    background: ${props.theme.gradients.primary};
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(73, 126, 233, 0.3);
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

const NotificationModal = ({
  isOpen,
  onClose,
  title = "알림",
  message,
  type = "info", // 'info', 'success', 'warning', 'error'
  onConfirm,
  confirmText = "확인",
  cancelText = "취소",
  showCancel = false,
}) => {
  const handleConfirm = React.useCallback(() => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  }, [onConfirm, onClose]);

  const handleClose = React.useCallback(() => {
    onClose();
  }, [onClose]);

  // 키보드 이벤트 핸들링
  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyPress = (e) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "Enter" && onConfirm) {
        handleConfirm();
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, onConfirm, handleConfirm]);

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <h3>{title}</h3>
          <CloseButton onClick={handleClose}>×</CloseButton>
        </ModalHeader>
        <ModalBody>
          <Message>{message}</Message>
          <ButtonContainer>
            {showCancel && (
              <ActionButton onClick={handleClose}>
                {cancelText}
              </ActionButton>
            )}
            <ActionButton variant="primary" onClick={handleConfirm}>
              {confirmText}
            </ActionButton>
          </ButtonContainer>
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};

export default NotificationModal;
