import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { signIn, saveAuthDataToStorage } from "../firebase/auth";

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

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isLoggingIn, setIsLoggingIn] = useState(false);

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
      console.log("Firebase 로그인 시도...");
      const user = await signIn(formData.email, formData.password);

      console.log("로그인 성공:", user);

      // 로컬 스토리지에 토큰과 사용자 정보 저장
      const authData = await saveAuthDataToStorage(user);
      console.log("저장된 인증 데이터:", authData);

      // alert("로그인이 성공적으로 완료되었습니다!");

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
        </LoginFooter>
      </LoginCard>
    </LoginContainer>
  );
};

export default LoginPage;
