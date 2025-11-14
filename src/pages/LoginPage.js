import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { signIn, saveAuthDataToStorage, sendPasswordReset } from "../core/firebase/auth";

const LoginContainer = styled.div`
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const LoginCard = styled.div`
  background-color: white;
  padding: 40px;
  border-radius: ${(props) => props.theme.borderRadius.md};
  box-shadow: ${(props) => props.theme.shadows.md};
  width: 100%;
  max-width: 400px;
`;

const LoginTitle = styled.h1`
  text-align: center;
  margin-bottom: 30px;
  color: ${(props) => props.theme.colors.dark};
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;

  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
    color: ${(props) => props.theme.colors.dark};
  }

  input {
    width: 100%;
    padding: 12px;
    border: 1px solid ${(props) => props.theme.colors.gray[200]};
    border-radius: ${(props) => props.theme.borderRadius.sm};
    font-size: 16px;
    transition: all 0.3s ease;

    &:focus {
      border: 1px solid transparent;
      background: linear-gradient(white, white) padding-box,
                  ${(props) => props.theme.gradients.primary} border-box;
      outline: none;
      box-shadow: 0 0 0 3px rgba(115, 102, 255, 0.1);
    }
  }
`;

const LoginButton = styled.button`
  padding: 12px;

  background: ${(props) => props.theme.gradients.primary};

  color: white;
  border: none;
  border-radius: ${(props) => props.theme.borderRadius.sm};
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${(props) => props.theme.colors.primary}dd;
  }

  &:disabled {
    background-color: ${(props) => props.theme.colors.gray[300]};
    cursor: not-allowed;
  }
`;

const LoginFooter = styled.div`
  text-align: center;
  margin-top: 20px;

  a {
    background: ${(props) => props.theme.gradients.primary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const FindAccountLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 15px;
  font-size: 14px;

  button {
    background: none;
    border: none;
    color: ${(props) => props.theme.colors.gray[600]};
    cursor: pointer;
    padding: 0;
    font-size: 14px;
    text-decoration: none;

    &:hover {
      color: ${(props) => props.theme.colors.primary};
      text-decoration: underline;
    }
  }

  span {
    color: ${(props) => props.theme.colors.gray[400]};
  }
`;

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
  background-color: white;
  padding: 30px;
  border-radius: ${(props) => props.theme.borderRadius.md};
  box-shadow: ${(props) => props.theme.shadows.lg};
  width: 90%;
  max-width: 400px;
  position: relative;
`;

const ModalTitle = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  color: ${(props) => props.theme.colors.dark};
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: ${(props) => props.theme.colors.gray[600]};
  line-height: 1;

  &:hover {
    color: ${(props) => props.theme.colors.dark};
  }
`;

const ModalForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ModalButton = styled.button`
  padding: 12px;
  background: ${(props) => props.theme.gradients.primary};
  color: white;
  border: none;
  border-radius: ${(props) => props.theme.borderRadius.sm};
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${(props) => props.theme.colors.primary}dd;
  }

  &:disabled {
    background-color: ${(props) => props.theme.colors.gray[300]};
    cursor: not-allowed;
  }
`;

const SuccessMessage = styled.div`
  padding: 15px;
  background-color: rgba(34, 197, 94, 0.1);
  border: 1px solid #22c55e;
  border-radius: ${(props) => props.theme.borderRadius.sm};
  color: #16a34a;
  text-align: center;
  margin-top: 10px;
  font-size: 14px;
  line-height: 1.5;
`;

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showFindModal, setShowFindModal] = useState(false);
  const [findEmail, setFindEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoggingIn(true);

    try {
      const user = await signIn(formData.email, formData.password);

      // 로컬 스토리지에 토큰과 사용자 정보 저장
      await saveAuthDataToStorage(user);

      // 메인 페이지로 이동
      navigate("/");
    } catch (error) {
      console.error("로그인 실패:", error);

      // Firebase 에러 메시지 한국어 변환
      let errorMessage = "로그인 중 오류가 발생했습니다.";

      if (error.code === "auth/user-not-found") {
        errorMessage = "등록되지 않은 이메일 주소입니다.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "비밀번호가 올바르지 않습니다.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "유효하지 않은 이메일 주소입니다.";
      } else if (error.code === "auth/user-disabled") {
        errorMessage = "비활성화된 계정입니다.";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage =
          "너무 많은 로그인 시도가 있었습니다. 잠시 후 다시 시도해주세요.";
      } else if (error.code === "auth/invalid-credential") {
        errorMessage = "이메일 또는 비밀번호가 올바르지 않습니다.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      alert(errorMessage);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleOpenResetModal = () => {
    setShowFindModal(true);
    setFindEmail("");
    setSuccessMessage("");
  };

  const handleCloseModal = () => {
    setShowFindModal(false);
    setFindEmail("");
    setSuccessMessage("");
  };

  const handleFindSubmit = async (e) => {
    e.preventDefault();

    if (!findEmail) {
      alert("이메일을 입력해주세요.");
      return;
    }

    setIsSending(true);
    setSuccessMessage("");

    try {
      await sendPasswordReset(findEmail);
      setSuccessMessage(
        "입력하신 이메일 주소로 비밀번호 재설정 링크를 전송했습니다. 메인/정크(스팸)함도 함께 확인해주세요."
      );
    } catch (error) {
      console.error("이메일 전송 실패:", error);

      let errorMessage = "이메일 전송 중 오류가 발생했습니다.";

      if (error.code === "auth/user-not-found") {
        errorMessage = "등록되지 않은 이메일 주소입니다.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "유효하지 않은 이메일 주소입니다.";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage =
          "너무 많은 요청이 있었습니다. 잠시 후 다시 시도해주세요.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      alert(errorMessage);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <LoginTitle>로그인</LoginTitle>

        <LoginForm onSubmit={handleSubmit}>
          <FormGroup>
            <label>이메일</label>
            <input
              type="email"
              name="email"
              placeholder="이메일을 입력하세요"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <label>비밀번호</label>
            <input
              type="password"
              name="password"
              placeholder="비밀번호를 입력하세요"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </FormGroup>

          <LoginButton
            type="submit"
            disabled={isLoggingIn || !formData.email || !formData.password}
          >
            {isLoggingIn ? "로그인 중..." : "로그인"}
          </LoginButton>
        </LoginForm>

        <LoginFooter>
          <p>
            아직 계정이 없으신가요? <Link to="/signup">회원가입</Link>
          </p>
          <FindAccountLinks>
            <button type="button" onClick={handleOpenResetModal}>
              비밀번호 찾기
            </button>
          </FindAccountLinks>
        </LoginFooter>
      </LoginCard>

      {showFindModal && (
        <ModalOverlay onClick={handleCloseModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={handleCloseModal}>&times;</CloseButton>
            <ModalTitle>비밀번호 찾기</ModalTitle>
            {successMessage ? (
              <SuccessMessage>{successMessage}</SuccessMessage>
            ) : (
              <ModalForm onSubmit={handleFindSubmit}>
                <FormGroup>
                  <label>이메일</label>
                  <input
                    type="email"
                    placeholder="이메일을 입력하세요"
                    value={findEmail}
                    onChange={(e) => setFindEmail(e.target.value)}
                    required
                  />
                </FormGroup>
                <ModalButton type="submit" disabled={isSending || !findEmail}>
                  {isSending ? "전송 중..." : "전송"}
                </ModalButton>
              </ModalForm>
            )}
          </ModalContent>
        </ModalOverlay>
      )}
    </LoginContainer>
  );
};

export default LoginPage;
