import React from "react";
import styled from "styled-components";
import ServiceDetailPage from "../../pages/ServiceDetailPage";

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: ${(props) => props.theme.borderRadius.lg};
  box-shadow: ${(props) => props.theme.shadows.lg};
  max-width: ${(props) => props.width || '98vw'};
  max-height: 96vh;
  width: ${(props) => props.width || '98vw'};
  overflow-y: auto;
  position: relative;
  margin: 10px;
`;

const ModalHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid ${(props) => props.theme.colors.gray[200]};
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  background: white;
  z-index: 1;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  color: ${(props) => props.theme.colors.dark};
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: ${(props) => props.theme.colors.gray[500]};
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${(props) => props.theme.colors.gray[100]};
    color: ${(props) => props.theme.colors.dark};
  }
`;

const ModalBody = styled.div`
  padding: 24px;
`;

const DetailSection = styled.div`
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const DetailTitle = styled.h3`
  font-size: 1.2rem;
  color: ${(props) => props.theme.colors.dark};
  margin-bottom: 16px;
  border-bottom: 2px solid ${(props) => props.theme.colors.primary};
  padding-bottom: 8px;
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const DetailLabel = styled.span`
  font-weight: 600;
  color: ${(props) => props.theme.colors.gray[700]};
  font-size: 0.9rem;
`;

const DetailValue = styled.span`
  color: ${(props) => props.theme.colors.dark};
  font-size: 1rem;
  word-break: break-word;
`;

const FileList = styled.div`
  margin-top: 8px;
`;

const FileItem = styled.div`
  padding: 8px 12px;
  background: ${(props) => props.theme.colors.gray[50]};
  border: 1px solid ${(props) => props.theme.colors.gray[200]};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AdminModals = ({
  modalType,
  selectedItem,
  closeModal,
  formatDate,
  getStatusText,
}) => {
  if (modalType === "post" && selectedItem) {
    return (
      <Modal onClick={closeModal}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <ModalHeader>
            <ModalTitle>서비스 상세 정보</ModalTitle>
            <CloseButton onClick={closeModal}>×</CloseButton>
          </ModalHeader>
          
          {/* ServiceDetailPage를 모달 내부에 렌더링 */}
          <div style={{ overflow: 'hidden' }}>
            <ServiceDetailPage serviceId={selectedItem.id} isModal={true} onClose={closeModal} />
          </div>
        </ModalContent>
      </Modal>
    );
  }

  if (modalType === "user" && selectedItem) {
    return (
      <Modal onClick={closeModal}>
        <ModalContent width="800px" onClick={(e) => e.stopPropagation()}>
          <ModalHeader>
            <ModalTitle>회원 상세 정보</ModalTitle>
            <CloseButton onClick={closeModal}>×</CloseButton>
          </ModalHeader>
          <ModalBody>
            <DetailSection>
              <DetailTitle>기본 정보</DetailTitle>
              <DetailGrid>
                <DetailItem>
                  <DetailLabel>이름</DetailLabel>
                  <DetailValue>{selectedItem.name || "없음"}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>이메일</DetailLabel>
                  <DetailValue>{selectedItem.email || "없음"}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>전화번호</DetailLabel>
                  <DetailValue>{selectedItem.phone || "없음"}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>회원 ID</DetailLabel>
                  <DetailValue>{selectedItem.id || "없음"}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>가입일</DetailLabel>
                  <DetailValue>
                    {formatDate(selectedItem.createdAt)}
                  </DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>수정일</DetailLabel>
                  <DetailValue>
                    {formatDate(selectedItem.updatedAt)}
                  </DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>전화번호 인증</DetailLabel>
                  <DetailValue>
                    {selectedItem.phoneVerified ? "인증됨" : "미인증"}
                  </DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>서류 심사</DetailLabel>
                  <DetailValue>
                    {selectedItem.isDocumentPending ? "대기중" : "완료"}
                  </DetailValue>
                </DetailItem>
              </DetailGrid>
            </DetailSection>

            <DetailSection>
              <DetailTitle>회사 정보</DetailTitle>
              <DetailGrid>
                <DetailItem>
                  <DetailLabel>회사명</DetailLabel>
                  <DetailValue>
                    {selectedItem.companyName || "없음"}
                  </DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>사업자등록번호</DetailLabel>
                  <DetailValue>
                    {selectedItem.businessNumber || "없음"}
                  </DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>대표자명</DetailLabel>
                  <DetailValue>
                    {selectedItem.representative || "없음"}
                  </DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>회사주소</DetailLabel>
                  <DetailValue>
                    {selectedItem.companyAddress || "없음"}
                  </DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>설립일</DetailLabel>
                  <DetailValue>
                    {selectedItem.establishmentDate || "없음"}
                  </DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>업종</DetailLabel>
                  <DetailValue>
                    {selectedItem.businessType || "없음"}
                  </DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>사업분야</DetailLabel>
                  <DetailValue>
                    {selectedItem.businessField || "없음"}
                  </DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>담당자명</DetailLabel>
                  <DetailValue>
                    {selectedItem.managerName || "없음"}
                  </DetailValue>
                </DetailItem>
              </DetailGrid>
            </DetailSection>

            {selectedItem.businessCertificateUrl && (
              <DetailSection>
                <DetailTitle>사업자등록증</DetailTitle>
                <FileList>
                  <FileItem>
                    <span>사업자등록증</span>
                    <a
                      href={selectedItem.businessCertificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#3B82F6", textDecoration: "none" }}
                    >
                      보기
                    </a>
                  </FileItem>
                </FileList>
              </DetailSection>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }

  return null;
};

export default AdminModals;
